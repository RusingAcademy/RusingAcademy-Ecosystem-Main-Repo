/*
 * QuickBooks Authentic — Settings / Company Profile Page
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Save, Building2, CreditCard, Bell, Shield, Users, Globe, FileSearch, Mail } from "lucide-react";
import EmailTemplates from "./EmailTemplates";
import { toast } from "sonner";

export default function Settings() {
  const [, navigate] = useLocation();
  const { data: company, isLoading, refetch } = trpc.company.get.useQuery();
  const updateMutation = trpc.company.update.useMutation({
    onSuccess: () => {
      toast.success("Settings saved");
      refetch();
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [activeTab, setActiveTab] = useState("company");
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Canada");
  const [currency, setCurrency] = useState("CAD");
  const [taxId, setTaxId] = useState("");
  const [fiscalYearStart, setFiscalYearStart] = useState("01-01");

  useMemo(() => {
    if (company) {
      const c = company as any;
      setCompanyName(c.companyName || "");
      setLegalName(c.legalName || "");
      setEmail(c.email || "");
      setPhone(c.phone || "");
      setAddress(c.address || "");
      setCity(c.city || "");
      setProvince(c.province || "");
      setPostalCode(c.postalCode || "");
      setCountry(c.country || "Canada");
      setCurrency(c.currency || "CAD");
      setTaxId(c.taxId || "");
      setFiscalYearStart(c.fiscalYearStart || "01-01");
    }
  }, [company]);

  const handleSave = () => {
    updateMutation.mutate({
      companyName, legalName, email, phone, address, city, province, postalCode, country, currency, taxId, fiscalYearStart,
    });
  };

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "billing", label: "Billing & Subscription", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "exchange-rates", label: "Exchange Rates", icon: Globe },
    { id: "audit-trail", label: "Audit Trail", icon: FileSearch },
    { id: "email-templates", label: "Email Templates", icon: Mail },
  ];

  const c = company as any;

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 dark:bg-card rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left mb-1 transition-colors ${
                activeTab === tab.id ? "bg-green-50 text-green-600 font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "company" && (
            <div className="qb-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Company Information</h2>
                {!isEditing ? (
                  <button className="qb-btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
                ) : (
                  <div className="flex gap-2">
                    <button className="qb-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="qb-btn-green flex items-center gap-1" onClick={handleSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save
                    </button>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Company Name", value: companyName, setter: setCompanyName, view: c?.companyName },
                    { label: "Legal Name", value: legalName, setter: setLegalName, view: c?.legalName },
                    { label: "Email", value: email, setter: setEmail, view: c?.email },
                    { label: "Phone", value: phone, setter: setPhone, view: c?.phone },
                    { label: "City", value: city, setter: setCity, view: c?.city },
                    { label: "Province", value: province, setter: setProvince, view: c?.province },
                    { label: "Postal Code", value: postalCode, setter: setPostalCode, view: c?.postalCode },
                    { label: "Country", value: country, setter: setCountry, view: c?.country },
                    { label: "Currency", value: currency, setter: setCurrency, view: c?.currency },
                    { label: "Tax ID / GST #", value: taxId, setter: setTaxId, view: c?.taxId },
                    { label: "Fiscal Year Start", value: fiscalYearStart, setter: setFiscalYearStart, view: c?.fiscalYearStart },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      {isEditing ? (
                        <input
                          type="text"
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
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-gray-800">{c?.address || "—"}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "exchange-rates" && (
            <div className="qb-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Exchange Rates</h2>
                <button className="qb-btn-outline" onClick={() => navigate("/exchange-rates")}>Manage Rates</button>
              </div>
              <p className="text-sm text-gray-500">Configure exchange rates for multi-currency transactions. Rates are used when creating invoices, expenses, or bills in foreign currencies.</p>
            </div>
          )}

          {activeTab === "audit-trail" && (
            <div className="qb-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Audit Trail</h2>
                <button className="qb-btn-outline" onClick={() => navigate("/audit-trail")}>View Full Trail</button>
              </div>
              <p className="text-sm text-gray-500">Track all changes made to your books. Every create, update, and delete action is logged with timestamps and user information.</p>
            </div>
          )}

          {activeTab === "email-templates" && (
            <EmailTemplates />
          )}

          {!(["company", "exchange-rates", "audit-trail", "email-templates"].includes(activeTab)) && (
            <div className="qb-card text-center py-6 md:py-8 lg:py-12">
              <p className="text-gray-500 mb-1">This section is coming soon</p>
              <p className="text-sm text-gray-400">We're working on bringing you more settings options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
