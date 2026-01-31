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

  // Upload and transcribe audio from user
  uploadAndTranscribeAudio: protectedProcedure
    .input(
      z.object({
        audioBase64: z.string(),
        mimeType: z.string().default("audio/webm"),
        sessionId: z.number(),
        language: z.string().default("fr"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Import storage helper
      const { storagePut } = await import("../storage");
      
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(input.audioBase64, "base64");
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = input.mimeType === "audio/webm" ? "webm" : "mp3";
      const fileName = `sle-companion/${ctx.user.id}/${input.sessionId}/${timestamp}.${extension}`;
      
      // Upload to S3
      const { url: audioUrl } = await storagePut(fileName, audioBuffer, input.mimeType);
      
      // Transcribe using Whisper
      const transcriptionResult = await transcribeUserAudio(audioUrl, input.language);
      
      if ("error" in transcriptionResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: transcriptionResult.error,
        });
      }

      return {
        audioUrl,
        transcription: transcriptionResult.text,
        language: transcriptionResult.language,
      };
    }),

  // Transcribe audio from URL (legacy)
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

  // Get session summary with statistics and recommendations
  getSessionSummary: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get session
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

      // Get all messages
      const messages = await db
        .select()
        .from(sleCompanionMessages)
        .where(eq(sleCompanionMessages.sessionId, input.sessionId))
        .orderBy(sleCompanionMessages.createdAt);

      // Calculate statistics
      const userMessages = messages.filter((m) => m.role === "user");
      const coachMessages = messages.filter((m) => m.role === "assistant");
      const scores = coachMessages
        .map((m) => m.score)
        .filter((s): s is number => s !== null);
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      // Calculate duration
      const startTime = session.createdAt ? new Date(session.createdAt).getTime() : 0;
      const endTime = session.completedAt
        ? new Date(session.completedAt).getTime()
        : Date.now();
      const durationMinutes = Math.round((endTime - startTime) / 60000);

      // Generate recommendations based on performance
      const recommendations: string[] = [];
      if (avgScore < 60) {
        recommendations.push(
          "Pratiquez davantage les structures de phrases de base.",
          "Révisez le vocabulaire professionnel du niveau " + session.level + ".",
          "Écoutez les audios de prononciation dans la bibliothèque audio."
        );
      } else if (avgScore < 80) {
        recommendations.push(
          "Continuez à pratiquer pour améliorer votre fluidité.",
          "Travaillez sur les nuances et expressions idiomatiques.",
          "Essayez des exercices de dictée pour renforcer votre compréhension."
        );
      } else {
        recommendations.push(
          "Excellent travail! Passez au niveau supérieur.",
          "Pratiquez des scénarios plus complexes.",
          "Aidez d'autres apprenants en partageant vos conseils."
        );
      }

      // Skill-specific recommendations
      const skillRecommendations: Record<string, string[]> = {
        oral_expression: [
          "Enregistrez-vous et comparez avec les audios des coaches.",
          "Pratiquez les exercices de répétition.",
        ],
        oral_comprehension: [
          "Écoutez les audios sans regarder la transcription.",
          "Faites des exercices de dictée régulièrement.",
        ],
        written_expression: [
          "Rédigez des courriels professionnels chaque jour.",
          "Utilisez le correcteur pour identifier vos erreurs récurrentes.",
        ],
        written_comprehension: [
          "Lisez des documents officiels en français.",
          "Pratiquez la synthèse de textes.",
        ],
      };

      if (session.skill && skillRecommendations[session.skill]) {
        recommendations.push(...skillRecommendations[session.skill]);
      }

      const coach = getCoach(session.coachKey as CoachKey);

      return {
        session: {
          id: session.id,
          coachId: session.coachKey,
          coachName: coach.name,
          coachImage: coach.image,
          level: session.level,
          skill: session.skill,
          topic: session.topic,
          status: session.status,
          createdAt: session.createdAt,
          completedAt: session.completedAt,
        },
        statistics: {
          totalMessages: messages.length,
          userMessages: userMessages.length,
          coachMessages: coachMessages.length,
          averageScore: avgScore,
          highestScore: scores.length > 0 ? Math.max(...scores) : 0,
          lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
          durationMinutes,
        },
        performance: {
          level: avgScore >= 80 ? "excellent" : avgScore >= 60 ? "good" : "needs_improvement",
          progressIndicator: avgScore >= 80 ? "🌟" : avgScore >= 60 ? "📈" : "💪",
          message:
            avgScore >= 80
              ? "Excellent travail! Vous maîtrisez bien ce niveau."
              : avgScore >= 60
              ? "Bon travail! Continuez à pratiquer pour vous améliorer."
              : "Continuez vos efforts! La pratique régulière vous aidera à progresser.",
        },
        recommendations: recommendations.slice(0, 5),
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          score: m.score,
          corrections: m.corrections,
          suggestions: m.suggestions,
          createdAt: m.createdAt,
        })),
      };
    }),
});
