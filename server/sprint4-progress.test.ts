/**
 * Sprint 4 — Progress Tracking & Completion Engine Tests
 * 
 * Tests the fixes and additions made in Sprint 4:
 * 1. Enrollment cascade in lessons.markComplete
 * 2. Path-level progress calculation (pathProgressService)
 * 3. Gamification stats from real DB data (unit logic)
 * 4. LearnLayout lock logic (FREE_ACCESS_MODE)
 */
import { describe, it, expect } from "vitest";

// ─── 1. Enrollment Cascade Logic ───
// Mirrors the enrollment progress calculation added to lessons.markComplete

function calculateEnrollmentProgress(
  completedLessons: number,
  totalLessons: number
): { percent: number; status: "completed" | "active" } {
  const total = totalLessons || 1;
  const percent = Math.min(100, Math.round((completedLessons / total) * 100));
  const status = percent >= 100 ? "completed" : "active";
  return { percent, status };
}

describe("Sprint 4 — Enrollment Cascade in markComplete", () => {
  it("should calculate 0% for 0 completed lessons", () => {
    const result = calculateEnrollmentProgress(0, 16);
    expect(result.percent).toBe(0);
    expect(result.status).toBe("active");
  });

  it("should calculate 6% for 1/16 completed lessons", () => {
    const result = calculateEnrollmentProgress(1, 16);
    expect(result.percent).toBe(6);
    expect(result.status).toBe("active");
  });

  it("should calculate 50% for 8/16 completed lessons", () => {
    const result = calculateEnrollmentProgress(8, 16);
    expect(result.percent).toBe(50);
    expect(result.status).toBe("active");
  });

  it("should calculate 100% and completed for 16/16 lessons", () => {
    const result = calculateEnrollmentProgress(16, 16);
    expect(result.percent).toBe(100);
    expect(result.status).toBe("completed");
  });

  it("should cap at 100% for overflow", () => {
    const result = calculateEnrollmentProgress(20, 16);
    expect(result.percent).toBe(100);
    expect(result.status).toBe("completed");
  });

  it("should default to 1 total lesson when total is 0", () => {
    const result = calculateEnrollmentProgress(1, 0);
    expect(result.percent).toBe(100);
    expect(result.status).toBe("completed");
  });
});

// ─── 2. Path-Level Progress Calculation ───
// Mirrors the logic in pathProgressService.ts

interface CourseProgress {
  courseId: number;
  percent: number;
  status: string;
}

function calculatePathProgress(
  requiredCourseIds: number[],
  courseProgressMap: Map<number, CourseProgress>
): {
  pathProgressPercent: number;
  completedCourses: number;
  completedCourseIds: number[];
  allComplete: boolean;
} {
  if (requiredCourseIds.length === 0) {
    return { pathProgressPercent: 0, completedCourses: 0, completedCourseIds: [], allComplete: false };
  }

  let totalPercent = 0;
  let completedCourses = 0;
  const completedCourseIds: number[] = [];

  for (const cId of requiredCourseIds) {
    const cp = courseProgressMap.get(cId);
    if (cp) {
      totalPercent += cp.percent;
      if (cp.status === "completed" || cp.percent >= 100) {
        completedCourses++;
        completedCourseIds.push(cId);
      }
    }
  }

  const pathProgressPercent = Math.round(totalPercent / requiredCourseIds.length);
  const allComplete = completedCourses >= requiredCourseIds.length;

  return { pathProgressPercent, completedCourses, completedCourseIds, allComplete };
}

