import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Megaphone, Mail, Workflow, Zap, Target, ArrowRight, Calendar } from "lucide-react";

export default function MarketingOverview() {
  const [, navigate] = useLocation();

  const { data: overview } = trpc.kajabiMarketingOverview.getOverview.useQuery();

  const stats = {
    totalLeads: overview?.totalLeads ?? 0,
    activeSubscribers: overview?.activeSubscribers ?? 0,
    emailsSent30d: overview?.emailsSent30d ?? 0,
    activeFunnels: overview?.activeFunnels ?? 0,
    activeAutomations: overview?.activeAutomations ?? 0,
    upcomingEvents: overview?.upcomingEvents ?? 0,
  };

  const channels = [
    { label: "Email Campaigns", icon: Mail, path: "/admin/email", stat: `${stats.emailsSent30d} sent (30d)`, color: "#2563eb" },
    { label: "Funnels", icon: Workflow, path: "/admin/funnels", stat: `${stats.activeFunnels} active`, color: "#7c3aed" },
    { label: "Automations", icon: Zap, path: "/admin/automations", stat: `${stats.activeAutomations} running`, color: "#059669" },
    { label: "Forms", icon: Target, path: "/admin/forms", stat: `${stats.totalLeads} leads captured`, color: "#ea580c" },
    { label: "Events", icon: Calendar, path: "/admin/events", stat: `${stats.upcomingEvents} upcoming`, color: "#dc2626" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Marketing</h1><p className="text-sm text-muted-foreground">Overview of all your marketing channels and campaigns.</p></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Email Subscribers</p><p className="text-2xl font-bold mt-1">{stats.activeSubscribers}</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Total Leads</p><p className="text-2xl font-bold mt-1">{stats.totalLeads}</p></CardContent></Card>
        <Card className="border-l-4 border-l-purple-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Active Automations</p><p className="text-2xl font-bold mt-1">{stats.activeAutomations}</p></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase">Upcoming Events</p><p className="text-2xl font-bold mt-1">{stats.upcomingEvents}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Marketing Channels</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map(ch => (
              <button key={ch.label} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors text-left w-full" onClick={() => navigate(ch.path)}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ch.color}15` }}><ch.icon className="h-5 w-5" style={{ color: ch.color }} /></div>
                <div className="flex-1"><p className="font-medium text-sm">{ch.label}</p><p className="text-xs text-muted-foreground">{ch.stat}</p></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card><CardContent className="p-6">
        <h3 className="font-medium mb-3">Marketing Tips</h3>
        <div className="space-y-3">
          {["Set up an email welcome sequence to nurture new subscribers automatically.", "Create a lead magnet funnel to capture emails from your landing pages.", "Use automations to tag contacts based on their behavior and interests.", "Schedule regular events and webinars to engage your community."].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg"><Megaphone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><p className="text-sm">{tip}</p></div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}
