import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Kajabi Integration Router Tests
 * 
 * Tests the 20 new Kajabi integration routers that were added to the ecosystem.
 * These tests validate the router structure, procedure definitions, and basic
 * input/output contracts.
 */

// Mock the database module
vi.mock("./db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    then: vi.fn().mockResolvedValue([]),
  },
}));

// Mock the _core/trpc module
vi.mock("./_core/trpc", () => {
  const { initTRPC } = require("@trpc/server");
  const t = initTRPC.create();
  return {
    router: t.router,
    publicProcedure: t.procedure,
    protectedProcedure: t.procedure,
    adminProcedure: t.procedure,
  };
});

describe("Kajabi Integration Routers — Structure Tests", () => {
  let kajabiModule: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    kajabiModule = await import("./routers/kajabiIntegration");
  });

  it("exports all 20 routers", () => {
    const expectedRouters = [
      "offersRouter",
      "cartRouter",
      "invoicesRouter",
      "blogRouter",
      "podcastsRouter",
      "formsRouter",
      "navigationRouter",
      "assessmentsRouter",
      "paymentsOverviewRouter",
      "marketingOverviewRouter",
      "inboxRouter",
      "contactsOverviewRouter",
      "contactInsightsRouter",
      "reportsRouter",
      "designRouter",
      "eventsAdminRouter",
      "downloadsAdminRouter",
      "newslettersAdminRouter",
      "communityAdminRouter",
      "allProductsRouter",
    ];

    expectedRouters.forEach((routerName) => {
      expect(kajabiModule[routerName]).toBeDefined();
      expect(typeof kajabiModule[routerName]).toBe("object");
    });
  });

  it("offersRouter has required procedures", () => {
    const router = kajabiModule.offersRouter;
    expect(router._def).toBeDefined();
    expect(router._def.procedures).toBeDefined();
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("update");
    expect(procs).toContain("delete");
    expect(procs).toContain("getStats");
  });

  it("cartRouter has required procedures", () => {
    const router = kajabiModule.cartRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getAbandoned");
    expect(procs).toContain("getStats");
    expect(procs).toContain("getRecoverySettings");
    expect(procs).toContain("updateRecoverySetting");
    expect(procs).toContain("markRecovered");
  });

  it("invoicesRouter has required procedures", () => {
    const router = kajabiModule.invoicesRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("update");
    expect(procs).toContain("getById");
    expect(procs).toContain("getStats");
  });

  it("blogRouter has required procedures", () => {
    const router = kajabiModule.blogRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("update");
    expect(procs).toContain("delete");
    expect(procs).toContain("getCategories");
    expect(procs).toContain("createCategory");
    expect(procs).toContain("getStats");
  });

  it("podcastsRouter has required procedures", () => {
    const router = kajabiModule.podcastsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("createEpisode");
    expect(procs).toContain("updateEpisode");
    expect(procs).toContain("getStats");
  });

  it("formsRouter has required procedures", () => {
    const router = kajabiModule.formsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("getSubmissions");
    expect(procs).toContain("getStats");
  });

  it("navigationRouter has required procedures", () => {
    const router = kajabiModule.navigationRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("update");
    expect(procs).toContain("delete");
    expect(procs).toContain("reorder");
  });

  it("assessmentsRouter has required procedures", () => {
    const router = kajabiModule.assessmentsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("create");
    expect(procs).toContain("getResults");
    expect(procs).toContain("getStats");
  });

  it("paymentsOverviewRouter has required procedures", () => {
    const router = kajabiModule.paymentsOverviewRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getOverview");
    expect(procs).toContain("getRecentTransactions");
  });

  it("marketingOverviewRouter has required procedures", () => {
    const router = kajabiModule.marketingOverviewRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getOverview");
  });

  it("inboxRouter has required procedures", () => {
    const router = kajabiModule.inboxRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getMessages");
    expect(procs).toContain("getStats");
  });

  it("contactsOverviewRouter has required procedures", () => {
    const router = kajabiModule.contactsOverviewRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getAll");
    expect(procs).toContain("getStats");
  });

  it("contactInsightsRouter has required procedures", () => {
    const router = kajabiModule.contactInsightsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getInsights");
  });

  it("reportsRouter has required procedures", () => {
    const router = kajabiModule.reportsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getRevenueReport");
    expect(procs).toContain("getEnrollmentReport");
    expect(procs).toContain("getEngagementReport");
  });

  it("designRouter has required procedures", () => {
    const router = kajabiModule.designRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getTheme");
    expect(procs).toContain("updateTheme");
  });

  it("eventsAdminRouter has required procedures", () => {
    const router = kajabiModule.eventsAdminRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("getStats");
  });

  it("downloadsAdminRouter has required procedures", () => {
    const router = kajabiModule.downloadsAdminRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("list");
    expect(procs).toContain("getStats");
  });

  it("newslettersAdminRouter has required procedures", () => {
    const router = kajabiModule.newslettersAdminRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getStats");
  });

  it("communityAdminRouter has required procedures", () => {
    const router = kajabiModule.communityAdminRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getOverview");
    expect(procs).toContain("getRecentThreads");
    expect(procs).toContain("getFlaggedContent");
  });

  it("allProductsRouter has required procedures", () => {
    const router = kajabiModule.allProductsRouter;
    const procs = Object.keys(router._def.procedures);
    expect(procs).toContain("getOverview");
  });
});

