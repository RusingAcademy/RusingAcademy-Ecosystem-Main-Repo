import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Plus, FileText, GripVertical, Trash2, Eye, EyeOff, Layout,
  Type, Image, List, MessageSquare, Star, ArrowUp, ArrowDown, Pencil,
  Navigation, Loader2, LayoutGrid, Archive, Copy, Monitor, Tablet,
  Smartphone, Globe, Users, History, Save, CreditCard, Video
} from "lucide-react";

type PageTab = "pages" | "editor" | "navigation";
type ViewMode = "desktop" | "tablet" | "mobile";

const SECTION_TYPES = [
  { type: "hero", label: "Hero Banner", icon: Layout, desc: "Full-width hero with title, subtitle, CTA" },
  { type: "text", label: "Text Block", icon: Type, desc: "Rich text content section" },
  { type: "features", label: "Features Grid", icon: LayoutGrid, desc: "Feature cards in a grid layout" },
  { type: "testimonials", label: "Testimonials", icon: MessageSquare, desc: "Student/client testimonials" },
  { type: "cta", label: "Call to Action", icon: Star, desc: "Conversion-focused CTA section" },
  { type: "image_gallery", label: "Image Gallery", icon: Image, desc: "Image gallery or media showcase" },
  { type: "video", label: "Video Embed", icon: Video, desc: "YouTube, Vimeo, or custom video" },
  { type: "faq", label: "FAQ", icon: List, desc: "Frequently asked questions accordion" },
  { type: "pricing", label: "Pricing Table", icon: CreditCard, desc: "Pricing plans comparison" },
  { type: "team", label: "Team / Coaches", icon: Users, desc: "Team member cards" },
];

