import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, boolean } from "drizzle-orm/mysql-core";

// ============================================================================
// LEARNER 360 VIEW + TAGS & SEGMENTATION (Phase 12)
// ============================================================================

export const learnerTags = mysqlTable("learner_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).default("#6366f1"), // hex color
  description: text("description"),
  category: mysqlEnum("category", ["level", "interest", "status", "custom"]).default("custom"),
  isAutomatic: boolean("isAutomatic").default(false), // auto-assigned by automations
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const learnerTagAssignments = mysqlTable("learner_tag_assignments", {
  id: int("id").autoincrement().primaryKey(),
  learnerId: int("learnerId").notNull(),
  tagId: int("tagId").notNull().references(() => learnerTags.id),
  assignedBy: mysqlEnum("assignedBy", ["manual", "automation", "system"]).default("manual"),
  assignedByUserId: int("assignedByUserId"),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export const learnerSegments = mysqlTable("learner_segments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // Filter rules stored as JSON in the segment
  filterRules: text("filterRules"), // JSON: [{ field: "tag", operator: "has", value: "sle-prep" }]
  memberCount: int("memberCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const learnerNotes = mysqlTable("learner_notes", {
  id: int("id").autoincrement().primaryKey(),
  learnerId: int("learnerId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  noteType: mysqlEnum("noteType", ["general", "progress", "concern", "milestone"]).default("general"),
  isPrivate: boolean("isPrivate").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearnerTag = typeof learnerTags.$inferSelect;
export type LearnerTagAssignment = typeof learnerTagAssignments.$inferSelect;
export type LearnerSegment = typeof learnerSegments.$inferSelect;
export type LearnerNote = typeof learnerNotes.$inferSelect;
