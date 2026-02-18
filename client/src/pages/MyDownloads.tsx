import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Search,
  Clock,
  FolderDown,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-600" />;
    case "docx":
      return <FileText className="h-5 w-5 text-blue-600" />;
    case "xlsx":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "zip":
      return <FileArchive className="h-5 w-5 text-amber-600" />;
    default:
      return <File className="h-5 w-5 text-gray-600" />;
  }
}

function getFileTypeBadgeColor(fileType: string) {
  switch (fileType) {
    case "pdf":
      return "bg-red-50 text-red-700 border-red-200";
    case "docx":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "xlsx":
      return "bg-green-50 text-green-700 border-green-200";
    case "zip":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md text-gray-700 dark:text-muted-foreground border-gray-200";
  }
}

export default function MyDownloads() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("library");

  const labels = {
    en: {
      title: "Resource Library",
      subtitle: "Download study materials, worksheets, templates, and guides",
      library: "All Resources",
      history: "My Downloads",
      noResources: "No resources available yet",
      noResourcesDesc:
        "Check back soon — our team is preparing study materials, worksheets, and templates for you.",
      noHistory: "No download history",
      noHistoryDesc:
        "Resources you download will appear here for easy access.",
      browseCourses: "Browse Courses",
      download: "Download",
      downloaded: "Downloaded",
      downloads: "downloads",
      search: "Search resources...",
      allTypes: "All Types",
      loginRequired: "Please log in to access the resource library",
      login: "Log In",
      downloadedOn: "Downloaded",
      free: "Free Access",
      enrollmentRequired: "Enrollment Required",
    },
    fr: {
      title: "Bibliothèque de Ressources",
      subtitle:
        "Téléchargez des documents d'étude, des fiches de travail, des modèles et des guides",
      library: "Toutes les Ressources",
      history: "Mes Téléchargements",
      noResources: "Aucune ressource disponible pour le moment",
      noResourcesDesc:
        "Revenez bientôt — notre équipe prépare des documents d'étude, des fiches de travail et des modèles pour vous.",
      noHistory: "Aucun historique de téléchargement",
      noHistoryDesc:
        "Les ressources que vous téléchargez apparaîtront ici pour un accès facile.",
      browseCourses: "Parcourir les Cours",
      download: "Télécharger",
      downloaded: "Téléchargé",
      downloads: "téléchargements",
      search: "Rechercher des ressources...",
      allTypes: "Tous les Types",
      loginRequired:
        "Veuillez vous connecter pour accéder à la bibliothèque de ressources",
      login: "Se Connecter",
      downloadedOn: "Téléchargé le",
      free: "Accès Libre",
      enrollmentRequired: "Inscription Requise",
    },
  };

  const t = labels[isEn ? "en" : "fr"];

  // Fetch resources from backend
  const { data: resources, isLoading: resourcesLoading } =
    trpc.resourceLibrary.list.useQuery({
      search: searchQuery || undefined,
      fileType: fileTypeFilter !== "all" ? fileTypeFilter : undefined,
    });

  // Fetch download history
  const { data: history, isLoading: historyLoading } =
    trpc.resourceLibrary.myHistory.useQuery(undefined, {
      enabled: activeTab === "history",
    });

  // Track download mutation
  const trackDownload = trpc.resourceLibrary.trackDownload.useMutation({
    onError: () => {
      // Silent fail for tracking - don't block the download
    },
  });

  const handleDownload = (resource: any) => {
    // Track the download
    trackDownload.mutate({ resourceId: resource.id });

    // Open the file URL
    if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank");
      toast.success(
        isEn
          ? `Downloading ${resource.fileName || resource.title}`
          : `Téléchargement de ${resource.fileName || resource.title}`
      );
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(isEn ? "en-CA" : "fr-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const resourceList = Array.isArray(resources) ? resources : [];
  const historyList = Array.isArray(history) ? history : [];

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">{t.loginRequired}</h2>
              <Button asChild className="mt-4">
                <a href={getLoginUrl()}>{t.login}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderDown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="library" className="gap-2">
              <FolderDown className="h-4 w-4" />
              {t.library}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              {t.history}
            </TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allTypes}</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="pptx">PowerPoint</SelectItem>
                  <SelectItem value="zip">ZIP</SelectItem>
                  <SelectItem value="mp3">Audio</SelectItem>
                  <SelectItem value="mp4">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resource List */}
            {resourcesLoading ? (
              <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : resourceList.length === 0 ? (
              <Card>
                <CardContent className="py-6 md:py-8 lg:py-12 text-center">
                  <FolderDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t.noResources}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t.noResourcesDesc}
                  </p>
                  <Button asChild>
                    <Link href="/courses">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t.browseCourses}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {resourceList.map((resource: any) => (
                  <Card
                    key={resource.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            {getFileIcon(resource.fileType || "pdf")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">
                              {isEn
                                ? resource.title
                                : resource.titleFr || resource.title}
                            </p>
                            {(isEn
                              ? resource.description
                              : resource.descriptionFr ||
                                resource.description) && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {isEn
                                  ? resource.description
                                  : resource.descriptionFr ||
                                    resource.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${getFileTypeBadgeColor(resource.fileType || "pdf")}`}
                              >
                                {(
                                  resource.fileType || "pdf"
                                ).toUpperCase()}
                              </Badge>
                              {resource.fileSizeBytes && (
                                <span className="text-xs text-muted-foreground">
                                  {formatBytes(resource.fileSizeBytes)}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {resource.downloadCount || 0} {t.downloads}
                              </span>
                              {!resource.requiresEnrollment && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                                >
                                  {t.free}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="gap-1.5 shrink-0"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {t.download}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {historyLoading ? (
              <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : historyList.length === 0 ? (
              <Card>
                <CardContent className="py-6 md:py-8 lg:py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t.noHistory}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t.noHistoryDesc}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("library")}
                  >
                    <FolderDown className="h-4 w-4 mr-2" />
                    {t.library}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {historyList.map((item: any) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            {getFileIcon(item.fileType || "pdf")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">
                              {isEn
                                ? item.title
                                : item.titleFr || item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${getFileTypeBadgeColor(item.fileType || "pdf")}`}
                              >
                                {(item.fileType || "pdf").toUpperCase()}
                              </Badge>
                              {item.fileSizeBytes && (
                                <span className="text-xs text-muted-foreground">
                                  {formatBytes(item.fileSizeBytes)}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {t.downloadedOn}{" "}
                                {formatDate(item.downloadedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 shrink-0"
                          onClick={() => {
                            if (item.fileUrl) {
                              window.open(item.fileUrl, "_blank");
                            }
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            {t.download}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
