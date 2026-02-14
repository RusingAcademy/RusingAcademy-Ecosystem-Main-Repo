import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { desc, sql } from "drizzle-orm";
import {
  getDb,
} from "../db";

export const remindersRouter = router({
  getAll: protectedProcedure
    .input(z.object({
      type: z.enum(["all", "24h", "1h"]).optional().default("all"),
      channel: z.enum(["all", "email", "in_app"]).optional().default("all"),
      status: z.enum(["all", "sent", "pending", "failed"]).optional().default("all"),
      limit: z.number().min(1).max(100).optional().default(50),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) return { reminders: [], stats: { totalSent: 0, openRate: 0, clickRate: 0, failed: 0 } };
      
      const { emailLogs, inAppNotifications } = await import("../../drizzle/schema");
      
      // Get email reminders (session reminders)
      const emailReminders = await db.select({
        id: emailLogs.id,
        recipientEmail: emailLogs.toEmail,
        subject: emailLogs.subject,
        status: emailLogs.status,
        sentAt: emailLogs.sentAt,
      }).from(emailLogs)
        .where(sql`${emailLogs.subject} LIKE '%session%' OR ${emailLogs.subject} LIKE '%rappel%'`)
        .orderBy(desc(emailLogs.sentAt))
        .limit(input.limit);
      
      // Get in-app notifications (session reminders)
      const inAppReminders = await db.select({
        id: inAppNotifications.id,
        userId: inAppNotifications.userId,
        title: inAppNotifications.title,
        message: inAppNotifications.message,
        type: inAppNotifications.type,
        isRead: inAppNotifications.isRead,
        createdAt: inAppNotifications.createdAt,
      }).from(inAppNotifications)
        .where(sql`${inAppNotifications.type} = 'session_reminder' OR ${inAppNotifications.title} LIKE '%session%'`)
        .orderBy(desc(inAppNotifications.createdAt))
        .limit(input.limit);
      
      // Calculate stats
      const totalSent = emailReminders.filter(r => r.status === 'sent').length + inAppReminders.length;
      const totalOpened = emailReminders.filter(r => (r as any).openedAt).length + inAppReminders.filter(r => r.isRead).length;
      const totalClicked = emailReminders.filter(r => (r as any).clickedAt).length;
      const failed = emailReminders.filter(r => r.status === 'failed').length;
      
      return {
        reminders: [
          ...emailReminders.map(r => ({
            id: r.id,
            type: r.subject?.includes('24') ? '24h' as const : '1h' as const,
            channel: 'email' as const,
            status: r.status as 'sent' | 'pending' | 'failed',
            recipientName: (r as any).recipientName || 'Unknown',
            recipientEmail: r.recipientEmail,
            sentAt: r.sentAt,
            opened: !!(r as any).openedAt,
            clicked: !!(r as any).clickedAt,
          })),
          ...inAppReminders.map(r => ({
            id: r.id + 100000,
            type: r.title?.includes('24') ? '24h' as const : '1h' as const,
            channel: 'in_app' as const,
            status: 'sent' as const,
            recipientName: 'User ' + r.userId,
            recipientEmail: null,
            sentAt: r.createdAt,
            opened: r.isRead,
            clicked: false,
          })),
        ],
        stats: {
          totalSent,
          openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
          clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
          failed,
        },
      };
    }),
});
