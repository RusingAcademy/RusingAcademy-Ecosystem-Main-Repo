import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getDb,
  getApprovedCoaches,
  getCoachBySlug,
  getCoachReviews,
  canLearnerReviewCoach,
  getLearnerReviewForCoach,
  createReview,
  updateReview,
  getCoachByUserId,
  getLearnerByUserId,
  updateCoachProfile,
  getApplicationStatus,
  getApplicationTimeline,
  getGalleryPhotos,
  deleteGalleryPhoto,
  getCoachAvailability,
  setCoachAvailability,
  getAvailableTimeSlotsForDate,
  getUserById,
  getUpcomingSessions,
  getTodaysSessions,
  getMonthSessions,
  getPendingRequests,
  getMyLearners,
  getSessionNotes,
  getCoachEarningsSummary,
  getCoachPayoutLedger,
  getMyProfile,
  createNotification,
  getCalendarSettings,
  updateCalendarSettings,
} from "../db";
import { coachProfiles, users, sessions, learnerProfiles, payoutLedger } from "../../drizzle/schema";
import { eq, desc, sql, asc, and, gte, inArray, or } from "drizzle-orm";
import { createLogger } from "../logger";
const log = createLogger("routers-coach");

export const coachRouter = router({
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
        headlineFr: coach.headlineFr,
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

  // Create coach application (not profile directly - requires admin approval)
  submitApplication: protectedProcedure
    .input(
      z.object({
        // Personal Info
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        // Professional Background
        education: z.string().optional(),
        certifications: z.string().optional(),
        yearsTeaching: z.number().optional(),
        // Language
        nativeLanguage: z.string().optional(),
        teachingLanguage: z.string().optional(),
        sleOralLevel: z.string().optional(),
        sleWrittenLevel: z.string().optional(),
        sleReadingLevel: z.string().optional(),
        // Profile Content
        headline: z.string().min(10).max(200),
        headlineFr: z.string().max(200).optional(),
        bio: z.string().min(50).max(2000),
        bioFr: z.string().max(2000).optional(),
        teachingPhilosophy: z.string().optional(),
        uniqueValue: z.string().optional(),
        // Pricing & Availability
        languages: z.enum(["french", "english", "both"]),
        specializations: z.record(z.string(), z.boolean()),
        yearsExperience: z.number().min(0).max(50),
        credentials: z.string().max(500),
        hourlyRate: z.number().min(2000).max(20000), // $20-$200 in cents
        trialRate: z.number().min(0).max(10000),
        weeklyHours: z.number().optional(),
        availableDays: z.array(z.string()).optional(),
        availableTimeSlots: z.array(z.string()).optional(),
        // Media
        photoUrl: z.string().optional(),
        videoUrl: z.string().url().optional(),
        calendlyUrl: z.string().url().optional(),
        // Legal
        termsAccepted: z.boolean().optional(),
        privacyAccepted: z.boolean().optional(),
        backgroundCheckConsent: z.boolean().optional(),
        codeOfConductAccepted: z.boolean().optional(),
        commissionAccepted: z.boolean().optional(),
        digitalSignature: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { coachApplications } = await import("../../drizzle/schema");
      const { sendApplicationStatusEmail } = await import("../email-application-notifications");
      
      // Check if user already has a pending application
      const [existingApp] = await db.select().from(coachApplications)
        .where(eq(coachApplications.userId, ctx.user.id))
        .orderBy(desc(coachApplications.createdAt))
        .limit(1);
      
      if (existingApp && (existingApp.status === "submitted" || existingApp.status === "under_review")) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a pending application",
        });
      }
      
      // Check if user already has a coach profile
      const existingProfile = await getCoachByUserId(ctx.user.id);
      if (existingProfile) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a coach profile",
        });
      }
      
      // Get user info
      const user = await getUserById(ctx.user.id);
      const fullName = input.firstName && input.lastName 
        ? `${input.firstName} ${input.lastName}` 
        : user?.name || "Unknown";
      const email = user?.email || "unknown@email.com";
      
      // Create application in coachApplications table
      await db.insert(coachApplications).values({
        userId: ctx.user.id,
        firstName: input.firstName || user?.name?.split(" ")[0] || null,
        lastName: input.lastName || user?.name?.split(" ").slice(1).join(" ") || null,
        fullName,
        email,
        phone: input.phone || null,
        city: input.city || null,
        country: "Canada",
        education: input.education || null,
        certifications: input.certifications || input.credentials || null,
        yearsTeaching: input.yearsTeaching || input.yearsExperience || 0,
        nativeLanguage: input.nativeLanguage || null,
        teachingLanguage: input.teachingLanguage || input.languages || null,
        specializations: input.specializations,
        hourlyRate: Math.round(input.hourlyRate / 100), // Convert cents to dollars
        trialRate: Math.round(input.trialRate / 100),
        weeklyHours: input.weeklyHours || null,
        headline: input.headline,
        headlineFr: input.headlineFr || null,
        bio: input.bio,
        bioFr: input.bioFr || null,
        teachingPhilosophy: input.teachingPhilosophy || null,
        uniqueValue: input.uniqueValue || null,
        sleOralLevel: input.sleOralLevel || null,
        sleWrittenLevel: input.sleWrittenLevel || null,
        sleReadingLevel: input.sleReadingLevel || null,
        photoUrl: input.photoUrl || null,
        introVideoUrl: input.videoUrl || null,
        termsAccepted: input.termsAccepted || false,
        privacyAccepted: input.privacyAccepted || false,
        backgroundCheckConsent: input.backgroundCheckConsent || false,
        codeOfConductAccepted: input.codeOfConductAccepted || false,
        commissionAccepted: input.commissionAccepted || false,
        digitalSignature: input.digitalSignature || null,
        termsAcceptedAt: input.termsAccepted ? new Date() : null,
        termsVersion: input.termsAccepted ? "2026-02-09" : null,
        status: "submitted",
      });
      
      // Send confirmation email to applicant
      const userLang = user?.preferredLanguage || "en";
      await sendApplicationStatusEmail({
        applicantName: fullName,
        applicantEmail: email,
        status: "submitted",
        language: userLang as "en" | "fr",
      });
      
      // Create notification for the applicant
      await createNotification({
        userId: ctx.user.id,
        type: "system",
        title: userLang === "fr" ? "Candidature soumise" : "Application Submitted",
        message: userLang === "fr" 
          ? "Votre candidature de coach a été soumise avec succès. Nous l'examinerons dans les 5-7 jours ouvrables."
          : "Your coach application has been submitted successfully. We will review it within 5-7 business days.",
        link: "/become-a-coach",
      });
      
      // Notify admin/owner about new application
      const { notifyOwner } = await import("../_core/notification");
      await notifyOwner({
        title: "New Coach Application",
        content: `${fullName} (${email}) has submitted a coach application. Review it in the admin dashboard.`,
      });

      return { success: true };
    }),

  // Update coach profile
  update: protectedProcedure
    .input(
      z.object({
        headline: z.string().max(200).optional(),
        headlineFr: z.string().max(200).optional(),
        bio: z.string().max(2000).optional(),
        bioFr: z.string().max(2000).optional(),
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

      const { storagePut } = await import("../storage");
      
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

  // Upload media during application process (before coach profile exists)
  uploadApplicationMedia: protectedProcedure
    .input(z.object({
      fileData: z.string(), // base64 encoded
      fileName: z.string(),
      mimeType: z.string(),
      mediaType: z.enum(["photo", "video"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { storagePut } = await import("../storage");
      
      // Extract base64 data
      const base64Data = input.fileData.includes(',') 
        ? input.fileData.split(',')[1] 
        : input.fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Validate file size (5MB for photos, 100MB for videos)
      const maxSize = input.mediaType === "photo" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
      if (buffer.length > maxSize) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `File too large. Maximum size: ${input.mediaType === "photo" ? "5MB" : "100MB"}`,
        });
      }
      
      // Generate unique file path
      const timestamp = Date.now();
      const ext = input.fileName.split('.').pop() || (input.mediaType === "photo" ? 'jpg' : 'mp4');
      const folder = input.mediaType === "photo" ? "coach-application-photos" : "coach-application-videos";
      const filePath = `${folder}/${ctx.user.id}/${timestamp}.${ext}`;
      
      const { url } = await storagePut(filePath, buffer, input.mimeType);
      
      return { success: true, url };
    }),

  // Get coach gallery photos
  getGalleryPhotos: publicProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const { coachGalleryPhotos } = await import("../../drizzle/schema");
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
      const { coachGalleryPhotos } = await import("../../drizzle/schema");

      // Check photo count (max 10)
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(coachGalleryPhotos)
        .where(eq(coachGalleryPhotos.coachId, input.coachId));
      if ((countResult?.count || 0) >= 10) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Maximum 10 photos allowed" });
      }

      const { storagePut } = await import("../storage");
      
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
      const { coachGalleryPhotos } = await import("../../drizzle/schema");

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
      const { sessionNotes, sessions: sessionsTable } = await import("../../drizzle/schema");

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
      const { sessionNotes, sessions: sessionsTable } = await import("../../drizzle/schema");

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
    const { coachApplications } = await import("../../drizzle/schema");
    
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
    const { coachApplications } = await import("../../drizzle/schema");
    
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
  
  // Get coach profile for dashboard
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    const user = await getUserById(ctx.user.id);
    return {
      ...profile,
      name: user?.name,
      email: user?.email,
      avatarUrl: user?.avatarUrl,
    };
  }),
  
  // Get upcoming sessions for coach dashboard
  getUpcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    const now = new Date();
    const upcomingSessions = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
      status: sessions.status,
      meetingUrl: sessions.meetingUrl,
      learnerName: users.name,
    })
      .from(sessions)
      .leftJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
      .leftJoin(users, eq(learnerProfiles.userId, users.id))
      .where(and(
        eq(sessions.coachId, profile.id),
        gte(sessions.scheduledAt, now),
        inArray(sessions.status, ["pending", "confirmed"])
      ))
      .orderBy(sessions.scheduledAt)
      .limit(20);
    
    return upcomingSessions;
  }),
  
  // Get learners for coach dashboard
  getMyLearners: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    // Get unique learners who have had sessions with this coach
    const learners = await db.selectDistinct({
      id: learnerProfiles.id,
      userId: learnerProfiles.userId,
      name: users.name,
      email: users.email,
      level: learnerProfiles.currentLevel,
    })
      .from(sessions)
      .innerJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
      .innerJoin(users, eq(learnerProfiles.userId, users.id))
      .where(eq(sessions.coachId, profile.id));
    
    // Get session counts for each learner
    const learnersWithCounts = await Promise.all(learners.map(async (learner) => {
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(sessions)
        .where(and(
          eq(sessions.coachId, profile.id),
          eq(sessions.learnerId, learner.id)
        ));
      return {
        ...learner,
        sessionsCount: countResult?.count || 0,
      };
    }));
    
    return learnersWithCounts;
  }),
  
  // Get earnings summary for coach dashboard (Duplicate removed)
  getEarningsSummaryV2: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) return { totalEarnings: 0, pendingPayout: 0, sessionsCompleted: 0, avgRating: null };
    
    const db = await getDb();
    if (!db) return { totalEarnings: 0, pendingPayout: 0, sessionsCompleted: 0, avgRating: null };
    
    // Get total earnings from payout ledger
    const [earningsResult] = await db.select({
      total: sql<number>`COALESCE(SUM(${payoutLedger.netAmount}), 0)`,
    })
      .from(payoutLedger)
      .where(and(
        eq(payoutLedger.coachId, profile.id),
        eq(payoutLedger.status, "completed")
      ));
    
    // Get pending payouts
    const [pendingResult] = await db.select({
      total: sql<number>`COALESCE(SUM(${payoutLedger.netAmount}), 0)`,
    })
      .from(payoutLedger)
      .where(and(
        eq(payoutLedger.coachId, profile.id),
        eq(payoutLedger.status, "pending")
      ));
    
    // Get completed sessions count
    const [sessionsResult] = await db.select({
      count: sql<number>`count(*)`,
    })
      .from(sessions)
      .where(and(
        eq(sessions.coachId, profile.id),
        eq(sessions.status, "completed")
      ));
    
    // Get average rating from coach profile
    const avgRating = profile.averageRating;
    
    return {
      totalEarnings: earningsResult?.total || 0,
      pendingPayout: pendingResult?.total || 0,
      sessionsCompleted: sessionsResult?.count || 0,
      avgRating: avgRating ? parseFloat(avgRating) : null,
    };
  }),

  // Confirm a pending session request
  confirmSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Coach profile not found" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get the session and verify ownership
      const [session] = await db.select()
        .from(sessions)
        .where(and(
          eq(sessions.id, input.sessionId),
          eq(sessions.coachId, profile.id)
        ));

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found or not authorized" });
      }

      if (session.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Session is not pending" });
      }

      // Update session status to confirmed
      await db.update(sessions)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(sessions.id, input.sessionId));

      // Send confirmation email to learner
      const [learner] = await db.select()
        .from(learnerProfiles)
        .leftJoin(users, eq(learnerProfiles.userId, users.id))
        .where(eq(learnerProfiles.id, session.learnerId));

      if (learner?.users?.email) {
        const { sendEmail } = await import("../email");
        await sendEmail({
          to: learner.users.email,
          subject: "Session Confirmed / Session confirmée",
          html: `<p>Your coaching session on ${new Date(session.scheduledAt).toLocaleDateString()} has been confirmed by your coach.</p>
                 <p>Votre session de coaching du ${new Date(session.scheduledAt).toLocaleDateString()} a été confirmée par votre coach.</p>`,
        });
      }

      return { success: true };
    }),

  // Decline a pending session request
  declineSession: protectedProcedure
    .input(z.object({ 
      sessionId: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Coach profile not found" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get the session and verify ownership
      const [session] = await db.select()
        .from(sessions)
        .where(and(
          eq(sessions.id, input.sessionId),
          eq(sessions.coachId, profile.id)
        ));

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found or not authorized" });
      }

      if (session.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Session is not pending" });
      }

      // Update session status to cancelled
      await db.update(sessions)
        .set({ 
          status: "cancelled", 
          cancelledAt: new Date(),
          cancellationReason: input.reason || "Declined by coach",
          updatedAt: new Date() 
        })
        .where(eq(sessions.id, input.sessionId));

      // Process refund if payment exists
      if (session.stripePaymentId) {
        try {
          const stripe = (await import("stripe")).default;
          const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || "");
          await stripeClient.refunds.create({
            payment_intent: session.stripePaymentId,
          });
        } catch (stripeError) {
          log.error("Stripe refund error:", stripeError);
        }
      }

      // Send decline email to learner
      const [learner] = await db.select()
        .from(learnerProfiles)
        .leftJoin(users, eq(learnerProfiles.userId, users.id))
        .where(eq(learnerProfiles.id, session.learnerId));

      if (learner?.users?.email) {
        const { sendEmail } = await import("../email");
        await sendEmail({
          to: learner.users.email,
          subject: "Session Declined / Session refusée",
          html: `<p>Unfortunately, your coaching session request for ${new Date(session.scheduledAt).toLocaleDateString()} has been declined.</p>
                 <p>${input.reason ? `Reason: ${input.reason}` : ""}</p>
                 <p>Malheureusement, votre demande de session de coaching pour le ${new Date(session.scheduledAt).toLocaleDateString()} a été refusée.</p>
                 <p>${input.reason ? `Raison: ${input.reason}` : ""}</p>`,
        });
      }

      return { success: true };
    }),

  // Get pending session requests for coach
  getPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) return [];

    const db = await getDb();
    if (!db) return [];

    const pendingRequests = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
      sessionType: sessions.sessionType,
      learnerName: users.name,
      learnerEmail: users.email,
      createdAt: sessions.createdAt,
    })
      .from(sessions)
      .leftJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
      .leftJoin(users, eq(learnerProfiles.userId, users.id))
      .where(and(
        eq(sessions.coachId, profile.id),
        eq(sessions.status, "pending")
      ))
      .orderBy(sessions.createdAt);

    return pendingRequests;
  }),

  // Get today's sessions for coach dashboard
  getTodaysSessions: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) return [];

    const db = await getDb();
    if (!db) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysSessions = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
      sessionType: sessions.sessionType,
      status: sessions.status,
      meetingUrl: sessions.meetingUrl,
      learnerName: users.name,
    })
      .from(sessions)
      .leftJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
      .leftJoin(users, eq(learnerProfiles.userId, users.id))
      .where(and(
        eq(sessions.coachId, profile.id),
        gte(sessions.scheduledAt, today),
        sql`${sessions.scheduledAt} < ${tomorrow}`,
        inArray(sessions.status, ["pending", "confirmed"])
      ))
      .orderBy(sessions.scheduledAt);

    return todaysSessions;
  }),

  // Get sessions for a specific month (for calendar view)
  getMonthSessions: protectedProcedure
    .input(z.object({
      year: z.number(),
      month: z.number().min(1).max(12),
    }))
    .query(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) return { sessions: [] };

      const db = await getDb();
      if (!db) return { sessions: [] };

      const startOfMonth = new Date(input.year, input.month - 1, 1);
      const endOfMonth = new Date(input.year, input.month, 0, 23, 59, 59);

      const monthSessions = await db.select({
        id: sessions.id,
        scheduledAt: sessions.scheduledAt,
        duration: sessions.duration,
        sessionType: sessions.sessionType,
        status: sessions.status,
        meetingUrl: sessions.meetingUrl,
        learnerName: users.name,
        learnerEmail: users.email,
        currentLevel: learnerProfiles.currentLevel,
        targetLevel: learnerProfiles.targetLevel,
      })
        .from(sessions)
        .leftJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
        .leftJoin(users, eq(learnerProfiles.userId, users.id))
        .where(and(
          eq(sessions.coachId, profile.id),
          gte(sessions.scheduledAt, startOfMonth),
          sql`${sessions.scheduledAt} <= ${endOfMonth}`
        ))
        .orderBy(sessions.scheduledAt);

      return { sessions: monthSessions };
    }),
});

