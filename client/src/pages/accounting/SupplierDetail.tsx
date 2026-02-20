/*
 * QuickBooks Authentic — Supplier Detail Page
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Loader2, Edit, Save, X, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";


const labels = {
  en: { title: "Supplier Details", contact: "Contact", bills: "Bills", payments: "Payments", balance: "Balance", edit: "Edit" },
  fr: { title: "Détails du fournisseur", contact: "Contact", bills: "Factures", payments: "Paiements", balance: "Solde", edit: "Modifier" },
};

export default function SupplierDetail() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, params] = useRoute("/suppliers/:id");
  const [, navigate] = useLocation();
  const supplierId = params?.id ? Number(params.id) : 0;
  const isNew = params?.id === "new";

  const { data: supplier, isLoading, refetch } = trpc.suppliers.getById.useQuery(
    { id: supplierId },
    { enabled: !isNew && supplierId > 0 }
  );

  const createMutation = trpc.suppliers.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Supplier created");
      navigate(`/suppliers/${data.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.suppliers.update.useMutation({
    onSuccess: () => {
      toast.success("Supplier updated");
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
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [notes, setNotes] = useState("");

  useMemo(() => {
    if (supplier && !isNew) {
      const s = supplier as any;
      setDisplayName(s.displayName || "");
      setFirstName(s.firstName || "");
      setLastName(s.lastName || "");
      setCompany(s.company || "");
      setEmail(s.email || "");
      setPhone(s.phone || "");
      setWebsite(s.website || "");
      setAddress(s.address || "");
      setTaxId(s.taxId || "");
      setNotes(s.notes || "");
    }
  }, [supplier, isNew]);

  const handleSave = () => {
    if (!displayName) {
      toast.error("Display name is required");
      return;
    }
    if (isNew) {
      createMutation.mutate({ displayName, firstName, lastName, company, email, phone, website, address, taxId, notes });
    } else {
      updateMutation.mutate({ id: supplierId, displayName, firstName, lastName, company, email, phone, website, address, taxId, notes });
    }
  };

  const s = supplier as any;

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/suppliers")} className="p-2 hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? "New Supplier" : (s?.displayName || "")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !isEditing && (
            <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => setIsEditing(true)}>
              <Edit size={14} /> Edit
            </button>
          )}
          {(isNew || isEditing) && (
            <>
              <button aria-label="Action" className="qb-btn-outline flex items-center gap-1" onClick={() => isNew ? navigate("/suppliers") : setIsEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button aria-label="Action" className="qb-btn-green flex items-center gap-1" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="qb-card">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Supplier Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Display Name *", value: displayName, setter: setDisplayName, view: s?.displayName },
                { label: "Company", value: company, setter: setCompany, view: s?.company },
                { label: "First Name", value: firstName, setter: setFirstName, view: s?.firstName },
                { label: "Last Name", value: lastName, setter: setLastName, view: s?.lastName },
                { label: "Email", value: email, setter: setEmail, view: s?.email, type: "email" },
                { label: "Phone", value: phone, setter: setPhone, view: s?.phone, type: "tel" },
                { label: "Website", value: website, setter: setWebsite, view: s?.website },
                { label: "Tax ID / GST #", value: taxId, setter: setTaxId, view: s?.taxId },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                  {isEditing ? (
                    <input
                      type={field.type || "text"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">{field.view || "—"}</p>
                  )}
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Address</label>
                {isEditing ? (
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-800">{s?.address || "—"}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Notes</label>
                {isEditing ? (
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                ) : (
                  <p className="text-sm text-gray-600">{s?.notes || "—"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isNew && s && (
          <div>
            <div className="qb-card">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Balance</h3>
              <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">${Number(s.balance || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-500">Outstanding balance</p>
              {s.email && (
                <>
                  <hr className="my-4" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    <span>{s.email}</span>
                  </div>
                </>
              )}
              {s.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Phone size={14} className="text-gray-400" />
                  <span>{s.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
