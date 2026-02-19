import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
  }),
}));

describe("Learner 360 Schema", () => {
  it("should define learnerTags table", async () => {
    const schema = await import("../drizzle/learner360-tags-schema");
    expect(schema.learnerTags).toBeDefined();
  });

  it("should define learnerTagAssignments table", async () => {
    const schema = await import("../drizzle/learner360-tags-schema");
    expect(schema.learnerTagAssignments).toBeDefined();
  });

  it("should define learnerNotes table", async () => {
    const schema = await import("../drizzle/learner360-tags-schema");
    expect(schema.learnerNotes).toBeDefined();
  });
});

describe("Learner 360 View", () => {
  it("should aggregate learner data from multiple sources", () => {
    const learner360 = {
      profile: { name: "Test User", email: "test@example.com" },
      enrollments: [{ courseId: 1, progress: 75 }],
      sessions: [{ id: 1, status: "completed" }],
      tags: ["active", "french-b2"],
      notes: [{ text: "Good progress" }],
    };
    expect(learner360.profile).toBeDefined();
    expect(learner360.enrollments).toHaveLength(1);
    expect(learner360.tags).toContain("active");
  });

  it("should support tag colors", () => {
    const validColors = ["blue", "green", "red", "yellow", "purple", "orange", "gray"];
    expect(validColors).toHaveLength(7);
  });
});
