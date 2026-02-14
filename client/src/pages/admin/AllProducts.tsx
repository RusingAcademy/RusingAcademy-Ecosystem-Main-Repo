import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  BookOpen, GraduationCap, Headphones, Newspaper, FolderDown,
  MessageCircle, Plus, Search, Eye, Edit, Package,
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

type ProductType = "all" | "courses" | "coaching" | "podcasts" | "newsletters" | "downloads" | "community";

const productTypes: { key: ProductType; label: string; icon: React.ElementType; color: string }[] = [
  { key: "all", label: "All", icon: Package, color: "#6366f1" },
  { key: "courses", label: "Courses", icon: BookOpen, color: "#2563eb" },
  { key: "coaching", label: "Coaching", icon: GraduationCap, color: "#059669" },
  { key: "podcasts", label: "Podcasts", icon: Headphones, color: "#7c3aed" },
  { key: "newsletters", label: "Newsletters", icon: Newspaper, color: "#dc2626" },
  { key: "downloads", label: "Downloads", icon: FolderDown, color: "#ea580c" },
  { key: "community", label: "Community", icon: MessageCircle, color: "#0891b2" },
];

export default function AllProducts() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ProductType>("all");

  // Courses from existing admin router
  const { data: coursesData, isLoading: coursesLoading } = trpc.admin.getAllCourses.useQuery();
  const courses = (Array.isArray(coursesData) ? coursesData : ((coursesData as any)?.courses ?? [])) as any[];

  // Podcasts from kajabi router
  const { data: podcastsData } = trpc.kajabiPodcasts.list.useQuery();
  const podcasts = podcastsData?.items ?? [];

  // Downloads from kajabi router
  const { data: downloadsData } = trpc.kajabiDownloadsAdmin.list.useQuery();
  const downloads = downloadsData?.items ?? [];

  // Newsletters from kajabi router
  const { data: newslettersData } = trpc.kajabiNewslettersAdmin.getSubscribers.useQuery({});
  const newsletters: any[] = []; // Newsletters are subscriber-based, not product-based

  // All Products aggregated stats from kajabi router
  const { data: allProductsStats } = trpc.kajabiAllProducts.getStats.useQuery();

  const isLoading = coursesLoading;

  const allProducts = [
    ...courses.map((c: any) => ({ ...c, productType: "courses" as const, productTitle: c.title || c.name })),
    ...podcasts.map((p: any) => ({ ...p, productType: "podcasts" as const, productTitle: p.title || p.name })),
    ...downloads.map((d: any) => ({ ...d, productType: "downloads" as const, productTitle: d.title || d.name })),
  ];

  const filtered = allProducts.filter(p => {
    if (activeTab !== "all" && p.productType !== activeTab) return false;
    if (search && !p.productTitle?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    courses: allProductsStats?.courses ?? courses.length,
    coaching: allProductsStats?.coaching ?? 0,
    podcasts: allProductsStats?.podcasts ?? podcasts.length,
    newsletters: allProductsStats?.newsletters ?? 0,
    downloads: allProductsStats?.downloads ?? downloads.length,
    community: allProductsStats?.community ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">All Products</h1><p className="text-sm text-muted-foreground">Manage all your digital products in one place.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => navigate("/admin/courses?action=create")}><Plus className="h-4 w-4" /> New Product</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {productTypes.filter(t => t.key !== "all").map(type => (
          <Card key={type.key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(type.key)}>
            <CardContent className="p-4 flex items-center gap-3">
              <type.icon className="h-5 w-5" style={{ color: type.color }} />
              <div><p className="text-lg font-bold">{stats[type.key as keyof typeof stats] ?? 0}</p><p className="text-xs text-muted-foreground">{type.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as ProductType)}><TabsList>{productTypes.map(t => (<TabsTrigger key={t.key} value={t.key} className="text-xs">{t.label}</TabsTrigger>))}</TabsList></Tabs>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description={search ? "Try adjusting your search or filters." : "Create your first product to get started."} actionLabel="Create Product" onAction={() => navigate("/admin/courses?action=create")} />
      ) : (
        <div className="space-y-2">{filtered.map((product, idx) => {
          const typeInfo = productTypes.find(t => t.key === product.productType);
          return (
            <Card key={`${product.productType}-${product.id || idx}`} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeInfo?.color}15` }}>{typeInfo && <typeInfo.icon className="h-5 w-5" style={{ color: typeInfo.color }} />}</div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{product.productTitle || "Untitled"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{typeInfo?.label}</Badge>
                      {product.status && <Badge variant={product.status === "published" ? "default" : "secondary"} className="text-[10px]">{product.status}</Badge>}
                      {product.price && <span className="text-xs text-muted-foreground">${(product.price / 100).toFixed(2)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                    if (product.productType === "courses") navigate(`/admin/courses`);
                    else if (product.productType === "podcasts") navigate(`/admin/podcasts`);
                    else if (product.productType === "downloads") navigate(`/admin/downloads`);
                    else toast(`${typeInfo?.label} editor coming soon`);
                  }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast("Preview coming soon")}><Eye className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}</div>
      )}
    </div>
  );
}
