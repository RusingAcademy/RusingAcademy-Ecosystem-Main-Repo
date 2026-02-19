// server/services/coachAnalyticsService.ts — Phase 3: Coach Dashboard Analytics
import { getDb } from "../db";
import { sessions, sessionNotes, sessionFeedback, payoutLedger, users, coachProfiles, learnerProfiles } from "../../drizzle/schema";
import { eq, and, gte, lte, sql, count, avg, desc } from "drizzle-orm";
import { createLogger } from "../logger";

const log = createLogger("services-coachAnalytics");

// Simple in-memory cache (no Redis available)
const analyticsCache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = analyticsCache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    analyticsCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  analyticsCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

export interface SessionStats {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  upcoming: number;
  completionRate: number;
  avgDuration: number;
  byDay: Record<string, number>;
}

export interface RevenueStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayout: number;
  avgSessionPrice: number;
  revenueByMonth: Array<{ month: string; amount: number }>;
}

export interface FeedbackStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  recentFeedback: Array<{ rating: number; comment: string; learnerName: string | null; date: Date | null }>;
}

export interface DashboardOverview {
  sessions: SessionStats;
  revenue: RevenueStats;
  feedback: FeedbackStats;
  activeStudents: number;
  nextSession: { id: number; scheduledAt: Date; learnerName: string } | null;
}

export const coachAnalyticsService = {
  async getSessionStats(coachProfileId: number, startDate?: Date, endDate?: Date): Promise<SessionStats> {
    const cacheKey = `coach:${coachProfileId}:sessions:${startDate?.toISOString() || "all"}`;
    const cached = getCached<SessionStats>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const conditions = [eq(sessions.coachId, coachProfileId)];
    if (startDate) conditions.push(gte(sessions.scheduledAt, startDate));
    if (endDate) conditions.push(lte(sessions.scheduledAt, endDate));

    const db = await getDb();
    const allSessions = await db.select({
      id: sessions.id,
      status: sessions.status,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
    }).from(sessions).where(and(...conditions));

    let completed = 0, cancelled = 0, noShow = 0, upcoming = 0, totalDuration = 0, durationCount = 0;
    const byDay: Record<string, number> = {};

    for (const s of allSessions) {
      if (s.status === "completed") { completed++; totalDuration += s.duration || 60; durationCount++; }
      else if (s.status === "cancelled") cancelled++;
      else if (s.status === "no_show") noShow++;
      else if (s.scheduledAt && new Date(s.scheduledAt) > now) upcoming++;

      if (s.scheduledAt) {
        const day = new Date(s.scheduledAt).toISOString().split("T")[0];
        byDay[day] = (byDay[day] || 0) + 1;
      }
    }

    const total = allSessions.length;
    const result: SessionStats = {
      total,
      completed,
      cancelled,
      noShow,
      upcoming,
      avgDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byDay,
    };

    setCache(cacheKey, result);
    return result;
  },

  async getRevenueStats(coachProfileId: number): Promise<RevenueStats> {
    const cacheKey = `coach:${coachProfileId}:revenue`;
    const cached = getCached<RevenueStats>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all coach payouts from the payout ledger
    const db2 = await getDb();
    const payouts = await db2.select({
      netAmount: payoutLedger.netAmount,
      grossAmount: payoutLedger.grossAmount,
      createdAt: payoutLedger.createdAt,
      transactionType: payoutLedger.transactionType,
    }).from(payoutLedger).where(eq(payoutLedger.coachId, coachProfileId));

    let totalEarnings = 0, monthlyEarnings = 0, pendingPayout = 0;
    const monthlyMap = new Map<string, number>();

    for (const p of payouts) {
      if (p.transactionType === "coach_payout" || p.transactionType === "session_payment") {
        totalEarnings += p.netAmount;
        if (p.createdAt && new Date(p.createdAt) >= monthStart) {
          monthlyEarnings += p.netAmount;
        }
        if (p.createdAt) {
          const monthKey = `${new Date(p.createdAt).getFullYear()}-${String(new Date(p.createdAt).getMonth() + 1).padStart(2, "0")}`;
          monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + p.netAmount);
        }
      }
    }

    const completedSessions = await db2.select({ price: sessions.price }).from(sessions)
      .where(and(eq(sessions.coachId, coachProfileId), eq(sessions.status, "completed")));

    const avgSessionPrice = completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + s.price, 0) / completedSessions.length)
      : 0;

    const revenueByMonth = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, amount]) => ({ month, amount }));

    const result: RevenueStats = { totalEarnings, monthlyEarnings, pendingPayout, avgSessionPrice, revenueByMonth };
    setCache(cacheKey, result);
    return result;
  },

  async getFeedbackStats(coachProfileId: number): Promise<FeedbackStats> {
    const cacheKey = `coach:${coachProfileId}:feedback`;
    const cached = getCached<FeedbackStats>(cacheKey);
    if (cached) return cached;

    const db = await getDb();
    const feedback = await db.select({
      rating: sessionFeedback.rating,
      comment: sessionFeedback.comment,
      createdAt: sessionFeedback.createdAt,
    }).from(sessionFeedback)
      .innerJoin(sessions, eq(sessionFeedback.sessionId, sessions.id))
      .where(eq(sessions.coachId, coachProfileId))
      .orderBy(desc(sessionFeedback.createdAt))
      .limit(50);

    if (feedback.length === 0) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, recentFeedback: [] };
    }

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    for (const f of feedback) {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDistribution[f.rating]++;
        totalRating += f.rating;
      }
    }

    const result: FeedbackStats = {
      averageRating: Math.round((totalRating / feedback.length) * 10) / 10,
      totalReviews: feedback.length,
      ratingDistribution,
      recentFeedback: feedback.slice(0, 10).map((f) => ({
        rating: f.rating,
        comment: f.comment || "",
        learnerName: null,
        date: f.createdAt,
      })),
    };

    setCache(cacheKey, result);
    return result;
  },

  async getDashboardOverview(coachProfileId: number): Promise<DashboardOverview> {
    const [sessionStats, revenue, feedback] = await Promise.all([
      this.getSessionStats(coachProfileId),
      this.getRevenueStats(coachProfileId),
      this.getFeedbackStats(coachProfileId),
    ]);

    // Count active students (unique learners with sessions in last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const db = await getDb();
    const activeStudentsResult = await db.selectDistinct({ learnerId: sessions.learnerId })
      .from(sessions)
      .where(and(eq(sessions.coachId, coachProfileId), gte(sessions.scheduledAt, ninetyDaysAgo)));
    const activeStudents = activeStudentsResult.length;

    // Get next upcoming session
    const now = new Date();
    const nextSessionResult = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      learnerId: sessions.learnerId,
    }).from(sessions)
      .where(and(eq(sessions.coachId, coachProfileId), gte(sessions.scheduledAt, now), eq(sessions.status, "confirmed")))
      .orderBy(sessions.scheduledAt)
      .limit(1);

    let nextSession: DashboardOverview["nextSession"] = null;
    if (nextSessionResult.length > 0) {
      nextSession = {
        id: nextSessionResult[0].id,
        scheduledAt: nextSessionResult[0].scheduledAt,
        learnerName: "Learner",
      };
    }

    return { sessions: sessionStats, revenue, feedback, activeStudents, nextSession };
  },

  invalidateCache(coachProfileId: number): void {
    for (const key of analyticsCache.keys()) {
      if (key.startsWith(`coach:${coachProfileId}:`)) {
        analyticsCache.delete(key);
      }
    }
  },
};
