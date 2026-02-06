import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Globe, Palette, Shield, Bell, CreditCard, Link2, Database, Code } from "lucide-react";

export default function AdminSettings() {
  const sections = [
    { title: "Site Details", desc: "Control homepage, SEO, and general site info", icon: Globe },
    { title: "Branding", desc: "Logo, colors, fonts, and visual identity", icon: Palette },
    { title: "Security", desc: "Authentication, passwords, and access control", icon: Shield },
    { title: "Notifications", desc: "Email notifications and alert preferences", icon: Bell },
    { title: "Payments", desc: "Stripe configuration and payment settings", icon: CreditCard },
    { title: "Integrations", desc: "Connect external services and webhooks", icon: Link2 },
    { title: "Database", desc: "View database status and manage backups", icon: Database },
    { title: "Developer", desc: "API keys, webhooks, and advanced settings", icon: Code },
  ];
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Configure your ecosystem.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Card key={s.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast(s.title, { description: "Configure in Management UI Settings" })}>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-muted"><s.icon className="h-5 w-5 text-muted-foreground" /></div>
              <div><h3 className="font-semibold mb-0.5">{s.title}</h3><p className="text-sm text-muted-foreground">{s.desc}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
