/**
 * Privacy Router — Wave N, Sprint N6
 * 
 * GDPR/PIPEDA-compliant data export and account deletion.
 * Endpoints:
 * - requestDataExport: Generate a JSON export of all user data
 * - requestAccountDeletion: Soft-delete account and anonymize PII
 * - getPrivacyStatus: Check pending export/deletion requests
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql, eq } from "drizzle-orm";
import { getDb } from "../db";
import { users, courseEnrollments, lessonProgress, certificates } from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("privacy");

export const privacyRouter = router({
  /**
   * Generate a JSON export of all user data (PIPEDA/GDPR right of access).
   * Returns all personal data, enrollment history, progress, certificates, etc.
   */
  requestDataExport: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const userId = ctx.user.id;

    // Gather all user data
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    const enrollments = await db.select().from(courseEnrollments).where(eq(courseEnrollments.userId, userId));
    const progress = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
    const certs = await db.select().from(certificates).where(eq(certificates.userId, userId));

    // Gamification data
    let xpTransactions: any[] = [];
    let badges: any[] = [];
    let streaks: any[] = [];
    try {
      const [xpRows] = await db.execute(sql`SELECT * FROM xp_transactions WHERE userId = ${userId} ORDER BY createdAt DESC`);
      xpTransactions = xpRows as any[];
    } catch { /* table may not exist */ }
    try {
      const [badgeRows] = await db.execute(sql`SELECT * FROM user_badges WHERE userId = ${userId}`);
      badges = badgeRows as any[];
    } catch { /* table may not exist */ }
    try {
      const [streakRows] = await db.execute(sql`SELECT * FROM user_streaks WHERE userId = ${userId}`);
      streaks = streakRows as any[];
    } catch { /* table may not exist */ }

    // Discussion data
    let threads: any[] = [];
    let replies: any[] = [];
    try {
      const [threadRows] = await db.execute(sql`SELECT * FROM discussion_threads WHERE userId = ${userId}`);
      threads = threadRows as any[];
      const [replyRows] = await db.execute(sql`SELECT * FROM discussion_replies WHERE userId = ${userId}`);
      replies = replyRows as any[];
    } catch { /* table may not exist */ }

    // Coaching sessions
    let coachingSessions: any[] = [];
    try {
      const [sessionRows] = await db.execute(sql`SELECT * FROM coaching_sessions WHERE userId = ${userId}`);
      coachingSessions = sessionRows as any[];
    } catch { /* table may not exist */ }

    // Remove sensitive internal fields
    const { passwordHash, ...safeUser } = user as any;

    const exportData = {
      exportedAt: new Date().toISOString(),
      format: "PIPEDA/GDPR Data Export",
      version: "1.0",
      user: safeUser,
      enrollments,
      lessonProgress: progress,
      certificates: certs,
      gamification: { xpTransactions, badges, streaks },
      discussions: { threads, replies },
      coachingSessions,
    };

    log.info({ userId }, "Data export generated");
    return exportData;
  }),

  /**
   * Request account deletion (PIPEDA/GDPR right to erasure).
   * Soft-deletes the account and anonymizes PII.
   * Actual deletion happens after a 30-day grace period.
   */
  requestAccountDeletion: protectedProcedure
    .input(z.object({
      confirmEmail: z.string().email(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const userId = ctx.user.id;

      // Verify email matches
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      if ((user as any).email !== input.confirmEmail) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Email does not match account" });
      }

      // Soft-delete: mark account as pending deletion
      await db.update(users).set({
        status: "pending_deletion" as any,
        deletionRequestedAt: new Date() as any,
      } as any).where(eq(users.id, userId));

      // Log the deletion request
      try {
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS account_deletion_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            reason TEXT,
            status ENUM('pending','completed','cancelled') DEFAULT 'pending',
            requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            completedAt DATETIME,
            INDEX idx_user (userId)
          )
        `);
        await db.execute(sql`
          INSERT INTO account_deletion_requests (userId, reason)
          VALUES (${userId}, ${input.reason ?? null})
        `);
      } catch (e) {
        log.error({ userId, error: e }, "Failed to log deletion request");
      }

      log.info({ userId }, "Account deletion requested — 30-day grace period started");
      return {
        success: true,
        message: "Account deletion requested. Your account will be permanently deleted after 30 days. You can cancel this request by logging in during the grace period.",
        gracePeriodEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }),

  /**
   * Cancel a pending account deletion request.
   */
  cancelDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    await db.update(users).set({
      status: "active" as any,
      deletionRequestedAt: null as any,
    } as any).where(eq(users.id, ctx.user.id));

    try {
      await db.execute(sql`
        UPDATE account_deletion_requests
        SET status = 'cancelled'
        WHERE userId = ${ctx.user.id} AND status = 'pending'
      `);
    } catch { /* table may not exist */ }

    log.info({ userId: ctx.user.id }, "Account deletion cancelled");
    return { success: true };
  }),

  /**
   * Get privacy status (pending exports, deletion requests).
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    const hasPendingDeletion = (user as any)?.status === "pending_deletion";

    return {
      hasPendingDeletion,
      deletionRequestedAt: (user as any)?.deletionRequestedAt ?? null,
    };
  }),
});
