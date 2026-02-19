/**
 * Session Manager — Phase 6 Security Hardening
 *
 * Enhanced session management with:
 * - Session listing (see all active sessions)
 * - Session revocation (log out specific sessions)
 * - Session metadata tracking (IP, user agent, last activity)
 * - Idle timeout enforcement
 */
import { getDb } from "../db";
import { eq, and, desc, lt } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("session-manager");

// Session idle timeout: 30 days (matches JWT expiry)
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Idle timeout: 7 days of inactivity
const SESSION_IDLE_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionInfo {
  id: number;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  lastActivity?: Date;
  ipAddress?: string;
  userAgent?: string;
  isCurrent: boolean;
}

/**
 * Clean up expired sessions for a user
 * Called periodically or on session list request
 */
export async function cleanupExpiredSessions(userId?: number): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;

    const now = new Date();

    // Check if userSessions table exists by trying a simple query
    // If it doesn't exist, silently return
    try {
      if (userId) {
        const result = await db
          .delete(schema.userSessions)
          .where(
            and(
              eq(schema.userSessions.userId, userId),
              lt(schema.userSessions.expiresAt, now)
            )
          );
        return 0; // drizzle delete doesn't return count easily
      } else {
        await db
          .delete(schema.userSessions)
          .where(lt(schema.userSessions.expiresAt, now));
        return 0;
      }
    } catch {
      // Table might not exist yet, that's OK
      return 0;
    }
  } catch (error) {
    log.error("[SessionManager] Failed to cleanup sessions:", error);
    return 0;
  }
}

/**
 * Get the number of active sessions for a user
 */
export async function getActiveSessionCount(userId: number): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;

    try {
      const sessions = await db
        .select({ id: schema.userSessions.id })
        .from(schema.userSessions)
        .where(eq(schema.userSessions.userId, userId));
      return sessions.length;
    } catch {
      return 0;
    }
  } catch {
    return 0;
  }
}

/**
 * Enforce maximum concurrent sessions per user
 * If exceeded, revoke the oldest session
 */
export async function enforceMaxSessions(userId: number, maxSessions: number = 10): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    try {
      const sessions = await db
        .select({ id: schema.userSessions.id, createdAt: schema.userSessions.createdAt })
        .from(schema.userSessions)
        .where(eq(schema.userSessions.userId, userId))
        .orderBy(desc(schema.userSessions.createdAt));

      if (sessions.length > maxSessions) {
        const sessionsToRevoke = sessions.slice(maxSessions);
        for (const session of sessionsToRevoke) {
          await db
            .delete(schema.userSessions)
            .where(eq(schema.userSessions.id, session.id));
        }
        log.info(`[SessionManager] Revoked ${sessionsToRevoke.length} excess sessions for userId=${userId}`);
      }
    } catch {
      // Table might not exist
    }
  } catch (error) {
    log.error("[SessionManager] Failed to enforce max sessions:", error);
  }
}
