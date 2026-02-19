import type { Request, Response, NextFunction } from "express";
import { getDb } from "../db";
import { apiKeys, apiRequestLogs } from "../../drizzle/public-api-schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

/**
 * Express middleware that validates API key from Authorization header.
 * Usage: app.use("/api/v1", apiKeyAuthMiddleware, v1Routes);
 */
export async function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ra_live_")) {
    return res.status(401).json({ error: "Missing or invalid API key" });
  }

  const key = authHeader.replace("Bearer ", "");
  const keyHash = crypto.createHash("sha256").update(key).digest("hex");

  try {
    const db = await getDb();
    const [apiKey] = await db.select().from(apiKeys)
      .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, true)))
      .limit(1);

    if (!apiKey) {
      return res.status(401).json({ error: "Invalid or revoked API key" });
    }

    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      return res.status(401).json({ error: "API key has expired" });
    }

    // Update last used timestamp
    await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, apiKey.id));

    // Attach API key info to request
    (req as any).apiKey = apiKey;

    // Log the request (fire-and-forget)
    const startTime = Date.now();
    res.on("finish", () => {
      db.insert(apiRequestLogs).values({
        apiKeyId: apiKey.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTimeMs: Date.now() - startTime,
        ipAddress: req.ip || req.socket.remoteAddress || "",
        userAgent: req.headers["user-agent"]?.substring(0, 500) || "",
      }).catch(() => {}); // silent fail for logging
    });

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Check if the API key has a specific scope.
 */
export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = (req as any).apiKey;
    if (!apiKey) return res.status(401).json({ error: "Not authenticated" });
    
    const scopes: string[] = JSON.parse(apiKey.scopes || "[]");
    if (!scopes.includes(scope)) {
      return res.status(403).json({ error: `Missing required scope: ${scope}` });
    }
    next();
  };
}
