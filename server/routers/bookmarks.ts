/**
 * Bookmarks Router — Wave G, Sprint G2
 *
 * Learner bookmarks for saving lessons, exercises, and resources:
 * - getAll: Get all bookmarks for the current user
 * - remove: Remove a bookmark
 * - add: Add a new bookmark (bonus endpoint for future use)
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

async function ensureBookmarksTable() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS learner_bookmarks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      itemType ENUM('lesson','exercise','resource','flashcard_deck','vocabulary','thread','course') NOT NULL,
      itemId INT NOT NULL,
      title VARCHAR(500),
      titleFr VARCHAR(500),
      description VARCHAR(1000),
      url VARCHAR(500),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_bookmark (userId, itemType, itemId),
      INDEX idx_user (userId)
    )
  `);
  return db;
}

export const bookmarksRouter = router({

  getAll: protectedProcedure
    .input(z.object({
      itemType: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await ensureBookmarksTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      let query = sql`
        SELECT id, itemType, itemId, title, titleFr, description, url, createdAt
        FROM learner_bookmarks
        WHERE userId = ${userId}
      `;
      if (input?.itemType) {
        query = sql`${query} AND itemType = ${input.itemType}`;
      }
      query = sql`${query} ORDER BY createdAt DESC`;

      const [rows] = await db.execute(query);
      return rows as any[];
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureBookmarksTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.execute(sql`
        DELETE FROM learner_bookmarks WHERE id = ${input.id} AND userId = ${userId}
      `);
      return { success: true };
    }),

  add: protectedProcedure
    .input(z.object({
      itemType: z.enum(["lesson", "exercise", "resource", "flashcard_deck", "vocabulary", "thread", "course"]),
      itemId: z.number(),
      title: z.string().optional(),
      titleFr: z.string().optional(),
      description: z.string().optional(),
      url: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await ensureBookmarksTable();
      const userId = ctx.user?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      // Upsert — ignore if already exists
      await db.execute(sql`
        INSERT IGNORE INTO learner_bookmarks (userId, itemType, itemId, title, titleFr, description, url)
        VALUES (${userId}, ${input.itemType}, ${input.itemId}, ${input.title ?? null}, ${input.titleFr ?? null}, ${input.description ?? null}, ${input.url ?? null})
      `);

      return { success: true };
    }),
});
