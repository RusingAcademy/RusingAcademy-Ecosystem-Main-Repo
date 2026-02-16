/*
 * QuickBooks Authentic — Customers page (live API data with accounting balances)
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Plus, MoreVertical, Search, Filter, Users, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import { EmptyState } from "@/components/EmptyState";

const PAGE_SIZE = 20;

export default function Customers() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "balance">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { data: customers, isLoading } = trpc.customers.list.useQuery(
    searchTerm ? { search: searchTerm } : undefined
  );
  const { data: balances } = trpc.reports.customerBalances.useQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton columns={5} rows={10} />
      </div>
    );
  }

  const allCustomers = (customers || []) as any[];

  // Merge balances from accounting engine
  const balanceMap = new Map<number, number>();
  if (balances) {
    for (const b of balances as any[]) {
      balanceMap.set(b.id, b.balance);
    }
  }

  const customersWithBalances = allCustomers.map((c: any) => ({
    ...c,
    computedBalance: balanceMap.get(c.id) || 0,
  }));

  // Sort
  const sorted = [...customersWithBalances].sort((a, b) => {
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

  // Summary calculations
  const totalOpenBalance = customersWithBalances.reduce((sum: number, c: any) => sum + Math.max(0, c.computedBalance), 0);
  const overdueCount = customersWithBalances.filter((c: any) => c.computedBalance > 0).length;
  const totalOwed = customersWithBalances.reduce((sum: number, c: any) => sum + c.computedBalance, 0);

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
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button className="qb-btn-green flex items-center gap-1" onClick={() => navigate("/customers/new")}>
          <Plus size={16} /> New customer
        </button>
      </div>

      {/* Summary Bar */}
      <div className="qb-card mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Customers</h3>
            <div className="text-2xl font-bold text-gray-900">{allCustomers.length}</div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Open Balance</h3>
            <div className="qb-money-bar mb-2">
              <div className="bg-amber-500" style={{ flex: Math.max(totalOpenBalance, 0.1) }} />
              <div className="bg-gray-300" style={{ flex: 0.1 }} />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-lg font-bold text-gray-900">${totalOpenBalance.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{overdueCount} WITH BALANCE</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Owed</h3>
            <div className="text-lg font-bold text-gray-900">${totalOwed.toFixed(2)}</div>
            <div className="text-xs text-gray-500">From journal entries</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <button className="qb-btn-outline flex items-center gap-1" onClick={() => toast("Feature coming soon")}>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8"><input type="checkbox" className="rounded" /></th>
              <th>
                <button className="flex items-center gap-1 hover:text-gray-900" onClick={() => toggleSort("name")}>
                  Customer <ArrowUpDown size={12} className={sortField === "name" ? "text-green-600" : "text-gray-400"} />
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
            {paginated.map((cust: any) => (
              <tr key={cust.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/customers/${cust.id}`)}>
                <td onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                <td className="text-sky-600 font-medium">{cust.displayName}</td>
                <td className="text-gray-600">{cust.company || "—"}</td>
                <td className="text-gray-600">{cust.phone || cust.mobile || "—"}</td>
                <td className="text-right font-medium">
                  <span className={cust.computedBalance > 0 ? "text-red-700" : "text-gray-800"}>
                    ${cust.computedBalance.toFixed(2)}
                  </span>
                </td>
                <td>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => { e.stopPropagation(); toast("Feature coming soon"); }}>
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState icon={Users} title="No customers found" description="Add your first customer to start tracking sales." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
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
