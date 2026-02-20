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
import { getDb } from "../db";
import { sql } from "drizzle-orm";

// Admin-only guard
const adminGuard = ({ ctx, next }: { ctx: any; next: () => Promise<any> }) => {
  if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) {
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

  // ========================================================================
  // USER PERMISSIONS (for frontend RBAC)
  // ========================================================================
  /**
   * Get current user's permissions from the RBAC system.
   * Returns an array of permission names.
   */
  getUserPermissions: protectedProcedure
    .use(adminGuard)
    .query(async ({ ctx }) => {
      const db = await getDb();
      // Get permissions from user_permissions table (direct assignments)
      const [directPerms] = await db.execute(sql`
        SELECT DISTINCT CONCAT(p.module, '.', p.action) as permission
        FROM user_permissions up
        JOIN permissions p ON up.permissionId = p.id
        WHERE up.userId = ${ctx.user.id}
      `);
      // Get permissions from role_permissions table (via user's role)
      const [rolePerms] = await db.execute(sql`
        SELECT DISTINCT CONCAT(p.module, '.', p.action) as permission
        FROM role_permissions rp
        JOIN permissions p ON rp.permissionId = p.id
        JOIN roles r ON rp.roleId = r.id
        JOIN users u ON u.role = r.name
        WHERE u.id = ${ctx.user.id}
      `);
      // Merge and deduplicate
      const allPerms = new Set<string>();
      if (Array.isArray(directPerms)) {
        for (const p of directPerms as any[]) allPerms.add(p.permission);
      }
      if (Array.isArray(rolePerms)) {
        for (const p of rolePerms as any[]) allPerms.add(p.permission);
      }
      return Array.from(allPerms).map(name => ({ permission: name }));
    }),

  // ========================================================================
  // WEBHOOK HARDENING (Sprint C5)
  // ========================================================================

  /**
   * Retry a failed webhook event by resetting its status to allow reprocessing.
   */
  retryWebhookEvent: protectedProcedure
    .use(adminGuard)
    .input(z.object({ stripeEventId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [existing] = await db.execute(sql`
        SELECT status, attempts FROM webhook_events_log 
        WHERE stripeEventId = ${input.stripeEventId} LIMIT 1
      `);
      const row = Array.isArray(existing) && existing[0] ? existing[0] as any : null;
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (row.status === "processed") {
        return { success: false, message: "Event already processed successfully" };
      }

      // Reset to allow reprocessing
      await db.execute(sql`
        UPDATE webhook_events_log 
        SET status = 'pending_retry', attempts = GREATEST(attempts - 1, 0)
        WHERE stripeEventId = ${input.stripeEventId}
      `);

      return { success: true, message: `Event ${input.stripeEventId} queued for retry` };
    }),

  /**
   * Get detailed info about a specific webhook event.
   */
  getWebhookEventDetail: protectedProcedure
    .use(adminGuard)
    .input(z.object({ stripeEventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [rows] = await db.execute(sql`
        SELECT stripeEventId, eventType, status, attempts, lastError, processedAt, createdAt
        FROM webhook_events_log 
        WHERE stripeEventId = ${input.stripeEventId} LIMIT 1
      `);
      const row = Array.isArray(rows) && rows[0] ? rows[0] as any : null;
      if (!row) return null;

      // Calculate latency
      const latencyMs = row.processedAt && row.createdAt
        ? new Date(row.processedAt).getTime() - new Date(row.createdAt).getTime()
        : null;

      return {
        ...row,
        latencyMs,
        latencyFormatted: latencyMs !== null ? `${latencyMs}ms` : "N/A",
      };
    }),

  /**
   * Get failed webhook events (dead letter queue visibility).
   */
  getFailedWebhookEvents: protectedProcedure
    .use(adminGuard)
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      const [rows] = await db.execute(sql`
        SELECT stripeEventId, eventType, status, attempts, lastError, createdAt
        FROM webhook_events_log 
        WHERE status IN ('failed', 'pending_retry')
        ORDER BY createdAt DESC
        LIMIT 50
      `);

      return Array.isArray(rows) ? rows : [];
    }),

  /**
   * Get webhook processing latency stats.
   */
  getWebhookLatencyStats: protectedProcedure
    .use(adminGuard)
    .query(async () => {
      const db = await getDb();
      if (!db) return { avgLatencyMs: 0, p95LatencyMs: 0, maxLatencyMs: 0, totalProcessed: 0 };

      try {
        const [stats] = await db.execute(sql`
          SELECT 
            AVG(TIMESTAMPDIFF(MICROSECOND, createdAt, processedAt)) / 1000 as avgLatencyMs,
            MAX(TIMESTAMPDIFF(MICROSECOND, createdAt, processedAt)) / 1000 as maxLatencyMs,
            COUNT(*) as totalProcessed
          FROM webhook_events_log 
          WHERE status = 'processed' AND processedAt IS NOT NULL
        `);
        const row = Array.isArray(stats) && stats[0] ? stats[0] as any : {};

        return {
          avgLatencyMs: Math.round(Number(row.avgLatencyMs || 0)),
          maxLatencyMs: Math.round(Number(row.maxLatencyMs || 0)),
          totalProcessed: Number(row.totalProcessed || 0),
        };
      } catch (error) {
        return { avgLatencyMs: 0, maxLatencyMs: 0, totalProcessed: 0 };
      }
    }),
});
