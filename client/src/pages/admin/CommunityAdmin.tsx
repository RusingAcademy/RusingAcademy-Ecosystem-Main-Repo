import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MessageCircle, Users, Shield, Plus, BarChart3, MessageSquare, AlertTriangle, Sparkles } from "lucide-react";
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

  const { data: forumCategories } = (trpc as any).forum?.getCategories?.useQuery?.() ?? { data: [] };
  const categories = Array.isArray(forumCategories) ? forumCategories : [];

  const statCards = [
    { icon: MessageSquare, label: "Threads", value: stats.threads, color: "#17E2C6", bg: "rgba(23, 226, 198, 0.08)" },
    { icon: MessageCircle, label: "Posts", value: stats.posts, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" },
    { icon: Users, label: "Active This Week", value: stats.activeThisWeek, color: "#22C55E", bg: "rgba(34, 197, 94, 0.08)" },
    { icon: AlertTriangle, label: "Flagged", value: (flaggedContent as any)?.items?.length ?? 0, color: "#FF6B6B", bg: "rgba(255, 107, 107, 0.08)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header — High contrast admin style */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5" style={{ color: "#17E2C6" }} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">Community</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your community forums, discussions, and member engagement.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #3C5759, #4A6B6D)",
            boxShadow: "0 2px 8px rgba(60, 87, 89, 0.2)",
          }}
          onClick={() => toast.info("Create category — launching soon!")}
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New Category
        </Button>
      </div>

      {/* Stats Grid — Premium glassmorphism cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 transition-all duration-200 hover:shadow-md"
            style={{
              background: "var(--card, white)",
              boxShadow: "0 2px 8px rgba(25, 37, 36, 0.04)",
              border: "1px solid rgba(60, 87, 89, 0.08)",
            }}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs — Premium styled */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent Threads</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="No community categories"
              description="Create forum categories to organize discussions and help members find relevant topics."
              actionLabel="Create Category"
              onAction={() => toast.info("Create category — launching soon!")}
            />
          ) : (
            <div className="space-y-2">
              {categories.map((cat: any) => (
                <Card
                  key={cat.id}
                  className="transition-all duration-200 hover:shadow-sm border-0"
                  style={{ border: "1px solid rgba(60, 87, 89, 0.08)" }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{cat.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cat.description || cat.nameFr || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px]">
                        {cat.threadCount || 0} threads
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Category editor — launching soon!")}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          {(recentThreads as any)?.items?.length > 0 ? (
            <div className="space-y-2">
              {(recentThreads as any).items.map((thread: any) => (
                <Card
                  key={thread.id}
                  className="border-0"
                  style={{ border: "1px solid rgba(60, 87, 89, 0.08)" }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{thread.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {thread.author} • {new Date(thread.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {thread.replyCount || 0} replies
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No recent threads"
              description="Community threads will appear here as members start discussions."
            />
          )}
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          {(flaggedContent as any)?.items?.length > 0 ? (
            <div className="space-y-2">
              {(flaggedContent as any).items.map((item: any) => (
                <Card
                  key={item.id}
                  className="border-0"
                  style={{ border: "1px solid rgba(255, 107, 107, 0.1)" }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.content?.substring(0, 80)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.reason} • {item.reportedBy}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Review — launching soon!")}
                      >
                        Review
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => toast.info("Remove — launching soon!")}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Shield}
              title="Moderation Queue Clear"
              description="No flagged content. Your community is healthy!"
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <EmptyState
            icon={BarChart3}
            title="Community Analytics"
            description="Track community growth, engagement metrics, and popular discussion topics."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