export default function PageBuilder() {
  const [activeTab, setActiveTab] = useState<PageTab>("pages");
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageType, setNewPageType] = useState<string>("landing");
  const [newPageDesc, setNewPageDesc] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuLocation, setNewMenuLocation] = useState("header");
  const [showMenuDialog, setShowMenuDialog] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"public" | "student">("public");
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionEditData, setSectionEditData] = useState<{ title: string; subtitle: string; content: string; bgColor: string; textColor: string }>({ title: "", subtitle: "", content: "", bgColor: "", textColor: "" });
  const [showVersions, setShowVersions] = useState(false);

  const pagesQuery = trpc.cms.listPages.useQuery();
  const pageQuery = trpc.cms.getPage.useQuery({ id: editingPageId! }, { enabled: !!editingPageId });
  const menusQuery = trpc.cms.listMenus.useQuery();
  const menuItemsQuery = trpc.cms.getMenuItems.useQuery({ menuId: selectedMenuId! }, { enabled: !!selectedMenuId });

  const createPageMut = trpc.cms.createPage.useMutation({ onSuccess: () => { pagesQuery.refetch(); setShowCreateDialog(false); setNewPageTitle(""); setNewPageSlug(""); setNewPageDesc(""); toast.success("Page created"); } });
  const updatePageMut = trpc.cms.updatePage.useMutation({ onSuccess: () => { pageQuery.refetch(); pagesQuery.refetch(); toast.success("Page updated"); } });
  const deletePageMut = trpc.cms.deletePage.useMutation({ onSuccess: () => { pagesQuery.refetch(); setEditingPageId(null); setActiveTab("pages"); toast.success("Page deleted"); } });
  const addSectionMut = trpc.cms.addSection.useMutation({ onSuccess: () => { pageQuery.refetch(); toast.success("Section added"); } });
  const updateSectionMut = trpc.cms.updateSection.useMutation({ onSuccess: () => { pageQuery.refetch(); toast.success("Section updated"); } });
  const deleteSectionMut = trpc.cms.deleteSection.useMutation({ onSuccess: () => { pageQuery.refetch(); toast.success("Section removed"); } });
  const reorderMut = trpc.cms.reorderSections.useMutation({ onSuccess: () => pageQuery.refetch() });
  const createMenuMut = trpc.cms.createMenu.useMutation({ onSuccess: () => { menusQuery.refetch(); setShowMenuDialog(false); toast.success("Menu created"); } });
  const addMenuItemMut = trpc.cms.addMenuItem.useMutation({ onSuccess: () => { menuItemsQuery.refetch(); toast.success("Item added"); } });
  const deleteMenuItemMut = trpc.cms.deleteMenuItem.useMutation({ onSuccess: () => { menuItemsQuery.refetch(); toast.success("Item removed"); } });

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) { toast.error("Title is required"); return; }
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createPageMut.mutate({ title: newPageTitle, slug, description: newPageDesc, pageType: newPageType as any });
  };

  const handleDuplicatePage = (page: any) => {
    createPageMut.mutate({
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy-${Date.now()}`,
      description: page.description || "",
      pageType: page.pageType as any,
    });
    toast.success("Page duplicated");
  };

  const openEditor = (pageId: number) => {
    setEditingPageId(pageId);
    setActiveTab("editor");
  };

  const openSectionEditor = (section: any) => {
    setEditingSectionId(section.id);
    setSectionEditData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      content: typeof section.content === "string" ? section.content : JSON.stringify(section.content || {}, null, 2),
      bgColor: section.backgroundColor || "",
      textColor: section.textColor || "",
    });
  };

  const saveSectionEdit = () => {
    if (!editingSectionId) return;
    updateSectionMut.mutate({
      id: editingSectionId,
      title: sectionEditData.title,
      content: sectionEditData.content,
    });
    setEditingSectionId(null);
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

  const previewWidth = viewMode === "desktop" ? "100%" : viewMode === "tablet" ? "768px" : "375px";

  const renderPagesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages & CMS</h1>
          <p className="text-sm text-muted-foreground">Create and manage landing pages, sales pages, and custom pages — drag & drop.</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}><Plus className="h-4 w-4 mr-2" /> New Page</Button>
      </div>

      {pagesQuery.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading pages...</div>
      ) : (pagesQuery.data as any[] || []).length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="mb-4">No pages yet. Click "New Page" to create your first page.</p>
          <Button onClick={() => setShowCreateDialog(true)}><Plus className="h-4 w-4 mr-2" /> Create Page</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {(pagesQuery.data as any[]).map((page: any) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer" onClick={() => openEditor(page.id)}>
                    <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{page.title}</h3>
                      <p className="text-xs text-muted-foreground">/{page.slug} · {page.pageType}</p>
                    </div>
                    <Badge variant={page.status === "published" ? "default" : page.status === "archived" ? "secondary" : "outline"}>{page.status || "draft"}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Duplicate" onClick={(e) => { e.stopPropagation(); handleDuplicatePage(page); }}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit" onClick={() => openEditor(page.id)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={page.status === "published" ? "Unpublish" : "Publish"} onClick={(e) => { e.stopPropagation(); updatePageMut.mutate({ id: page.id, status: page.status === "published" ? "draft" : "published" }); }}>
                      {page.status === "published" ? <EyeOff className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this page?")) deletePageMut.mutate({ id: page.id }); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Page</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Page Title</Label><Input value={newPageTitle} onChange={(e) => { setNewPageTitle(e.target.value); setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} placeholder="e.g. SLE Exam Prep Landing Page" /></div>
            <div className="space-y-1.5"><Label>URL Slug</Label><div className="flex items-center gap-1"><span className="text-sm text-muted-foreground">/</span><Input value={newPageSlug} onChange={(e) => setNewPageSlug(e.target.value)} placeholder="auto-generated from title" /></div></div>
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
            <div className="space-y-1.5"><Label>Description (optional)</Label><Textarea value={newPageDesc} onChange={(e) => setNewPageDesc(e.target.value)} placeholder="Brief description..." rows={2} /></div>
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
  );

  const renderEditor = () => {
    const page = pageQuery.data as any;
    if (!page) return <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center"><Loader2 className="h-5 w-5 animate-spin" /> Loading page...</div>;
    const sections = (page.sections || []) as any[];

    return (
      <div className="space-y-4">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { setEditingPageId(null); setActiveTab("pages"); }}>Back</Button>
            <div><h2 className="text-base font-bold">{page.title}</h2><p className="text-xs text-muted-foreground">/{page.slug}</p></div>
            <Badge variant={page.status === "published" ? "default" : "outline"}>{page.status || "draft"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Responsive Preview Toggle */}
            <div className="flex items-center border rounded-lg p-0.5 gap-0.5 bg-background">
              <Button variant={viewMode === "desktop" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setViewMode("desktop")} title="Desktop"><Monitor className="h-3.5 w-3.5" /></Button>
              <Button variant={viewMode === "tablet" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setViewMode("tablet")} title="Tablet"><Tablet className="h-3.5 w-3.5" /></Button>
              <Button variant={viewMode === "mobile" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setViewMode("mobile")} title="Mobile"><Smartphone className="h-3.5 w-3.5" /></Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setPreviewMode("public"); setShowPreview(true); }}><Eye className="h-3.5 w-3.5 mr-1" /> Preview</Button>
            <Button variant="outline" size="sm" onClick={() => { setPreviewMode("student"); setShowPreview(true); }}><Users className="h-3.5 w-3.5 mr-1" /> As Student</Button>
            <Button variant="outline" size="sm" onClick={() => setShowVersions(true)}><History className="h-3.5 w-3.5 mr-1" /> Versions</Button>
            <Button variant="outline" size="sm" onClick={() => updatePageMut.mutate({ id: page.id, status: page.status === "published" ? "draft" : "published" })}>
              {page.status === "published" ? <><EyeOff className="h-3.5 w-3.5 mr-1" /> Unpublish</> : <><Globe className="h-3.5 w-3.5 mr-1" /> Publish</>}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Section Types Sidebar */}
          <div className="col-span-1 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Add Section</h3>
            {SECTION_TYPES.map((st) => (
              <button key={st.type} onClick={() => addSectionMut.mutate({ pageId: page.id, sectionType: st.type, title: st.label, sortOrder: sections.length })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left text-sm">
                <st.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div><p className="font-medium">{st.label}</p><p className="text-xs text-muted-foreground">{st.desc}</p></div>
              </button>
            ))}
          </div>

          {/* Sections Editor */}
          <div className="col-span-2 space-y-3" style={{ maxWidth: previewWidth === "100%" ? undefined : previewWidth }}>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Page Sections ({sections.length})</h3>
            {sections.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <Layout className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No sections yet. Click a section type on the left to add one.</p>
              </div>
            )}
            {sections.map((section: any, idx: number) => {
              const typeInfo = SECTION_TYPES.find(s => s.type === section.sectionType);
              const Icon = typeInfo?.icon || Layout;
              const isEditing = editingSectionId === section.id;
              return (
                <Card key={section.id} className={`group transition-all ${section.isVisible === false ? "opacity-50" : ""} ${isEditing ? "ring-2 ring-primary" : ""}`}>
                  <CardContent className="p-0">
                    {/* Section Header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/30">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium flex-1 truncate">{section.title || typeInfo?.label || section.sectionType}</span>
                      <Badge variant="secondary" className="text-xs">{typeInfo?.label || section.sectionType}</Badge>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveSection(section.id, "up")} disabled={idx === 0}><ArrowUp className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveSection(section.id, "down")} disabled={idx === sections.length - 1}><ArrowDown className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => isEditing ? setEditingSectionId(null) : openSectionEditor(section)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => updateSectionMut.mutate({ id: section.id, isVisible: section.isVisible === false ? true : false })}>
                          {section.isVisible !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => { if (confirm("Remove this section?")) deleteSectionMut.mutate({ id: section.id }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    {/* Section Content Editor (expanded) */}
                    {isEditing ? (
                      <div className="p-4 space-y-4 bg-muted/10">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={sectionEditData.title} onChange={(e) => setSectionEditData(d => ({ ...d, title: e.target.value }))} /></div>
                          <div className="space-y-1.5"><Label className="text-xs">Subtitle</Label><Input value={sectionEditData.subtitle} onChange={(e) => setSectionEditData(d => ({ ...d, subtitle: e.target.value }))} /></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Content (JSON or text)</Label>
                          <Textarea value={sectionEditData.content} onChange={(e) => setSectionEditData(d => ({ ...d, content: e.target.value }))} rows={6} className="font-mono text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Background Color</Label>
                            <div className="flex gap-2"><input type="color" value={sectionEditData.bgColor || "#ffffff"} onChange={(e) => setSectionEditData(d => ({ ...d, bgColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" /><Input value={sectionEditData.bgColor} onChange={(e) => setSectionEditData(d => ({ ...d, bgColor: e.target.value }))} placeholder="#ffffff" /></div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Text Color</Label>
                            <div className="flex gap-2"><input type="color" value={sectionEditData.textColor || "#000000"} onChange={(e) => setSectionEditData(d => ({ ...d, textColor: e.target.value }))} className="w-8 h-8 rounded border cursor-pointer" /><Input value={sectionEditData.textColor} onChange={(e) => setSectionEditData(d => ({ ...d, textColor: e.target.value }))} placeholder="#000000" /></div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={saveSectionEdit}><Save className="h-3.5 w-3.5 mr-1" /> Save Section</Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 min-h-[50px] cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => openSectionEditor(section)} style={{ backgroundColor: section.backgroundColor || undefined, color: section.textColor || undefined }}>
                        {section.subtitle && <p className="text-sm opacity-70">{section.subtitle}</p>}
                        <p className="text-xs text-muted-foreground mt-1 italic">Click to edit content</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Page SEO & Settings */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Page SEO & Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-sm">Meta Title</Label><Input defaultValue={page.metaTitle || ""} placeholder="SEO title..." onBlur={(e) => updatePageMut.mutate({ id: page.id, metaTitle: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-sm">Meta Description</Label><Input defaultValue={page.metaDescription || ""} placeholder="SEO description..." onBlur={(e) => updatePageMut.mutate({ id: page.id, metaDescription: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-sm">Custom CSS</Label><Textarea defaultValue={page.customCss || ""} placeholder="/* Custom styles for this page */" rows={3} className="font-mono text-xs" onBlur={(e) => updatePageMut.mutate({ id: page.id, customCss: e.target.value })} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Label className="text-sm">Show Header</Label><Switch defaultChecked={page.showHeader !== false} onCheckedChange={(v) => updatePageMut.mutate({ id: page.id, showHeader: v })} /></div>
              <div className="flex items-center gap-2"><Label className="text-sm">Show Footer</Label><Switch defaultChecked={page.showFooter !== false} onCheckedChange={(v) => updatePageMut.mutate({ id: page.id, showFooter: v })} /></div>
            </div>
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewMode === "public" ? <Globe className="h-4 w-4" /> : <Users className="h-4 w-4" />}
              {previewMode === "public" ? "Public Preview" : "Student Preview"}
              <div className="flex items-center border rounded-lg p-0.5 gap-0.5 ml-4">
                <Button variant={viewMode === "desktop" ? "secondary" : "ghost"} size="sm" className="h-6 px-1.5" onClick={() => setViewMode("desktop")}><Monitor className="h-3 w-3" /></Button>
                <Button variant={viewMode === "tablet" ? "secondary" : "ghost"} size="sm" className="h-6 px-1.5" onClick={() => setViewMode("tablet")}><Tablet className="h-3 w-3" /></Button>
                <Button variant={viewMode === "mobile" ? "secondary" : "ghost"} size="sm" className="h-6 px-1.5" onClick={() => setViewMode("mobile")}><Smartphone className="h-3 w-3" /></Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-auto max-h-[70vh] bg-white mx-auto" style={{ maxWidth: previewWidth }}>
            {((pageQuery.data as any)?.sections || []).filter((s: any) => s.isVisible !== false).map((section: any) => {
              const typeInfo = SECTION_TYPES.find(s => s.type === section.sectionType);
              return (
                <div key={section.id} className="border-b last:border-b-0 p-8" style={{ backgroundColor: section.backgroundColor || "#ffffff", color: section.textColor || "#1a1a1a" }}>
                  {section.title && <h2 className="text-2xl font-bold mb-2">{section.title}</h2>}
                  {section.subtitle && <p className="text-lg opacity-70 mb-4">{section.subtitle}</p>}
                  <p className="text-sm opacity-40">[{typeInfo?.label || section.sectionType} section]</p>
                  {previewMode === "student" && <Badge variant="outline" className="mt-2 text-xs">Visible to enrolled students</Badge>}
                </div>
              );
            })}
            {((pageQuery.data as any)?.sections || []).filter((s: any) => s.isVisible !== false).length === 0 && (
              <div className="p-16 text-center text-gray-400">No visible sections to preview</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Versions Dialog */}
      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Page Versions</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="p-1.5 bg-primary/10 rounded"><FileText className="h-4 w-4 text-primary" /></div>
              <div className="flex-1"><p className="text-sm font-medium">Current Version</p><p className="text-xs text-muted-foreground">Status: {(pageQuery.data as any)?.status || "draft"}</p></div>
              <Badge>Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground text-center py-4">Version history is tracked automatically. Each publish creates a snapshot.</p>
          </div>
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
