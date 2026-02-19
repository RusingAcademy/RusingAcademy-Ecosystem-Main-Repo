/**
 * Auth Audit Logger — Phase 6 Security Hardening
 *
 * Centralized security event logging for authentication actions.
 * Logs to the audit_log table with structured event types.
 */
import { getDb } from "../db";
import { auditLog } from "../../drizzle/rbac-schema";
import { createLogger } from "../logger";
import type { Request } from "express";

const log = createLogger("security-audit");

// ============================================================================
// Event Types
// ============================================================================

export type AuthAuditAction =
  | "auth.login.success"
  | "auth.login.failed"
  | "auth.signup.success"
  | "auth.logout"
  | "auth.password.changed"
  | "auth.password.reset_requested"
  | "auth.password.reset_completed"
  | "auth.session.created"
  | "auth.session.expired"
  | "auth.session.revoked"
  | "auth.invitation.sent"
  | "auth.invitation.accepted"
  | "auth.invitation.revoked"
  | "auth.role.changed"
  | "auth.account.locked"
  | "auth.account.unlocked"
  | "auth.rate_limit.exceeded"
  | "auth.csrf.violation"
  | "auth.sso.login"
  | "auth.sso.linked";

export interface AuditLogEntry {
  userId: number;
  action: AuthAuditAction;
  targetType?: string;
  targetId?: number;
  details?: Record<string, any>;
  req?: Request;
}

// ============================================================================
// Logger Functions
// ============================================================================

/**
 * Extract client IP from request, handling proxies
 */
function getClientIP(req?: Request): string | undefined {
  if (!req) return undefined;
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress || undefined;
}

/**
 * Extract user agent from request
 */
function getUserAgent(req?: Request): string | undefined {
  if (!req) return undefined;
  return req.headers["user-agent"] || undefined;
}

/**
 * Log an authentication/security event to the audit_log table
 */
export async function logAuthEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      log.warn(`[AuthAudit] DB unavailable, event lost: ${entry.action} userId=${entry.userId}`);
      return;
    }

    await db.insert(auditLog).values({
      userId: entry.userId,
      action: entry.action,
      targetType: entry.targetType || null,
      targetId: entry.targetId || null,
      details: entry.details ? JSON.stringify(entry.details) : null,
      ipAddress: getClientIP(entry.req) || null,
      userAgent: getUserAgent(entry.req) || null,
    });

    log.info(`[AuthAudit] ${entry.action} userId=${entry.userId}${entry.targetId ? ` targetId=${entry.targetId}` : ""}`);
  } catch (error) {
    // Never let audit logging break the main flow
    log.error(`[AuthAudit] Failed to log event ${entry.action}:`, error);
  }
}

/**
 * Convenience: log a login success
 */
export async function logLoginSuccess(userId: number, method: string, req?: Request): Promise<void> {
  await logAuthEvent({
    userId,
    action: "auth.login.success",
    details: { method, timestamp: new Date().toISOString() },
    req,
  });
}

/**
 * Convenience: log a login failure (use userId=0 for unknown users)
 */
export async function logLoginFailed(email: string, reason: string, req?: Request): Promise<void> {
  await logAuthEvent({
    userId: 0,
    action: "auth.login.failed",
    details: { email, reason, timestamp: new Date().toISOString() },
    req,
  });
}

/**
 * Convenience: log a role change
 */
export async function logRoleChange(
  adminUserId: number,
  targetUserId: number,
  oldRole: string,
  newRole: string,
  req?: Request
): Promise<void> {
  await logAuthEvent({
    userId: adminUserId,
    action: "auth.role.changed",
    targetType: "user",
    targetId: targetUserId,
    details: { oldRole, newRole, timestamp: new Date().toISOString() },
    req,
  });
}

/**
 * Convenience: log a rate limit exceeded event
 */
export async function logRateLimitExceeded(ip: string, endpoint: string, req?: Request): Promise<void> {
  await logAuthEvent({
    userId: 0,
    action: "auth.rate_limit.exceeded",
    details: { ip, endpoint, timestamp: new Date().toISOString() },
    req,
  });
}
