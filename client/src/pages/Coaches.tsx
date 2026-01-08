import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Search,
  Star,
  Clock,
  Users,
  Filter,
  X,
  ChevronRight,
  Play,
  MessageSquare,
  Award,
} from "lucide-react";
import { Link } from "wouter";

// Mock data for coaches (will be replaced with tRPC query)
const mockCoaches = [
  {
    id: 1,
    slug: "marie-leblanc",
    name: "Marie Leblanc",
    headline: "Oral C Specialist | 10+ Years SLE Experience",
    headlineFr: "Spécialiste oral C | 10+ ans d'expérience ELS",
    languages: "french",
    specializations: ["oral_c", "oral_b", "anxiety_coaching"],
    hourlyRate: 5500,
    trialRate: 2500,
    averageRating: 4.9,
    totalReviews: 127,
    totalSessions: 850,
    successRate: 94,
    responseTimeHours: 2,
    avatarUrl: null,
    videoUrl: "https://example.com/video",
  },
  {
    id: 2,
    slug: "jean-pierre-martin",
    name: "Jean-Pierre Martin",
    headline: "Written Expression Expert | Former PSC Evaluator",
    headlineFr: "Expert en expression écrite | Ancien évaluateur CFP",
    languages: "both",
    specializations: ["written_c", "written_b", "reading"],
    hourlyRate: 6000,
    trialRate: 3000,
    averageRating: 4.8,
    totalReviews: 89,
    totalSessions: 620,
    successRate: 91,
    responseTimeHours: 4,
    avatarUrl: null,
    videoUrl: null,
  },
  {
    id: 3,
    slug: "sarah-chen",
    name: "Sarah Chen",
    headline: "BBB to CBC Progression | Patient & Encouraging",
    headlineFr: "Progression BBB à CBC | Patiente et encourageante",
    languages: "french",
    specializations: ["oral_b", "oral_c", "written_b"],
    hourlyRate: 4500,
    trialRate: 2000,
    averageRating: 5.0,
    totalReviews: 56,
    totalSessions: 340,
    successRate: 96,
    responseTimeHours: 1,
    avatarUrl: null,
    videoUrl: "https://example.com/video",
  },
  {
    id: 4,
    slug: "david-tremblay",
    name: "David Tremblay",
    headline: "English Coach | Help Francophones Master English",
    headlineFr: "Coach d'anglais | Aide les francophones à maîtriser l'anglais",
    languages: "english",
    specializations: ["oral_b", "oral_c", "written_b"],
    hourlyRate: 5000,
    trialRate: 2500,
    averageRating: 4.7,
    totalReviews: 73,
    totalSessions: 480,
    successRate: 89,
    responseTimeHours: 3,
    avatarUrl: null,
    videoUrl: "https://example.com/video",
  },
  {
    id: 5,
    slug: "amelie-gagnon",
    name: "Amélie Gagnon",
    headline: "Level A & B Specialist | Perfect for Beginners",
    headlineFr: "Spécialiste niveaux A et B | Parfait pour les débutants",
    languages: "french",
    specializations: ["oral_a", "oral_b", "written_a"],
    hourlyRate: 4000,
    trialRate: 1500,
    averageRating: 4.9,
    totalReviews: 112,
    totalSessions: 720,
    successRate: 97,
    responseTimeHours: 2,
    avatarUrl: null,
    videoUrl: null,
  },
  {
    id: 6,
    slug: "michael-wong",
    name: "Michael Wong",
    headline: "Executive Level C | Briefings & Presentations",
    headlineFr: "Niveau C exécutif | Breffages et présentations",
    languages: "both",
    specializations: ["oral_c", "written_c", "anxiety_coaching"],
    hourlyRate: 7500,
    trialRate: 3500,
    averageRating: 4.8,
    totalReviews: 45,
    totalSessions: 280,
    successRate: 92,
    responseTimeHours: 6,
    avatarUrl: null,
    videoUrl: "https://example.com/video",
  },
];

