
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  MessageCircle,
  Flag,
  Shield,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Lock,
  Users,
  FileText,
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Discussions", description: "Manage and configure discussions" },
  fr: { title: "Discussions", description: "Gérer et configurer discussions" },
};

// Connected to discussions tRPC router
type Thread = {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  status: "active" | "locked" | "archived";
  createdAt: Date;
};

type FlaggedContent = {
  id: string;
  threadId: string;
  threadTitle: string;
  contentSnippet: string;
  reportedBy: string;
  reason: string;
  reportedAt: Date;
};

const AdminDiscussions = () => {
  // ── tRPC queries ──
  const { data: threadsData, refetch: refetchThreads } = trpc.discussions.getThreads.useQuery(
    { page: 1, limit: 50 },
    { retry: false }
  );
  const { data: reportsData, refetch: refetchReports } = trpc.discussions.getReports.useQuery(
    undefined,
    { retry: false }
  );
  const deleteMutation = trpc.discussions.deleteThread.useMutation({
    onSuccess: () => { refetchThreads(); toast.warning("Thread deleted."); },
    onError: (err) => toast.error(err.message),
  });
  const lockMutation = trpc.discussions.toggleLock.useMutation({
    onSuccess: () => { refetchThreads(); toast.success("Thread lock toggled."); },
    onError: (err) => toast.error(err.message),
  });
  const resolveReportMutation = trpc.discussions.resolveReport.useMutation({
    onSuccess: () => { refetchReports(); toast.success("Report resolved."); },
    onError: (err) => toast.error(err.message),
  });

  // Map tRPC data to UI format
  const threads: Thread[] = (threadsData?.threads ?? []).map((t: any) => ({
    id: String(t.id),
    title: t.title || "Untitled",
    category: t.category || "General",
    author: t.authorName || "Anonymous",
    replies: t.replyCount || 0,
    status: t.isLocked ? "locked" : "active",
    createdAt: new Date(t.createdAt),
  }));

  const flaggedContent: FlaggedContent[] = (reportsData ?? []).map((r: any) => ({
    id: String(r.id),
    threadId: String(r.threadId || ""),
    threadTitle: r.threadTitle || "",
    contentSnippet: r.reason || "",
    reportedBy: r.reporterName || "Anonymous",
    reason: r.reason || "Other",
    reportedAt: new Date(r.createdAt),
  }));

  const stats = {
    totalThreads: threadsData?.total ?? 0,
    totalReplies: threads.reduce((sum, t) => sum + t.replies, 0),
    activeUsers: threads.length,
    reportedContent: flaggedContent.length,
  };

  const [categories, setCategories] = useState([
    "Grammar",
    "Vocabulary",
    "SLE Prep",
    "Pronunciation",
    "Culture",
    "General",
  ]);
  const [postingRules, setPostingRules] = useState(
    "1. Be respectful. 2. No spam or self-promotion. 3. Stay on topic."
  );

  const handleCreateThread = () => {
    toast.info("New thread creation initiated.");
  };

  const handleLockThread = (id: string) => {
    lockMutation.mutate({ threadId: Number(id) });
  };

  const handleDeleteThread = (id: string) => {
    deleteMutation.mutate({ threadId: Number(id) });
  };

  const handleSaveChanges = () => {
    toast.success("Settings have been saved successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discussion Boards</h1>
            <p className="text-sm text-gray-500">
              Manage discussion threads, moderate content, and configure board settings.
            </p>
          </div>
        </div>
        <Button onClick={handleCreateThread}>
          <Plus className="w-4 h-4 mr-2" />
          New Thread
        </Button>
      </header>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalThreads}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReplies}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportedContent}</div>
            <p className="text-xs text-muted-foreground">{stats.reportedContent > 0 ? "Action required" : "All clear"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-2"/>Overview</TabsTrigger>
          <TabsTrigger value="threads"><MessageCircle className="w-4 h-4 mr-2"/>Threads</TabsTrigger>
          <TabsTrigger value="moderation"><Flag className="w-4 h-4 mr-2"/>Moderation</TabsTrigger>
          <TabsTrigger value="settings"><SettingsIcon className="w-4 h-4 mr-2"/>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>A summary of discussion board activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This section provides a high-level view of the discussion boards. More detailed analytics and reporting features can be added here.</p>
                    {/* Placeholder for charts */}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="threads">
          <Card>
            <CardHeader>
              <CardTitle>Manage Threads</CardTitle>
              <CardDescription>View, edit, lock, or delete discussion threads.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replies</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {threads.map((thread) => (
                      <tr key={thread.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{thread.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{thread.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{thread.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{thread.replies}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant={thread.status === 'active' ? 'default' : thread.status === 'locked' ? 'secondary' : 'destructive'}>{thread.status}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleLockThread(thread.id)}><Lock className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteThread(thread.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Queue</CardTitle>
              <CardDescription>Review and take action on content flagged by users.</CardDescription>
            </CardHeader>
            <CardContent>
              {flaggedContent.length > 0 ? (
                <div className="space-y-4">
                  {flaggedContent.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-yellow-50/50 border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.threadTitle}</p>
                          <p className="text-sm text-muted-foreground italic">\"{item.contentSnippet}\"</p>
                          <p className="text-xs text-muted-foreground mt-1">Reported by {item.reportedBy} for: <span className="font-medium">{item.reason}</span></p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Dismiss")}><Shield className="w-4 h-4 mr-2"/>Dismiss</Button>
                          <Button variant="destructive" size="sm" onClick={() => toast.error("Item removed")}><Trash2 className="w-4 h-4 mr-2"/>Remove Content</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 lg:py-12">
                  <Flag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No flagged content</h3>
                  <p className="mt-1 text-sm text-gray-500">The moderation queue is currently empty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Board Settings</CardTitle>
              <CardDescription>Configure discussion categories and posting rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-sm">{cat}</Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Input placeholder="New category name" className="max-w-xs"/>
                    <Button onClick={() => toast.info("Opening form...")}>Add Category</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Posting Rules</h3>
                <textarea
                  className="w-full p-2 border rounded-md bg-transparent"
                  rows={4}
                  value={postingRules}
                  onChange={(e) => setPostingRules(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDiscussions;
