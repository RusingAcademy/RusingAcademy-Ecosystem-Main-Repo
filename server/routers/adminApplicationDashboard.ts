import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("routers-admin-app-dashboard");

export const adminApplicationDashboardRouter = router({
  // Get detailed application info for dashboard
  getApplicationDetail: protectedProcedure
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");

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
    .input(
      z
        .object({
          status: z.enum(["submitted", "under_review", "approved", "rejected", "all"]).optional(),
          language: z.enum(["french", "english", "both", "all"]).optional(),
          search: z.string().optional(),
          sortBy: z.enum(["createdAt", "firstName", "status"]).optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { applications: [], total: 0 };
      const { coachApplications } = await import("../../drizzle/schema");

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

      // Filter by search term
      let filtered = applications;
      if (input?.search) {
        const s = input.search.toLowerCase();
        filtered = filtered.filter(
          (a: any) =>
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
      const { coachApplications, coachProfiles } = await import("../../drizzle/schema");

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
          await db
            .update(coachApplications)
            .set({
              status: "approved",
              reviewedBy: ctx.user.id,
              reviewedAt: new Date(),
              reviewNotes: input.notes,
            })
            .where(eq(coachApplications.id, applicationId));

          // Create coach profile
          const slug = `${application.firstName || "coach"}-${application.lastName || "user"}`
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          await db.insert(coachProfiles).values({
            userId: application.userId,
            slug: slug + "-" + Date.now(),
            headline: application.headline || null,
            headlineFr: (application as any).headlineFr || null,
            bio: application.bio || null,
            bioFr: (application as any).bioFr || null,
            videoUrl: application.introVideoUrl || null,
            photoUrl: application.photoUrl || null,
            languages: (application.teachingLanguage as "french" | "english" | "both") || "both",
            specializations: application.specializations || {},
            yearsExperience: application.yearsTeaching || 0,
            credentials: application.certifications || null,
            hourlyRate: (application.hourlyRate || 50) * 100,
            trialRate: (application.trialRate || 25) * 100,
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
      const { coachApplications } = await import("../../drizzle/schema");

      const results = { rejected: 0, failed: 0, errors: [] as string[] };

      for (const applicationId of input.applicationIds) {
        try {
          await db
            .update(coachApplications)
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
    const { coachApplications } = await import("../../drizzle/schema");

    const [total] = await db.select({ count: sql<number>`count(*)` }).from(coachApplications);
    const [submitted] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coachApplications)
      .where(eq(coachApplications.status, "submitted"));
    const [underReview] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coachApplications)
      .where(eq(coachApplications.status, "under_review"));
    const [approved] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coachApplications)
      .where(eq(coachApplications.status, "approved"));
    const [rejected] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coachApplications)
      .where(eq(coachApplications.status, "rejected"));

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
    .input(
      z.object({
        status: z.enum(["all", "submitted", "under_review", "approved", "rejected"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachApplications } = await import("../../drizzle/schema");
      const { generateApplicationsCSV, generateExportFilename } = await import("../export-applications");

      // Get all applications
      const allApps = await db.select().from(coachApplications).orderBy(desc(coachApplications.createdAt));

      // Filter by status
      let filtered = allApps;
      if (input.status && input.status !== "all") {
        filtered = filtered.filter((app) => app.status === input.status);
      }

      // Filter by date range
      if (input.startDate) {
        const startDate = input.startDate;
        filtered = filtered.filter((app) => new Date(app.createdAt) >= startDate);
      }
      if (input.endDate) {
        const endDate = input.endDate;
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter((app) => new Date(app.createdAt) <= endOfDay);
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
});
