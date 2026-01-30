import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  BookOpen, 
  MessageSquare, 
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  Crown,
  Medal,
  Rocket,
  Heart,
  Users,
  Calendar,
  Clock,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// Badge definitions with icons and requirements
const BADGE_DEFINITIONS = {
  // Session Badges
  first_session: {
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    category: "sessions",
    requirement: { en: "Complete your first coaching session", fr: "Complétez votre première session de coaching" },
    xp: 50,
  },
  session_streak_7: {
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    category: "sessions",
    requirement: { en: "Complete 7 sessions in a row", fr: "Complétez 7 sessions consécutives" },
    xp: 100,
  },
  session_master: {
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    category: "sessions",
    requirement: { en: "Complete 50 coaching sessions", fr: "Complétez 50 sessions de coaching" },
    xp: 500,
  },
  early_bird: {
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    category: "sessions",
    requirement: { en: "Complete 10 sessions before 9 AM", fr: "Complétez 10 sessions avant 9h" },
    xp: 150,
  },
  
  // Course Badges
  course_complete: {
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    category: "courses",
    requirement: { en: "Complete your first course", fr: "Complétez votre premier cours" },
    xp: 100,
  },
  path_explorer: {
    icon: Rocket,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    category: "courses",
    requirement: { en: "Enroll in 5 different courses", fr: "Inscrivez-vous à 5 cours différents" },
    xp: 75,
  },
  knowledge_seeker: {
    icon: GraduationCap,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    category: "courses",
    requirement: { en: "Complete 10 courses", fr: "Complétez 10 cours" },
    xp: 300,
  },
  
  // Level Badges
  level_bbb: {
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    category: "levels",
    requirement: { en: "Reach SLE level BBB", fr: "Atteignez le niveau SLE BBB" },
    xp: 200,
  },
  level_cbc: {
    icon: Medal,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    category: "levels",
    requirement: { en: "Reach SLE level CBC", fr: "Atteignez le niveau SLE CBC" },
    xp: 400,
  },
  level_ccc: {
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    category: "levels",
    requirement: { en: "Reach SLE level CCC", fr: "Atteignez le niveau SLE CCC" },
    xp: 600,
  },
  
  // AI Practice Badges
  ai_explorer: {
    icon: Sparkles,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    category: "ai",
    requirement: { en: "Complete 10 AI practice sessions", fr: "Complétez 10 sessions de pratique IA" },
    xp: 100,
  },
  ai_master: {
    icon: Zap,
    color: "text-violet-500",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    category: "ai",
    requirement: { en: "Complete 100 AI practice sessions", fr: "Complétez 100 sessions de pratique IA" },
    xp: 500,
  },
  
  // Community Badges
  helpful_reviewer: {
    icon: MessageSquare,
    color: "text-teal-500",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    category: "community",
    requirement: { en: "Leave 10 coach reviews", fr: "Laissez 10 avis sur les coachs" },
    xp: 100,
  },
  community_champion: {
    icon: Users,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    category: "community",
    requirement: { en: "Refer 5 friends to the platform", fr: "Parrainez 5 amis sur la plateforme" },
    xp: 250,
  },
  loyal_learner: {
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    category: "community",
    requirement: { en: "Be active for 6 months", fr: "Soyez actif pendant 6 mois" },
    xp: 300,
  },
  
  // Special Badges
  perfect_attendance: {
    icon: Calendar,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    category: "special",
    requirement: { en: "Never miss a scheduled session for 3 months", fr: "Ne manquez aucune session pendant 3 mois" },
    xp: 400,
  },
  overachiever: {
    icon: Award,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    category: "special",
    requirement: { en: "Earn 5000 XP total", fr: "Gagnez 5000 XP au total" },
    xp: 500,
  },
};

type BadgeKey = keyof typeof BADGE_DEFINITIONS;

const BADGE_NAMES: Record<BadgeKey, { en: string; fr: string }> = {
  first_session: { en: "First Steps", fr: "Premiers Pas" },
  session_streak_7: { en: "On Fire", fr: "En Feu" },
  session_master: { en: "Session Master", fr: "Maître des Sessions" },
  early_bird: { en: "Early Bird", fr: "Lève-tôt" },
  course_complete: { en: "Course Graduate", fr: "Diplômé" },
  path_explorer: { en: "Path Explorer", fr: "Explorateur" },
  knowledge_seeker: { en: "Knowledge Seeker", fr: "Chercheur de Savoir" },
  level_bbb: { en: "BBB Achiever", fr: "Niveau BBB" },
  level_cbc: { en: "CBC Champion", fr: "Champion CBC" },
  level_ccc: { en: "CCC Master", fr: "Maître CCC" },
  ai_explorer: { en: "AI Explorer", fr: "Explorateur IA" },
  ai_master: { en: "AI Master", fr: "Maître IA" },
  helpful_reviewer: { en: "Helpful Reviewer", fr: "Critique Utile" },
  community_champion: { en: "Community Champion", fr: "Champion Communautaire" },
  loyal_learner: { en: "Loyal Learner", fr: "Apprenant Fidèle" },
  perfect_attendance: { en: "Perfect Attendance", fr: "Assiduité Parfaite" },
  overachiever: { en: "Overachiever", fr: "Surpasseur" },
};

