/**
 * Government Reporting Router — Sprint C4
 * Provides government-ready compliance reports for Canadian public service audit
 * Supports JSON and CSV export of platform metrics, SLE readiness, and learner outcomes
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { sql, count, eq, desc, and, gte } from "drizzle-orm";
import {
  users,
  learnerProfiles,
  courseEnrollments,
  pathEnrollments,
  courses,
  learningPaths,
  certificates,
  learnerXp,
  quizAttempts,
} from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("routers-governmentReporting");

export const governmentReportingRouter = router({
  /**
   * Generate a comprehensive compliance report for GC/TBS audit
   * Returns structured data suitable for government procurement review
   */
  getComplianceReport: protectedProcedure
    .input(z.object({
      periodDays: z.number().min(7).max(365).default(90),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - input.periodDays);

      try {
        // 1. Platform Overview
        const [userCount] = await db.select({ total: count() }).from(users);
        const [learnerCount] = await db.select({ total: count() }).from(learnerProfiles);
        const [courseCount] = await db.select({ total: count() }).from(courses);
        const [pathCount] = await db.select({ total: count() }).from(learningPaths);

        // 2. Enrollment Metrics
        const [totalEnrollments] = await db.select({ total: count() }).from(courseEnrollments);
        const [activeEnrollments] = await db.select({ total: count() })
          .from(courseEnrollments)
          .where(eq(courseEnrollments.status, "active"));
        const [completedEnrollments] = await db.select({ total: count() })
          .from(courseEnrollments)
          .where(eq(courseEnrollments.status, "completed"));
        const [recentEnrollments] = await db.select({ total: count() })
          .from(courseEnrollments)
          .where(gte(courseEnrollments.enrolledAt, cutoff));

        // 3. Path Enrollments
        const [totalPathEnrollments] = await db.select({ total: count() }).from(pathEnrollments);
        const [activePathEnrollments] = await db.select({ total: count() })
          .from(pathEnrollments)
          .where(eq(pathEnrollments.status, "active"));

        // 4. Certificates Issued
        const [totalCertificates] = await db.select({ total: count() }).from(certificates);
        const [recentCertificates] = await db.select({ total: count() })
          .from(certificates)
          .where(gte(certificates.issuedAt, cutoff));

        // 5. SLE Readiness Distribution
        const profiles = await db.select({
          currentLevel: learnerProfiles.currentLevel,
          targetLevel: learnerProfiles.targetLevel,
          primaryFocus: learnerProfiles.primaryFocus,
          targetLanguage: learnerProfiles.targetLanguage,
          department: learnerProfiles.department,
        }).from(learnerProfiles);

        // Aggregate SLE levels
        const sleLevelDist = { A: 0, B: 0, C: 0, X: 0, unknown: 0 };
        const targetLevelDist = { A: 0, B: 0, C: 0, unknown: 0 };
        const departmentDist: Record<string, number> = {};
        const focusDist: Record<string, number> = {};

        for (const p of profiles) {
          // Current oral level distribution (most relevant for SLE)
          const cl = p.currentLevel as any;
          if (cl && typeof cl === "object" && cl.oral) {
            const level = cl.oral.toUpperCase();
            if (level in sleLevelDist) sleLevelDist[level as keyof typeof sleLevelDist]++;
            else sleLevelDist.unknown++;
          } else {
            sleLevelDist.unknown++;
          }

          // Target level distribution
          const tl = p.targetLevel as any;
          if (tl && typeof tl === "object" && tl.oral) {
            const level = tl.oral.toUpperCase();
            if (level in targetLevelDist) targetLevelDist[level as keyof typeof targetLevelDist]++;
            else targetLevelDist.unknown++;
          } else {
            targetLevelDist.unknown++;
          }

          // Department distribution
          if (p.department) {
            departmentDist[p.department] = (departmentDist[p.department] || 0) + 1;
          }

          // Focus distribution
          if (p.primaryFocus) {
            focusDist[p.primaryFocus] = (focusDist[p.primaryFocus] || 0) + 1;
          }
        }

        // 6. Quiz Performance
        const [totalQuizAttempts] = await db.select({ total: count() }).from(quizAttempts);
        const [passedQuizzes] = await db.select({ total: count() })
          .from(quizAttempts)
          .where(eq(quizAttempts.passed, true));
        const [avgScore] = await db.select({
          avg: sql<number>`COALESCE(AVG(${quizAttempts.score}), 0)`,
        }).from(quizAttempts);

        // 7. Completion Rate
        const completionRate = totalEnrollments.total > 0
          ? Math.round((completedEnrollments.total / totalEnrollments.total) * 100)
          : 0;

        const quizPassRate = totalQuizAttempts.total > 0
          ? Math.round((passedQuizzes.total / totalQuizAttempts.total) * 100)
          : 0;

        return {
          reportDate: new Date().toISOString(),
          periodDays: input.periodDays,
          periodStart: cutoff.toISOString(),
          periodEnd: new Date().toISOString(),
          platform: {
            name: "RusingÂcademy",
            version: "1.0",
            compliance: "GC-ready",
            bilingual: true,
            accessibility: "WCAG 2.1 AA (target)",
          },
          overview: {
            totalUsers: userCount.total,
            totalLearnerProfiles: learnerCount.total,
            totalCourses: courseCount.total,
            totalLearningPaths: pathCount.total,
          },
          enrollments: {
            total: totalEnrollments.total,
            active: activeEnrollments.total,
            completed: completedEnrollments.total,
            recentPeriod: recentEnrollments.total,
            completionRate,
            pathEnrollments: {
              total: totalPathEnrollments.total,
              active: activePathEnrollments.total,
            },
          },
          certificates: {
            totalIssued: totalCertificates.total,
            recentPeriod: recentCertificates.total,
          },
          sleReadiness: {
            currentOralLevelDistribution: sleLevelDist,
            targetOralLevelDistribution: targetLevelDist,
            departmentDistribution: Object.entries(departmentDist)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 20)
              .map(([dept, count]) => ({ department: dept, learners: count })),
            focusDistribution: focusDist,
          },
          assessments: {
            totalQuizAttempts: totalQuizAttempts.total,
            passedQuizzes: passedQuizzes.total,
            passRate: quizPassRate,
            averageScore: Math.round(Number(avgScore.avg)),
          },
        };
      } catch (error) {
        log.error("[Government Reporting] Error generating compliance report:", error);
        return null;
      }
    }),

  /**
   * Export learner enrollment data as CSV-ready array
   */
  exportEnrollmentCSV: protectedProcedure
    .input(z.object({
      periodDays: z.number().min(7).max(365).default(90),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { headers: [], rows: [] };

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - input.periodDays);

      try {
        const enrollments = await db.select({
          enrollmentId: courseEnrollments.id,
          userName: users.name,
          userEmail: users.email,
          courseTitle: courses.title,
          status: courseEnrollments.status,
          progressPercent: courseEnrollments.progressPercent,
          lessonsCompleted: courseEnrollments.lessonsCompleted,
          totalLessons: courseEnrollments.totalLessons,
          enrolledAt: courseEnrollments.enrolledAt,
          completedAt: courseEnrollments.completedAt,
        })
          .from(courseEnrollments)
          .leftJoin(users, eq(courseEnrollments.userId, users.id))
          .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
          .where(gte(courseEnrollments.enrolledAt, cutoff))
          .orderBy(desc(courseEnrollments.enrolledAt))
          .limit(5000);

        const headers = [
          "Enrollment ID", "Learner Name", "Email", "Course",
          "Status", "Progress %", "Lessons Completed", "Total Lessons",
          "Enrolled At", "Completed At",
        ];

        const rows = enrollments.map(e => [
          e.enrollmentId,
          e.userName || "",
          e.userEmail || "",
          e.courseTitle || "",
          e.status || "",
          e.progressPercent || 0,
          e.lessonsCompleted || 0,
          e.totalLessons || 0,
          e.enrolledAt ? new Date(e.enrolledAt).toISOString() : "",
          e.completedAt ? new Date(e.completedAt).toISOString() : "",
        ]);

        return { headers, rows };
      } catch (error) {
        log.error("[Government Reporting] Error exporting enrollment CSV:", error);
        return { headers: [], rows: [] };
      }
    }),

  /**
   * Get SLE readiness metrics for the admin dashboard
   */
  getSLEReadinessMetrics: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    try {
      const profiles = await db.select({
        id: learnerProfiles.id,
        currentLevel: learnerProfiles.currentLevel,
        targetLevel: learnerProfiles.targetLevel,
        examDate: learnerProfiles.examDate,
        primaryFocus: learnerProfiles.primaryFocus,
        targetLanguage: learnerProfiles.targetLanguage,
        lessonsCompleted: learnerProfiles.lessonsCompleted,
        quizzesPassed: learnerProfiles.quizzesPassed,
        lastAssessmentScore: learnerProfiles.lastAssessmentScore,
        currentStreak: learnerProfiles.currentStreak,
        weeklyStudyHours: learnerProfiles.weeklyStudyHours,
      }).from(learnerProfiles);

      // Learners with upcoming exams (next 90 days)
      const now = new Date();
      const ninetyDays = new Date();
      ninetyDays.setDate(ninetyDays.getDate() + 90);

      const upcomingExams = profiles.filter(p => {
        if (!p.examDate) return false;
        const examDate = new Date(p.examDate);
        return examDate >= now && examDate <= ninetyDays;
      }).length;

      // Level gap analysis
      let onTarget = 0;
      let needsImprovement = 0;
      let noData = 0;

      for (const p of profiles) {
        const cl = p.currentLevel as any;
        const tl = p.targetLevel as any;
        if (!cl || !tl) { noData++; continue; }

        const levelOrder = { X: 0, A: 1, B: 2, C: 3 };
        const skills = ["reading", "writing", "oral"];
        let allMet = true;

        for (const skill of skills) {
          const current = (cl[skill] || "X").toUpperCase();
          const target = (tl[skill] || "X").toUpperCase();
          if ((levelOrder[current as keyof typeof levelOrder] || 0) < (levelOrder[target as keyof typeof levelOrder] || 0)) {
            allMet = false;
            break;
          }
        }

        if (allMet) onTarget++;
        else needsImprovement++;
      }

      // Average study hours
      const totalHours = profiles.reduce((sum, p) => sum + Number(p.weeklyStudyHours || 0), 0);
      const avgStudyHours = profiles.length > 0 ? Math.round((totalHours / profiles.length) * 10) / 10 : 0;

      // Average streak
      const totalStreak = profiles.reduce((sum, p) => sum + (p.currentStreak || 0), 0);
      const avgStreak = profiles.length > 0 ? Math.round(totalStreak / profiles.length) : 0;

      return {
        totalLearners: profiles.length,
        upcomingExams,
        onTarget,
        needsImprovement,
        noData,
        avgStudyHours,
        avgStreak,
        readinessRate: profiles.length > 0
          ? Math.round((onTarget / (onTarget + needsImprovement || 1)) * 100)
          : 0,
      };
    } catch (error) {
      log.error("[Government Reporting] Error getting SLE readiness:", error);
      return null;
    }
  }),

  /**
   * Get enrollment trends by month for cohort analysis
   */
  getEnrollmentTrends: protectedProcedure
    .input(z.object({
      months: z.number().min(3).max(24).default(12),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - input.months);

        const trends = await db.select({
          month: sql<string>`DATE_FORMAT(${courseEnrollments.enrolledAt}, '%Y-%m')`,
          enrollments: count(),
        })
          .from(courseEnrollments)
          .where(gte(courseEnrollments.enrolledAt, cutoff))
          .groupBy(sql`DATE_FORMAT(${courseEnrollments.enrolledAt}, '%Y-%m')`)
          .orderBy(sql`DATE_FORMAT(${courseEnrollments.enrolledAt}, '%Y-%m')`);

        return trends.map(t => ({
          month: t.month,
          enrollments: t.enrollments,
        }));
      } catch (error) {
        log.error("[Government Reporting] Error getting enrollment trends:", error);
        return [];
      }
    }),
});
