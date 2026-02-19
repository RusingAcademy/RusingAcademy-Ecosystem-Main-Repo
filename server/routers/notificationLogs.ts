/**
 * Notification Logs Router — PR 0.2
 * Admin-only tRPC procedures for querying notification delivery logs.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getNotificationLogsForUser,
  getNotificationStats,
} from "../services/notificationLogService";

export const notificationLogsRouter = router({
  /**
   * Get notification logs for a specific user (admin only)
   */
  forUser: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        channel: z.enum(["push", "websocket", "email"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getNotificationLogsForUser(input.userId, {
        limit: input.limit,
        offset: input.offset,
        channel: input.channel,
      });
    }),

  /**
   * Get aggregate notification stats (admin only)
   */
  stats: protectedProcedure
    .input(
      z.object({
        startDate: z.string().transform((s) => new Date(s)),
        endDate: z.string().transform((s) => new Date(s)),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getNotificationStats(input.startDate, input.endDate);
    }),
});
