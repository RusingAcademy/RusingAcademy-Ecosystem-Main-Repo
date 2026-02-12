import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createAiSession,
  getLearnerAiSessions,
  getLearnerByUserId,
} from "../db";
import { invokeLLM } from "../_core/llm";

export const aiRouter = router({
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

  // Chat with SLE AI Companion AI
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
      const systemPrompt = `You are SLE AI Companion AI, a friendly and encouraging language coach specializing in helping Canadian federal public servants prepare for their Second Language Evaluation (SLE) exams.

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

