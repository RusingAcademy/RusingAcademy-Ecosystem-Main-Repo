/**
 * Audio Router
 * 
 * tRPC endpoints for generating and managing audio content
 * using MiniMax text-to-speech for French pronunciation exercises.
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  generateAudio,
  generateFrenchPronunciation,
  generateListeningExercise,
  generateSLEPracticeAudio,
  generateCoachAudio,
  FRENCH_VOICES,
  ENGLISH_VOICES,
  COACH_VOICES,
} from "../services/minimaxAudioService";

export const audioRouter = router({
  // Generate pronunciation audio for a French phrase
  generatePronunciation: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(500),
      lessonId: z.number().optional(),
      voiceGender: z.enum(['male', 'female']).optional(),
      speed: z.number().min(0.5).max(2.0).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await generateFrenchPronunciation(input.text, {
        lessonId: input.lessonId,
        voiceGender: input.voiceGender || 'male',
        speed: input.speed,
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate audio",
        });
      }

      return {
        success: true,
        audioUrl: result.publicUrl,
        voiceUsed: result.voiceUsed,
      };
    }),

  // Generate listening exercise audio
  generateListening: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(2000),
      exerciseId: z.number().optional(),
      voiceGender: z.enum(['male', 'female']).optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await generateListeningExercise(input.text, {
        exerciseId: input.exerciseId,
        voiceGender: input.voiceGender || 'male',
        difficulty: input.difficulty || 'intermediate',
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate listening audio",
        });
      }

      return {
        success: true,
        audioUrl: result.publicUrl,
        voiceUsed: result.voiceUsed,
      };
    }),

  // Generate SLE practice audio
  generateSLE: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(3000),
      type: z.enum(['oral_comprehension', 'oral_expression', 'reading']),
      level: z.enum(['A', 'B', 'C']),
    }))
    .mutation(async ({ input }) => {
      const result = await generateSLEPracticeAudio(
        input.text,
        input.type,
        input.level
      );

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate SLE audio",
        });
      }

      return {
        success: true,
        audioUrl: result.publicUrl,
        voiceUsed: result.voiceUsed,
      };
    }),

  // Get available voices
  getVoices: publicProcedure.query(async () => {
    return {
      french: [
        { id: FRENCH_VOICES.MALE_NARRATOR, name: 'Male Narrator', gender: 'male', description: 'Professional narrator voice' },
        { id: FRENCH_VOICES.LEVEL_HEADED_MAN, name: 'Level-Headed Man', gender: 'male', description: 'Clear, composed delivery' },
        { id: FRENCH_VOICES.CASUAL_MAN, name: 'Casual Man', gender: 'male', description: 'Conversational, approachable' },
        { id: FRENCH_VOICES.FEMALE_ANCHOR, name: 'Female Anchor', gender: 'female', description: 'Patient, professional presenter' },
        { id: FRENCH_VOICES.MOVIE_LEAD_FEMALE, name: 'Movie Lead Female', gender: 'female', description: 'Expressive, engaging' },
        { id: FRENCH_VOICES.FEMALE_NEWS, name: 'Female News', gender: 'female', description: 'Clear broadcast style' },
      ],
      english: [
        { id: ENGLISH_VOICES.COMPELLING_LADY, name: 'Compelling Lady', gender: 'female', description: 'Bright, articulate storyteller' },
        { id: ENGLISH_VOICES.TRUSTWORTHY_MAN, name: 'Trustworthy Man', gender: 'male', description: 'Warm, mentor-like' },
        { id: ENGLISH_VOICES.GENTLE_TEACHER, name: 'Gentle Teacher', gender: 'male', description: 'Patient, educational' },
        { id: ENGLISH_VOICES.EXPRESSIVE_NARRATOR, name: 'Expressive Narrator', gender: 'male', description: 'Crisp, modulated' },
      ],
    };
  }),

  // Generate sample pronunciation for preview (public, limited)
  generateSample: publicProcedure
    .input(z.object({
      text: z.string().min(1).max(100),
      voiceId: z.string().optional(),
      language: z.enum(['french', 'english']).optional(),
    }))
    .mutation(async ({ input }) => {
      const voiceId = input.voiceId || 
        (input.language === 'english' ? ENGLISH_VOICES.TRUSTWORTHY_MAN : FRENCH_VOICES.MALE_NARRATOR);
      
      const result = await generateAudio({
        text: input.text,
        voiceId,
        speed: 1.0,
        emotion: 'neutral',
        languageBoost: input.language === 'english' ? 'English' : 'French',
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate sample audio",
        });
      }

      return {
        success: true,
        audioUrl: result.publicUrl,
      };
    }),

  // Generate personalized coaching audio using cloned coach voices
  generateCoachAudio: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(2000),
      coachName: z.enum(['steven', 'sue_anne', 'erika', 'preciosa']),
      speed: z.number().min(0.5).max(2.0).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await generateCoachAudio(
        input.text,
        input.coachName,
        { speed: input.speed }
      );

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate coach audio",
        });
      }

      return {
        success: true,
        audioUrl: result.publicUrl,
        voiceUsed: result.voiceUsed,
        coachName: input.coachName,
      };
    }),

  // Get coach voices
  getCoachVoices: publicProcedure.query(async () => {
    return {
      coaches: [
        { id: COACH_VOICES.STEVEN, name: 'Coach Steven', slug: 'steven', description: 'Steven Barholere - Lead Coach' },
        { id: COACH_VOICES.SUE_ANNE, name: 'Coach Sue-Anne', slug: 'sue_anne', description: 'Sue-Anne - Senior Coach' },
        { id: COACH_VOICES.ERIKA, name: 'Coach Erika', slug: 'erika', description: 'Erika - French Specialist' },
        { id: COACH_VOICES.PRECIOSA, name: 'Coach Preciosa', slug: 'preciosa', description: 'Preciosa - Oral Expression Expert' },
      ],
    };
  }),
});

export type AudioRouter = typeof audioRouter;
