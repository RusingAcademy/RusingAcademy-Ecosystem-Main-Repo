/**
 * Lingueefy Marketplace Page
 * 
 * Enhanced coach marketplace with:
 * - Coach listing with filters
 * - Availability display
 * - Entitlement-aware booking
 * - Bilingual support (EN/FR)
 */

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Search,
  Star,
  Clock,
  Users,
  Filter,
  Calendar,
  CheckCircle,
  Globe,
  Video,
  Award,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function LingueefyMarketplace() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  // Fetch coaches
  const { data: coaches, isLoading } = trpc.coach.list.useQuery({
    language: languageFilter !== "all" ? languageFilter as "french" | "english" | "both" : undefined,
    specializations: specializationFilter !== "all" ? [specializationFilter] : undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  // Fetch user's entitlement (if logged in)
  const { data: entitlement } = trpc.entitlement?.getActive?.useQuery?.() || { data: null };

  const labels = {
    en: {
      title: "Find Your Perfect SLE Coach",
      subtitle: "Book sessions with certified coaches using your coaching hours",
      searchPlaceholder: "Search by name, specialty, or language...",
      filterLanguage: "Language",
      filterSpecialization: "Specialization",
      filterLevel: "Target Level",
      all: "All",
      french: "French",
      english: "English",
      both: "Bilingual",
      oral: "Oral",
      written: "Written",
      reading: "Reading",
      levelA: "Level A",
      levelB: "Level B",
      levelC: "Level C",
      viewProfile: "View Profile",
      bookSession: "Book Session",
      minutesRemaining: "minutes remaining",
      noEntitlement: "No active coaching package",
      buyPackage: "Get a Coaching Package",
      rating: "rating",
      sessions: "sessions",
      yearsExp: "years experience",
      verified: "Verified Coach",
      topRated: "Top Rated",
      available: "Available",
      noCoaches: "No coaches found matching your criteria",
      loading: "Loading coaches...",
      yourBalance: "Your Coaching Balance",
      hoursRemaining: "hours remaining",
      getStarted: "Get Started",
      getStartedDesc: "Purchase a coaching package to start booking sessions with our expert coaches.",
    },
    fr: {
      title: "Trouvez votre coach ELS idéal",
      subtitle: "Réservez des sessions avec des coachs certifiés en utilisant vos heures de coaching",
      searchPlaceholder: "Rechercher par nom, spécialité ou langue...",
      filterLanguage: "Langue",
      filterSpecialization: "Spécialisation",
      filterLevel: "Niveau cible",
      all: "Tous",
      french: "Français",
      english: "Anglais",
      both: "Bilingue",
      oral: "Oral",
      written: "Écrit",
      reading: "Lecture",
      levelA: "Niveau A",
      levelB: "Niveau B",
      levelC: "Niveau C",
      viewProfile: "Voir le profil",
      bookSession: "Réserver",
      minutesRemaining: "minutes restantes",
      noEntitlement: "Aucun forfait de coaching actif",
      buyPackage: "Obtenir un forfait",
      rating: "note",
      sessions: "sessions",
      yearsExp: "ans d'expérience",
      verified: "Coach vérifié",
      topRated: "Meilleur noté",
      available: "Disponible",
      noCoaches: "Aucun coach trouvé correspondant à vos critères",
      loading: "Chargement des coachs...",
      yourBalance: "Votre solde de coaching",
      hoursRemaining: "heures restantes",
      getStarted: "Commencer",
      getStartedDesc: "Achetez un forfait de coaching pour commencer à réserver des sessions avec nos coachs experts.",
    },
  };

  const t = labels[language];
  const pricingPath = isEn ? "/en/pricing" : "/fr/tarifs";

  // Filter coaches based on search
  const filteredCoaches = useMemo(() => {
    if (!coaches) return [];
    return coaches.filter((coach: any) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (coach.user?.name || "").toLowerCase();
        const bio = (coach.bio || "").toLowerCase();
        if (!name.includes(query) && !bio.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [coaches, searchQuery]);

  const getSpecializationLabel = (spec: string) => {
    const specLabels: Record<string, { en: string; fr: string }> = {
      oralA: { en: "Oral A", fr: "Oral A" },
      oralB: { en: "Oral B", fr: "Oral B" },
      oralC: { en: "Oral C", fr: "Oral C" },
      writtenA: { en: "Written A", fr: "Écrit A" },
      writtenB: { en: "Written B", fr: "Écrit B" },
      writtenC: { en: "Written C", fr: "Écrit C" },
      reading: { en: "Reading", fr: "Lecture" },
    };
    return specLabels[spec]?.[language] || spec;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={isEn ? "Find SLE Coaches | Lingueefy Marketplace" : "Trouvez des coachs ELS | Marché Lingueefy"}
        description={isEn
          ? "Book sessions with certified SLE coaches. Use your coaching hours to prepare for your Second Language Evaluation."
          : "Réservez des sessions avec des coachs ELS certifiés. Utilisez vos heures de coaching pour préparer votre évaluation de langue seconde."
        }
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Entitlement Banner */}
        {entitlement ? (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.yourBalance}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.floor((entitlement as any).coachingMinutesRemaining / 60)} {t.hoursRemaining}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {(entitlement as any).offerCode}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{t.getStarted}</p>
                  <p className="text-gray-600">{t.getStartedDesc}</p>
                </div>
                <Link href={pricingPath}>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    {t.buyPackage}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Language Filter */}
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.filterLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="french">{t.french}</SelectItem>
                  <SelectItem value="english">{t.english}</SelectItem>
                  <SelectItem value="both">{t.both}</SelectItem>
                </SelectContent>
              </Select>

              {/* Specialization Filter */}
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Award className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.filterSpecialization} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="oralA">{t.oral} A</SelectItem>
                  <SelectItem value="oralB">{t.oral} B</SelectItem>
                  <SelectItem value="oralC">{t.oral} C</SelectItem>
                  <SelectItem value="writtenA">{t.written} A</SelectItem>
                  <SelectItem value="writtenB">{t.written} B</SelectItem>
                  <SelectItem value="writtenC">{t.written} C</SelectItem>
                  <SelectItem value="reading">{t.reading}</SelectItem>
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.filterLevel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="A">{t.levelA}</SelectItem>
                  <SelectItem value="B">{t.levelB}</SelectItem>
                  <SelectItem value="C">{t.levelC}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Coach Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{t.loading}</p>
          </div>
        ) : filteredCoaches.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t.noCoaches}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach: any) => (
              <Card key={coach.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Coach Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={coach.user?.avatarUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {(coach.user?.name || "C").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {coach.user?.name || "Coach"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{coach.rating?.toFixed(1) || "5.0"}</span>
                        <span className="text-gray-400">•</span>
                        <span>{coach.totalSessions || 0} {t.sessions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t.verified}
                      </Badge>
                    )}
                    {coach.rating >= 4.8 && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t.topRated}
                      </Badge>
                    )}
                    {coach.isAvailable && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Video className="h-3 w-3 mr-1" />
                        {t.available}
                      </Badge>
                    )}
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(coach.specializations || []).slice(0, 4).map((spec: string) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {getSpecializationLabel(spec)}
                      </Badge>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {coach.bio || (isEn ? "Experienced SLE coach ready to help you succeed." : "Coach ELS expérimenté prêt à vous aider à réussir.")}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{coach.yearsExperience || 3}+ {t.yearsExp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{coach.teachingLanguage === "both" ? t.both : coach.teachingLanguage === "french" ? t.french : t.english}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/coaches/${coach.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t.viewProfile}
                      </Button>
                    </Link>
                    <Link href={`/coaches/${coach.id}?book=true`} className="flex-1">
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t.bookSession}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
