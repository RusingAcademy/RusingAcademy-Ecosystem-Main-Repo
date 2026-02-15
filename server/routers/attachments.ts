import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";

// ============================================================================
// ATTACHMENTS ROUTER
// Handles file attachments for various entities (lessons, assignments, etc.)
// ============================================================================

export const attachmentsRouter = router({
  // List attachments for a given entity
  list: protectedProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return [];

      // Query attachments table if it exists, otherwise return empty
      try {
        const { sql } = await import("drizzle-orm");
        const results = await db.execute(
          sql`SELECT id, fileName, fileUrl, fileSize, mimeType, uploadedAt, uploadedBy
              FROM file_attachments
              WHERE entityType = ${input.entityType} AND entityId = ${input.entityId}
              ORDER BY uploadedAt DESC`
        );
        return (results as any)[0] || [];
      } catch {
        // Table may not exist yet — return empty gracefully
        return [];
      }
    }),

  // Delete an attachment
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return { success: false };

      try {
        const { sql } = await import("drizzle-orm");
        await db.execute(
          sql`DELETE FROM file_attachments WHERE id = ${input.id} AND uploadedBy = ${ctx.user.id}`
        );
        return { success: true };
      } catch {
        return { success: false };
      }
    }),

  // Upload metadata (actual file upload handled by S3/presigned URL)
  create: protectedProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number().optional(),
      mimeType: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) return { success: false, id: 0 };

      try {
        const { sql } = await import("drizzle-orm");
        const result = await db.execute(
          sql`INSERT INTO file_attachments (entityType, entityId, fileName, fileUrl, fileSize, mimeType, uploadedBy, uploadedAt)
              VALUES (${input.entityType}, ${input.entityId}, ${input.fileName}, ${input.fileUrl}, ${input.fileSize || 0}, ${input.mimeType || 'application/octet-stream'}, ${ctx.user.id}, NOW())`
        );
        return { success: true, id: (result as any)[0]?.insertId || 0 };
      } catch {
        return { success: false, id: 0 };
      }
    }),
});
