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
import { coachProfiles, users, sessions, departmentInquiries, learnerProfiles, payoutLedger, learnerFavorites } from "../drizzle/schema";
import { eq, desc, sql, asc, and, gte } from "drizzle-orm";

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

  // Get current user's application status (for applicants)
  getApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const { coachApplications } = await import("../drizzle/schema");
    
    // Get the most recent application for this user
    const [application] = await db
      .select()
      .from(coachApplications)
      .where(eq(coachApplications.userId, ctx.user.id))
      .orderBy(desc(coachApplications.createdAt))
      .limit(1);
    
    if (!application) return null;
    
    return {
      id: application.id,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      reviewedAt: application.reviewedAt,
      reviewNotes: application.reviewNotes,
      fullName: application.fullName,
      email: application.email,
    };
  }),

  // Get application timeline (for tracking progress)
  getApplicationTimeline: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const { coachApplications } = await import("../drizzle/schema");
    
    // Get all applications for this user
    const applications = await db
      .select()
      .from(coachApplications)
      .where(eq(coachApplications.userId, ctx.user.id))
      .orderBy(asc(coachApplications.createdAt));
    
    return applications.map((app) => ({
      id: app.id,
      status: app.status,
      timestamp: app.status === 'submitted' ? app.createdAt : 
                 app.status === 'under_review' ? app.updatedAt :
                 app.reviewedAt || app.updatedAt,
      message: app.status === 'submitted' ? 'Application submitted' :
               app.status === 'under_review' ? 'Application under review' :
               app.status === 'approved' ? 'Application approved! Welcome to Lingueefy' :
               app.status === 'rejected' ? `Application rejected: ${app.reviewNotes || 'No reason provided'}` :
               'Unknown status',
      icon: app.status === 'submitted' ? 'check' :
            app.status === 'under_review' ? 'clock' :
            app.status === 'approved' ? 'checkCircle' :
            app.status === 'rejected' ? 'x' :
            'help',
    }));
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
    
    const { loyaltyPoints } = await import("../drizzle/schema");
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
    
    const { loyaltyRewards } = await import("../drizzle/schema");
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
    
    const { pointTransactions } = await import("../drizzle/schema");
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
      
      const { loyaltyPoints, loyaltyRewards, redeemedRewards, pointTransactions } = await import("../drizzle/schema");
      
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
    
    const { referralInvitations } = await import("../drizzle/schema");
    
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
    const { referralInvitations } = await import("../drizzle/schema");
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
      
      const { referralInvitations } = await import("../drizzle/schema");
      
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
      const { sendReferralInviteEmail } = await import("./email");
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
    
    const { challenges, userChallenges } = await import("../drizzle/schema");
    
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
      
      const { userChallenges, challenges, loyaltyPoints, pointTransactions } = await import("../drizzle/schema");
      
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
      
      const { loyaltyPoints, learnerProfiles, users, sessions } = await import("../drizzle/schema");
      
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
    
    const { learnerProfiles } = await import("../drizzle/schema");
    
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
    
    const { learnerProfiles } = await import("../drizzle/schema");
    
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
    
    const { learnerProfiles, pointTransactions, loyaltyPoints } = await import("../drizzle/schema");
    
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
  // Validate coupon code
  validateCoupon: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { promoCoupons } = await import("../drizzle/schema");
      
      const [coupon] = await db.select().from(promoCoupons)
        .where(and(
          eq(promoCoupons.code, input.code.toUpperCase()),
          eq(promoCoupons.isActive, true)
        ));
      
      if (!coupon) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid coupon code" });
      }
      
      // Check expiry
      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This coupon has expired" });
      }
      
      // Check usage limit
      if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This coupon has reached its usage limit" });
      }
      
      return {
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
      };
    }),

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
      couponId: z.number().optional(), // Promo coupon ID
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
      
      // Apply coupon discount if provided
      let couponDiscountCents = 0;
      if (input.couponId) {
        const db = await getDb();
        if (db) {
          const { promoCoupons, couponRedemptions } = await import("../drizzle/schema");
          const [coupon] = await db.select().from(promoCoupons).where(eq(promoCoupons.id, input.couponId));
          
          if (coupon && coupon.isActive) {
            if (coupon.discountType === "percentage") {
              couponDiscountCents = Math.round(amountCents * coupon.discountValue / 100);
            } else if (coupon.discountType === "fixed_amount") {
              couponDiscountCents = coupon.discountValue;
            } else if (coupon.discountType === "free_trial" && input.sessionType === "trial") {
              couponDiscountCents = amountCents;
            }
            
            // Record redemption
            const originalAmountCents = amountCents;
            const finalAmountCents = Math.max(0, amountCents - couponDiscountCents);
            await db.insert(couponRedemptions).values({
              couponId: coupon.id,
              userId: ctx.user.id,
              discountAmount: couponDiscountCents,
              originalAmount: originalAmountCents,
              finalAmount: finalAmountCents,
            });
            
            // Increment usage count
            await db.update(promoCoupons)
              .set({ usedCount: (coupon.usedCount || 0) + 1 })
              .where(eq(promoCoupons.id, coupon.id));
          }
        }
      }
      
      // Apply coupon discount
      amountCents = Math.max(0, amountCents - couponDiscountCents);
      
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
    
    // In-app notifications
    getInAppNotifications: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { inAppNotifications } = await import("../drizzle/schema");
      
      const notifications = await db.select().from(inAppNotifications)
        .where(eq(inAppNotifications.userId, ctx.user.id))
        .orderBy(desc(inAppNotifications.createdAt))
        .limit(50);
      
      return notifications;
    }),
    
    markNotificationRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { inAppNotifications } = await import("../drizzle/schema");
        
        await db.update(inAppNotifications)
          .set({ isRead: true })
          .where(and(
            eq(inAppNotifications.id, input.notificationId),
            eq(inAppNotifications.userId, ctx.user.id)
          ));
        
        return { success: true };
      }),
    
    markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { inAppNotifications } = await import("../drizzle/schema");
      
      await db.update(inAppNotifications)
        .set({ isRead: true })
        .where(eq(inAppNotifications.userId, ctx.user.id));
      
      return { success: true };
    }),
    
    deleteNotification: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { inAppNotifications } = await import("../drizzle/schema");
        
        await db.delete(inAppNotifications)
          .where(and(
            eq(inAppNotifications.id, input.notificationId),
            eq(inAppNotifications.userId, ctx.user.id)
          ));
        
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
        const { sendApplicationStatusEmail } = await import("./email-application-notifications");
        
        // Get the application
        const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
        if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
        const [user] = await db.select().from(users).where(eq(users.id, application.userId));
        
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
        
        // Send approval email
        if (user && application.email) {
          await sendApplicationStatusEmail({
            applicantName: application.fullName || `${application.firstName} ${application.lastName}`,
            applicantEmail: application.email,
            status: "approved",
            reviewNotes: input.notes,
            language: "en",
          });
        }
        
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
        const { sendApplicationStatusEmail } = await import("./email-application-notifications");
        
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
        
        // Send rejection email
        if (application.email) {
          await sendApplicationStatusEmail({
            applicantName: application.fullName || `${application.firstName} ${application.lastName}`,
            applicantEmail: application.email,
            status: "rejected",
            rejectionReason: input.reason,
            language: "en",
          });
        }
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
    
    // Get all promo coupons
    getCoupons: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return [];
      const { promoCoupons } = await import("../drizzle/schema");
      return await db.select().from(promoCoupons).orderBy(desc(promoCoupons.createdAt));
    }),
    
    // Create a new coupon
    createCoupon: protectedProcedure
      .input(z.object({
        code: z.string().min(3).max(50),
        name: z.string().min(1).max(100),
        description: z.string().nullable(),
        descriptionFr: z.string().nullable(),
        discountType: z.enum(["percentage", "fixed_amount", "free_trial"]),
        discountValue: z.number().min(0),
        maxUses: z.number().nullable(),
        maxUsesPerUser: z.number().default(1),
        minPurchaseAmount: z.number().nullable(),
        validUntil: z.date().nullable(),
        applicableTo: z.enum(["all", "trial", "single", "package"]),
        newUsersOnly: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { promoCoupons } = await import("../drizzle/schema");
        
        // Check if code already exists
        const [existing] = await db.select().from(promoCoupons).where(eq(promoCoupons.code, input.code.toUpperCase()));
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Coupon code already exists" });
        }
        
        await db.insert(promoCoupons).values({
          code: input.code.toUpperCase(),
          name: input.name,
          description: input.description,
          descriptionFr: input.descriptionFr,
          discountType: input.discountType,
          discountValue: input.discountValue,
          maxUses: input.maxUses,
          maxUsesPerUser: input.maxUsesPerUser,
          minPurchaseAmount: input.minPurchaseAmount,
          validUntil: input.validUntil,
          applicableTo: input.applicableTo,
          newUsersOnly: input.newUsersOnly,
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),
    
    // Update a coupon
    updateCoupon: protectedProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().min(3).max(50),
        name: z.string().min(1).max(100),
        description: z.string().nullable(),
        descriptionFr: z.string().nullable(),
        discountType: z.enum(["percentage", "fixed_amount", "free_trial"]),
        discountValue: z.number().min(0),
        maxUses: z.number().nullable(),
        maxUsesPerUser: z.number().default(1),
        minPurchaseAmount: z.number().nullable(),
        validUntil: z.date().nullable(),
        applicableTo: z.enum(["all", "trial", "single", "package"]),
        newUsersOnly: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { promoCoupons } = await import("../drizzle/schema");
        
        await db.update(promoCoupons).set({
          code: input.code.toUpperCase(),
          name: input.name,
          description: input.description,
          descriptionFr: input.descriptionFr,
          discountType: input.discountType,
          discountValue: input.discountValue,
          maxUses: input.maxUses,
          maxUsesPerUser: input.maxUsesPerUser,
          minPurchaseAmount: input.minPurchaseAmount,
          validUntil: input.validUntil,
          applicableTo: input.applicableTo,
          newUsersOnly: input.newUsersOnly,
        }).where(eq(promoCoupons.id, input.id));
        return { success: true };
      }),
    
    // Toggle coupon active status
    toggleCoupon: protectedProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { promoCoupons } = await import("../drizzle/schema");
        await db.update(promoCoupons).set({ isActive: input.isActive }).where(eq(promoCoupons.id, input.id));
        return { success: true };
      }),
    
    // Delete a coupon
    deleteCoupon: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { promoCoupons } = await import("../drizzle/schema");
        await db.delete(promoCoupons).where(eq(promoCoupons.id, input.id));
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

    // Get detailed application info for dashboard
    getApplicationDetail: protectedProcedure
      .input(z.object({ applicationId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications, users } = await import("../drizzle/schema");
        
        const [application] = await db
          .select()
          .from(coachApplications)
          .where(eq(coachApplications.id, input.applicationId))
          .limit(1);
        
        if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
        
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, application.userId))
          .limit(1);
        
        return {
          ...application,
          userName: user?.name || "Unknown",
        };
      }),

    // Get applications with advanced filtering for dashboard
    getApplicationsForDashboard: protectedProcedure
      .input(z.object({
        status: z.enum(["submitted", "under_review", "approved", "rejected", "all"]).optional(),
        language: z.enum(["french", "english", "both", "all"]).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["createdAt", "firstName", "status"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) return { applications: [], total: 0 };
        const { coachApplications } = await import("../drizzle/schema");
        
        // Build filters
        const filters: any[] = [];
        if (input?.status && input.status !== "all") {
          filters.push(eq(coachApplications.status, input.status));
        }
        if (input?.language && input.language !== "all") {
          filters.push(eq(coachApplications.teachingLanguage, input.language));
        }
        
        // Build query
        let query: any = db.select().from(coachApplications);
        
        if (filters.length > 0) {
          query = query.where(and(...filters));
        }
        
        // Apply sorting
        const sortBy = input?.sortBy || "createdAt";
        const sortOrder = input?.sortOrder || "desc";
        const sortColumn = {
          createdAt: coachApplications.createdAt,
          firstName: coachApplications.firstName,
          status: coachApplications.status,
        }[sortBy];
        
        if (sortOrder === "asc") {
          query = query.orderBy(asc(sortColumn));
        } else {
          query = query.orderBy(desc(sortColumn));
        }
        
        // Apply pagination
        query = query.limit(input?.limit || 50).offset(input?.offset || 0);
        
        const applications: any[] = await query;
        
        // Filter by search term (client-side for now)
        let filtered = applications;
        if (input?.search) {
          const s = input.search.toLowerCase();
          filtered = filtered.filter((a: any) => 
            a.firstName?.toLowerCase().includes(s) ||
            a.lastName?.toLowerCase().includes(s) ||
            a.email?.toLowerCase().includes(s) ||
            a.fullName?.toLowerCase().includes(s)
          );
        }
        
        // Get total count
        const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications);
        const total = countResult?.count || 0;
        
        return { applications: filtered, total };
      }),

    // Bulk approve applications
    bulkApproveApplications: protectedProcedure
      .input(z.object({ applicationIds: z.array(z.number()), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications, coachProfiles } = await import("../drizzle/schema");
        
        const results = { approved: 0, failed: 0, errors: [] as string[] };
        
        for (const applicationId of input.applicationIds) {
          try {
            const [application] = await db
              .select()
              .from(coachApplications)
              .where(eq(coachApplications.id, applicationId));
            
            if (!application) {
              results.failed++;
              results.errors.push(`Application ${applicationId} not found`);
              continue;
            }
            
            // Update application status
            await db.update(coachApplications)
              .set({
                status: "approved",
                reviewedBy: ctx.user.id,
                reviewedAt: new Date(),
                reviewNotes: input.notes,
              })
              .where(eq(coachApplications.id, applicationId));
            
            // Create coach profile
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
            
            // Update user role
            await db.update(users).set({ role: "coach" }).where(eq(users.id, application.userId));
            
            results.approved++;
          } catch (error) {
            results.failed++;
            results.errors.push(`Failed to approve application ${applicationId}: ${error}`);
          }
        }
        
        return results;
      }),

    // Bulk reject applications
    bulkRejectApplications: protectedProcedure
      .input(z.object({ applicationIds: z.array(z.number()), reason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications } = await import("../drizzle/schema");
        
        const results = { rejected: 0, failed: 0, errors: [] as string[] };
        
        for (const applicationId of input.applicationIds) {
          try {
            await db.update(coachApplications)
              .set({
                status: "rejected",
                reviewedBy: ctx.user.id,
                reviewedAt: new Date(),
                reviewNotes: input.reason,
              })
              .where(eq(coachApplications.id, applicationId));
            
            results.rejected++;
          } catch (error) {
            results.failed++;
            results.errors.push(`Failed to reject application ${applicationId}: ${error}`);
          }
        }
        
        return results;
      }),

    // Get application statistics
    getApplicationStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 };
      const { coachApplications } = await import("../drizzle/schema");
      
      const [total] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications);
      const [submitted] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications).where(eq(coachApplications.status, "submitted"));
      const [underReview] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications).where(eq(coachApplications.status, "under_review"));
      const [approved] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications).where(eq(coachApplications.status, "approved"));
      const [rejected] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications).where(eq(coachApplications.status, "rejected"));
      
      return {
        total: total?.count || 0,
        submitted: submitted?.count || 0,
        underReview: underReview?.count || 0,
        approved: approved?.count || 0,
        rejected: rejected?.count || 0,
      };
    }),
    
    
    // Export applications to CSV
    exportApplicationsCSV: protectedProcedure
      .input(z.object({ 
        status: z.enum(["all", "submitted", "under_review", "approved", "rejected"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        const { coachApplications } = await import("../drizzle/schema");
        const { generateApplicationsCSV, generateExportFilename } = await import("./export-applications");
        
        // Get all applications
        const allApps = await db.select().from(coachApplications).orderBy(desc(coachApplications.createdAt));
        
        // Filter by status
        let filtered = allApps;
        if (input.status && input.status !== "all") {
          filtered = filtered.filter(app => app.status === input.status);
        }
        
        // Filter by date range
        if (input.startDate) {
          const startDate = input.startDate;
          filtered = filtered.filter(app => new Date(app.createdAt) >= startDate);
        }
        if (input.endDate) {
          const endDate = input.endDate;
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          filtered = filtered.filter(app => new Date(app.createdAt) <= endOfDay);
        }
        
        // Generate CSV
        const csvContent = generateApplicationsCSV(filtered as any);
        const filename = generateExportFilename(input.status, input.startDate, input.endDate);
        
        return {
          csvContent,
          filename,
          count: filtered.length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
