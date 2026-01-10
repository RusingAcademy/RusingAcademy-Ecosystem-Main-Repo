import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Ticket,
  TrendingUp,
  Calendar,
  MessageSquare,
  Target,
  Mail,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminCoupons from "@/components/AdminCoupons";
import SequenceAnalyticsDashboard from "@/components/SequenceAnalyticsDashboard";
import MeetingOutcomesDashboard from "@/components/MeetingOutcomesDashboard";
import CRMDashboardWidget from "@/components/CRMDashboardWidget";
import LeadScoringDashboard from "@/components/LeadScoringDashboard";
import DealPipelineKanban from "@/components/DealPipelineKanban";
import EmailTemplatesLibrary from "@/components/EmailTemplatesLibrary";
import CRMActivityReportDashboard from "@/components/CRMActivityReportDashboard";
import PipelineNotificationsBell from "@/components/PipelineNotificationsBell";
import LeadTagsManager from "@/components/LeadTagsManager";
import CRMWebhooksManager from "@/components/CRMWebhooksManager";
import TagAutomationManager from "@/components/TagAutomationManager";
import CRMDataExport from "@/components/CRMDataExport";
import CRMLeadImport from "@/components/CRMLeadImport";
import LeadSegmentsManager from "@/components/LeadSegmentsManager";
import SegmentAlertsManager from "@/components/SegmentAlertsManager";
import SegmentComparisonDashboard from "@/components/SegmentComparisonDashboard";
import LeadMergeManager from "@/components/LeadMergeManager";

interface CoachApplication {
  id: number;
  userId: number;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  credentials: string;
  yearsExperience: number;
  appliedAt: Date;
  status: "pending" | "approved" | "rejected" | "suspended" | null;
  photoUrl?: string | null;
}

interface DepartmentInquiry {
  id: number;
  name: string;
  email: string;
  department: string;
  teamSize: string;
  message: string;
  createdAt: Date;
  status: "new" | "contacted" | "in_progress" | "converted" | "closed" | null;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "coaches" | "inquiries" | "analytics" | "coupons" | "crm">("overview");
  const [selectedApplication, setSelectedApplication] = useState<CoachApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<DepartmentInquiry | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [crmSubTab, setCrmSubTab] = useState<"analytics" | "outcomes" | "scoring" | "pipeline" | "templates" | "reports" | "tags" | "webhooks" | "automation" | "export" | "import" | "segments" | "alerts" | "compare" | "merge">("analytics");

  // tRPC queries
  const pendingCoachesQuery = trpc.admin.getPendingCoaches.useQuery();
  const analyticsQuery = trpc.admin.getAnalytics.useQuery();
  const inquiriesQuery = trpc.admin.getDepartmentInquiries.useQuery();
  
