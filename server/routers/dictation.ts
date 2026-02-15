/**
 * Dictation Router — Wave G, Sprint G2
 *
 * Dictation exercises for SLE listening/writing practice:
 * - generateSentences: Get dictation sentences by level
 * - saveResult: Save a dictation attempt result
 * - getHistory: Get user's dictation history
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureDictationTables() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dictation_sentences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sentenceFr VARCHAR(1000) NOT NULL,
      sentenceEn VARCHAR(1000),
      level ENUM('A','B','C') DEFAULT 'B',
      category VARCHAR(100) DEFAULT 'general',
      difficulty INT DEFAULT 2,
      audioUrl VARCHAR(500),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_level (level)
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dictation_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      sentenceId INT,
      originalText VARCHAR(1000) NOT NULL,
      userText VARCHAR(1000) NOT NULL,
      accuracy DECIMAL(5,2) DEFAULT 0,
      level VARCHAR(5) DEFAULT 'B',
      timeSpentSeconds INT DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user (userId),
      INDEX idx_user_date (userId, createdAt)
    )
  `);
  return db;
}

// Built-in seed sentences for when the DB is empty
const SEED_SENTENCES = {
  A: [
    { fr: "Bonjour, comment allez-vous aujourd'hui?", en: "Hello, how are you today?" },
    { fr: "Je travaille au bureau chaque jour.", en: "I work at the office every day." },
    { fr: "La réunion commence à neuf heures.", en: "The meeting starts at nine o'clock." },
    { fr: "Pouvez-vous m'envoyer le document?", en: "Can you send me the document?" },
    { fr: "Merci pour votre aide.", en: "Thank you for your help." },
  ],
  B: [
    { fr: "Le gouvernement a annoncé de nouvelles mesures pour améliorer les services publics.", en: "The government announced new measures to improve public services." },
    { fr: "Les fonctionnaires doivent respecter les normes de service établies.", en: "Public servants must respect established service standards." },
    { fr: "La politique de langues officielles garantit l'accès aux services dans les deux langues.", en: "The official languages policy guarantees access to services in both languages." },
    { fr: "Le comité examinera les recommandations lors de la prochaine séance.", en: "The committee will review the recommendations at the next session." },
    { fr: "Il est essentiel de maintenir un environnement de travail respectueux et inclusif.", en: "It is essential to maintain a respectful and inclusive work environment." },
  ],
  C: [
    { fr: "La mise en œuvre des recommandations du vérificateur général nécessite une coordination interministérielle approfondie.", en: "Implementing the Auditor General's recommendations requires thorough interdepartmental coordination." },
    { fr: "Les parties prenantes ont exprimé des préoccupations quant à l'incidence budgétaire des modifications proposées au programme.", en: "Stakeholders expressed concerns about the budgetary impact of proposed program modifications." },
    { fr: "Le sous-ministre adjoint a souligné l'importance de la reddition de comptes dans le cadre de la gestion axée sur les résultats.", en: "The Assistant Deputy Minister emphasized the importance of accountability within results-based management." },
    { fr: "La stratégie de transformation numérique vise à moderniser la prestation des services tout en assurant la protection des renseignements personnels.", en: "The digital transformation strategy aims to modernize service delivery while ensuring the protection of personal information." },
    { fr: "L'évaluation horizontale a permis de cerner les lacunes en matière de coordination entre les organismes fédéraux concernés.", en: "The horizontal evaluation identified gaps in coordination among the federal agencies involved." },
  ],
};

export const dictationRouter = router({

  generateSentences: protectedProcedure
    .input(z.object({
      level: z.enum(["A", "B", "C"]).default("B"),
      count: z.number().default(5),
    }))
    .query(async ({ ctx, input }) => {
      const db = await ensureDictationTables();

      // Try to get sentences from DB first
      const [dbSentences] = await db.execute(sql`
        SELECT id, sentenceFr, sentenceEn, level, category, difficulty
        FROM dictation_sentences
        WHERE level = ${input.level}
        ORDER BY RAND()
        LIMIT ${input.count}
      `);

      if ((dbSentences as any[]).length >= input.count) {
        return (dbSentences as any[]).map((s: any) => ({
          id: s.id,
          text: s.sentenceFr,
          translation: s.sentenceEn,
          level: s.level,
          category: s.category,
        }));
      }

      // Fall back to seed sentences
      const seeds = SEED_SENTENCES[input.level] || SEED_SENTENCES.B;
      return seeds.slice(0, input.count).map((s, i) => ({
        id: i + 1,
        text: s.fr,
        translation: s.en,
        level: input.level,
        category: "general",
      }));
    }),

  saveResult: protectedProcedure
    .input(z.object({
      sentenceId: z.number().optional(),
      originalText: z.string(),
      userText: z.string(),
      accuracy: z.number(),
      level: z.string().default("B"),
      timeSpentSeconds: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureDictationTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.execute(sql`
        INSERT INTO dictation_results (userId, sentenceId, originalText, userText, accuracy, level, timeSpentSeconds)
        VALUES (${userId}, ${input.sentenceId ?? null}, ${input.originalText}, ${input.userText}, ${input.accuracy}, ${input.level}, ${input.timeSpentSeconds})
      `);

      return { success: true };
    }),

  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
      page: z.number().default(1),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensureDictationTables();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const limit = input?.limit ?? 20;
      const offset = ((input?.page ?? 1) - 1) * limit;

      const [results] = await db.execute(sql`
        SELECT id, originalText, userText, accuracy, level, timeSpentSeconds, createdAt
        FROM dictation_results
        WHERE userId = ${userId}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const [statsResult] = await db.execute(sql`
        SELECT COUNT(*) as totalAttempts,
               AVG(accuracy) as avgAccuracy,
               SUM(timeSpentSeconds) as totalTime
        FROM dictation_results
        WHERE userId = ${userId}
      `);
      const stats = (statsResult as any)?.[0] ?? {};

      return {
        results: results as any[],
        stats: {
          totalAttempts: stats.totalAttempts ?? 0,
          avgAccuracy: Math.round((stats.avgAccuracy ?? 0) * 100) / 100,
          totalTimeMinutes: Math.round((stats.totalTime ?? 0) / 60),
        },
      };
    }),
});
