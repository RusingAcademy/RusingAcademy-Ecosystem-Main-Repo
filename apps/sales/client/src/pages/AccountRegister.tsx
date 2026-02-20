/*
 * QuickBooks Authentic — Account Register Page
 * Shows transactions for a specific account with running balance
 */
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AccountRegister() {
  const [, params] = useRoute("/accounts/:id/register");
  const [, navigate] = useLocation();
  const accountId = params?.id ? Number(params.id) : 0;

  const { data: account, isLoading } = trpc.accounts.getById.useQuery(
    { id: accountId },
    { enabled: accountId > 0 }
  );

  // For now, show the account details and a placeholder for the register
  // Full register with journal entries will come in Sprint 17
  const acct = account as any;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/chart-of-accounts")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{acct?.name || "Account"}</h1>
            <p className="text-sm text-gray-500">{acct?.accountType} — {acct?.detailType}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
          <p className="text-2xl font-bold text-gray-900">${Number(acct?.balance || 0).toFixed(2)}</p>
          {acct?.bankBalance && (
            <p className="text-xs text-gray-400">Bank: ${Number(acct.bankBalance).toFixed(2)}</p>
          )}
        </div>
      </div>

      <div className="qb-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Register</h3>
          <div className="flex items-center gap-2">
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <option>All dates</option>
              <option>This month</option>
              <option>Last month</option>
              <option>This quarter</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Date</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Ref Type</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Ref #</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Payee / Customer</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Memo</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Debit</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Credit</th>
              <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                Register entries will be populated as journal entries are created.
                <br />
                <span className="text-xs">This feature is part of Sprint 17 — Journal Entries & Rules</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
