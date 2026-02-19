/**
 * Notification Service — Phase 2
 * Enhanced notification system with in-app + push notification support
 * Adapted to match existing schema columns (notifications + pushSubscriptions)
 */
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { notifications, pushSubscriptions, users } from "../../drizzle/schema";
import { getIO } from "../websocket";
import webpush from "web-push";

// ─── VAPID Configuration ───────────────────────────────────────────────
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@rusingacademy.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// ─── Types ─────────────────────────────────────────────────────────────
export type NotificationType = "message" | "session_reminder" | "booking" | "review" | "system";

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  sendPush?: boolean;
}

// ─── Core Service ──────────────────────────────────────────────────────

/**
 * Create and deliver a notification (in-app + optional push)
 */
export async function createEnhancedNotification(
  input: CreateNotificationInput
): Promise<{ id: number; delivered: boolean; pushSent: boolean }> {
  const db = await getDb();
  if (!db) return { id: 0, delivered: false, pushSent: false };

  // Insert in-app notification using existing schema columns
  const [result] = await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link ?? null,
    metadata: input.metadata ? input.metadata : null,
    read: false,
    readAt: null,
  });

  const notificationId = Number(result.insertId);

  // Deliver via WebSocket (real-time in-app)
  const wsDelivered = deliverViaWebSocket(input.userId, {
    id: notificationId,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
    createdAt: new Date().toISOString(),
  });

  // Send push notification if requested
  let pushSent = false;
  if (input.sendPush !== false) {
    pushSent = await sendPushNotification(input.userId, {
      title: input.title,
      body: input.message,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      data: {
        url: input.link,
        notificationId,
        type: input.type,
      },
    });
  }

  return { id: notificationId, delivered: wsDelivered, pushSent };
}

/**
 * Bulk create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: number[],
  notification: Omit<CreateNotificationInput, "userId">
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      await createEnhancedNotification({ ...notification, userId });
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}

// ─── Push Subscription Management ─────────────────────────────────────

/**
 * Register a push subscription for a user
 */
export async function registerPushSubscription(
  userId: number,
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  },
  userAgent?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Check for existing subscription with same endpoint
  const existing = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
    .limit(1);

  if (existing.length > 0) {
    // Update existing
    await db
      .update(pushSubscriptions)
      .set({
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent ?? null,
        isActive: true,
      })
      .where(eq(pushSubscriptions.id, existing[0].id));

    return { id: existing[0].id, updated: true };
  }

  // Insert new
  const [result] = await db.insert(pushSubscriptions).values({
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent: userAgent ?? null,
    isActive: true,
  });

  return { id: Number(result.insertId), updated: false };
}

/**
 * Unregister a push subscription
 */
export async function unregisterPushSubscription(
  userId: number,
  endpoint: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  await db
    .update(pushSubscriptions)
    .set({ isActive: false })
    .where(
      and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.endpoint, endpoint)
      )
    );

  return { success: true };
}

/**
 * Get VAPID public key for frontend
 */
export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

// ─── Internal Helpers ──────────────────────────────────────────────────

function deliverViaWebSocket(userId: number, notification: any): boolean {
  try {
    const io = getIO();
    if (!io) return false;

    io.to(`user:${userId}`).emit("notification:new", notification);
    return true;
  } catch {
    return false;
  }
}

async function sendPushNotification(
  userId: number,
  payload: { title: string; body: string; icon?: string; badge?: string; data?: any }
): Promise<boolean> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;

  const db = await getDb();
  if (!db) return false;

  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.isActive, true)
      )
    );

  if (subscriptions.length === 0) return false;

  let anySent = false;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload),
        { TTL: 86400 } // 24 hours
      );
      anySent = true;
    } catch (err: any) {
      // If subscription is expired/invalid, deactivate it
      if (err.statusCode === 410 || err.statusCode === 404) {
        await db
          .update(pushSubscriptions)
          .set({ isActive: false })
          .where(eq(pushSubscriptions.id, sub.id));
      }
    }
  }

  return anySent;
}
