/**
 * Discussions Router — Wave G Sprint G2 + Wave M Sprint M3
 *
 * Discussion boards for learner community:
 * - getThreads: List threads with pagination
 * - getThread: Get single thread with details
 * - createThread: Create a new discussion thread
 * - deleteThread: Delete own thread
 * - getReplies: Get replies for a thread
 * - createReply: Post a reply to a thread
 * - upvoteReply: Upvote a reply (M3)
 * - reportContent: Report a thread or reply (M3)
 * - togglePin: Admin pin/unpin thread (M3)
 * - toggleLock: Admin lock/unlock thread (M3)
 * - markAcceptedAnswer: Thread author marks best answer (M3)
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureDiscussionTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS discussion_threads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      userName VARCHAR(255),
      title VARCHAR(500) NOT NULL,
      body TEXT NOT NULL,
      category ENUM('general','sle_prep','grammar','vocabulary','listening','writing','reading','tips','off_topic') DEFAULT 'general',
      isPinned BOOLEAN DEFAULT FALSE,
      isLocked BOOLEAN DEFAULT FALSE,
      replyCount INT DEFAULT 0,
      lastReplyAt DATETIME,
      viewCount INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_created (createdAt)
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS discussion_replies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      threadId INT NOT NULL,
      userId INT NOT NULL,
      userName VARCHAR(255),
      body TEXT NOT NULL,
      isAcceptedAnswer BOOLEAN DEFAULT FALSE,
      upvoteCount INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_thread (threadId)
    )
  `);
  // M3: Upvotes tracking
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS discussion_upvotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      replyId INT NOT NULL,
      userId INT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_upvote (replyId, userId),
      INDEX idx_reply (replyId)
    )
  `);
  // M3: Content reports
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS discussion_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contentType ENUM('thread','reply') NOT NULL,
      contentId INT NOT NULL,
      reporterId INT NOT NULL,
      reason ENUM('spam','harassment','off_topic','inappropriate','other') DEFAULT 'other',
      details TEXT,
      status ENUM('pending','reviewed','dismissed','actioned') DEFAULT 'pending',
      reviewedBy INT,
      reviewedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_status (status)
    )
  `);
  return db;
}

export const discussionsRouter = router({

  getThreads: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      let whereClause = sql`WHERE 1=1`;
      if (input?.category) {
        whereClause = sql`${whereClause} AND t.category = ${input.category}`;
      }
      if (input?.search) {
        const term = `%${input.search}%`;
        whereClause = sql`${whereClause} AND (t.title LIKE ${term} OR t.body LIKE ${term})`;
      }

      const [threads] = await db.execute(sql`
        SELECT t.id, t.userId, t.userName, t.title, t.body, t.category,
               t.isPinned, t.isLocked, t.replyCount, t.lastReplyAt,
               t.viewCount, t.createdAt
        FROM discussion_threads t
        ${whereClause}
        ORDER BY t.isPinned DESC, t.lastReplyAt DESC, t.createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const [countResult] = await db.execute(sql`
        SELECT COUNT(*) as total FROM discussion_threads t ${whereClause}
      `);
      const total = (countResult as any)?.[0]?.total ?? 0;

      return {
        threads: threads as any[],
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();

      // Increment view count
      await db.execute(sql`
        UPDATE discussion_threads SET viewCount = viewCount + 1 WHERE id = ${input.threadId}
      `);

      const [threadRows] = await db.execute(sql`
        SELECT * FROM discussion_threads WHERE id = ${input.threadId} LIMIT 1
      `);
      const thread = (threadRows as any[])?.[0];
      if (!thread) throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });

      return thread;
    }),

  createThread: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      body: z.string().min(1),
      category: z.string().default("general"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const userName = ctx.user?.name ?? ctx.user?.email ?? "Anonymous";

      const [result] = await db.execute(sql`
        INSERT INTO discussion_threads (userId, userName, title, body, category)
        VALUES (${userId}, ${userName}, ${input.title}, ${input.body}, ${input.category})
      `);
      return { success: true, threadId: (result as any).insertId };
    }),

  deleteThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Only allow owner or admin to delete
      const [threadRows] = await db.execute(sql`
        SELECT userId FROM discussion_threads WHERE id = ${input.threadId} LIMIT 1
      `);
      const thread = (threadRows as any[])?.[0];
      if (!thread) throw new TRPCError({ code: "NOT_FOUND" });
      if (thread.userId !== userId && ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete another user's thread" });
      }

      await db.execute(sql`DELETE FROM discussion_replies WHERE threadId = ${input.threadId}`);
      await db.execute(sql`DELETE FROM discussion_threads WHERE id = ${input.threadId}`);
      return { success: true };
    }),

  getReplies: protectedProcedure
    .input(z.object({
      threadId: z.number(),
      page: z.number().default(1),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();

      const offset = (input.page - 1) * input.limit;

      const [replies] = await db.execute(sql`
        SELECT id, threadId, userId, userName, body, isAcceptedAnswer, createdAt
        FROM discussion_replies
        WHERE threadId = ${input.threadId}
        ORDER BY createdAt ASC
        LIMIT ${input.limit} OFFSET ${offset}
      `);

      return replies as any[];
    }),

  createReply: protectedProcedure
    .input(z.object({
      threadId: z.number(),
      body: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const userName = ctx.user?.name ?? ctx.user?.email ?? "Anonymous";

      await db.execute(sql`
        INSERT INTO discussion_replies (threadId, userId, userName, body)
        VALUES (${input.threadId}, ${userId}, ${userName}, ${input.body})
      `);

      // Update thread reply count and last reply time
      await db.execute(sql`
        UPDATE discussion_threads
        SET replyCount = replyCount + 1, lastReplyAt = NOW()
        WHERE id = ${input.threadId}
      `);

      return { success: true };
    }),

  // ─── M3: Upvote a reply ────────────────────────────────────────
  upvoteReply: protectedProcedure
    .input(z.object({ replyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Check if already upvoted
      const [existing] = await db.execute(sql`
        SELECT id FROM discussion_upvotes WHERE replyId = ${input.replyId} AND userId = ${userId} LIMIT 1
      `);
      if ((existing as any[])?.length > 0) {
        // Remove upvote (toggle)
        await db.execute(sql`DELETE FROM discussion_upvotes WHERE replyId = ${input.replyId} AND userId = ${userId}`);
        await db.execute(sql`UPDATE discussion_replies SET upvoteCount = GREATEST(upvoteCount - 1, 0) WHERE id = ${input.replyId}`);
        return { success: true, action: "removed" };
      }

      await db.execute(sql`INSERT INTO discussion_upvotes (replyId, userId) VALUES (${input.replyId}, ${userId})`);
      await db.execute(sql`UPDATE discussion_replies SET upvoteCount = upvoteCount + 1 WHERE id = ${input.replyId}`);
      return { success: true, action: "added" };
    }),

  // ─── M3: Report content ────────────────────────────────────────
  reportContent: protectedProcedure
    .input(z.object({
      contentType: z.enum(["thread", "reply"]),
      contentId: z.number(),
      reason: z.enum(["spam", "harassment", "off_topic", "inappropriate", "other"]).default("other"),
      details: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.execute(sql`
        INSERT INTO discussion_reports (contentType, contentId, reporterId, reason, details)
        VALUES (${input.contentType}, ${input.contentId}, ${userId}, ${input.reason}, ${input.details ?? null})
      `);
      return { success: true };
    }),

  // ─── M3: Admin — toggle pin ────────────────────────────────────
  togglePin: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      await db.execute(sql`
        UPDATE discussion_threads SET isPinned = NOT isPinned WHERE id = ${input.threadId}
      `);
      return { success: true };
    }),

  // ─── M3: Admin — toggle lock ───────────────────────────────────
  toggleLock: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      await db.execute(sql`
        UPDATE discussion_threads SET isLocked = NOT isLocked WHERE id = ${input.threadId}
      `);
      return { success: true };
    }),

  // ─── M3: Mark accepted answer ──────────────────────────────────
  markAcceptedAnswer: protectedProcedure
    .input(z.object({ replyId: z.number(), threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Only thread author or admin can mark accepted answer
      const [threadRows] = await db.execute(sql`
        SELECT userId FROM discussion_threads WHERE id = ${input.threadId} LIMIT 1
      `);
      const thread = (threadRows as any[])?.[0];
      if (!thread) throw new TRPCError({ code: "NOT_FOUND" });
      if (thread.userId !== userId && ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only thread author or admin can mark accepted answer" });
      }

      // Clear previous accepted answer for this thread
      await db.execute(sql`
        UPDATE discussion_replies SET isAcceptedAnswer = FALSE WHERE threadId = ${input.threadId}
      `);
      // Mark new accepted answer
      await db.execute(sql`
        UPDATE discussion_replies SET isAcceptedAnswer = TRUE WHERE id = ${input.replyId} AND threadId = ${input.threadId}
      `);
      return { success: true };
    }),

  // ─── M3: Admin — get reports ───────────────────────────────────
  getReports: protectedProcedure
    .input(z.object({
      status: z.enum(["pending", "reviewed", "dismissed", "actioned"]).optional(),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx }) => {
      const db = await ensureDiscussionTables();
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const [reports] = await db.execute(sql`
        SELECT r.*, u.name as reporterName
        FROM discussion_reports r
        LEFT JOIN users u ON u.id = r.reporterId
        ORDER BY r.createdAt DESC
        LIMIT 50
      `);
      return reports as any[];
    }),

  // ─── M3: Admin — resolve report ────────────────────────────────
  resolveReport: protectedProcedure
    .input(z.object({
      reportId: z.number(),
      status: z.enum(["reviewed", "dismissed", "actioned"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDiscussionTables();
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "owner" && !ctx.user?.isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      await db.execute(sql`
        UPDATE discussion_reports
        SET status = ${input.status}, reviewedBy = ${ctx.user.id}, reviewedAt = NOW()
        WHERE id = ${input.reportId}
      `);
      return { success: true };
    }),
});
