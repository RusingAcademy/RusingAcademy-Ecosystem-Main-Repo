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

  // Fetch coaches from database
  const { data: coaches, isLoading, error } = trpc.coach.list.useQuery({
    language: languageFilter !== "all" ? languageFilter as "french" | "english" | "both" : undefined,
    specializations: specializationFilter.length > 0 ? specializationFilter : undefined,
    minPrice: priceRange === "under40" ? undefined : priceRange === "40to60" ? 4000 : priceRange === "over60" ? 6001 : undefined,
    maxPrice: priceRange === "under40" ? 3999 : priceRange === "40to60" ? 6000 : undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

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
      // Parse specializations from JSON object to array
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
                      {["oral_a", "oral_b", "oral_c", "written_a", "written_b", "written_c", "reading", "anxiety_coaching"].map((key) => (
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
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === "fr" ? "Chargement..." : "Loading..."}
                    </span>
                  ) : (
                    `${processedCoaches.length} ${t("coaches.found")}`
                  )}
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Coach Cards */}
              {!isLoading && (
                <div className="space-y-4" role="list" aria-label={t("coaches.title")}>
                  {processedCoaches.map((coach) => (
                    <Card key={coach.id} className="coach-card overflow-hidden" role="listitem">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Coach Info */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <Avatar className="h-20 w-20 rounded-xl">
                                <AvatarImage src={coach.avatarUrl || undefined} />
                                <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-2xl font-bold">
                                  {(coach.name || "C").split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="font-semibold text-lg">{coach.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">
                                      {coach.headline}
                                    </p>
                                  </div>
                                  {/* Video badge removed - will show on profile page */}
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                                  <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                                    <span className="font-medium">{coach.averageRating || "New"}</span>
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
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary">
                                    {getLangLabel(coach.languages || "french")}
                                  </Badge>
                                  {coach.specializationsArray.slice(0, 3).map((spec) => (
                                    <Badge key={spec} variant="outline">
                                      {getSpecLabel(spec)}
                                    </Badge>
                                  ))}
                                  {coach.specializationsArray.length > 3 && (
                                    <Badge variant="outline">
                                      +{coach.specializationsArray.length - 3}
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

                  {processedCoaches.length === 0 && !isLoading && (
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
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
