/**
 * Membership Stripe Sync Service — PR 7.1
 *
 * Creates/updates Stripe Products and Prices for membership tiers.
 * Only creates new prices (Stripe prices are immutable).
 *
 * DO-NOT-TOUCH: Does NOT modify existing server/stripe/* webhook handlers.
 */
import Stripe from "stripe";
import { getDb } from "../db";
import { membershipTiers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { createLogger } from "../logger";

const log = createLogger("membershipStripeSync");

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" as any });
}

/**
 * Sync a membership tier to Stripe.
 * Creates product if missing, creates prices if missing.
 */
export async function syncTierToStripe(tierId: number): Promise<void> {
  const db = await getDb();
  const [tier] = await db.select().from(membershipTiers).where(eq(membershipTiers.id, tierId));
  if (!tier) {
    log.warn({ tierId }, "Tier not found — skipping Stripe sync");
    return;
  }

  const stripe = getStripe();

  // 1. Create or update Stripe Product
  let productId = tier.stripeProductId;
  if (!productId) {
    const product = await stripe.products.create({
      name: tier.name,
      description: tier.description || undefined,
      metadata: {
        rusingacademy_tier_id: String(tierId),
        slug: tier.slug,
      },
    });
    productId = product.id;
    await db.update(membershipTiers)
      .set({ stripeProductId: productId })
      .where(eq(membershipTiers.id, tierId));
    log.info({ tierId, productId }, "Stripe product created");
  } else {
    // Update product name/description if changed
    await stripe.products.update(productId, {
      name: tier.name,
      description: tier.description || undefined,
      active: tier.isActive,
    });
    log.info({ tierId, productId }, "Stripe product updated");
  }

  // 2. Create monthly price if needed
  const monthlyAmount = Math.round(parseFloat(tier.priceMonthly || "0") * 100);
  if (monthlyAmount > 0 && !tier.stripePriceIdMonthly) {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: monthlyAmount,
      currency: (tier.currency || "CAD").toLowerCase(),
      recurring: { interval: "month" },
      metadata: { rusingacademy_tier_id: String(tierId), billing_cycle: "monthly" },
    });
    await db.update(membershipTiers)
      .set({ stripePriceIdMonthly: price.id })
      .where(eq(membershipTiers.id, tierId));
    log.info({ tierId, priceId: price.id, amount: monthlyAmount }, "Monthly price created");
  }

  // 3. Create yearly price if needed
  const yearlyAmount = Math.round(parseFloat(tier.priceYearly || "0") * 100);
  if (yearlyAmount > 0 && !tier.stripePriceIdYearly) {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: yearlyAmount,
      currency: (tier.currency || "CAD").toLowerCase(),
      recurring: { interval: "year" },
      metadata: { rusingacademy_tier_id: String(tierId), billing_cycle: "yearly" },
    });
    await db.update(membershipTiers)
      .set({ stripePriceIdYearly: price.id })
      .where(eq(membershipTiers.id, tierId));
    log.info({ tierId, priceId: price.id, amount: yearlyAmount }, "Yearly price created");
  }
}

/**
 * Archive a tier's Stripe product (set active=false).
 * Does NOT delete — preserves existing subscriptions.
 */
export async function deleteTierFromStripe(tierId: number): Promise<void> {
  const db = await getDb();
  const [tier] = await db.select().from(membershipTiers).where(eq(membershipTiers.id, tierId));
  if (!tier?.stripeProductId) return;

  const stripe = getStripe();
  await stripe.products.update(tier.stripeProductId, { active: false });
  log.info({ tierId, productId: tier.stripeProductId }, "Stripe product archived");
}
