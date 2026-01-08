import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Video,
  MessageSquare,
  Settings,
  ChevronRight,
  CheckCircle,
  XCircle,
  CreditCard,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { AvailabilityManager } from "@/components/AvailabilityManager";

export default function CoachDashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  // Fetch coach profile
  const { data: coachProfile, isLoading: profileLoading } = trpc.coach.myProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch Stripe account status
  const { data: stripeStatus, isLoading: stripeLoading, refetch: refetchStripeStatus } = trpc.stripe.accountStatus.useQuery(
    undefined,
    { enabled: isAuthenticated && !!coachProfile }
  );

  // Stripe Connect onboarding mutation
  const startOnboardingMutation = trpc.stripe.startOnboarding.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start Stripe onboarding");
      setIsConnectingStripe(false);
    },
  });

  // Stripe dashboard link mutation
  const dashboardLinkMutation = trpc.stripe.dashboardLink.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open Stripe dashboard");
    },
  });

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    await startOnboardingMutation.mutateAsync();
  };

  const handleOpenStripeDashboard = async () => {
    await dashboardLinkMutation.mutateAsync();
  };

  // Mock data (will be replaced with tRPC queries)
  const todaysSessions = [
    {
      id: 1,
      learnerName: "Sophie Martin",
      time: "10:00 AM",
      type: "Oral Practice",
      duration: 60,
      level: "B → C",
    },
    {
      id: 2,
      learnerName: "Marc Dubois",
      time: "2:00 PM",
      type: "Exam Simulation",
      duration: 60,
      level: "A → B",
    },
    {
      id: 3,
      learnerName: "Emma Wilson",
      time: "4:00 PM",
      type: "Written Review",
      duration: 45,
      level: "B → B",
    },
  ];

  const pendingRequests = [
    {
      id: 1,
      learnerName: "Jean Tremblay",
      requestedDate: "Jan 15, 2026",
      requestedTime: "11:00 AM",
      type: "Trial Session",
    },
    {
      id: 2,
      learnerName: "Lisa Chen",
      requestedDate: "Jan 16, 2026",
      requestedTime: "3:00 PM",
      type: "Oral Practice",
    },
  ];

  const labels = {
    en: {
      dashboard: "Coach Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      availability: "Availability",
      schedule: "Schedule",
      students: "Students",
      earnings: "Earnings",
      todaysSessions: "Today's Sessions",
      noSessionsToday: "No sessions scheduled for today",
      pendingRequests: "Pending Requests",
      noPendingRequests: "No pending booking requests",
      accept: "Accept",
      decline: "Decline",
      join: "Join",
      viewAll: "View All",
      totalStudents: "Total Students",
      thisMonth: "This Month",
      rating: "Rating",
      completedSessions: "Completed Sessions",
      monthlyEarnings: "Monthly Earnings",
      responseRate: "Response Rate",
      quickActions: "Quick Actions",
      manageAvailability: "Manage Availability",
      viewMessages: "View Messages",
      editProfile: "Edit Profile",
      loginRequired: "Please sign in to access your coach dashboard",
      signIn: "Sign In",
      becomeCoach: "Become a Coach",
      notACoach: "You don't have a coach profile yet",
      stripeConnect: "Payment Setup",
      stripeConnected: "Stripe Connected",
      stripeNotConnected: "Connect Stripe to Receive Payments",
      connectStripe: "Connect with Stripe",
      viewStripeDashboard: "View Stripe Dashboard",
      stripeOnboarding: "Complete your Stripe setup to start receiving payments from students.",
      stripeComplete: "Your Stripe account is connected and ready to receive payments.",
      stripePending: "Your Stripe account setup is incomplete. Please complete the onboarding process.",
    },
    fr: {
      dashboard: "Tableau de bord coach",
      welcome: "Bon retour",
      overview: "Aperçu",
      availability: "Disponibilité",
      schedule: "Horaire",
      students: "Étudiants",
      earnings: "Revenus",
      todaysSessions: "Sessions d'aujourd'hui",
      noSessionsToday: "Aucune session prévue aujourd'hui",
      pendingRequests: "Demandes en attente",
      noPendingRequests: "Aucune demande de réservation en attente",
      accept: "Accepter",
      decline: "Refuser",
      join: "Rejoindre",
      viewAll: "Voir tout",
      totalStudents: "Étudiants totaux",
      thisMonth: "Ce mois",
      rating: "Évaluation",
      completedSessions: "Sessions complétées",
      monthlyEarnings: "Revenus mensuels",
      responseRate: "Taux de réponse",
      quickActions: "Actions rapides",
      manageAvailability: "Gérer la disponibilité",
      viewMessages: "Voir les messages",
      editProfile: "Modifier le profil",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord coach",
      signIn: "Se connecter",
      becomeCoach: "Devenir coach",
      notACoach: "Vous n'avez pas encore de profil coach",
      stripeConnect: "Configuration des paiements",
      stripeConnected: "Stripe connecté",
      stripeNotConnected: "Connectez Stripe pour recevoir des paiements",
      connectStripe: "Connecter avec Stripe",
      viewStripeDashboard: "Voir le tableau de bord Stripe",
      stripeOnboarding: "Complétez votre configuration Stripe pour commencer à recevoir des paiements des étudiants.",
      stripeComplete: "Votre compte Stripe est connecté et prêt à recevoir des paiements.",
      stripePending: "La configuration de votre compte Stripe est incomplète. Veuillez terminer le processus d'intégration.",
    },
  };

  const l = labels[language];

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

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main id="main-content" className="flex-1">
        <div className="container py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {l.welcome}, {user?.name?.split(" ")[0] || "Coach"}!
            </h1>
            <p className="text-muted-foreground">
              {language === "fr"
                ? "Voici votre aperçu pour aujourd'hui"
                : "Here's your overview for today"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground">{l.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.9</p>
                    <p className="text-xs text-muted-foreground">{l.rating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">{l.completedSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$2,450</p>
                    <p className="text-xs text-muted-foreground">{l.monthlyEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Sessions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{l.todaysSessions}</CardTitle>
                  <Link href="/coach/schedule">
                    <Button variant="outline" size="sm">
                      {l.viewAll}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {todaysSessions.length > 0 ? (
                    <div className="space-y-4">
                      {todaysSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {session.learnerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{session.learnerName}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.type} • {session.duration} min
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {session.level}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {session.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="gap-2">
                            <Video className="h-4 w-4" />
                            {l.join}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{l.noSessionsToday}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Requests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{l.pendingRequests}</CardTitle>
                  <Badge variant="secondary">{pendingRequests.length}</Badge>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {request.learnerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.learnerName}</p>
                              <p className="text-sm text-muted-foreground">
                                {request.type} • {request.requestedDate} at {request.requestedTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              {l.decline}
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {l.accept}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{l.noPendingRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stripe Connect Card */}
              {coachProfile && (
                <Card className={stripeStatus?.isOnboarded ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {l.stripeConnect}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stripeLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : stripeStatus?.isOnboarded ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">{l.stripeConnected}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{l.stripeComplete}</p>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={handleOpenStripeDashboard}
                          disabled={dashboardLinkMutation.isPending}
                        >
                          {dashboardLinkMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                          {l.viewStripeDashboard}
                        </Button>
                      </div>
                    ) : stripeStatus?.hasAccount ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">Setup Incomplete</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{l.stripePending}</p>
                        <Button
                          className="w-full gap-2"
                          onClick={handleConnectStripe}
                          disabled={isConnectingStripe}
                        >
                          {isConnectingStripe ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          Complete Setup
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">{l.stripeNotConnected}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{l.stripeOnboarding}</p>
                        <Button
                          className="w-full gap-2"
                          onClick={handleConnectStripe}
                          disabled={isConnectingStripe}
                        >
                          {isConnectingStripe ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          {l.connectStripe}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Availability Manager */}
              <AvailabilityManager />

              {/* Performance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{l.thisMonth}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.completedSessions}</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.totalStudents}</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.responseRate}</span>
                    <span className="font-medium text-emerald-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.monthlyEarnings}</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{l.quickActions}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/coach/availability" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {l.manageAvailability}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/messages" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {l.viewMessages}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/coach/profile" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {l.editProfile}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
