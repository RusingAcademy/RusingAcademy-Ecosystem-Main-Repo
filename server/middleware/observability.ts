/**
 * Observability — Metrics Collection & Error Handler
 * 
 * Complements the existing requestId middleware by adding:
 *   1. In-memory request metrics (count, error rate, latency percentiles per route)
 *   2. A global error handler for unhandled Express errors
 *   3. A REST endpoint factory for /api/metrics
 * 
 * The existing requestId middleware already handles:
 *   - Correlation IDs (X-Request-Id)
 *   - Request/response logging via Pino child logger
 *   - Response time logging
 * 
 * This module adds the quantitative layer on top of that qualitative logging.
 * 
 * @module server/middleware/observability
 */

import { Request, Response, NextFunction, Express } from "express";
import { createLogger } from "../logger";

const log = createLogger("observability");

// ============================================================================
// METRICS STORE (In-Memory, Reset-on-Deploy)
// ============================================================================

interface RouteMetric {
  count: number;
  errors: number;
  totalMs: number;
  maxMs: number;
  minMs: number;
  latencies: number[];
}

const MAX_LATENCY_SAMPLES = 1000;
const metrics: Map<string, RouteMetric> = new Map();
let globalMetrics = {
  totalRequests: 0,
  totalErrors: 0,
  startTime: Date.now(),
};

function getRouteKey(method: string, path: string): string {
  const normalized = path
    .replace(/\/\d+/g, "/:id")
    .replace(/\/[a-f0-9-]{36}/g, "/:uuid")
    .replace(/\?.*$/, "");
  return `${method} ${normalized}`;
}

function recordMetric(routeKey: string, durationMs: number, isError: boolean): void {
  let metric = metrics.get(routeKey);
  if (!metric) {
    metric = { count: 0, errors: 0, totalMs: 0, maxMs: 0, minMs: Infinity, latencies: [] };
    metrics.set(routeKey, metric);
  }

  metric.count++;
  metric.totalMs += durationMs;
  metric.maxMs = Math.max(metric.maxMs, durationMs);
  metric.minMs = Math.min(metric.minMs, durationMs);
  if (isError) metric.errors++;

  if (metric.latencies.length >= MAX_LATENCY_SAMPLES) {
    metric.latencies.shift();
  }
  metric.latencies.push(durationMs);

  globalMetrics.totalRequests++;
  if (isError) globalMetrics.totalErrors++;
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// ============================================================================
// METRICS COLLECTION MIDDLEWARE
// ============================================================================

/**
 * Lightweight metrics collection middleware.
 * Records request count, error rate, and latency per route.
 * Should be registered early in the middleware chain (after requestId).
 */
export function metricsCollector(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();

  const originalEnd = res.end;
  res.end = function (this: Response, ...args: any[]) {
    const durationNs = process.hrtime.bigint() - startTime;
    const durationMs = Number(durationNs) / 1_000_000;
    const isError = res.statusCode >= 400;
    const routeKey = getRouteKey(req.method, req.path);
    recordMetric(routeKey, durationMs, isError);
    return originalEnd.apply(this, args as any);
  } as any;

  next();
}

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 * Captures unhandled errors, logs them with full context, and returns a safe response.
 */
export function globalErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.requestId || req.headers["x-request-id"] as string || "unknown";

  log.error({
    reqId: requestId,
    method: req.method,
    path: req.path,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
  }, "unhandled_error");

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  if (!res.headersSent) {
    res.status(statusCode).json({
      error: process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
      requestId,
    });
  }
}

// ============================================================================
// METRICS API
// ============================================================================

/**
 * Get current metrics snapshot.
 */
export function getMetricsSnapshot() {
  const uptimeMs = Date.now() - globalMetrics.startTime;
  const uptimeHours = Math.round(uptimeMs / 3_600_000 * 100) / 100;

  const routes: Array<{
    route: string;
    count: number;
    errors: number;
    errorRate: string;
    avgMs: string;
    p50Ms: string;
    p95Ms: string;
    p99Ms: string;
    maxMs: string;
  }> = [];

  for (const [route, metric] of metrics.entries()) {
    routes.push({
      route,
      count: metric.count,
      errors: metric.errors,
      errorRate: `${((metric.errors / metric.count) * 100).toFixed(1)}%`,
      avgMs: (metric.totalMs / metric.count).toFixed(1),
      p50Ms: percentile(metric.latencies, 50).toFixed(1),
      p95Ms: percentile(metric.latencies, 95).toFixed(1),
      p99Ms: percentile(metric.latencies, 99).toFixed(1),
      maxMs: metric.maxMs.toFixed(1),
    });
  }

  routes.sort((a, b) => b.count - a.count);

  return {
    uptime: {
      ms: uptimeMs,
      hours: uptimeHours,
      since: new Date(globalMetrics.startTime).toISOString(),
    },
    totals: {
      requests: globalMetrics.totalRequests,
      errors: globalMetrics.totalErrors,
      errorRate: globalMetrics.totalRequests > 0
        ? `${((globalMetrics.totalErrors / globalMetrics.totalRequests) * 100).toFixed(2)}%`
        : "0%",
    },
    routes: routes.slice(0, 50),
    collectedAt: new Date().toISOString(),
  };
}

/**
 * Reset all metrics. Used for testing or manual reset.
 */
export function resetMetrics(): void {
  metrics.clear();
  globalMetrics = {
    totalRequests: 0,
    totalErrors: 0,
    startTime: Date.now(),
  };
}

// ============================================================================
// REST ENDPOINT REGISTRATION
// ============================================================================

/**
 * Register the /api/metrics REST endpoint on the Express app.
 * Protected by CRON_SECRET for external monitoring tools.
 */
export function registerMetricsEndpoint(app: Express): void {
  app.get("/api/metrics", (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    // Allow access if no CRON_SECRET is set (dev mode) or if auth matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.json(getMetricsSnapshot());
  });

  log.info("Metrics endpoint registered at /api/metrics");
}
