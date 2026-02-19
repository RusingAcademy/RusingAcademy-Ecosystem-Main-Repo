// server/middleware/featureFlagMiddleware.ts — Phase 0.1: Feature Flag Middleware
// Provides a tRPC middleware that gates procedures behind a feature flag.
// Usage: protectedProcedure.use(requireFeatureFlag("MEMBERSHIPS_ENABLED")).query(...)

import { TRPCError } from "@trpc/server";
import { featureFlagService } from "../services/featureFlagService";

/**
 * Creates a tRPC middleware that checks if a feature flag is enabled
 * before allowing the procedure to execute.
 *
 * @param flagKey - The feature flag key to check (e.g., "MEMBERSHIPS_ENABLED")
 * @returns A tRPC middleware function
 */
export function requireFeatureFlag(flagKey: string) {
  return async function featureFlagMiddleware(opts: {
    ctx: { user?: { id: number; role: string } | null };
    next: (opts?: any) => Promise<any>;
  }) {
    const { ctx, next } = opts;

    const context = ctx.user
      ? {
          userId: ctx.user.id,
          role: ctx.user.role,
          environment: process.env.NODE_ENV === "production" ? "production" : "staging",
        }
      : {
          userId: 0,
          role: "anonymous",
          environment: process.env.NODE_ENV === "production" ? "production" : "staging",
        };

    const enabled = await featureFlagService.isEnabled(flagKey, context);

    if (!enabled) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Feature "${flagKey}" is not currently enabled.`,
      });
    }

    return next({ ctx });
  };
}

/**
 * Express-style middleware for non-tRPC routes.
 * Checks if a feature flag is enabled before allowing the request to proceed.
 *
 * @param flagKey - The feature flag key to check
 */
export function requireFeatureFlagExpress(flagKey: string) {
  return async (req: any, res: any, next: any) => {
    const context = {
      userId: req.user?.id || 0,
      role: req.user?.role || "anonymous",
      environment: process.env.NODE_ENV === "production" ? "production" : "staging",
    };

    const enabled = await featureFlagService.isEnabled(flagKey, context);

    if (!enabled) {
      return res.status(403).json({
        error: `Feature "${flagKey}" is not currently enabled.`,
      });
    }

    next();
  };
}
