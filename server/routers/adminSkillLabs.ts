/**
 * Admin Skill Labs Router — Content management for flashcards, vocabulary, grammar drills,
 * daily review configuration, and study groups.
 * Sprint F4: Wire admin pages to real backend data.
 */
import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const getDb = async () => {
  const { getDb: gdb } = await import("../db");
  return gdb();
};

const requireAdmin = (ctx: any) => {
  if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
};

/* ─── Admin Flashcards Router ─── */
export const adminFlashcardsRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return { totalDecks: 0, totalCards: 0, activeUsers: 0, avgCardsPerDeck: 0, avgMastery: 0 };
    try {
      const [deckCount] = await db.execute(sql`SELECT COUNT(*) as total FROM flashcard_decks`);
      const [cardCount] = await db.execute(sql`SELECT COUNT(*) as total FROM flashcard_cards`);
      const [userCount] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as total FROM flashcard_decks`);
      const [avgCards] = await db.execute(sql`
        SELECT COALESCE(AVG(cnt), 0) as avg FROM (
          SELECT COUNT(*) as cnt FROM flashcard_cards GROUP BY deckId
        ) sub
      `);
      const [avgMastery] = await db.execute(sql`
        SELECT COALESCE(AVG(
          CASE WHEN repetitions >= 5 THEN 100
               WHEN repetitions >= 3 THEN 75
               WHEN repetitions >= 1 THEN 40
               ELSE 0 END
        ), 0) as avg FROM flashcard_cards
      `);
      return {
        totalDecks: (deckCount as any)?.total ?? 0,
        totalCards: (cardCount as any)?.total ?? 0,
        activeUsers: (userCount as any)?.total ?? 0,
        avgCardsPerDeck: Math.round((avgCards as any)?.avg ?? 0),
        avgMastery: Math.round((avgMastery as any)?.avg ?? 0),
      };
    } catch { return { totalDecks: 0, totalCards: 0, activeUsers: 0, avgCardsPerDeck: 0, avgMastery: 0 }; }
  }),

  listDecks: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      level: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) return [];
      try {
        const search = input?.search ? `%${input.search}%` : null;
        const level = input?.level || null;
        const rows = await db.execute(sql`
          SELECT fd.*, u.name as ownerName,
            (SELECT COUNT(*) FROM flashcard_cards WHERE deckId = fd.id) as cardCount
          FROM flashcard_decks fd
          LEFT JOIN users u ON u.id = fd.userId
          WHERE 1=1
            ${search ? sql`AND (fd.title LIKE ${search} OR fd.titleFr LIKE ${search})` : sql``}
            ${level ? sql`AND fd.cefrLevel = ${level}` : sql``}
          ORDER BY fd.updatedAt DESC
          LIMIT ${input?.limit ?? 50} OFFSET ${input?.offset ?? 0}
        `);
        return Array.isArray(rows) ? rows : [];
      } catch { return []; }
    }),

  deleteDeck: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`DELETE FROM flashcard_cards WHERE deckId = ${input.id}`);
      await db.execute(sql`DELETE FROM flashcard_decks WHERE id = ${input.id}`);
      return { success: true };
    }),

  createSeedDeck: protectedProcedure
    .input(z.object({
      title: z.string(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1"]),
      category: z.string().optional(),
      cards: z.array(z.object({
        front: z.string(),
        back: z.string(),
        frontFr: z.string().optional(),
        backFr: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Create deck under admin user
      await db.execute(sql`
        INSERT INTO flashcard_decks (userId, title, titleFr, description, descriptionFr, cefrLevel, category)
        VALUES (${ctx.user.id}, ${input.title}, ${input.titleFr ?? input.title}, ${input.description ?? ""}, ${input.descriptionFr ?? ""}, ${input.cefrLevel}, ${input.category ?? "general"})
      `);
      const [row] = await db.execute(sql`SELECT LAST_INSERT_ID() as id`);
      const deckId = (row as any)?.id;
      if (!deckId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create deck" });
      for (const card of input.cards) {
        await db.execute(sql`
          INSERT INTO flashcard_cards (deckId, front, back, frontFr, backFr)
          VALUES (${deckId}, ${card.front}, ${card.back}, ${card.frontFr ?? card.front}, ${card.backFr ?? card.back})
        `);
      }
      return { success: true, deckId };
    }),
});

/* ─── Admin Vocabulary Router ─── */
export const adminVocabularyRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return { totalWords: 0, activeUsers: 0, avgMastery: 0, topCategories: [] };
    try {
      const [wordCount] = await db.execute(sql`SELECT COUNT(*) as total FROM vocabulary_items`);
      const [userCount] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as total FROM vocabulary_items`);
      const [avgMastery] = await db.execute(sql`SELECT COALESCE(AVG(masteryLevel), 0) as avg FROM vocabulary_items`);
      const categories = await db.execute(sql`
        SELECT category, COUNT(*) as count FROM vocabulary_items
        GROUP BY category ORDER BY count DESC LIMIT 10
      `);
      return {
        totalWords: (wordCount as any)?.total ?? 0,
        activeUsers: (userCount as any)?.total ?? 0,
        avgMastery: Math.round((avgMastery as any)?.avg ?? 0),
        topCategories: Array.isArray(categories) ? categories : [],
      };
    } catch { return { totalWords: 0, activeUsers: 0, avgMastery: 0, topCategories: [] }; }
  }),

  listWords: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      level: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) return [];
      try {
        const search = input?.search ? `%${input.search}%` : null;
        const level = input?.level || null;
        const rows = await db.execute(sql`
          SELECT vi.*, u.name as ownerName
          FROM vocabulary_items vi
          LEFT JOIN users u ON u.id = vi.userId
          WHERE 1=1
            ${search ? sql`AND (vi.word LIKE ${search} OR vi.translation LIKE ${search})` : sql``}
            ${level ? sql`AND vi.cefrLevel = ${level}` : sql``}
          ORDER BY vi.updatedAt DESC
          LIMIT ${input?.limit ?? 50} OFFSET ${input?.offset ?? 0}
        `);
        return Array.isArray(rows) ? rows : [];
      } catch { return []; }
    }),

  listCategories: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return [];
    try {
      const rows = await db.execute(sql`
        SELECT category, COUNT(*) as count FROM vocabulary_items
        GROUP BY category ORDER BY count DESC
      `);
      return Array.isArray(rows) ? rows : [];
    } catch { return []; }
  }),

  seedWords: protectedProcedure
    .input(z.object({
      words: z.array(z.object({
        word: z.string(),
        translation: z.string(),
        category: z.string().optional(),
        cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1"]).optional(),
        exampleSentence: z.string().optional(),
        exampleSentenceFr: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      let inserted = 0;
      for (const w of input.words) {
        await db.execute(sql`
          INSERT INTO vocabulary_items (userId, word, translation, category, cefrLevel, exampleSentence, exampleSentenceFr, masteryLevel, language)
          VALUES (${ctx.user.id}, ${w.word}, ${w.translation}, ${w.category ?? "general"}, ${w.cefrLevel ?? "B1"}, ${w.exampleSentence ?? ""}, ${w.exampleSentenceFr ?? ""}, 0, 'fr')
        `);
        inserted++;
      }
      return { success: true, inserted };
    }),
});

/* ─── Admin Grammar Drills Router ─── */
export const adminGrammarDrillsRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return { totalAttempts: 0, avgScore: 0, activeUsers: 0, topTopics: [] };
    try {
      const [attemptCount] = await db.execute(sql`SELECT COUNT(*) as total FROM grammar_drill_results`);
      const [avgScore] = await db.execute(sql`SELECT COALESCE(AVG(score), 0) as avg FROM grammar_drill_results`);
      const [userCount] = await db.execute(sql`SELECT COUNT(DISTINCT userId) as total FROM grammar_drill_results`);
      const topics = await db.execute(sql`
        SELECT topic, COUNT(*) as attempts, ROUND(AVG(score)) as avgScore
        FROM grammar_drill_results
        GROUP BY topic ORDER BY attempts DESC LIMIT 10
      `);
      return {
        totalAttempts: (attemptCount as any)?.total ?? 0,
        avgScore: Math.round((avgScore as any)?.avg ?? 0),
        activeUsers: (userCount as any)?.total ?? 0,
        topTopics: Array.isArray(topics) ? topics : [],
      };
    } catch { return { totalAttempts: 0, avgScore: 0, activeUsers: 0, topTopics: [] }; }
  }),

  listResults: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      level: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) return [];
      try {
        const level = input?.level || null;
        const rows = await db.execute(sql`
          SELECT gdr.*, u.name as userName
          FROM grammar_drill_results gdr
          LEFT JOIN users u ON u.id = gdr.userId
          WHERE 1=1
            ${level ? sql`AND gdr.cefrLevel = ${level}` : sql``}
          ORDER BY gdr.completedAt DESC
          LIMIT ${input?.limit ?? 50} OFFSET ${input?.offset ?? 0}
        `);
        return Array.isArray(rows) ? rows : [];
      } catch { return []; }
    }),

  listTopics: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return [];
    try {
      const rows = await db.execute(sql`
        SELECT DISTINCT topic, cefrLevel, drillType, COUNT(*) as attempts, ROUND(AVG(score)) as avgScore
        FROM grammar_drill_results
        GROUP BY topic, cefrLevel, drillType
        ORDER BY topic
      `);
      return Array.isArray(rows) ? rows : [];
    } catch { return []; }
  }),
});

