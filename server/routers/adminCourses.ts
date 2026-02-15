import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, asc, and, or, like } from "drizzle-orm";
import { getDb } from "../db";
import { courseEnrollments, courseModules, courses, lessons } from "../../drizzle/schema";

export const adminCoursesRouter = router({
  updateCourseBasic: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["draft", "review", "published", "archived"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courses } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.status !== undefined) updateData.status = input.status;
      
      await db.update(courses).set(updateData).where(eq(courses.id, input.id));
      return { success: true };
    }),
  
  // Update module (inline editing),

  updateModule: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { courseModules } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.titleFr !== undefined) updateData.titleFr = input.titleFr;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.descriptionFr !== undefined) updateData.descriptionFr = input.descriptionFr;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      
      await db.update(courseModules).set(updateData).where(eq(courseModules.id, input.id));
      return { success: true };
    }),
  
  // Update lesson (inline editing - basic fields),

  updateLessonBasic: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      type: z.enum(["video", "text", "quiz", "assignment", "live"]).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { lessons } = await import("../../drizzle/schema");
      
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      
      await db.update(lessons).set(updateData).where(eq(lessons.id, input.id));
      return { success: true };
    }),
  
  // Reorder quiz questions,

  getAllCourses: protectedProcedure
    .input(z.object({
      status: z.enum(["all", "draft", "review", "published", "archived"]).optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { courses: [], total: 0 };
      
      const { courses } = await import("../../drizzle/schema");
      const filters = input || { status: "all", page: 1, limit: 20 };
      const conditions: any[] = [];
      
      if (filters.status && filters.status !== "all") {
        conditions.push(eq(courses.status, filters.status));
      }
      
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        conditions.push(
          or(
            like(courses.title, searchTerm),
            like(courses.description, searchTerm)
          )
        );
      }
      
      const offset = ((filters.page || 1) - 1) * (filters.limit || 20);
      
      let query = db.select().from(courses);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      
      const allCourses = await query.orderBy(desc(courses.updatedAt));
      const paginatedCourses = allCourses.slice(offset, offset + (filters.limit || 20));
      
      return {
        courses: paginatedCourses,
        total: allCourses.length,
      };
    }),
  
  // Create a new course,

  createCourse: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      category: z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "business_french", "business_english", "exam_prep", "conversation", "grammar", "vocabulary"]).optional(),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).optional(),
      targetLanguage: z.enum(["french", "english", "both"]).optional(),
      price: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      previewVideoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      
      // Generate slug from title
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now();
      
      const [newCourse] = await db.insert(courses).values({
        title: input.title,
        slug,
        description: input.description || null,
        shortDescription: input.shortDescription || null,
        category: input.category || "sle_oral",
        level: input.level || "all_levels",
        targetLanguage: input.targetLanguage || "french",
        price: input.price || 0,
        thumbnailUrl: input.thumbnailUrl || null,
        previewVideoUrl: input.previewVideoUrl || null,
        status: "draft",
        instructorId: ctx.user.id,
        instructorName: ctx.user.name || "Admin",
      }).$returningId();
      
      return { success: true, courseId: newCourse.id };
    }),
  
  // Update a course,

  updateCourse: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      category: z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "business_french", "business_english", "exam_prep", "conversation", "grammar", "vocabulary"]).optional(),
      level: z.enum(["beginner", "intermediate", "advanced", "all_levels"]).optional(),
      targetLanguage: z.enum(["french", "english", "both"]).optional(),
      price: z.number().optional(),
      originalPrice: z.number().optional(),
      thumbnailUrl: z.string().optional(),
      previewVideoUrl: z.string().optional(),
      accessType: z.enum(["one_time", "subscription", "free"]).optional(),
      accessDurationDays: z.number().optional(),
      hasCertificate: z.boolean().optional(),
      hasQuizzes: z.boolean().optional(),
      hasDownloads: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      dripEnabled: z.boolean().optional(),
      dripInterval: z.number().optional(),
      dripUnit: z.enum(["days", "weeks", "months"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      const { courseId, ...updateData } = input;
      
      await db.update(courses)
        .set(updateData)
        .where(eq(courses.id, courseId));
      
      return { success: true };
    }),
  
  // Publish/Unpublish a course (supports full lifecycle: draft → review → published → archived)
  publishCourse: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      status: z.enum(["draft", "review", "published", "archived"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      
      await db.update(courses)
        .set({ 
          status: input.status,
          publishedAt: input.status === "published" ? new Date() : undefined,
          publishedBy: input.status === "published" ? (ctx.user.name || ctx.user.openId) : undefined,
        })
        .where(eq(courses.id, input.courseId));
      
      return { success: true };
    }),

  // Bulk status update for multiple courses
  bulkUpdateCourseStatus: protectedProcedure
    .input(z.object({
      courseIds: z.array(z.number()).min(1),
      status: z.enum(["draft", "review", "published", "archived"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses } = await import("../../drizzle/schema");
      
      for (const courseId of input.courseIds) {
        await db.update(courses)
          .set({
            status: input.status,
            publishedAt: input.status === "published" ? new Date() : undefined,
            publishedBy: input.status === "published" ? (ctx.user.name || ctx.user.openId) : undefined,
          })
          .where(eq(courses.id, courseId));
      }
      
      return { success: true, updated: input.courseIds.length };
    }),
  
  // Delete a course,

  deleteCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      // Wrap cascading deletes in a transaction
      await db.transaction(async (tx) => {
        await tx.delete(lessons).where(eq(lessons.courseId, input.courseId));
        await tx.delete(courseModules).where(eq(courseModules.courseId, input.courseId));
        await tx.delete(courses).where(eq(courses.id, input.courseId));
      });
      
      return { success: true };
    }),
  
  // Duplicate a course,

  duplicateCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      // Get original course
      const [original] = await db.select().from(courses).where(eq(courses.id, input.courseId));
      if (!original) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      
      // Create new course
      const newSlug = original.slug + "-copy-" + Date.now();
      const [newCourse] = await db.insert(courses).values({
        ...original,
        id: undefined,
        title: original.title + " (Copy)",
        slug: newSlug,
        status: "draft",
        totalEnrollments: 0,
        totalReviews: 0,
        averageRating: null,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any).$returningId();
      
      // Get and duplicate modules
      const originalModules = await db.select().from(courseModules).where(eq(courseModules.courseId, input.courseId));
      
      for (const module of originalModules) {
        const [newModule] = await db.insert(courseModules).values({
          ...module,
          id: undefined,
          courseId: newCourse.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any).$returningId();
        
        // Get and duplicate lessons for this module
        const moduleLessons = await db.select().from(lessons).where(eq(lessons.moduleId, module.id));
        
        for (const lesson of moduleLessons) {
          await db.insert(lessons).values({
            ...lesson,
            id: undefined,
            moduleId: newModule.id,
            courseId: newCourse.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any);
        }
      }
      
      return { success: true, newCourseId: newCourse.id };
    }),
  
  // Get course with full details for editing,

  getCourseForEdit: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courses, courseModules, lessons } = await import("../../drizzle/schema");
      
      const [course] = await db.select().from(courses).where(eq(courses.id, input.courseId));
      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      
      // Get modules with lessons
      const modules = await db.select().from(courseModules)
        .where(eq(courseModules.courseId, input.courseId))
        .orderBy(asc(courseModules.sortOrder));
      
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const moduleLessons = await db.select().from(lessons)
            .where(eq(lessons.moduleId, module.id))
            .orderBy(asc(lessons.sortOrder));
          return { ...module, lessons: moduleLessons };
        })
      );
      
      return { ...course, modules: modulesWithLessons };
    }),
  
  // ============================================================================
  // MODULE MANAGEMENT
  // ============================================================================
  
  // Create a module,

  createModule: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules, courses } = await import("../../drizzle/schema");
      
      // Get max sort order
      const existingModules = await db.select().from(courseModules)
        .where(eq(courseModules.courseId, input.courseId));
      const maxOrder = existingModules.length > 0 
        ? Math.max(...existingModules.map(m => m.sortOrder || 0)) 
        : -1;
      
      const [newModule] = await db.insert(courseModules).values({
        courseId: input.courseId,
        title: input.title,
        titleFr: input.titleFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        sortOrder: input.sortOrder ?? maxOrder + 1,
      }).$returningId();
      
      // Update course module count
      await db.update(courses)
        .set({ totalModules: sql`${courses.totalModules} + 1` })
        .where(eq(courses.id, input.courseId));
      
      return { success: true, moduleId: newModule.id };
    }),
  
  // Update a lesson,

  updateLesson: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      isPreview: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules } = await import("../../drizzle/schema");
      const { moduleId, ...updateData } = input;
      
      await db.update(courseModules)
        .set(updateData)
        .where(eq(courseModules.id, moduleId));
      
      return { success: true };
    }),
  
  // Delete a module,

  deleteModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules, lessons, courses } = await import("../../drizzle/schema");
      
      // Get module to find courseId
      const [module] = await db.select().from(courseModules).where(eq(courseModules.id, input.moduleId));
      if (!module) throw new TRPCError({ code: "NOT_FOUND", message: "Module not found" });
      
      // Wrap cascading deletes + count update in a transaction
      await db.transaction(async (tx) => {
        await tx.delete(lessons).where(eq(lessons.moduleId, input.moduleId));
        await tx.delete(courseModules).where(eq(courseModules.id, input.moduleId));
        await tx.update(courses)
          .set({ totalModules: sql`${courses.totalModules} - 1` })
          .where(eq(courses.id, module.courseId));
      });
      
      return { success: true };
    }),
  
  // Reorder modules,

  reorderModules: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      moduleIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { courseModules } = await import("../../drizzle/schema");
      
      // Update sort order for each module
      for (let i = 0; i < input.moduleIds.length; i++) {
        await db.update(courseModules)
          .set({ sortOrder: i })
          .where(eq(courseModules.id, input.moduleIds[i]));
      }
      
      return { success: true };
    }),
  
  // ============================================================================
  // LESSON MANAGEMENT
  // ============================================================================
  
  // Create a lesson,

  createLesson: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      courseId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      contentType: z.enum(["video", "text", "audio", "pdf", "quiz", "assignment", "download", "live_session"]).optional(),
      videoUrl: z.string().optional(),
      textContent: z.string().optional(),
      audioUrl: z.string().optional(),
      downloadUrl: z.string().optional(),
      estimatedMinutes: z.number().optional(),
      isPreview: z.boolean().optional(),
      isMandatory: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      // Get max sort order
      const existingLessons = await db.select().from(lessons)
        .where(eq(lessons.moduleId, input.moduleId));
      const maxOrder = existingLessons.length > 0 
        ? Math.max(...existingLessons.map(l => l.sortOrder || 0)) 
        : -1;
      
      const [newLesson] = await db.insert(lessons).values({
        moduleId: input.moduleId,
        courseId: input.courseId,
        title: input.title,
        titleFr: input.titleFr || null,
        description: input.description || null,
        descriptionFr: input.descriptionFr || null,
        contentType: input.contentType || "video",
        videoUrl: input.videoUrl || null,
        textContent: input.textContent || null,
        audioUrl: input.audioUrl || null,
        downloadUrl: input.downloadUrl || null,
        estimatedMinutes: input.estimatedMinutes || 10,
        isPreview: input.isPreview || false,
        isMandatory: input.isMandatory ?? true,
        sortOrder: input.sortOrder ?? maxOrder + 1,
      }).$returningId();
      
      // Update module lesson count
      await db.update(courseModules)
        .set({ totalLessons: sql`${courseModules.totalLessons} + 1` })
        .where(eq(courseModules.id, input.moduleId));
      
      // Update course lesson count
      await db.update(courses)
        .set({ totalLessons: sql`${courses.totalLessons} + 1` })
        .where(eq(courses.id, input.courseId));
      
      return { success: true, lessonId: newLesson.id };
    }),
  
  // Full lesson update with all fields (admin CMS),

  updateLessonFull: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      courseId: z.number(),
      title: z.string().min(1),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      contentType: z.enum(["video", "text", "audio", "pdf", "quiz", "assignment", "download", "live_session"]).optional(),
      videoUrl: z.string().optional(),
      videoProvider: z.enum(["youtube", "vimeo", "wistia", "bunny", "self_hosted"]).optional(),
      videoDurationSeconds: z.number().optional(),
      videoThumbnailUrl: z.string().optional(),
      textContent: z.string().optional(),
      audioUrl: z.string().optional(),
      audioDurationSeconds: z.number().optional(),
      downloadUrl: z.string().optional(),
      downloadFileName: z.string().optional(),
      estimatedMinutes: z.number().optional(),
      isPreview: z.boolean().optional(),
      isMandatory: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      const { lessonId, ...updateData } = input;
      
      await db.update(lessons)
        .set(updateData)
        .where(eq(lessons.id, lessonId));
      
      return { success: true };
    }),
  
  // Delete a lesson,

  deleteLesson: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons, courseModules, courses } = await import("../../drizzle/schema");
      
      // Get lesson to find moduleId and courseId
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, input.lessonId));
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
      
      // Wrap delete + count updates in a transaction
      await db.transaction(async (tx) => {
        await tx.delete(lessons).where(eq(lessons.id, input.lessonId));
        await tx.update(courseModules)
          .set({ totalLessons: sql`${courseModules.totalLessons} - 1` })
          .where(eq(courseModules.id, lesson.moduleId));
        await tx.update(courses)
          .set({ totalLessons: sql`${courses.totalLessons} - 1` })
          .where(eq(courses.id, lesson.courseId));
      });
      
      return { success: true };
    }),
  
  // Reorder lessons,

  reorderLessons: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      lessonIds: z.array(z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      
      // Update sort order for each lesson
      for (let i = 0; i < input.lessonIds.length; i++) {
        await db.update(lessons)
          .set({ sortOrder: i })
          .where(eq(lessons.id, input.lessonIds[i]));
      }
      
      return { success: true };
    }),
  
  // Upload lesson media,

  uploadLessonMedia: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      fileUrl: z.string(),
      fileName: z.string(),
      mimeType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { lessons } = await import("../../drizzle/schema");
      
      await db.update(lessons)
        .set({
          // @ts-expect-error - TS2353: auto-suppressed during TS cleanup
          content: input.fileUrl,
          updatedAt: new Date(),
        })
        .where(eq(lessons.id, input.lessonId));
      
      return { success: true, url: input.fileUrl };
    }),

  // Get course statistics for admin dashboard,

  getCourseStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { totalCourses: 0, publishedCourses: 0, reviewCourses: 0, draftCourses: 0, archivedCourses: 0, totalEnrollments: 0, totalRevenue: 0 };
      
      const { courses, courseEnrollments } = await import("../../drizzle/schema");
      
      const allCourses = await db.select().from(courses);
      const publishedCourses = allCourses.filter(c => c.status === "published");
      const reviewCourses = allCourses.filter(c => c.status === "review");
      const draftCourses = allCourses.filter(c => c.status === "draft");
      const archivedCourses = allCourses.filter(c => c.status === "archived");
      
      const [enrollmentCount] = await db.select({ count: sql<number>`count(*)` }).from(courseEnrollments);
      
      // Calculate total revenue from enrollments
      const totalRevenue = allCourses.reduce((sum, course) => {
        return sum + ((course.price || 0) * (course.totalEnrollments || 0));
      }, 0);
      
      return {
        totalCourses: allCourses.length,
        publishedCourses: publishedCourses.length,
        reviewCourses: reviewCourses.length,
        draftCourses: draftCourses.length,
        archivedCourses: archivedCourses.length,
        totalEnrollments: enrollmentCount?.count || 0,
        totalRevenue: totalRevenue / 100, // Convert from cents
      };
    }),
});
