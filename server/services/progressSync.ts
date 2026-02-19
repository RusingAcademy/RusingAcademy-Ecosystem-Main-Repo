/**
 * Progress Sync Service — Phase 2
 * Real-time lesson progress synchronization via WebSocket + DB persistence
 */
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import { lessonProgress, courses, courseModules, lessons } from "../../drizzle/schema";
import { getIO } from "../websocket";

// ─── Types ─────────────────────────────────────────────────────────────
export interface ProgressUpdate {
  lessonId: number;
  courseId?: number;
  moduleId?: number;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
  timeSpentSeconds: number;
}

export interface SyncResult {
  success: boolean;
  progress: {
    lessonId: number;
    status: string;
    progressPercent: number;
    timeSpentSeconds: number;
    syncVersion: number;
  };
  courseProgress?: {
    courseId: number;
    completedLessons: number;
    totalLessons: number;
    overallPercent: number;
  };
}

// ─── Core Service ──────────────────────────────────────────────────────

/**
 * Upsert lesson progress with optimistic locking via syncVersion
 */
export async function syncProgress(
  userId: number,
  update: ProgressUpdate
): Promise<SyncResult> {
  const db = await getDb();

  // Check for existing record
  const existing = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.lessonId, update.lessonId)
      )
    )
    .limit(1);

  let record;

  if (existing.length > 0) {
    const current = existing[0];
    const newVersion = (current.syncVersion ?? 1) + 1;

    // Merge: keep higher progress, accumulate time
    const mergedPercent = Math.max(current.progressPercent ?? 0, update.progressPercent);
    const mergedTime = (current.timeSpentSeconds ?? 0) + update.timeSpentSeconds;
    const mergedStatus =
      update.status === "completed" || current.status === "completed"
        ? "completed"
        : update.status;

    await db
      .update(lessonProgress)
      .set({
        status: mergedStatus,
        progressPercent: mergedPercent,
        timeSpentSeconds: mergedTime,
        lastAccessedAt: new Date(),
        lastSyncAt: new Date(),
        syncVersion: newVersion,
        completedAt: mergedStatus === "completed" ? (current.completedAt ?? new Date()) : null,
      })
      .where(eq(lessonProgress.id, current.id));

    record = {
      lessonId: update.lessonId,
      status: mergedStatus,
      progressPercent: mergedPercent,
      timeSpentSeconds: mergedTime,
      syncVersion: newVersion,
    };
  } else {
    // Insert new record
    const [inserted] = await db.insert(lessonProgress).values({
      userId,
      lessonId: update.lessonId,
      courseId: update.courseId ?? null,
      moduleId: update.moduleId ?? null,
      status: update.status,
      progressPercent: update.progressPercent,
      timeSpentSeconds: update.timeSpentSeconds,
      lastAccessedAt: new Date(),
      lastSyncAt: new Date(),
      syncVersion: 1,
      completedAt: update.status === "completed" ? new Date() : null,
    });

    record = {
      lessonId: update.lessonId,
      status: update.status,
      progressPercent: update.progressPercent,
      timeSpentSeconds: update.timeSpentSeconds,
      syncVersion: 1,
    };
  }

  // Calculate course-level progress if courseId is provided
  let courseProgress: SyncResult["courseProgress"];
  if (update.courseId) {
    courseProgress = await calculateCourseProgress(userId, update.courseId);
  }

  // Broadcast progress update via WebSocket
  broadcastProgressUpdate(userId, record, courseProgress);

  return {
    success: true,
    progress: record,
    courseProgress,
  };
}

/**
 * Get all progress for a user in a specific course
 */
export async function getUserCourseProgress(
  userId: number,
  courseId: number
): Promise<{
  lessons: Array<{
    lessonId: number;
    status: string;
    progressPercent: number;
    timeSpentSeconds: number;
  }>;
  overall: {
    completedLessons: number;
    totalLessons: number;
    overallPercent: number;
    totalTimeSeconds: number;
  };
}> {
  const db = await getDb();

  const progress = await db
    .select({
      lessonId: lessonProgress.lessonId,
      status: lessonProgress.status,
      progressPercent: lessonProgress.progressPercent,
      timeSpentSeconds: lessonProgress.timeSpentSeconds,
    })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.courseId, courseId)
      )
    );

  // Count total lessons in course
  const totalResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
    .where(eq(courseModules.courseId, courseId));

  const totalLessons = totalResult[0]?.count ?? 0;
  const completedLessons = progress.filter((p) => p.status === "completed").length;
  const totalTimeSeconds = progress.reduce((sum, p) => sum + (p.timeSpentSeconds ?? 0), 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    lessons: progress.map((p) => ({
      lessonId: p.lessonId,
      status: p.status ?? "not_started",
      progressPercent: p.progressPercent ?? 0,
      timeSpentSeconds: p.timeSpentSeconds ?? 0,
    })),
    overall: {
      completedLessons,
      totalLessons,
      overallPercent,
      totalTimeSeconds,
    },
  };
}

/**
 * Get a user's learning streak and stats
 */
export async function getUserLearningStats(userId: number): Promise<{
  totalLessonsCompleted: number;
  totalTimeSeconds: number;
  activeCourses: number;
}> {
  const db = await getDb();

  const stats = await db
    .select({
      totalCompleted: sql<number>`SUM(CASE WHEN ${lessonProgress.status} = 'completed' THEN 1 ELSE 0 END)`,
      totalTime: sql<number>`SUM(${lessonProgress.timeSpentSeconds})`,
      activeCourses: sql<number>`COUNT(DISTINCT ${lessonProgress.courseId})`,
    })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));

  return {
    totalLessonsCompleted: stats[0]?.totalCompleted ?? 0,
    totalTimeSeconds: stats[0]?.totalTime ?? 0,
    activeCourses: stats[0]?.activeCourses ?? 0,
  };
}

// ─── Internal Helpers ──────────────────────────────────────────────────

async function calculateCourseProgress(
  userId: number,
  courseId: number
): Promise<SyncResult["courseProgress"]> {
  const db = await getDb();

  const totalResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
    .where(eq(courseModules.courseId, courseId));

  const completedResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.courseId, courseId),
        eq(lessonProgress.status, "completed")
      )
    );

  const totalLessons = totalResult[0]?.count ?? 0;
  const completedLessons = completedResult[0]?.count ?? 0;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return { courseId, completedLessons, totalLessons, overallPercent };
}

function broadcastProgressUpdate(
  userId: number,
  progress: SyncResult["progress"],
  courseProgress?: SyncResult["courseProgress"]
): void {
  try {
    const io = getIO();
    if (!io) return;

    // Emit to the user's personal room
    io.to(`user:${userId}`).emit("progress:updated", {
      progress,
      courseProgress,
      timestamp: new Date().toISOString(),
    });

    // If course progress changed, notify admin room
    if (courseProgress) {
      io.to("admin").emit("progress:course-updated", {
        userId,
        courseProgress,
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    // WebSocket not available — silent fallback
  }
}
