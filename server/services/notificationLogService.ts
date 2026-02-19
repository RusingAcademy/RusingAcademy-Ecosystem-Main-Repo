/**
 * Notification Log Service — PR 0.2
 * Writes all notification delivery events to the notifications_log table
 * for audit trail, analytics, and debugging.
 *
 * DO-NOT-TOUCH: notificationService.ts core logic — this is additive only.
 */
import { eq, and, desc, sql, between, count } from "drizzle-orm";
import { getDb } from "../db";
import { notificationsLog, users } from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("notification-log");

// ─── Types ─────────────────────────────────────────────────────────────

export type NotificationChannel = "push" | "websocket" | "email";
export type NotificationLogStatus = "pending" | "sent" | "delivered" | "failed" | "read";

export interface LogNotificationInput {
  userId: number;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, any>;
  channel: NotificationChannel;
  status: NotificationLogStatus;
  error?: string;
}

// ─── Core Logging ──────────────────────────────────────────────────────

/**
 * Log a notification delivery event to notifications_log table.
 * Fire-and-forget: errors are caught and logged, never thrown.
 */
export async function logNotification(input: LogNotificationInput): Promise<number | null> {
  try {
    const db = await getDb();
    if (!db) {
      log.warn("DB unavailable — notification log skipped");
      return null;
    }

    const now = new Date();
    const [result] = await db.insert(notificationsLog).values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      data: input.data ?? null,
      channel: input.channel,
      status: input.status,
      sentAt: input.status === "sent" || input.status === "delivered" ? now : null,
      deliveredAt: input.status === "delivered" ? now : null,
      error: input.error ?? null,
    });

    return Number(result.insertId);
  } catch (err: any) {
    log.error({ err: err.message }, "Failed to write notification log");
    return null;
  }
}

/**
 * Update the status of an existing notification log entry.
 */
export async function updateNotificationLogStatus(
  logId: number,
  status: NotificationLogStatus,
  error?: string
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    const updates: Record<string, any> = { status };
    if (status === "delivered") updates.deliveredAt = new Date();
    if (status === "read") updates.readAt = new Date();
    if (error) updates.error = error;

    await db.update(notificationsLog).set(updates).where(eq(notificationsLog.id, logId));
  } catch (err: any) {
    log.error({ err: err.message }, "Failed to update notification log status");
  }
}

/**
 * Mark a notification log entry as read.
 */
export async function markNotificationLogRead(logId: number): Promise<void> {
  return updateNotificationLogStatus(logId, "read");
}

// ─── Query Helpers ─────────────────────────────────────────────────────

/**
 * Get notification logs for a specific user, ordered by most recent.
 */
export async function getNotificationLogsForUser(
  userId: number,
  options: { limit?: number; offset?: number; channel?: NotificationChannel } = {}
) {
  const db = await getDb();
  if (!db) return [];

  const { limit = 50, offset = 0, channel } = options;

  const conditions = [eq(notificationsLog.userId, userId)];
  if (channel) conditions.push(eq(notificationsLog.channel, channel));

  return db
    .select()
    .from(notificationsLog)
    .where(and(...conditions))
    .orderBy(desc(notificationsLog.id))
    .limit(limit)
    .offset(offset);
}

/**
 * Get notification delivery stats for admin dashboard.
 */
export async function getNotificationStats(
  startDate: Date,
  endDate: Date
): Promise<{
  total: number;
  byChannel: Record<string, number>;
  byStatus: Record<string, number>;
}> {
  const db = await getDb();
  if (!db) return { total: 0, byChannel: {}, byStatus: {} };

  const dateFilter = between(notificationsLog.sentAt, startDate, endDate);

  // Total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(notificationsLog)
    .where(dateFilter);

  // By channel
  const channelResults = await db
    .select({
      channel: notificationsLog.channel,
      count: count(),
    })
    .from(notificationsLog)
    .where(dateFilter)
    .groupBy(notificationsLog.channel);

  // By status
  const statusResults = await db
    .select({
      status: notificationsLog.status,
      count: count(),
    })
    .from(notificationsLog)
    .where(dateFilter)
    .groupBy(notificationsLog.status);

  return {
    total: totalResult?.count ?? 0,
    byChannel: Object.fromEntries(channelResults.map((r) => [r.channel, r.count])),
    byStatus: Object.fromEntries(statusResults.map((r) => [r.status, r.count])),
  };
}