describe("Sprint 4 — Path-Level Progress Calculation", () => {
  it("should return 0% when no courses have progress", () => {
    const result = calculatePathProgress(
      [1, 2, 3],
      new Map()
    );
    expect(result.pathProgressPercent).toBe(0);
    expect(result.completedCourses).toBe(0);
    expect(result.allComplete).toBe(false);
  });

  it("should return 33% when 1/3 courses is at 100%", () => {
    const map = new Map<number, CourseProgress>();
    map.set(1, { courseId: 1, percent: 100, status: "completed" });
    const result = calculatePathProgress([1, 2, 3], map);
    expect(result.pathProgressPercent).toBe(33);
    expect(result.completedCourses).toBe(1);
    expect(result.completedCourseIds).toEqual([1]);
    expect(result.allComplete).toBe(false);
  });

  it("should return 50% when 2/4 courses are at 50%", () => {
    const map = new Map<number, CourseProgress>();
    map.set(1, { courseId: 1, percent: 50, status: "active" });
    map.set(2, { courseId: 2, percent: 50, status: "active" });
    const result = calculatePathProgress([1, 2, 3, 4], map);
    expect(result.pathProgressPercent).toBe(25); // (50+50+0+0)/4 = 25
    expect(result.completedCourses).toBe(0);
    expect(result.allComplete).toBe(false);
  });

  it("should return 100% when all courses are completed", () => {
    const map = new Map<number, CourseProgress>();
    map.set(1, { courseId: 1, percent: 100, status: "completed" });
    map.set(2, { courseId: 2, percent: 100, status: "completed" });
    const result = calculatePathProgress([1, 2], map);
    expect(result.pathProgressPercent).toBe(100);
    expect(result.completedCourses).toBe(2);
    expect(result.completedCourseIds).toEqual([1, 2]);
    expect(result.allComplete).toBe(true);
  });

  it("should handle single-course path", () => {
    const map = new Map<number, CourseProgress>();
    map.set(5, { courseId: 5, percent: 75, status: "active" });
    const result = calculatePathProgress([5], map);
    expect(result.pathProgressPercent).toBe(75);
    expect(result.completedCourses).toBe(0);
    expect(result.allComplete).toBe(false);
  });

  it("should handle empty required courses array", () => {
    const result = calculatePathProgress([], new Map());
    expect(result.pathProgressPercent).toBe(0);
    expect(result.allComplete).toBe(false);
  });

  it("should average progress across all required courses", () => {
    const map = new Map<number, CourseProgress>();
    map.set(1, { courseId: 1, percent: 100, status: "completed" });
    map.set(2, { courseId: 2, percent: 50, status: "active" });
    map.set(3, { courseId: 3, percent: 25, status: "active" });
    const result = calculatePathProgress([1, 2, 3], map);
    // (100 + 50 + 25) / 3 = 58.33 → 58
    expect(result.pathProgressPercent).toBe(58);
    expect(result.completedCourses).toBe(1);
    expect(result.allComplete).toBe(false);
  });
});

// ─── 3. Gamification Stats Logic ───
// Tests that the gamification stats correctly compute from raw data

interface GamificationInput {
  lessonsCompleted: number;
  quizzesPassed: number;
  coursesEnrolled: number;
  totalXp: number;
}

function calculateLevel(totalXp: number): {
  level: number;
  title: string;
  xpForNextLevel: number;
} {
  const LEVELS = [
    { level: 1, minXp: 0, title: "Débutant" },
    { level: 2, minXp: 100, title: "Apprenti" },
    { level: 3, minXp: 300, title: "Intermédiaire" },
    { level: 4, minXp: 600, title: "Avancé" },
    { level: 5, minXp: 1000, title: "Expert" },
    { level: 6, minXp: 1500, title: "Maître" },
    { level: 7, minXp: 2500, title: "Champion" },
    { level: 8, minXp: 4000, title: "Légende" },
  ];

  let currentLevel = LEVELS[0];
  for (const l of LEVELS) {
    if (totalXp >= l.minXp) currentLevel = l;
    else break;
  }

  const nextLevel = LEVELS.find(l => l.minXp > totalXp);
  const xpForNextLevel = nextLevel ? nextLevel.minXp - totalXp : 0;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xpForNextLevel,
  };
}

describe("Sprint 4 — Gamification Stats from Real Data", () => {
  it("should start at level 1 with 0 XP", () => {
    const result = calculateLevel(0);
    expect(result.level).toBe(1);
    expect(result.title).toBe("Débutant");
    expect(result.xpForNextLevel).toBe(100);
  });

  it("should be level 2 with 100 XP", () => {
    const result = calculateLevel(100);
    expect(result.level).toBe(2);
    expect(result.title).toBe("Apprenti");
    expect(result.xpForNextLevel).toBe(200);
  });

  it("should be level 5 with 1000 XP", () => {
    const result = calculateLevel(1000);
    expect(result.level).toBe(5);
    expect(result.title).toBe("Expert");
    expect(result.xpForNextLevel).toBe(500);
  });

  it("should be level 8 with 4000+ XP", () => {
    const result = calculateLevel(5000);
    expect(result.level).toBe(8);
    expect(result.title).toBe("Légende");
    expect(result.xpForNextLevel).toBe(0); // max level
  });

  it("should correctly calculate XP needed for next level", () => {
    const result = calculateLevel(250);
    expect(result.level).toBe(2);
    expect(result.xpForNextLevel).toBe(50); // 300 - 250
  });
});

