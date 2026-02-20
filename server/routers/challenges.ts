import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { challenges, userChallenges } from "../../drizzle/schema";

export const challengesRouter = router({
   // ── List Active Challenges ──────────────────────────────────
  list: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(challenges)
        .where(eq(challenges.isActive, true))
        .orderBy(desc(challenges.createdAt))
        .limit(input.limit);
    }),

  // ── List All Challenges (Admin) ─────────────────────────────
  listAll: adminProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(challenges)
        .orderBy(desc(challenges.createdAt))
        .limit(input.limit);
    }),

  // ── Update Challenge (Admin) ────────────────────────────────
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(3).max(100).optional(),
        nameFr: z.string().optional(),
        description: z.string().optional(),
        descriptionFr: z.string().optional(),
        type: z.enum(["sessions", "reviews", "referrals", "streak", "first_session"]).optional(),
        targetCount: z.number().min(1).optional(),
        pointsReward: z.number().min(1).optional(),
        period: z.enum(["daily", "weekly", "monthly", "one_time"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(challenges).set(data).where(eq(challenges.id, id));
      return { success: true };
    }),

  // ── Delete Challenge (Admin) ────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(userChallenges).where(eq(userChallenges.challengeId, input.id));
      await db.delete(challenges).where(eq(challenges.id, input.id));
      return { success: true };
    }),

  // ── Get Challenge Details ───────────────────────────────────
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db.select().from(challenges).where(eq(challenges.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  // ── Create Challenge (Admin) ────────────────────────────────
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3).max(100),
        nameFr: z.string().optional(),
        description: z.string().optional(),
        descriptionFr: z.string().optional(),
        type: z.enum(["sessions", "reviews", "referrals", "streak", "first_session"]),
        targetCount: z.number().min(1),
        pointsReward: z.number().min(1),
        period: z.enum(["daily", "weekly", "monthly", "one_time"]),
        startAt: z.date().optional(),
        endAt: z.date().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(challenges).values(input);
      return { id: Number(result[0].insertId) };
    }),

  // ── Join Challenge ──────────────────────────────────────────
  join: protectedProcedure
    .input(z.object({ challengeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already joined
      const existing = await db
        .select()
        .from(userChallenges)
        .where(and(eq(userChallenges.challengeId, input.challengeId), eq(userChallenges.userId, ctx.user.id)))
        .limit(1);

      if (existing.length > 0) return { status: "already_joined" };

      const challenge = await db.select().from(challenges).where(eq(challenges.id, input.challengeId)).limit(1);
      if (!challenge[0]) throw new Error("Challenge not found");

      await db.insert(userChallenges).values({
        userId: ctx.user.id,
        challengeId: input.challengeId,
        targetProgress: challenge[0].targetCount,
        periodStart: challenge[0].startAt,
        periodEnd: challenge[0].endAt,
      });

      return { status: "joined" };
    }),

  // ── My Challenges ───────────────────────────────────────────
  myChallenges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select({
        id: userChallenges.id,
        challengeId: userChallenges.challengeId,
        currentProgress: userChallenges.currentProgress,
        targetProgress: userChallenges.targetProgress,
        status: userChallenges.status,
        completedAt: userChallenges.completedAt,
        pointsAwarded: userChallenges.pointsAwarded,
        challengeName: challenges.name,
        challengeNameFr: challenges.nameFr,
        challengeType: challenges.type,
        challengeDescription: challenges.description,
        pointsReward: challenges.pointsReward,
        period: challenges.period,
        imageUrl: challenges.imageUrl,
      })
      .from(userChallenges)
      .leftJoin(challenges, eq(userChallenges.challengeId, challenges.id))
      .where(eq(userChallenges.userId, ctx.user.id))
      .orderBy(desc(userChallenges.createdAt));
  }),
});
