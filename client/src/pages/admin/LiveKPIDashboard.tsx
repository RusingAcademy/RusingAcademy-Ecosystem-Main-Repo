import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  DollarSign, Users, TrendingUp, Activity, RefreshCw,
  ArrowUpRight, ArrowDownRight, BarChart3, Brain, Target,
  Zap, Clock, BookOpen,
} from "lucide-react";

function MetricCard({ icon: Icon, label, value, change, changeLabel, color }: {
  icon: any; label: string; value: string; change?: number; changeLabel?: string; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground">{changeLabel ?? "vs last period"}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${color}`}><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function LiveKPIDashboard() {
  const [period, setPeriod] = useState("7d");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: revenue, isLoading: revLoading, refetch: refetchRevenue } = trpc.liveKPI.getRevenueMetrics.useQuery({ period });
  const { data: engagement, isLoading: engLoading, refetch: refetchEngagement } = trpc.liveKPI.getEngagementMetrics.useQuery({ period });
  const { data: conversion, isLoading: convLoading, refetch: refetchConversion } = trpc.liveKPI.getConversionMetrics.useQuery({ period });

  const refreshAll = () => {
    refetchRevenue();
    refetchEngagement();
    refetchConversion();
    toast.success("Dashboard refreshed");
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refreshAll, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fmt = (n: number | undefined) => n !== undefined ? `$${n.toLocaleString()}` : "...";
  const num = (n: number | undefined) => n !== undefined ? n.toLocaleString() : "...";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" /> Live KPI Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time revenue, conversions, and AI engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={autoRefresh ? "default" : "outline"} size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            <Zap className={`h-4 w-4 mr-1.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Revenue
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={DollarSign} label="Total Revenue" value={fmt(revenue?.totalRevenue)} change={revenue?.revenueChange} color="bg-green-500/10 text-green-500" />
          <MetricCard icon={TrendingUp} label="MRR" value={fmt(revenue?.mrr)} change={revenue?.mrrChange} color="bg-blue-500/10 text-blue-500" />
          <MetricCard icon={Target} label="Avg Order Value" value={fmt(revenue?.avgOrderValue)} color="bg-purple-500/10 text-purple-500" />
          <MetricCard icon={BarChart3} label="Transactions" value={num(revenue?.transactionCount)} change={revenue?.transactionChange} color="bg-amber-500/10 text-amber-500" />
        </div>
      </div>

      {/* Engagement Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4" /> AI & Learning Engagement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Brain} label="AI Sessions" value={num(engagement?.aiSessions)} change={engagement?.aiSessionChange} color="bg-violet-500/10 text-violet-500" />
          <MetricCard icon={Users} label="Active Learners" value={num(engagement?.activeLearners)} change={engagement?.learnerChange} color="bg-cyan-500/10 text-cyan-500" />
          <MetricCard icon={Clock} label="Avg Session Duration" value={engagement?.avgSessionDuration ? `${Math.round(engagement.avgSessionDuration / 60)}m` : "..."} color="bg-orange-500/10 text-orange-500" />
          <MetricCard icon={BookOpen} label="Lessons Completed" value={num(engagement?.lessonsCompleted)} color="bg-emerald-500/10 text-emerald-500" />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5" /> Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {convLoading ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
            ) : (
              <>
                <ProgressBar label="Visitors → Signups" value={conversion?.signups ?? 0} max={conversion?.visitors ?? 1} color="bg-blue-500" />
                <ProgressBar label="Signups → Enrollments" value={conversion?.enrollments ?? 0} max={conversion?.signups ?? 1} color="bg-purple-500" />
                <ProgressBar label="Enrollments → Payments" value={conversion?.payments ?? 0} max={conversion?.enrollments ?? 1} color="bg-green-500" />
                <ProgressBar label="Payments → Completions" value={conversion?.completions ?? 0} max={conversion?.payments ?? 1} color="bg-emerald-500" />
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Conversion</span>
                    <Badge variant="outline">
                      {conversion?.visitors && conversion.visitors > 0
                        ? `${((conversion.payments ?? 0) / conversion.visitors * 100).toFixed(1)}%`
                        : "N/A"}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent>
            {revLoading ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
            ) : !revenue?.byProduct || (revenue.byProduct as any[]).length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No revenue data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Complete a test payment to see data here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(revenue.byProduct as any[]).map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.count} sales</p>
                    </div>
                    <p className="font-bold">${p.revenue?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" /> Live Activity
              {autoRefresh && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {engLoading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
          ) : !engagement?.recentActivity || (engagement.recentActivity as any[]).length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {(engagement.recentActivity as any[]).map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 transition-colors">
                  <div className={`h-2 w-2 rounded-full ${a.type === "payment" ? "bg-green-500" : a.type === "enrollment" ? "bg-blue-500" : a.type === "ai_session" ? "bg-violet-500" : "bg-gray-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{a.description}</p>
                    <p className="text-xs text-muted-foreground">{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</p>
                  </div>
                  {a.amount && <Badge variant="outline" className="shrink-0">${a.amount}</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
