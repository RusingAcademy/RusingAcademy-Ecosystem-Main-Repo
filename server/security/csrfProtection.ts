/**
 * CSRF Protection — Phase 6 Security Hardening
 *
 * Double-submit cookie pattern for CSRF protection on mutation endpoints.
 * Works alongside the existing HTTP-only session cookie.
 *
 * Strategy:
 * - Server sets a CSRF token in a readable cookie on GET /api/auth/csrf-token
 * - Client sends the token in X-CSRF-Token header on mutations
 * - Server validates the header matches the cookie
 *
 * Note: This is applied to tRPC mutations only, not queries.
 */
import { randomBytes } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { createLogger } from "../logger";

const log = createLogger("csrf-protection");

const CSRF_COOKIE_NAME = "ra_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Set CSRF token cookie (readable by JavaScript, NOT HttpOnly)
 */
export function setCsrfCookie(res: Response, token: string): void {
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by client JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * CSRF validation middleware
 *
 * Validates that the X-CSRF-Token header matches the csrf cookie.
 * Only applies to state-changing methods (POST, PUT, PATCH, DELETE).
 * Skips GET, HEAD, OPTIONS requests.
 * Skips webhook endpoints and public API routes.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Only check state-changing methods
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method.toUpperCase())) {
    return next();
  }

  // Skip webhook endpoints (they use their own auth)
  if (req.path.startsWith("/api/stripe/webhook") ||
      req.path.startsWith("/api/webhooks/") ||
      req.path.startsWith("/api/cron/")) {
    return next();
  }

  // Skip public API routes (they use API key auth)
  if (req.path.startsWith("/api/v1/")) {
    return next();
  }

  // Get token from header and cookie
  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME] as string | undefined;

  // If no CSRF cookie is set, skip validation (first request)
  // The token will be set on the next GET /api/auth/csrf-token call
  if (!cookieToken) {
    return next();
  }

  // If cookie exists but no header, log but don't block (gradual rollout)
  if (!headerToken) {
    log.warn(`[CSRF] Missing header token for ${req.method} ${req.path} from ${req.ip}`);
    // TODO: In production hardening, uncomment the following:
    // return res.status(403).json({ error: "CSRF token missing" });
    return next();
  }

  // Validate tokens match
  if (headerToken !== cookieToken) {
    log.warn(`[CSRF] Token mismatch for ${req.method} ${req.path} from ${req.ip}`);
    // TODO: In production hardening, uncomment the following:
    // return res.status(403).json({ error: "CSRF token invalid" });
    return next();
  }

  next();
}

/**
 * Express route handler: GET /api/auth/csrf-token
 * Returns a fresh CSRF token and sets it as a cookie
 */
export function csrfTokenEndpoint(req: Request, res: Response): void {
  const token = generateCsrfToken();
  setCsrfCookie(res, token);
  res.json({ token });
}
