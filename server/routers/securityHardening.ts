/**
 * Security Hardening Router — Phase 6 of Auth System Improvement
 *
 * Provides endpoints for:
 * - Security audit log viewing (admin/owner)
 * - Password policy info
 * - Session management
 * - Security dashboard stats
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc, sql, count, gte, and } from "drizzle-orm";
import { auditLog } from "../../drizzle/rbac-schema";
import { users } from "../../drizzle/schema";
import { validatePassword, getPasswordRequirements } from "../security/passwordPolicy";
import { getActiveSessionCount } from "../security/sessionManager";
import { createLogger } from "../logger";

const log = createLogger("routers-security-hardening");

function assertAdminOrOwner(ctx: { user: { role: string; isOwner?: boolean } }): void {
  const role = ctx.user.role;
  if (role !== "admin" && role !== "owner" && !ctx.user.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin or Owner access required" });
  }
}

export const securityHardeningRouter = router({
  /**
   * 6.1 — Get security audit log with filtering
   */
  getAuditLog: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        action: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      assertAdminOrOwner(ctx);
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };

      try {
        const conditions = [];
        if (input.action) conditions.push(eq(auditLog.action, input.action));
        if (input.userId) conditions.push(eq(auditLog.userId, input.userId));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const entries = await db
          .select({
            id: auditLog.id,
            userId: auditLog.userId,
            action: auditLog.action,
            targetType: auditLog.targetType,
            targetId: auditLog.targetId,
            details: auditLog.details,
            ipAddress: auditLog.ipAddress,
            createdAt: auditLog.createdAt,
          })
          .from(auditLog)
          .where(whereClause)
          .orderBy(desc(auditLog.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        const [totalResult] = await db
          .select({ count: count() })
          .from(auditLog)
          .where(whereClause);

        return {
          entries: entries.map((e) => ({
            ...e,
            details: e.details ? JSON.parse(e.details as string) : null,
          })),
          total: totalResult?.count || 0,
        };
      } catch (error) {
        log.error("Failed to get audit log:", error);
        return { entries: [], total: 0 };
      }
    }),

  /**
   * 6.2 — Security dashboard stats
   */
  getSecurityStats: protectedProcedure.query(async ({ ctx }) => {
    assertAdminOrOwner(ctx);
    const db = await getDb();
    if (!db) {
      return {
        totalEvents: 0,
        loginSuccesses24h: 0,
        loginFailures24h: 0,
        roleChanges7d: 0,
        rateLimitEvents24h: 0,
        activeUsers24h: 0,
      };
    }

    try {
      const now = new Date();
      const h24ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const d7ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Total events
      const [totalResult] = await db.select({ count: count() }).from(auditLog);

      // Login successes in 24h
      const [loginSuccessResult] = await db
        .select({ count: count() })
        .from(auditLog)
        .where(and(eq(auditLog.action, "auth.login.success"), gte(auditLog.createdAt, h24ago)));

      // Login failures in 24h
      const [loginFailureResult] = await db
        .select({ count: count() })
        .from(auditLog)
        .where(and(eq(auditLog.action, "auth.login.failed"), gte(auditLog.createdAt, h24ago)));

      // Role changes in 7d
      const [roleChangeResult] = await db
        .select({ count: count() })
        .from(auditLog)
        .where(and(eq(auditLog.action, "auth.role.changed"), gte(auditLog.createdAt, d7ago)));

      // Rate limit events in 24h
      const [rateLimitResult] = await db
        .select({ count: count() })
        .from(auditLog)
        .where(and(eq(auditLog.action, "auth.rate_limit.exceeded"), gte(auditLog.createdAt, h24ago)));

      // Active users in 24h (distinct userIds with login success)
      const activeUsersResult = await db
        .select({ userId: auditLog.userId })
        .from(auditLog)
        .where(and(eq(auditLog.action, "auth.login.success"), gte(auditLog.createdAt, h24ago)))
        .groupBy(auditLog.userId);

      return {
        totalEvents: totalResult?.count || 0,
        loginSuccesses24h: loginSuccessResult?.count || 0,
        loginFailures24h: loginFailureResult?.count || 0,
        roleChanges7d: roleChangeResult?.count || 0,
        rateLimitEvents24h: rateLimitResult?.count || 0,
        activeUsers24h: activeUsersResult.length,
      };
    } catch (error) {
      log.error("Failed to get security stats:", error);
      return {
        totalEvents: 0,
        loginSuccesses24h: 0,
        loginFailures24h: 0,
        roleChanges7d: 0,
        rateLimitEvents24h: 0,
        activeUsers24h: 0,
      };
    }
  }),

  /**
   * 6.3 — Validate password (client-side preview)
   */
  validatePassword: publicProcedure
    .input(z.object({ password: z.string(), email: z.string().optional() }))
    .query(({ input }) => {
      return validatePassword(input.password, input.email);
    }),

  /**
   * 6.4 — Get password requirements
   */
  getPasswordRequirements: publicProcedure
    .input(z.object({ language: z.enum(["en", "fr"]).default("en") }))
    .query(({ input }) => {
      return { requirements: getPasswordRequirements(input.language) };
    }),

  /**
   * 6.5 — Get session count for current user
   */
  getSessionCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await getActiveSessionCount(ctx.user.id);
    return { activeSessions: count };
  }),
});
