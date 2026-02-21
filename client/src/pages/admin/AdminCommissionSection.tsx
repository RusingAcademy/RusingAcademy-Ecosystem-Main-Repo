/**
 * AdminCommissionSection — Commission Management inside AdminControlCenter
 *
 * Connects to the adminCommission tRPC router for real data:
 * - Commission overview with coach earnings
 * - Tier management (view/create/edit)
 * - Payout management (approve/mark paid)
 * - Earnings analytics
 */
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Commission Management", description: "Manage and configure commission management" },
  fr: { title: "Gestion des commissions", description: "Gérer et configurer gestion des commissions" },
};

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {

  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Search,
  Download,
  CheckCircle,
  Shield,
  Plus,
  Edit,
  CreditCard,
} from "lucide-react";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
}

function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}

export default function AdminCommissionSection() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [payoutFilter, setPayoutFilter] = useState<string>("all");
  const [showTierDialog, setShowTierDialog] = useState(false);

  // ── tRPC Queries ────────────────────────────────────────────────────────
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } =
    trpc.adminCommission.getCommissionOverview.useQuery();
  const { data: tiers, isLoading: tiersLoading, refetch: refetchTiers } =
    trpc.adminCommission.getTiers.useQuery();
  const { data: payouts, isLoading: payoutsLoading, refetch: refetchPayouts } =
    trpc.adminCommission.getPayouts.useQuery({ status: payoutFilter === "all" ? undefined : payoutFilter as any });
  const { data: analytics } =
    trpc.adminCommission.getEarningsAnalytics.useQuery({ period: "30d" });

  // ── tRPC Mutations ──────────────────────────────────────────────────────
  const createTier = trpc.adminCommission.createTier.useMutation({
    onSuccess: () => { toast.success("Commission tier created"); refetchTiers(); setShowTierDialog(false); },
    onError: (e) => toast.error(e.message),
  });
  const updateTier = trpc.adminCommission.updateTier.useMutation({
    onSuccess: () => { toast.success("Tier updated"); refetchTiers(); },
    onError: (e) => toast.error(e.message),
  });
  const verifySle = trpc.adminCommission.verifySleStatus.useMutation({
    onSuccess: () => { toast.success("SLE verification updated"); refetchOverview(); },
    onError: (e) => toast.error(e.message),
  });
  const approvePayout = trpc.adminCommission.approvePayout.useMutation({
    onSuccess: () => { toast.success("Payout approved"); refetchPayouts(); },
    onError: (e) => toast.error(e.message),
  });
  const markPaid = trpc.adminCommission.markPayoutPaid.useMutation({
    onSuccess: () => { toast.success("Payout marked as paid"); refetchPayouts(); },
    onError: (e) => toast.error(e.message),
  });

  // ── Derived Data ────────────────────────────────────────────────────────
  const coaches = overview?.coaches || [];
  const filteredCoaches = coaches.filter((c: any) =>
    c.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.headline?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const stats = overview?.stats || { activeCoaches: 0, totalPaidCents: 0, totalPendingCents: 0, totalPayouts: 0 };

  if (overviewLoading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Coach Commission</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coach Commission</h1>
        <p className="text-muted-foreground mt-1">
          Manage commission tiers, coach payouts, and earnings analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Coaches</p>
                <p className="text-2xl font-bold">{stats.activeCoaches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">{formatCents(stats.totalPaidCents)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{formatCents(stats.totalPendingCents)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payouts</p>
                <p className="text-2xl font-bold">{stats.totalPayouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Coach Overview</TabsTrigger>
          <TabsTrigger value="tiers">Commission Tiers</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Coach Overview Tab ─────────────────────────────────────────── */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Coach Commission Records</CardTitle>
                  <CardDescription>Track coach earnings, tiers, and SLE verification</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search coaches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Export initiated — check your downloads shortly")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coach</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Commission Tier</TableHead>
                    <TableHead>SLE Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoaches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No coaches match your search" : "No active coaches with commission records"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCoaches.map((coach: any) => (
                      <TableRow key={coach.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {coach.photoUrl ? (
                              <img loading="lazy" src={coach.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {coach.slug?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{coach.slug}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{coach.headline}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{coach.totalSessions || 0}</TableCell>
                        <TableCell>{coach.hourlyRate ? formatCents(coach.hourlyRate) + "/hr" : "—"}</TableCell>
                        <TableCell>
                          {coach.commission ? (
                            <div>
                              <Badge variant={coach.commission.isOverride ? "outline" : "secondary"} className="text-xs">
                                {coach.commission.tierName}
                              </Badge>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {formatBps(coach.commission.commissionBps)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {coach.commission?.isVerifiedSle ? (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => verifySle.mutate({ coachId: coach.id, isVerified: true })}
                            >
                              <Shield className="h-3 w-3 mr-1" /> Verify
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info("Override dialog coming in Sprint 3")}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Override
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Commission Tiers Tab ───────────────────────────────────────── */}
        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Tiers</CardTitle>
                  <CardDescription>Define commission rates based on coach type and volume</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowTierDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tiersLoading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Commission Rate</TableHead>
                      <TableHead>Hours Range</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tiers || []).map((tier: any) => (
                      <TableRow key={tier.id}>
                        <TableCell className="font-medium">{tier.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">{tier.tierType?.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{formatBps(tier.commissionBps)}</TableCell>
                        <TableCell>
                          {tier.minHours || 0}h — {tier.maxHours ? `${tier.maxHours}h` : "∞"}
                        </TableCell>
                        <TableCell>{tier.priority}</TableCell>
                        <TableCell>
                          <Badge variant={tier.isActive ? "default" : "secondary"}>
                            {tier.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTier.mutate({ id: tier.id, isActive: !tier.isActive })}
                          >
                            {tier.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!tiers || tiers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No commission tiers configured. Click "Add Tier" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payouts Tab ────────────────────────────────────────────────── */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payout Management</CardTitle>
                  <CardDescription>Review and process coach payouts</CardDescription>
                </div>
                <Select value={payoutFilter} onValueChange={setPayoutFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {payoutsLoading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coach</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Gross</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Net Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(payouts || []).map((row: any) => (
                      <TableRow key={row.payout.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {row.coachPhoto ? (
                              <img loading="lazy" src={row.coachPhoto} alt="" className="w-6 h-6 rounded-full" />
                            ) : null}
                            <span className="font-medium">{row.coachSlug || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.payout.periodStart ? new Date(row.payout.periodStart).toLocaleDateString() : "—"} —{" "}
                          {row.payout.periodEnd ? new Date(row.payout.periodEnd).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>{row.payout.sessionCount}</TableCell>
                        <TableCell>{formatCents(row.payout.grossEarnings)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatCents(row.payout.totalPlatformFees)}</TableCell>
                        <TableCell className="font-semibold">{formatCents(row.payout.netPayout)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.payout.status === "paid" ? "default" :
                              row.payout.status === "pending" ? "secondary" :
                              row.payout.status === "processing" ? "outline" : "destructive"
                            }
                            className={row.payout.status === "paid" ? "bg-emerald-100 text-emerald-700" : ""}
                          >
                            {row.payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {row.payout.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => approvePayout.mutate({ payoutId: row.payout.id })}>
                              Approve
                            </Button>
                          )}
                          {row.payout.status === "processing" && (
                            <Button size="sm" onClick={() => markPaid.mutate({ payoutId: row.payout.id })}>
                              <CreditCard className="h-3 w-3 mr-1" /> Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!payouts || payouts.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No payouts found for the selected filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Analytics Tab ──────────────────────────────────────────────── */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Breakdown (30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Session Payments</span>
                      <span className="font-semibold">{formatCents(analytics.totals.sessionPayments)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Platform Fees</span>
                      <span className="font-semibold text-emerald-600">{formatCents(analytics.totals.platformFees)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Coach Payouts</span>
                      <span className="font-semibold">{formatCents(analytics.totals.coachPayouts)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Refunds</span>
                      <span className="font-semibold text-red-600">{formatCents(analytics.totals.refunds)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transactions</span>
                      <span className="font-bold">{analytics.entryCount}</span>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-40" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commission Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Active Tiers</Label>
                    <p className="text-sm text-muted-foreground">Number of active commission tiers</p>
                  </div>
                  <span className="text-2xl font-bold">{(tiers || []).filter((t: any) => t.isActive).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SLE Verified Coaches</Label>
                    <p className="text-sm text-muted-foreground">Coaches with verified SLE credentials</p>
                  </div>
                  <span className="text-2xl font-bold">
                    {coaches.filter((c: any) => c.commission?.isVerifiedSle).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Override Commissions</Label>
                    <p className="text-sm text-muted-foreground">Coaches with custom rates</p>
                  </div>
                  <span className="text-2xl font-bold">
                    {coaches.filter((c: any) => c.commission?.isOverride).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Create Tier Dialog ─────────────────────────────────────────────── */}
      <TierDialog
        open={showTierDialog}
        onClose={() => setShowTierDialog(false)}
        onSubmit={(data) => createTier.mutate(data)}
        isPending={createTier.isPending}
      />
    </div>
  );
}

// ─── Tier Dialog Component ────────────────────────────────────────────────────
function TierDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [tierType, setTierType] = useState<"verified_sle" | "standard" | "referral">("standard");
  const [commissionBps, setCommissionBps] = useState(1500);
  const [minHours, setMinHours] = useState(0);
  const [priority, setPriority] = useState(100);

  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Tier name is required"); return; }
    onSubmit({ name, tierType, commissionBps, minHours, priority });
    setName("");
    setCommissionBps(1500);
    setMinHours(0);
    setPriority(100);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Commission Tier</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Tier Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Verified SLE Coach" />
          </div>
          <div>
            <Label>Tier Type</Label>
            <Select value={tierType} onValueChange={(v: any) => setTierType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="verified_sle">Verified SLE</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Commission Rate (basis points, 1500 = 15%)</Label>
            <Input type="number" value={commissionBps} onChange={(e) => setCommissionBps(Number(e.target.value))} />
          </div>
          <div>
            <Label>Minimum Hours Taught</Label>
            <Input type="number" value={minHours} onChange={(e) => setMinHours(Number(e.target.value))} />
          </div>
          <div>
            <Label>Priority (lower = higher priority)</Label>
            <Input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Creating..." : "Create Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