/* ─── Admin Daily Review Router ─── */
export const adminDailyReviewRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx);
    const db = await getDb();
    if (!db) return { activeStreaks: 0, totalSessions: 0, avgCardsPerDay: 0, topLearners: [] };
    try {
      const [activeStreaks] = await db.execute(sql`
        SELECT COUNT(DISTINCT userId) as total FROM study_streaks
        WHERE studyDate >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      `);
      const [totalSessions] = await db.execute(sql`SELECT COUNT(*) as total FROM study_streaks`);
      const [avgCards] = await db.execute(sql`SELECT COALESCE(AVG(cardsReviewed), 0) as avg FROM study_streaks`);
      const topLearners = await db.execute(sql`
        SELECT ss.userId, u.name, COUNT(*) as streakDays,
          SUM(ss.cardsReviewed) as totalCards, SUM(ss.correctCount) as totalCorrect
        FROM study_streaks ss
        LEFT JOIN users u ON u.id = ss.userId
        GROUP BY ss.userId, u.name
        ORDER BY streakDays DESC LIMIT 10
      `);
      return {
        activeStreaks: (activeStreaks as any)?.total ?? 0,
        totalSessions: (totalSessions as any)?.total ?? 0,
        avgCardsPerDay: Math.round((avgCards as any)?.avg ?? 0),
        topLearners: Array.isArray(topLearners) ? topLearners : [],
      };
    } catch { return { activeStreaks: 0, totalSessions: 0, avgCardsPerDay: 0, topLearners: [] }; }
  }),
});

