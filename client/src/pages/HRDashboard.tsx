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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Building2,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Award,
  Download,
  Search,
  Filter,
  Plus,
  Mail,
  BarChart3,
  BookOpen,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileSpreadsheet,
  UserPlus,
  Settings,
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { StatCard } from "@/components/dashboard";

// Mock data for HR dashboard
const mockTeamMembers = [
  {
    id: 1,
    name: "Marie Leblanc",
    email: "marie.leblanc@gc.ca",
    department: "Policy Branch",
    currentLevel: "BBB",
    targetLevel: "CBC",
    progress: 65,
    sessionsCompleted: 12,
    nextSession: "2026-01-15",
    status: "on-track",
  },
  {
    id: 2,
    name: "Jean-Pierre Tremblay",
    email: "jp.tremblay@gc.ca",
    department: "Operations",
    currentLevel: "AAA",
    targetLevel: "BBB",
    progress: 45,
    sessionsCompleted: 8,
    nextSession: "2026-01-14",
    status: "needs-attention",
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@gc.ca",
    department: "Finance",
    currentLevel: "CBC",
    targetLevel: "CCC",
    progress: 85,
    sessionsCompleted: 20,
    nextSession: "2026-01-13",
    status: "on-track",
  },
  {
    id: 4,
    name: "Michael Thompson",
    email: "m.thompson@gc.ca",
    department: "HR Services",
    currentLevel: "BBB",
    targetLevel: "CBC",
    progress: 30,
    sessionsCompleted: 5,
    nextSession: null,
    status: "at-risk",
  },
];

const mockCohorts = [
  {
    id: 1,
    name: "Q1 2026 - CBC Preparation",
    members: 15,
    startDate: "2026-01-06",
    endDate: "2026-03-31",
    avgProgress: 42,
    status: "active",
  },
  {
    id: 2,
    name: "Executive French Immersion",
    members: 8,
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    avgProgress: 78,
    status: "active",
  },
  {
    id: 3,
    name: "New Hires Bilingual Onboarding",
    members: 22,
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    avgProgress: 0,
    status: "upcoming",
  },
];

