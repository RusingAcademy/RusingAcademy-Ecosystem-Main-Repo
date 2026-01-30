import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  CalendarClock,
  X,
  Heart,
  Settings,
  CreditCard,
  BarChart3,
  Share2,
  Gift,
} from "lucide-react";
import RescheduleModal from "@/components/RescheduleModal";
import { CancellationModal } from "@/components/CancellationModal";
import { ProgressReportCard } from "@/components/ProgressReportCard";
import { ReportPreferencesCard } from "@/components/ReportPreferencesCard";
import { ChallengesCard } from "@/components/ChallengesCard";
import { Leaderboard } from "@/components/Leaderboard";
import StreakCard from "@/components/StreakCard";
import { Link } from "wouter";
import { RoleSwitcherCompact } from "@/components/RoleSwitcher";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { StatCard, ProgressRing } from "@/components/dashboard";
import { Zap, Timer } from "lucide-react";
import { LearnerBadges } from "@/components/LearnerBadges";

export default function LearnerDashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [rescheduleSession, setRescheduleSession] = useState<{
    id: number;
    coachId: number;
    coachName: string;
    date: Date;
  } | null>(null);
  const [cancelSession, setCancelSession] = useState<{
    id: number;
    coachName: string;
    date: string;
    time: string;
    price: number;
  } | null>(null);

  // Fetch learner's enrolled courses (Path Series)
  const { data: myCourses, isLoading: coursesLoading } = trpc.learner.getMyCourses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch upcoming coaching sessions
  const { data: upcomingSessionsData, isLoading: sessionsLoading } = trpc.learner.getUpcomingSessions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch learner profile for SLE levels
  const { data: learnerProfile } = trpc.learner.getProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Use real data or fallback to empty arrays
  const upcomingSessions = upcomingSessionsData || [];
  const courses = myCourses || [];

  const recentAiSessions = [
    { id: 1, type: "Practice", language: "French", date: "2026-01-05", duration: 25 },
    { id: 2, type: "Placement", language: "French", date: "2026-01-03", duration: 15 },
  ];

  const labels = {
    en: {
      dashboard: "Learner Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      sessions: "Sessions",
      progress: "Progress",
      messages: "Messages",
      currentLevel: "Current Level",
      targetLevel: "Target Level",
      examDate: "Exam Date",
      daysUntilExam: "days until exam",
      upcomingSessions: "Upcoming Sessions",
      noSessions: "No upcoming sessions",
      bookSession: "Book a Session",
      recentAiPractice: "Recent AI Practice",
      practiceWithAi: "Practice with SLE AI Companion AI",
      viewAll: "View All",
      totalSessions: "Total Sessions",
      aiSessions: "AI Sessions",
      hoursLearned: "Hours Learned",
      findCoach: "Find a Coach",
      startPractice: "Start Practice",
      join: "Join",
      loginRequired: "Please sign in to access your dashboard",
      signIn: "Sign In",
    },
    fr: {
      dashboard: "Tableau de bord apprenant",
      welcome: "Bon retour",
      overview: "Aperçu",
      sessions: "Sessions",
      progress: "Progrès",
      messages: "Messages",
      currentLevel: "Niveau actuel",
      targetLevel: "Niveau cible",
      examDate: "Date d'examen",
      daysUntilExam: "jours avant l'examen",
      upcomingSessions: "Sessions à venir",
      noSessions: "Aucune session à venir",
      bookSession: "Réserver une session",
      recentAiPractice: "Pratique IA récente",
      practiceWithAi: "Pratiquer avec SLE AI Companion AI",
      viewAll: "Voir tout",
      totalSessions: "Sessions totales",
      aiSessions: "Sessions IA",
      hoursLearned: "Heures apprises",
      findCoach: "Trouver un coach",
      startPractice: "Commencer la pratique",
      join: "Rejoindre",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord",
      signIn: "Se connecter",
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
          {/* Welcome Header with Role Switcher */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">
                {l.welcome}, {user?.name?.split(" ")[0] || "Learner"}!
              </h1>
              <p className="text-muted-foreground">
                {language === "fr"
                  ? "Continuez votre parcours d'apprentissage"
                  : "Continue your learning journey"}
              </p>
            </div>
            <RoleSwitcherCompact />
          </div>

          {/* SLE Progression Visual */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Progress Ring */}
                <div className="flex-shrink-0">
                  <ProgressRing
                    progress={65}
                    size={140}
                    strokeWidth={12}
                    color="stroke-primary"
                    label={language === "fr" ? "Progression" : "Progress"}
                    sublabel="BBB → CBC"
                  />
                </div>
                {/* SLE Level Details */}
                <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-primary">BBB</p>
                    <p className="text-sm text-muted-foreground">{l.currentLevel}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === "fr" ? "Oral & Écrit" : "Oral & Written"}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <p className="text-3xl font-bold text-emerald-600">CBC</p>
                    <p className="text-sm text-muted-foreground">{l.targetLevel}</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {language === "fr" ? "Objectif" : "Target"}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <p className="text-3xl font-bold text-amber-600">45</p>
                    <p className="text-sm text-muted-foreground">{l.daysUntilExam}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      {language === "fr" ? "Jours restants" : "Days left"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={l.hoursLearned}
              value="12.5h"
              icon={Clock}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              subtitle={language === "fr" ? "Ce mois" : "This month"}
            />
            <StatCard
              title={language === "fr" ? "Sessions IA" : "AI Sessions"}
              value="8"
              icon={Bot}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              subtitle={language === "fr" ? "Complétées" : "Completed"}
            />
            <StatCard
              title={language === "fr" ? "Série active" : "Active Streak"}
              value="7"
              icon={Zap}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100"
              subtitle={language === "fr" ? "jours" : "days"}
            />
            <StatCard
              title={language === "fr" ? "Prochaine session" : "Next Session"}
              value="2j"
              icon={Timer}
              iconColor="text-emerald-600"
              iconBgColor="bg-emerald-100"
              subtitle={language === "fr" ? "avec Marie L." : "with Marie L."}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{l.upcomingSessions}</CardTitle>
                  <Link href="/coaches">
                    <Button variant="outline" size="sm">
                      {l.bookSession}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {sessionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">{language === "fr" ? "Chargement..." : "Loading..."}</p>
                    </div>
                  ) : upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {(session.coachName || "??")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{session.coachName || "Coach"}</p>
                              <p className="text-sm text-muted-foreground">
                                {language === "fr" ? "Session de coaching" : "Coaching Session"} • {session.duration || 30} min
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.scheduledAt).toLocaleDateString(
                                  language === "fr" ? "fr-CA" : "en-CA",
                                  { weekday: "short", month: "short", day: "numeric" }
                                )}{" "}
                                {language === "fr" ? "à" : "at"} {new Date(session.scheduledAt).toLocaleTimeString(language === "fr" ? "fr-CA" : "en-CA", { hour: "numeric", minute: "2-digit" })}
                              </p>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {session.status === "confirmed" ? (language === "fr" ? "Confirmé" : "Confirmed") : (language === "fr" ? "En attente" : "Pending")}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRescheduleSession({
                                id: session.id,
                                coachId: 1,
                                coachName: session.coachName || "Coach",
                                date: new Date(session.scheduledAt),
                              })}
                              title={language === "fr" ? "Reporter" : "Reschedule"}
                            >
                              <CalendarClock className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => setCancelSession({
                                id: session.id,
                                coachName: session.coachName || "Coach",
                                date: new Date(session.scheduledAt).toLocaleDateString(),
                                time: new Date(session.scheduledAt).toLocaleTimeString(),
                                price: 5500,
                              })}
                              title={language === "fr" ? "Annuler" : "Cancel"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-2"
                              onClick={() => session.meetingUrl && window.open(session.meetingUrl, '_blank')}
                              disabled={!session.meetingUrl}
                            >
                              <Video className="h-4 w-4" />
                              {l.join}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">{l.noSessions}</p>
                      <Link href="/coaches">
                        <Button>{l.findCoach}</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Courses (Path Series) */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {language === "fr" ? "Mes Cours (Path Series)" : "My Courses (Path Series)"}
                  </CardTitle>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      {language === "fr" ? "Voir tout" : "View All"}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">{language === "fr" ? "Chargement..." : "Loading..."}</p>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => window.location.href = `/courses/${course.courseId}`}
                        >
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={language === "fr" ? course.titleFr || course.title : course.title}
                              className="h-16 w-24 object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-16 w-24 bg-primary/10 rounded-md flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {language === "fr" ? course.titleFr || course.title : course.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === "fr" ? "Niveau" : "Level"}: {course.level?.toUpperCase() || "N/A"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${course.progressPercent}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">
                                {course.progressPercent}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {course.completedLessons}/{course.totalLessons} {language === "fr" ? "leçons" : "lessons"}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            {language === "fr" ? "Continuer" : "Continue"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {language === "fr" ? "Aucun cours inscrit" : "No enrolled courses"}
                      </p>
                      <Link href="/courses">
                        <Button>
                          {language === "fr" ? "Découvrir les cours" : "Browse Courses"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent AI Practice */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{l.recentAiPractice}</CardTitle>
                  <Link href="/prof-steven-ai">
                    <Button variant="outline" size="sm">
                      {l.viewAll}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentAiSessions.length > 0 ? (
                    <div className="space-y-3">
                      {recentAiSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{session.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.language} • {session.duration} min
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString(
                              language === "fr" ? "fr-CA" : "en-CA"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">{l.practiceWithAi}</p>
                      <Link href="/prof-steven-ai">
                        <Button>{l.startPractice}</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weekly Progress Report */}
              <ProgressReportCard />
              
{/* Learning Streak */}
               <StreakCard />
               
               {/* My Badges */}
               <LearnerBadges language={language} compact />
               
               {/* Weekly Challenges */}
               <ChallengesCard />
              
              {/* Leaderboard */}
              <Leaderboard />

              {/* Report Preferences */}
              <ReportPreferencesCard />

              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{l.progress}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Oral</span>
                      <span className="text-muted-foreground">B → C</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{language === "fr" ? "Écrit" : "Written"}</span>
                      <span className="text-muted-foreground">B → B</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{language === "fr" ? "Lecture" : "Reading"}</span>
                      <span className="text-muted-foreground">B → C</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === "fr" ? "Actions rapides" : "Quick Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/prof-steven-ai" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        {l.practiceWithAi}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/coaches" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {l.findCoach}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/messages" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {l.messages}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/my-sessions" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        {language === "fr" ? "Mes séances" : "My Sessions"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/favorites" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        {language === "fr" ? "Mes favoris" : "My Favorites"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/rewards" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        {language === "fr" ? "Récompenses" : "Rewards"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/referrals" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        {language === "fr" ? "Parrainage" : "Referrals"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/progress" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {language === "fr" ? "Mes progrès" : "My Progress"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/payments" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {language === "fr" ? "Paiements" : "Payments"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/settings" className="block">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {language === "fr" ? "Paramètres" : "Settings"}
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

      {/* Reschedule Modal */}
      {rescheduleSession && (
        <RescheduleModal
          isOpen={!!rescheduleSession}
          onClose={() => setRescheduleSession(null)}
          sessionId={rescheduleSession.id}
          coachId={rescheduleSession.coachId}
          coachName={rescheduleSession.coachName}
          currentDate={rescheduleSession.date}
          onSuccess={() => {
            // Refresh sessions data
            setRescheduleSession(null);
          }}
        />
      )}

      {/* Cancellation Modal */}
      {cancelSession && (
        <CancellationModal
          isOpen={!!cancelSession}
          onClose={() => setCancelSession(null)}
          session={{
            id: cancelSession.id,
            coachName: cancelSession.coachName,
            date: cancelSession.date,
            time: cancelSession.time,
            price: cancelSession.price,
          }}
          onCancelled={() => {
            // Refresh sessions data
            setCancelSession(null);
          }}
        />
      )}
    </div>
  );
}
