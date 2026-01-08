import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

// ============================================================================
// USERS TABLE (Core - Extended from template)
// ============================================================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "coach", "learner"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  preferredLanguage: mysqlEnum("preferredLanguage", ["en", "fr"]).default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// COACH PROFILES
// ============================================================================
export const coachProfiles = mysqlTable("coach_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  
  // Basic Info
  headline: varchar("headline", { length: 200 }),
  bio: text("bio"),
  videoUrl: text("videoUrl"),
  
  // Teaching Details
  languages: mysqlEnum("languages", ["french", "english", "both"]).default("both"),
  // JSON: { oral_a: bool, oral_b: bool, oral_c: bool, written_a: bool, written_b: bool, written_c: bool, reading: bool, anxiety_coaching: bool }
  specializations: json("specializations"),
  yearsExperience: int("yearsExperience"),
  credentials: text("credentials"),
  
  // Pricing (in CAD cents)
  hourlyRate: int("hourlyRate"), // e.g., 5500 = $55.00
  trialRate: int("trialRate"), // e.g., 2500 = $25.00
  
  // Stats
  totalSessions: int("totalSessions").default(0),
  totalStudents: int("totalStudents").default(0),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }),
  successRate: int("successRate"), // percentage of students who passed SLE
  responseTimeHours: int("responseTimeHours").default(24),
  
  // Status
  status: mysqlEnum("status", ["pending", "approved", "suspended", "rejected"]).default("pending"),
  approvedAt: timestamp("approvedAt"),
  approvedBy: int("approvedBy"),
  rejectionReason: text("rejectionReason"),
  
  // Stripe Connect (future)
  stripeAccountId: varchar("stripeAccountId", { length: 100 }),
  stripeOnboarded: boolean("stripeOnboarded").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachProfile = typeof coachProfiles.$inferSelect;
export type InsertCoachProfile = typeof coachProfiles.$inferInsert;

