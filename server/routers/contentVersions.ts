/**
 * Content Versions Router (Sprint K5)
 * 
 * Admin endpoints for viewing version history, comparing versions,
 * and restoring content to previous versions.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getVersionHistory,
  getVersion,
  restoreVersion,
  compareVersions,
} from "../services/contentVersionService";

function adminGuard(role: string) {
  if (role !== "admin" && role !== "owner") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
}

export const contentVersionsRouter = router({
  /**
   * Get version history for a content entity.
   */
  getHistory: protectedProcedure
    .input(z.object({
      entityType: z.enum(["course", "lesson", "module", "quiz"]),
      entityId: z.number(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      adminGuard(ctx.user.role);
      return getVersionHistory(input.entityType, input.entityId, input.limit);
    }),

  /**
   * Get a specific version snapshot.
   */
  getVersion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      adminGuard(ctx.user.role);
      const version = await getVersion(input.id);
      if (!version) throw new TRPCError({ code: "NOT_FOUND", message: "Version not found" });
      return version;
    }),

  /**
   * Restore an entity to a specific version.
   */
  restore: protectedProcedure
    .input(z.object({ versionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx.user.role);
      return restoreVersion(input.versionId, ctx.user.id, ctx.user.name ?? "Admin");
    }),

  /**
   * Compare two versions of the same entity.
   */
  compare: protectedProcedure
    .input(z.object({
      versionIdA: z.number(),
      versionIdB: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      adminGuard(ctx.user.role);
      return compareVersions(input.versionIdA, input.versionIdB);
    }),
});
