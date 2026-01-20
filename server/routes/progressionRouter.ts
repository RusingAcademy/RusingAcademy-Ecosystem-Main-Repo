// Progression Router - tRPC endpoints for learner progression - Sprint 9
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '../db';
import { learnerProgress, testResults, chaptersCompleted } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const progressionRouter = router({
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const progress = await db.select().from(learnerProgress).where(eq(learnerProgress.userId, userId)).limit(1);
    return progress[0] || { currentLevel: 'A', targetLevel: 'B', overallProgress: 0, oralProgress: 0, writtenProgress: 0, grammarProgress: 0 };
  }),

  getTestResults: protectedProcedure.input(z.object({ limit: z.number().default(10) }).optional()).query(async ({ ctx, input }) => {
    const userId = ctx.auth.userId;
    const results = await db.select().from(testResults).where(eq(testResults.userId, userId)).orderBy(desc(testResults.completedAt)).limit(input?.limit || 10);
    return results;
  }),

  getCompletedChapters: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const chapters = await db.select().from(chaptersCompleted).where(eq(chaptersCompleted.userId, userId)).orderBy(desc(chaptersCompleted.completedAt));
    return chapters;
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const tests = await db.select().from(testResults).where(eq(testResults.userId, userId));
    const chapters = await db.select().from(chaptersCompleted).where(eq(chaptersCompleted.userId, userId));
    const avgScore = tests.length > 0 ? tests.reduce((acc, t) => acc + t.score, 0) / tests.length : 0;
    return { testsCompleted: tests.length, chaptersCompleted: chapters.length, averageScore: Math.round(avgScore), studyStreak: 0 };
  }),

  updateProgress: protectedProcedure.input(z.object({ oralProgress: z.number().optional(), writtenProgress: z.number().optional(), grammarProgress: z.number().optional() })).mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.userId;
    await db.update(learnerProgress).set({ ...input, updatedAt: new Date() }).where(eq(learnerProgress.userId, userId));
    return { success: true };
  }),
});

export default progressionRouter;
