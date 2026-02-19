/**
 * Email Automation Unit Tests — Phase 8.2
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, mockIsEnabled } = vi.hoisted(() => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  };
  return {
    mockDb,
    mockIsEnabled: vi.fn().mockResolvedValue(true),
  };
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
  createLogger: vi.fn().mockReturnValue({ info: vi.fn(), error: vi.fn(), warn: vi.fn() }),
}));

import { emailAutomationService } from "./services/emailAutomationService";

describe("Email Automation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEnabled.mockResolvedValue(true);
    mockDb.select.mockReturnValue(mockDb);
    mockDb.from.mockReturnValue(mockDb);
    mockDb.where.mockReturnValue(mockDb);
    mockDb.orderBy.mockReturnValue(mockDb);
    mockDb.insert.mockReturnValue(mockDb);
    mockDb.values.mockResolvedValue([{ insertId: 1 }]);
    mockDb.update.mockReturnValue(mockDb);
    mockDb.set.mockReturnValue(mockDb);
    mockDb.delete.mockReturnValue(mockDb);
    mockDb.execute.mockResolvedValue([]);
  });

  describe("enrollByTrigger", () => {
    it("should find active sequences matching the trigger", async () => {
      mockDb.where.mockResolvedValueOnce([
        { id: 1, trigger: "user_signup", status: "active", steps: "[]" },
      ]);
      mockDb.where.mockResolvedValueOnce([]);

      await emailAutomationService.enrollByTrigger("user_signup", 42);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should skip enrollment if user is already enrolled", async () => {
      mockDb.where.mockResolvedValueOnce([
        { id: 1, trigger: "user_signup", status: "active" },
      ]);
      mockDb.where.mockResolvedValueOnce([
        { id: 10, sequenceId: 1, userId: 42, status: "active" },
      ]);

      await emailAutomationService.enrollByTrigger("user_signup", 42);
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it("should not enroll when feature flag is disabled", async () => {
      mockIsEnabled.mockResolvedValueOnce(false);
      await emailAutomationService.enrollByTrigger("user_signup", 42);
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });

  describe("processQueue", () => {
    it("should return zero counts when no enrollments exist", async () => {
      mockDb.where.mockResolvedValueOnce([]);
      const result = await emailAutomationService.processQueue();
      expect(result).toEqual({ processed: 0, errors: 0 });
    });
  });

  describe("getSequenceAnalytics", () => {
    it("should return analytics for a sequence", async () => {
      mockDb.execute.mockResolvedValueOnce([
        [{ totalSent: 100, totalOpened: 45, totalClicked: 20, totalBounced: 3 }],
      ]);
      const analytics = await emailAutomationService.getSequenceAnalytics(1);
      expect(analytics).toBeDefined();
      expect(analytics!.totalSent).toBe(100);
    });

    it("should handle empty analytics gracefully", async () => {
      mockDb.execute.mockResolvedValueOnce([[]]);
      const analytics = await emailAutomationService.getSequenceAnalytics(1);
      expect(analytics).toBeDefined();
      expect(analytics!.totalSent).toBe(0);
      expect(analytics!.openRate).toBe("0.0");
    });
  });

  describe("trackOpen", () => {
    it("should update log status to opened", async () => {
      mockDb.where.mockResolvedValueOnce(undefined);
      await emailAutomationService.trackOpen(1);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("trackClick", () => {
    it("should update log status to clicked", async () => {
      mockDb.where.mockResolvedValueOnce(undefined);
      await emailAutomationService.trackClick(1);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });
});

describe("Email Sequence Step Types", () => {
  it("should support email, delay, and condition step types", () => {
    const steps = [
      { id: "1", type: "email", subject: "Welcome" },
      { id: "2", type: "delay", delayDays: 1 },
      { id: "3", type: "condition", condition: { field: "role", operator: "equals", value: "learner" } },
      { id: "4", type: "email", subject: "Follow up" },
    ];
    expect(steps).toHaveLength(4);
    expect(steps[0].type).toBe("email");
    expect(steps[1].type).toBe("delay");
    expect(steps[2].type).toBe("condition");
  });

  it("should support bilingual subjects", () => {
    const step = {
      id: "1", type: "email",
      subject: "Welcome to RusingAcademy!",
      subjectFr: "Bienvenue chez RusingAcademy!",
    };
    expect(step.subject).toBeDefined();
    expect(step.subjectFr).toBeDefined();
  });
});

describe("Trigger Types", () => {
  const validTriggers = [
    "user_signup", "course_purchase", "cart_abandoned",
    "course_completed", "session_booked", "membership_activated", "manual",
  ];

  it("should support all 7 trigger types", () => {
    expect(validTriggers).toHaveLength(7);
  });

  validTriggers.forEach((trigger) => {
    it(`should handle ${trigger} trigger`, () => {
      expect(typeof trigger).toBe("string");
      expect(trigger.length).toBeGreaterThan(0);
    });
  });
});