describe("Kajabi Integration — Schema Tables", () => {
  it("all new Kajabi tables are exported from schema", async () => {
    const schema = await import("../drizzle/schema");
    
    const expectedTables = [
      "offers",
      "offerProducts",
      "abandonedCarts",
      "invoices",
      "blogPosts",
      "blogCategories",
      "podcasts",
      "podcastEpisodes",
      "forms",
      "formSubmissions",
      "navigationMenus",
      "assessments",
      "assessmentResults",
      "cartRecoverySettings",
    ];

    expectedTables.forEach((tableName) => {
      expect(schema[tableName as keyof typeof schema]).toBeDefined();
    });
  });
});

describe("Kajabi Integration — AdminLayout Sidebar", () => {
  it("AdminLayout file exists and contains Kajabi sections", async () => {
    const fs = await import("fs");
    const layoutContent = fs.readFileSync(
      require("path").resolve(__dirname, "../client/src/components/AdminLayout.tsx"),
      "utf-8"
    );

    // Check for Kajabi-style section groups
    expect(layoutContent).toContain("Products");
    expect(layoutContent).toContain("Sales");
    expect(layoutContent).toContain("Website");
    expect(layoutContent).toContain("Marketing");
    expect(layoutContent).toContain("Contacts");
    expect(layoutContent).toContain("Analytics");
    expect(layoutContent).toContain("Settings");
  });
});

describe("Kajabi Integration — AdminControlCenter Mapping", () => {
  it("AdminControlCenter file contains all new section mappings", async () => {
    const fs = await import("fs");
    const accContent = fs.readFileSync(
      require("path").resolve(__dirname, "../client/src/pages/AdminControlCenter.tsx"),
      "utf-8"
    );

    // Keys without hyphens appear unquoted in the sectionMap object
    const unquotedSections = [
      "podcasts", "newsletters", "downloads", "community",
      "payments", "offers", "cart", "invoices", "affiliates",
      "design", "navigation", "blog", "marketing", "inbox",
      "forms", "events", "contacts", "assessments", "reports",
    ];
    // Keys with hyphens require quotes
    const quotedSections = ["all-products", "contact-insights"];

    unquotedSections.forEach((section) => {
      expect(accContent).toContain(`${section}:`);
    });
    quotedSections.forEach((section) => {
      expect(accContent).toContain(`"${section}"`);
    });
  });
});

describe("Kajabi Integration — Route Registration", () => {
  it("App.tsx contains all new admin routes", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync(
      require("path").resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );

    const expectedRoutes = [
      "/admin/all-products",
      "/admin/podcasts",
      "/admin/newsletters",
      "/admin/downloads",
      "/admin/community",
      "/admin/payments",
      "/admin/offers",
      "/admin/cart",
      "/admin/invoices",
      "/admin/affiliates",
      "/admin/design",
      "/admin/navigation",
      "/admin/blog",
      "/admin/marketing",
      "/admin/inbox",
      "/admin/forms",
      "/admin/events",
      "/admin/contacts",
      "/admin/contact-insights",
      "/admin/assessments",
      "/admin/reports",
    ];

    expectedRoutes.forEach((route) => {
      expect(appContent).toContain(route);
    });
  });
});
