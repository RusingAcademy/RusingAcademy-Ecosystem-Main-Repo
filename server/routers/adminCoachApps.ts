import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, or } from "drizzle-orm";
import { createNotification, getDb } from "../db";
import { coachApplications, coachProfiles, notifications, users } from "../../drizzle/schema";

export const adminCoachAppsRouter = router({
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
      const { coachApplications } = await import("../../drizzle/schema");
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
  
  // Approve a coach application,

  approveCoachApplication: protectedProcedure
    .input(z.object({ applicationId: z.number(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");
      const { sendApplicationStatusEmail } = await import("../email-application-notifications");
      
      // Get the application
      const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, input.applicationId));
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      const [user] = await db.select().from(users).where(eq(users.id, application.userId));
      
      // Wrap approval writes in a transaction for consistency
      const slug = `${application.firstName || "coach"}-${application.lastName || "user"}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await db.transaction(async (tx) => {
        // Update application status
        await tx.update(coachApplications)
          .set({ 
            status: "approved", 
            reviewedBy: ctx.user.id, 
            reviewedAt: new Date(),
            reviewNotes: input.notes 
          })
          .where(eq(coachApplications.id, input.applicationId));
        
        // Create coach profile from application
        await tx.insert(coachProfiles).values({
          userId: application.userId,
          slug: slug + "-" + Date.now(),
          headline: application.headline || null,
          headlineFr: application.headlineFr || null,
          bio: application.bio || null,
          bioFr: application.bioFr || null,
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
        await tx.update(users).set({ role: "coach" }).where(eq(users.id, application.userId));
      });
      
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
  
  // Reject a coach application,

  rejectCoachApplication: protectedProcedure
    .input(z.object({ applicationId: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");
      const { sendApplicationStatusEmail } = await import("../email-application-notifications");
      
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
      bioFr: c.coach_profiles.bioFr || "",
      headline: c.coach_profiles.headline || "",
      headlineFr: c.coach_profiles.headlineFr || "",
      specialties: Object.keys(c.coach_profiles.specializations || {}).filter((k: string) => (c.coach_profiles.specializations as Record<string, boolean>)?.[k]),
      credentials: c.coach_profiles.credentials || "",
      yearsExperience: c.coach_profiles.yearsExperience || 0,
      appliedAt: c.coach_profiles.createdAt,
      status: c.coach_profiles.status,
      photoUrl: c.coach_profiles.photoUrl,
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
});
