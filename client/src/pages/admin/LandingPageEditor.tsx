/**
 * LandingPageEditor — Phase 8.1
 * Visual editor for landing page sections with drag-and-drop ordering.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "@/components/templates/SectionRenderer";
import { toast } from "sonner";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, Loader2 } from "lucide-react";

const SECTION_TYPES = [
  { type: "hero", label: "Hero Banner", defaultContent: { headline: "Your Headline", subheadline: "Your subheadline", ctaText: "Get Started", ctaLink: "/membership" } },
  { type: "features", label: "Features Grid", defaultContent: { heading: "Features", features: [{ title: "Feature 1", description: "Description" }, { title: "Feature 2", description: "Description" }, { title: "Feature 3", description: "Description" }] } },
  { type: "pricing", label: "Pricing Cards", defaultContent: { heading: "Pricing", tiers: [{ name: "Basic", price: "$29", features: ["Feature 1"], ctaText: "Choose", ctaLink: "/membership" }] } },
  { type: "testimonials", label: "Testimonials", defaultContent: { heading: "What Our Students Say", testimonials: [{ name: "Student", quote: "Great experience!", rating: 5 }] } },
  { type: "cta", label: "Call to Action", defaultContent: { heading: "Ready to Start?", ctaText: "Join Now", ctaLink: "/membership" } },
] as const;

export default function LandingPageEditor() {
  const params = useParams<{ id: string }>();
  const pageId = parseInt(params.id || "0");
  const [sections, setSections] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const { data: page, isLoading } = trpc.landingPages.getById.useQuery({ id: pageId }, { enabled: pageId > 0 });

  const updateMutation = trpc.landingPages.update.useMutation({
    onSuccess: () => toast.success("Page saved"),
    onError: (err: any) => toast.error(err.message),
  });

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setSlug(page.slug);
      setSections(page.sections as any[] || []);
      setMetaTitle(page.metaTitle || "");
      setMetaDescription(page.metaDescription || "");
    }
  }, [page]);

  const addSection = (type: string, defaultContent: Record<string, any>) => {
    setSections([...sections, {
      id: crypto.randomUUID(),
      type,
      order: sections.length,
      content: defaultContent,
    }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newSections.length) return;
    [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const updateSectionContent = (id: string, content: Record<string, any>) => {
    setSections(sections.map((s) => s.id === id ? { ...s, content } : s));
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: pageId,
      title,
      slug,
      sections,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (previewMode) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-white border-b p-3 flex justify-between items-center">
          <span className="font-semibold">Preview Mode</span>
          <Button onClick={() => setPreviewMode(false)} variant="outline">Exit Preview</Button>
        </div>
        {sections.sort((a, b) => a.order - b.order).map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit: {title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)} className="gap-2">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Page Settings */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Page Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="w-full border rounded-lg px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input className="w-full border rounded-lg px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title (SEO)</label>
            <input className="w-full border rounded-lg px-3 py-2" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description (SEO)</label>
            <input className="w-full border rounded-lg px-3 py-2" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <h3 className="font-semibold">Sections</h3>
        {sections.sort((a, b) => a.order - b.order).map((section, index) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
              <span className="font-medium text-sm capitalize">{section.type} Section</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => moveSection(index, "up")} disabled={index === 0}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeSection(section.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-0">
              <SectionRenderer
                section={section}
                editable
                onChange={(content) => updateSectionContent(section.id, content)}
              />
            </div>
          </div>
        ))}

        {/* Add Section */}
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">Add a section</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SECTION_TYPES.map((st) => (
              <Button
                key={st.type}
                variant="outline"
                size="sm"
                onClick={() => addSection(st.type, st.defaultContent)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> {st.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
