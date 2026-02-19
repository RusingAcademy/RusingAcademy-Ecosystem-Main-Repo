import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { dashboardWidgets, analyticsSnapshots } from "../../drizzle/analytics-dashboard-schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";

export const analyticsDashboardRouter = router({
  // Get dashboard widgets
  getWidgets: adminProcedure
    .input(z.object({ dashboardId: z.string().default("admin_main") }))
    .query(async ({ input }) => {
      const enabled = await featureFlagService.isEnabled("ANALYTICS_DASHBOARDS_ENABLED");
      if (!enabled) return [];
      const db = await getDb();
      return db.select().from(dashboardWidgets)
        .where(eq(dashboardWidgets.dashboardId, input.dashboardId))
        .orderBy(dashboardWidgets.position);
    }),

  // Create widget
  createWidget: adminProcedure
    .input(z.object({
      dashboardId: z.string().default("admin_main"),
      title: z.string().min(1).max(255),
      widgetType: z.enum(["kpi_card", "line_chart", "bar_chart", "pie_chart", "table", "funnel", "heatmap"]),
      dataSource: z.enum(["revenue", "enrollments", "sessions", "learner_progress", "course_completion", "membership_churn", "email_engagement", "automation_runs", "group_sessions"]),
      config: z.any().optional(),
      position: z.number().default(0),
      width: z.enum(["quarter", "third", "half", "full"]).default("quarter"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const result = await db.insert(dashboardWidgets).values(input);
      return { id: result[0].insertId, success: true };
    }),

  // Update widget
  updateWidget: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      config: z.any().optional(),
      position: z.number().optional(),
      width: z.enum(["quarter", "third", "half", "full"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const db = await getDb();
      await db.update(dashboardWidgets).set(updates).where(eq(dashboardWidgets.id, id));
      return { success: true };
    }),

  // Delete widget
  deleteWidget: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.delete(dashboardWidgets).where(eq(dashboardWidgets.id, input.id));
      return { success: true };
    }),

  // Get analytics snapshots
  getSnapshots: adminProcedure
    .input(z.object({
      metricKey: z.string(),
      periodType: z.enum(["daily", "weekly", "monthly"]).default("daily"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions = [eq(analyticsSnapshots.metricKey, input.metricKey)];
      if (input.startDate) conditions.push(gte(analyticsSnapshots.periodDate, new Date(input.startDate)));
      if (input.endDate) conditions.push(lte(analyticsSnapshots.periodDate, new Date(input.endDate)));
      return db.select().from(analyticsSnapshots)
        .where(and(...conditions))
        .orderBy(analyticsSnapshots.periodDate)
        .limit(365);
    }),

  // Record a snapshot (used by cron/automation)
  recordSnapshot: adminProcedure
    .input(z.object({
      metricKey: z.string(),
      metricValue: z.number(),
      metricLabel: z.string().optional(),
      periodType: z.enum(["daily", "weekly", "monthly"]).default("daily"),
      periodDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const result = await db.insert(analyticsSnapshots).values({
        ...input,
        periodDate: new Date(input.periodDate),
      });
      return { id: result[0].insertId, success: true };
    }),
});
