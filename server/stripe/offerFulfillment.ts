/**
 * Offer Fulfillment Module
 * 
 * Handles fulfillment of structured offer purchases:
 * - Updates purchase status
 * - Creates entitlements
 * - Creates diagnostic and learning plan placeholders
 * - Sends confirmation emails
 */

import { db } from "../db";
import { 
  purchases, 
  entitlements, 
  diagnostics, 
  learningPlans, 
  offers,
  users 
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "../email";
import Stripe from "stripe";

interface FulfillmentResult {
  success: boolean;
  purchaseId?: number;
  entitlementId?: number;
  error?: string;
}

// Idempotency: Track processed events
const processedEvents = new Set<string>();

/**
 * Fulfill an offer purchase after successful Stripe checkout
 * 
 * Implements idempotency by checking if event was already processed.
 */
export async function fulfillOfferPurchase(
  session: Stripe.Checkout.Session,
  eventId: string
): Promise<FulfillmentResult> {
  // Idempotency check
  if (processedEvents.has(eventId)) {
    console.log(`[Fulfillment] Event ${eventId} already processed, skipping`);
    return { success: true };
  }

  const metadata = session.metadata || {};
  const offerCode = metadata.offerCode;
  const userId = parseInt(metadata.userId || "0");
  const locale = (metadata.locale || "en") as "en" | "fr";

  if (!offerCode || !userId) {
    console.error("[Fulfillment] Missing offerCode or userId in metadata");
    return { success: false, error: "Missing required metadata" };
  }

  try {
    // 1. Get the offer details
    const offer = await db.query.offers.findFirst({
      where: eq(offers.code, offerCode),
    });

    if (!offer) {
      console.error(`[Fulfillment] Offer not found: ${offerCode}`);
      return { success: false, error: "Offer not found" };
    }

    // 2. Update purchase record
    const existingPurchase = await db.query.purchases.findFirst({
      where: eq(purchases.stripeCheckoutSessionId, session.id),
    });

    let purchaseId: number;

    if (existingPurchase) {
      // Update existing purchase
      await db.update(purchases)
        .set({
          status: "paid",
          stripePaymentIntentId: session.payment_intent as string,
          stripeCustomerId: session.customer as string,
          paidAt: new Date(),
        })
        .where(eq(purchases.id, existingPurchase.id));
      purchaseId = existingPurchase.id;
    } else {
      // Create new purchase record (shouldn't happen normally)
      const [newPurchase] = await db.insert(purchases).values({
        userId,
        offerId: offer.id,
        offerCode: offer.code,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
        amount: session.amount_total || offer.priceCad,
        currency: "CAD",
        status: "paid",
        locale,
        paidAt: new Date(),
      });
      purchaseId = newPurchase.insertId;
    }

    // 3. Create entitlement
    const [entitlement] = await db.insert(entitlements).values({
      userId,
      purchaseId,
      offerId: offer.id,
      offerCode: offer.code,
      coachingMinutesTotal: offer.coachingMinutes,
      coachingMinutesUsed: 0,
      coachingMinutesRemaining: offer.coachingMinutes,
      simulationsTotal: offer.simulationsIncluded || 0,
      simulationsUsed: 0,
      hasDiagnostic: offer.includesDiagnostic || false,
      hasLearningPlan: offer.includesLearningPlan || false,
      hasAiCoach: true,
      validFrom: new Date(),
      validUntil: null, // No expiry
      status: "active",
    });

    const entitlementId = entitlement.insertId;

    // 4. Create diagnostic placeholder (if included)
    if (offer.includesDiagnostic) {
      await db.insert(diagnostics).values({
        userId,
        entitlementId,
        targetLevel: "BBB", // Default, will be updated during diagnostic
        status: "pending",
      });
    }

    // 5. Create learning plan placeholder (if included)
    if (offer.includesLearningPlan) {
      await db.insert(learningPlans).values({
        userId,
        entitlementId,
        targetLevel: "BBB", // Default, will be updated
        status: "draft",
        generatedBy: "system",
      });
    }

    // 6. Get user for email
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // 7. Send confirmation email
    if (user?.email) {
      await sendPurchaseConfirmationEmail(user, offer, locale);
    }

    // Mark event as processed
    processedEvents.add(eventId);

    console.log(`[Fulfillment] Successfully fulfilled offer ${offerCode} for user ${userId}`);
    console.log(`[Fulfillment] Created entitlement ${entitlementId} with ${offer.coachingMinutes} minutes`);

    return {
      success: true,
      purchaseId,
      entitlementId,
    };
  } catch (error) {
    console.error("[Fulfillment] Error fulfilling offer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send purchase confirmation email
 */
async function sendPurchaseConfirmationEmail(
  user: { name: string | null; email: string | null },
  offer: { nameEn: string; nameFr: string; coachingMinutes: number; priceCad: number },
  locale: "en" | "fr"
) {
  const isEn = locale === "en";
  const offerName = isEn ? offer.nameEn : offer.nameFr;
  const hours = offer.coachingMinutes / 60;
  const price = (offer.priceCad / 100).toFixed(2);

  const subject = isEn
    ? `Your ${offerName} Purchase Confirmation`
    : `Confirmation de votre achat ${offerName}`;

  const html = isEn
    ? `
      <h1>Thank you for your purchase!</h1>
      <p>Dear ${user.name || "Valued Customer"},</p>
      <p>Your purchase of <strong>${offerName}</strong> has been confirmed.</p>
      <h2>What's Included:</h2>
      <ul>
        <li><strong>${hours} hours</strong> of expert coaching</li>
        <li>Strategic Language Diagnostic</li>
        <li>Personalized Learning Plan</li>
        <li>Unlimited AI Coach access</li>
      </ul>
      <h2>Next Steps:</h2>
      <ol>
        <li>Complete your Strategic Language Diagnostic</li>
        <li>Review your personalized Learning Plan</li>
        <li>Book your first coaching session</li>
      </ol>
      <p><a href="https://app.rusingacademy.ca/en/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a></p>
      <p>Amount paid: <strong>$${price} CAD</strong></p>
      <p>Best regards,<br>The Lingueefy Team</p>
    `
    : `
      <h1>Merci pour votre achat!</h1>
      <p>Cher(e) ${user.name || "Client(e)"},</p>
      <p>Votre achat de <strong>${offerName}</strong> a été confirmé.</p>
      <h2>Ce qui est inclus:</h2>
      <ul>
        <li><strong>${hours} heures</strong> de coaching expert</li>
        <li>Diagnostic stratégique de langue</li>
        <li>Plan d'apprentissage personnalisé</li>
        <li>Accès illimité au coach IA</li>
      </ul>
      <h2>Prochaines étapes:</h2>
      <ol>
        <li>Complétez votre diagnostic stratégique de langue</li>
        <li>Consultez votre plan d'apprentissage personnalisé</li>
        <li>Réservez votre première session de coaching</li>
      </ol>
      <p><a href="https://app.rusingacademy.ca/fr/tableau-de-bord" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Aller au tableau de bord</a></p>
      <p>Montant payé: <strong>${price} $ CAD</strong></p>
      <p>Cordialement,<br>L'équipe Lingueefy</p>
    `;

  try {
    await sendEmail({
      to: user.email!,
      subject,
      html,
    });
    console.log(`[Fulfillment] Sent confirmation email to ${user.email}`);
  } catch (error) {
    console.error("[Fulfillment] Failed to send confirmation email:", error);
    // Don't fail fulfillment if email fails
  }
}

/**
 * Check if an offer purchase is already fulfilled (for idempotency)
 */
export async function isOfferFulfilled(checkoutSessionId: string): Promise<boolean> {
  const purchase = await db.query.purchases.findFirst({
    where: and(
      eq(purchases.stripeCheckoutSessionId, checkoutSessionId),
      eq(purchases.status, "paid")
    ),
  });
  return !!purchase;
}
