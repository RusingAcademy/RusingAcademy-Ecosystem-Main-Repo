/**
 * Daily Goals Router — Sprint F5
 * Bridges flashcard/vocabulary reviews with the gamification streak system.
 * Provides daily goal tracking, streak info, and review completion rewards.
 */
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { getDb } from "../db";
import { learnerXp } from "@shared/schema";

export const dailyGoalsRouter = router({
  /**
   * getStreak — Returns the user's current streak details
   * Used by: Achievements page, DailyReview page
   */
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const userId = ctx.user.id;
    const xpRecords = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
    const xpRecord = xpRecords[0];

    if (!xpRecord) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        totalXp: 0,
        level: 1,
        dailyGoalMet: false,
        dailyGoalTarget: 10,
        dailyGoalProgress: 0,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = xpRecord.lastActivityDate ? new Date(xpRecord.lastActivityDate) : null;
    if (lastActivity) lastActivity.setHours(0, 0, 0, 0);

    const isActiveToday = lastActivity && lastActivity.getTime() === today.getTime();
    const currentStreak = (xpRecord as any).currentStreak ?? 0;
    const longestStreak = (xpRecord as any).longestStreak ?? 0;
    const totalXp = (xpRecord as any).totalXp ?? 0;
    const level = Math.floor(totalXp / 500) + 1;

    // Check daily review count from flashcard study sessions
    let dailyGoalProgress = 0;
    try {
      const sessionResult = await db.execute(sql`
        SELECT COALESCE(SUM(cards_reviewed), 0) as total
        FROM flashcard_study_sessions
        WHERE user_id = ${userId}
        AND DATE(session_date) = CURDATE()
      `);
      dailyGoalProgress = Number((sessionResult as any)?.rows?.[0]?.total ?? 0);
    } catch {
      // Table may not exist yet — graceful fallback
      dailyGoalProgress = isActiveToday ? 1 : 0;
    }

    const dailyGoalTarget = 10;

    return {
      currentStreak,
      longestStreak,
      lastActivityDate: xpRecord.lastActivityDate,
      totalXp,
      level,
      dailyGoalMet: dailyGoalProgress >= dailyGoalTarget,
      dailyGoalTarget,
      dailyGoalProgress: Math.min(dailyGoalProgress, dailyGoalTarget),
    };
  }),

  /**
   * recordDailyActivity — Records that the user was active today
   * Awards XP and updates streak. Called after completing a review session.
   */
  recordDailyActivity: protectedProcedure
    .input(z.object({
      activityType: z.enum(["flashcard_review", "vocabulary_quiz", "grammar_drill", "reading_exercise", "writing_submission", "listening_exercise"]),
      itemsCompleted: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const userId = ctx.user.id;
      const xpPerItem: Record<string, number> = {
        flashcard_review: 5,
        vocabulary_quiz: 10,
        grammar_drill: 15,
        reading_exercise: 20,
        writing_submission: 25,
        listening_exercise: 20,
      };

      const xpEarned = (xpPerItem[input.activityType] ?? 5) * input.itemsCompleted;

      const existing = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);

      if (!existing[0]) {
        // Create new XP record
        await db.insert(learnerXp).values({
          userId,
          totalXp: xpEarned,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date(),
        } as any);

        return { xpEarned, newStreak: 1, levelUp: false, newLevel: 1 };
      }

      const record = existing[0] as any;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastActivity = record.lastActivityDate ? new Date(record.lastActivityDate) : null;
      if (lastActivity) lastActivity.setHours(0, 0, 0, 0);

      let newStreak = record.currentStreak ?? 0;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivity) {
        if (lastActivity.getTime() === today.getTime()) {
          // Already active today — just add XP, don't increment streak
        } else if (lastActivity.getTime() === yesterday.getTime()) {
          // Consecutive day — increment streak
          newStreak += 1;
        } else {
          // Streak broken — reset to 1
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newTotalXp = (record.totalXp ?? 0) + xpEarned;
      const newLongestStreak = Math.max(record.longestStreak ?? 0, newStreak);
      const oldLevel = Math.floor((record.totalXp ?? 0) / 500) + 1;
      const newLevel = Math.floor(newTotalXp / 500) + 1;

      await db.update(learnerXp)
        .set({
          totalXp: newTotalXp,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: new Date(),
        } as any)
        .where(eq(learnerXp.userId, userId));

      return {
        xpEarned,
        newStreak,
        levelUp: newLevel > oldLevel,
        newLevel,
      };
    }),

  /**
   * getWeeklySummary — Returns a 7-day activity summary
   * Used by: DailyReview page, LearnerDashboard
   */
  getWeeklySummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const userId = ctx.user.id;
    const days: { date: string; active: boolean; cardsReviewed: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      let cardsReviewed = 0;
      try {
        const result = await db.execute(sql`
          SELECT COALESCE(SUM(cards_reviewed), 0) as total
          FROM flashcard_study_sessions
          WHERE user_id = ${userId}
          AND DATE(session_date) = ${dateStr}
        `);
        cardsReviewed = Number((result as any)?.rows?.[0]?.total ?? 0);
      } catch {
        cardsReviewed = 0;
      }

      days.push({
        date: dateStr,
        active: cardsReviewed > 0,
        cardsReviewed,
      });
    }

    return { days };
  }),
});
