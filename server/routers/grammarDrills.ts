/**
 * Grammar Drills Router — Sprint E4
 *
 * Tracks grammar drill results, history, and per-topic statistics.
 * Tables are created on-the-fly via CREATE TABLE IF NOT EXISTS.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureGrammarTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS grammar_drill_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      topic VARCHAR(200) NOT NULL,
      cefrLevel ENUM('A1','A2','B1','B2','C1','C2') DEFAULT 'B1',
      score INT NOT NULL,
      totalQuestions INT NOT NULL,
      correctAnswers INT NOT NULL,
      timeSpentSeconds INT DEFAULT 0,
      details JSON,
      completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_gdr_user (userId),
      INDEX idx_gdr_topic (userId, topic)
    )
  `);

  return db;
}

export const grammarDrillsRouter = router({
  // ── Save a drill result ──────────────────────────────────────────────────
  saveResult: protectedProcedure
    .input(z.object({
      topic: z.string().min(1),
      cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
      score: z.number().min(0).max(100),
      totalQuestions: z.number().min(1),
      correctAnswers: z.number().min(0),
      timeSpentSeconds: z.number().optional(),
      details: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureGrammarTables();
      await db.execute(sql`
        INSERT INTO grammar_drill_results (userId, topic, cefrLevel, score, totalQuestions, correctAnswers, timeSpentSeconds, details)
        VALUES (${ctx.user.id}, ${input.topic}, ${input.cefrLevel || "B1"}, ${input.score},
                ${input.totalQuestions}, ${input.correctAnswers}, ${input.timeSpentSeconds || 0},
                ${input.details ? JSON.stringify(input.details) : null})
      `);
      return { success: true };
    }),

  // ── Get drill history ────────────────────────────────────────────────────
  history: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureGrammarTables();
    const [rows] = await db.execute(sql`
      SELECT * FROM grammar_drill_results
      WHERE userId = ${ctx.user.id}
      ORDER BY completedAt DESC
      LIMIT 50
    `);
    return Array.isArray(rows) ? rows : [];
  }),

  // ── Overall stats ────────────────────────────────────────────────────────
  stats: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureGrammarTables();
    const [overall] = await db.execute(sql`
      SELECT
        COUNT(*) as totalDrills,
        AVG(score) as avgScore,
        SUM(totalQuestions) as totalQuestions,
        SUM(correctAnswers) as totalCorrect,
        SUM(timeSpentSeconds) as totalTime
      FROM grammar_drill_results
      WHERE userId = ${ctx.user.id}
    `);
    const row = Array.isArray(overall) && overall[0] ? overall[0] as any : {};
    return {
      totalDrills: Number(row.totalDrills) || 0,
      avgScore: Math.round(Number(row.avgScore) || 0),
      totalQuestions: Number(row.totalQuestions) || 0,
      totalCorrect: Number(row.totalCorrect) || 0,
      totalTimeMinutes: Math.round((Number(row.totalTime) || 0) / 60),
    };
  }),

  // ── Stats by topic ──────────────────────────────────────────────────────
  statsByTopic: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureGrammarTables();
    const [rows] = await db.execute(sql`
      SELECT
        topic,
        COUNT(*) as attempts,
        AVG(score) as avgScore,
        MAX(score) as bestScore,
        SUM(correctAnswers) as totalCorrect,
        SUM(totalQuestions) as totalQuestions
      FROM grammar_drill_results
      WHERE userId = ${ctx.user.id}
      GROUP BY topic
      ORDER BY attempts DESC
    `);
    return Array.isArray(rows) ? rows : [];
  }),
});
