/**
 * Sprint 4: Executive Summary Analytics Router
 * 
 * Aggregates KPIs from all existing analytics routers into a single
 * executive-level view. Provides period-over-period comparisons,
 * CSV/JSON export, and trend data for the LRDG-grade reporting dashboard.
 */
import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { sql, eq, gte, and, desc, count } from "drizzle-orm";
import { users, coachProfiles, courses, sessions } from "../../drizzle/schema";

// ── Helper: date range from period string ────────────────────────────────────
function getDateRange(period: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const now = new Date();
  const end = now;
  let start: Date;
  let prevStart: Date;
  let prevEnd: Date;

  switch (period) {
    case "7d":
      start = new Date(now.getTime() - 7 * 86400000);
      prevEnd = new Date(start.getTime() - 1);
      prevStart = new Date(prevEnd.getTime() - 7 * 86400000);
      break;
    case "30d":
      start = new Date(now.getTime() - 30 * 86400000);
      prevEnd = new Date(start.getTime() - 1);
      prevStart = new Date(prevEnd.getTime() - 30 * 86400000);
      break;
    case "90d":
      start = new Date(now.getTime() - 90 * 86400000);
      prevEnd = new Date(start.getTime() - 1);
      prevStart = new Date(prevEnd.getTime() - 90 * 86400000);
      break;
    case "ytd":
      start = new Date(now.getFullYear(), 0, 1);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case "12m":
    default:
      start = new Date(now.getTime() - 365 * 86400000);
      prevEnd = new Date(start.getTime() - 1);
      prevStart = new Date(prevEnd.getTime() - 365 * 86400000);
      break;
  }

  return { start, end, prevStart, prevEnd };
}

// ── Helper: calculate trend percentage ───────────────────────────────────────
function calcTrend(current: number, previous: number): { direction: "up" | "down" | "neutral"; pct: string } {
  if (previous === 0 && current === 0) return { direction: "neutral", pct: "0%" };
  if (previous === 0) return { direction: "up", pct: "+100%" };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) return { direction: "neutral", pct: "0%" };
  return {
    direction: change > 0 ? "up" : "down",
    pct: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
  };
}

