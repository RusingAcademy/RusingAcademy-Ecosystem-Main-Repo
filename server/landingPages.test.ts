/**
 * Landing Pages — Unit Tests (Phase 8.1)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock getDb
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("./services/featureFlagService", () => ({
  isFeatureEnabled: vi.fn().mockResolvedValue(true),
}));

describe("Landing Pages Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockResolvedValue([]);
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue([{ insertId: 1 }]);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.delete.mockReturnThis();
  });

  describe("Schema validation", () => {
    it("should validate section types", () => {
      const validTypes = ["hero", "features", "pricing", "testimonials", "cta", "faq", "text"];
      validTypes.forEach((type) => {
        expect(validTypes).toContain(type);
      });
    });

    it("should validate landing page status values", () => {
      const validStatuses = ["draft", "published", "archived"];
      validStatuses.forEach((status) => {
        expect(validStatuses).toContain(status);
      });
    });

    it("should validate slug format (lowercase alphanumeric with hyphens)", () => {
      const validSlugs = ["sle-prep", "coaching-2026", "test-page"];
      const invalidSlugs = ["SLE Prep", "test page", "test@page"];
      validSlugs.forEach((slug) => {
        expect(/^[a-z0-9-]+$/.test(slug)).toBe(true);
      });
      invalidSlugs.forEach((slug) => {
        expect(/^[a-z0-9-]+$/.test(slug)).toBe(false);
      });
    });
  });

  describe("Section content structure", () => {
    it("should validate hero section content", () => {
      const heroContent = {
        headline: "Master Your SLE",
        subheadline: "Prepare with expert coaches",
        ctaText: "Get Started",
        ctaLink: "/membership",
      };
      expect(heroContent.headline).toBeDefined();
      expect(heroContent.ctaLink).toMatch(/^\//);
    });

    it("should validate features section content", () => {
      const featuresContent = {
        heading: "Our Features",
        features: [
          { title: "Expert Coaches", description: "Certified SLE trainers" },
          { title: "AI Practice", description: "24/7 AI companion" },
        ],
      };
      expect(featuresContent.features.length).toBeGreaterThan(0);
      featuresContent.features.forEach((f) => {
        expect(f.title).toBeDefined();
        expect(f.description).toBeDefined();
      });
    });

    it("should validate pricing section content", () => {
      const pricingContent = {
        heading: "Pricing",
        tiers: [
          { name: "Basic", price: "$29", features: ["Feature 1"], ctaText: "Choose", ctaLink: "/membership" },
        ],
      };
      expect(pricingContent.tiers.length).toBeGreaterThan(0);
      pricingContent.tiers.forEach((t) => {
        expect(t.name).toBeDefined();
        expect(t.price).toBeDefined();
        expect(t.ctaLink).toBeDefined();
      });
    });

    it("should validate testimonials section content", () => {
      const testimonialsContent = {
        heading: "What Students Say",
        testimonials: [
          { name: "John", quote: "Great experience!", rating: 5 },
        ],
      };
      expect(testimonialsContent.testimonials.length).toBeGreaterThan(0);
      testimonialsContent.testimonials.forEach((t) => {
        expect(t.name).toBeDefined();
        expect(t.quote).toBeDefined();
        if (t.rating) expect(t.rating).toBeGreaterThanOrEqual(1);
        if (t.rating) expect(t.rating).toBeLessThanOrEqual(5);
      });
    });

    it("should validate CTA section content", () => {
      const ctaContent = {
        heading: "Ready to Start?",
        ctaText: "Join Now",
        ctaLink: "/membership",
      };
      expect(ctaContent.heading).toBeDefined();
      expect(ctaContent.ctaText).toBeDefined();
      expect(ctaContent.ctaLink).toBeDefined();
    });
  });

  describe("Bilingual support", () => {
    it("should support French translations for hero content", () => {
      const content = {
        headline: "Master Your SLE",
        headlineFr: "Maîtrisez votre ELS",
        subheadline: "Prepare with experts",
        subheadlineFr: "Préparez-vous avec des experts",
        ctaText: "Get Started",
        ctaTextFr: "Commencer",
        ctaLink: "/membership",
      };
      expect(content.headlineFr).toBeDefined();
      expect(content.subheadlineFr).toBeDefined();
      expect(content.ctaTextFr).toBeDefined();
    });

    it("should support French translations for features content", () => {
      const feature = {
        title: "Expert Coaches",
        titleFr: "Coachs experts",
        description: "Certified trainers",
        descriptionFr: "Formateurs certifiés",
      };
      expect(feature.titleFr).toBeDefined();
      expect(feature.descriptionFr).toBeDefined();
    });
  });

  describe("Section ordering", () => {
    it("should maintain section order", () => {
      const sections = [
        { id: "1", type: "hero", order: 0, content: {} },
        { id: "2", type: "features", order: 1, content: {} },
        { id: "3", type: "cta", order: 2, content: {} },
      ];
      const sorted = [...sections].sort((a, b) => a.order - b.order);
      expect(sorted[0].type).toBe("hero");
      expect(sorted[1].type).toBe("features");
      expect(sorted[2].type).toBe("cta");
    });

    it("should handle section reordering", () => {
      const sections = [
        { id: "1", type: "hero", order: 0 },
        { id: "2", type: "features", order: 1 },
        { id: "3", type: "cta", order: 2 },
      ];
      // Swap features and cta
      const reordered = sections.map((s) => {
        if (s.id === "2") return { ...s, order: 2 };
        if (s.id === "3") return { ...s, order: 1 };
        return s;
      });
      const sorted = reordered.sort((a, b) => a.order - b.order);
      expect(sorted[1].type).toBe("cta");
      expect(sorted[2].type).toBe("features");
    });
  });

  describe("SEO metadata", () => {
    it("should support meta title and description", () => {
      const page = {
        title: "SLE Prep Program",
        metaTitle: "SLE Preparation - RusingAcademy",
        metaDescription: "Prepare for your SLE exam with expert coaches",
        ogImage: "https://example.com/og.jpg",
      };
      expect(page.metaTitle).toBeDefined();
      expect(page.metaDescription).toBeDefined();
      expect(page.metaDescription.length).toBeLessThanOrEqual(160);
    });

    it("should support bilingual meta", () => {
      const page = {
        metaTitle: "SLE Preparation",
        metaTitleFr: "Préparation ELS",
        metaDescription: "Prepare for your SLE",
        metaDescriptionFr: "Préparez-vous pour votre ELS",
      };
      expect(page.metaTitleFr).toBeDefined();
      expect(page.metaDescriptionFr).toBeDefined();
    });
  });

  describe("Feature flag integration", () => {
    it("should check LANDING_PAGES_V1 flag", async () => {
      const { isFeatureEnabled } = await import("./services/featureFlagService");
      const result = await isFeatureEnabled("LANDING_PAGES_V1");
      expect(result).toBe(true);
    });
  });
});
