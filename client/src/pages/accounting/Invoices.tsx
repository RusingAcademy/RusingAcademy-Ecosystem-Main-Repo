/*
 * QuickBooks Authentic — Invoices page
 * Money bar summary → Filter tabs → Sortable, paginated invoice table (live API data)
 * Enhanced with batch operations: multi-select, bulk status change, bulk send, bulk delete
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Send, MoreVertical, Search, ChevronLeft, ChevronRight, ArrowUpDown, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";

const PAGE_SIZE = 20;

export default function Invoices() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"date" | "number" | "customer" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBulkStatusMenu, setShowBulkStatusMenu] = useState(false);

  const utils = trpc.useUtils();
  const { data: invoices, isLoading } = trpc.invoices.list.useQuery();

  const bulkStatusMutation = trpc.bulk.updateInvoiceStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`Updated ${data.count} invoice(s)`);
      setSelectedIds(new Set());
      setShowBulkStatusMenu(false);
      utils.invoices.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const bulkDeleteMutation = trpc.bulk.deleteInvoices.useMutation({
    onSuccess: (data) => {
      toast.success(`Deleted ${data.count} invoice(s)`);
      setSelectedIds(new Set());
      utils.invoices.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  const allInvoices = (invoices || []) as Array<any>;

  const normalizedInvoices = allInvoices.map((row) => ({
    id: row.id,
    invoiceNumber: row.invoiceNumber ?? "",
    invoiceDate: row.invoiceDate,
    customerName: row.customerName ?? "",
    total: row.total ?? "0",
    amountDue: row.amountDue ?? row.total ?? "0",
    status: row.status ?? "Draft",
  }));

  // Filter by status
  const statusFiltered = statusFilter === "All"
    ? normalizedInvoices
    : normalizedInvoices.filter((i) => i.status === statusFilter);

  // Filter by search
  const searchFiltered = searchTerm
    ? statusFiltered.filter((i) =>
        i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : statusFiltered;

  // Sort
  const sorted = [...searchFiltered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "date":
        return dir * (new Date(a.invoiceDate || 0).getTime() - new Date(b.invoiceDate || 0).getTime());
      case "number":
        return dir * a.invoiceNumber.localeCompare(b.invoiceNumber);
      case "customer":
        return dir * a.customerName.localeCompare(b.customerName);
      case "amount":
        return dir * (Number(a.total) - Number(b.total));
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary calculations
  const overdueInvoices = normalizedInvoices.filter((i) => i.status === "Overdue");
  const depositedInvoices = normalizedInvoices.filter((i) => i.status === "Deposited" || i.status === "Paid");
  const notDueInvoices = normalizedInvoices.filter((i) => i.status !== "Overdue" && i.status !== "Deposited" && i.status !== "Paid" && i.status !== "Voided");
  const overdueTotal = overdueInvoices.reduce((sum: number, i) => sum + Number(i.amountDue || 0), 0);
  const depositedTotal = depositedInvoices.reduce((sum: number, i) => sum + Number(i.total || 0), 0);
  const notDueTotal = notDueInvoices.reduce((sum: number, i) => sum + Number(i.amountDue || 0), 0);

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
    <button aria-label="Action"
      className={`flex items-center gap-1 hover:text-gray-900 dark:text-foreground ${align === "right" ? "ml-auto" : ""}`}
      onClick={() => toggleSort(field)}
    >
      {label} <ArrowUpDown size={12} className={sortField === field ? "text-green-600" : "text-gray-400"} />
    </button>
  );

  // Batch selection helpers
  const pageIds = paginated.map(i => i.id);
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

  const handleBulkStatus = (status: string) => {
    if (selectedIds.size === 0) return;
    bulkStatusMutation.mutate({ ids: Array.from(selectedIds), status: status as any });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} invoice(s)? This action cannot be undone.`)) return;
    bulkDeleteMutation.mutate({ ids: Array.from(selectedIds) });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <div className="flex items-center gap-2">
          <button aria-label="Action" className="qb-btn-green flex items-center gap-1" onClick={() => navigate("/invoices/new")}>
            Create invoice
          </button>
          <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
            <Send size={14} /> Send reminders
          </button>
        </div>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{selectedIds.size} invoice(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Bulk Status Change */}
            <div className="relative">
              <button aria-label="Action"
                className="qb-btn-outline text-sm flex items-center gap-1"
                onClick={() => setShowBulkStatusMenu(!showBulkStatusMenu)}
              >
                Change status
              </button>
              {showBulkStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-lg shadow-lg z-20 py-1 w-40">
                  {["Draft", "Sent", "Paid", "Overdue", "Voided"].map(status => (
                    <button
                      key={status}
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md text-gray-700"
                      onClick={() => handleBulkStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Bulk Send */}
            <button aria-label="Action"
              className="qb-btn-outline text-sm flex items-center gap-1"
              onClick={() => {
                handleBulkStatus("Sent");
              }}
            >
              <Send size={14} /> Mark as Sent
            </button>
            {/* Bulk Delete */}
            <button aria-label="Action"
              className="text-sm flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
              onClick={handleBulkDelete}
            >
              <Trash2 size={14} /> Delete
            </button>
            {/* Clear Selection */}
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-muted-foreground px-2"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Money Bar Summary */}
      <div className="qb-card mb-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Unpaid Last 365 Days</h3>
            <div className="qb-money-bar mb-3">
              <div className="bg-amber-500" style={{ flex: Math.max(overdueTotal, 0.1) }} />
              <div className="bg-gray-300" style={{ flex: Math.max(notDueTotal, 0.1) }} />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xl font-bold text-gray-900">${overdueTotal.toFixed(2)}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> {overdueInvoices.length} OVERDUE
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">${notDueTotal.toFixed(2)}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300" /> {notDueInvoices.length} NOT DUE YET
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Paid</h3>
            <div className="qb-money-bar mb-3">
              <div className="bg-gray-300" style={{ flex: 0.1 }} />
              <div className="bg-green-600" style={{ flex: Math.max(depositedTotal, 0.1) }} />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xl font-bold text-gray-900">${depositedTotal.toFixed(2)}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" /> {depositedInvoices.length} DEPOSITED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/15 dark:border-white/15">
          {["All", "Draft", "Sent", "Overdue", "Partial", "Paid", "Deposited", "Voided"].map(tab => (
            <button
              key={tab}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                statusFilter === tab
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => { setStatusFilter(tab); setPage(1); setSelectedIds(new Set()); }}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1 text-xs text-gray-400">
                  ({normalizedInvoices.filter(i => i.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm w-48 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
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
              <th><SortHeader field="number" label="No." /></th>
              <th><SortHeader field="customer" label="Customer" /></th>
              <th className="text-right"><SortHeader field="amount" label="Amount" align="right" /></th>
              <th>Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv: any) => (
              <tr
                key={inv.id}
                className={`hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md cursor-pointer ${selectedIds.has(inv.id) ? "bg-blue-50" : ""}`}
                onClick={() => navigate(`/invoices/${inv.id}`)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedIds.has(inv.id)}
                    onChange={() => toggleOne(inv.id)}
                  />
                </td>
                <td className="text-gray-700">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-CA") : ""}</td>
                <td className="text-sky-600 font-medium">{inv.invoiceNumber}</td>
                <td className="text-gray-800">{inv.customerName || ""}</td>
                <td className="text-right font-medium text-gray-800">${Number(inv.total || 0).toFixed(2)}</td>
                <td>
                  <StatusBadge status={inv.status} />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button aria-label="Action" className="p-1 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded" onClick={() => navigate(`/invoices/${inv.id}`)}>
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState icon={Send} title="No invoices found" description="Create your first invoice to start tracking sales." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-white/15 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              <button aria-label="Action"
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button aria-label="Action"
                    key={pageNum}
                    className={`w-8 h-8 rounded text-sm ${page === pageNum ? "bg-green-600 text-white" : "hover:bg-gray-200 text-gray-700"}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button aria-label="Action"
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
