import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createReferralLink,
  getCoachByUserId,
  getCoachCommission,
  getCoachEarningsSummary,
  getCoachPayoutLedger,
  getCoachReferralLink,
  getCommissionTiers,
  seedDefaultCommissionTiers,
} from "../db";

export const commissionRouter = router({
  // Get all commission tiers (admin)
  tiers: protectedProcedure.query(async () => {
    return await getCommissionTiers();
  }),

  // Get coach's current commission info
  myCommission: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) return null;
    
    const commission = await getCoachCommission(coach.id);
    const earnings = await getCoachEarningsSummary(coach.id);
    
    return {
      commission,
      earnings,
    };
  }),

  // Get coach's payout ledger
  myLedger: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const coach = await getCoachByUserId(ctx.user.id);
      if (!coach) return [];
      
      return await getCoachPayoutLedger(coach.id, input.limit);
    }),

  // Get coach's referral link
  myReferralLink: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) return null;
    
    return await getCoachReferralLink(coach.id);
  }),

  // Create referral link for coach
  createReferralLink: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    
    // Generate unique code
    const code = `${coach.slug}-${Date.now().toString(36)}`.slice(0, 20);
    
    await createReferralLink({
      coachId: coach.id,
      code,
      discountCommissionBps: 500, // 5% commission for referred bookings
      isActive: true,
    });
    
    return { code };
  }),

  // Seed default tiers (admin only)
  seedTiers: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    await seedDefaultCommissionTiers();
    return { success: true };
  }),
});

