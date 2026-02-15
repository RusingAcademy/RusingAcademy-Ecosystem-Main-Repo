import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";

// ============================================================================
// CELEBRATIONS ROUTER
// Handles milestone celebrations (badges, streaks, course completions)
// Polled by CelebrationOverlay every 10 seconds
// ============================================================================

export const celebrationsRouter = router({
  // Get unseen celebrations for the current user
  getUnseen: protectedProcedure
    .query(async ({ ctx }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return [];

      try {
        const { sql } = await import("drizzle-orm");
        const results = await db.execute(
          sql`SELECT id, type, title, titleFr, description, descriptionFr, 
                     icon, confettiColor, xpAwarded, badgeName, createdAt
              FROM user_celebrations
              WHERE userId = ${ctx.user.id} AND seenAt IS NULL
              ORDER BY createdAt DESC
              LIMIT 5`
        );
        return (results as any)[0] || [];
      } catch {
        // Table may not exist yet — return empty gracefully
        return [];
      }
    }),

  // Mark a celebration as seen
  markSeen: protectedProcedure
    .input(z.object({ id: z.number() }).optional())
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return { success: false };

      try {
        const { sql } = await import("drizzle-orm");
        if (input?.id) {
          // Mark a specific celebration as seen
          await db.execute(
            sql`UPDATE user_celebrations SET seenAt = NOW() WHERE id = ${input.id} AND userId = ${ctx.user.id}`
          );
        } else {
          // Mark all unseen celebrations as seen
          await db.execute(
            sql`UPDATE user_celebrations SET seenAt = NOW() WHERE userId = ${ctx.user.id} AND seenAt IS NULL`
          );
        }
        return { success: true };
      } catch {
        return { success: false };
      }
    }),

  // Create a celebration (called internally by other routers)
  create: protectedProcedure
    .input(z.object({
      type: z.enum(["badge", "streak", "course_complete", "level_up", "first_lesson", "milestone"]),
      title: z.string(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      descriptionFr: z.string().optional(),
      icon: z.string().optional(),
      confettiColor: z.string().optional(),
      xpAwarded: z.number().optional(),
      badgeName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return { success: false };

      try {
        const { sql } = await import("drizzle-orm");
        await db.execute(
          sql`INSERT INTO user_celebrations (userId, type, title, titleFr, description, descriptionFr, icon, confettiColor, xpAwarded, badgeName, createdAt)
              VALUES (${ctx.user.id}, ${input.type}, ${input.title}, ${input.titleFr || input.title}, ${input.description || ''}, ${input.descriptionFr || ''}, ${input.icon || '🎉'}, ${input.confettiColor || '#10b981'}, ${input.xpAwarded || 0}, ${input.badgeName || null}, NOW())`
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});
