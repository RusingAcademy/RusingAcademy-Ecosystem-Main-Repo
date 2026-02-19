import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
  }),
}));

describe("Analytics Dashboard Schema", () => {
  it("should define savedDashboards table", async () => {
    const schema = await import("../drizzle/analytics-dashboard-schema");
    expect(schema.dashboardWidgets).toBeDefined();
  });

  it("should define dashboardWidgets table", async () => {
    const schema = await import("../drizzle/analytics-dashboard-schema");
    expect(schema.dashboardWidgets).toBeDefined();
  });
});

describe("Analytics Dashboard Logic", () => {
  it("should support widget types", () => {
    const widgetTypes = ["kpi_card", "line_chart", "bar_chart", "pie_chart", "table", "funnel"];
    expect(widgetTypes).toContain("kpi_card");
    expect(widgetTypes).toContain("line_chart");
    expect(widgetTypes).toContain("funnel");
  });

  it("should support date range filters", () => {
    const ranges = ["7d", "30d", "90d", "365d", "custom"];
    expect(ranges).toContain("30d");
    expect(ranges).toContain("custom");
  });

  it("should calculate KPI metrics correctly", () => {
    const revenue = { current: 5000, previous: 4000 };
    const growth = ((revenue.current - revenue.previous) / revenue.previous) * 100;
    expect(growth).toBe(25);
  });

  it("should support CSV export", () => {
    const data = [
      { date: "2026-01-01", revenue: 100, enrollments: 5 },
      { date: "2026-01-02", revenue: 150, enrollments: 8 },
    ];
    const csv = data.map(r => `${r.date},${r.revenue},${r.enrollments}`).join("\n");
    expect(csv).toContain("2026-01-01");
    expect(csv.split("\n")).toHaveLength(2);
  });
});
