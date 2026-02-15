import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MessageCircle, Users, Shield, Plus, BarChart3, MessageSquare, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function CommunityAdmin() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: overview, isLoading } = trpc.kajabiCommunityAdmin.getOverview.useQuery();
  const { data: recentThreads } = trpc.kajabiCommunityAdmin.getRecentThreads.useQuery();
  const { data: flaggedContent } = trpc.kajabiCommunityAdmin.getFlaggedContent.useQuery();

  const stats = {
    categories: overview?.categories ?? 0,
    threads: overview?.threads ?? 0,
    posts: overview?.posts ?? 0,
    activeThisWeek: overview?.activeThisWeek ?? 0,
  };

  // Also try to get existing forum categories from the forum router
  const { data: forumCategories } = (trpc as any).forum?.getCategories?.useQuery?.() ?? { data: [] };
  const categories = Array.isArray(forumCategories) ? forumCategories : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Community</h1><p className="text-sm text-muted-foreground">Manage your community forums, discussions, and member engagement.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => toast("Create category coming soon")}><Plus className="h-4 w-4" /> New Category</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><MessageSquare className="h-5 w-5 text-cyan-600" /><div><p className="text-xl font-bold">{stats.threads}</p><p className="text-xs text-muted-foreground">Threads</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><MessageCircle className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats.posts}</p><p className="text-xs text-muted-foreground">Posts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats.activeThisWeek}</p><p className="text-xs text-muted-foreground">Active This Week</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-red-600" /><div><p className="text-xl font-bold">{(flaggedContent as any)?.items?.length ?? 0}</p><p className="text-xs text-muted-foreground">Flagged</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Categories</TabsTrigger><TabsTrigger value="recent">Recent Threads</TabsTrigger><TabsTrigger value="moderation">Moderation</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
        <TabsContent value="overview" className="mt-4">
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div> : categories.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No community categories" description="Create forum categories to organize discussions and help members find relevant topics." actionLabel="Create Category" onAction={() => toast("Create category coming soon")} />
          ) : (
            <div className="space-y-2">{categories.map((cat: any) => (
              <Card key={cat.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div><p className="font-medium">{cat.name}</p><p className="text-xs text-muted-foreground mt-1">{cat.description || cat.nameFr || "No description"}</p></div>
                  <div className="flex items-center gap-3"><Badge variant="outline" className="text-[10px]">{cat.threadCount || 0} threads</Badge><Button variant="ghost" size="sm" onClick={() => toast("Category editor coming soon")}>Edit</Button></div>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          {(recentThreads as any)?.items?.length > 0 ? (
            <div className="space-y-2">{(recentThreads as any).items.map((thread: any) => (
              <Card key={thread.id}><CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{thread.title}</p><p className="text-xs text-muted-foreground">{thread.author} • {new Date(thread.createdAt).toLocaleDateString()}</p></div>
                <Badge variant="outline" className="text-[10px]">{thread.replyCount || 0} replies</Badge>
              </CardContent></Card>
            ))}</div>
          ) : <EmptyState icon={MessageSquare} title="No recent threads" description="Community threads will appear here as members start discussions." />}
        </TabsContent>
        <TabsContent value="moderation" className="mt-4">
          {(flaggedContent as any)?.items?.length > 0 ? (
            <div className="space-y-2">{(flaggedContent as any).items.map((item: any) => (
              <Card key={item.id}><CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium">{item.content?.substring(0, 80)}...</p><p className="text-xs text-muted-foreground">{item.reason} • {item.reportedBy}</p></div>
                <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => toast("Review coming soon")}>Review</Button><Button variant="destructive" size="sm" onClick={() => toast("Remove coming soon")}>Remove</Button></div>
              </CardContent></Card>
            ))}</div>
          ) : <EmptyState icon={Shield} title="Moderation Queue Clear" description="No flagged content. Your community is healthy!" />}
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <EmptyState icon={BarChart3} title="Community Analytics" description="Track community growth, engagement metrics, and popular discussion topics." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
