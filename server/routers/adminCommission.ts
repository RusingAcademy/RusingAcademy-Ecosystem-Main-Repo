import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import { getDb } from "../db";
import {
  coachProfiles,
  coachCommissions,
  commissionTiers,
  coachPayouts,
  payoutLedger,
  sessions,
  users,
} from "../../drizzle/schema";

// ─── Admin Commission Router ────────────────────────────────────────────────
// Provides admin-level commission management: overview, tier CRUD, coach
// commission overrides, payout management, and earnings analytics.

const adminGuard = (ctx: any) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
};

export const adminCommissionRouter = router({
  // ── Overview Stats ──────────────────────────────────────────────────────
  getCommissionOverview: protectedProcedure.query(async ({ ctx }) => {
    adminGuard(ctx);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Get all coaches with their commission info
    const coaches = await db
      .select({
        id: coachProfiles.id,
        userId: coachProfiles.userId,
        slug: coachProfiles.slug,
        headline: coachProfiles.headline,
        status: coachProfiles.status,
        totalSessions: coachProfiles.totalSessions,
        totalStudents: coachProfiles.totalStudents,
        averageRating: coachProfiles.averageRating,
        hourlyRate: coachProfiles.hourlyRate,
        photoUrl: coachProfiles.photoUrl,
      })
      .from(coachProfiles)
      .where(eq(coachProfiles.status, "approved"));

    // Get commission records
    const commissions = await db.select().from(coachCommissions);

    // Get payout summary
    const [payoutStats] = await db
      .select({
        totalPaid: sql<number>`COALESCE(SUM(CASE WHEN ${coachPayouts.status} = 'paid' THEN ${coachPayouts.netPayout} ELSE 0 END), 0)`,
        totalPending: sql<number>`COALESCE(SUM(CASE WHEN ${coachPayouts.status} = 'pending' THEN ${coachPayouts.netPayout} ELSE 0 END), 0)`,
        totalPayouts: count(),
      })
      .from(coachPayouts);

    // Get tier info
    const tiers = await db
      .select()
      .from(commissionTiers)
      .where(eq(commissionTiers.isActive, true))
      .orderBy(commissionTiers.priority);

    // Build coach commission map
    const commissionMap = new Map(commissions.map((c) => [c.coachId, c]));

    const coachesWithCommission = coaches.map((coach) => {
      const comm = commissionMap.get(coach.id);
      const tier = comm ? tiers.find((t) => t.id === comm.tierId) : null;
      return {
        ...coach,
        commission: comm
          ? {
              tierId: comm.tierId,
              tierName: tier?.name || "Unknown",
              commissionBps: comm.overrideCommissionBps || tier?.commissionBps || 0,
              isOverride: !!comm.overrideCommissionBps,
              overrideReason: comm.overrideReason,
              isVerifiedSle: comm.isVerifiedSle,
              totalHoursTaught: comm.totalHoursTaught,
            }
          : null,
      };
    });

    return {
      coaches: coachesWithCommission,
      stats: {
        activeCoaches: coaches.length,
        totalPaidCents: payoutStats?.totalPaid || 0,
        totalPendingCents: payoutStats?.totalPending || 0,
        totalPayouts: payoutStats?.totalPayouts || 0,
      },
      tiers,
    };
  }),

  // ── Commission Tiers CRUD ───────────────────────────────────────────────
  getTiers: protectedProcedure.query(async ({ ctx }) => {
    adminGuard(ctx);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return await db.select().from(commissionTiers).orderBy(commissionTiers.priority);
  }),

  createTier: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        tierType: z.enum(["verified_sle", "standard", "referral"]),
        commissionBps: z.number().min(0).max(10000),
        minHours: z.number().min(0).default(0),
        maxHours: z.number().nullable().optional(),
        priority: z.number().default(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(commissionTiers).values({
        ...input,
        isActive: true,
      });
      return { success: true };
    }),

  updateTier: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        commissionBps: z.number().min(0).max(10000).optional(),
        minHours: z.number().min(0).optional(),
        maxHours: z.number().nullable().optional(),
        priority: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { id, ...data } = input;
      await db.update(commissionTiers).set(data).where(eq(commissionTiers.id, id));
      return { success: true };
    }),

  // ── Coach Commission Override ───────────────────────────────────────────
  setCoachOverride: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        overrideCommissionBps: z.number().min(0).max(10000).nullable(),
        overrideReason: z.string().max(500).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(coachCommissions)
        .set({
          overrideCommissionBps: input.overrideCommissionBps,
          overrideReason: input.overrideReason,
        })
        .where(eq(coachCommissions.coachId, input.coachId));

      return { success: true };
    }),

  // ── Verify SLE Status ──────────────────────────────────────────────────
  verifySleStatus: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        isVerified: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(coachCommissions)
        .set({
          isVerifiedSle: input.isVerified,
          verifiedAt: input.isVerified ? new Date() : null,
          verifiedBy: input.isVerified ? ctx.user.id : null,
        })
        .where(eq(coachCommissions.coachId, input.coachId));

      return { success: true };
    }),

  // ── Payout Management ──────────────────────────────────────────────────
  getPayouts: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "processing", "paid", "failed"]).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query = db
        .select({
          payout: coachPayouts,
          coachSlug: coachProfiles.slug,
          coachHeadline: coachProfiles.headline,
          coachPhoto: coachProfiles.photoUrl,
        })
        .from(coachPayouts)
        .leftJoin(coachProfiles, eq(coachPayouts.coachId, coachProfiles.id))
        .orderBy(desc(coachPayouts.createdAt))
        .limit(input.limit);

      if (input.status) {
        // @ts-expect-error - dynamic where
        query = query.where(eq(coachPayouts.status, input.status));
      }

      return await query;
    }),

  approvePayout: protectedProcedure
    .input(z.object({ payoutId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(coachPayouts)
        .set({ status: "processing" })
        .where(
          and(eq(coachPayouts.id, input.payoutId), eq(coachPayouts.status, "pending"))
        );

      return { success: true };
    }),

  markPayoutPaid: protectedProcedure
    .input(z.object({ payoutId: z.number(), stripePayoutId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(coachPayouts)
        .set({
          status: "paid",
          paidAt: new Date(),
          stripePayoutId: input.stripePayoutId || null,
        })
        .where(eq(coachPayouts.id, input.payoutId));

      return { success: true };
    }),

  // ── Earnings Analytics ─────────────────────────────────────────────────
  getEarningsAnalytics: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d", "12m"]).default("30d"),
      })
    )
    .query(async ({ ctx, input }) => {
      adminGuard(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const daysMap = { "7d": 7, "30d": 30, "90d": 90, "12m": 365 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const ledgerEntries = await db
        .select({
          type: payoutLedger.transactionType,
          amount: payoutLedger.amountCents,
          createdAt: payoutLedger.createdAt,
        })
        .from(payoutLedger)
        .where(gte(payoutLedger.createdAt, since))
        .orderBy(payoutLedger.createdAt);

      // Aggregate by type
      const totals = {
        sessionPayments: 0,
        platformFees: 0,
        coachPayouts: 0,
        refunds: 0,
      };

      for (const entry of ledgerEntries) {
        const amt = entry.amount || 0;
        switch (entry.type) {
          case "session_payment":
            totals.sessionPayments += amt;
            break;
          case "platform_fee":
            totals.platformFees += amt;
            break;
          case "coach_payout":
            totals.coachPayouts += amt;
            break;
          case "refund":
          case "refund_reversal":
            totals.refunds += amt;
            break;
        }
      }

      return {
        period: input.period,
        totals,
        entryCount: ledgerEntries.length,
      };
    }),
});
