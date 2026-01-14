import { Request, Response, NextFunction } from "express";

/**
 * Security Headers Middleware
 * Implements critical security headers to protect against common web vulnerabilities:
 * - HSTS: Enforces HTTPS connections
 * - CSP: Prevents XSS attacks by controlling resource loading
 * - X-Frame-Options: Prevents clickjacking attacks
 * - X-Content-Type-Options: Prevents MIME-sniffing attacks
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Controls browser features
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Strict-Transport-Security (HSTS)
  // Forces HTTPS for 1 year, includes subdomains
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content-Security-Policy (CSP)
  // Allows resources from same origin, inline styles/scripts (needed for React), and trusted CDNs
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com https://*.clerk.accounts.dev https://clerk.rusingacademy.ca",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://clerk.rusingacademy.ca https://*.posthog.com wss://*.clerk.accounts.dev",
    "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
  
  res.setHeader("Content-Security-Policy", cspDirectives);

  // X-Frame-Options
  // Prevents the page from being embedded in iframes (clickjacking protection)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // X-Content-Type-Options
  // Prevents MIME-sniffing attacks
  res.setHeader("X-Content-Type-Options", "nosniff");

  // X-XSS-Protection
  // Legacy XSS protection for older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer-Policy
  // Controls how much referrer information is sent
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions-Policy (formerly Feature-Policy)
  // Restricts access to browser features
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=(self)"
  );

  // Remove X-Powered-By header (hides Express)
  res.removeHeader("X-Powered-By");

  next();
}

/**
 * Middleware to explicitly disable X-Powered-By header
 * Can be used as an alternative or in addition to securityHeaders
 */
export function disablePoweredBy(req: Request, res: Response, next: NextFunction) {
  res.removeHeader("X-Powered-By");
  next();
}
