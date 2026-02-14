import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, BarChart3, TrendingUp, Users, DollarSign, BookOpen, Calendar, FileText, Printer, Activity } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function ReportsAdmin() {
  const [period, setPeriod] = useState("30d");

  const { data: revenue } = trpc.kajabiReports.getRevenueReport.useQuery();
  const { data: enrollment } = trpc.kajabiReports.getEnrollmentReport.useQuery();
  const { data: engagement } = trpc.kajabiReports.getEngagementReport.useQuery();

  const reportTypes = [
    { name: "Revenue Report", icon: DollarSign, desc: "MRR, ARR, churn, LTV breakdown", color: "#22c55e" },
    { name: "User Growth", icon: Users, desc: "Signups, activations, retention", color: "#3b82f6" },
    { name: "Course Performance", icon: BookOpen, desc: "Enrollments, completions, ratings", color: "#a855f7" },
    { name: "Marketing Funnel", icon: TrendingUp, desc: "Conversion rates by channel", color: "#f59e0b" },
    { name: "Coaching Analytics", icon: Calendar, desc: "Sessions, satisfaction, utilization", color: "#ef4444" },
    { name: "Content Engagement", icon: FileText, desc: "Views, time-on-page, downloads", color: "#06b6d4" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Reports</h1><p className="text-sm text-muted-foreground">Generate detailed reports across all areas of your ecosystem.</p></div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="90d">Last 90 days</SelectItem><SelectItem value="1y">Last year</SelectItem><SelectItem value="all">All time</SelectItem></SelectContent></Select>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Export coming soon")}><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Live KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-green-700">${(revenue?.totalRevenue ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-blue-700">${(revenue?.mrr ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">MRR</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-purple-700">{enrollment?.totalEnrollments ?? 0}</p><p className="text-xs text-muted-foreground">Total Enrollments</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-amber-700">{engagement?.dailyActiveUsers ?? 0}</p><p className="text-xs text-muted-foreground">Daily Active Users</p></CardContent></Card>
      </div>

      {/* Revenue Detail */}
      <Card><CardContent className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-600" /> Revenue Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><p className="text-xl font-bold text-green-700">${(revenue?.totalRevenue ?? 0).toLocaleString()}</p><p className="text-xs text-green-600">Total Revenue</p></div>
          <div className="p-3 bg-blue-50 rounded-lg"><p className="text-xl font-bold text-blue-700">${(revenue?.mrr ?? 0).toLocaleString()}</p><p className="text-xs text-blue-600">MRR</p></div>
          <div className="p-3 bg-purple-50 rounded-lg"><p className="text-xl font-bold text-purple-700">${(revenue?.arr ?? 0).toLocaleString()}</p><p className="text-xs text-purple-600">ARR</p></div>
          <div className="p-3 bg-amber-50 rounded-lg"><p className="text-xl font-bold text-amber-700">${(revenue?.ltv ?? 0).toFixed(0)}</p><p className="text-xs text-amber-600">Avg LTV</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-2 border rounded"><p className="text-lg font-semibold">{revenue?.totalTransactions ?? 0}</p><p className="text-xs text-muted-foreground">Transactions</p></div>
          <div className="text-center p-2 border rounded"><p className="text-lg font-semibold">{revenue?.refundCount ?? 0}</p><p className="text-xs text-muted-foreground">Refunds</p></div>
          <div className="text-center p-2 border rounded"><p className="text-lg font-semibold">${(revenue?.refundAmount ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Refund Amount</p></div>
        </div>
      </CardContent></Card>

      {/* Enrollment Detail */}
      <Card><CardContent className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600" /> Enrollment Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg"><p className="text-xl font-bold text-blue-700">{enrollment?.totalEnrollments ?? 0}</p><p className="text-xs text-blue-600">Total Enrollments</p></div>
          <div className="p-3 bg-green-50 rounded-lg"><p className="text-xl font-bold text-green-700">{enrollment?.activeStudents ?? 0}</p><p className="text-xs text-green-600">Active Students</p></div>
          <div className="p-3 bg-purple-50 rounded-lg"><p className="text-xl font-bold text-purple-700">{enrollment?.completionRate ?? 0}%</p><p className="text-xs text-purple-600">Completion Rate</p></div>
          <div className="p-3 bg-amber-50 rounded-lg"><p className="text-xl font-bold text-amber-700">{enrollment?.newThisMonth ?? 0}</p><p className="text-xs text-amber-600">New This Month</p></div>
        </div>
      </CardContent></Card>

      {/* Engagement Detail */}
      <Card><CardContent className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-purple-600" /> Engagement Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg"><p className="text-xl font-bold text-purple-700">{engagement?.dailyActiveUsers ?? 0}</p><p className="text-xs text-purple-600">DAU</p></div>
          <div className="p-3 bg-blue-50 rounded-lg"><p className="text-xl font-bold text-blue-700">{engagement?.weeklyActiveUsers ?? 0}</p><p className="text-xs text-blue-600">WAU</p></div>
          <div className="p-3 bg-green-50 rounded-lg"><p className="text-xl font-bold text-green-700">{engagement?.avgSessionMinutes ?? 0}m</p><p className="text-xs text-green-600">Avg Session</p></div>
          <div className="p-3 bg-amber-50 rounded-lg"><p className="text-xl font-bold text-amber-700">{engagement?.totalPageViews ?? 0}</p><p className="text-xs text-amber-600">Page Views</p></div>
        </div>
      </CardContent></Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(report => (
          <Card key={report.name} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast(`${report.name} detailed view coming soon`)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${report.color}15` }}><report.icon className="h-5 w-5" style={{ color: report.color }} /></div>
                <div><p className="font-medium text-sm">{report.name}</p><p className="text-xs text-muted-foreground">{report.desc}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">Live data</Badge>
                <Button variant="ghost" size="sm" className="text-xs gap-1"><Printer className="h-3 w-3" /> Generate</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card><CardHeader><CardTitle className="text-base">Scheduled Reports</CardTitle></CardHeader><CardContent>
        <EmptyState icon={Calendar} title="No scheduled reports" description="Set up automated reports to be generated and emailed on a regular schedule." actionLabel="Schedule Report" onAction={() => toast("Report scheduling coming soon")} />
      </CardContent></Card>
    </div>
  );
}
