/**
 * Flashcards Router — Sprint E4
 *
 * Full CRUD for flashcard decks and cards with SM-2 spaced repetition.
 * Tables are created on-the-fly via CREATE TABLE IF NOT EXISTS.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

// ── Ensure tables exist ────────────────────────────────────────────────────
async function ensureFlashcardTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS flashcard_decks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      titleFr VARCHAR(200),
      description TEXT,
      descriptionFr TEXT,
      cefrLevel ENUM('A1','A2','B1','B2','C1','C2') DEFAULT 'A1',
      category VARCHAR(100) DEFAULT 'general',
      cardCount INT DEFAULT 0,
      isPublic BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_fd_user (userId)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS flashcard_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      deckId INT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      hint TEXT,
      audioUrl VARCHAR(500),
      imageUrl VARCHAR(500),
      -- SM-2 spaced repetition fields
      easeFactor DECIMAL(4,2) DEFAULT 2.50,
      interval_days INT DEFAULT 0,
      repetitions INT DEFAULT 0,
      nextReviewAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      lastReviewedAt TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_fc_deck (deckId),
      INDEX idx_fc_review (nextReviewAt)
    )
  `);

  // Study streak tracking
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS study_streaks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      studyDate DATE NOT NULL,
      cardsReviewed INT DEFAULT 0,
      correctCount INT DEFAULT 0,
      sessionDurationSec INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uk_user_date (userId, studyDate),
      INDEX idx_ss_user (userId)
    )
  `);

  return db;
}

export const flashcardsRouter = router({
  // ── List all decks for the current user ──────────────────────────────────
  listDecks: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureFlashcardTables();
    const [rows] = await db.execute(
      sql`SELECT * FROM flashcard_decks WHERE userId = ${ctx.user.id} ORDER BY updatedAt DESC`
    );
    return Array.isArray(rows) ? rows : [];
  }),

  // ── Get stats ────────────────────────────────────────────────────────────
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureFlashcardTables();
    const [deckCount] = await db.execute(
      sql`SELECT COUNT(*) as total FROM flashcard_decks WHERE userId = ${ctx.user.id}`
    );
    const [cardCount] = await db.execute(
      sql`SELECT COUNT(*) as total FROM flashcard_cards fc
          JOIN flashcard_decks fd ON fd.id = fc.deckId
          WHERE fd.userId = ${ctx.user.id}`
    );
    const [dueCount] = await db.execute(
      sql`SELECT COUNT(*) as total FROM flashcard_cards fc
          JOIN flashcard_decks fd ON fd.id = fc.deckId
          WHERE fd.userId = ${ctx.user.id} AND fc.nextReviewAt <= NOW()`
    );
    const [masteredCount] = await db.execute(
      sql`SELECT COUNT(*) as total FROM flashcard_cards fc
          JOIN flashcard_decks fd ON fd.id = fc.deckId
          WHERE fd.userId = ${ctx.user.id} AND fc.interval_days >= 21`
    );
    return {
      totalDecks: Array.isArray(deckCount) && deckCount[0] ? Number((deckCount[0] as any).total) : 0,
      totalCards: Array.isArray(cardCount) && cardCount[0] ? Number((cardCount[0] as any).total) : 0,
      dueCards: Array.isArray(dueCount) && dueCount[0] ? Number((dueCount[0] as any).total) : 0,
      mastered: Array.isArray(masteredCount) && masteredCount[0] ? Number((masteredCount[0] as any).total) : 0,
    };
  }),

  // ── Create a deck ────────────────────────────────────────────────────────
  createDeck: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      titleFr: z.string().max(200).optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
      category: z.string().max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      await db.execute(sql`
        INSERT INTO flashcard_decks (userId, title, titleFr, description, descriptionFr, cefrLevel, category)
        VALUES (${ctx.user.id}, ${input.title}, ${input.titleFr || null}, ${input.description || null},
                ${input.descriptionFr || null}, ${input.cefrLevel || "A1"}, ${input.category || "general"})
      `);
      return { success: true };
    }),

  // ── Delete a deck ────────────────────────────────────────────────────────
  deleteDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      // Verify ownership
      const [deck] = await db.execute(
        sql`SELECT id FROM flashcard_decks WHERE id = ${input.deckId} AND userId = ${ctx.user.id}`
      );
      if (!Array.isArray(deck) || deck.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }
      await db.execute(sql`DELETE FROM flashcard_cards WHERE deckId = ${input.deckId}`);
      await db.execute(sql`DELETE FROM flashcard_decks WHERE id = ${input.deckId} AND userId = ${ctx.user.id}`);
      return { success: true };
    }),

  // ── List cards in a deck ─────────────────────────────────────────────────
  listCards: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      // Verify ownership
      const [deck] = await db.execute(
        sql`SELECT id FROM flashcard_decks WHERE id = ${input.deckId} AND userId = ${ctx.user.id}`
      );
      if (!Array.isArray(deck) || deck.length === 0) return [];
      const [rows] = await db.execute(
        sql`SELECT * FROM flashcard_cards WHERE deckId = ${input.deckId} ORDER BY createdAt DESC`
      );
      return Array.isArray(rows) ? rows : [];
    }),

  // ── Get due cards for review ─────────────────────────────────────────────
  getDueCards: protectedProcedure
    .input(z.object({ deckId: z.number(), limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      if (input?.deckId) {
        const [rows] = await db.execute(sql`
          SELECT fc.* FROM flashcard_cards fc
          JOIN flashcard_decks fd ON fd.id = fc.deckId
          WHERE fd.userId = ${ctx.user.id} AND fc.deckId = ${input.deckId}
            AND fc.nextReviewAt <= NOW()
          ORDER BY fc.nextReviewAt ASC
          LIMIT ${input.limit || 20}
        `);
        return Array.isArray(rows) ? rows : [];
      }
      // All due cards across all decks
      const [rows] = await db.execute(sql`
        SELECT fc.*, fd.title as deckTitle FROM flashcard_cards fc
        JOIN flashcard_decks fd ON fd.id = fc.deckId
        WHERE fd.userId = ${ctx.user.id} AND fc.nextReviewAt <= NOW()
        ORDER BY fc.nextReviewAt ASC
        LIMIT 20
      `);
      return Array.isArray(rows) ? rows : [];
    }),

  // ── Create a card ────────────────────────────────────────────────────────
  createCard: protectedProcedure
    .input(z.object({
      deckId: z.number(),
      front: z.string().min(1),
      back: z.string().min(1),
      hint: z.string().optional(),
      audioUrl: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      // Verify ownership
      const [deck] = await db.execute(
        sql`SELECT id FROM flashcard_decks WHERE id = ${input.deckId} AND userId = ${ctx.user.id}`
      );
      if (!Array.isArray(deck) || deck.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }
      await db.execute(sql`
        INSERT INTO flashcard_cards (deckId, front, back, hint, audioUrl, imageUrl)
        VALUES (${input.deckId}, ${input.front}, ${input.back}, ${input.hint || null},
                ${input.audioUrl || null}, ${input.imageUrl || null})
      `);
      // Update card count
      await db.execute(sql`
        UPDATE flashcard_decks SET cardCount = (SELECT COUNT(*) FROM flashcard_cards WHERE deckId = ${input.deckId})
        WHERE id = ${input.deckId}
      `);
      return { success: true };
    }),

  // ── Delete a card ────────────────────────────────────────────────────────
  deleteCard: protectedProcedure
    .input(z.object({ cardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      // Get the card's deck to verify ownership
      const [card] = await db.execute(
        sql`SELECT fc.deckId FROM flashcard_cards fc
            JOIN flashcard_decks fd ON fd.id = fc.deckId
            WHERE fc.id = ${input.cardId} AND fd.userId = ${ctx.user.id}`
      );
      if (!Array.isArray(card) || card.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }
      const deckId = (card[0] as any).deckId;
      await db.execute(sql`DELETE FROM flashcard_cards WHERE id = ${input.cardId}`);
      await db.execute(sql`
        UPDATE flashcard_decks SET cardCount = (SELECT COUNT(*) FROM flashcard_cards WHERE deckId = ${deckId})
        WHERE id = ${deckId}
      `);
      return { success: true };
    }),

  // ── Review a card (SM-2 algorithm) ───────────────────────────────────────
  reviewCard: protectedProcedure
    .input(z.object({
      cardId: z.number(),
      quality: z.number().min(0).max(5), // 0-5 quality rating (SM-2)
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      // Get current card state
      const [cardRows] = await db.execute(sql`
        SELECT fc.*, fd.userId FROM flashcard_cards fc
        JOIN flashcard_decks fd ON fd.id = fc.deckId
        WHERE fc.id = ${input.cardId} AND fd.userId = ${ctx.user.id}
      `);
      if (!Array.isArray(cardRows) || cardRows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }
      const card = cardRows[0] as any;
      const q = input.quality;
      let ef = Number(card.easeFactor) || 2.5;
      let interval = Number(card.interval_days) || 0;
      let reps = Number(card.repetitions) || 0;

      // SM-2 Algorithm
      if (q >= 3) {
        // Correct response
        if (reps === 0) {
          interval = 1;
        } else if (reps === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * ef);
        }
        reps += 1;
      } else {
        // Incorrect response — reset
        reps = 0;
        interval = 1;
      }

      // Update ease factor
      ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (ef < 1.3) ef = 1.3;

      await db.execute(sql`
        UPDATE flashcard_cards
        SET easeFactor = ${ef},
            interval_days = ${interval},
            repetitions = ${reps},
            nextReviewAt = DATE_ADD(NOW(), INTERVAL ${interval} DAY),
            lastReviewedAt = NOW()
        WHERE id = ${input.cardId}
      `);

      return { success: true, nextInterval: interval, easeFactor: ef };
    }),

  // ── Get study streak ─────────────────────────────────────────────────────
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await ensureFlashcardTables();
    // Get all study dates for this user, ordered descending
    const [rows] = await db.execute(sql`
      SELECT studyDate, cardsReviewed, correctCount, sessionDurationSec
      FROM study_streaks
      WHERE userId = ${ctx.user.id}
      ORDER BY studyDate DESC
      LIMIT 90
    `);
    const dates = Array.isArray(rows) ? rows.map((r: any) => ({
      date: r.studyDate,
      cards: Number(r.cardsReviewed),
      correct: Number(r.correctCount),
      duration: Number(r.sessionDurationSec),
    })) : [];

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i].date);
      d.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (d.getTime() === expected.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1].date);
      const curr = new Date(dates[i].date);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Total stats
    const totalCards = dates.reduce((s, d) => s + d.cards, 0);
    const totalCorrect = dates.reduce((s, d) => s + d.correct, 0);
    const totalDuration = dates.reduce((s, d) => s + d.duration, 0);

    return {
      currentStreak,
      longestStreak,
      totalCards,
      totalCorrect,
      totalDuration,
      accuracy: totalCards > 0 ? Math.round((totalCorrect / totalCards) * 100) : 0,
      recentDays: dates.slice(0, 30),
    };
  }),

  // ── Record a study session ──────────────────────────────────────────────
  recordSession: protectedProcedure
    .input(z.object({
      cardsReviewed: z.number().min(0),
      correctCount: z.number().min(0),
      sessionDurationSec: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureFlashcardTables();
      await db.execute(sql`
        INSERT INTO study_streaks (userId, studyDate, cardsReviewed, correctCount, sessionDurationSec)
        VALUES (${ctx.user.id}, CURDATE(), ${input.cardsReviewed}, ${input.correctCount}, ${input.sessionDurationSec})
        ON DUPLICATE KEY UPDATE
          cardsReviewed = cardsReviewed + ${input.cardsReviewed},
          correctCount = correctCount + ${input.correctCount},
          sessionDurationSec = sessionDurationSec + ${input.sessionDurationSec}
      `);
      return { success: true };
    }),
});
