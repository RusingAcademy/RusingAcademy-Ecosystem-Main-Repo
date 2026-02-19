/**
 * Phase 5: Coach Earnings Dashboard Service
 * Provides detailed earnings analytics for coaches
 */
import { getDb } from "../_core/db";
import * as schema from "../../drizzle/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  sessionsCompleted: number;
  avgPerSession: number;
  monthlyTrend: Array<{ month: string; amount: number; sessions: number }>;
  topPackages: Array<{ name: string; revenue: number; count: number }>;
}

export interface PayoutRecord {
  id: number;
  amount: number;
  status: string;
  method: string;
  createdAt: Date;
  paidAt: Date | null;
  reference: string | null;
}

/**
 * Get earnings summary for a coach
 */
export async function getEarningsSummary(
  coachId: number,
  startDate?: Date,
  endDate?: Date
): Promise<EarningsSummary> {
  const db = await getDb();
  const start = startDate || new Date(new Date().getFullYear(), 0, 1); // Start of year
  const end = endDate || new Date();

  // Get completed sessions with earnings
  const sessions = await db
    .select({
      count: sql<number>`COUNT(*)`,
      total: sql<number>`COALESCE(SUM(${schema.sessions.price}), 0)`,
    })
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.coachId, coachId),
        eq(schema.sessions.status, "completed"),
        gte(schema.sessions.scheduledAt, start),
        lte(schema.sessions.scheduledAt, end)
      )
    );

  const totalEarnings = Number(sessions[0]?.total || 0);
  const sessionsCompleted = Number(sessions[0]?.count || 0);

  // Monthly trend (last 12 months)
  const monthlyTrend: Array<{ month: string; amount: number; sessions: number }> = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - i, 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const monthData = await db
      .select({
        count: sql<number>`COUNT(*)`,
        total: sql<number>`COALESCE(SUM(${schema.sessions.price}), 0)`,
      })
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.coachId, coachId),
          eq(schema.sessions.status, "completed"),
          gte(schema.sessions.scheduledAt, monthStart),
          lte(schema.sessions.scheduledAt, monthEnd)
        )
      );

    monthlyTrend.push({
      month: monthStart.toISOString().substring(0, 7),
      amount: Number(monthData[0]?.total || 0),
      sessions: Number(monthData[0]?.count || 0),
    });
  }

  return {
    totalEarnings,
    pendingPayouts: 0, // Will be populated from Stripe Connect
    completedPayouts: totalEarnings,
    sessionsCompleted,
    avgPerSession: sessionsCompleted > 0 ? totalEarnings / sessionsCompleted : 0,
    monthlyTrend,
    topPackages: [],
  };
}

/**
 * Get payout history for a coach
 */
export async function getPayoutHistory(
  coachId: number,
  limit: number = 20,
  offset: number = 0
): Promise<{ payouts: PayoutRecord[]; total: number }> {
  // For now, return from sessions as individual payouts
  // Will be enhanced with Stripe Connect payouts when fully integrated
  const db = await getDb();

  const completedSessions = await db
    .select({
      id: schema.sessions.id,
      amount: schema.sessions.price,
      status: schema.sessions.status,
      createdAt: schema.sessions.scheduledAt,
    })
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.coachId, coachId),
        eq(schema.sessions.status, "completed")
      )
    )
    .orderBy(desc(schema.sessions.scheduledAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.coachId, coachId),
        eq(schema.sessions.status, "completed")
      )
    );

  return {
    payouts: completedSessions.map((s) => ({
      id: s.id,
      amount: Number(s.amount || 0),
      status: "completed",
      method: "stripe_connect",
      createdAt: s.createdAt || new Date(),
      paidAt: s.createdAt || null,
      reference: null,
    })),
    total: Number(countResult[0]?.count || 0),
  };
}
