/**
 * Sprint 46 — Bank Rules Engine & Smart Categorization
 * Manage rules that auto-categorize imported bank transactions
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Loader2, Zap, ToggleLeft, ToggleRight } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Condition = { field: string; operator: string; value: string };

export default function BankRules() {
  const [, navigate] = useLocation();
  const { data: rules, isLoading, refetch } = trpc.bankRules.list.useQuery();
  const { data: accountsList } = trpc.accounts.list.useQuery();
  const createMutation = trpc.bankRules.create.useMutation({
    onSuccess: () => { toast.success("Rule created"); refetch(); setShowCreate(false); resetForm(); },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.bankRules.update.useMutation({
    onSuccess: () => { toast.success("Rule updated"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.bankRules.delete.useMutation({
    onSuccess: () => { toast.success("Rule deleted"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(0);
  const [conditions, setConditions] = useState<Condition[]>([{ field: "description", operator: "contains", value: "" }]);
  const [assignAccountId, setAssignAccountId] = useState<number | undefined>();
  const [assignCategory, setAssignCategory] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(false);

  const resetForm = () => {
    setName(""); setPriority(0);
    setConditions([{ field: "description", operator: "contains", value: "" }]);
    setAssignAccountId(undefined); setAssignCategory(""); setAutoConfirm(false);
  };

  const addCondition = () => setConditions([...conditions, { field: "description", operator: "contains", value: "" }]);
  const removeCondition = (idx: number) => setConditions(conditions.filter((_, i) => i !== idx));
  const updateCondition = (idx: number, key: keyof Condition, val: string) => {
    const updated = [...conditions];
    updated[idx] = { ...updated[idx], [key]: val };
    setConditions(updated);
  };

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Rule name is required"); return; }
    if (conditions.some(c => !c.value.trim())) { toast.error("All conditions must have a value"); return; }
    createMutation.mutate({
      name, priority, conditions,
      assignAccountId, assignCategory: assignCategory || undefined,
      autoConfirm,
    });
  };

  const accounts = (accountsList as any[]) || [];

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/bank-transactions")} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bank Rules</h1>
            <p className="text-sm text-gray-500">Auto-categorize imported bank transactions</p>
          </div>
        </div>
        <button className="qb-btn flex items-center gap-1.5" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> New Rule
        </button>
      </div>

      {/* Create Rule Dialog */}
      {showCreate && (
        <div className="qb-card mb-6 border-2 border-[#2CA01C]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Bank Rule</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rule Name</label>
              <input className="qb-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Amazon purchases" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <input className="qb-input" type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Conditions (When)</label>
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select className="qb-input w-36" value={cond.field} onChange={e => updateCondition(idx, "field", e.target.value)}>
                  <option value="description">Description</option>
                  <option value="amount">Amount</option>
                </select>
                <select className="qb-input w-36" value={cond.operator} onChange={e => updateCondition(idx, "operator", e.target.value)}>
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts with</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="lessThan">Less than</option>
                </select>
                <input className="qb-input flex-1" value={cond.value} onChange={e => updateCondition(idx, "value", e.target.value)} placeholder="Value" />
                {conditions.length > 1 && (
                  <button onClick={() => removeCondition(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addCondition} className="text-xs text-[#0077C5] hover:underline">+ Add condition</button>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actions (Then)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assign to Account</label>
                <select className="qb-input" value={assignAccountId || ""} onChange={e => setAssignAccountId(e.target.value ? Number(e.target.value) : undefined)}>
                  <option value="">— Select —</option>
                  {accounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <input className="qb-input" value={assignCategory} onChange={e => setAssignCategory(e.target.value)} placeholder="e.g., Office Supplies" />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" checked={autoConfirm} onChange={e => setAutoConfirm(e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">Auto-confirm matching transactions</span>
            </label>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button className="qb-btn-outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</button>
            <button className="qb-btn" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Create Rule"}
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
      ) : !rules || rules.length === 0 ? (
        <div className="qb-card text-center py-12">
          <Zap size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-1">No bank rules yet</p>
          <p className="text-sm text-gray-400">Create rules to automatically categorize imported bank transactions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule: any) => (
            <div key={rule.id} className={`qb-card flex items-center justify-between ${!rule.isActive ? "opacity-60" : ""}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <span className="text-xs text-gray-400">Priority: {rule.priority}</span>
                  {rule.autoConfirm && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Auto-confirm</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>
                    When: {((rule.conditions as any[]) || []).map((c: any) => `${c.field} ${c.operator} "${c.value}"`).join(" AND ")}
                  </span>
                  {rule.assignCategory && <span>→ Category: {rule.assignCategory}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateMutation.mutate({ id: rule.id, isActive: !rule.isActive })}
                  className="p-1.5 hover:bg-gray-100 rounded"
                  title={rule.isActive ? "Deactivate" : "Activate"}
                >
                  {rule.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-gray-400" />}
                </button>
                <button
                  onClick={() => { if (confirm("Delete this rule?")) deleteMutation.mutate({ id: rule.id }); }}
                  className="p-1.5 hover:bg-red-50 rounded text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
