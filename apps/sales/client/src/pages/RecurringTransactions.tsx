import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, RefreshCw, Calendar, Pause, Play, Loader2, Zap, FileText, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

const typeColors: Record<string, string> = {
  Invoice: "bg-blue-100 text-blue-700",
  Expense: "bg-orange-100 text-orange-700",
  Bill: "bg-purple-100 text-purple-700",
  "Journal Entry": "bg-gray-100 text-gray-700",
};

const CURRENCIES = ["CAD", "USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CNY", "MXN"];

export default function RecurringTransactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "log">("templates");
  const [form, setForm] = useState({
    templateName: "",
    transactionType: "" as string,
    frequency: "" as string,
    intervalCount: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    customerId: "",
    currency: "CAD",
    netTermsDays: 30,
    lineItems: [{ description: "", quantity: "1", rate: "0.00", amount: "0.00" }],
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: recurring, isLoading } = trpc.recurring.list.useQuery(
    typeFilter ? { type: typeFilter } : undefined
  );
  const { data: customers } = trpc.customers.list.useQuery();
  const { data: dueItems, refetch: refetchDue } = trpc.recurringAutoGen.getDue.useQuery();
  const { data: generationLog, isLoading: logLoading } = trpc.recurringAutoGen.generationLog.useQuery(undefined);

  const updateMutation = trpc.recurring.update.useMutation({
    onSuccess: () => { utils.recurring.list.invalidate(); toast.success("Updated"); },
    onError: () => toast.error("Failed to update"),
  });
  const createMutation = trpc.recurring.create.useMutation({
    onSuccess: () => {
      utils.recurring.list.invalidate();
      toast.success("Recurring template created");
      setShowCreate(false);
    },
    onError: (err) => toast.error(err.message),
  });
  const processMutation = trpc.recurringAutoGen.process.useMutation({
    onSuccess: (result) => {
      toast.success((result as any)?.message || "Transaction generated");
      utils.recurring.list.invalidate();
      utils.recurringAutoGen.generationLog.invalidate();
      refetchDue();
    },
    onError: () => toast.error("Failed to generate transaction"),
  });
  const processAllMutation = trpc.recurringAutoGen.processAll.useMutation({
    onSuccess: (result) => {
      toast.success(`Processed ${(result as any)?.processed || 0} recurring transactions`);
      utils.recurring.list.invalidate();
      utils.recurringAutoGen.generationLog.invalidate();
      refetchDue();
    },
    onError: () => toast.error("Failed to process recurring transactions"),
  });

  const dueCount = (dueItems as any[])?.length || 0;
  const filtered = (recurring || []).filter((r: any) =>
    !search || r.templateName?.toLowerCase().includes(search.toLowerCase())
  );
  const [page, setPage] = useState(1);
  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const lineItemsTotal = useMemo(() => {
    return form.lineItems.reduce((sum, li) => sum + parseFloat(li.amount || "0"), 0);
  }, [form.lineItems]);

  const updateLineItem = (index: number, field: string, value: string) => {
    const items = [...form.lineItems];
    (items[index] as any)[field] = value;
    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(items[index].quantity || "0");
      const rate = parseFloat(items[index].rate || "0");
      items[index].amount = (qty * rate).toFixed(2);
    }
    setForm({ ...form, lineItems: items });
  };

  const addLineItem = () => {
    setForm({ ...form, lineItems: [...form.lineItems, { description: "", quantity: "1", rate: "0.00", amount: "0.00" }] });
  };

  const removeLineItem = (index: number) => {
    if (form.lineItems.length <= 1) return;
    setForm({ ...form, lineItems: form.lineItems.filter((_, i) => i !== index) });
  };

  const handleCreate = () => {
    const templateData = form.transactionType === "Invoice" ? {
      customerId: form.customerId ? parseInt(form.customerId) : undefined,
      currency: form.currency,
      netTermsDays: form.netTermsDays,
      lineItems: form.lineItems,
      subtotal: lineItemsTotal.toFixed(2),
      taxAmount: "0.00",
      total: lineItemsTotal.toFixed(2),
      notes: form.notes,
    } : undefined;

    createMutation.mutate({
      templateName: form.templateName,
      transactionType: form.transactionType as any,
      frequency: form.frequency as any,
      intervalCount: form.intervalCount,
      startDate: new Date(form.startDate),
      nextDate: new Date(form.startDate),
      ...(form.endDate ? { endDate: new Date(form.endDate) } : {}),
      ...(templateData ? { templateData } : {}),
    });
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recurring Transactions</h1>
        <Button className="bg-[#2CA01C] hover:bg-[#248a17]" onClick={() => {
          setForm({
            templateName: "", transactionType: "", frequency: "", intervalCount: 1,
            startDate: new Date().toISOString().split("T")[0], endDate: "",
            customerId: "", currency: "CAD", netTermsDays: 30,
            lineItems: [{ description: "", quantity: "1", rate: "0.00", amount: "0.00" }],
            notes: "",
          });
          setShowCreate(true);
        }}>
          <Plus size={16} className="mr-1" /> New recurring
        </Button>
      </div>

      {/* Auto-generation banner */}
      {dueCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">{dueCount} recurring transaction{dueCount > 1 ? "s" : ""} due for generation</p>
              <p className="text-xs text-amber-600">Generate invoices and expenses from your templates</p>
            </div>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => processAllMutation.mutate()} disabled={processAllMutation.isPending}>
            {processAllMutation.isPending ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
            Process All ({dueCount})
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "templates" ? "border-[#2CA01C] text-[#2CA01C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("templates")}>
          <RefreshCw size={14} className="inline mr-1.5" />Templates
        </button>
        <button className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "log" ? "border-[#2CA01C] text-[#2CA01C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("log")}>
          <Clock size={14} className="inline mr-1.5" />Generation Log
        </button>
      </div>

      {activeTab === "templates" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="qb-card"><div className="text-xs font-bold text-gray-500 uppercase mb-1">Total Templates</div><div className="text-2xl font-bold text-gray-800">{(recurring || []).length}</div></div>
            <div className="qb-card"><div className="text-xs font-bold text-gray-500 uppercase mb-1">Active</div><div className="text-2xl font-bold text-[#2CA01C]">{(recurring || []).filter((r: any) => r.isActive).length}</div></div>
            <div className="qb-card"><div className="text-xs font-bold text-gray-500 uppercase mb-1">Paused</div><div className="text-2xl font-bold text-gray-500">{(recurring || []).filter((r: any) => !r.isActive).length}</div></div>
            <div className="qb-card">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Due This Week</div>
              <div className="text-2xl font-bold text-[#0077C5]">
                {(recurring || []).filter((r: any) => {
                  if (!r.nextDate || !r.isActive) return false;
                  const next = new Date(r.nextDate);
                  const now = new Date();
                  return next >= now && next <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                }).length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search templates..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2CA01C] focus:border-transparent" />
            </div>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All types</option>
              <option value="Invoice">Invoice</option>
              <option value="Expense">Expense</option>
              <option value="Bill">Bill</option>
              <option value="Journal Entry">Journal Entry</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Template Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Frequency</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Next Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center">
                    <RefreshCw size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No recurring transactions</p>
                    <p className="text-gray-400 text-xs mt-1">Set up templates to automate invoices, expenses, and bills</p>
                  </td></tr>
                ) : paginated.map((rec: any) => {
                  const tpl = rec.templateData as any;
                  const amount = tpl?.total || tpl?.amount;
                  const isDue = rec.isActive && rec.nextDate && new Date(rec.nextDate) <= new Date();
                  return (
                    <tr key={rec.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isDue ? "bg-amber-50/50" : ""}`}>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><RefreshCw size={14} className="text-gray-400" /><span className="text-sm font-medium text-gray-800">{rec.templateName}</span></div></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[rec.transactionType] || "bg-gray-100 text-gray-600"}`}>{rec.transactionType}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">Every {rec.intervalCount > 1 ? `${rec.intervalCount} ` : ""}{rec.frequency?.toLowerCase()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400" />
                          {rec.nextDate ? new Date(rec.nextDate).toLocaleDateString("en-CA") : "—"}
                          {isDue && <span className="ml-1 text-xs text-amber-600 font-medium">Due</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {amount ? `$${parseFloat(amount).toLocaleString("en-CA", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {rec.isActive ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {isDue && (
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 text-xs"
                              onClick={() => processMutation.mutate({ id: rec.id })} disabled={processMutation.isPending}>
                              {processMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-xs"
                            onClick={() => updateMutation.mutate({ id: rec.id, isActive: !rec.isActive })} disabled={updateMutation.isPending}>
                            {rec.isActive ? <Pause size={12} /> : <Play size={12} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Generation Log Tab */}
      {activeTab === "log" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Template</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Generated ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Error</th>
              </tr>
            </thead>
            <tbody>
              {logLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" size={16} />Loading...</td></tr>
              ) : !generationLog || (generationLog as any[]).length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center">
                  <Clock size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No generation history yet</p>
                  <p className="text-gray-400 text-xs mt-1">Entries will appear here when recurring transactions are processed</p>
                </td></tr>
              ) : (generationLog as any[]).map((log: any) => {
                const template = (recurring || []).find((r: any) => r.id === log.recurringTransactionId);
                return (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{log.generatedAt ? new Date(log.generatedAt).toLocaleString("en-CA") : "—"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{template?.templateName || `Template #${log.recurringTransactionId}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.generatedEntityType}</td>
                    <td className="px-4 py-3">
                      {log.status === "success" ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700"><CheckCircle size={12} /> Success</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-700"><XCircle size={12} /> Failed</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.generatedEntityId ? (
                        <Link href={`/invoices/${log.generatedEntityId}`} className="text-[#0077C5] hover:underline flex items-center gap-1">
                          #{log.generatedEntityId} <ChevronRight size={12} />
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-500 max-w-[200px] truncate">{log.errorMessage || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Recurring Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Recurring Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Template Name</label>
              <input type="text" value={form.templateName} onChange={e => setForm({ ...form, templateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="e.g., Monthly Consulting Invoice" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Transaction Type</label>
                <Select value={form.transactionType} onValueChange={v => setForm({ ...form, transactionType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Bill">Bill</SelectItem>
                    <SelectItem value="Journal Entry">Journal Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Frequency</label>
                <Select value={form.frequency} onValueChange={v => setForm({ ...form, frequency: v })}>
                  <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Interval</label>
                <input type="number" min={1} value={form.intervalCount} onChange={e => setForm({ ...form, intervalCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">End Date (optional)</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>

            {/* Invoice-specific template fields */}
            {form.transactionType === "Invoice" && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FileText size={14} /> Invoice Template Details</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Customer</label>
                    <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="">Select customer</option>
                      {(customers as any[] || []).map((c: any) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Currency</label>
                    <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Net Terms (days)</label>
                    <input type="number" min={0} value={form.netTermsDays} onChange={e => setForm({ ...form, netTermsDays: parseInt(e.target.value) || 30 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Line Items</label>
                  <div className="space-y-2">
                    {form.lineItems.map((li, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input className="col-span-5 px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Description"
                          value={li.description} onChange={e => updateLineItem(idx, "description", e.target.value)} />
                        <input className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm text-right" placeholder="Qty"
                          type="number" min="0" step="1" value={li.quantity} onChange={e => updateLineItem(idx, "quantity", e.target.value)} />
                        <input className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm text-right" placeholder="Rate"
                          type="number" min="0" step="0.01" value={li.rate} onChange={e => updateLineItem(idx, "rate", e.target.value)} />
                        <span className="col-span-2 text-sm font-medium text-right">${li.amount}</span>
                        <button className="col-span-1 text-red-400 hover:text-red-600 text-center" onClick={() => removeLineItem(idx)}
                          disabled={form.lineItems.length <= 1}>&times;</button>
                      </div>
                    ))}
                  </div>
                  <button className="text-sm text-[#0077C5] hover:underline mt-2" onClick={addLineItem}>+ Add line item</button>
                  <div className="flex justify-end mt-2 text-sm font-semibold text-gray-700">Total: ${lineItemsTotal.toFixed(2)} {form.currency}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" rows={2} placeholder="Notes to include on generated invoices" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}
              disabled={createMutation.isPending || !form.templateName || !form.transactionType || !form.frequency}
              className="bg-[#2CA01C] hover:bg-[#248a17]">
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
