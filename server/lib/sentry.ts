/**
 * Sentry Server Integration — PR 0.3
 *
 * Wraps @sentry/node with a feature-flag guard.
 * When SENTRY_DSN is not set, all calls are safe no-ops.
 *
 * DO-NOT-TOUCH: This module is additive — no existing code is modified.
 */
import * as Sentry from "@sentry/node";
import { createLogger } from "../logger";

const log = createLogger("sentry");

const SENTRY_DSN = process.env.SENTRY_DSN || "";
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development";
const SENTRY_RELEASE = process.env.SENTRY_RELEASE || process.env.RAILWAY_GIT_COMMIT_SHA || "unknown";

let initialized = false;

/**
 * Initialize Sentry for the server.
 * Safe to call multiple times — only initializes once.
 * No-op if SENTRY_DSN is not configured.
 */
export function initSentry(): void {
  if (initialized) return;
  if (!SENTRY_DSN) {
    log.info("Sentry DSN not configured — error tracking disabled");
    initialized = true;
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
      // Only capture errors, not performance in staging
      profilesSampleRate: 0,
      // Filter out noisy errors
      ignoreErrors: [
        "ECONNRESET",
        "ECONNREFUSED",
        "EPIPE",
        "socket hang up",
        "AbortError",
      ],
      beforeSend(event) {
        // Strip sensitive data from headers
        if (event.request?.headers) {
          delete event.request.headers["authorization"];
          delete event.request.headers["cookie"];
        }
        return event;
      },
    });
    log.info({ env: SENTRY_ENVIRONMENT, release: SENTRY_RELEASE }, "Sentry initialized");
    initialized = true;
  } catch (err: any) {
    log.error({ err: err.message }, "Failed to initialize Sentry");
    initialized = true; // Prevent retry loops
  }
}

/**
 * Capture an exception in Sentry.
 * No-op if Sentry is not initialized or DSN is not set.
 */
export function captureException(error: Error, context?: Record<string, any>): void {
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
 * Capture a message in Sentry.
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.captureMessage(message, level);
  } catch {
    // Never let Sentry crash the app
  }
}

/**
 * Set user context for Sentry.
 */
export function setUser(user: { id: number; email?: string; role?: string }): void {
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
export function clearUser(): void {
  if (!SENTRY_DSN) return;
  try {
    Sentry.setUser(null);
  } catch {
    // Silent
  }
}

/**
 * Express error handler that captures to Sentry before passing to next handler.
 * Use BEFORE the existing globalErrorHandler.
 */
export function sentryErrorHandler() {
  return Sentry.setupExpressErrorHandler
    ? Sentry.Handlers?.errorHandler?.() ?? ((_err: any, _req: any, _res: any, next: any) => next(_err))
    : (_err: any, _req: any, _res: any, next: any) => next(_err);
}

/**
 * Flush Sentry events before process exit.
 */
export async function flushSentry(timeout = 2000): Promise<void> {
  if (!SENTRY_DSN) return;
  try {
    await Sentry.close(timeout);
  } catch {
    // Silent
  }
}

export { Sentry };
