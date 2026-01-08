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
} from "./db";
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
});

export type AppRouter = typeof appRouter;
