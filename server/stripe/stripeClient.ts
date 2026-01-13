/**
 * Stripe Client Utility
 * 
 * Provides lazy initialization of Stripe client with dev-mode guard.
 * This allows the app to start in development without Stripe keys.
 */

import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * Check if Stripe is configured (has API key)
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Get the Stripe client instance (lazy initialization)
 * Throws an error if Stripe is not configured and we try to use it.
 */
export function getStripeClient(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      // In development, log a warning but don't crash
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Stripe] STRIPE_SECRET_KEY not configured. Stripe features disabled in dev mode.');
        // Return a mock that will throw on actual usage
        throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY to enable Stripe features.');
      }
      throw new Error('STRIPE_SECRET_KEY is required in production');
    }
    
    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2025-12-15.clover",
    });
  }
  
  return stripeInstance;
}

/**
 * Get webhook secret (with dev guard)
 */
export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret && process.env.NODE_ENV !== 'development') {
    throw new Error('STRIPE_WEBHOOK_SECRET is required in production');
  }
  return secret || '';
}
