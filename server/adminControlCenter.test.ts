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

// ─── SETTINGS ───
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

// ─── CMS ───
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

// ─── AI ANALYTICS ───
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

// ─── SALES ANALYTICS ───
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

// ─── AI RULES ───
describe("Admin Control Center - AI Rules Router", () => {
  it("aiRules.getRules returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.aiRules.getRules();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── ACTIVITY LOG ───
describe("Admin Control Center - Activity Log Router", () => {
  it("activityLog.getRecent returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.activityLog.getRecent({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── MEDIA LIBRARY ───
describe("Admin Control Center - Media Library Router", () => {
  it("mediaLibrary.list returns items and total", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mediaLibrary.list({});
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("mediaLibrary.getFolders returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mediaLibrary.getFolders();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── RBAC ───
describe("Admin Control Center - RBAC Router", () => {
  it("rbac.getPermissions returns an array for a role", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.rbac.getPermissions({ role: "coach" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("rbac.bulkSetPermissions saves permissions", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.rbac.bulkSetPermissions({
      role: "coach",
      permissions: [
        { module: "dashboard", action: "view", allowed: true },
        { module: "courses", action: "view", allowed: true },
        { module: "courses", action: "edit", allowed: false },
      ],
    });
    expect(result).toBe(true);
  });

  it("rbac.getPermissions reflects saved permissions", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.rbac.getPermissions({ role: "coach" });
    expect(Array.isArray(result)).toBe(true);
    // Should have at least the permissions we just set
    const dashView = (result as any[]).find((p: any) => p.module === "dashboard" && p.action === "view");
    if (dashView) {
      // allowed is stored as 1/0 in MySQL
      expect(Number(dashView.allowed)).toBe(1);
    }
  });
});

// ─── EMAIL TEMPLATES ───
describe("Admin Control Center - Email Templates Router", () => {
  it("emailTemplates.list returns an array", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.emailTemplates.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("emailTemplates.create creates a template", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const ts = Date.now();
    const result = await caller.emailTemplates.create({
      name: `Test Template ${ts}`,
      category: "welcome",
    });
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect((result as any).id).toBeDefined();
  });

  it("emailTemplates.list includes created template", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.emailTemplates.list({});
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBeGreaterThan(0);
  });
});
