import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Play,
  Award,
  Calendar,
  Clock,
  Video,
  ChevronRight,
  Trophy,
  Flame,
  Star,
  Target,
  GraduationCap,
  Settings,
  Download,
  ExternalLink,
  MessageSquare,
  Bell,
  Zap,
} from "lucide-react";

interface User {
  id: number;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  role?: string;
}

interface LearnerDashboardProps {
  user: User;
}

export default function LearnerDashboardContent({ user }: LearnerDashboardProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [coursesTab, setCoursesTab] = useState("in-progress");

  // Fetch learner data
  const { data: learnerProfile, isLoading: profileLoading } = trpc.learner.getProfile.useQuery();
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.courses.getMyEnrollments.useQuery();
  const { data: upcomingSessions, isLoading: sessionsLoading } = trpc.learner.getUpcomingSessions.useQuery();
  const { data: gamification, isLoading: gamificationLoading } = trpc.gamification.getMyStats.useQuery();
  const { data: certificates, isLoading: certificatesLoading } = trpc.certificates.getMyCertificates.useQuery();
  const { data: notifications } = trpc.notification.list.useQuery();

  const firstName = user.name?.split(" ")[0] || "Learner";

  // Labels
  const labels = {
    greeting: isEn ? `Welcome back, ${firstName}!` : `Bon retour, ${firstName}!`,
    subtitle: isEn ? "Continue your learning journey" : "Continuez votre parcours d'apprentissage",
    continueWhere: isEn ? "Continue where you left off" : "Reprendre où vous en étiez",
    myCourses: isEn ? "My Courses" : "Mes cours",
    inProgress: isEn ? "In Progress" : "En cours",
    completed: isEn ? "Completed" : "Terminés",
    saved: isEn ? "Saved" : "Sauvegardés",
    myCoaching: isEn ? "My Coaching" : "Mon coaching",
    nextSession: isEn ? "Next Session" : "Prochaine session",
    bookSession: isEn ? "Book a Session" : "Réserver une session",
    viewHistory: isEn ? "View History" : "Voir l'historique",
    certificates: isEn ? "Certificates" : "Certificats",
    downloadPdf: isEn ? "Download PDF" : "Télécharger PDF",
    verify: isEn ? "Verify" : "Vérifier",
    gamification: isEn ? "Your Progress" : "Votre progression",
    xp: isEn ? "XP Points" : "Points XP",
    level: isEn ? "Level" : "Niveau",
    streak: isEn ? "Day Streak" : "Jours consécutifs",
    leaderboard: isEn ? "Weekly Leaderboard" : "Classement hebdomadaire",
    notifications: isEn ? "Notifications" : "Notifications",
    noNotifications: isEn ? "No new notifications" : "Aucune nouvelle notification",
    resume: isEn ? "Resume" : "Reprendre",
    browse: isEn ? "Browse Courses" : "Parcourir les cours",
    findCoach: isEn ? "Find a Coach" : "Trouver un coach",
    noCourses: isEn ? "You haven't started any courses yet" : "Vous n'avez pas encore commencé de cours",
    startPath: isEn ? "Start with Path 1 - SLE Oral Mastery" : "Commencez avec le Parcours 1 - Maîtrise de l'oral ELS",
    noSessions: isEn ? "No upcoming coaching sessions" : "Aucune session de coaching à venir",
    bookFirst: isEn ? "Book your first session with a certified coach" : "Réservez votre première session avec un coach certifié",
    noCertificates: isEn ? "Complete your first module to earn a certificate" : "Terminez votre premier module pour obtenir un certificat",
    join: isEn ? "Join" : "Rejoindre",
    quickLinks: isEn ? "Quick Links" : "Liens rapides",
    continueLearning: isEn ? "Continue Learning" : "Continuer l'apprentissage",
    myCoachingSessions: isEn ? "My Coaching" : "Mon coaching",
    myCertificates: isEn ? "Certificates" : "Certificats",
    settings: isEn ? "Settings" : "Paramètres",
  };

  // Find last accessed course
  const lastCourse = enrollments?.find(e => e.progress > 0 && e.progress < 100);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main id="main-content" className="flex-1" role="main" aria-label={isEn ? "Learner Dashboard" : "Tableau de bord apprenant"}>
        <div className="container py-8 max-w-7xl mx-auto px-4">
          
          {/* Header with greeting and quick links */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{labels.greeting}</h1>
                <p className="text-muted-foreground">{labels.subtitle}</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              <Link href="/my-learning">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  {labels.continueLearning}
                </Button>
              </Link>
              <Link href="/my-sessions">
                <Button variant="outline" size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  {labels.myCoachingSessions}
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Continue Where You Left Off */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    {labels.continueWhere}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollmentsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : lastCourse ? (
                    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{lastCourse.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lastCourse.currentLessonTitle || (isEn ? "Continue learning" : "Continuer l'apprentissage")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={lastCourse.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{Math.round(lastCourse.progress)}%</span>
                        </div>
                      </div>
                      <Link href={`/courses/${lastCourse.courseSlug}/lessons/${lastCourse.currentLessonId || 1}`}>
                        <Button className="gap-2">
                          <Play className="h-4 w-4" />
                          {labels.resume}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">{labels.noCourses}</p>
                      <p className="text-sm text-muted-foreground mb-4">{labels.startPath}</p>
                      <Link href="/courses">
                        <Button className="gap-2">
                          <BookOpen className="h-4 w-4" />
                          {labels.browse}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {labels.myCourses}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={coursesTab} onValueChange={setCoursesTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="in-progress">{labels.inProgress}</TabsTrigger>
                      <TabsTrigger value="completed">{labels.completed}</TabsTrigger>
                      <TabsTrigger value="saved">{labels.saved}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="in-progress">
                      {enrollmentsLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-24 w-full" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      ) : enrollments?.filter(e => e.progress > 0 && e.progress < 100).length ? (
                        <div className="space-y-3">
                          {enrollments.filter(e => e.progress > 0 && e.progress < 100).map((enrollment) => (
                            <div key={enrollment.courseId} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{enrollment.courseTitle}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={enrollment.progress} className="flex-1 h-2" />
                                  <span className="text-sm text-muted-foreground">{Math.round(enrollment.progress)}%</span>
                                </div>
                              </div>
                              <Link href={`/courses/${enrollment.courseSlug}`}>
                                <Button variant="outline" size="sm" className="gap-1">
                                  {labels.resume}
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>{labels.noCourses}</p>
                          <Link href="/courses">
                            <Button variant="link" className="mt-2">{labels.browse}</Button>
                          </Link>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed">
                      {enrollments?.filter(e => e.progress >= 100).length ? (
                        <div className="space-y-3">
                          {enrollments.filter(e => e.progress >= 100).map((enrollment) => (
                            <div key={enrollment.courseId} className="flex items-center gap-4 p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <Award className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{enrollment.courseTitle}</h4>
                                <p className="text-sm text-green-600">{isEn ? "Completed" : "Terminé"} ✓</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>{isEn ? "No completed courses yet" : "Aucun cours terminé"}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="saved">
                      <div className="text-center py-6 text-muted-foreground">
                        <p>{isEn ? "No saved courses" : "Aucun cours sauvegardé"}</p>
                        <Link href="/courses">
                          <Button variant="link" className="mt-2">{labels.browse}</Button>
                        </Link>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* My Coaching */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    {labels.myCoaching}
                  </CardTitle>
                  <Link href="/coaches">
                    <Button variant="outline" size="sm">{labels.bookSession}</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {sessionsLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : upcomingSessions?.length ? (
                    <div className="space-y-3">
                      {upcomingSessions.slice(0, 2).map((session: any) => (
                        <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {session.coachName?.split(" ").map((n: string) => n[0]).join("") || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{session.coachName}</p>
                            <p className="text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(session.scheduledAt).toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {session.meetingUrl && (
                            <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="gap-2">
                                <Video className="h-4 w-4" />
                                {labels.join}
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                      <Link href="/my-sessions">
                        <Button variant="ghost" className="w-full gap-2">
                          {labels.viewHistory}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">{labels.noSessions}</p>
                      <p className="text-sm text-muted-foreground mb-4">{labels.bookFirst}</p>
                      <Link href="/coaches">
                        <Button className="gap-2">
                          <Video className="h-4 w-4" />
                          {labels.findCoach}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {labels.certificates}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {certificatesLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : certificates?.length ? (
                    <div className="space-y-3">
                      {certificates.map((cert: any) => (
                        <div key={cert.id} className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-[#FFF8F3] to-[#FFFBEB] dark:from-[#451A03]/20 dark:to-yellow-950/20">
                          <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                            <Award className="h-6 w-6 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{cert.courseTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              {isEn ? "Issued" : "Délivré"}: {new Date(cert.issuedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/certificates/${cert.certificateNumber}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="h-4 w-4" />
                                {labels.downloadPdf}
                              </Button>
                            </Link>
                            <Link href={`/verify/${cert.certificateNumber}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <ExternalLink className="h-4 w-4" />
                                {labels.verify}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{labels.noCertificates}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              
              {/* Gamification Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    {labels.gamification}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {gamificationLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : gamification ? (
                    <div className="space-y-4">
                      {/* XP and Level */}
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#E7F2F2] to-indigo-50 dark:from-[#0F3D3E]-950/20 dark:to-indigo-950/20">
                        <div className="h-12 w-12 rounded-full bg-[#E7F2F2] dark:bg-[#E7F2F2]/30 flex items-center justify-center">
                          <Zap className="h-6 w-6 text-[#0F3D3E]" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{gamification.totalXp?.toLocaleString() || 0}</p>
                          <p className="text-sm text-muted-foreground">{labels.xp}</p>
                        </div>
                      </div>

                      {/* Level */}
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Star className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{gamification.level || 1}</p>
                          <p className="text-sm text-muted-foreground">{labels.level}</p>
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#FFF8F3] to-red-50 dark:from-[#431407]/20 dark:to-red-950/20">
                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Flame className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{gamification.currentStreak || 0}</p>
                          <p className="text-sm text-muted-foreground">{labels.streak}</p>
                        </div>
                      </div>

                      {/* Recent Badges */}
                      {gamification.recentBadges?.length > 0 && (
                        <div className="pt-2">
                          <p className="text-sm font-medium mb-2">{isEn ? "Recent Badges" : "Badges récents"}</p>
                          <div className="flex gap-2 flex-wrap">
                            {gamification.recentBadges.slice(0, 4).map((badge: any) => (
                              <Badge key={badge.id} variant="secondary" className="gap-1">
                                {badge.icon} {badge.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>{isEn ? "Start learning to earn XP!" : "Commencez à apprendre pour gagner des XP!"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {labels.notifications}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications?.length ? (
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map((notif: any) => (
                        <div key={notif.id} className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notif.title}</p>
                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{labels.noNotifications}</p>
                    </div>
                  )}
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
