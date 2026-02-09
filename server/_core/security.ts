/**
 * Security Middleware for RusingAcademy Ecosystem
 * Sprint 4 Audit Fix — Feb 2026
 *
 * This file configures:
 * 1. Helmet (security headers)
 * 2. CORS (restricted to allowed origins)
 * 3. Rate limiting (general + auth + AI endpoints)
 *
 * INSTALLATION:
 *   pnpm add helmet cors express-rate-limit
 *   pnpm add -D @types/cors
 *
 * USAGE:
 *   Import and call applySecurityMiddleware(app) in your server/_core/app.ts
 *   BEFORE any route handlers.
 *
 *   Example:
 *     import { applySecurityMiddleware } from './security';
 *     const app = express();
 *     applySecurityMiddleware(app);
 *     // ... then mount tRPC, routes, etc.
 */

import helmet from 'helmet';
import cors from 'cors';
import rateLimit, { type Request as RateLimitRequest } from 'express-rate-limit';
import type { Express, Request } from 'express';

// ── Helper: IPv6-safe key extraction ────────────────────────────────────────
// Railway proxies may forward IPv6 addresses. We normalize them to /64 subnets
// to prevent IPv6 users from bypassing limits by rotating addresses.
function extractClientKey(req: Request): string {
  const forwarded = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
  const ip = forwarded || req.ip || 'unknown';

  // Normalize IPv6 to /64 subnet (first 4 groups) to prevent rotation bypass
  if (ip.includes(':') && ip !== 'unknown') {
    const parts = ip.replace(/^::ffff:/, '').split(':');
    if (parts.length > 4) {
      // Take first 4 groups (64-bit prefix) for subnet-based limiting
      return parts.slice(0, 4).join(':') + '::/64';
    }
  }

  return ip;
}

// ── Allowed Origins ─────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://rusingacademy.ca',
  'https://www.rusingacademy.ca',
  'https://app.rusingacademy.ca',
  'https://www.rusing.academy',
  'https://staging.rusingacademy.ca',
  // Railway staging/production URLs
  ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : []),
  // Development origins (only in non-production)
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
    : []),
  // Additional origins from env (comma-separated)
  ...(process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean) || []),
];

// ── Rate Limiters ───────────────────────────────────────────────────────────

/** General API rate limit: 100 requests per 15 minutes */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes',
  },
  keyGenerator: (req: Request) => extractClientKey(req),
  validate: { xForwardedForHeader: false, ip: false },
});

/** Auth endpoints: 10 attempts per 15 minutes (brute force protection) */
const authLimiter = rateLimit({
  windowMs: 900000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  keyGenerator: (req: Request) => extractClientKey(req),
  validate: { xForwardedForHeader: false, ip: false },
});

/** AI/TTS endpoints: 30 requests per 15 minutes (cost protection) */
const aiLimiter = rateLimit({
  windowMs: 900000,
  max: parseInt(process.env.RATE_LIMIT_AI_MAX || '30', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI request limit reached. Please try again later.',
  },
  keyGenerator: (req: Request) => extractClientKey(req),
  validate: { xForwardedForHeader: false, ip: false },
});

// ── Apply Middleware ─────────────────────────────────────────────────────────

export function applySecurityMiddleware(app: Express): void {
  // 1. Trust proxy (required behind Railway's load balancer — MUST be set before rate limiters)
  app.set('trust proxy', 1);

  // 2. Helmet — Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for Vite dev
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: [
            "'self'",
            'data:',
            'blob:',
            'https://rusingacademy-cdn.b-cdn.net',
            'https://*.googleapis.com',
            'https://*.gstatic.com',
            'https://img.youtube.com',
            'https://lh3.googleusercontent.com',
          ],
          connectSrc: [
            "'self'",
            'https://rusingacademy.ca',
            'https://api.stripe.com',
            'https://api.openai.com',
            'https://rusingacademy-cdn.b-cdn.net',
            ...(process.env.NODE_ENV !== 'production'
              ? ['http://localhost:*', 'ws://localhost:*']
              : []),
          ],
          frameSrc: ["'self'", 'https://js.stripe.com', 'https://www.youtube.com'],
          mediaSrc: ["'self'", 'https://rusingacademy-cdn.b-cdn.net', 'blob:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Required for CDN images/media
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // 3. CORS — Restricted to allowed origins
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, Postman, Railway health checks)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'stripe-signature'],
      maxAge: 86400, // 24 hours preflight cache
    })
  );

  // 4. Rate limiting — General
  app.use('/api/', generalLimiter);

  // 5. Rate limiting — Auth (stricter)
  app.use('/api/auth', authLimiter);
  app.use('/api/trpc/auth.', authLimiter);
  app.use('/api/trpc/googleAuth.', authLimiter);
  app.use('/api/trpc/microsoftAuth.', authLimiter);

  // 6. Rate limiting — AI/TTS (cost protection)
  app.use('/api/trpc/sleCompanion.', aiLimiter);
  app.use('/api/trpc/audio.', aiLimiter);

  // 7. Health check endpoint (no auth, no rate limit)
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });
}

// Export individual limiters for use on specific tRPC routes if needed
export { authLimiter, aiLimiter, generalLimiter };
