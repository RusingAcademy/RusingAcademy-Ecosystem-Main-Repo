import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tag, Plus, DollarSign, Package, Clock, Percent, Gift, Edit, Trash2, Eye } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function OffersAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("one-time");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, refetch } = trpc.kajabiOffers.list.useQuery();
  const { data: stats } = trpc.kajabiOffers.getStats.useQuery();
  const offers = data?.items ?? [];

  const createMut = trpc.kajabiOffers.create.useMutation({
    onSuccess: () => { toast.success("Offer created"); setCreateOpen(false); setName(""); setPrice(""); setDescription(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMut = trpc.kajabiOffers.delete.useMutation({
    onSuccess: () => { toast.success("Offer deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const typeColors: Record<string, string> = { "one-time": "bg-green-100 text-green-700", subscription: "bg-blue-100 text-blue-700", "payment-plan": "bg-purple-100 text-purple-700", free: "bg-red-100 text-red-700", bundle: "bg-orange-100 text-orange-700" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Offers</h1><p className="text-sm text-muted-foreground">Create pricing offers that bundle products together — like Kajabi Offers.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Offer</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Tag className="h-5 w-5 text-indigo-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Total Offers</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Package className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats?.active ?? 0}</p><p className="text-xs text-muted-foreground">Active</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-5 w-5 text-emerald-600" /><div><p className="text-xl font-bold">${(stats?.totalRevenue ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Revenue</p></div></CardContent></Card>
      </div>
      <Card><CardContent className="p-4"><p className="text-sm font-medium mb-3">Offer Types</p><div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[{ icon: DollarSign, label: "One-Time", desc: "Single payment", color: "#059669" },{ icon: Clock, label: "Subscription", desc: "Recurring billing", color: "#2563eb" },{ icon: Percent, label: "Payment Plan", desc: "Split payments", color: "#7c3aed" },{ icon: Gift, label: "Free", desc: "Lead magnet", color: "#dc2626" },{ icon: Package, label: "Bundle", desc: "Multiple products", color: "#ea580c" }].map(t => (
          <div key={t.label} className="flex items-center gap-2 p-2 rounded-lg border"><t.icon className="h-4 w-4 shrink-0" style={{ color: t.color }} /><div><p className="text-xs font-medium">{t.label}</p><p className="text-[10px] text-muted-foreground">{t.desc}</p></div></div>
        ))}
      </div></CardContent></Card>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : offers.length === 0 ? (
        <EmptyState icon={Tag} title="No offers yet" description="Create your first offer to start selling. An offer bundles one or more products with a pricing strategy." actionLabel="Create Offer" onAction={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-2">
          {offers.map((offer: any) => (
            <Card key={offer.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><Tag className="h-5 w-5 text-indigo-600" /></div>
                  <div>
                    <p className="font-medium">{offer.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-[10px] ${typeColors[offer.type] || ""}`}>{offer.type}</Badge>
                      <Badge variant={offer.status === "active" ? "default" : "secondary"} className="text-[10px]">{offer.status}</Badge>
                      <span className="text-xs text-muted-foreground">${Number(offer.price || 0).toFixed(2)} {offer.currency || "CAD"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Edit coming soon")}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: offer.id }); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Offer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Offer Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Premium SLE Bundle" /></div>
            <div><Label>Offer Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="one-time">One-Time Payment</SelectItem><SelectItem value="subscription">Subscription</SelectItem><SelectItem value="payment-plan">Payment Plan</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="bundle">Bundle</SelectItem></SelectContent></Select></div>
            <div><Label>Price (CAD)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this offer..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ name, type: type as any, price: Number(price) || 0, description })} disabled={!name || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Offer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
