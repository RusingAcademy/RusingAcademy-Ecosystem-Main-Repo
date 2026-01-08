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
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function LearnerDashboard() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data (will be replaced with tRPC queries)
  const upcomingSessions = [
    {
      id: 1,
      coachName: "Marie Leblanc",
      date: "2026-01-10",
      time: "10:00 AM",
      type: "Oral Practice",
      duration: 60,
      meetingUrl: "https://meet.jit.si/lingueefy-Marie-1-abc123",
    },
    {
      id: 2,
      coachName: "Jean-Pierre Tremblay",
      date: "2026-01-12",
      time: "2:00 PM",
      type: "Exam Simulation",
      duration: 60,
      meetingUrl: "https://meet.jit.si/lingueefy-JeanPierre-2-def456",
    },
  ];

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
      practiceWithAi: "Practice with Prof Steven AI",
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
      practiceWithAi: "Pratiquer avec Prof Steven AI",
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {l.welcome}, {user?.name?.split(" ")[0] || "Learner"}!
            </h1>
            <p className="text-muted-foreground">
              {language === "fr"
                ? "Continuez votre parcours d'apprentissage"
                : "Continue your learning journey"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">BBB</p>
                    <p className="text-xs text-muted-foreground">{l.currentLevel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">CBC</p>
                    <p className="text-xs text-muted-foreground">{l.targetLevel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">{l.daysUntilExam}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12.5</p>
                    <p className="text-xs text-muted-foreground">{l.hoursLearned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {session.coachName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{session.coachName}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.type} • {session.duration} min
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.date).toLocaleDateString(
                                  language === "fr" ? "fr-CA" : "en-CA",
                                  { weekday: "short", month: "short", day: "numeric" }
                                )}{" "}
                                at {session.time}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="gap-2"
                            onClick={() => session.meetingUrl && window.open(session.meetingUrl, '_blank')}
                          >
                            <Video className="h-4 w-4" />
                            {l.join}
                          </Button>
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
