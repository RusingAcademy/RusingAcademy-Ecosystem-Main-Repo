import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CreditCard, CheckCircle, XCircle, Clock, RefreshCw,
  AlertTriangle, Zap, Copy, ExternalLink, Shield,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    processed: { variant: "default", label: "Processed" },
    received: { variant: "secondary", label: "Received" },
    failed: { variant: "destructive", label: "Failed" },
  };
  const s = map[status] ?? { variant: "outline", label: status };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export default function StripeTesting() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: stats, isLoading: statsLoading } = trpc.stripeTesting.getWebhookStats.useQuery();
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = trpc.stripeTesting.getWebhookEvents.useQuery({});
  const { data: instructions } = trpc.stripeTesting.getTestInstructions.useQuery();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" /> Stripe Testing & Webhooks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Test payments, monitor webhooks, and verify your Stripe integration</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { refetchEvents(); toast.success("Refreshed"); }}>
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><Zap className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Events</p>
                <p className="text-xl font-bold">{statsLoading ? "..." : stats?.total ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Processed</p>
                <p className="text-xl font-bold">{statsLoading ? "..." : stats?.processed ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><XCircle className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-xl font-bold">{statsLoading ? "..." : stats?.failed ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold">
                  {statsLoading ? "..." : stats && stats.total > 0 ? `${Math.round((stats.processed / stats.total) * 100)}%` : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Test Cards</TabsTrigger>
          <TabsTrigger value="events">Webhook Events</TabsTrigger>
          <TabsTrigger value="guide">Integration Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Test Card Info */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5" /> Test Payment Cards</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Successful Payment</p>
                    <p className="text-sm text-muted-foreground font-mono">{instructions?.testCard ?? "4242 4242 4242 4242"}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("4242424242424242")}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Declined Payment</p>
                    <p className="text-sm text-muted-foreground font-mono">4000 0000 0000 0002</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("4000000000000002")}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">3D Secure Authentication</p>
                    <p className="text-sm text-muted-foreground font-mono">4000 0000 0000 3220</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("4000000000003220")}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-muted-foreground">Expiry</p>
                  <p className="font-medium">{instructions?.expiry ?? "Any future date"}</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-muted-foreground">CVC</p>
                  <p className="font-medium">{instructions?.cvc ?? "Any 3 digits"}</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-muted-foreground">ZIP</p>
                  <p className="font-medium">{instructions?.zip ?? "Any 5 digits"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Test Actions */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Test Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto p-4" onClick={() => toast.info("Navigate to a course page and click 'Enroll' to test a real checkout flow")}>
                  <div className="text-left">
                    <p className="font-medium">Test Course Purchase</p>
                    <p className="text-xs text-muted-foreground">Go to a course page → Click Enroll → Use test card</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" onClick={() => toast.info("Navigate to coaching plans and select a plan to test subscription checkout")}>
                  <div className="text-left">
                    <p className="font-medium">Test Subscription</p>
                    <p className="text-xs text-muted-foreground">Go to coaching plans → Select plan → Use test card</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("https://dashboard.stripe.com/test/webhooks", "_blank")}>
                  <div className="text-left flex items-center gap-2">
                    <p className="font-medium">Stripe Dashboard</p>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-muted-foreground">View webhook events and logs in Stripe</p>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" onClick={() => toast.info("Check Settings → Payment to configure live keys after KYC verification")}>
                  <div className="text-left">
                    <p className="font-medium">Go Live Checklist</p>
                    <p className="text-xs text-muted-foreground">Claim sandbox → KYC → Add live keys in Settings</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">Important Notes</p>
                  {instructions?.notes?.map((note, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {note}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Webhook Events Log</CardTitle>
                <Badge variant="outline">{(events as any[])?.length ?? 0} events</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Loading events...</p>
              ) : !events || (events as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium">No webhook events yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Make a test payment to see events appear here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {(events as any[]).map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={event.status} />
                        <div>
                          <p className="text-sm font-medium">{event.eventType}</p>
                          <p className="text-xs text-muted-foreground font-mono">{event.eventId?.slice(0, 30)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {event.createdAt ? new Date(event.createdAt).toLocaleString() : "—"}
                        </p>
                        {event.errorMessage && (
                          <p className="text-xs text-red-500 max-w-[200px] truncate">{event.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Events by Type */}
          {stats?.recentByType && (stats.recentByType as any[]).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Last 24h by Type</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(stats.recentByType as any[]).map((item: any, i: number) => (
                    <div key={i} className="bg-muted/30 rounded p-3">
                      <p className="text-xs text-muted-foreground truncate">{item.eventType}</p>
                      <p className="text-lg font-bold">{item.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Integration Checklist</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Webhook endpoint configured at /api/stripe/webhook", done: true },
                  { label: "Signature verification with STRIPE_WEBHOOK_SECRET", done: true },
                  { label: "Test event detection (evt_test_) with verification response", done: true },
                  { label: "checkout.session.completed → Analytics + Enrollment", done: true },
                  { label: "payment_intent.succeeded → Revenue tracking", done: true },
                  { label: "invoice.paid → Subscription renewal tracking", done: true },
                  { label: "customer.subscription.deleted → Churn tracking", done: true },
                  { label: "Admin notifications on payment events", done: true },
                  { label: "Claim Stripe sandbox (Settings → Payment)", done: false },
                  { label: "Complete Stripe KYC for live payments", done: false },
                  { label: "Add live keys in Settings → Payment", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    {item.done ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? "" : "text-muted-foreground"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
