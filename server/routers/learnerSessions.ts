import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { createLearnerProfile, getDb, getLatestSessionForLearner, getLearnerByUserId, getUpcomingSessions, getUserById, updateLearnerProfile } from "../db";
import { coachProfiles, notifications, payoutLedger, sessions, users } from "../../drizzle/schema";
import { sendRescheduleNotificationEmails } from "../email";

export const learnerSessionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        department: z.string().max(200).optional(),
        position: z.string().max(200).optional(),
        currentLevel: z.object({
          reading: z.enum(["X", "A", "B", "C"]).optional(),
          writing: z.enum(["X", "A", "B", "C"]).optional(),
          oral: z.enum(["X", "A", "B", "C"]).optional(),
        }).optional(),
        targetLevel: z.object({
          reading: z.enum(["A", "B", "C"]).optional(),
          writing: z.enum(["A", "B", "C"]).optional(),
          oral: z.enum(["A", "B", "C"]).optional(),
        }).optional(),
        examDate: z.date().optional(),
        learningGoals: z.string().max(1000).optional(),
        primaryFocus: z.enum(["oral", "written", "reading", "all"]).default("oral"),
        targetLanguage: z.enum(["french", "english"]).default("french"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getLearnerByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a learner profile",
        });
      }

      await createLearnerProfile({
        userId: ctx.user.id,
        department: input.department || null,
        position: input.position || null,
        currentLevel: input.currentLevel || null,
        targetLevel: input.targetLevel || null,
        examDate: input.examDate || null,
        learningGoals: input.learningGoals || null,
        primaryFocus: input.primaryFocus,
        targetLanguage: input.targetLanguage,
      });

      return { success: true };
    }),

  // Update learner profile,

  update: protectedProcedure
    .input(
      z.object({
        department: z.string().max(200).optional(),
        position: z.string().max(200).optional(),
        currentLevel: z.object({
          reading: z.enum(["X", "A", "B", "C"]).optional(),
          writing: z.enum(["X", "A", "B", "C"]).optional(),
          oral: z.enum(["X", "A", "B", "C"]).optional(),
        }).optional(),
        targetLevel: z.object({
          reading: z.enum(["A", "B", "C"]).optional(),
          writing: z.enum(["A", "B", "C"]).optional(),
          oral: z.enum(["A", "B", "C"]).optional(),
        }).optional(),
        examDate: z.date().optional(),
        learningGoals: z.string().max(1000).optional(),
        primaryFocus: z.enum(["oral", "written", "reading", "all"]).optional(),
        targetLanguage: z.enum(["french", "english"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getLearnerByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }

      await updateLearnerProfile(profile.id, input);
      return { success: true };
    }),

  // Get upcoming sessions,

  upcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    return await getUpcomingSessions(ctx.user.id, "learner");
  }),

  // Get latest booked session (for confirmation page),

  latestSession: protectedProcedure.query(async ({ ctx }) => {
    return await getLatestSessionForLearner(ctx.user.id);
  }),

  // Get past sessions,

  pastSessions: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    const pastSessions = await db.select({
      session: sessions,
      coach: {
        id: coachProfiles.id,
        photoUrl: coachProfiles.photoUrl,
        slug: coachProfiles.slug,
        userId: coachProfiles.userId,
      },
      coachUser: {
        name: users.name,
      },
    })
      .from(sessions)
      .leftJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(and(
        eq(sessions.learnerId, learner.id),
        eq(sessions.status, "completed")
      ))
      .orderBy(desc(sessions.scheduledAt))
      .limit(50);
    
    // Transform to include name in coach object
    return pastSessions.map(s => ({
      session: s.session,
      coach: {
        ...s.coach,
        name: s.coachUser?.name || "Coach",
      },
    }));
  }),

  // Get cancelled sessions,

  cancelledSessions: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    const cancelledSessions = await db.select({
      session: sessions,
      coach: {
        id: coachProfiles.id,
        photoUrl: coachProfiles.photoUrl,
        slug: coachProfiles.slug,
        userId: coachProfiles.userId,
      },
      coachUser: {
        name: users.name,
      },
    })
      .from(sessions)
      .leftJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(and(
        eq(sessions.learnerId, learner.id),
        eq(sessions.status, "cancelled")
      ))
      .orderBy(desc(sessions.scheduledAt))
      .limit(50);
    
    // Transform to include name in coach object
    return cancelledSessions.map(s => ({
      session: s.session,
      coach: {
        ...s.coach,
        name: s.coachUser?.name || "Coach",
      },
    }));
  }),

  // Reschedule a session,

  reschedule: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        newDateTime: z.string(), // ISO string
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Get the session and verify ownership
      const [session] = await db.select()
        .from(sessions)
        .where(eq(sessions.id, input.sessionId));
      
      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }
      
      // Get learner profile to verify ownership
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner || session.learnerId !== learner.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only reschedule your own sessions" });
      }
      
      // Check 24-hour policy
      const now = new Date();
      const sessionDate = new Date(session.scheduledAt);
      const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilSession < 24) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sessions must be rescheduled at least 24 hours in advance",
        });
      }
      
      const newDate = new Date(input.newDateTime);
      
      // Update the session
      await db.update(sessions)
        .set({ 
          scheduledAt: newDate,
          status: "confirmed",
        })
        .where(eq(sessions.id, input.sessionId));
      
      // Get coach and user info for email notifications
      const [coachProfile] = await db.select()
        .from(coachProfiles)
        .leftJoin(users, eq(coachProfiles.userId, users.id))
        .where(eq(coachProfiles.id, session.coachId));
      
      const learnerUser = await getUserById(ctx.user.id);
      
      if (coachProfile && learnerUser) {
        // Format old time
        const oldDate = new Date(session.scheduledAt);
        const oldTime = oldDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        const newTime = newDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        
        // Send reschedule notification emails
        await sendRescheduleNotificationEmails({
          learnerName: learnerUser.name || "Learner",
          learnerEmail: learnerUser.email || "",
          coachName: coachProfile.users?.name || "Coach",
          coachEmail: coachProfile.users?.email || "",
          oldDate,
          oldTime,
          newDate,
          newTime,
          duration: session.duration || 30,
          meetingUrl: session.meetingUrl || undefined,
          rescheduledBy: "learner",
        });
      }
      
      return { success: true, newDateTime: newDate };
    }),

  // Cancel a session with refund processing,

  cancelSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Get the session and verify ownership
      const [session] = await db.select()
        .from(sessions)
        .where(eq(sessions.id, input.sessionId));
      
      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }
      
      // Get learner profile to verify ownership
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner || session.learnerId !== learner.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only cancel your own sessions" });
      }
      
      // Check if session is already cancelled
      if (session.status === "cancelled") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Session is already cancelled" });
      }
      
      // Check 24-hour policy for refund eligibility
      const now = new Date();
      const sessionDate = new Date(session.scheduledAt);
      const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      const isRefundEligible = hoursUntilSession >= 24;
      
      let refundAmount = 0;
      
      // Process refund if eligible and has payment
      if (isRefundEligible && session.stripePaymentId) {
        try {
          const stripe = (await import("stripe")).default;
          const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || "");
          
          // Create refund
          const refund = await stripeClient.refunds.create({
            payment_intent: session.stripePaymentId,
          });
          
          refundAmount = refund.amount;
          
          // Update payout ledger + session status atomically
          await db.transaction(async (tx) => {
            await tx.update(payoutLedger)
              .set({ 
                status: "reversed",
                updatedAt: new Date(),
              })
              .where(eq(payoutLedger.sessionId, input.sessionId));
            await tx.update(sessions)
              .set({ 
                status: "cancelled",
                cancelledAt: new Date(),
                cancellationReason: input.reason || null,
              })
              .where(eq(sessions.id, input.sessionId));
          });
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          // Still cancel the session even if refund fails
          await db.update(sessions)
            .set({ 
              status: "cancelled",
              cancelledAt: new Date(),
              cancellationReason: input.reason || null,
            })
            .where(eq(sessions.id, input.sessionId));
        }
      } else {
        // No refund needed, just cancel the session
        await db.update(sessions)
          .set({ 
            status: "cancelled",
            cancelledAt: new Date(),
            cancellationReason: input.reason || null,
          })
          .where(eq(sessions.id, input.sessionId));
      }
      
      // Send cancellation notification emails
      const [coachProfile] = await db.select()
        .from(coachProfiles)
        .leftJoin(users, eq(coachProfiles.userId, users.id))
        .where(eq(coachProfiles.id, session.coachId));
      
      const learnerUser = await getUserById(ctx.user.id);
      
      if (coachProfile && learnerUser) {
        const { sendCancellationNotificationEmails } = await import("../email");
        await sendCancellationNotificationEmails({
          learnerName: learnerUser.name || "Learner",
          learnerEmail: learnerUser.email || "",
          coachName: coachProfile.users?.name || "Coach",
          coachEmail: coachProfile.users?.email || "",
          sessionDate,
          sessionTime: sessionDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
          duration: session.duration || 30,
          reason: input.reason,
          refundAmount,
          cancelledBy: "learner",
        });
      }
      
      return { 
        success: true, 
        refundAmount,
        refundEligible: isRefundEligible,
      };
    }),

  // Get learner progress report data,
});
