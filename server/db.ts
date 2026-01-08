import { eq, desc, and, sql, like, or, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  coachProfiles, 
  learnerProfiles,
  reviews,
  sessions,
  conversations,
  messages,
  aiSessions,
  InsertCoachProfile,
  InsertLearnerProfile,
  commissionTiers,
  coachCommissions,
  referralLinks,
  referralTracking,
  payoutLedger,
  coachPayouts,
  platformSettings,
  InsertCommissionTier,
  InsertCoachCommission,
  InsertReferralLink,
  InsertPayoutLedger,
  InsertCoachPayout,
  coachAvailability,
  InsertCoachAvailability,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER QUERIES
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// COACH QUERIES
// ============================================================================

export interface CoachFilters {
  language?: "french" | "english" | "both";
  specializations?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getApprovedCoaches(filters: CoachFilters = {}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(coachProfiles.status, "approved")];

  if (filters.language && filters.language !== "both") {
    conditions.push(
      or(
        eq(coachProfiles.languages, filters.language),
        eq(coachProfiles.languages, "both")
      )!
    );
  }

  if (filters.minPrice) {
    conditions.push(gte(coachProfiles.hourlyRate, filters.minPrice));
  }

  if (filters.maxPrice) {
    conditions.push(lte(coachProfiles.hourlyRate, filters.maxPrice));
  }

  const query = db
    .select({
      coach: coachProfiles,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(coachProfiles)
    .innerJoin(users, eq(coachProfiles.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(coachProfiles.averageRating))
    .limit(filters.limit || 20)
    .offset(filters.offset || 0);

  return await query;
}

export async function getCoachBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select({
      coach: coachProfiles,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(coachProfiles)
    .innerJoin(users, eq(coachProfiles.userId, users.id))
    .where(eq(coachProfiles.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getCoachByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(coachProfiles)
    .where(eq(coachProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createCoachProfile(data: InsertCoachProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(coachProfiles).values(data);
  return result;
}

export async function updateCoachProfile(id: number, data: Partial<InsertCoachProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(coachProfiles).set(data).where(eq(coachProfiles.id, id));
}

export async function getCoachReviews(coachId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      review: reviews,
      learner: {
        id: users.id,
        name: users.name,
      },
    })
    .from(reviews)
    .innerJoin(learnerProfiles, eq(reviews.learnerId, learnerProfiles.id))
    .innerJoin(users, eq(learnerProfiles.userId, users.id))
    .where(and(eq(reviews.coachId, coachId), eq(reviews.isVisible, true)))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export async function getCoachStats(coachId: number) {
  const db = await getDb();
  if (!db) return null;

  const [reviewStats] = await db
    .select({
      totalReviews: sql<number>`COUNT(*)`,
      avgRating: sql<number>`AVG(${reviews.rating})`,
    })
    .from(reviews)
    .where(eq(reviews.coachId, coachId));

  const [sessionStats] = await db
    .select({
      totalSessions: sql<number>`COUNT(*)`,
      completedSessions: sql<number>`SUM(CASE WHEN ${sessions.status} = 'completed' THEN 1 ELSE 0 END)`,
    })
    .from(sessions)
    .where(eq(sessions.coachId, coachId));

  return {
    totalReviews: reviewStats?.totalReviews || 0,
    avgRating: reviewStats?.avgRating || 0,
    totalSessions: sessionStats?.totalSessions || 0,
    completedSessions: sessionStats?.completedSessions || 0,
  };
}

// ============================================================================
// LEARNER QUERIES
// ============================================================================

export async function getLearnerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(learnerProfiles)
    .where(eq(learnerProfiles.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createLearnerProfile(data: InsertLearnerProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(learnerProfiles).values(data);
  return result;
}

export async function updateLearnerProfile(id: number, data: Partial<InsertLearnerProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(learnerProfiles).set(data).where(eq(learnerProfiles.id, id));
}

// ============================================================================
// SESSION QUERIES
// ============================================================================

export async function getUpcomingSessions(userId: number, role: "coach" | "learner", limit = 10) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();

  if (role === "coach") {
    const coach = await getCoachByUserId(userId);
    if (!coach) return [];

    return await db
      .select({
        session: sessions,
        learner: {
          id: users.id,
          name: users.name,
        },
      })
      .from(sessions)
      .innerJoin(learnerProfiles, eq(sessions.learnerId, learnerProfiles.id))
      .innerJoin(users, eq(learnerProfiles.userId, users.id))
      .where(
        and(
          eq(sessions.coachId, coach.id),
          gte(sessions.scheduledAt, now),
          eq(sessions.status, "confirmed")
        )
      )
      .orderBy(sessions.scheduledAt)
      .limit(limit);
  } else {
    const learner = await getLearnerByUserId(userId);
    if (!learner) return [];

    return await db
      .select({
        session: sessions,
        coach: {
          id: users.id,
          name: users.name,
        },
      })
      .from(sessions)
      .innerJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .innerJoin(users, eq(coachProfiles.userId, users.id))
      .where(
        and(
          eq(sessions.learnerId, learner.id),
          gte(sessions.scheduledAt, now),
          eq(sessions.status, "confirmed")
        )
      )
      .orderBy(sessions.scheduledAt)
      .limit(limit);
  }
}

// ============================================================================
// AI SESSION QUERIES
// ============================================================================

export async function createAiSession(data: {
  learnerId: number;
  sessionType: "practice" | "placement" | "simulation";
  language: "french" | "english";
  targetLevel?: "a" | "b" | "c";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(aiSessions).values({
    ...data,
    status: "in_progress",
  });

  return result;
}

export async function updateAiSession(id: number, data: {
  status?: "in_progress" | "completed" | "abandoned";
  endedAt?: Date;
  duration?: number;
  transcript?: string;
  feedback?: string;
  placementResult?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(aiSessions).set(data).where(eq(aiSessions.id, id));
}

export async function getLearnerAiSessions(learnerId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(aiSessions)
    .where(eq(aiSessions.learnerId, learnerId))
    .orderBy(desc(aiSessions.createdAt))
    .limit(limit);
}


// ============================================================================
// COMMISSION & PAYOUT QUERIES
// ============================================================================

// Commission Tiers
export async function getCommissionTiers() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(commissionTiers)
    .where(eq(commissionTiers.isActive, true))
    .orderBy(commissionTiers.priority);
}

export async function getCommissionTierById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(commissionTiers)
    .where(eq(commissionTiers.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createCommissionTier(data: InsertCommissionTier) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(commissionTiers).values(data);
}

export async function updateCommissionTier(id: number, data: Partial<InsertCommissionTier>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(commissionTiers).set(data).where(eq(commissionTiers.id, id));
}

// Coach Commission Assignments
export async function getCoachCommission(coachId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select({
      commission: coachCommissions,
      tier: commissionTiers,
    })
    .from(coachCommissions)
    .innerJoin(commissionTiers, eq(coachCommissions.tierId, commissionTiers.id))
    .where(eq(coachCommissions.coachId, coachId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createCoachCommission(data: InsertCoachCommission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(coachCommissions).values(data);
}

export async function updateCoachCommission(coachId: number, data: Partial<InsertCoachCommission>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(coachCommissions).set(data).where(eq(coachCommissions.coachId, coachId));
}

// Calculate commission rate for a coach based on tier and hours
export async function calculateCommissionRate(coachId: number, isTrialSession: boolean): Promise<{
  commissionBps: number;
  tierId: number | null;
  referralLinkId: number | null;
}> {
  // Trial sessions = 0% commission
  if (isTrialSession) {
    return { commissionBps: 0, tierId: null, referralLinkId: null };
  }

  const db = await getDb();
  if (!db) {
    // Default to 26% if database unavailable
    return { commissionBps: 2600, tierId: null, referralLinkId: null };
  }

  // Get coach's commission assignment
  const coachComm = await getCoachCommission(coachId);
  
  if (coachComm) {
    // Use override if set, otherwise use tier rate
    const rate = coachComm.commission.overrideCommissionBps ?? coachComm.tier.commissionBps;
    return {
      commissionBps: rate,
      tierId: coachComm.tier.id,
      referralLinkId: null,
    };
  }

  // No assignment - use default standard tier (highest commission)
  const tiers = await getCommissionTiers();
  const standardTier = tiers.find(t => t.tierType === "standard" && t.minHours === 0);
  
  return {
    commissionBps: standardTier?.commissionBps ?? 2600,
    tierId: standardTier?.id ?? null,
    referralLinkId: null,
  };
}

// Check if learner was referred and get discount
export async function getReferralDiscount(learnerId: number, coachId: number): Promise<{
  hasReferral: boolean;
  discountBps: number;
  referralLinkId: number | null;
}> {
  const db = await getDb();
  if (!db) return { hasReferral: false, discountBps: 0, referralLinkId: null };

  // Check if learner has active referral from this coach
  const result = await db
    .select({
      tracking: referralTracking,
      link: referralLinks,
    })
    .from(referralTracking)
    .innerJoin(referralLinks, eq(referralTracking.referralLinkId, referralLinks.id))
    .where(
      and(
        eq(referralTracking.learnerId, learnerId),
        eq(referralLinks.coachId, coachId),
        eq(referralLinks.isActive, true)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return { hasReferral: false, discountBps: 0, referralLinkId: null };
  }

  return {
    hasReferral: true,
    discountBps: result[0].link.discountCommissionBps ?? 500,
    referralLinkId: result[0].link.id,
  };
}

// Referral Links
export async function getCoachReferralLink(coachId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(referralLinks)
    .where(and(eq(referralLinks.coachId, coachId), eq(referralLinks.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createReferralLink(data: InsertReferralLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(referralLinks).values(data);
}

export async function getReferralLinkByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(referralLinks)
    .where(and(eq(referralLinks.code, code), eq(referralLinks.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function incrementReferralClick(linkId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(referralLinks)
    .set({ clickCount: sql`${referralLinks.clickCount} + 1` })
    .where(eq(referralLinks.id, linkId));
}

// Payout Ledger
export async function createPayoutLedgerEntry(data: InsertPayoutLedger) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(payoutLedger).values(data);
}

export async function getCoachPayoutLedger(coachId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(payoutLedger)
    .where(eq(payoutLedger.coachId, coachId))
    .orderBy(desc(payoutLedger.createdAt))
    .limit(limit);
}

export async function getCoachEarningsSummary(coachId: number): Promise<{
  totalGross: number;
  totalFees: number;
  totalNet: number;
  pendingPayout: number;
  sessionCount: number;
}> {
  const db = await getDb();
  if (!db) {
    return { totalGross: 0, totalFees: 0, totalNet: 0, pendingPayout: 0, sessionCount: 0 };
  }

  const [stats] = await db
    .select({
      totalGross: sql<number>`COALESCE(SUM(CASE WHEN ${payoutLedger.transactionType} = 'session_payment' THEN ${payoutLedger.grossAmount} ELSE 0 END), 0)`,
      totalFees: sql<number>`COALESCE(SUM(CASE WHEN ${payoutLedger.transactionType} = 'platform_fee' THEN ${payoutLedger.platformFee} ELSE 0 END), 0)`,
      totalNet: sql<number>`COALESCE(SUM(CASE WHEN ${payoutLedger.transactionType} = 'coach_payout' THEN ${payoutLedger.netAmount} ELSE 0 END), 0)`,
      pendingPayout: sql<number>`COALESCE(SUM(CASE WHEN ${payoutLedger.status} = 'pending' THEN ${payoutLedger.netAmount} ELSE 0 END), 0)`,
      sessionCount: sql<number>`COUNT(DISTINCT ${payoutLedger.sessionId})`,
    })
    .from(payoutLedger)
    .where(eq(payoutLedger.coachId, coachId));

  return {
    totalGross: stats?.totalGross ?? 0,
    totalFees: stats?.totalFees ?? 0,
    totalNet: stats?.totalNet ?? 0,
    pendingPayout: stats?.pendingPayout ?? 0,
    sessionCount: stats?.sessionCount ?? 0,
  };
}

// Coach Payouts (aggregated)
export async function getCoachPayoutHistory(coachId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(coachPayouts)
    .where(eq(coachPayouts.coachId, coachId))
    .orderBy(desc(coachPayouts.periodEnd))
    .limit(limit);
}

export async function createCoachPayout(data: InsertCoachPayout) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(coachPayouts).values(data);
}

// Platform Settings
export async function getPlatformSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertPlatformSetting(key: string, value: unknown, description?: string, updatedBy?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(platformSettings)
    .values({ key, value, description, updatedBy })
    .onDuplicateKeyUpdate({
      set: { value, description, updatedBy },
    });
}

// Seed default commission tiers
export async function seedDefaultCommissionTiers() {
  const db = await getDb();
  if (!db) return;

  const existingTiers = await getCommissionTiers();
  if (existingTiers.length > 0) return; // Already seeded

  // Verified SLE Coach tier (15%)
  await createCommissionTier({
    name: "Verified SLE Coach",
    tierType: "verified_sle",
    commissionBps: 1500,
    minHours: 0,
    maxHours: null,
    priority: 1,
    isActive: true,
  });

  // Standard tiers (26% → 15% based on volume)
  const standardTiers = [
    { name: "Standard - Tier 1 (0-10 hours)", minHours: 0, maxHours: 10, commissionBps: 2600, priority: 10 },
    { name: "Standard - Tier 2 (10-30 hours)", minHours: 10, maxHours: 30, commissionBps: 2200, priority: 11 },
    { name: "Standard - Tier 3 (30-60 hours)", minHours: 30, maxHours: 60, commissionBps: 1900, priority: 12 },
    { name: "Standard - Tier 4 (60-100 hours)", minHours: 60, maxHours: 100, commissionBps: 1700, priority: 13 },
    { name: "Standard - Tier 5 (100+ hours)", minHours: 100, maxHours: null, commissionBps: 1500, priority: 14 },
  ];

  for (const tier of standardTiers) {
    await createCommissionTier({
      ...tier,
      tierType: "standard",
      isActive: true,
    });
  }

  // Referral tier (5% default)
  await createCommissionTier({
    name: "Referral Discount",
    tierType: "referral",
    commissionBps: 500,
    minHours: 0,
    maxHours: null,
    priority: 100,
    isActive: true,
  });
}


// ============================================================================
// COACH AVAILABILITY QUERIES
// ============================================================================

export async function getCoachAvailability(coachId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(coachAvailability)
    .where(and(eq(coachAvailability.coachId, coachId), eq(coachAvailability.isActive, true)))
    .orderBy(coachAvailability.dayOfWeek, coachAvailability.startTime);
}

export async function setCoachAvailability(coachId: number, slots: Omit<InsertCoachAvailability, "coachId">[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete existing availability for this coach
  await db.delete(coachAvailability).where(eq(coachAvailability.coachId, coachId));

  // Insert new availability slots
  if (slots.length > 0) {
    const values = slots.map((slot) => ({
      ...slot,
      coachId,
    }));
    await db.insert(coachAvailability).values(values);
  }
}

export async function addCoachAvailabilitySlot(data: InsertCoachAvailability) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(coachAvailability).values(data);
}

export async function removeCoachAvailabilitySlot(slotId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(coachAvailability).where(eq(coachAvailability.id, slotId));
}

export async function getAvailableTimeSlotsForDate(coachId: number, date: Date) {
  const db = await getDb();
  if (!db) return [];

  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  // Get coach's availability for this day of week
  const availability = await db
    .select()
    .from(coachAvailability)
    .where(
      and(
        eq(coachAvailability.coachId, coachId),
        eq(coachAvailability.dayOfWeek, dayOfWeek),
        eq(coachAvailability.isActive, true)
      )
    );

  if (availability.length === 0) return [];

  // Get existing bookings for this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await db
    .select({ scheduledAt: sessions.scheduledAt, duration: sessions.duration })
    .from(sessions)
    .where(
      and(
        eq(sessions.coachId, coachId),
        gte(sessions.scheduledAt, startOfDay),
        lte(sessions.scheduledAt, endOfDay),
        or(
          eq(sessions.status, "pending"),
          eq(sessions.status, "confirmed")
        )
      )
    );

  // Generate available time slots based on availability windows
  const slots: string[] = [];
  for (const window of availability) {
    const [startHour, startMin] = window.startTime.split(":").map(Number);
    const [endHour, endMin] = window.endTime.split(":").map(Number);

    // Generate hourly slots within the window
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = `${hour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")}`;
      
      // Check if this slot conflicts with existing bookings
      const slotDate = new Date(date);
      slotDate.setHours(hour, startMin, 0, 0);
      
      const hasConflict = existingBookings.some((booking) => {
        const bookingStart = new Date(booking.scheduledAt);
        const bookingEnd = new Date(bookingStart.getTime() + (booking.duration || 60) * 60 * 1000);
        const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000); // 1 hour slot
        
        return slotDate < bookingEnd && slotEnd > bookingStart;
      });

      if (!hasConflict) {
        // Format as "9:00 AM" or "2:00 PM"
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        slots.push(`${displayHour}:${startMin.toString().padStart(2, "0")} ${ampm}`);
      }
    }
  }

  return slots;
}
