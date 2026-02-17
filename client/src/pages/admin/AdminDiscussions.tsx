
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

// TODO: Replace with tRPC router types once available
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
  // TODO: Replace with tRPC hooks
  const [stats, setStats] = useState({
    totalThreads: 1256,
    totalReplies: 8432,
    activeUsers: 345,
    reportedContent: 12,
  });
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "Struggling with French Subjunctive",
      category: "Grammar",
      author: "Eleanor Vance",
      replies: 15,
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Best resources for SLE vocabulary?",
      category: "SLE Prep",
      author: "Marcus Holloway",
      replies: 22,
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Pronunciation tips for 'r' sound",
      category: "Pronunciation",
      author: "Anya Petrova",
      replies: 8,
      status: "locked",
      createdAt: new Date(),
    },
  ]);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([
    {
      id: "fc1",
      threadId: "2",
      threadTitle: "Best resources for SLE vocabulary?",
      contentSnippet: "This is spam, buy my course...",
      reportedBy: "John Doe",
      reason: "Spam/Advertising",
      reportedAt: new Date(),
    },
  ]);
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

  // TODO: Implement tRPC mutations for actions
  const handleCreateThread = () => {
    toast.info("New thread creation initiated.");
    // Placeholder for mutation
  };

  const handleLockThread = (id: string) => {
    setThreads(
      threads.map((t) => (t.id === id ? { ...t, status: "locked" } : t))
    );
    toast.success(`Thread ${id} has been locked.`);
  };

  const handleDeleteThread = (id: string) => {
    setThreads(threads.filter((t) => t.id !== id));
    toast.warning(`Thread ${id} has been deleted.`);
  };

  const handleSaveChanges = () => {
    // TODO: Add tRPC mutation to save settings
    toast.success("Settings have been saved successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-background/50 min-h-screen">
      <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-border dark:border-border">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/50">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground dark:text-foreground">Discussion Boards</h1>
            <p className="text-sm text-gray-500 dark:text-muted-foreground">
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
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-background dark:bg-card">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replies</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-card divide-y divide-gray-200 dark:bg-background dark:divide-gray-700">
                    {threads.map((thread) => (
                      <tr key={thread.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-foreground dark:text-foreground">{thread.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-muted-foreground">{thread.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-muted-foreground">{thread.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-muted-foreground">{thread.replies}</td>
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
                    <div key={item.id} className="p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.threadTitle}</p>
                          <p className="text-sm text-muted-foreground italic">\"{item.contentSnippet}\"</p>
                          <p className="text-xs text-muted-foreground mt-1">Reported by {item.reportedBy} for: <span className="font-medium">{item.reason}</span></p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-2"/>Dismiss</Button>
                          <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove Content</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Flag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-foreground dark:text-foreground">No flagged content</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-muted-foreground">The moderation queue is currently empty.</p>
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
                    <Button>Add Category</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Posting Rules</h3>
                <textarea
                  className="w-full p-2 border rounded-md bg-transparent dark:border-border"
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
