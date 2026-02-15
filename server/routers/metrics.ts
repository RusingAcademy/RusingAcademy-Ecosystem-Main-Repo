/**
 * Metrics Router
 * 
 * Exposes observability metrics via tRPC for admin dashboard consumption.
 * Also provides a REST endpoint at /api/metrics for external monitoring tools.
 * 
 * Access: Admin-only (requires RBAC admin role)
 * 
 * @module server/routers/metrics
 */

import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getMetricsSnapshot, resetMetrics } from "../middleware/observability";
import { createLogger } from "../logger";

const log = createLogger("metrics-router");

export const metricsRouter = router({
  /**
   * Get current metrics snapshot
   * Returns uptime, request counts, error rates, and per-route latency percentiles
   */
  getSnapshot: adminProcedure
    .query(() => {
      log.info("Admin requested metrics snapshot");
      return getMetricsSnapshot();
    }),

  /**
   * Reset all metrics counters
   * Useful after deployments or for testing
   */
  reset: adminProcedure
    .mutation(() => {
      log.info("Admin reset metrics counters");
      resetMetrics();
      return { success: true, message: "Metrics reset successfully" };
    }),

  /**
   * Get system health summary
   * Combines metrics with system-level information
   */
  healthSummary: adminProcedure
    .query(() => {
      const snapshot = getMetricsSnapshot();
      const memUsage = process.memoryUsage();

      return {
        ...snapshot,
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          pid: process.pid,
          memory: {
            heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
            heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
            rssMB: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
            externalMB: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
          },
          cpuUsage: process.cpuUsage(),
        },
      };
    }),
});
