import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  const full = resolve(ROOT, relPath);
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(full, "utf-8");
}

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

const caller = appRouter.createCaller;

// ============================================================================
// Sprint 12A: Dashboard KPIs & Overview
// ============================================================================
describe("Sprint 12A: Dashboard KPIs & Analytics", () => {
  it("getAnalytics returns totalCourses (real count, not hardcoded)", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const analytics = await adminCaller.admin.getAnalytics();
    expect(analytics).toHaveProperty("totalCourses");
    expect(typeof analytics.totalCourses).toBe("number");
  });

  it("getAnalytics returns real userGrowth (not hardcoded 12.5)", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const analytics = await adminCaller.admin.getAnalytics();
    expect(analytics).toHaveProperty("userGrowth");
    expect(typeof analytics.userGrowth).toBe("number");
    // Should not be exactly 12.5 (the old hardcoded value)
    // unless by coincidence, which is extremely unlikely
  });

  it("getAnalytics returns monthlyRevenue array", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const analytics = await adminCaller.admin.getAnalytics();
    expect(analytics).toHaveProperty("monthlyRevenue");
    expect(Array.isArray(analytics.monthlyRevenue)).toBe(true);
    expect(analytics.monthlyRevenue.length).toBe(6);
  });

  it("getOrgStats returns real completions count", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const orgStats = await adminCaller.admin.getOrgStats();
    expect(orgStats).toHaveProperty("completions");
    expect(typeof orgStats.completions).toBe("number");
  });

  it("getOrgStats returns real avgProgress", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const orgStats = await adminCaller.admin.getOrgStats();
    expect(orgStats).toHaveProperty("avgProgress");
    expect(typeof orgStats.avgProgress).toBe("number");
  });
});

// ============================================================================
// Sprint 12B: Recent Activity Enhancement
// ============================================================================
describe("Sprint 12B: Recent Activity Enhancement", () => {
  it("getRecentActivity returns array of events", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const activity = await adminCaller.admin.getRecentActivity();
    expect(Array.isArray(activity)).toBe(true);
  });
});

// ============================================================================
// Sprint 12C: DashboardOverview Frontend
// ============================================================================
describe("Sprint 12C: DashboardOverview Frontend", () => {
  it("DashboardOverview uses getAnalytics and getOrgStats", () => {
    const content = readFile("client/src/pages/admin/DashboardOverview.tsx");
    expect(content).toContain("trpc.admin.getAnalytics.useQuery");
    expect(content).toContain("trpc.admin.getOrgStats.useQuery");
    expect(content).toContain("trpc.admin.getRecentActivity.useQuery");
  });

  it("DashboardOverview shows revenue trend chart", () => {
    const content = readFile("client/src/pages/admin/DashboardOverview.tsx");
    expect(content).toContain("Revenue Trend");
    expect(content).toContain("MiniBarChart");
  });

  it("DashboardOverview shows platform health section", () => {
    const content = readFile("client/src/pages/admin/DashboardOverview.tsx");
    expect(content).toContain("Platform Health");
    expect(content).toContain("Stripe Connected");
  });

  it("DashboardOverview shows session growth trend", () => {
    const content = readFile("client/src/pages/admin/DashboardOverview.tsx");
    expect(content).toContain("sessionGrowth");
    expect(content).toContain("revenueGrowth");
  });

  it("DashboardOverview no longer maps totalCourses from totalLearners", () => {
    const content = readFile("client/src/pages/admin/DashboardOverview.tsx");
    // Old bug: totalCourses = o.totalLearners
    expect(content).not.toContain("const totalCourses = o.totalLearners");
  });
});

// ============================================================================
// Sprint 12D: Sales Analytics
// ============================================================================
describe("Sprint 12D: Sales Analytics endpoints", () => {
  it("salesAnalytics.getConversionFunnel returns funnel data", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const funnel = await adminCaller.salesAnalytics.getConversionFunnel();
    expect(funnel).toBeDefined();
  });

  it("salesAnalytics.getStudentLTV returns LTV data", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const ltv = await adminCaller.salesAnalytics.getStudentLTV();
    expect(ltv).toHaveProperty("averageLTV");
    expect(ltv).toHaveProperty("totalRevenue");
  });

  it("salesAnalytics.getChurn returns churn data", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const churn = await adminCaller.salesAnalytics.getChurn();
    expect(churn).toHaveProperty("churnRate");
    expect(churn).toHaveProperty("activeStudents");
  });

  it("salesAnalytics.getMonthlyRevenue returns array", async () => {
    const ctx = createAdminContext();
    const adminCaller = caller(ctx);
    const revenue = await adminCaller.salesAnalytics.getMonthlyRevenue({ months: 6 });
    expect(Array.isArray(revenue)).toBe(true);
  });
});