export const executiveSummaryRouter = router({
  // ── Executive KPI Summary ─────────────────────────────────────────────────
  getExecutiveSummary: adminProcedure
    .input(z.object({ period: z.string().default("30d") }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          period: input.period,
          kpis: {
            totalUsers: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            activeUsers: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            totalCourses: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            activeCoaches: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            totalRevenue: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            enrollments: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            completionRate: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
            avgSessionsPerUser: { value: 0, trend: { direction: "neutral" as const, pct: "0%" } },
          },
          generatedAt: new Date().toISOString(),
        };
      }

      const { start, prevStart, prevEnd } = getDateRange(input.period);

      // Total users (current period vs previous)
      const [currentUsers] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(gte(users.createdAt, start));
      const [prevUsers] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(and(gte(users.createdAt, prevStart), sql`${users.createdAt} <= ${prevEnd}`));
      const [totalUsersAll] = await db.select({ count: sql<number>`count(*)` }).from(users);

      // Active users (signed in during period)
      const [activeUsers] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(gte(users.lastSignedIn, start));
      const [prevActiveUsers] = await db.select({ count: sql<number>`count(*)` })
        .from(users).where(and(gte(users.lastSignedIn, prevStart), sql`${users.lastSignedIn} <= ${prevEnd}`));

      // Courses
      const [totalCourses] = await db.select({ count: sql<number>`count(*)` }).from(courses);
      const [publishedCourses] = await db.select({ count: sql<number>`count(*)` })
        .from(courses).where(eq(courses.status, "published"));

      // Active coaches
      const [activeCoaches] = await db.select({ count: sql<number>`count(*)` })
        .from(coachProfiles).where(eq(coachProfiles.status, "approved"));

      // Revenue from payout ledger
      const { payoutLedger } = await import("../../drizzle/schema");
      const [currentRevenue] = await db.select({
        total: sql<number>`COALESCE(SUM(${payoutLedger.grossAmount}), 0)`
      }).from(payoutLedger).where(gte(payoutLedger.createdAt, start));
      const [prevRevenue] = await db.select({
        total: sql<number>`COALESCE(SUM(${payoutLedger.grossAmount}), 0)`
      }).from(payoutLedger).where(and(gte(payoutLedger.createdAt, prevStart), sql`${payoutLedger.createdAt} <= ${prevEnd}`));

      // Enrollments
      const { courseEnrollments } = await import("../../drizzle/schema");
      const [currentEnrollments] = await db.select({ count: sql<number>`count(*)` })
        .from(courseEnrollments).where(gte(courseEnrollments.enrolledAt, start));
      const [prevEnrollments] = await db.select({ count: sql<number>`count(*)` })
        .from(courseEnrollments).where(and(gte(courseEnrollments.enrolledAt, prevStart), sql`${courseEnrollments.enrolledAt} <= ${prevEnd}`));

      // Completion rate
      const [completedEnrollments] = await db.select({ count: sql<number>`count(*)` })
        .from(courseEnrollments).where(eq(courseEnrollments.status, "completed"));
      const [totalEnrollments] = await db.select({ count: sql<number>`count(*)` })
        .from(courseEnrollments);
      const completionRate = (totalEnrollments?.count ?? 0) > 0
        ? Math.round(((completedEnrollments?.count ?? 0) / (totalEnrollments?.count ?? 1)) * 100)
        : 0;

      // Sessions per user
      const [sessionCount] = await db.select({ count: sql<number>`count(*)` })
        .from(sessions).where(gte(sessions.scheduledAt, start));
      const avgSessionsPerUser = (activeUsers?.count ?? 0) > 0
        ? Math.round(((sessionCount?.count ?? 0) / (activeUsers?.count ?? 1)) * 10) / 10
        : 0;

      return {
        period: input.period,
        kpis: {
          totalUsers: {
            value: totalUsersAll?.count ?? 0,
            newThisPeriod: currentUsers?.count ?? 0,
            trend: calcTrend(currentUsers?.count ?? 0, prevUsers?.count ?? 0),
          },
          activeUsers: {
            value: activeUsers?.count ?? 0,
            trend: calcTrend(activeUsers?.count ?? 0, prevActiveUsers?.count ?? 0),
          },
          totalCourses: {
            value: totalCourses?.count ?? 0,
            published: publishedCourses?.count ?? 0,
            trend: { direction: "neutral" as const, pct: "0%" },
          },
          activeCoaches: {
            value: activeCoaches?.count ?? 0,
            trend: { direction: "neutral" as const, pct: "0%" },
          },
          totalRevenue: {
            value: currentRevenue?.total ?? 0,
            trend: calcTrend(currentRevenue?.total ?? 0, prevRevenue?.total ?? 0),
          },
          enrollments: {
            value: currentEnrollments?.count ?? 0,
            trend: calcTrend(currentEnrollments?.count ?? 0, prevEnrollments?.count ?? 0),
          },
          completionRate: {
            value: completionRate,
            trend: { direction: "neutral" as const, pct: "0%" },
          },
          avgSessionsPerUser: {
            value: avgSessionsPerUser,
            trend: { direction: "neutral" as const, pct: "0%" },
          },
        },
        generatedAt: new Date().toISOString(),
      };
    }),

  // ── Trend Data (sparklines for executive charts) ──────────────────────────
  getTrendData: adminProcedure
    .input(z.object({
      metric: z.enum(["users", "revenue", "enrollments", "sessions"]),
      period: z.string().default("30d"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const { start } = getDateRange(input.period);

      switch (input.metric) {
        case "users": {
          const [rows] = await db.execute(sql`
            SELECT DATE(createdAt) as date, COUNT(*) as value
            FROM users WHERE createdAt >= ${start}
            GROUP BY DATE(createdAt) ORDER BY date ASC
          `);
          return Array.isArray(rows) ? rows : [];
        }
        case "revenue": {
          const [rows] = await db.execute(sql`
            SELECT DATE(createdAt) as date, COALESCE(SUM(grossAmount), 0) as value
            FROM payout_ledger WHERE createdAt >= ${start}
            GROUP BY DATE(createdAt) ORDER BY date ASC
          `);
          return Array.isArray(rows) ? rows : [];
        }
        case "enrollments": {
          const [rows] = await db.execute(sql`
            SELECT DATE(enrolledAt) as date, COUNT(*) as value
            FROM course_enrollments WHERE enrolledAt >= ${start}
            GROUP BY DATE(enrolledAt) ORDER BY date ASC
          `);
          return Array.isArray(rows) ? rows : [];
        }
        case "sessions": {
          const [rows] = await db.execute(sql`
            SELECT DATE(scheduledAt) as date, COUNT(*) as value
            FROM sessions WHERE scheduledAt >= ${start}
            GROUP BY DATE(scheduledAt) ORDER BY date ASC
          `);
          return Array.isArray(rows) ? rows : [];
        }
      }
    }),

  // ── Platform Health Score ─────────────────────────────────────────────────
  getPlatformHealth: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { score: 0, components: [] };

    const weekAgo = new Date(Date.now() - 7 * 86400000);

    // Component health checks
    const components = [];

    // 1. User growth health
    const [newUsersWeek] = await db.select({ count: sql<number>`count(*)` })
      .from(users).where(gte(users.createdAt, weekAgo));
    components.push({
      name: "User Growth",
      nameFr: "Croissance utilisateurs",
      status: (newUsersWeek?.count ?? 0) > 0 ? "healthy" : "warning",
      value: `${newUsersWeek?.count ?? 0} new this week`,
    });

    // 2. Course catalog health
    const [publishedCount] = await db.select({ count: sql<number>`count(*)` })
      .from(courses).where(eq(courses.status, "published"));
    components.push({
      name: "Course Catalog",
      nameFr: "Catalogue de cours",
      status: (publishedCount?.count ?? 0) > 0 ? "healthy" : "critical",
      value: `${publishedCount?.count ?? 0} published courses`,
    });

    // 3. Coach availability
    const [activeCoachCount] = await db.select({ count: sql<number>`count(*)` })
      .from(coachProfiles).where(eq(coachProfiles.status, "approved"));
    components.push({
      name: "Coach Network",
      nameFr: "Réseau de coachs",
      status: (activeCoachCount?.count ?? 0) > 0 ? "healthy" : "warning",
      value: `${activeCoachCount?.count ?? 0} active coaches`,
    });

    // 4. Session activity
    const [recentSessions] = await db.select({ count: sql<number>`count(*)` })
      .from(sessions).where(gte(sessions.scheduledAt, weekAgo));
    components.push({
      name: "Session Activity",
      nameFr: "Activité de sessions",
      status: (recentSessions?.count ?? 0) > 0 ? "healthy" : "warning",
      value: `${recentSessions?.count ?? 0} sessions this week`,
    });

    // Calculate overall score
    const healthyCount = components.filter(c => c.status === "healthy").length;
    const score = Math.round((healthyCount / components.length) * 100);

    return { score, components };
  }),

  // ── Export Report Data ────────────────────────────────────────────────────
  exportReport: adminProcedure
    .input(z.object({
      format: z.enum(["json", "csv"]),
      period: z.string().default("30d"),
      sections: z.array(z.enum(["users", "revenue", "courses", "coaches", "enrollments"])).default(["users", "revenue", "courses", "coaches", "enrollments"]),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { data: "", filename: "report.csv" };

      const { start } = getDateRange(input.period);
      const reportData: Record<string, any> = {};

      if (input.sections.includes("users")) {
        const [rows] = await db.execute(sql`
          SELECT id, name, email, role, createdAt, lastSignedIn
          FROM users WHERE createdAt >= ${start}
          ORDER BY createdAt DESC LIMIT 1000
        `);
        reportData.users = Array.isArray(rows) ? rows : [];
      }

      if (input.sections.includes("enrollments")) {
        const [rows] = await db.execute(sql`
          SELECT ce.id, u.name as userName, u.email, c.title as courseTitle,
            ce.status, ce.progress, ce.enrolledAt, ce.amountPaid
          FROM course_enrollments ce
          LEFT JOIN users u ON ce.userId = u.id
          LEFT JOIN courses c ON ce.courseId = c.id
          WHERE ce.enrolledAt >= ${start}
          ORDER BY ce.enrolledAt DESC LIMIT 1000
        `);
        reportData.enrollments = Array.isArray(rows) ? rows : [];
      }

      if (input.sections.includes("revenue")) {
        const [rows] = await db.execute(sql`
          SELECT DATE_FORMAT(createdAt, '%Y-%m') as month,
            SUM(grossAmount) as totalRevenue,
            SUM(platformFee) as platformFee,
            COUNT(*) as transactions
          FROM payout_ledger
          WHERE createdAt >= ${start}
          GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
          ORDER BY month ASC
        `);
        reportData.revenue = Array.isArray(rows) ? rows : [];
      }

      if (input.format === "csv") {
        // Convert to CSV
        const csvSections: string[] = [];
        for (const [section, rows] of Object.entries(reportData)) {
          if (!Array.isArray(rows) || rows.length === 0) continue;
          const headers = Object.keys(rows[0]);
          csvSections.push(`\n--- ${section.toUpperCase()} ---`);
          csvSections.push(headers.join(","));
          rows.forEach((row: any) => {
            csvSections.push(headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","));
          });
        }
        return {
          data: csvSections.join("\n"),
          filename: `executive-report-${input.period}-${new Date().toISOString().split("T")[0]}.csv`,
        };
      }

      return {
        data: JSON.stringify(reportData, null, 2),
        filename: `executive-report-${input.period}-${new Date().toISOString().split("T")[0]}.json`,
      };
    }),
});
