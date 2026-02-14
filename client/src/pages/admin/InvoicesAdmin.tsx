import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileSpreadsheet, Plus, Download, Search, DollarSign, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function InvoicesAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");

  const { data, isLoading, refetch } = trpc.kajabiInvoices.list.useQuery({ search: search || undefined });
  const { data: stats } = trpc.kajabiInvoices.getStats.useQuery();
  const invoices = data?.items ?? [];

  const createMut = trpc.kajabiInvoices.create.useMutation({
    onSuccess: (res) => { toast.success(`Invoice ${res.invoiceNumber} created`); setCreateOpen(false); setEmail(""); setCustomerName(""); setAmount(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMut = trpc.kajabiInvoices.update.useMutation({
    onSuccess: () => { toast.success("Invoice updated"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const statusColors: Record<string, string> = { paid: "bg-green-100 text-green-700", sent: "bg-blue-100 text-blue-700", draft: "bg-gray-100 text-gray-700", overdue: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-500" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Invoices</h1><p className="text-sm text-muted-foreground">Generate, track, and manage invoices for all transactions.</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Export coming soon")}><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Invoice</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><FileSpreadsheet className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Total Invoices</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">${(stats?.paidAmount ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Paid</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">${(stats?.pendingAmount ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">{stats?.overdueCount ?? 0}</p><p className="text-xs text-muted-foreground">Overdue</p></div></CardContent></Card>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div> : invoices.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="No invoices yet" description="Invoices are automatically generated for purchases. You can also create manual invoices." actionLabel="Create Invoice" onAction={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-2">{invoices.map((inv: any) => (
          <Card key={inv.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><FileSpreadsheet className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="font-medium">{inv.invoiceNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{inv.customerName}</span>
                    <Badge className={`text-[10px] ${statusColors[inv.status] || ""}`}>{inv.status}</Badge>
                    <span className="text-sm font-semibold">${Number(inv.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {inv.status === "sent" && <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => updateMut.mutate({ id: inv.id, status: "paid" })}>Mark Paid</Button>}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Invoice detail coming soon")}><Eye className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}</div>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Customer Name</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Doe" /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="client@example.com" /></div>
            <div><Label>Amount (CAD)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ email, customerName, amount: Number(amount) || 0 })} disabled={!email || !customerName || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Invoice"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
