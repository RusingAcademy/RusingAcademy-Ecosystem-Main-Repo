import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PenTool, Plus, Search, Eye, Edit, Trash2, Tag, BarChart3, FileText, Globe } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function BlogAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("draft");

  const { data, isLoading, refetch } = trpc.kajabiBlog.list.useQuery({ search: search || undefined });
  const { data: stats } = trpc.kajabiBlog.getStats.useQuery();
  const { data: categories } = trpc.kajabiBlog.getCategories.useQuery();
  const posts = data?.items ?? [];

  const createMut = trpc.kajabiBlog.create.useMutation({
    onSuccess: () => { toast.success("Post created"); setCreateOpen(false); setTitle(""); setContent(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMut = trpc.kajabiBlog.delete.useMutation({
    onSuccess: () => { toast.success("Post deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const createCatMut = trpc.kajabiBlog.createCategory.useMutation({
    onSuccess: () => toast.success("Category created"),
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blog</h1><p className="text-sm text-muted-foreground">Create and manage blog posts to drive traffic and engage your audience.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><FileText className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.total ?? 0}</p><p className="text-xs text-muted-foreground">Total Posts</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Globe className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{stats?.published ?? 0}</p><p className="text-xs text-muted-foreground">Published</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Eye className="h-5 w-5 text-purple-600" /><div><p className="text-xl font-bold">{stats?.totalViews ?? 0}</p><p className="text-xs text-muted-foreground">Total Views</p></div></CardContent></Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="posts">Posts</TabsTrigger><TabsTrigger value="categories">Categories</TabsTrigger></TabsList>
        <TabsContent value="posts" className="mt-4 space-y-4">
          <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div> : posts.length === 0 ? (
            <EmptyState icon={PenTool} title="No blog posts yet" description="Start writing blog posts to attract organic traffic and engage your audience with valuable bilingual content." actionLabel="Write First Post" onAction={() => setCreateOpen(true)} />
          ) : (
            <div className="space-y-3">{posts.map((post: any) => (
              <Card key={post.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {post.featuredImageUrl ? <img src={post.featuredImageUrl} className="w-16 h-12 rounded object-cover" /> : <div className="w-16 h-12 rounded bg-blue-100 flex items-center justify-center"><FileText className="h-6 w-6 text-blue-600" /></div>}
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-[10px]">{post.status}</Badge>
                        {post.category && <Badge variant="outline" className="text-[10px]">{post.category}</Badge>}
                        <span className="text-xs text-muted-foreground">{post.viewCount || 0} views</span>
                        <Badge variant="outline" className="text-[10px]">{post.language || "en"}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Blog editor coming soon")}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: post.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}</div>
          )}
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium">Blog Categories</h3>
            <div className="space-y-2">
              {(categories ?? []).map((cat: any) => (
                <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <Badge variant="outline" className="text-[10px]">{cat.slug}</Badge>
                </div>
              ))}
              {(!categories || categories.length === 0) && <p className="text-sm text-muted-foreground">No categories yet.</p>}
            </div>
            <Button variant="outline" size="sm" onClick={() => { const name = prompt("Category name:"); if (name) createCatMut.mutate({ name }); }}><Plus className="h-4 w-4 mr-1.5" /> Add Category</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create Blog Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your blog post title" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="sle">SLE Preparation</SelectItem><SelectItem value="tips">Language Tips</SelectItem><SelectItem value="career">Career Development</SelectItem><SelectItem value="bilingualism">Bilingualism</SelectItem></SelectContent></Select></div>
              <div><Label>Language</Label><Select value={language} onValueChange={setLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="fr">Français</SelectItem><SelectItem value="both">Bilingual</SelectItem></SelectContent></Select></div>
              <div><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label>Content</Label><Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your blog post..." rows={8} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ title, content, category, status: status as any, language: language as any })} disabled={!title || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
