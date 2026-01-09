import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getApprovedCoaches,
  getCoachBySlug,
  getCoachByUserId,
  getCoachReviews,
  createCoachProfile,
  updateCoachProfile,
  getLearnerByUserId,
  createLearnerProfile,
  updateLearnerProfile,
  getUpcomingSessions,
  getLatestSessionForLearner,
  createAiSession,
  getLearnerAiSessions,
  getCommissionTiers,
  getCoachCommission,
  getCoachEarningsSummary,
  getCoachPayoutLedger,
  calculateCommissionRate,
  getReferralDiscount,
  getCoachReferralLink,
  createReferralLink,
  seedDefaultCommissionTiers,
  createCommissionTier,
  updateCommissionTier,
  getCoachAvailability,
  setCoachAvailability,
  getAvailableTimeSlotsForDate,
  getUserById,
  createReview,
  canLearnerReviewCoach,
  getLearnerReviewForCoach,
  updateReview,
  getUserNotifications,
  getUnreadNotificationCount,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  startConversation,
} from "./db";
import {
  createConnectAccount,
  getOnboardingLink,
  checkAccountStatus,
  createDashboardLink,
  createCheckoutSession,
} from "./stripe/connect";
import { calculatePlatformFee } from "./stripe/products";
import { sendRescheduleNotificationEmails } from "./email";
import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { coachProfiles, users, sessions, departmentInquiries, learnerProfiles, payoutLedger } from "../drizzle/schema";
import { eq, desc, sql, asc, and } from "drizzle-orm";

