import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, DollarSign, ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";


const labels = {
  en: { title: "Deposits", subtitle: "Record bank deposits", newDeposit: "New Deposit", account: "Account", date: "Date", amount: "Amount" },
  fr: { title: "Dépôts", subtitle: "Enregistrer les dépôts bancaires", newDeposit: "Nouveau dépôt", account: "Compte", date: "Date", amount: "Montant" },
};

export default function Deposits() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"payments" | "transfers">("payments");
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromAccountId: "", toAccountId: "", amount: "", memo: "",
    transferDate: new Date().toISOString().split("T")[0],
  });
  const utils = trpc.useUtils();

  const { data: payments, isLoading: paymentsLoading } = trpc.payments.list.useQuery();
  const { data: transfers, isLoading: transfersLoading } = trpc.transfers.list.useQuery();
  const { data: accountsList } = trpc.accounts.list.useQuery();

  const transferMutation = trpc.transfers.create.useMutation({
    onSuccess: () => {
      toast.success("Transfer recorded");
      utils.transfers.list.invalidate();
      utils.accounts.list.invalidate();
      setShowTransfer(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const fmt = (v: string | null | undefined) =>
    `$${parseFloat(v || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  const bankAccounts = ((accountsList || []) as any[]).filter((a: any) =>
    ["Bank", "Checking", "Savings", "Cash and Cash Equivalents"].includes(a.accountType)
  );

  const filteredPayments = (payments || []).filter((p: any) =>
    !search || p.paymentMethod?.toLowerCase().includes(search.toLowerCase()) ||
    p.referenceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.memo?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTransfers = (transfers || []).filter((t: any) =>
    !search || t.memo?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 20;
  const currentList = activeTab === "payments" ? filteredPayments : filteredTransfers;
  const totalPages = Math.ceil(currentList.length / perPage);
  const paginated = currentList.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments & Transfers</h1>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
          setTransferForm({ fromAccountId: "", toAccountId: "", amount: "", memo: "", transferDate: new Date().toISOString().split("T")[0] });
          setShowTransfer(true);
        }}>
          <ArrowRightLeft size={16} className="mr-1" /> Transfer Funds
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-200 dark:border-white/15 dark:border-white/15">
        <button
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "payments" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          onClick={() => { setActiveTab("payments"); setPage(1); }}
        >
          Payments ({(payments || []).length})
        </button>
        <button
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "transfers" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          onClick={() => { setActiveTab("transfers"); setPage(1); }}
        >
          Transfers ({(transfers || []).length})
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
      </div>

      {activeTab === "payments" && (
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Memo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentsLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 md:py-8 lg:py-12 text-center">
                    <DollarSign size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No payments recorded yet</p>
                  </td>
                </tr>
              ) : (
                paginated.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-white/15 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-CA") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-600 font-medium">{p.referenceNumber || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.paymentMethod || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.memo || "-"}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{fmt(p.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "transfers" && (
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Memo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transfersLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 md:py-8 lg:py-12 text-center">
                    <ArrowRightLeft size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No transfers yet</p>
                  </td>
                </tr>
              ) : (
                paginated.map((t: any) => (
                  <tr key={t.id} className="border-b border-gray-100 dark:border-white/15 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {t.transferDate ? new Date(t.transferDate).toLocaleDateString("en-CA") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">Account #{t.fromAccountId}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">Account #{t.toAccountId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.memo || "-"}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{fmt(t.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, currentList.length)} of {currentList.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Transfer Dialog */}
      <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">From Account</label>
              <Select value={transferForm.fromAccountId} onValueChange={v => setTransferForm({ ...transferForm, fromAccountId: v })}>
                <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((a: any) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.name} ({fmt(a.balance)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">To Account</label>
              <Select value={transferForm.toAccountId} onValueChange={v => setTransferForm({ ...transferForm, toAccountId: v })}>
                <SelectTrigger><SelectValue placeholder="Select destination account" /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.filter((a: any) => String(a.id) !== transferForm.fromAccountId).map((a: any) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.name} ({fmt(a.balance)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Amount</label>
                <input type="number" step="0.01" value={transferForm.amount}
                  onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Date</label>
                <input type="date" value={transferForm.transferDate}
                  onChange={e => setTransferForm({ ...transferForm, transferDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Memo</label>
              <input type="text" value={transferForm.memo}
                onChange={e => setTransferForm({ ...transferForm, memo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransfer(false)}>Cancel</Button>
            <Button
              onClick={() => transferMutation.mutate({
                fromAccountId: parseInt(transferForm.fromAccountId),
                toAccountId: parseInt(transferForm.toAccountId),
                amount: transferForm.amount,
                transferDate: new Date(transferForm.transferDate),
                memo: transferForm.memo || undefined,
              })}
              disabled={transferMutation.isPending || !transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount}
              className="bg-green-600 hover:bg-green-700"
            >
              {transferMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <ArrowRightLeft size={14} className="mr-1" />}
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
