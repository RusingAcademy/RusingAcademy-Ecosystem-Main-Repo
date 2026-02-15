import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users, UserCheck, UserPlus, Search, Download, Mail, Tag, MoreHorizontal } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function AllContacts() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Existing admin router for users
  const { data: usersData, isLoading: usersLoading } = trpc.admin.getUsers.useQuery();
  const allUsers = Array.isArray(usersData) ? usersData : ((usersData as any)?.users ?? []);

  // Kajabi contacts overview for aggregated stats
  const { data: contactsOverview } = trpc.kajabiContactsOverview.getOverview.useQuery();
  const { data: recentContacts } = trpc.kajabiContactsOverview.getRecentSignups.useQuery();

  // Existing CRM leads if available
  const { data: leadsData, isLoading: leadsLoading } = (trpc as any).crm?.getLeads?.useQuery?.() ?? { data: [], isLoading: false };
  const leads = Array.isArray(leadsData) ? leadsData : [];

  // Newsletter subscribers from kajabi
  const { data: subscribersData } = trpc.kajabiNewslettersAdmin.getStats.useQuery();

  const isLoading = usersLoading || leadsLoading;

  const contacts = useMemo(() => {
    const contactMap = new Map<string, any>();
    allUsers.forEach((u: any) => {
      const email = u.email?.toLowerCase();
      if (email) contactMap.set(email, { ...u, source: "user", type: "user" });
    });
    leads.forEach((l: any) => {
      const email = l.email?.toLowerCase();
      if (email && !contactMap.has(email)) contactMap.set(email, { ...l, name: `${l.firstName} ${l.lastName}`, source: "lead", type: "lead" });
    });
    return Array.from(contactMap.values());
  }, [allUsers, leads]);

  const filtered = contacts.filter(c => {
    if (search && !(c.name || c.email || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === "users") return c.type === "user";
    if (activeTab === "leads") return c.type === "lead";
    return true;
  });

  const overviewStats = contactsOverview ?? { totalUsers: allUsers.length, totalLeads: leads.length, totalSubscribers: 0, recentSignups: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">All Contacts</h1><p className="text-sm text-muted-foreground">Unified view of all users, leads, and subscribers across the ecosystem.</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Export coming soon")}><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-1.5" onClick={() => toast("Add contact coming soon")}><UserPlus className="h-4 w-4" /> Add Contact</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{overviewStats.totalUsers + overviewStats.totalLeads}</p><p className="text-xs text-muted-foreground">Total Contacts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserCheck className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{overviewStats.totalUsers}</p><p className="text-xs text-muted-foreground">Registered Users</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Tag className="h-5 w-5 text-purple-600" /><div><p className="text-xl font-bold">{overviewStats.totalLeads}</p><p className="text-xs text-muted-foreground">Leads</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Mail className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{subscribersData?.total ?? overviewStats.totalSubscribers}</p><p className="text-xs text-muted-foreground">Subscribers</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList>
          <TabsTrigger value="all">All ({contacts.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({allUsers.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
        </TabsList></Tabs>
      </div>
      {isLoading ? <div className="space-y-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No contacts found" description={search ? "Try adjusting your search." : "Contacts will appear as users sign up and leads are captured."} />
      ) : (
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase"><div className="col-span-4">Name</div><div className="col-span-3">Email</div><div className="col-span-2">Type</div><div className="col-span-2">Joined</div><div className="col-span-1"></div></div>
          {filtered.slice(0, 50).map((contact: any, idx: number) => (
            <Card key={contact.id || idx} className="hover:shadow-sm transition-shadow"><CardContent className="p-3"><div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center gap-3 min-w-0"><div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0">{(contact.name || "?")[0]?.toUpperCase()}</div><div className="min-w-0"><p className="text-sm font-medium truncate">{contact.name || "Unknown"}</p></div></div>
              <div className="col-span-3 text-sm text-muted-foreground truncate">{contact.email}</div>
              <div className="col-span-2"><Badge variant={contact.type === "user" ? "default" : "secondary"} className="text-[10px]">{contact.type}</Badge></div>
              <div className="col-span-2 text-xs text-muted-foreground">{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "—"}</div>
              <div className="col-span-1 flex justify-end"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast("Contact details coming soon")}><MoreHorizontal className="h-4 w-4" /></Button></div>
            </div></CardContent></Card>
          ))}
          {filtered.length > 50 && <p className="text-center text-sm text-muted-foreground py-4">Showing 50 of {filtered.length} contacts</p>}
        </div>
      )}
    </div>
  );
}
