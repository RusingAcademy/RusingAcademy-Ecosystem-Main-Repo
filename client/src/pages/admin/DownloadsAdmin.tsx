import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FolderDown, Plus, Download, FileText, Edit, BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function DownloadsAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("pdf");

  const { data: downloadsData, isLoading, refetch } = trpc.kajabiDownloadsAdmin.list.useQuery();
  const downloads = downloadsData?.items ?? [];
  const { data: stats } = trpc.kajabiDownloadsAdmin.getStats.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Downloads</h1><p className="text-sm text-muted-foreground">Manage downloadable resources — PDFs, worksheets, templates, and more.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Download</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><FolderDown className="h-5 w-5 text-orange-600" /><div><p className="text-xl font-bold">{stats?.totalResources ?? downloads.length}</p><p className="text-xs text-muted-foreground">Resources</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Download className="h-5 w-5 text-blue-600" /><div><p className="text-xl font-bold">{stats?.totalDownloads ?? 0}</p><p className="text-xs text-muted-foreground">Total Downloads</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="h-5 w-5 text-green-600" /><div><p className="text-xl font-bold">{downloads.filter((d: any) => d.isPublished || d.status === "published").length}</p><p className="text-xs text-muted-foreground">Published</p></div></CardContent></Card>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : downloads.length === 0 ? (
        <EmptyState icon={FolderDown} title="No downloadable resources yet" description="Upload PDFs, worksheets, templates, and other resources for your students." actionLabel="Upload Resource" onAction={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-2">{downloads.map((dl: any) => (
          <Card key={dl.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center"><FileText className="h-5 w-5 text-orange-600" /></div>
                <div>
                  <p className="font-medium">{dl.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{dl.fileType || "pdf"}</Badge>
                    <span className="text-xs text-muted-foreground">{dl.downloadCount || 0} downloads</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Edit coming soon")}><Edit className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}</div>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Downloadable Resource</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title" /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this resource about?" /></div>
            <div><Label>File Type</Label><Select value={fileType} onValueChange={setFileType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="docx">Word Document</SelectItem><SelectItem value="xlsx">Spreadsheet</SelectItem><SelectItem value="zip">ZIP Archive</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast("File upload + create coming soon"); setCreateOpen(false); }} disabled={!title}>Create Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
