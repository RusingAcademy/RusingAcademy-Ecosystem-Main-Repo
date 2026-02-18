import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Users, BookOpen, DollarSign, GraduationCap, TrendingUp, TrendingDown,
  Plus, UserPlus, Tag, Eye, ArrowRight, Activity,
  BarChart3, Calendar, Zap, Shield,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value, icon: Icon, subtitle, trend, trendLabel }: {
  title: string; value: string | number; icon: React.ElementType; subtitle?: string;
  trend?: number; trendLabel?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
                </span>
                {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniBarChart({ data, maxHeight = 40 }: { data: { label: string; value: number }[]; maxHeight?: number }) {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  return (
    <div className="flex items-end gap-1 h-[60px]">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
          <div
            className="w-full rounded-sm bg-primary/70 transition-all hover:bg-primary"
            style={{ height: `${Math.max((d.value / maxVal) * maxHeight, 2)}px` }}
            title={`${d.label}: $${(d.value / 100).toLocaleString()}`}
          />
          <span className="text-[9px] text-muted-foreground truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [, navigate] = useLocation();
  const { data: analytics, isLoading: analyticsLoading } = trpc.admin.getAnalytics.useQuery();
  const { data: orgStats, isLoading: orgLoading } = trpc.admin.getOrgStats.useQuery();
  const { data: recentActivity, isLoading: activityLoading } = trpc.admin.getRecentActivity.useQuery();

  const a = analytics as any ?? {};
  const o = orgStats as any ?? {};

  const totalUsers = a.totalUsers ?? 0;
  const totalLearners = a.totalLearners ?? o.totalLearners ?? 0;
  const activeCoaches = a.activeCoaches ?? 0;
  const pendingCoaches = a.pendingCoaches ?? 0;
  const sessionsThisMonth = a.sessionsThisMonth ?? 0;
  const revenue = a.revenue ?? 0;
  const platformCommission = a.platformCommission ?? 0;
  const sessionGrowth = a.sessionGrowth ?? 0;
  const revenueGrowth = a.revenueGrowth ?? 0;
  const monthlyRevenue = a.monthlyRevenue ?? [];
  const coachesWithStripe = a.coachesWithStripe ?? 0;
  const coachesWithoutStripe = a.coachesWithoutStripe ?? 0;
  const activeThisWeek = o.activeThisWeek ?? 0;
  const completions = o.completions ?? 0;

  const chartData = useMemo(() =>
    (monthlyRevenue as any[]).map((m: any) => ({
      label: m.month,
      value: Number(m.revenue) || 0,
    })),
    [monthlyRevenue]
  );

  const isLoading = analyticsLoading || orgLoading;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome back. Here's your ecosystem overview.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate("/admin/preview")}>
          <Eye className="h-4 w-4 mr-1.5" /> Preview as Student
        </Button>
      </div>

      {/* Quick Actions */}
      <Card className="border-0" style={{ background: "linear-gradient(135deg, var(--brand-foundation), var(--brand-foundation-dark, #1a365d))" }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white text-sm font-medium mr-2">Quick Actions:</span>
            {[
              { label: "Create Course", icon: Plus, path: "/admin/courses?action=create" },
              { label: "Invite User", icon: UserPlus, path: "/admin/users?action=invite" },
              { label: "Create Coupon", icon: Tag, path: "/admin/coupons?action=create" },
              { label: "View Analytics", icon: TrendingUp, path: "/admin/analytics" },
            ].map((qa) => (
              <Button key={qa.label} size="sm" variant="secondary" className="gap-1.5 text-xs h-8"
                onClick={() => navigate(qa.path)}>
                <qa.icon className="h-3.5 w-3.5" /> {qa.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards — Row 1 */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={totalUsers} icon={Users} subtitle={`${totalLearners} learners`} />
          <StatCard title="Active Coaches" value={activeCoaches} icon={GraduationCap}
            subtitle={pendingCoaches > 0 ? `${pendingCoaches} pending` : "All approved"} />
          <StatCard title="Sessions This Month" value={sessionsThisMonth} icon={Calendar}
            trend={sessionGrowth} trendLabel="vs last month" />
          <StatCard title="Revenue This Month" value={`$${(revenue / 100).toLocaleString()}`} icon={DollarSign}
            trend={revenueGrowth} trendLabel="vs last month" />
        </div>
      )}

      {/* Row 2: Revenue Chart + Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Revenue Trend (6 Months)
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/admin/sales-analytics")}>
                Full Report <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[60px] w-full" />
            ) : chartData.length > 0 ? (
              <div>
                <MiniBarChart data={chartData} />
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>Platform commission: <strong className="text-foreground">${(platformCommission / 100).toLocaleString()}</strong></span>
                  <span>Gross: <strong className="text-foreground">${(revenue / 100).toLocaleString()}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No revenue data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" /> Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active this week</span>
              <Badge variant="secondary">{activeThisWeek}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completions</span>
              <Badge variant="secondary">{completions}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Stripe Connected</span>
              <Badge variant={coachesWithoutStripe > 0 ? "destructive" : "default"}>
                {coachesWithStripe}/{coachesWithStripe + coachesWithoutStripe}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending Coaches</span>
              <Badge variant={pendingCoaches > 0 ? "outline" : "secondary"}>
                {pendingCoaches}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Recent Activity + Manage Ecosystem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/admin/activity")}>
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 6).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm truncate">{item.description || item.action || "Activity recorded"}</p>
                      <p className="text-xs text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
            )}
          </CardContent>
        </Card>

        {/* Manage Ecosystem */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Manage Your Ecosystem</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Courses", desc: "Create & manage", icon: BookOpen, path: "/admin/courses" },
                { label: "Users", desc: "Manage roles", icon: Users, path: "/admin/users" },
                { label: "Coaching", desc: "Coach profiles", icon: GraduationCap, path: "/admin/coaches" },
                { label: "Pricing", desc: "Plans & checkout", icon: DollarSign, path: "/admin/pricing" },
                { label: "Coupons", desc: "Discounts", icon: Tag, path: "/admin/coupons" },
                { label: "Analytics", desc: "Reports", icon: TrendingUp, path: "/admin/analytics" },
              ].map((link) => (
                <button key={link.label} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                  onClick={() => navigate(link.path)}>
                  <link.icon className="h-5 w-5 shrink-0 text-primary" />
                  <div><p className="text-sm font-medium">{link.label}</p><p className="text-xs text-muted-foreground">{link.desc}</p></div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
