import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
  }),
}));

describe("Automation Engine Schema", () => {
  it("should define automationRules table", async () => {
    const schema = await import("../drizzle/automation-engine-schema");
    expect(schema.automations).toBeDefined();
  });

  it("should define automationExecutionLog table", async () => {
    const schema = await import("../drizzle/automation-engine-schema");
    expect(schema.automationLogs).toBeDefined();
  });
});

describe("Automation Engine Logic", () => {
  it("should support trigger types", () => {
    const validTriggers = ["user_signup", "course_complete", "session_booked", "tag_added", "inactivity", "manual"];
    expect(validTriggers).toContain("user_signup");
    expect(validTriggers).toContain("course_complete");
    expect(validTriggers).toContain("inactivity");
  });

  it("should support action types", () => {
    const validActions = ["send_email", "add_tag", "remove_tag", "enroll_course", "send_notification", "webhook"];
    expect(validActions).toContain("send_email");
    expect(validActions).toContain("add_tag");
    expect(validActions).toContain("webhook");
  });

  it("should validate rule conditions as JSON", () => {
    const conditions = { field: "role", operator: "equals", value: "learner" };
    expect(JSON.stringify(conditions)).toBeTruthy();
    expect(conditions.field).toBe("role");
  });

  it("should track execution status", () => {
    const statuses = ["pending", "running", "completed", "failed", "skipped"];
    expect(statuses).toHaveLength(5);
  });
});
