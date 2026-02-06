import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Plus, FileText, GripVertical, Trash2, Eye, EyeOff, Layout,
  Type, Image, List, MessageSquare, Star, ArrowUp, ArrowDown, Pencil,
  Navigation, Loader2, LayoutGrid, Archive
} from "lucide-react";

type PageTab = "pages" | "editor" | "navigation";

const SECTION_TYPES = [
  { type: "hero", label: "Hero Banner", icon: Layout, desc: "Full-width hero with title, subtitle, CTA" },
  { type: "text", label: "Text Block", icon: Type, desc: "Rich text content section" },
  { type: "features", label: "Features Grid", icon: LayoutGrid, desc: "Feature cards in a grid layout" },
  { type: "testimonials", label: "Testimonials", icon: MessageSquare, desc: "Student/client testimonials" },
  { type: "cta", label: "Call to Action", icon: Star, desc: "Conversion-focused CTA section" },
  { type: "image_gallery", label: "Image Gallery", icon: Image, desc: "Image gallery or media showcase" },
  { type: "faq", label: "FAQ", icon: List, desc: "Frequently asked questions accordion" },
  { type: "pricing", label: "Pricing Table", icon: Star, desc: "Pricing plans comparison" },
];

export default function PageBuilder() {
  const [activeTab, setActiveTab] = useState<PageTab>("pages");
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageType, setNewPageType] = useState<string>("landing");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuLocation, setNewMenuLocation] = useState("header");
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  const pagesQuery = trpc.cms.listPages.useQuery();
  const pageQuery = trpc.cms.getPage.useQuery({ id: editingPageId! }, { enabled: !!editingPageId });
  const menusQuery = trpc.cms.listMenus.useQuery();
  const menuItemsQuery = trpc.cms.getMenuItems.useQuery({ menuId: selectedMenuId! }, { enabled: !!selectedMenuId });

  const createPageMut = trpc.cms.createPage.useMutation({ onSuccess: () => { pagesQuery.refetch(); setShowCreateDialog(false); toast.success("Page created"); } });
  const updatePageMut = trpc.cms.updatePage.useMutation({ onSuccess: () => { pageQuery.refetch(); pagesQuery.refetch(); toast.success("Page updated"); } });
  const deletePageMut = trpc.cms.deletePage.useMutation({ onSuccess: () => { pagesQuery.refetch(); setEditingPageId(null); setActiveTab("pages"); toast.success("Page deleted"); } });
  const addSectionMut = trpc.cms.addSection.useMutation({ onSuccess: () => { pageQuery.refetch(); toast.success("Section added"); } });
  const updateSectionMut = trpc.cms.updateSection.useMutation({ onSuccess: () => pageQuery.refetch() });
  const deleteSectionMut = trpc.cms.deleteSection.useMutation({ onSuccess: () => { pageQuery.refetch(); toast.success("Section removed"); } });
  const reorderMut = trpc.cms.reorderSections.useMutation({ onSuccess: () => pageQuery.refetch() });
  const createMenuMut = trpc.cms.createMenu.useMutation({ onSuccess: () => { menusQuery.refetch(); setShowMenuDialog(false); toast.success("Menu created"); } });
  const addMenuItemMut = trpc.cms.addMenuItem.useMutation({ onSuccess: () => { menuItemsQuery.refetch(); toast.success("Item added"); } });
  const deleteMenuItemMut = trpc.cms.deleteMenuItem.useMutation({ onSuccess: () => { menuItemsQuery.refetch(); toast.success("Item removed"); } });

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) { toast.error("Title is required"); return; }
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createPageMut.mutate({ title: newPageTitle, slug, pageType: newPageType as any });
  };

  const openEditor = (pageId: number) => {
    setEditingPageId(pageId);
    setActiveTab("editor");
  };

  const moveSection = useCallback((sectionId: number, direction: "up" | "down") => {
    if (!pageQuery.data?.sections) return;
    const sections = [...(pageQuery.data.sections as any[])];
    const idx = sections.findIndex((s: any) => s.id === sectionId);
    if (direction === "up" && idx > 0) {
      [sections[idx], sections[idx - 1]] = [sections[idx - 1], sections[idx]];
    } else if (direction === "down" && idx < sections.length - 1) {
      [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
    }
    reorderMut.mutate({ pageId: editingPageId!, sectionIds: sections.map((s: any) => s.id) });
  }, [pageQuery.data, editingPageId, reorderMut]);

  const renderPagesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages & CMS</h1>
          <p className="text-sm text-muted-foreground">Create and manage landing pages, sales pages, and custom pages — drag & drop.</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Page</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Page</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Page Title</Label><Input value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} placeholder="e.g. SLE Exam Prep Landing Page" /></div>
              <div className="space-y-1.5"><Label>URL Slug</Label><Input value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} placeholder="auto-generated from title" /></div>
              <div className="space-y-1.5">
                <Label>Page Type</Label>
                <Select value={newPageType} onValueChange={setNewPageType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="sales">Sales Page</SelectItem>
                    <SelectItem value="about">About Page</SelectItem>
                    <SelectItem value="custom">Custom Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleCreatePage} disabled={createPageMut.isPending}>
                {createPageMut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />} Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {pagesQuery.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading pages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(pagesQuery.data as any[] || []).map((page: any) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => openEditor(page.id)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted"><FileText className="h-5 w-5 text-muted-foreground" /></div>
                  <Badge variant={page.status === "published" ? "default" : page.status === "archived" ? "secondary" : "outline"}>{page.status || "draft"}</Badge>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{page.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">/{page.slug}</p>
                <Badge variant="outline" className="text-xs">{page.pageType}</Badge>
              </CardContent>
            </Card>
          ))}
          {(pagesQuery.data as any[] || []).length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No pages yet. Click "New Page" to create your first page.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderEditor = () => {
    const page = pageQuery.data as any;
    if (!page) return <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading page...</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { setEditingPageId(null); setActiveTab("pages"); }}>Back to Pages</Button>
            <div><h1 className="text-xl font-bold">{page.title}</h1><p className="text-xs text-muted-foreground">/{page.slug} — {page.pageType}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => updatePageMut.mutate({ id: page.id, status: page.status === "published" ? "draft" : "published" })}>
              {page.status === "published" ? <><EyeOff className="h-4 w-4 mr-1" /> Unpublish</> : <><Eye className="h-4 w-4 mr-1" /> Publish</>}
            </Button>
            <Button variant="outline" size="sm" onClick={() => updatePageMut.mutate({ id: page.id, status: "archived" })}><Archive className="h-4 w-4 mr-1" /> Archive</Button>
            <Button variant="destructive" size="sm" onClick={() => { if (confirm("Delete this page?")) deletePageMut.mutate({ id: page.id }); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Add Section</h3>
            {SECTION_TYPES.map((st) => (
              <button key={st.type} onClick={() => addSectionMut.mutate({ pageId: page.id, sectionType: st.type, title: st.label, sortOrder: (page.sections?.length || 0) })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left text-sm">
                <st.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div><p className="font-medium">{st.label}</p><p className="text-xs text-muted-foreground">{st.desc}</p></div>
              </button>
            ))}
          </div>

          <div className="col-span-2 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Page Sections ({page.sections?.length || 0})</h3>
            {(page.sections as any[] || []).length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <Layout className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No sections yet. Click a section type on the left to add one.</p>
              </div>
            )}
            {(page.sections as any[] || []).map((section: any, idx: number) => (
              <Card key={section.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{section.sectionType}</Badge>
                        <span className="font-medium text-sm truncate">{section.title || `Section ${idx + 1}`}</span>
                      </div>
                      <Input defaultValue={section.title || ""} placeholder="Section title..." className="h-8 text-sm"
                        onBlur={(e) => { if (e.target.value !== section.title) updateSectionMut.mutate({ id: section.id, title: e.target.value }); }} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(section.id, "up")} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(section.id, "down")} disabled={idx === (page.sections?.length || 0) - 1}><ArrowDown className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateSectionMut.mutate({ id: section.id, isVisible: !section.isVisible })}>
                        {section.isVisible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Remove this section?")) deleteSectionMut.mutate({ id: section.id }); }}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Page SEO & Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-sm">Meta Title</Label><Input defaultValue={page.metaTitle || ""} placeholder="SEO title..." onBlur={(e) => updatePageMut.mutate({ id: page.id, metaTitle: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-sm">Meta Description</Label><Input defaultValue={page.metaDescription || ""} placeholder="SEO description..." onBlur={(e) => updatePageMut.mutate({ id: page.id, metaDescription: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm">Custom CSS</Label><Textarea defaultValue={page.customCss || ""} placeholder="/* Custom styles for this page */" rows={3} onBlur={(e) => updatePageMut.mutate({ id: page.id, customCss: e.target.value })} /></div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Navigation Builder</h1><p className="text-sm text-muted-foreground">Manage header, footer, and sidebar navigation menus.</p></div>
        <Dialog open={showMenuDialog} onOpenChange={setShowMenuDialog}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Menu</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Navigation Menu</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Menu Name</Label><Input value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} placeholder="e.g. Main Navigation" /></div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Select value={newMenuLocation} onValueChange={setNewMenuLocation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={() => { if (newMenuName.trim()) createMenuMut.mutate({ name: newMenuName, location: newMenuLocation }); }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Menus</h3>
          {(menusQuery.data as any[] || []).map((menu: any) => (
            <button key={menu.id} onClick={() => setSelectedMenuId(menu.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors ${selectedMenuId === menu.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <div><p className="font-medium">{menu.name}</p><p className="text-xs text-muted-foreground">{menu.location}</p></div>
            </button>
          ))}
          {(menusQuery.data as any[] || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No menus yet.</p>}
        </div>

        <div className="col-span-2">
          {selectedMenuId ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Menu Items</h3>
              {(menuItemsQuery.data as any[] || []).map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg group">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1"><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.url}</p></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => deleteMenuItemMut.mutate({ id: item.id })}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1"><Label className="text-xs">Label</Label><Input value={newItemLabel} onChange={(e) => setNewItemLabel(e.target.value)} placeholder="Home" className="h-9" /></div>
                <div className="flex-1 space-y-1"><Label className="text-xs">URL</Label><Input value={newItemUrl} onChange={(e) => setNewItemUrl(e.target.value)} placeholder="/" className="h-9" /></div>
                <Button size="sm" onClick={() => { if (newItemLabel && newItemUrl) { addMenuItemMut.mutate({ menuId: selectedMenuId, label: newItemLabel, url: newItemUrl, sortOrder: (menuItemsQuery.data as any[] || []).length }); setNewItemLabel(""); setNewItemUrl(""); } }}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <Navigation className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Select a menu to manage its items, or create a new menu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-1 mb-6 border-b">
        {([
          { key: "pages" as PageTab, label: "Pages", icon: FileText },
          { key: "editor" as PageTab, label: "Editor", icon: Pencil },
          { key: "navigation" as PageTab, label: "Navigation", icon: Navigation },
        ]).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pages" && renderPagesList()}
      {activeTab === "editor" && (editingPageId ? renderEditor() : <div className="text-center py-12 text-muted-foreground"><p>Select a page to edit, or create a new one.</p><Button variant="outline" className="mt-3" onClick={() => setActiveTab("pages")}>Go to Pages</Button></div>)}
      {activeTab === "navigation" && renderNavigation()}
    </div>
  );
}
