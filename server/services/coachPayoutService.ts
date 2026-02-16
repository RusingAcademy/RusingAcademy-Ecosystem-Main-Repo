/**
 * Coach Payout Automation Service
 * 
 * Sprint J3: Automates Stripe Connect transfers to coaches.
 * 
 * Flow:
 * 1. Admin triggers payout (or scheduled cron)
 * 2. Service aggregates pending ledger entries per coach
 * 3. Creates Stripe Transfer to coach's Connect account
 * 4. Records transfer in payout_ledger with stripeTransferId
 * 5. Sends notification to coach
 * 
 * Safety:
 * - Only processes entries with status='completed' (payment confirmed)
 * - Skips coaches without a valid Stripe Connect account
 * - Minimum payout threshold: $10 CAD
 * - Idempotent: checks for existing transfer before creating
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { sql, eq, and, isNull } from "drizzle-orm";
import { payoutLedger, coachProfiles, users } from "../../drizzle/schema";
import { createLogger } from "../logger";

const log = createLogger("coachPayoutService");

// Lazy Stripe initialization
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeInstance = new Stripe(key, { apiVersion: "2025-12-15.clover" as any });
  }
  return stripeInstance;
}

// Minimum payout threshold in cents ($10 CAD)
const MIN_PAYOUT_CENTS = 1000;

export interface PayoutSummary {
  coachId: number;
  coachName: string;
  coachEmail: string;
  stripeAccountId: string;
  pendingAmount: number; // cents
  pendingEntries: number;
  lastPayoutDate: string | null;
}

export interface PayoutResult {
  coachId: number;
  coachName: string;
  amount: number; // cents
  stripeTransferId: string | null;
  status: "success" | "skipped" | "failed";
  reason?: string;
}

/**
 * Get all coaches with pending payouts above the minimum threshold.
 */
export async function getPendingPayouts(): Promise<PayoutSummary[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    // Aggregate pending net amounts per coach
    const [rows] = await db.execute(sql`
      SELECT 
        pl.coachId,
        cp.stripeAccountId,
        u.name AS coachName,
        u.email AS coachEmail,
        SUM(pl.netAmount) AS pendingAmount,
        COUNT(*) AS pendingEntries,
        (SELECT MAX(pl2.processedAt) FROM payout_ledger pl2 
         WHERE pl2.coachId = pl.coachId AND pl2.transactionType = 'coach_payout') AS lastPayoutDate
      FROM payout_ledger pl
      JOIN coach_profiles cp ON cp.id = pl.coachId
      JOIN users u ON u.id = cp.userId
      WHERE pl.transactionType = 'session_payment'
        AND pl.status = 'completed'
        AND pl.stripeTransferId IS NULL
      GROUP BY pl.coachId, cp.stripeAccountId, u.name, u.email
      HAVING SUM(pl.netAmount) >= ${MIN_PAYOUT_CENTS}
      ORDER BY pendingAmount DESC
    `);

    if (!Array.isArray(rows)) return [];

    return rows.map((row: any) => ({
      coachId: row.coachId,
      coachName: row.coachName || "Unknown",
      coachEmail: row.coachEmail || "",
      stripeAccountId: row.stripeAccountId || "",
      pendingAmount: Number(row.pendingAmount) || 0,
      pendingEntries: Number(row.pendingEntries) || 0,
      lastPayoutDate: row.lastPayoutDate ? String(row.lastPayoutDate) : null,
    }));
  } catch (err) {
    log.error("[CoachPayout] Failed to get pending payouts:", err);
    return [];
  }
}

/**
 * Process payout for a single coach.
 * Creates a Stripe Transfer and records it in the ledger.
 */
