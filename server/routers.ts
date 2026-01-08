import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getApprovedCoaches,
  getCoachBySlug,
  getCoachByUserId,
  getCoachReviews,
  createCoachProfile,
  updateCoachProfile,
  getLearnerByUserId,
  createLearnerProfile,
  updateLearnerProfile,
  getUpcomingSessions,
  createAiSession,
  getLearnerAiSessions,
  getCommissionTiers,
  getCoachCommission,
  getCoachEarningsSummary,
  getCoachPayoutLedger,
  calculateCommissionRate,
  getReferralDiscount,
  getCoachReferralLink,
  createReferralLink,
  seedDefaultCommissionTiers,
  createCommissionTier,
  updateCommissionTier,
  getCoachAvailability,
  setCoachAvailability,
  getAvailableTimeSlotsForDate,
  getUserById,
} from "./db";
import {
  createConnectAccount,
  getOnboardingLink,
  checkAccountStatus,
  createDashboardLink,
  createCheckoutSession,
} from "./stripe/connect";
import { calculatePlatformFee } from "./stripe/products";
import { invokeLLM } from "./_core/llm";

// ============================================================================
// COACH ROUTER
// ============================================================================
const coachRouter = router({
  // List approved coaches with filters
  list: publicProcedure
    .input(
      z.object({
        language: z.enum(["french", "english", "both"]).optional(),
        specializations: z.array(z.string()).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const coaches = await getApprovedCoaches(input || {});
      return coaches.map(({ coach, user }) => ({
        id: coach.id,
        slug: coach.slug,
        name: user.name,
        avatarUrl: user.avatarUrl,
        headline: coach.headline,
        languages: coach.languages,
        specializations: coach.specializations,
        hourlyRate: coach.hourlyRate,
        trialRate: coach.trialRate,
        averageRating: coach.averageRating,
        totalSessions: coach.totalSessions,
        totalStudents: coach.totalStudents,
        successRate: coach.successRate,
        responseTimeHours: coach.responseTimeHours,
      }));
    }),

  // Get single coach by slug
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await getCoachBySlug(input.slug);
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }
      return {
        ...result.coach,
        name: result.user.name,
        avatarUrl: result.user.avatarUrl,
      };
    }),

  // Get coach reviews
  reviews: publicProcedure
    .input(z.object({ coachId: z.number(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await getCoachReviews(input.coachId, input.limit);
    }),

  // Get current user's coach profile
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return await getCoachByUserId(ctx.user.id);
  }),

  // Create coach profile (application)
  submitApplication: protectedProcedure
    .input(
      z.object({
        headline: z.string().min(10).max(200),
        bio: z.string().min(50).max(2000),
        languages: z.enum(["french", "english", "both"]),
        specializations: z.record(z.string(), z.boolean()),
        yearsExperience: z.number().min(0).max(50),
        credentials: z.string().max(500),
        hourlyRate: z.number().min(2000).max(20000), // $20-$200 in cents
        trialRate: z.number().min(0).max(10000),
        videoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a coach profile
      const existing = await getCoachByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a coach profile",
        });
      }

      // Generate slug from user name
      const baseName = ctx.user.name || "coach";
      const slug = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);

      await createCoachProfile({
        userId: ctx.user.id,
        slug,
        headline: input.headline,
        bio: input.bio,
        languages: input.languages,
        specializations: input.specializations,
        yearsExperience: input.yearsExperience,
        credentials: input.credentials,
        hourlyRate: input.hourlyRate,
        trialRate: input.trialRate,
        videoUrl: input.videoUrl || null,
        status: "pending",
      });

      return { success: true, slug };
    }),

  // Update coach profile
  update: protectedProcedure
    .input(
      z.object({
        headline: z.string().min(10).max(200).optional(),
        bio: z.string().min(50).max(2000).optional(),
        languages: z.enum(["french", "english", "both"]).optional(),
        specializations: z.record(z.string(), z.boolean()).optional(),
        hourlyRate: z.number().min(2000).max(20000).optional(),
        trialRate: z.number().min(0).max(10000).optional(),
        videoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }

      await updateCoachProfile(profile.id, input);
      return { success: true };
    }),

  // Get coach availability
  getAvailability: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getCoachByUserId(ctx.user.id);
    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
    }
    return await getCoachAvailability(profile.id);
  }),

  // Set coach availability (replace all slots)
  setAvailability: protectedProcedure
    .input(
      z.array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
          timezone: z.string().default("America/Toronto"),
          isActive: z.boolean().default(true),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getCoachByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
      }
      await setCoachAvailability(profile.id, input);
      return { success: true };
    }),

  // Get available time slots for a specific date (public)
  availableSlots: publicProcedure
    .input(
      z.object({
        coachId: z.number(),
        date: z.string(), // ISO date string
      })
    )
    .query(async ({ input }) => {
      const date = new Date(input.date);
      return await getAvailableTimeSlotsForDate(input.coachId, date);
    }),
});

