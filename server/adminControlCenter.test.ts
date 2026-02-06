import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-owner",
    email: "admin@rusingacademy.com",
    name: "Admin Owner",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Admin Control Center - Settings Router", () => {
  it("settings.getAll returns an object", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.settings.getAll();
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  it("settings.set stores and retrieves a value", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const testKey = `test_key_${Date.now()}`;
    const testValue = "test_value_123";

    await caller.settings.set({ key: testKey, value: testValue });
    const result = await caller.settings.get({ key: testKey });
    // Value is stored as-is when it's a string
    expect(result).toBe(testValue);
  });

  it("settings.setBulk stores multiple settings", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const ts = Date.now();
    const settings = {
      [`bulk_a_${ts}`]: "value_a",
      [`bulk_b_${ts}`]: "value_b",
    };

    const result = await caller.settings.setBulk({ settings });
    expect(result.success).toBe(true);
  });
});

describe("Admin Control Center - CMS Router", () => {
  it("cms.listPages returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cms.listPages();
    expect(Array.isArray(result)).toBe(true);
  });

  it("cms.createPage creates a page and returns it", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const ts = Date.now();
    const result = await caller.cms.createPage({
      title: `Test Page ${ts}`,
      slug: `test-page-${ts}`,
      pageType: "landing",
    });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });

  it("cms.listMenus returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cms.listMenus();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin Control Center - AI Analytics Router", () => {
  it("aiAnalytics.getOverview returns overview data", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiAnalytics.getOverview();
    expect(result).toBeDefined();
    expect(typeof result.totalAiSessions).toBe("number");
    expect(typeof result.totalPracticeLogs).toBe("number");
  });

  it("aiAnalytics.getTopUsers returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiAnalytics.getTopUsers({ limit: 5 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("aiAnalytics.getByLevel returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiAnalytics.getByLevel();
    expect(Array.isArray(result)).toBe(true);
  });

  it("aiAnalytics.getByType returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiAnalytics.getByType();
    expect(Array.isArray(result)).toBe(true);
  });

  it("aiAnalytics.getDailyTrend returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiAnalytics.getDailyTrend({ days: 7 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Admin Control Center - Sales Analytics Router", () => {
  it("salesAnalytics.getConversionFunnel returns stages", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.salesAnalytics.getConversionFunnel();
    expect(result).toBeDefined();
    expect(result.stages).toBeDefined();
    expect(Array.isArray(result.stages)).toBe(true);
  });

  it("salesAnalytics.getStudentLTV returns LTV data", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.salesAnalytics.getStudentLTV();
    expect(result).toBeDefined();
    expect(typeof result.averageLTV).toBe("number");
    expect(typeof result.totalRevenue).toBe("number");
    expect(typeof result.totalCustomers).toBe("number");
  });

  it("salesAnalytics.getChurn returns churn data", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.salesAnalytics.getChurn();
    expect(result).toBeDefined();
    expect(typeof result.churnRate).toBe("number");
    expect(typeof result.activeStudents).toBe("number");
    expect(typeof result.inactiveStudents).toBe("number");
  });

  it("salesAnalytics.getMonthlyRevenue returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.salesAnalytics.getMonthlyRevenue({ months: 6 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("salesAnalytics.getExportData returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.salesAnalytics.getExportData({ type: "all" });
    expect(Array.isArray(result)).toBe(true);
  });
});
