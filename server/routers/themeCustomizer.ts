import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { themePresets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { featureFlagService } from "../services/featureFlagService";
import { TRPCError } from "@trpc/server";

export const themeCustomizerRouter = router({
  list: protectedProcedure.query(async () => {
    const enabled = await featureFlagService.isEnabled("THEME_CUSTOMIZER_ENABLED");
    if (!enabled) throw new TRPCError({ code: "FORBIDDEN", message: "Theme customizer is not enabled" });
    const db = await getDb();
    return db.select().from(themePresets);
  }),
  getActive: publicProcedure.query(async () => {
    const db = await getDb();
    const [active] = await db.select().from(themePresets).where(eq(themePresets.isActive, true)).limit(1);
    return active || null;
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1).max(100), slug: z.string().min(1).max(100), description: z.string().optional(), tokens: z.record(z.string(), z.any()) })).mutation(async ({ input }) => {
    const db = await getDb();
    const [result] = await db.insert(themePresets).values({ name: input.name, slug: input.slug, description: input.description || null, tokens: input.tokens });
    return { id: result.insertId };
  }),
  activate: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    await db.update(themePresets).set({ isActive: false });
    await db.update(themePresets).set({ isActive: true }).where(eq(themePresets.id, input.id));
    return { success: true };
  }),
  update: protectedProcedure.input(z.object({ id: z.number(), name: z.string().optional(), tokens: z.record(z.string(), z.any()).optional() })).mutation(async ({ input }) => {
    const db = await getDb();
    const updates: Record<string, unknown> = {};
    if (input.name) updates.name = input.name;
    if (input.tokens) updates.tokens = input.tokens;
    await db.update(themePresets).set(updates).where(eq(themePresets.id, input.id));
    return { success: true };
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await getDb();
    await db.delete(themePresets).where(eq(themePresets.id, input.id));
    return { success: true };
  }),
});
