/**
 * LandingPages Admin — Phase 8.1
 * List, create, edit, publish, and delete landing pages.
 * Protected by LANDING_PAGES_V1 feature flag.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useFeatureFlag, useFeatureFlags } from "@/hooks/useFeatureFlag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, Globe, FileText, Loader2 } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Landing Pages", description: "Manage and configure landing pages" },
  fr: { title: "Landing Pages", description: "Gérer et configurer landing pages" },
};

export default function LandingPages() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const { isLoading: flagLoading } = useFeatureFlags();
  const isEnabled = useFeatureFlag("LANDING_PAGES_V1");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const { data: pages, isLoading, refetch } = trpc.landingPages.list.useQuery(undefined, {
    enabled: isEnabled,
  });

  const createMutation = trpc.landingPages.create.useMutation({
    onSuccess: () => {
      toast.success("Landing page created");
      refetch();
      setShowCreate(false);
      setNewTitle("");
      setNewSlug("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = trpc.landingPages.update.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.landingPages.delete.useMutation({
    onSuccess: () => {
      toast.success("Page deleted");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (flagLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!isEnabled) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-bold mb-2">Landing Pages</h2>
        <p className="text-gray-500">Enable the <code>LANDING_PAGES_V1</code> feature flag to access this module.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-green-100 text-green-700",
    archived: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-gray-500 text-sm">Create and manage marketing landing pages</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Page
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Create New Landing Page</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }}
                placeholder="e.g., SLE Preparation Program"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm">/p/</span>
                <input
                  className="flex-1 border rounded-lg px-3 py-2"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="sle-preparation"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => createMutation.mutate({
                title: newTitle,
                slug: newSlug,
                sections: [{
                  id: crypto.randomUUID(),
                  type: "hero",
                  order: 0,
                  content: {
                    headline: newTitle,
                    subheadline: "Add your subheadline here",
                    ctaText: "Get Started",
                    ctaLink: "/membership",
                  },
                }],
              })}
              disabled={!newTitle || !newSlug || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Page"}
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : !pages?.length ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No landing pages yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page: any) => (
            <div key={page.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-gray-500">/p/{page.slug}</p>
                </div>
                <Badge className={statusColors[page.status] || ""}>{page.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                {page.status === "draft" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMutation.mutate({ id: page.id, status: "published" })}
                  >
                    Publish
                  </Button>
                )}
                {page.status === "published" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/p/${page.slug}`, "_blank")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = `/admin/landing-pages/${page.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Delete this page?")) {
                      deleteMutation.mutate({ id: page.id });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
