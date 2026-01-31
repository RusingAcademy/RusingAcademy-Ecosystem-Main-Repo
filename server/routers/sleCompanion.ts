/**
 * SLE AI Companion Router
 * Provides endpoints for conversational practice with coach voices
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  getAvailableCoaches,
  getCoach,
  getConversationPrompts,
  getRandomPrompt,
  getFeedback,
  generateCoachResponseText,
  COACH_VOICES,
  type CoachKey,
} from "../services/sleAICompanionService";

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

  // Start a practice session
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
      })
    )
    .mutation(({ input }) => {
      const coach = getCoach(input.coachKey as CoachKey);
      const prompt = getRandomPrompt(input.level, input.skill);

      return {
        sessionId: `session_${Date.now()}`,
        coach,
        level: input.level,
        skill: input.skill,
        initialPrompt: prompt,
        welcomeMessage: `Bonjour! Je suis ${coach.name}. Aujourd'hui, nous allons pratiquer ensemble. ${prompt}`,
      };
    }),

  // Send a message to the coach and get a response
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        coachKey: z.enum(["STEVEN", "SUE_ANNE", "ERIKA", "PRECIOSA"]),
        level: z.enum(["A", "B", "C"]),
        skill: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ input }) => {
      const coach = getCoach(input.coachKey as CoachKey);
      const responseText = generateCoachResponseText(
        input.message,
        input.level,
        input.skill,
        coach.name
      );

      return {
        sessionId: input.sessionId,
        coachResponse: responseText,
        coachVoiceId: coach.id,
        timestamp: new Date(),
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
      
      // Return the voice ID and text for frontend to call MiniMax
      // The actual TTS call will be made via the audio router
      return {
        text: input.text,
        voiceId: coach.id,
        coachName: coach.name,
        // Frontend will use audio.generateCoachAudio endpoint for actual TTS
      };
    }),
});
