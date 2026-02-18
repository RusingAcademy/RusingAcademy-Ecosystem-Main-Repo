/**
 * ============================================
 * A/B TESTING ENGINE — Core Framework
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Custom React-based A/B testing infrastructure.
 * - Variant assignment with consistent hashing
 * - Statistical significance calculation
 * - Conversion tracking integration
 * - Experiment lifecycle management
 */

export type VariantId = string;

export interface ABVariant {
  id: VariantId;
  name: string;
  weight: number; // 0-100, must sum to 100 across variants
}

export interface ABExperiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  variants: ABVariant[];
  conversionGoal: string;
  status: "draft" | "running" | "paused" | "completed";
  startDate?: string;
  endDate?: string;
  minimumSampleSize: number;
  significanceThreshold: number; // e.g., 0.95 for 95% confidence
}

export interface ABResult {
  variantId: VariantId;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABExperimentResults {
  experimentId: string;
  results: ABResult[];
  isSignificant: boolean;
  confidence: number;
  winner: VariantId | null;
  sampleSizeReached: boolean;
}

// ─── EXPERIMENT DEFINITIONS ──────────────────────────────────────────────────

export const EXPERIMENTS: ABExperiment[] = [
  {
    id: "hero-cta-text",
    name: "Hero CTA Text Optimization",
    description: "Test different CTA button text on the hero section to maximize free assessment bookings.",
    hypothesis: "Action-oriented, specific CTA text will increase click-through rate by 15% compared to generic text.",
    variants: [
      { id: "control", name: "Book Your Free Assessment", weight: 50 },
      { id: "variant-a", name: "Start Your SLE Journey Today", weight: 50 },
    ],
    conversionGoal: "free_assessment_booking",
    status: "running",
    minimumSampleSize: 500,
    significanceThreshold: 0.95,
  },
  {
    id: "hero-cta-color",
    name: "Hero CTA Color Scheme",
    description: "Test CTA button color variations for optimal conversion.",
    hypothesis: "High-contrast orange CTA will outperform teal CTA by 10% in click-through rate.",
    variants: [
      { id: "control", name: "Brand Orange (#C65A1E)", weight: 50 },
      { id: "variant-a", name: "Emerald Green (#059669)", weight: 50 },
    ],
    conversionGoal: "hero_cta_click",
    status: "running",
    minimumSampleSize: 1000,
    significanceThreshold: 0.95,
  },
  {
    id: "form-length",
    name: "Assessment Form Length",
    description: "Test short vs. detailed assessment intake form.",
    hypothesis: "A shorter 3-field form will increase completion rate by 20% compared to the 7-field form.",
    variants: [
      { id: "control", name: "Full Form (7 fields)", weight: 50 },
      { id: "variant-a", name: "Short Form (3 fields)", weight: 50 },
    ],
    conversionGoal: "assessment_form_complete",
    status: "running",
    minimumSampleSize: 300,
    significanceThreshold: 0.95,
  },
  {
    id: "social-proof-placement",
    name: "Social Proof Placement",
    description: "Test testimonial placement above vs. below the fold.",
    hypothesis: "Placing trust badges and a testimonial above the fold will increase conversion by 12%.",
    variants: [
      { id: "control", name: "Below fold (standard)", weight: 50 },
      { id: "variant-a", name: "Above fold (hero area)", weight: 50 },
    ],
    conversionGoal: "page_engagement",
    status: "draft",
    minimumSampleSize: 800,
    significanceThreshold: 0.95,
  },
  {
    id: "persona-selector-visibility",
    name: "Persona Selector Visibility",
    description: "Test whether showing the persona selector on homepage increases engagement.",
    hypothesis: "Visible persona selector will increase time on site by 25% and assessment bookings by 10%.",
    variants: [
      { id: "control", name: "No persona selector", weight: 50 },
      { id: "variant-a", name: "Persona selector visible", weight: 50 },
    ],
    conversionGoal: "persona_engagement",
    status: "draft",
    minimumSampleSize: 600,
    significanceThreshold: 0.95,
  },
];

// ─── VARIANT ASSIGNMENT ──────────────────────────────────────────────────────

const STORAGE_PREFIX = "ra_ab_";

/** Simple consistent hash for variant assignment */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/** Get or create a persistent user ID for experiment assignment */
function getUserId(): string {
  const key = `${STORAGE_PREFIX}user_id`;
  try {
    let userId = localStorage.getItem(key);
    if (!userId) {
      userId = `u_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, userId);
    }
    return userId;
  } catch {
    return `u_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/** Assign a user to a variant for a given experiment (deterministic) */
export function getVariantAssignment(experiment: ABExperiment): VariantId {
  const storageKey = `${STORAGE_PREFIX}${experiment.id}`;

  // Check for stored assignment
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && experiment.variants.some(v => v.id === stored)) {
      return stored;
    }
  } catch {
    // Storage unavailable
  }

  // Deterministic assignment based on user ID + experiment ID
  const userId = getUserId();
  const hash = hashString(`${userId}:${experiment.id}`);
  const bucket = hash % 100;

  let cumulative = 0;
  let assignedVariant = experiment.variants[0].id;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) {
      assignedVariant = variant.id;
      break;
    }
  }

