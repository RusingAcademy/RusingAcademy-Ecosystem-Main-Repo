import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { learningPaths, pathCourses, courses, pathEnrollments } from "../../drizzle/schema";
import { eq, desc, asc, sql, and, like } from "drizzle-orm";

export const adminPathsRouter = router({
  // List all learning paths with course counts and enrollment stats
  list: adminProcedure
    .input(z.object({
      status: z.enum(["all", "draft", "published", "archived"]).default("all"),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const filters: any[] = [];
      
      if (input?.status && input.status !== "all") {
        filters.push(eq(learningPaths.status, input.status));
      }
      if (input?.search) {
        filters.push(like(learningPaths.title, `%${input.search}%`));
      }

      const paths = await db.select({
        id: learningPaths.id,
        title: learningPaths.title,
        titleFr: learningPaths.titleFr,
        slug: learningPaths.slug,
        subtitle: learningPaths.subtitle,
        subtitleFr: learningPaths.subtitleFr,
        level: learningPaths.level,
        price: learningPaths.price,
        originalPrice: learningPaths.originalPrice,
        status: learningPaths.status,
        isFeatured: learningPaths.isFeatured,
        displayOrder: learningPaths.displayOrder,
        enrollmentCount: learningPaths.enrollmentCount,
        completionRate: learningPaths.completionRate,
        averageRating: learningPaths.averageRating,
        thumbnailUrl: learningPaths.thumbnailUrl,
        durationWeeks: learningPaths.durationWeeks,
        totalModules: learningPaths.totalModules,
        totalLessons: learningPaths.totalLessons,
        createdAt: learningPaths.createdAt,
        updatedAt: learningPaths.updatedAt,
      })
      .from(learningPaths)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(asc(learningPaths.displayOrder), desc(learningPaths.createdAt));

      // Get course counts per path
      const courseCounts = await db.select({
        pathId: pathCourses.pathId,
        courseCount: sql<number>`COUNT(*)`.as("courseCount"),
      })
      .from(pathCourses)
      .groupBy(pathCourses.pathId);

      const courseCountMap = new Map(courseCounts.map(c => [c.pathId, c.courseCount]));

      return paths.map(p => ({
        ...p,
        courseCount: courseCountMap.get(p.id) || 0,
      }));
    }),

  // Get a single path with full details including courses
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const [path] = await db.select()
        .from(learningPaths)
        .where(eq(learningPaths.id, input.id))
        .limit(1);

      if (!path) throw new Error("Learning path not found");

      // Get courses in this path with their details
      const pathCoursesData = await db.select({
        id: pathCourses.id,
        courseId: pathCourses.courseId,
        orderIndex: pathCourses.orderIndex,
        isRequired: pathCourses.isRequired,
        courseTitle: courses.title,
        courseTitleFr: courses.titleFr,
        courseSlug: courses.slug,
        courseCategory: courses.category,
        courseLevel: courses.level,
        courseThumbnail: courses.thumbnailUrl,
        courseTotalLessons: courses.totalLessons,
        courseTotalDuration: courses.totalDurationMinutes,
      })
      .from(pathCourses)
      .leftJoin(courses, eq(pathCourses.courseId, courses.id))
      .where(eq(pathCourses.pathId, input.id))
      .orderBy(asc(pathCourses.orderIndex));

      // Get enrollment count
      const [enrollStats] = await db.select({
        total: sql<number>`COUNT(*)`.as("total"),
        active: sql<number>`SUM(CASE WHEN ${pathEnrollments.status} = 'active' THEN 1 ELSE 0 END)`.as("active"),
      })
      .from(pathEnrollments)
      .where(eq(pathEnrollments.pathId, input.id));

      return {
        ...path,
        courses: pathCoursesData,
        enrollmentStats: {
          total: enrollStats?.total || 0,
          active: enrollStats?.active || 0,
        },
      };
    }),

  // Create a new learning path
  create: adminProcedure
    .input(z.object({
      title: z.string().min(3),
      titleFr: z.string().optional(),
      slug: z.string().min(3),
      subtitle: z.string().optional(),
      subtitleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      level: z.enum(["A1", "A2", "B1", "B2", "C1", "exam_prep"]),
      price: z.string().default("0.00"),
      originalPrice: z.string().optional(),
      discountPercentage: z.number().optional(),
      durationWeeks: z.number().optional(),
      structuredHours: z.number().optional(),
      practiceHoursMin: z.number().optional(),
      practiceHoursMax: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      bannerUrl: z.string().optional(),
      objectives: z.any().optional(),
      outcomes: z.any().optional(),
      whoIsThisFor: z.any().optional(),
      whatYouWillLearn: z.any().optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
      isFeatured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      const [result] = await db.insert(learningPaths).values({
        title: input.title,
        titleFr: input.titleFr || null,
        slug: input.slug,
        subtitle: input.subtitle || null,
        subtitleFr: input.subtitleFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        level: input.level,
        price: input.price,
        originalPrice: input.originalPrice || null,
        discountPercentage: input.discountPercentage || null,
        durationWeeks: input.durationWeeks || null,
        structuredHours: input.structuredHours || null,
        practiceHoursMin: input.practiceHoursMin || null,
        practiceHoursMax: input.practiceHoursMax || null,
        thumbnailUrl: input.thumbnailUrl || null,
        bannerUrl: input.bannerUrl || null,
        objectives: input.objectives || null,
        outcomes: input.outcomes || null,
        whoIsThisFor: input.whoIsThisFor || null,
        whatYouWillLearn: input.whatYouWillLearn || null,
        status: input.status,
        isFeatured: input.isFeatured,
      });

      return { id: result.insertId, success: true };
    }),

  // Update a learning path
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(3).optional(),
      titleFr: z.string().optional(),
      slug: z.string().optional(),
      subtitle: z.string().optional(),
      subtitleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      level: z.enum(["A1", "A2", "B1", "B2", "C1", "exam_prep"]).optional(),
      price: z.string().optional(),
      originalPrice: z.string().optional(),
      discountPercentage: z.number().optional(),
      durationWeeks: z.number().optional(),
      structuredHours: z.number().optional(),
      practiceHoursMin: z.number().optional(),
      practiceHoursMax: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      bannerUrl: z.string().optional(),
      objectives: z.any().optional(),
      outcomes: z.any().optional(),
      whoIsThisFor: z.any().optional(),
      whatYouWillLearn: z.any().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      isFeatured: z.boolean().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      
      // Filter out undefined values
      const cleanUpdates: Record<string, any> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      if (Object.keys(cleanUpdates).length === 0) {
        return { success: true, message: "No changes" };
      }

      await db.update(learningPaths)
        .set(cleanUpdates)
        .where(eq(learningPaths.id, id));

      return { success: true };
    }),

  // Delete a learning path
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      // Remove path courses first
      await db.delete(pathCourses).where(eq(pathCourses.pathId, input.id));
      
      // Remove path enrollments
      await db.delete(pathEnrollments).where(eq(pathEnrollments.pathId, input.id));
      
      // Remove the path
      await db.delete(learningPaths).where(eq(learningPaths.id, input.id));

      return { success: true };
    }),

  // Add a course to a path
  addCourse: adminProcedure
    .input(z.object({
      pathId: z.number(),
      courseId: z.number(),
      orderIndex: z.number().default(0),
      isRequired: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      // Check if course is already in path
      const existing = await db.select()
        .from(pathCourses)
        .where(and(
          eq(pathCourses.pathId, input.pathId),
          eq(pathCourses.courseId, input.courseId),
        ))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Course is already in this path");
      }

      await db.insert(pathCourses).values({
        pathId: input.pathId,
        courseId: input.courseId,
        orderIndex: input.orderIndex,
        isRequired: input.isRequired,
      });

      // Update totalModules count on the path
      const [count] = await db.select({
        total: sql<number>`COUNT(*)`.as("total"),
      })
      .from(pathCourses)
      .where(eq(pathCourses.pathId, input.pathId));

      await db.update(learningPaths)
        .set({ totalModules: count?.total || 0 })
        .where(eq(learningPaths.id, input.pathId));

      return { success: true };
    }),

  // Remove a course from a path
  removeCourse: adminProcedure
    .input(z.object({
      pathId: z.number(),
      courseId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      await db.delete(pathCourses)
        .where(and(
          eq(pathCourses.pathId, input.pathId),
          eq(pathCourses.courseId, input.courseId),
        ));

      // Update totalModules count
      const [count] = await db.select({
        total: sql<number>`COUNT(*)`.as("total"),
      })
      .from(pathCourses)
      .where(eq(pathCourses.pathId, input.pathId));

      await db.update(learningPaths)
        .set({ totalModules: count?.total || 0 })
        .where(eq(learningPaths.id, input.pathId));

      return { success: true };
    }),

  // Reorder courses within a path
  reorderCourses: adminProcedure
    .input(z.object({
      pathId: z.number(),
      courseOrder: z.array(z.object({
        courseId: z.number(),
        orderIndex: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      for (const item of input.courseOrder) {
        await db.update(pathCourses)
          .set({ orderIndex: item.orderIndex })
          .where(and(
            eq(pathCourses.pathId, input.pathId),
            eq(pathCourses.courseId, item.courseId),
          ));
      }

      return { success: true };
    }),

  // Toggle path status (draft → published → archived)
  toggleStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "published", "archived"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      await db.update(learningPaths)
        .set({ status: input.status })
        .where(eq(learningPaths.id, input.id));

      return { success: true };
    }),

  // Get available courses to add to a path (not already in the path)
  getAvailableCourses: adminProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      // Get courses already in this path
      const existingCourseIds = await db.select({ courseId: pathCourses.courseId })
        .from(pathCourses)
        .where(eq(pathCourses.pathId, input.pathId));

      const excludeIds = existingCourseIds.map(c => c.courseId);

      // Get all courses not in this path
      const allCourses = await db.select({
        id: courses.id,
        title: courses.title,
        titleFr: courses.titleFr,
        slug: courses.slug,
        category: courses.category,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        totalLessons: courses.totalLessons,
        totalDurationMinutes: courses.totalDurationMinutes,
      })
      .from(courses)
      .orderBy(asc(courses.title));

      return allCourses.filter(c => !excludeIds.includes(c.id));
    }),

  // Get path analytics
  getAnalytics: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      const [enrollStats] = await db.select({
        total: sql<number>`COUNT(*)`.as("total"),
        active: sql<number>`SUM(CASE WHEN ${pathEnrollments.status} = 'active' THEN 1 ELSE 0 END)`.as("active"),
        completed: sql<number>`SUM(CASE WHEN ${pathEnrollments.status} = 'completed' THEN 1 ELSE 0 END)`.as("completed"),
      })
      .from(pathEnrollments)
      .where(eq(pathEnrollments.pathId, input.id));

      return {
        totalEnrollments: enrollStats?.total || 0,
        activeEnrollments: enrollStats?.active || 0,
        completedEnrollments: enrollStats?.completed || 0,
        completionRate: enrollStats?.total 
          ? Math.round(((enrollStats?.completed || 0) / enrollStats.total) * 100) 
          : 0,
      };
    }),
});
