/*
 * QuickBooks Authentic — Profit & Loss Report
 * Computed from double-entry journal entries via accounting engine
 * Enhanced with Recharts bar chart, date range picker, and YoY comparison
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Download, Printer, Calendar, BarChart3, Table2, GitCompareArrows } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";

const PERIOD_PRESETS = [
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
  { value: "all", label: "All Dates" },
];

export default function ProfitLossReport() {
  const [, navigate] = useLocation();
  const { data: company } = trpc.company.get.useQuery();

  const [period, setPeriod] = useState("year");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [showYoY, setShowYoY] = useState(false);

  const dateRange = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    switch (period) {
      case "month":
        return { startDate: new Date(year, month, 1), endDate: now };
      case "quarter": {
        const qStart = Math.floor(month / 3) * 3;
        return { startDate: new Date(year, qStart, 1), endDate: now };
      }
      case "year":
        return { startDate: new Date(year, 0, 1), endDate: now };
      case "last_year":
        return { startDate: new Date(year - 1, 0, 1), endDate: new Date(year - 1, 11, 31) };
      case "custom":
        return {
          startDate: customStart ? new Date(customStart) : new Date(year, 0, 1),
          endDate: customEnd ? new Date(customEnd) : now,
        };
      default:
        return { startDate: new Date(2020, 0, 1), endDate: now };
    }
  }, [period, customStart, customEnd]);

  const currentYear = new Date().getFullYear();
  const chartYear = period === "last_year" ? currentYear - 1 : currentYear;

  const { data: pnl, isLoading } = trpc.reports.profitAndLoss.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: monthlyData } = trpc.charts.monthlyPnl.useQuery({ year: chartYear });
  const { data: prevYearData } = trpc.charts.monthlyPnl.useQuery(
    { year: chartYear - 1 },
    { enabled: showYoY }
  );

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    const formatted = `$${abs.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return n < 0 ? `(${formatted})` : formatted;
  };

  const fmtShort = (n: number) => {
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `$${n.toFixed(0)}`;
  };

  const periodLabel = () => {
    const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return `${dateRange.startDate.toLocaleDateString("en-CA", opts)} to ${dateRange.endDate.toLocaleDateString("en-CA", opts)}`;
  };

  const chartData = useMemo(() => {
    if (!monthlyData) return [];
    return monthlyData.map((m, i) => ({
      month: m.monthName,
      income: Math.round(m.income * 100) / 100,
      expenses: Math.round(m.expenses * 100) / 100,
      netProfit: Math.round(m.netProfit * 100) / 100,
      ...(showYoY && prevYearData ? {
        prevIncome: Math.round((prevYearData[i]?.income || 0) * 100) / 100,
        prevExpenses: Math.round((prevYearData[i]?.expenses || 0) * 100) / 100,
        prevNetProfit: Math.round((prevYearData[i]?.netProfit || 0) * 100) / 100,
      } : {}),
    }));
  }, [monthlyData, prevYearData, showYoY]);

  const handleExport = () => {
    if (!pnl) return;
    const rows = [
      ["Profit and Loss Report"],
      [(company as any)?.companyName || "RusingAcademy"],
      [periodLabel()],
      [""],
      ["INCOME"],
      ...pnl.income.map((a: any) => [a.name, a.amount.toFixed(2)]),
      ["Total Income", pnl.totalIncome.toFixed(2)],
      [""],
      ["EXPENSES"],
      ...pnl.expenses.map((a: any) => [a.name, a.amount.toFixed(2)]),
      ["Total Expenses", pnl.totalExpenses.toFixed(2)],
      [""],
      ["NET PROFIT (LOSS)", pnl.netProfit.toFixed(2)],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profit-and-loss.csv";
    a.click();
  };

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
    <div className="p-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/reports")} className="p-2 hover:bg-gray-100 dark:bg-slate-800 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profit and Loss</h1>
            <p className="text-sm text-gray-500">{(company as any)?.companyName || "RusingAcademy"}</p>
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
          {/* YoY Toggle */}
          <button
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border ${showYoY ? "bg-green-50 border-green-600 text-green-600" : "border-gray-200 dark:border-slate-700 text-gray-500 hover:text-gray-700"}`}
            onClick={() => setShowYoY(!showYoY)}
            title="Year-over-Year comparison"
          >
            <GitCompareArrows size={14} /> YoY
          </button>
          {/* Period Picker */}
          <div className="flex items-center gap-1 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-lg px-3 py-1.5">
            <Calendar size={14} className="text-gray-400" />
            <select
              className="text-sm bg-transparent border-none focus:outline-none"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIOD_PRESETS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
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

      {/* Custom Date Range */}
      {period === "custom" && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      )}

      <p className="text-xs text-gray-500 mb-4">{periodLabel()}</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : pnl ? (
        <>
          {/* Chart View */}
          {viewMode === "chart" && monthlyData && (
            <div className="qb-card mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Monthly Income vs Expenses — {chartYear}
                {showYoY && <span className="text-gray-400 font-normal"> (with {chartYear - 1} comparison)</span>}
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-gray-400, var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-gray-400, var(--muted-foreground))" tickFormatter={fmtShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" name={`Income ${chartYear}`} fill="#2CA01C" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" name={`Expenses ${chartYear}`} fill="#0097A7" radius={[3, 3, 0, 0]} />
                    {showYoY && (
                      <>
                        <Bar dataKey="prevIncome" name={`Income ${chartYear - 1}`} fill="#2CA01C" fillOpacity={0.3} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="prevExpenses" name={`Expenses ${chartYear - 1}`} fill="#0097A7" fillOpacity={0.3} radius={[3, 3, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Net Profit Trend Line */}
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">Net Profit Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-gray-400, var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-gray-400, var(--muted-foreground))" tickFormatter={fmtShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="netProfit" name={`Net Profit ${chartYear}`} stroke="#2CA01C" strokeWidth={2} dot={{ r: 4 }} />
                    {showYoY && (
                      <Line type="monotone" dataKey="prevNetProfit" name={`Net Profit ${chartYear - 1}`} stroke="#2CA01C" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} opacity={0.5} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="qb-card">
              {/* Income Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-600">Income</h3>
                {pnl.income.length === 0 ? (
                  <p className="text-sm text-gray-400 pl-4 py-2">No income recorded for this period</p>
                ) : (
                  pnl.income.map((acct: any, i: number) => (
                    <div key={i} className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-700 dark:text-gray-300 pl-4">{acct.name}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(acct.amount)}</span>
                    </div>
                  ))
                )}
                <div className="flex justify-between py-2 text-sm font-bold border-t border-gray-200 dark:border-slate-700 dark:border-slate-700 mt-2">
                  <span className="text-gray-800">Total Income</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(pnl.totalIncome)}</span>
                </div>
              </div>

              {/* COGS */}
              {pnl.expenses.filter((e: any) => e.name.includes("COS") || e.name.includes("Cost")).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-[#E8A317] uppercase tracking-wider mb-3 pb-2 border-b-2 border-[#E8A317]">Cost of Goods Sold</h3>
                  {pnl.expenses.filter((e: any) => e.name.includes("COS") || e.name.includes("Cost")).map((acct: any, i: number) => (
                    <div key={i} className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-700 dark:text-gray-300 pl-4">{acct.name}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(acct.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Expenses */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 pb-2 border-b-2 border-red-700">Expenses</h3>
                {pnl.expenses.filter((e: any) => !e.name.includes("COS") && !e.name.includes("Cost")).length === 0 ? (
                  <p className="text-sm text-gray-400 pl-4 py-2">No expenses recorded for this period</p>
                ) : (
                  pnl.expenses
                    .filter((e: any) => !e.name.includes("COS") && !e.name.includes("Cost"))
                    .sort((a: any, b: any) => b.amount - a.amount)
                    .map((acct: any, i: number) => (
                      <div key={i} className="flex justify-between py-1.5 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 pl-4">{acct.name}</span>
                        <span className="text-gray-800 dark:text-gray-200 font-mono">{fmt(acct.amount)}</span>
                      </div>
                    ))
                )}
                <div className="flex justify-between py-2 text-sm font-bold border-t border-gray-200 dark:border-slate-700 dark:border-slate-700 mt-2">
                  <span className="text-gray-800">Total Expenses</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono">{fmt(pnl.totalExpenses)}</span>
                </div>
              </div>

              {/* Net Profit */}
              <div className="border-t-2 border-gray-800 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Net Profit (Loss)</span>
                  <span className={`font-mono ${pnl.netProfit >= 0 ? "text-green-600" : "text-red-700"}`}>
                    {fmt(pnl.netProfit)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Computed from {pnl.income.length + pnl.expenses.length} accounts via double-entry journal entries
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6 md:py-8 lg:py-12 text-gray-400">No data available</div>
      )}
    </div>
  );
}
