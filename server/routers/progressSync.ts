/**
 * Progress Sync Router — Phase 2
 * tRPC endpoints for real-time lesson progress synchronization
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  syncProgress,
  getUserCourseProgress,
  getUserLearningStats,
} from "../services/progressSync";

export const progressSyncRouter = router({
  /**
   * Sync a single lesson's progress (upsert with optimistic locking)
   */
  sync: protectedProcedure
    .input(
      z.object({
        lessonId: z.number().int().positive(),
        courseId: z.number().int().positive().optional(),
        moduleId: z.number().int().positive().optional(),
        status: z.enum(["not_started", "in_progress", "completed"]),
        progressPercent: z.number().int().min(0).max(100),
        timeSpentSeconds: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return syncProgress(ctx.user.id, input);
    }),

  /**
   * Batch sync multiple lessons at once (offline → online reconciliation)
   */
  batchSync: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            lessonId: z.number().int().positive(),
            courseId: z.number().int().positive().optional(),
            moduleId: z.number().int().positive().optional(),
            status: z.enum(["not_started", "in_progress", "completed"]),
            progressPercent: z.number().int().min(0).max(100),
            timeSpentSeconds: z.number().int().min(0),
          })
        ).min(1).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const results = [];
      for (const update of input.updates) {
        const result = await syncProgress(ctx.user.id, update);
        results.push(result);
      }
      return { synced: results.length, results };
    }),

  /**
   * Get all progress for a user in a specific course
   */
  getCourseProgress: protectedProcedure
    .input(z.object({ courseId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      return getUserCourseProgress(ctx.user.id, input.courseId);
    }),

  /**
   * Get overall learning stats for the current user
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return getUserLearningStats(ctx.user.id);
  }),
});
