/*
 * QuickBooks Authentic — Expense Detail / Edit Page
 * View expense → Edit inline → Manage line items → Receipt upload
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft, Loader2, Plus, Trash2, Upload, MoreVertical, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import FileAttachments from "@/components/FileAttachments";

type ExpenseLine = {
  id?: number;
  accountId?: number;
  description: string;
  amount: string;
  taxCode?: string;
};

export default function ExpenseDetail() {
  const [, params] = useRoute("/expenses/:id");
  const [, navigate] = useLocation();
  const expenseId = params?.id ? Number(params.id) : 0;
  const isNew = params?.id === "new";

  const { data: expense, isLoading, refetch } = trpc.expenses.getById.useQuery(
    { id: expenseId },
    { enabled: !isNew && expenseId > 0 }
  );
  const { data: accounts } = trpc.accounts.list.useQuery();
  const { data: suppliers } = trpc.suppliers.list.useQuery();
  const { data: taxRates } = trpc.taxRates.list.useQuery();

  const createMutation = trpc.expenses.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Expense recorded");
      navigate(`/expenses/${data.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.expenses.update.useMutation({
    onSuccess: () => {
      toast.success("Expense updated");
      refetch();
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.expenses.delete.useMutation({
    onSuccess: () => {
      toast.success("Expense deleted");
      navigate("/expenses");
    },
    onError: (err) => toast.error(err.message),
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [isEditing, setIsEditing] = useState(isNew);
  const [expenseType, setExpenseType] = useState<"Expense" | "Cheque Expense">("Expense");
  const [payeeName, setPayeeName] = useState("");
  const [payeeType, setPayeeType] = useState<"supplier" | "customer" | "other">("other");
  const [accountId, setAccountId] = useState<number | undefined>();
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [memo, setMemo] = useState("");
  const [lineItems, setLineItems] = useState<ExpenseLine[]>([
    { description: "", amount: "0" },
  ]);

  useMemo(() => {
    if (expense && !isNew) {
      const exp = (expense as any).expense || expense;
      setExpenseType(exp.expenseType || "Expense");
      setPayeeName(exp.payeeName || "");
      setPayeeType(exp.payeeType || "other");
      setAccountId(exp.accountId);
      setExpenseDate(exp.expenseDate ? new Date(exp.expenseDate).toISOString().split("T")[0] : "");
      setPaymentMethod(exp.paymentMethod || "");
      setReferenceNumber(exp.referenceNumber || "");
      setMemo(exp.memo || "");
      const items = (expense as any).lineItems || [];
      if (items.length > 0) {
        setLineItems(items.map((li: any) => ({
          id: li.id,
          accountId: li.accountId,
          description: li.description || "",
          amount: String(li.amount || "0"),
          taxCode: li.taxCode || "",
        })));
      }
    }
  }, [expense, isNew]);

  const total = lineItems.reduce((sum, li) => sum + Number(li.amount || 0), 0);

  const updateLineItem = (index: number, field: keyof ExpenseLine, value: string | number) => {
    setLineItems((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { description: "", amount: "0" }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (isNew) {
      createMutation.mutate({
        expenseType,
        payeeName,
        payeeType,
        accountId,
        expenseDate: new Date(expenseDate),
        paymentMethod,
        referenceNumber,
        subtotal: total.toFixed(2),
        total: total.toFixed(2),
        memo,
        lineItems: lineItems.map((li, i) => ({
          accountId: li.accountId,
          description: li.description,
          amount: li.amount,
          taxCode: li.taxCode,
          sortOrder: i,
        })),
      });
    } else {
      updateMutation.mutate({
        id: expenseId,
        payeeName,
        expenseDate: new Date(expenseDate),
        subtotal: total.toFixed(2),
        total: total.toFixed(2),
        memo,
      });
    }
  };

  const exp = expense ? ((expense as any).expense || expense) : null;

  // Get expense accounts for category dropdown
  const expenseAccounts = (accounts as any[])?.filter((a: any) =>
    a.accountType === "Expenses" || a.accountType === "Cost of Goods Sold" || a.accountType === "Other Expenses"
  ) || [];

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/expenses")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? "Record Expense" : `${exp?.expenseType || "Expense"} #${exp?.referenceNumber || exp?.id}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !isEditing && (
            <>
              <button className="qb-btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
              <div className="relative group">
                <button className="qb-btn-outline p-2"><MoreVertical size={14} /></button>
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-1 w-48 hidden group-hover:block z-50">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 size={14} /> Delete Expense
                  </button>
                </div>
              </div>
            </>
          )}
          {(isNew || isEditing) && (
            <>
              <button className="qb-btn-outline" onClick={() => isNew ? navigate("/expenses") : setIsEditing(false)}>
                Cancel
              </button>
              <button
                className="qb-btn-green"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : isNew ? "Save Expense" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="qb-card">
        {/* Expense Header Fields */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payee</label>
            {isEditing ? (
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Payee name..."
                list="supplier-list"
              />
            ) : (
              <p className="text-gray-800 font-medium">{exp?.payeeName || "—"}</p>
            )}
            <datalist id="supplier-list">
              {(suppliers as any[])?.map((s: any) => (
                <option key={s.id} value={s.displayName} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
              {isEditing ? (
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value as any)}
                >
                  <option>Expense</option>
                  <option>Cheque Expense</option>
                </select>
              ) : (
                <p className="text-gray-800">{exp?.expenseType}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
              {isEditing ? (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{exp?.expenseDate ? new Date(exp.expenseDate).toLocaleDateString("en-CA") : ""}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
              {isEditing ? (
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Credit Card</option>
                  <option>Debit</option>
                  <option>EFT</option>
                </select>
              ) : (
                <p className="text-gray-800">{exp?.paymentMethod || "—"}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ref #</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{exp?.referenceNumber || "—"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Category / Line Items */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category Details</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2 w-8">#</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Category</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Description</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2 w-28">Amount</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2 w-20">Tax</th>
                {isEditing && <th className="w-10"></th>}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((li, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-400">{index + 1}</td>
                  <td className="py-2">
                    {isEditing ? (
                      <select
                        className="w-full border border-gray-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm"
                        value={li.accountId || ""}
                        onChange={(e) => updateLineItem(index, "accountId", Number(e.target.value))}
                      >
                        <option value="">Select category...</option>
                        {expenseAccounts.map((a: any) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-800">
                        {expenseAccounts.find((a: any) => a.id === li.accountId)?.name || "—"}
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full border border-gray-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm"
                        value={li.description}
                        onChange={(e) => updateLineItem(index, "description", e.target.value)}
                        placeholder="Description"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{li.description}</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-right"
                        value={li.amount}
                        onChange={(e) => updateLineItem(index, "amount", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800">${Number(li.amount).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    {isEditing ? (
                      <select
                        className="w-full border border-gray-200 dark:border-slate-700 rounded px-1 py-1.5 text-xs"
                        value={li.taxCode || ""}
                        onChange={(e) => updateLineItem(index, "taxCode", e.target.value)}
                      >
                        <option value="">None</option>
                        {(taxRates as any[])?.map((t: any) => (
                          <option key={t.id} value={t.code}>{t.code}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-500">{li.taxCode || "—"}</span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-2 text-center">
                      <button className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500" onClick={() => removeLineItem(index)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {isEditing && (
            <button className="mt-3 text-sm text-sky-600 hover:underline flex items-center gap-1" onClick={addLineItem}>
              <Plus size={14} /> Add a line
            </button>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start">
          {/* Receipt upload area */}
          {isEditing && (
            <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center w-48">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Drag receipt here</p>
              <p className="text-xs text-gray-400">or click to upload</p>
            </div>
          )}
          <div className="w-64">
            <div className="flex justify-between py-2 text-base font-bold border-t border-gray-200 dark:border-slate-700">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Memo */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Memo</label>
          {isEditing ? (
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Memo..."
            />
          ) : (
            <p className="text-sm text-gray-600">{exp?.memo || "—"}</p>
          )}
        </div>
      </div>

      {/* File Attachments */}
      {!isNew && exp && (
        <div className="qb-card mt-4">
          <FileAttachments entityType="Expense" entityId={expenseId} />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Delete Expense</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this expense? All associated journal entries will be reversed.
            </p>
            <div className="flex justify-end gap-2">
              <button className="qb-btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate({ id: expenseId })}
              >
                {deleteMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
