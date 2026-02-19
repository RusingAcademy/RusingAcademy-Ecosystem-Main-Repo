// server/services/monitoringService.ts — Phase 4: Centralized Monitoring (in-memory, no external deps)
import { getDb } from "../db";
import { customMetrics, alertConfigs, alertHistory } from "../../drizzle/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { createLogger } from "../logger";

const log = createLogger("services-monitoring");

// In-memory metrics buffer (flushed to DB periodically)
interface MetricPoint {
  name: string;
  value: number;
  labels: Record<string, string>;
  recordedAt: Date;
}

const metricsBuffer: MetricPoint[] = [];
const MAX_BUFFER_SIZE = 1000;
const FLUSH_INTERVAL = 60_000; // 1 minute

// In-memory counters for real-time dashboard
const realtimeCounters = {
  requestCount: 0,
  errorCount: 0,
  totalResponseTime: 0,
  activeUsers: new Set<number>(),
  startedAt: new Date(),
};

// Flush timer
let flushTimer: NodeJS.Timeout | null = null;

export const monitoringService = {
  init(): void {
    if (!flushTimer) {
      flushTimer = setInterval(() => this.flushMetrics(), FLUSH_INTERVAL);
      log.info("[Monitoring] Service initialized, flush interval: 60s");
    }
  },

  // Record a metric point
  recordMetric(name: string, value: number, labels: Record<string, string> = {}): void {
    metricsBuffer.push({ name, value, labels, recordedAt: new Date() });
    if (metricsBuffer.length > MAX_BUFFER_SIZE) {
      this.flushMetrics();
    }
  },

  // Track HTTP request
  trackRequest(method: string, path: string, statusCode: number, durationMs: number): void {
    realtimeCounters.requestCount++;
    realtimeCounters.totalResponseTime += durationMs;
    if (statusCode >= 400) realtimeCounters.errorCount++;

    this.recordMetric("http_request", durationMs, {
      method,
      path: path.split("?")[0],
      status: String(statusCode),
    });
  },

  // Track active user
  trackActiveUser(userId: number): void {
    realtimeCounters.activeUsers.add(userId);
  },

  // Get real-time overview
  getRealtimeOverview() {
    const uptimeMs = Date.now() - realtimeCounters.startedAt.getTime();
    const avgResponseTime = realtimeCounters.requestCount > 0
      ? Math.round(realtimeCounters.totalResponseTime / realtimeCounters.requestCount)
      : 0;
    const errorRate = realtimeCounters.requestCount > 0
      ? ((realtimeCounters.errorCount / realtimeCounters.requestCount) * 100).toFixed(2)
      : "0.00";

    return {
      uptime: Math.floor(uptimeMs / 1000),
      uptimeFormatted: this.formatUptime(uptimeMs),
      totalRequests: realtimeCounters.requestCount,
      totalErrors: realtimeCounters.errorCount,
      errorRate: parseFloat(errorRate),
      avgResponseTime,
      activeUsers: realtimeCounters.activeUsers.size,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      nodeVersion: process.version,
      bufferSize: metricsBuffer.length,
    };
  },

  formatUptime(ms: number): string {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${days}d ${hours}h ${minutes}m`;
  },

  // Flush buffered metrics to DB
  async flushMetrics(): Promise<number> {
    if (metricsBuffer.length === 0) return 0;

    const toFlush = metricsBuffer.splice(0, metricsBuffer.length);
    try {
      const db = await getDb();
      const values = toFlush.map((m) => ({
        name: m.name,
        value: String(m.value),
        labels: JSON.stringify(m.labels),
        recordedAt: m.recordedAt,
      }));

      // Batch insert in chunks of 100
      for (let i = 0; i < values.length; i += 100) {
        const chunk = values.slice(i, i + 100);
        await db.insert(customMetrics).values(chunk);
      }

      log.info(`[Monitoring] Flushed ${toFlush.length} metrics to DB`);
      return toFlush.length;
    } catch (err) {
      log.error("[Monitoring] Failed to flush metrics:", err);
      // Put back unflushed metrics
      metricsBuffer.unshift(...toFlush);
      return 0;
    }
  },

  // Get metrics for dashboard (aggregated)
  async getMetricsSummary(windowMinutes: number = 60) {
    const db = await getDb();
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);

    const rows = await db
      .select({
        name: customMetrics.name,
        count: sql<number>`COUNT(*)`,
        avg: sql<number>`AVG(CAST(${customMetrics.value} AS DECIMAL(10,2)))`,
        min: sql<number>`MIN(CAST(${customMetrics.value} AS DECIMAL(10,2)))`,
        max: sql<number>`MAX(CAST(${customMetrics.value} AS DECIMAL(10,2)))`,
      })
      .from(customMetrics)
      .where(gte(customMetrics.recordedAt, since))
      .groupBy(customMetrics.name);

    return rows;
  },

  // Get recent errors from metrics
  async getRecentErrors(limit: number = 50) {
    const db = await getDb();
    return db
      .select()
      .from(customMetrics)
      .where(eq(customMetrics.name, "error"))
      .orderBy(desc(customMetrics.recordedAt))
      .limit(limit);
  },

  // Alert management
  async getAlertConfigs() {
    const db = await getDb();
    return db.select().from(alertConfigs).orderBy(alertConfigs.name);
  },

  async createAlertConfig(data: {
    name: string;
    metric: string;
    condition: string;
    threshold: number;
    windowMinutes?: number;
    channels?: string;
    recipients?: string;
    enabled?: boolean;
    createdBy: number;
  }) {
    const db = await getDb();
    await db.insert(alertConfigs).values({
      name: data.name,
      metric: data.metric,
      condition: data.condition,
      threshold: String(data.threshold),
      windowMinutes: data.windowMinutes || 5,
      channels: data.channels || "email",
      recipients: data.recipients || "",
      enabled: data.enabled ?? true,
      createdBy: data.createdBy,
    });
  },

  async checkAlerts(): Promise<void> {
    try {
      const db = await getDb();
      const configs = await db.select().from(alertConfigs).where(eq(alertConfigs.enabled, true));

      for (const config of configs) {
        const since = new Date(Date.now() - (config.windowMinutes || 5) * 60 * 1000);
        const metrics = await db
          .select({ avg: sql<number>`AVG(CAST(${customMetrics.value} AS DECIMAL(10,2)))` })
          .from(customMetrics)
          .where(and(eq(customMetrics.name, config.metric), gte(customMetrics.recordedAt, since)));

        const avgValue = metrics[0]?.avg;
        if (avgValue == null) continue;

        const threshold = parseFloat(config.threshold);
        let triggered = false;
        switch (config.condition) {
          case "gt": triggered = avgValue > threshold; break;
          case "lt": triggered = avgValue < threshold; break;
          case "eq": triggered = Math.abs(avgValue - threshold) < 0.01; break;
        }

        if (triggered) {
          await db.insert(alertHistory).values({
            configId: config.id,
            metricValue: String(avgValue),
          });
          log.warn(`[Alert] ${config.name} triggered: ${avgValue} ${config.condition} ${threshold}`);
        }
      }
    } catch (err) {
      log.error("[Monitoring] Alert check failed:", err);
    }
  },

  // Reset counters (for testing)
  resetCounters(): void {
    realtimeCounters.requestCount = 0;
    realtimeCounters.errorCount = 0;
    realtimeCounters.totalResponseTime = 0;
    realtimeCounters.activeUsers.clear();
    realtimeCounters.startedAt = new Date();
  },
};
