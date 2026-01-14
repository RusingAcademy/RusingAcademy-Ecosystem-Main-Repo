/**
 * AI Quota Router
 * 
 * Handles AI Coach quota management with Clerk authentication:
 * - GET /api/ai/quota - Get current quota status
 * - POST /api/ai/consume - Consume AI minutes (called after AI response)
 * - POST /api/ai/check - Check if user has available quota
 * 
 * Quota Logic:
 * - Daily quota resets at midnight UTC
 * - When daily quota exhausted, top-up balance is used
 * - When both exhausted, return 402 with bilingual error
 * 
 * Authentication:
 * - Uses Clerk auth middleware to resolve clerkUserId → users.id
 * - req.userId is set by clerkAuthMiddleware
 */
import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { aiQuota, aiUsageEvents } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireClerkAuth, ClerkAuthRequest } from "../middleware/clerkAuth";

const router = Router();

// Characters per minute estimation (conservative)
const CHARS_PER_MINUTE = 900;

interface QuotaStatus {
  dailyQuota: number;
  dailyUsed: number;
  dailyRemaining: number;
  topupBalance: number;
  totalAvailable: number;
  accessExpiresAt: string | null;
  activeOfferCode: string | null;
  isExpired: boolean;
}

/**
 * GET /api/ai/quota
 * Returns current quota status for the authenticated user
 * Protected by Clerk auth middleware
 */
