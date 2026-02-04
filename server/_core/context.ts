import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getUnifiedSessionFromRequest, type SessionPayload, type UnifiedSessionResult } from "./session";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  sessionPayload: SessionPayload | null;
  sessionType: "custom" | "manus" | null;
};

/**
 * Create tRPC context for each request
 * 
 * This function handles TWO authentication systems:
 * 1. Custom auth (email/password + Google/Microsoft SSO) - has userId in JWT
 * 2. Manus OAuth - has openId + appId in JWT
 * 
 * Flow:
 * 1. First tries to verify the session cookie
 * 2. If custom format (has userId), looks up user by userId
 * 3. If Manus format (has openId + appId), looks up user by openId
 * 4. Returns null user if neither authentication method succeeds
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let sessionPayload: SessionPayload | null = null;
  let sessionType: "custom" | "manus" | null = null;

  const db = await getDb();
  if (!db) {
    return {
      req: opts.req,
      res: opts.res,
      user: null,
      sessionPayload: null,
      sessionType: null,
    };
  }

  // Try unified session verification (handles both formats)
  try {
    const unifiedSession = await getUnifiedSessionFromRequest(opts.req);
    
    if (unifiedSession) {
      if (unifiedSession.type === "custom" && unifiedSession.customPayload) {
        // Custom auth format - look up by userId
        sessionPayload = unifiedSession.customPayload;
        sessionType = "custom";
        
        const [dbUser] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, sessionPayload.userId))
          .limit(1);
        
        if (dbUser) {
          user = dbUser;
          console.log("[Context] Custom auth success:", dbUser.email);
        } else {
          console.warn("[Context] Custom session user not found in database:", sessionPayload.userId);
          sessionPayload = null;
          sessionType = null;
        }
      } else if (unifiedSession.type === "manus" && unifiedSession.manusPayload) {
        // Manus OAuth format - look up by openId
        sessionType = "manus";
        
        const [dbUser] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.openId, unifiedSession.manusPayload.openId))
          .limit(1);
        
        if (dbUser) {
          user = dbUser;
          console.log("[Context] Manus OAuth (unified) success:", dbUser.email);
        } else {
          // User not in DB yet - try to sync from Manus OAuth server
          console.log("[Context] Manus user not found, attempting sync for openId:", unifiedSession.manusPayload.openId);
          try {
            user = await sdk.authenticateRequest(opts.req);
            if (user) {
              console.log("[Context] Manus OAuth sync success:", user.email);
            }
          } catch (syncError) {
            console.warn("[Context] Manus OAuth sync failed:", syncError);
            sessionType = null;
          }
        }
      }
    }
  } catch (error) {
    console.warn("[Context] Unified session check failed:", error);
  }

  // If still no user, try Manus OAuth as fallback (for edge cases)
  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
      if (user) {
        sessionType = "manus";
        console.log("[Context] Manus OAuth fallback success:", user.email);
      }
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    sessionPayload,
    sessionType,
  };
}
