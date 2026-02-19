/**
 * Phase 5: HR Budget Forecasting Service
 * Provides budget planning, forecasting, and variance analysis
 */
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export interface BudgetForecast {
  id: number;
  year: number;
  quarter: number | null;
  departmentId: number | null;
  category: string;
  plannedAmount: number;
  actualAmount: number | null;
  varianceAmount: number | null;
  notes: string | null;
  createdBy: number;
  createdAt: Date;
}

export interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
  totalVariance: number;
  variancePercent: number;
  byCategory: Array<{
    category: string;
    planned: number;
    actual: number;
    variance: number;
  }>;
  byQuarter: Array<{
    quarter: number;
    planned: number;
    actual: number;
    variance: number;
  }>;
}

const BUDGET_CATEGORIES = [
  "language_training",
  "coaching_sessions",
  "technology",
  "content_development",
  "assessment_tools",
  "travel",
  "professional_development",
  "marketing",
  "operations",
  "other",
] as const;

/**
 * Create a budget forecast entry
 */
export async function createForecast(data: {
  year: number;
  quarter?: number;
  departmentId?: number;
  category: string;
  plannedAmount: number;
  notes?: string;
  createdBy: number;
}): Promise<BudgetForecast> {
  const db = await getDb();
  const result = await db.insert(schema.hrBudgetForecasts).values({
    year: data.year,
    quarter: data.quarter || null,
    departmentId: data.departmentId || null,
    category: data.category,
    plannedAmount: String(data.plannedAmount),
    notes: data.notes || null,
    createdBy: data.createdBy,
  });

  const insertId = Number((result as any)[0]?.insertId || (result as any).insertId);
  
  return {
    id: insertId,
    year: data.year,
    quarter: data.quarter || null,
    departmentId: data.departmentId || null,
    category: data.category,
    plannedAmount: data.plannedAmount,
    actualAmount: null,
    varianceAmount: null,
    notes: data.notes || null,
    createdBy: data.createdBy,
    createdAt: new Date(),
  };
}

/**
 * Update actual amount and calculate variance
 */
export async function updateActual(
  forecastId: number,
  actualAmount: number
): Promise<void> {
  const db = await getDb();
  
  // Get the planned amount first
  const forecast = await db
    .select({ plannedAmount: schema.hrBudgetForecasts.plannedAmount })
    .from(schema.hrBudgetForecasts)
    .where(eq(schema.hrBudgetForecasts.id, forecastId))
    .limit(1);

  if (forecast.length === 0) throw new Error("Forecast not found");

  const planned = Number(forecast[0].plannedAmount);
  const variance = actualAmount - planned;

  await db
    .update(schema.hrBudgetForecasts)
    .set({
      actualAmount: String(actualAmount),
      varianceAmount: String(variance),
    })
    .where(eq(schema.hrBudgetForecasts.id, forecastId));
}

/**
 * Get budget summary for a year
 */
export async function getBudgetSummary(
  year: number,
  departmentId?: number
): Promise<BudgetSummary> {
  const db = await getDb();

  const conditions = [eq(schema.hrBudgetForecasts.year, year)];
  if (departmentId) {
    conditions.push(eq(schema.hrBudgetForecasts.departmentId, departmentId));
  }

  const forecasts = await db
    .select()
    .from(schema.hrBudgetForecasts)
    .where(and(...conditions));

  let totalPlanned = 0;
  let totalActual = 0;
  const categoryMap = new Map<string, { planned: number; actual: number }>();
  const quarterMap = new Map<number, { planned: number; actual: number }>();

  for (const f of forecasts) {
    const planned = Number(f.plannedAmount || 0);
    const actual = Number(f.actualAmount || 0);
    totalPlanned += planned;
    totalActual += actual;

    // By category
    const cat = categoryMap.get(f.category) || { planned: 0, actual: 0 };
    cat.planned += planned;
    cat.actual += actual;
    categoryMap.set(f.category, cat);

    // By quarter
    if (f.quarter) {
      const q = quarterMap.get(f.quarter) || { planned: 0, actual: 0 };
      q.planned += planned;
      q.actual += actual;
      quarterMap.set(f.quarter, q);
    }
  }

  const totalVariance = totalActual - totalPlanned;

  return {
    totalPlanned,
    totalActual,
    totalVariance,
    variancePercent: totalPlanned > 0 ? (totalVariance / totalPlanned) * 100 : 0,
    byCategory: Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      planned: data.planned,
      actual: data.actual,
      variance: data.actual - data.planned,
    })),
    byQuarter: Array.from(quarterMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([quarter, data]) => ({
        quarter,
        planned: data.planned,
        actual: data.actual,
        variance: data.actual - data.planned,
      })),
  };
}

/**
 * Get available budget categories
 */
export function getBudgetCategories(): string[] {
  return [...BUDGET_CATEGORIES];
}

/**
 * Generate a simple forecast projection based on historical data
 */
export async function generateProjection(
  year: number,
  departmentId?: number
): Promise<Array<{ category: string; projected: number; confidence: number }>> {
  const db = await getDb();

  // Get last 2 years of data for projection
  const previousYears = [year - 1, year - 2];
  const projections: Array<{ category: string; projected: number; confidence: number }> = [];

  for (const category of BUDGET_CATEGORIES) {
    const conditions = [eq(schema.hrBudgetForecasts.category, category)];
    if (departmentId) {
      conditions.push(eq(schema.hrBudgetForecasts.departmentId, departmentId));
    }

    const historicalData = await db
      .select({
        year: schema.hrBudgetForecasts.year,
        total: sql<number>`COALESCE(SUM(CAST(${schema.hrBudgetForecasts.actualAmount} AS DECIMAL(12,2))), SUM(CAST(${schema.hrBudgetForecasts.plannedAmount} AS DECIMAL(12,2))))`,
      })
      .from(schema.hrBudgetForecasts)
      .where(and(...conditions))
      .groupBy(schema.hrBudgetForecasts.year);

    if (historicalData.length === 0) {
      projections.push({ category, projected: 0, confidence: 0 });
      continue;
    }

    // Simple linear projection
    const amounts = historicalData.map((d) => Number(d.total || 0));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const growth = amounts.length > 1
      ? (amounts[amounts.length - 1] - amounts[0]) / amounts[0]
      : 0;

    projections.push({
      category,
      projected: Math.round(avg * (1 + growth) * 100) / 100,
      confidence: Math.min(amounts.length * 30, 90), // More data = higher confidence
    });
  }

  return projections;
}