router.get("/quota", requireClerkAuth, async (req: ClerkAuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: {
          en: "Authentication required",
          fr: "Authentification requise"
        }
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const quota = await getOrCreateQuota(db, userId);
    
    // Apply daily reset if needed
    const updatedQuota = await applyDailyReset(db, quota);
    
    // Check if access is expired
    const isExpired = updatedQuota.accessExpiresAt 
      ? new Date(updatedQuota.accessExpiresAt) < new Date()
      : false;

    const dailyRemaining = Math.max(0, updatedQuota.dailyQuotaMinutes - updatedQuota.dailyUsedMinutes);
    const totalAvailable = isExpired ? updatedQuota.topupMinutesBalance : dailyRemaining + updatedQuota.topupMinutesBalance;

    const status: QuotaStatus = {
      dailyQuota: updatedQuota.dailyQuotaMinutes,
      dailyUsed: updatedQuota.dailyUsedMinutes,
      dailyRemaining: isExpired ? 0 : dailyRemaining,
      topupBalance: updatedQuota.topupMinutesBalance,
      totalAvailable,
      accessExpiresAt: updatedQuota.accessExpiresAt?.toISOString() || null,
      activeOfferCode: updatedQuota.activeOfferCode,
      isExpired,
    };

    return res.json(status);
  } catch (error) {
    console.error("[AI Quota] Error getting quota:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/ai/check
 * Check if user has available quota before making AI request
 * Protected by Clerk auth middleware
 */
router.post("/check", requireClerkAuth, async (req: ClerkAuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: {
          en: "Authentication required",
          fr: "Authentification requise"
        }
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const quota = await getOrCreateQuota(db, userId);
    const updatedQuota = await applyDailyReset(db, quota);
    
    // Check if access is expired
    const isExpired = updatedQuota.accessExpiresAt 
      ? new Date(updatedQuota.accessExpiresAt) < new Date()
      : false;

    const dailyRemaining = isExpired ? 0 : Math.max(0, updatedQuota.dailyQuotaMinutes - updatedQuota.dailyUsedMinutes);
    const topupBalance = updatedQuota.topupMinutesBalance;
    const totalAvailable = dailyRemaining + topupBalance;

    if (totalAvailable <= 0) {
      return res.status(402).json({
        hasQuota: false,
        error: {
          en: "You've used all your AI minutes for today. Purchase a Top-up Pack to continue.",
          fr: "Vous avez utilisé toutes vos minutes IA aujourd'hui. Achetez un forfait Top-up pour continuer."
        },
        dailyRemaining,
        topupBalance,
        totalAvailable,
      });
    }

    return res.json({
      hasQuota: true,
      dailyRemaining,
      topupBalance,
      totalAvailable,
    });
  } catch (error) {
    console.error("[AI Quota] Error checking quota:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/ai/consume
 * Consume AI minutes after a successful AI response
 * Protected by Clerk auth middleware
 * 
 * Body: { inputChars: number, outputChars: number, conversationType?: string }
 */
router.post("/consume", requireClerkAuth, async (req: ClerkAuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: {
          en: "Authentication required",
          fr: "Authentification requise"
        }
      });
    }

    const { inputChars = 0, outputChars = 0, conversationType = "general" } = req.body;
    const totalChars = inputChars + outputChars;
    const minutesToConsume = Math.max(1, Math.ceil(totalChars / CHARS_PER_MINUTE));

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const quota = await getOrCreateQuota(db, userId);
    const updatedQuota = await applyDailyReset(db, quota);
    
    // Check if access is expired
    const isExpired = updatedQuota.accessExpiresAt 
      ? new Date(updatedQuota.accessExpiresAt) < new Date()
      : false;

    const dailyRemaining = isExpired ? 0 : Math.max(0, updatedQuota.dailyQuotaMinutes - updatedQuota.dailyUsedMinutes);

    let source: "daily" | "topup" = "daily";
    let minutesFromDaily = 0;
    let minutesFromTopup = 0;

    // Consume from daily quota first, then top-up
    if (dailyRemaining >= minutesToConsume && !isExpired) {
      // All from daily
      minutesFromDaily = minutesToConsume;
      source = "daily";
    } else if (dailyRemaining > 0 && !isExpired) {
      // Partial from daily, rest from top-up
      minutesFromDaily = dailyRemaining;
      minutesFromTopup = minutesToConsume - dailyRemaining;
      source = "topup";
    } else {
      // All from top-up
      minutesFromTopup = minutesToConsume;
      source = "topup";
    }

    // Check if we have enough
    if (minutesFromTopup > updatedQuota.topupMinutesBalance) {
      return res.status(402).json({
        success: false,
        error: {
          en: "Insufficient AI minutes. Please purchase a Top-up Pack.",
          fr: "Minutes IA insuffisantes. Veuillez acheter un forfait Top-up."
        }
      });
    }

    // Atomic update
    const newDailyUsed = updatedQuota.dailyUsedMinutes + minutesFromDaily;
    const newTopupBalance = updatedQuota.topupMinutesBalance - minutesFromTopup;

    await db.update(aiQuota)
      .set({
        dailyUsedMinutes: newDailyUsed,
        topupMinutesBalance: newTopupBalance,
      })
      .where(eq(aiQuota.userId, userId));

    // Log usage event
    await db.insert(aiUsageEvents).values({
      userId,
      minutesUsed: minutesToConsume,
      charactersInput: inputChars,
      charactersOutput: outputChars,
      source,
      dailyRemainingAfter: updatedQuota.dailyQuotaMinutes - newDailyUsed,
      topupRemainingAfter: newTopupBalance,
      conversationType,
    });

    const newDailyRemaining = isExpired ? 0 : Math.max(0, updatedQuota.dailyQuotaMinutes - newDailyUsed);

    return res.json({
      success: true,
      consumed: minutesToConsume,
      source,
      dailyRemaining: newDailyRemaining,
      topupBalance: newTopupBalance,
      totalAvailable: newDailyRemaining + newTopupBalance,
    });
  } catch (error) {
    console.error("[AI Quota] Error consuming quota:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get or create quota record for user
 */
async function getOrCreateQuota(db: any, userId: number) {
  let quota = await db.query.aiQuota.findFirst({
    where: eq(aiQuota.userId, userId),
  });

  if (!quota) {
    // Create default quota (0 daily, 0 topup)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db.insert(aiQuota).values({
      userId,
      dailyQuotaMinutes: 0,
      dailyUsedMinutes: 0,
      dailyResetAt: today,
      topupMinutesBalance: 0,
      activeOfferCode: null,
      accessExpiresAt: null,
    });

    quota = await db.query.aiQuota.findFirst({
      where: eq(aiQuota.userId, userId),
    });
  }

  return quota;
}

/**
 * Apply daily reset if current date > stored reset date
 */
async function applyDailyReset(db: any, quota: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const resetDate = new Date(quota.dailyResetAt);
  resetDate.setHours(0, 0, 0, 0);

  if (today > resetDate) {
    // Reset daily usage
    await db.update(aiQuota)
      .set({
        dailyUsedMinutes: 0,
        dailyResetAt: today,
      })
      .where(eq(aiQuota.userId, quota.userId));

    return {
      ...quota,
      dailyUsedMinutes: 0,
      dailyResetAt: today,
    };
  }

  return quota;
}

export default router;
