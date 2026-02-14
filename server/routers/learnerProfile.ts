import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { getDb, getLearnerByUserId, getUserById } from "../db";
import { coachProfiles, learnerProfiles, sessions, users } from "../../drizzle/schema";

export const learnerProfileRouter = router({
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return await getLearnerByUserId(ctx.user.id);
  }),

  // Create learner profile,

  getProgressReport: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
    }
    
    const user = await getUserById(ctx.user.id);
    
    // Get date range for the past week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get coach sessions completed in the past week
    const coachSessionsResult = await db.select({
      count: sql<number>`COUNT(*)`,
      totalMinutes: sql<number>`COALESCE(SUM(${sessions.duration}), 0)`,
    })
      .from(sessions)
      .where(sql`${sessions.learnerId} = ${learner.id} 
        AND ${sessions.status} = 'completed' 
        AND ${sessions.completedAt} >= ${weekAgo}`);
    
    const coachSessionsCompleted = Number(coachSessionsResult[0]?.count || 0);
    const coachMinutes = Number(coachSessionsResult[0]?.totalMinutes || 0);
    
    // Get scheduled sessions
    const scheduledResult = await db.select({
      count: sql<number>`COUNT(*)`,
    })
      .from(sessions)
      .where(sql`${sessions.learnerId} = ${learner.id} 
        AND ${sessions.status} IN ('pending', 'confirmed') 
        AND ${sessions.scheduledAt} >= ${now}`);
    
    const coachSessionsScheduled = Number(scheduledResult[0]?.count || 0);
    
    // Get AI sessions from the past week
    const { aiSessions: aiSessionsTable } = await import("../../drizzle/schema");
    const aiSessionsResult = await db.select({
      sessionType: aiSessionsTable.sessionType,
      count: sql<number>`COUNT(*)`,
      totalMinutes: sql<number>`COALESCE(SUM(${aiSessionsTable.duration}), 0)`,
    })
      .from(aiSessionsTable)
      .where(sql`${aiSessionsTable.learnerId} = ${learner.id} 
        AND ${aiSessionsTable.status} = 'completed' 
        AND ${aiSessionsTable.createdAt} >= ${weekAgo}`)
      .groupBy(aiSessionsTable.sessionType);
    
    const aiBreakdown = {
      practice: 0,
      placement: 0,
      simulation: 0,
    };
    let aiMinutes = 0;
    let totalAiSessions = 0;
    
    for (const row of aiSessionsResult) {
      const count = Number(row.count || 0);
      const minutes = Number(row.totalMinutes || 0) / 60; // Convert seconds to minutes
      totalAiSessions += count;
      aiMinutes += minutes;
      if (row.sessionType === "practice") aiBreakdown.practice = count;
      else if (row.sessionType === "placement") aiBreakdown.placement = count;
      else if (row.sessionType === "simulation") aiBreakdown.simulation = count;
    }
    
    // Parse current and target levels
    const currentLevels = (learner.currentLevel as { oral?: string; written?: string; reading?: string }) || {};
    const targetLevels = (learner.targetLevel as { oral?: string; written?: string; reading?: string }) || {};
    
    return {
      learnerName: user?.name || "Learner",
      learnerEmail: user?.email || "",
      language: (user?.preferredLanguage || "en") as "en" | "fr",
      weekStartDate: weekAgo.toISOString(),
      weekEndDate: now.toISOString(),
      coachSessionsCompleted,
      coachSessionsScheduled,
      aiSessionsCompleted: totalAiSessions,
      totalPracticeMinutes: Math.round(coachMinutes + aiMinutes),
      currentLevels,
      targetLevels,
      aiSessionBreakdown: aiBreakdown,
    };
  }),

  // Update weekly report preferences,

  updateReportPreferences: protectedProcedure
    .input(
      z.object({
        weeklyReportEnabled: z.boolean(),
        weeklyReportDay: z.number().min(0).max(1), // 0=Sunday, 1=Monday
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      await db.update(learnerProfiles)
        .set({
          weeklyReportEnabled: input.weeklyReportEnabled,
          weeklyReportDay: input.weeklyReportDay,
        })
        .where(eq(learnerProfiles.id, learner.id));
      
      return { success: true };
    }),

  // Get report preferences,

  getReportPreferences: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
    }
    
    return {
      weeklyReportEnabled: learner.weeklyReportEnabled ?? true,
      weeklyReportDay: learner.weeklyReportDay ?? 0,
    };
  }),

  // Send progress report email,

  sendProgressReport: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
    }
    
    const user = await getUserById(ctx.user.id);
    if (!user?.email) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No email address on file" });
    }
    
    // Import email functions
    const { sendLearnerProgressReport, generateProgressReportData } = await import("../email");
    
    // Get date range for the past week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get coach sessions
    const coachSessionsResult = await db.select({
      count: sql<number>`COUNT(*)`,
      totalMinutes: sql<number>`COALESCE(SUM(${sessions.duration}), 0)`,
    })
      .from(sessions)
      .where(sql`${sessions.learnerId} = ${learner.id} 
        AND ${sessions.status} = 'completed' 
        AND ${sessions.completedAt} >= ${weekAgo}`);
    
    const coachSessionsCompleted = Number(coachSessionsResult[0]?.count || 0);
    const coachMinutes = Number(coachSessionsResult[0]?.totalMinutes || 0);
    
    // Get scheduled sessions
    const scheduledResult = await db.select({
      count: sql<number>`COUNT(*)`,
    })
      .from(sessions)
      .where(sql`${sessions.learnerId} = ${learner.id} 
        AND ${sessions.status} IN ('pending', 'confirmed') 
        AND ${sessions.scheduledAt} >= ${now}`);
    
    const coachSessionsScheduled = Number(scheduledResult[0]?.count || 0);
    
    // Get AI sessions
    const { aiSessions: aiSessionsTable } = await import("../../drizzle/schema");
    const aiSessionsResult = await db.select({
      sessionType: aiSessionsTable.sessionType,
      count: sql<number>`COUNT(*)`,
      totalMinutes: sql<number>`COALESCE(SUM(${aiSessionsTable.duration}), 0)`,
    })
      .from(aiSessionsTable)
      .where(sql`${aiSessionsTable.learnerId} = ${learner.id} 
        AND ${aiSessionsTable.status} = 'completed' 
        AND ${aiSessionsTable.createdAt} >= ${weekAgo}`)
      .groupBy(aiSessionsTable.sessionType);
    
    const aiBreakdown = { practice: 0, placement: 0, simulation: 0 };
    let aiMinutes = 0;
    let totalAiSessions = 0;
    
    for (const row of aiSessionsResult) {
      const count = Number(row.count || 0);
      const minutes = Number(row.totalMinutes || 0) / 60;
      totalAiSessions += count;
      aiMinutes += minutes;
      if (row.sessionType === "practice") aiBreakdown.practice = count;
      else if (row.sessionType === "placement") aiBreakdown.placement = count;
      else if (row.sessionType === "simulation") aiBreakdown.simulation = count;
    }
    
    const currentLevels = (learner.currentLevel as { oral?: string; written?: string; reading?: string }) || {};
    const targetLevels = (learner.targetLevel as { oral?: string; written?: string; reading?: string }) || {};
    
    const reportData = generateProgressReportData({
      learnerId: learner.id,
      learnerName: user.name || "Learner",
      learnerEmail: user.email,
      language: (user.preferredLanguage || "en") as "en" | "fr",
      currentLevels,
      targetLevels,
      coachSessionsCompleted,
      coachSessionsScheduled,
      aiSessionsCompleted: totalAiSessions,
      aiSessionBreakdown: aiBreakdown,
      totalPracticeMinutes: Math.round(coachMinutes + aiMinutes),
    });
    
    const sent = await sendLearnerProgressReport(reportData);
    
    return { success: sent };
  }),

  // Get learner's favorite coaches,

  favorites: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const favorites = await db.select({
      id: learnerFavorites.id,
      coachId: learnerFavorites.coachId,
      note: learnerFavorites.note,
      createdAt: learnerFavorites.createdAt,
      coach: {
        id: coachProfiles.id,
        slug: coachProfiles.slug,
        photoUrl: coachProfiles.photoUrl,
        headline: coachProfiles.headline,
        headlineFr: coachProfiles.headlineFr,
        hourlyRate: coachProfiles.hourlyRate,
      },
      coachUser: {
        name: users.name,
      },
    })
      .from(learnerFavorites)
      .leftJoin(coachProfiles, eq(learnerFavorites.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(eq(learnerFavorites.learnerId, learner.id))
      .orderBy(desc(learnerFavorites.createdAt));
    
    return favorites.map(f => ({
      ...f,
      coach: {
        ...f.coach,
        name: f.coachUser?.name || "Coach",
      },
    }));
  }),

  // Add coach to favorites,

  addFavorite: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      // Check if already favorited
      const [existing] = await db.select()
        .from(learnerFavorites)
        .where(and(
          eq(learnerFavorites.learnerId, learner.id),
          eq(learnerFavorites.coachId, input.coachId)
        ));
      
      if (existing) {
        return { success: true, alreadyFavorited: true };
      }
      
      await db.insert(learnerFavorites).values({
        learnerId: learner.id,
        coachId: input.coachId,
      });
      
      return { success: true };
    }),

  // Remove coach from favorites,

  removeFavorite: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      await db.delete(learnerFavorites)
        .where(and(
          eq(learnerFavorites.learnerId, learner.id),
          eq(learnerFavorites.coachId, input.coachId)
        ));
      
      return { success: true };
    }),

  // Check if coach is favorited,

  isFavorited: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return false;
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) return false;
      
      const [favorite] = await db.select()
        .from(learnerFavorites)
        .where(and(
          eq(learnerFavorites.learnerId, learner.id),
          eq(learnerFavorites.coachId, input.coachId)
        ));
      
      return !!favorite;
    }),

  // Get loyalty points,

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    const user = await getUserById(ctx.user.id);
    return {
      ...learner,
      name: user?.name,
      email: user?.email,
      avatarUrl: user?.avatarUrl,
    };
  }),
  
  // Get upcoming sessions for dashboard,
});
