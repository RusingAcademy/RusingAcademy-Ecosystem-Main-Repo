import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Search, FileText, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-700",
  Sent: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Converted: "bg-purple-100 text-purple-700",
  Closed: "bg-gray-200 text-gray-600",
};

export default function Estimates() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [convertId, setConvertId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: estimates, isLoading } = trpc.estimates.list.useQuery(
    statusFilter ? { status: statusFilter } : undefined
  );

  const convertMutation = trpc.estimates.convertToInvoice.useMutation({
    onSuccess: (result: any) => {
      toast.success(`Invoice created from estimate`);
      utils.estimates.list.invalidate();
      setConvertId(null);
      if (result?.id) navigate(`/invoices/${result.id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.estimates.update.useMutation({
    onSuccess: () => {
      utils.estimates.list.invalidate();
      toast.success("Estimate updated");
    },
  });

  const fmt = (v: string | null | undefined) =>
    `$${parseFloat(v || "0").toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

  const filtered = (estimates || []).filter((e: any) =>
    !search || e.estimateNumber?.toLowerCase().includes(search.toLowerCase()) ||
    e.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estimates</h1>
        <Link href="/accounting/estimates">
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.info("Opening form...")}>
            <Plus size={16} className="mr-1" /> Create estimate
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search estimates..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-lg border border-gray-200 dark:border-white/15 dark:border-white/15 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/15 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 md:py-8 lg:py-12 text-center">
                  <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No estimates yet</p>
                  <Link href="/accounting/estimates">
                    <button className="mt-3 text-sm text-green-600 font-medium hover:underline">Create your first estimate</button>
                  </Link>
                </td>
              </tr>
            ) : (
              paginated.map((est: any) => (
                <tr key={est.id} className="border-b border-gray-100 dark:border-white/15 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {est.estimateDate ? new Date(est.estimateDate).toLocaleDateString("en-CA") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/estimates/${est.id}`} className="text-sm text-sky-600 hover:underline font-medium">
                      {est.estimateNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{est.customerName || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {est.expiryDate ? new Date(est.expiryDate).toLocaleDateString("en-CA") : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[est.status] || "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600"}`}>
                      {est.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">{fmt(est.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {est.status === "Accepted" && (
                        <button
                          onClick={() => setConvertId(est.id)}
                          className="text-xs text-sky-600 hover:underline font-medium flex items-center gap-1"
                          title="Convert to Invoice"
                        >
                          <ArrowRight size={12} /> Invoice
                        </button>
                      )}
                      {est.status === "Draft" && (
                        <button
                          onClick={() => updateMutation.mutate({ id: est.id, status: "Sent" })}
                          className="text-xs text-green-600 hover:underline font-medium"
                        >
                          Send
                        </button>
                      )}
                      {est.status === "Sent" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMutation.mutate({ id: est.id, status: "Accepted" })}
                            className="text-xs text-green-600 hover:underline font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateMutation.mutate({ id: est.id, status: "Rejected" })}
                            className="text-xs text-red-600 hover:underline font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Convert to Invoice Dialog */}
      <Dialog open={convertId !== null} onOpenChange={() => setConvertId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Estimate to Invoice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            This will create a new invoice with the same line items and customer from this estimate.
            The estimate status will be changed to "Converted".
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertId(null)}>Cancel</Button>
            <Button
              onClick={() => convertId && convertMutation.mutate({ id: convertId })}
              disabled={convertMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {convertMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <ArrowRight size={14} className="mr-1" />}
              Convert to Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