// ============================================================================
// LEARNER PROFILES
// ============================================================================
export const learnerProfiles = mysqlTable("learner_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  // Federal Context
  department: varchar("department", { length: 200 }),
  position: varchar("position", { length: 200 }),
  
  // Current SLE Levels: { reading: 'A'|'B'|'C'|'X', writing: 'A'|'B'|'C'|'X', oral: 'A'|'B'|'C'|'X' }
  currentLevel: json("currentLevel"),
  // Target SLE Levels: same structure
  targetLevel: json("targetLevel"),
  
  // Goals
  examDate: timestamp("examDate"),
  learningGoals: text("learningGoals"),
  primaryFocus: mysqlEnum("primaryFocus", ["oral", "written", "reading", "all"]).default("oral"),
  targetLanguage: mysqlEnum("targetLanguage", ["french", "english"]).default("french"),
  
  // Stats
  totalSessions: int("totalSessions").default(0),
  totalAiSessions: int("totalAiSessions").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearnerProfile = typeof learnerProfiles.$inferSelect;
export type InsertLearnerProfile = typeof learnerProfiles.$inferInsert;

// ============================================================================
// COACH AVAILABILITY
// ============================================================================
export const coachAvailability = mysqlTable("coach_availability", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // "09:00"
  endTime: varchar("endTime", { length: 5 }).notNull(), // "17:00"
  timezone: varchar("timezone", { length: 50 }).default("America/Toronto"),
  
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

// ============================================================================
// SESSIONS (Bookings)
// ============================================================================
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  packageId: int("packageId").references(() => packages.id),
  
  // Scheduling
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").notNull().default(60), // minutes
  timezone: varchar("timezone", { length: 50 }).default("America/Toronto"),
  
  // Session Details
  sessionType: mysqlEnum("sessionType", ["trial", "single", "package"]).default("single"),
  focusArea: mysqlEnum("focusArea", ["oral_a", "oral_b", "oral_c", "written", "reading", "general"]).default("general"),
  learnerNotes: text("learnerNotes"), // Pre-session notes from learner
  
  // Status
  status: mysqlEnum("status", ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"]).default("pending"),
  cancelledBy: mysqlEnum("cancelledBy", ["learner", "coach", "admin"]),
  cancellationReason: text("cancellationReason"),
  
  // Pricing (in CAD cents)
  price: int("price").notNull(),
  
  // Video
  meetingUrl: text("meetingUrl"),
  
  // Post-session
  coachNotes: text("coachNotes"),
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// ============================================================================
// PACKAGES (Session Bundles)
// ============================================================================
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  sessionsTotal: int("sessionsTotal").notNull(), // 5 or 10
  sessionsUsed: int("sessionsUsed").default(0),
  
  // Pricing (in CAD cents)
  priceTotal: int("priceTotal").notNull(),
  pricePerSession: int("pricePerSession").notNull(),
  
  status: mysqlEnum("status", ["active", "completed", "expired", "refunded"]).default("active"),
  expiresAt: timestamp("expiresAt"),
  
  // Payment (future)
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

// ============================================================================
// REVIEWS
// ============================================================================
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  
  sessionId: int("sessionId").notNull().references(() => sessions.id),
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  
  // SLE Achievement (optional - if learner passed after working with coach)
  sleAchievement: varchar("sleAchievement", { length: 50 }), // e.g., "Oral C", "CBC"
  
  // Coach response
  coachResponse: text("coachResponse"),
  coachRespondedAt: timestamp("coachRespondedAt"),
  
  // Moderation
  isVisible: boolean("isVisible").default(true),
  flaggedAt: timestamp("flaggedAt"),
  flagReason: text("flagReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================================================
// MESSAGES
// ============================================================================
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  
  participant1Id: int("participant1Id").notNull().references(() => users.id),
  participant2Id: int("participant2Id").notNull().references(() => users.id),
  
  lastMessageAt: timestamp("lastMessageAt"),
  lastMessagePreview: varchar("lastMessagePreview", { length: 200 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  
  conversationId: int("conversationId").notNull().references(() => conversations.id),
  senderId: int("senderId").notNull().references(() => users.id),
  
  content: text("content").notNull(),
  
  readAt: timestamp("readAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================================================
// AI SESSIONS (Prof Steven AI)
// ============================================================================
export const aiSessions = mysqlTable("ai_sessions", {
  id: int("id").autoincrement().primaryKey(),
  
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  
  sessionType: mysqlEnum("sessionType", ["practice", "placement", "simulation"]).notNull(),
  language: mysqlEnum("language", ["french", "english"]).notNull(),
  targetLevel: mysqlEnum("targetLevel", ["a", "b", "c"]),
  
  // Session content
  transcript: json("transcript"), // Array of { role: 'user'|'ai', content: string, timestamp: number }
  
  // Results
  score: int("score"), // 0-100
  assessedLevel: mysqlEnum("assessedLevel", ["a", "b", "c"]), // For placement tests
  feedback: json("feedback"), // { strengths: [], improvements: [], recommendations: [] }
  
  // Timing
  duration: int("duration"), // seconds
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type AiSession = typeof aiSessions.$inferSelect;
export type InsertAiSession = typeof aiSessions.$inferInsert;

// ============================================================================
// FAVORITES (Learner's saved coaches)
// ============================================================================
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// ============================================================================
// COACH APPLICATIONS (For tracking application details)
// ============================================================================
export const coachApplications = mysqlTable("coach_applications", {
  id: int("id").autoincrement().primaryKey(),
  
  userId: int("userId").notNull().references(() => users.id),
  coachProfileId: int("coachProfileId").references(() => coachProfiles.id),
  
  // Application details
  fullName: varchar("fullName", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  // Experience
  yearsTeaching: int("yearsTeaching"),
  sleExperience: text("sleExperience"),
  credentials: text("credentials"),
  certificateUrls: json("certificateUrls"), // Array of S3 URLs
  
  // Video intro
  introVideoUrl: text("introVideoUrl"),
  
  // Motivation
  whyLingueefy: text("whyLingueefy"),
  
  // Status
  status: mysqlEnum("status", ["submitted", "under_review", "approved", "rejected"]).default("submitted"),
  reviewedBy: int("reviewedBy").references(() => users.id),
  reviewedAt: timestamp("reviewedAt"),
  reviewNotes: text("reviewNotes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachApplication = typeof coachApplications.$inferSelect;
export type InsertCoachApplication = typeof coachApplications.$inferInsert;
