// server/routers/video.ts — Phase 3: Native Video Rooms (Daily.co)
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { videoService } from "../services/videoService";
import { phase3Config } from "../config/phase3";

export const videoRouter = router({
  // Create a video room for a session (coach only)
  createRoom: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!phase3Config.video.enabled) {
        throw new Error("Native video is not enabled. Configure DAILY_API_KEY to enable.");
      }
      const userName = ctx.user?.name || "Coach";
      const result = await videoService.startSessionVideo(input.sessionId, ctx.user!.id, userName);
      return result;
    }),

  // Join a video room for a session (any participant)
  joinRoom: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userName = ctx.user?.name || "Participant";
      const result = await videoService.joinSessionVideo(input.sessionId, ctx.user!.id, userName);
      return result;
    }),

  // End a video session (coach only)
  endRoom: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      await videoService.endSessionVideo(input.sessionId);
      return { success: true };
    }),

  // Get recordings for a session
  getRecordings: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      return videoService.getRecordings(input.sessionId);
    }),

  // Check if video is enabled
  isEnabled: protectedProcedure.query(() => {
    return { enabled: phase3Config.video.enabled };
  }),
});
