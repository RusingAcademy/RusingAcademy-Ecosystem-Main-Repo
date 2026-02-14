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
import { toast } from "sonner";
import { Headphones, Plus, Edit, Trash2, Clock, BarChart3, Mic } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function PodcastsAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: podcasts, isLoading, refetch } = trpc.kajabiPodcasts.list.useQuery();
  const { data: stats } = trpc.kajabiPodcasts.getStats.useQuery();
  const allPodcasts = Array.isArray(podcasts) ? podcasts : [];

  const createMut = trpc.kajabiPodcasts.create.useMutation({
    onSuccess: () => { toast.success("Podcast created"); setCreateOpen(false); setTitle(""); setDescription(""); refetch(); },
    onError: (e) => toast.error(e.message || "Failed to create podcast"),
  });

  const deleteMut = trpc.kajabiPodcasts.delete.useMutation({
    onSuccess: () => { toast.success("Podcast deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Podcasts</h1>
          <p className="text-sm text-muted-foreground">Manage podcast shows and episodes for your audience.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Podcast</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Mic className="h-5 w-5 text-purple-600" /><div><p className="text-xl font-bold">{stats?.totalShows ?? 0}</p><p className="text-xs text-muted-foreground">Total Shows</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Headphones className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.totalEpisodes ?? 0}</p><p className="text-xs text-muted-foreground">Episodes</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-amber-600" /><div><p className="text-xl font-bold">{stats?.totalListens ?? 0}</p><p className="text-xs text-muted-foreground">Total Listens</p></div></CardContent></Card>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : allPodcasts.length === 0 ? (
        <EmptyState icon={Headphones} title="No podcasts yet" description="Create your first podcast show and start adding episodes." actionLabel="Create Podcast" onAction={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-3">
          {allPodcasts.map((podcast: any) => (
            <Card key={podcast.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"><Headphones className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <p className="font-medium">{podcast.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{podcast.episodeCount || 0} episodes</Badge>
                      <Badge variant={podcast.status === "active" ? "default" : "secondary"} className="text-[10px]">{podcast.status || "draft"}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Episode editor coming soon")}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if (confirm("Delete?")) deleteMut.mutate({ id: podcast.id }); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Podcast</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Podcast Show" /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this podcast about?" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ title, description })} disabled={!title || createMut.isPending}>{createMut.isPending ? "Creating..." : "Create Podcast"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