export default function HRDashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Export functionality
  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true);
    try {
      // Generate CSV content from mock data (in production, this would use real data from API)
      const headers = language === "fr"
        ? ["Nom", "Email", "Département", "Niveau Actuel", "Niveau Cible", "Progrès", "Sessions", "Statut"]
        : ["Name", "Email", "Department", "Current Level", "Target Level", "Progress", "Sessions", "Status"];
      
      const rows = mockTeamMembers.map(m => [
        m.name,
        m.email,
        m.department,
        m.currentLevel,
        m.targetLevel,
        `${m.progress}%`,
        m.sessionsCompleted.toString(),
        m.status
      ]);

      if (format === "csv") {
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `hr-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Generate simple HTML for PDF
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${language === "fr" ? "Rapport de Progression" : "Progress Report"}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #0F3D3E; border-bottom: 2px solid #0F3D3E; padding-bottom: 10px; }
              .header { margin-bottom: 20px; }
              .company { font-size: 12px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #0F3D3E; color: white; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .status-on-track { color: green; }
              .status-needs-attention { color: orange; }
              .status-at-risk { color: red; }
            </style>
          </head>
          <body>
            <div class="header">
              <p class="company">Rusinga International Consulting Ltd.</p>
              <h1>${language === "fr" ? "Rapport de Progression des Apprenants" : "Learner Progress Report"}</h1>
              <p>${language === "fr" ? "Généré le" : "Generated on"}: ${new Date().toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA")}</p>
            </div>
            <table>
              <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
              <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === 7 ? ` class="status-${c.replace(" ", "-")}"` : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const labels = {
    en: {
      dashboard: "HR Dashboard",
      subtitle: "Manage your team's bilingual training journey",
      overview: "Overview",
      team: "Team Members",
      cohorts: "Cohorts",
      reports: "Reports",
      settings: "Settings",
      totalEmployees: "Total Employees",
      activeInTraining: "Active in Training",
      avgProgress: "Average Progress",
      completedSLE: "Completed SLE",
      teamProgress: "Team Progress Overview",
      recentActivity: "Recent Activity",
      upcomingExams: "Upcoming SLE Exams",
      addEmployee: "Add Employee",
      createCohort: "Create Cohort",
      exportReport: "Export Report",
      searchPlaceholder: "Search employees...",
      filterByStatus: "Filter by status",
      allStatuses: "All Statuses",
      onTrack: "On Track",
      needsAttention: "Needs Attention",
      atRisk: "At Risk",
      name: "Name",
      department: "Department",
      currentLevel: "Current",
      targetLevel: "Target",
      progress: "Progress",
      sessions: "Sessions",
      nextSession: "Next Session",
      status: "Status",
      actions: "Actions",
      viewProfile: "View Profile",
      sendReminder: "Send Reminder",
      cohortName: "Cohort Name",
      members: "Members",
      dateRange: "Date Range",
      avgProgressLabel: "Avg. Progress",
      manageCohort: "Manage",
      loginRequired: "Please sign in to access the HR Dashboard",
      signIn: "Sign In",
      noAccess: "HR Dashboard Access Required",
      noAccessDesc: "You need HR Manager or Admin privileges to access this dashboard.",
      contactAdmin: "Contact your administrator for access.",
    },
    fr: {
      dashboard: "Tableau de bord RH",
      subtitle: "Gérez le parcours de formation bilingue de votre équipe",
      overview: "Aperçu",
      team: "Membres de l'équipe",
      cohorts: "Cohortes",
      reports: "Rapports",
      settings: "Paramètres",
      totalEmployees: "Total employés",
      activeInTraining: "En formation active",
      avgProgress: "Progrès moyen",
      completedSLE: "ELS complétés",
      teamProgress: "Aperçu des progrès de l'équipe",
      recentActivity: "Activité récente",
      upcomingExams: "Examens ELS à venir",
      addEmployee: "Ajouter un employé",
      createCohort: "Créer une cohorte",
      exportReport: "Exporter le rapport",
      searchPlaceholder: "Rechercher des employés...",
      filterByStatus: "Filtrer par statut",
      allStatuses: "Tous les statuts",
      onTrack: "En bonne voie",
      needsAttention: "Attention requise",
      atRisk: "À risque",
      name: "Nom",
      department: "Département",
      currentLevel: "Actuel",
      targetLevel: "Cible",
      progress: "Progrès",
      sessions: "Sessions",
      nextSession: "Prochaine session",
      status: "Statut",
      actions: "Actions",
      viewProfile: "Voir le profil",
      sendReminder: "Envoyer un rappel",
      cohortName: "Nom de la cohorte",
      members: "Membres",
      dateRange: "Période",
      avgProgressLabel: "Progrès moy.",
      manageCohort: "Gérer",
      loginRequired: "Veuillez vous connecter pour accéder au tableau de bord RH",
      signIn: "Se connecter",
      noAccess: "Accès au tableau de bord RH requis",
      noAccessDesc: "Vous avez besoin des privilèges de gestionnaire RH ou d'administrateur pour accéder à ce tableau de bord.",
      contactAdmin: "Contactez votre administrateur pour obtenir l'accès.",
    },
  };

  const l = labels[language];

  // Filter team members
  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle>{l.dashboard}</CardTitle>
              <CardDescription>{l.loginRequired}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={getLoginUrl()} className="block">
                <Button className="w-full" size="lg">
                  {l.signIn}
                </Button>
              </a>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if user has HR access (role === 'hr' or 'admin' or 'owner')
  const hasHRAccess = user?.role === "hr" || user?.role === "admin" || user?.role === "owner";

  if (!authLoading && isAuthenticated && !hasHRAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>{l.noAccess}</CardTitle>
              <CardDescription>{l.noAccessDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              {l.contactAdmin}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-emerald-100 text-emerald-700">{l.onTrack}</Badge>;
      case "needs-attention":
        return <Badge className="bg-amber-100 text-amber-700">{l.needsAttention}</Badge>;
      case "at-risk":
        return <Badge className="bg-red-100 text-red-700">{l.atRisk}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main id="main-content" className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                {l.dashboard}
              </h1>
              <p className="text-muted-foreground">{l.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                {l.addEmployee}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">{l.totalEmployees}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">32</p>
                    <p className="text-xs text-muted-foreground">{l.activeInTraining}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">58%</p>
                    <p className="text-xs text-muted-foreground">{l.avgProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#E7F2F2] flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-[#0F3D3E]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">13</p>
                    <p className="text-xs text-muted-foreground">{l.completedSLE}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{l.overview}</TabsTrigger>
              <TabsTrigger value="team">{l.team}</TabsTrigger>
              <TabsTrigger value="cohorts">{l.cohorts}</TabsTrigger>
              <TabsTrigger value="reports">{l.reports}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Team Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.teamProgress}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTeamMembers.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {member.currentLevel} → {member.targetLevel}
                            </span>
                          </div>
                          <Progress value={member.progress} className="h-2" />
                        </div>
                        <span className="text-sm font-medium">{member.progress}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Exams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.upcomingExams}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Sarah Chen - CCC Oral</p>
                        <p className="text-sm text-muted-foreground">January 20, 2026</p>
                      </div>
                      <Badge>5 days</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Marie Leblanc - CBC Written</p>
                        <p className="text-sm text-muted-foreground">January 25, 2026</p>
                      </div>
                      <Badge>10 days</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Jean-Pierre Tremblay - BBB Oral</p>
                        <p className="text-sm text-muted-foreground">February 1, 2026</p>
                      </div>
                      <Badge>17 days</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Cohorts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{l.cohorts}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {l.createCohort}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {mockCohorts.map((cohort) => (
                      <Card key={cohort.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-sm">{cohort.name}</h4>
                            <Badge variant={cohort.status === "active" ? "default" : "secondary"}>
                              {cohort.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{cohort.members} {l.members}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{cohort.startDate} - {cohort.endDate}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>{l.avgProgressLabel}</span>
                              <span>{cohort.avgProgress}%</span>
                            </div>
                            <Progress value={cohort.avgProgress} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={l.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder={l.filterByStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{l.allStatuses}</SelectItem>
                        <SelectItem value="on-track">{l.onTrack}</SelectItem>
                        <SelectItem value="needs-attention">{l.needsAttention}</SelectItem>
                        <SelectItem value="at-risk">{l.atRisk}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{l.name}</TableHead>
                        <TableHead>{l.department}</TableHead>
                        <TableHead>{l.currentLevel}</TableHead>
                        <TableHead>{l.targetLevel}</TableHead>
                        <TableHead>{l.progress}</TableHead>
                        <TableHead>{l.sessions}</TableHead>
                        <TableHead>{l.status}</TableHead>
                        <TableHead>{l.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {member.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.currentLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{member.targetLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={member.progress} className="w-16 h-2" />
                              <span className="text-sm">{member.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{member.sessionsCompleted}</TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cohorts Tab */}
            <TabsContent value="cohorts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{l.cohorts}</CardTitle>
                    <CardDescription>
                      {language === "fr"
                        ? "Gérez les groupes de formation de votre organisation"
                        : "Manage your organization's training groups"}
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {l.createCohort}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{l.cohortName}</TableHead>
                        <TableHead>{l.members}</TableHead>
                        <TableHead>{l.dateRange}</TableHead>
                        <TableHead>{l.avgProgressLabel}</TableHead>
                        <TableHead>{l.status}</TableHead>
                        <TableHead>{l.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCohorts.map((cohort) => (
                        <TableRow key={cohort.id}>
                          <TableCell className="font-medium">{cohort.name}</TableCell>
                          <TableCell>{cohort.members}</TableCell>
                          <TableCell>
                            {cohort.startDate} - {cohort.endDate}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={cohort.avgProgress} className="w-16 h-2" />
                              <span className="text-sm">{cohort.avgProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={cohort.status === "active" ? "default" : "secondary"}>
                              {cohort.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              {l.manageCohort}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-2">
                      {language === "fr" ? "Rapport de progression" : "Progress Report"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "fr"
                        ? "Vue d'ensemble de la progression de l'équipe"
                        : "Team progress overview and trends"}
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Télécharger" : "Download"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-medium mb-2">
                      {language === "fr" ? "Rapport de sessions" : "Sessions Report"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "fr"
                        ? "Détails des sessions complétées"
                        : "Completed sessions details"}
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Télécharger" : "Download"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-[#E7F2F2] flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-[#0F3D3E]" />
                    </div>
                    <h3 className="font-medium mb-2">
                      {language === "fr" ? "Rapport ELS" : "SLE Report"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "fr"
                        ? "Résultats des examens ELS"
                        : "SLE exam results and outcomes"}
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Télécharger" : "Download"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
