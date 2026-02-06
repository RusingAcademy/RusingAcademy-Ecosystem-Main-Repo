import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp, TrendingDown, DollarSign, Users, BarChart3,
  Download, Loader2, Target, ArrowRight, Percent, UserMinus
} from "lucide-react";

type SalesTab = "funnel" | "ltv" | "churn" | "revenue" | "export";

export default function SalesAnalytics() {
  const [activeTab, setActiveTab] = useState<SalesTab>("funnel");

  const funnelQuery = trpc.salesAnalytics.getConversionFunnel.useQuery();
  const ltvQuery = trpc.salesAnalytics.getStudentLTV.useQuery();
  const churnQuery = trpc.salesAnalytics.getChurn.useQuery();
  const revenueQuery = trpc.salesAnalytics.getMonthlyRevenue.useQuery({ months: 12 });
  const exportQuery = trpc.salesAnalytics.getExportData.useQuery({ type: "all" }, { enabled: false });

  const handleExport = async (type: "enrollments" | "coaching" | "all") => {
    try {
      const result = await exportQuery.refetch();
      const data = result.data as any[];
      if (!data || data.length === 0) { toast.info("No data to export"); return; }
      const headers = Object.keys(data[0]);
      const csv = [headers.join(","), ...data.map(row => headers.map(h => `"${(row as any)[h] ?? ""}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `sales-export-${type}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch { toast.error("Export failed"); }
  };

  const renderFunnel = () => {
    const stages = funnelQuery.data?.stages || [];
    const maxCount = Math.max(...stages.map(s => s.count), 1);
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Conversion Funnel</CardTitle><CardDescription>Track how visitors progress through your sales pipeline.</CardDescription></CardHeader>
          <CardContent>
            {funnelQuery.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
            ) : (
              <div className="space-y-4">
                {stages.map((stage, i) => (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium">{stage.name}</span><Badge variant="outline" className="text-xs">{stage.count}</Badge></div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{stage.rate}%</span>
                        {i > 0 && stages[i - 1].count > 0 && <Badge variant={stage.count / stages[i - 1].count > 0.3 ? "default" : "secondary"} className="text-xs">{Math.round((stage.count / stages[i - 1].count) * 100)}% conv.</Badge>}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500 flex items-center px-3" style={{ width: `${Math.max(5, (stage.count / maxCount) * 100)}%`, backgroundColor: `oklch(0.65 0.15 ${220 + i * 30})` }}>
                        <span className="text-xs font-medium text-white">{stage.count}</span>
                      </div>
                    </div>
                    {i < stages.length - 1 && <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" /></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLTV = () => {
    const ltv = ltvQuery.data;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><DollarSign className="h-5 w-5 text-emerald-600" /><TrendingUp className="h-4 w-4 text-muted-foreground" /></div><p className="text-2xl font-bold">${ltv?.averageLTV ?? 0}</p><p className="text-sm text-muted-foreground">Average LTV</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><DollarSign className="h-5 w-5 text-blue-600" /><TrendingUp className="h-4 w-4 text-muted-foreground" /></div><p className="text-2xl font-bold">${ltv?.totalRevenue ?? 0}</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><Users className="h-5 w-5 text-violet-600" /><TrendingUp className="h-4 w-4 text-muted-foreground" /></div><p className="text-2xl font-bold">{ltv?.totalCustomers ?? 0}</p><p className="text-sm text-muted-foreground">Total Customers</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Student Lifetime Value</CardTitle><CardDescription>Understand the long-term value of each student across courses and coaching.</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">LTV is calculated from total enrollment revenue + coaching plan purchases divided by unique customers.</p></CardContent></Card>
      </div>
    );
  };

  const renderChurn = () => {
    const churn = churnQuery.data;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><Percent className="h-5 w-5 text-red-500" /><TrendingDown className="h-4 w-4 text-red-400" /></div><p className="text-2xl font-bold">{churn?.churnRate ?? 0}%</p><p className="text-sm text-muted-foreground">Churn Rate</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><Users className="h-5 w-5 text-emerald-600" /><TrendingUp className="h-4 w-4 text-emerald-400" /></div><p className="text-2xl font-bold">{churn?.activeStudents ?? 0}</p><p className="text-sm text-muted-foreground">Active Students</p></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><UserMinus className="h-5 w-5 text-amber-600" /><TrendingDown className="h-4 w-4 text-amber-400" /></div><p className="text-2xl font-bold">{churn?.inactiveStudents ?? 0}</p><p className="text-sm text-muted-foreground">Inactive Students</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Churn Analysis</CardTitle><CardDescription>Track student retention and identify at-risk learners.</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Churn rate is calculated as inactive enrollments divided by total enrollments. Lower is better. Target: below 15%.</p></CardContent></Card>
      </div>
    );
  };

  const renderRevenue = () => {
    const months = revenueQuery.data as any[] || [];
    const maxRevenue = Math.max(...months.map(m => Number(m.revenue || 0)), 1);
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle><CardDescription>Revenue trend over the last 12 months.</CardDescription></CardHeader>
          <CardContent>
            {revenueQuery.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
            ) : months.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet.</p>
            ) : (
              <div className="space-y-2">
                {months.map((m: any) => (
                  <div key={m.month} className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-muted-foreground font-mono">{m.month}</span>
                    <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                      <div className="bg-emerald-500/70 h-full rounded-full flex items-center px-2" style={{ width: `${Math.max(5, (Number(m.revenue) / maxRevenue) * 100)}%` }}>
                        <span className="text-xs font-medium text-white">${Number(m.revenue || 0).toFixed(0)}</span>
                      </div>
                    </div>
                    <span className="w-16 text-right text-muted-foreground">{m.transactions} txn</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderExport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Export Data</CardTitle><CardDescription>Download sales and enrollment data as CSV for external analysis.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport("enrollments")}><CardContent className="p-5 text-center"><Download className="h-8 w-8 mx-auto mb-3 text-blue-600" /><h3 className="font-semibold mb-1">Course Enrollments</h3><p className="text-xs text-muted-foreground">Student, course, status, amount, date</p></CardContent></Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport("coaching")}><CardContent className="p-5 text-center"><Download className="h-8 w-8 mx-auto mb-3 text-violet-600" /><h3 className="font-semibold mb-1">Coaching Purchases</h3><p className="text-xs text-muted-foreground">Student, plan, status, amount, date</p></CardContent></Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport("all")}><CardContent className="p-5 text-center"><Download className="h-8 w-8 mx-auto mb-3 text-emerald-600" /><h3 className="font-semibold mb-1">All Transactions</h3><p className="text-xs text-muted-foreground">Complete export of all sales data</p></CardContent></Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabItems: { key: SalesTab; label: string; icon: any }[] = [
    { key: "funnel", label: "Conversion Funnel", icon: Target },
    { key: "ltv", label: "Student LTV", icon: DollarSign },
    { key: "churn", label: "Churn Analysis", icon: UserMinus },
    { key: "revenue", label: "Revenue", icon: BarChart3 },
    { key: "export", label: "Export", icon: Download },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1"><BarChart3 className="h-6 w-6 text-emerald-600" /><h1 className="text-2xl font-bold">Advanced Sales Analytics</h1></div>
        <p className="text-sm text-muted-foreground">Conversion funnel, student LTV, churn analysis, revenue trends, and data exports.</p>
      </div>
      <div className="flex gap-1 mb-6 border-b">
        {tabItems.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "funnel" && renderFunnel()}
      {activeTab === "ltv" && renderLTV()}
      {activeTab === "churn" && renderChurn()}
      {activeTab === "revenue" && renderRevenue()}
      {activeTab === "export" && renderExport()}
    </div>
  );
}
