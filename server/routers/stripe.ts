import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import {
  calculateCommissionRate,
  getCoachBySlug,
  getCoachByUserId,
  getDb,
  getLearnerByUserId,
  getReferralDiscount,
  getUserById,
  updateCoachProfile,
} from "../db";
import { courses, sessions } from "../../drizzle/schema";
import { calculatePlatformFee } from "../stripe/products";
import { createConnectAccount, getOnboardingLink, checkAccountStatus, createDashboardLink, createCheckoutSession } from "../stripe/connect";

export const stripeRouter = router({
  // Validate coupon code
  validateCoupon: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const { promoCoupons } = await import("../../drizzle/schema");
      
      const [coupon] = await db.select().from(promoCoupons)
        .where(and(
          eq(promoCoupons.code, input.code.toUpperCase()),
          eq(promoCoupons.isActive, true)
        ));
      
      if (!coupon) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid coupon code" });
      }
      
      // Check expiry
      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This coupon has expired" });
      }
      
      // Check usage limit
      if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This coupon has reached its usage limit" });
      }
      
      return {
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
      };
    }),

  // Start Stripe Connect onboarding for coach
  startOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    
    if (coach.stripeAccountId) {
      // Already has account, get new onboarding link
      const url = await getOnboardingLink(coach.stripeAccountId);
      return { url, accountId: coach.stripeAccountId };
    }
    
    // Create new Connect account
    const { accountId, onboardingUrl } = await createConnectAccount({
      email: ctx.user.email || "",
      name: ctx.user.name || "Coach",
      coachId: coach.id,
    });
    
    // Save account ID to coach profile
    await updateCoachProfile(coach.id, { stripeAccountId: accountId });
    
    return { url: onboardingUrl, accountId };
  }),

  // Check Stripe account status
  accountStatus: protectedProcedure.query(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach || !coach.stripeAccountId) {
      return { hasAccount: false, isOnboarded: false };
    }
    
    const status = await checkAccountStatus(coach.stripeAccountId);
    
    // Update onboarded status in profile
    if (status.isOnboarded && !coach.stripeOnboarded) {
      await updateCoachProfile(coach.id, { stripeOnboarded: true });
    }
    
    return { hasAccount: true, ...status };
  }),

  // Get Stripe Express dashboard link
  dashboardLink: protectedProcedure.mutation(async ({ ctx }) => {
    const coach = await getCoachByUserId(ctx.user.id);
    if (!coach || !coach.stripeAccountId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No Stripe account found" });
    }
    
    const url = await createDashboardLink(coach.stripeAccountId);
    return { url };
  }),

  // Create checkout session for booking
  createCheckout: protectedProcedure
    .input(z.object({
      coachId: z.number(),
      sessionType: z.enum(["trial", "single", "package"]),
      packageSize: z.enum(["5", "10"]).optional(),
      sessionDate: z.string().optional(), // ISO date string
      sessionTime: z.string().optional(), // Time string like "10:00 AM"
      couponId: z.number().optional(), // Promo coupon ID
    }))
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Please create a learner profile first" });
      }
      
      const coachResult = await getCoachBySlug(""); // We need coach by ID
      // For now, get coach profile directly
      const coach = await getCoachByUserId(input.coachId);
      if (!coach || !coach.stripeAccountId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found or not set up for payments" });
      }
      
      // Calculate amount based on session type
      let amountCents = 0;
      if (input.sessionType === "trial") {
        amountCents = coach.trialRate || 2500; // Default $25
      } else if (input.sessionType === "package") {
        const sessions = input.packageSize === "10" ? 10 : 5;
        const discount = input.packageSize === "10" ? 0.15 : 0.10;
        amountCents = Math.round((coach.hourlyRate || 5500) * sessions * (1 - discount));
      } else {
        amountCents = coach.hourlyRate || 5500; // Default $55
      }
      
      // Apply coupon discount if provided
      let couponDiscountCents = 0;
      if (input.couponId) {
        const db = await getDb();
        if (db) {
          const { promoCoupons, couponRedemptions } = await import("../../drizzle/schema");
          const [coupon] = await db.select().from(promoCoupons).where(eq(promoCoupons.id, input.couponId));
          
          if (coupon && coupon.isActive) {
            if (coupon.discountType === "percentage") {
              couponDiscountCents = Math.round(amountCents * coupon.discountValue / 100);
            } else if (coupon.discountType === "fixed_amount") {
              couponDiscountCents = coupon.discountValue;
            } else if (coupon.discountType === "free_trial" && input.sessionType === "trial") {
              couponDiscountCents = amountCents;
            }
            
            // Record redemption
            const originalAmountCents = amountCents;
            const finalAmountCents = Math.max(0, amountCents - couponDiscountCents);
            await db.insert(couponRedemptions).values({
              couponId: coupon.id,
              userId: ctx.user.id,
              discountAmount: couponDiscountCents,
              originalAmount: originalAmountCents,
              finalAmount: finalAmountCents,
            });
            
            // Increment usage count
            await db.update(promoCoupons)
              .set({ usedCount: (coupon.usedCount || 0) + 1 })
              .where(eq(promoCoupons.id, coupon.id));
          }
        }
      }
      
      // Apply coupon discount
      amountCents = Math.max(0, amountCents - couponDiscountCents);
      
      // Calculate commission
      const isTrialSession = input.sessionType === "trial";
      const { commissionBps } = await calculateCommissionRate(coach.id, isTrialSession);
      
      // Check for referral discount
      const referral = await getReferralDiscount(learner.id, coach.id);
      const finalCommissionBps = referral.hasReferral ? referral.discountBps : commissionBps;
      
      const { platformFeeCents } = calculatePlatformFee(amountCents, finalCommissionBps);
      
      // Get coach user info for email
      const coachUser = await getUserById(coach.userId);
      
      const { url } = await createCheckoutSession({
        coachStripeAccountId: coach.stripeAccountId,
        coachId: coach.id,
        coachUserId: coach.userId,
        coachName: coachUser?.name || "Coach",
        learnerId: learner.id,
        learnerUserId: ctx.user.id,
        learnerEmail: ctx.user.email || "",
        learnerName: ctx.user.name || "Learner",
        sessionType: input.sessionType,
        packageSize: input.packageSize ? parseInt(input.packageSize) as 5 | 10 : undefined,
        amountCents,
        platformFeeCents,
        duration: input.sessionType === "trial" ? 30 : 60,
        sessionDate: input.sessionDate,
        sessionTime: input.sessionTime,
        origin: ctx.req.headers.origin || "https://www.rusingacademy.ca",
      });
      
      return { url };
    }),
  // ============================================================================
  // COURSE PURCHASE (Path Series™)
  // ============================================================================
  
  // Create checkout session for course purchase
  createCourseCheckout: protectedProcedure
    .input(z.object({
      courseId: z.string(),
      locale: z.enum(['en', 'fr']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { createCourseCheckoutSession } = await import('../services/stripeCourseService');
      
      const origin = ctx.req.headers.origin || 'https://www.rusingacademy.ca';
      
      const { url, sessionId } = await createCourseCheckoutSession({
        courseId: input.courseId,
        userId: ctx.user.id,
        userEmail: ctx.user.email || '',
        userName: ctx.user.name || undefined,
        successUrl: `${origin}/courses/success`,
        cancelUrl: `${origin}/curriculum`,
        locale: input.locale || 'en',
      });
      
      return { url, sessionId };
    }),
  
  // Create checkout session for coaching plan purchase
  createCoachingPlanCheckout: protectedProcedure
    .input(z.object({
      planId: z.string(),
      locale: z.enum(['en', 'fr']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { createCoachingPlanCheckoutSession } = await import('../services/stripeCourseService');
      
      const origin = ctx.req.headers.origin || 'https://www.rusingacademy.ca';
      
      const { url, sessionId } = await createCoachingPlanCheckoutSession({
        planId: input.planId,
        userId: ctx.user.id,
        userEmail: ctx.user.email || '',
        userName: ctx.user.name || undefined,
        successUrl: `${origin}/lingueefy/success`,
        cancelUrl: `${origin}/lingueefy`,
        locale: input.locale || 'en',
      });
      
      return { url, sessionId };
    }),
  
  // Get available courses
  getCourses: publicProcedure.query(async () => {
    const { getAllCourses } = await import('../services/stripeCourseService');
    return getAllCourses();
  }),
  
  // Get available coaching plans
  getCoachingPlans: publicProcedure.query(async () => {
    const { getAllCoachingPlans } = await import('../services/stripeCourseService');
    return getAllCoachingPlans();
  }),
});

