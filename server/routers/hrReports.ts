// server/routers/hrReports.ts — Phase 4: HR PDF Reports router
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { pdfReportService } from "../services/pdfReportService";

export const hrReportsRouter = router({
  // Generate a new report
  generate: protectedProcedure
    .input(z.object({
      type: z.enum(["candidates", "interviews", "onboarding", "compliance", "team"]),
      dateRange: z.object({
        start: z.string().transform((s) => new Date(s)),
        end: z.string().transform((s) => new Date(s)),
      }),
      filters: z.record(z.unknown()).optional(),
      locale: z.enum(["en", "fr"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return pdfReportService.generateReport({
        type: input.type,
        dateRange: input.dateRange,
        filters: input.filters,
        locale: input.locale || "en",
        userId: ctx.user.id,
      });
    }),

  // Get report history
  history: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return pdfReportService.getReportHistory(ctx.user.id, input?.limit || 20);
    }),

  // Cleanup expired reports (admin)
  cleanup: protectedProcedure.mutation(async () => {
    const count = await pdfReportService.cleanupExpired();
    return { cleaned: count };
  }),
});
