/**
 * Sentry Client Integration — PR 0.3
 *
 * Wraps @sentry/react with a feature-flag guard.
 * When VITE_SENTRY_DSN is not set, all calls are safe no-ops.
 *
 * DO-NOT-TOUCH: This module is additive — no existing code is modified.
 */
import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || "development";
const SENTRY_RELEASE = import.meta.env.VITE_SENTRY_RELEASE || "unknown";

let initialized = false;

/**
 * Initialize Sentry for the React client.
 * Safe to call multiple times — only initializes once.
 * No-op if VITE_SENTRY_DSN is not configured.
 */
export function initSentryClient(): void {
  if (initialized) return;
  if (!SENTRY_DSN) {
    console.info("[Sentry] DSN not configured — client error tracking disabled");
    initialized = true;
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: SENTRY_ENVIRONMENT === "production" ? 1.0 : 0,
      // Filter out noisy browser errors
      ignoreErrors: [
        "ResizeObserver loop",
        "Non-Error promise rejection",
        "Load failed",
        "Failed to fetch",
        "NetworkError",
        "ChunkLoadError",
      ],
      beforeSend(event) {
        // Strip PII from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map((bc) => {
            if (bc.data?.url) {
              try {
                const url = new URL(bc.data.url);
                url.searchParams.delete("token");
                url.searchParams.delete("email");
                bc.data.url = url.toString();
              } catch {
                // Keep original
              }
            }
            return bc;
          });
        }
        return event;
      },
    });
    console.info("[Sentry] Client initialized", { env: SENTRY_ENVIRONMENT });
    initialized = true;
  } catch (err) {
    console.error("[Sentry] Failed to initialize client:", err);
    initialized = true;
  }
}

/**
 * Capture an exception in Sentry (client-side).
 */
export function captureClientException(error: Error, context?: Record<string, any>): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  } catch {
    // Never let Sentry crash the app
  }
}

/**
 * Capture a message in Sentry (client-side).
 */
export function captureClientMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.captureMessage(message, level);
  } catch {
    // Silent
  }
}

/**
 * Set user context for Sentry (client-side).
 */
export function setSentryUser(user: { id: number; email?: string; role?: string }): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.setUser({
      id: String(user.id),
      email: user.email,
      segment: user.role,
    });
  } catch {
    // Silent
  }
}

/**
 * Clear user context (on logout).
 */
export function clearSentryUser(): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.setUser(null);
  } catch {
    // Silent
  }
}

/**
 * Sentry ErrorBoundary component for React.
 * Re-exported for convenience.
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export { Sentry };