export default function Coaches() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const specializationLabels: Record<string, { en: string; fr: string }> = {
    oral_a: { en: "Oral A", fr: "Oral A" },
    oral_b: { en: "Oral B", fr: "Oral B" },
    oral_c: { en: "Oral C", fr: "Oral C" },
    written_a: { en: "Written A", fr: "Écrit A" },
    written_b: { en: "Written B", fr: "Écrit B" },
    written_c: { en: "Written C", fr: "Écrit C" },
    reading: { en: "Reading", fr: "Lecture" },
    anxiety_coaching: { en: "Anxiety Coaching", fr: "Gestion du stress" },
  };

  const getSpecLabel = (key: string) => specializationLabels[key]?.[language] || key;

  const languageLabels: Record<string, { en: string; fr: string }> = {
    french: { en: "French", fr: "Français" },
    english: { en: "English", fr: "Anglais" },
    both: { en: "Bilingual", fr: "Bilingue" },
  };

  const getLangLabel = (key: string) => languageLabels[key]?.[language] || key;

  const filteredCoaches = useMemo(() => {
    return mockCoaches.filter((coach) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const headline = language === "fr" ? coach.headlineFr : coach.headline;
        if (
          !coach.name.toLowerCase().includes(query) &&
          !headline.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (languageFilter !== "all") {
        if (coach.languages !== languageFilter && coach.languages !== "both") {
          return false;
        }
      }

      if (specializationFilter.length > 0) {
        if (!specializationFilter.some((s) => coach.specializations.includes(s))) {
          return false;
        }
      }

      if (priceRange !== "all") {
        const rate = coach.hourlyRate / 100;
        if (priceRange === "under40" && rate >= 40) return false;
        if (priceRange === "40to60" && (rate < 40 || rate > 60)) return false;
        if (priceRange === "over60" && rate <= 60) return false;
      }

      return true;
    });
  }, [searchQuery, languageFilter, specializationFilter, priceRange, language]);

  const toggleSpecialization = (spec: string) => {
    setSpecializationFilter((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLanguageFilter("all");
    setSpecializationFilter([]);
    setPriceRange("all");
  };

  const hasActiveFilters =
    searchQuery || languageFilter !== "all" || specializationFilter.length > 0 || priceRange !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-12" aria-labelledby="coaches-title">
          <div className="container">
            <h1 id="coaches-title" className="text-3xl md:text-4xl font-bold mb-4">
              {t("coaches.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t("coaches.description")}
            </p>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside 
              className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
              aria-label={language === "fr" ? "Filtres de recherche" : "Search filters"}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" aria-hidden="true" /> {t("coaches.filters")}
                    </h2>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        {t("coaches.clearAll")}
                      </Button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        placeholder={t("coaches.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        aria-label={t("coaches.search")}
                      />
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div className="space-y-3 mb-6">
                    <Label htmlFor="language-filter">{t("coaches.language")}</Label>
                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger id="language-filter">
                        <SelectValue placeholder={t("coaches.allLanguages")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("coaches.allLanguages")}</SelectItem>
                        <SelectItem value="french">{t("coaches.french")}</SelectItem>
                        <SelectItem value="english">{t("coaches.english")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SLE Level Filter */}
                  <fieldset className="space-y-3 mb-6">
                    <legend className="text-sm font-medium">{t("coaches.specialization")}</legend>
                    <div className="space-y-2">
                      {Object.entries(specializationLabels).map(([key]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={specializationFilter.includes(key)}
                            onCheckedChange={() => toggleSpecialization(key)}
                          />
                          <label
                            htmlFor={key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {getSpecLabel(key)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <Label htmlFor="price-filter">{t("coaches.priceRange")}</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger id="price-filter">
                        <SelectValue placeholder={t("coaches.anyPrice")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("coaches.anyPrice")}</SelectItem>
                        <SelectItem value="under40">{t("coaches.under40")}</SelectItem>
                        <SelectItem value="40to60">{t("coaches.40to60")}</SelectItem>
                        <SelectItem value="over60">{t("coaches.over60")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Coach List */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                  aria-expanded={showFilters}
                >
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" aria-hidden="true" />
                    {t("coaches.filters")}
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        {language === "fr" ? "Actif" : "Active"}
                      </Badge>
                    )}
                  </span>
                  {showFilters ? <X className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                </Button>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground" aria-live="polite">
                  {filteredCoaches.length} {t("coaches.found")}
                </p>
              </div>

              {/* Coach Cards */}
              <div className="space-y-4" role="list" aria-label={t("coaches.title")}>
                {filteredCoaches.map((coach) => (
                  <Card key={coach.id} className="coach-card overflow-hidden" role="listitem">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Coach Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div 
                              className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                              aria-hidden="true"
                            >
                              <span className="text-2xl font-bold text-primary">
                                {coach.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{coach.name}</h3>
                                  <p className="text-muted-foreground text-sm mb-2">
                                    {language === "fr" ? coach.headlineFr : coach.headline}
                                  </p>
                                </div>
                                {coach.videoUrl && (
                                  <Badge variant="outline" className="shrink-0 gap-1">
                                    <Play className="h-3 w-3" aria-hidden="true" /> Video
                                  </Badge>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                                  <span className="font-medium">{coach.averageRating}</span>
                                  <span className="text-muted-foreground">
                                    ({coach.totalReviews} {t("coaches.reviews")})
                                  </span>
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-4 w-4" aria-hidden="true" />
                                  {coach.totalSessions} {t("coaches.sessions")}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {t("coaches.respondsIn")} {coach.responseTimeHours}h
                                </span>
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <Award className="h-4 w-4" aria-hidden="true" />
                                  {coach.successRate}% {t("coaches.successRate")}
                                </span>
                              </div>

                              {/* Specializations */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                  {getLangLabel(coach.languages)}
                                </Badge>
                                {coach.specializations.slice(0, 3).map((spec) => (
                                  <Badge key={spec} variant="outline">
                                    {getSpecLabel(spec)}
                                  </Badge>
                                ))}
                                {coach.specializations.length > 3 && (
                                  <Badge variant="outline">
                                    +{coach.specializations.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Actions */}
                        <div className="md:w-56 p-6 bg-muted/30 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                          <div>
                            <div className="text-center md:text-left mb-4">
                              <p className="text-2xl font-bold">
                                ${(coach.hourlyRate / 100).toFixed(0)}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {t("common.perHour")}
                                </span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("common.trial")}: ${(coach.trialRate / 100).toFixed(0)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Link href={`/coaches/${coach.slug}`}>
                              <Button className="w-full">{t("coaches.viewProfile")}</Button>
                            </Link>
                            <Button variant="outline" className="w-full gap-2">
                              <MessageSquare className="h-4 w-4" aria-hidden="true" />
                              {t("coaches.message")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredCoaches.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{t("coaches.noResults")}</h3>
                      <p className="text-muted-foreground mb-4">
                        {t("coaches.noResultsDesc")}
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        {t("coaches.clearAll")}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
