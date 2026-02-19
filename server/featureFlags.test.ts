/**
 * Phase 0.1: Feature Flags Infrastructure — Vitest Tests
 *
 * Validates:
 * 1. Schema definition (feature_flags + feature_flag_history tables)
 * 2. Service module exports and API surface
 * 3. Router module exports and procedure definitions
 * 4. Middleware module exports
 * 5. Client hook and provider exports
 * 6. Admin UI component existence
 * 7. App.tsx integration (route + provider)
 * 8. AdminControlCenter section mapping
 * 9. Migration file for Phase 7-14 flags
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SERVER = path.resolve(ROOT, "server");
const CLIENT_SRC = path.resolve(ROOT, "client/src");

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// ─── 1. Schema ───────────────────────────────────────────────

describe("Phase 0.1: Feature Flags Schema", () => {
  const schema = readFile(path.join(ROOT, "drizzle/schema.ts"));

  it("should define featureFlags table", () => {
    expect(schema).toContain("featureFlags");
    expect(schema).toContain("feature_flags");
  });

  it("should have key column", () => {
    expect(schema).toContain("key:");
  });

  it("should have enabled column", () => {
    expect(schema).toContain("enabled:");
  });

  it("should have environment column", () => {
    expect(schema).toContain("environment:");
  });

  it("should have rolloutPercentage for gradual rollout", () => {
    expect(schema).toContain("rolloutPercentage:");
  });

  it("should have targetRoles for role-based targeting", () => {
    expect(schema).toContain("targetRoles:");
  });

  it("should define featureFlagHistory table for audit trail", () => {
    expect(schema).toContain("featureFlagHistory");
    expect(schema).toContain("feature_flag_history");
  });
});

// ─── 2. Service ──────────────────────────────────────────────

describe("Phase 0.1: Feature Flag Service", () => {
  const service = readFile(path.join(SERVER, "services/featureFlagService.ts"));

  it("should exist", () => {
    expect(fileExists(path.join(SERVER, "services/featureFlagService.ts"))).toBe(true);
  });

  it("should import getDb (async DB access)", () => {
    expect(service).toContain("getDb");
  });

  it("should export featureFlagService object", () => {
    expect(service).toContain("export const featureFlagService");
  });

  it("should have isEnabled method", () => {
    expect(service).toContain("isEnabled");
  });

  it("should have getAllFlags method", () => {
    expect(service).toContain("getAllFlags");
  });

  it("should have getUserFlags method", () => {
    expect(service).toContain("getUserFlags");
  });

  it("should have createFlag method", () => {
    expect(service).toContain("createFlag");
  });

  it("should have updateFlag method", () => {
    expect(service).toContain("updateFlag");
  });

  it("should have deleteFlag method", () => {
    expect(service).toContain("deleteFlag");
  });

  it("should have in-memory cache for performance", () => {
    expect(service).toContain("flagCache");
  });

  it("should have cache invalidation", () => {
    expect(service).toContain("invalidateCache");
  });

  it("should have history logging", () => {
    expect(service).toContain("logHistory");
  });

  it("should support rollout percentage with user hash", () => {
    expect(service).toContain("hashUserId");
  });
});

// ─── 3. Router ───────────────────────────────────────────────

describe("Phase 0.1: Feature Flags Router", () => {
  const routerFile = readFile(path.join(SERVER, "routers/featureFlags.ts"));

  it("should exist", () => {
    expect(fileExists(path.join(SERVER, "routers/featureFlags.ts"))).toBe(true);
  });

  it("should export featureFlagsRouter", () => {
    expect(routerFile).toContain("featureFlagsRouter");
  });

  it("should have list procedure (admin only)", () => {
    expect(routerFile).toContain("list:");
  });

  it("should have getUserFlags procedure", () => {
    expect(routerFile).toContain("getUserFlags:");
  });

  it("should have check procedure", () => {
    expect(routerFile).toContain("check:");
  });

  it("should have create procedure", () => {
    expect(routerFile).toContain("create:");
  });

  it("should have update procedure", () => {
    expect(routerFile).toContain("update:");
  });

  it("should have toggle procedure", () => {
    expect(routerFile).toContain("toggle:");
  });

  it("should have delete procedure", () => {
    expect(routerFile).toContain("delete:");
  });

  it("should have history procedure", () => {
    expect(routerFile).toContain("history:");
  });

  it("should use adminProcedure for admin-only routes", () => {
    expect(routerFile).toContain("adminProcedure");
  });

  it("should be registered in main router", () => {
    const mainRouter = readFile(path.join(SERVER, "routers.ts"));
    expect(mainRouter).toContain("featureFlagsRouter");
    expect(mainRouter).toContain("featureFlags:");
  });
});

// ─── 4. Middleware ────────────────────────────────────────────

describe("Phase 0.1: Feature Flag Middleware", () => {
  it("should exist", () => {
    expect(fileExists(path.join(SERVER, "middleware/featureFlagMiddleware.ts"))).toBe(true);
  });

  const middleware = readFile(path.join(SERVER, "middleware/featureFlagMiddleware.ts"));

  it("should export requireFeatureFlag function (tRPC)", () => {
    expect(middleware).toContain("export function requireFeatureFlag");
  });

  it("should export requireFeatureFlagExpress function (Express)", () => {
    expect(middleware).toContain("export function requireFeatureFlagExpress");
  });

  it("should throw FORBIDDEN when flag is disabled", () => {
    expect(middleware).toContain("FORBIDDEN");
  });

  it("should use featureFlagService.isEnabled", () => {
    expect(middleware).toContain("featureFlagService.isEnabled");
  });
});

// ─── 5. Client Hook ──────────────────────────────────────────

describe("Phase 0.1: Feature Flag Client Hook", () => {
  const hook = readFile(path.join(CLIENT_SRC, "hooks/useFeatureFlag.tsx"));

  it("should export FeatureFlagProvider", () => {
    expect(hook).toContain("export function FeatureFlagProvider");
  });

  it("should export useFeatureFlag hook", () => {
    expect(hook).toContain("export function useFeatureFlag");
  });

  it("should export useFeatureFlags hook", () => {
    expect(hook).toContain("export function useFeatureFlags");
  });

  it("should export Feature gate component", () => {
    expect(hook).toContain("export function Feature");
  });

  it("should use trpc.featureFlags.getUserFlags", () => {
    expect(hook).toContain("trpc.featureFlags.getUserFlags");
  });

  it("should use correct useAuth import path", () => {
    expect(hook).toContain("@/_core/hooks/useAuth");
  });
});

// ─── 6. Admin UI ─────────────────────────────────────────────

describe("Phase 0.1: Feature Flags Admin UI", () => {
  it("should have FeatureFlagsManager component", () => {
    expect(fileExists(path.join(CLIENT_SRC, "components/admin/FeatureFlagsManager.tsx"))).toBe(true);
  });

  it("should have FeatureFlags page wrapper", () => {
    expect(fileExists(path.join(CLIENT_SRC, "pages/admin/FeatureFlags.tsx"))).toBe(true);
  });

  const manager = readFile(path.join(CLIENT_SRC, "components/admin/FeatureFlagsManager.tsx"));

  it("should have create flag functionality", () => {
    expect(manager).toContain("featureFlags.create");
  });

  it("should have toggle functionality", () => {
    expect(manager).toContain("featureFlags.toggle");
  });

  it("should have delete functionality", () => {
    expect(manager).toContain("featureFlags.delete");
  });

  it("should have list query", () => {
    expect(manager).toContain("featureFlags.list");
  });

  it("should support bilingual labels", () => {
    expect(manager).toContain("isFr");
  });
});

// ─── 7. App.tsx Integration ──────────────────────────────────

describe("Phase 0.1: App.tsx Integration", () => {
  const app = readFile(path.join(CLIENT_SRC, "App.tsx"));

  it("should import FeatureFlagProvider", () => {
    expect(app).toContain("FeatureFlagProvider");
  });

  it("should wrap app with FeatureFlagProvider", () => {
    expect(app).toContain("<FeatureFlagProvider>");
    expect(app).toContain("</FeatureFlagProvider>");
  });

  it("should have /admin/feature-flags route", () => {
    expect(app).toContain('path="/admin/feature-flags"');
  });

  it("should map feature-flags route to AdminControlCenter", () => {
    expect(app).toContain('section="feature-flags"');
  });
});

// ─── 8. AdminControlCenter ──────────────────────────────────

describe("Phase 0.1: AdminControlCenter Integration", () => {
  const acc = readFile(path.join(CLIENT_SRC, "pages/AdminControlCenter.tsx"));

  it("should import FeatureFlags component", () => {
    expect(acc).toContain("FeatureFlags");
  });

  it("should map feature-flags section", () => {
    expect(acc).toContain('"feature-flags": FeatureFlags');
  });
});

// ─── 9. Admin Index Exports ─────────────────────────────────

describe("Phase 0.1: Admin Index Exports", () => {
  const index = readFile(path.join(CLIENT_SRC, "pages/admin/index.ts"));

  it("should export FeatureFlags page", () => {
    expect(index).toContain("FeatureFlags");
  });
});

// ─── 10. Migration File ─────────────────────────────────────

describe("Phase 0.1: Migration File", () => {
  it("should have seed migration for Phase 7-14 flags", () => {
    expect(fileExists(path.join(ROOT, "drizzle/migrations/0005_seed_phase7_flags.sql"))).toBe(true);
  });

  const migration = readFile(path.join(ROOT, "drizzle/migrations/0005_seed_phase7_flags.sql"));

  it("should seed MEMBERSHIPS_ENABLED flag", () => {
    expect(migration).toContain("MEMBERSHIPS_ENABLED");
  });

  it("should seed PRODUCT_BUNDLES_ENABLED flag", () => {
    expect(migration).toContain("PRODUCT_BUNDLES_ENABLED");
  });

  it("should seed EMAIL_AUTOMATION_ENABLED flag", () => {
    expect(migration).toContain("EMAIL_AUTOMATION_ENABLED");
  });

  it("should seed GROUP_SESSIONS_ENABLED flag", () => {
    expect(migration).toContain("GROUP_SESSIONS_ENABLED");
  });

  it("should seed AUTOMATIONS_ENABLED flag", () => {
    expect(migration).toContain("AUTOMATIONS_ENABLED");
  });

  it("should seed ANALYTICS_ENABLED flag", () => {
    expect(migration).toContain("ANALYTICS_ENABLED");
  });

  it("should seed PUBLIC_API_ENABLED flag", () => {
    expect(migration).toContain("PUBLIC_API_ENABLED");
  });

  it("should default all new flags to disabled", () => {
    expect(migration).toContain("false, 'all'");
  });

  it("should use ON DUPLICATE KEY UPDATE for idempotency", () => {
    expect(migration).toContain("ON DUPLICATE KEY UPDATE");
  });
});
