/**
 * Enhanced Learner Dashboard
 * 
 * Complete dashboard with all Mega-Prompt 2 sections:
 * - Entitlement overview (coaching hours, simulations)
 * - Diagnostic status
 * - Learning plan progress
 * - Upcoming sessions
 * - AI Coach access
 * - Bilingual support (EN/FR)
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MessageSquare,
  Bot,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  ChevronRight,
  Video,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Play,
  FileText,
  Zap,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function LearnerDashboardEnhanced() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch entitlement data
  const { data: entitlement, isLoading: entitlementLoading } = trpc.entitlement?.getActive?.useQuery?.() || { data: null, isLoading: false };
  
  // Fetch diagnostic data
  const { data: diagnostic } = trpc.diagnostic?.getLatest?.useQuery?.() || { data: null };
  
  // Fetch learning plan
  const { data: learningPlan } = trpc.learningPlan?.getActive?.useQuery?.() || { data: null };
  
  // Fetch upcoming sessions
  const { data: upcomingSessions } = trpc.session?.getUpcoming?.useQuery?.() || { data: [] };

  const labels = {
    en: {
      title: "My Learning Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      diagnostic: "Diagnostic",
      learningPlan: "Learning Plan",
      sessions: "Sessions",
      aiCoach: "AI Coach",
      // Entitlement
      coachingBalance: "Coaching Balance",
      hoursRemaining: "hours remaining",
      minutesRemaining: "minutes remaining",
      simulationsRemaining: "simulations remaining",
      noPackage: "No Active Package",
      getPackage: "Get a Coaching Package",
      packageDesc: "Purchase a coaching package to unlock all features",
      // Diagnostic
      diagnosticStatus: "Diagnostic Status",
      diagnosticPending: "Not Started",
      diagnosticInProgress: "In Progress",
      diagnosticCompleted: "Completed",
      startDiagnostic: "Start Diagnostic",
      viewResults: "View Results",
      diagnosticDesc: "Complete your strategic language diagnostic to identify your strengths and areas for improvement.",
      // Learning Plan
      learningPlanStatus: "Your Learning Plan",
      planNotGenerated: "Not Generated",
      planReady: "Ready",
      viewPlan: "View Plan",
      generatePlan: "Generate Plan",
      planDesc: "Your personalized roadmap to achieving your target SLE level.",
      currentLevel: "Current Level",
      targetLevel: "Target Level",
      progress: "Progress",
      // Sessions
      upcomingSessions: "Upcoming Sessions",
      noSessions: "No upcoming sessions",
      bookSession: "Book a Session",
      joinSession: "Join",
      reschedule: "Reschedule",
      // AI Coach
      aiCoachTitle: "AI Coach",
      aiCoachDesc: "Practice anytime with our AI-powered coach",
      startPractice: "Start Practice",
      practiceHistory: "Practice History",
      totalPracticeTime: "Total Practice Time",
      sessionsCompleted: "Sessions Completed",
      // Quick Actions
      quickActions: "Quick Actions",
      findCoach: "Find a Coach",
      viewProgress: "View Progress",
      messages: "Messages",
    },
    fr: {
      title: "Mon tableau de bord",
      welcome: "Bon retour",
      overview: "Aperçu",
      diagnostic: "Diagnostic",
      learningPlan: "Plan d'apprentissage",
      sessions: "Sessions",
      aiCoach: "Coach IA",
      // Entitlement
      coachingBalance: "Solde de coaching",
      hoursRemaining: "heures restantes",
      minutesRemaining: "minutes restantes",
      simulationsRemaining: "simulations restantes",
      noPackage: "Aucun forfait actif",
      getPackage: "Obtenir un forfait",
      packageDesc: "Achetez un forfait de coaching pour débloquer toutes les fonctionnalités",
      // Diagnostic
      diagnosticStatus: "Statut du diagnostic",
      diagnosticPending: "Non commencé",
      diagnosticInProgress: "En cours",
      diagnosticCompleted: "Complété",
      startDiagnostic: "Commencer le diagnostic",
      viewResults: "Voir les résultats",
      diagnosticDesc: "Complétez votre diagnostic stratégique de langue pour identifier vos forces et points à améliorer.",
      // Learning Plan
      learningPlanStatus: "Votre plan d'apprentissage",
      planNotGenerated: "Non généré",
      planReady: "Prêt",
      viewPlan: "Voir le plan",
      generatePlan: "Générer le plan",
      planDesc: "Votre feuille de route personnalisée pour atteindre votre niveau ELS cible.",
      currentLevel: "Niveau actuel",
      targetLevel: "Niveau cible",
      progress: "Progression",
      // Sessions
      upcomingSessions: "Sessions à venir",
      noSessions: "Aucune session à venir",
      bookSession: "Réserver une session",
      joinSession: "Rejoindre",
      reschedule: "Reporter",
      // AI Coach
      aiCoachTitle: "Coach IA",
      aiCoachDesc: "Pratiquez à tout moment avec notre coach alimenté par l'IA",
      startPractice: "Commencer la pratique",
      practiceHistory: "Historique de pratique",
      totalPracticeTime: "Temps de pratique total",
      sessionsCompleted: "Sessions complétées",
      // Quick Actions
      quickActions: "Actions rapides",
      findCoach: "Trouver un coach",
      viewProgress: "Voir les progrès",
      messages: "Messages",
    },
  };

  const t = labels[language];
  const pricingPath = isEn ? "/en/pricing" : "/fr/tarifs";
  const marketplacePath = isEn ? "/en/marketplace" : "/fr/marche";
  const aiCoachPath = isEn ? "/en/ai-coach" : "/fr/coach-ia";
  const diagnosticPath = isEn ? "/en/diagnostic" : "/fr/diagnostic";

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8">
              <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                {isEn ? "Sign in Required" : "Connexion requise"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isEn ? "Please sign in to access your dashboard" : "Veuillez vous connecter pour accéder à votre tableau de bord"}
              </p>
              <Button asChild>
                <a href={getLoginUrl()}>
                  {isEn ? "Sign In" : "Se connecter"}
                </a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const coachingHours = entitlement ? Math.floor((entitlement as any).coachingMinutesRemaining / 60) : 0;
  const coachingMinutes = entitlement ? (entitlement as any).coachingMinutesRemaining % 60 : 0;
  const simulationsRemaining = entitlement ? (entitlement as any).simulationsTotal - (entitlement as any).simulationsUsed : 0;
  const diagnosticStatus = diagnostic?.status || "pending";
  const planStatus = learningPlan?.status || "draft";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={isEn ? "My Dashboard | Lingueefy" : "Mon tableau de bord | Lingueefy"}
        description={isEn ? "Track your SLE preparation progress, manage coaching sessions, and access your learning plan." : "Suivez vos progrès de préparation ELS, gérez vos sessions de coaching et accédez à votre plan d'apprentissage."}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.welcome}, {user?.name || "Learner"}!</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {(user?.name || "L").charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Entitlement Banner */}
        {entitlement ? (
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-blue-100 text-sm">{t.coachingBalance}</p>
                  <p className="text-3xl font-bold">
                    {coachingHours}h {coachingMinutes}m
                  </p>
                  <p className="text-blue-200 text-sm">{t.hoursRemaining}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-blue-100 text-sm">{isEn ? "Simulations" : "Simulations"}</p>
                  <p className="text-3xl font-bold">{simulationsRemaining}</p>
                  <p className="text-blue-200 text-sm">{t.simulationsRemaining}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-blue-100 text-sm">{t.diagnostic}</p>
                  <Badge variant="secondary" className={`mt-1 ${diagnosticStatus === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {diagnosticStatus === "completed" ? t.diagnosticCompleted : diagnosticStatus === "in_progress" ? t.diagnosticInProgress : t.diagnosticPending}
                  </Badge>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-blue-100 text-sm">{t.learningPlan}</p>
                  <Badge variant="secondary" className={`mt-1 ${planStatus === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {planStatus === "active" ? t.planReady : t.planNotGenerated}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{t.noPackage}</p>
                    <p className="text-gray-600">{t.packageDesc}</p>
                  </div>
                </div>
                <Link href={pricingPath}>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    {t.getPackage}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnostic Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>{t.diagnosticStatus}</CardTitle>
                      <CardDescription>{t.diagnosticDesc}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={diagnosticStatus === "completed" ? "default" : "secondary"}>
                    {diagnosticStatus === "completed" ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> {t.diagnosticCompleted}</>
                    ) : (
                      t.diagnosticPending
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {diagnosticStatus === "completed" ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-500">{t.currentLevel}</p>
                        <p className="text-2xl font-bold text-gray-900">{diagnostic?.currentLevel || "B"}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{t.targetLevel}</p>
                        <p className="text-2xl font-bold text-blue-600">{diagnostic?.targetLevel || "C"}</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      {t.viewResults}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href={diagnosticPath}>
                    <Button className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      {t.startDiagnostic}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Learning Plan Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>{t.learningPlanStatus}</CardTitle>
                      <CardDescription>{t.planDesc}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {planStatus === "active" ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{t.progress}</span>
                        <span className="font-medium">{learningPlan?.progressPercent || 0}%</span>
                      </div>
                      <Progress value={learningPlan?.progressPercent || 0} className="h-2" />
                    </div>
                    <Button variant="outline" className="w-full">
                      {t.viewPlan}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" disabled={diagnosticStatus !== "completed"}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.generatePlan}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{t.upcomingSessions}</CardTitle>
                  </div>
                  <Link href={marketplacePath}>
                    <Button variant="outline" size="sm">
                      {t.bookSession}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {(upcomingSessions as any[])?.length > 0 ? (
                  <div className="space-y-4">
                    {(upcomingSessions as any[]).slice(0, 3).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{session.coachName?.charAt(0) || "C"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{session.coachName}</p>
                            <p className="text-sm text-gray-500">
                              {session.date} • {session.time} • {session.duration}min
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">{t.reschedule}</Button>
                          <Button size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            {t.joinSession}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{t.noSessions}</p>
                    <Link href={marketplacePath}>
                      <Button>
                        {t.bookSession}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Bot className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>{t.aiCoachTitle}</CardTitle>
                    <CardDescription>{t.aiCoachDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={aiCoachPath}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Zap className="mr-2 h-4 w-4" />
                    {t.startPractice}
                  </Button>
                </Link>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">2.5h</p>
                    <p className="text-xs text-gray-500">{t.totalPracticeTime}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">12</p>
                    <p className="text-xs text-gray-500">{t.sessionsCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={marketplacePath}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-3 h-4 w-4" />
                    {t.findCoach}
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  {t.viewProgress}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  {t.messages}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
