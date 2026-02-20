import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import {
  Plus, Edit2, Trash2, GripVertical, BookOpen, Users, Star,
  Eye, EyeOff, ChevronDown, ChevronUp, Search, Filter,
  ArrowUpDown, CheckCircle, Clock, Archive, X, Save, Layers
} from "lucide-react";

const t = {
  en: {
    title: "Learning Path Builder",
    subtitle: "Create and manage structured learning journeys for your learners",
    createPath: "Create New Path",
    editPath: "Edit Path",
    deletePath: "Delete Path",
    addCourse: "Add Course",
    removeCourse: "Remove Course",
    reorder: "Reorder Courses",
    publish: "Publish",
    unpublish: "Unpublish",
    archive: "Archive",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    all: "All Statuses",
    courses: "courses",
    enrolled: "enrolled",
    completion: "completion",
    noPathsYet: "No learning paths yet",
    noPathsDesc: "Create your first learning path to organize courses into structured journeys.",
    confirmDelete: "Are you sure you want to delete this path? This cannot be undone.",
    searchPaths: "Search paths...",
    basicInfo: "Basic Information",
    pricing: "Pricing & Duration",
    content: "Content & Objectives",
    pathTitle: "Path Title (EN)",
    pathTitleFr: "Path Title (FR)",
    slug: "URL Slug",
    subtitle: "Subtitle (EN)",
    subtitleFr: "Subtitle (FR)",
    description: "Description (EN)",
    descriptionFr: "Description (FR)",
    level: "CEFR Level",
    price: "Price (CAD)",
    originalPrice: "Original Price",
    discount: "Discount %",
    duration: "Duration (weeks)",
    hours: "Structured Hours",
    featured: "Featured",
    save: "Save Path",
    cancel: "Cancel",
    availableCourses: "Available Courses",
    pathCourses: "Courses in Path",
    required: "Required",
    optional: "Optional",
    noCourses: "No courses added yet. Add courses from the available list.",
    analytics: "Analytics",
    totalEnrollments: "Total Enrollments",
    activeEnrollments: "Active",
    completedEnrollments: "Completed",
    completionRate: "Completion Rate",
  },
  fr: {
    title: "Constructeur de parcours",
    subtitle: "Créez et gérez des parcours d'apprentissage structurés",
    createPath: "Créer un parcours",
    editPath: "Modifier le parcours",
    deletePath: "Supprimer le parcours",
    addCourse: "Ajouter un cours",
    removeCourse: "Retirer le cours",
    reorder: "Réorganiser les cours",
    publish: "Publier",
    unpublish: "Dépublier",
    archive: "Archiver",
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé",
    all: "Tous les statuts",
    courses: "cours",
    enrolled: "inscrits",
    completion: "complétion",
    noPathsYet: "Aucun parcours pour le moment",
    noPathsDesc: "Créez votre premier parcours pour organiser les cours en journées structurées.",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ce parcours ? Cette action est irréversible.",
    searchPaths: "Rechercher des parcours...",
    basicInfo: "Informations de base",
    pricing: "Tarification et durée",
    content: "Contenu et objectifs",
    pathTitle: "Titre du parcours (EN)",
    pathTitleFr: "Titre du parcours (FR)",
    slug: "Slug URL",
    subtitle: "Sous-titre (EN)",
    subtitleFr: "Sous-titre (FR)",
    description: "Description (EN)",
    descriptionFr: "Description (FR)",
    level: "Niveau CECR",
    price: "Prix (CAD)",
    originalPrice: "Prix original",
    discount: "Réduction %",
    duration: "Durée (semaines)",
    hours: "Heures structurées",
    featured: "En vedette",
    save: "Enregistrer",
    cancel: "Annuler",
    availableCourses: "Cours disponibles",
    pathCourses: "Cours dans le parcours",
    required: "Obligatoire",
    optional: "Optionnel",
    noCourses: "Aucun cours ajouté. Ajoutez des cours depuis la liste disponible.",
    analytics: "Analytique",
    totalEnrollments: "Inscriptions totales",
    activeEnrollments: "Actifs",
    completedEnrollments: "Complétés",
    completionRate: "Taux de complétion",
  },
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

const statusIcons: Record<string, any> = {
  draft: Clock,
  published: CheckCircle,
  archived: Archive,
};

const levelColors: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-purple-100 text-purple-700",
  exam_prep: "bg-red-100 text-red-700",
};

