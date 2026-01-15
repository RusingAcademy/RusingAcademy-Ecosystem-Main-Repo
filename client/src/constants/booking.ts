/**
 * Centralized booking constants - Single source of truth for CTAs
 * Sprint 1: CTA Standardization
 */

export const BOOKING_URL = "https://calendly.com/steven-barholere/30min";

export const BOOKING_CTA = {
  en: "Book a Diagnostic (30 min)",
  fr: "Réserver un diagnostic (30 min)",
} as const;

export const BOOKING_CTA_SHORT = {
  en: "Book Now",
  fr: "Réserver",
} as const;