  // tRPC mutations
  const approveCoachMutation = trpc.admin.approveCoach.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Coach approuvé avec succès" : "Coach approved successfully");
      pendingCoachesQuery.refetch();
      setSelectedApplication(null);
    },
    onError: () => {
      toast.error(language === "fr" ? "Erreur lors de l'approbation" : "Error approving coach");
    },
  });
  
  const rejectCoachMutation = trpc.admin.rejectCoach.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Candidature rejetée" : "Application rejected");
      pendingCoachesQuery.refetch();
      setSelectedApplication(null);
      setRejectionReason("");
    },
    onError: () => {
      toast.error(language === "fr" ? "Erreur lors du rejet" : "Error rejecting application");
    },
  });

  const updateInquiryStatusMutation = trpc.admin.updateInquiryStatus.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Statut mis à jour" : "Status updated");
      inquiriesQuery.refetch();
    },
  });

  const labels = {
    en: {
      title: "Admin Dashboard",
      subtitle: "Platform Management",
      overview: "Overview",
      coaches: "Coach Applications",
      inquiries: "Department Inquiries",
      analytics: "Analytics",
      totalUsers: "Total Users",
      activeCoaches: "Active Coaches",
      sessionsThisMonth: "Sessions This Month",
      revenue: "Revenue (MTD)",
      pendingApplications: "Pending Applications",
      newInquiries: "New Inquiries",
      recentActivity: "Recent Activity",
      viewAll: "View All",
      approve: "Approve",
      reject: "Reject",
      viewDetails: "View Details",
      search: "Search...",
      filterByStatus: "Filter by Status",
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      new: "New",
      contacted: "Contacted",
      closed: "Closed",
      applicationDetails: "Application Details",
      credentials: "Credentials",
      experience: "Years of Experience",
      specialties: "Specialties",
      bio: "Bio",
      rejectionReason: "Rejection Reason (optional)",
      confirmApproval: "Are you sure you want to approve this coach?",
      confirmRejection: "Are you sure you want to reject this application?",
      inquiryDetails: "Inquiry Details",
      department: "Department",
      teamSize: "Team Size",
      message: "Message",
      markAsContacted: "Mark as Contacted",
      markAsClosed: "Mark as Closed",
      exportData: "Export Data",
      refresh: "Refresh",
      noApplications: "No pending applications",
      noInquiries: "No department inquiries",
      accessDenied: "Access Denied",
      adminOnly: "This page is only accessible to administrators.",
      goHome: "Go to Homepage",
    },
    fr: {
      title: "Tableau de bord Admin",
      subtitle: "Gestion de la plateforme",
      overview: "Aperçu",
      coaches: "Candidatures Coach",
      inquiries: "Demandes Départements",
      analytics: "Analytique",
      totalUsers: "Utilisateurs totaux",
      activeCoaches: "Coachs actifs",
      sessionsThisMonth: "Sessions ce mois",
      revenue: "Revenus (MTD)",
      pendingApplications: "Candidatures en attente",
      newInquiries: "Nouvelles demandes",
      recentActivity: "Activité récente",
      viewAll: "Voir tout",
      approve: "Approuver",
      reject: "Rejeter",
      viewDetails: "Voir détails",
      search: "Rechercher...",
      filterByStatus: "Filtrer par statut",
      all: "Tous",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      new: "Nouveau",
      contacted: "Contacté",
      closed: "Fermé",
      applicationDetails: "Détails de la candidature",
      credentials: "Qualifications",
      experience: "Années d'expérience",
      specialties: "Spécialités",
      bio: "Biographie",
      rejectionReason: "Raison du rejet (optionnel)",
      confirmApproval: "Êtes-vous sûr de vouloir approuver ce coach?",
      confirmRejection: "Êtes-vous sûr de vouloir rejeter cette candidature?",
      inquiryDetails: "Détails de la demande",
      department: "Département",
      teamSize: "Taille de l'équipe",
      message: "Message",
      markAsContacted: "Marquer comme contacté",
      markAsClosed: "Marquer comme fermé",
      exportData: "Exporter les données",
      refresh: "Actualiser",
      noApplications: "Aucune candidature en attente",
      noInquiries: "Aucune demande de département",
      accessDenied: "Accès refusé",
      adminOnly: "Cette page est réservée aux administrateurs.",
      goHome: "Aller à l'accueil",
    },
  };

  const l = labels[language];

  // Mock data for demo (will be replaced with real data from tRPC)
  const mockApplications: CoachApplication[] = [
    {
      id: 1,
      userId: 101,
      name: "Marie Tremblay",
      email: "marie.tremblay@example.com",
      bio: "Experienced French language instructor with 10 years of teaching experience in government settings.",
      specialties: ["Oral C", "Written B", "Exam Preparation"],
      credentials: "MA in French Linguistics, TESL Certified",
      yearsExperience: 10,
      appliedAt: new Date("2026-01-05"),
      status: "pending",
    },
    {
      id: 2,
      userId: 102,
      name: "Jean-Pierre Dubois",
      email: "jp.dubois@example.com",
      bio: "Former SLE examiner with deep knowledge of the evaluation criteria and common pitfalls.",
      specialties: ["Oral B", "Oral C", "Anxiety Coaching"],
      credentials: "PhD in Applied Linguistics, Former PSC Examiner",
      yearsExperience: 15,
      appliedAt: new Date("2026-01-06"),
      status: "pending",
    },
  ];

  const mockInquiries: DepartmentInquiry[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@tbs-sct.gc.ca",
      department: "Treasury Board Secretariat",
      teamSize: "11-25 employees",
      message: "We have a team of analysts who need to achieve BBB by end of fiscal year. Looking for bulk training options.",
      createdAt: new Date("2026-01-07"),
      status: "new",
    },
    {
      id: 2,
      name: "Michel Gagnon",
      email: "michel.gagnon@ircc.gc.ca",
      department: "Immigration, Refugees and Citizenship Canada",
      teamSize: "26-50 employees",
      message: "Interested in your enterprise solution for our regional office. Need flexible scheduling for shift workers.",
      createdAt: new Date("2026-01-06"),
      status: "contacted",
    },
  ];

  const mockAnalytics = {
    totalUsers: 1247,
    activeCoaches: 12,
    sessionsThisMonth: 342,
    revenue: 28450,
    userGrowth: 12.5,
    sessionGrowth: 8.3,
    revenueGrowth: 15.2,
  };

  // Use real data from queries, fallback to empty arrays/defaults
  const applications = pendingCoachesQuery.data || [];
  const inquiries = inquiriesQuery.data || [];
  const analytics = analyticsQuery.data || {
    totalUsers: 0,
    activeCoaches: 0,
    sessionsThisMonth: 0,
    revenue: 0,
    userGrowth: 0,
    sessionGrowth: 0,
    revenueGrowth: 0,
  };

  // Check if user is admin (owner)
  const isAdmin = user?.openId === import.meta.env.VITE_OWNER_OPEN_ID || user?.email?.includes("@rusingacademy.ca");

  // Show access denied if not admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>{l.accessDenied}</CardTitle>
              <CardDescription>{l.adminOnly}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full" size="lg">
                  {l.goHome}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApproveCoach = (application: CoachApplication) => {
    approveCoachMutation.mutate({ coachId: application.id });
  };

  const handleRejectCoach = (application: CoachApplication) => {
    rejectCoachMutation.mutate({ 
      coachId: application.id, 
      reason: rejectionReason || undefined 
    });
  };

  const handleUpdateInquiryStatus = (inquiry: DepartmentInquiry, status: "contacted" | "closed") => {
    updateInquiryStatusMutation.mutate({ inquiryId: inquiry.id, status });
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inq.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{l.title}</h1>
                <p className="text-muted-foreground text-sm">{l.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {l.exportData}
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                pendingCoachesQuery.refetch();
                inquiriesQuery.refetch();
                analyticsQuery.refetch();
              }}>
                <RefreshCw className="h-4 w-4" />
                {l.refresh}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b">
            {[
              { id: "overview", label: l.overview, icon: BarChart3 },
              { id: "coaches", label: l.coaches, icon: UserCheck },
              { id: "inquiries", label: l.inquiries, icon: Building2 },
              { id: "analytics", label: l.analytics, icon: Activity },
              { id: "coupons", label: language === "en" ? "Coupons" : "Coupons", icon: Ticket },
              { id: "crm", label: "CRM", icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.id === "coaches" && applications.filter((a: CoachApplication) => a.status === "pending").length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {applications.filter((a: CoachApplication) => a.status === "pending").length}
                  </Badge>
                )}
                {tab.id === "inquiries" && inquiries.filter((i: DepartmentInquiry) => i.status === "new").length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {inquiries.filter((i: DepartmentInquiry) => i.status === "new").length}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{l.totalUsers}</p>
                        <p className="text-3xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">+{analytics.userGrowth}% this month</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{l.activeCoaches}</p>
                        <p className="text-3xl font-bold">{analytics.activeCoaches}</p>
                        <p className="text-sm text-muted-foreground">3 pending approval</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{l.sessionsThisMonth}</p>
                        <p className="text-3xl font-bold">{analytics.sessionsThisMonth}</p>
                        <p className="text-sm text-emerald-600">+{analytics.sessionGrowth}% vs last month</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{l.revenue}</p>
                        <p className="text-3xl font-bold">${(analytics.revenue / 100).toLocaleString()}</p>
                        <p className="text-sm text-emerald-600">+{analytics.revenueGrowth}% vs last month</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pending Applications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{l.pendingApplications}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("coaches")}>
                      {l.viewAll}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {applications.filter((a: CoachApplication) => a.status === "pending").length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">{l.noApplications}</p>
                    ) : (
                      <div className="space-y-3">
                        {applications.filter((a: CoachApplication) => a.status === "pending").slice(0, 3).map((app: CoachApplication) => (
                          <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={app.photoUrl ?? undefined} />
                                <AvatarFallback>{app.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{app.name}</p>
                                <p className="text-sm text-muted-foreground">{app.specialties.slice(0, 2).join(", ")}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setSelectedApplication(app)}>
                              {l.viewDetails}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* New Inquiries */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{l.newInquiries}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("inquiries")}>
                      {l.viewAll}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {inquiries.filter((i: DepartmentInquiry) => i.status === "new").length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">{l.noInquiries}</p>
                    ) : (
                      <div className="space-y-3">
                        {inquiries.filter((i: DepartmentInquiry) => i.status === "new").slice(0, 3).map((inq: DepartmentInquiry) => (
                          <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{inq.department}</p>
                                <p className="text-sm text-muted-foreground">{inq.teamSize}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setSelectedInquiry(inq)}>
                              {l.viewDetails}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* CRM Dashboard Widget */}
              <CRMDashboardWidget onNavigateToCRM={() => setActiveTab("crm")} />
            </div>
          )}

          {/* Coaches Tab */}
          {activeTab === "coaches" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={l.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={l.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{l.all}</SelectItem>
                    <SelectItem value="pending">{l.pending}</SelectItem>
                    <SelectItem value="approved">{l.approved}</SelectItem>
                    <SelectItem value="rejected">{l.rejected}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applications Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialties</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app: CoachApplication) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={app.photoUrl ?? undefined} />
                              <AvatarFallback>{app.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            {app.name}
                          </div>
                        </TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {app.specialties.slice(0, 2).map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                            {app.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{app.specialties.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{app.yearsExperience} years</TableCell>
                        <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            app.status === "approved" ? "default" :
                            app.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedApplication(app)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleApproveCoach(app)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                                  setSelectedApplication(app);
                                }}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={l.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={l.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{l.all}</SelectItem>
                    <SelectItem value="new">{l.new}</SelectItem>
                    <SelectItem value="contacted">{l.contacted}</SelectItem>
                    <SelectItem value="closed">{l.closed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inquiries Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inq: DepartmentInquiry) => (
                      <TableRow key={inq.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{inq.name}</p>
                            <p className="text-sm text-muted-foreground">{inq.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{inq.department}</TableCell>
                        <TableCell>{inq.teamSize}</TableCell>
                        <TableCell>{new Date(inq.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            inq.status === "new" ? "destructive" :
                            inq.status === "contacted" ? "default" : "secondary"
                          }>
                            {inq.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedInquiry(inq)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => window.open(`mailto:${inq.email}`)}>
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <AdminAnalytics />
          )}
          
          {/* Coupons Tab */}
          {activeTab === "coupons" && (
            <AdminCoupons />
          )}

          {/* CRM Tab */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              {/* CRM Sub-navigation */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={crmSubTab === "analytics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("analytics")}
                >
                  {language === "fr" ? "Analytique des séquences" : "Sequence Analytics"}
                </Button>
                <Button
                  variant={crmSubTab === "outcomes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("outcomes")}
                >
                  {language === "fr" ? "Résultats des réunions" : "Meeting Outcomes"}
                </Button>
                <Button
                  variant={crmSubTab === "scoring" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("scoring")}
                >
                  {language === "fr" ? "Notation des leads" : "Lead Scoring"}
                </Button>
                <Button
                  variant={crmSubTab === "pipeline" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("pipeline")}
                >
                  {language === "fr" ? "Pipeline" : "Pipeline"}
                </Button>
                <Button
                  variant={crmSubTab === "templates" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("templates")}
                >
                  {language === "fr" ? "Modèles" : "Templates"}
                </Button>
                <Button
                  variant={crmSubTab === "reports" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("reports")}
                >
                  {language === "fr" ? "Rapports" : "Reports"}
                </Button>
                <Button
                  variant={crmSubTab === "tags" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("tags")}
                >
                  {language === "fr" ? "Tags" : "Tags"}
                </Button>
                <Button
                  variant={crmSubTab === "webhooks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("webhooks")}
                >
                  {language === "fr" ? "Webhooks" : "Webhooks"}
                </Button>
                <Button
                  variant={crmSubTab === "automation" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("automation")}
                >
                  {language === "fr" ? "Automatisation" : "Automation"}
                </Button>
                <Button
                  variant={crmSubTab === "export" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("export")}
                >
                  {language === "fr" ? "Exporter" : "Export"}
                </Button>
                <Button
                  variant={crmSubTab === "import" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("import")}
                >
                  {language === "fr" ? "Importer" : "Import"}
                </Button>
                <Button
                  variant={crmSubTab === "segments" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("segments")}
                >
                  {language === "fr" ? "Segments" : "Segments"}
                </Button>
                <Button
                  variant={crmSubTab === "alerts" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("alerts")}
                >
                  {language === "fr" ? "Alertes" : "Alerts"}
                </Button>
                <Button
                  variant={crmSubTab === "compare" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("compare")}
                >
                  {language === "fr" ? "Comparer" : "Compare"}
                </Button>
                <Button
                  variant={crmSubTab === "merge" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCrmSubTab("merge")}
                >
                  {language === "fr" ? "Fusionner" : "Merge"}
                </Button>
                <PipelineNotificationsBell />
              </div>

              {crmSubTab === "analytics" && <SequenceAnalyticsDashboard />}
              {crmSubTab === "outcomes" && <MeetingOutcomesDashboard />}
              {crmSubTab === "scoring" && <LeadScoringDashboard />}
              {crmSubTab === "pipeline" && <DealPipelineKanban />}
              {crmSubTab === "templates" && <EmailTemplatesLibrary />}
              {crmSubTab === "reports" && <CRMActivityReportDashboard />}
              {crmSubTab === "tags" && <LeadTagsManager />}
              {crmSubTab === "webhooks" && <CRMWebhooksManager />}
              {crmSubTab === "automation" && <TagAutomationManager />}
              {crmSubTab === "export" && <CRMDataExport />}
              {crmSubTab === "import" && <CRMLeadImport />}
              {crmSubTab === "segments" && <LeadSegmentsManager />}
              {crmSubTab === "alerts" && <SegmentAlertsManager />}
              {crmSubTab === "compare" && <SegmentComparisonDashboard />}
              {crmSubTab === "merge" && <LeadMergeManager />}
            </div>
          )}
        </div>
      </main>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{l.applicationDetails}</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplication.photoUrl ?? undefined} />
                  <AvatarFallback className="text-lg">
                    {selectedApplication.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedApplication.name}</h3>
                  <p className="text-muted-foreground">{selectedApplication.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{l.credentials}</p>
                  <p className="font-medium">{selectedApplication.credentials}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{l.experience}</p>
                  <p className="font-medium">{selectedApplication.yearsExperience} years</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">{l.specialties}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.specialties.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">{l.bio}</p>
                <p className="text-sm">{selectedApplication.bio}</p>
              </div>

              {selectedApplication.status === "pending" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{l.rejectionReason}</p>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Optional reason for rejection..."
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => handleRejectCoach(selectedApplication)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  {l.reject}
                </Button>
                <Button onClick={() => handleApproveCoach(selectedApplication)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {l.approve}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inquiry Details Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{l.inquiryDetails}</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{l.department}</p>
                  <p className="font-medium">{selectedInquiry.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{l.teamSize}</p>
                  <p className="font-medium">{selectedInquiry.teamSize}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">{l.message}</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedInquiry.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedInquiry?.status === "new" && (
              <Button onClick={() => {
                handleUpdateInquiryStatus(selectedInquiry, "contacted");
                setSelectedInquiry(null);
              }}>
                {l.markAsContacted}
              </Button>
            )}
            {selectedInquiry?.status === "contacted" && (
              <Button variant="outline" onClick={() => {
                handleUpdateInquiryStatus(selectedInquiry, "closed");
                setSelectedInquiry(null);
              }}>
                {l.markAsClosed}
              </Button>
            )}
            <Button variant="outline" onClick={() => window.open(`mailto:${selectedInquiry?.email}`)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
