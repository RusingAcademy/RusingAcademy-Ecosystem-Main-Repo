// server/routers/adminMonitoring.ts — Phase 4: Centralized Monitoring Dashboard
import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { monitoringService } from "../services/monitoringService";

export const adminMonitoringRouter = router({
  // Get real-time overview (no DB query, instant)
  overview: adminProcedure.query(async () => {
    return monitoringService.getRealtimeOverview();
  }),

  // Get aggregated metrics from DB
  metricsSummary: adminProcedure
    .input(z.object({ windowMinutes: z.number().min(5).max(1440).optional() }).optional())
    .query(async ({ input }) => {
      return monitoringService.getMetricsSummary(input?.windowMinutes || 60);
    }),

  // Get recent errors
  recentErrors: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
    .query(async ({ input }) => {
      return monitoringService.getRecentErrors(input?.limit || 50);
    }),

  // Flush metrics buffer to DB (manual trigger)
  flushMetrics: adminProcedure.mutation(async () => {
    const count = await monitoringService.flushMetrics();
    return { flushed: count };
  }),

  // Alert configs CRUD
  getAlerts: adminProcedure.query(async () => {
    return monitoringService.getAlertConfigs();
  }),

  createAlert: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      metric: z.string().min(1),
      condition: z.enum(["gt", "lt", "eq"]),
      threshold: z.number(),
      windowMinutes: z.number().min(1).max(60).optional(),
      channels: z.string().optional(),
      recipients: z.string().optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await monitoringService.createAlertConfig({
        ...input,
        createdBy: ctx.user.id,
      });
      return { success: true };
    }),

  // Check alerts manually
  checkAlerts: adminProcedure.mutation(async () => {
    await monitoringService.checkAlerts();
    return { success: true };
  }),
});
