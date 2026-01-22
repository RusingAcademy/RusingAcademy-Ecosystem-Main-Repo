import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { TRPCError } from "@trpc/server";
import { 
  learnerXp, 
  xpTransactions, 
  learnerBadges,
  users
} from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

// XP amounts for different actions
const XP_REWARDS = {
  lesson_complete: 10,
  quiz_pass: 15,
  quiz_perfect: 25,
  module_complete: 50,
  course_complete: 200,
  streak_bonus: 5,
  daily_login: 5,
  first_lesson: 20,
  challenge_complete: 30,
  review_submitted: 10,
  note_created: 5,
  exercise_complete: 8,
  speaking_practice: 12,
  writing_submitted: 15,
  milestone_bonus: 100,
  level_up_bonus: 50,
  referral_bonus: 100,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Beginner", titleFr: "Débutant" },
  { level: 2, xp: 100, title: "Novice", titleFr: "Novice" },
  { level: 3, xp: 300, title: "Apprentice", titleFr: "Apprenti" },
  { level: 4, xp: 600, title: "Intermediate", titleFr: "Intermédiaire" },
  { level: 5, xp: 1000, title: "Proficient", titleFr: "Compétent" },
  { level: 6, xp: 1500, title: "Advanced", titleFr: "Avancé" },
  { level: 7, xp: 2200, title: "Expert", titleFr: "Expert" },
  { level: 8, xp: 3000, title: "Master", titleFr: "Maître" },
  { level: 9, xp: 4000, title: "Champion", titleFr: "Champion" },
  { level: 10, xp: 5500, title: "Legend", titleFr: "Légende" },
];

