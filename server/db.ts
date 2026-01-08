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
