/*
 * QuickBooks Authentic — Homepage Dashboard
 * Wired to live tRPC API data with widget customization
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Calculator, CreditCard, DollarSign, Users, UserPlus,
  Receipt, Globe, Megaphone, TrendingUp, TrendingDown,
  Info, MoreVertical, ChevronDown, Settings,
  Eye, EyeOff, Loader2, GripVertical, X, Check,
  LayoutDashboard, Clock, FileText, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { DashboardCardSkeleton } from "@/components/TableSkeleton";

const shortcutIcons: Record<string, any> = {
  "Accounting": Calculator,
  "Expenses & Pay Bills": CreditCard,
  "Sales & Get Paid": DollarSign,
  "Customers": Users,
  "Team": UserPlus,
  "Sales Tax": Receipt,
  "Payroll": Globe,
  "Marketing": Megaphone,
};

const shortcutRoutes: Record<string, string> = {
  "Accounting": "/chart-of-accounts",
  "Expenses & Pay Bills": "/expenses",
  "Sales & Get Paid": "/invoices",
  "Customers": "/customers",
  "Sales Tax": "/sales-tax",
};

const shortcuts = [
  { label: "Accounting", color: "#0077C5" },
  { label: "Expenses & Pay Bills", color: "#2CA01C" },
  { label: "Sales & Get Paid", color: "#0077C5" },
  { label: "Customers", color: "#2CA01C" },
  { label: "Team", color: "#0097A7" },
  { label: "Sales Tax", color: "#D4380D" },
  { label: "Payroll", color: "#0077C5" },
  { label: "Marketing", color: "#2CA01C" },
];

const quickActions = [
  "Create invoice", "Get paid online", "Record expense", "Add bank deposit", "Create cheque"
];

// Widget configuration
type WidgetId = "profitLoss" | "expenses" | "bankAccounts" | "cashFlow" | "recentActivity" | "suggestions";

interface WidgetConfig {
  id: WidgetId;
  label: string;
  icon: any;
  visible: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "profitLoss", label: "Profit & Loss", icon: TrendingUp, visible: true },
  { id: "expenses", label: "Expenses", icon: CreditCard, visible: true },
  { id: "bankAccounts", label: "Bank Accounts", icon: DollarSign, visible: true },
  { id: "cashFlow", label: "Cash Flow", icon: AreaChart, visible: true },
  { id: "recentActivity", label: "Recent Activity", icon: Clock, visible: true },
  { id: "suggestions", label: "Suggestions", icon: Info, visible: true },
];

function loadWidgetConfig(): WidgetConfig[] {
  try {
    const saved = localStorage.getItem("qb-dashboard-widgets");
    if (saved) {
      const parsed = JSON.parse(saved) as WidgetConfig[];
      // Merge with defaults to handle new widgets
      const ids = new Set(parsed.map(w => w.id));
      const merged = [...parsed];
      DEFAULT_WIDGETS.forEach(dw => {
        if (!ids.has(dw.id)) merged.push(dw);
      });
      return merged.map(w => ({
        ...w,
        label: DEFAULT_WIDGETS.find(d => d.id === w.id)?.label || w.label,
        icon: DEFAULT_WIDGETS.find(d => d.id === w.id)?.icon || Info,
      }));
    }
  } catch {}
  return DEFAULT_WIDGETS;
}

function saveWidgetConfig(widgets: WidgetConfig[]) {
  localStorage.setItem("qb-dashboard-widgets", JSON.stringify(
    widgets.map(w => ({ id: w.id, label: w.label, visible: w.visible }))
  ));
}

export default function Home() {
  const { user } = useAuth();
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(loadWidgetConfig);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Live data from API
  const { data: dashboardData, isLoading } = trpc.dashboard.getData.useQuery();

  const userName = user?.name || "Steven";

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatCurrency = (val: number) => {
    if (privacyMode) return "••••••";
    return `$${val.toLocaleString("en-CA", { minimumFractionDigits: val % 1 !== 0 ? 2 : 0 })}`;
  };

  const cashFlowData = useMemo(() => [
    { month: "Aug", cashBalance: 0, projectedBalance: 0 },
    { month: "Sep", cashBalance: 0, projectedBalance: 0 },
    { month: "Oct", cashBalance: 0, projectedBalance: 0 },
    { month: "Nov", cashBalance: 0, projectedBalance: 0 },
    { month: "Dec", cashBalance: 0, projectedBalance: 0 },
    { month: "Jan", cashBalance: dashboardData?.bankAccount?.balance || 0, projectedBalance: (dashboardData?.bankAccount?.balance || 0) * 1.1 },
    { month: "Feb", cashBalance: 0, projectedBalance: (dashboardData?.bankAccount?.balance || 0) * 0.9 },
  ], [dashboardData]);

  // Widget drag handlers
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...widgets];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setWidgets(updated);
    saveWidgetConfig(updated);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const toggleWidget = (id: WidgetId) => {
    const updated = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    setWidgets(updated);
    saveWidgetConfig(updated);
  };

  const resetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
    saveWidgetConfig(DEFAULT_WIDGETS);
    toast.success("Dashboard reset to default layout");
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-[1200px] mx-auto">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
        <DashboardCardSkeleton />
      </div>
    );
  }

  const income = dashboardData?.profitAndLoss.income || 0;
  const expenses = dashboardData?.profitAndLoss.expenses || 0;
  const netProfit = dashboardData?.profitAndLoss.netProfit || 0;
  const bankBalance = dashboardData?.bankAccount?.bankBalance || 0;
  const qbBalance = dashboardData?.bankAccount?.balance || 0;
  const forReview = dashboardData?.bankAccount?.forReview || 0;
  const recentActivity = (dashboardData as any)?.recentActivity || [];

  const isVisible = (id: WidgetId) => widgets.find(w => w.id === id)?.visible !== false;

  // Render widgets in order
  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.visible) return null;
    switch (widget.id) {
      case "profitLoss": return <ProfitLossCard key="profitLoss" income={income} expenses={expenses} netProfit={netProfit} formatCurrency={formatCurrency} />;
      case "expenses": return <ExpensesCard key="expenses" expenses={expenses} formatCurrency={formatCurrency} />;
      case "bankAccounts": return <BankAccountsCard key="bankAccounts" companyName={dashboardData?.companyName} bankBalance={bankBalance} qbBalance={qbBalance} forReview={forReview} formatCurrency={formatCurrency} />;
      case "cashFlow": return <CashFlowCard key="cashFlow" qbBalance={qbBalance} cashFlowData={cashFlowData} formatCurrency={formatCurrency} />;
      case "recentActivity": return <RecentActivityCard key="recentActivity" activity={recentActivity} />;
      case "suggestions": return <SuggestionsCard key="suggestions" />;
      default: return null;
    }
  };

  // Separate grid widgets (P&L + Expenses) from full-width widgets
  const gridWidgets = widgets.filter(w => w.visible && (w.id === "profitLoss" || w.id === "expenses"));
  const fullWidgets = widgets.filter(w => w.visible && w.id !== "profitLoss" && w.id !== "expenses");

  return (
    <div className="p-3 sm:p-6 max-w-[1200px] mx-auto">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting()} {userName}!
        </h1>
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-1.5 text-sm ${showCustomize ? "text-[#2CA01C] font-medium" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setShowCustomize(!showCustomize)}
          >
            <LayoutDashboard size={16} />
            Customize
          </button>
          <button
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setPrivacyMode(!privacyMode)}
          >
            {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
            Privacy
          </button>
        </div>
      </div>

      {/* Customize Panel */}
      {showCustomize && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={16} className="text-[#2CA01C]" />
              <span className="text-sm font-semibold text-gray-700">Customize Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={resetWidgets} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                Reset to default
              </button>
              <button onClick={() => setShowCustomize(false)} className="p-1 hover:bg-gray-200 rounded">
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">Drag to reorder widgets. Toggle visibility with the checkboxes.</p>
            <div className="space-y-1">
              {widgets.map((widget, idx) => {
                const Icon = widget.icon;
                return (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIdx === idx ? "bg-[#2CA01C]/10 border border-[#2CA01C]/30" :
                      dragIdx === idx ? "opacity-50 bg-gray-50" :
                      "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        widget.visible
                          ? "bg-[#2CA01C] border-[#2CA01C] text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {widget.visible && <Check size={12} />}
                    </button>
                    <span className={`text-sm ${widget.visible ? "text-gray-700" : "text-gray-400"}`}>
                      {widget.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Shortcut Pills */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {shortcuts.map((shortcut) => {
          const Icon = shortcutIcons[shortcut.label] || Calculator;
          const route = shortcutRoutes[shortcut.label];
          return (
            <Link
              key={shortcut.label}
              href={route || "#"}
              onClick={(e) => {
                if (!route) { e.preventDefault(); toast("Feature coming soon"); }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all whitespace-nowrap text-sm text-gray-700"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: shortcut.color }}>
                <Icon size={14} className="text-white" />
              </div>
              {shortcut.label}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">Create actions</span>
          {quickActions.map((action) => (
            <button key={action} className="qb-btn-outline text-[13px]" onClick={() => toast("Feature coming soon")}>
              {action}
            </button>
          ))}
          <button className="text-sm text-[#2CA01C] font-medium hover:underline" onClick={() => toast("Feature coming soon")}>
            Show all
          </button>
        </div>
      </div>

      {/* Business at a Glance */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Business at a glance</h2>

      {/* Grid widgets (P&L + Expenses side by side) */}
      {gridWidgets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {gridWidgets.map(w => renderWidget(w))}
        </div>
      )}

      {/* Full-width widgets in order */}
      {fullWidgets.map(w => renderWidget(w))}

      <div className="text-right mb-4">
        <button className="text-sm text-[#0077C5] hover:underline">See all activity</button>
      </div>
    </div>
  );
}

/* ─── Widget Components ─────────────────────────────────────────────── */

function ProfitLossCard({ income, expenses, netProfit, formatCurrency }: { income: number; expenses: number; netProfit: number; formatCurrency: (v: number) => string }) {
  return (
    <div className="qb-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profit & Loss</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          Last month <ChevronDown size={14} />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-1">Net profit this period</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">{formatCurrency(netProfit)}</span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Info size={14} /> {income > 0 ? Math.round((netProfit / income) * 100) : 0}%
        </span>
      </div>
      <div className="flex items-center gap-1 text-sm mb-4">
        {netProfit >= 0 ? (
          <><TrendingUp size={14} className="text-[#2CA01C]" /><span className="text-[#2CA01C] font-medium">Profitable</span></>
        ) : (
          <><TrendingDown size={14} className="text-[#D4380D]" /><span className="text-[#D4380D] font-medium">Net loss</span></>
        )}
        <span className="text-gray-500">this period</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-20">{formatCurrency(income)}</span>
          <span className="text-xs text-gray-500 w-16">Income</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4">
            <div className="bg-[#2CA01C] h-4 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 w-20">{formatCurrency(expenses)}</span>
          <span className="text-xs text-gray-500 w-16">Expenses</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4">
            <div className="bg-[#0097A7] h-4 rounded-full" style={{ width: `${income > 0 ? (expenses / income) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link href="/reports/profit-loss" className="text-sm text-[#0077C5] hover:underline">See profit and loss report</Link>
        <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={16} className="text-gray-400" /></button>
      </div>
    </div>
  );
}

function ExpensesCard({ expenses, formatCurrency }: { expenses: number; formatCurrency: (v: number) => string }) {
  return (
    <div className="qb-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expenses</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          Last 30 days <ChevronDown size={14} />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-1">Spending for last 30 days</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">{formatCurrency(expenses)}</span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Info size={14} /> 100%
        </span>
      </div>
      <div className="flex items-center gap-1 text-sm mb-4">
        <TrendingDown size={14} className="text-[#D4380D]" />
        <span className="text-[#D4380D] font-medium">Down 62%</span>
        <span className="text-gray-500">from prior 30 days</span>
      </div>
      <div className="flex items-center justify-center h-24 mb-2">
        <div className="w-20 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: "Expenses", value: expenses || 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={35} innerRadius={15}>
                <Cell fill="#0097A7" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <div className="w-2 h-2 rounded-full bg-[#0097A7]" />
        <span>Operating Expenses</span>
        <span className="ml-auto font-medium">{formatCurrency(expenses)}</span>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link href="/expenses" className="text-sm text-[#0077C5] hover:underline">View all spending</Link>
        <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={16} className="text-gray-400" /></button>
      </div>
    </div>
  );
}

function BankAccountsCard({ companyName, bankBalance, qbBalance, forReview, formatCurrency }: { companyName?: string; bankBalance: number; qbBalance: number; forReview: number; formatCurrency: (v: number) => string }) {
  return (
    <div className="qb-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Accounts</h3>
        <span className="text-xs text-gray-500">As of today</span>
      </div>
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">RA</span>
          </div>
          <span className="font-medium text-gray-800">{companyName || "RusingAcademy"}</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-xs text-gray-500">Bank balance</div>
            <div className="font-semibold text-gray-800">{formatCurrency(bankBalance)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">In QuickBooks</div>
            <div className="font-semibold text-gray-800">{formatCurrency(qbBalance)}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Updated just now</span>
          <Link href="/bank-transactions" className="text-xs text-[#0077C5] font-medium">{forReview} to review</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/bank-transactions" className="text-sm text-[#0077C5] hover:underline flex items-center gap-1">
            Go to registers <ChevronDown size={14} />
          </Link>
          <button className="p-1 hover:bg-gray-100 rounded"><Settings size={14} className="text-gray-400" /></button>
          <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={14} className="text-gray-400" /></button>
        </div>
      </div>
    </div>
  );
}

function CashFlowCard({ qbBalance, cashFlowData, formatCurrency }: { qbBalance: number; cashFlowData: any[]; formatCurrency: (v: number) => string }) {
  return (
    <div className="qb-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cash Flow (Linked Bank Transactions)</h3>
          <p className="text-xs text-gray-400 mt-1">Last updated just now</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">Today's cash balance</p>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(qbBalance)}</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip />
            <Area type="monotone" dataKey="cashBalance" stroke="#2CA01C" fill="#2CA01C" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="projectedBalance" stroke="#a3d977" fill="#a3d977" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-[#2CA01C]" /> Cash balance</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-[#a3d977]" style={{ borderTop: "1px dashed" }} /> Projected balance</div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-gray-300" /> Threshold</div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <button className="text-sm text-[#0077C5] hover:underline">View cash flow</button>
        <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={16} className="text-gray-400" /></button>
      </div>
    </div>
  );
}

function RecentActivityCard({ activity }: { activity: any[] }) {
  if (!activity || activity.length === 0) return null;
  return (
    <div className="qb-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Activity</h3>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </div>
      <div className="space-y-3">
        {activity.slice(0, 8).map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.type === "invoice" ? "bg-blue-50 text-blue-600" :
              item.type === "expense" ? "bg-red-50 text-red-600" :
              item.type === "payment" ? "bg-green-50 text-green-600" :
              "bg-gray-50 text-gray-600"
            }`}>
              {item.type === "invoice" ? <FileText size={14} /> :
               item.type === "expense" ? <CreditCard size={14} /> :
               item.type === "payment" ? <DollarSign size={14} /> :
               <AlertCircle size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{item.description}</p>
              <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
            </div>
            {item.amount && (
              <span className={`text-sm font-medium flex-shrink-0 ${
                item.type === "payment" || item.type === "invoice" ? "text-[#2CA01C]" : "text-gray-800"
              }`}>
                ${Math.abs(item.amount).toLocaleString("en-CA", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Link href="/reports" className="text-sm text-[#0077C5] hover:underline">View all activity</Link>
      </div>
    </div>
  );
}

function SuggestionsCard() {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Suggestions for you</h2>
      <div className="qb-card mb-6 max-w-md">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Discover More</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Streamline your invoicing</h3>
        <p className="text-sm text-gray-600 mb-3">Send invoice reminders automatically and schedule recurring invoices.</p>
        <Link href="/recurring-transactions" className="text-sm text-[#0077C5] hover:underline font-medium">Learn how</Link>
      </div>
    </>
  );
}
