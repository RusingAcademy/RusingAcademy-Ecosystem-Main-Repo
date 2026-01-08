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
  photoUrl: text("photoUrl"),
  
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


// ============================================================================
// COMMISSION TIERS (Admin-configurable commission rules)
// ============================================================================
export const commissionTiers = mysqlTable("commission_tiers", {
  id: int("id").autoincrement().primaryKey(),
  
  // Tier identification
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Verified SLE Coach", "Standard Tier 1"
  tierType: mysqlEnum("tierType", ["verified_sle", "standard", "referral"]).notNull(),
  
  // Commission percentage (stored as basis points: 1500 = 15%)
  commissionBps: int("commissionBps").notNull(),
  
  // Volume thresholds (for standard tiered commissions)
  minHours: int("minHours").default(0), // Minimum hours taught to qualify
  maxHours: int("maxHours"), // Maximum hours (null = unlimited)
  
  // Priority for rule matching (lower = higher priority)
  priority: int("priority").default(100),
  
  // Status
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommissionTier = typeof commissionTiers.$inferSelect;
export type InsertCommissionTier = typeof commissionTiers.$inferInsert;

// ============================================================================
// COACH COMMISSION ASSIGNMENTS (Which tier each coach is on)
// ============================================================================
export const coachCommissions = mysqlTable("coach_commissions", {
  id: int("id").autoincrement().primaryKey(),
  
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  tierId: int("tierId").notNull().references(() => commissionTiers.id),
  
  // Override commission (if different from tier default)
  overrideCommissionBps: int("overrideCommissionBps"),
  overrideReason: text("overrideReason"),
  
  // Verified SLE status
  isVerifiedSle: boolean("isVerifiedSle").default(false),
  verifiedAt: timestamp("verifiedAt"),
  verifiedBy: int("verifiedBy").references(() => users.id),
  
  // Cumulative hours taught (for tier progression)
  totalHoursTaught: decimal("totalHoursTaught", { precision: 10, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachCommission = typeof coachCommissions.$inferSelect;
export type InsertCoachCommission = typeof coachCommissions.$inferInsert;

// ============================================================================
// REFERRAL LINKS (Coach referral system)
// ============================================================================
export const referralLinks = mysqlTable("referral_links", {
  id: int("id").autoincrement().primaryKey(),
  
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Unique referral code
  code: varchar("code", { length: 20 }).notNull().unique(),
  
  // Referral commission discount (basis points: 500 = 5% commission instead of normal)
  discountCommissionBps: int("discountCommissionBps").default(500),
  
  // Stats
  clickCount: int("clickCount").default(0),
  signupCount: int("signupCount").default(0),
  bookingCount: int("bookingCount").default(0),
  
  // Status
  isActive: boolean("isActive").default(true),
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReferralLink = typeof referralLinks.$inferSelect;
export type InsertReferralLink = typeof referralLinks.$inferInsert;

// ============================================================================
// REFERRAL TRACKING (Which learners came from which referral)
// ============================================================================
export const referralTracking = mysqlTable("referral_tracking", {
  id: int("id").autoincrement().primaryKey(),
  
  referralLinkId: int("referralLinkId").notNull().references(() => referralLinks.id),
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  
  // Attribution window
  attributedAt: timestamp("attributedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // When referral attribution expires
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralTracking = typeof referralTracking.$inferSelect;
export type InsertReferralTracking = typeof referralTracking.$inferInsert;

// ============================================================================
// PAYOUT LEDGER (Complete transaction history)
// ============================================================================
export const payoutLedger = mysqlTable("payout_ledger", {
  id: int("id").autoincrement().primaryKey(),
  
  // Transaction reference
  sessionId: int("sessionId").references(() => sessions.id),
  packageId: int("packageId").references(() => packages.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  
  // Transaction type
  transactionType: mysqlEnum("transactionType", [
    "session_payment",    // Learner paid for session
    "platform_fee",       // Platform commission deducted
    "coach_payout",       // Coach receives payment
    "refund",             // Refund to learner
    "refund_reversal",    // Platform fee returned on refund
    "chargeback",         // Disputed payment
    "chargeback_reversal" // Chargeback resolved
  ]).notNull(),
  
  // Amounts (in CAD cents)
  grossAmount: int("grossAmount").notNull(),        // Total learner payment
  platformFee: int("platformFee").notNull(),        // Platform commission
  netAmount: int("netAmount").notNull(),            // Coach receives
  
  // Commission details
  commissionBps: int("commissionBps").notNull(),    // Commission rate applied
  commissionTierId: int("commissionTierId").references(() => commissionTiers.id),
  referralLinkId: int("referralLinkId").references(() => referralLinks.id),
  isTrialSession: boolean("isTrialSession").default(false),
  
  // Stripe references
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }),
  stripeTransferId: varchar("stripeTransferId", { length: 100 }),
  stripeRefundId: varchar("stripeRefundId", { length: 100 }),
  
  // Status
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "reversed"]).default("pending"),
  processedAt: timestamp("processedAt"),
  failureReason: text("failureReason"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayoutLedger = typeof payoutLedger.$inferSelect;
export type InsertPayoutLedger = typeof payoutLedger.$inferInsert;

// ============================================================================
// COACH PAYOUTS (Aggregated payout records)
// ============================================================================
export const coachPayouts = mysqlTable("coach_payouts", {
  id: int("id").autoincrement().primaryKey(),
  
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Payout period
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  
  // Amounts (in CAD cents)
  grossEarnings: int("grossEarnings").notNull(),
  totalPlatformFees: int("totalPlatformFees").notNull(),
  netPayout: int("netPayout").notNull(),
  
  // Session counts
  sessionCount: int("sessionCount").notNull(),
  trialSessionCount: int("trialSessionCount").default(0),
  
  // Stripe
  stripePayoutId: varchar("stripePayoutId", { length: 100 }),
  
  // Status
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed"]).default("pending"),
  paidAt: timestamp("paidAt"),
  failureReason: text("failureReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachPayout = typeof coachPayouts.$inferSelect;
export type InsertCoachPayout = typeof coachPayouts.$inferInsert;

// ============================================================================
// PLATFORM SETTINGS (Admin-configurable settings)
// ============================================================================
export const platformSettings = mysqlTable("platform_settings", {
  id: int("id").autoincrement().primaryKey(),
  
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: json("value").notNull(),
  description: text("description"),
  
  // Audit
  updatedBy: int("updatedBy").references(() => users.id),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;
