import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ShoppingCart, DollarSign, TrendingUp, RefreshCw, Mail, Clock, CheckCircle } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function CartAdmin() {
  const [activeTab, setActiveTab] = useState("abandoned");

  const { data, isLoading, refetch } = trpc.kajabiCart.getAbandoned.useQuery();
  const { data: stats } = trpc.kajabiCart.getStats.useQuery();
  const carts = data?.items ?? [];

  const recoverMut = trpc.kajabiCart.markRecovered.useMutation({
    onSuccess: () => { toast.success("Cart marked as recovered"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const abandoned = carts.filter((c: any) => c.status === "abandoned");
  const recovered = carts.filter((c: any) => c.status === "recovered");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Cart</h1><p className="text-sm text-muted-foreground">Track abandoned carts and recover lost revenue with automated follow-ups.</p></div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><ShoppingCart className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Abandoned Carts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">${(stats?.lostRevenue ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Lost Revenue</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats?.recovered ?? 0}</p><p className="text-xs text-muted-foreground">Recovered</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="h-5 w-5 text-purple-600" /><div><p className="text-xl font-bold">{stats?.recoveryRate ?? 0}%</p><p className="text-xs text-muted-foreground">Recovery Rate</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="abandoned">Abandoned Carts</TabsTrigger><TabsTrigger value="recovered">Recovered</TabsTrigger><TabsTrigger value="settings">Recovery Settings</TabsTrigger></TabsList>
        <TabsContent value="abandoned" className="mt-4">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div> : abandoned.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="No abandoned carts" description="When customers add items but don't complete checkout, they'll appear here." />
          ) : (
            <div className="space-y-2">{abandoned.map((cart: any) => (
              <Card key={cart.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><ShoppingCart className="h-5 w-5 text-amber-600" /></div>
                    <div>
                      <p className="font-medium">{cart.email || "Anonymous"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold">${Number(cart.totalAmount || 0).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">{new Date(cart.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => recoverMut.mutate({ id: cart.id })}>Mark Recovered</Button>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="recovered" className="mt-4">
          {recovered.length === 0 ? (
            <EmptyState icon={TrendingUp} title="No recovered carts yet" description="Successfully recovered carts will appear here with revenue attribution." />
          ) : (
            <div className="space-y-2">{recovered.map((cart: any) => (
              <Card key={cart.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                    <div><p className="font-medium">{cart.email}</p><span className="text-sm font-semibold">${Number(cart.totalAmount || 0).toFixed(2)}</span></div>
                  </div>
                  <Badge variant="default" className="text-[10px]">Recovered</Badge>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium">Cart Recovery Automation</h3>
            <p className="text-sm text-muted-foreground">Configure automated email sequences to recover abandoned carts.</p>
            <div className="space-y-3">
              {[{ delay: "1 hour", subject: "You left something behind!", enabled: true },{ delay: "24 hours", subject: "Still interested? Complete your purchase", enabled: true },{ delay: "72 hours", subject: "Last chance — special offer inside", enabled: false }].map((email, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{email.subject}</p><p className="text-xs text-muted-foreground">Sent after {email.delay}</p></div></div>
                  <Badge variant={email.enabled ? "default" : "secondary"}>{email.enabled ? "Active" : "Disabled"}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => toast("Cart recovery settings coming soon")}>Configure Emails</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