const CATEGORIES = {
  sessions: { en: "Sessions", fr: "Sessions" },
  courses: { en: "Courses", fr: "Cours" },
  levels: { en: "Levels", fr: "Niveaux" },
  ai: { en: "AI Practice", fr: "Pratique IA" },
  community: { en: "Community", fr: "Communauté" },
  special: { en: "Special", fr: "Spécial" },
};

export default function BadgesCatalog() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { isAuthenticated } = useAuth();

  // Fetch user's earned badges if authenticated
  const { data: badgesData } = trpc.learner.getMyBadges.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: myXp } = trpc.learner.getMyXp.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const myBadges = badgesData?.badges || [];
  const earnedBadgeKeys = new Set(myBadges.map((b: any) => b.badgeKey) || []);

  const renderBadgeCard = (key: BadgeKey, earned: boolean) => {
    const badge = BADGE_DEFINITIONS[key];
    const name = BADGE_NAMES[key];
    const Icon = badge.icon;

    return (
      <Card 
        key={key} 
        className={`relative overflow-hidden transition-all ${
          earned 
            ? "border-2 border-primary/50 shadow-lg" 
            : "opacity-75 hover:opacity-100"
        }`}
      >
        {earned && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${badge.bgColor}`}>
              <Icon className={`h-6 w-6 ${badge.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">
                {isEn ? name.en : name.fr}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                +{badge.xp} XP
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            {isEn ? badge.requirement.en : badge.requirement.fr}
          </CardDescription>
          {!earned && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              {isEn ? "Not yet earned" : "Pas encore obtenu"}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const badgesByCategory = Object.entries(BADGE_DEFINITIONS).reduce((acc, [key, badge]) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(key as BadgeKey);
    return acc;
  }, {} as Record<string, BadgeKey[]>);

  const totalBadges = Object.keys(BADGE_DEFINITIONS).length;
  const earnedCount = earnedBadgeKeys.size;
  const totalXpPossible = Object.values(BADGE_DEFINITIONS).reduce((sum, b) => sum + b.xp, 0);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEn ? "Badge Catalog" : "Catalogue des Badges"}
        </h1>
        <p className="text-muted-foreground">
          {isEn 
            ? "Earn badges by completing activities and reaching milestones. Each badge rewards you with XP points!"
            : "Gagnez des badges en complétant des activités et en atteignant des jalons. Chaque badge vous récompense avec des points XP !"}
        </p>
      </div>

      {/* Progress Summary */}
      {isAuthenticated && (
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isEn ? "Badges Earned" : "Badges Gagnés"}
                </p>
                <p className="text-2xl font-bold">
                  {earnedCount} / {totalBadges}
                </p>
                <Progress value={(earnedCount / totalBadges) * 100} className="mt-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isEn ? "Total XP" : "XP Total"}
                </p>
                <p className="text-2xl font-bold">
                  {myXp?.totalXp || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isEn ? `Level ${myXp?.level || 1}` : `Niveau ${myXp?.level || 1}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isEn ? "XP from Badges" : "XP des Badges"}
                </p>
                <p className="text-2xl font-bold">
                  {myBadges.reduce((sum: number, b: any) => sum + (BADGE_DEFINITIONS[b.badgeKey as BadgeKey]?.xp || 0), 0) || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  / {totalXpPossible} {isEn ? "possible" : "possible"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="all">
            {isEn ? "All Badges" : "Tous les Badges"}
          </TabsTrigger>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {isEn ? label.en : label.fr}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(BADGE_DEFINITIONS).map((key) => 
              renderBadgeCard(key as BadgeKey, earnedBadgeKeys.has(key))
            )}
          </div>
        </TabsContent>

        {Object.keys(CATEGORIES).map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badgesByCategory[category]?.map((key) => 
                renderBadgeCard(key, earnedBadgeKeys.has(key))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
