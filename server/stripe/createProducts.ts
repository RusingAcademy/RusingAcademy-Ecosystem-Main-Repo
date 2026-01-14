/**
 * Stripe Products & Prices Creation Script
 * 
 * Creates the 4 structured offers + top-up pack as Stripe Products with Prices.
 * Run this script once to set up Stripe products, then store IDs in DB.
 * 
 * Main Offers:
 * - BOOST SESSION: $67 CAD - 10 min/day AI - 3 months
 * - QUICK PREP PLAN: $299 CAD - 15 min/day AI - 6 months
 * - PROGRESSIVE PLAN: $899 CAD - 15 min/day AI - 12 months
 * - MASTERY PROGRAM: $1,899 CAD - 30 min/day AI - 24 months
 * 
 * Top-up:
 * - AI TOP-UP PACK 60: $39 CAD - +60 minutes (no daily reset)
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { offers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getStripeClient, isStripeConfigured } from "./stripeClient";

interface ProductConfig {
  code: string;
  name: string;
  description: string;
  priceInCents: number;
  type: "main" | "topup";
  metadata: {
    offerCode: string;
    type: string;
    coachingMinutes: string;
    aiDailyMinutes: string;
    accessDurationMonths: string;
    topupMinutes?: string;
    includesDiagnostic: string;
    includesLearningPlan: string;
    simulationsIncluded: string;
  };
}

const PRODUCTS: ProductConfig[] = [
  {
    code: "BOOST",
    name: "Boost Session (1h)",
    description: "Quick diagnosis of oral performance with immediate personalized feedback and targeted mini-simulation. Includes 10 min/day AI Coach for 3 months.",
    priceInCents: 6700, // $67.00 CAD
    type: "main",
    metadata: {
      offerCode: "BOOST",
      type: "main",
      coachingMinutes: "60",
      aiDailyMinutes: "10",
      accessDurationMonths: "3",
      includesDiagnostic: "true",
      includesLearningPlan: "false",
      simulationsIncluded: "1",
    },
  },
  {
    code: "QUICK",
    name: "Quick Prep Plan (5h)",
    description: "Diagnostic assessment, personalized learning plan, and one full oral exam simulation with feedback. Includes 15 min/day AI Coach for 6 months.",
    priceInCents: 29900, // $299.00 CAD
    type: "main",
    metadata: {
      offerCode: "QUICK",
      type: "main",
      coachingMinutes: "300",
      aiDailyMinutes: "15",
      accessDurationMonths: "6",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "1",
    },
  },
  {
    code: "PROGRESSIVE",
    name: "Progressive Plan (15h)",
    description: "Comprehensive learning plan with milestones, weekly assessments, and multiple oral exam simulations. Includes 15 min/day AI Coach for 12 months.",
    priceInCents: 89900, // $899.00 CAD
    type: "main",
    metadata: {
      offerCode: "PROGRESSIVE",
      type: "main",
      coachingMinutes: "900",
      aiDailyMinutes: "15",
      accessDurationMonths: "12",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "3",
    },
  },
  {
    code: "MASTERY",
    name: "Mastery Program (30h)",
    description: "30-Hour Confidence System™ with personalized bilingual roadmap, multiple simulations, and Speaking Skeleton™ Framework. Includes 30 min/day AI Coach for 24 months.",
    priceInCents: 189900, // $1,899.00 CAD
    type: "main",
    metadata: {
      offerCode: "MASTERY",
      type: "main",
      coachingMinutes: "1800",
      aiDailyMinutes: "30",
      accessDurationMonths: "24",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "6",
    },
  },
  // TOP-UP PRODUCT
  {
    code: "AI_TOPUP_60",
    name: "AI Top-up Pack (+60 min)",
    description: "+60 minutes of AI Coach time. Use when your daily quota is exhausted. No daily reset - use anytime within 12 months.",
    priceInCents: 3900, // $39.00 CAD
    type: "topup",
    metadata: {
      offerCode: "AI_TOPUP_60",
      type: "topup",
      coachingMinutes: "0",
      aiDailyMinutes: "0",
      accessDurationMonths: "12",
      topupMinutes: "60",
      includesDiagnostic: "false",
      includesLearningPlan: "false",
      simulationsIncluded: "0",
    },
  },
];

export async function createStripeProducts(): Promise<{
  success: boolean;
  products: Array<{ code: string; productId: string; priceId: string }>;
  error?: string;
}> {
  if (!isStripeConfigured()) {
    console.warn("[Stripe] Stripe not configured, skipping product creation");
    return {
      success: false,
      products: [],
      error: "Stripe not configured. See OPS_TODO.md for manual setup instructions.",
    };
  }

  const stripe = getStripeClient();
  const db = await getDb();
  const createdProducts: Array<{ code: string; productId: string; priceId: string }> = [];

  if (!db) {
    return {
      success: false,
      products: [],
      error: "Database not available",
    };
  }

  try {
    for (const productConfig of PRODUCTS) {
      console.log(`[Stripe] Creating product: ${productConfig.name}`);

      // Check if product already exists by searching
      const existingProducts = await stripe.products.search({
        query: `metadata['offerCode']:'${productConfig.code}'`,
      });

      let product: Stripe.Product;
      let price: Stripe.Price;

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`[Stripe] Product ${productConfig.code} already exists: ${product.id}`);

        // Get existing price
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 1,
        });

        if (prices.data.length > 0) {
          price = prices.data[0];
        } else {
          // Create new price
          price = await stripe.prices.create({
            product: product.id,
            unit_amount: productConfig.priceInCents,
            currency: "cad",
          });
        }
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productConfig.name,
          description: productConfig.description,
          metadata: productConfig.metadata,
        });

        // Create price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: productConfig.priceInCents,
          currency: "cad",
        });
      }

      createdProducts.push({
        code: productConfig.code,
        productId: product.id,
        priceId: price.id,
      });

      // Update offer in DB with Stripe IDs
      await db.update(offers)
        .set({
          stripeProductId: product.id,
          stripePriceId: price.id,
        })
        .where(eq(offers.code, productConfig.code));

      console.log(`[Stripe] Product ${productConfig.code}: productId=${product.id}, priceId=${price.id}`);
    }

    return { success: true, products: createdProducts };
  } catch (error) {
    console.error("[Stripe] Error creating products:", error);
    return {
      success: false,
      products: createdProducts,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Export for manual documentation
export function getManualSetupInstructions(): string {
  return `
# Stripe Products Manual Setup

If Stripe API creation fails, create these products manually in Stripe Dashboard:

## Main Offers

${PRODUCTS.filter(p => p.type === "main").map((p, i) => `
### ${i + 1}. ${p.name}
- **Name:** ${p.name}
- **Description:** ${p.description}
- **Price:** $${(p.priceInCents / 100).toFixed(2)} CAD (one-time)
- **Metadata:**
  - offerCode: ${p.metadata.offerCode}
  - type: ${p.metadata.type}
  - coachingMinutes: ${p.metadata.coachingMinutes}
  - aiDailyMinutes: ${p.metadata.aiDailyMinutes}
  - accessDurationMonths: ${p.metadata.accessDurationMonths}
  - includesDiagnostic: ${p.metadata.includesDiagnostic}
  - includesLearningPlan: ${p.metadata.includesLearningPlan}
  - simulationsIncluded: ${p.metadata.simulationsIncluded}
`).join('\n')}

## Top-up Products

${PRODUCTS.filter(p => p.type === "topup").map((p, i) => `
### ${i + 1}. ${p.name}
- **Name:** ${p.name}
- **Description:** ${p.description}
- **Price:** $${(p.priceInCents / 100).toFixed(2)} CAD (one-time)
- **Metadata:**
  - offerCode: ${p.metadata.offerCode}
  - type: ${p.metadata.type}
  - topupMinutes: ${p.metadata.topupMinutes}
  - accessDurationMonths: ${p.metadata.accessDurationMonths}
`).join('\n')}

## After Creating Products

1. Copy the Product ID (prod_xxx) and Price ID (price_xxx) for each product
2. Update the offers table in the database with these IDs
3. Or set them via the admin dashboard

## Environment Variables Required

Add to Railway:
- STRIPE_PRICE_ID_BOOST=price_xxx
- STRIPE_PRICE_ID_QUICK=price_xxx
- STRIPE_PRICE_ID_PROGRESSIVE=price_xxx
- STRIPE_PRICE_ID_MASTERY=price_xxx
- STRIPE_PRICE_ID_AI_TOPUP_60=price_xxx
`;
}

// Export products config for reference
export { PRODUCTS };
