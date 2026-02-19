/**
 * Chat Router — Phase 2
 * tRPC endpoints for group/course/community chat
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createRoom,
  getUserRooms,
  getRoomMembers,
  sendMessage,
  getRoomMessages,
  markRoomAsRead,
  editMessage,
  deleteMessage,
} from "../services/chatService";

export const chatRouter = router({
  /**
   * Create a new chat room
   */
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        type: z.enum(["direct", "course", "module", "community"]),
        referenceId: z.number().int().positive().optional(),
        memberIds: z.array(z.number().int().positive()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createRoom(ctx.user.id, input);
    }),

  /**
   * Get all rooms the current user is a member of
   */
  getMyRooms: protectedProcedure.query(async ({ ctx }) => {
    return getUserRooms(ctx.user.id);
  }),

  /**
   * Get members of a specific room
   */
  getRoomMembers: protectedProcedure
    .input(z.object({ roomId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getRoomMembers(input.roomId);
    }),

  /**
   * Send a message to a room
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
        messageType: z.enum(["text", "image", "file", "system"]).optional(),
        replyToId: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return sendMessage(ctx.user.id, input);
    }),

  /**
   * Get messages in a room (paginated, newest first)
   */
  getMessages: protectedProcedure
    .input(
      z.object({
        roomId: z.number().int().positive(),
        limit: z.number().int().min(1).max(100).optional().default(50),
        before: z.number().int().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      return getRoomMessages(input.roomId, input.limit, input.before);
    }),

  /**
   * Mark all messages in a room as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ roomId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return markRoomAsRead(ctx.user.id, input.roomId);
    }),

  /**
   * Edit a message (only by sender)
   */
  editMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return editMessage(ctx.user.id, input.messageId, input.content);
    }),

  /**
   * Delete a message (soft delete, only by sender)
   */
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return deleteMessage(ctx.user.id, input.messageId);
    }),
});
