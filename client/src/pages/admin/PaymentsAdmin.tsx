import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DollarSign, CreditCard, TrendingUp, ArrowUpRight, RefreshCw, Search, Download, Users, Receipt } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function PaymentsAdmin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  const { data: overviewData, isLoading: overviewLoading, refetch } = trpc.kajabiPaymentsOverview.getOverview.useQuery();
  const { data: txData, isLoading: txLoading } = trpc.kajabiPaymentsOverview.getRecentTransactions.useQuery();

  const kpi = overviewData ?? { totalRevenue: 0, invoiceCount: 0, subscriptionCount: 0, enrollmentCount: 0 };
  const transactions = (txData as any)?.items ?? [];

  // Also try existing stripe KPI if available
  const { data: stripeKpi } = (trpc as any).stripeKPI?.getOverview?.useQuery?.() ?? { data: null };
  const mrr = (stripeKpi as any)?.mrr ?? 0;
  const arr = (stripeKpi as any)?.arr ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Payments</h1><p className="text-sm text-muted-foreground">Revenue overview, transactions, and subscription management.</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Export coming soon")}><Download className="h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><p className="text-xs font-medium text-muted-foreground uppercase">MRR</p><p className="text-2xl font-bold mt-1">${(mrr / 100).toLocaleString()}</p><div className="flex items-center gap-1 mt-1"><ArrowUpRight className="h-3 w-3 text-green-600" /><span className="text-xs text-green-600">Monthly Recurring</span></div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><p className="text-xs font-medium text-muted-foreground uppercase">ARR</p><p className="text-2xl font-bold mt-1">${(arr / 100).toLocaleString()}</p><div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-blue-600" /><span className="text-xs text-blue-600">Annual Recurring</span></div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-500"><CardContent className="p-4"><p className="text-xs font-medium text-muted-foreground uppercase">Total Revenue</p><p className="text-2xl font-bold mt-1">${(kpi.totalRevenue / 100).toLocaleString()}</p><div className="flex items-center gap-1 mt-1"><DollarSign className="h-3 w-3 text-purple-600" /><span className="text-xs text-purple-600">All time</span></div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="p-4"><p className="text-xs font-medium text-muted-foreground uppercase">Active Subs</p><p className="text-2xl font-bold mt-1">{kpi.subscriptionCount}</p><div className="flex items-center gap-1 mt-1"><Users className="h-3 w-3 text-amber-600" /><span className="text-xs text-amber-600">Paying customers</span></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Invoices</p><p className="text-lg font-bold">{kpi.invoiceCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Enrollments</p><p className="text-lg font-bold">{kpi.enrollmentCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Churn Rate</p><p className="text-lg font-bold">{((stripeKpi as any)?.churnRate ?? 0).toFixed(1)}%</p></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Transactions</TabsTrigger><TabsTrigger value="subscriptions">Subscriptions</TabsTrigger><TabsTrigger value="one-time">One-Time Purchases</TabsTrigger></TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          {txLoading || overviewLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : transactions.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions yet" description="Transactions will appear here once customers make purchases." />
          ) : (
            <div className="space-y-2">{transactions.filter((tx: any) => !search || (tx.description || "").toLowerCase().includes(search.toLowerCase())).map((tx: any, idx: number) => (
              <Card key={tx.id || idx}><CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{tx.description || tx.type || "Payment"}</p><p className="text-xs text-muted-foreground">{tx.customerEmail || tx.email || ""} • {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ""}</p></div></div>
                <div className="text-right"><p className="text-sm font-bold">${((tx.amount || 0) / 100).toFixed(2)}</p><Badge variant={tx.status === "succeeded" ? "default" : "secondary"} className="text-[10px]">{tx.status || "pending"}</Badge></div>
              </CardContent></Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="subscriptions" className="mt-4">
          <EmptyState icon={RefreshCw} title="Subscription Management" description="Active subscriptions will appear here. Connect Stripe for full subscription lifecycle management." />
        </TabsContent>
        <TabsContent value="one-time" className="mt-4">
          <EmptyState icon={DollarSign} title="One-Time Purchases" description="Track coaching plan purchases, course purchases, and other one-time payments." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
