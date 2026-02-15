import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import {
  deleteNotification,
  getDb,
  getUnreadNotificationCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../db";

export const notificationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await getUserNotifications(ctx.user.id);
    return notifications;
  }),
  
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotificationCount(ctx.user.id);
  }),
  
  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await markNotificationAsRead(input.id, ctx.user.id);
      return { success: true };
    }),
  
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsAsRead(ctx.user.id);
    return { success: true };
  }),
  
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteNotification(input.id, ctx.user.id);
      return { success: true };
    }),
  
  // In-app notifications
  getInAppNotifications: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const { inAppNotifications } = await import("../../drizzle/schema");
    
    const notifications = await db.select().from(inAppNotifications)
      .where(eq(inAppNotifications.userId, ctx.user.id))
      .orderBy(desc(inAppNotifications.createdAt))
      .limit(50);
    
    return notifications;
  }),
  
  markNotificationRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { inAppNotifications } = await import("../../drizzle/schema");
      
      await db.update(inAppNotifications)
        .set({ isRead: true })
        .where(and(
          eq(inAppNotifications.id, input.notificationId),
          eq(inAppNotifications.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),
  
  markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const { inAppNotifications } = await import("../../drizzle/schema");
    
    await db.update(inAppNotifications)
      .set({ isRead: true })
      .where(eq(inAppNotifications.userId, ctx.user.id));
    
    return { success: true };
  }),
  
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { inAppNotifications } = await import("../../drizzle/schema");
      
      await db.delete(inAppNotifications)
        .where(and(
          eq(inAppNotifications.id, input.notificationId),
          eq(inAppNotifications.userId, ctx.user.id)
        ));
      
      return { success: true };
    }),
});
