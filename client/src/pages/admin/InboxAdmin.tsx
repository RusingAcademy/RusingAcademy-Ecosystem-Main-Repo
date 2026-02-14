import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Inbox, Mail, Star, Search, Clock, Reply } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function InboxAdmin() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const { data: messagesData, isLoading } = trpc.kajabiInbox.getMessages.useQuery({ type: "all" });
  const { data: inboxStats } = trpc.kajabiInbox.getStats.useQuery();

  const messages = (messagesData as any)?.items ?? [];
  const stats = inboxStats ?? { unread: 0, recentFormSubmissions: 0, total: 0 };

  const filtered = messages.filter((msg: any) => {
    if (activeTab === "unread" && msg.read) return false;
    if (activeTab === "starred" && !msg.starred) return false;
    if (search && !(msg.name || "").toLowerCase().includes(search.toLowerCase()) && !(msg.subject || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Inbox</h1><p className="text-sm text-muted-foreground">Unified inbox for all contact form submissions, inquiries, and messages.</p></div>
        <Badge variant="outline">{stats.total} messages</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Inbox className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Mail className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{stats.unread}</p><p className="text-xs text-muted-foreground">Unread</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Star className="h-5 w-5 text-yellow-600" /><div><p className="text-xl font-bold">{stats.recentFormSubmissions}</p><p className="text-xs text-muted-foreground">Form Submissions</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">{messages.filter((m: any) => m.status === "pending").length}</p><p className="text-xs text-muted-foreground">Pending Reply</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="unread">Unread</TabsTrigger><TabsTrigger value="starred">Starred</TabsTrigger></TabsList></Tabs>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Inbox is empty" description="Messages from contact forms, inquiries, and direct messages will appear here." />
      ) : (
        <div className="space-y-2">{filtered.map((msg: any, idx: number) => (
          <Card key={msg.id || idx} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-transparent" : "bg-blue-500"}`}></div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{msg.name || msg.firstName || "Unknown"} — {msg.subject || msg.formType || "Message"}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.message || msg.description || ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); toast("Reply coming soon"); }}><Reply className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}</div>
      )}
    </div>
  );
}
