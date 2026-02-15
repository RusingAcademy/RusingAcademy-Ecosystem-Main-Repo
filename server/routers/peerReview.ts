/**
 * PeerReview Router — Wave G, Sprint G2
 *
 * Peer review system for writing submissions:
 * - pending: Get writing submissions awaiting review
 * - completed: Get reviews the user has completed
 * - complete: Submit a review for a peer's writing
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensurePeerReviewTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS peer_review_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      authorId INT NOT NULL,
      authorName VARCHAR(255),
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      writingType ENUM('essay','email','report','letter','summary') DEFAULT 'essay',
      level VARCHAR(5) DEFAULT 'B',
      language VARCHAR(10) DEFAULT 'fr',
      status ENUM('pending','in_review','reviewed') DEFAULT 'pending',
      reviewCount INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_author (authorId)
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS peer_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      submissionId INT NOT NULL,
      reviewerId INT NOT NULL,
      reviewerName VARCHAR(255),
      overallScore INT DEFAULT 0,
      grammarScore INT DEFAULT 0,
      vocabularyScore INT DEFAULT 0,
      coherenceScore INT DEFAULT 0,
      feedback TEXT,
      strengths TEXT,
      improvements TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_submission (submissionId),
      INDEX idx_reviewer (reviewerId)
    )
  `);
  return db;
}

export const peerReviewRouter = router({

  // Get writing submissions awaiting review (exclude user's own)
  pending: protectedProcedure
    .input(z.object({
      level: z.string().optional(),
      limit: z.number().default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensurePeerReviewTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      let query = sql`
        SELECT s.id, s.authorName, s.title, s.writingType, s.level,
               s.language, s.status, s.reviewCount, s.createdAt,
               LEFT(s.content, 200) as preview
        FROM peer_review_submissions s
        WHERE s.authorId != ${userId}
          AND s.status IN ('pending', 'in_review')
          AND s.id NOT IN (
            SELECT submissionId FROM peer_reviews WHERE reviewerId = ${userId}
          )
      `;
      if (input?.level) {
        query = sql`${query} AND s.level = ${input.level}`;
      }
      query = sql`${query} ORDER BY s.reviewCount ASC, s.createdAt ASC LIMIT ${input?.limit ?? 10}`;

      const [rows] = await db.execute(query);
      return rows as any[];
    }),

  // Get reviews the user has completed
  completed: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensurePeerReviewTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const [rows] = await db.execute(sql`
        SELECT r.id, r.submissionId, r.overallScore, r.grammarScore,
               r.vocabularyScore, r.coherenceScore, r.feedback, r.createdAt,
               s.title as submissionTitle, s.authorName, s.writingType
        FROM peer_reviews r
        JOIN peer_review_submissions s ON s.id = r.submissionId
        WHERE r.reviewerId = ${userId}
        ORDER BY r.createdAt DESC
        LIMIT ${input?.limit ?? 20}
      `);

      return rows as any[];
    }),

  // Submit a review
  complete: protectedProcedure
    .input(z.object({
      submissionId: z.number(),
      overallScore: z.number().min(1).max(5),
      grammarScore: z.number().min(1).max(5),
      vocabularyScore: z.number().min(1).max(5),
      coherenceScore: z.number().min(1).max(5),
      feedback: z.string().min(1),
      strengths: z.string().optional(),
      improvements: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensurePeerReviewTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const reviewerName = ctx.user?.name ?? ctx.user?.email ?? "Anonymous";

      // Check submission exists
      const [subRows] = await db.execute(sql`
        SELECT id, authorId FROM peer_review_submissions WHERE id = ${input.submissionId} LIMIT 1
      `);
      const submission = (subRows as any[])?.[0];
      if (!submission) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
      if (submission.authorId === userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot review your own submission" });
      }

      // Check if already reviewed
      const [existing] = await db.execute(sql`
        SELECT id FROM peer_reviews
        WHERE submissionId = ${input.submissionId} AND reviewerId = ${userId}
        LIMIT 1
      `);
      if ((existing as any[]).length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Already reviewed this submission" });
      }

      await db.execute(sql`
        INSERT INTO peer_reviews (submissionId, reviewerId, reviewerName, overallScore, grammarScore, vocabularyScore, coherenceScore, feedback, strengths, improvements)
        VALUES (${input.submissionId}, ${userId}, ${reviewerName}, ${input.overallScore}, ${input.grammarScore}, ${input.vocabularyScore}, ${input.coherenceScore}, ${input.feedback}, ${input.strengths ?? null}, ${input.improvements ?? null})
      `);

      // Update submission review count and status
      await db.execute(sql`
        UPDATE peer_review_submissions
        SET reviewCount = reviewCount + 1,
            status = CASE WHEN reviewCount >= 2 THEN 'reviewed' ELSE 'in_review' END
        WHERE id = ${input.submissionId}
      `);

      return { success: true };
    }),
});
