import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  getConversations,
  getMessages,
  markMessagesAsRead,
  sendMessage,
  startConversation,
} from "../db";

export const messageRouter = router({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    const convs = await getConversations(ctx.user.id);
    return convs;
  }),
  
  list: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const msgs = await getMessages(input.conversationId, ctx.user.id);
      return msgs;
    }),
  
  send: protectedProcedure
    .input(z.object({ conversationId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const msg = await sendMessage(input.conversationId, ctx.user.id, input.content);
      return msg;
    }),
  
  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await markMessagesAsRead(input.conversationId, ctx.user.id);
      return { success: true };
    }),
  
  startConversation: protectedProcedure
    .input(z.object({ participantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const conv = await startConversation(ctx.user.id, input.participantId);
      return conv;
    }),
});
