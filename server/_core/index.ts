import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth"
import { handleStripeWebhook } from "../stripe/webhook";
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
import { scheduleReminderJobs, runAllReminderJobs } from "../jobs/reminderJobs";
import authRbacRouter from "../routers/auth-rbac";
import googleAuthRouter from "../routers/googleAuth";
import microsoftAuthRouter from "../routers/microsoftAuth";
import adminMigrationsRouter from "../routers/admin-migrations";
import { registerVoiceRoutes } from "../routes/registerVoiceRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

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
  const app = express();
  const server = createServer(app);
  // Stripe webhook must be registered BEFORE body parser to get raw body
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  
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

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

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
