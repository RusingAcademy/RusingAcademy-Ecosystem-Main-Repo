import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getSessionFromRequest, type SessionPayload } from "./session";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  sessionPayload: SessionPayload | null;
};

/**
 * Create tRPC context for each request
 * 
 * This function:
 * 1. First tries to authenticate via custom session cookie (email/password + SSO)
 * 2. Falls back to Manus OAuth if no custom session
 * 3. Returns null user if neither authentication method succeeds
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let sessionPayload: SessionPayload | null = null;

  // First, try custom session authentication (email/password + SSO)
  try {
    sessionPayload = await getSessionFromRequest(opts.req);
    
    if (sessionPayload) {
      // Get user from database using session info
      const db = await getDb();
      if (db) {
        const [dbUser] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, sessionPayload.userId))
          .limit(1);
        
        if (dbUser) {
          user = dbUser;
          console.log("[Context] Custom auth success:", dbUser.email);
        } else {
          console.warn("[Context] Session user not found in database:", sessionPayload.userId);
          sessionPayload = null;
        }
      }
    }
  } catch (error) {
    console.warn("[Context] Custom session check failed:", error);
    sessionPayload = null;
  }

  // If no custom session, try Manus OAuth
  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
      if (user) {
        console.log("[Context] Manus OAuth success:", user.email);
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
  };
}
