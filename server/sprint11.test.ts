import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@rusingacademy.ca",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      headers: { host: "localhost:3000", origin: "http://localhost:3000" },
      cookies: {},
    } as any,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "learner@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      headers: { host: "localhost:3000", origin: "http://localhost:3000" },
      cookies: {},
    } as any,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
}

const caller = appRouter.createCaller;

// ============================================================================
// Sprint 11A: Email Delivery Logs
// ============================================================================
describe("Sprint 11A: Admin Email Logs", () => {
  it("adminEmail.getStats returns delivery stats structure", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const stats = await adminCaller.adminEmail.getStats();
    expect(stats).toHaveProperty("sent");
    expect(stats).toHaveProperty("failed");
    expect(stats).toHaveProperty("bounced");
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("byType");
    expect(typeof stats.sent).toBe("number");
    expect(typeof stats.total).toBe("number");
  });

  it("adminEmail.getLogs returns logs with total", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const result = await adminCaller.adminEmail.getLogs({});
    expect(result).toHaveProperty("logs");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.logs)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("adminEmail.getLogs rejects non-admin users", async () => {
    const ctx = createUserContext();
    const userCaller = caller(ctx);
    await expect(userCaller.adminEmail.getLogs({})).rejects.toThrow();
  });
});

// ============================================================================
// Sprint 11B: Admin Enrollments
// ============================================================================
describe("Sprint 11B: Admin Enrollments", () => {
  it("admin.getEnrollments returns enrollments and stats", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const result = await adminCaller.admin.getEnrollments();
    expect(result).toHaveProperty("enrollments");
    expect(result).toHaveProperty("stats");
    expect(Array.isArray(result.enrollments)).toBe(true);
    expect(result.stats).toHaveProperty("total");
    expect(result.stats).toHaveProperty("active");
    expect(result.stats).toHaveProperty("completed");
  });
});

// ============================================================================
// Sprint 11C: Admin Reviews & Ratings
// ============================================================================
describe("Sprint 11C: Admin Reviews", () => {
  it("adminReviews.getAll returns array of reviews", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const reviews = await adminCaller.adminReviews.getAll();
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("adminReviews.getStats returns stats structure", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const stats = await adminCaller.adminReviews.getStats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("avgRating");
    expect(stats).toHaveProperty("visible");
    expect(stats).toHaveProperty("hidden");
    expect(stats).toHaveProperty("withResponse");
    expect(typeof stats.total).toBe("number");
  });

  it("adminReviews.getAll rejects non-admin users", async () => {
    const ctx = createUserContext();
    const userCaller = caller(ctx);
    await expect(userCaller.adminReviews.getAll()).rejects.toThrow();
  });

  it("adminReviews.toggleVisibility rejects non-admin users", async () => {
    const ctx = createUserContext();
    const userCaller = caller(ctx);
    await expect(
      userCaller.adminReviews.toggleVisibility({ reviewId: 1 })
    ).rejects.toThrow();
  });
});
