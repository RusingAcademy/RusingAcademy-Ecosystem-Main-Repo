/**
 * Lingueefy Stripe Products Configuration
 * 
 * This file defines the products and pricing structure for the marketplace.
 * Products are created dynamically in Stripe when needed.
 */

export const LINGUEEFY_PRODUCTS = {
  // Session types
  TRIAL_SESSION: {
    name: "Trial Session",
    description: "30-minute trial session with a Lingueefy coach",
    type: "session" as const,
    durationMinutes: 30,
  },
  SINGLE_SESSION: {
    name: "Single Session",
    description: "60-minute coaching session with a Lingueefy coach",
    type: "session" as const,
    durationMinutes: 60,
  },
  PACKAGE_5: {
    name: "5-Session Package",
    description: "Package of 5 coaching sessions (save 10%)",
    type: "package" as const,
    sessionCount: 5,
    discountPercent: 10,
  },
  PACKAGE_10: {
    name: "10-Session Package",
    description: "Package of 10 coaching sessions (save 15%)",
    type: "package" as const,
    sessionCount: 10,
    discountPercent: 15,
  },
} as const;

// Commission calculation helpers
export function calculatePlatformFee(
  grossAmountCents: number,
  commissionBps: number
): { platformFeeCents: number; coachNetCents: number } {
  // Commission is in basis points (100 bps = 1%)
  const platformFeeCents = Math.round((grossAmountCents * commissionBps) / 10000);
  const coachNetCents = grossAmountCents - platformFeeCents;
  
  return { platformFeeCents, coachNetCents };
}

// Format currency for display
export function formatCAD(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

// Calculate package price with discount
export function calculatePackagePrice(
  hourlyRateCents: number,
  sessionCount: number,
  discountPercent: number
): { totalCents: number; perSessionCents: number; savingsCents: number } {
  const fullPrice = hourlyRateCents * sessionCount;
  const discount = Math.round(fullPrice * (discountPercent / 100));
  const totalCents = fullPrice - discount;
  const perSessionCents = Math.round(totalCents / sessionCount);
  
  return {
    totalCents,
    perSessionCents,
    savingsCents: discount,
  };
}
