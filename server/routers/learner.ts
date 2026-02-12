import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, and, gte, inArray, count } from "drizzle-orm";
import {
  createLearnerProfile,
  getDb,
  getLatestSessionForLearner,
  getLearnerByUserId,
  getUpcomingSessions,
  getUserById,
  updateLearnerProfile,
} from "../db";
import { coachProfiles, courseEnrollments, courses, learnerFavorites, learnerProfiles, payoutLedger, sessions, users } from "../../drizzle/schema";
import { sendRescheduleNotificationEmails } from "../email";

export const learnerRouter = router({
  // Get current user's learner profile
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return await getLearnerByUserId(ctx.user.id);
  }),

  // Create learner profile
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

  // Update learner profile
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

  // Get upcoming sessions
  upcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    return await getUpcomingSessions(ctx.user.id, "learner");
  }),

  // Get latest booked session (for confirmation page)
  latestSession: protectedProcedure.query(async ({ ctx }) => {
    return await getLatestSessionForLearner(ctx.user.id);
  }),

  // Get past sessions
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

  // Get cancelled sessions
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

  // Reschedule a session
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

  // Cancel a session with refund processing
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
          
          // Update payout ledger if exists
          await db.update(payoutLedger)
            .set({ 
              status: "reversed",
              updatedAt: new Date(),
            })
            .where(eq(payoutLedger.sessionId, input.sessionId));
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          // Continue with cancellation even if refund fails
        }
      }
      
      // Update session status
      await db.update(sessions)
        .set({ 
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: input.reason || null,
        })
        .where(eq(sessions.id, input.sessionId));
      
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

  // Get learner progress report data
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

  // Update weekly report preferences
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

  // Get report preferences
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

  // Send progress report email
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

  // Get learner's favorite coaches
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

  // Add coach to favorites
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

  // Remove coach from favorites
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

  // Check if coach is favorited
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

  // Get loyalty points
  getLoyaltyPoints: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    
    const { loyaltyPoints } = await import("../../drizzle/schema");
    const [points] = await db.select().from(loyaltyPoints)
      .where(eq(loyaltyPoints.learnerId, learner.id));
    
    if (!points) {
      // Create initial loyalty record
      await db.insert(loyaltyPoints).values({
        learnerId: learner.id,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
        tier: "bronze",
      });
      return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    }
    
    return {
      totalPoints: points.totalPoints,
      availablePoints: points.availablePoints,
      lifetimePoints: points.lifetimePoints,
      tier: points.tier,
    };
  }),

  // Get available rewards
  getAvailableRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { loyaltyRewards } = await import("../../drizzle/schema");
    const rewards = await db.select().from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true));
    
    return rewards;
  }),

  // Get points history
  getPointsHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const { pointTransactions } = await import("../../drizzle/schema");
    const history = await db.select().from(pointTransactions)
      .where(eq(pointTransactions.learnerId, learner.id))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(50);
    
    return history;
  }),

  // Redeem reward
  redeemReward: protectedProcedure
    .input(z.object({ rewardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      
      const { loyaltyPoints, loyaltyRewards, redeemedRewards, pointTransactions } = await import("../../drizzle/schema");
      
      // Get reward
      const [reward] = await db.select().from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, input.rewardId));
      
      if (!reward || !reward.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reward not found or inactive" });
      }
      
      // Get current points
      const [points] = await db.select().from(loyaltyPoints)
        .where(eq(loyaltyPoints.learnerId, learner.id));
      
      if (!points || points.availablePoints < reward.pointsCost) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient points" });
      }
      
      // Check tier requirement
      const tierOrder = ["bronze", "silver", "gold", "platinum"];
      if (tierOrder.indexOf(points.tier) < tierOrder.indexOf(reward.minTier || "bronze")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tier requirement not met" });
      }
      
      // Generate discount code
      const discountCode = `LNG-${Date.now().toString(36).toUpperCase()}`;
      
      // Create redeemed reward
      await db.insert(redeemedRewards).values({
        learnerId: learner.id,
        rewardId: reward.id,
        pointsSpent: reward.pointsCost,
        discountCode,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      
      // Deduct points
      await db.update(loyaltyPoints)
        .set({
          availablePoints: points.availablePoints - reward.pointsCost,
          totalPoints: points.totalPoints - reward.pointsCost,
        })
        .where(eq(loyaltyPoints.learnerId, learner.id));
      
      // Record transaction
      await db.insert(pointTransactions).values({
        learnerId: learner.id,
        type: "redeemed_discount",
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.nameEn}`,
      });
      
      return { success: true, discountCode };
    }),
  
  // Get referral stats
  getReferralStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const { referralInvitations } = await import("../../drizzle/schema");
    
    // Generate referral code and link for this user
    const code = `REF${ctx.user.id}${ctx.user.id.toString(36).toUpperCase()}`;
    const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || "https://lingueefy.manus.space";
    const referralLink = `${baseUrl}?ref=${code}`;
    
    // Get invitation stats
    const invitations = await db.select().from(referralInvitations)
      .where(eq(referralInvitations.referrerId, ctx.user.id));
    
    const totalInvites = invitations.length;
    const pendingInvites = invitations.filter((i: any) => i.status === "pending" || i.status === "clicked").length;
    const registeredInvites = invitations.filter((i: any) => i.status === "registered" || i.status === "converted").length;
    const convertedInvites = invitations.filter((i: any) => i.status === "converted").length;
    const totalPointsEarned = invitations.reduce((sum: number, i: any) => sum + (i.referrerRewardPoints || 0), 0);
    
    return {
      referralCode: code,
      referralLink,
      totalInvites,
      pendingInvites,
      registeredInvites,
      convertedInvites,
      totalPointsEarned,
      conversionRate: totalInvites > 0 ? (convertedInvites / totalInvites) * 100 : 0,
    };
  }),
  
  // Get referral invitations
  getReferralInvitations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const { referralInvitations } = await import("../../drizzle/schema");
    return await db.select().from(referralInvitations)
      .where(eq(referralInvitations.referrerId, ctx.user.id))
      .orderBy(desc(referralInvitations.createdAt));
  }),
  
  // Send referral invite by email
  sendReferralInvite: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { referralInvitations } = await import("../../drizzle/schema");
      
      // Generate referral code and link
      const code = `REF${ctx.user.id}${ctx.user.id.toString(36).toUpperCase()}`;
      const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || "https://lingueefy.manus.space";
      const referralLink = `${baseUrl}?ref=${code}`;
      
      // Check if already invited
      const [existing] = await db.select().from(referralInvitations)
        .where(and(
          eq(referralInvitations.referrerId, ctx.user.id),
          eq(referralInvitations.inviteeEmail, input.email)
        ));
      
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "This email has already been invited" });
      }
      
      // Create invitation record
      await db.insert(referralInvitations).values({
        referrerId: ctx.user.id,
        referralCode: code,
        inviteeEmail: input.email,
        inviteMethod: "email",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      
      // Send email (using existing email system)
      const { sendReferralInviteEmail } = await import("../email");
      await sendReferralInviteEmail({
        to: input.email,
        referrerName: ctx.user.name || "A friend",
        referralLink,
      });
      
      return { success: true };
    }),
    
  // Get user's active challenges
  getChallenges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const { challenges, userChallenges } = await import("../../drizzle/schema");
    
    // Get or create weekly challenges for user
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    // Get active challenges
    const activeChallenges = await db.select().from(challenges)
      .where(eq(challenges.isActive, true));
    
    // Get user's challenge progress
    const userProgress = await db.select().from(userChallenges)
      .where(and(
        eq(userChallenges.userId, ctx.user.id),
        gte(userChallenges.periodStart, weekStart)
      ));
    
    // Create missing challenge entries for user
    for (const challenge of activeChallenges) {
      const existing = userProgress.find(p => p.challengeId === challenge.id);
      if (!existing && challenge.period === "weekly") {
        await db.insert(userChallenges).values({
          userId: ctx.user.id,
          challengeId: challenge.id,
          currentProgress: 0,
          targetProgress: challenge.targetCount,
          periodStart: weekStart,
          periodEnd: weekEnd,
        });
      }
    }
    
    // Re-fetch with joined data
    const result = await db.select({
      id: userChallenges.id,
      name: challenges.name,
      nameFr: challenges.nameFr,
      description: challenges.description,
      descriptionFr: challenges.descriptionFr,
      type: challenges.type,
      targetCount: challenges.targetCount,
      pointsReward: challenges.pointsReward,
      period: challenges.period,
      currentProgress: userChallenges.currentProgress,
      status: userChallenges.status,
      periodEnd: userChallenges.periodEnd,
    })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(and(
      eq(userChallenges.userId, ctx.user.id),
      gte(userChallenges.periodStart, weekStart)
    ));
    
    return result;
  }),
  
  // Claim challenge reward
  claimChallengeReward: protectedProcedure
    .input(z.object({ userChallengeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { userChallenges, challenges, loyaltyPoints, pointTransactions } = await import("../../drizzle/schema");
      
      // Get user challenge
      const [userChallenge] = await db.select()
        .from(userChallenges)
        .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
        .where(and(
          eq(userChallenges.id, input.userChallengeId),
          eq(userChallenges.userId, ctx.user.id)
        ));
      
      if (!userChallenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found" });
      }
      
      if (userChallenge.user_challenges.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Reward already claimed" });
      }
      
      if (userChallenge.user_challenges.currentProgress < userChallenge.challenges.targetCount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Challenge not completed yet" });
      }
      
      // Mark as completed
      await db.update(userChallenges)
        .set({ 
          status: "completed", 
          completedAt: new Date(),
          pointsAwarded: userChallenge.challenges.pointsReward,
        })
        .where(eq(userChallenges.id, input.userChallengeId));
      
      // Award points - get learner first
      const learnerForPoints = await getLearnerByUserId(ctx.user.id);
      if (!learnerForPoints) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      const [existingPoints] = await db.select().from(loyaltyPoints)
        .where(eq(loyaltyPoints.learnerId, learnerForPoints.id));
      
      if (existingPoints) {
        await db.update(loyaltyPoints)
          .set({ 
            totalPoints: existingPoints.totalPoints + userChallenge.challenges.pointsReward,
            availablePoints: existingPoints.availablePoints + userChallenge.challenges.pointsReward,
          })
          .where(eq(loyaltyPoints.learnerId, learnerForPoints.id));
      } else {
        await db.insert(loyaltyPoints).values({
          learnerId: learnerForPoints.id,
          totalPoints: userChallenge.challenges.pointsReward,
          availablePoints: userChallenge.challenges.pointsReward,
          tier: "bronze",
        });
      }
      
      // Record transaction
      const learner = await getLearnerByUserId(ctx.user.id);
      if (learner) {
        await db.insert(pointTransactions).values({
          learnerId: learner.id,
          points: userChallenge.challenges.pointsReward,
          type: "earned_milestone",
          description: `Completed challenge: ${userChallenge.challenges.name}`,
        });
      }
      
      return { success: true, pointsAwarded: userChallenge.challenges.pointsReward };
    }),
  
  // Get leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({ period: z.enum(["weekly", "monthly", "allTime"]) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { loyaltyPoints, learnerProfiles, users, sessions } = await import("../../drizzle/schema");
      
      // Get date filter based on period
      let dateFilter: Date | null = null;
      const now = new Date();
      if (input.period === "weekly") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (input.period === "monthly") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Get all learners with points
      const leaderboardData = await db.select({
        learnerId: loyaltyPoints.learnerId,
        points: loyaltyPoints.totalPoints,
        tier: loyaltyPoints.tier,
        userId: learnerProfiles.userId,
        userName: users.name,
        avatarUrl: users.avatarUrl,
      })
        .from(loyaltyPoints)
        .innerJoin(learnerProfiles, eq(loyaltyPoints.learnerId, learnerProfiles.id))
        .innerJoin(users, eq(learnerProfiles.userId, users.id))
        .orderBy(desc(loyaltyPoints.totalPoints))
        .limit(50);
      
      // Get session counts for each learner
      const leaderboard = await Promise.all(leaderboardData.map(async (entry, index) => {
        // Count completed sessions
        const sessionCount = await db.select({ count: sql<number>`count(*)` })
          .from(sessions)
          .where(and(
            eq(sessions.learnerId, entry.learnerId),
            eq(sessions.status, "completed")
          ));
        
        return {
          rank: index + 1,
          userId: entry.userId,
          name: entry.userName || "Anonymous",
          avatarUrl: entry.avatarUrl,
          points: entry.points,
          tier: entry.tier,
          sessionsCompleted: Number(sessionCount[0]?.count || 0),
          streak: 0, // Would need streak tracking table
          rankChange: 0, // Would need previous rank tracking
        };
      }));
      
      return leaderboard;
    }),

  // Get streak data
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles } = await import("../../drizzle/schema");
    
    const profile = await db.select({
      currentStreak: learnerProfiles.currentStreak,
      longestStreak: learnerProfiles.longestStreak,
      lastSessionWeek: learnerProfiles.lastSessionWeek,
      streakFreezeUsed: learnerProfiles.streakFreezeUsed,
    })
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (!profile[0]) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastSessionWeek: null,
        streakFreezeUsed: false,
        streakFreezeAvailable: true,
        nextMilestone: 3,
        pointsToNextMilestone: 50,
      };
    }
    
    return {
      currentStreak: profile[0].currentStreak || 0,
      longestStreak: profile[0].longestStreak || 0,
      lastSessionWeek: profile[0].lastSessionWeek,
      streakFreezeUsed: profile[0].streakFreezeUsed || false,
      streakFreezeAvailable: !profile[0].streakFreezeUsed,
      nextMilestone: 3,
      pointsToNextMilestone: 50,
    };
  }),

  // Use streak freeze
  useStreakFreeze: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles } = await import("../../drizzle/schema");
    
    // Check if freeze is already used
    const profile = await db.select({ streakFreezeUsed: learnerProfiles.streakFreezeUsed })
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (profile[0]?.streakFreezeUsed) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Streak freeze already used" });
    }
    
    // Get current ISO week
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    
    // Use the freeze - update last session week to current week
    await db.update(learnerProfiles)
      .set({
        streakFreezeUsed: true,
        lastSessionWeek: currentWeek,
      })
      .where(eq(learnerProfiles.id, learner.id));
    
    return { success: true };
  }),

  // Update streak after session completion (called internally)
  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles, pointTransactions, loyaltyPoints } = await import("../../drizzle/schema");
    
    // Get current profile
    const profile = await db.select()
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (!profile[0]) return { success: false };
    
    // Get current ISO week
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    
    const lastWeek = profile[0].lastSessionWeek;
    let newStreak = profile[0].currentStreak || 0;
    
    // If same week, no change
    if (lastWeek === currentWeek) {
      return { success: true, streak: newStreak };
    }
    
    // Check if consecutive week
    if (lastWeek) {
      const [lastYear, lastWeekNum] = lastWeek.split('-W').map(Number);
      const [currentYear, currentWeekNum] = currentWeek.split('-W').map(Number);
      
      const isConsecutive = 
        (currentYear === lastYear && currentWeekNum === lastWeekNum + 1) ||
        (currentYear === lastYear + 1 && lastWeekNum === 52 && currentWeekNum === 1);
      
      if (isConsecutive) {
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    
    const newLongest = Math.max(newStreak, profile[0].longestStreak || 0);
    
    // Update profile
    await db.update(learnerProfiles)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastSessionWeek: currentWeek,
      })
      .where(eq(learnerProfiles.id, learner.id));
    
    // Award bonus points for streak milestones
    const milestones = [
      { weeks: 3, points: 50 },
      { weeks: 7, points: 150 },
      { weeks: 14, points: 400 },
      { weeks: 30, points: 1000 },
      { weeks: 52, points: 2500 },
    ];
    
    const milestone = milestones.find(m => m.weeks === newStreak);
    if (milestone) {
      // Award bonus points
      await db.insert(pointTransactions).values({
        learnerId: learner.id,
        type: "earned_streak",
        points: milestone.points,
        description: `${newStreak} week streak bonus!`,
      });
      
      // Update loyalty points
      const existing = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.learnerId, learner.id)).limit(1);
      if (existing[0]) {
        await db.update(loyaltyPoints)
          .set({
            totalPoints: sql`${loyaltyPoints.totalPoints} + ${milestone.points}`,
            availablePoints: sql`${loyaltyPoints.availablePoints} + ${milestone.points}`,
            lifetimePoints: sql`${loyaltyPoints.lifetimePoints} + ${milestone.points}`,
          })
          .where(eq(loyaltyPoints.learnerId, learner.id));
      } else {
        await db.insert(loyaltyPoints).values({
          learnerId: learner.id,
          totalPoints: milestone.points,
          availablePoints: milestone.points,
          lifetimePoints: milestone.points,
          tier: "bronze",
        });
      }
    }
    
    return { success: true, streak: newStreak, milestone: milestone?.weeks };
  }),
  
  // Get learner profile for dashboard
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
  
  // Get upcoming sessions for dashboard
  getUpcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    const now = new Date();
    const upcomingSessions = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
      status: sessions.status,
      meetingUrl: sessions.meetingUrl,
      coachName: users.name,
    })
      .from(sessions)
      .leftJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(and(
        eq(sessions.learnerId, learner.id),
        gte(sessions.scheduledAt, now),
        inArray(sessions.status, ["pending", "confirmed"])
      ))
      .orderBy(sessions.scheduledAt)
      .limit(5);
    
    return upcomingSessions;
  }),

  // Get learner's enrolled courses (Path Series)
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { courses, courseEnrollments, courseModules, lessonProgress } = await import("../../drizzle/schema");
    
    // Get all course enrollments for this user
    const enrollments = await db.select({
      enrollment: courseEnrollments,
      course: courses,
    })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.userId, ctx.user.id))
      .orderBy(desc(courseEnrollments.enrolledAt));
    
    // Get progress for each course
    const coursesWithProgress = await Promise.all(enrollments.map(async (e) => {
      // Count total lessons in course
      const totalLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(courseModules)
        .where(eq(courseModules.courseId, e.course.id));
      
      // Count completed lessons
      const completedLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, e.course.id),
          eq(lessonProgress.status, "completed")
        ));
      
      const totalLessons = Number(totalLessonsResult[0]?.count || 0);
      const completedLessons = Number(completedLessonsResult[0]?.count || 0);
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        id: e.enrollment.id,
        courseId: e.course.id,
        title: e.course.title,
        description: e.course.description,
        thumbnailUrl: e.course.thumbnailUrl,
        level: e.course.level,
        category: e.course.category,
        enrolledAt: e.enrollment.enrolledAt,
        status: e.enrollment.status,
        progressPercent,
        completedLessons,
        totalLessons,
        lastAccessedAt: e.enrollment.lastAccessedAt,
      };
    }));
    
    return coursesWithProgress;
  }),

  // Get next lesson to continue
  getNextLesson: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { courses, courseModules, lessons, lessonProgress, courseEnrollments } = await import("../../drizzle/schema");
      
      // Get enrollment
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId)
        ));
      
      if (!enrollment) return null;
      
      // Get all lessons in order
      const allLessons = await db.select({
        lesson: lessons,
        module: courseModules,
      })
        .from(lessons)
        .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
        .where(eq(lessons.courseId, input.courseId))
        .orderBy(courseModules.sortOrder, lessons.sortOrder);
      
      // Get completed lessons
      const completedLessonIds = await db.select({ lessonId: lessonProgress.lessonId })
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, input.courseId),
          eq(lessonProgress.status, "completed")
        ));
      
      const completedIds = new Set(completedLessonIds.map(l => l.lessonId));
      
      // Find first incomplete lesson
      const nextLesson = allLessons.find(l => !completedIds.has(l.lesson.id));
      
      if (!nextLesson) return null;
      
      return {
        lessonId: nextLesson.lesson.id,
        lessonTitle: nextLesson.lesson.title,
        moduleTitle: nextLesson.module.title,
        duration: nextLesson.lesson.estimatedMinutes || 0,
        contentType: nextLesson.lesson.contentType,
      };
    }),

  // Get course details with modules and lessons
  getCourseDetails: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { courses, courseModules, lessons, lessonProgress, courseEnrollments } = await import("../../drizzle/schema");
      
      // Get course
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, input.courseId));
      
      if (!course) return null;
      
      // Get enrollment
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId)
        ));
      
      // Get modules with lessons
      const modules = await db.select()
        .from(courseModules)
        .where(eq(courseModules.courseId, input.courseId))
        .orderBy(courseModules.sortOrder);
      
      const modulesWithLessons = await Promise.all(modules.map(async (module) => {
        const moduleLessons = await db.select()
          .from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(lessons.sortOrder);
        
        // Get progress for each lesson if enrolled
        const lessonsWithProgress = await Promise.all(moduleLessons.map(async (lesson) => {
          let progress = null;
          if (enrollment) {
            const [lessonProg] = await db.select()
              .from(lessonProgress)
              .where(and(
                eq(lessonProgress.userId, ctx.user.id),
                eq(lessonProgress.lessonId, lesson.id),
                eq(lessonProgress.courseId, input.courseId)
              ));
            progress = lessonProg;
          }
          
          return {
            ...lesson,
            isCompleted: progress?.status === "completed",
            isInProgress: progress?.status === "in_progress",
            progressPercent: progress?.progressPercent || 0,
          };
        }));
        
        return {
          ...module,
          lessons: lessonsWithProgress,
        };
      }));
      
      return {
        ...course,
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment?.status,
        modules: modulesWithLessons,
      };
    }),

  // Get learner's badges
  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { badges: [] };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { badges: [] };
    
    const { learnerBadges } = await import("../../drizzle/schema");
    
    const badges = await db.select().from(learnerBadges)
      .where(eq(learnerBadges.userId, ctx.user.id))
      .orderBy(desc(learnerBadges.awardedAt));
    
    return { badges };
  }),

  // Get learning velocity data for SLEVelocityWidget
  getVelocityData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      return {
        currentLevel: { reading: "X", writing: "X", oral: "X" },
        targetLevel: { reading: "B", writing: "B", oral: "B" },
        weeklyStudyHours: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
        lastAssessmentScore: null,
        examDate: null,
        predictedReadyDate: null,
        velocityTrend: "steady",
      };
    }
    
    // Calculate predicted ready date based on current progress
    const currentLevel = (learner.currentLevel as { reading?: string; writing?: string; oral?: string }) || {};
    const targetLevel = (learner.targetLevel as { reading?: string; writing?: string; oral?: string }) || {};
    
    // Simple prediction: estimate weeks to reach target based on study hours
    const weeklyHours = Number(learner.weeklyStudyHours) || 0;
    const lessonsCompleted = learner.lessonsCompleted || 0;
    
    // Calculate level gaps
    const levelValues: Record<string, number> = { X: 0, A: 1, B: 2, C: 3 };
    const gaps = [
      (levelValues[targetLevel.reading || "B"] || 2) - (levelValues[currentLevel.reading || "X"] || 0),
      (levelValues[targetLevel.writing || "B"] || 2) - (levelValues[currentLevel.writing || "X"] || 0),
      (levelValues[targetLevel.oral || "B"] || 2) - (levelValues[currentLevel.oral || "X"] || 0),
    ];
    const maxGap = Math.max(...gaps);
    
    // Estimate weeks needed (roughly 8 weeks per level with 5+ hours/week)
    const weeksPerLevel = weeklyHours >= 5 ? 8 : weeklyHours >= 3 ? 12 : 16;
    const weeksNeeded = maxGap * weeksPerLevel;
    
    const predictedReadyDate = new Date();
    predictedReadyDate.setDate(predictedReadyDate.getDate() + weeksNeeded * 7);
    
    // Determine velocity trend based on recent activity
    let velocityTrend: "improving" | "steady" | "declining" = "steady";
    if (weeklyHours >= 5 && lessonsCompleted > 10) velocityTrend = "improving";
    else if (weeklyHours < 2) velocityTrend = "declining";
    
    return {
      currentLevel,
      targetLevel,
      weeklyStudyHours: weeklyHours,
      lessonsCompleted,
      quizzesPassed: learner.quizzesPassed || 0,
      lastAssessmentScore: learner.lastAssessmentScore,
      examDate: learner.examDate,
      predictedReadyDate: weeksNeeded > 0 ? predictedReadyDate : null,
      velocityTrend,
    };
  }),

  // Get certification status for CertificationExpiryWidget
  getCertificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      return {
        hasCertification: false,
        certificationDate: null,
        certificationExpiry: null,
        certifiedLevel: null,
        daysUntilExpiry: null,
        isExpiringSoon: false,
        isExpired: false,
      };
    }
    
    const certificationDate = learner.certificationDate;
    const certificationExpiry = learner.certificationExpiry;
    const certifiedLevel = learner.certifiedLevel as { reading?: string; writing?: string; oral?: string } | null;
    
    if (!certificationDate || !certificationExpiry) {
      return {
        hasCertification: false,
        certificationDate: null,
        certificationExpiry: null,
        certifiedLevel: null,
        daysUntilExpiry: null,
        isExpiringSoon: false,
        isExpired: false,
      };
    }
    
    const now = new Date();
    const expiryDate = new Date(certificationExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = daysUntilExpiry < 0;
    const isExpiringSoon = !isExpired && daysUntilExpiry <= 180; // 6 months warning
    
    return {
      hasCertification: true,
      certificationDate,
      certificationExpiry,
      certifiedLevel,
      daysUntilExpiry: isExpired ? 0 : daysUntilExpiry,
      isExpiringSoon,
      isExpired,
    };
  }),

  // Update certification data
  updateCertification: protectedProcedure
    .input(z.object({
      certificationDate: z.date(),
      certifiedLevel: z.object({
        reading: z.enum(["A", "B", "C"]),
        writing: z.enum(["A", "B", "C"]),
        oral: z.enum(["A", "B", "C"]),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      // Calculate expiry (5 years from certification date)
      const expiryDate = new Date(input.certificationDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 5);
      
      await db.update(learnerProfiles)
        .set({
          certificationDate: input.certificationDate,
          certificationExpiry: expiryDate,
          certifiedLevel: input.certifiedLevel,
        })
        .where(eq(learnerProfiles.id, learner.id));
      
      return { success: true, certificationExpiry: expiryDate };
    }),

  // Get learner's XP and level
  getMyXp: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    
    const { learnerXp } = await import("../../drizzle/schema");
    
    const [xp] = await db.select().from(learnerXp)
      .where(eq(learnerXp.userId, ctx.user.id));
    
    if (!xp) {
      // Create initial XP record
      await db.insert(learnerXp).values({
        userId: ctx.user.id,
        totalXp: 0,
        currentLevel: 1,
        levelTitle: "Beginner",
        currentStreak: 0,
        longestStreak: 0,
      });
      return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    }
    
    // Calculate XP for next level (100 * level)
    const xpForNextLevel = 100 * (xp.currentLevel + 1);
    const currentLevelXp = xp.totalXp - (100 * xp.currentLevel * (xp.currentLevel - 1) / 2);
    
    return {
      totalXp: xp.totalXp,
      level: xp.currentLevel,
      xpForNextLevel,
      currentLevelXp: Math.max(0, currentLevelXp),
    };
  }),

  // Get learner's coaching plans
  getMyCoachingPlans: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { coachingPlanPurchases } = await import("../../drizzle/schema");
    
    const plans = await db.select()
      .from(coachingPlanPurchases)
      .where(eq(coachingPlanPurchases.userId, ctx.user.id))
      // @ts-expect-error - TS2339: auto-suppressed during TS cleanup
      .orderBy(desc(coachingPlanPurchases.createdAt));
    
    return plans;
  }),

  // Mark a lesson as complete
  markLessonComplete: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      courseId: z.number(),
      moduleId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessonProgress, courseEnrollments, lessons, learnerProfiles } = await import("../../drizzle/schema");
      
      // Verify user is enrolled in the course
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId),
          eq(courseEnrollments.status, "active")
        ));
      
      if (!enrollment) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not enrolled in this course" });
      }
      
      // Check if progress record exists
      const [existing] = await db.select()
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.lessonId, input.lessonId)
        ));
      
      const now = new Date();
      
      if (existing) {
        // Update existing record
        await db.update(lessonProgress)
          .set({
            status: "completed",
            progressPercent: 100,
            completedAt: now,
            lastAccessedAt: now,
          })
          .where(eq(lessonProgress.id, existing.id));
      } else {
        // Create new progress record
        await db.insert(lessonProgress).values({
          lessonId: input.lessonId,
          userId: ctx.user.id,
          courseId: input.courseId,
          moduleId: input.moduleId,
          status: "completed",
          progressPercent: 100,
          completedAt: now,
          lastAccessedAt: now,
        });
      }
      
      // Update learner's lessonsCompleted count
      const learner = await getLearnerByUserId(ctx.user.id);
      if (learner) {
        await db.update(learnerProfiles)
          .set({
            lessonsCompleted: sql`${learnerProfiles.lessonsCompleted} + 1`,
          })
          .where(eq(learnerProfiles.id, learner.id));
      }
      
      // Calculate new course progress
      const totalLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId));
      
      const completedLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, input.courseId),
          eq(lessonProgress.status, "completed")
        ));
      
      const totalLessons = Number(totalLessonsResult[0]?.count || 0);
      const completedLessons = Number(completedLessonsResult[0]?.count || 0);
      const newProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      // Update enrollment progress
      await db.update(courseEnrollments)
        .set({
          progressPercent: newProgressPercent,
    // @ts-ignore - Drizzle type inference
          completedLessons,
          lastAccessedAt: now,
          completedAt: newProgressPercent === 100 ? now : null,
          status: newProgressPercent === 100 ? "completed" : "active",
        })
        .where(eq(courseEnrollments.id, enrollment.id));
      
      return {
        success: true,
        lessonId: input.lessonId,
        courseProgress: newProgressPercent,
        completedLessons,
        totalLessons,
      };
    }),

  // Get lesson progress for a course
  getLessonProgress: protectedProcedure
    .input(z.object({
      courseId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const { lessonProgress } = await import("../../drizzle/schema");
      
      const progress = await db.select()
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, input.courseId)
        ));
      
      return progress;
    }),
});

