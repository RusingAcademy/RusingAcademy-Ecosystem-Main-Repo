/*
 * QuickBooks Authentic — Sales Tax Overview with automation
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Loader2, FileCheck, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function SalesTax() {
  const [showPrepare, setShowPrepare] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState<number | null>(null);
  const [prepareStart, setPrepareStart] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3); d.setDate(1);
    return d.toISOString().split("T")[0];
  });
  const [prepareEnd, setPrepareEnd] = useState(() => {
    const d = new Date(); d.setDate(0);
    return d.toISOString().split("T")[0];
  });

  const utils = trpc.useUtils();
  const { data: taxRates, isLoading: ratesLoading } = trpc.taxRates.list.useQuery();
  const { data: taxFilings, isLoading: filingsLoading } = trpc.taxFilings.list.useQuery();

  const prepareMutation = trpc.taxFilings.prepareTaxReturn.useMutation({
    onSuccess: (result: any) => {
      toast.success(`Tax return prepared: $${Number(result?.amountOwing || 0).toFixed(2)} owing`);
      utils.taxFilings.list.invalidate();
      setShowPrepare(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const fileMutation = trpc.taxFilings.update.useMutation({
    onSuccess: () => {
      toast.success("Tax return filed");
      utils.taxFilings.list.invalidate();
    },
  });

  const payMutation = trpc.taxFilings.recordPayment.useMutation({
    onSuccess: () => {
      toast.success("Tax payment recorded");
      utils.taxFilings.list.invalidate();
      setShowPayDialog(null);
    },
    onError: (err) => toast.error(err.message),
  });

  if (ratesLoading || filingsLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const rates = (taxRates || []) as any[];
  const filings = (taxFilings || []) as any[];
  const currentFiling = filings[0];
  const totalRate = rates.reduce((sum: number, r: any) => sum + Number(r.rate || 0), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Tax overview</h1>
        <Button variant="outline" onClick={() => setShowPrepare(true)}>
          Prepare tax return
        </Button>
      </div>

      {/* Tax Summary Card */}
      {currentFiling && (
        <div className="qb-card mb-6 max-w-lg">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sales Tax</div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{currentFiling.agency || "CRA"}</h2>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">${Number(currentFiling.amountOwing || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-500 mb-1">
            {currentFiling.periodStart ? new Date(currentFiling.periodStart).toLocaleDateString("en-CA") : ""} – {currentFiling.periodEnd ? new Date(currentFiling.periodEnd).toLocaleDateString("en-CA") : ""}
          </div>
          <div className="text-xs font-bold text-sky-600 uppercase mb-4">
            {currentFiling.status === "Upcoming" ? "CURRENT PERIOD" : currentFiling.status?.toUpperCase()}
          </div>

          <div className="space-y-2 border-t border-gray-100 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Collected on sales</span>
              <span className="font-medium text-gray-800">${Number(currentFiling.taxCollected || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Paid on purchases</span>
              <span className="font-medium text-gray-800">${Number(currentFiling.taxPaid || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t border-gray-200 dark:border-slate-700 dark:border-slate-700 pt-2">
              <span className="text-gray-800">Net tax owing</span>
              <span className="text-gray-900">${Number(currentFiling.amountOwing || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tax Rates */}
      <div className="qb-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Tax Rates</h3>
          <span className="text-sm font-semibold text-gray-700">Combined: {totalRate}%</span>
        </div>
        <div className="space-y-2">
          {rates.map((rate: any) => (
            <div key={rate.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
              <div>
                <div className="font-medium text-gray-800">{rate.name}</div>
                <div className="text-xs text-gray-500">{rate.agency || "CRA"} · {rate.code}</div>
              </div>
              <div className="font-semibold text-gray-900">{Number(rate.rate || 0)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filing History */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Filing History</h2>
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900 border-b">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Period</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Agency</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filings.map((f: any) => (
              <tr key={f.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {f.periodStart ? new Date(f.periodStart).toLocaleDateString("en-CA") : ""} – {f.periodEnd ? new Date(f.periodEnd).toLocaleDateString("en-CA") : ""}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{f.agency || "CRA"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    f.status === "Paid" ? "bg-green-100 text-green-700" :
                    f.status === "Filed" ? "bg-blue-100 text-blue-700" :
                    f.status === "Due" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 dark:bg-slate-800 text-gray-600"
                  }`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">${Number(f.amountOwing || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {(f.status === "Upcoming" || f.status === "Due") && (
                      <button
                        onClick={() => fileMutation.mutate({ id: f.id, status: "Filed", filedDate: new Date() })}
                        className="text-xs text-sky-600 hover:underline font-medium flex items-center gap-1"
                      >
                        <FileCheck size={12} /> File
                      </button>
                    )}
                    {f.status === "Filed" && (
                      <button
                        onClick={() => setShowPayDialog(f.id)}
                        className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1"
                      >
                        <DollarSign size={12} /> Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filings.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No filings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Prepare Return Dialog */}
      <Dialog open={showPrepare} onOpenChange={setShowPrepare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prepare Tax Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>This will calculate tax collected on sales and tax paid on purchases for the selected period.</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Period Start</label>
                <input type="date" value={prepareStart} onChange={e => setPrepareStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Period End</label>
                <input type="date" value={prepareEnd} onChange={e => setPrepareEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrepare(false)}>Cancel</Button>
            <Button
              onClick={() => prepareMutation.mutate({ periodStart: new Date(prepareStart), periodEnd: new Date(prepareEnd) })}
              disabled={prepareMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {prepareMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Prepare Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Tax Dialog */}
      <Dialog open={showPayDialog !== null} onOpenChange={() => setShowPayDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Tax Payment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">Mark this tax filing as paid. The payment date will be recorded as today.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(null)}>Cancel</Button>
            <Button
              onClick={() => showPayDialog && payMutation.mutate({ id: showPayDialog, paidDate: new Date() })}
              disabled={payMutation.isPending}
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
