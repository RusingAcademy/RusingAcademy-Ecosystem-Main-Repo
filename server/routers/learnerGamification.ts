import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, gte, count } from "drizzle-orm";
import { getDb, getLearnerByUserId } from "../db";
import { badges, challenges, learnerProfiles, loyaltyPoints, referralInvitations, rewards, sessions, users } from "../../drizzle/schema";

export const learnerGamificationRouter = router({
  getLoyaltyPoints: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    
    const { loyaltyPoints } = await import("../../drizzle/schema");
    const [points] = await db.select().from(loyaltyPoints)
      .where(eq(loyaltyPoints.learnerId, learner.id));
    
    if (!points) {
      // Create initial loyalty record
      await db.insert(loyaltyPoints).values({
        learnerId: learner.id,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
        tier: "bronze",
      });
      return { totalPoints: 0, availablePoints: 0, lifetimePoints: 0, tier: "bronze" };
    }
    
    return {
      totalPoints: points.totalPoints,
      availablePoints: points.availablePoints,
      lifetimePoints: points.lifetimePoints,
      tier: points.tier,
    };
  }),

  // Get available rewards,

  getAvailableRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { loyaltyRewards } = await import("../../drizzle/schema");
    const rewards = await db.select().from(loyaltyRewards)
      .where(eq(loyaltyRewards.isActive, true));
    
    return rewards;
  }),

  // Get points history,

  getPointsHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const { pointTransactions } = await import("../../drizzle/schema");
    const history = await db.select().from(pointTransactions)
      .where(eq(pointTransactions.learnerId, learner.id))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(50);
    
    return history;
  }),

  // Redeem reward,

  redeemReward: protectedProcedure
    .input(z.object({ rewardId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      
      const { loyaltyPoints, loyaltyRewards, redeemedRewards, pointTransactions } = await import("../../drizzle/schema");
      
      // Get reward
      const [reward] = await db.select().from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, input.rewardId));
      
      if (!reward || !reward.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reward not found or inactive" });
      }
      
      // Get current points
      const [points] = await db.select().from(loyaltyPoints)
        .where(eq(loyaltyPoints.learnerId, learner.id));
      
      if (!points || points.availablePoints < reward.pointsCost) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient points" });
      }
      
      // Check tier requirement
      const tierOrder = ["bronze", "silver", "gold", "platinum"];
      if (tierOrder.indexOf(points.tier) < tierOrder.indexOf(reward.minTier || "bronze")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tier requirement not met" });
      }
      
      // Generate discount code
      const discountCode = `LNG-${Date.now().toString(36).toUpperCase()}`;
      
      // Create redeemed reward
      await db.insert(redeemedRewards).values({
        learnerId: learner.id,
        rewardId: reward.id,
        pointsSpent: reward.pointsCost,
        discountCode,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      
      // Deduct points
      await db.update(loyaltyPoints)
        .set({
          availablePoints: points.availablePoints - reward.pointsCost,
          totalPoints: points.totalPoints - reward.pointsCost,
        })
        .where(eq(loyaltyPoints.learnerId, learner.id));
      
      // Record transaction
      await db.insert(pointTransactions).values({
        learnerId: learner.id,
        type: "redeemed_discount",
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.nameEn}`,
      });
      
      return { success: true, discountCode };
    }),
  
  // Get referral stats,

  getReferralStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const { referralInvitations } = await import("../../drizzle/schema");
    
    // Generate referral code and link for this user
    const code = `REF${ctx.user.id}${ctx.user.id.toString(36).toUpperCase()}`;
    const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || "https://lingueefy.manus.space";
    const referralLink = `${baseUrl}?ref=${code}`;
    
    // Get invitation stats
    const invitations = await db.select().from(referralInvitations)
      .where(eq(referralInvitations.referrerId, ctx.user.id));
    
    const totalInvites = invitations.length;
    const pendingInvites = invitations.filter((i: any) => i.status === "pending" || i.status === "clicked").length;
    const registeredInvites = invitations.filter((i: any) => i.status === "registered" || i.status === "converted").length;
    const convertedInvites = invitations.filter((i: any) => i.status === "converted").length;
    const totalPointsEarned = invitations.reduce((sum: number, i: any) => sum + (i.referrerRewardPoints || 0), 0);
    
    return {
      referralCode: code,
      referralLink,
      totalInvites,
      pendingInvites,
      registeredInvites,
      convertedInvites,
      totalPointsEarned,
      conversionRate: totalInvites > 0 ? (convertedInvites / totalInvites) * 100 : 0,
    };
  }),
  
  // Get referral invitations,

  getReferralInvitations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const { referralInvitations } = await import("../../drizzle/schema");
    return await db.select().from(referralInvitations)
      .where(eq(referralInvitations.referrerId, ctx.user.id))
      .orderBy(desc(referralInvitations.createdAt));
  }),
  
  // Send referral invite by email,

  sendReferralInvite: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { referralInvitations } = await import("../../drizzle/schema");
      
      // Generate referral code and link
      const code = `REF${ctx.user.id}${ctx.user.id.toString(36).toUpperCase()}`;
      const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || "https://lingueefy.manus.space";
      const referralLink = `${baseUrl}?ref=${code}`;
      
      // Check if already invited
      const [existing] = await db.select().from(referralInvitations)
        .where(and(
          eq(referralInvitations.referrerId, ctx.user.id),
          eq(referralInvitations.inviteeEmail, input.email)
        ));
      
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "This email has already been invited" });
      }
      
      // Create invitation record
      await db.insert(referralInvitations).values({
        referrerId: ctx.user.id,
        referralCode: code,
        inviteeEmail: input.email,
        inviteMethod: "email",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      
      // Send email (using existing email system)
      const { sendReferralInviteEmail } = await import("../email");
      await sendReferralInviteEmail({
        to: input.email,
        referrerName: ctx.user.name || "A friend",
        referralLink,
      });
      
      return { success: true };
    }),
    
  // Get user's active challenges,

  getChallenges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const { challenges, userChallenges } = await import("../../drizzle/schema");
    
    // Get or create weekly challenges for user
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    // Get active challenges
    const activeChallenges = await db.select().from(challenges)
      .where(eq(challenges.isActive, true));
    
    // Get user's challenge progress
    const userProgress = await db.select().from(userChallenges)
      .where(and(
        eq(userChallenges.userId, ctx.user.id),
        gte(userChallenges.periodStart, weekStart)
      ));
    
    // Create missing challenge entries for user
    for (const challenge of activeChallenges) {
      const existing = userProgress.find(p => p.challengeId === challenge.id);
      if (!existing && challenge.period === "weekly") {
        await db.insert(userChallenges).values({
          userId: ctx.user.id,
          challengeId: challenge.id,
          currentProgress: 0,
          targetProgress: challenge.targetCount,
          periodStart: weekStart,
          periodEnd: weekEnd,
        });
      }
    }
    
    // Re-fetch with joined data
    const result = await db.select({
      id: userChallenges.id,
      name: challenges.name,
      nameFr: challenges.nameFr,
      description: challenges.description,
      descriptionFr: challenges.descriptionFr,
      type: challenges.type,
      targetCount: challenges.targetCount,
      pointsReward: challenges.pointsReward,
      period: challenges.period,
      currentProgress: userChallenges.currentProgress,
      status: userChallenges.status,
      periodEnd: userChallenges.periodEnd,
    })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(and(
      eq(userChallenges.userId, ctx.user.id),
      gte(userChallenges.periodStart, weekStart)
    ));
    
    return result;
  }),
  
  // Claim challenge reward,

  claimChallengeReward: protectedProcedure
    .input(z.object({ userChallengeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { userChallenges, challenges, loyaltyPoints, pointTransactions } = await import("../../drizzle/schema");
      
      // Get user challenge
      const [userChallenge] = await db.select()
        .from(userChallenges)
        .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
        .where(and(
          eq(userChallenges.id, input.userChallengeId),
          eq(userChallenges.userId, ctx.user.id)
        ));
      
      if (!userChallenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found" });
      }
      
      if (userChallenge.user_challenges.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Reward already claimed" });
      }
      
      if (userChallenge.user_challenges.currentProgress < userChallenge.challenges.targetCount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Challenge not completed yet" });
      }
      
      // Mark as completed
      await db.update(userChallenges)
        .set({ 
          status: "completed", 
          completedAt: new Date(),
          pointsAwarded: userChallenge.challenges.pointsReward,
        })
        .where(eq(userChallenges.id, input.userChallengeId));
      
      // Award points - get learner first
      const learnerForPoints = await getLearnerByUserId(ctx.user.id);
      if (!learnerForPoints) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      const [existingPoints] = await db.select().from(loyaltyPoints)
        .where(eq(loyaltyPoints.learnerId, learnerForPoints.id));
      
      if (existingPoints) {
        await db.update(loyaltyPoints)
          .set({ 
            totalPoints: existingPoints.totalPoints + userChallenge.challenges.pointsReward,
            availablePoints: existingPoints.availablePoints + userChallenge.challenges.pointsReward,
          })
          .where(eq(loyaltyPoints.learnerId, learnerForPoints.id));
      } else {
        await db.insert(loyaltyPoints).values({
          learnerId: learnerForPoints.id,
          totalPoints: userChallenge.challenges.pointsReward,
          availablePoints: userChallenge.challenges.pointsReward,
          tier: "bronze",
        });
      }
      
      // Record transaction
      const learner = await getLearnerByUserId(ctx.user.id);
      if (learner) {
        await db.insert(pointTransactions).values({
          learnerId: learner.id,
          points: userChallenge.challenges.pointsReward,
          type: "earned_milestone",
          description: `Completed challenge: ${userChallenge.challenges.name}`,
        });
      }
      
      return { success: true, pointsAwarded: userChallenge.challenges.pointsReward };
    }),
  
  // Get leaderboard,

  getLeaderboard: protectedProcedure
    .input(z.object({ period: z.enum(["weekly", "monthly", "allTime"]) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { loyaltyPoints, learnerProfiles, users, sessions } = await import("../../drizzle/schema");
      
      // Get date filter based on period
      let dateFilter: Date | null = null;
      const now = new Date();
      if (input.period === "weekly") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (input.period === "monthly") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Get all learners with points
      const leaderboardData = await db.select({
        learnerId: loyaltyPoints.learnerId,
        points: loyaltyPoints.totalPoints,
        tier: loyaltyPoints.tier,
        userId: learnerProfiles.userId,
        userName: users.name,
        avatarUrl: users.avatarUrl,
      })
        .from(loyaltyPoints)
        .innerJoin(learnerProfiles, eq(loyaltyPoints.learnerId, learnerProfiles.id))
        .innerJoin(users, eq(learnerProfiles.userId, users.id))
        .orderBy(desc(loyaltyPoints.totalPoints))
        .limit(50);
      
      // Get session counts for each learner
      const leaderboard = await Promise.all(leaderboardData.map(async (entry, index) => {
        // Count completed sessions
        const sessionCount = await db.select({ count: sql<number>`count(*)` })
          .from(sessions)
          .where(and(
            eq(sessions.learnerId, entry.learnerId),
            eq(sessions.status, "completed")
          ));
        
        return {
          rank: index + 1,
          userId: entry.userId,
          name: entry.userName || "Anonymous",
          avatarUrl: entry.avatarUrl,
          points: entry.points,
          tier: entry.tier,
          sessionsCompleted: Number(sessionCount[0]?.count || 0),
          streak: 0, // Would need streak tracking table
          rankChange: 0, // Would need previous rank tracking
        };
      }));
      
      return leaderboard;
    }),

  // Get streak data,

  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles } = await import("../../drizzle/schema");
    
    const profile = await db.select({
      currentStreak: learnerProfiles.currentStreak,
      longestStreak: learnerProfiles.longestStreak,
      lastSessionWeek: learnerProfiles.lastSessionWeek,
      streakFreezeUsed: learnerProfiles.streakFreezeUsed,
    })
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (!profile[0]) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastSessionWeek: null,
        streakFreezeUsed: false,
        streakFreezeAvailable: true,
        nextMilestone: 3,
        pointsToNextMilestone: 50,
      };
    }
    
    return {
      currentStreak: profile[0].currentStreak || 0,
      longestStreak: profile[0].longestStreak || 0,
      lastSessionWeek: profile[0].lastSessionWeek,
      streakFreezeUsed: profile[0].streakFreezeUsed || false,
      streakFreezeAvailable: !profile[0].streakFreezeUsed,
      nextMilestone: 3,
      pointsToNextMilestone: 50,
    };
  }),

  // Use streak freeze,

  useStreakFreeze: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles } = await import("../../drizzle/schema");
    
    // Check if freeze is already used
    const profile = await db.select({ streakFreezeUsed: learnerProfiles.streakFreezeUsed })
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (profile[0]?.streakFreezeUsed) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Streak freeze already used" });
    }
    
    // Get current ISO week
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    
    // Use the freeze - update last session week to current week
    await db.update(learnerProfiles)
      .set({
        streakFreezeUsed: true,
        lastSessionWeek: currentWeek,
      })
      .where(eq(learnerProfiles.id, learner.id));
    
    return { success: true };
  }),

  // Update streak after session completion (called internally),

  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
    }
    
    const { learnerProfiles, pointTransactions, loyaltyPoints } = await import("../../drizzle/schema");
    
    // Get current profile
    const profile = await db.select()
      .from(learnerProfiles)
      .where(eq(learnerProfiles.id, learner.id))
      .limit(1);
    
    if (!profile[0]) return { success: false };
    
    // Get current ISO week
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    
    const lastWeek = profile[0].lastSessionWeek;
    let newStreak = profile[0].currentStreak || 0;
    
    // If same week, no change
    if (lastWeek === currentWeek) {
      return { success: true, streak: newStreak };
    }
    
    // Check if consecutive week
    if (lastWeek) {
      const [lastYear, lastWeekNum] = lastWeek.split('-W').map(Number);
      const [currentYear, currentWeekNum] = currentWeek.split('-W').map(Number);
      
      const isConsecutive = 
        (currentYear === lastYear && currentWeekNum === lastWeekNum + 1) ||
        (currentYear === lastYear + 1 && lastWeekNum === 52 && currentWeekNum === 1);
      
      if (isConsecutive) {
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    
    const newLongest = Math.max(newStreak, profile[0].longestStreak || 0);
    
    // Update profile
    await db.update(learnerProfiles)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastSessionWeek: currentWeek,
      })
      .where(eq(learnerProfiles.id, learner.id));
    
    // Award bonus points for streak milestones
    const milestones = [
      { weeks: 3, points: 50 },
      { weeks: 7, points: 150 },
      { weeks: 14, points: 400 },
      { weeks: 30, points: 1000 },
      { weeks: 52, points: 2500 },
    ];
    
    const milestone = milestones.find(m => m.weeks === newStreak);
    if (milestone) {
      // Award bonus points
      await db.insert(pointTransactions).values({
        learnerId: learner.id,
        type: "earned_streak",
        points: milestone.points,
        description: `${newStreak} week streak bonus!`,
      });
      
      // Update loyalty points
      const existing = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.learnerId, learner.id)).limit(1);
      if (existing[0]) {
        await db.update(loyaltyPoints)
          .set({
            totalPoints: sql`${loyaltyPoints.totalPoints} + ${milestone.points}`,
            availablePoints: sql`${loyaltyPoints.availablePoints} + ${milestone.points}`,
            lifetimePoints: sql`${loyaltyPoints.lifetimePoints} + ${milestone.points}`,
          })
          .where(eq(loyaltyPoints.learnerId, learner.id));
      } else {
        await db.insert(loyaltyPoints).values({
          learnerId: learner.id,
          totalPoints: milestone.points,
          availablePoints: milestone.points,
          lifetimePoints: milestone.points,
          tier: "bronze",
        });
      }
    }
    
    return { success: true, streak: newStreak, milestone: milestone?.weeks };
  }),
  
  // Get learner profile for dashboard,

  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { badges: [] };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { badges: [] };
    
    const { learnerBadges } = await import("../../drizzle/schema");
    
    const badges = await db.select().from(learnerBadges)
      .where(eq(learnerBadges.userId, ctx.user.id))
      .orderBy(desc(learnerBadges.awardedAt));
    
    return { badges };
  }),

  // Get learning velocity data for SLEVelocityWidget,

  getMyXp: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    
    const { learnerXp } = await import("../../drizzle/schema");
    
    const [xp] = await db.select().from(learnerXp)
      .where(eq(learnerXp.userId, ctx.user.id));
    
    if (!xp) {
      // Create initial XP record
      await db.insert(learnerXp).values({
        userId: ctx.user.id,
        totalXp: 0,
        currentLevel: 1,
        levelTitle: "Beginner",
        currentStreak: 0,
        longestStreak: 0,
      });
      return { totalXp: 0, level: 1, xpForNextLevel: 100, currentLevelXp: 0 };
    }
    
    // Calculate XP for next level (100 * level)
    const xpForNextLevel = 100 * (xp.currentLevel + 1);
    const currentLevelXp = xp.totalXp - (100 * xp.currentLevel * (xp.currentLevel - 1) / 2);
    
    return {
      totalXp: xp.totalXp,
      level: xp.currentLevel,
      xpForNextLevel,
      currentLevelXp: Math.max(0, currentLevelXp),
    };
  }),

  // Get learner's coaching plans,
});
