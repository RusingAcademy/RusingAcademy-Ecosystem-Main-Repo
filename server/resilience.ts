/**
 * Resilience Utility — Retry with Exponential Backoff
 *
 * Provides a generic `withRetry` wrapper for external service calls
 * (Stripe, SMTP, analytics, etc.) that handles transient failures
 * with configurable retry logic, jitter, and circuit-breaker awareness.
 *
 * Usage:
 *   import { withRetry } from "../resilience";
 *
 *   const result = await withRetry(
 *     () => stripe.checkout.sessions.create({ ... }),
 *     { label: "stripe.createCheckout", maxRetries: 3 }
 *   );
 */

import { createLogger } from "./logger";

const log = createLogger("resilience");

export interface RetryOptions {
  /** Human-readable label for logging (e.g., "stripe.createCheckout") */
  label: string;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in ms before first retry (default: 500) */
  initialDelayMs?: number;
  /** Maximum delay cap in ms (default: 10000) */
  maxDelayMs?: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier?: number;
  /** Whether to add random jitter to delays (default: true) */
  jitter?: boolean;
  /** Custom function to determine if an error is retryable (default: all errors) */
  isRetryable?: (error: unknown) => boolean;
  /** Callback invoked on each retry attempt */
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

/**
 * Default retryable error check.
 * Returns false for errors that should NOT be retried (client errors, auth failures).
 */
function defaultIsRetryable(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // Don't retry authentication / authorization errors
    if (msg.includes("unauthorized") || msg.includes("forbidden") || msg.includes("invalid api key")) {
      return false;
    }

    // Don't retry validation errors
    if (msg.includes("validation") || msg.includes("invalid param")) {
      return false;
    }

    // Check for HTTP status codes in error objects
    const statusCode = (error as any).statusCode ?? (error as any).status ?? (error as any).code;
    if (typeof statusCode === "number") {
      // 4xx errors (except 429 Too Many Requests) are not retryable
      if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
        return false;
      }
    }

    // Stripe-specific: don't retry card_error or invalid_request_error
    const stripeType = (error as any).type;
    if (stripeType === "card_error" || stripeType === "invalid_request_error") {
      return false;
    }
  }

  return true;
}

/**
 * Calculate delay with exponential backoff and optional jitter.
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  if (jitter) {
    // Full jitter: random value between 0 and cappedDelay
    return Math.floor(Math.random() * cappedDelay);
  }

  return cappedDelay;
}

/**
 * Sleep for the specified number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute an async function with retry and exponential backoff.
 *
 * @param fn - The async function to execute
 * @param options - Retry configuration
 * @returns The result of the function
 * @throws The last error if all retries are exhausted
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    label,
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 10_000,
    backoffMultiplier = 2,
    jitter = true,
    isRetryable = defaultIsRetryable,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      if (attempt > 0) {
        log.info({ label, attempt, totalAttempts: attempt + 1 }, "Succeeded after retry");
      }

      return result;
    } catch (error) {
      lastError = error;

      // If we've exhausted retries or error is not retryable, throw immediately
      if (attempt >= maxRetries || !isRetryable(error)) {
        const reason = attempt >= maxRetries ? "max retries exhausted" : "non-retryable error";
        log.error(
          {
            label,
            attempt: attempt + 1,
            maxRetries,
            reason,
            err: error instanceof Error ? error.message : String(error),
          },
          "Operation failed permanently"
        );
        throw error;
      }

      const delayMs = calculateDelay(attempt + 1, initialDelayMs, maxDelayMs, backoffMultiplier, jitter);

      log.warn(
        {
          label,
          attempt: attempt + 1,
          maxRetries,
          delayMs,
          err: error instanceof Error ? error.message : String(error),
        },
        "Retrying after transient failure"
      );

      if (onRetry) {
        onRetry(attempt + 1, error, delayMs);
      }

      await sleep(delayMs);
    }
  }

  // Should not reach here, but TypeScript needs it
  throw lastError;
}

/**
 * Pre-configured retry wrappers for common external services.
 */
export const retry = {
  /** Stripe API calls — 3 retries, 1s initial delay */
  stripe: <T>(fn: () => Promise<T>, label: string) =>
    withRetry(fn, {
      label: `stripe.${label}`,
      maxRetries: 3,
      initialDelayMs: 1000,
      maxDelayMs: 15_000,
    }),

  /** SMTP email sending — 2 retries, 2s initial delay */
  email: <T>(fn: () => Promise<T>, label: string) =>
    withRetry(fn, {
      label: `email.${label}`,
      maxRetries: 2,
      initialDelayMs: 2000,
      maxDelayMs: 10_000,
    }),

  /** Analytics/tracking calls — 1 retry, fire-and-forget friendly */
  analytics: <T>(fn: () => Promise<T>, label: string) =>
    withRetry(fn, {
      label: `analytics.${label}`,
      maxRetries: 1,
      initialDelayMs: 500,
      maxDelayMs: 3_000,
    }),

  /** Generic external API calls — 3 retries with standard backoff */
  api: <T>(fn: () => Promise<T>, label: string) =>
    withRetry(fn, {
      label: `api.${label}`,
      maxRetries: 3,
      initialDelayMs: 500,
      maxDelayMs: 10_000,
    }),
};
