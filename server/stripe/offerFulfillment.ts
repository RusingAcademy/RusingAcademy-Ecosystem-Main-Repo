/**
 * Offer Fulfillment Module
 * 
 * Handles fulfillment of structured offer purchases:
 * - Updates purchase status
 * - Creates entitlements
 * - Sets up AI quota (daily minutes based on offer)
 * - Handles top-up purchases (+60 minutes)
 * - Creates diagnostic and learning plan placeholders
 * - Sends confirmation emails
 * 
 * AI Daily Minutes by Offer:
 * - BOOST: 10 min/day, 3 months access
 * - QUICK: 15 min/day, 6 months access
 * - PROGRESSIVE: 15 min/day, 12 months access
 * - MASTERY: 30 min/day, 24 months access
 * 
 * Top-up:
 * - AI_TOPUP_60: +60 minutes (no daily reset)
 */

import { getDb } from "../db";
import { 
  purchases, 
  entitlements, 
  diagnostics, 
  learningPlans, 
  offers,
  users,
  aiQuota
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "../email";
import Stripe from "stripe";
import { AI_DAILY_MINUTES, ACCESS_DURATION_MONTHS, TOPUP_MINUTES } from "../seeds/seedOffers";

interface FulfillmentResult {
  success: boolean;
  purchaseId?: number;
  entitlementId?: number;
  error?: string;
}

// Idempotency: Track processed events (in production, use DB)
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
    const db = await getDb();
    if (!db) {
      console.error("[Fulfillment] Database not available");
      return { success: false, error: "Database not available" };
    }

    // 1. Get the offer details
    const offer = await db.query.offers.findFirst({
      where: eq(offers.code, offerCode),
    });

    if (!offer) {
      console.error(`[Fulfillment] Offer not found: ${offerCode}`);
      return { success: false, error: "Offer not found" };
    }

    // Determine if this is a top-up or main offer
    const isTopup = offerCode === "AI_TOPUP_60";

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
      // Create new purchase record
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

    let entitlementId: number | undefined;

    if (isTopup) {
      // Handle TOP-UP purchase
      await fulfillTopup(db, userId, offerCode);
      console.log(`[Fulfillment] Added ${TOPUP_MINUTES[offerCode]} top-up minutes for user ${userId}`);
    } else {
      // Handle MAIN OFFER purchase
      entitlementId = await fulfillMainOffer(db, userId, purchaseId, offer, locale);
    }

    // Mark event as processed
    processedEvents.add(eventId);

    console.log(`[Fulfillment] Successfully fulfilled offer ${offerCode} for user ${userId}`);

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
 * Fulfill a main offer (BOOST, QUICK, PROGRESSIVE, MASTERY)
 */
async function fulfillMainOffer(
  db: any,
  userId: number,
  purchaseId: number,
  offer: any,
  locale: "en" | "fr"
): Promise<number> {
  const offerCode = offer.code;
  const aiDailyMinutes = AI_DAILY_MINUTES[offerCode] || 10;
  const accessMonths = ACCESS_DURATION_MONTHS[offerCode] || 3;
  
  // Calculate access expiry
  const accessExpiresAt = new Date();
  accessExpiresAt.setMonth(accessExpiresAt.getMonth() + accessMonths);

  // 1. Create entitlement
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
    validUntil: accessExpiresAt,
    status: "active",
  });

  const entitlementId = entitlement.insertId;

  // 2. Setup AI Quota
  await setupAiQuota(db, userId, offerCode, aiDailyMinutes, accessExpiresAt);

  // 3. Create diagnostic placeholder (if included)
  if (offer.includesDiagnostic) {
    await db.insert(diagnostics).values({
      userId,
      entitlementId,
      targetLevel: "BBB",
      status: "pending",
    });
  }

  // 4. Create learning plan placeholder (if included)
  if (offer.includesLearningPlan) {
    await db.insert(learningPlans).values({
      userId,
      entitlementId,
      targetLevel: "BBB",
      status: "draft",
      generatedBy: "system",
    });
  }

  // 5. Get user for email
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // 6. Send confirmation email
  if (user?.email) {
    await sendPurchaseConfirmationEmail(user, offer, aiDailyMinutes, accessMonths, locale);
  }

  console.log(`[Fulfillment] Created entitlement ${entitlementId} with ${offer.coachingMinutes} coaching minutes`);
  console.log(`[Fulfillment] Set AI quota: ${aiDailyMinutes} min/day for ${accessMonths} months`);

  return entitlementId;
}

/**
 * Setup or update AI quota for a user
 */
