/**
 * Sprint 49 — Reconciliation Workspace
 * Split-screen interface to match bank statement lines against transactions
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { ArrowLeft, Check, X, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ReconciliationWorkspace() {
  const [, navigate] = useLocation();
  const { data: accountsList } = trpc.accounts.list.useQuery();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [statementDate, setStatementDate] = useState(new Date().toISOString().split("T")[0]);
  const [statementBalance, setStatementBalance] = useState("");
  const [started, setStarted] = useState(false);

  const { data: workspace, isLoading, refetch } = trpc.reconciliationWorkspace.getData.useQuery(
    { accountId: selectedAccountId!, statementDate: new Date(statementDate) },
    { enabled: started && !!selectedAccountId }
  );

  const toggleMutation = trpc.reconciliationWorkspace.toggleReconciled.useMutation({
    onSuccess: () => refetch(),
    onError: (err) => toast.error(err.message),
  });

  const bankAccounts = useMemo(() => {
    return ((accountsList as any[]) || []).filter((a: any) => a.accountType === "Bank");
  }, [accountsList]);

  const transactions = workspace?.transactions || [];
  const clearedTxns = transactions.filter((t: any) => t.isReconciled);
  const unclearedTxns = transactions.filter((t: any) => !t.isReconciled);
  const clearedTotal = workspace?.clearedTotal || 0;
  const unclearedTotal = workspace?.unclearedTotal || 0;
  const stmtBal = parseFloat(statementBalance || "0");
  const difference = stmtBal - clearedTotal;

  const fmt = (val: number) => val.toLocaleString("en-CA", { style: "currency", currency: "CAD" });

  if (!started) {
    return (
      <div className="p-6 max-w-[600px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/reconciliation")} className="p-1 hover:bg-gray-100 dark:bg-slate-800 rounded">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Start Reconciliation</h1>
        </div>
        <div className="qb-card">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Bank Account</label>
              <select
                className="qb-input"
                value={selectedAccountId || ""}
                onChange={e => setSelectedAccountId(Number(e.target.value))}
              >
                <option value="">— Select account —</option>
                {bankAccounts.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Statement Ending Date</label>
              <input type="date" className="qb-input" value={statementDate} onChange={e => setStatementDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Statement Ending Balance</label>
              <input type="number" step="0.01" className="qb-input" value={statementBalance} onChange={e => setStatementBalance(e.target.value)} placeholder="0.00" />
            </div>
            <button
              className="qb-btn w-full"
              disabled={!selectedAccountId || !statementBalance}
              onClick={() => setStarted(true)}
            >
              Start Reconciling
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStarted(false)} className="p-1 hover:bg-gray-100 dark:bg-slate-800 rounded">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reconciliation Workspace</h1>
            <p className="text-sm text-gray-500">
              Statement date: {new Date(statementDate).toLocaleDateString("en-CA")} | Statement balance: {fmt(stmtBal)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            Math.abs(difference) < 0.01 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            Difference: {fmt(difference)}
          </div>
          <button
            className="qb-btn flex items-center gap-1.5"
            disabled={Math.abs(difference) >= 0.01}
            onClick={() => {
              toast.success("Reconciliation complete!");
              navigate("/reconciliation");
            }}
          >
            <CheckCircle2 size={14} /> Finish
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="qb-card text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cleared</p>
          <p className="text-xl font-bold text-green-600">{fmt(clearedTotal)}</p>
          <p className="text-xs text-gray-500">{clearedTxns.length} transactions</p>
        </div>
        <div className="qb-card text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Uncleared</p>
          <p className="text-xl font-bold text-orange-600">{fmt(unclearedTotal)}</p>
          <p className="text-xs text-gray-500">{unclearedTxns.length} transactions</p>
        </div>
        <div className="qb-card text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Difference</p>
          <p className={`text-xl font-bold ${Math.abs(difference) < 0.01 ? "text-green-600" : "text-red-600"}`}>
            {fmt(difference)}
          </p>
          <p className="text-xs text-gray-500">{Math.abs(difference) < 0.01 ? "Balanced!" : "Not balanced"}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 md:py-8 lg:py-12"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Uncleared Transactions */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <X size={14} className="text-orange-500" /> Uncleared ({unclearedTxns.length})
            </h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {unclearedTxns.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No uncleared transactions</p>
              ) : unclearedTxns.map((tx: any) => (
                <div key={tx.id} className="qb-card flex items-center justify-between py-3 hover:border-green-300 cursor-pointer transition-colors"
                  onClick={() => toggleMutation.mutate({ transactionId: tx.id, isReconciled: true })}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{tx.description || "—"}</p>
                    <p className="text-xs text-gray-500">{tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString("en-CA") : "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${parseFloat(tx.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fmt(parseFloat(tx.amount || "0"))}
                    </p>
                    <p className="text-xs text-gray-400">Click to clear</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cleared Transactions */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Check size={14} className="text-green-500" /> Cleared ({clearedTxns.length})
            </h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {clearedTxns.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No cleared transactions</p>
              ) : clearedTxns.map((tx: any) => (
                <div key={tx.id} className="qb-card flex items-center justify-between py-3 bg-green-50 border-green-200 hover:border-red-300 cursor-pointer transition-colors"
                  onClick={() => toggleMutation.mutate({ transactionId: tx.id, isReconciled: false })}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{tx.description || "—"}</p>
                    <p className="text-xs text-gray-500">{tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString("en-CA") : "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${parseFloat(tx.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fmt(parseFloat(tx.amount || "0"))}
                    </p>
                    <p className="text-xs text-gray-400">Click to unclear</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
