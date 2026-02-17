/*
 * QuickBooks Authentic — Balance Sheet Report
 * Assets = Liabilities + Equity
 * Computed from double-entry journal entries via accounting engine
 * Enhanced with Recharts stacked area chart and monthly trend
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Printer, Download, Calendar, BarChart3, Table2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function BalanceSheetReport() {
  const [, navigate] = useLocation();
  const { data: company } = trpc.company.get.useQuery();

  const [asOfOption, setAsOfOption] = useState("today");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const asOfDate = useMemo(() => {
    const now = new Date();
    switch (asOfOption) {
      case "last_month": {
        const d = new Date(now.getFullYear(), now.getMonth(), 0);
        return d;
      }
      case "last_quarter": {
        const qEnd = Math.floor(now.getMonth() / 3) * 3 - 1;
        return new Date(now.getFullYear(), qEnd < 0 ? 11 : qEnd + 1, 0);
      }
      case "last_year":
        return new Date(now.getFullYear() - 1, 11, 31);
      default:
        return now;
    }
  }, [asOfOption]);

  const chartYear = asOfOption === "last_year" ? new Date().getFullYear() - 1 : new Date().getFullYear();

  const { data: bs, isLoading } = trpc.reports.balanceSheet.useQuery({
    asOfDate,
  });

  const { data: monthlyData } = trpc.charts.monthlyBalanceSheet.useQuery({ year: chartYear });

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    const formatted = `$${abs.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return n < 0 ? `(${formatted})` : formatted;
  };

  const fmtShort = (n: number) => {
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `$${n.toFixed(0)}`;
  };

  const asOfLabel = asOfDate.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const renderSection = (title: string, items: { name: string; amount: number }[]) => {
    if (items.length === 0) return null;
    const sectionTotal = items.reduce((s, a) => s + a.amount, 0);
    return (
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-medium pl-4 mb-1">{title}</p>
        {items.map((a, i) => (
          <div key={i} className="flex justify-between py-1 text-sm pl-8">
            <span className="text-gray-700">{a.name}</span>
            <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(a.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between py-1 text-sm font-medium pl-4 border-t border-gray-100">
          <span className="text-gray-600">Total {title}</span>
          <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(sectionTotal)}</span>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    if (!bs) return;
    const rows = [
      ["Balance Sheet"],
      [(company as any)?.companyName || "RusingAcademy"],
      [`As of ${asOfLabel}`],
      [""],
      ["ASSETS"],
      ...bs.assets.map((a: any) => [a.name, a.amount.toFixed(2)]),
      ["Total Assets", bs.totalAssets.toFixed(2)],
      [""],
      ["LIABILITIES"],
      ...bs.liabilities.map((a: any) => [a.name, a.amount.toFixed(2)]),
      ["Total Liabilities", bs.totalLiabilities.toFixed(2)],
      [""],
      ["EQUITY"],
      ...bs.equity.map((a: any) => [a.name, a.amount.toFixed(2)]),
      ["Total Equity", bs.totalEquity.toFixed(2)],
      [""],
      ["TOTAL LIABILITIES + EQUITY", (bs.totalLiabilities + bs.totalEquity).toFixed(2)],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "balance-sheet.csv";
    a.click();
  };

  // Group assets by type
  const assetGroups = useMemo(() => {
    if (!bs) return {};
    const groups: Record<string, { name: string; amount: number }[]> = {};
    for (const a of bs.assets) {
      let group = "Other Assets";
      if (a.name.includes("Bank") || a.name === "RusingAcademy") group = "Bank Accounts";
      else if (a.name.includes("Receivable")) group = "Accounts Receivable";
      else if (a.name.includes("Undeposited") || a.name.includes("Prepaid") || a.name.includes("Inventory") || a.name.includes("GST/HST Receivable")) group = "Other Current Assets";
      if (!groups[group]) groups[group] = [];
      groups[group].push(a);
    }
    return groups;
  }, [bs]);

  const chartData = useMemo(() => {
    if (!monthlyData) return [];
    return monthlyData.map((m) => ({
      month: m.monthName,
      assets: Math.round(m.assets * 100) / 100,
      liabilities: Math.round(m.liabilities * 100) / 100,
      equity: Math.round(m.equity * 100) / 100,
    }));
  }, [monthlyData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium">{fmt(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/reports")} className="p-2 hover:bg-gray-100 dark:bg-slate-800 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Balance Sheet</h1>
            <p className="text-sm text-gray-500">{(company as any)?.companyName || "RusingAcademy"} — As of {asOfLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === "table" ? "bg-gray-100 dark:bg-slate-800 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <Table2 size={16} />
            </button>
            <button
              className={`p-2 ${viewMode === "chart" ? "bg-gray-100 dark:bg-slate-800 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setViewMode("chart")}
              title="Chart view"
            >
              <BarChart3 size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-lg px-3 py-1.5">
            <Calendar size={14} className="text-gray-400" />
            <select
              className="text-sm bg-transparent border-none focus:outline-none"
              value={asOfOption}
              onChange={(e) => setAsOfOption(e.target.value)}
            >
              <option value="today">As of Today</option>
              <option value="last_month">End of Last Month</option>
              <option value="last_quarter">End of Last Quarter</option>
              <option value="last_year">End of Last Year</option>
            </select>
          </div>
          <button className="qb-btn-outline flex items-center gap-1" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </button>
          <button className="qb-btn-outline flex items-center gap-1" onClick={handleExport}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : bs ? (
        <>
          {/* Chart View */}
          {viewMode === "chart" && monthlyData && (
            <div className="qb-card mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Monthly Balance Sheet Trend — {chartYear}
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-gray-400, #9ca3af)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-gray-400, #9ca3af)" tickFormatter={fmtShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="assets" name="Assets" stroke="#0077C5" fill="#0077C5" fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="liabilities" name="Liabilities" stroke="#D4380D" fill="#D4380D" fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="equity" name="Equity" stroke="#2CA01C" fill="#2CA01C" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Assets</p>
                  <p className="text-lg font-bold text-blue-800">{fmt(bs.totalAssets)}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">Total Liabilities</p>
                  <p className="text-lg font-bold text-red-800">{fmt(bs.totalLiabilities)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Total Equity</p>
                  <p className="text-lg font-bold text-green-800">{fmt(bs.totalEquity)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="qb-card">
              {/* Assets */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-[#0077C5]">Assets</h3>
                {Object.entries(assetGroups).map(([group, items]) => <div key={group}>{renderSection(group, items)}</div>)}
                <div className="flex justify-between py-2 text-sm font-bold border-t-2 border-gray-300 mt-2">
                  <span className="text-gray-900">Total Assets</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(bs.totalAssets)}</span>
                </div>
              </div>

              {/* Liabilities */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 pb-2 border-b-2 border-red-700">Liabilities</h3>
                {bs.liabilities.length === 0 ? (
                  <p className="text-sm text-gray-400 pl-4 py-2">No liabilities</p>
                ) : (
                  bs.liabilities.map((a: any, i: number) => (
                    <div key={i} className="flex justify-between py-1.5 text-sm pl-4">
                      <span className="text-gray-700">{a.name}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(a.amount)}</span>
                    </div>
                  ))
                )}
                <div className="flex justify-between py-2 text-sm font-bold border-t-2 border-gray-300 mt-2">
                  <span className="text-gray-900">Total Liabilities</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(bs.totalLiabilities)}</span>
                </div>
              </div>

              {/* Equity */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600">Equity</h3>
                {bs.equity.map((a: any, i: number) => (
                  <div key={i} className="flex justify-between py-1.5 text-sm pl-4">
                    <span className="text-gray-700">{a.name}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(a.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-sm font-bold border-t-2 border-gray-300 mt-2">
                  <span className="text-gray-900">Total Equity</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(bs.totalEquity)}</span>
                </div>
              </div>

              {/* Total L+E */}
              <div className="border-t-2 border-gray-800 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total Liabilities + Equity</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(bs.totalLiabilities + bs.totalEquity)}</span>
                </div>
                {Math.abs(bs.totalAssets - (bs.totalLiabilities + bs.totalEquity)) > 0.01 && (
                  <p className="text-xs text-red-700 mt-1">
                    Note: Assets ({fmt(bs.totalAssets)}) do not equal Liabilities + Equity ({fmt(bs.totalLiabilities + bs.totalEquity)}). 
                    Difference: {fmt(bs.totalAssets - bs.totalLiabilities - bs.totalEquity)}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Computed from double-entry journal entries as of {asOfLabel}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">No data available</div>
      )}
    </div>
  );
}
