/**
 * Owner Router — Owner-only tRPC endpoints for the Owner Portal
 * Provides ecosystem stats, audit log, system health, and owner actions.
 */
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { TRPCError } from "@trpc/server";
import { users, courses, activities, featureFlags } from "../../drizzle/schema";
import { eq, desc, sql, count, and, gte } from "drizzle-orm";
import { z } from "zod";
import { createLogger } from "../logger";

const log = createLogger("routers-owner");

/** Guard: only owner or isOwner users can access */
function assertOwner(user: any) {
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  if (user.role !== "owner" && !user.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner access required" });
  }
}

export const ownerRouter = router({
  /**
   * 3.2 — Ecosystem Stats: users, courses, revenue, sessions
   */
  getEcosystemStats: protectedProcedure.query(async ({ ctx }) => {
    assertOwner(ctx.user);
    const db = await getDb();
    if (!db) return {
      totalUsers: 0, usersGrowth: 0,
      activeCourses: 0, coursesGrowth: 0,
      monthlyRevenue: 0, revenueGrowth: 0,
      activeSessions: 0, sessionsGrowth: 0,
    };

    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Total users
      const [totalResult] = await db.select({ count: count() }).from(users);
      const totalUsers = totalResult?.count ?? 0;

      // Users created in last 30 days vs previous 30 days
      const [recentUsers] = await db.select({ count: count() }).from(users)
        .where(gte(users.createdAt, thirtyDaysAgo));
      const [prevUsers] = await db.select({ count: count() }).from(users)
        .where(and(gte(users.createdAt, sixtyDaysAgo), sql`${users.createdAt} < ${thirtyDaysAgo}`));
      const usersGrowth = (prevUsers?.count ?? 0) > 0
        ? Math.round(((recentUsers?.count ?? 0) - (prevUsers?.count ?? 0)) / (prevUsers?.count ?? 1) * 100)
        : 0;

      // Active courses
      const [coursesResult] = await db.select({ count: count() }).from(courses)
        .where(eq(courses.status, "published"));
      const activeCourses = coursesResult?.count ?? 0;

      // Monthly revenue from Stripe (simplified — count from activities)
      const monthlyRevenue = 0; // Will be populated when Stripe integration is connected
      const revenueGrowth = 0;

      // Active sessions (users active in last 24h via activities)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const [sessionsResult] = await db.select({ count: sql<number>`COUNT(DISTINCT ${activities.userId})` })
        .from(activities)
        .where(gte(activities.createdAt, oneDayAgo));
      const activeSessions = sessionsResult?.count ?? 0;

      return {
        totalUsers, usersGrowth,
        activeCourses, coursesGrowth: 0,
        monthlyRevenue, revenueGrowth,
        activeSessions, sessionsGrowth: 0,
      };
    } catch (error) {
      log.error("Failed to get ecosystem stats:", error);
      return {
        totalUsers: 0, usersGrowth: 0,
        activeCourses: 0, coursesGrowth: 0,
        monthlyRevenue: 0, revenueGrowth: 0,
        activeSessions: 0, sessionsGrowth: 0,
      };
    }
  }),

  /**
   * 3.4 — Recent Audit Log
   */
  getAuditLog: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      assertOwner(ctx.user);
      const db = await getDb();
      if (!db) return { entries: [] };

      try {
        const limit = input?.limit ?? 20;
        const entries = await db.select({
          id: activities.id,
          userId: activities.userId,
          userName: users.name,
          userEmail: users.email,
          type: activities.type,
          metadata: activities.metadata,
          createdAt: activities.createdAt,
        })
        .from(activities)
        .leftJoin(users, eq(activities.userId, users.id))
        .orderBy(desc(activities.createdAt))
        .limit(limit);

        return { entries };
      } catch (error) {
        log.error("Failed to get audit log:", error);
        return { entries: [] };
      }
    }),

  /**
   * 3.5 — System Health
   */
  getSystemHealth: protectedProcedure.query(async ({ ctx }) => {
    assertOwner(ctx.user);

    const checks: Array<{ name: string; status: "ok" | "warning" | "error"; detail: string }> = [];

    // Database check
    try {
      const db = await getDb();
      if (db) {
        const start = Date.now();
        await db.select({ val: sql`1` }).from(sql`dual`);
        const latency = Date.now() - start;
        checks.push({
          name: "Database",
          status: latency > 500 ? "warning" : "ok",
          detail: `${latency}ms latency`,
        });
      } else {
        checks.push({ name: "Database", status: "error", detail: "Not connected" });
      }
    } catch (e) {
      checks.push({ name: "Database", status: "error", detail: String(e) });
    }

    // Stripe check
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        checks.push({ name: "Stripe", status: "ok", detail: "Key configured" });
      } else {
        checks.push({ name: "Stripe", status: "warning", detail: "No key configured" });
      }
    } catch (e) {
      checks.push({ name: "Stripe", status: "error", detail: String(e) });
    }

    // Memory check
    const mem = process.memoryUsage();
    const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
    checks.push({
      name: "Memory",
      status: heapMB > 512 ? "warning" : "ok",
      detail: `${heapMB}MB heap used`,
    });

    // Uptime
    const uptimeSec = Math.round(process.uptime());
    const uptimeHours = Math.round(uptimeSec / 3600 * 10) / 10;
    checks.push({
      name: "Uptime",
      status: "ok",
      detail: `${uptimeHours}h`,
    });

    return {
      overall: checks.every(c => c.status === "ok") ? "healthy" : checks.some(c => c.status === "error") ? "unhealthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * 3.3 — Feature Flags management
   */
  getFeatureFlags: protectedProcedure.query(async ({ ctx }) => {
    assertOwner(ctx.user);
    const db = await getDb();
    if (!db) return { flags: [] };

    try {
      const flags = await db.select().from(featureFlags).orderBy(featureFlags.key);
      return { flags };
    } catch (error) {
      log.error("Failed to get feature flags:", error);
      return { flags: [] };
    }
  }),

  /**
   * Toggle a feature flag
   */
  toggleFeatureFlag: protectedProcedure
    .input(z.object({ id: z.number(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      assertOwner(ctx.user);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      try {
        await db.update(featureFlags)
          .set({ enabled: input.enabled })
          .where(eq(featureFlags.id, input.id));

        log.info(`Feature flag ${input.id} toggled to ${input.enabled} by ${ctx.user.email}`);
        return { success: true };
      } catch (error) {
        log.error("Failed to toggle feature flag:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to toggle flag" });
      }
    }),

  /**
   * Get all users with roles for owner management
   */
  getUsers: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
      role: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      assertOwner(ctx.user);
      const db = await getDb();
      if (!db) return { users: [], total: 0 };

      try {
        const limit = input?.limit ?? 50;
        const offset = input?.offset ?? 0;

        let query = db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isOwner: users.isOwner,
          createdAt: users.createdAt,
          lastLoginAt: users.lastLoginAt,
        }).from(users);

        if (input?.role) {
          query = query.where(eq(users.role, input.role)) as any;
        }

        const userList = await (query as any).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
        const [totalResult] = await db.select({ count: count() }).from(users);

        return { users: userList, total: totalResult?.count ?? 0 };
      } catch (error) {
        log.error("Failed to get users:", error);
        return { users: [], total: 0 };
      }
    }),

  /**
   * Update a user's role
   */
  updateUserRole: protectedProcedure
    .input(z.object({ userId: z.number(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertOwner(ctx.user);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const validRoles = ["owner", "admin", "hr_admin", "colleague", "coach", "learner"];
      if (!validRoles.includes(input.role)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid role: ${input.role}` });
      }

      try {
        await db.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId));

        log.info(`User ${input.userId} role changed to ${input.role} by ${ctx.user.email}`);
        return { success: true };
      } catch (error) {
        log.error("Failed to update user role:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update role" });
      }
    }),
});
