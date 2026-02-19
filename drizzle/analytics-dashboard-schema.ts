import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, json } from "drizzle-orm/mysql-core";

// ============================================================================
// ANALYTICS DASHBOARDS (Phase 13)
// ============================================================================

export const dashboardWidgets = mysqlTable("dashboard_widgets", {
  id: int("id").autoincrement().primaryKey(),
  
  dashboardId: varchar("dashboardId", { length: 50 }).notNull(), // e.g., "admin_main", "coach_overview"
  title: varchar("title", { length: 255 }).notNull(),
  widgetType: mysqlEnum("widgetType", [
    "kpi_card", "line_chart", "bar_chart", "pie_chart", "table", "funnel", "heatmap",
  ]).notNull(),
  
  // Data source
  dataSource: mysqlEnum("dataSource", [
    "revenue", "enrollments", "sessions", "learner_progress", "course_completion",
    "membership_churn", "email_engagement", "automation_runs", "group_sessions",
  ]).notNull(),
  
  // Config
  config: json("config"), // { timeRange: "30d", groupBy: "week", filters: {} }
  position: int("position").default(0),
  width: mysqlEnum("width", ["quarter", "third", "half", "full"]).default("quarter"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const analyticsSnapshots = mysqlTable("analytics_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  
  metricKey: varchar("metricKey", { length: 100 }).notNull(),
  metricValue: int("metricValue").notNull(),
  metricLabel: varchar("metricLabel", { length: 255 }),
  
  periodType: mysqlEnum("periodType", ["daily", "weekly", "monthly"]).default("daily"),
  periodDate: timestamp("periodDate").notNull(),
  
  metadata: json("metadata"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
