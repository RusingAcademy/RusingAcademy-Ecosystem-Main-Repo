import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Newspaper, Plus, Send, Users, BarChart3, Mail, Eye, Edit } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function NewslettersAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("campaigns");

  const { data: subscribersData, isLoading } = trpc.kajabiNewslettersAdmin.getSubscribers.useQuery({});
  const subscribers = subscribersData?.items ?? [];
  const { data: stats } = trpc.kajabiNewslettersAdmin.getStats.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Newsletters</h1><p className="text-sm text-muted-foreground">Create and manage newsletter campaigns for your subscribers.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Campaign</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Newspaper className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Subscribers</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.active ?? 0}</p><p className="text-xs text-muted-foreground">Active</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Send className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">0</p><p className="text-xs text-muted-foreground">Campaigns Sent</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">0%</p><p className="text-xs text-muted-foreground">Avg Open Rate</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="campaigns">Campaigns</TabsTrigger><TabsTrigger value="subscribers">Subscribers</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
        <TabsContent value="campaigns" className="mt-4">
          <EmptyState icon={Newspaper} title="No campaigns yet" description="Create your first newsletter campaign to engage your subscribers with valuable content." actionLabel="Create Campaign" onAction={() => setCreateOpen(true)} />
        </TabsContent>
        <TabsContent value="subscribers" className="mt-4">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div> : subscribers.length === 0 ? (
            <EmptyState icon={Users} title="No subscribers yet" description="Subscribers are collected from your landing pages, signup forms, and opt-in widgets." />
          ) : (
            <div className="space-y-2">{subscribers.map((sub: any) => (
              <Card key={sub.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div><p className="font-medium">{sub.email}</p><p className="text-xs text-muted-foreground">Subscribed {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}</p></div>
                  </div>
                  <Badge variant={sub.isActive ? "default" : "secondary"} className="text-[10px]">{sub.isActive ? "Active" : "Unsubscribed"}</Badge>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <EmptyState icon={BarChart3} title="Newsletter Analytics" description="Track open rates, click rates, and subscriber growth over time." />
        </TabsContent>
      </Tabs>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Newsletter Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Subject Line</Label><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Your newsletter subject" /></div>
            <div><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your newsletter content..." rows={6} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast("Newsletter campaigns backend coming soon"); setCreateOpen(false); }} disabled={!subject}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
