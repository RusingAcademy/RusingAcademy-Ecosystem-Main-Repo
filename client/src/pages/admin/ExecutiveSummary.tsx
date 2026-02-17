/**
 * Sprint 4: Executive Summary Dashboard
 * 
 * LRDG-grade executive overview that aggregates all platform KPIs
 * into a single, high-contrast, institutional-quality dashboard.
 * Period-over-period comparisons, trend sparklines, platform health,
 * and CSV/JSON export.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Users, BookOpen, DollarSign, GraduationCap, TrendingUp, TrendingDown,
  Minus, Activity, Download, RefreshCw, Shield, AlertTriangle,
  CheckCircle2, Heart, BarChart3, ArrowUpRight, ArrowDownRight,
  UserPlus, Award, Calendar, FileText,
} from "lucide-react";
import AdminSectionShell from "@/components/AdminSectionShell";

type Period = "7d" | "30d" | "90d" | "ytd" | "12m";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  "ytd": "Year to Date",
  "12m": "Last 12 Months",
};

// ── Trend Indicator Component ────────────────────────────────────────────────
function TrendIndicator({ direction, pct }: { direction: "up" | "down" | "neutral"; pct: string }) {
  if (direction === "neutral") {
    return (
      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> {pct}
      </span>
    );
  }
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${
      direction === "up" ? "text-emerald-600" : "text-red-600"
    }`}>
      {direction === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {pct}
    </span>
  );
}

// ── KPI Card Component ───────────────────────────────────────────────────────
function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  iconColor,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { direction: "up" | "down" | "neutral"; pct: string };
  iconColor?: string;
}) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconColor || "bg-[var(--brand-foundation)]/10 text-[var(--brand-foundation)]"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
          {trend && <TrendIndicator direction={trend.direction} pct={trend.pct} />}
        </div>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground/70 mt-2 pl-[52px]">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Health Score Ring ─────────────────────────────────────────────────────────
function HealthScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ExecutiveSummary() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: summary, isLoading: summaryLoading, refetch } = trpc.executiveSummary.getExecutiveSummary.useQuery({ period });
  const { data: health, isLoading: healthLoading } = trpc.executiveSummary.getPlatformHealth.useQuery();

  const handleExport = async (format: "csv" | "json") => {
    try {
      const result = await trpc.useUtils().client.executiveSummary.exportReport.query({
        format,
        period,
        sections: ["users", "revenue", "courses", "coaches", "enrollments"],
      });
      // Create downloadable blob
      const blob = new Blob([result.data], { type: format === "csv" ? "text/csv" : "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to export report");
    }
  };

  const kpis = summary?.kpis;

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <AdminSectionShell
      title="Executive Summary"
      titleFr="Résumé exécutif"
      description="Comprehensive platform performance overview with period-over-period comparisons"
      icon={BarChart3}
      breadcrumb={["Analytics", "Executive Summary"]}
      accentBorder
      actions={
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => handleExport("csv")}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => handleExport("json")}>
            <FileText className="h-3.5 w-3.5" /> JSON
          </Button>
        </div>
      }
    >
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label="Total Users"
          value={kpis?.totalUsers?.value?.toLocaleString() ?? "0"}
          subtitle={`+${kpis?.totalUsers?.newThisPeriod ?? 0} new this period`}
          trend={kpis?.totalUsers?.trend}
          iconColor="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KPICard
          icon={Activity}
          label="Active Users"
          value={kpis?.activeUsers?.value?.toLocaleString() ?? "0"}
          trend={kpis?.activeUsers?.trend}
          iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <KPICard
          icon={DollarSign}
          label="Revenue"
          value={`$${((kpis?.totalRevenue?.value ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trend={kpis?.totalRevenue?.trend}
          iconColor="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <KPICard
          icon={GraduationCap}
          label="Enrollments"
          value={kpis?.enrollments?.value?.toLocaleString() ?? "0"}
          trend={kpis?.enrollments?.trend}
          iconColor="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <KPICard
          icon={BookOpen}
          label="Total Courses"
          value={kpis?.totalCourses?.value ?? 0}
          subtitle={`${kpis?.totalCourses?.published ?? 0} published`}
          iconColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <KPICard
          icon={UserPlus}
          label="Active Coaches"
          value={kpis?.activeCoaches?.value ?? 0}
          iconColor="bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
        />
        <KPICard
          icon={Award}
          label="Completion Rate"
          value={`${kpis?.completionRate?.value ?? 0}%`}
          iconColor="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
        <KPICard
          icon={Calendar}
          label="Avg Sessions/User"
          value={kpis?.avgSessionsPerUser?.value ?? 0}
          iconColor="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      <Separator className="my-6" />

      {/* Platform Health + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Health */}
        <Card className="lg:col-span-1 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--brand-foundation)]" />
              Platform Health
            </CardTitle>
            <CardDescription className="text-xs">Real-time system health assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <HealthScoreRing score={health?.score ?? 0} />
                <div className="w-full space-y-2">
                  {health?.components?.map((comp, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{comp.name}</span>
                      <div className="flex items-center gap-1.5">
                        {comp.status === "healthy" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : comp.status === "warning" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span className={
                          comp.status === "healthy" ? "text-emerald-600" :
                          comp.status === "warning" ? "text-amber-600" : "text-red-600"
                        }>
                          {comp.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Period Summary */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--brand-foundation)]" />
              Period Summary — {PERIOD_LABELS[period]}
            </CardTitle>
            <CardDescription className="text-xs">Key metrics comparison with previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "New Users", value: kpis?.totalUsers?.newThisPeriod ?? 0, trend: kpis?.totalUsers?.trend, icon: UserPlus },
                { label: "Active Users", value: kpis?.activeUsers?.value ?? 0, trend: kpis?.activeUsers?.trend, icon: Activity },
                { label: "Revenue", value: `$${((kpis?.totalRevenue?.value ?? 0) / 100).toFixed(2)}`, trend: kpis?.totalRevenue?.trend, icon: DollarSign },
                { label: "Enrollments", value: kpis?.enrollments?.value ?? 0, trend: kpis?.enrollments?.trend, icon: GraduationCap },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  </div>
                  {item.trend && <TrendIndicator direction={item.trend.direction} pct={item.trend.pct} />}
                </div>
              ))}
            </div>

            {/* Report Generation Info */}
            <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-[10px] text-muted-foreground">
                Report generated at {summary?.generatedAt ? new Date(summary.generatedAt).toLocaleString() : "—"} •
                Use the export buttons above to download detailed data in CSV or JSON format for offline analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminSectionShell>
  );
}
