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
  totalReviews: int("totalReviews").default(0),
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
  
  // Profile Completeness
  profileComplete: boolean("profileComplete").default(false),
  
  // Calendar Integration
  calendarType: mysqlEnum("calendarType", ["internal", "calendly"]).default("internal"),
  calendlyUrl: varchar("calendlyUrl", { length: 500 }),
  
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
  
  // Weekly Report Preferences
  weeklyReportEnabled: boolean("weeklyReportEnabled").default(true),
  weeklyReportDay: int("weeklyReportDay").default(0), // 0=Sunday, 1=Monday
  
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
  cancelledAt: timestamp("cancelledAt"),
  
  // Stripe
  stripePaymentId: varchar("stripePaymentId", { length: 100 }),
  
  // Calendly integration
  calendlyEventId: varchar("calendlyEventId", { length: 100 }),
  
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
  recipientId: int("recipientId").notNull().references(() => users.id),
  
  content: text("content").notNull(),
  
  read: boolean("read").default(false),
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
  
  // Personal Information
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  fullName: varchar("fullName", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  timezone: varchar("timezone", { length: 100 }),
  
  // Professional Background
  education: varchar("education", { length: 200 }),
  certifications: text("certifications"),
  yearsTeaching: int("yearsTeaching"),
  sleExperience: text("sleExperience"),
  credentials: text("credentials"),
  certificateUrls: json("certificateUrls"), // Array of S3 URLs
  
  // Language Qualifications
  nativeLanguage: varchar("nativeLanguage", { length: 50 }),
  teachingLanguage: varchar("teachingLanguage", { length: 50 }),
  hasSleExperience: boolean("hasSleExperience").default(false),
  
  // Specializations (JSON)
  specializations: json("specializations"),
  
  // Pricing & Availability
  hourlyRate: int("hourlyRate"), // in dollars
  trialRate: int("trialRate"), // in dollars
  weeklyHours: int("weeklyHours"),
  
  // Profile Content
  headline: varchar("headline", { length: 200 }),
  bio: text("bio"),
  teachingPhilosophy: text("teachingPhilosophy"),
  
  // Media
  photoUrl: text("photoUrl"),
  introVideoUrl: text("introVideoUrl"),
  
  // Motivation
  whyLingueefy: text("whyLingueefy"),
  
  // Legal Consents
  termsAccepted: boolean("termsAccepted").default(false),
  privacyAccepted: boolean("privacyAccepted").default(false),
  backgroundCheckConsent: boolean("backgroundCheckConsent").default(false),
  codeOfConductAccepted: boolean("codeOfConductAccepted").default(false),
  commissionAccepted: boolean("commissionAccepted").default(false),
  digitalSignature: varchar("digitalSignature", { length: 200 }),
  
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


// ============================================================================
// DEPARTMENT INQUIRIES (B2B Contact Form Submissions)
// ============================================================================
export const departmentInquiries = mysqlTable("department_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  
  // Contact Info
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  
  // Department Info
  department: varchar("department", { length: 200 }).notNull(),
  teamSize: varchar("teamSize", { length: 50 }).notNull(), // e.g., "5-10 employees", "11-25 employees"
  
  // Inquiry Details
  message: text("message").notNull(),
  preferredPackage: varchar("preferredPackage", { length: 50 }), // e.g., "team-5", "team-10", "team-25", "custom"
  
  // Status
  status: mysqlEnum("status", ["new", "contacted", "in_progress", "converted", "closed"]).default("new"),
  assignedTo: int("assignedTo").references(() => users.id),
  
  // Follow-up
  notes: text("notes"),
  followUpDate: timestamp("followUpDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DepartmentInquiry = typeof departmentInquiries.$inferSelect;
export type InsertDepartmentInquiry = typeof departmentInquiries.$inferInsert;


// ============================================================================
// NOTIFICATIONS (In-app notifications for users)
// ============================================================================
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  
  // Target user
  userId: int("userId").notNull().references(() => users.id),
  
  // Notification type
  type: mysqlEnum("type", [
    "message",           // New message received
    "session_reminder",  // Upcoming session reminder
    "booking",           // New booking or booking update
    "review",            // New review received
    "system"             // System notification
  ]).notNull(),
  
  // Content
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 500 }),
  
  // Metadata (JSON for type-specific data)
  metadata: json("metadata"),
  
  // Status
  read: boolean("read").default(false),
  readAt: timestamp("readAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;


// ============================================================================
// COACH DOCUMENTS (Verification documents for credentials)
// ============================================================================
export const coachDocuments = mysqlTable("coach_documents", {
  id: int("id").autoincrement().primaryKey(),
  
  // Owner
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  applicationId: int("applicationId").references(() => coachApplications.id),
  
  // Document type
  documentType: mysqlEnum("documentType", [
    "id_proof",           // Government ID (passport, driver's license)
    "degree",             // University degree/diploma
    "teaching_cert",      // Teaching certification (TEFL, CELTA, etc.)
    "sle_results",        // Official SLE test results
    "language_cert",      // Language proficiency certificate
    "background_check",   // Criminal background check
    "other"               // Other supporting documents
  ]).notNull(),
  
  // Document details
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  
  // File storage
  fileUrl: text("fileUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize"), // in bytes
  mimeType: varchar("mimeType", { length: 100 }),
  
  // Validity
  issueDate: timestamp("issueDate"),
  expiryDate: timestamp("expiryDate"),
  issuingAuthority: varchar("issuingAuthority", { length: 200 }),
  documentNumber: varchar("documentNumber", { length: 100 }),
  
  // Verification status
  status: mysqlEnum("status", ["pending", "verified", "rejected", "expired"]).default("pending"),
  verifiedBy: int("verifiedBy").references(() => users.id),
  verifiedAt: timestamp("verifiedAt"),
  rejectionReason: text("rejectionReason"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachDocument = typeof coachDocuments.$inferSelect;
export type InsertCoachDocument = typeof coachDocuments.$inferInsert;

// ============================================================================
// STRIPE CONNECT ACCOUNTS (Coach payment accounts)
// ============================================================================
export const stripeConnectAccounts = mysqlTable("stripe_connect_accounts", {
  id: int("id").autoincrement().primaryKey(),
  
  coachId: int("coachId").notNull().references(() => coachProfiles.id).unique(),
  
  // Stripe account info
  stripeAccountId: varchar("stripeAccountId", { length: 100 }).notNull().unique(),
  accountType: mysqlEnum("accountType", ["express", "standard", "custom"]).default("express"),
  
  // Onboarding status
  onboardingComplete: boolean("onboardingComplete").default(false),
  chargesEnabled: boolean("chargesEnabled").default(false),
  payoutsEnabled: boolean("payoutsEnabled").default(false),
  detailsSubmitted: boolean("detailsSubmitted").default(false),
  
  // Account details (from Stripe)
  businessType: varchar("businessType", { length: 50 }),
  country: varchar("country", { length: 2 }),
  defaultCurrency: varchar("defaultCurrency", { length: 3 }),
  
  // Payout schedule
  payoutSchedule: mysqlEnum("payoutSchedule", ["daily", "weekly", "monthly"]).default("weekly"),
  payoutDay: int("payoutDay"), // 0-6 for weekly (0=Sunday), 1-28 for monthly
  
  // Verification
  requirementsCurrentlyDue: json("requirementsCurrentlyDue"),
  requirementsPastDue: json("requirementsPastDue"),
  requirementsEventuallyDue: json("requirementsEventuallyDue"),
  
  // Metadata
  lastWebhookAt: timestamp("lastWebhookAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StripeConnectAccount = typeof stripeConnectAccounts.$inferSelect;
export type InsertStripeConnectAccount = typeof stripeConnectAccounts.$inferInsert;


// ============================================================================
// COACH GALLERY PHOTOS (Multiple photos for coach profiles)
// ============================================================================
export const coachGalleryPhotos = mysqlTable("coach_gallery_photos", {
  id: int("id").autoincrement().primaryKey(),
  
  // Owner
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Photo details
  photoUrl: text("photoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  caption: varchar("caption", { length: 200 }),
  altText: varchar("altText", { length: 200 }),
  
  // Photo type/category
  photoType: mysqlEnum("photoType", [
    "profile",        // Main profile photo
    "workspace",      // Office/workspace photo
    "certificate",    // Certificates/diplomas
    "session",        // Teaching session photo
    "event",          // Event/conference photo
    "other"           // Other photos
  ]).default("other"),
  
  // Ordering
  sortOrder: int("sortOrder").default(0),
  
  // Status
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachGalleryPhoto = typeof coachGalleryPhotos.$inferSelect;
export type InsertCoachGalleryPhoto = typeof coachGalleryPhotos.$inferInsert;

// ============================================================================
// PUSH SUBSCRIPTIONS (Browser push notification subscriptions)
// ============================================================================
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  
  // User
  userId: int("userId").notNull().references(() => users.id),
  
  // Push subscription data (from browser)
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),  // Public key
  auth: text("auth").notNull(),       // Auth secret
  
  // Device info
  userAgent: text("userAgent"),
  deviceName: varchar("deviceName", { length: 100 }),
  
  // Notification preferences
  enableBookings: boolean("enableBookings").default(true),
  enableMessages: boolean("enableMessages").default(true),
  enableReminders: boolean("enableReminders").default(true),
  enableMarketing: boolean("enableMarketing").default(false),
  
  // Status
  isActive: boolean("isActive").default(true),
  lastUsedAt: timestamp("lastUsedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

// ============================================================================
// SESSION NOTES (Coach notes for sessions)
// ============================================================================
export const sessionNotes = mysqlTable("session_notes", {
  id: int("id").autoincrement().primaryKey(),
  
  // Session reference
  sessionId: int("sessionId").notNull().references(() => sessions.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Notes content
  notes: text("notes").notNull(),
  
  // Progress tracking
  topicsCovered: json("topicsCovered"),  // Array of topics
  areasForImprovement: json("areasForImprovement"),  // Array of areas
  homework: text("homework"),
  
  // SLE-specific feedback
  oralLevel: mysqlEnum("oralLevel", ["X", "A", "B", "C"]),
  writtenLevel: mysqlEnum("writtenLevel", ["X", "A", "B", "C"]),
  readingLevel: mysqlEnum("readingLevel", ["X", "A", "B", "C"]),
  
  // Visibility
  sharedWithLearner: boolean("sharedWithLearner").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionNote = typeof sessionNotes.$inferSelect;
export type InsertSessionNote = typeof sessionNotes.$inferInsert;


// ============================================================================
// COACH BADGES (Achievements and certifications)
// ============================================================================
export const coachBadges = mysqlTable("coach_badges", {
  id: int("id").autoincrement().primaryKey(),
  
  // Coach reference
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Badge type
  badgeType: mysqlEnum("badgeType", [
    "els_verified",      // Verified ELS coach
    "top_rated",         // 4.8+ average rating
    "rising_star",       // New coach with great reviews
    "sessions_50",       // 50 sessions completed
    "sessions_100",      // 100 sessions completed
    "sessions_500",      // 500 sessions completed
    "perfect_attendance", // No cancellations in 3 months
    "quick_responder",   // Responds within 2 hours
    "student_favorite",  // Most favorited coach
    "exam_success",      // High student pass rate
  ]).notNull(),
  
  // Badge details
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Some badges may expire
  isActive: boolean("isActive").default(true),
  
  // Metadata
  metadata: json("metadata"), // Additional data like "passRate: 95%"
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachBadge = typeof coachBadges.$inferSelect;
export type InsertCoachBadge = typeof coachBadges.$inferInsert;

// ============================================================================
// LEARNER FAVORITES (Saved coaches)
// ============================================================================
export const learnerFavorites = mysqlTable("learner_favorites", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  coachId: int("coachId").notNull().references(() => coachProfiles.id),
  
  // Metadata
  note: text("note"), // Personal note about why they favorited
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearnerFavorite = typeof learnerFavorites.$inferSelect;
export type InsertLearnerFavorite = typeof learnerFavorites.$inferInsert;


// ============================================================================
// LOYALTY PROGRAM
// ============================================================================
export const loyaltyPoints = mysqlTable("loyalty_points", {
  id: int("id").autoincrement().primaryKey(),
  
  // Learner reference
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  
  // Points balance
  totalPoints: int("totalPoints").default(0).notNull(),
  availablePoints: int("availablePoints").default(0).notNull(),
  lifetimePoints: int("lifetimePoints").default(0).notNull(),
  
  // Tier based on lifetime points
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

export const pointTransactions = mysqlTable("point_transactions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Learner reference
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  
  // Transaction details
  type: mysqlEnum("type", [
    "earned_booking",      // Points earned from booking a session
    "earned_review",       // Points earned from leaving a review
    "earned_referral",     // Points earned from referring a friend
    "earned_streak",       // Points earned from booking streak
    "earned_milestone",    // Points earned from reaching a milestone
    "redeemed_discount",   // Points redeemed for discount
    "redeemed_session",    // Points redeemed for free session
    "expired",             // Points expired
    "adjustment",          // Manual adjustment by admin
  ]).notNull(),
  
  points: int("points").notNull(), // Positive for earned, negative for redeemed/expired
  description: text("description"),
  
  // Reference to related entity (session, review, etc.)
  referenceType: varchar("referenceType", { length: 50 }),
  referenceId: int("referenceId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertPointTransaction = typeof pointTransactions.$inferInsert;

export const loyaltyRewards = mysqlTable("loyalty_rewards", {
  id: int("id").autoincrement().primaryKey(),
  
  // Reward details
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  nameFr: varchar("nameFr", { length: 100 }).notNull(),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  descriptionFr: text("descriptionFr"),
  
  // Cost and type
  pointsCost: int("pointsCost").notNull(),
  rewardType: mysqlEnum("rewardType", [
    "discount_5",          // 5% discount on next session
    "discount_10",         // 10% discount on next session
    "discount_15",         // 15% discount on next session
    "discount_20",         // 20% discount on next session
    "free_trial",          // Free trial session
    "free_session",        // Free full session
    "priority_booking",    // Priority booking for 1 month
    "exclusive_coach",     // Access to exclusive coaches
  ]).notNull(),
  
  // Availability
  isActive: boolean("isActive").default(true),
  minTier: mysqlEnum("minTier", ["bronze", "silver", "gold", "platinum"]).default("bronze"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = typeof loyaltyRewards.$inferInsert;

export const redeemedRewards = mysqlTable("redeemed_rewards", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  learnerId: int("learnerId").notNull().references(() => learnerProfiles.id),
  rewardId: int("rewardId").notNull().references(() => loyaltyRewards.id),
  
  // Redemption details
  pointsSpent: int("pointsSpent").notNull(),
  status: mysqlEnum("status", ["active", "used", "expired"]).default("active").notNull(),
  
  // For discount rewards, store the discount code
  discountCode: varchar("discountCode", { length: 50 }),
  
  // Expiry
  expiresAt: timestamp("expiresAt"),
  usedAt: timestamp("usedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RedeemedReward = typeof redeemedRewards.$inferSelect;
export type InsertRedeemedReward = typeof redeemedRewards.$inferInsert;
