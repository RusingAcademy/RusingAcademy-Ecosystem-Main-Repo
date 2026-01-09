import { useState, useMemo, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Loader2,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Coaches() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Fetch coaches from database
  const { data: coaches, isLoading, error } = trpc.coach.list.useQuery({
    language: languageFilter !== "all" ? languageFilter as "french" | "english" | "both" : undefined,
    specializations: specializationFilter.length > 0 ? specializationFilter : undefined,
    minPrice: priceRange === "under40" ? undefined : priceRange === "40to60" ? 4000 : priceRange === "over60" ? 6001 : undefined,
    maxPrice: priceRange === "under40" ? 3999 : priceRange === "40to60" ? 6000 : undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number(entry.target.getAttribute('data-coach-id'));
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    cardRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [coaches]);

  const specializationLabels: Record<string, { en: string; fr: string }> = {
    oral_a: { en: "Oral A", fr: "Oral A" },
    oral_b: { en: "Oral B", fr: "Oral B" },
    oral_c: { en: "Oral C", fr: "Oral C" },
    oralA: { en: "Oral A", fr: "Oral A" },
    oralB: { en: "Oral B", fr: "Oral B" },
    oralC: { en: "Oral C", fr: "Oral C" },
    written_a: { en: "Written A", fr: "Écrit A" },
    written_b: { en: "Written B", fr: "Écrit B" },
    written_c: { en: "Written C", fr: "Écrit C" },
    writtenA: { en: "Written A", fr: "Écrit A" },
    writtenB: { en: "Written B", fr: "Écrit B" },
    writtenC: { en: "Written C", fr: "Écrit C" },
    reading: { en: "Reading", fr: "Lecture" },
    readingComprehension: { en: "Reading", fr: "Lecture" },
    anxiety_coaching: { en: "Anxiety Coaching", fr: "Gestion du stress" },
    examPrep: { en: "Exam Preparation", fr: "Préparation aux examens" },
    businessFrench: { en: "Business French", fr: "Français des affaires" },
    businessEnglish: { en: "Business English", fr: "Anglais des affaires" },
  };

  const getSpecLabel = (key: string) => specializationLabels[key]?.[language] || key;

  const languageLabels: Record<string, { en: string; fr: string }> = {
    french: { en: "French", fr: "Français" },
    english: { en: "English", fr: "Anglais" },
    both: { en: "Bilingual", fr: "Bilingue" },
  };

  const getLangLabel = (key: string) => languageLabels[key]?.[language] || key;

  // Process coach data to extract specializations array
  const processedCoaches = useMemo(() => {
    if (!coaches) return [];
    return coaches.map((coach) => {
      const specs = typeof coach.specializations === 'object' && coach.specializations !== null
        ? Object.entries(coach.specializations as Record<string, boolean>)
            .filter(([_, value]) => value)
            .map(([key]) => key)
        : [];
      return {
        ...coach,
        specializationsArray: specs,
      };
    });
  }, [coaches]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/30 via-white to-teal-50/20">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section with Glassmorphism */}
        <section className="relative py-16 md:py-20 overflow-hidden" aria-labelledby="coaches-title">
          {/* Decorative orbs */}
          <div className="orb orb-teal w-96 h-96 -top-48 -right-48 animate-float-slow" />
          <div className="orb orb-teal w-64 h-64 top-20 -left-32 animate-float-medium opacity-50" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl">
              {/* Glass badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge mb-6">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  {language === "fr" ? "Coachs certifiés SLE" : "SLE-Certified Coaches"}
                </span>
              </div>
              
              <h1 id="coaches-title" className="text-4xl md:text-5xl font-bold mb-4">
                {language === "fr" ? (
                  <>Trouvez votre <span className="gradient-text">coach idéal</span></>
                ) : (
                  <>Find your <span className="gradient-text">perfect coach</span></>
                )}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("coaches.description")}
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Glassmorphism */}
            <aside 
              className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
              aria-label={language === "fr" ? "Filtres de recherche" : "Search filters"}
            >
              <div className="glass-card sticky top-24">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold flex items-center gap-2 text-teal-800">
                      <Filter className="h-4 w-4" aria-hidden="true" /> {t("coaches.filters")}
                    </h2>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
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
                        className="pl-9 bg-white/50 border-teal-200/50 focus:border-teal-400 focus:ring-teal-400/20"
                        aria-label={t("coaches.search")}
                      />
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div className="space-y-3 mb-6">
                    <Label htmlFor="language-filter" className="text-teal-800">{t("coaches.language")}</Label>
                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger id="language-filter" className="bg-white/50 border-teal-200/50">
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
                    <legend className="text-sm font-medium text-teal-800">{t("coaches.specialization")}</legend>
                    <div className="space-y-2">
                      {["oral_a", "oral_b", "oral_c", "written_a", "written_b", "written_c", "reading", "anxiety_coaching"].map((key) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={specializationFilter.includes(key)}
                            onCheckedChange={() => toggleSpecialization(key)}
                            className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                          />
                          <label
                            htmlFor={key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
                          >
                            {getSpecLabel(key)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <Label htmlFor="price-filter" className="text-teal-800">{t("coaches.priceRange")}</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger id="price-filter" className="bg-white/50 border-teal-200/50">
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
                </div>
              </div>
            </aside>

            {/* Coach List */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between glass-btn-outline"
                  aria-expanded={showFilters}
                >
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" aria-hidden="true" />
                    {t("coaches.filters")}
                    {hasActiveFilters && (
                      <Badge className="ml-2 bg-teal-100 text-teal-700">
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
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                      {language === "fr" ? "Chargement..." : "Loading..."}
                    </span>
                  ) : (
                    <span className="font-medium text-teal-700">{processedCoaches.length} {t("coaches.found")}</span>
                  )}
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="glass-card p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      {language === "fr" ? "Recherche des meilleurs coachs..." : "Finding the best coaches..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Coach Cards - Glassmorphism */}
              {!isLoading && (
                <div className="space-y-4" role="list" aria-label={t("coaches.title")}>
                  {processedCoaches.map((coach, index) => (
                    <div
                      key={coach.id}
                      ref={(el) => { if (el) cardRefs.current.set(coach.id, el); }}
                      data-coach-id={coach.id}
                      className={`glass-card overflow-hidden hover-lift transition-all duration-500 ${
                        visibleCards.has(coach.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      role="listitem"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Coach Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start gap-4">
                            {/* Avatar with glow */}
                            <div className="relative group">
                              <div className="absolute inset-0 bg-teal-400/20 rounded-xl blur-xl group-hover:bg-teal-400/30 transition-all duration-300" />
                              <Avatar className="h-20 w-20 rounded-xl relative">
                                <AvatarImage src={coach.photoUrl || coach.avatarUrl || undefined} className="object-cover" />
                                <AvatarFallback className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold">
                                  {(coach.name || "C").split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">{coach.name}</h3>
                                  <p className="text-muted-foreground text-sm mb-2">
                                    {coach.headline}
                                  </p>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                                  <span className="font-medium">{coach.averageRating ? parseFloat(String(coach.averageRating)).toFixed(1) : "New"}</span>
                                  {coach.totalReviews && coach.totalReviews > 0 && (
                                    <span className="text-muted-foreground">({coach.totalReviews})</span>
                                  )}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-4 w-4" aria-hidden="true" />
                                  {coach.totalSessions || 0} {t("coaches.sessions")}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {t("coaches.respondsIn")} {coach.responseTimeHours || 24}h
                                </span>
                                {coach.successRate && coach.successRate > 0 && (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <Award className="h-4 w-4" aria-hidden="true" />
                                    {coach.successRate}% {t("coaches.successRate")}
                                  </span>
                                )}
                              </div>

                              {/* Specializations */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                                  {getLangLabel(coach.languages || "french")}
                                </Badge>
                                {coach.specializationsArray.slice(0, 3).map((spec) => (
                                  <Badge key={spec} variant="outline" className="border-teal-200 text-teal-700">
                                    {getSpecLabel(spec)}
                                  </Badge>
                                ))}
                                {coach.specializationsArray.length > 3 && (
                                  <Badge variant="outline" className="border-teal-200 text-teal-700">
                                    +{coach.specializationsArray.length - 3}
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Availability Indicator */}
                              <div className="flex items-center gap-2">
                                {coach.id % 3 === 0 ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {language === "fr" ? "Disponible aujourd'hui" : "Available Today"}
                                  </span>
                                ) : coach.id % 3 === 1 ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                    <Calendar className="w-3 h-3" />
                                    {language === "fr" ? "Prochain: Demain" : "Next: Tomorrow"}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    <Calendar className="w-3 h-3" />
                                    {language === "fr" ? "Prochain: Lundi" : "Next: Monday"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Actions - Glass effect */}
                        <div className="md:w-56 p-6 bg-gradient-to-br from-teal-50/50 to-white/50 flex flex-col justify-between border-t md:border-t-0 md:border-l border-teal-100/50">
                          <div>
                            <div className="text-center md:text-left mb-4">
                              <p className="text-2xl font-bold text-teal-700">
                                ${((coach.hourlyRate || 5500) / 100).toFixed(0)}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {t("common.perHour")}
                                </span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("common.trial")}: ${((coach.trialRate || 2500) / 100).toFixed(0)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Link href={`/coach/${coach.slug}`}>
                              <Button className="w-full glass-btn">
                                {t("coaches.viewProfile")}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                            <Button variant="outline" className="w-full glass-btn-outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {t("coaches.message")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && processedCoaches.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {language === "fr" ? "Aucun coach trouvé" : "No coaches found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === "fr" 
                      ? "Essayez d'ajuster vos filtres pour voir plus de résultats."
                      : "Try adjusting your filters to see more results."}
                  </p>
                  <Button onClick={clearFilters} className="glass-btn">
                    {t("coaches.clearAll")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
