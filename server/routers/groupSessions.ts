import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { groupSessions, groupSessionParticipants } from "../../drizzle/group-sessions-schema";
import { sessions } from "../../drizzle/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";
import { dailyVideoService } from "../services/dailyVideoService";

export const groupSessionsRouter = router({
  // List upcoming group sessions (public-facing for learners)
  listUpcoming: protectedProcedure.query(async () => {
    const enabled = await featureFlagService.isEnabled("GROUP_SESSIONS_ENABLED");
    if (!enabled) return [];
    const db = await getDb();
    return db.select().from(groupSessions)
      .where(and(
        eq(groupSessions.isPublic, true),
        gte(groupSessions.registrationDeadline, new Date())
      ))
      .orderBy(desc(groupSessions.createdAt))
      .limit(50);
  }),

  // Get group session details
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [gs] = await db.select().from(groupSessions).where(eq(groupSessions.id, input.id)).limit(1);
      if (!gs) throw new Error("Group session not found");
      const participants = await db.select().from(groupSessionParticipants)
        .where(eq(groupSessionParticipants.groupSessionId, input.id));
      return { ...gs, participants };
    }),

  // Admin: Create group session (with optional Daily.co room)
  create: adminProcedure
    .input(z.object({
      sessionId: z.number(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      maxParticipants: z.number().min(2).max(100).default(10),
      pricePerParticipant: z.number().min(0),
      groupType: z.enum(["workshop", "study_group", "mock_exam", "conversation_circle"]).default("workshop"),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).default("all_levels"),
      language: z.enum(["en", "fr", "bilingual"]).default("bilingual"),
      isRecurring: z.boolean().default(false),
      recurrencePattern: z.enum(["weekly", "biweekly", "monthly"]).optional(),
      registrationDeadline: z.string().optional(),
      isPublic: z.boolean().default(true),
      enableVideo: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const { enableVideo, ...sessionData } = input;

      const result = await db.insert(groupSessions).values({
        ...sessionData,
        registrationDeadline: sessionData.registrationDeadline ? new Date(sessionData.registrationDeadline) : null,
      });

      const insertedId = result[0].insertId;

      // Create Daily.co video room if requested and configured
      let videoRoomUrl: string | null = null;
      if (enableVideo && dailyVideoService.isConfigured()) {
        try {
          const room = await dailyVideoService.createRoom(insertedId, {
            maxParticipants: input.maxParticipants,
            enableChat: true,
            enableScreenshare: true,
          });
          videoRoomUrl = room.url;
          // Store the video room URL in the group session
          await db.update(groupSessions)
            .set({ videoRoomUrl: room.url })
            .where(eq(groupSessions.id, Number(insertedId)));
        } catch (error) {
          // Video room creation failed — session still created, video can be added later
          console.warn("Failed to create Daily.co room:", error);
        }
      }

      return { id: insertedId, success: true, videoRoomUrl };
    }),

  // Admin: Update group session
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      maxParticipants: z.number().optional(),
      pricePerParticipant: z.number().optional(),
      groupType: z.enum(["workshop", "study_group", "mock_exam", "conversation_circle"]).optional(),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).optional(),
      isPublic: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const db = await getDb();
      await db.update(groupSessions).set(updates).where(eq(groupSessions.id, id));
      return { success: true };
    }),

  // Admin: Delete group session (also cleans up Daily.co room)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      // Clean up Daily.co room
      try {
        await dailyVideoService.deleteRoom(input.id);
      } catch {
        // Non-critical — room might not exist
      }
      await db.delete(groupSessionParticipants).where(eq(groupSessionParticipants.groupSessionId, input.id));
      await db.delete(groupSessions).where(eq(groupSessions.id, input.id));
      return { success: true };
    }),

  // Admin: List all group sessions
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(groupSessions).orderBy(desc(groupSessions.createdAt)).limit(100);
  }),

  // ═══ Daily.co Video Integration (Phase 10.1) ═══

  // Create or get video room for a group session
  createVideoRoom: adminProcedure
    .input(z.object({
      groupSessionId: z.number(),
      maxParticipants: z.number().min(2).max(100).default(20),
    }))
    .mutation(async ({ input }) => {
      if (!dailyVideoService.isConfigured()) {
        throw new Error("Daily.co is not configured. Please set DAILY_API_KEY environment variable.");
      }

      const db = await getDb();
      const [gs] = await db.select().from(groupSessions).where(eq(groupSessions.id, input.groupSessionId)).limit(1);
      if (!gs) throw new Error("Group session not found");

      const room = await dailyVideoService.createRoom(input.groupSessionId, {
        maxParticipants: input.maxParticipants,
        enableChat: true,
        enableScreenshare: true,
      });

      // Store the video room URL
      await db.update(groupSessions)
        .set({ videoRoomUrl: room.url })
        .where(eq(groupSessions.id, input.groupSessionId));

      return { url: room.url, roomName: room.roomName, success: true };
    }),

  // Get video token for joining a session
  getVideoToken: protectedProcedure
    .input(z.object({
      groupSessionId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      if (!dailyVideoService.isConfigured()) {
        return { available: false, reason: "Video not configured" };
      }

      const db = await getDb();
      const [gs] = await db.select().from(groupSessions).where(eq(groupSessions.id, input.groupSessionId)).limit(1);
      if (!gs) throw new Error("Group session not found");
      if (!gs.videoRoomUrl) {
        return { available: false, reason: "No video room for this session" };
      }

      const roomName = `group-session-${input.groupSessionId}`;
      const user = ctx as any;
      const isAdmin = user?.role === "admin" || user?.role === "owner" || (user as any)?.isOwner || user?.role === "coach";

      const token = await dailyVideoService.createToken(roomName, {
        isOwner: isAdmin,
        userName: user?.name || user?.email || "Participant",
        userId: String(user?.userId || user?.id || ""),
      });

      return {
        available: true,
        roomUrl: gs.videoRoomUrl,
        token,
        roomName,
      };
    }),

  // Delete video room for a session
  deleteVideoRoom: adminProcedure
    .input(z.object({ groupSessionId: z.number() }))
    .mutation(async ({ input }) => {
      await dailyVideoService.deleteRoom(input.groupSessionId);
      const db = await getDb();
      await db.update(groupSessions)
        .set({ videoRoomUrl: null })
        .where(eq(groupSessions.id, input.groupSessionId));
      return { success: true };
    }),

  // Get video room presence (who's currently in the call)
  getVideoPresence: protectedProcedure
    .input(z.object({ groupSessionId: z.number() }))
    .query(async ({ input }) => {
      const roomName = `group-session-${input.groupSessionId}`;
      const presence = await dailyVideoService.getRoomPresence(roomName);
      return presence;
    }),

  // ═══ Learner Endpoints ═══

  // Learner: Register for group session
  register: protectedProcedure
    .input(z.object({ groupSessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const [gs] = await db.select().from(groupSessions).where(eq(groupSessions.id, input.groupSessionId)).limit(1);
      if (!gs) throw new Error("Group session not found");
      if (gs.currentParticipants >= gs.maxParticipants) throw new Error("Group session is full");
      
      const result = await db.insert(groupSessionParticipants).values({
        groupSessionId: input.groupSessionId,
        learnerId: (ctx as any).userId || 0,
      });
      
      await db.update(groupSessions)
        .set({ currentParticipants: sql`${groupSessions.currentParticipants} + 1` })
        .where(eq(groupSessions.id, input.groupSessionId));
      
      return { id: result[0].insertId, success: true };
    }),

  // Learner: Cancel registration
  cancelRegistration: protectedProcedure
    .input(z.object({ participantId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [participant] = await db.select().from(groupSessionParticipants)
        .where(eq(groupSessionParticipants.id, input.participantId)).limit(1);
      if (!participant) throw new Error("Registration not found");
      
      await db.update(groupSessionParticipants)
        .set({ status: "cancelled", cancelledAt: new Date() })
        .where(eq(groupSessionParticipants.id, input.participantId));
      
      await db.update(groupSessions)
        .set({ currentParticipants: sql`${groupSessions.currentParticipants} - 1` })
        .where(eq(groupSessions.id, participant.groupSessionId));
      
      return { success: true };
    }),

  // Learner: Submit feedback
  submitFeedback: protectedProcedure
    .input(z.object({
      participantId: z.number(),
      rating: z.number().min(1).max(5),
      feedback: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(groupSessionParticipants)
        .set({ rating: input.rating, feedback: input.feedback })
        .where(eq(groupSessionParticipants.id, input.participantId));
      return { success: true };
    }),
});
