import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean, json } from "drizzle-orm/mysql-core";

// ============================================================================
// AUTOMATION ENGINE (Phase 11)
// ============================================================================

export const automations = mysqlTable("automations", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Trigger
  triggerType: mysqlEnum("triggerType", [
    "user_signup",
    "course_enrolled",
    "course_completed",
    "lesson_completed",
    "session_booked",
    "session_completed",
    "payment_received",
    "membership_activated",
    "membership_cancelled",
    "tag_added",
    "inactivity",
    "scheduled",
  ]).notNull(),
  triggerConfig: json("triggerConfig"), // e.g., { courseId: 5, delay: "2d" }
  
  // Action
  actionType: mysqlEnum("actionType", [
    "send_email",
    "send_notification",
    "add_tag",
    "remove_tag",
    "enroll_course",
    "assign_coach",
    "update_field",
    "webhook",
    "delay",
  ]).notNull(),
  actionConfig: json("actionConfig"), // e.g., { templateId: 3, subject: "..." }
  
  // Status
  isActive: boolean("isActive").default(false),
  priority: int("priority").default(0),
  
  // Stats
  executionCount: int("executionCount").default(0),
  lastExecutedAt: timestamp("lastExecutedAt"),
  
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const automationLogs = mysqlTable("automation_logs", {
  id: int("id").autoincrement().primaryKey(),
  
  automationId: int("automationId").notNull().references(() => automations.id),
  userId: int("userId"),
  
  status: mysqlEnum("status", ["success", "failed", "skipped"]).default("success"),
  triggerData: json("triggerData"),
  actionResult: json("actionResult"),
  errorMessage: text("errorMessage"),
  
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;
export type AutomationLog = typeof automationLogs.$inferSelect;
