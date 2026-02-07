/**
 * Activities Router
 * 
 * CRUD operations for the 4th level of the course hierarchy:
 * Course → Module → Lesson → Activity
 * 
 * Activities are the atomic content units within lessons (exercises, downloads, embeds, etc.)
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, sql, asc, desc } from "drizzle-orm";
import {
  activities,
  activityProgress,
  lessons,
  courseModules,
  courses,
} from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

// Input schemas
const createActivitySchema = z.object({
  lessonId: z.number(),
  moduleId: z.number(),
  courseId: z.number(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  activityType: z.enum([
    "video", "text", "audio", "quiz", "assignment", "download",
    "live_session", "embed", "speaking_exercise", "fill_blank",
    "matching", "discussion"
  ]).default("text"),
  content: z.string().optional(),
  contentJson: z.any().optional(),
  videoUrl: z.string().optional(),
  videoProvider: z.enum(["youtube", "vimeo", "bunny", "self_hosted"]).optional(),
  audioUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  downloadFileName: z.string().optional(),
  embedCode: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  estimatedMinutes: z.number().default(5),
  points: z.number().default(0),
  passingScore: z.number().optional(),
  sortOrder: z.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isPreview: z.boolean().default(false),
  isMandatory: z.boolean().default(true),
  unlockMode: z.enum(["immediate", "drip", "prerequisite", "manual"]).default("immediate"),
  availableAt: z.string().optional(), // ISO date string
  prerequisiteActivityId: z.number().optional(),
});

const updateActivitySchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  activityType: z.enum([
    "video", "text", "audio", "quiz", "assignment", "download",
    "live_session", "embed", "speaking_exercise", "fill_blank",
    "matching", "discussion"
  ]).optional(),
  content: z.string().optional().nullable(),
  contentJson: z.any().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  videoProvider: z.enum(["youtube", "vimeo", "bunny", "self_hosted"]).optional().nullable(),
  audioUrl: z.string().optional().nullable(),
  downloadUrl: z.string().optional().nullable(),
  downloadFileName: z.string().optional().nullable(),
  embedCode: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  estimatedMinutes: z.number().optional(),
  points: z.number().optional(),
  passingScore: z.number().optional().nullable(),
  sortOrder: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  isPreview: z.boolean().optional(),
  isMandatory: z.boolean().optional(),
  unlockMode: z.enum(["immediate", "drip", "prerequisite", "manual"]).optional(),
  availableAt: z.string().optional().nullable(),
  prerequisiteActivityId: z.number().optional().nullable(),
});

// Admin check helper
function assertAdmin(ctx: any) {
  if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

export const activitiesRouter = router({
  // ========================================================================
  // PUBLIC / LEARNER PROCEDURES
  // ========================================================================

  // Get all activities for a lesson (public, for course preview)
  getByLesson: publicProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select({
          id: activities.id,
          lessonId: activities.lessonId,
          moduleId: activities.moduleId,
          courseId: activities.courseId,
          title: activities.title,
          description: activities.description,
          activityType: activities.activityType,
          estimatedMinutes: activities.estimatedMinutes,
          points: activities.points,
          sortOrder: activities.sortOrder,
          status: activities.status,
          isPreview: activities.isPreview,
          isMandatory: activities.isMandatory,
          thumbnailUrl: activities.thumbnailUrl,
          unlockMode: activities.unlockMode,
        })
        .from(activities)
        .where(
          and(
            eq(activities.lessonId, input.lessonId),
            eq(activities.status, "published")
          )
        )
        .orderBy(asc(activities.sortOrder));

      return result;
    }),

  // Get a single activity with full content (for learners)
  getById: publicProcedure
    .input(z.object({ activityId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      // Get navigation (prev/next within same lesson)
      const [prevActivity] = await db
        .select({ id: activities.id, title: activities.title })
        .from(activities)
        .where(
          and(
            eq(activities.lessonId, activity.lessonId),
            sql`${activities.sortOrder} < ${activity.sortOrder}`,
            eq(activities.status, "published")
          )
        )
        .orderBy(desc(activities.sortOrder))
        .limit(1);

      const [nextActivity] = await db
        .select({ id: activities.id, title: activities.title })
        .from(activities)
        .where(
          and(
            eq(activities.lessonId, activity.lessonId),
            sql`${activities.sortOrder} > ${activity.sortOrder}`,
            eq(activities.status, "published")
          )
        )
        .orderBy(asc(activities.sortOrder))
        .limit(1);

      return {
        ...activity,
        prevActivity,
        nextActivity,
      };
    }),

  // Get activity with user progress (for authenticated learners)
  getWithProgress: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db
        .select({
          id: activities.id,
          lessonId: activities.lessonId,
          moduleId: activities.moduleId,
          courseId: activities.courseId,
          title: activities.title,
          description: activities.description,
          activityType: activities.activityType,
          content: activities.content,
          contentJson: activities.contentJson,
          videoUrl: activities.videoUrl,
          videoProvider: activities.videoProvider,
          audioUrl: activities.audioUrl,
          downloadUrl: activities.downloadUrl,
          downloadFileName: activities.downloadFileName,
          embedCode: activities.embedCode,
          thumbnailUrl: activities.thumbnailUrl,
          estimatedMinutes: activities.estimatedMinutes,
          points: activities.points,
          passingScore: activities.passingScore,
          sortOrder: activities.sortOrder,
          status: activities.status,
          isPreview: activities.isPreview,
          isMandatory: activities.isMandatory,
          unlockMode: activities.unlockMode,
          availableAt: activities.availableAt,
          // Progress fields
          progressStatus: activityProgress.status,
          progressScore: activityProgress.score,
          progressAttempts: activityProgress.attempts,
          timeSpentSeconds: activityProgress.timeSpentSeconds,
          completedAt: activityProgress.completedAt,
        })
        .from(activities)
        .leftJoin(
          activityProgress,
          and(
            eq(activityProgress.activityId, activities.id),
            eq(activityProgress.userId, ctx.user.id)
          )
        )
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      return activity;
    }),

  // Mark activity as started
  startActivity: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db
        .select({
          id: activities.id,
          lessonId: activities.lessonId,
          courseId: activities.courseId,
        })
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      await db
        .insert(activityProgress)
        .values({
          activityId: input.activityId,
          userId: ctx.user.id,
          lessonId: activity.lessonId,
          courseId: activity.courseId,
          status: "in_progress",
          lastAccessedAt: new Date(),
        })
        .onDuplicateKeyUpdate({
          set: {
            lastAccessedAt: new Date(),
          },
        });

      return { success: true };
    }),

  // Mark activity as completed
  completeActivity: protectedProcedure
    .input(
      z.object({
        activityId: z.number(),
        score: z.number().optional(),
        timeSpentSeconds: z.number().optional(),
        responseData: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db
        .select({
          id: activities.id,
          lessonId: activities.lessonId,
          courseId: activities.courseId,
          passingScore: activities.passingScore,
        })
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      // Determine pass/fail for scored activities
      let status: "completed" | "failed" = "completed";
      if (activity.passingScore && input.score !== undefined) {
        status = input.score >= activity.passingScore ? "completed" : "failed";
      }

      await db
        .insert(activityProgress)
        .values({
          activityId: input.activityId,
          userId: ctx.user.id,
          lessonId: activity.lessonId,
          courseId: activity.courseId,
          status,
          score: input.score,
          timeSpentSeconds: input.timeSpentSeconds || 0,
          responseData: input.responseData,
          completedAt: new Date(),
          lastAccessedAt: new Date(),
          attempts: 1,
        })
        .onDuplicateKeyUpdate({
          set: {
            status,
            score: input.score,
            timeSpentSeconds: sql`${activityProgress.timeSpentSeconds} + ${input.timeSpentSeconds || 0}`,
            responseData: input.responseData,
            completedAt: new Date(),
            lastAccessedAt: new Date(),
            attempts: sql`${activityProgress.attempts} + 1`,
          },
        });

      return { success: true, status };
    }),

  // ========================================================================
  // ADMIN PROCEDURES
  // ========================================================================

  // Get all activities for a lesson (admin - includes drafts)
  adminGetByLesson: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(activities)
        .where(eq(activities.lessonId, input.lessonId))
        .orderBy(asc(activities.sortOrder));

      return result;
    }),

  // Get single activity for editing (admin)
  adminGetById: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .query(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [activity] = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      return activity;
    }),

  // Create a new activity
  create: protectedProcedure
    .input(createActivitySchema)
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify lesson exists
      const [lesson] = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(eq(lessons.id, input.lessonId));

      if (!lesson) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
      }

      // Get max sort order for this lesson
      const [maxSort] = await db
        .select({ maxOrder: sql<number>`COALESCE(MAX(${activities.sortOrder}), -1)` })
        .from(activities)
        .where(eq(activities.lessonId, input.lessonId));

      const sortOrder = input.sortOrder || (maxSort?.maxOrder ?? -1) + 1;

      const result = await db.insert(activities).values({
        ...input,
        sortOrder,
        availableAt: input.availableAt ? new Date(input.availableAt) : undefined,
      });

      const insertId = result[0].insertId;

      // Update lesson activity count
      await db
        .update(lessons)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE lessonId = ${input.lessonId})`,
        })
        .where(eq(lessons.id, input.lessonId));

      // Update course activity count
      await db
        .update(courses)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE courseId = ${input.courseId})`,
        })
        .where(eq(courses.id, input.courseId));

      return { id: insertId, success: true };
    }),

  // Update an activity
  update: protectedProcedure
    .input(updateActivitySchema)
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { id, ...updateData } = input;

      // Check activity exists
      const [existing] = await db
        .select({ id: activities.id })
        .from(activities)
        .where(eq(activities.id, id));

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      // Build update object, filtering out undefined values
      const cleanData: Record<string, any> = {};
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          if (key === "availableAt" && value) {
            cleanData[key] = new Date(value as string);
          } else {
            cleanData[key] = value;
          }
        }
      }

      if (Object.keys(cleanData).length > 0) {
        await db.update(activities).set(cleanData).where(eq(activities.id, id));
      }

      return { success: true };
    }),

  // Delete an activity
  delete: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get activity info before deleting
      const [activity] = await db
        .select({
          id: activities.id,
          lessonId: activities.lessonId,
          courseId: activities.courseId,
        })
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!activity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      await db.delete(activities).where(eq(activities.id, input.activityId));

      // Update counts
      await db
        .update(lessons)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE lessonId = ${activity.lessonId})`,
        })
        .where(eq(lessons.id, activity.lessonId));

      await db
        .update(courses)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE courseId = ${activity.courseId})`,
        })
        .where(eq(courses.id, activity.courseId));

      return { success: true };
    }),

  // Reorder activities within a lesson
  reorder: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        activityIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Update sort order for each activity
      for (let i = 0; i < input.activityIds.length; i++) {
        await db
          .update(activities)
          .set({ sortOrder: i })
          .where(
            and(
              eq(activities.id, input.activityIds[i]),
              eq(activities.lessonId, input.lessonId)
            )
          );
      }

      return { success: true };
    }),

  // Duplicate an activity
  duplicate: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [original] = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.activityId));

      if (!original) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activity not found" });
      }

      // Get max sort order
      const [maxSort] = await db
        .select({ maxOrder: sql<number>`COALESCE(MAX(${activities.sortOrder}), 0)` })
        .from(activities)
        .where(eq(activities.lessonId, original.lessonId));

      const { id, createdAt, updatedAt, ...data } = original;

      const result = await db.insert(activities).values({
        ...data,
        title: `${original.title} (Copy)`,
        sortOrder: (maxSort?.maxOrder ?? 0) + 1,
        status: "draft",
      });

      // Update counts
      await db
        .update(lessons)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE lessonId = ${original.lessonId})`,
        })
        .where(eq(lessons.id, original.lessonId));

      await db
        .update(courses)
        .set({
          totalActivities: sql`(SELECT COUNT(*) FROM activities WHERE courseId = ${original.courseId})`,
        })
        .where(eq(courses.id, original.courseId));

      return { id: result[0].insertId, success: true };
    }),

  // Bulk update status (publish/archive multiple activities)
  bulkUpdateStatus: protectedProcedure
    .input(
      z.object({
        activityIds: z.array(z.number()),
        status: z.enum(["draft", "published", "archived"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      for (const activityId of input.activityIds) {
        await db
          .update(activities)
          .set({ status: input.status })
          .where(eq(activities.id, activityId));
      }

      return { success: true, count: input.activityIds.length };
    }),
});
