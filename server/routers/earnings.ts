/**
 * Phase 5: Coach Earnings Dashboard tRPC Router
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getEarningsSummary, getPayoutHistory } from "../services/earningsService";

export const earningsRouter = router({
  /** Get earnings summary for the current coach */
  summary: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .query(async ({ input, ctx }) => {
      const coachId = (ctx as any).user?.id;
      if (!coachId) throw new Error("Not authenticated");
      
      const startDate = input?.startDate ? new Date(input.startDate) : undefined;
      const endDate = input?.endDate ? new Date(input.endDate) : undefined;
      
      return getEarningsSummary(coachId, startDate, endDate);
    }),

  /** Get payout history */
  payouts: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input, ctx }) => {
      const coachId = (ctx as any).user?.id;
      if (!coachId) throw new Error("Not authenticated");
      
      return getPayoutHistory(coachId, input?.limit || 20, input?.offset || 0);
    }),
});
