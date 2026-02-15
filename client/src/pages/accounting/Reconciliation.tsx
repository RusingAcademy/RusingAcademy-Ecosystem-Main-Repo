import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, CheckCircle, Clock, AlertCircle, Scale, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Reconciliation() {
  const [, navigate] = useLocation();
  const { data: accounts } = trpc.accounts.list.useQuery({ type: "Bank" });
  const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>(undefined);
  const { data: reconciliations, isLoading, refetch } = trpc.reconciliations.list.useQuery(
    selectedAccountId ? { accountId: selectedAccountId } : undefined
  );
  const createMutation = trpc.reconciliations.create.useMutation({
    onSuccess: () => { refetch(); toast.success("Reconciliation started"); },
    onError: () => toast.error("Failed to create reconciliation"),
  });
  const updateMutation = trpc.reconciliations.update.useMutation({
    onSuccess: () => { refetch(); toast.success("Reconciliation updated"); },
    onError: () => toast.error("Failed to update"),
  });

  const [showNewForm, setShowNewForm] = useState(false);
  const [newAccountId, setNewAccountId] = useState<number>(0);
  const [statementDate, setStatementDate] = useState("");
  const [statementBalance, setStatementBalance] = useState("");

  const handleCreate = () => {
    if (!newAccountId || !statementDate || !statementBalance) {
      toast.error("Please fill all fields");
      return;
    }
    createMutation.mutate({
      accountId: newAccountId,
      statementDate: new Date(statementDate),
      statementBalance,
    });
    setShowNewForm(false);
    setStatementDate("");
    setStatementBalance("");
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reconciliation</h1>
        <button
          className="qb-btn-primary flex items-center gap-2"
          onClick={() => setShowNewForm(true)}
        >
          <Plus size={16} /> Start reconciliation
          </button>
          <button
            onClick={() => navigate("/reconciliation/workspace")}
            className="qb-btn-outline flex items-center gap-2"
          >
            <ExternalLink size={16} /> Open Workspace
        </button>
      </div>

      {/* New Reconciliation Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">New Reconciliation</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select
                value={newAccountId}
                onChange={(e) => setNewAccountId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value={0}>Select account...</option>
                {(accounts || []).map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statement Date</label>
              <input
                type="date"
                value={statementDate}
                onChange={(e) => setStatementDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statement Ending Balance</label>
              <input
                type="number"
                step="0.01"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleCreate} className="qb-btn-primary text-sm">Start reconciling</button>
            <button onClick={() => setShowNewForm(false)} className="qb-btn-outline text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Account Filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={selectedAccountId || ""}
          onChange={(e) => setSelectedAccountId(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All accounts</option>
          {(accounts || []).map((a: any) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Reconciliation History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statement Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Account</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statement Balance</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cleared Balance</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Difference</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : (reconciliations || []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <Scale size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No reconciliations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start a reconciliation to match your bank statement</p>
                </td>
              </tr>
            ) : (
              (reconciliations || []).map((rec: any) => {
                const diff = parseFloat(rec.difference || "0");
                return (
                  <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {rec.statementDate ? new Date(rec.statementDate).toLocaleDateString("en-CA") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">Account #{rec.accountId}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                      ${parseFloat(rec.statementBalance || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      ${parseFloat(rec.clearedBalance || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${diff === 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(diff).toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        rec.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {rec.status === "Completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {rec.status === "In Progress" && (
                        <button
                          onClick={() => updateMutation.mutate({ id: rec.id, status: "Completed", completedAt: new Date() })}
                          className="text-sm text-[#2CA01C] font-medium hover:underline"
                        >
                          Finish
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
