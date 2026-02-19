// server/routers/coachAnalytics.ts — Phase 3: Coach Dashboard Analytics
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { coachAnalyticsService } from "../services/coachAnalyticsService";
import { getDb } from "../db";
import { coachProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

async function getCoachProfileId(userId: number): Promise<number> {
  const db = await getDb();
  const profile = await db.select({ id: coachProfiles.id })
    .from(coachProfiles)
    .where(eq(coachProfiles.userId, userId))
    .then((r) => r[0]);
  if (!profile) throw new Error("Coach profile not found");
  return profile.id;
}

export const coachAnalyticsRouter = router({
  // Full dashboard overview
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const coachProfileId = await getCoachProfileId(ctx.user!.id);
    return coachAnalyticsService.getDashboardOverview(coachProfileId);
  }),

  // Session statistics with optional date range
  getSessionStats: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const coachProfileId = await getCoachProfileId(ctx.user!.id);
      const startDate = input?.startDate ? new Date(input.startDate) : undefined;
      const endDate = input?.endDate ? new Date(input.endDate) : undefined;
      return coachAnalyticsService.getSessionStats(coachProfileId, startDate, endDate);
    }),

  // Revenue statistics
  getRevenueStats: protectedProcedure.query(async ({ ctx }) => {
    const coachProfileId = await getCoachProfileId(ctx.user!.id);
    return coachAnalyticsService.getRevenueStats(coachProfileId);
  }),

  // Feedback statistics
  getFeedbackStats: protectedProcedure.query(async ({ ctx }) => {
    const coachProfileId = await getCoachProfileId(ctx.user!.id);
    return coachAnalyticsService.getFeedbackStats(coachProfileId);
  }),

  // Invalidate cache (for manual refresh)
  refreshCache: protectedProcedure.mutation(async ({ ctx }) => {
    const coachProfileId = await getCoachProfileId(ctx.user!.id);
    coachAnalyticsService.invalidateCache(coachProfileId);
    return { success: true };
  }),
});
