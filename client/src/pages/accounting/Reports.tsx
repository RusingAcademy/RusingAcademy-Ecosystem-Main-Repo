/*
 * QuickBooks Authentic — Reports page (no static data dependency)
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Star, ChevronDown, ChevronRight, MoreVertical, FileText } from "lucide-react";
import { toast } from "sonner";

const reportRoutes: Record<string, string> = {
  "Profit and Loss": "/reports/profit-and-loss",
  "Profit and Loss Detail": "/reports/profit-and-loss",
  "Balance Sheet": "/reports/balance-sheet",
  "Balance Sheet Detail": "/reports/balance-sheet",
  "Trial Balance": "/reports/trial-balance",
  "General Ledger": "/reports/general-ledger",
  "Accounts Receivable Ageing Summary": "/reports/aging",
  "Accounts Receivable Ageing Detail": "/reports/aging",
  "Accounts Payable Ageing Summary": "/reports/aging",
  "Accounts Payable Ageing Detail": "/reports/aging",
  "Audit Log": "/audit-log",
  "Customer Balance Summary": "/reports/customer-balances",
  "Supplier Balance Summary": "/reports/supplier-balances",
  "Invoice List": "/invoices",
  "Unpaid Bills": "/bills",
  "Account List": "/chart-of-accounts",
  "Cash Flow Statement": "/reports/balance-sheet",
};

const reportCategories = [
  {
    title: "Favourites",
    reports: ["Profit and Loss", "Balance Sheet"],
  },
  {
    title: "Business overview",
    reports: [
      "Audit Log", "Profit and Loss", "Profit and Loss Detail",
      "Balance Sheet", "Balance Sheet Detail", "Cash Flow Statement", "Trial Balance",
    ],
  },
  {
    title: "Who owes you",
    reports: [
      "Accounts Receivable Ageing Summary", "Accounts Receivable Ageing Detail",
      "Customer Balance Summary", "Customer Balance Detail",
      "Invoice List", "Collections Report",
    ],
  },
  {
    title: "Sales and customers",
    reports: [
      "Deposit Detail", "Estimates by Customer", "Income by Customer Summary",
      "Product/Service List", "Sales by Customer Summary", "Sales by Product/Service Summary",
    ],
  },
  {
    title: "What you owe",
    reports: [
      "Accounts Payable Ageing Summary", "Accounts Payable Ageing Detail",
      "Bill Payment List", "Supplier Balance Summary", "Unpaid Bills",
    ],
  },
  {
    title: "Expenses and suppliers",
    reports: [
      "Cheque Detail", "Expenses by Supplier Summary", "Transaction List by Supplier",
    ],
  },
  {
    title: "For my accountant",
    reports: [
      "Account List", "General Ledger", "Journal", "Recent Transactions",
      "Transaction Detail by Account", "Transaction List by Date", "Trial Balance",
    ],
  },
];

export default function Reports() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    reportCategories.map(c => c.title)
  );

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredCategories = search
    ? reportCategories.map(cat => ({
        ...cat,
        reports: cat.reports.filter(r => r.toLowerCase().includes(search.toLowerCase())),
      })).filter(cat => cat.reports.length > 0)
    : reportCategories;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <div className="flex items-center gap-2 text-sm">
            <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-md font-medium text-gray-800">Standard reports</button>
            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 dark:bg-slate-900 rounded-md" onClick={() => toast("Feature coming soon")}>Custom reports</button>
            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 dark:bg-slate-900 rounded-md" onClick={() => toast("Feature coming soon")}>Management reports</button>
          </div>
        </div>
      </div>

      {/* Financial Planning Section */}
      <div className="qb-card mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-bold text-gray-700">Financial planning</h3>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-sky-600 hover:underline" onClick={() => toast("Feature coming soon")}>Cash flow overview</button>
          <button className="text-sm text-sky-600 hover:underline" onClick={() => toast("Feature coming soon")}>Cash flow planner</button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Type report name here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
        />
      </div>

      {/* Report Categories */}
      <div className="space-y-2">
        {filteredCategories.map((category) => (
          <div key={category.title} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 dark:border-slate-700 overflow-hidden">
            <button aria-label="Action"
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:bg-slate-900 text-left"
              onClick={() => toggleCategory(category.title)}
            >
              {expandedCategories.includes(category.title) ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
              <span className="font-semibold text-gray-800">{category.title}</span>
            </button>

            {expandedCategories.includes(category.title) && (
              <div className="border-t border-gray-100">
                {category.reports.map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:bg-slate-900 cursor-pointer group"
                    onClick={() => {
                      const route = reportRoutes[report];
                      if (route) navigate(route);
                      else toast(`Report: ${report} — coming soon`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-sky-600">{report}</span>
                      <FileText size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                      <button aria-label="Action"
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={(e) => { e.stopPropagation(); toast("Added to favourites"); }}
                      >
                        <Star size={14} className="text-gray-400" />
                      </button>
                      <button aria-label="Action"
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={(e) => { e.stopPropagation(); toast("Feature coming soon"); }}
                      >
                        <MoreVertical size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
