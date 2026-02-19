/**
 * Email Automation Schema — Phase 8.2
 * Tables for email sequences, triggers, and analytics.
 */
import { mysqlTable, int, varchar, text, json, mysqlEnum, boolean, timestamp } from "drizzle-orm/mysql-core";

export const emailSequences = mysqlTable("email_sequences", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  nameFr: varchar("nameFr", { length: 255 }),
  description: text("description"),
  descriptionFr: text("descriptionFr"),
  trigger: mysqlEnum("trigger", [
    "user_signup",
    "course_purchase",
    "cart_abandoned",
    "course_completed",
    "session_booked",
    "membership_activated",
    "manual",
  ]).notNull(),
  status: mysqlEnum("status", ["draft", "active", "paused", "archived"]).default("draft").notNull(),
  steps: json("steps").$type<EmailStep[]>().notNull(),
  settings: json("settings").$type<SequenceSettings>(),
  enrollmentCount: int("enrollmentCount").default(0),
  completionCount: int("completionCount").default(0),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const emailSequenceEnrollments = mysqlTable("email_sequence_enrollments", {
  id: int("id").primaryKey().autoincrement(),
  sequenceId: int("sequenceId").notNull(),
  userId: int("userId").notNull(),
  currentStep: int("currentStep").default(0),
  status: mysqlEnum("status", ["active", "completed", "paused", "cancelled"]).default("active").notNull(),
  metadata: json("metadata"),
  enrolledAt: timestamp("enrolledAt").defaultNow(),
  completedAt: timestamp("completedAt"),
  lastStepAt: timestamp("lastStepAt"),
});

export const emailSequenceLogs = mysqlTable("email_sequence_logs", {
  id: int("id").primaryKey().autoincrement(),
  sequenceId: int("sequenceId").notNull(),
  enrollmentId: int("enrollmentId").notNull(),
  stepIndex: int("stepIndex").notNull(),
  userId: int("userId").notNull(),
  emailSubject: varchar("emailSubject", { length: 500 }),
  status: mysqlEnum("status", ["sent", "delivered", "opened", "clicked", "bounced", "failed"]).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow(),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
});

// Type definitions for JSON columns
interface EmailStep {
  id: string;
  type: "email" | "delay" | "condition";
  delayDays?: number;
  delayHours?: number;
  subject?: string;
  subjectFr?: string;
  body?: string;
  bodyFr?: string;
  templateId?: string;
  condition?: {
    field: string;
    operator: "equals" | "not_equals" | "contains" | "gt" | "lt";
    value: string;
  };
}

interface SequenceSettings {
  sendTime?: string; // "09:00"
  timezone?: string;
  skipWeekends?: boolean;
  maxEmailsPerDay?: number;
  unsubscribeOnComplete?: boolean;
}
