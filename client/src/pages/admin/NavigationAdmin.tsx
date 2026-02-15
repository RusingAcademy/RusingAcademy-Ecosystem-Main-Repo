import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Navigation, Plus, GripVertical, Edit, Trash2, ExternalLink, Menu } from "lucide-react";

export default function NavigationAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [labelFr, setLabelFr] = useState("");
  const [url, setUrl] = useState("");
  const [position, setPosition] = useState<"header" | "footer" | "sidebar">("header");

  const { data, isLoading, refetch } = trpc.kajabiNavigation.list.useQuery();
  const items = data?.items ?? [];

  const createMut = trpc.kajabiNavigation.create.useMutation({
    onSuccess: () => { toast.success("Navigation item added"); setCreateOpen(false); setLabel(""); setLabelFr(""); setUrl(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMut = trpc.kajabiNavigation.delete.useMutation({
    onSuccess: () => { toast.success("Item removed"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const headerItems = items.filter((i: any) => i.position === "header");
  const footerItems = items.filter((i: any) => i.position === "footer");
  const sidebarItems = items.filter((i: any) => i.position === "sidebar");

  const renderGroup = (title: string, icon: any, groupItems: any[]) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">{icon}<h3 className="font-medium">{title}</h3></div>
          <Badge variant="outline">{groupItems.length} items</Badge>
        </div>
        {groupItems.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No items in this section.</p>
        ) : (
          <div className="space-y-2">
            {groupItems.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg group hover:bg-accent/50 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label} {item.labelFr && <span className="text-muted-foreground">/ {item.labelFr}</span>}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">{item.url} {item.openInNewTab && <ExternalLink className="h-3 w-3" />}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast("Edit coming soon")}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { if (confirm("Remove?")) deleteMut.mutate({ id: item.id }); }}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Navigation</h1><p className="text-sm text-muted-foreground">Manage header, footer, and sidebar navigation menus for your website.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add Menu Item</Button>
      </div>
      {isLoading ? <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div> : (
        <div className="space-y-4">
          {renderGroup("Header Navigation", <Menu className="h-5 w-5 text-muted-foreground" />, headerItems)}
          {renderGroup("Footer Navigation", <Navigation className="h-5 w-5 text-muted-foreground" />, footerItems)}
          {sidebarItems.length > 0 && renderGroup("Sidebar Navigation", <Menu className="h-5 w-5 text-muted-foreground" />, sidebarItems)}
        </div>
      )}
      {/* Preview */}
      <Card><CardContent className="p-4">
        <h3 className="font-medium mb-3">Navigation Preview</h3>
        <div className="border rounded-lg p-4 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">RusingAcademy</span>
            <div className="flex items-center gap-4">
              {headerItems.map((item: any) => (<span key={item.id} className="text-sm text-slate-300 hover:text-white cursor-pointer">{item.label}</span>))}
            </div>
          </div>
        </div>
      </CardContent></Card>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Menu Item</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Label (EN)</Label><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Home" /></div>
              <div><Label>Label (FR)</Label><Input value={labelFr} onChange={e => setLabelFr(e.target.value)} placeholder="Accueil" /></div>
            </div>
            <div><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="/page-name" /></div>
            <div><Label>Position</Label>
              <Select value={position} onValueChange={(v) => setPosition(v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="header">Header</SelectItem><SelectItem value="footer">Footer</SelectItem><SelectItem value="sidebar">Sidebar</SelectItem></SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate({ label, labelFr: labelFr || undefined, url, position })} disabled={!label || !url || createMut.isPending}>{createMut.isPending ? "Adding..." : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