export default function LearningPathBuilder() {
  const { language } = useLanguage();
  const ui = t[language] || t.en;

  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPathId, setEditingPathId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  // Queries
  const pathsQuery = trpc.adminPaths.list.useQuery({ status: statusFilter, search: searchQuery || undefined });
  const pathDetailQuery = trpc.adminPaths.getById.useQuery(
    { id: editingPathId! },
    { enabled: !!editingPathId }
  );
  const analyticsQuery = trpc.adminPaths.getAnalytics.useQuery(
    { id: expandedPath! },
    { enabled: !!expandedPath }
  );

  // Mutations
  const createMutation = trpc.adminPaths.create.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Parcours créé" : "Path created");
      setShowCreateForm(false);
      pathsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.adminPaths.update.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Parcours mis à jour" : "Path updated");
      setEditingPathId(null);
      pathsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.adminPaths.delete.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Parcours supprimé" : "Path deleted");
      pathsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleStatusMutation = trpc.adminPaths.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Statut mis à jour" : "Status updated");
      pathsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const addCourseMutation = trpc.adminPaths.addCourse.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Cours ajouté" : "Course added");
      pathDetailQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeCourseMutation = trpc.adminPaths.removeCourse.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Cours retiré" : "Course removed");
      pathDetailQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const paths = pathsQuery.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            {ui.title}
          </h1>
          <p className="text-gray-500 mt-1">{ui.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {ui.createPath}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={ui.searchPaths}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(["all", "draft", "published", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                statusFilter === status
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? ui.all : status === "draft" ? ui.draft : status === "published" ? ui.published : ui.archived}
            </button>
          ))}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingPathId) && (
        <PathForm
          ui={ui}
          language={language}
          pathData={editingPathId ? pathDetailQuery.data : undefined}
          onSave={(data) => {
            if (editingPathId) {
              updateMutation.mutate({ id: editingPathId, ...data });
            } else {
              createMutation.mutate(data as any);
            }
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingPathId(null);
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      )}

      {/* Path List */}
      {paths.length === 0 && !pathsQuery.isLoading ? (
        <div className="text-center py-8 md:py-12 lg:py-16 bg-white rounded-xl border border-gray-200">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">{ui.noPathsYet}</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">{ui.noPathsDesc}</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {ui.createPath}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paths.map((path) => {
            const StatusIcon = statusIcons[path.status || "draft"];
            const isExpanded = expandedPath === path.id;

            return (
              <div
                key={path.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Path Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {path.thumbnailUrl ? (
                        <img
                          src={path.thumbnailUrl}
                          alt={path.title}
                          className="w-20 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Layers className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {language === "fr" && path.titleFr ? path.titleFr : path.title}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[path.status || "draft"]}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {path.status || "draft"}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelColors[path.level] || "bg-gray-100 text-gray-700"}`}>
                            {path.level}
                          </span>
                          {path.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {language === "fr" && path.subtitleFr ? path.subtitleFr : path.subtitle || "—"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {path.courseCount} {ui.courses}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {path.enrollmentCount || 0} {ui.enrolled}
                          </span>
                          {path.durationWeeks && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {path.durationWeeks}w
                            </span>
                          )}
                          <span className="font-medium text-indigo-600">
                            ${Number(path.price || 0).toFixed(2)} CAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {path.status === "draft" && (
                        <button
                          onClick={() => toggleStatusMutation.mutate({ id: path.id, status: "published" })}
                          className="p-2 text-green-600 hover:bg-green-50:bg-green-900/20 rounded-lg"
                          title={ui.publish}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {path.status === "published" && (
                        <button
                          onClick={() => toggleStatusMutation.mutate({ id: path.id, status: "draft" })}
                          className="p-2 text-yellow-600 hover:bg-yellow-50:bg-yellow-900/20 rounded-lg"
                          title={ui.unpublish}
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingPathId(path.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50:bg-blue-900/20 rounded-lg"
                        title={ui.editPath}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(ui.confirmDelete)) {
                            deleteMutation.mutate({ id: path.id });
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50:bg-red-900/20 rounded-lg"
                        title={ui.deletePath}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100:bg-gray-700 rounded-lg"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Section: Course Manager + Analytics */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-5 bg-gray-50">
                    {/* Analytics Row */}
                    {analyticsQuery.data && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: ui.totalEnrollments, value: analyticsQuery.data.totalEnrollments, color: "text-blue-600" },
                          { label: ui.activeEnrollments, value: analyticsQuery.data.activeEnrollments, color: "text-green-600" },
                          { label: ui.completedEnrollments, value: analyticsQuery.data.completedEnrollments, color: "text-purple-600" },
                          { label: ui.completionRate, value: `${analyticsQuery.data.completionRate}%`, color: "text-indigo-600" },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Course Manager */}
                    <CourseManager
                      pathId={path.id}
                      ui={ui}
                      language={language}
                      onAddCourse={(courseId) => {
                        const currentCount = pathDetailQuery.data?.courses?.length || 0;
                        addCourseMutation.mutate({ pathId: path.id, courseId, orderIndex: currentCount });
                      }}
                      onRemoveCourse={(courseId) => removeCourseMutation.mutate({ pathId: path.id, courseId })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Path Create/Edit Form ──────────────────────────────────────────────────
function PathForm({
  ui,
  language,
  pathData,
  onSave,
  onCancel,
  isLoading,
}: {
  ui: any;
  language: string;
  pathData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    title: pathData?.title || "",
    titleFr: pathData?.titleFr || "",
    slug: pathData?.slug || "",
    subtitle: pathData?.subtitle || "",
    subtitleFr: pathData?.subtitleFr || "",
    description: pathData?.description || "",
    descriptionFr: pathData?.descriptionFr || "",
    level: pathData?.level || "B1",
    price: pathData?.price || "0.00",
    originalPrice: pathData?.originalPrice || "",
    discountPercentage: pathData?.discountPercentage || 0,
    durationWeeks: pathData?.durationWeeks || 0,
    structuredHours: pathData?.structuredHours || 0,
    thumbnailUrl: pathData?.thumbnailUrl || "",
    status: pathData?.status || "draft",
    isFeatured: pathData?.isFeatured || false,
  });

  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "content">("basic");

  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.level) {
      toast.error(language === "fr" ? "Veuillez remplir les champs obligatoires" : "Please fill required fields");
      return;
    }
    onSave(form);
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {pathData ? ui.editPath : ui.createPath}
        </h2>
        <button aria-label="Action" onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["basic", "pricing", "content"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "basic" ? ui.basicInfo : tab === "pricing" ? ui.pricing : ui.content}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.pathTitle} *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value) });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.pathTitleFr}</label>
            <input
              type="text"
              value={form.titleFr}
              onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.slug} *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.level} *</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              {["A1", "A2", "B1", "B2", "C1", "exam_prep"].map((l) => (
                <option key={l} value={l}>{l === "exam_prep" ? "Exam Prep" : l}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.subtitle}</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.subtitleFr}</label>
            <input
              type="text"
              value={form.subtitleFr}
              onChange={(e) => setForm({ ...form, subtitleFr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.description}</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.descriptionFr}</label>
            <textarea
              rows={4}
              value={form.descriptionFr}
              onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded border-gray-300"
              />
              {ui.featured}
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
            >
              <option value="draft">{ui.draft}</option>
              <option value="published">{ui.published}</option>
              <option value="archived">{ui.archived}</option>
            </select>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.price} *</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.originalPrice}</label>
            <input
              type="text"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.discount}</label>
            <input
              type="number"
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.duration}</label>
            <input
              type="number"
              value={form.durationWeeks}
              onChange={(e) => setForm({ ...form, durationWeeks: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{ui.hours}</label>
            <input
              type="number"
              value={form.structuredHours}
              onChange={(e) => setForm({ ...form, structuredHours: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{language === "fr" ? "Enregistrez d'abord le parcours, puis ajoutez des cours depuis la vue détaillée." : "Save the path first, then add courses from the expanded view."}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100:bg-gray-700 rounded-lg"
        >
          {ui.cancel}
        </button>
        <button aria-label="Action"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "..." : ui.save}
        </button>
      </div>
    </div>
  );
}

// ─── Course Manager (Add/Remove courses from a path) ────────────────────────
function CourseManager({
  pathId,
  ui,
  language,
  onAddCourse,
  onRemoveCourse,
}: {
  pathId: number;
  ui: any;
  language: string;
  onAddCourse: (courseId: number) => void;
  onRemoveCourse: (courseId: number) => void;
}) {
  const pathDetailQuery = trpc.adminPaths.getById.useQuery({ id: pathId });
  const availableCoursesQuery = trpc.adminPaths.getAvailableCourses.useQuery({ pathId });

  const pathCourses = pathDetailQuery.data?.courses || [];
  const availableCourses = availableCoursesQuery.data || [];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Courses in Path */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          {ui.pathCourses} ({pathCourses.length})
        </h4>
        {pathCourses.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{ui.noCourses}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pathCourses.map((course, index) => (
              <div
                key={course.courseId}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                {course.courseThumbnail ? (
                  <img src={course.courseThumbnail} alt="" className="w-10 h-7 object-cover rounded" />
                ) : (
                  <div className="w-10 h-7 bg-gray-200 rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {language === "fr" && course.courseTitleFr ? course.courseTitleFr : course.courseTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {course.courseTotalLessons || 0} lessons · {course.courseTotalDuration || 0} min
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${course.isRequired ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                  {course.isRequired ? ui.required : ui.optional}
                </span>
                <button
                  onClick={() => onRemoveCourse(course.courseId)}
                  className="p-1 text-red-500 hover:bg-red-50:bg-red-900/20 rounded"
                  title={ui.removeCourse}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Courses */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-green-600" />
          {ui.availableCourses} ({availableCourses.length})
        </h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
            >
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt="" className="w-10 h-7 object-cover rounded" />
              ) : (
                <div className="w-10 h-7 bg-gray-200 rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {language === "fr" && course.titleFr ? course.titleFr : course.title}
                </p>
                <p className="text-xs text-gray-500">
                  {course.category} · {course.level} · {course.totalLessons || 0} lessons
                </p>
              </div>
              <button
                onClick={() => onAddCourse(course.id)}
                className="p-1.5 text-green-600 hover:bg-green-50:bg-green-900/20 rounded-lg"
                title={ui.addCourse}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
          {availableCourses.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              {language === "fr" ? "Tous les cours sont déjà dans ce parcours" : "All courses are already in this path"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
