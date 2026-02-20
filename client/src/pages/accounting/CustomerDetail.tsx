/*
 * QuickBooks Authentic — Customer Detail Page
 * View/Edit customer → Transaction history → Balance summary
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft, Loader2, Mail, Phone, Globe, MapPin, Edit, Save, X
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";


const labels = {
  en: { title: "Customer Details", contact: "Contact", invoices: "Invoices", payments: "Payments", balance: "Balance", edit: "Edit" },
  fr: { title: "Détails du client", contact: "Contact", invoices: "Factures", payments: "Paiements", balance: "Solde", edit: "Modifier" },
};

export default function CustomerDetail() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, params] = useRoute("/customers/:id");
  const [, navigate] = useLocation();
  const customerId = params?.id ? Number(params.id) : 0;
  const isNew = params?.id === "new";

  const { data: customer, isLoading, refetch } = trpc.customers.getById.useQuery(
    { id: customerId },
    { enabled: !isNew && customerId > 0 }
  );
  const { data: invoices } = trpc.invoices.list.useQuery(
    { customerId },
    { enabled: !isNew && customerId > 0 }
  );

  const createMutation = trpc.customers.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Customer created");
      navigate(`/customers/${data.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.customers.update.useMutation({
    onSuccess: () => {
      toast.success("Customer updated");
      refetch();
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [isEditing, setIsEditing] = useState(isNew);
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [website, setWebsite] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [notes, setNotes] = useState("");

  useMemo(() => {
    if (customer && !isNew) {
      const c = customer as any;
      setDisplayName(c.displayName || "");
      setFirstName(c.firstName || "");
      setLastName(c.lastName || "");
      setCompany(c.company || "");
      setEmail(c.email || "");
      setPhone(c.phone || "");
      setMobile(c.mobile || "");
      setWebsite(c.website || "");
      setBillingAddress(c.billingAddress || "");
      setNotes(c.notes || "");
    }
  }, [customer, isNew]);

  const handleSave = () => {
    if (!displayName) {
      toast.error("Display name is required");
      return;
    }
    if (isNew) {
      createMutation.mutate({
        displayName, firstName, lastName, company, email, phone, mobile, website, billingAddress, notes,
      });
    } else {
      updateMutation.mutate({
        id: customerId, displayName, firstName, lastName, company, email, phone, mobile, website, billingAddress, notes,
      });
    }
  };

  const c = customer as any;

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/customers")} className="p-2 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isNew ? "New Customer" : (c?.displayName || "")}
            </h1>
            {!isNew && c && (
              <p className="text-sm text-gray-500">{c.company || ""}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !isEditing && (
            <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => setIsEditing(true)}>
              <Edit size={14} /> Edit
            </button>
          )}
          {(isNew || isEditing) && (
            <>
              <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => isNew ? navigate("/customers") : setIsEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button aria-label="Action"
                className="qb-btn-green flex items-center gap-1"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <><Save size={14} /> Save</>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Left: Customer Info */}
        <div className="col-span-2">
          <div className="qb-card mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Display Name *</label>
                {isEditing ? (
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-foreground font-medium">{c?.displayName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Company</label>
                {isEditing ? (
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={company} onChange={(e) => setCompany(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800">{c?.company || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                {isEditing ? (
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800">{c?.firstName || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                {isEditing ? (
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800">{c?.lastName || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                {isEditing ? (
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-foreground flex items-center gap-1">{c?.email ? <><Mail size={12} className="text-gray-400" />{c.email}</> : "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                {isEditing ? (
                  <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={phone} onChange={(e) => setPhone(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-foreground flex items-center gap-1">{c?.phone ? <><Phone size={12} className="text-gray-400" />{c.phone}</> : "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mobile</label>
                {isEditing ? (
                  <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800">{c?.mobile || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Website</label>
                {isEditing ? (
                  <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" value={website} onChange={(e) => setWebsite(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-foreground flex items-center gap-1">{c?.website ? <><Globe size={12} className="text-gray-400" />{c.website}</> : "—"}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Billing Address</label>
                {isEditing ? (
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" rows={2} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800 dark:text-foreground flex items-start gap-1">{c?.billingAddress ? <><MapPin size={12} className="text-gray-400 mt-0.5" />{c.billingAddress}</> : "—"}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Notes</label>
                {isEditing ? (
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-600">{c?.notes || "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          {!isNew && (
            <div className="qb-card">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Transaction History</h3>
              {(invoices as any[])?.length ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-white/15 dark:border-white/15">
                      <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Date</th>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Type</th>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Number</th>
                      <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Status</th>
                      <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Amount</th>
                      <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoices as any[])?.map((inv: any) => (
                      <tr
                        key={inv.id}
                        className="border-b border-gray-100 dark:border-white/15 hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md cursor-pointer"
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                      >
                        <td className="py-2 text-sm text-gray-800">{new Date(inv.invoiceDate).toLocaleDateString("en-CA")}</td>
                        <td className="py-2 text-sm text-gray-600">Invoice</td>
                        <td className="py-2 text-sm text-sky-600">{inv.invoiceNumber}</td>
                        <td className="py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            inv.status === "Overdue" ? "bg-orange-100 text-orange-700" :
                            inv.status === "Deposited" || inv.status === "Paid" ? "bg-green-100 text-green-700" :
                            inv.status === "Sent" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2 text-sm text-right font-medium">${Number(inv.total || 0).toFixed(2)}</td>
                        <td className="py-2 text-sm text-right">${Number(inv.amountDue || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Summary Card */}
        {!isNew && c && (
          <div>
            <div className="qb-card">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Balance</h3>
              <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">${Number(c.balance || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-500">Outstanding balance</p>
              <hr className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Invoices</span>
                  <span className="text-gray-800 dark:text-foreground font-medium">{(invoices as any[])?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Overdue</span>
                  <span className="text-orange-600 font-medium">
                    {(invoices as any[])?.filter((i: any) => i.status === "Overdue").length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
