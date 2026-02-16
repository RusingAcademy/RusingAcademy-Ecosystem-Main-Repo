/*
 * QuickBooks Authentic — Expense Transactions page (live API data with pagination and sorting)
 * Enhanced with batch operations: multi-select and bulk delete
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, MoreVertical, Filter, ChevronDown, CreditCard, Search, ChevronLeft, ChevronRight, ArrowUpDown, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import { EmptyState } from "@/components/EmptyState";

const PAGE_SIZE = 20;

export default function Expenses() {
  const [, navigate] = useLocation();
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"date" | "payee" | "total">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const utils = trpc.useUtils();
  const { data: expenses, isLoading } = trpc.expenses.list.useQuery();

  const bulkDeleteMutation = trpc.bulk.deleteExpenses.useMutation({
    onSuccess: (data) => {
      toast.success(`Deleted ${data.count} expense(s)`);
      setSelectedIds(new Set());
      utils.expenses.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton columns={7} rows={8} />
      </div>
    );
  }

  const allExpenses = (expenses || []) as any[];

  // Filter by type
  const typeFiltered = typeFilter === "All"
    ? allExpenses
    : allExpenses.filter((exp: any) => exp.expenseType === typeFilter);

  // Filter by search
  const searchFiltered = searchTerm
    ? typeFiltered.filter((exp: any) =>
        (exp.payeeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.memo || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : typeFiltered;

  // Sort
  const sorted = [...searchFiltered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "date":
        return dir * (new Date(a.expenseDate || 0).getTime() - new Date(b.expenseDate || 0).getTime());
      case "payee":
        return dir * (a.payeeName || "").localeCompare(b.payeeName || "");
      case "total":
        return dir * (Number(a.total || 0) - Number(b.total || 0));
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary
  const totalAmount = allExpenses.reduce((sum: number, e: any) => sum + Number(e.total || 0), 0);
  const totalTax = allExpenses.reduce((sum: number, e: any) => sum + Number(e.taxAmount || 0), 0);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "date" ? "desc" : "asc");
    }
    setPage(1);
  };

  const SortHeader = ({ field, label, align }: { field: typeof sortField; label: string; align?: string }) => (
    <button
      className={`flex items-center gap-1 hover:text-gray-900 dark:text-gray-100 ${align === "right" ? "ml-auto" : ""}`}
      onClick={() => toggleSort(field)}
    >
      {label} <ArrowUpDown size={12} className={sortField === field ? "text-green-600" : "text-gray-400"} />
    </button>
  );

  // Batch selection helpers
  const pageIds = paginated.map((e: any) => e.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  const somePageSelected = pageIds.some(id => selectedIds.has(id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pageIds.forEach(id => next.delete(id));
    } else {
      pageIds.forEach(id => next.add(id));
    }
    setSelectedIds(next);
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} expense(s)? This action cannot be undone.`)) return;
    bulkDeleteMutation.mutate({ ids: Array.from(selectedIds) });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expense transactions</h1>
        <div className="flex items-center gap-2">
          <button className="qb-btn-green flex items-center gap-1" onClick={() => navigate("/expenses/new")}>
            <Plus size={16} /> Record expense
          </button>
          <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
            Upload receipt
          </button>
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{selectedIds.size} expense(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-sm flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
              onClick={handleBulkDelete}
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 px-2"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="qb-card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Expenses</h3>
            <div className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-gray-500">{allExpenses.length} transactions</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tax</h3>
            <div className="text-lg font-bold text-gray-900">${totalTax.toFixed(2)}</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Types</h3>
            <div className="flex gap-2 flex-wrap">
              {["All", "Expense", "Cheque Expense"].map(type => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    typeFilter === type
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white dark:bg-slate-800 text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => { setTypeFilter(type); setPage(1); setSelectedIds(new Set()); }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
            Date <ChevronDown size={14} />
          </button>
          <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
            Payee <ChevronDown size={14} />
          </button>
          <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
            <Filter size={14} /> More filters
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payee or memo..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm w-56 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 dark:border-slate-700 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={allPageSelected}
                  ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                  onChange={toggleAll}
                />
              </th>
              <th><SortHeader field="date" label="Date" /></th>
              <th>Type</th>
              <th><SortHeader field="payee" label="Payee" /></th>
              <th className="text-right">Before Tax</th>
              <th className="text-right">Tax</th>
              <th className="text-right"><SortHeader field="total" label="Total" align="right" /></th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((exp: any) => {
              return (
                <tr
                  key={exp.id}
                  className={`hover:bg-gray-50 dark:bg-slate-900 cursor-pointer ${selectedIds.has(exp.id) ? "bg-blue-50" : ""}`}
                  onClick={() => navigate(`/expenses/${exp.id}`)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedIds.has(exp.id)}
                      onChange={() => toggleOne(exp.id)}
                    />
                  </td>
                  <td className="text-gray-700">{exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString("en-CA") : ""}</td>
                  <td className="text-gray-600">{exp.expenseType || "Expense"}</td>
                  <td className="text-sky-600 font-medium">{exp.payeeName || "—"}</td>
                  <td className="text-right text-gray-800">${Number(exp.subtotal || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</td>
                  <td className="text-right text-gray-600">${Number(exp.taxAmount || 0).toFixed(2)}</td>
                  <td className="text-right font-medium text-gray-800">${Number(exp.total || 0).toLocaleString("en-CA", { minimumFractionDigits: 2 })}</td>
                  <td>
                    <button className="p-1 hover:bg-gray-100 dark:bg-slate-800 rounded" onClick={(e) => { e.stopPropagation(); navigate(`/expenses/${exp.id}`); }}>
                      <MoreVertical size={14} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState icon={CreditCard} title="No expenses found" description="Record your first expense to start tracking spending." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 dark:border-slate-700 bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    className={`w-8 h-8 rounded text-sm ${page === pageNum ? "bg-green-600 text-white" : "hover:bg-gray-200 text-gray-700"}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