export async function processCoachPayout(coachId: number): Promise<PayoutResult> {
  const db = await getDb();
  if (!db) return { coachId, coachName: "", amount: 0, stripeTransferId: null, status: "failed", reason: "Database not available" };

  try {
    // 1. Get coach info
    const [coach] = await db
      .select({
        id: coachProfiles.id,
        userId: coachProfiles.userId,
        stripeAccountId: coachProfiles.stripeAccountId,
      })
      .from(coachProfiles)
      .where(eq(coachProfiles.id, coachId))
      .limit(1);

    if (!coach) {
      return { coachId, coachName: "", amount: 0, stripeTransferId: null, status: "failed", reason: "Coach not found" };
    }

    if (!coach.stripeAccountId) {
      return { coachId, coachName: "", amount: 0, stripeTransferId: null, status: "skipped", reason: "No Stripe Connect account" };
    }

    // Get coach name
    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, coach.userId))
      .limit(1);

    const coachName = user?.name || "Unknown";

    // 2. Get pending entries for this coach
    const [pendingRows] = await db.execute(sql`
      SELECT id, netAmount FROM payout_ledger
      WHERE coachId = ${coachId}
        AND transactionType = 'session_payment'
        AND status = 'completed'
        AND stripeTransferId IS NULL
    `);

    const entries = Array.isArray(pendingRows) ? pendingRows : [];
    if (entries.length === 0) {
      return { coachId, coachName, amount: 0, stripeTransferId: null, status: "skipped", reason: "No pending entries" };
    }

    const totalAmount = entries.reduce((sum: number, e: any) => sum + (Number(e.netAmount) || 0), 0);
    if (totalAmount < MIN_PAYOUT_CENTS) {
      return { coachId, coachName, amount: totalAmount, stripeTransferId: null, status: "skipped", reason: `Below minimum threshold ($${(MIN_PAYOUT_CENTS / 100).toFixed(2)})` };
    }

    // 3. Verify Stripe Connect account is active
    const stripe = getStripe();
    let account: Stripe.Account;
    try {
      account = await stripe.accounts.retrieve(coach.stripeAccountId);
    } catch (err) {
      return { coachId, coachName, amount: totalAmount, stripeTransferId: null, status: "failed", reason: "Invalid Stripe Connect account" };
    }

    if (!account.payouts_enabled) {
      return { coachId, coachName, amount: totalAmount, stripeTransferId: null, status: "skipped", reason: "Stripe payouts not enabled for this account" };
    }

    // 4. Create Stripe Transfer
    const transfer = await stripe.transfers.create({
      amount: totalAmount,
      currency: "cad",
      destination: coach.stripeAccountId,
      description: `Coach payout - ${entries.length} session(s)`,
      metadata: {
        coach_id: coachId.toString(),
        coach_name: coachName,
        entry_count: entries.length.toString(),
        platform: "lingueefy",
      },
    });

    log.info(`[CoachPayout] Created transfer ${transfer.id} for coach ${coachId}: $${(totalAmount / 100).toFixed(2)} CAD`);

    // 5. Update all pending entries with the transfer ID
    const entryIds = entries.map((e: any) => e.id);
    await db.execute(sql`
      UPDATE payout_ledger 
      SET stripeTransferId = ${transfer.id}, 
          status = 'completed',
          processedAt = NOW()
      WHERE id IN (${sql.join(entryIds.map((id: number) => sql`${id}`), sql`, `)})
    `);

    // 6. Create a payout ledger entry for the transfer itself
    await db.execute(sql`
      INSERT INTO payout_ledger (coachId, learnerId, transactionType, grossAmount, platformFee, netAmount, commissionBps, stripeTransferId, status, processedAt, notes, createdAt, updatedAt)
      VALUES (
        ${coachId}, 0, 'coach_payout', ${totalAmount}, 0, ${totalAmount}, 0,
        ${transfer.id}, 'completed', NOW(),
        ${`Automated payout of ${entries.length} session(s) - $${(totalAmount / 100).toFixed(2)} CAD`},
        NOW(), NOW()
      )
    `);

    // 7. Send notification to coach
    try {
      const { sendPushToUser } = await import("./pushNotificationService");
      await sendPushToUser(coach.userId, {
        title: "💰 Payout Processed!",
        body: `Your payout of $${(totalAmount / 100).toFixed(2)} CAD has been sent to your bank account.`,
        tag: `payout-${transfer.id}`,
        category: "reminders",
        url: "/coach/dashboard",
        data: { type: "payout_processed", transferId: transfer.id },
      });
    } catch (_pushErr) { /* best-effort */ }

    // 8. In-app notification
    try {
      const { createNotification } = await import("../db");
      await createNotification({
        userId: coach.userId,
        title: "Payout Processed",
        message: `Your payout of $${(totalAmount / 100).toFixed(2)} CAD for ${entries.length} session(s) has been transferred.`,
        type: "success",
        link: "/coach/dashboard",
      });
    } catch (_notifErr) { /* best-effort */ }

    return {
      coachId,
      coachName,
      amount: totalAmount,
      stripeTransferId: transfer.id,
      status: "success",
    };
  } catch (err: any) {
    log.error(`[CoachPayout] Failed to process payout for coach ${coachId}:`, err);
    return {
      coachId,
      coachName: "",
      amount: 0,
      stripeTransferId: null,
      status: "failed",
      reason: err.message || "Unknown error",
    };
  }
}

/**
 * Process all pending payouts for all eligible coaches.
 * Returns a summary of all payout results.
 */
export async function processAllPendingPayouts(): Promise<{
  totalProcessed: number;
  totalAmount: number;
  results: PayoutResult[];
}> {
  const pending = await getPendingPayouts();
  const results: PayoutResult[] = [];
  let totalAmount = 0;

  for (const coach of pending) {
    const result = await processCoachPayout(coach.coachId);
    results.push(result);
    if (result.status === "success") {
      totalAmount += result.amount;
    }
  }

  log.info(`[CoachPayout] Batch payout complete: ${results.filter(r => r.status === "success").length}/${pending.length} processed, total $${(totalAmount / 100).toFixed(2)} CAD`);

  return {
    totalProcessed: results.filter(r => r.status === "success").length,
    totalAmount,
    results,
  };
}

/**
 * Get payout history for admin dashboard.
 */
export async function getPayoutHistory(options?: {
  coachId?: number;
  limit?: number;
  offset?: number;
}): Promise<{
  payouts: any[];
  total: number;
}> {
  const db = await getDb();
  if (!db) return { payouts: [], total: 0 };

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  try {
    let whereClause = sql`pl.transactionType = 'coach_payout'`;
    if (options?.coachId) {
      whereClause = sql`${whereClause} AND pl.coachId = ${options.coachId}`;
    }

    const [rows] = await db.execute(sql`
      SELECT 
        pl.id,
        pl.coachId,
        u.name AS coachName,
        u.email AS coachEmail,
        pl.netAmount AS amount,
        pl.stripeTransferId,
        pl.status,
        pl.processedAt,
        pl.notes,
        pl.createdAt
      FROM payout_ledger pl
      JOIN coach_profiles cp ON cp.id = pl.coachId
      JOIN users u ON u.id = cp.userId
      WHERE ${whereClause}
      ORDER BY pl.createdAt DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const [countRows] = await db.execute(sql`
      SELECT COUNT(*) AS total FROM payout_ledger WHERE ${whereClause}
    `);

    const total = Array.isArray(countRows) && countRows[0] ? Number((countRows[0] as any).total) : 0;

    return {
      payouts: Array.isArray(rows) ? rows : [],
      total,
    };
  } catch (err) {
    log.error("[CoachPayout] Failed to get payout history:", err);
    return { payouts: [], total: 0 };
  }
}
