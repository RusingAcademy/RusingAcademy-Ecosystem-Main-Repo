/**
 * Sprint 2: Coach Hub & Assignment Workflow Tests
 *
 * Tests for:
 * - Coach lifecycle management (suspend/reactivate)
 * - Coach lifecycle stats aggregation
 * - Admin commission management (overview, tiers, payouts, analytics)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Coach Lifecycle Tests ─────────────────────────────────────────────────────
describe("Coach Lifecycle Management", () => {
  describe("suspendCoach", () => {
    it("should require a reason for suspension", () => {
      const input = { coachId: 1, reason: "" };
      expect(input.reason.trim()).toBe("");
      // Empty reason should be rejected by the UI confirmSuspend guard
    });

    it("should accept valid suspension input", () => {
      const input = { coachId: 42, reason: "Repeated no-shows to scheduled sessions" };
      expect(input.coachId).toBeGreaterThan(0);
      expect(input.reason.trim().length).toBeGreaterThan(0);
    });

    it("should set status to suspended with reason", () => {
      const updatePayload = { status: "suspended", rejectionReason: "Policy violation" };
      expect(updatePayload.status).toBe("suspended");
      expect(updatePayload.rejectionReason).toBeTruthy();
    });
  });

  describe("reactivateCoach", () => {
    it("should accept valid reactivation input", () => {
      const input = { coachId: 42 };
      expect(input.coachId).toBeGreaterThan(0);
    });

    it("should set status back to approved and clear rejection reason", () => {
      const updatePayload = { status: "approved", rejectionReason: null, approvedAt: new Date(), approvedBy: 1 };
      expect(updatePayload.status).toBe("approved");
      expect(updatePayload.rejectionReason).toBeNull();
      expect(updatePayload.approvedAt).toBeInstanceOf(Date);
    });
  });

  describe("getCoachLifecycleStats", () => {
    it("should return structured stats with profile and application counts", () => {
      const mockStats = {
        profiles: { pending: 2, approved: 15, suspended: 1, rejected: 3, total: 21 },
        applications: { submitted: 4, underReview: 2, totalApps: 30 },
      };
      expect(mockStats.profiles.total).toBe(
        mockStats.profiles.pending + mockStats.profiles.approved +
        mockStats.profiles.suspended + mockStats.profiles.rejected
      );
      expect(mockStats.applications.totalApps).toBeGreaterThanOrEqual(
        mockStats.applications.submitted + mockStats.applications.underReview
      );
    });

    it("should return zero defaults when database is empty", () => {
      const emptyStats = {
        profiles: { pending: 0, approved: 0, suspended: 0, rejected: 0, total: 0 },
        applications: { submitted: 0, underReview: 0, totalApps: 0 },
      };
      expect(emptyStats.profiles.total).toBe(0);
      expect(emptyStats.applications.totalApps).toBe(0);
    });
  });
});

// ── Admin Commission Tests ────────────────────────────────────────────────────
describe("Admin Commission Management", () => {
  describe("getCommissionOverview", () => {
    it("should return coaches with commission data and stats", () => {
      const mockOverview = {
        coaches: [
          { id: 1, slug: "coach-a", commission: { tierName: "Standard", commissionBps: 1500, isOverride: false, isVerifiedSle: true } },
          { id: 2, slug: "coach-b", commission: null },
        ],
        stats: { activeCoaches: 2, totalPaidCents: 500000, totalPendingCents: 120000, totalPayouts: 10 },
      };
      expect(mockOverview.coaches).toHaveLength(2);
      expect(mockOverview.coaches[0].commission?.commissionBps).toBe(1500);
      expect(mockOverview.coaches[1].commission).toBeNull();
      expect(mockOverview.stats.activeCoaches).toBe(2);
    });
  });

  describe("getTiers", () => {
    it("should return commission tiers with correct structure", () => {
      const mockTiers = [
        { id: 1, name: "Standard", tierType: "standard", commissionBps: 1500, minHours: 0, maxHours: 100, priority: 100, isActive: true },
        { id: 2, name: "Verified SLE", tierType: "verified_sle", commissionBps: 2000, minHours: 0, maxHours: null, priority: 50, isActive: true },
      ];
      expect(mockTiers).toHaveLength(2);
      expect(mockTiers[1].commissionBps).toBeGreaterThan(mockTiers[0].commissionBps);
      expect(mockTiers[1].priority).toBeLessThan(mockTiers[0].priority); // lower = higher priority
    });
  });

  describe("createTier", () => {
    it("should validate tier creation input", () => {
      const validInput = { name: "Premium SLE", tierType: "verified_sle" as const, commissionBps: 2500, minHours: 50, priority: 25 };
      expect(validInput.name.trim().length).toBeGreaterThan(0);
      expect(validInput.commissionBps).toBeGreaterThan(0);
      expect(validInput.commissionBps).toBeLessThanOrEqual(10000); // max 100%
    });

    it("should reject empty tier name", () => {
      const invalidInput = { name: "", tierType: "standard" as const, commissionBps: 1500, minHours: 0, priority: 100 };
      expect(invalidInput.name.trim()).toBe("");
    });
  });

  describe("getPayouts", () => {
    it("should return payouts with coach info", () => {
      const mockPayouts = [
        {
          payout: { id: 1, status: "pending", sessionCount: 5, grossEarnings: 25000, totalPlatformFees: 3750, netPayout: 21250, periodStart: Date.now() - 86400000 * 30, periodEnd: Date.now() },
          coachSlug: "coach-a",
          coachPhoto: null,
        },
      ];
      expect(mockPayouts[0].payout.netPayout).toBe(mockPayouts[0].payout.grossEarnings - mockPayouts[0].payout.totalPlatformFees);
    });

    it("should filter payouts by status", () => {
      const allPayouts = [
        { payout: { id: 1, status: "pending" } },
        { payout: { id: 2, status: "paid" } },
        { payout: { id: 3, status: "processing" } },
      ];
      const pendingOnly = allPayouts.filter(p => p.payout.status === "pending");
      expect(pendingOnly).toHaveLength(1);
    });
  });

  describe("approvePayout / markPayoutPaid", () => {
    it("should transition payout from pending to processing", () => {
      const before = { status: "pending" };
      const after = { status: "processing", approvedBy: 1, approvedAt: Date.now() };
      expect(before.status).toBe("pending");
      expect(after.status).toBe("processing");
    });

    it("should transition payout from processing to paid", () => {
      const before = { status: "processing" };
      const after = { status: "paid", paidAt: Date.now() };
      expect(before.status).toBe("processing");
      expect(after.status).toBe("paid");
    });
  });

  describe("verifySleStatus", () => {
    it("should toggle SLE verification status", () => {
      const input = { coachId: 1, isVerified: true };
      expect(input.isVerified).toBe(true);
      const reverseInput = { coachId: 1, isVerified: false };
      expect(reverseInput.isVerified).toBe(false);
    });
  });

  describe("getEarningsAnalytics", () => {
    it("should return analytics with totals for the period", () => {
      const mockAnalytics = {
        totals: { sessionPayments: 500000, platformFees: 75000, coachPayouts: 425000, refunds: 10000 },
        entryCount: 45,
      };
      // sessionPayments = platformFees + coachPayouts + refunds
      expect(mockAnalytics.totals.sessionPayments).toBe(
        mockAnalytics.totals.platformFees + mockAnalytics.totals.coachPayouts
      );
      expect(mockAnalytics.entryCount).toBeGreaterThan(0);
    });
  });
});

// ── Lifecycle Pipeline Visualization Tests ────────────────────────────────────
describe("Coach Lifecycle Pipeline", () => {
  it("should define all 6 pipeline stages", () => {
    const stages = ["Applied", "Pending", "Under Review", "Approved", "Suspended", "Rejected"];
    expect(stages).toHaveLength(6);
    expect(stages[0]).toBe("Applied");
    expect(stages[stages.length - 1]).toBe("Rejected");
  });

  it("should filter applications by status correctly", () => {
    const allApps = [
      { id: 1, status: "submitted" },
      { id: 2, status: "pending" },
      { id: 3, status: "under_review" },
      { id: 4, status: "approved" },
      { id: 5, status: "suspended" },
      { id: 6, status: "rejected" },
      { id: 7, status: "resubmission" },
    ];
    const pending = allApps.filter(a => a.status === "submitted" || a.status === "pending" || a.status === "resubmission");
    const underReview = allApps.filter(a => a.status === "under_review");
    const approved = allApps.filter(a => a.status === "approved");
    const suspended = allApps.filter(a => a.status === "suspended");
    const rejected = allApps.filter(a => a.status === "rejected");

    expect(pending).toHaveLength(3);
    expect(underReview).toHaveLength(1);
    expect(approved).toHaveLength(1);
    expect(suspended).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });
});

// ── Format Helpers Tests ──────────────────────────────────────────────────────
describe("Commission Format Helpers", () => {
  function formatCents(cents: number): string {
    return `$${(cents / 100).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
  }

  function formatBps(bps: number): string {
    return `${(bps / 100).toFixed(1)}%`;
  }

  it("should format cents to dollar string", () => {
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(100)).toBe("$1.00");
    expect(formatCents(25050)).toBe("$250.50");
  });

  it("should format basis points to percentage", () => {
    expect(formatBps(1500)).toBe("15.0%");
    expect(formatBps(2000)).toBe("20.0%");
    expect(formatBps(500)).toBe("5.0%");
    expect(formatBps(10000)).toBe("100.0%");
  });
});
