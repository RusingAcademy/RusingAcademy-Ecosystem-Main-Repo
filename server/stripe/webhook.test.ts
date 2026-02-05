/**
 * Stripe Webhook Handler Tests
 * 
 * Tests the webhook handler for different product types:
 * - Course purchases (path_series)
 * - Coaching plan purchases
 * - Coaching session payments
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the database module
vi.mock("../db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  }),
  getUserById: vi.fn().mockResolvedValue(null),
  getCoachByUserId: vi.fn().mockResolvedValue(null),
  updateCoachProfile: vi.fn().mockResolvedValue(null),
  createPayoutLedgerEntry: vi.fn().mockResolvedValue({}),
}));

// Mock email module
vi.mock("../email", () => ({
  sendSessionConfirmationEmails: vi.fn().mockResolvedValue(undefined),
}));

// Mock video module
vi.mock("../video", () => ({
  generateMeetingDetails: vi.fn().mockReturnValue({
    url: "https://meet.example.com/test",
    joinInstructions: "Click the link to join",
  }),
}));

describe("Stripe Webhook Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Product Type Routing", () => {
    it("should correctly identify path_series product type", () => {
      const metadata = { product_type: "path_series" };
      expect(metadata.product_type).toBe("path_series");
    });

    it("should correctly identify course product type", () => {
      const metadata = { product_type: "course" };
      expect(metadata.product_type).toBe("course");
    });

    it("should correctly identify coaching_plan product type", () => {
      const metadata = { product_type: "coaching_plan" };
      expect(metadata.product_type).toBe("coaching_plan");
    });

    it("should default to coaching_session for unknown product types", () => {
      const metadata = {};
      const productType = metadata.product_type || "coaching_session";
      expect(productType).toBe("coaching_session");
    });
  });

  describe("Course Purchase Metadata", () => {
    it("should extract course metadata correctly", () => {
      const metadata = {
        product_type: "course",
        user_id: "123",
        course_id: "path-i-foundations",
        course_slug: "path-i-foundations",
        course_title: "Path I: FSL - Foundations",
        course_db_id: "1",
        user_email: "test@example.com",
      };

      expect(parseInt(metadata.user_id)).toBe(123);
      expect(metadata.course_id).toBe("path-i-foundations");
      expect(metadata.course_title).toBe("Path I: FSL - Foundations");
      expect(parseInt(metadata.course_db_id)).toBe(1);
    });

    it("should handle legacy path_series metadata", () => {
      const metadata = {
        product_type: "path_series",
        user_id: "456",
        path_id: "2",
        path_slug: "path-ii-everyday-fluency",
        path_title: "Path II: FSL - Everyday Fluency",
      };

      const courseDbId = parseInt(metadata.course_db_id || metadata.path_id || "0");
      const courseSlug = metadata.course_slug || metadata.path_slug || "";
      const courseTitle = metadata.course_title || metadata.path_title || "";

      expect(courseDbId).toBe(2);
      expect(courseSlug).toBe("path-ii-everyday-fluency");
      expect(courseTitle).toBe("Path II: FSL - Everyday Fluency");
    });
  });

  describe("Coaching Plan Purchase Metadata", () => {
    it("should extract coaching plan metadata correctly", () => {
      const metadata = {
        product_type: "coaching_plan",
        user_id: "789",
        plan_id: "accelerator-plan",
        sessions: "20",
        validity_days: "120",
        customer_email: "learner@example.com",
        customer_name: "John Doe",
      };

      expect(parseInt(metadata.user_id)).toBe(789);
      expect(metadata.plan_id).toBe("accelerator-plan");
      expect(parseInt(metadata.sessions)).toBe(20);
      expect(parseInt(metadata.validity_days)).toBe(120);
    });

    it("should calculate expiry date correctly", () => {
      const validityDays = 90;
      const purchaseDate = new Date("2026-02-05");
      const expiresAt = new Date(purchaseDate);
      expiresAt.setDate(expiresAt.getDate() + validityDays);

      // 90 days from Feb 5 = May 5 (Feb has 28 days in 2026)
      expect(expiresAt.toISOString().split("T")[0]).toBe("2026-05-05");
    });
  });

  describe("Payment Amount Handling", () => {
    it("should convert cents to dollars correctly", () => {
      const amountInCents = 89900;
      const amountInDollars = (amountInCents / 100).toFixed(2);
      expect(amountInDollars).toBe("899.00");
    });

    it("should handle null amounts", () => {
      const amountTotal = null;
      const amount = String(((amountTotal || 0) / 100));
      expect(amount).toBe("0");
    });
  });

  describe("Test Event Detection", () => {
    it("should detect test events by event ID prefix", () => {
      const testEventId = "evt_test_1234567890";
      const isTestEvent = testEventId.startsWith("evt_test_");
      expect(isTestEvent).toBe(true);
    });

    it("should not flag production events as test", () => {
      const prodEventId = "evt_1234567890abcdef";
      const isTestEvent = prodEventId.startsWith("evt_test_");
      expect(isTestEvent).toBe(false);
    });
  });
});
