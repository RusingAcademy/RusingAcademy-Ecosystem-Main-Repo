import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean } from "drizzle-orm/mysql-core";
import { sessions } from "./schema";

// ============================================================================
// GROUP SESSIONS (Phase 10)
// ============================================================================

export const groupSessions = mysqlTable("group_sessions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Link to base session
  sessionId: int("sessionId").notNull().references(() => sessions.id),
  
  // Group config
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  maxParticipants: int("maxParticipants").notNull().default(10),
  currentParticipants: int("currentParticipants").notNull().default(0),
  
  // Pricing
  pricePerParticipant: int("pricePerParticipant").notNull(), // CAD cents
  
  // Type
  groupType: mysqlEnum("groupType", ["workshop", "study_group", "mock_exam", "conversation_circle"]).default("workshop"),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced", "all_levels"]).default("all_levels"),
  language: mysqlEnum("language", ["en", "fr", "bilingual"]).default("bilingual"),
  
  // Recurrence
  isRecurring: boolean("isRecurring").default(false),
  recurrencePattern: mysqlEnum("recurrencePattern", ["weekly", "biweekly", "monthly"]),
  
  // Registration
  registrationDeadline: timestamp("registrationDeadline"),
  isPublic: boolean("isPublic").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const groupSessionParticipants = mysqlTable("group_session_participants", {
  id: int("id").autoincrement().primaryKey(),
  
  groupSessionId: int("groupSessionId").notNull().references(() => groupSessions.id),
  learnerId: int("learnerId").notNull(),
  
  // Status
  status: mysqlEnum("status", ["registered", "confirmed", "attended", "no_show", "cancelled"]).default("registered"),
  
  // Payment
  stripePaymentId: varchar("stripePaymentId", { length: 100 }),
  paidAmount: int("paidAmount"), // CAD cents
  
  // Feedback
  rating: int("rating"), // 1-5
  feedback: text("feedback"),
  
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
  cancelledAt: timestamp("cancelledAt"),
});

export type GroupSession = typeof groupSessions.$inferSelect;
export type InsertGroupSession = typeof groupSessions.$inferInsert;
export type GroupSessionParticipant = typeof groupSessionParticipants.$inferSelect;
