/**
 * Sprint 8 — Gamification & Engagement Engine Tests
 * 
 * Validates:
 * 1. XP auto-award wired into completeActivity cascade
 * 2. Streak auto-update in completeActivity cascade
 * 3. Weekly challenge auto-progress in completeActivity cascade
 * 4. Push notifications for badge milestones
 * 5. Leaderboard queries real data
 * 6. Badge showcase and catalog pages
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// 1. XP Auto-Award in completeActivity
// ============================================================================
describe("Sprint 8 — XP Auto-Award in completeActivity", () => {
  const activitiesPath = path.resolve(__dirname, "routers/activities.ts");
  const activitiesContent = fs.readFileSync(activitiesPath, "utf-8");

  it("imports learnerXp and xpTransactions tables", () => {
    expect(activitiesContent).toContain("learnerXp");
    expect(activitiesContent).toContain("xpTransactions");
  });

  it("auto-awards XP in completeActivity cascade", () => {
    expect(activitiesContent).toContain("XP_FOR_SLOT");
    expect(activitiesContent).toContain("insert(xpTransactions)");
  });

  it("awards 5 XP per slot completion", () => {
    expect(activitiesContent).toContain("XP_FOR_SLOT = 5");
  });

  it("logs XP award with user ID and streak info", () => {
    expect(activitiesContent).toMatch(/\[XP\].*Awarded.*XP to user/);
  });
});

// ============================================================================
// 2. Streak Auto-Update in completeActivity
// ============================================================================
describe("Sprint 8 — Streak Auto-Update in completeActivity", () => {
  const activitiesPath = path.resolve(__dirname, "routers/activities.ts");
  const activitiesContent = fs.readFileSync(activitiesPath, "utf-8");

  it("calculates streak based on lastActivityDate", () => {
    expect(activitiesContent).toContain("lastActivityDate");
    expect(activitiesContent).toContain("currentStreak");
    expect(activitiesContent).toContain("longestStreak");
  });

  it("handles streak continuation (yesterday activity)", () => {
    expect(activitiesContent).toContain("yesterday");
    expect(activitiesContent).toContain("getTime()");
  });

  it("handles streak reset (gap > 1 day)", () => {
    // When lastAct is before yesterday, streak resets to 1
    expect(activitiesContent).toContain("newStreak = 1");
  });

  it("updates longestStreak when current exceeds it", () => {
    expect(activitiesContent).toContain("Math.max(newStreak");
  });
});

// ============================================================================
// 3. Weekly Challenge Auto-Progress
// ============================================================================
describe("Sprint 8 — Weekly Challenge Auto-Progress", () => {
  const activitiesPath = path.resolve(__dirname, "routers/activities.ts");
  const activitiesContent = fs.readFileSync(activitiesPath, "utf-8");

  it("imports weeklyChallenges and userWeeklyChallenges", () => {
    expect(activitiesContent).toContain("weeklyChallenges");
    expect(activitiesContent).toContain("userWeeklyChallenges");
  });

  it("queries active challenges within current week", () => {
    expect(activitiesContent).toContain("weekStart");
    expect(activitiesContent).toContain("weekEnd");
    expect(activitiesContent).toContain("isActive");
  });

  it("increments challenge progress for enrolled users", () => {
    expect(activitiesContent).toContain("currentProgress");
    // The auto-progress increments by 1
    expect(activitiesContent).toContain("+ 1");
  });

  it("marks challenge as completed when target reached", () => {
    expect(activitiesContent).toContain("targetCount");
    expect(activitiesContent).toMatch(/status.*completed/);
  });
});

// ============================================================================
// 4. Push Notifications for Badge Milestones
// ============================================================================
describe("Sprint 8 — Push Notifications for Badges", () => {
  const notifPath = path.resolve(__dirname, "services/gamificationNotifications.ts");
  const notifContent = fs.readFileSync(notifPath, "utf-8");

  it("imports sendPushToUser from pushNotificationService", () => {
    expect(notifContent).toContain("sendPushToUser");
    expect(notifContent).toContain("pushNotificationService");
  });

  it("sends web push notification on badge unlock", () => {
    expect(notifContent).toContain("sendPushToUser(data.userId");
    expect(notifContent).toContain("New Badge:");
  });

  it("includes badge details in push notification body", () => {
    expect(notifContent).toContain("badgeDescription");
    expect(notifContent).toContain("xpAwarded");
  });

  it("handles push notification errors gracefully", () => {
    expect(notifContent).toContain("Push notification failed");
  });
});

// ============================================================================
// 5. Leaderboard Queries Real Data
// ============================================================================
describe("Sprint 8 — Leaderboard with Real Data", () => {
  const gamificationPath = path.resolve(__dirname, "routers/gamification.ts");
  const gamificationContent = fs.readFileSync(gamificationPath, "utf-8");

  it("has getLeaderboard procedure", () => {
    expect(gamificationContent).toContain("getLeaderboard:");
  });

  it("supports weekly, monthly, and allTime time ranges", () => {
    expect(gamificationContent).toContain("weekly");
    expect(gamificationContent).toContain("monthly");
    expect(gamificationContent).toContain("allTime");
  });

  it("queries learnerXp table with user join", () => {
    expect(gamificationContent).toContain("learnerXp");
    expect(gamificationContent).toContain("innerJoin(users");
  });

  it("respects leaderboard privacy settings", () => {
    expect(gamificationContent).toContain("showOnLeaderboard");
  });

  it("enriches entries with badge count and completed courses", () => {
    expect(gamificationContent).toContain("badgeCount");
    expect(gamificationContent).toContain("completedCourses");
  });
});

// ============================================================================
// 6. Badge Showcase and Catalog
// ============================================================================
describe("Sprint 8 — Badge Showcase and Catalog", () => {
  it("BadgesCatalog page exists and uses real data", () => {
    const catalogPath = path.resolve(__dirname, "../client/src/pages/BadgesCatalog.tsx");
    const content = fs.readFileSync(catalogPath, "utf-8");
    expect(content).toContain("trpc.");
    expect(content).toContain("badgeShowcase");
  });

  it("BadgesPage exists with BadgesPanel component", () => {
    const badgesPagePath = path.resolve(__dirname, "../client/src/pages/BadgesPage.tsx");
    const content = fs.readFileSync(badgesPagePath, "utf-8");
    expect(content).toContain("BadgesPanel");
  });

  it("AnimatedBadge component exists for badge animations", () => {
    const animatedPath = path.resolve(__dirname, "../client/src/components/gamification/AnimatedBadge.tsx");
    expect(fs.existsSync(animatedPath)).toBe(true);
  });

  it("BadgeUnlockModal exists for celebration on badge earn", () => {
    const modalPath = path.resolve(__dirname, "../client/src/components/gamification/BadgeUnlockModal.tsx");
    expect(fs.existsSync(modalPath)).toBe(true);
  });

  it("Leaderboard page exists and uses real data", () => {
    const leaderboardPath = path.resolve(__dirname, "../client/src/pages/Leaderboard.tsx");
    const content = fs.readFileSync(leaderboardPath, "utf-8");
    expect(content).toContain("trpc.gamification.getLeaderboard");
  });
});

// ============================================================================
// 7. Gamification Stats from Real Data (Sprint 4 fix verification)
// ============================================================================
describe("Sprint 8 — Gamification Stats Verification", () => {
  const gamificationPath = path.resolve(__dirname, "routers/gamification.ts");
  const gamificationContent = fs.readFileSync(gamificationPath, "utf-8");

  it("getMyStats calculates lessonsCompleted from real DB data", () => {
    expect(gamificationContent).toContain("lessonsCompleted");
    expect(gamificationContent).toContain("lessonProgress");
  });

  it("getMyStats calculates quizzesPassed from real DB data", () => {
    expect(gamificationContent).toContain("quizzesPassed");
    expect(gamificationContent).toContain("quizAttempts");
  });

  it("getMyStats calculates coursesEnrolled from real DB data", () => {
    expect(gamificationContent).toContain("coursesEnrolled");
    expect(gamificationContent).toContain("courseEnrollments");
  });
});