// ============================================================================
// LEARNER ROUTER
// ============================================================================
const learnerRouter = router({
  // Get current user's learner profile
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    return await getLearnerByUserId(ctx.user.id);
  }),

  // Create learner profile
  create: protectedProcedure
    .input(
      z.object({
        department: z.string().max(200).optional(),
        position: z.string().max(200).optional(),
        currentLevel: z.object({
          reading: z.enum(["X", "A", "B", "C"]).optional(),
          writing: z.enum(["X", "A", "B", "C"]).optional(),
          oral: z.enum(["X", "A", "B", "C"]).optional(),
        }).optional(),
        targetLevel: z.object({
          reading: z.enum(["A", "B", "C"]).optional(),
          writing: z.enum(["A", "B", "C"]).optional(),
          oral: z.enum(["A", "B", "C"]).optional(),
        }).optional(),
        examDate: z.date().optional(),
        learningGoals: z.string().max(1000).optional(),
        primaryFocus: z.enum(["oral", "written", "reading", "all"]).default("oral"),
        targetLanguage: z.enum(["french", "english"]).default("french"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getLearnerByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a learner profile",
        });
      }

      await createLearnerProfile({
        userId: ctx.user.id,
        department: input.department || null,
        position: input.position || null,
        currentLevel: input.currentLevel || null,
        targetLevel: input.targetLevel || null,
        examDate: input.examDate || null,
        learningGoals: input.learningGoals || null,
        primaryFocus: input.primaryFocus,
        targetLanguage: input.targetLanguage,
      });

      return { success: true };
    }),

  // Update learner profile
  update: protectedProcedure
    .input(
      z.object({
        department: z.string().max(200).optional(),
        position: z.string().max(200).optional(),
        currentLevel: z.object({
          reading: z.enum(["X", "A", "B", "C"]).optional(),
          writing: z.enum(["X", "A", "B", "C"]).optional(),
          oral: z.enum(["X", "A", "B", "C"]).optional(),
        }).optional(),
        targetLevel: z.object({
          reading: z.enum(["A", "B", "C"]).optional(),
          writing: z.enum(["A", "B", "C"]).optional(),
          oral: z.enum(["A", "B", "C"]).optional(),
        }).optional(),
        examDate: z.date().optional(),
        learningGoals: z.string().max(1000).optional(),
        primaryFocus: z.enum(["oral", "written", "reading", "all"]).optional(),
        targetLanguage: z.enum(["french", "english"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await getLearnerByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Learner profile not found" });
      }

      await updateLearnerProfile(profile.id, input);
      return { success: true };
    }),

  // Get upcoming sessions
  upcomingSessions: protectedProcedure.query(async ({ ctx }) => {
    return await getUpcomingSessions(ctx.user.id, "learner");
  }),
});

// ============================================================================
// AI SESSION ROUTER (Prof Steven AI)
// ============================================================================
const aiRouter = router({
  // Start a practice session
  startPractice: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
        targetLevel: z.enum(["a", "b", "c"]).optional(),
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "practice",
        language: input.language,
        targetLevel: input.targetLevel,
      });

      return { sessionId: session[0].insertId };
    }),

  // Start placement test
  startPlacement: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "placement",
        language: input.language,
      });

      return { sessionId: session[0].insertId };
    }),

  // Start exam simulation
  startSimulation: protectedProcedure
    .input(
      z.object({
        language: z.enum(["french", "english"]),
        targetLevel: z.enum(["a", "b", "c"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learner = await getLearnerByUserId(ctx.user.id);
      if (!learner) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Please create a learner profile first",
        });
      }

      const session = await createAiSession({
        learnerId: learner.id,
        sessionType: "simulation",
        language: input.language,
        targetLevel: input.targetLevel,
      });

      return { sessionId: session[0].insertId };
    }),

  // Chat with Prof Steven AI
  chat: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        message: z.string().min(1).max(2000),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const systemPrompt = `You are Prof Steven AI, a friendly and encouraging language coach specializing in helping Canadian federal public servants prepare for their Second Language Evaluation (SLE) exams.

Your role:
- Help learners practice their French or English conversation skills
- Provide corrections and feedback in a supportive way
- Use vocabulary and scenarios relevant to the Canadian federal public service
- Adapt your language complexity to the learner's level
- Encourage and motivate learners

Guidelines:
- If practicing French, respond primarily in French with occasional English explanations for corrections
- If practicing English, respond primarily in English with occasional French explanations for corrections
- Keep responses conversational and natural
- Point out errors gently and provide the correct form
- Suggest improvements for more natural phrasing
- Use workplace scenarios: meetings, briefings, emails, presentations, etc.

Remember: You're preparing them for real SLE oral interaction exams, so focus on practical communication skills.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...input.conversationHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({ messages });

      const content = response.choices[0]?.message?.content;
      const responseText = typeof content === 'string' ? content : "I apologize, I couldn't generate a response. Please try again.";
      
      return {
        response: responseText,
      };
    }),

  // Get learner's AI session history
  history: protectedProcedure.query(async ({ ctx }) => {
    const learner = await getLearnerByUserId(ctx.user.id);
    if (!learner) return [];

    return await getLearnerAiSessions(learner.id);
  }),
});

// ============================================================================
// COMMISSION & PAYMENT ROUTER
// ============================================================================
const commissionRouter = router({
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

// ============================================================================
// STRIPE CONNECT ROUTER
// ============================================================================
const stripeRouter = router({
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
        origin: ctx.req.headers.origin || "https://lingueefy.com",
      });
      
      return { url };
    }),
});

// ============================================================================
// MAIN APP ROUTER
// ============================================================================
export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  coach: coachRouter,
  learner: learnerRouter,
  ai: aiRouter,
  commission: commissionRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
