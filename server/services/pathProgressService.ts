/**
 * Path Progress Service
 * 
 * Updates path enrollment progress when course enrollment progress changes.
 * Called from the enrollment cascade in lessons.markComplete and courses.updateProgress.
 * 
 * Flow: lesson complete → enrollment update → path enrollment update
 */
import { getDb } from "../db";
import { eq, and, sql } from "drizzle-orm";
import {
  pathCourses,
  pathEnrollments,
  courseEnrollments,
} from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("pathProgressService");

/**
 * Update path enrollment progress based on course enrollment status.
 * 
 * Called after a course enrollment is updated (e.g., when a lesson is completed).
 * Checks if the course belongs to a path, and if so, recalculates path progress.
 */
export async function updatePathProgress(userId: number, courseId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // 1. Find which paths this course belongs to
    const pathCourseRows = await db.select({
      pathId: pathCourses.pathId,
    })
      .from(pathCourses)
      .where(eq(pathCourses.courseId, courseId));

    if (pathCourseRows.length === 0) return; // Course not in any path

    for (const pc of pathCourseRows) {
      // 2. Check if user has a path enrollment
      const [pathEnrollment] = await db.select()
        .from(pathEnrollments)
        .where(and(
          eq(pathEnrollments.userId, userId),
          eq(pathEnrollments.pathId, pc.pathId)
        ))
        .limit(1);

      if (!pathEnrollment) continue; // User not enrolled in this path

      // 3. Get all courses in this path
      const allPathCourses = await db.select({
        courseId: pathCourses.courseId,
        isRequired: pathCourses.isRequired,
      })
        .from(pathCourses)
        .where(eq(pathCourses.pathId, pc.pathId));

      const requiredCourseIds = allPathCourses
        .filter(c => c.isRequired !== false)
        .map(c => c.courseId);

      if (requiredCourseIds.length === 0) continue;

      // 4. Get user's enrollment progress for each required course
      const courseEnrollmentRows = await db.select({
        courseId: courseEnrollments.courseId,
        progressPercent: courseEnrollments.progressPercent,
        status: courseEnrollments.status,
      })
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, userId),
        ));

      const courseProgressMap = new Map<number, { percent: number; status: string }>();
      courseEnrollmentRows.forEach(ce => {
        courseProgressMap.set(ce.courseId, {
          percent: ce.progressPercent || 0,
          status: ce.status || "active",
        });
      });

      // 5. Calculate path progress
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
      const now = new Date();

      // 6. Update path enrollment
      await db.update(pathEnrollments)
        .set({
          progressPercentage: String(Math.min(pathProgressPercent, 100)),
          completedCourses: completedCourseIds,
          status: allComplete ? "completed" : "active",
          completedAt: allComplete ? now : null,
        })
        .where(eq(pathEnrollments.id, pathEnrollment.id));

      log.info(`[PathProgress] Updated path ${pc.pathId} for user ${userId}: ${pathProgressPercent}% (${completedCourses}/${requiredCourseIds.length} courses)`);
    }
  } catch (error) {
    log.error("[PathProgress] Error updating path progress:", error);
    // Don't throw - path progress update should not block lesson completion
  }
}
