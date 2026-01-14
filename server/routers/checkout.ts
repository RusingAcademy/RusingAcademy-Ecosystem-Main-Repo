/**
 * Stripe Checkout Router
 * 
 * Handles checkout session creation for structured offers.
 * POST /api/checkout/create - Create a checkout session
 */

import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { offers, purchases } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getStripeClient, isStripeConfigured } from "../stripe/stripeClient";

const router = Router();

interface CreateCheckoutRequest {
  offerCode: string;
  locale: "en" | "fr";
  successPath?: string;
  cancelPath?: string;
}

/**
 * POST /api/checkout/create
 * 
 * Creates a Stripe Checkout Session for a structured offer.
 */
router.post("/create", async (req: Request, res: Response) => {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return res.status(503).json({
        error: "Payment system not configured",
        message: "Please contact support to complete your purchase.",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        error: "Database not available",
        message: "Please try again later.",
      });
    }

    const { offerCode, locale = "en", successPath, cancelPath } = req.body as CreateCheckoutRequest;

    // Validate required fields
    if (!offerCode) {
      return res.status(400).json({ error: "offerCode is required" });
    }

    // Get user from session (auth middleware should have set this)
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get offer from database
    const offer = await db.query.offers.findFirst({
      where: eq(offers.code, offerCode.toUpperCase()),
    });

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (!offer.active) {
      return res.status(400).json({ error: "This offer is no longer available" });
    }

    if (!offer.stripePriceId) {
      return res.status(500).json({ 
        error: "Offer not configured for payment",
        message: "Please contact support.",
      });
    }

    const stripe = getStripeClient();
    const appBaseUrl = process.env.APP_BASE_URL || "https://app.rusingacademy.ca";

    // Build success and cancel URLs
    const successUrl = `${appBaseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appBaseUrl}/${locale}/checkout/cancel`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: offer.stripePriceId,
          quantity: 1,
        },
      ],
      client_reference_id: String(userId),
      metadata: {
        offerCode: offer.code,
        offerId: String(offer.id),
        userId: String(userId),
        locale,
        coachingMinutes: String(offer.coachingMinutes),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: locale === "fr" ? "fr-CA" : "en",
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    // Create pending purchase record
    await db.insert(purchases).values({
      userId,
      offerId: offer.id,
      offerCode: offer.code,
      stripeCheckoutSessionId: session.id,
      amount: offer.priceCad,
      currency: "CAD",
      status: "pending",
      locale,
    });

    return res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("[Checkout] Error creating session:", error);
    return res.status(500).json({
      error: "Failed to create checkout session",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/checkout/session/:sessionId
 * 
 * Get checkout session status (for polling after redirect).
 */
router.get("/session/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!isStripeConfigured()) {
      return res.status(503).json({ error: "Payment system not configured" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Get purchase from DB
    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.stripeCheckoutSessionId, sessionId),
    });

    return res.json({
      status: session.payment_status,
      purchaseId: purchase?.id,
      purchaseStatus: purchase?.status,
    });
  } catch (error) {
    console.error("[Checkout] Error retrieving session:", error);
    return res.status(500).json({ error: "Failed to retrieve session" });
  }
});

/**
 * GET /api/checkout/offers
 * 
 * Get all active offers for display.
 */
router.get("/offers", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const activeOffers = await db.query.offers.findMany({
      where: eq(offers.active, true),
      orderBy: (offers, { asc }) => [asc(offers.sortOrder)],
    });

    // Format offers for frontend
    const formattedOffers = activeOffers.map((offer) => ({
      id: offer.id,
      code: offer.code,
      name: {
        en: offer.nameEn,
        fr: offer.nameFr,
      },
      description: {
        en: offer.descriptionEn,
        fr: offer.descriptionFr,
      },
      price: offer.priceCad / 100, // Convert cents to dollars
      priceCad: offer.priceCad,
      currency: offer.currency,
      coachingMinutes: offer.coachingMinutes,
      coachingHours: offer.coachingMinutes / 60,
      includesDiagnostic: offer.includesDiagnostic,
      includesLearningPlan: offer.includesLearningPlan,
      simulationsIncluded: offer.simulationsIncluded,
      features: {
        en: typeof offer.featuresEn === "string" ? JSON.parse(offer.featuresEn) : offer.featuresEn,
        fr: typeof offer.featuresFr === "string" ? JSON.parse(offer.featuresFr) : offer.featuresFr,
      },
      idealFor: {
        en: offer.idealForEn,
        fr: offer.idealForFr,
      },
      tags: typeof offer.tags === "string" ? JSON.parse(offer.tags) : offer.tags,
      hasStripePrice: !!offer.stripePriceId,
    }));

    return res.json({ offers: formattedOffers });
  } catch (error) {
    console.error("[Checkout] Error fetching offers:", error);
    return res.status(500).json({ error: "Failed to fetch offers" });
  }
});

export default router;
