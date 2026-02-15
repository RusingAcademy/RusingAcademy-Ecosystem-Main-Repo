/**
 * Analytics Event Logger
 * 
 * Centralized event tracking for conversion funnel, revenue analytics,
 * and admin notifications. Used by Stripe webhooks and other system events.
 */
import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { createLogger } from "./logger";
const log = createLogger("analytics-events");

export type AnalyticsEventType = 
  | "page_view" | "opt_in" | "checkout_started" | "checkout_completed"
  | "payment_succeeded" | "payment_failed" | "refund_processed"
  | "subscription_created" | "subscription_renewed" | "subscription_canceled"
  | "course_enrolled" | "course_completed" | "coaching_purchased"
  | "invoice_paid" | "invoice_failed" | "churn";

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  source?: string;
  userId?: number | null;
  sessionId?: string | null;
  productId?: string | null;
  productName?: string | null;
  productType?: string | null;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any> | null;
  stripeEventId?: string | null;
}

/**
 * Log an analytics event to the database
 */
export async function logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const db = await getDb();
    await db.execute(sql`
      INSERT INTO analytics_events (eventType, source, userId, sessionId, productId, productName, productType, amount, currency, metadata, stripeEventId)
      VALUES (${event.eventType}, ${event.source || "stripe"}, ${event.userId || null}, ${event.sessionId || null}, ${event.productId || null}, ${event.productName || null}, ${event.productType || null}, ${event.amount || 0}, ${event.currency || "cad"}, ${event.metadata ? JSON.stringify(event.metadata) : null}, ${event.stripeEventId || null})
    `);
    log.info(`[Analytics] Event logged: ${event.eventType} | user=${event.userId} | product=${event.productName || "N/A"} | amount=${event.amount || 0}`);
  } catch (error) {
    log.error(`[Analytics] Failed to log event ${event.eventType}:`, error);
  }
}

/**
 * Create an admin notification
 */
export async function createAdminNotification(params: {
  userId?: number | null;
  targetRole?: string;
  title: string;
  message: string;
  type?: string;
  link?: string | null;
}): Promise<void> {
  try {
    const db = await getDb();
    await db.execute(sql`
      INSERT INTO admin_notifications (userId, targetRole, title, message, type, link)
      VALUES (${params.userId || null}, ${params.targetRole || "admin"}, ${params.title}, ${params.message}, ${params.type || "info"}, ${params.link || null})
    `);
    log.info(`[Notification] Created: ${params.title} → ${params.targetRole || "admin"}`);
  } catch (error) {
    log.error(`[Notification] Failed to create:`, error);
  }
}

/**
 * Get analytics events with filters
 */
export async function getAnalyticsEvents(filters: {
  eventType?: string;
  source?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  const db = await getDb();
  const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
  if (filters.eventType) conditions.push(sql`eventType = ${filters.eventType}`);
  if (filters.source) conditions.push(sql`source = ${filters.source}`);
  if (filters.userId) conditions.push(sql`userId = ${filters.userId}`);
  if (filters.startDate) conditions.push(sql`createdAt >= ${filters.startDate}`);
  if (filters.endDate) conditions.push(sql`createdAt <= ${filters.endDate}`);
  
  const whereFragment = sql.join(conditions, sql` AND `);
  const limit = filters.limit || 100;
  
  const [rows] = await db.execute(
    sql`SELECT * FROM analytics_events WHERE ${whereFragment} ORDER BY createdAt DESC LIMIT ${limit}`
  );
  return rows;
}

/**
 * Get conversion funnel data
 */
export async function getConversionFunnel(startDate?: string, endDate?: string) {
  const db = await getDb();
  const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
  if (startDate && endDate) {
    conditions.push(sql`createdAt BETWEEN ${startDate} AND ${endDate}`);
  }
  const whereFragment = sql.join(conditions, sql` AND `);
  
  const [rows] = await db.execute(
    sql`SELECT eventType, COUNT(*) as count, SUM(amount) as totalAmount
    FROM analytics_events
    WHERE ${whereFragment}
    GROUP BY eventType
    ORDER BY count DESC`
  );
  return rows;
}

/**
 * Get revenue by product
 */
export async function getRevenueByProduct(startDate?: string, endDate?: string) {
  const db = await getDb();
  const conditions: ReturnType<typeof sql>[] = [
    sql`eventType IN ('checkout_completed', 'payment_succeeded', 'invoice_paid')`
  ];
  if (startDate && endDate) {
    conditions.push(sql`createdAt BETWEEN ${startDate} AND ${endDate}`);
  }
  const whereFragment = sql.join(conditions, sql` AND `);
  
  const [rows] = await db.execute(
    sql`SELECT productName, productType, COUNT(*) as purchases, SUM(amount) as revenue
    FROM analytics_events
    WHERE ${whereFragment}
    GROUP BY productName, productType
    ORDER BY revenue DESC`
  );
  return rows;
}

/**
 * Get admin notifications
 */
export async function getAdminNotifications(params: {
  userId?: number;
  targetRole?: string;
  unreadOnly?: boolean;
  limit?: number;
}) {
  const db = await getDb();
  const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
  if (params.userId) conditions.push(sql`userId = ${params.userId}`);
  if (params.targetRole) conditions.push(sql`targetRole = ${params.targetRole}`);
  if (params.unreadOnly) conditions.push(sql`isRead = FALSE`);
  
  const whereFragment = sql.join(conditions, sql` AND `);
  const limit = params.limit || 50;
  
  const [rows] = await db.execute(
    sql`SELECT * FROM admin_notifications WHERE ${whereFragment} ORDER BY createdAt DESC LIMIT ${limit}`
  );
  return rows;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: number): Promise<void> {
  const db = await getDb();
  await db.execute(sql`
    UPDATE admin_notifications SET isRead = TRUE, readAt = NOW() WHERE id = ${notificationId}
  `);
}

/**
 * Mark all notifications as read for a user/role
 */
export async function markAllNotificationsRead(params: { userId?: number; targetRole?: string }): Promise<void> {
  const db = await getDb();
  if (params.userId) {
    await db.execute(sql`UPDATE admin_notifications SET isRead = TRUE, readAt = NOW() WHERE userId = ${params.userId} AND isRead = FALSE`);
  } else if (params.targetRole) {
    await db.execute(sql`UPDATE admin_notifications SET isRead = TRUE, readAt = NOW() WHERE targetRole = ${params.targetRole} AND isRead = FALSE`);
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(params: { userId?: number; targetRole?: string }): Promise<number> {
  const db = await getDb();
  const conditions: ReturnType<typeof sql>[] = [sql`isRead = FALSE`];
  if (params.userId) conditions.push(sql`userId = ${params.userId}`);
  if (params.targetRole) conditions.push(sql`targetRole = ${params.targetRole}`);
  
  const whereFragment = sql.join(conditions, sql` AND `);
  const [rows] = await db.execute(
    sql`SELECT COUNT(*) as count FROM admin_notifications WHERE ${whereFragment}`
  );
  return (rows as any)[0]?.count || 0;
}
