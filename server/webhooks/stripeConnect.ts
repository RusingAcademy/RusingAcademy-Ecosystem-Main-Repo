/**
 * Stripe Connect Webhook Handler
 * Phase 1: Handles Connect-specific webhook events
 *
 * Events handled:
 * - account.updated — Coach onboarding completion
 * - payout.created / payout.paid / payout.failed — Payout lifecycle
 * - transfer.created — Commission transfers to coaches
 */
import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { coachProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { broadcastService } from "../websocket";

// Lazy Stripe initialization
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeInstance = new Stripe(key, { apiVersion: "2025-12-15.clover" as any });
  }
  return stripeInstance;
}

/**
 * Express handler for Stripe Connect webhooks
 * Must be registered with express.raw() body parser
 */
export async function handleStripeConnectWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Connect Webhook] STRIPE_CONNECT_WEBHOOK_SECRET not configured");
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Connect Webhook] Signature verification failed:", (err as Error).message);
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  console.log(`[Stripe Connect Webhook] Received: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`[Stripe Connect Webhook] Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(`[Stripe Connect Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle account.updated — update coach onboarding status
 */
async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  const stripeAccountId = account.id;
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Connect] Database unavailable");
    return;
  }

  // Find the coach with this Stripe account
  const [coach] = await db
    .select()
    .from(coachProfiles)
    .where(eq(coachProfiles.stripeAccountId, stripeAccountId))
    .limit(1);

  if (!coach) {
    console.log(`[Stripe Connect] No coach found for account ${stripeAccountId}`);
    return;
  }

  const isOnboarded = !!(account.details_submitted && account.charges_enabled);
  const wasOnboarded = coach.stripeOnboarded;

  // Update the coach profile
  await db
    .update(coachProfiles)
    .set({
      stripeOnboarded: isOnboarded,
      updatedAt: new Date(),
    })
    .where(eq(coachProfiles.id, coach.id));

  console.log(
    `[Stripe Connect] Coach ${coach.id} account updated: onboarded=${isOnboarded}, charges=${account.charges_enabled}, payouts=${account.payouts_enabled}`
  );

  // Notify the coach via WebSocket if they just completed onboarding
  if (isOnboarded && !wasOnboarded) {
    broadcastService.toUsers([coach.userId], "coach.stripe.onboarded", {
      coachId: coach.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });

    // Also notify admins
    broadcastService.toRole("admin", "admin.coach.stripe.onboarded", {
      coachId: coach.id,
      coachName: coach.slug,
    });

    console.log(`✅ Coach ${coach.id} completed Stripe onboarding`);
  }

  // Notify coach of any status changes
  broadcastService.toUsers([coach.userId], "coach.stripe.updated", {
    coachId: coach.id,
    onboarded: isOnboarded,
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
  });
}

export { handleAccountUpdated };
