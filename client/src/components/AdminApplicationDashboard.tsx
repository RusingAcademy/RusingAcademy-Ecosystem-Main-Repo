import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Filter,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader,
  Eye,
  CheckSquare,
  Square,
  Mail,
  Calendar,
  Globe,
  Award,
  DollarSign,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Application {
  id: number;
  userId: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  teachingLanguage: string;
  yearsTeaching?: number;
  createdAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
  headline?: string;
  headlineFr?: string;
  bio?: string;
  bioFr?: string;
  photoUrl?: string;
  introVideoUrl?: string;
  hourlyRate?: number;
  trialRate?: number;
  specializations?: Record<string, boolean>;
  certifications?: string;
  nativeLanguage?: string;
  province?: string;
  country?: string;
  teachingPhilosophy?: string;
  sleOralLevel?: string;
  sleWrittenLevel?: string;
  sleReadingLevel?: string;
}

export function AdminApplicationDashboard() {
  const { language } = useLanguage();
  const isEn = language === "en";

  // State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "firstName" | "status">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApplications, setSelectedApplications] = useState<Set<number>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);
  const [bulkNotes, setBulkNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);

  // API calls — procedures are properly registered on admin router
  const { data: stats } = (trpc.admin as any).getApplicationStats.useQuery();
  const {
    data: applicationsData,
    isLoading,
    refetch,
  } = (trpc.admin as any).getApplicationsForDashboard.useQuery(
    {
      status: statusFilter as any,
      language: languageFilter as any,
      search: searchTerm,
      sortBy,
      sortOrder,
      limit: 100,
    },
    { enabled: true }
  );

  const bulkApproveMutation = (trpc.admin as any).bulkApproveApplications.useMutation();
  const bulkRejectMutation = (trpc.admin as any).bulkRejectApplications.useMutation();
  const approveMutation = trpc.admin.approveCoachApplication.useMutation({
    onSuccess: () => {
      toast.success(isEn ? "Application approved successfully" : "Candidature approuvée avec succès");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to approve");
    },
  });
  const rejectMutation = trpc.admin.rejectCoachApplication.useMutation({
    onSuccess: () => {
      toast.success(isEn ? "Application rejected" : "Candidature rejetée");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reject");
    },
  });

  // Labels
  const l = isEn
    ? {
        title: "Coach Applications",
        subtitle: "Manage and review pending coach applications",
        stats: "Statistics",
        total: "Total",
        submitted: "Submitted",
        underReview: "Under Review",
        approved: "Approved",
        rejected: "Rejected",
        filters: "Filters",
        status: "Status",
        language: "Language",
        search: "Search applications...",
        sortBy: "Sort By",
        date: "Date",
        name: "Name",
        actions: "Actions",
        approve: "Approve",
        reject: "Reject",
        view: "View Details",
        selectAll: "Select All",
        selected: "Selected",
        bulkApprove: "Approve Selected",
        bulkReject: "Reject Selected",
        applicationName: "Name",
        applicationEmail: "Email",
        applicationLanguage: "Language",
        applicationYears: "Years",
        applicationStatus: "Status",
        applicationDate: "Applied",
        noResults: "No applications found",
        confirmBulkApprove: "Approve all selected applications?",
        confirmBulkReject: "Reject all selected applications?",
        rejectReason: "Rejection Reason",
        approveNotes: "Approval Notes (optional)",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        details: "Application Details",
        personalInfo: "Personal Information",
        qualifications: "Qualifications",
        pricing: "Pricing",
        content: "Content",
        approving: "Approving...",
        rejecting: "Rejecting...",
      }
    : {
        title: "Candidatures de Coach",
        subtitle: "Gérer et examiner les candidatures de coach en attente",
        stats: "Statistiques",
        total: "Total",
        submitted: "Soumis",
        underReview: "En examen",
        approved: "Approuvé",
        rejected: "Rejeté",
        filters: "Filtres",
        status: "Statut",
        language: "Langue",
        search: "Rechercher les candidatures...",
        sortBy: "Trier par",
        date: "Date",
        name: "Nom",
        actions: "Actions",
        approve: "Approuver",
        reject: "Rejeter",
        view: "Voir les détails",
        selectAll: "Sélectionner tout",
        selected: "Sélectionné",
        bulkApprove: "Approuver la sélection",
        bulkReject: "Rejeter la sélection",
        applicationName: "Nom",
        applicationEmail: "Email",
        applicationLanguage: "Langue",
        applicationYears: "Années",
        applicationStatus: "Statut",
        applicationDate: "Candidature",
        noResults: "Aucune candidature trouvée",
        confirmBulkApprove: "Approuver toutes les candidatures sélectionnées?",
        confirmBulkReject: "Rejeter toutes les candidatures sélectionnées?",
        rejectReason: "Raison du rejet",
        approveNotes: "Notes d'approbation (optionnel)",
        cancel: "Annuler",
        confirm: "Confirmer",
        close: "Fermer",
        details: "Détails de la candidature",
        personalInfo: "Informations personnelles",
        qualifications: "Qualifications",
        pricing: "Tarification",
        content: "Contenu",
        approving: "Approbation...",
        rejecting: "Rejet...",
      };

  const applications: Application[] = (applicationsData as any)?.applications || [];

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <Loader className="w-4 h-4 animate-spin" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-black";
    }
  };

  const toggleApplicationSelection = (id: number) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplications(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedApplications.size === applications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(applications.map((a: Application) => a.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedApplications.size === 0) return;
    try {
      await bulkApproveMutation.mutateAsync({
        applicationIds: Array.from(selectedApplications),
        notes: bulkNotes,
      });
      setSelectedApplications(new Set());
      setBulkNotes("");
      setBulkAction(null);
      toast.success(isEn ? "Applications approved" : "Candidatures approuvées");
      refetch();
    } catch (error) {
      toast.error(isEn ? "Bulk approve failed" : "Échec de l'approbation en lot");
    }
  };

  const handleBulkReject = async () => {
    if (selectedApplications.size === 0 || !bulkNotes) return;
    try {
      await bulkRejectMutation.mutateAsync({
        applicationIds: Array.from(selectedApplications),
        reason: bulkNotes,
      });
      setSelectedApplications(new Set());
      setBulkNotes("");
      setBulkAction(null);
      toast.success(isEn ? "Applications rejected" : "Candidatures rejetées");
      refetch();
    } catch (error) {
      toast.error(isEn ? "Bulk reject failed" : "Échec du rejet en lot");
    }
  };

  const handleSingleApprove = (appId: number) => {
    approveMutation.mutate({ applicationId: appId });
  };

  const handleSingleReject = (appId: number) => {
    setRejectTargetId(appId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectTargetId || !rejectReason.trim()) return;
    rejectMutation.mutate({ applicationId: rejectTargetId, reason: rejectReason });
    setShowRejectModal(false);
    setRejectTargetId(null);
    setRejectReason("");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(isEn ? "en-CA" : "fr-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSpecializationLabels = (specs: Record<string, boolean> | undefined) => {
    if (!specs) return [];
    return Object.entries(specs)
      .filter(([, v]) => v)
      .map(([k]) => k);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-foreground">{l.title}</h1>
        <p className="text-black dark:text-foreground dark:text-cyan-300">{l.subtitle}</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { value: stats.total, label: l.total, color: "text-black dark:text-foreground" },
            { value: stats.submitted, label: l.submitted, color: "text-blue-600" },
            { value: stats.underReview, label: l.underReview, color: "text-yellow-600" },
            { value: stats.approved, label: l.approved, color: "text-green-600" },
            { value: stats.rejected, label: l.rejected, color: "text-red-600" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-lg md:text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-black dark:text-foreground dark:text-cyan-300">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {l.filters}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-300" />
              <input
                type="text"
                placeholder={l.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
            >
              <option value="all">{l.status}: All</option>
              <option value="submitted">{l.submitted}</option>
              <option value="under_review">{l.underReview}</option>
              <option value="approved">{l.approved}</option>
              <option value="rejected">{l.rejected}</option>
            </select>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
            >
              <option value="all">{l.language}: All</option>
              <option value="french">French</option>
              <option value="english">English</option>
              <option value="both">Both</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
            >
              <option value="createdAt">
                {l.sortBy}: {l.date}
              </option>
              <option value="firstName">
                {l.sortBy}: {l.name}
              </option>
              <option value="status">
                {l.sortBy}: {l.status}
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedApplications.size > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-black dark:text-foreground">
                {selectedApplications.size} {l.selected}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setBulkAction("approve")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {l.bulkApprove}
                </Button>
                <Button
                  onClick={() => setBulkAction("reject")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  {l.bulkReject}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 md:py-8 lg:py-12">
              <Loader className="w-8 h-8 animate-spin text-cyan-300" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-6 md:py-8 lg:py-12 text-black dark:text-foreground dark:text-cyan-300">{l.noResults}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-teal-800">
                    <th className="text-left py-3 px-4">
                      <button onClick={toggleAllSelection}>
                        {selectedApplications.size === applications.length ? (
                          <CheckSquare className="w-5 h-5 text-teal-600" />
                        ) : (
                          <Square className="w-5 h-5 text-cyan-300" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.applicationName}</th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.applicationEmail}</th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.applicationLanguage}</th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.applicationStatus}</th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.applicationDate}</th>
                    <th className="text-left py-3 px-4 font-semibold text-black dark:text-foreground">{l.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: Application) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-200 dark:border-teal-800 hover:bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:hover:bg-foundation"
                    >
                      <td className="py-3 px-4">
                        <button onClick={() => toggleApplicationSelection(app.id)}>
                          {selectedApplications.has(app.id) ? (
                            <CheckSquare className="w-5 h-5 text-teal-600" />
                          ) : (
                            <Square className="w-5 h-5 text-cyan-300" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {app.photoUrl ? (
                            <img
                              src={app.photoUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300">
                              {(app.firstName || app.fullName || "?")[0]}
                            </div>
                          )}
                          <span className="font-medium text-black dark:text-foreground">
                            {app.fullName || `${app.firstName} ${app.lastName}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black dark:text-foreground dark:text-cyan-300 text-sm">{app.email}</td>
                      <td className="py-3 px-4 text-black dark:text-foreground dark:text-cyan-300 text-sm capitalize">
                        {app.teachingLanguage}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status.replace("_", " ")}</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-black dark:text-foreground dark:text-cyan-300 text-sm">
                        {formatDate(new Date(app.createdAt))}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowDetailModal(true);
                            }}
                            title={l.view}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(app.status === "submitted" || app.status === "under_review") && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleSingleApprove(app.id)}
                                disabled={approveMutation.isPending}
                                title={l.approve}
                              >
                                {approveMutation.isPending ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleSingleReject(app.id)}
                                disabled={rejectMutation.isPending}
                                title={l.reject}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">{l.details}</CardTitle>
                <Badge className={`mt-2 ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1 capitalize">{selectedApplication.status.replace("_", " ")}</span>
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo + Name */}
              <div className="flex items-center gap-4">
                {selectedApplication.photoUrl ? (
                  <img
                    src={selectedApplication.photoUrl}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-xl font-bold text-teal-700 dark:text-teal-300">
                    {(selectedApplication.firstName || selectedApplication.fullName || "?")[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-foreground">
                    {selectedApplication.fullName ||
                      `${selectedApplication.firstName} ${selectedApplication.lastName}`}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {selectedApplication.email}
                  </p>
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="font-semibold text-black dark:text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> {l.personalInfo}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Teaching Language:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground capitalize">
                      {selectedApplication.teachingLanguage}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Native Language:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      {selectedApplication.nativeLanguage || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Province:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      {selectedApplication.province || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Applied:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      {formatDate(new Date(selectedApplication.createdAt))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="font-semibold text-black dark:text-foreground mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" /> {l.qualifications}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Years Teaching:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      {selectedApplication.yearsTeaching || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Certifications:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      {selectedApplication.certifications || "—"}
                    </span>
                  </div>
                  {selectedApplication.sleOralLevel && (
                    <div>
                      <span className="text-muted-foreground">SLE Oral:</span>
                      <span className="ml-2 font-medium text-black dark:text-foreground">
                        {selectedApplication.sleOralLevel}
                      </span>
                    </div>
                  )}
                  {selectedApplication.sleWrittenLevel && (
                    <div>
                      <span className="text-muted-foreground">SLE Written:</span>
                      <span className="ml-2 font-medium text-black dark:text-foreground">
                        {selectedApplication.sleWrittenLevel}
                      </span>
                    </div>
                  )}
                  {selectedApplication.sleReadingLevel && (
                    <div>
                      <span className="text-muted-foreground">SLE Reading:</span>
                      <span className="ml-2 font-medium text-black dark:text-foreground">
                        {selectedApplication.sleReadingLevel}
                      </span>
                    </div>
                  )}
                </div>
                {selectedApplication.specializations && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Specializations:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getSpecializationLabels(selectedApplication.specializations).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs capitalize">
                          {s.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-semibold text-black dark:text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> {l.pricing}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      ${selectedApplication.hourlyRate || "—"}/hr
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trial Rate:</span>
                    <span className="ml-2 font-medium text-black dark:text-foreground">
                      ${selectedApplication.trialRate || "—"}/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-black dark:text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {l.content}
                </h4>
                {selectedApplication.headline && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm">Headline (EN):</span>
                    <p className="text-black dark:text-foreground">{selectedApplication.headline}</p>
                  </div>
                )}
                {selectedApplication.headlineFr && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm">Headline (FR):</span>
                    <p className="text-black dark:text-foreground">{selectedApplication.headlineFr}</p>
                  </div>
                )}
                {selectedApplication.bio && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm">Bio (EN):</span>
                    <p className="text-black dark:text-foreground text-sm whitespace-pre-wrap">
                      {selectedApplication.bio}
                    </p>
                  </div>
                )}
                {selectedApplication.bioFr && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm">Bio (FR):</span>
                    <p className="text-black dark:text-foreground text-sm whitespace-pre-wrap">
                      {selectedApplication.bioFr}
                    </p>
                  </div>
                )}
                {selectedApplication.teachingPhilosophy && (
                  <div className="mb-2">
                    <span className="text-muted-foreground text-sm">Teaching Philosophy:</span>
                    <p className="text-black dark:text-foreground text-sm whitespace-pre-wrap">
                      {selectedApplication.teachingPhilosophy}
                    </p>
                  </div>
                )}
                {selectedApplication.introVideoUrl && (
                  <div className="mt-3">
                    <a
                      href={selectedApplication.introVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View Intro Video
                    </a>
                  </div>
                )}
              </div>

              {/* Review Notes */}
              {selectedApplication.reviewNotes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <span className="text-muted-foreground text-sm font-medium">Review Notes:</span>
                  <p className="text-black dark:text-foreground text-sm mt-1">
                    {selectedApplication.reviewNotes}
                  </p>
                </div>
              )}

              {/* Actions */}
              {(selectedApplication.status === "submitted" ||
                selectedApplication.status === "under_review") && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    onClick={() => {
                      handleSingleApprove(selectedApplication.id);
                      setShowDetailModal(false);
                    }}
                    disabled={approveMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {approveMutation.isPending ? l.approving : l.approve}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleSingleReject(selectedApplication.id);
                    }}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {rejectMutation.isPending ? l.rejecting : l.reject}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{l.reject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder={l.rejectReason}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectTargetId(null);
                    setRejectReason("");
                  }}
                >
                  {l.cancel}
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmReject}
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? l.rejecting : l.confirm}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Action Modal */}
      {bulkAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{bulkAction === "approve" ? l.bulkApprove : l.bulkReject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {bulkAction === "approve" ? l.confirmBulkApprove : l.confirmBulkReject}
              </p>
              <textarea
                placeholder={bulkAction === "approve" ? l.approveNotes : l.rejectReason}
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-teal-800 rounded-lg bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkAction(null);
                    setBulkNotes("");
                  }}
                >
                  {l.cancel}
                </Button>
                <Button
                  className={
                    bulkAction === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                  onClick={bulkAction === "approve" ? handleBulkApprove : handleBulkReject}
                  disabled={
                    bulkAction === "reject" ? !bulkNotes.trim() : false
                  }
                >
                  {l.confirm}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
