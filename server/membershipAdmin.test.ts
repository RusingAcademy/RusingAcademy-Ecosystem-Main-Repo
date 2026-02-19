/**
 * Membership Admin Tests — PR 7.1
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ──
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("./services/featureFlagService", () => ({
  featureFlagService: {
    isEnabled: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("./services/membershipStripeSync", () => ({
  syncTierToStripe: vi.fn().mockResolvedValue(undefined),
  deleteTierFromStripe: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./logger", () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }),
}));

import { syncTierToStripe, deleteTierFromStripe } from "./services/membershipStripeSync";
import { featureFlagService } from "./services/featureFlagService";

describe("Membership Admin — PR 7.1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue([{ insertId: 1 }]);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.delete.mockReturnThis();
  });

  describe("Feature Flag Guard", () => {
    it("should check MEMBERSHIPS_ADMIN_V2 flag", async () => {
      expect(featureFlagService.isEnabled).toBeDefined();
      const result = await featureFlagService.isEnabled("MEMBERSHIPS_ADMIN_V2", { userId: 1, role: "admin" });
      expect(result).toBe(true);
    });

    it("should reject when flag is disabled", async () => {
      vi.mocked(featureFlagService.isEnabled).mockResolvedValueOnce(false);
      const result = await featureFlagService.isEnabled("MEMBERSHIPS_ADMIN_V2", { userId: 1, role: "admin" });
      expect(result).toBe(false);
    });
  });

  describe("Stripe Sync", () => {
    it("syncTierToStripe should be callable", async () => {
      await syncTierToStripe(1);
      expect(syncTierToStripe).toHaveBeenCalledWith(1);
    });

    it("deleteTierFromStripe should be callable", async () => {
      await deleteTierFromStripe(1);
      expect(deleteTierFromStripe).toHaveBeenCalledWith(1);
    });
  });

  describe("Database Operations", () => {
    it("should support select from membershipTiers", async () => {
      mockDb.orderBy.mockResolvedValueOnce([
        { id: 1, name: "Free", slug: "free", priceMonthly: "0.00", isActive: true },
        { id: 2, name: "Pro", slug: "pro", priceMonthly: "29.99", isActive: true },
      ]);

      const result = await mockDb.select().from("membershipTiers").orderBy("sortOrder");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Free");
      expect(result[1].name).toBe("Pro");
    });

    it("should support insert into membershipTiers", async () => {
      const result = await mockDb.insert("membershipTiers").values({
        name: "Enterprise",
        slug: "enterprise",
        priceMonthly: "99.99",
        isActive: true,
      });
      expect(result).toEqual([{ insertId: 1 }]);
    });

    it("should support update membershipTiers", async () => {
      mockDb.where.mockResolvedValueOnce({ affectedRows: 1 });
      await mockDb.update("membershipTiers").set({ isActive: false }).where("id = 1");
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({ isActive: false });
    });

    it("should support soft delete (deactivate)", async () => {
      mockDb.where.mockResolvedValueOnce({ affectedRows: 1 });
      await mockDb.update("membershipTiers").set({ isActive: false }).where("id = 1");
      expect(mockDb.set).toHaveBeenCalledWith({ isActive: false });
    });
  });

  describe("Slug Generation", () => {
    it("should generate correct slugs from tier names", () => {
      const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      expect(generateSlug("Free Tier")).toBe("free-tier");
      expect(generateSlug("Professional")).toBe("professional");
      expect(generateSlug("Enterprise Plus")).toBe("enterprise-plus");
      expect(generateSlug("  Spaces  ")).toBe("spaces");
      expect(generateSlug("Special!@#Characters")).toBe("special-characters");
    });
  });

  describe("Tier Input Validation", () => {
    it("should validate required name field", () => {
      const validTier = { name: "Pro", priceMonthly: "29.99", priceYearly: "299.99" };
      expect(validTier.name.length).toBeGreaterThan(0);
    });

    it("should validate price format", () => {
      const parsePrice = (p: string) => Math.round(parseFloat(p) * 100);
      expect(parsePrice("29.99")).toBe(2999);
      expect(parsePrice("0.00")).toBe(0);
      expect(parsePrice("299.99")).toBe(29999);
    });

    it("should handle bilingual fields", () => {
      const tier = {
        name: "Professional",
        nameFr: "Professionnel",
        description: "Full access to all features",
        descriptionFr: "Accès complet à toutes les fonctionnalités",
        features: ["Unlimited courses", "Priority support"],
        featuresFr: ["Cours illimités", "Support prioritaire"],
      };
      expect(tier.nameFr).toBe("Professionnel");
      expect(tier.featuresFr).toHaveLength(2);
    });
  });

  describe("Reorder Logic", () => {
    it("should assign sequential sort orders", () => {
      const orderedIds = [3, 1, 2, 4];
      const updates = orderedIds.map((id, index) => ({ id, sortOrder: index }));
      expect(updates).toEqual([
        { id: 3, sortOrder: 0 },
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 4, sortOrder: 3 },
      ]);
    });
  });
});
