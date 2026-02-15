import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FileText, ArrowRight, CheckCircle2, Archive, Eye, Edit,
  MoreHorizontal, RefreshCw, Filter, BarChart3, Clock, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// ─── Bilingual UI ──────────────────────────────────────────────────────────
const ui = {
  en: {
    title: "Content Workflow Board",
    subtitle: "Visual overview of all content across lifecycle stages",
    draft: "Draft",
    review: "In Review",
    published: "Published",
    archived: "Archived",
    courses: "Courses",
    lessons: "Lessons",
    paths: "Paths",
    moveTo: "Move to",
    bulkActions: "Bulk Actions",
    selected: "selected",
    moveSelected: "Move Selected",
    search: "Search content...",
    noContent: "No content in this stage",
    totalContent: "Total Content",
    needsReview: "Needs Review",
    readyToPublish: "Ready to Publish",
    recentlyArchived: "Recently Archived",
    lastUpdated: "Last updated",
    enrollments: "enrollments",
    modules: "modules",
    refresh: "Refresh",
    viewDetails: "View Details",
    editContent: "Edit Content",
    contentHealth: "Content Health Summary",
    bilingualCoverage: "Bilingual Coverage",
    withFrench: "with French",
    qualityScore: "Quality Score",
    avgScore: "avg score",
  },
  fr: {
    title: "Tableau de flux de contenu",
    subtitle: "Vue d'ensemble visuelle de tout le contenu à travers les étapes du cycle de vie",
    draft: "Brouillon",
    review: "En révision",
    published: "Publié",
    archived: "Archivé",
    courses: "Cours",
    lessons: "Leçons",
    paths: "Parcours",
    moveTo: "Déplacer vers",
    bulkActions: "Actions groupées",
    selected: "sélectionné(s)",
    moveSelected: "Déplacer la sélection",
    search: "Rechercher du contenu...",
    noContent: "Aucun contenu à cette étape",
    totalContent: "Contenu total",
    needsReview: "À réviser",
    readyToPublish: "Prêt à publier",
    recentlyArchived: "Récemment archivé",
    lastUpdated: "Dernière mise à jour",
    enrollments: "inscriptions",
    modules: "modules",
    refresh: "Actualiser",
    viewDetails: "Voir les détails",
    editContent: "Modifier le contenu",
    contentHealth: "Résumé de la santé du contenu",
    bilingualCoverage: "Couverture bilingue",
    withFrench: "avec français",
    qualityScore: "Score de qualité",
    avgScore: "score moyen",
  },
};

type Status = "draft" | "review" | "published" | "archived";

const statusConfig: Record<Status, { color: string; bgColor: string; icon: any }> = {
  draft: { color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800", icon: FileText },
  review: { color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", icon: Eye },
  published: { color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800", icon: CheckCircle2 },
  archived: { color: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800", icon: Archive },
};

const statusOrder: Status[] = ["draft", "review", "published", "archived"];

export default function ContentWorkflowBoard() {
  const { language } = useLanguage();
  const t = ui[language] || ui.en;
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [contentType, setContentType] = useState<"courses" | "lessons" | "paths">("courses");

  // Fetch all courses with their status
  const coursesQuery = trpc.adminCourses.listCourses.useQuery({ page: 1, limit: 200 });
  const pathsQuery = trpc.adminPaths.list.useQuery();
  const publishMutation = trpc.admin.publishCourse.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Statut mis à jour" : "Status updated");
      coursesQuery.refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });
  const bulkStatusMutation = trpc.admin.bulkStatusUpdate.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Statuts mis à jour" : "Statuses updated");
      setSelectedIds(new Set());
      coursesQuery.refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Group courses by status
  const allCourses = (coursesQuery.data as any)?.courses || coursesQuery.data || [];
  const allPaths = (pathsQuery.data as any) || [];

  const items = contentType === "courses" ? allCourses : contentType === "paths" ? allPaths : [];

  const filteredItems = items.filter((item: any) =>
    !search || (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.titleFr || "").toLowerCase().includes(search.toLowerCase())
  );

  const groupedByStatus: Record<Status, any[]> = {
    draft: [],
    review: [],
    published: [],
    archived: [],
  };

  filteredItems.forEach((item: any) => {
    const status = (item.status || "draft") as Status;
    if (groupedByStatus[status]) {
      groupedByStatus[status].push(item);
    } else {
      groupedByStatus.draft.push(item);
    }
  });

  // Stats
  const totalCount = filteredItems.length;
  const draftCount = groupedByStatus.draft.length;
  const reviewCount = groupedByStatus.review.length;
  const publishedCount = groupedByStatus.published.length;
  const archivedCount = groupedByStatus.archived.length;
  const bilingualCount = filteredItems.filter((c: any) => c.titleFr).length;
  const bilingualPct = totalCount > 0 ? Math.round((bilingualCount / totalCount) * 100) : 0;

  const handleStatusChange = (itemId: number, newStatus: Status) => {
    if (contentType === "courses") {
      publishMutation.mutate({ courseId: itemId, status: newStatus });
    } else {
      toast.info("Path status change coming in next sprint");
    }
  };

  const handleBulkMove = (newStatus: Status) => {
    if (contentType === "courses" && selectedIds.size > 0) {
      bulkStatusMutation.mutate({
        courseIds: Array.from(selectedIds),
        status: newStatus,
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (d: any) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA", {
      month: "short", day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { coursesQuery.refetch(); pathsQuery.refetch(); }}>
            <RefreshCw className="h-4 w-4 mr-1" /> {t.refresh}
          </Button>
        </div>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-xs text-muted-foreground">{t.totalContent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{draftCount + reviewCount}</p>
                <p className="text-xs text-muted-foreground">{t.needsReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-xs text-muted-foreground">{t.readyToPublish}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{bilingualPct}%</p>
                <p className="text-xs text-muted-foreground">{t.bilingualCoverage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["courses", "paths"] as const).map(type => (
            <Button
              key={type}
              variant={contentType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => { setContentType(type); setSelectedIds(new Set()); }}
              className="text-xs"
            >
              {type === "courses" ? t.courses : t.paths}
            </Button>
          ))}
        </div>
        <Input
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-8 text-sm"
        />
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="secondary">{selectedIds.size} {t.selected}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">{t.moveSelected}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOrder.map(s => (
                  <DropdownMenuItem key={s} onClick={() => handleBulkMove(s)}>
                    {t.moveTo} {t[s]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusOrder.map(status => {
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const columnItems = groupedByStatus[status];

          return (
            <div key={status} className={`rounded-xl border-2 ${config.bgColor} p-3`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  <h3 className={`font-semibold text-sm ${config.color}`}>
                    {t[status]}
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {columnItems.length}
                </Badge>
              </div>

              {/* Column Items */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {columnItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    {t.noContent}
                  </div>
                ) : (
                  columnItems.map((item: any) => (
                    <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={selectedIds.has(item.id)}
                            onCheckedChange={() => toggleSelect(item.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {language === "fr" && item.titleFr ? item.titleFr : item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.titleFr && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0">FR</Badge>
                              )}
                              {item.category && (
                                <span className="text-[10px] text-muted-foreground">{item.category}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                              <span>{t.lastUpdated}: {formatDate(item.updatedAt)}</span>
                              {item.enrollmentCount !== undefined && (
                                <span>• {item.enrollmentCount} {t.enrollments}</span>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {statusOrder.filter(s => s !== status).map(s => (
                                <DropdownMenuItem key={s} onClick={() => handleStatusChange(item.id, s)}>
                                  <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                  {t.moveTo} {t[s]}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
