/**
 * Admin Stability Router
 * 
 * Exposes backend stability features to the admin panel:
 * - Webhook event stats (idempotency log)
 * - Audit log query
 * - AI pipeline health
 * - RBAC permission management
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getWebhookEventStats } from "../webhookIdempotency";
import { queryAuditLog, logAuditEvent } from "../rbacMiddleware";
import { getPipelineHealth, getAllPipelineStats } from "../services/aiPipelineMonitor";
import { SLE_RUBRICS } from "../services/sleScoringRubric";

// Admin-only guard
const adminGuard = ({ ctx, next }: { ctx: any; next: () => Promise<any> }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next();
};

export const adminStabilityRouter = router({
  // ========================================================================
  // WEBHOOK STATS
  // ========================================================================
  
  /**
   * Get webhook event processing stats (idempotency log).
   */
  getWebhookStats: protectedProcedure
    .use(adminGuard)
    .query(async () => {
      return await getWebhookEventStats();
    }),

  // ========================================================================
  // AUDIT LOG
  // ========================================================================

  /**
   * Query the generalized audit log with filters.
   */
  getAuditLog: protectedProcedure
    .use(adminGuard)
    .input(
      z.object({
        userId: z.number().optional(),
        action: z.string().optional(),
        targetType: z.string().optional(),
        targetId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      return await queryAuditLog(input || {});
    }),

  // ========================================================================
  // AI PIPELINE HEALTH
  // ========================================================================

  /**
   * Get overall AI pipeline health summary.
   */
  getPipelineHealth: protectedProcedure
    .use(adminGuard)
    .query(async () => {
      return getPipelineHealth();
    }),

  /**
   * Get detailed stats for all pipeline stages.
   */
  getPipelineStats: protectedProcedure
    .use(adminGuard)
    .input(
      z.object({
        windowMs: z.number().min(60000).max(86400000).default(3600000),
      }).optional()
    )
    .query(async ({ input }) => {
      return getAllPipelineStats(input?.windowMs);
    }),

  // ========================================================================
  // SLE SCORING RUBRIC (read-only)
  // ========================================================================

  /**
   * Get the SLE scoring rubric for a specific level.
   */
  getScoringRubric: protectedProcedure
    .use(adminGuard)
    .input(z.object({ level: z.enum(["A", "B", "C"]) }))
    .query(({ input }) => {
      return SLE_RUBRICS[input.level];
    }),

  /**
   * Get all SLE scoring rubrics.
   */
  getAllScoringRubrics: protectedProcedure
    .use(adminGuard)
    .query(() => {
      return SLE_RUBRICS;
    }),
});