function getLevelForXp(totalXp: number) {
  let currentLevel = LEVEL_THRESHOLDS[0];
  for (const level of LEVEL_THRESHOLDS) {
    if (totalXp >= level.xp) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

function getNextLevel(currentLevel: number) {
  const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === currentLevel + 1);
  return nextLevelIndex >= 0 ? LEVEL_THRESHOLDS[nextLevelIndex] : null;
}

export const gamificationRouter = router({
  // Get user's gamification stats
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const userId = ctx.user.id;
    
    // Get or create XP record
    const xpRecords = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
    let xpRecord = xpRecords[0];
    
    if (!xpRecord) {
      await db.insert(learnerXp).values({
        userId,
        totalXp: 0,
        weeklyXp: 0,
        monthlyXp: 0,
        currentLevel: 1,
        levelTitle: "Beginner",
        currentStreak: 0,
        longestStreak: 0,
      });
      
      const newXpRecords = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
      xpRecord = newXpRecords[0];
    }
    
    const currentLevelInfo = getLevelForXp(xpRecord!.totalXp);
    const nextLevel = getNextLevel(currentLevelInfo.level);
    const xpToNextLevel = nextLevel ? nextLevel.xp - xpRecord!.totalXp : 0;
    const progressToNextLevel = nextLevel 
      ? ((xpRecord!.totalXp - currentLevelInfo.xp) / (nextLevel.xp - currentLevelInfo.xp)) * 100
      : 100;
    
    // Get recent badges
    const recentBadges = await db.select().from(learnerBadges)
      .where(eq(learnerBadges.userId, userId))
      .orderBy(desc(learnerBadges.awardedAt))
      .limit(5);
    
    // Get badge count
    const badgeCount = await db.select({ count: sql<number>`count(*)` })
      .from(learnerBadges)
      .where(eq(learnerBadges.userId, userId));
    
    return {
      // Flat properties for dashboard compatibility
      totalXp: xpRecord!.totalXp,
      level: currentLevelInfo.level,
      currentStreak: xpRecord!.currentStreak,
      recentBadges: recentBadges.map(b => ({
        id: b.id,
        name: b.title,
        icon: b.badgeType?.includes('streak') ? '🔥' : b.badgeType?.includes('xp') ? '⭐' : '🏆',
      })),
      // Original nested structure
      xp: {
        total: xpRecord!.totalXp,
        weekly: xpRecord!.weeklyXp,
        monthly: xpRecord!.monthlyXp,
      },
      levelInfo: {
        current: currentLevelInfo.level,
        title: currentLevelInfo.title,
        titleFr: currentLevelInfo.titleFr,
        xpToNextLevel,
        progressPercent: Math.round(progressToNextLevel),
        nextLevel: nextLevel ? {
          level: nextLevel.level,
          title: nextLevel.title,
          titleFr: nextLevel.titleFr,
          xpRequired: nextLevel.xp,
        } : null,
      },
      streak: {
        current: xpRecord!.currentStreak,
        longest: xpRecord!.longestStreak,
        lastActivity: xpRecord!.lastActivityDate,
        freezeAvailable: xpRecord!.streakFreezeAvailable,
      },
      badges: {
        total: badgeCount[0]?.count || 0,
        recent: recentBadges,
      },
    };
  }),
  
  // Award XP for an action
  awardXp: protectedProcedure
    .input(z.object({
      reason: z.enum([
        "lesson_complete", "quiz_pass", "quiz_perfect", "module_complete",
        "course_complete", "streak_bonus", "daily_login", "first_lesson",
        "challenge_complete", "review_submitted", "note_created", "exercise_complete",
        "speaking_practice", "writing_submitted", "milestone_bonus", "level_up_bonus", "referral_bonus",
      ]),
      referenceType: z.string().optional(),
      referenceId: z.number().optional(),
      customAmount: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const userId = ctx.user.id;
      const amount = input.customAmount || XP_REWARDS[input.reason];
      
      const xpRecordsList = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
      let xpRecord = xpRecordsList[0];
      
      if (!xpRecord) {
        await db.insert(learnerXp).values({
          userId, totalXp: 0, weeklyXp: 0, monthlyXp: 0,
          currentLevel: 1, levelTitle: "Beginner", currentStreak: 0, longestStreak: 0,
        });
        const newXpRecordsList = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
        xpRecord = newXpRecordsList[0];
      }
      
      const oldLevel = getLevelForXp(xpRecord!.totalXp);
      const newTotalXp = xpRecord!.totalXp + amount;
      const newLevel = getLevelForXp(newTotalXp);
      
      await db.insert(xpTransactions).values({
        userId, amount, reason: input.reason,
        referenceType: input.referenceType, referenceId: input.referenceId,
      });
      
      await db.update(learnerXp)
        .set({
          totalXp: newTotalXp,
          weeklyXp: xpRecord!.weeklyXp + amount,
          monthlyXp: xpRecord!.monthlyXp + amount,
          currentLevel: newLevel.level,
          levelTitle: newLevel.title,
          lastActivityDate: new Date(),
        })
        .where(eq(learnerXp.userId, userId));
      
      const leveledUp = newLevel.level > oldLevel.level;
      
      if (leveledUp) {
        await db.insert(xpTransactions).values({
          userId, amount: XP_REWARDS.level_up_bonus, reason: "level_up_bonus",
          description: `Reached level ${newLevel.level}: ${newLevel.title}`,
        });
        await db.update(learnerXp).set({ totalXp: newTotalXp + XP_REWARDS.level_up_bonus }).where(eq(learnerXp.userId, userId));
      }
      
      return {
        xpAwarded: amount,
        newTotal: newTotalXp + (leveledUp ? XP_REWARDS.level_up_bonus : 0),
        leveledUp,
        newLevel: leveledUp ? newLevel : null,
      };
    }),
  
  // Get all badges for user
  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const badges = await db.select().from(learnerBadges)
      .where(eq(learnerBadges.userId, ctx.user.id))
      .orderBy(desc(learnerBadges.awardedAt));
    
    await db.update(learnerBadges)
      .set({ isNew: false })
      .where(and(eq(learnerBadges.userId, ctx.user.id), eq(learnerBadges.isNew, true)));
    
    return badges;
  }),
  
  // Award a badge
  awardBadge: protectedProcedure
    .input(z.object({
      badgeType: z.enum([
        "first_lesson", "module_complete", "course_complete", "all_courses_complete",
        "streak_3", "streak_7", "streak_14", "streak_30", "streak_100",
        "quiz_ace", "perfect_module", "quiz_master",
        "early_bird", "night_owl", "weekend_warrior", "consistent_learner",
        "xp_100", "xp_500", "xp_1000", "xp_5000",
        "founding_member", "beta_tester", "community_helper", "top_reviewer",
      ]),
      title: z.string(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      courseId: z.number().optional(),
      moduleId: z.number().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const userId = ctx.user.id;
      
      const existingBadges = await db.select().from(learnerBadges)
        .where(and(
          eq(learnerBadges.userId, userId),
          eq(learnerBadges.badgeType, input.badgeType),
        ))
        .limit(1);
      const existing = existingBadges[0];
      
      if (existing) return { alreadyAwarded: true, badge: existing };
      
      const [badge] = await db.insert(learnerBadges).values({
        userId,
        badgeType: input.badgeType,
        title: input.title,
        titleFr: input.titleFr,
        description: input.description,
        descriptionFr: input.descriptionFr,
        courseId: input.courseId,
        moduleId: input.moduleId,
        metadata: input.metadata,
        isNew: true,
      }).$returningId();
      
      return { alreadyAwarded: false, badge };
    }),
  
  // Update streak
  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const userId = ctx.user.id;
    const xpRecords = await db.select().from(learnerXp).where(eq(learnerXp.userId, userId)).limit(1);
    const xpRecord = xpRecords[0];
    
    if (!xpRecord) return { streak: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = xpRecord.lastActivityDate ? new Date(xpRecord.lastActivityDate) : null;
    if (lastActivity) lastActivity.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = xpRecord.currentStreak;
    
    if (!lastActivity || lastActivity.getTime() < yesterday.getTime()) {
      newStreak = 1;
    } else if (lastActivity.getTime() === yesterday.getTime()) {
      newStreak = xpRecord.currentStreak + 1;
    }
    
    const newLongest = Math.max(newStreak, xpRecord.longestStreak);
    
    await db.update(learnerXp)
      .set({ currentStreak: newStreak, longestStreak: newLongest, lastActivityDate: new Date() })
      .where(eq(learnerXp.userId, userId));
    
    // Check for streak badges
    const streakBadges = [
      { days: 3, type: "streak_3" as const, title: "3-Day Streak", titleFr: "Série de 3 jours" },
      { days: 7, type: "streak_7" as const, title: "Week Warrior", titleFr: "Guerrier de la semaine" },
      { days: 14, type: "streak_14" as const, title: "Two Week Champion", titleFr: "Champion de deux semaines" },
      { days: 30, type: "streak_30" as const, title: "Monthly Master", titleFr: "Maître mensuel" },
      { days: 100, type: "streak_100" as const, title: "Century Legend", titleFr: "Légende du siècle" },
    ];
    
    for (const badge of streakBadges) {
      if (newStreak >= badge.days) {
        const existingBadgesList = await db.select().from(learnerBadges)
          .where(and(eq(learnerBadges.userId, userId), eq(learnerBadges.badgeType, badge.type)))
          .limit(1);
        const existing = existingBadgesList[0];
        
        if (!existing) {
          await db.insert(learnerBadges).values({
            userId, badgeType: badge.type, title: badge.title, titleFr: badge.titleFr,
            description: `Maintained a ${badge.days}-day learning streak`,
            descriptionFr: `A maintenu une série d'apprentissage de ${badge.days} jours`,
            metadata: { streakDays: newStreak }, isNew: true,
          });
        }
      }
    }
    
    return { streak: newStreak, longest: newLongest };
  }),
  
  // Get XP history
  getXpHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const transactions = await db.select().from(xpTransactions)
        .where(eq(xpTransactions.userId, ctx.user.id))
        .orderBy(desc(xpTransactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return transactions;
    }),
  
  // Get leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({
      period: z.enum(["weekly", "monthly", "allTime"]).default("weekly"),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const xpField = input.period === "weekly" 
        ? learnerXp.weeklyXp 
        : input.period === "monthly" 
          ? learnerXp.monthlyXp 
          : learnerXp.totalXp;
      
      const leaderboard = await db
        .select({
          oduserId: learnerXp.userId,
          xp: xpField,
          level: learnerXp.currentLevel,
          levelTitle: learnerXp.levelTitle,
          streak: learnerXp.currentStreak,
          userName: users.name,
          userAvatar: users.avatarUrl,
        })
        .from(learnerXp)
        .innerJoin(users, eq(learnerXp.userId, users.id))
        .orderBy(desc(xpField))
        .limit(input.limit);
      
      return leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));
    }),
});
