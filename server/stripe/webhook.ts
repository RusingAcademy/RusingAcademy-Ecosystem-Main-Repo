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
  getUserById,
} from "../db";
import { sendSessionConfirmationEmails } from "../email";
import { generateMeetingDetails } from "../video";

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

      // Subscription created
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      // Subscription updated
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      // Subscription deleted/canceled
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      // Invoice payment succeeded (subscription renewal)
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          await handleInvoicePaymentSucceeded(invoice);
        }
        break;
      }

      // Invoice payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          await handleInvoicePaymentFailed(invoice);
        }
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

  // Generate meeting URL for the session
  const meetingDetails = generateMeetingDetails(
    sessionId || Date.now(),
    metadata.coach_name || "Coach",
    metadata.learner_name || "Learner"
  );
  
  console.log(`[Stripe Webhook] Generated meeting URL: ${meetingDetails.url}`);

  // Send confirmation emails
  try {
    // Get coach and learner details for emails
    const coachUser = await getUserById(parseInt(metadata.coach_user_id || "0"));
    const learnerUser = await getUserById(parseInt(metadata.learner_user_id || "0"));
    
    if (coachUser && learnerUser) {
      const sessionDate = metadata.session_date ? new Date(metadata.session_date) : new Date();
      const sessionTime = metadata.session_time || "9:00 AM";
      const duration = parseInt(metadata.duration || "60");
      
      await sendSessionConfirmationEmails({
        learnerName: learnerUser.name || "Learner",
        learnerEmail: learnerUser.email || "",
        coachName: coachUser.name || "Coach",
        coachEmail: coachUser.email || "",
        sessionDate,
        sessionTime,
        sessionType: sessionType as "trial" | "single" | "package",
        duration,
        price: amountTotal,
        meetingUrl: meetingDetails.url,
        meetingInstructions: meetingDetails.joinInstructions,
      });
      
      console.log(`[Stripe Webhook] Sent confirmation emails to ${learnerUser.email} and ${coachUser.email}`);
    }
  } catch (emailError) {
    console.error("[Stripe Webhook] Failed to send confirmation emails:", emailError);
    // Don't fail the webhook if email fails
  }
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

// ============================================================================
// SUBSCRIPTION WEBHOOK HANDLERS
// ============================================================================

import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id || "";
  const metadata = subscription.metadata || {};
  const userId = parseInt(metadata.user_id || "0");

  if (!userId) {
    console.error("[Stripe Webhook] No user_id in subscription metadata");
    return;
  }

  // Determine plan type from metadata or price
  const planType = metadata.plan_type || "premium_membership";
  const interval = metadata.interval || "month";
  const planName = planType === "bundle" 
    ? "Complete Bundle" 
    : planType === "prof_steven_ai" 
      ? "Prof Steven AI Premium" 
      : "Premium Membership";

  // Insert subscription record
  await db.insert(schema.subscriptions).values({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    planType: interval === "year" ? "annual" : "monthly",
    planName,
    status: subscription.status as any,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : null,
    trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
  });

  console.log(`[Stripe Webhook] Created subscription for user ${userId}: ${planName}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Update subscription record
  await db
    .update(schema.subscriptions)
    .set({
      status: subscription.status as any,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    })
    .where(eq(schema.subscriptions.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Updated subscription ${subscription.id}: status=${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Mark subscription as canceled
  await db
    .update(schema.subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
    })
    .where(eq(schema.subscriptions.stripeSubscriptionId, subscription.id));

  console.log(`[Stripe Webhook] Canceled subscription ${subscription.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  
  console.log(`[Stripe Webhook] Invoice payment succeeded for subscription ${subscriptionId}`);
  
  // Could send a receipt email here
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const subscriptionId = (invoice as any).subscription as string;
  
  // Update subscription status to past_due
  await db
    .update(schema.subscriptions)
    .set({ status: "past_due" })
    .where(eq(schema.subscriptions.stripeSubscriptionId, subscriptionId));

  console.log(`[Stripe Webhook] Invoice payment failed for subscription ${subscriptionId}`);
  
  // Could send a payment failed email here
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
