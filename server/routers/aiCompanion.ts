/**
 * Phase 5: AI Companion tRPC Router
 * Provides AI-powered learning assistance with caching
 */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getAIResponse, getCacheStats, clearCache } from "../services/aiCompanionService";

export const aiCompanionRouter = router({
  /** Ask the AI companion a question */
  ask: protectedProcedure
    .input(z.object({
      question: z.string().min(1).max(2000),
      context: z.enum(["general", "grammar", "vocabulary", "exam_prep", "writing"]).default("general"),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = (ctx as any).user?.id;
      const result = await getAIResponse(
        input.question,
        input.context,
        userId,
        input.conversationHistory
      );
      return result;
    }),

  /** Get AI cache statistics (admin only) */
  cacheStats: adminProcedure.query(async () => {
    return getCacheStats();
  }),

  /** Clear AI cache (admin only) */
  clearCache: adminProcedure.mutation(async () => {
    clearCache();
    return { success: true };
  }),
});
