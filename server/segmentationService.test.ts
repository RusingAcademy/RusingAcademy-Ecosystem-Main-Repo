// server/segmentationService.test.ts — Phase 12.1: Segmentation Service Tests
import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockDb, mockIsEnabled } = vi.hoisted(() => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([[]]),
    delete: vi.fn().mockReturnThis(),
  };
  const mockIsEnabled = vi.fn().mockResolvedValue(true);
  return { mockDb, mockIsEnabled };
});

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock("./services/featureFlagService", () => ({
  featureFlagService: {
    isEnabled: mockIsEnabled,
  },
}));

vi.mock("./logger", () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import { SegmentationService, FilterRule, LearnerRecord } from "./services/segmentationService";

describe("SegmentationService", () => {
  let service: SegmentationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SegmentationService();
    mockIsEnabled.mockResolvedValue(true);
  });

  describe("segment", () => {
    it("should return empty when feature flag is disabled", async () => {
      mockIsEnabled.mockResolvedValue(false);

      const result = await service.segment({ filters: [] });

      expect(result.learners).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it("should handle empty filters gracefully", async () => {
      mockDb.execute.mockResolvedValue([[{ total: 0 }]]);

      const result = await service.segment({ filters: [] });

      expect(result).toBeDefined();
      expect(result.appliedFilters).toHaveLength(0);
    });
  });

  describe("exportCSV", () => {
    it("should export learners to CSV format", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: "Alice Dupont", email: "alice@test.com", tags: ["sle-prep", "vip"] },
        { id: 2, name: "Bob Martin", email: "bob@test.com", tags: ["beginner"] },
      ];

      const csv = await service.exportCSV(learners);

      expect(csv).toContain("id,name,email");
      expect(csv).toContain("Alice Dupont");
      expect(csv).toContain("bob@test.com");
      expect(csv).toContain("sle-prep; vip");
    });

    it("should handle custom fields", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: "Alice", email: "alice@test.com" },
      ];

      const csv = await service.exportCSV(learners, ["id", "email"]);

      expect(csv).toContain("id,email");
      expect(csv).not.toContain("name");
    });

    it("should escape commas and quotes in CSV", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: 'O\'Brien, James "Jim"', email: "jim@test.com" },
      ];

      const csv = await service.exportCSV(learners);

      // Should be properly quoted
      expect(csv).toContain('"');
    });
  });

  describe("exportExcel", () => {
    it("should export learners to Excel-compatible buffer", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: "Alice", email: "alice@test.com", tags: ["vip"] },
      ];

      const buffer = await service.exportExcel(learners);

      expect(buffer).toBeInstanceOf(Buffer);
      // Should contain BOM
      expect(buffer.toString("utf-8")).toContain("\uFEFF");
      expect(buffer.toString("utf-8")).toContain("Alice");
    });
  });

  describe("exportJSON", () => {
    it("should export learners to JSON format", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: "Alice", email: "alice@test.com" },
      ];

      const json = await service.exportJSON(learners);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe("Alice");
    });

    it("should filter fields when specified", async () => {
      const learners: LearnerRecord[] = [
        { id: 1, name: "Alice", email: "alice@test.com", role: "learner" },
      ];

      const json = await service.exportJSON(learners, ["id", "email"]);
      const parsed = JSON.parse(json);

      expect(parsed[0]).toHaveProperty("id");
      expect(parsed[0]).toHaveProperty("email");
      expect(parsed[0]).not.toHaveProperty("name");
    });
  });

  describe("saveSegment", () => {
    it("should save a segment with filter rules", async () => {
      mockDb.execute.mockResolvedValue([[{ total: 42 }]]);
      mockDb.insert.mockReturnThis();
      mockDb.values.mockResolvedValue([{ insertId: 10 }]);

      const filters: FilterRule[] = [
        { field: "role", operator: "equals", value: "learner" },
      ];

      const result = await service.saveSegment("Active Learners", "All active learners", filters);

      expect(result.id).toBe(10);
    });
  });
});