async function setupAiQuota(
  db: any,
  userId: number,
  offerCode: string,
  aiDailyMinutes: number,
  accessExpiresAt: Date
) {
  // Check if user already has a quota record
  const existingQuota = await db.query.aiQuota.findFirst({
    where: eq(aiQuota.userId, userId),
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (existingQuota) {
    // User already has quota - upgrade if new quota is higher
    const newQuota = Math.max(existingQuota.dailyQuotaMinutes, aiDailyMinutes);
    
    // Extend access if new expiry is later
    const newExpiry = existingQuota.accessExpiresAt && existingQuota.accessExpiresAt > accessExpiresAt
      ? existingQuota.accessExpiresAt
      : accessExpiresAt;

    await db.update(aiQuota)
      .set({
        dailyQuotaMinutes: newQuota,
        activeOfferCode: offerCode,
        accessExpiresAt: newExpiry,
        // Don't reset daily used minutes on upgrade
      })
      .where(eq(aiQuota.userId, userId));

    console.log(`[Fulfillment] Updated AI quota for user ${userId}: ${newQuota} min/day`);
  } else {
    // Create new quota record
    await db.insert(aiQuota).values({
      userId,
      dailyQuotaMinutes: aiDailyMinutes,
      dailyUsedMinutes: 0,
      dailyResetAt: today,
      topupMinutesBalance: 0,
      activeOfferCode: offerCode,
      accessExpiresAt,
    });

    console.log(`[Fulfillment] Created AI quota for user ${userId}: ${aiDailyMinutes} min/day`);
  }
}

/**
 * Fulfill a top-up purchase (add minutes to balance)
 */
async function fulfillTopup(
  db: any,
  userId: number,
  offerCode: string
) {
  const topupMinutes = TOPUP_MINUTES[offerCode] || 60;

  // Check if user has a quota record
  const existingQuota = await db.query.aiQuota.findFirst({
    where: eq(aiQuota.userId, userId),
  });

  if (existingQuota) {
    // Add to existing top-up balance
    await db.update(aiQuota)
      .set({
        topupMinutesBalance: existingQuota.topupMinutesBalance + topupMinutes,
      })
      .where(eq(aiQuota.userId, userId));

    console.log(`[Fulfillment] Added ${topupMinutes} top-up minutes to user ${userId}`);
    console.log(`[Fulfillment] New top-up balance: ${existingQuota.topupMinutesBalance + topupMinutes}`);
  } else {
    // Create quota record with top-up only (no daily quota)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db.insert(aiQuota).values({
      userId,
      dailyQuotaMinutes: 0,
      dailyUsedMinutes: 0,
      dailyResetAt: today,
      topupMinutesBalance: topupMinutes,
      activeOfferCode: null,
      accessExpiresAt: null,
    });

    console.log(`[Fulfillment] Created AI quota for user ${userId} with ${topupMinutes} top-up minutes`);
  }

  // Send top-up confirmation email
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user?.email) {
    await sendTopupConfirmationEmail(user, topupMinutes);
  }
}

/**
 * Send purchase confirmation email for main offers
 */
async function sendPurchaseConfirmationEmail(
  user: { name: string | null; email: string | null; preferredLanguage?: string },
  offer: { nameEn: string; nameFr: string; coachingMinutes: number; priceCad: number },
  aiDailyMinutes: number,
  accessMonths: number,
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
        <li><strong>${aiDailyMinutes} min/day</strong> AI Coach access</li>
        <li>Strategic Language Diagnostic</li>
        <li>Personalized Learning Plan</li>
        <li><strong>${accessMonths} months</strong> access</li>
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
        <li><strong>${aiDailyMinutes} min/jour</strong> accès Coach IA</li>
        <li>Diagnostic stratégique de langue</li>
        <li>Plan d'apprentissage personnalisé</li>
        <li><strong>${accessMonths} mois</strong> d'accès</li>
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
  }
}

/**
 * Send top-up confirmation email
 */
async function sendTopupConfirmationEmail(
  user: { name: string | null; email: string | null; preferredLanguage?: string },
  topupMinutes: number
) {
  const isEn = user.preferredLanguage !== "fr";

  const subject = isEn
    ? `Your AI Top-up Pack (+${topupMinutes} min) Confirmation`
    : `Confirmation de votre forfait Top-up IA (+${topupMinutes} min)`;

  const html = isEn
    ? `
      <h1>Top-up Added!</h1>
      <p>Dear ${user.name || "Valued Customer"},</p>
      <p>Your <strong>AI Top-up Pack</strong> has been added to your account.</p>
      <h2>What You Received:</h2>
      <ul>
        <li><strong>+${topupMinutes} minutes</strong> of AI Coach time</li>
        <li>No daily reset - use anytime</li>
        <li>Valid for 12 months</li>
      </ul>
      <p>These minutes will be used automatically when your daily quota is exhausted.</p>
      <p><a href="https://app.rusingacademy.ca/en/ai-coach" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to AI Coach</a></p>
      <p>Best regards,<br>The Lingueefy Team</p>
    `
    : `
      <h1>Top-up ajouté!</h1>
      <p>Cher(e) ${user.name || "Client(e)"},</p>
      <p>Votre <strong>forfait Top-up IA</strong> a été ajouté à votre compte.</p>
      <h2>Ce que vous avez reçu:</h2>
      <ul>
        <li><strong>+${topupMinutes} minutes</strong> de temps Coach IA</li>
        <li>Pas de réinitialisation quotidienne - utilisable à tout moment</li>
        <li>Valide pendant 12 mois</li>
      </ul>
      <p>Ces minutes seront utilisées automatiquement lorsque votre quota quotidien sera épuisé.</p>
      <p><a href="https://app.rusingacademy.ca/fr/coach-ia" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Aller au Coach IA</a></p>
      <p>Cordialement,<br>L'équipe Lingueefy</p>
    `;

  try {
    await sendEmail({
      to: user.email!,
      subject,
      html,
    });
    console.log(`[Fulfillment] Sent top-up confirmation email to ${user.email}`);
  } catch (error) {
    console.error("[Fulfillment] Failed to send top-up confirmation email:", error);
  }
}

/**
 * Check if an offer purchase is already fulfilled (for idempotency)
 */
export async function isOfferFulfilled(checkoutSessionId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const purchase = await db.query.purchases.findFirst({
    where: and(
      eq(purchases.stripeCheckoutSessionId, checkoutSessionId),
      eq(purchases.status, "paid")
    ),
  });
  return !!purchase;
}
