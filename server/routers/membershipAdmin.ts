/**
 * Membership Tiers Admin Router — PR 7.1
 *
 * Admin CRUD for membership tiers with automatic Stripe product/price sync.
 * Protected by feature flag MEMBERSHIPS_ADMIN_V2 and admin role check.
 *
 * DO-NOT-TOUCH: Does NOT modify existing subscription logic or Stripe webhook handlers.
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { membershipTiers } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { syncTierToStripe, deleteTierFromStripe } from "../services/membershipStripeSync";
import { featureFlagService } from "../services/featureFlagService";
import { TRPCError } from "@trpc/server";
import { createLogger } from "../logger";

const log = createLogger("membershipAdmin");

/** Guard: throws if MEMBERSHIPS_ADMIN_V2 flag is OFF */
async function requireFlag(userId: number, role: string) {
  const enabled = await featureFlagService.isEnabled("MEMBERSHIPS_ADMIN_V2", { userId, role });
  if (!enabled) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Feature MEMBERSHIPS_ADMIN_V2 is not enabled" });
  }
}

const tierInput = z.object({
  name: z.string().min(1).max(100),
  nameFr: z.string().max(100).optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionFr: z.string().optional().nullable(),
  priceMonthly: z.string().default("0.00"),
  priceYearly: z.string().default("0.00"),
  currency: z.string().default("CAD"),
  features: z.array(z.string()).default([]),
  featuresFr: z.array(z.string()).optional().nullable(),
  maxCourses: z.number().int().default(-1),
  maxDMs: z.number().int().default(5),
  canAccessPremiumContent: z.boolean().default(false),
  canCreateEvents: z.boolean().default(false),
  canAccessAnalytics: z.boolean().default(false),
  badgeLabel: z.string().max(50).optional().nullable(),
  badgeColor: z.string().max(30).optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const membershipAdminRouter = router({
  /** List all membership tiers (admin only) */
  list: adminProcedure.query(async () => {
    const db = await getDb();
    return db.select().from(membershipTiers).orderBy(asc(membershipTiers.sortOrder));
  }),

  /** Get a single tier by ID */
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [tier] = await db.select().from(membershipTiers).where(eq(membershipTiers.id, input.id));
      if (!tier) throw new TRPCError({ code: "NOT_FOUND", message: "Tier not found" });
      return tier;
    }),

  /** Create a new membership tier + sync to Stripe */
  create: adminProcedure
    .input(tierInput)
    .mutation(async ({ ctx, input }) => {
      await requireFlag(ctx.user.id, ctx.user.role);
      const db = await getDb();

      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // Check slug uniqueness
      const existing = await db.select({ id: membershipTiers.id })
        .from(membershipTiers)
        .where(eq(membershipTiers.slug, slug))
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: `Tier with slug "${slug}" already exists` });
      }

      const [result] = await db.insert(membershipTiers).values({
        ...input,
        slug,
        features: input.features,
        featuresFr: input.featuresFr ?? null,
      });

      // Sync to Stripe (non-blocking — log errors but don't fail)
      try {
        await syncTierToStripe(result.insertId);
        log.info({ tierId: result.insertId, slug }, "Tier created and synced to Stripe");
      } catch (err: any) {
        log.error({ tierId: result.insertId, err: err.message }, "Stripe sync failed on create — tier saved locally");
      }

      return { id: result.insertId, slug };
    }),

  /** Update an existing tier + re-sync to Stripe */
  update: adminProcedure
    .input(z.object({ id: z.number() }).merge(tierInput.partial()))
    .mutation(async ({ ctx, input }) => {
      await requireFlag(ctx.user.id, ctx.user.role);
      const db = await getDb();
      const { id, ...data } = input;

      const [existing] = await db.select().from(membershipTiers).where(eq(membershipTiers.id, id));
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Tier not found" });

      // Build update payload — only set fields that were provided
      const updatePayload: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) updatePayload[key] = value;
      }

      if (Object.keys(updatePayload).length > 0) {
        await db.update(membershipTiers).set(updatePayload).where(eq(membershipTiers.id, id));
      }

      // Re-sync to Stripe
      try {
        await syncTierToStripe(id);
        log.info({ tierId: id }, "Tier updated and synced to Stripe");
      } catch (err: any) {
        log.error({ tierId: id, err: err.message }, "Stripe sync failed on update");
      }

      return { success: true };
    }),

  /** Soft-delete: deactivate tier + archive in Stripe */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireFlag(ctx.user.id, ctx.user.role);
      const db = await getDb();

      const [existing] = await db.select().from(membershipTiers).where(eq(membershipTiers.id, input.id));
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Tier not found" });

      // Soft delete: set isActive = false
      await db.update(membershipTiers).set({ isActive: false }).where(eq(membershipTiers.id, input.id));

      // Archive in Stripe
      try {
        await deleteTierFromStripe(input.id);
        log.info({ tierId: input.id }, "Tier deactivated and archived in Stripe");
      } catch (err: any) {
        log.error({ tierId: input.id, err: err.message }, "Stripe archive failed");
      }

      return { success: true };
    }),

  /** Reorder tiers */
  reorder: adminProcedure
    .input(z.object({ orderedIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await requireFlag(ctx.user.id, ctx.user.role);
      const db = await getDb();

      for (let i = 0; i < input.orderedIds.length; i++) {
        await db.update(membershipTiers)
          .set({ sortOrder: i })
          .where(eq(membershipTiers.id, input.orderedIds[i]));
      }

      log.info({ count: input.orderedIds.length }, "Tiers reordered");
      return { success: true };
    }),
});
