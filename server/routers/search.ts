import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { courses } from "../../drizzle/schema";

export const searchRouter = router({
  // Unified search across all content
  query: publicProcedure
    .input(z.object({
      query: z.string().min(2).max(100),
      types: z.array(z.enum(["coach", "course", "page", "faq"])).optional(),
      limit: z.number().min(1).max(50).default(20),
      // Course-specific filters
      courseLevel: z.union([
        z.enum(["beginner", "intermediate", "advanced", "all_levels"]),
        z.array(z.enum(["beginner", "intermediate", "advanced", "all_levels"]))
      ]).optional(),
      courseCategory: z.union([
        z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "exam_prep", "grammar", "vocabulary"]),
        z.array(z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "exam_prep", "grammar", "vocabulary"]))
      ]).optional(),
      freeOnly: z.boolean().optional(),
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional(),
    }))
    .query(async ({ input }) => {
      const { search } = await import("../search");
      return search(input.query, {
        types: input.types,
        limit: input.limit,
        courseLevel: input.courseLevel,
        courseCategory: input.courseCategory,
        freeOnly: input.freeOnly,
        priceRange: input.priceRange,
      });
    }),
  
  // Search courses only with filters
  courses: publicProcedure
    .input(z.object({
      query: z.string().min(2).max(100),
      level: z.union([
        z.enum(["beginner", "intermediate", "advanced", "all_levels"]),
        z.array(z.enum(["beginner", "intermediate", "advanced", "all_levels"]))
      ]).optional(),
      category: z.union([
        z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "exam_prep", "grammar", "vocabulary"]),
        z.array(z.enum(["sle_oral", "sle_written", "sle_reading", "sle_complete", "exam_prep", "grammar", "vocabulary"]))
      ]).optional(),
      freeOnly: z.boolean().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const { searchCourses } = await import("../search");
      return searchCourses(input.query, {
        courseLevel: input.level,
        courseCategory: input.category,
        freeOnly: input.freeOnly,
      }, input.limit);
    }),
  
  // Quick suggestions for autocomplete
  suggestions: publicProcedure
    .input(z.object({
      query: z.string().min(2).max(100),
    }))
    .query(async ({ input }) => {
      const { getQuickSuggestions } = await import("../search");
      return getQuickSuggestions(input.query);
    }),
});
