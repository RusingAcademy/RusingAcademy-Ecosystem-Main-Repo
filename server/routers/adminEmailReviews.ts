/**
 * Admin Email Logs & Reviews Router (Sprint 11)
 * 
 * Provides:
 * - Email delivery logs with filtering
 * - Email delivery stats dashboard
 * - Course review moderation (list, toggle visibility, respond)
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb, getEmailLogs, getEmailDeliveryStats, getAdminCourseReviews } from "../db";
import { eq, desc, sql } from "drizzle-orm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminEmailRouter = router({
  /**
   * Get email delivery logs with filtering
   */
  getLogs: adminProcedure
    .input(z.object({
      type: z.string().optional(),
      status: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return getEmailLogs(input ?? undefined);
    }),

  /**
   * Get email delivery stats (sent/failed/bounced counts, by type)
   */
  getStats: adminProcedure.query(async () => {
    return getEmailDeliveryStats();
  }),
});

export const adminReviewsRouter = router({
  /**
   * Get all course reviews for moderation
   */
  getAll: adminProcedure
    .input(z.object({
      courseId: z.number().optional(),
      visibleOnly: z.boolean().optional(),
      limit: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return getAdminCourseReviews(input ?? undefined);
    }),

  /**
   * Toggle review visibility (show/hide)
   */
  toggleVisibility: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courseReviews } = await import("../../drizzle/schema");

      // Get current visibility
      const [review] = await db.select({ isVisible: courseReviews.isVisible })
        .from(courseReviews)
        .where(eq(courseReviews.id, input.reviewId));
      
      if (!review) throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });

      await db.update(courseReviews)
        .set({ isVisible: !review.isVisible })
        .where(eq(courseReviews.id, input.reviewId));

      return { success: true, isVisible: !review.isVisible };
    }),

  /**
   * Add instructor/admin response to a review
   */
  respond: adminProcedure
    .input(z.object({
      reviewId: z.number(),
      response: z.string().min(1).max(2000),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courseReviews } = await import("../../drizzle/schema");

      await db.update(courseReviews)
        .set({
          instructorResponse: input.response,
          instructorRespondedAt: new Date(),
        })
        .where(eq(courseReviews.id, input.reviewId));

      return { success: true };
    }),

  /**
   * Delete a review (hard delete)
   */
  delete: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courseReviews } = await import("../../drizzle/schema");

      await db.delete(courseReviews).where(eq(courseReviews.id, input.reviewId));
      return { success: true };
    }),

  /**
   * Get review stats summary
   */
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, avgRating: 0, visible: 0, hidden: 0, withResponse: 0 };
    const { courseReviews } = await import("../../drizzle/schema");
    const { count } = await import("drizzle-orm");

    const [totalResult] = await db.select({ count: count() }).from(courseReviews);
    const total = totalResult?.count ?? 0;

    const [avgResult] = await db.select({
      avg: sql<number>`COALESCE(AVG(${courseReviews.rating}), 0)`,
    }).from(courseReviews);
    const avgRating = Math.round((Number(avgResult?.avg ?? 0)) * 10) / 10;

    const [visibleResult] = await db.select({ count: count() }).from(courseReviews)
      .where(eq(courseReviews.isVisible, true));
    const visible = visibleResult?.count ?? 0;

    const hidden = total - visible;

    const [respondedResult] = await db.select({ count: count() }).from(courseReviews)
      .where(sql`${courseReviews.instructorResponse} IS NOT NULL`);
    const withResponse = respondedResult?.count ?? 0;

    return { total, avgRating, visible, hidden, withResponse };
  }),
});
