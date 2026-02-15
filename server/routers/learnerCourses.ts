import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, gte, inArray } from "drizzle-orm";
import { getDb, getLearnerByUserId } from "../db";
import { badges, coachProfiles, coachingPlanPurchases, courseEnrollments, courseModules, courses, learnerProfiles, lessonProgress, lessons, sessions, users } from "../../drizzle/schema";

export const learnerCoursesRouter = router({
  getUpcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];
    
    const db = await getDb();
    if (!db) return [];
    
    const now = new Date();
    const upcomingSessions = await db.select({
      id: sessions.id,
      scheduledAt: sessions.scheduledAt,
      duration: sessions.duration,
      status: sessions.status,
      meetingUrl: sessions.meetingUrl,
      coachName: users.name,
    })
      .from(sessions)
      .leftJoin(coachProfiles, eq(sessions.coachId, coachProfiles.id))
      .leftJoin(users, eq(coachProfiles.userId, users.id))
      .where(and(
        eq(sessions.learnerId, learner.id),
        gte(sessions.scheduledAt, now),
        inArray(sessions.status, ["pending", "confirmed"])
      ))
      .orderBy(sessions.scheduledAt)
      .limit(5);
    
    return upcomingSessions;
  }),

  // Get learner's enrolled courses (Path Series),

  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { courses, courseEnrollments, courseModules, lessonProgress } = await import("../../drizzle/schema");
    
    // Get all course enrollments for this user
    const enrollments = await db.select({
      enrollment: courseEnrollments,
      course: courses,
    })
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.userId, ctx.user.id))
      .orderBy(desc(courseEnrollments.enrolledAt));
    
    // Get progress for each course
    const coursesWithProgress = await Promise.all(enrollments.map(async (e) => {
      // Count total lessons in course
      const totalLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(courseModules)
        .where(eq(courseModules.courseId, e.course.id));
      
      // Count completed lessons
      const completedLessonsResult = await db.select({ count: sql<number>`COUNT(*)` })
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, e.course.id),
          eq(lessonProgress.status, "completed")
        ));
      
      const totalLessons = Number(totalLessonsResult[0]?.count || 0);
      const completedLessons = Number(completedLessonsResult[0]?.count || 0);
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        id: e.enrollment.id,
        courseId: e.course.id,
        title: e.course.title,
        description: e.course.description,
        thumbnailUrl: e.course.thumbnailUrl,
        level: e.course.level,
        category: e.course.category,
        enrolledAt: e.enrollment.enrolledAt,
        status: e.enrollment.status,
        progressPercent,
        completedLessons,
        totalLessons,
        lastAccessedAt: e.enrollment.lastAccessedAt,
      };
    }));
    
    return coursesWithProgress;
  }),

  // Get next lesson to continue,

  getNextLesson: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { courses, courseModules, lessons, lessonProgress, courseEnrollments } = await import("../../drizzle/schema");
      
      // Get enrollment
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId)
        ));
      
      if (!enrollment) return null;
      
      // Get all lessons in order
      const allLessons = await db.select({
        lesson: lessons,
        module: courseModules,
      })
        .from(lessons)
        .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
        .where(eq(lessons.courseId, input.courseId))
        .orderBy(courseModules.sortOrder, lessons.sortOrder);
      
      // Get completed lessons
      const completedLessonIds = await db.select({ lessonId: lessonProgress.lessonId })
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, input.courseId),
          eq(lessonProgress.status, "completed")
        ));
      
      const completedIds = new Set(completedLessonIds.map(l => l.lessonId));
      
      // Find first incomplete lesson
      const nextLesson = allLessons.find(l => !completedIds.has(l.lesson.id));
      
      if (!nextLesson) return null;
      
      return {
        lessonId: nextLesson.lesson.id,
        lessonTitle: nextLesson.lesson.title,
        moduleTitle: nextLesson.module.title,
        duration: nextLesson.lesson.estimatedMinutes || 0,
        contentType: nextLesson.lesson.contentType,
      };
    }),

  // Get course details with modules and lessons,

  getCourseDetails: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { courses, courseModules, lessons, lessonProgress, courseEnrollments } = await import("../../drizzle/schema");
      
      // Get course
      const [course] = await db.select()
        .from(courses)
        .where(eq(courses.id, input.courseId));
      
      if (!course) return null;
      
      // Get enrollment
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId)
        ));
      
      // Get modules with lessons
      const modules = await db.select()
        .from(courseModules)
        .where(eq(courseModules.courseId, input.courseId))
        .orderBy(courseModules.sortOrder);
      
      const modulesWithLessons = await Promise.all(modules.map(async (module) => {
        const moduleLessons = await db.select()
          .from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(lessons.sortOrder);
        
        // Get progress for each lesson if enrolled
        const lessonsWithProgress = await Promise.all(moduleLessons.map(async (lesson) => {
          let progress = null;
          if (enrollment) {
            const [lessonProg] = await db.select()
              .from(lessonProgress)
              .where(and(
                eq(lessonProgress.userId, ctx.user.id),
                eq(lessonProgress.lessonId, lesson.id),
                eq(lessonProgress.courseId, input.courseId)
              ));
            progress = lessonProg;
          }
          
          return {
            ...lesson,
            isCompleted: progress?.status === "completed",
            isInProgress: progress?.status === "in_progress",
            progressPercent: progress?.progressPercent || 0,
          };
        }));
        
        return {
          ...module,
          lessons: lessonsWithProgress,
        };
      }));
      
      return {
        ...course,
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment?.status,
        modules: modulesWithLessons,
      };
    }),

  // Get learner's badges,

  getVelocityData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      return {
        currentLevel: { reading: "X", writing: "X", oral: "X" },
        targetLevel: { reading: "B", writing: "B", oral: "B" },
        weeklyStudyHours: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
        lastAssessmentScore: null,
        examDate: null,
        predictedReadyDate: null,
        velocityTrend: "steady",
      };
    }
    
    // Calculate predicted ready date based on current progress
    const currentLevel = (learner.currentLevel as { reading?: string; writing?: string; oral?: string }) || {};
    const targetLevel = (learner.targetLevel as { reading?: string; writing?: string; oral?: string }) || {};
    
    // Simple prediction: estimate weeks to reach target based on study hours
    const weeklyHours = Number(learner.weeklyStudyHours) || 0;
    const lessonsCompleted = learner.lessonsCompleted || 0;
    
    // Calculate level gaps
    const levelValues: Record<string, number> = { X: 0, A: 1, B: 2, C: 3 };
    const gaps = [
      (levelValues[targetLevel.reading || "B"] || 2) - (levelValues[currentLevel.reading || "X"] || 0),
      (levelValues[targetLevel.writing || "B"] || 2) - (levelValues[currentLevel.writing || "X"] || 0),
      (levelValues[targetLevel.oral || "B"] || 2) - (levelValues[currentLevel.oral || "X"] || 0),
    ];
    const maxGap = Math.max(...gaps);
    
    // Estimate weeks needed (roughly 8 weeks per level with 5+ hours/week)
    const weeksPerLevel = weeklyHours >= 5 ? 8 : weeklyHours >= 3 ? 12 : 16;
    const weeksNeeded = maxGap * weeksPerLevel;
    
    const predictedReadyDate = new Date();
    predictedReadyDate.setDate(predictedReadyDate.getDate() + weeksNeeded * 7);
    
    // Determine velocity trend based on recent activity
    let velocityTrend: "improving" | "steady" | "declining" = "steady";
    if (weeklyHours >= 5 && lessonsCompleted > 10) velocityTrend = "improving";
    else if (weeklyHours < 2) velocityTrend = "declining";
    
    return {
      currentLevel,
      targetLevel,
      weeklyStudyHours: weeklyHours,
      lessonsCompleted,
      quizzesPassed: learner.quizzesPassed || 0,
      lastAssessmentScore: learner.lastAssessmentScore,
      examDate: learner.examDate,
      predictedReadyDate: weeksNeeded > 0 ? predictedReadyDate : null,
      velocityTrend,
    };
  }),

  // Get certification status for CertificationExpiryWidget,

  getCertificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) {
      return {
        hasCertification: false,
        certificationDate: null,
        certificationExpiry: null,
        certifiedLevel: null,
        daysUntilExpiry: null,
        isExpiringSoon: false,
        isExpired: false,
      };
    }
    
    const certificationDate = learner.certificationDate;
    const certificationExpiry = learner.certificationExpiry;
    const certifiedLevel = learner.certifiedLevel as { reading?: string; writing?: string; oral?: string } | null;
    
    if (!certificationDate || !certificationExpiry) {
      return {
        hasCertification: false,
        certificationDate: null,
        certificationExpiry: null,
        certifiedLevel: null,
        daysUntilExpiry: null,
        isExpiringSoon: false,
        isExpired: false,
      };
    }
    
    const now = new Date();
    const expiryDate = new Date(certificationExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = daysUntilExpiry < 0;
    const isExpiringSoon = !isExpired && daysUntilExpiry <= 180; // 6 months warning
    
    return {
      hasCertification: true,
      certificationDate,
      certificationExpiry,
      certifiedLevel,
      daysUntilExpiry: isExpired ? 0 : daysUntilExpiry,
      isExpiringSoon,
      isExpired,
    };
  }),

  // Update certification data,

  updateCertification: protectedProcedure
    .input(z.object({
      certificationDate: z.date(),
      certifiedLevel: z.object({
        reading: z.enum(["A", "B", "C"]),
        writing: z.enum(["A", "B", "C"]),
        oral: z.enum(["A", "B", "C"]),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }
      
      // Calculate expiry (5 years from certification date)
      const expiryDate = new Date(input.certificationDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 5);
      
      await db.update(learnerProfiles)
        .set({
          certificationDate: input.certificationDate,
          certificationExpiry: expiryDate,
          certifiedLevel: input.certifiedLevel,
        })
        .where(eq(learnerProfiles.id, learner.id));
      
      return { success: true, certificationExpiry: expiryDate };
    }),

  // Get learner's XP and level,

  getMyCoachingPlans: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const { coachingPlanPurchases } = await import("../../drizzle/schema");
    
    const plans = await db.select()
      .from(coachingPlanPurchases)
      .where(eq(coachingPlanPurchases.userId, ctx.user.id))
      // @ts-expect-error - TS2339: auto-suppressed during TS cleanup
      .orderBy(desc(coachingPlanPurchases.createdAt));
    
    return plans;
  }),

  // Mark a lesson as complete,

  markLessonComplete: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      courseId: z.number(),
      moduleId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessonProgress, courseEnrollments, lessons, learnerProfiles } = await import("../../drizzle/schema");
      
      // Verify user is enrolled in the course
      const [enrollment] = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, ctx.user.id),
          eq(courseEnrollments.courseId, input.courseId),
          eq(courseEnrollments.status, "active")
        ));
      
      if (!enrollment) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not enrolled in this course" });
      }
      
      // Check if progress record exists
      const [existing] = await db.select()
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.lessonId, input.lessonId)
        ));
      
      const now = new Date();
      
      // Wrap all writes in a transaction for data consistency
      const result = await db.transaction(async (tx) => {
        if (existing) {
          await tx.update(lessonProgress)
            .set({
              status: "completed",
              progressPercent: 100,
              completedAt: now,
              lastAccessedAt: now,
            })
            .where(eq(lessonProgress.id, existing.id));
        } else {
          await tx.insert(lessonProgress).values({
            lessonId: input.lessonId,
            userId: ctx.user.id,
            courseId: input.courseId,
            moduleId: input.moduleId,
            status: "completed",
            progressPercent: 100,
            completedAt: now,
            lastAccessedAt: now,
          });
        }
        
        // Update learner's lessonsCompleted count
        const learner = await getLearnerByUserId(ctx.user.id);
        if (learner) {
          await tx.update(learnerProfiles)
            .set({
              lessonsCompleted: sql`${learnerProfiles.lessonsCompleted} + 1`,
            })
            .where(eq(learnerProfiles.id, learner.id));
        }
        
        // Calculate new course progress
        const totalLessonsResult = await tx.select({ count: sql<number>`COUNT(*)` })
          .from(lessons)
          .where(eq(lessons.courseId, input.courseId));
        
        const completedLessonsResult = await tx.select({ count: sql<number>`COUNT(*)` })
          .from(lessonProgress)
          .where(and(
            eq(lessonProgress.userId, ctx.user.id),
            eq(lessonProgress.courseId, input.courseId),
            eq(lessonProgress.status, "completed")
          ));
        
        const totalLessons = Number(totalLessonsResult[0]?.count || 0);
        const completedLessons = Number(completedLessonsResult[0]?.count || 0);
        const newProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Update enrollment progress
        await tx.update(courseEnrollments)
          .set({
            progressPercent: newProgressPercent,
      // @ts-ignore - Drizzle type inference
            completedLessons,
            lastAccessedAt: now,
            completedAt: newProgressPercent === 100 ? now : null,
            status: newProgressPercent === 100 ? "completed" : "active",
          })
          .where(eq(courseEnrollments.id, enrollment.id));
        
        return { totalLessons, completedLessons, newProgressPercent };
      });
      
      return {
        success: true,
        lessonId: input.lessonId,
        courseProgress: result.newProgressPercent,
        completedLessons: result.completedLessons,
        totalLessons: result.totalLessons,
      };
    }),

  // Get lesson progress for a course,

  getLessonProgress: protectedProcedure
    .input(z.object({
      courseId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const { lessonProgress } = await import("../../drizzle/schema");
      
      const progress = await db.select()
        .from(lessonProgress)
        .where(and(
          eq(lessonProgress.userId, ctx.user.id),
          eq(lessonProgress.courseId, input.courseId)
        ));
      
      return progress;
    }),
});
