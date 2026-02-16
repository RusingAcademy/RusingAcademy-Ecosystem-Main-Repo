import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Search, FileText, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Open: "bg-blue-100 text-blue-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
  Voided: "bg-gray-200 text-gray-500",
};

export default function Bills() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payBill, setPayBill] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payAccountId, setPayAccountId] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const utils = trpc.useUtils();

  const { data: bills, isLoading } = trpc.bills.list.useQuery(
    statusFilter ? { status: statusFilter } : undefined
  );
  const { data: accountsList } = trpc.accounts.list.useQuery();

  const payMutation = trpc.bills.payBill.useMutation({
    onSuccess: () => {
      toast.success("Payment recorded");
      utils.bills.list.invalidate();
      setPayBill(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.bills.update.useMutation({
    onSuccess: () => {
      utils.bills.list.invalidate();
      toast.success("Bill updated");
    },
  });

  const fmt = (v: string | null | undefined) =>
    `$${parseFloat(v || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  const filtered = (bills || []).filter((b: any) =>
    !search || b.billNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  const bankAccounts = ((accountsList || []) as any[]).filter((a: any) =>
    ["Bank", "Checking", "Savings", "Cash and Cash Equivalents"].includes(a.accountType)
  );

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openPayDialog = (bill: any) => {
    setPayBill(bill);
    setPayAmount(bill.amountDue || bill.total || "0");
    setPayDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bills</h1>
        <Link href="/bills/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-1" /> Create bill
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2CA01C] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Open">Open</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Balance</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No bills yet</p>
                  <Link href="/bills/new">
                    <button className="mt-3 text-sm text-green-600 font-medium hover:underline">Create your first bill</button>
                  </Link>
                </td>
              </tr>
            ) : (
              paginated.map((bill: any) => (
                <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {bill.billDate ? new Date(bill.billDate).toLocaleDateString("en-CA") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/bills/${bill.id}`} className="text-sm text-sky-600 hover:underline font-medium">
                      {bill.billNumber || `Bill-${bill.id}`}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{bill.supplierName || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString("en-CA") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bill.status] || "bg-gray-100 text-gray-600"}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{fmt(bill.total)}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{fmt(bill.amountDue)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(bill.status === "Open" || bill.status === "Partial" || bill.status === "Overdue") && (
                        <button
                          onClick={() => openPayDialog(bill)}
                          className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1"
                        >
                          <DollarSign size={12} /> Pay
                        </button>
                      )}
                      {bill.status === "Draft" && (
                        <button
                          onClick={() => updateMutation.mutate({ id: bill.id, status: "Open" })}
                          className="text-xs text-sky-600 hover:underline font-medium"
                        >
                          Open
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Pay Bill Dialog */}
      <Dialog open={payBill !== null} onOpenChange={() => setPayBill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Bill — {payBill?.billNumber || ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Supplier</span>
              <span className="font-medium">{payBill?.supplierName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Amount Due</span>
              <span className="font-medium">{fmt(payBill?.amountDue || payBill?.total)}</span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Amount</label>
              <input
                type="number"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Account</label>
              <Select value={payAccountId} onValueChange={setPayAccountId}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((a: any) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                  ))}
                  {bankAccounts.length === 0 && <SelectItem value="1">Default Bank</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Date</label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayBill(null)}>Cancel</Button>
            <Button
              onClick={() => payBill && payMutation.mutate({
                id: payBill.id,
                amount: payAmount,
                paymentAccountId: parseInt(payAccountId) || 1,
                paymentDate: new Date(payDate),
              })}
              disabled={payMutation.isPending || !payAmount}
              className="bg-green-600 hover:bg-green-700"
            >
              {payMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <DollarSign size={14} className="mr-1" />}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
