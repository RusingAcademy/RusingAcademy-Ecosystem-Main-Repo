/*
 * QuickBooks Authentic — Suppliers page (live API data with accounting balances)
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, MoreVertical, Search, Filter, Truck, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import { EmptyState } from "@/components/EmptyState";

const PAGE_SIZE = 20;

export default function Suppliers() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "balance">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { data: suppliers, isLoading } = trpc.suppliers.list.useQuery(
    searchTerm ? { search: searchTerm } : undefined
  );
  const { data: balances } = trpc.reports.supplierBalances.useQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton columns={5} rows={10} />
      </div>
    );
  }

  const allSuppliers = (suppliers || []) as any[];

  // Merge balances from accounting engine
  const balanceMap = new Map<number, number>();
  if (balances) {
    for (const b of balances as any[]) {
      balanceMap.set(b.id, b.balance);
    }
  }

  const suppliersWithBalances = allSuppliers.map((s: any) => ({
    ...s,
    computedBalance: balanceMap.get(s.id) || 0,
  }));

  // Sort
  const sorted = [...suppliersWithBalances].sort((a, b) => {
    if (sortField === "balance") {
      return sortDir === "asc" ? a.computedBalance - b.computedBalance : b.computedBalance - a.computedBalance;
    }
    const aName = (a.displayName || "").toLowerCase();
    const bName = (b.displayName || "").toLowerCase();
    return sortDir === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalBalance = suppliersWithBalances.reduce((sum: number, s: any) => sum + s.computedBalance, 0);
  const withBalance = suppliersWithBalances.filter((s: any) => Math.abs(s.computedBalance) > 0).length;

  const toggleSort = (field: "name" | "balance") => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <button className="qb-btn-green flex items-center gap-1" onClick={() => navigate("/suppliers/new")}>
          <Plus size={16} /> New supplier
        </button>
      </div>

      {/* Summary Bar */}
      <div className="qb-card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Suppliers</h3>
            <div className="text-2xl font-bold text-gray-900">{allSuppliers.length}</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Open Balance</h3>
            <div className="text-lg font-bold text-gray-900">${totalBalance.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{withBalance} WITH BALANCE</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
            <div className="text-lg font-bold text-green-600">{allSuppliers.length} Active</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Supplier Table */}
      <div className="bg-white dark:bg-background rounded-lg border border-gray-200 dark:border-border dark:border-border overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8"><input type="checkbox" className="rounded" /></th>
              <th>
                <button className="flex items-center gap-1 hover:text-gray-900" onClick={() => toggleSort("name")}>
                  Supplier <ArrowUpDown size={12} className={sortField === "name" ? "text-green-600" : "text-gray-400"} />
                </button>
              </th>
              <th>Company</th>
              <th>Phone</th>
              <th className="text-right">
                <button className="flex items-center gap-1 ml-auto hover:text-gray-900" onClick={() => toggleSort("balance")}>
                  Open Balance <ArrowUpDown size={12} className={sortField === "balance" ? "text-green-600" : "text-gray-400"} />
                </button>
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((sup: any) => (
              <tr key={sup.id} className="hover:bg-gray-50 dark:bg-background cursor-pointer" onClick={() => navigate(`/suppliers/${sup.id}`)}>
                <td onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                <td className="text-sky-600 font-medium">{sup.displayName}</td>
                <td className="text-gray-600">{sup.company || "—"}</td>
                <td className="text-gray-600">{sup.phone || sup.mobile || "—"}</td>
                <td className="text-right font-medium">
                  <span className={sup.computedBalance > 0 ? "text-red-700" : "text-gray-800"}>
                    ${sup.computedBalance.toFixed(2)}
                  </span>
                </td>
                <td>
                  <button className="p-1 hover:bg-gray-100 dark:bg-card rounded" onClick={(e) => { e.stopPropagation(); toast("Feature coming soon"); }}>
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState icon={Truck} title="No suppliers found" description="Add your first supplier to start tracking expenses." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-border dark:border-border bg-gray-50">
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