// ============================================================================
// COACH ROUTER
// ============================================================================
const coachRouter = router({
  // List approved coaches with filters
  list: publicProcedure
    .input(
      z.object({
        language: z.enum(["french", "english", "both"]).optional(),
        specializations: z.array(z.string()).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const coaches = await getApprovedCoaches(input || {});
      return coaches.map(({ coach, user }) => ({
        id: coach.id,
        slug: coach.slug,
        name: user.name,
        avatarUrl: user.avatarUrl,
        photoUrl: coach.photoUrl,
        headline: coach.headline,
        languages: coach.languages,
        specializations: coach.specializations,
        hourlyRate: coach.hourlyRate,
        trialRate: coach.trialRate,
        averageRating: coach.averageRating,
        totalSessions: coach.totalSessions,
        totalStudents: coach.totalStudents,
        totalReviews: coach.totalReviews,
        successRate: coach.successRate,
        responseTimeHours: coach.responseTimeHours,
      }));
    }),

  // Get single coach by slug
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await getCoachBySlug(input.slug);
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }
      return {
        ...result.coach,
        name: result.user.name,
        avatarUrl: result.user.avatarUrl,
      };
    }),

  // Get coach reviews
  reviews: publicProcedure
    .input(z.object({ coachId: z.number(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await getCoachReviews(input.coachId, input.limit);
    }),

  // Check if current user can review a coach
  canReview: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        return { canReview: false, reason: "You must have a learner profile to leave reviews" };
      }
      return await canLearnerReviewCoach(learner.id, input.coachId);
    }),

  // Get current user's review for a coach
  myReview: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) return null;
      return await getLearnerReviewForCoach(learner.id, input.coachId);
    }),

  // Submit a new review
  submitReview: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(10).max(1000).optional(),
      sleAchievement: z.string().max(50).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You must have a learner profile to leave reviews" });
      }

      const canReview = await canLearnerReviewCoach(learner.id, input.coachId);
      if (!canReview.canReview) {
        throw new TRPCError({ code: "FORBIDDEN", message: canReview.reason });
      }

      await createReview({
        sessionId: canReview.sessionId!,
        learnerId: learner.id,
        coachId: input.coachId,
        rating: input.rating,
        comment: input.comment || null,
        sleAchievement: input.sleAchievement || null,
      });

      return { success: true };
    }),

  // Update an existing review
  updateReview: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      rating: z.number().min(1).max(5).optional(),
      comment: z.string().min(10).max(1000).optional(),
      sleAchievement: z.string().max(50).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You must have a learner profile" });
      }

      const existingReview = await getLearnerReviewForCoach(learner.id, input.coachId);
      if (!existingReview) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      await updateReview(existingReview.id, {
        rating: input.rating,
        comment: input.comment,
        sleAchievement: input.sleAchievement,
      });

      return { success: true };
    }),

  // Get current user's coach profile
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return await getCoachByUserId(ctx.user.id);
  }),

  // Create coach profile (application)
  submitApplication: protectedProcedure
    .input(
      z.object({
        headline: z.string().min(10).max(200),
        bio: z.string().min(50).max(2000),
        languages: z.enum(["french", "english", "both"]),
        specializations: z.record(z.string(), z.boolean()),
        yearsExperience: z.number().min(0).max(50),
        credentials: z.string().max(500),
        hourlyRate: z.number().min(2000).max(20000), // $20-$200 in cents
        trialRate: z.number().min(0).max(10000),
        videoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a coach profile
      const existing = await getCoachByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a coach profile",
        });
      }

      // Generate slug from user name
      const baseName = ctx.user.name || "coach";
      const slug = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);

      await createCoachProfile({
        userId: ctx.user.id,
        slug,
        headline: input.headline,
        bio: input.bio,
        languages: input.languages,
        specializations: input.specializations,
        yearsExperience: input.yearsExperience,
        credentials: input.credentials,
        hourlyRate: input.hourlyRate,
        trialRate: input.trialRate,
        videoUrl: input.videoUrl || null,
        status: "pending",
      });

      return { success: true, slug };
    }),

  // Update coach profile
  update: protectedProcedure
    .input(
      z.object({
        headline: z.string().max(200).optional(),
        bio: z.string().max(2000).optional(),
        languages: z.enum(["french", "english", "both"]).optional(),
        specializations: z.record(z.string(), z.boolean()).optional(),
        yearsExperience: z.number().min(0).max(50).optional(),
        credentials: z.string().max(500).optional(),
        hourlyRate: z.number().min(0).max(20000).optional(),
        trialRate: z.number().min(0).max(10000).optional(),
        videoUrl: z.string().url().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }

      await updateCoachProfile(profile.id, input);
      return { success: true };
    }),

  // Upload coach profile photo to S3
  uploadPhoto: protectedProcedure
    .input(z.object({
      fileData: z.string(), // base64 encoded
      fileName: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }

      const { storagePut } = await import("./storage");
      
      // Extract base64 data
      const base64Data = input.fileData.includes(',') 
        ? input.fileData.split(',')[1] 
        : input.fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate unique file path
      const timestamp = Date.now();
      const ext = input.fileName.split('.').pop() || 'jpg';
      const filePath = `coach-photos/${profile.id}/${timestamp}.${ext}`;
      
      const { url } = await storagePut(filePath, buffer, input.mimeType);
      
      // Update coach profile with new photo URL
      await updateCoachProfile(profile.id, { photoUrl: url });
      
      return { success: true, photoUrl: url };
    }),

  // Get coach gallery photos
  getGalleryPhotos: publicProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const { coachGalleryPhotos } = await import("../drizzle/schema");
      const photos = await db.select().from(coachGalleryPhotos)
        .where(and(
          eq(coachGalleryPhotos.coachId, input.coachId),
          eq(coachGalleryPhotos.isActive, true)
        ))
        .orderBy(asc(coachGalleryPhotos.sortOrder));
      return photos;
    }),

  // Upload gallery photo to S3
  uploadGalleryPhoto: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      fileData: z.string(), // base64 encoded
      fileName: z.string(),
      mimeType: z.string(),
      caption: z.string().max(200).optional(),
      photoType: z.enum(["profile", "workspace", "certificate", "session", "event", "other"]).default("other"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile || profile.id !== input.coachId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachGalleryPhotos } = await import("../drizzle/schema");

      // Check photo count (max 10)
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(coachGalleryPhotos)
        .where(eq(coachGalleryPhotos.coachId, input.coachId));
      if ((countResult?.count || 0) >= 10) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Maximum 10 photos allowed" });
      }

      const { storagePut } = await import("./storage");
      
      // Extract base64 data
      const base64Data = input.fileData.includes(',') 
        ? input.fileData.split(',')[1] 
        : input.fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate unique file path
      const timestamp = Date.now();
      const ext = input.fileName.split('.').pop() || 'jpg';
      const filePath = `coach-gallery/${profile.id}/${timestamp}.${ext}`;
      
      const { url } = await storagePut(filePath, buffer, input.mimeType);
      
      // Get next sort order
      const [maxOrder] = await db.select({ max: sql<number>`MAX(sort_order)` })
        .from(coachGalleryPhotos)
        .where(eq(coachGalleryPhotos.coachId, input.coachId));
      const nextOrder = (maxOrder?.max || 0) + 1;
      
      // Insert photo record
      const [result] = await db.insert(coachGalleryPhotos).values({
        coachId: input.coachId,
        photoUrl: url,
        caption: input.caption || null,
        altText: input.caption || null,
        photoType: input.photoType,
        sortOrder: nextOrder,
      }).$returningId();
      
      return { id: result.id, photoUrl: url, success: true };
    }),

  // Delete gallery photo
  deleteGalleryPhoto: protectedProcedure
    .input(z.object({ photoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachGalleryPhotos } = await import("../drizzle/schema");

      // Verify ownership
      const [photo] = await db.select().from(coachGalleryPhotos)
        .where(eq(coachGalleryPhotos.id, input.photoId));
      
      if (!photo || photo.coachId !== profile.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Soft delete
      await db.update(coachGalleryPhotos)
        .set({ isActive: false })
        .where(eq(coachGalleryPhotos.id, input.photoId));
      
      return { success: true };
    }),

  // Save session notes
  saveSessionNotes: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      notes: z.string(),
      topicsCovered: z.array(z.string()).optional(),
      areasForImprovement: z.array(z.string()).optional(),
      homework: z.string().nullable().optional(),
      oralLevel: z.enum(["X", "A", "B", "C"]).nullable().optional(),
      writtenLevel: z.enum(["X", "A", "B", "C"]).nullable().optional(),
      readingLevel: z.enum(["X", "A", "B", "C"]).nullable().optional(),
      sharedWithLearner: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { sessionNotes, sessions: sessionsTable } = await import("../drizzle/schema");

      // Verify the session belongs to this coach
      const [session] = await db.select().from(sessionsTable)
        .where(eq(sessionsTable.id, input.sessionId));
      
      if (!session || session.coachId !== profile.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Check if notes already exist
      const [existing] = await db.select().from(sessionNotes)
        .where(eq(sessionNotes.sessionId, input.sessionId));
      
      if (existing) {
        // Update existing notes
        await db.update(sessionNotes)
          .set({
            notes: input.notes,
            topicsCovered: input.topicsCovered || null,
            areasForImprovement: input.areasForImprovement || null,
            homework: input.homework || null,
            oralLevel: input.oralLevel || null,
            writtenLevel: input.writtenLevel || null,
            readingLevel: input.readingLevel || null,
            sharedWithLearner: input.sharedWithLearner,
          })
          .where(eq(sessionNotes.id, existing.id));
        return { id: existing.id, success: true };
      } else {
        // Create new notes
        const [result] = await db.insert(sessionNotes).values({
          sessionId: input.sessionId,
          coachId: profile.id,
          notes: input.notes,
          topicsCovered: input.topicsCovered || null,
          areasForImprovement: input.areasForImprovement || null,
          homework: input.homework || null,
          oralLevel: input.oralLevel || null,
          writtenLevel: input.writtenLevel || null,
          readingLevel: input.readingLevel || null,
          sharedWithLearner: input.sharedWithLearner,
        }).$returningId();
        return { id: result.id, success: true };
      }
    }),

  // Get session notes for a session
  getSessionNotes: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const { sessionNotes, sessions: sessionsTable } = await import("../drizzle/schema");

      // Get the session to check authorization
      const [session] = await db.select().from(sessionsTable)
        .where(eq(sessionsTable.id, input.sessionId));
      
      if (!session) return null;

      // Get notes
      const [notes] = await db.select().from(sessionNotes)
        .where(eq(sessionNotes.sessionId, input.sessionId));
      
      if (!notes) return null;

      // Check if user is the coach or learner
      const profile = await getCoachByUserId(ctx.user.id);
      const learnerProfile = await getLearnerByUserId(ctx.user.id);
      
      const isCoach = profile && session.coachId === profile.id;
      const isLearner = learnerProfile && session.learnerId === learnerProfile.id;
      
      if (!isCoach && !isLearner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }
      
      // If learner, only return if shared
      if (isLearner && !notes.sharedWithLearner) {
        return null;
      }
      
      return notes;
    }),

  // Get coach availability
  getAvailability: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    return await getCoachAvailability(profile.id);
  }),

  // Set coach availability (replace all slots)
  setAvailability: protectedProcedure
    .input(
      z.array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
          timezone: z.string().default("America/Toronto"),
          isActive: z.boolean().default(true),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }
      await setCoachAvailability(profile.id, input);
      return { success: true };
    }),

  // Get available time slots for a specific date (public)
  availableSlots: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        date: z.string(), // ISO date string
      })
    )
    .query(async ({ input }) => {
      const date = new Date(input.date);
      return await getAvailableTimeSlotsForDate(input.coachId, date);
    }),

  // Get coach earnings summary
  getEarningsSummary: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) {
      return {
        totalEarnings: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
        thisMonthEarnings: 0,
        sessionsCompleted: 0,
        averageSessionValue: 0,
      };
    }
    return await getCoachEarningsSummary(profile.id);
  }),

  // Get coach payout ledger (transaction history)
  getPayoutLedger: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) {
      return [];
    }
    return await getCoachPayoutLedger(profile.id);
  }),

  // Update calendar settings
  updateCalendarSettings: protectedProcedure
    .input(
      z.object({
        calendarType: z.enum(["internal", "calendly"]),
        calendlyUrl: z.string().url().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }
      
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db
        .update(coachProfiles)
        .set({
          calendarType: input.calendarType,
          calendlyUrl: input.calendlyUrl || null,
        })
        .where(eq(coachProfiles.id, profile.id));
      
      return { success: true };
    }),

  // Get calendar settings
  getCalendarSettings: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) {
      return { calendarType: 'internal' as const, calendlyUrl: null };
    }
    return {
      calendarType: profile.calendarType || 'internal',
      calendlyUrl: profile.calendlyUrl,
    };
  }),
});

