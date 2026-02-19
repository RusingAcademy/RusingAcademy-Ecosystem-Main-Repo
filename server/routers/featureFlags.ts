// server/routers/featureFlags.ts — Phase 4: Feature Flags CRUD + evaluation
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { featureFlagService } from "../services/featureFlagService";

export const featureFlagsRouter = router({
  // Get all flags (admin only)
  list: adminProcedure.query(async () => {
    return featureFlagService.getAllFlags();
  }),

  // Get user's evaluated flags (any authenticated user)
  getUserFlags: protectedProcedure.query(async ({ ctx }) => {
    return featureFlagService.getUserFlags({
      userId: ctx.user.id,
      role: ctx.user.role || "learner",
    });
  }),

  // Check a single flag
  check: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      return featureFlagService.isEnabled(input.key, {
        userId: ctx.user.id,
        role: ctx.user.role || "learner",
      });
    }),

  // Create a flag (admin only)
  create: adminProcedure
    .input(z.object({
      key: z.string().min(1).max(100).regex(/^[a-z0-9_.-]+$/, "Key must be lowercase alphanumeric with dots, dashes, or underscores"),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      environment: z.enum(["all", "development", "staging", "production"]).optional(),
      rolloutPercentage: z.number().min(0).max(100).optional(),
      targetUserIds: z.array(z.number()).optional(),
      targetRoles: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return featureFlagService.createFlag({
        ...input,
        createdBy: ctx.user.id,
      });
    }),

  // Update a flag (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      environment: z.enum(["all", "development", "staging", "production"]).optional(),
      rolloutPercentage: z.number().min(0).max(100).optional(),
      targetUserIds: z.array(z.number()).optional(),
      targetRoles: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return featureFlagService.updateFlag(id, data, ctx.user.id);
    }),

  // Toggle a flag (admin only)
  toggle: adminProcedure
    .input(z.object({ id: z.number(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return featureFlagService.updateFlag(input.id, { enabled: input.enabled }, ctx.user.id);
    }),

  // Delete a flag (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await featureFlagService.deleteFlag(input.id);
      return { success: true };
    }),

  // Get flag history (admin only)
  history: adminProcedure
    .input(z.object({ flagId: z.number() }))
    .query(async ({ input }) => {
      return featureFlagService.getHistory(input.flagId);
    }),
});
