/**
 * Vocabulary Router — Sprint E4
 *
 * Personal vocabulary bank with spaced repetition and stats.
 * Tables are created on-the-fly via CREATE TABLE IF NOT EXISTS.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureVocabTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS vocabulary_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      word VARCHAR(200) NOT NULL,
      translation VARCHAR(200) NOT NULL,
      language ENUM('fr','en') DEFAULT 'fr',
      context TEXT,
      category VARCHAR(100) DEFAULT 'general',
      cefrLevel ENUM('A1','A2','B1','B2','C1','C2') DEFAULT 'A1',
      mastery INT DEFAULT 0,
      reviewCount INT DEFAULT 0,
      correctCount INT DEFAULT 0,
      nextReviewAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      lastReviewedAt TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_vi_user (userId),
      INDEX idx_vi_review (userId, nextReviewAt)
    )
  `);

  return db;
}

export const vocabularyRouter = router({
  // ── List all vocabulary items ────────────────────────────────────────────
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureVocabTables();
    const [rows] = await db.execute(
      sql`SELECT * FROM vocabulary_items WHERE userId = ${ctx.user.id} ORDER BY createdAt DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),

  // ── Stats ────────────────────────────────────────────────────────────────
  stats: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureVocabTables();
    const [total] = await db.execute(
      sql`SELECT COUNT(*) as total FROM vocabulary_items WHERE userId = ${ctx.user.id}`
    );
    const [mastered] = await db.execute(
      sql`SELECT COUNT(*) as total FROM vocabulary_items WHERE userId = ${ctx.user.id} AND mastery >= 80`
    );
    const [due] = await db.execute(
      sql`SELECT COUNT(*) as total FROM vocabulary_items WHERE userId = ${ctx.user.id} AND nextReviewAt <= NOW()`
    );
    const [avgMastery] = await db.execute(
      sql`SELECT AVG(mastery) as avg FROM vocabulary_items WHERE userId = ${ctx.user.id}`
    );
    return {
      totalWords: Array.isArray(total) && total[0] ? Number((total[0] as any).total) : 0,
      mastered: Array.isArray(mastered) && mastered[0] ? Number((mastered[0] as any).total) : 0,
      dueForReview: Array.isArray(due) && due[0] ? Number((due[0] as any).total) : 0,
      averageMastery: Array.isArray(avgMastery) && avgMastery[0] ? Math.round(Number((avgMastery[0] as any).avg) || 0) : 0,
    };
  }),

  // ── Add a word ───────────────────────────────────────────────────────────
  add: protectedProcedure
    .input(z.object({
      word: z.string().min(1).max(200),
      translation: z.string().min(1).max(200),
      language: z.enum(["fr", "en"]).optional(),
      context: z.string().optional(),
      category: z.string().max(100).optional(),
      cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureVocabTables();
      await db.execute(sql`
        INSERT INTO vocabulary_items (userId, word, translation, language, context, category, cefrLevel)
        VALUES (${ctx.user.id}, ${input.word}, ${input.translation}, ${input.language || "fr"},
                ${input.context || null}, ${input.category || "general"}, ${input.cefrLevel || "A1"})
      `);
      return { success: true };
    }),

  // ── Review a word ────────────────────────────────────────────────────────
  review: protectedProcedure
    .input(z.object({
      itemId: z.number(),
      correct: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureVocabTables();
      const [rows] = await db.execute(
        sql`SELECT * FROM vocabulary_items WHERE id = ${input.itemId} AND userId = ${ctx.user.id}`
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vocabulary item not found" });
      }
      const item = rows[0] as any;
      const newReviewCount = (Number(item.reviewCount) || 0) + 1;
      const newCorrectCount = (Number(item.correctCount) || 0) + (input.correct ? 1 : 0);
      const newMastery = Math.round((newCorrectCount / newReviewCount) * 100);
      // Interval based on mastery
      const intervalDays = input.correct ? Math.max(1, Math.floor(newMastery / 20)) : 1;

      await db.execute(sql`
        UPDATE vocabulary_items
        SET reviewCount = ${newReviewCount},
            correctCount = ${newCorrectCount},
            mastery = ${newMastery},
            nextReviewAt = DATE_ADD(NOW(), INTERVAL ${intervalDays} DAY),
            lastReviewedAt = NOW()
        WHERE id = ${input.itemId}
      `);
      return { success: true, mastery: newMastery };
    }),

  // ── Delete a word ────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureVocabTables();
      await db.execute(
        sql`DELETE FROM vocabulary_items WHERE id = ${input.itemId} AND userId = ${ctx.user.id}`
      );
      return { success: true };
    }),
});

// ── AI Vocabulary Router ───────────────────────────────────────────────────
export const aiVocabularyRouter = router({
  suggestWords: protectedProcedure
    .input(z.object({
      topic: z.string().optional(),
      cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
      count: z.number().min(1).max(20).optional(),
    }))
    .mutation(async ({ input }) => {
      // Return curated SLE-relevant vocabulary suggestions
      const level = input?.cefrLevel || "B1";
      const topic = input?.topic || "government";
      const suggestions: Record<string, Array<{ word: string; translation: string; context: string }>> = {
        government: [
          { word: "le ministère", translation: "the ministry/department", context: "Le ministère a publié un nouveau rapport." },
          { word: "la politique publique", translation: "public policy", context: "Cette politique publique vise à améliorer les services." },
          { word: "le fonctionnaire", translation: "civil servant", context: "Les fonctionnaires doivent réussir l'examen de langue." },
          { word: "la réglementation", translation: "regulation", context: "La nouvelle réglementation entre en vigueur demain." },
          { word: "le sous-ministre", translation: "deputy minister", context: "Le sous-ministre a approuvé le budget." },
          { word: "la reddition de comptes", translation: "accountability", context: "La reddition de comptes est essentielle dans la fonction publique." },
          { word: "le mandat", translation: "mandate/term", context: "Le mandat du comité a été prolongé." },
          { word: "la consultation", translation: "consultation", context: "Une consultation publique aura lieu la semaine prochaine." },
        ],
        workplace: [
          { word: "la réunion", translation: "the meeting", context: "La réunion est prévue pour 14 heures." },
          { word: "le compte rendu", translation: "the minutes/report", context: "Veuillez rédiger le compte rendu de la réunion." },
          { word: "le télétravail", translation: "remote work", context: "Le télétravail est devenu courant depuis 2020." },
          { word: "la formation", translation: "training", context: "La formation en langue seconde est obligatoire." },
          { word: "le collègue", translation: "colleague", context: "Mon collègue travaille au même étage." },
          { word: "la note de service", translation: "memo", context: "La note de service a été distribuée à tout le personnel." },
        ],
        general: [
          { word: "néanmoins", translation: "nevertheless", context: "Le projet est ambitieux; néanmoins, il est réalisable." },
          { word: "d'ailleurs", translation: "moreover/besides", context: "D'ailleurs, cette approche a déjà été testée." },
          { word: "en revanche", translation: "on the other hand", context: "En revanche, les résultats sont encourageants." },
          { word: "par conséquent", translation: "consequently", context: "Par conséquent, nous devons modifier notre stratégie." },
          { word: "davantage", translation: "more/further", context: "Il faudrait investir davantage dans la recherche." },
          { word: "auparavant", translation: "previously/before", context: "Auparavant, cette procédure n'existait pas." },
        ],
      };
      const words = suggestions[topic] || suggestions.general;
      const count = input?.count || 5;
      return { suggestions: words.slice(0, count), topic, level };
    }),
});