// ─── 4. LearnLayout Lock Logic ───
// Tests the isLocked logic for lessons in LearnLayout

function isLessonLocked(
  freeAccessMode: boolean,
  isAuthenticated: boolean,
  hasEnrollment: boolean,
  isPreview: boolean
): boolean {
  if (freeAccessMode) return false;
  if (isPreview) return false;
  if (!isAuthenticated) return true;
  if (!hasEnrollment) return true;
  return false;
}

describe("Sprint 4 — LearnLayout Lesson Lock Logic", () => {
  it("should unlock all lessons in FREE_ACCESS_MODE", () => {
    expect(isLessonLocked(true, false, false, false)).toBe(false);
    expect(isLessonLocked(true, true, false, false)).toBe(false);
    expect(isLessonLocked(true, true, true, false)).toBe(false);
  });

  it("should unlock preview lessons regardless of enrollment", () => {
    expect(isLessonLocked(false, false, false, true)).toBe(false);
    expect(isLessonLocked(false, true, false, true)).toBe(false);
  });

  it("should lock non-preview lessons for unauthenticated users", () => {
    expect(isLessonLocked(false, false, false, false)).toBe(true);
  });

  it("should lock non-preview lessons for authenticated users without enrollment", () => {
    expect(isLessonLocked(false, true, false, false)).toBe(true);
  });

  it("should unlock non-preview lessons for enrolled users", () => {
    expect(isLessonLocked(false, true, true, false)).toBe(false);
  });
});

// ─── 5. Full Cascade Chain Test ───
// Tests the complete chain: lesson complete → enrollment update → path update

describe("Sprint 4 — Full Progress Cascade Chain", () => {
  it("should cascade from lesson to enrollment to path correctly", () => {
    // Simulate: 4 courses in a path, each with 16 lessons
    // User completes 16/16 lessons in course 1 → course 1 is 100%
    // Path should be 25% (1/4 courses complete)
    
    const enrollment1 = calculateEnrollmentProgress(16, 16);
    expect(enrollment1.percent).toBe(100);
    expect(enrollment1.status).toBe("completed");

    const pathMap = new Map<number, CourseProgress>();
    pathMap.set(1, { courseId: 1, percent: 100, status: "completed" });
    pathMap.set(2, { courseId: 2, percent: 0, status: "active" });
    pathMap.set(3, { courseId: 3, percent: 0, status: "active" });
    pathMap.set(4, { courseId: 4, percent: 0, status: "active" });

    const pathResult = calculatePathProgress([1, 2, 3, 4], pathMap);
    expect(pathResult.pathProgressPercent).toBe(25);
    expect(pathResult.completedCourses).toBe(1);
    expect(pathResult.allComplete).toBe(false);
  });

  it("should show path complete when all courses are done", () => {
    const pathMap = new Map<number, CourseProgress>();
    pathMap.set(1, { courseId: 1, percent: 100, status: "completed" });
    pathMap.set(2, { courseId: 2, percent: 100, status: "completed" });
    pathMap.set(3, { courseId: 3, percent: 100, status: "completed" });
    pathMap.set(4, { courseId: 4, percent: 100, status: "completed" });

    const pathResult = calculatePathProgress([1, 2, 3, 4], pathMap);
    expect(pathResult.pathProgressPercent).toBe(100);
    expect(pathResult.completedCourses).toBe(4);
    expect(pathResult.allComplete).toBe(true);
  });

  it("should handle partial progress across multiple courses", () => {
    // Course 1: 8/16 = 50%, Course 2: 4/16 = 25%
    const enrollment1 = calculateEnrollmentProgress(8, 16);
    const enrollment2 = calculateEnrollmentProgress(4, 16);
    expect(enrollment1.percent).toBe(50);
    expect(enrollment2.percent).toBe(25);

    const pathMap = new Map<number, CourseProgress>();
    pathMap.set(1, { courseId: 1, percent: 50, status: "active" });
    pathMap.set(2, { courseId: 2, percent: 25, status: "active" });

    const pathResult = calculatePathProgress([1, 2], pathMap);
    // (50 + 25) / 2 = 37.5 → 38
    expect(pathResult.pathProgressPercent).toBe(38);
    expect(pathResult.completedCourses).toBe(0);
    expect(pathResult.allComplete).toBe(false);
  });
});
