/**
 * Enhancement K — Multi-Currency Exchange Rates
 * View/manage exchange rates, live currency converter, rate history
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Loader2, Globe, RefreshCw, ArrowRightLeft, TrendingUp, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CURRENCIES = ["CAD", "USD", "EUR", "GBP", "JPY", "CHF", "AUD", "MXN", "CNY"];
const CURRENCY_SYMBOLS: Record<string, string> = {
  CAD: "C$", USD: "$", EUR: "€", GBP: "£", JPY: "¥", CHF: "Fr", AUD: "A$", MXN: "Mex$", CNY: "¥",
};

export default function ExchangeRates() {
  const [, navigate] = useLocation();
  const { data: rates, isLoading, refetch } = trpc.exchangeRates.list.useQuery();
  const createMutation = trpc.exchangeRates.create.useMutation({
    onSuccess: () => { toast.success("Exchange rate added"); refetch(); setShowCreate(false); },
    onError: (err) => toast.error(err.message),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("CAD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rate, setRate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);

  // Converter state
  const [convertFrom, setConvertFrom] = useState("CAD");
  const [convertTo, setConvertTo] = useState("USD");
  const [convertAmount, setConvertAmount] = useState("1000.00");

  const handleCreate = () => {
    if (!rate || parseFloat(rate) <= 0) { toast.error("Rate must be positive"); return; }
    createMutation.mutate({
      fromCurrency, toCurrency, rate,
      effectiveDate: new Date(effectiveDate),
      source: "Manual",
    });
  };

  const items = (rates as any[]) || [];

  // Find the latest rate for the converter
  const latestRate = useMemo(() => {
    const matching = items.filter((r: any) =>
      r.fromCurrency === convertFrom && r.toCurrency === convertTo
    ).sort((a: any, b: any) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
    return matching[0];
  }, [items, convertFrom, convertTo]);

  const convertedAmount = useMemo(() => {
    if (!latestRate || !convertAmount) return null;
    return (parseFloat(convertAmount) * parseFloat(latestRate.rate)).toFixed(2);
  }, [latestRate, convertAmount]);

  // Group rates by currency pair for summary
  const ratePairs = useMemo(() => {
    const pairs: Record<string, any> = {};
    items.forEach((r: any) => {
      const key = `${r.fromCurrency}/${r.toCurrency}`;
      if (!pairs[key] || new Date(r.effectiveDate) > new Date(pairs[key].effectiveDate)) {
        pairs[key] = r;
      }
    });
    return Object.values(pairs);
  }, [items]);

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Exchange Rates</h1>
            <p className="text-sm text-gray-500">Manage currency exchange rates for multi-currency transactions</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowCreate(true)}>
          <Plus size={14} className="mr-1" /> Add Rate
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="qb-card">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={16} className="text-sky-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Active Pairs</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{ratePairs.length}</div>
          <p className="text-xs text-gray-400 mt-1">Currency pairs configured</p>
        </div>
        <div className="qb-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Total Rates</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{items.length}</div>
          <p className="text-xs text-gray-400 mt-1">Historical rate entries</p>
        </div>
        <div className="qb-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-gray-500 uppercase">Home Currency</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">CAD</div>
          <p className="text-xs text-gray-400 mt-1">Canadian Dollar</p>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="qb-card mb-6 border-l-4 border-l-[#0077C5]">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <ArrowRightLeft size={14} className="text-sky-600" /> Quick Currency Converter
        </h3>
        <div className="grid grid-cols-7 gap-3 items-end">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" type="number" step="0.01"
              value={convertAmount} onChange={e => setConvertAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={convertFrom}
              onChange={e => setConvertFrom(e.target.value)}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-center pb-1">
            <ArrowRightLeft size={18} className="text-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={convertTo}
              onChange={e => setConvertTo(e.target.value)}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2 bg-gray-50 rounded-md px-3 py-2 text-center">
            {latestRate ? (
              <div>
                <div className="text-lg font-bold text-gray-800">
                  {CURRENCY_SYMBOLS[convertTo] || ""}{convertedAmount ? parseFloat(convertedAmount).toLocaleString("en-CA", { minimumFractionDigits: 2 }) : "—"}
                </div>
                <div className="text-xs text-gray-400">Rate: {parseFloat(latestRate.rate).toFixed(4)}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">No rate available for this pair</div>
            )}
          </div>
        </div>
      </div>

      {/* Add Rate Form */}
      {showCreate && (
        <div className="qb-card mb-6 border-2 border-green-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Exchange Rate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rate</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" type="number" step="0.0001" value={rate} onChange={e => setRate(e.target.value)} placeholder="1.3500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Effective Date</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null} Save Rate
            </Button>
          </div>
        </div>
      )}

      {/* Latest Rates by Pair */}
      {ratePairs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Latest Rates by Pair</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ratePairs.map((r: any) => (
              <div key={`${r.fromCurrency}-${r.toCurrency}`} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-800">{r.fromCurrency}/{r.toCurrency}</span>
                  <span className="text-xs text-gray-400">{r.source || "Manual"}</span>
                </div>
                <div className="text-lg font-bold text-sky-600">{parseFloat(r.rate).toFixed(4)}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {r.effectiveDate ? new Date(r.effectiveDate).toLocaleDateString("en-CA") : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Rate History Table */}
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Rate History</h3>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
      ) : items.length === 0 ? (
        <div className="qb-card text-center py-12">
          <Globe size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-1">No exchange rates configured</p>
          <p className="text-sm text-gray-400">Add rates to enable multi-currency transactions</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">To</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Effective Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r: any) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.fromCurrency}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.toCurrency}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">{parseFloat(r.rate).toFixed(4)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">
                    {r.effectiveDate ? new Date(r.effectiveDate).toLocaleDateString("en-CA") : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-right">{r.source || "Manual"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
