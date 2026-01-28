/**
 * Session management utilities for HTTP-only cookie-based authentication
 * 
 * This module provides a unified session mechanism for both:
 * - Email/password authentication
 * - Social SSO (Google, Microsoft)
 * 
 * Sessions are stored as signed JWTs in HTTP-only cookies.
 */

import { SignJWT, jwtVerify } from "jose";
import type { Response, Request } from "express";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ENV } from "./env";

// Session payload type
export type SessionPayload = {
  userId: number;
  openId: string;
  email: string;
  name: string;
  role: string;
  authMethod: "email" | "google" | "microsoft" | "manus";
};

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.isProduction, // Only secure in production
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
};

/**
 * Get the secret key for signing JWTs
 */
function getSecretKey(): Uint8Array {
  const secret = ENV.cookieSecret;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a signed session JWT
 */
export async function createSessionJWT(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  const expiresInMs = 30 * 24 * 60 * 60 * 1000; // 30 days
  const expirationTime = Math.floor((Date.now() + expiresInMs) / 1000);

  return new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationTime)
    .sign(secretKey);
}

/**
 * Verify and decode a session JWT
 */
export async function verifySessionJWT(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    // Validate required fields
    if (
      typeof payload.userId !== "number" ||
      typeof payload.openId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.authMethod !== "string"
    ) {
      console.warn("[Session] Invalid session payload - missing required fields");
      return null;
    }

    return {
      userId: payload.userId,
      openId: payload.openId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      authMethod: payload.authMethod as SessionPayload["authMethod"],
    };
  } catch (error) {
    console.warn("[Session] JWT verification failed:", String(error));
    return null;
  }
}

/**
 * Set session cookie on response
 */
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  console.log("[Session] Cookie set successfully");
}

/**
 * Clear session cookie on response
 */
export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: ENV.isProduction,
    sameSite: "lax",
    path: "/",
  });
  console.log("[Session] Cookie cleared");
}

/**
 * Get session cookie from request
 */
export function getSessionCookie(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookieHeader(cookieHeader);
  return cookies[COOKIE_NAME] || null;
}

/**
 * Get and verify session from request
 */
export async function getSessionFromRequest(req: Request): Promise<SessionPayload | null> {
  const token = getSessionCookie(req);
  if (!token) {
    return null;
  }

  return verifySessionJWT(token);
}
