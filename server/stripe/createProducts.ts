/**
 * Stripe Products & Prices Creation Script
 * 
 * Creates the 4 structured offers as Stripe Products with Prices.
 * Run this script once to set up Stripe products, then store IDs in DB.
 * 
 * If Stripe API is not available, this documents the manual steps in OPS_TODO.md
 */

import Stripe from "stripe";
import { db } from "../db";
import { offers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getStripeClient, isStripeConfigured } from "./stripeClient";

interface ProductConfig {
  code: string;
  name: string;
  description: string;
  priceInCents: number;
  metadata: {
    offerCode: string;
    coachingMinutes: string;
    includesDiagnostic: string;
    includesLearningPlan: string;
    simulationsIncluded: string;
  };
}

const PRODUCTS: ProductConfig[] = [
  {
    code: "BOOST",
    name: "Boost Session (1h)",
    description: "Quick diagnosis of oral performance with immediate personalized feedback and targeted mini-simulation.",
    priceInCents: 6700, // $67.00 CAD
    metadata: {
      offerCode: "BOOST",
      coachingMinutes: "60",
      includesDiagnostic: "true",
      includesLearningPlan: "false",
      simulationsIncluded: "1",
    },
  },
  {
    code: "QUICK",
    name: "Quick Prep Plan (5h)",
    description: "Diagnostic assessment, personalized learning plan, and one full oral exam simulation with feedback.",
    priceInCents: 29900, // $299.00 CAD
    metadata: {
      offerCode: "QUICK",
      coachingMinutes: "300",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "1",
    },
  },
  {
    code: "PROGRESSIVE",
    name: "Progressive Plan (15h)",
    description: "Comprehensive learning plan with milestones, weekly assessments, and multiple oral exam simulations.",
    priceInCents: 89900, // $899.00 CAD
    metadata: {
      offerCode: "PROGRESSIVE",
      coachingMinutes: "900",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "3",
    },
  },
  {
    code: "MASTERY",
    name: "Mastery Program (30h)",
    description: "30-Hour Confidence System™ with personalized bilingual roadmap, multiple simulations, and Speaking Skeleton™ Framework.",
    priceInCents: 189900, // $1,899.00 CAD
    metadata: {
      offerCode: "MASTERY",
      coachingMinutes: "1800",
      includesDiagnostic: "true",
      includesLearningPlan: "true",
      simulationsIncluded: "6",
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
  const createdProducts: Array<{ code: string; productId: string; priceId: string }> = [];

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

## Products to Create

${PRODUCTS.map((p, i) => `
### ${i + 1}. ${p.name}
- **Name:** ${p.name}
- **Description:** ${p.description}
- **Price:** $${(p.priceInCents / 100).toFixed(2)} CAD (one-time)
- **Metadata:**
  - offerCode: ${p.metadata.offerCode}
  - coachingMinutes: ${p.metadata.coachingMinutes}
  - includesDiagnostic: ${p.metadata.includesDiagnostic}
  - includesLearningPlan: ${p.metadata.includesLearningPlan}
  - simulationsIncluded: ${p.metadata.simulationsIncluded}
`).join('\n')}

## After Creating Products

1. Copy the Product ID (prod_xxx) and Price ID (price_xxx) for each product
2. Update the offers table in the database with these IDs
3. Or set them via the admin dashboard
`;
}
