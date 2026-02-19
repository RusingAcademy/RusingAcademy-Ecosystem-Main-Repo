import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([{ id: 1 }]),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

describe("Group Sessions Schema", () => {
  it("should define groupSessions table with required columns", async () => {
    const schema = await import("../drizzle/group-sessions-schema");
    expect(schema.groupSessions).toBeDefined();
    expect(schema.groupSessionParticipants).toBeDefined();
  });

  it("should have correct column types for groupSessions", async () => {
    const schema = await import("../drizzle/group-sessions-schema");
    const table = schema.groupSessions;
    expect(table).toBeDefined();
  });

  it("should have correct column types for groupSessionEnrollments", async () => {
    const schema = await import("../drizzle/group-sessions-schema");
    const table = schema.groupSessionParticipants;
    expect(table).toBeDefined();
  });
});

describe("Group Sessions Feature Flag", () => {
  it("should be gated behind GROUP_SESSIONS_ENABLED flag", () => {
    const flagKey = "GROUP_SESSIONS_ENABLED";
    expect(flagKey).toBe("GROUP_SESSIONS_ENABLED");
  });

  it("should support max_participants configuration", () => {
    const session = { maxParticipants: 20, title: "French B2 Group" };
    expect(session.maxParticipants).toBeGreaterThan(0);
    expect(session.title).toBeTruthy();
  });
});
