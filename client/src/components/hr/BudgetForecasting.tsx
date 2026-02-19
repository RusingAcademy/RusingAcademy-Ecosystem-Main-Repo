/**
 * Phase 5: HR Budget Forecasting Component
 * Provides budget planning, variance analysis, and projections
 */
import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Plus } from "lucide-react";

export function BudgetForecasting() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: summary, isLoading } = trpc.budgetForecast.summary.useQuery({
    year: selectedYear,
  });
  const { data: categories } = trpc.budgetForecast.categories.useQuery();
  const { data: projections } = trpc.budgetForecast.projection.useQuery({
    year: selectedYear + 1,
  });

  const createMutation = trpc.budgetForecast.create.useMutation();

  const [formData, setFormData] = useState({
    category: "",
    quarter: "",
    plannedAmount: "",
    notes: "",
  });

  const handleCreate = async () => {
    if (!formData.category || !formData.plannedAmount) return;
    await createMutation.mutateAsync({
      year: selectedYear,
      quarter: formData.quarter ? parseInt(formData.quarter) : undefined,
      category: formData.category,
      plannedAmount: parseFloat(formData.plannedAmount),
      notes: formData.notes || undefined,
    });
    setFormData({ category: "", quarter: "", plannedAmount: "", notes: "" });
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Forecasting</h2>
        <div className="flex items-center gap-2">
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.totalPlanned?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.totalActual?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {(summary?.totalVariance || 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.totalVariance || 0) > 0 ? "text-red-500" : "text-green-500"}`}>
              ${Math.abs(summary?.totalVariance || 0).toLocaleString()}
              <span className="text-sm ml-1">
                ({summary?.variancePercent?.toFixed(1) || "0"}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Budget Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.quarter} onValueChange={(v) => setFormData({ ...formData, quarter: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Q1</SelectItem>
                  <SelectItem value="2">Q2</SelectItem>
                  <SelectItem value="3">Q3</SelectItem>
                  <SelectItem value="4">Q4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Planned Amount ($)"
                value={formData.plannedAmount}
                onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
              />
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* By Category */}
      {summary?.byCategory && summary.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.byCategory.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {cat.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span>
                      ${cat.actual.toLocaleString()} / ${cat.planned.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cat.actual > cat.planned ? "bg-red-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min((cat.actual / Math.max(cat.planned, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projections */}
      {projections && projections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projections {selectedYear + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projections
                .filter((p) => p.projected > 0)
                .map((p) => (
                  <div key={p.category} className="flex items-center justify-between py-1 border-b last:border-0">
                    <span className="text-sm">
                      {p.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${p.projected.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        ({p.confidence}% conf.)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
