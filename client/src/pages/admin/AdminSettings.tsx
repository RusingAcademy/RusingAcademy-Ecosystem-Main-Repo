import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Globe, Palette, Shield, Bell, CreditCard, Link2, Database, Code,
  Save, ChevronRight, CheckCircle2, Loader2
} from "lucide-react";

type TabKey = "site" | "branding" | "security" | "notifications" | "payments" | "integrations" | "database" | "developer";

const tabs: { key: TabKey; title: string; desc: string; icon: any }[] = [
  { key: "site", title: "Site Details", desc: "Homepage, SEO, general info", icon: Globe },
  { key: "branding", title: "Branding", desc: "Logo, colors, fonts", icon: Palette },
  { key: "security", title: "Security", desc: "Auth, passwords, access", icon: Shield },
  { key: "notifications", title: "Notifications", desc: "Email & alert settings", icon: Bell },
  { key: "payments", title: "Payments", desc: "Stripe & checkout config", icon: CreditCard },
  { key: "integrations", title: "Integrations", desc: "External services", icon: Link2 },
  { key: "database", title: "Database", desc: "Status & backups", icon: Database },
  { key: "developer", title: "Developer", desc: "API keys & webhooks", icon: Code },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>("site");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const settingsQuery = trpc.settings.getAll.useQuery();
  const setMutation = trpc.settings.setBulk.useMutation();

  useEffect(() => {
    if (settingsQuery.data) {
      setFormData(settingsQuery.data as Record<string, string>);
    }
  }, [settingsQuery.data]);

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (keys: string[]) => {
    setSaving(true);
    try {
      const settings: Record<string, string> = {};
      keys.forEach(k => { if (formData[k] !== undefined) settings[k] = formData[k]; });
      await setMutation.mutateAsync({ settings });
      settingsQuery.refetch();
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: string, label: string, type: "text" | "textarea" | "toggle" = "text", placeholder?: string) => {
    if (type === "toggle") {
      return (
        <div className="flex items-center justify-between py-2" key={key}>
          <Label className="text-sm font-medium">{label}</Label>
          <Switch checked={formData[key] === "true"} onCheckedChange={(v) => updateField(key, v ? "true" : "false")} />
        </div>
      );
    }
    if (type === "textarea") {
      return (
        <div className="space-y-1.5" key={key}>
          <Label className="text-sm font-medium">{label}</Label>
          <Textarea value={formData[key] || ""} onChange={(e) => updateField(key, e.target.value)} placeholder={placeholder || label} rows={3} />
        </div>
      );
    }
    return (
      <div className="space-y-1.5" key={key}>
        <Label className="text-sm font-medium">{label}</Label>
        <Input value={formData[key] || ""} onChange={(e) => updateField(key, e.target.value)} placeholder={placeholder || label} />
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "site":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("site_name", "Site Name", "text", "RusingAcademy Learning Ecosystem")}
              {renderField("site_tagline", "Tagline", "text", "Bilingual Excellence for Canadian Public Servants")}
              {renderField("site_url", "Site URL", "text", "https://www.rusingacademy.ca")}
              {renderField("site_contact_email", "Contact Email", "text", "info@rusingacademy.ca")}
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">SEO Settings</h3>
            {renderField("seo_title", "Meta Title", "text", "RusingAcademy — Professional Bilingual Training")}
            {renderField("seo_description", "Meta Description", "textarea", "Secure your C level. Propel your federal career.")}
            {renderField("seo_keywords", "Keywords", "text", "SLE, bilingual, public service, French, English")}
            {renderField("seo_og_image", "OG Image URL", "text", "https://...")}
            <Button onClick={() => saveSettings(["site_name", "site_tagline", "site_url", "site_contact_email", "seo_title", "seo_description", "seo_keywords", "seo_og_image"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Site Settings
            </Button>
          </div>
        );
      case "branding":
        return (
          <div className="space-y-6">
            {renderField("brand_logo_url", "Logo URL", "text", "https://...")}
            {renderField("brand_favicon_url", "Favicon URL", "text", "https://...")}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {renderField("brand_primary_color", "Primary Color", "text", "#0F3D3E")}
              {renderField("brand_secondary_color", "Secondary Color", "text", "#D4A843")}
              {renderField("brand_accent_color", "Accent Color", "text", "#1a5c5e")}
              {renderField("brand_bg_color", "Background Color", "text", "#FAFAF8")}
              {renderField("brand_text_color", "Text Color", "text", "#1a1a1a")}
              {renderField("brand_muted_color", "Muted Color", "text", "#6b7280")}
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">Typography</h3>
            <div className="grid grid-cols-2 gap-4">
              {renderField("brand_heading_font", "Heading Font", "text", "Playfair Display")}
              {renderField("brand_body_font", "Body Font", "text", "Inter")}
            </div>
            <Button onClick={() => saveSettings(["brand_logo_url", "brand_favicon_url", "brand_primary_color", "brand_secondary_color", "brand_accent_color", "brand_bg_color", "brand_text_color", "brand_muted_color", "brand_heading_font", "brand_body_font"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Branding
            </Button>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Authentication</h3>
              {renderField("auth_session_duration", "Session Duration (hours)", "text", "24")}
              {renderField("auth_max_login_attempts", "Max Login Attempts", "text", "5")}
              {renderField("auth_lockout_duration", "Lockout Duration (minutes)", "text", "30")}
              {renderField("auth_require_email_verification", "Require Email Verification", "toggle")}
              {renderField("auth_allow_registration", "Allow Public Registration", "toggle")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">OAuth Providers</h3>
              {renderField("oauth_google_enabled", "Google OAuth", "toggle")}
              {renderField("oauth_microsoft_enabled", "Microsoft OAuth", "toggle")}
              <p className="text-xs text-muted-foreground">OAuth credentials are managed in Management UI Settings &gt; Secrets</p>
            </CardContent></Card>
            <Button onClick={() => saveSettings(["auth_session_duration", "auth_max_login_attempts", "auth_lockout_duration", "auth_require_email_verification", "auth_allow_registration", "oauth_google_enabled", "oauth_microsoft_enabled"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Security Settings
            </Button>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Email Notifications</h3>
              {renderField("notify_new_enrollment", "New Enrollment", "toggle")}
              {renderField("notify_new_lead", "New Lead / Inquiry", "toggle")}
              {renderField("notify_payment_received", "Payment Received", "toggle")}
              {renderField("notify_session_booked", "Session Booked", "toggle")}
              {renderField("notify_course_completed", "Course Completed", "toggle")}
              {renderField("notify_coach_application", "Coach Application", "toggle")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Email Configuration</h3>
              {renderField("email_from_name", "From Name", "text", "RusingAcademy")}
              {renderField("email_from_address", "From Email", "text", "noreply@rusingacademy.ca")}
              {renderField("email_reply_to", "Reply-To", "text", "info@rusingacademy.ca")}
            </CardContent></Card>
            <Button onClick={() => saveSettings(["notify_new_enrollment", "notify_new_lead", "notify_payment_received", "notify_session_booked", "notify_course_completed", "notify_coach_application", "email_from_name", "email_from_address", "email_reply_to"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Notification Settings
            </Button>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Stripe Configuration</h3>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Connected</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Stripe keys are managed in Management UI &gt; Settings &gt; Payment</p>
              {renderField("stripe_currency", "Default Currency", "text", "CAD")}
              {renderField("stripe_tax_enabled", "Enable Tax Calculation", "toggle")}
              {renderField("stripe_allow_promo_codes", "Allow Promo Codes", "toggle")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Checkout Flow</h3>
              {renderField("checkout_success_url", "Success Redirect URL", "text", "/dashboard?payment=success")}
              {renderField("checkout_cancel_url", "Cancel Redirect URL", "text", "/pricing")}
              {renderField("checkout_collect_phone", "Collect Phone Number", "toggle")}
              {renderField("checkout_collect_address", "Collect Billing Address", "toggle")}
            </CardContent></Card>
            <Button onClick={() => saveSettings(["stripe_currency", "stripe_tax_enabled", "stripe_allow_promo_codes", "checkout_success_url", "checkout_cancel_url", "checkout_collect_phone", "checkout_collect_address"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Payment Settings
            </Button>
          </div>
        );
      case "integrations":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Calendly</h3>
              {renderField("calendly_enabled", "Enable Calendly Integration", "toggle")}
              <p className="text-xs text-muted-foreground">API key managed in Management UI &gt; Settings &gt; Secrets</p>
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Google Analytics</h3>
              {renderField("ga_enabled", "Enable Google Analytics", "toggle")}
              {renderField("ga_tracking_id", "Tracking ID", "text", "G-XXXXXXXXXX")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Webhooks</h3>
              {renderField("webhook_enrollment_url", "Enrollment Webhook URL", "text", "https://...")}
              {renderField("webhook_payment_url", "Payment Webhook URL", "text", "https://...")}
              {renderField("webhook_lead_url", "Lead Webhook URL", "text", "https://...")}
            </CardContent></Card>
            <Button onClick={() => saveSettings(["calendly_enabled", "ga_enabled", "ga_tracking_id", "webhook_enrollment_url", "webhook_payment_url", "webhook_lead_url"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Integration Settings
            </Button>
          </div>
        );
      case "database":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-semibold">Database Status</h3>
                  <p className="text-sm text-muted-foreground">TiDB Cloud — Connected</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-muted-foreground">Engine</p><p className="font-medium">MySQL / TiDB</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-muted-foreground">SSL</p><p className="font-medium text-green-600">Enabled</p></div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h3 className="font-semibold mb-2">Connection Details</h3>
              <p className="text-sm text-muted-foreground">Full connection info available in Management UI &gt; Database &gt; Settings (bottom-left gear icon). Remember to enable SSL.</p>
            </CardContent></Card>
          </div>
        );
      case "developer":
        return (
          <div className="space-y-6">
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">API Configuration</h3>
              {renderField("api_rate_limit", "Rate Limit (requests/min)", "text", "60")}
              {renderField("api_cors_origins", "CORS Origins", "text", "https://www.rusingacademy.ca")}
              {renderField("api_debug_mode", "Debug Mode", "toggle")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">System Logs</h3>
              <p className="text-sm text-muted-foreground">View server logs, error tracking, and performance metrics in the Management UI &gt; Dashboard panel.</p>
              {renderField("log_level", "Log Level", "text", "info")}
              {renderField("log_retention_days", "Log Retention (days)", "text", "30")}
            </CardContent></Card>
            <Card><CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Maintenance</h3>
              {renderField("maintenance_mode", "Maintenance Mode", "toggle")}
              {renderField("maintenance_message", "Maintenance Message", "textarea", "We are currently performing scheduled maintenance...")}
            </CardContent></Card>
            <Button onClick={() => saveSettings(["api_rate_limit", "api_cors_origins", "api_debug_mode", "log_level", "log_retention_days", "maintenance_mode", "maintenance_message"])} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Developer Settings
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">Configure every aspect of your ecosystem — no code required.</p>
      </div>
      <div className="flex gap-6">
        <div className="w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${activeTab === tab.key ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"}`}>
              <tab.icon className="h-4 w-4 shrink-0" />
              <div className="min-w-0"><p className="truncate">{tab.title}</p><p className="text-xs text-muted-foreground truncate">{tab.desc}</p></div>
              {activeTab === tab.key && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{tabs.find(t => t.key === activeTab)?.title}</CardTitle>
              <CardDescription>{tabs.find(t => t.key === activeTab)?.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {settingsQuery.isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading settings...
                </div>
              ) : renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
