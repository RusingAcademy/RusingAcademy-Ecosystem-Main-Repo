import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import {
  getDb,
} from "../db";

export const notificationsRouter = router({
  subscribePush: protectedProcedure
    .input(z.object({
      endpoint: z.string(),
      p256dh: z.string(),
      auth: z.string(),
      userAgent: z.string().optional(),
      enableBookings: z.boolean().default(true),
      enableMessages: z.boolean().default(true),
      enableReminders: z.boolean().default(true),
      enableMarketing: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { pushSubscriptions } = await import("../../drizzle/schema");
      
      // Check if subscription already exists
      const [existing] = await db.select().from(pushSubscriptions)
        .where(and(
          eq(pushSubscriptions.userId, ctx.user.id),
          eq(pushSubscriptions.endpoint, input.endpoint)
        ));
      
      if (existing) {
        // Update existing subscription
        await db.update(pushSubscriptions)
          .set({
            p256dh: input.p256dh,
            auth: input.auth,
            userAgent: input.userAgent || null,
            enableBookings: input.enableBookings,
            enableMessages: input.enableMessages,
            enableReminders: input.enableReminders,
            enableMarketing: input.enableMarketing,
            isActive: true,
            lastUsedAt: new Date(),
          })
          .where(eq(pushSubscriptions.id, existing.id));
      } else {
        // Create new subscription
        await db.insert(pushSubscriptions).values({
          userId: ctx.user.id,
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
          userAgent: input.userAgent || null,
          enableBookings: input.enableBookings,
          enableMessages: input.enableMessages,
          enableReminders: input.enableReminders,
          enableMarketing: input.enableMarketing,
        });
      }
      
      return { success: true };
    }),
  
  unsubscribePush: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const { pushSubscriptions } = await import("../../drizzle/schema");
    
    // Deactivate all subscriptions for this user
    await db.update(pushSubscriptions)
      .set({ isActive: false })
      .where(eq(pushSubscriptions.userId, ctx.user.id));
    
    return { success: true };
  }),
  
  updatePushPreferences: protectedProcedure
    .input(z.object({
      enableBookings: z.boolean(),
      enableMessages: z.boolean(),
      enableReminders: z.boolean(),
      enableMarketing: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { pushSubscriptions } = await import("../../drizzle/schema");
      
      await db.update(pushSubscriptions)
        .set({
          enableBookings: input.enableBookings,
          enableMessages: input.enableMessages,
          enableReminders: input.enableReminders,
          enableMarketing: input.enableMarketing,
        })
        .where(and(
          eq(pushSubscriptions.userId, ctx.user.id),
          eq(pushSubscriptions.isActive, true)
        ));
      
      return { success: true };
    }),
});
