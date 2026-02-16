/*
 * QuickBooks Authentic — Chart of Accounts with management
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, MoreVertical, Search, Loader2, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ACCOUNT_TYPES = [
  "Bank", "Accounts Receivable", "Other Current Assets",
  "Fixed Assets", "Accounts Payable", "Credit Card",
  "Other Current Liabilities", "Long-Term Liabilities",
  "Equity", "Income", "Cost of Goods Sold", "Expenses",
  "Other Income", "Other Expenses",
];

export default function ChartOfAccounts() {
  const [, navigate] = useLocation();
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editAccount, setEditAccount] = useState<any>(null);
  const [form, setForm] = useState({ name: "", accountType: "", detailType: "", description: "", accountNumber: "" });
  const utils = trpc.useUtils();

  const { data: accounts, isLoading } = trpc.accounts.list.useQuery();

  const createMutation = trpc.accounts.create.useMutation({
    onSuccess: () => {
      toast.success("Account created");
      utils.accounts.list.invalidate();
      setShowCreate(false);
      setForm({ name: "", accountType: "", detailType: "", description: "", accountNumber: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.accounts.update.useMutation({
    onSuccess: () => {
      toast.success("Account updated");
      utils.accounts.list.invalidate();
      setEditAccount(null);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const allAccounts = (accounts || []) as any[];
  const accountTypes = ["All", ...Array.from(new Set(allAccounts.map((a: any) => a.accountType).filter(Boolean)))];

  const filtered = allAccounts.filter((acc: any) => {
    if (!showInactive && acc.isActive === false) return false;
    if (typeFilter !== "All" && acc.accountType !== typeFilter) return false;
    if (search && !acc.name?.toLowerCase().includes(search.toLowerCase()) &&
        !acc.accountNumber?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((groups: Record<string, any[]>, acc: any) => {
    const key = acc.accountType || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(acc);
    return groups;
  }, {});

  const openEdit = (acc: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditAccount(acc);
    setForm({
      name: acc.name || "",
      accountType: acc.accountType || "",
      detailType: acc.detailType || "",
      description: acc.description || "",
      accountNumber: acc.accountNumber || "",
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chart of accounts</h1>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setShowCreate(true); setForm({ name: "", accountType: "", detailType: "", description: "", accountNumber: "" }); }}>
          <Plus size={16} className="mr-1" /> New Account
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-slate-900"
        >
          {accountTypes.map((t) => (
            <option key={t as string} value={t as string}>{t as string}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded" />
          Show inactive
        </label>
      </div>

      <div className="text-sm text-gray-500 mb-2">{filtered.length} accounts</div>

      {/* Account Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full qb-table">
          <thead>
            <tr className="bg-gray-50">
              <th>Name</th>
              <th>Type</th>
              <th>Detail Type</th>
              <th className="text-right">Balance</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([type, accts]) => (
              <>{/* Group header + rows */}
                <tr key={`header-${type}`} className="bg-gray-50">
                  <td colSpan={5} className="font-bold text-gray-700 text-xs uppercase tracking-wider py-2">
                    {type} ({(accts as any[]).length})
                  </td>
                </tr>
                {(accts as any[]).map((acc: any) => (
                  <tr
                    key={acc.id}
                    className={`hover:bg-gray-50 cursor-pointer ${acc.isActive === false ? "opacity-50" : ""}`}
                    onClick={() => navigate(`/accounts/${acc.id}/register`)}
                  >
                    <td className="text-sky-600 font-medium">
                      {acc.isSubAccount ? <span className="text-gray-300 mr-2">↳</span> : null}
                      {acc.name}
                      {acc.accountNumber ? <span className="text-gray-400 text-xs ml-2">#{acc.accountNumber}</span> : null}
                    </td>
                    <td className="text-gray-600 text-xs">{acc.accountType}</td>
                    <td className="text-gray-600 text-xs">{acc.detailType || "—"}</td>
                    <td className="text-right font-medium text-gray-800">
                      {acc.balance ? `$${Number(acc.balance).toLocaleString("en-CA", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                          onClick={(e) => openEdit(acc, e)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMutation.mutate({ id: acc.id, isActive: acc.isActive === false ? true : false });
                          }}
                          title={acc.isActive === false ? "Activate" : "Deactivate"}
                        >
                          {acc.isActive === false ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No accounts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Account Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Name</label>
              <input
                type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., Office Supplies"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Type</label>
              <Select value={form.accountType} onValueChange={v => setForm({ ...form, accountType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Detail Type</label>
              <input
                type="text" value={form.detailType} onChange={e => setForm({ ...form, detailType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., Office/General Administrative"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Account Number</label>
                <input
                  type="text" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <input
                  type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={createMutation.isPending || !form.name || !form.accountType}
              className="bg-green-600 hover:bg-green-700"
            >
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={editAccount !== null} onOpenChange={() => setEditAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Name</label>
              <input
                type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Type</label>
              <Select value={form.accountType} onValueChange={v => setForm({ ...form, accountType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Detail Type</label>
              <input
                type="text" value={form.detailType} onChange={e => setForm({ ...form, detailType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <input
                type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAccount(null)}>Cancel</Button>
            <Button
              onClick={() => editAccount && updateMutation.mutate({ id: editAccount.id, name: form.name, accountType: form.accountType, detailType: form.detailType, description: form.description })}
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
