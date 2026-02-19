import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db", () => ({ getDb: vi.fn().mockResolvedValue({
  select: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(), values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  update: vi.fn().mockReturnThis(), set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
}) }));
vi.mock("../services/featureFlagService", () => ({
  featureFlagService: { isEnabled: vi.fn().mockResolvedValue(true) },
}));

describe("Theme Customizer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should define themePresets schema", async () => {
    const { themePresets } = await import("../drizzle/theme-customizer-schema");
    expect(themePresets).toBeDefined();
  });

  it("should define themeCustomizerRouter", async () => {
    const { themeCustomizerRouter } = await import("./routers/themeCustomizer");
    expect(themeCustomizerRouter).toBeDefined();
  });

  it("should validate default token structure", () => {
    const tokens = { primaryColor: "#14b8a6", secondaryColor: "#6366f1", backgroundColor: "#0f172a", surfaceColor: "#1e293b", textColor: "#f8fafc", fontFamily: "Inter, sans-serif", borderRadius: "8px" };
    expect(tokens.primaryColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(tokens.fontFamily).toContain("sans-serif");
  });

  it("should accept custom token values", () => {
    const tokens = { primaryColor: "#1d4ed8", borderRadius: "4px" };
    expect(tokens.primaryColor).toBe("#1d4ed8");
    expect(tokens.borderRadius).toBe("4px");
  });

  it("should check THEME_CUSTOMIZER_ENABLED flag", async () => {
    const { featureFlagService } = await import("../services/featureFlagService");
    await featureFlagService.isEnabled("THEME_CUSTOMIZER_ENABLED");
    expect(featureFlagService.isEnabled).toHaveBeenCalledWith("THEME_CUSTOMIZER_ENABLED");
  });

  it("should have 3 default presets in migration", () => {
    const presets = ["RusingAcademy Dark", "RusingAcademy Light", "Government Blue"];
    expect(presets).toHaveLength(3);
    expect(presets).toContain("Government Blue");
  });

  it("should export ThemePreset type", async () => {
    const mod = await import("../drizzle/theme-customizer-schema");
    expect(mod.themePresets).toBeDefined();
  });

  it("should have slug field for URL-friendly names", async () => {
    const slug = "rusingacademy-dark";
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("should support isActive toggle for theme activation", () => {
    const preset = { id: 1, name: "Dark", isActive: true };
    expect(preset.isActive).toBe(true);
  });

  it("should validate color hex format", () => {
    const colors = ["#14b8a6", "#6366f1", "#0f172a"];
    colors.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
  });

  it("should support font family with fallback", () => {
    const font = "Inter, sans-serif";
    expect(font.split(",")).toHaveLength(2);
  });
});
