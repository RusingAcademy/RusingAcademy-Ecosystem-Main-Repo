import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { TRPCError } from "@trpc/server";
import { 
  courseEnrollments, 
  pathEnrollments, 
  courses, 
  users, 
  learnerBadges, 
  learnerXp,
  learningPaths,
  activities 
} from "../../drizzle/schema";
import { eq, desc, sql, count, and } from "drizzle-orm";
import { z } from "zod";
import { createLogger } from "../logger";
const log = createLogger("routers-adminDashboardData");

export const adminDashboardDataRouter = router({
  // Get all enrollments for admin view
  getEnrollments: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { enrollments: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } };

      try {
        // Get course enrollments with user and course info
        const courseEnrollmentRows = await db.select({
          id: courseEnrollments.id,
          userId: courseEnrollments.userId,
          userName: users.name,
          userEmail: users.email,
          courseId: courseEnrollments.courseId,
          courseName: courses.title,
          status: courseEnrollments.status,
          progressPercent: courseEnrollments.progressPercent,
          enrolledAt: courseEnrollments.enrolledAt,
          completedAt: courseEnrollments.completedAt,
        })
        .from(courseEnrollments)
        .leftJoin(users, eq(courseEnrollments.userId, users.id))
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .orderBy(desc(courseEnrollments.enrolledAt))
        .limit(500);

        // Get path enrollments with user and path info
        const pathEnrollmentRows = await db.select({
          id: pathEnrollments.id,
          userId: pathEnrollments.userId,
          userName: users.name,
          userEmail: users.email,
          pathId: pathEnrollments.pathId,
          courseName: learningPaths.titleEn,
          status: pathEnrollments.status,
          progressPercent: pathEnrollments.progressPercentage,
          enrolledAt: pathEnrollments.enrolledAt,
          completedAt: pathEnrollments.completedAt,
        })
        .from(pathEnrollments)
        .leftJoin(users, eq(pathEnrollments.userId, users.id))
        .leftJoin(learningPaths, eq(pathEnrollments.pathId, learningPaths.id))
        .orderBy(desc(pathEnrollments.enrolledAt))
        .limit(500);

        // Merge and sort
        const allEnrollments = [
          ...courseEnrollmentRows.map(e => ({ ...e, type: "course" as const })),
          ...pathEnrollmentRows.map(e => ({ ...e, type: "path" as const })),
        ].sort((a, b) => {
          const dateA = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
          const dateB = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
          return dateB - dateA;
        });

        // Calculate stats
        const stats = {
          total: allEnrollments.length,
          active: allEnrollments.filter(e => e.status === "active").length,
          completed: allEnrollments.filter(e => e.status === "completed").length,
          paused: allEnrollments.filter(e => e.status === "paused").length,
        };

        return { enrollments: allEnrollments, stats };
      } catch (error) {
        log.error("[Admin Enrollments] Error:", error);
        return { enrollments: [], stats: { total: 0, active: 0, completed: 0, paused: 0 } };
      }
    }),

  // Get gamification stats for admin view
  getGamificationStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return {
        totalBadgesEarned: 0,
        totalXpAwarded: 0,
        activeLearners: 0,
        avgLevel: 0,
        topBadges: [],
        recentAwards: [],
        leaderboard: [],
      };

      try {
        // Total badges earned
        const [badgeCount] = await db.select({ count: count() }).from(learnerBadges);
        const totalBadgesEarned = badgeCount?.count ?? 0;

        // Total XP awarded
        const [xpSum] = await db.select({ 
          total: sql<number>`COALESCE(SUM(${learnerXp.totalXp}), 0)` 
        }).from(learnerXp);
        const totalXpAwarded = Number(xpSum?.total ?? 0);

        // Active learners (have XP)
        const [activeCount] = await db.select({ count: count() }).from(learnerXp);
        const activeLearners = activeCount?.count ?? 0;

        // Average level
        const [avgLevelResult] = await db.select({ 
          avg: sql<number>`COALESCE(AVG(${learnerXp.currentLevel}), 1)` 
        }).from(learnerXp);
        const avgLevel = Math.round(Number(avgLevelResult?.avg ?? 1));

        // Top badges (most earned)
        const topBadges = await db.select({
          type: learnerBadges.badgeType,
          count: count(),
        })
        .from(learnerBadges)
        .groupBy(learnerBadges.badgeType)
        .orderBy(desc(count()))
        .limit(9);

        const topBadgesFormatted = topBadges.map(b => ({
          type: b.type,
          name: String(b.type).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          count: b.count,
          tier: "bronze",
        }));

        // Recent badge awards
        const recentAwards = await db.select({
          id: learnerBadges.id,
          badgeType: learnerBadges.badgeType,
          userId: learnerBadges.userId,
          userName: users.name,
          earnedAt: learnerBadges.earnedAt,
        })
        .from(learnerBadges)
        .leftJoin(users, eq(learnerBadges.userId, users.id))
        .orderBy(desc(learnerBadges.earnedAt))
        .limit(20);

        const recentAwardsFormatted = recentAwards.map(a => ({
          id: a.id,
          badgeName: String(a.badgeType).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          userName: a.userName || "Unknown",
          earnedAt: a.earnedAt,
          tier: "bronze",
        }));

        // XP Leaderboard
        const leaderboard = await db.select({
          userId: learnerXp.userId,
          name: users.name,
          email: users.email,
          totalXp: learnerXp.totalXp,
          level: learnerXp.currentLevel,
        })
        .from(learnerXp)
        .leftJoin(users, eq(learnerXp.userId, users.id))
        .orderBy(desc(learnerXp.totalXp))
        .limit(20);

        // Count badges per user for leaderboard
        const leaderboardWithBadges = await Promise.all(
          leaderboard.map(async (l) => {
            const [bc] = await db.select({ count: count() })
              .from(learnerBadges)
              .where(eq(learnerBadges.userId, l.userId));
            return {
              ...l,
              totalXp: Number(l.totalXp ?? 0),
              level: Number(l.level ?? 1),
              levelTitle: "",
              badgeCount: bc?.count ?? 0,
            };
          })
        );

        return {
          totalBadgesEarned,
          totalXpAwarded,
          activeLearners,
          avgLevel,
          topBadges: topBadgesFormatted,
          recentAwards: recentAwardsFormatted,
          leaderboard: leaderboardWithBadges,
        };
      } catch (error) {
        log.error("[Admin Gamification] Error:", error);
        return {
          totalBadgesEarned: 0,
          totalXpAwarded: 0,
          activeLearners: 0,
          avgLevel: 0,
          topBadges: [],
          recentAwards: [],
          leaderboard: [],
        };
      }
    }),

  // Get media coverage metrics for admin dashboard
  getMediaCoverage: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return {
        totalActivities: 0,
        videoActivities: 0,
        audioActivities: 0,
        textActivities: 0,
        quizActivities: 0,
        otherActivities: 0,
        videoCoveragePercent: 0,
        audioCoveragePercent: 0,
        mediaCoveragePercent: 0,
        activitiesWithoutMedia: 0,
        byContentType: [],
      };

      try {
        // Count activities by content type
        const contentTypeCounts = await db.select({
          contentType: activities.contentType,
          count: count(),
        })
        .from(activities)
        .groupBy(activities.contentType);

        const totalActivities = contentTypeCounts.reduce((sum, c) => sum + c.count, 0);
        const videoActivities = contentTypeCounts.find(c => c.contentType === "video")?.count ?? 0;
        const audioActivities = contentTypeCounts.find(c => c.contentType === "audio")?.count ?? 0;
        const textActivities = contentTypeCounts.find(c => c.contentType === "text")?.count ?? 0;
        const quizActivities = contentTypeCounts.find(c => c.contentType === "quiz")?.count ?? 0;
        const otherActivities = totalActivities - videoActivities - audioActivities - textActivities - quizActivities;

        // Calculate coverage percentages
        const videoCoveragePercent = totalActivities > 0 ? Math.round((videoActivities / totalActivities) * 100) : 0;
        const audioCoveragePercent = totalActivities > 0 ? Math.round((audioActivities / totalActivities) * 100) : 0;
        const mediaCoveragePercent = totalActivities > 0 ? Math.round(((videoActivities + audioActivities) / totalActivities) * 100) : 0;
        const activitiesWithoutMedia = totalActivities - videoActivities - audioActivities;

        // Format by content type for chart
        const byContentType = contentTypeCounts.map(c => ({
          type: c.contentType || "unknown",
          count: c.count,
          percent: totalActivities > 0 ? Math.round((c.count / totalActivities) * 100) : 0,
        }));

        return {
          totalActivities,
          videoActivities,
          audioActivities,
          textActivities,
          quizActivities,
          otherActivities,
          videoCoveragePercent,
          audioCoveragePercent,
          mediaCoveragePercent,
          activitiesWithoutMedia,
          byContentType,
        };
      } catch (error) {
        log.error("[Admin Media Coverage] Error:", error);
        return {
          totalActivities: 0,
          videoActivities: 0,
          audioActivities: 0,
          textActivities: 0,
          quizActivities: 0,
          otherActivities: 0,
          videoCoveragePercent: 0,
          audioCoveragePercent: 0,
          mediaCoveragePercent: 0,
          activitiesWithoutMedia: 0,
          byContentType: [],
        };
      }
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // S09: Admin Manual Enrollment — Enroll/unenroll users in courses/paths
  // ═══════════════════════════════════════════════════════════════════════════
  manualEnroll: protectedProcedure
    .input(z.object({
      userId: z.number(),
      type: z.enum(["course", "path"]),
      targetId: z.number(), // courseId or pathId
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify user exists
      const [user] = await db.select({ id: users.id, name: users.name, email: users.email })
        .from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      if (input.type === "course") {
        const { lessons } = await import("../../drizzle/schema");
        // Check if already enrolled
        const [existing] = await db.select({ id: courseEnrollments.id })
          .from(courseEnrollments)
          .where(and(eq(courseEnrollments.userId, input.userId), eq(courseEnrollments.courseId, input.targetId)))
          .limit(1);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "User is already enrolled in this course" });

        // Count lessons
        const [lessonCount] = await db.select({ total: count() })
          .from(lessons).where(eq(lessons.courseId, input.targetId));

        await db.insert(courseEnrollments).values({
          courseId: input.targetId,
          userId: input.userId,
          progressPercent: 0,
          lessonsCompleted: 0,
          totalLessons: lessonCount?.total || 0,
        });

        log.info(`[Admin] Manual enrollment: user ${input.userId} enrolled in course ${input.targetId} by admin ${ctx.user.id}`);
        return { success: true, message: `User ${user.name || user.email} enrolled in course` };
      } else {
        // Path enrollment
        const { pathCourses, lessons } = await import("../../drizzle/schema");
        const [existing] = await db.select({ id: pathEnrollments.id })
          .from(pathEnrollments)
          .where(and(eq(pathEnrollments.userId, input.userId), eq(pathEnrollments.pathId, input.targetId)))
          .limit(1);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "User is already enrolled in this path" });

        // Create path enrollment
        await db.insert(pathEnrollments).values({
          pathId: input.targetId,
          userId: input.userId,
          status: "active",
          paymentStatus: "manual",
          amountPaid: "0",
          startedAt: new Date(),
        });

        // Auto-enroll in all path courses
        const pathCoursesResult = await db.select({ courseId: pathCourses.courseId })
          .from(pathCourses).where(eq(pathCourses.pathId, input.targetId));

        for (const pc of pathCoursesResult) {
          const [existingCourse] = await db.select({ id: courseEnrollments.id })
            .from(courseEnrollments)
            .where(and(eq(courseEnrollments.userId, input.userId), eq(courseEnrollments.courseId, pc.courseId)))
            .limit(1);
          if (!existingCourse) {
            const [lessonCount] = await db.select({ total: count() })
              .from(lessons).where(eq(lessons.courseId, pc.courseId));
            await db.insert(courseEnrollments).values({
              courseId: pc.courseId,
              userId: input.userId,
              progressPercent: 0,
              lessonsCompleted: 0,
              totalLessons: lessonCount?.total || 0,
            });
          }
        }

        log.info(`[Admin] Manual enrollment: user ${input.userId} enrolled in path ${input.targetId} (${pathCoursesResult.length} courses) by admin ${ctx.user.id}`);
        return { success: true, message: `User ${user.name || user.email} enrolled in path with ${pathCoursesResult.length} courses` };
      }
    }),

  unenroll: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
      type: z.enum(["course", "path"]),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      if (input.type === "course") {
        await db.update(courseEnrollments)
          .set({ status: "cancelled" })
          .where(eq(courseEnrollments.id, input.enrollmentId));
      } else {
        await db.update(pathEnrollments)
          .set({ status: "cancelled" })
          .where(eq(pathEnrollments.id, input.enrollmentId));
      }

      log.info(`[Admin] Unenrollment: ${input.type} enrollment ${input.enrollmentId} cancelled by admin ${ctx.user.id}`);
      return { success: true, message: "Enrollment cancelled" };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // S09: Get all users for manual enrollment dropdown
  // ═══════════════════════════════════════════════════════════════════════════
  getUsersForEnrollment: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    }).from(users).orderBy(users.name).limit(500);
    return allUsers;
  }),

  getCoursesForEnrollment: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allCourses = await db.select({
      id: courses.id,
      title: courses.title,
      level: courses.level,
    }).from(courses).orderBy(courses.title);
    return allCourses;
  }),

  getPathsForEnrollment: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allPaths = await db.select({
      id: learningPaths.id,
      title: learningPaths.title,
      slug: learningPaths.slug,
    }).from(learningPaths).orderBy(learningPaths.title);
    return allPaths;
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // C3: Admin Broadcast Notification
  // ═══════════════════════════════════════════════════════════════════════════
  broadcastNotification: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      message: z.string().min(1).max(2000),
      link: z.string().optional(),
      targetRole: z.enum(["all", "learner", "coach"]).default("all"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get target user IDs based on role filter
      let userRows;
      if (input.targetRole === "all") {
        userRows = await db.select({ id: users.id }).from(users);
      } else {
        userRows = await db.select({ id: users.id }).from(users)
          .where(eq(users.role, input.targetRole));
      }

      const userIds = userRows.map(u => u.id);

      if (userIds.length === 0) {
        return { sent: 0, failed: 0, total: 0 };
      }

      const { broadcastNotification } = await import("../services/learnerNotifications");
      const result = await broadcastNotification(userIds, input.title, input.message, input.link);

      log.info(`[Admin] Broadcast notification sent by admin ${ctx.user.id}: "${input.title}" to ${userIds.length} users (${input.targetRole})`);
      return { ...result, total: userIds.length };
    }),
});
