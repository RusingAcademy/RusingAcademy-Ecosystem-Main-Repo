/**
 * Stripe Webhook Handler for Lingueefy
 * 
 * Processes Stripe events for payments, refunds, and Connect account updates.
 */

import { Request, Response } from "express";
import Stripe from "stripe";
import {
  createPayoutLedgerEntry,
  getCoachByUserId,
  updateCoachProfile,
} from "../db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return res.status(400).send("Webhook signature verification failed");
  }

  // Handle test events for webhook verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      // Payment completed - record in ledger
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      // Payment intent succeeded
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      // Refund processed
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      // Connect account updated
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      // Payout completed to coach
      case "payout.paid": {
        const payout = event.data.object as Stripe.Payout;
        console.log(`[Stripe Webhook] Payout completed: ${payout.id}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const coachId = parseInt(metadata.coach_id || "0");
  const learnerId = parseInt(metadata.learner_id || "0");
  const sessionId = parseInt(metadata.session_id || "0") || null;
  const sessionType = metadata.session_type || "single";

  if (!coachId || !learnerId) {
    console.error("[Stripe Webhook] Missing coach_id or learner_id in metadata");
    return;
  }

  const amountTotal = session.amount_total || 0;
  
  // Get application fee from payment intent
  let platformFee = 0;
  let commissionBps = 0;
  
  if (session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string
    );
    platformFee = (paymentIntent.application_fee_amount || 0);
    // Calculate commission rate from fee
    if (amountTotal > 0) {
      commissionBps = Math.round((platformFee / amountTotal) * 10000);
    }
  }

  const netAmount = amountTotal - platformFee;

  // Record session payment in ledger
  await createPayoutLedgerEntry({
    sessionId: sessionId,
    coachId,
    learnerId,
    transactionType: "session_payment",
    grossAmount: amountTotal,
    platformFee,
    netAmount,
    commissionBps,
    isTrialSession: sessionType === "trial",
    stripePaymentIntentId: session.payment_intent as string,
    status: "completed",
    processedAt: new Date(),
  });

  console.log(`[Stripe Webhook] Recorded payment: $${(amountTotal / 100).toFixed(2)} for coach ${coachId}`);
}

async function handleRefund(charge: Stripe.Charge) {
  const refunds = charge.refunds?.data || [];
  
  for (const refund of refunds) {
    const metadata = charge.metadata || {};
    const coachId = parseInt(metadata.coach_id || "0");
    const learnerId = parseInt(metadata.learner_id || "0");

    if (!coachId || !learnerId) continue;

    // Record refund in ledger
    await createPayoutLedgerEntry({
      coachId,
      learnerId,
      transactionType: "refund",
      grossAmount: -(refund.amount || 0),
      platformFee: 0, // Platform fee is reversed separately
      netAmount: -(refund.amount || 0),
      commissionBps: 0,
      stripeRefundId: refund.id,
      status: "completed",
      processedAt: new Date(),
    });

    console.log(`[Stripe Webhook] Recorded refund: $${((refund.amount || 0) / 100).toFixed(2)}`);
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  const coachIdStr = account.metadata?.coach_id;
  if (!coachIdStr) return;

  const coachId = parseInt(coachIdStr);
  
  // Update coach profile with onboarding status
  const isOnboarded = account.details_submitted && account.charges_enabled;
  
  // Note: We'd need to look up the coach profile by Stripe account ID
  // For now, log the status update
  console.log(`[Stripe Webhook] Account ${account.id} updated: onboarded=${isOnboarded}`);
}
