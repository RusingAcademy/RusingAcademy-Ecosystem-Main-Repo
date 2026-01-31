/**
 * SLE AI Companion Router
 * Provides endpoints for conversational practice with coach voices
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { sleCompanionSessions, sleCompanionMessages } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import {
  getAvailableCoaches,
  getCoach,
  getConversationPrompts,
  getRandomPrompt,
  getFeedback,
  COACH_VOICES,
  type CoachKey,
} from "../services/sleAICompanionService";
import {
  generateCoachResponse,
  generateInitialGreeting,
  evaluateResponse,
  transcribeUserAudio,
  type ConversationContext,
  type SLELevel,
  type SLESkill,
} from "../services/sleConversationService";

export const sleCompanionRouter = router({
  // Get all available coaches
  getCoaches: publicProcedure.query(() => {
    return getAvailableCoaches();
  }),

  // Get a specific coach
  getCoach: publicProcedure
    .input(z.object({ coachKey: z.enum(["STEVEN", "SUE_ANNE", "ERIKA", "PRECIOSA"]) }))
    .query(({ input }) => {
      return getCoach(input.coachKey as CoachKey);
    }),

  // Get conversation prompts for a level and skill
  getPrompts: publicProcedure
    .input(
      z.object({
        level: z.enum(["A", "B", "C"]),
        skill: z.enum([
          "oral_expression",
          "oral_comprehension",
          "written_expression",
          "written_comprehension",
        ]),
      })
    )
    .query(({ input }) => {
      return getConversationPrompts(input.level, input.skill);
    }),

  // Get a random prompt for practice
  getRandomPrompt: publicProcedure
    .input(
      z.object({
        level: z.enum(["A", "B", "C"]),
        skill: z.enum([
          "oral_expression",
          "oral_comprehension",
          "written_expression",
          "written_comprehension",
        ]),
      })
    )
    .query(({ input }) => {
      return getRandomPrompt(input.level, input.skill);
    }),

  // Start a new practice session (persisted to database)
  startSession: protectedProcedure
    .input(
      z.object({
        coachKey: z.enum(["STEVEN", "SUE_ANNE", "ERIKA", "PRECIOSA"]),
        level: z.enum(["A", "B", "C"]),
        skill: z.enum([
          "oral_expression",
          "oral_comprehension",
          "written_expression",
          "written_comprehension",
        ]),
        topic: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const coach = getCoach(input.coachKey as CoachKey);
      
      // Generate initial greeting using LLM-powered service
      const greeting = generateInitialGreeting(
        input.coachKey as CoachKey,
        input.level as SLELevel,
        input.skill as SLESkill,
        input.topic
      );

      // Create session in database
      const [result] = await db.insert(sleCompanionSessions).values({
        userId: ctx.user.id,
        coachKey: input.coachKey,
        level: input.level,
        skill: input.skill,
        topic: input.topic || null,
        status: "active",
        totalMessages: 1,
      });

      const sessionId = result.insertId;

      // Save the initial greeting as the first message
      await db.insert(sleCompanionMessages).values({
        sessionId: Number(sessionId),
        role: "assistant",
        content: greeting,
      });

      return {
        sessionId: Number(sessionId),
        coach,
        level: input.level,
        skill: input.skill,
        topic: input.topic,
        welcomeMessage: greeting,
        voiceId: coach.id,
      };
    }),

  // Send a message to the coach and get an LLM-powered response
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        message: z.string().min(1),
        audioUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get session from database
      const [session] = await db
        .select()
        .from(sleCompanionSessions)
        .where(eq(sleCompanionSessions.id, input.sessionId))
        .limit(1);

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this session",
        });
      }

      // Get conversation history
      const previousMessages = await db
        .select()
        .from(sleCompanionMessages)
        .where(eq(sleCompanionMessages.sessionId, input.sessionId))
        .orderBy(sleCompanionMessages.createdAt);

      // Build conversation context
      const context: ConversationContext = {
        coachKey: session.coachKey as CoachKey,
        level: session.level as SLELevel,
        skill: session.skill as SLESkill,
        topic: session.topic || undefined,
        conversationHistory: previousMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      };

      // Save user message
      await db.insert(sleCompanionMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
        audioUrl: input.audioUrl || null,
      });

      // Generate LLM-powered coach response
      const { response } = await generateCoachResponse(input.message, context);

      // Evaluate user response
      const evaluation = await evaluateResponse(input.message, context);

      // Save coach response
      await db.insert(sleCompanionMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: response,
        score: evaluation.score,
        corrections: evaluation.corrections,
        suggestions: evaluation.suggestions,
      });

      // Update session stats
      await db
        .update(sleCompanionSessions)
        .set({
          totalMessages: session.totalMessages! + 2,
          averageScore: evaluation.score,
        })
        .where(eq(sleCompanionSessions.id, input.sessionId));

      const coach = getCoach(session.coachKey as CoachKey);

      return {
        sessionId: input.sessionId,
        coachResponse: response,
        coachVoiceId: coach.id,
        evaluation: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          corrections: evaluation.corrections,
          suggestions: evaluation.suggestions,
        },
        timestamp: new Date(),
      };
    }),

  // Transcribe audio from user
  transcribeAudio: protectedProcedure
    .input(
      z.object({
        audioUrl: z.string(),
        language: z.string().default("fr"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await transcribeUserAudio(input.audioUrl, input.language);
      
      if ("error" in result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error,
        });
      }

      return result;
    }),

  // End a session
  endSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [session] = await db
        .select()
        .from(sleCompanionSessions)
        .where(eq(sleCompanionSessions.id, input.sessionId))
        .limit(1);

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this session",
        });
      }

      // Update session status
      await db
        .update(sleCompanionSessions)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(sleCompanionSessions.id, input.sessionId));

      return { success: true };
    }),

  // Get user's session history
  getSessionHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }

      const sessions = await db
        .select()
        .from(sleCompanionSessions)
        .where(eq(sleCompanionSessions.userId, ctx.user.id))
        .orderBy(desc(sleCompanionSessions.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return sessions.map((session) => ({
        ...session,
        coach: getCoach(session.coachKey as CoachKey),
      }));
    }),

  // Get messages for a specific session
  getSessionMessages: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [session] = await db
        .select()
        .from(sleCompanionSessions)
        .where(eq(sleCompanionSessions.id, input.sessionId))
        .limit(1);

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this session",
        });
      }

      const messages = await db
        .select()
        .from(sleCompanionMessages)
        .where(eq(sleCompanionMessages.sessionId, input.sessionId))
        .orderBy(sleCompanionMessages.createdAt);

      return {
        session: {
          ...session,
          coach: getCoach(session.coachKey as CoachKey),
        },
        messages,
      };
    }),

  // Get feedback based on score
  getFeedback: publicProcedure
    .input(z.object({ score: z.number().min(0).max(100) }))
    .query(({ input }) => {
      return getFeedback(input.score);
    }),

  // Get coach voice ID for audio generation
  getCoachVoiceId: publicProcedure
    .input(z.object({ coachKey: z.enum(["STEVEN", "SUE_ANNE", "ERIKA", "PRECIOSA"]) }))
    .query(({ input }) => {
      const coach = COACH_VOICES[input.coachKey as CoachKey];
      return {
        voiceId: coach.id,
        coachName: coach.name,
      };
    }),

  // Generate voice response for coach using MiniMax TTS
  generateVoiceResponse: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(2000),
        coachKey: z.enum(["STEVEN", "SUE_ANNE", "ERIKA", "PRECIOSA"]),
      })
    )
    .mutation(async ({ input }) => {
      const coach = COACH_VOICES[input.coachKey as CoachKey];
      
      return {
        text: input.text,
        voiceId: coach.id,
        coachName: coach.name,
      };
    }),
});
