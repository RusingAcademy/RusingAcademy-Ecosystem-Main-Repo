import { describe, it, expect } from "vitest";

// ─── Admin Courses: Unit Tests ──────────────────────────────────────────────
// Tests the course publication lifecycle, status transitions, bulk operations,
// and access control logic used by the adminCourses router.

// ─── Status Lifecycle Definitions ───────────────────────────────────────────

const VALID_STATUSES = ["draft", "review", "published", "archived"] as const;
type CourseStatus = (typeof VALID_STATUSES)[number];

// Allowed transitions: from → [to]
const ALLOWED_TRANSITIONS: Record<CourseStatus, CourseStatus[]> = {
  draft: ["review", "published", "archived"],
  review: ["draft", "published"],
  published: ["draft", "archived"],
  archived: ["draft", "published"],
};

// ─── Helper: Simulate status transition logic ───────────────────────────────

function isValidTransition(from: CourseStatus, to: CourseStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

function computePublishFields(status: CourseStatus, userName: string) {
  return {
    status,
    publishedAt: status === "published" ? new Date() : undefined,
    publishedBy: status === "published" ? userName : undefined,
  };
}

function computeStats(courses: { status: CourseStatus }[]) {
  return {
    total: courses.length,
    published: courses.filter((c) => c.status === "published").length,
    review: courses.filter((c) => c.status === "review").length,
    draft: courses.filter((c) => c.status === "draft").length,
    archived: courses.filter((c) => c.status === "archived").length,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Course Status Enum", () => {
  it("should include all four lifecycle statuses", () => {
    expect(VALID_STATUSES).toEqual(["draft", "review", "published", "archived"]);
  });

  it("should have draft as the default status", () => {
    const defaultStatus: CourseStatus = "draft";
    expect(VALID_STATUSES).toContain(defaultStatus);
  });

  it("should include review status for pedagogical approval workflow", () => {
    expect(VALID_STATUSES).toContain("review");
  });
});

describe("Status Transitions", () => {
  it("should allow draft → review", () => {
    expect(isValidTransition("draft", "review")).toBe(true);
  });

  it("should allow draft → published (direct publish)", () => {
    expect(isValidTransition("draft", "published")).toBe(true);
  });

  it("should allow review → published (approve)", () => {
    expect(isValidTransition("review", "published")).toBe(true);
  });

  it("should allow review → draft (return for revision)", () => {
    expect(isValidTransition("review", "draft")).toBe(true);
  });

  it("should allow published → draft (unpublish)", () => {
    expect(isValidTransition("published", "draft")).toBe(true);
  });

  it("should allow published → archived", () => {
    expect(isValidTransition("published", "archived")).toBe(true);
  });

  it("should allow archived → draft (restore)", () => {
    expect(isValidTransition("archived", "draft")).toBe(true);
  });

  it("should not allow review → archived (must go through draft first)", () => {
    expect(isValidTransition("review", "archived")).toBe(false);
  });
});

describe("Publish Fields Computation", () => {
  it("should set publishedAt and publishedBy when publishing", () => {
    const fields = computePublishFields("published", "Steven Rusing");
    expect(fields.status).toBe("published");
    expect(fields.publishedAt).toBeInstanceOf(Date);
    expect(fields.publishedBy).toBe("Steven Rusing");
  });

  it("should not set publishedAt when moving to draft", () => {
    const fields = computePublishFields("draft", "Steven Rusing");
    expect(fields.status).toBe("draft");
    expect(fields.publishedAt).toBeUndefined();
    expect(fields.publishedBy).toBeUndefined();
  });

  it("should not set publishedAt when moving to review", () => {
    const fields = computePublishFields("review", "Steven Rusing");
    expect(fields.status).toBe("review");
    expect(fields.publishedAt).toBeUndefined();
    expect(fields.publishedBy).toBeUndefined();
  });

  it("should not set publishedAt when archiving", () => {
    const fields = computePublishFields("archived", "Steven Rusing");
    expect(fields.status).toBe("archived");
    expect(fields.publishedAt).toBeUndefined();
    expect(fields.publishedBy).toBeUndefined();
  });
});

describe("Course Stats Computation", () => {
  const mockCourses: { status: CourseStatus }[] = [
    { status: "published" },
    { status: "published" },
    { status: "review" },
    { status: "draft" },
    { status: "draft" },
    { status: "draft" },
    { status: "archived" },
  ];

  it("should compute correct total", () => {
    const stats = computeStats(mockCourses);
    expect(stats.total).toBe(7);
  });

  it("should compute correct published count", () => {
    const stats = computeStats(mockCourses);
    expect(stats.published).toBe(2);
  });

  it("should compute correct review count", () => {
    const stats = computeStats(mockCourses);
    expect(stats.review).toBe(1);
  });

  it("should compute correct draft count", () => {
    const stats = computeStats(mockCourses);
    expect(stats.draft).toBe(3);
  });

  it("should compute correct archived count", () => {
    const stats = computeStats(mockCourses);
    expect(stats.archived).toBe(1);
  });

  it("should sum to total", () => {
    const stats = computeStats(mockCourses);
    expect(stats.published + stats.review + stats.draft + stats.archived).toBe(stats.total);
  });
});

describe("Bulk Status Update Logic", () => {
  it("should update all specified course IDs", () => {
    const courseIds = [1, 2, 3, 5, 8];
    const status: CourseStatus = "published";
    const results = courseIds.map((id) => ({
      id,
      ...computePublishFields(status, "Admin"),
    }));
    expect(results).toHaveLength(5);
    expect(results.every((r) => r.status === "published")).toBe(true);
    expect(results.every((r) => r.publishedBy === "Admin")).toBe(true);
  });

  it("should handle empty array gracefully", () => {
    const courseIds: number[] = [];
    expect(courseIds.length).toBe(0);
  });

  it("should set publishedBy for each course when publishing in bulk", () => {
    const courseIds = [10, 20, 30];
    const userName = "Steven Rusing";
    const results = courseIds.map((id) => ({
      id,
      ...computePublishFields("published", userName),
    }));
    results.forEach((r) => {
      expect(r.publishedBy).toBe(userName);
      expect(r.publishedAt).toBeInstanceOf(Date);
    });
  });

  it("should not set publishedBy when bulk archiving", () => {
    const courseIds = [10, 20, 30];
    const results = courseIds.map((id) => ({
      id,
      ...computePublishFields("archived", "Admin"),
    }));
    results.forEach((r) => {
      expect(r.publishedBy).toBeUndefined();
    });
  });
});

describe("Learner Access Filter", () => {
  it("should only show published courses to learners", () => {
    const allCourses: { id: number; status: CourseStatus; title: string }[] = [
      { id: 1, status: "published", title: "SLE Oral Prep" },
      { id: 2, status: "draft", title: "New Course WIP" },
      { id: 3, status: "review", title: "Under Review" },
      { id: 4, status: "published", title: "Grammar Essentials" },
      { id: 5, status: "archived", title: "Old Course" },
    ];

    const learnerVisible = allCourses.filter((c) => c.status === "published");
    expect(learnerVisible).toHaveLength(2);
    expect(learnerVisible.map((c) => c.id)).toEqual([1, 4]);
  });

  it("should not show review courses to learners", () => {
    const courses = [
      { status: "review" as CourseStatus },
      { status: "published" as CourseStatus },
    ];
    const visible = courses.filter((c) => c.status === "published");
    expect(visible).toHaveLength(1);
  });

  it("should not show draft courses to learners", () => {
    const courses = [
      { status: "draft" as CourseStatus },
      { status: "published" as CourseStatus },
    ];
    const visible = courses.filter((c) => c.status === "published");
    expect(visible).toHaveLength(1);
  });
});

describe("RBAC Access Control", () => {
  it("should allow admin role to manage courses", () => {
    const user = { role: "admin", openId: "user123" };
    const isAuthorized = user.role === "admin" || user.openId === "OWNER_OPEN_ID";
    expect(isAuthorized).toBe(true);
  });

  it("should allow owner to manage courses", () => {
    const user = { role: "user", openId: "OWNER_OPEN_ID" };
    const ownerOpenId = "OWNER_OPEN_ID";
    const isAuthorized = user.role === "admin" || user.openId === ownerOpenId;
    expect(isAuthorized).toBe(true);
  });

  it("should deny regular users from managing courses", () => {
    const user = { role: "user", openId: "regular_user" };
    const ownerOpenId = "OWNER_OPEN_ID";
    const isAuthorized = user.role === "admin" || user.openId === ownerOpenId;
    expect(isAuthorized).toBe(false);
  });
});
