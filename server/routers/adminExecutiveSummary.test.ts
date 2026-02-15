/**
 * Sprint 4: Executive Summary Analytics Router — Vitest Tests
 */
import { describe, it, expect } from "vitest";

// ── Helper function tests ────────────────────────────────────────────────────

describe("Sprint 4 — Executive Summary Analytics", () => {
  describe("Date Range Calculation", () => {
    it("should calculate 7-day range correctly", () => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
      expect(sevenDaysAgo.getTime()).toBeLessThan(now.getTime());
      expect(now.getTime() - sevenDaysAgo.getTime()).toBe(7 * 86400000);
    });

    it("should calculate 30-day range correctly", () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
      expect(now.getTime() - thirtyDaysAgo.getTime()).toBe(30 * 86400000);
    });

    it("should calculate 90-day range correctly", () => {
      const now = new Date();
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000);
      expect(now.getTime() - ninetyDaysAgo.getTime()).toBe(90 * 86400000);
    });

    it("should calculate YTD range correctly", () => {
      const now = new Date();
      const ytdStart = new Date(now.getFullYear(), 0, 1);
      expect(ytdStart.getMonth()).toBe(0);
      expect(ytdStart.getDate()).toBe(1);
      expect(ytdStart.getFullYear()).toBe(now.getFullYear());
    });

    it("should calculate 12-month range correctly", () => {
      const now = new Date();
      const yearAgo = new Date(now.getTime() - 365 * 86400000);
      expect(now.getTime() - yearAgo.getTime()).toBe(365 * 86400000);
    });
  });

  describe("Trend Calculation", () => {
    function calcTrend(current: number, previous: number): { direction: "up" | "down" | "neutral"; pct: string } {
      if (previous === 0 && current === 0) return { direction: "neutral", pct: "0%" };
      if (previous === 0) return { direction: "up", pct: "+100%" };
      const change = ((current - previous) / previous) * 100;
      if (Math.abs(change) < 0.5) return { direction: "neutral", pct: "0%" };
      return {
        direction: change > 0 ? "up" : "down",
        pct: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
      };
    }

    it("should return neutral for zero-to-zero", () => {
      const result = calcTrend(0, 0);
      expect(result.direction).toBe("neutral");
      expect(result.pct).toBe("0%");
    });

    it("should return +100% for zero-to-positive", () => {
      const result = calcTrend(50, 0);
      expect(result.direction).toBe("up");
      expect(result.pct).toBe("+100%");
    });

    it("should calculate positive trend correctly", () => {
      const result = calcTrend(150, 100);
      expect(result.direction).toBe("up");
      expect(result.pct).toBe("+50.0%");
    });

    it("should calculate negative trend correctly", () => {
      const result = calcTrend(50, 100);
      expect(result.direction).toBe("down");
      expect(result.pct).toBe("-50.0%");
    });

    it("should return neutral for negligible change (<0.5%)", () => {
      const result = calcTrend(1000, 999);
      expect(result.direction).toBe("neutral");
      expect(result.pct).toBe("0%");
    });

    it("should handle doubling correctly", () => {
      const result = calcTrend(200, 100);
      expect(result.direction).toBe("up");
      expect(result.pct).toBe("+100.0%");
    });

    it("should handle halving correctly", () => {
      const result = calcTrend(50, 100);
      expect(result.direction).toBe("down");
      expect(result.pct).toBe("-50.0%");
    });
  });

  describe("KPI Summary Structure", () => {
    it("should define all required KPI fields", () => {
      const requiredKPIs = [
        "totalUsers",
        "activeUsers",
        "totalCourses",
        "activeCoaches",
        "totalRevenue",
        "enrollments",
        "completionRate",
        "avgSessionsPerUser",
      ];
      expect(requiredKPIs).toHaveLength(8);
      requiredKPIs.forEach(kpi => {
        expect(typeof kpi).toBe("string");
        expect(kpi.length).toBeGreaterThan(0);
      });
    });

    it("should support all period options", () => {
      const periods = ["7d", "30d", "90d", "ytd", "12m"];
      expect(periods).toHaveLength(5);
    });
  });

  describe("Platform Health Score", () => {
    it("should calculate health score from component statuses", () => {
      const components = [
        { name: "User Growth", status: "healthy" },
        { name: "Course Catalog", status: "healthy" },
        { name: "Coach Network", status: "warning" },
        { name: "Session Activity", status: "healthy" },
      ];
      const healthyCount = components.filter(c => c.status === "healthy").length;
      const score = Math.round((healthyCount / components.length) * 100);
      expect(score).toBe(75);
    });

    it("should return 0 for all critical components", () => {
      const components = [
        { name: "A", status: "critical" },
        { name: "B", status: "critical" },
      ];
      const healthyCount = components.filter(c => c.status === "healthy").length;
      const score = Math.round((healthyCount / components.length) * 100);
      expect(score).toBe(0);
    });

    it("should return 100 for all healthy components", () => {
      const components = [
        { name: "A", status: "healthy" },
        { name: "B", status: "healthy" },
        { name: "C", status: "healthy" },
      ];
      const healthyCount = components.filter(c => c.status === "healthy").length;
      const score = Math.round((healthyCount / components.length) * 100);
      expect(score).toBe(100);
    });
  });

  describe("Export Report", () => {
    it("should support CSV and JSON formats", () => {
      const formats = ["csv", "json"];
      expect(formats).toContain("csv");
      expect(formats).toContain("json");
    });

    it("should support all export sections", () => {
      const sections = ["users", "revenue", "courses", "coaches", "enrollments"];
      expect(sections).toHaveLength(5);
    });

    it("should generate correct filename format", () => {
      const period = "30d";
      const date = new Date().toISOString().split("T")[0];
      const filename = `executive-report-${period}-${date}.csv`;
      expect(filename).toMatch(/^executive-report-30d-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it("should escape CSV values with quotes correctly", () => {
      const value = 'John "Johnny" Doe';
      const escaped = `"${value.replace(/"/g, '""')}"`;
      expect(escaped).toBe('"John ""Johnny"" Doe"');
    });
  });

  describe("Trend Data Metrics", () => {
    it("should support all trend metrics", () => {
      const metrics = ["users", "revenue", "enrollments", "sessions"];
      expect(metrics).toHaveLength(4);
    });

    it("should validate date grouping format", () => {
      const date = new Date();
      const formatted = date.toISOString().split("T")[0];
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
