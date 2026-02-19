/**
 * Phase 5: HR Budget Forecasting tRPC Router
 */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import {
  createForecast,
  updateActual,
  getBudgetSummary,
  getBudgetCategories,
  generateProjection,
} from "../services/budgetForecastService";

export const budgetForecastRouter = router({
  /** Get budget summary for a year */
  summary: protectedProcedure
    .input(z.object({
      year: z.number().min(2020).max(2030),
      departmentId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return getBudgetSummary(input.year, input.departmentId);
    }),

  /** Create a new budget forecast entry */
  create: adminProcedure
    .input(z.object({
      year: z.number().min(2020).max(2030),
      quarter: z.number().min(1).max(4).optional(),
      departmentId: z.number().optional(),
      category: z.string(),
      plannedAmount: z.number().min(0),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = (ctx as any).user?.id;
      return createForecast({ ...input, createdBy: userId });
    }),

  /** Update actual amount for a forecast */
  updateActual: adminProcedure
    .input(z.object({
      forecastId: z.number(),
      actualAmount: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      await updateActual(input.forecastId, input.actualAmount);
      return { success: true };
    }),

  /** Get available budget categories */
  categories: protectedProcedure.query(async () => {
    return getBudgetCategories();
  }),

  /** Generate budget projection based on historical data */
  projection: protectedProcedure
    .input(z.object({
      year: z.number().min(2020).max(2030),
      departmentId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return generateProjection(input.year, input.departmentId);
    }),
});
