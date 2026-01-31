import { useCallback } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { trpc } from "@/lib/trpc";

/**
 * Custom hook for triggering gamification actions
 * Provides methods to award XP, unlock badges, and trigger celebrations
 */
export function useGamificationActions() {
  const { showXPGain, showLevelUp, showBadgeUnlock } = useGamification();
  const utils = trpc.useUtils();

  // Award XP and show notification
  const awardXP = useCallback(
    async (amount: number, reason?: string, options?: { silent?: boolean }) => {
      // Show notification unless silent
      if (!options?.silent) {
        showXPGain(amount, reason);
      }

      // Invalidate XP queries to refresh data
      await utils.learner.getMyXp.invalidate();
    },
    [showXPGain, utils]
  );

  // Trigger level up celebration
  const celebrateLevelUp = useCallback(
    (newLevel: number) => {
      showLevelUp(newLevel);
    },
    [showLevelUp]
  );

  // Unlock a badge and show modal
  const unlockBadge = useCallback(
    async (badge: {
      code: string;
      name: string;
      nameFr?: string;
      description?: string;
      descriptionFr?: string;
      points: number;
      rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
    }) => {
      showBadgeUnlock(badge);

      // Invalidate badges query to refresh data
      await utils.learner.getMyBadges.invalidate();
    },
    [showBadgeUnlock, utils]
  );

  // Combined action for completing a lesson
  const completeLessonAction = useCallback(
    async (xpAmount: number, lessonTitle: string) => {
      await awardXP(xpAmount, `Completed: ${lessonTitle}`);
    },
    [awardXP]
  );

  // Combined action for completing a quiz
  const completeQuizAction = useCallback(
    async (xpAmount: number, score: number, quizTitle: string) => {
      const reason = score >= 80 
        ? `🎯 Perfect score on ${quizTitle}!` 
        : `Completed ${quizTitle}`;
      await awardXP(xpAmount, reason);
    },
    [awardXP]
  );

  // Combined action for maintaining streak
  const maintainStreakAction = useCallback(
    async (streakDays: number) => {
      const milestones = [7, 14, 30, 60, 90, 180, 365];
      if (milestones.includes(streakDays)) {
        const xpBonus = streakDays * 10;
        await awardXP(xpBonus, `🔥 ${streakDays}-day streak milestone!`);
      }
    },
    [awardXP]
  );

  return {
    awardXP,
    celebrateLevelUp,
    unlockBadge,
    completeLessonAction,
    completeQuizAction,
    maintainStreakAction,
  };
}

export default useGamificationActions;
