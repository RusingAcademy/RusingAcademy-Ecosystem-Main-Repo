import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Palette, Layout, Type, Eye, Edit, Paintbrush, Layers, Monitor, Save } from "lucide-react";

export default function DesignAdmin() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("themes");

  const { data: settings } = trpc.kajabiDesign.getSettings.useQuery();

  const [primaryColor, setPrimaryColor] = useState("#1e3a5f");
  const [secondaryColor, setSecondaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    if (settings) {
      setPrimaryColor(settings.primaryColor || "#1e3a5f");
      setSecondaryColor(settings.secondaryColor || "#7c3aed");
      setAccentColor(settings.accentColor || "#3b82f6");
      setFontFamily(settings.fontFamily || "Inter");
      setLogoUrl(settings.logoUrl || "");
      setFaviconUrl(settings.faviconUrl || "");
    }
  }, [settings]);

  const saveMut = trpc.kajabiDesign.updateSettings.useMutation({
    onSuccess: () => toast.success("Design settings saved"),
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    saveMut.mutate({ primaryColor, secondaryColor, accentColor, fontFamily, logoUrl: logoUrl || undefined, faviconUrl: faviconUrl || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Design</h1><p className="text-sm text-muted-foreground">Customize the look and feel of your website — themes, colors, fonts, and layout.</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/admin/preview-mode")}><Eye className="h-4 w-4" /> Preview</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/admin/pages")}><Edit className="h-4 w-4" /> Visual Editor</Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saveMut.isPending}><Save className="h-4 w-4" /> {saveMut.isPending ? "Saving..." : "Save"}</Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="themes">Themes</TabsTrigger><TabsTrigger value="colors">Colors & Branding</TabsTrigger><TabsTrigger value="typography">Typography</TabsTrigger><TabsTrigger value="layout">Layout</TabsTrigger></TabsList>
        <TabsContent value="themes" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ name: "RusingAcademy Default", desc: "Professional dark theme with brand colors", active: true },{ name: "Light Professional", desc: "Clean white background with subtle accents", active: false },{ name: "Bold Modern", desc: "High contrast with vibrant gradients", active: false }].map(theme => (
              <Card key={theme.name} className={theme.active ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="h-32 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 mb-3 flex items-center justify-center"><Palette className="h-8 w-8 text-white/50" /></div>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-sm">{theme.name}</p><p className="text-xs text-muted-foreground">{theme.desc}</p></div>
                    {theme.active ? <Badge>Active</Badge> : <Button variant="outline" size="sm" onClick={() => toast("Theme switching coming soon")}>Apply</Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="colors" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2"><Paintbrush className="h-5 w-5" /> Brand Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Primary Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border" /><Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="font-mono" /></div></div>
              <div><Label>Secondary Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border" /><Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="font-mono" /></div></div>
              <div><Label>Accent Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border" /><Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="font-mono" /></div></div>
            </div>
            <div className="mt-4"><p className="text-sm font-medium mb-2">Preview</p><div className="flex gap-3"><div className="w-16 h-16 rounded-lg" style={{ backgroundColor: primaryColor }} /><div className="w-16 h-16 rounded-lg" style={{ backgroundColor: secondaryColor }} /><div className="w-16 h-16 rounded-lg" style={{ backgroundColor: accentColor }} /></div></div>
            <div className="space-y-3 mt-4">
              <div><Label>Logo URL</Label><Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className="mt-1" /></div>
              <div><Label>Favicon URL</Label><Input value={faviconUrl} onChange={e => setFaviconUrl(e.target.value)} placeholder="https://..." className="mt-1" /></div>
              {logoUrl && <div className="mt-2"><p className="text-xs text-muted-foreground mb-1">Logo Preview:</p><img src={logoUrl} alt="Logo" className="max-h-16 object-contain" /></div>}
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="typography" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2"><Type className="h-5 w-5" /> Typography</h3>
            <div><Label>Font Family</Label><Select value={fontFamily} onValueChange={setFontFamily}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Inter">Inter</SelectItem><SelectItem value="Poppins">Poppins</SelectItem><SelectItem value="Roboto">Roboto</SelectItem><SelectItem value="Open Sans">Open Sans</SelectItem><SelectItem value="Montserrat">Montserrat</SelectItem><SelectItem value="Lato">Lato</SelectItem></SelectContent></Select></div>
            <div className="p-4 border rounded-lg mt-4" style={{ fontFamily }}><p className="text-2xl font-bold mb-2" style={{ fontFamily }}>Heading Preview — {fontFamily}</p><p className="text-sm text-muted-foreground" style={{ fontFamily }}>The quick brown fox jumps over the lazy dog. RusingAcademy helps public servants achieve bilingual excellence.</p></div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="layout" className="mt-4">
          <Card><CardContent className="p-6 space-y-4">
            <h3 className="font-medium">Layout Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              {[{ name: "Full Width", icon: Monitor, active: true },{ name: "Boxed", icon: Layout, active: false },{ name: "Sidebar", icon: Layers, active: false }].map(l => (
                <button key={l.name} className={`p-4 border rounded-lg text-center transition-colors ${l.active ? "ring-2 ring-primary" : "hover:bg-accent"}`} onClick={() => toast("Layout switching coming soon")}>
                  <l.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm font-medium">{l.name}</p>
                </button>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