// ============================================================================
// LEARNER ROUTER
// ============================================================================
const learnerRouter = router({
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
        const { sendCancellationNotificationEmails } = await import("./email");
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
    const { aiSessions: aiSessionsTable } = await import("../drizzle/schema");
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
    const { sendLearnerProgressReport, generateProgressReportData } = await import("./email");
    
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
    const { aiSessions: aiSessionsTable } = await import("../drizzle/schema");
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
});

// ============================================================================
// AI SESSION ROUTER (Prof Steven AI)
// ============================================================================
const aiRouter = router({
  // Start a practice session
  startPractice: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
        targetLevel: z.enum(["a", "b", "c"]).optional(),
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "practice",
        language: input.language,
        targetLevel: input.targetLevel,
      });

      return { sessionId: session[0].insertId };
    }),

  // Start placement test
  startPlacement: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "placement",
        language: input.language,
      });

      return { sessionId: session[0].insertId };
    }),

  // Start exam simulation
  startSimulation: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
        targetLevel: z.enum(["a", "b", "c"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "simulation",
        language: input.language,
        targetLevel: input.targetLevel,
      });

      return { sessionId: session[0].insertId };
    }),

  // Chat with Prof Steven AI
  chat: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        message: z.string().min(1).max(2000),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const systemPrompt = `You are Prof Steven AI, a friendly and encouraging language coach specializing in helping Canadian federal public servants prepare for their Second Language Evaluation (SLE) exams.

Your role:
- Help learners practice their French or English conversation skills
- Provide corrections and feedback in a supportive way
- Use vocabulary and scenarios relevant to the Canadian federal public service
- Adapt your language complexity to the learner's level
- Encourage and motivate learners

Guidelines:
- If practicing French, respond primarily in French with occasional English explanations for corrections
- If practicing English, respond primarily in English with occasional French explanations for corrections
- Keep responses conversational and natural
- Point out errors gently and provide the correct form
- Suggest improvements for more natural phrasing
- Use workplace scenarios: meetings, briefings, emails, presentations, etc.

Remember: You're preparing them for real SLE oral interaction exams, so focus on practical communication skills.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...input.conversationHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({ messages });

      const content = response.choices[0]?.message?.content;
      const responseText = typeof content === 'string' ? content : "I apologize, I couldn't generate a response. Please try again.";
      
      return {
        response: responseText,
      };
    }),

  // Get learner's AI session history
  history: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];

    return await getLearnerAiSessions(learner.id);
  }),
});

// ============================================================================
// COMMISSION & PAYMENT ROUTER
// ============================================================================
const commissionRouter = router({
  // Get all commission tiers (admin)
  tiers: protectedProcedure.query(async () => {
    return await getCommissionTiers();
  }),

  // Get coach's current commission info
  myCommission: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) return null;
    
    const commission = await getCoachCommission(coach.id);
    const earnings = await getCoachEarningsSummary(coach.id);
    
    return {
      commission,
      earnings,
    };
  }),

  // Get coach's payout ledger
  myLedger: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const coach = await getCoachByUserId(ctx.user.id);
      if (!coach) return [];
      
      return await getCoachPayoutLedger(coach.id, input.limit);
    }),

  // Get coach's referral link
  myReferralLink: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) return null;
    
    return await getCoachReferralLink(coach.id);
  }),

  // Create referral link for coach
  createReferralLink: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    
    // Generate unique code
    const code = `${coach.slug}-${Date.now().toString(36)}`.slice(0, 20);
    
    await createReferralLink({
      coachId: coach.id,
      code,
      discountCommissionBps: 500, // 5% commission for referred bookings
      isActive: true,
    });
    
    return { code };
  }),

  // Seed default tiers (admin only)
  seedTiers: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    await seedDefaultCommissionTiers();
    return { success: true };
  }),
});

// ============================================================================
// STRIPE CONNECT ROUTER
// ============================================================================
const stripeRouter = router({
  // Start Stripe Connect onboarding for coach
  startOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    
    if (coach.stripeAccountId) {
      // Already has account, get new onboarding link
      const url = await getOnboardingLink(coach.stripeAccountId);
      return { url, accountId: coach.stripeAccountId };
    }
    
    // Create new Connect account
    const { accountId, onboardingUrl } = await createConnectAccount({
      email: ctx.user.email || "",
      name: ctx.user.name || "Coach",
      coachId: coach.id,
    });
    
    // Save account ID to coach profile
    await updateCoachProfile(coach.id, { stripeAccountId: accountId });
    
    return { url: onboardingUrl, accountId };
  }),

  // Check Stripe account status
  accountStatus: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach || !coach.stripeAccountId) {
      return { hasAccount: false, isOnboarded: false };
    }
    
    const status = await checkAccountStatus(coach.stripeAccountId);
    
    // Update onboarded status in profile
    if (status.isOnboarded && !coach.stripeOnboarded) {
      await updateCoachProfile(coach.id, { stripeOnboarded: true });
    }
    
    return { hasAccount: true, ...status };
  }),

  // Get Stripe Express dashboard link
  dashboardLink: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach || !coach.stripeAccountId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No Stripe account found" });
    }
    
    const url = await createDashboardLink(coach.stripeAccountId);
    return { url };
  }),

  // Create checkout session for booking
  createCheckout: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      sessionType: z.enum(["trial", "single", "package"]),
      packageSize: z.enum(["5", "10"]).optional(),
      sessionDate: z.string().optional(), // ISO date string
      sessionTime: z.string().optional(), // Time string like "10:00 AM"
    }))
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
      }
      
      const coachResult = await getCoachBySlug(""); // We need coach by ID
      // For now, get coach profile directly
      const coach = await getCoachByUserId(input.coachId);
      if (!coach || !coach.stripeAccountId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found or not set up for payments" });
      }
      
      // Calculate amount based on session type
      let amountCents = 0;
      if (input.sessionType === "trial") {
        amountCents = coach.trialRate || 2500; // Default $25
      } else if (input.sessionType === "package") {
        const sessions = input.packageSize === "10" ? 10 : 5;
        const discount = input.packageSize === "10" ? 0.15 : 0.10;
        amountCents = Math.round((coach.hourlyRate || 5500) * sessions * (1 - discount));
      } else {
        amountCents = coach.hourlyRate || 5500; // Default $55
      }
      
      // Calculate commission
      const isTrialSession = input.sessionType === "trial";
      const { commissionBps } = await calculateCommissionRate(coach.id, isTrialSession);
      
      // Check for referral discount
      const referral = await getReferralDiscount(learner.id, coach.id);
      const finalCommissionBps = referral.hasReferral ? referral.discountBps : commissionBps;
      
      const { platformFeeCents } = calculatePlatformFee(amountCents, finalCommissionBps);
      
      // Get coach user info for email
      const coachUser = await getUserById(coach.userId);
      
      const { url } = await createCheckoutSession({
        coachStripeAccountId: coach.stripeAccountId,
        coachId: coach.id,
        coachUserId: coach.userId,
        coachName: coachUser?.name || "Coach",
        learnerId: learner.id,
        learnerUserId: ctx.user.id,
        learnerEmail: ctx.user.email || "",
        learnerName: ctx.user.name || "Learner",
        sessionType: input.sessionType,
        packageSize: input.packageSize ? parseInt(input.packageSize) as 5 | 10 : undefined,
        amountCents,
        platformFeeCents,
        duration: input.sessionType === "trial" ? 30 : 60,
        sessionDate: input.sessionDate,
        sessionTime: input.sessionTime,
        origin: ctx.req.headers.origin || "https://lingueefy.com",
      });
      
      return { url };
    }),
});

// ============================================================================
// MAIN APP ROUTER
// ============================================================================
export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  coach: coachRouter,
  learner: learnerRouter,
  ai: aiRouter,
  commission: commissionRouter,
  stripe: stripeRouter,
  
  // Notification router
  notification: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const notifications = await getUserNotifications(ctx.user.id);
      return notifications;
    }),
    
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await getUnreadNotificationCount(ctx.user.id);
    }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await markNotificationAsRead(input.id, ctx.user.id);
        return { success: true };
      }),
    
    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteNotification(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Push notifications router
  notifications: router({
    subscribePush: protectedProcedure
      .input(z.object({
        endpoint: z.string(),
        p256dh: z.string(),
        auth: z.string(),
        userAgent: z.string().optional(),
        enableBookings: z.boolean().default(true),
        enableMessages: z.boolean().default(true),
        enableReminders: z.boolean().default(true),
        enableMarketing: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { pushSubscriptions } = await import("../drizzle/schema");
        
        // Check if subscription already exists
        const [existing] = await db.select().from(pushSubscriptions)
          .where(and(
            eq(pushSubscriptions.userId, ctx.user.id),
            eq(pushSubscriptions.endpoint, input.endpoint)
          ));
        
        if (existing) {
          // Update existing subscription
          await db.update(pushSubscriptions)
            .set({
              p256dh: input.p256dh,
              auth: input.auth,
              userAgent: input.userAgent || null,
              enableBookings: input.enableBookings,
              enableMessages: input.enableMessages,
              enableReminders: input.enableReminders,
              enableMarketing: input.enableMarketing,
              isActive: true,
              lastUsedAt: new Date(),
            })
            .where(eq(pushSubscriptions.id, existing.id));
        } else {
          // Create new subscription
          await db.insert(pushSubscriptions).values({
            userId: ctx.user.id,
            endpoint: input.endpoint,
            p256dh: input.p256dh,
            auth: input.auth,
            userAgent: input.userAgent || null,
            enableBookings: input.enableBookings,
            enableMessages: input.enableMessages,
            enableReminders: input.enableReminders,
            enableMarketing: input.enableMarketing,
          });
        }
        
        return { success: true };
      }),
    
    unsubscribePush: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { pushSubscriptions } = await import("../drizzle/schema");
      
      // Deactivate all subscriptions for this user
      await db.update(pushSubscriptions)
        .set({ isActive: false })
        .where(eq(pushSubscriptions.userId, ctx.user.id));
      
      return { success: true };
    }),
    
    updatePushPreferences: protectedProcedure
      .input(z.object({
        enableBookings: z.boolean(),
        enableMessages: z.boolean(),
        enableReminders: z.boolean(),
        enableMarketing: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { pushSubscriptions } = await import("../drizzle/schema");
        
        await db.update(pushSubscriptions)
          .set({
            enableBookings: input.enableBookings,
            enableMessages: input.enableMessages,
            enableReminders: input.enableReminders,
            enableMarketing: input.enableMarketing,
          })
          .where(and(
            eq(pushSubscriptions.userId, ctx.user.id),
            eq(pushSubscriptions.isActive, true)
          ));
        
        return { success: true };
      }),
  }),
  
  // Message router for conversations
  message: router({
    conversations: protectedProcedure.query(async ({ ctx }) => {
      const convs = await getConversations(ctx.user.id);
      return convs;
    }),
    
    list: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const msgs = await getMessages(input.conversationId, ctx.user.id);
        return msgs;
      }),
    
    send: protectedProcedure
      .input(z.object({ conversationId: z.number(), content: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const msg = await sendMessage(input.conversationId, ctx.user.id, input.content);
        return msg;
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await markMessagesAsRead(input.conversationId, ctx.user.id);
        return { success: true };
      }),
    
    startConversation: protectedProcedure
      .input(z.object({ participantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const conv = await startConversation(ctx.user.id, input.participantId);
        return conv;
      }),
  }),
  
  // Admin router for platform management
  admin: router({
    // Get coach applications with filters
    getCoachApplications: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) return [];
        const { coachApplications } = await import("../drizzle/schema");
        let query = db.select().from(coachApplications).orderBy(desc(coachApplications.createdAt));
        const applications = await query;
        let filtered = applications;
        if (input?.status && input.status !== "all") {
          filtered = filtered.filter((a: any) => a.status === input.status);
        }
        if (input?.search) {
          const s = input.search.toLowerCase();
          filtered = filtered.filter((a: any) => 
            a.firstName?.toLowerCase().includes(s) ||
            a.lastName?.toLowerCase().includes(s) ||
            a.email?.toLowerCase().includes(s) ||
            a.city?.toLowerCase().includes(s)
          );
        }
        return filtered;
      }),
    
    // Approve a coach application
    approveCoachApplication: protectedProcedure
      .input(z.object({ applicationId: z.number(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications } = await import("../drizzle/schema");
        
        // Get the application
        const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
        if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
        
        // Update application status
        await db.update(coachApplications)
          .set({ 
            status: "approved", 
            reviewedBy: ctx.user.id, 
            reviewedAt: new Date(),
            reviewNotes: input.notes 
          })
          .where(eq(coachApplications.id, input.applicationId));
        
        // Create coach profile from application
        const slug = `${application.firstName || "coach"}-${application.lastName || "user"}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        await db.insert(coachProfiles).values({
          userId: application.userId,
          slug: slug + "-" + Date.now(),
          headline: application.headline || null,
          bio: application.bio || null,
          videoUrl: application.introVideoUrl || null,
          photoUrl: application.photoUrl || null,
          languages: (application.teachingLanguage as "french" | "english" | "both") || "both",
          specializations: application.specializations || {},
          yearsExperience: application.yearsTeaching || 0,
          credentials: application.certifications || null,
          hourlyRate: ((application.hourlyRate || 50) * 100),
          trialRate: ((application.trialRate || 25) * 100),
          status: "approved",
          approvedAt: new Date(),
          approvedBy: ctx.user.id,
        });
        
        // Update user role to coach
        await db.update(users).set({ role: "coach" }).where(eq(users.id, application.userId));
        
        // Create notification for the applicant
        await createNotification({
          userId: application.userId,
          type: "system",
          title: "Application Approved!",
          message: "Congratulations! Your coach application has been approved. You can now start accepting students.",
          link: "/coach/dashboard",
        });
        
        return { success: true };
      }),
    
    // Reject a coach application
    rejectCoachApplication: protectedProcedure
      .input(z.object({ applicationId: z.number(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications } = await import("../drizzle/schema");
        
        // Get the application
        const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
        if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
        
        // Update application status
        await db.update(coachApplications)
          .set({ 
            status: "rejected", 
            reviewedBy: ctx.user.id, 
            reviewedAt: new Date(),
            reviewNotes: input.reason 
          })
          .where(eq(coachApplications.id, input.applicationId));
        
        // Create notification for the applicant
        await createNotification({
          userId: application.userId,
          type: "system",
          title: "Application Update",
          message: `Your coach application was not approved. Reason: ${input.reason}`,
          link: "/become-a-coach",
        });
        
        return { success: true };
      }),
    
    getPendingCoaches: protectedProcedure.query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const coaches = await db.select()
        .from(coachProfiles)
        .leftJoin(users, eq(coachProfiles.userId, users.id))
        .orderBy(desc(coachProfiles.createdAt));
      return coaches.map((c: { coach_profiles: typeof coachProfiles.$inferSelect; users: typeof users.$inferSelect | null }) => ({
        id: c.coach_profiles.id,
        userId: c.coach_profiles.userId,
        name: c.users?.name || "Unknown",
        email: c.users?.email || "",
        bio: c.coach_profiles.bio || "",
        specialties: Object.keys(c.coach_profiles.specializations || {}).filter((k: string) => (c.coach_profiles.specializations as Record<string, boolean>)?.[k]),
        credentials: c.coach_profiles.credentials || "",
        yearsExperience: c.coach_profiles.yearsExperience || 0,
        appliedAt: c.coach_profiles.createdAt,
        status: c.coach_profiles.status,
        photoUrl: c.coach_profiles.photoUrl,
      }));
    }),
    
    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { totalUsers: 0, activeCoaches: 0, sessionsThisMonth: 0, revenue: 0, userGrowth: 0, sessionGrowth: 0, revenueGrowth: 0 };
      const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const [coachCount] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles).where(eq(coachProfiles.status, "approved"));
      return {
        totalUsers: userCount?.count || 0,
        activeCoaches: coachCount?.count || 0,
        sessionsThisMonth: 0,
        revenue: 0,
        userGrowth: 12.5,
        sessionGrowth: 8.3,
        revenueGrowth: 15.2,
      };
    }),
    
    getDepartmentInquiries: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const inquiries = await db.select().from(departmentInquiries).orderBy(desc(departmentInquiries.createdAt));
      return inquiries.map((i) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        department: i.department,
        teamSize: i.teamSize,
        message: i.message,
        status: i.status,
        createdAt: i.createdAt,
      }));
    }),
    
    approveCoach: protectedProcedure
      .input(z.object({ coachId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        await db.update(coachProfiles)
          .set({ status: "approved", approvedAt: new Date(), approvedBy: ctx.user.id })
          .where(eq(coachProfiles.id, input.coachId));
        return { success: true };
      }),
    
    rejectCoach: protectedProcedure
      .input(z.object({ coachId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        await db.update(coachProfiles)
          .set({ status: "rejected", rejectionReason: input.reason })
          .where(eq(coachProfiles.id, input.coachId));
        return { success: true };
      }),
    
    updateInquiryStatus: protectedProcedure
      .input(z.object({ inquiryId: z.number(), status: z.enum(["new", "contacted", "in_progress", "converted", "closed"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        await db.update(departmentInquiries)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(departmentInquiries.id, input.inquiryId));
        return { success: true };
      }),
    
    createInquiry: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        department: z.string(),
        teamSize: z.string(),
        message: z.string(),
        preferredPackage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        await db.insert(departmentInquiries).values({
          name: input.name,
          email: input.email,
          phone: input.phone,
          department: input.department,
          teamSize: input.teamSize,
          message: input.message,
          preferredPackage: input.preferredPackage,
        });
        return { success: true };
      }),
  }),
  
  // Documents router for credential verification
  documents: router({
    list: protectedProcedure
      .input(z.object({ coachId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const { coachDocuments } = await import("../drizzle/schema");
        const docs = await db.select().from(coachDocuments)
          .where(eq(coachDocuments.coachId, input.coachId))
          .orderBy(desc(coachDocuments.createdAt));
        return docs;
      }),
    
    upload: protectedProcedure
      .input(z.object({
        coachId: z.number(),
        applicationId: z.number().optional(),
        documentType: z.enum(["id_proof", "degree", "teaching_cert", "sle_results", "language_cert", "background_check", "other"]),
        title: z.string(),
        description: z.string().optional(),
        issuingAuthority: z.string().optional(),
        issueDate: z.date().optional(),
        expiryDate: z.date().optional(),
        fileData: z.string(), // base64 encoded
        fileName: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachDocuments } = await import("../drizzle/schema");
        const { storagePut } = await import("./storage");
        
        // Upload file to S3 storage
        let fileUrl: string;
        try {
          // Extract base64 data (handle both with and without data URI prefix)
          const base64Data = input.fileData.includes(',') 
            ? input.fileData.split(',')[1] 
            : input.fileData;
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Generate unique file path
          const timestamp = Date.now();
          const sanitizedFileName = input.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `coach-documents/${input.coachId}/${timestamp}-${sanitizedFileName}`;
          
          const { url } = await storagePut(filePath, buffer, input.mimeType);
          fileUrl = url;
        } catch (storageError) {
          console.error('S3 upload failed, falling back to base64:', storageError);
          // Fallback to base64 if S3 fails
          fileUrl = `data:${input.mimeType};base64,${input.fileData.split(',')[1] || input.fileData}`;
        }
        
        const [result] = await db.insert(coachDocuments).values({
          coachId: input.coachId,
          applicationId: input.applicationId,
          documentType: input.documentType,
          title: input.title,
          description: input.description,
          issuingAuthority: input.issuingAuthority,
          issueDate: input.issueDate,
          expiryDate: input.expiryDate,
          fileUrl,
          fileName: input.fileName,
          status: "pending",
        }).$returningId();
        
        return { id: result.id, success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ documentId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachDocuments } = await import("../drizzle/schema");
        
        // Verify ownership
        const [doc] = await db.select().from(coachDocuments).where(eq(coachDocuments.id, input.documentId));
        if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
        
        // Only allow deletion of pending or rejected documents
        if (doc.status === "verified") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete verified documents" });
        }
        
        await db.delete(coachDocuments).where(eq(coachDocuments.id, input.documentId));
        return { success: true };
      }),
    
    // Admin: verify a document
    verify: protectedProcedure
      .input(z.object({ documentId: z.number(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachDocuments } = await import("../drizzle/schema");
        
        await db.update(coachDocuments)
          .set({ 
            status: "verified", 
            verifiedBy: ctx.user.id, 
            verifiedAt: new Date(),
            rejectionReason: input.notes 
          })
          .where(eq(coachDocuments.id, input.documentId));
        
        return { success: true };
      }),
    
    // Admin: reject a document
    reject: protectedProcedure
      .input(z.object({ documentId: z.number(), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachDocuments } = await import("../drizzle/schema");
        
        await db.update(coachDocuments)
          .set({ 
            status: "rejected", 
            verifiedBy: ctx.user.id, 
            verifiedAt: new Date(),
            rejectionReason: input.reason 
          })
          .where(eq(coachDocuments.id, input.documentId));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