  // Persist assignment
  try {
    localStorage.setItem(storageKey, assignedVariant);
  } catch {
    // Storage unavailable
  }

  return assignedVariant;
}

// ─── CONVERSION TRACKING ─────────────────────────────────────────────────────

interface ConversionEvent {
  experimentId: string;
  variantId: VariantId;
  goal: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Record a conversion event for an experiment */
export function trackABConversion(
  experimentId: string,
  goal: string,
  metadata?: Record<string, unknown>
): void {
  const experiment = EXPERIMENTS.find(e => e.id === experimentId);
  if (!experiment || experiment.status !== "running") return;

  const variantId = getVariantAssignment(experiment);

  const event: ConversionEvent = {
    experimentId,
    variantId,
    goal,
    timestamp: Date.now(),
    metadata,
  };

  // Store locally for batch upload
  try {
    const key = `${STORAGE_PREFIX}conversions`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(event);
    // Keep only last 1000 events
    if (existing.length > 1000) existing.splice(0, existing.length - 1000);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // Storage unavailable
  }

  // Fire analytics event
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "ab_conversion", {
      experiment_id: experimentId,
      variant_id: variantId,
      conversion_goal: goal,
      ...metadata,
    });
  }
}

/** Record an impression for an experiment */
export function trackABImpression(experimentId: string): void {
  const experiment = EXPERIMENTS.find(e => e.id === experimentId);
  if (!experiment || experiment.status !== "running") return;

  const variantId = getVariantAssignment(experiment);

  try {
    const key = `${STORAGE_PREFIX}impressions_${experimentId}_${variantId}`;
    const count = parseInt(localStorage.getItem(key) || "0", 10);
    localStorage.setItem(key, String(count + 1));
  } catch {
    // Storage unavailable
  }

  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "ab_impression", {
      experiment_id: experimentId,
      variant_id: variantId,
    });
  }
}

// ─── STATISTICAL SIGNIFICANCE ────────────────────────────────────────────────

/**
 * Calculate Z-score for two proportions (A/B test).
 * Uses pooled proportion method.
 */
export function calculateZScore(
  conversionsA: number,
  impressionsA: number,
  conversionsB: number,
  impressionsB: number
): number {
  if (impressionsA === 0 || impressionsB === 0) return 0;

  const pA = conversionsA / impressionsA;
  const pB = conversionsB / impressionsB;
  const pPooled = (conversionsA + conversionsB) / (impressionsA + impressionsB);

  const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB));
  if (se === 0) return 0;

  return (pA - pB) / se;
}

/**
 * Approximate p-value from Z-score using the error function.
 * Two-tailed test.
 */
export function zScoreToPValue(z: number): number {
  const absZ = Math.abs(z);
  // Approximation of the cumulative normal distribution
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989422804014327; // 1/sqrt(2*pi)
  const p = d * Math.exp(-absZ * absZ / 2) *
    (0.3193815 * t - 0.3565638 * t * t + 1.781478 * t * t * t -
     1.821256 * t * t * t * t + 1.330274 * t * t * t * t * t);
  return 2 * p; // Two-tailed
}

/**
 * Determine if an experiment has reached statistical significance.
 */
export function checkSignificance(
  results: ABResult[],
  threshold: number = 0.95
): { isSignificant: boolean; confidence: number; winner: VariantId | null } {
  if (results.length < 2) {
    return { isSignificant: false, confidence: 0, winner: null };
  }

  const [a, b] = results;
  const zScore = calculateZScore(a.conversions, a.impressions, b.conversions, b.impressions);
  const pValue = zScoreToPValue(zScore);
  const confidence = 1 - pValue;

  const isSignificant = confidence >= threshold;
  let winner: VariantId | null = null;

  if (isSignificant) {
    winner = a.conversionRate > b.conversionRate ? a.variantId : b.variantId;
  }

  return { isSignificant, confidence, winner };
}
