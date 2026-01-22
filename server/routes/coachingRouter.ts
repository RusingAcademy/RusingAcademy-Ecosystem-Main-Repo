// Coaching Router - tRPC endpoints for coaching sessions - Sprint 9
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '../db';
import { coachingSessions } from '../db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { getCalendlyService } from '../services/calendlyService';

export const coachingRouter = router({
  getSessions: protectedProcedure
    .input(z.object({ status: z.string().optional(), limit: z.number().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      const sessions = await db.select().from(coachingSessions).where(eq(coachingSessions.userId, userId)).orderBy(desc(coachingSessions.startTime)).limit(input?.limit || 50);
      return sessions;
    }),

  getUpcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const now = new Date();
    const sessions = await db.select().from(coachingSessions).where(and(eq(coachingSessions.userId, userId), gte(coachingSessions.startTime, now))).orderBy(coachingSessions.startTime).limit(10);
    return sessions;
  }),

  getSchedulingUrl: protectedProcedure.query(async () => {
    try {
      const calendlyService = getCalendlyService();
      const url = await calendlyService.getSchedulingUrl();
      return { url };
    } catch (error) {
      return { url: process.env.CALENDLY_SCHEDULING_URL || '' };
    }
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const now = new Date();
    const upcoming = await db.select().from(coachingSessions).where(and(eq(coachingSessions.userId, userId), gte(coachingSessions.startTime, now))).limit(100);
    const completed = await db.select().from(coachingSessions).where(and(eq(coachingSessions.userId, userId), eq(coachingSessions.status, 'completed'))).limit(100);
    const hours = completed.reduce((acc, s) => acc + ((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 3600000), 0);
    return { upcomingSessions: upcoming.length, completedSessions: completed.length, totalCoachingHours: Math.round(hours * 10) / 10 };
  }),
});

export default coachingRouter;
