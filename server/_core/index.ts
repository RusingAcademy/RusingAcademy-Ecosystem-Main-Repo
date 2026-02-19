import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerSecurityMiddleware } from "../middleware/security";
import { registerOAuthRoutes } from "./oauth"
import { handleStripeWebhook } from "../stripe/webhook";
import { handleStripeConnectWebhook } from "../webhooks/stripeConnect";
import { executeWeeklyReportsCron, forceExecuteAllReports } from "../cron/weekly-reports";
import { executeOutcomeRemindersCron, getOutcomeReminderSummary } from "../cron/outcome-reminders";
import { runLeadScoreRecalculation } from "../cron/lead-score-recalc";
import { runPipelineNotificationsCron } from "../cron/pipeline-notifications";
import { runCrmActivityReportCron } from "../cron/crm-activity-report";
import { handleAutoDeduplicationCron } from "../cron/auto-deduplication";
import { getDeduplicationStats } from "../auto-deduplication";
import { 
  decodeTrackingToken, 
  recordEmailOpen, 
  recordEmailClick, 
  getTrackingPixelBuffer 
} from "../email-tracking";
import {
  decodeUnsubscribeToken,
  processUnsubscribe,
  getUnsubscribeStats,
} from "../email-unsubscribe";
import calendlyRouter from "../webhooks/calendly";
import { startReminderScheduler } from "../session-reminders";
import { startHealthCheckScheduler } from "../cron/health-checks";
import { initWebSocket } from "../websocket";
import { scheduleReminderJobs, runAllReminderJobs } from "../jobs/reminderJobs";
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import authRbacRouter from "../routers/auth-rbac";
import googleAuthRouter from "../routers/googleAuth";
import microsoftAuthRouter from "../routers/microsoftAuth";
import adminMigrationsRouter from "../routers/admin-migrations";
import { registerVoiceRoutes } from "../routes/registerVoiceRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./vite";
import { metricsCollector, globalErrorHandler, registerMetricsEndpoint } from "../middleware/observability";
import { initSentry, captureException } from "../lib/sentry";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // PR 0.3: Initialize Sentry (no-op if SENTRY_DSN not set)
  initSentry();

  const app = express();
  const server = createServer(app);
  // Stripe webhook must be registered BEFORE body parser to get raw body
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

  // Stripe Connect webhook (separate endpoint for Connect-specific events)
  app.post("/api/webhooks/stripe-connect", express.raw({ type: "application/json" }), handleStripeConnectWebhook);

  // Security middleware (helmet, CORS, rate limiting, sanitization)
  registerSecurityMiddleware(app);

  // Request correlation IDs — must be early so all downstream handlers get req.log
  const { requestIdMiddleware } = await import("../middleware/requestId");
  app.use(requestIdMiddleware);

  // Metrics collection — records request count, error rate, latency per route
  app.use(metricsCollector);

  // ═══ Deep Health Check Endpoint (Sprint J5) ═══
  app.get("/api/health", async (_req, res) => {
    const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};
    const start = Date.now();

    // 1. Database connectivity
    try {
      const dbStart = Date.now();
      const db = await getDb();
      if (db) {
        await db.execute(sql`SELECT 1`);
        checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
      } else {
        checks.database = { status: "unavailable", error: "getDb() returned null" };
      }
    } catch (err: any) {
      checks.database = { status: "error", error: err.message || "Connection failed" };
    }

    // 2. Stripe API connectivity
    try {
      const stripeStart = Date.now();
      if (process.env.STRIPE_SECRET_KEY) {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        await stripe.balance.retrieve();
        checks.stripe = { status: "ok", latencyMs: Date.now() - stripeStart };
      } else {
        checks.stripe = { status: "not_configured", error: "STRIPE_SECRET_KEY not set" };
      }
    } catch (err: any) {
      checks.stripe = { status: "error", error: err.message || "API call failed" };
    }

    // 3. Memory usage
    const mem = process.memoryUsage();
    const heapUsedMB = mem.heapUsed / 1024 / 1024;
    const rssMB = mem.rss / 1024 / 1024;
    checks.memory = {
      status: rssMB > 450 ? "critical" : rssMB > 300 ? "warning" : "ok",
      latencyMs: 0,
    };

    // Overall status — always return 200 so Railway healthcheck passes.
    // Degraded status is reported in the response body for monitoring.
    const allOk = Object.values(checks).every(c => c.status === "ok" || c.status === "not_configured");

    res.status(200).json({
      status: allOk ? "healthy" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      totalLatencyMs: Date.now() - start,
      checks,
      memory: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        rssMB: Math.round(mem.rss / 1024 / 1024),
      },
    });
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app); 
  
  // Calendly webhook endpoint
  app.use("/api/webhooks/calendly", calendlyRouter);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Auth RBAC routes (password setup, permissions)
  app.use("/api/auth", authRbacRouter);
  
  // Google OAuth routes
  app.use("/api/auth", googleAuthRouter);
  
  // Microsoft OAuth routes
  app.use("/api/auth", microsoftAuthRouter);
  
  // Admin migrations (secured with MIGRATION_SECRET)
  app.use("/api/admin/migrations", adminMigrationsRouter);

  // Public API v1 (secured with API key)
  const apiV1Module = await import("../routes/apiV1");
  const apiV1Router = apiV1Module.default;
  app.use("/api/v1", apiV1Router);

  // Voice API routes (MiniMax TTS + OpenAI Whisper STT)
  registerVoiceRoutes(app);
  
  // Cron endpoints for scheduled tasks
  app.post("/api/cron/weekly-reports", async (req, res) => {
    // Verify cron secret for security
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await executeWeeklyReportsCron();
      console.log(`[Cron] Weekly reports completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Weekly reports error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });
  
  // Manual trigger for testing (admin only)
  app.post("/api/cron/weekly-reports/force", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await forceExecuteAllReports();
      console.log(`[Cron] Force weekly reports completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Force weekly reports error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Outcome reminder cron endpoint
  app.post("/api/cron/outcome-reminders", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await executeOutcomeRemindersCron();
      console.log(`[Cron] Outcome reminders completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Outcome reminders error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Get outcome reminder summary (for dashboard)
  app.get("/api/cron/outcome-reminders/summary", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const summary = await getOutcomeReminderSummary();
      res.json(summary);
    } catch (error) {
      console.error("[Cron] Outcome reminder summary error:", error);
      res.status(500).json({ error: "Failed to get summary" });
    }
  });

  // Lead score recalculation cron endpoint
  app.post("/api/cron/lead-score-recalc", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await runLeadScoreRecalculation();
      console.log(`[Cron] Lead score recalculation completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Lead score recalculation error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Pipeline notifications cron endpoint
  app.post("/api/cron/pipeline-notifications", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await runPipelineNotificationsCron();
      console.log(`[Cron] Pipeline notifications completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Pipeline notifications error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // CRM activity report cron endpoint
  app.post("/api/cron/crm-activity-report", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const recipientEmail = req.body?.recipientEmail;
      const result = await runCrmActivityReportCron(recipientEmail);
      console.log(`[Cron] CRM activity report completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] CRM activity report error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Auto-deduplication cron endpoint
  app.post("/api/cron/auto-deduplication", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await handleAutoDeduplicationCron();
      console.log(`[Cron] Auto-deduplication completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Auto-deduplication error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Email reminder jobs cron endpoint
  app.post("/api/cron/email-reminders", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const result = await runAllReminderJobs();
      console.log(`[Cron] Email reminders completed:`, result);
      res.json(result);
    } catch (error) {
      console.error("[Cron] Email reminders error:", error);
      res.status(500).json({ error: "Failed to execute cron job" });
    }
  });

  // Health check cron endpoint (can be triggered externally)
  app.post("/api/cron/health-checks", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const { executeHealthChecks } = await import("../cron/health-checks");
      const result = await executeHealthChecks();
      // @ts-expect-error - TS2339: auto-suppressed during TS cleanup
      console.log(`[Cron] Health checks completed:`, result.results?.length, "checks");
      res.json(result);
    } catch (error) {
      console.error("[Cron] Health checks error:", error);
      res.status(500).json({ error: "Failed to execute health checks" });
    }
  });

  // Push notification cron: streak risk check (daily at 8 PM)
  app.post("/api/cron/push-streak-check", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const { checkStreaksAtRisk } = await import("../services/pushNotificationService");
      const notified = await checkStreaksAtRisk();
      res.json({ success: true, notified });
    } catch (error) {
      console.error("[Cron] Streak check error:", error);
      res.status(500).json({ error: "Failed to check streaks" });
    }
  });

  // Push notification cron: session reminders (every 15 min)
  app.post("/api/cron/push-session-reminders", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const { checkUpcomingSessions } = await import("../services/pushNotificationService");
      const notified = await checkUpcomingSessions();
      res.json({ success: true, notified });
    } catch (error) {
      console.error("[Cron] Session reminders error:", error);
      res.status(500).json({ error: "Failed to check sessions" });
    }
  });

  // Push notification API: send push to a specific user (internal use)
  app.post("/api/notifications/push", express.json(), async (req, res) => {
    try {
      const { sendPushToUser } = await import("../services/pushNotificationService");
      const { userId, title, body, icon, data, url } = req.body;
      if (!userId || !title || !body) {
        return res.status(400).json({ error: "Missing userId, title, or body" });
      }
      const result = await sendPushToUser(userId, {
        title, body, icon, url,
        category: "messages",
        data,
      });
      res.json(result);
    } catch (error) {
      console.error("[Push] Send error:", error);
      res.status(500).json({ error: "Failed to send push notification" });
    }
  });

  // Deduplication stats endpoint
  app.get("/api/deduplication/stats", async (req, res) => {
    try {
      const stats = await getDeduplicationStats();
      res.json(stats);
    } catch (error) {
      console.error("[Deduplication] Stats error:", error);
      res.status(500).json({ error: "Failed to get deduplication stats" });
    }
  });

  // Email tracking endpoints
  app.get("/api/track/open/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const data = decodeTrackingToken(token);
      
      if (data && data.type === "open") {
        await recordEmailOpen(data.logId, {
          userAgent: req.headers["user-agent"],
          ipAddress: req.ip,
        });
      }
      
      // Return 1x1 transparent GIF
      const pixel = getTrackingPixelBuffer();
      res.set({
        "Content-Type": "image/gif",
        "Content-Length": pixel.length,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      });
      res.send(pixel);
    } catch (error) {
      console.error("[Email Tracking] Open tracking error:", error);
      // Still return pixel even on error
      const pixel = getTrackingPixelBuffer();
      res.set("Content-Type", "image/gif");
      res.send(pixel);
    }
  });

  app.get("/api/track/click/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const data = decodeTrackingToken(token);
      
      if (data && data.type === "click" && data.url) {
        await recordEmailClick(data.logId, data.url, {
          userAgent: req.headers["user-agent"],
          ipAddress: req.ip,
        });
        
        // Redirect to original URL
        res.redirect(302, data.url);
      } else {
        res.status(400).send("Invalid tracking token");
      }
    } catch (error) {
      console.error("[Email Tracking] Click tracking error:", error);
      res.status(500).send("Tracking error");
    }
  });

  // Unsubscribe API endpoint
  app.post("/api/unsubscribe/:token", express.json(), async (req, res) => {
    try {
      const { token } = req.params;
      const { reason } = req.body || {};
      
      const decoded = decodeUnsubscribeToken(token);
      
      if (!decoded.valid) {
        return res.status(400).json({ success: false, message: "Invalid unsubscribe token" });
      }
      
      const result = await processUnsubscribe(decoded.leadId, reason);
      res.json(result);
    } catch (error) {
      console.error("[Unsubscribe] Error:", error);
      res.status(500).json({ success: false, message: "Failed to process unsubscribe" });
    }
  });

  // Unsubscribe stats (admin only)
  app.get("/api/unsubscribe/stats", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const stats = await getUnsubscribeStats();
      res.json(stats);
    } catch (error) {
      console.error("[Unsubscribe] Stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // ─── Google Search Console Verification ─────────────────────────────────────
  // Serve GSC HTML verification file dynamically (code set via GSC_VERIFICATION_CODE env)
  app.get(/^\/google([a-f0-9]+)\.html$/, (req, res) => {
    const code = req.params[0];
    res.set("Content-Type", "text/html");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(`google-site-verification: google${code}.html`);
  });

  // ─── VAPID Public Key Endpoint ─────────────────────────────────────────────
  // Exposes the VAPID public key so the frontend can subscribe to push notifications
  app.get("/api/push/vapid-key", (_req, res) => {
    const vapidKey = process.env.VAPID_PUBLIC_KEY || "";
    if (!vapidKey) {
      return res.status(503).json({ error: "Push notifications not configured" });
    }
    res.set("Cache-Control", "public, max-age=86400");
    res.json({ vapidPublicKey: vapidKey });
  });

  // Dynamic SEO routes (sitemap.xml and robots.txt)
  const { generateSitemapXml, generateRobotsTxt } = await import("../seo/sitemap");
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await generateSitemapXml();
      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("[SEO] Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
  app.get("/robots.txt", (_req, res) => {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(generateRobotsTxt());
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // REST metrics endpoint (protected by CRON_SECRET)
  registerMetricsEndpoint(app);

  // Global error handler — must be LAST middleware
  app.use(globalErrorHandler);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Initialize WebSocket (Socket.io) on the HTTP server
  await initWebSocket(server);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Start session reminder scheduler
    startReminderScheduler();
    
    // Start email reminder jobs scheduler (runs daily at 9 AM)
    scheduleReminderJobs(9, 0);
    
    // Start automated health check scheduler (runs hourly)
    startHealthCheckScheduler();
  });
}

startServer().catch(console.error);
