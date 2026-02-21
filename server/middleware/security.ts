import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Express, Request, Response, NextFunction } from "express";

/**
 * Security middleware for the RusingAcademy ecosystem.
 * Sprint 2 — Production-readiness hardening.
 *
 * IMPORTANT: Helmet CSP is applied ONLY to /api/ routes.
 * Applying CSP to the HTML document blocks Vite's dynamic import()
 * calls for lazy-loaded route chunks, causing a blank white screen.
 * Non-API routes (HTML pages, static assets) are served without CSP.
 * Security for the frontend is handled by CORS, HSTS, and other headers.
 */

// ─── Rate Limiters ───────────────────────────────────────────────────────────

/** General API rate limiter: 100 requests per 15 minutes per IP */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  skip: (req: Request) => {
    if (req.path.startsWith("/api/cron/")) return true;
    if (req.path === "/api/stripe/webhook") return true;
    if (req.path.startsWith("/api/webhooks/")) return true;
    return false;
  },
});

/** Strict rate limiter for auth endpoints: 20 requests per 15 minutes */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

/** Strict rate limiter for checkout/payment: 10 requests per 15 minutes */
export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many payment attempts, please try again later." },
});

// ─── CORS Configuration ─────────────────────────────────────────────────────

function getAllowedOrigins(): string[] {
  const origins: string[] = [];
  const appUrl = process.env.VITE_APP_URL;
  if (appUrl) origins.push(appUrl);
  origins.push("https://rusingacademy.com");
  origins.push("https://www.rusingacademy.com");
  origins.push("https://www.rusing.academy");
  origins.push("https://rusing.academy");
  if (process.env.NODE_ENV === "development") {
    origins.push("http://localhost:3000");
    origins.push("http://localhost:5173");
  }
  return origins;
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = getAllowedOrigins();
    if (origin.includes(".manus.computer") || origin.includes(".manus.space")) {
      return callback(null, true);
    }
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
});

// ─── Helmet (Security Headers) — API-only ──────────────────────────────────
// Full CSP is applied only to API routes. Frontend routes skip CSP entirely
// to allow Vite's dynamic import() for code-split chunks.

export const apiHelmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", "'unsafe-inline'", "'unsafe-eval'",
        "https://cdn.jsdelivr.net", "https://js.stripe.com",
        "https://www.googletagmanager.com", "https://www.google-analytics.com",
        "https://cloud.umami.is",
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: [
        "'self'", "'unsafe-inline'",
        "https://fonts.googleapis.com", "https://cdn.jsdelivr.net",
      ],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      connectSrc: [
        "'self'", "https://api.manus.im", "https://api.stripe.com",
        "https://api.calendly.com", "https://api.minimaxi.chat",
        "https://*.manus.computer", "https://*.manus.space",
        "wss://*.manus.computer", "wss://*.manus.space",
        "https://www.google-analytics.com",
        "https://cloud.umami.is",
        process.env.VITE_APP_URL || "",
        process.env.BUILT_IN_FORGE_API_URL || "",
        process.env.VITE_FRONTEND_FORGE_API_URL || "",
      ].filter(Boolean),
      frameSrc: [
        "'self'", "https://js.stripe.com", "https://calendly.com",
        "https://www.youtube.com", "https://player.vimeo.com",
      ],
      mediaSrc: ["'self'", "https:", "blob:"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

// Lightweight security headers for frontend routes (no CSP).
// Keeps HSTS, X-Frame-Options, referrer policy, etc. without CSP.
export const frontendHelmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});

// ─── Request Sanitization ───────────────────────────────────────────────────

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      const val = req.query[key];
      if (typeof val === "string" && val.includes("\0")) {
        req.query[key] = val.replace(/\0/g, "");
      }
    }
  }
  next();
}

// ─── Register All Security Middleware ────────────────────────────────────────

export function registerSecurityMiddleware(app: Express) {
  // API routes get full helmet with CSP
  app.use("/api/", apiHelmetMiddleware);

  // All other routes (HTML pages, static assets) get lightweight
  // security headers WITHOUT CSP to allow Vite module loading.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/")) {
      return frontendHelmetMiddleware(req, res, next);
    }
    next();
  });

  app.use(corsMiddleware);
  app.use(sanitizeRequest);
  app.use("/api/", apiRateLimiter);
  app.use("/api/auth/", authRateLimiter);
  app.use("/api/oauth/", authRateLimiter);
  app.set("trust proxy", 1);
}
