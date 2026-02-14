import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import {
  getDb,
} from "../db";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
      brand: z.enum(["ecosystem", "rusingacademy", "lingueefy", "barholex"]),
      language: z.enum(["en", "fr"]).default("en"),
      interests: z.array(z.string()).optional(),
      source: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { newsletterSubscriptions } = await import("../../drizzle/schema");
      
      // Check if already subscribed
      const [existing] = await db.select().from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, input.email));
      
      if (existing) {
        // Update existing subscription
        await db.update(newsletterSubscriptions)
          .set({
            brand: input.brand,
            language: input.language,
            interests: input.interests || null,
            status: "active",
            unsubscribedAt: null,
          })
          .where(eq(newsletterSubscriptions.id, existing.id));
        return { success: true, message: "Subscription updated" };
      }
      
      // Create new subscription
      await db.insert(newsletterSubscriptions).values({
        email: input.email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        brand: input.brand,
        language: input.language,
        interests: input.interests || null,
        source: input.source || "landing_page",
        confirmedAt: new Date(),
      });
      
      return { success: true, message: "Successfully subscribed" };
    }),
  
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { newsletterSubscriptions } = await import("../../drizzle/schema");
      
      await db.update(newsletterSubscriptions)
        .set({
          status: "unsubscribed",
          unsubscribedAt: new Date(),
        })
        .where(eq(newsletterSubscriptions.email, input.email));
      
      return { success: true };
    }),
});
