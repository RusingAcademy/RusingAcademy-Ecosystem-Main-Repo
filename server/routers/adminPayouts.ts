/**
 * Admin Payout Router
 * 
 * Sprint J3: Coach payout management endpoints for admin dashboard.
 * Provides endpoints to view pending payouts, trigger individual/batch payouts,
 * and view payout history.
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { createLogger } from "../logger";
import {
  getPendingPayouts,
  processCoachPayout,
  processAllPendingPayouts,
  getPayoutHistory,
} from "../services/coachPayoutService";

const log = createLogger("adminPayouts");

export const adminPayoutsRouter = router({
  /**
   * Get all coaches with pending payouts above the minimum threshold.
   */
  getPendingPayouts: protectedProcedure.query(async ({ ctx }) => {
    // Admin check
    if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await getPendingPayouts();
  }),

  /**
   * Process payout for a single coach.
   */
  processCoachPayout: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      log.info(`[AdminPayouts] Admin ${ctx.user.id} triggering payout for coach ${input.coachId}`);
      const result = await processCoachPayout(input.coachId);

      if (result.status === "failed") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.reason || "Payout failed",
        });
      }

      return result;
    }),

  /**
   * Process all pending payouts in batch.
   */
  processAllPayouts: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    log.info(`[AdminPayouts] Admin ${ctx.user.id} triggering batch payout`);
    return await processAllPendingPayouts();
  }),

  /**
   * Get payout history with pagination.
   */
  getPayoutHistory: protectedProcedure
    .input(
      z.object({
        coachId: z.number().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      return await getPayoutHistory({
        coachId: input?.coachId,
        limit: input?.limit,
        offset: input?.offset,
      });
    }),

  /**
   * Get payout dashboard summary stats.
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    const pending = await getPendingPayouts();
    const history = await getPayoutHistory({ limit: 1000 });

    const totalPendingAmount = pending.reduce((sum, p) => sum + p.pendingAmount, 0);
    const totalPaidOut = history.payouts.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    const coachesWithPending = pending.length;
    const totalPayoutsProcessed = history.total;

    return {
      totalPendingAmount,
      totalPaidOut,
      coachesWithPending,
      totalPayoutsProcessed,
      pendingCoaches: pending,
    };
  }),
});