/* ─── Admin Study Groups Router ─── */
export const adminStudyGroupsRouter = router({
  list: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) return [];
      try {
        const search = input?.search ? `%${input.search}%` : null;
        const rows = await db.execute(sql`
          SELECT sg.*, u.name as ownerName,
            (SELECT COUNT(*) FROM study_group_members WHERE groupId = sg.id) as memberCount
          FROM study_groups sg
          LEFT JOIN users u ON u.id = sg.ownerId
          WHERE 1=1
            ${search ? sql`AND (sg.name LIKE ${search} OR sg.nameFr LIKE ${search})` : sql``}
          ORDER BY sg.createdAt DESC
          LIMIT ${input?.limit ?? 50}
        `);
        return Array.isArray(rows) ? rows : [];
      } catch { return []; }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`DELETE FROM study_group_members WHERE groupId = ${input.id}`);
      await db.execute(sql`DELETE FROM study_groups WHERE id = ${input.id}`);
      return { success: true };
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      cefrLevel: z.string().optional(),
      maxMembers: z.number().default(20),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.execute(sql`
        INSERT INTO study_groups (ownerId, name, nameFr, description, descriptionFr, cefrLevel, maxMembers, isActive)
        VALUES (${ctx.user.id}, ${input.name}, ${input.nameFr ?? input.name}, ${input.description ?? ""}, ${input.descriptionFr ?? ""}, ${input.cefrLevel ?? "B1"}, ${input.maxMembers}, 1)
      `);
      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      nameFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      isActive: z.boolean().optional(),
      maxMembers: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const updates: string[] = [];
      if (input.name !== undefined) updates.push(`name = '${input.name}'`);
      if (input.nameFr !== undefined) updates.push(`nameFr = '${input.nameFr}'`);
      if (input.description !== undefined) updates.push(`description = '${input.description}'`);
      if (input.descriptionFr !== undefined) updates.push(`descriptionFr = '${input.descriptionFr}'`);
      if (input.isActive !== undefined) updates.push(`isActive = ${input.isActive ? 1 : 0}`);
      if (input.maxMembers !== undefined) updates.push(`maxMembers = ${input.maxMembers}`);
      if (updates.length > 0) {
        await db.execute(sql.raw(`UPDATE study_groups SET ${updates.join(", ")} WHERE id = ${input.id}`));
      }
      return { success: true };
    }),
});
