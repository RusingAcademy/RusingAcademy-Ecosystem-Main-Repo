// server/automationExecutor.test.ts — Phase 11.1: Automation Executor Tests
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
    execute: vi.fn().mockResolvedValue([]),
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

import { AutomationExecutor } from "./services/automationExecutor";

describe("AutomationExecutor", () => {
  let executor: AutomationExecutor;

  beforeEach(() => {
    vi.clearAllMocks();
    executor = new AutomationExecutor();
    mockIsEnabled.mockResolvedValue(true);
    // Reset mock chain
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockResolvedValue([]);
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue([{ insertId: 1 }]);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.execute.mockResolvedValue([]);
  });

  describe("execute", () => {
    it("should return skipped when feature flag is disabled", async () => {
      mockIsEnabled.mockResolvedValue(false);

      const results = await executor.execute({
        trigger: "user_signup",
        userId: 1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("skipped");
      expect(results[0].message).toContain("Feature flag");
    });

    it("should return empty array when no matching automations", async () => {
      mockDb.where.mockResolvedValue([]);

      const results = await executor.execute({
        trigger: "user_signup",
        userId: 1,
      });

      expect(results).toHaveLength(0);
    });

    it("should execute matching automations", async () => {
      const mockAutomation = {
        id: 1,
        name: "Welcome Flow",
        triggerType: "user_signup",
        triggerConfig: null,
        actionType: "send_notification",
        actionConfig: JSON.stringify({ title: "Welcome!", message: "Welcome to RusingAcademy" }),
        isActive: true,
        executionCount: 0,
      };

      mockDb.where.mockResolvedValueOnce([mockAutomation]);

      const results = await executor.execute({
        trigger: "user_signup",
        userId: 42,
      });

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("success");
      expect(results[0].automationName).toBe("Welcome Flow");
    });

    it("should handle execution errors gracefully", async () => {
      const mockAutomation = {
        id: 2,
        name: "Broken Automation",
        triggerType: "user_signup",
        triggerConfig: null,
        actionType: "webhook",
        actionConfig: JSON.stringify({}),
        isActive: true,
        executionCount: 0,
      };

      mockDb.where.mockResolvedValueOnce([mockAutomation]);

      const results = await executor.execute({
        trigger: "user_signup",
        userId: 1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("error");
      expect(results[0].message).toContain("URL required");
    });

    it("should skip automation when trigger config conditions not met", async () => {
      const mockAutomation = {
        id: 3,
        name: "Conditional Flow",
        triggerType: "course_completed",
        triggerConfig: JSON.stringify({ conditions: [{ field: "courseId", value: 5 }] }),
        actionType: "add_tag",
        actionConfig: JSON.stringify({ tagName: "Course Completer" }),
        isActive: true,
        executionCount: 0,
      };

      mockDb.where.mockResolvedValueOnce([mockAutomation]);

      const results = await executor.execute({
        trigger: "course_completed",
        userId: 1,
        data: { courseId: 10 },
      });

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("skipped");
    });
  });
});

describe("AutomationWorker", () => {
  it("should export triggerAutomation function", async () => {
    const mod = await import("./workers/automationWorker");
    expect(typeof mod.triggerAutomation).toBe("function");
    expect(typeof mod.enqueueAutomation).toBe("function");
    expect(typeof mod.initAutomationWorker).toBe("function");
    expect(typeof mod.shutdownAutomationWorker).toBe("function");
  });
});
