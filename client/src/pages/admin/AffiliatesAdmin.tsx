import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Handshake, Users, DollarSign, TrendingUp, Link2, Plus, Search, Copy, Eye } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function AffiliatesAdmin() {
  const [activeTab, setActiveTab] = useState("partners");
  const [search, setSearch] = useState("");

  // Use the existing affiliate router from premiumFeatures
  const { data: dashboardData, isLoading } = trpc.affiliate.getDashboard.useQuery();
  const { data: referralsData } = trpc.affiliate.getReferrals.useQuery();

  const dashboard = dashboardData as any;
  const referrals = (referralsData as any)?.items ?? [];

  const stats = {
    totalReferrals: dashboard?.stats?.totalReferrals ?? 0,
    conversions: dashboard?.stats?.conversions ?? 0,
    conversionRate: dashboard?.stats?.conversionRate ?? 0,
    totalEarnings: dashboard?.earnings?.total ?? 0,
    paidOut: dashboard?.earnings?.paidOut ?? 0,
    pending: dashboard?.earnings?.pending ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Affiliates</h1><p className="text-sm text-muted-foreground">Manage your affiliate program, partners, and commission tracking.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => toast("Invite affiliate coming soon")}><Plus className="h-4 w-4" /> Invite Affiliate</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-indigo-600" /><div><p className="text-xl font-bold">{stats.totalReferrals}</p><p className="text-xs text-muted-foreground">Total Referrals</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Link2 className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats.conversions}</p><p className="text-xs text-muted-foreground">Conversions</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">${((stats.totalEarnings || 0) / 100).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Earnings</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{stats.conversionRate.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Conversion Rate</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="partners">Partners</TabsTrigger><TabsTrigger value="referrals">Referrals</TabsTrigger><TabsTrigger value="commissions">Commissions</TabsTrigger><TabsTrigger value="settings">Program Settings</TabsTrigger></TabsList>
        <TabsContent value="partners" className="mt-4 space-y-4">
          <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search affiliates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
            <EmptyState icon={Handshake} title="Affiliate Partners" description="Start your affiliate program by inviting partners who can promote your products and earn commissions." actionLabel="Invite Affiliate" onAction={() => toast("Invite affiliate coming soon")} />
          )}
        </TabsContent>
        <TabsContent value="referrals" className="mt-4">
          {referrals.length === 0 ? (
            <EmptyState icon={Link2} title="Referral Tracking" description="Track all referral clicks, signups, and conversions from your affiliate partners." />
          ) : (
            <div className="space-y-2">{referrals.map((ref: any, idx: number) => (
              <Card key={ref.id || idx}><CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{ref.referredEmail || ref.name || "Referral"}</p><p className="text-xs text-muted-foreground">{ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : ""}</p></div>
                <Badge variant={ref.converted ? "default" : "secondary"}>{ref.converted ? "Converted" : "Pending"}</Badge>
              </CardContent></Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="commissions" className="mt-4">
          <EmptyState icon={DollarSign} title="Commission Ledger" description="View all commission calculations, pending payouts, and payment history." />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium">Affiliate Program Settings</h3>
            <div className="space-y-3">
              {dashboard?.tiers?.map((tier: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><p className="text-sm font-medium">{tier.name || `Tier ${idx + 1}`}</p><p className="text-xs text-muted-foreground">{tier.description || "Commission tier"}</p></div>
                  <Badge>{tier.rate || 20}%</Badge>
                </div>
              )) ?? (
                <>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><p className="text-sm font-medium">Default Commission Rate</p><p className="text-xs text-muted-foreground">Applied to all new affiliates</p></div><Badge>20%</Badge></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><p className="text-sm font-medium">Cookie Duration</p><p className="text-xs text-muted-foreground">How long referral tracking lasts</p></div><Badge>30 days</Badge></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><p className="text-sm font-medium">Minimum Payout</p><p className="text-xs text-muted-foreground">Minimum balance before payout</p></div><Badge>$50</Badge></div>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => toast("Program settings coming soon")}>Edit Settings</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
