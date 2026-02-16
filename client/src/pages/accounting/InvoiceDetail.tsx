/*
 * QuickBooks Authentic — Invoice Detail / Edit Page
 * View invoice → Edit inline → Manage line items → Status transitions → Print/PDF
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft, Printer, Send, MoreVertical, Plus, Trash2, Loader2,
  Download, Copy, Eye, CheckCircle, XCircle, DollarSign, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import FileAttachments from "@/components/FileAttachments";

type LineItem = {
  id?: number;
  productId?: number;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
  taxCode?: string;
  taxAmount?: string;
};

export default function InvoiceDetail() {
  const [, params] = useRoute("/invoices/:id");
  const [, navigate] = useLocation();
  const invoiceId = params?.id ? Number(params.id) : 0;
  const isNew = params?.id === "new";

  const { data: invoice, isLoading, refetch } = trpc.invoices.getById.useQuery(
    { id: invoiceId },
    { enabled: !isNew && invoiceId > 0 }
  );
  const { data: customers } = trpc.customers.list.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: taxRates } = trpc.taxRates.list.useQuery();

  const createMutation = trpc.invoices.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Invoice created successfully");
      navigate(`/invoices/${data.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.invoices.update.useMutation({
    onSuccess: () => {
      toast.success("Invoice updated");
      refetch();
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.invoices.delete.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted");
      navigate("/invoices");
    },
    onError: (err) => toast.error(err.message),
  });

  const recordPaymentMutation = trpc.invoices.recordPayment.useMutation({
    onSuccess: (data: any) => {
      toast.success(`Payment recorded. Amount due: $${data?.amountDue || "0.00"}`);
      refetch();
      setShowPaymentDialog(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const sendEmailMutation = trpc.invoices.sendEmail.useMutation({
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success("Invoice email notification sent");
        refetch();
      } else {
        toast.error("Failed to send notification");
      }
      setShowEmailDialog(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { data: emailTemplates } = trpc.emailTemplates.list.useQuery();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Other");

  const [isEditing, setIsEditing] = useState(isNew);
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Net 30");
  const [currency, setCurrency] = useState("CAD");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: "1", rate: "0", amount: "0" },
  ]);

  // Populate form when invoice loads
  useMemo(() => {
    if (invoice && !isNew) {
      const inv = (invoice as any).invoice || invoice;
      setCustomerId(inv.customerId);
      setInvoiceNumber(inv.invoiceNumber || "");
      setInvoiceDate(inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split("T")[0] : "");
      setDueDate(inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : "");
      setNotes(inv.notes || "");
      setTerms(inv.terms || "Net 30");
      setCurrency(inv.currency || "CAD");
      const items = (invoice as any).lineItems || [];
      if (items.length > 0) {
        setLineItems(items.map((li: any) => ({
          id: li.id,
          productId: li.productId,
          description: li.description || "",
          quantity: String(li.quantity || "1"),
          rate: String(li.rate || "0"),
          amount: String(li.amount || "0"),
          taxCode: li.taxCode || "",
          taxAmount: String(li.taxAmount || "0"),
        })));
      }
    }
  }, [invoice, isNew]);

  // Calculate totals
  const subtotal = lineItems.reduce((sum, li) => sum + Number(li.amount || 0), 0);
  const taxAmount = lineItems.reduce((sum, li) => sum + Number(li.taxAmount || 0), 0);
  const total = subtotal + taxAmount;

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      // Auto-calculate amount
      if (field === "quantity" || field === "rate") {
        const qty = Number(updated[index].quantity || 0);
        const rate = Number(updated[index].rate || 0);
        updated[index].amount = (qty * rate).toFixed(2);
        // Auto-calculate tax if taxCode is set
        if (updated[index].taxCode) {
          const taxRate = taxRates?.find((t: any) => t.code === updated[index].taxCode);
          if (taxRate) {
            updated[index].taxAmount = (Number(updated[index].amount) * Number(taxRate.rate)).toFixed(2);
          }
        }
      }
      return updated;
    });
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { description: "", quantity: "1", rate: "0", amount: "0" }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const selectProduct = (index: number, productId: number) => {
    const product = (products as any[])?.find((p: any) => p.id === productId);
    if (product) {
      setLineItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          productId,
          description: product.description || product.name,
          rate: String(product.price || "0"),
          amount: (Number(updated[index].quantity || 1) * Number(product.price || 0)).toFixed(2),
        };
        return updated;
      });
    }
  };

  const handleSave = () => {
    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!invoiceNumber) {
      toast.error("Please enter an invoice number");
      return;
    }

    if (isNew) {
      createMutation.mutate({
        invoiceNumber,
        customerId,
        invoiceDate: new Date(invoiceDate),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2),
        amountDue: total.toFixed(2),
        notes,
        terms,
        currency,
        lineItems: lineItems.map((li, i) => ({
          productId: li.productId,
          description: li.description,
          quantity: li.quantity,
          rate: li.rate,
          amount: li.amount,
          taxCode: li.taxCode,
          taxAmount: li.taxAmount,
          sortOrder: i,
        })),
      });
    } else {
      updateMutation.mutate({
        id: invoiceId,
        invoiceNumber,
        customerId,
        invoiceDate: new Date(invoiceDate),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2),
        notes,
        currency,
      });
    }
  };

  const handleStatusChange = (newStatus: "Sent" | "Paid" | "Voided" | "Overdue" | "Deposited") => {
    updateMutation.mutate({ id: invoiceId, status: newStatus });
  };

  const inv = invoice ? ((invoice as any).invoice || invoice) : null;
  const customerName = invoice ? ((invoice as any).customerName || "") : "";

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
          <button onClick={() => navigate("/invoices")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isNew ? "New Invoice" : `Invoice #${inv?.invoiceNumber || ""}`}
            </h1>
            {!isNew && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                inv?.status === "Overdue" ? "bg-orange-100 text-orange-700" :
                inv?.status === "Deposited" || inv?.status === "Paid" ? "bg-green-100 text-green-700" :
                inv?.status === "Sent" ? "bg-blue-100 text-blue-700" :
                inv?.status === "Voided" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {inv?.status}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !isEditing && (
            <>
              <button className="qb-btn-outline flex items-center gap-1" onClick={() => window.print()}>
                <Printer size={14} /> Print
              </button>
              <button className="qb-btn-outline flex items-center gap-1" onClick={() => navigate(`/invoices/${invoiceId}/pdf`)}>
                <Download size={14} /> PDF
              </button>
              <button className="qb-btn-outline flex items-center gap-1" onClick={() => handleStatusChange("Sent")}>
                <Send size={14} /> Mark as Sent
              </button>
              <button className="qb-btn flex items-center gap-1 bg-sky-600 text-white" onClick={() => {
                const customer = customers?.find((c: any) => c.id === inv?.customerId);
                setEmailRecipient(customer?.email || "");
                setEmailMessage("");
                setShowEmailDialog(true);
              }}>
                <Send size={14} /> Email Invoice
              </button>
              <button className="qb-btn-outline flex items-center gap-1" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <div className="relative group">
                <button className="qb-btn-outline p-2">
                  <MoreVertical size={14} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48 hidden group-hover:block z-50">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => handleStatusChange("Paid")}>
                    <CheckCircle size={14} className="text-green-600" /> Mark as Paid
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => handleStatusChange("Deposited")}>
                    <Download size={14} className="text-green-600" /> Mark as Deposited
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => toast("Feature coming soon")}>
                    <Copy size={14} /> Duplicate
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => {
                    setPaymentAmount(inv?.amountDue || inv?.total || "0");
                    setShowPaymentDialog(true);
                  }}>
                    <DollarSign size={14} className="text-green-600" /> Record Payment
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2" onClick={() => handleStatusChange("Voided")}>
                    <XCircle size={14} /> Void Invoice
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 size={14} /> Delete Invoice
                  </button>
                </div>
              </div>
            </>
          )}
          {(isNew || isEditing) && (
            <>
              <button className="qb-btn-outline" onClick={() => isNew ? navigate("/invoices") : setIsEditing(false)}>
                Cancel
              </button>
              <button
                className="qb-btn-green"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : isNew ? "Save Invoice" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Form / View */}
      <div className="qb-card">
        {/* Customer & Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</label>
            {isEditing ? (
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                value={customerId || ""}
                onChange={(e) => setCustomerId(Number(e.target.value))}
              >
                <option value="">Select a customer...</option>
                {(customers as any[])?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.displayName}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-800 font-medium">{customerName}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice #</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-001"
                />
              ) : (
                <p className="text-gray-800">{inv?.invoiceNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Terms</label>
              {isEditing ? (
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                >
                  <option>Due on receipt</option>
                  <option>Net 15</option>
                  <option>Net 30</option>
                  <option>Net 60</option>
                </select>
              ) : (
                <p className="text-gray-800">{inv?.terms || "Net 30"}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
              {isEditing ? (
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="CHF">CHF</option>
                  <option value="MXN">MXN</option>
                  <option value="CNY">CNY</option>
                </select>
              ) : (
                <p className="text-gray-800">{inv?.currency || "CAD"}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Date</label>
              {isEditing ? (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{inv?.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-CA") : ""}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
              {isEditing ? (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{inv?.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-CA") : ""}</p>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 w-8">#</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-2">Product/Service</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider pb-2">Description</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 w-20">Qty</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 w-24">Rate</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 w-24">Amount</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 w-20">Tax</th>
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
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                        value={li.productId || ""}
                        onChange={(e) => selectProduct(index, Number(e.target.value))}
                      >
                        <option value="">Select...</option>
                        {(products as any[])?.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-800">
                        {(products as any[])?.find((p: any) => p.id === li.productId)?.name || "—"}
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
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
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-600"
                        value={li.quantity}
                        onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-gray-800">{li.quantity}</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-600"
                        value={li.rate}
                        onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-gray-800">${Number(li.rate).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    <span className="text-sm font-medium text-gray-800">${Number(li.amount).toFixed(2)}</span>
                  </td>
                  <td className="py-2 text-right">
                    {isEditing ? (
                      <select
                        className="w-full border border-gray-200 rounded px-1 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                        value={li.taxCode || ""}
                        onChange={(e) => updateLineItem(index, "taxCode", e.target.value)}
                      >
                        <option value="">None</option>
                        {(taxRates as any[])?.map((t: any) => (
                          <option key={t.id} value={t.code}>{t.code} ({Number(t.rate) * 100}%)</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-500">{li.taxCode || "—"}</span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-2 text-center">
                      <button
                        className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                        onClick={() => removeLineItem(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditing && (
            <button
              className="mt-3 text-sm text-sky-600 hover:underline flex items-center gap-1"
              onClick={addLineItem}
            >
              <Plus size={14} /> Add a line
            </button>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {taxAmount > 0 && (
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-800 font-medium">${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-base font-bold border-t border-gray-200 mt-1">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            {!isNew && inv && (
              <>
                <div className="flex justify-between py-1.5 text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="text-gray-800">${Number(inv.amountPaid || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-base font-bold border-t border-gray-200">
                  <span className="text-green-600">Amount Due</span>
                  <span className="text-green-600">${Number(inv.amountDue || total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes / Memo</label>
          {isEditing ? (
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes to customer..."
            />
          ) : (
            <p className="text-sm text-gray-600">{inv?.notes || "—"}</p>
          )}
        </div>
      </div>

      {/* File Attachments */}
      {!isNew && inv && (
        <div className="qb-card mt-4">
          <FileAttachments entityType="Invoice" entityId={invoiceId} />
        </div>
      )}

      {/* Record Payment Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentDialog(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Record Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="E-Transfer">E-Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="qb-btn-outline" onClick={() => setShowPaymentDialog(false)}>Cancel</button>
              <button
                className="qb-btn-green"
                disabled={recordPaymentMutation.isPending || !paymentAmount || Number(paymentAmount) <= 0}
                onClick={() => {
                  recordPaymentMutation.mutate({
                    invoiceId,
                    amount: paymentAmount,
                    paymentMethod,
                    paymentDate: new Date(),
                  });
                }}
              >
                {recordPaymentMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Delete Invoice</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete invoice <strong>{inv?.invoiceNumber}</strong>? All associated journal entries will be reversed.
            </p>
            <div className="flex justify-end gap-2">
              <button className="qb-btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate({ id: invoiceId })}
              >
                {deleteMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Invoice Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailDialog(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Send size={20} className="text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Email Invoice</h3>
                <p className="text-sm text-gray-500">Send invoice #{inv?.invoiceNumber} to customer</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Template Selector */}
              {emailTemplates && emailTemplates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Use Template</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    value={selectedTemplateId ?? ""}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : null;
                      setSelectedTemplateId(id);
                      if (id) {
                        const tmpl = (emailTemplates as any[]).find((t: any) => t.id === id);
                        if (tmpl) {
                          const body = tmpl.body
                            .replace(/\{\{company_name\}\}/g, "RusingAcademy")
                            .replace(/\{\{customer_name\}\}/g, (customers as any[])?.find((c: any) => c.id === inv?.customerId)?.displayName || "")
                            .replace(/\{\{customer_email\}\}/g, (customers as any[])?.find((c: any) => c.id === inv?.customerId)?.email || "")
                            .replace(/\{\{invoice_number\}\}/g, inv?.invoiceNumber || "")
                            .replace(/\{\{invoice_date\}\}/g, inv?.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-CA") : "")
                            .replace(/\{\{due_date\}\}/g, inv?.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-CA") : "")
                            .replace(/\{\{amount_due\}\}/g, `$${Number(inv?.amountDue || inv?.total || 0).toFixed(2)}`)
                            .replace(/\{\{total\}\}/g, `$${Number(inv?.total || 0).toFixed(2)}`)
                            .replace(/\{\{terms\}\}/g, inv?.terms || "")
                            .replace(/\{\{notes\}\}/g, inv?.notes || "");
                          setEmailMessage(body);
                        }
                      }
                    }}
                  >
                    <option value="">— No template —</option>
                    {(emailTemplates as any[]).filter((t: any) => t.type === "invoice" || t.type === "payment_reminder").map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email *</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  placeholder="customer@example.com"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message {selectedTemplateId ? "(from template)" : "(optional)"}</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  rows={selectedTemplateId ? 8 : 3}
                  placeholder="Please find your invoice attached."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p><strong>Invoice:</strong> #{inv?.invoiceNumber}</p>
                <p><strong>Amount Due:</strong> ${Number(inv?.amountDue || inv?.total || 0).toFixed(2)}</p>
                <p><strong>Due Date:</strong> {inv?.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-CA") : "N/A"}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="qb-btn-outline" onClick={() => setShowEmailDialog(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-[#005fa3] flex items-center gap-2"
                disabled={sendEmailMutation.isPending || !emailRecipient}
                onClick={() => sendEmailMutation.mutate({
                  invoiceId,
                  recipientEmail: emailRecipient,
                  message: emailMessage || undefined,
                })}
              >
                {sendEmailMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
