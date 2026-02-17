/*
 * QuickBooks Authentic — Email Templates Editor (Enhancement I)
 * CRUD for customizable email templates with merge field support
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Mail, Copy, Eye, X, Save, FileText, Receipt, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";

const TEMPLATE_TYPES = [
  { value: "invoice", label: "Invoice", icon: FileText, color: "#0077C5" },
  { value: "estimate", label: "Estimate", icon: Receipt, color: "#2CA01C" },
  { value: "payment_receipt", label: "Payment Receipt", icon: CreditCard, color: "#6B21A8" },
  { value: "payment_reminder", label: "Payment Reminder", icon: Clock, color: "#E8A317" },
] as const;

const MERGE_FIELDS = [
  { field: "{{company_name}}", description: "Your company name" },
  { field: "{{customer_name}}", description: "Customer display name" },
  { field: "{{customer_email}}", description: "Customer email address" },
  { field: "{{invoice_number}}", description: "Invoice number" },
  { field: "{{invoice_date}}", description: "Invoice date" },
  { field: "{{due_date}}", description: "Payment due date" },
  { field: "{{amount_due}}", description: "Amount due" },
  { field: "{{total}}", description: "Total amount" },
  { field: "{{amount_paid}}", description: "Amount paid" },
  { field: "{{payment_method}}", description: "Payment method" },
  { field: "{{estimate_number}}", description: "Estimate number" },
  { field: "{{terms}}", description: "Payment terms" },
  { field: "{{notes}}", description: "Invoice/estimate notes" },
];

const DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  invoice: {
    subject: "Invoice #{{invoice_number}} from {{company_name}}",
    body: `Dear {{customer_name}},

Please find attached Invoice #{{invoice_number}} dated {{invoice_date}}.

Amount Due: {{amount_due}}
Due Date: {{due_date}}

Payment Terms: {{terms}}

Thank you for your business.

Best regards,
{{company_name}}`,
  },
  estimate: {
    subject: "Estimate #{{estimate_number}} from {{company_name}}",
    body: `Dear {{customer_name}},

We are pleased to provide you with Estimate #{{estimate_number}}.

Total: {{total}}

{{notes}}

Please let us know if you have any questions or would like to proceed.

Best regards,
{{company_name}}`,
  },
  payment_receipt: {
    subject: "Payment Receipt from {{company_name}}",
    body: `Dear {{customer_name}},

Thank you for your payment of {{amount_paid}} received via {{payment_method}}.

Invoice #{{invoice_number}}
Amount Paid: {{amount_paid}}
Remaining Balance: {{amount_due}}

Thank you for your prompt payment.

Best regards,
{{company_name}}`,
  },
  payment_reminder: {
    subject: "Payment Reminder: Invoice #{{invoice_number}} - {{company_name}}",
    body: `Dear {{customer_name}},

This is a friendly reminder that Invoice #{{invoice_number}} dated {{invoice_date}} has an outstanding balance.

Amount Due: {{amount_due}}
Due Date: {{due_date}}

Please arrange payment at your earliest convenience. If you have already sent payment, please disregard this notice.

Thank you,
{{company_name}}`,
  },
};

export default function EmailTemplates() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMergeFields, setShowMergeFields] = useState(false);

  const utils = trpc.useUtils();
  const { data: templates, isLoading } = trpc.emailTemplates.list.useQuery();

  const createMutation = trpc.emailTemplates.create.useMutation({
    onSuccess: () => {
      toast.success("Template created");
      setEditingTemplate(null);
      utils.emailTemplates.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.emailTemplates.update.useMutation({
    onSuccess: () => {
      toast.success("Template updated");
      setEditingTemplate(null);
      utils.emailTemplates.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.emailTemplates.delete.useMutation({
    onSuccess: () => {
      toast.success("Template deleted");
      utils.emailTemplates.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (typeFilter === "all") return templates;
    return templates.filter((t: any) => t.type === typeFilter);
  }, [templates, typeFilter]);

  const handleNew = (type?: string) => {
    const t = type || "invoice";
    const defaults = DEFAULT_TEMPLATES[t] || DEFAULT_TEMPLATES.invoice;
    setEditingTemplate({
      isNew: true,
      name: "",
      type: t,
      subject: defaults.subject,
      body: defaults.body,
      isDefault: false,
    });
  };

  const handleEdit = (template: any) => {
    setEditingTemplate({
      isNew: false,
      id: template.id,
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      isDefault: template.isDefault,
    });
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (editingTemplate.isNew) {
      createMutation.mutate({
        name: editingTemplate.name,
        type: editingTemplate.type,
        subject: editingTemplate.subject,
        body: editingTemplate.body,
        isDefault: editingTemplate.isDefault,
      });
    } else {
      updateMutation.mutate({
        id: editingTemplate.id,
        name: editingTemplate.name,
        type: editingTemplate.type,
        subject: editingTemplate.subject,
        body: editingTemplate.body,
        isDefault: editingTemplate.isDefault,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    deleteMutation.mutate({ id });
  };

  const insertMergeField = (field: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({ ...editingTemplate, body: editingTemplate.body + field });
    setShowMergeFields(false);
  };

  const previewBody = (body: string) => {
    return body
      .replace(/\{\{company_name\}\}/g, "RusingAcademy")
      .replace(/\{\{customer_name\}\}/g, "John Smith")
      .replace(/\{\{customer_email\}\}/g, "john@example.com")
      .replace(/\{\{invoice_number\}\}/g, "INV-001")
      .replace(/\{\{invoice_date\}\}/g, "2026-02-13")
      .replace(/\{\{due_date\}\}/g, "2026-03-15")
      .replace(/\{\{amount_due\}\}/g, "$1,250.00")
      .replace(/\{\{total\}\}/g, "$1,500.00")
      .replace(/\{\{amount_paid\}\}/g, "$250.00")
      .replace(/\{\{payment_method\}\}/g, "Credit Card")
      .replace(/\{\{estimate_number\}\}/g, "EST-001")
      .replace(/\{\{terms\}\}/g, "Net 30")
      .replace(/\{\{notes\}\}/g, "Thank you for your business.");
  };

  const getTypeInfo = (type: string) => TEMPLATE_TYPES.find(t => t.value === type) || TEMPLATE_TYPES[0];

  return (
    <div>
      {/* Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border dark:border-border">
              <h2 className="text-lg font-bold text-gray-800">
                {editingTemplate.isNew ? "Create Template" : "Edit Template"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 dark:bg-card rounded-lg text-gray-500"
                  onClick={() => setShowPreview(!showPreview)}
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:bg-card rounded-lg text-gray-500"
                  onClick={() => setEditingTemplate(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Name + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="e.g., Standard Invoice Email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Type</label>
                  <select
                    value={editingTemplate.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaults = DEFAULT_TEMPLATES[newType] || DEFAULT_TEMPLATES.invoice;
                      setEditingTemplate({
                        ...editingTemplate,
                        type: newType,
                        subject: editingTemplate.subject || defaults.subject,
                        body: editingTemplate.body || defaults.body,
                      });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  >
                    {TEMPLATE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Email Body</label>
                  <div className="relative">
                    <button
                      className="text-xs text-sky-600 hover:underline flex items-center gap-1"
                      onClick={() => setShowMergeFields(!showMergeFields)}
                    >
                      <Copy size={12} /> Insert merge field
                    </button>
                    {showMergeFields && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-background border border-gray-200 dark:border-border dark:border-border rounded-lg shadow-lg z-10 py-1 w-64 max-h-64 overflow-y-auto">
                        {MERGE_FIELDS.map(mf => (
                          <button
                            key={mf.field}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 dark:bg-background flex items-center justify-between"
                            onClick={() => insertMergeField(mf.field)}
                          >
                            <code className="text-xs text-sky-600 bg-blue-50 px-1 rounded">{mf.field}</code>
                            <span className="text-xs text-gray-400 ml-2">{mf.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  rows={12}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={editingTemplate.isDefault}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isDefault: e.target.checked })}
                  className="rounded"
                />
                Set as default template for this type
              </label>

              {/* Preview */}
              {showPreview && (
                <div className="border border-gray-200 dark:border-border dark:border-border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</h4>
                  <div className="bg-white dark:bg-background rounded-lg p-4 border border-gray-200 dark:border-border dark:border-border">
                    <p className="text-sm font-medium text-gray-800 dark:text-foreground mb-3 pb-2 border-b border-gray-100">
                      Subject: {previewBody(editingTemplate.subject)}
                    </p>
                    <pre className="text-sm text-gray-700 dark:text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                      {previewBody(editingTemplate.body)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-border dark:border-border">
              <button
                className="qb-btn-outline"
                onClick={() => setEditingTemplate(null)}
              >
                Cancel
              </button>
              <button
                className="qb-btn-green flex items-center gap-1"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save size={14} /> {editingTemplate.isNew ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Email Templates</h3>
          <p className="text-sm text-gray-500">Customize email templates for invoices, estimates, receipts, and reminders</p>
        </div>
        <button className="qb-btn-green flex items-center gap-1" onClick={() => handleNew()}>
          <Plus size={14} /> New Template
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            typeFilter === "all" ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-card text-gray-600 border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => setTypeFilter("all")}
        >
          All
        </button>
        {TEMPLATE_TYPES.map(t => (
          <button
            key={t.value}
            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
              typeFilter === t.value ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-card text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => setTypeFilter(t.value)}
          >
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Template List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-background rounded-lg border border-gray-200 dark:border-border dark:border-border">
          <Mail size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">No email templates yet</p>
          <p className="text-sm text-gray-400 mb-4">Create templates to streamline your email communications</p>
          <div className="flex items-center justify-center gap-2">
            {TEMPLATE_TYPES.map(t => (
              <button
                key={t.value}
                className="qb-btn-outline text-sm flex items-center gap-1"
                onClick={() => handleNew(t.value)}
              >
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map((template: any) => {
            const typeInfo = getTypeInfo(template.type);
            return (
              <div
                key={template.id}
                className="bg-white dark:bg-background rounded-lg border border-gray-200 dark:border-border dark:border-border p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${typeInfo.color}15` }}
                    >
                      <typeInfo.icon size={16} style={{ color: typeInfo.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        {template.isDefault && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">DEFAULT</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{template.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {typeInfo.label} template — Updated {new Date(template.updatedAt).toLocaleDateString("en-CA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 hover:bg-gray-100 dark:bg-card rounded text-gray-400 hover:text-gray-600"
                      onClick={() => handleEdit(template)}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(template.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Merge Fields Reference */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-background rounded-lg border border-gray-200 dark:border-border dark:border-border">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Merge Fields</h4>
        <div className="grid grid-cols-2 gap-2">
          {MERGE_FIELDS.map(mf => (
            <div key={mf.field} className="flex items-center gap-2 text-sm">
              <code className="text-xs text-sky-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">{mf.field}</code>
              <span className="text-gray-500">{mf.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
