import SEO from "@/components/SEO";
import { useState, useMemo, useEffect, useRef } from "react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
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
// Header is provided by EcosystemLayout
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
  Linkedin,
  Sparkles,
  Calendar,
  CheckCircle,
  Globe,
  Video,
  Heart,
  Zap,
  TrendingUp,
  Shield,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'availability' | 'sessions';
type ViewMode = 'list' | 'compact';

export default function Coaches() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [hoveredCoach, setHoveredCoach] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [displayLimit, setDisplayLimit] = useState(10);

  // Start conversation mutation
  const startConversationMutation = trpc.message.startConversation.useMutation();

  // Fetch coaches from database
  const { data: coaches, isLoading, error } = trpc.coach.list.useQuery({
    language: languageFilter !== "all" ? languageFilter as "french" | "english" | "both" : undefined,
    specializations: specializationFilter.length > 0 ? specializationFilter : undefined,
    minPrice: priceRange === "under40" ? undefined : priceRange === "40to60" ? 4000 : priceRange === "over60" ? 6001 : undefined,
    maxPrice: priceRange === "under40" ? 3999 : priceRange === "40to60" ? 6000 : undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  // Reset display limit when filters change
  useEffect(() => {
    setDisplayLimit(10);
  }, [searchQuery, languageFilter, specializationFilter, priceRange, availabilityFilter, sortBy]);

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
    examPrep: { en: "Exam Prep", fr: "Préparation examen" },
    businessFrench: { en: "Business French", fr: "Français affaires" },
    businessEnglish: { en: "Business English", fr: "Anglais affaires" },
    confidence: { en: "Confidence", fr: "Confiance" },
    mindset: { en: "Mindset", fr: "Mentalité" },
    executive: { en: "Executive", fr: "Exécutif" },
    presentations: { en: "Presentations", fr: "Présentations" },
    professional_english: { en: "Professional English", fr: "Anglais professionnel" },
    cultural: { en: "Cultural", fr: "Culturel" },
    exam_prep: { en: "Exam Prep", fr: "Préparation examen" },
  };

  const getSpecLabel = (key: string) => specializationLabels[key]?.[language] || key;

  const languageLabels: Record<string, { en: string; fr: string }> = {
    french: { en: "French", fr: "Français" },
    english: { en: "English", fr: "Anglais" },
    both: { en: "Bilingual", fr: "Bilingue" },
  };

  const getLangLabel = (key: string) => languageLabels[key]?.[language] || key;

  // Get availability status for coach
  const getAvailability = (coach: { id: number; responseTimeHours?: number | null; totalSessions?: number | null }) => {
    const responseTime = coach.responseTimeHours ?? 24;
    if (responseTime <= 4) return { status: 'available', label: language === 'fr' ? 'Disponible' : 'Available', color: 'green', priority: 1 };
    if (responseTime <= 12) return { status: 'tomorrow', label: language === 'fr' ? 'Demain' : 'Tomorrow', color: 'amber', priority: 2 };
    return { status: 'this_week', label: language === 'fr' ? 'Cette semaine' : 'This Week', color: 'blue', priority: 3 };
  };

  // Process coach data to extract specializations array
  const processedCoaches = useMemo(() => {
    if (!coaches) return [];
    let result = coaches.map((coach) => {
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

    // Apply availability filter
    if (availabilityFilter !== 'all') {
      result = result.filter((coach) => {
        const avail = getAvailability(coach);
        return avail.status === availabilityFilter;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.hourlyRate || 5500) - (b.hourlyRate || 5500);
        case 'price_high':
          return (b.hourlyRate || 5500) - (a.hourlyRate || 5500);
        case 'rating':
          return (parseFloat(String(b.averageRating || 5)) - parseFloat(String(a.averageRating || 5)));
        case 'availability': {
          const aPriority = getAvailability(a).priority;
          const bPriority = getAvailability(b).priority;
          return aPriority - bPriority;
        }
        case 'sessions':
          return (b.totalSessions || 0) - (a.totalSessions || 0);
        case 'recommended':
        default:
          // Recommended: weight of rating + availability + sessions
          const aScore = (parseFloat(String(a.averageRating || 5)) * 20) + ((a.totalSessions || 0) * 0.01) + (getAvailability(a).priority === 1 ? 10 : 0);
          const bScore = (parseFloat(String(b.averageRating || 5)) * 20) + ((b.totalSessions || 0) * 0.01) + (getAvailability(b).priority === 1 ? 10 : 0);
          return bScore - aScore;
      }
    });

    return result;
  }, [coaches, availabilityFilter, sortBy]);

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
    setAvailabilityFilter("all");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    searchQuery || languageFilter !== "all" || specializationFilter.length > 0 || priceRange !== "all" || availabilityFilter !== "all";

  // Count active filters for badge
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    languageFilter !== "all" ? 1 : 0,
    specializationFilter.length,
    priceRange !== "all" ? 1 : 0,
    availabilityFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Sort option labels
  const sortLabels: Record<SortOption, { en: string; fr: string }> = {
    recommended: { en: "Recommended", fr: "Recommandés" },
    price_low: { en: "Price: Low to High", fr: "Prix: croissant" },
    price_high: { en: "Price: High to Low", fr: "Prix: décroissant" },
    rating: { en: "Highest Rated", fr: "Mieux notés" },
    availability: { en: "Soonest Available", fr: "Disponibilité" },
    sessions: { en: "Most Experienced", fr: "Plus expérimentés" },
  };

  return (
    <div className="min-h-screen flex flex-col section-bg-1">
      <SEO title="Our Coaches" description="Meet RusingAcademy's certified bilingual coaches specializing in SLE preparation and professional French training." canonical="/coaches" />
      

      <main id="main-content" className="flex-1">


        {/* Search Bar Section */}
          <section className="py-3">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 dark:border-white/15 overflow-hidden backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                    <Search className="w-5 h-5 text-teal-600 ml-4" />
                    <Input
                      type="text"
                      placeholder={language === 'fr' ? 'Rechercher par nom, spécialité...' : 'Search by name, specialty...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-0 bg-transparent text-lg py-6 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/60"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-2 mr-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        aria-label={language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    <Button className="m-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-5 rounded-lg">
                      {language === 'fr' ? 'Rechercher' : 'Search'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
           </section>

        {/* Main Content */}
          <div className="container mx-auto px-6 md:px-8 lg:px-12 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Premium */}
            <aside className={`lg:w-80 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
                {/* Filter Card - Premium Glassmorphism */}
                <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/15 overflow-hidden backdrop-blur-md" style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <div className="p-6 border-b border-slate-100 dark:border-teal-800">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5 text-teal-600" />
                        {language === 'fr' ? 'Filtres' : 'Filters'}
                        {activeFilterCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold">
                            {activeFilterCount}
                          </span>
                        )}
                      </h2>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                          <X className="w-3 h-3 mr-1" />
                          {language === 'fr' ? 'Effacer' : 'Clear'}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Availability Filter — NEW */}
                    <div>
                      <Label className="text-sm font-medium text-black dark:text-foreground/90 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        {language === 'fr' ? 'Disponibilité' : 'Availability'}
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { value: 'all', en: 'All', fr: 'Tous' },
                          { value: 'available', en: 'Now', fr: 'Maintenant' },
                          { value: 'tomorrow', en: 'Tomorrow', fr: 'Demain' },
                          { value: 'this_week', en: 'This Week', fr: 'Cette semaine' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setAvailabilityFilter(opt.value)}
                            aria-pressed={availabilityFilter === opt.value}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              availabilityFilter === opt.value
                                ? opt.value === 'available' 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/25'
                                : 'bg-slate-100 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-foundation-2'
                            }`}
                          >
                            {opt.value === 'available' && availabilityFilter === opt.value && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />
                            )}
                            {language === 'fr' ? opt.fr : opt.en}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language Filter */}
                    <div>
                      <Label className="text-sm font-medium text-black dark:text-foreground/90 mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-teal-600" />
                        {language === 'fr' ? 'Langue' : 'Language'}
                      </Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['all', 'french', 'english'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguageFilter(lang)}
                            aria-pressed={languageFilter === lang}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              languageFilter === lang
                                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/25'
                                : 'bg-slate-100 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-foundation-2'
                            }`}
                          >
                            {lang === 'all' ? (language === 'fr' ? 'Tous' : 'All') : getLangLabel(lang)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specialization Filter */}
                    <div>
                      <Label className="text-sm font-medium text-black dark:text-foreground/90 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        {language === 'fr' ? 'Spécialisation SLE' : 'SLE Specialization'}
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['oralA', 'oralB', 'oralC', 'writtenA', 'writtenB', 'writtenC', 'reading', 'anxiety_coaching'].map((spec) => (
                          <button
                            key={spec}
                            onClick={() => toggleSpecialization(spec)}
                            aria-pressed={specializationFilter.includes(spec)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                              specializationFilter.includes(spec)
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 dark:bg-white/[0.08] dark:backdrop-blur-md text-black dark:text-foreground dark:text-cyan-300 hover:bg-teal-100 hover:text-teal-700'
                            }`}
                          >
                            {getSpecLabel(spec)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium text-black dark:text-foreground/90 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-teal-600" />
                        {language === 'fr' ? 'Prix par heure' : 'Price per hour'}
                      </Label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md border-slate-200 dark:border-teal-800" style={{color: 'var(--color-black, var(--text))'}}>
                          <SelectValue placeholder={language === 'fr' ? 'Tous les prix' : 'Any Price'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === 'fr' ? 'Tous les prix' : 'Any Price'}</SelectItem>
                          <SelectItem value="under40">{language === 'fr' ? 'Moins de 40$' : 'Under $40'}</SelectItem>
                          <SelectItem value="40to60">$40 - $60</SelectItem>
                          <SelectItem value="over60">{language === 'fr' ? 'Plus de 60$' : 'Over $60'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us Card */}
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold text-lg mb-4">
                    {language === 'fr' ? 'Pourquoi Lingueefy?' : 'Why Lingueefy?'}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90">
                        {language === 'fr' ? 'Coachs certifiés SLE' : 'SLE-certified coaches'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90">
                        {language === 'fr' ? 'Garantie de satisfaction' : 'Satisfaction guarantee'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90">
                        {language === 'fr' ? 'Sessions flexibles 24/7' : 'Flexible 24/7 sessions'}
                      </span>
                    </li>
                  </ul>
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
                  className="w-full justify-between bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md border-slate-200 dark:border-teal-800"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {language === 'fr' ? 'Filtres' : 'Filters'}
                    {activeFilterCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                  {showFilters ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>

              {/* Results Toolbar — Sort + View Toggle + Count */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-slate-200/50 dark:border-white/15 p-3 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                {/* Left: Results Count */}
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                      {language === "fr" ? "Chargement..." : "Loading..."}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-black dark:text-foreground">
                      <span className="text-lg font-bold text-teal-600">{processedCoaches.length}</span>
                      {' '}{language === 'fr' ? 'coachs' : 'coaches'}
                    </span>
                  )}
                </div>

                {/* Right: Sort + View Toggle */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-white/[0.08] border-slate-200 dark:border-teal-800 text-sm h-9" style={{color: 'var(--color-black, var(--text))'}}>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {language === 'fr' ? sortLabels[key].fr : sortLabels[key].en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center border border-slate-200 dark:border-teal-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-white/[0.08] text-slate-500 hover:text-teal-600'}`}
                      aria-label={language === 'fr' ? 'Vue liste' : 'List view'}
                      title={language === 'fr' ? 'Vue liste' : 'List view'}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-2 transition-colors ${viewMode === 'compact' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-white/[0.08] text-slate-500 hover:text-teal-600'}`}
                      aria-label={language === 'fr' ? 'Vue compacte' : 'Compact view'}
                      title={language === 'fr' ? 'Vue compacte' : 'Compact view'}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
                    {language === 'fr' ? 'Filtres actifs:' : 'Active filters:'}
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                    >
                      <Search className="w-3 h-3" />
                      "{searchQuery}"
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                  {languageFilter !== "all" && (
                    <button
                      onClick={() => setLanguageFilter("all")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      {getLangLabel(languageFilter)}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                  {availabilityFilter !== "all" && (
                    <button
                      onClick={() => setAvailabilityFilter("all")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Calendar className="w-3 h-3" />
                      {availabilityFilter === 'available' ? (language === 'fr' ? 'Disponible' : 'Available') : availabilityFilter === 'tomorrow' ? (language === 'fr' ? 'Demain' : 'Tomorrow') : (language === 'fr' ? 'Cette semaine' : 'This Week')}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                  {specializationFilter.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialization(spec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                    >
                      {getSpecLabel(spec)}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  ))}
                  {priceRange !== "all" && (
                    <button
                      onClick={() => setPriceRange("all")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      {priceRange === 'under40' ? '<$40' : priceRange === '40to60' ? '$40-$60' : '>$60'}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-slate-500 hover:text-red-500 underline transition-colors ml-1"
                  >
                    {language === 'fr' ? 'Tout effacer' : 'Clear all'}
                  </button>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl shadow-xl border border-red-200/50 dark:border-red-700/50 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 flex items-center justify-center mx-auto mb-6">
                    <X className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-foreground mb-2">
                    {language === "fr" ? "Erreur de chargement" : "Loading Error"}
                  </h3>
                  <p className="text-black dark:text-foreground dark:text-cyan-300 mb-6 max-w-md mx-auto">
                    {language === "fr"
                      ? "Impossible de charger les coachs. Veuillez réessayer."
                      : "Unable to load coaches. Please try again."}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                  >
                    {language === 'fr' ? 'Réessayer' : 'Retry'}
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-10 md:py-16 lg:py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                    <p className="text-black dark:text-foreground">
                      {language === "fr" ? "Recherche des meilleurs coachs..." : "Finding the best coaches..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Coach Cards — LIST VIEW */}
              {!isLoading && viewMode === 'list' && (
                <div className="grid gap-4" role="list">
                  {processedCoaches.slice(0, displayLimit).map((coach, index) => {
                    const availability = getAvailability(coach);
                    const isHovered = hoveredCoach === coach.id;
                    
                    return (
                      <div
                        key={coach.id}
                        ref={(el) => { if (el) cardRefs.current.set(coach.id, el); }}
                        data-coach-id={coach.id}
                        onMouseEnter={() => setHoveredCoach(coach.id)}
                        onMouseLeave={() => setHoveredCoach(null)}
                        className={`group relative bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200/50 dark:border-white/15 overflow-hidden transition-all duration-500 ${
                          visibleCards.has(coach.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        role="listitem"
                      >
                        {/* Gradient Border Effect on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ padding: '2px' }}>
                          <div className="absolute inset-[2px] bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-[14px]" />
                        </div>

                        <div className="relative flex flex-col lg:flex-row">
                          {/* Coach Photo Section */}
                          <div className="lg:w-56 relative overflow-hidden">
                            <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[180px] lg:min-h-[220px] relative bg-slate-100 dark:bg-white/[0.08] dark:backdrop-blur-md">
                              {/* Photo */}
                              {imgErrors.has(coach.id) ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30">
                                  <div className="text-center">
                                    <Users className="w-12 h-12 text-teal-400 mx-auto mb-2" />
                                    <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">{coach.name}</span>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  loading={index < 3 ? "eager" : "lazy"}
                                  src={coach.photoUrl || coach.avatarUrl || 'https://rusingacademy-cdn.b-cdn.net/images/coaches/coach1.jpg'}
                                  alt={coach.name || 'Coach'}
                                  width={256}
                                  height={220}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  onError={() => setImgErrors(prev => new Set(prev).add(coach.id))}
                                />
                              )}
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-teal-950/20" />
                              
                              {/* Availability Badge */}
                              <div className="absolute top-3 left-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                                  availability.color === 'green' 
                                    ? 'bg-green-500/90 text-white' 
                                    : availability.color === 'amber'
                                    ? 'bg-cta/90 text-white'
                                    : 'bg-blue-500/90 text-white'
                                }`}>
                                  {availability.color === 'green' && (
                                    <span className="w-2 h-2 rounded-full bg-white dark:bg-white/[0.08] dark:backdrop-blur-md animate-pulse" />
                                  )}
                                  {availability.color !== 'green' && <Calendar className="w-3 h-3" />}
                                  {availability.label}
                                </span>
                              </div>

                              {/* Rating Badge */}
                              <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-white/[0.08] dark:backdrop-blur-md backdrop-blur-md" style={{color: 'var(--color-black, var(--text))'}}>
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {coach.averageRating ? parseFloat(String(coach.averageRating)).toFixed(1) : '5.0'}
                                </span>
                              </div>

                              {/* Coach Name on Mobile */}
                              <div className="absolute bottom-3 left-3 right-3 lg:hidden">
                                <h3 className="text-lg font-bold text-white mb-0.5">{coach.name}</h3>
                                <p className="text-white/90 text-xs line-clamp-1">{language === 'fr' && (coach as any).headlineFr ? (coach as any).headlineFr : coach.headline}</p>
                              </div>
                            </div>
                          </div>

                          {/* Coach Info Section */}
                          <div className="flex-1 p-4 lg:p-5">
                            {/* Name & Headline - Desktop */}
                            <div className="hidden lg:block mb-2">
                              <h3 className="text-xl font-bold text-black dark:text-foreground mb-1 group-hover:text-teal-600 transition-colors">
                                {coach.name}
                              </h3>
                              <p className="text-sm font-medium coach-headline-dark line-clamp-2">
                                {language === 'fr' && (coach as any).headlineFr ? (coach as any).headlineFr : coach.headline}
                              </p>
                            </div>

                            {/* Stats Row — Compact */}
                            <div className="flex flex-wrap items-center gap-3 mb-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-teal-600" />
                                <span className="font-semibold text-black dark:text-foreground">{coach.totalSessions || 324}</span>
                                <span className="text-slate-500 dark:text-foreground/70">{language === 'fr' ? 'sessions' : 'sessions'}</span>
                              </div>
                              <span className="text-slate-300 dark:text-slate-600">|</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                                <span className="text-slate-500 dark:text-foreground/70">{language === 'fr' ? 'Répond en' : 'Responds in'} {coach.responseTimeHours || 4}h</span>
                              </div>
                              {coach.successRate && coach.successRate > 0 && (
                                <>
                                  <span className="text-slate-300 dark:text-slate-600">|</span>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="font-semibold text-emerald-600">{coach.successRate}%</span>
                                    <span className="text-slate-500 dark:text-foreground/70">{language === 'fr' ? 'réussite' : 'success'}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Specializations — Streamlined */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 px-2 py-0.5 text-xs">
                                {getLangLabel(coach.languages || "french")}
                              </Badge>
                              {coach.specializationsArray.slice(0, 3).map((spec) => (
                                <Badge 
                                  key={spec} 
                                  variant="outline" 
                                  className="border-teal-300 dark:border-teal-700 text-black dark:text-foreground bg-teal-50 dark:bg-teal-800 px-2 py-0.5 text-xs font-medium"
                                >
                                  {getSpecLabel(spec)}
                                </Badge>
                              ))}
                              {coach.specializationsArray.length > 3 && (
                                <Badge variant="outline" className="border-slate-200 dark:border-teal-800 text-slate-500 dark:text-foreground px-2 py-0.5 text-xs">
                                  +{coach.specializationsArray.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* Verified Badges — Inline compact */}
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                                <CheckCircle className="w-3 h-3" />
                                {language === 'fr' ? 'Certifié SLE' : 'SLE Certified'}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-medium">
                                <Video className="w-3 h-3" />
                                {language === 'fr' ? 'Vidéo' : 'Video'}
                              </span>
                            </div>
                          </div>

                          {/* Pricing & Actions Section */}
                          <div className="lg:w-56 p-4 lg:p-4 bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-teal-900/50 dark:to-teal-900/20 border-t lg:border-t-0 lg:border-l border-slate-200/50 dark:border-white/15 flex flex-col justify-between">
                            <div>
                              {/* Price */}
                              <div className="text-center lg:text-left mb-3">
                                <div className="flex items-baseline justify-center lg:justify-start gap-1">
                                  <span className="text-lg md:text-2xl lg:text-2xl font-bold text-black dark:text-foreground">
                                    ${((coach.hourlyRate || 5500) / 100).toFixed(0)}
                                  </span>
                                  <span className="text-black dark:text-foreground/90 text-xs font-medium">/{language === 'fr' ? 'heure' : 'hour'}</span></div>
                                <p className="text-xs text-slate-500 dark:text-foreground/70 mt-0.5">
                                  {language === 'fr' ? 'Essai' : 'Trial'}: 
                                  <span className="font-semibold text-teal-600 ml-1">
                                    ${((coach.trialRate || 2500) / 100).toFixed(0)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons — Streamlined */}
                            <div className="space-y-2">
                              <Link href={`/coaches/${coach.slug}`}>
                                <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 h-9 text-sm">
                                  {language === 'fr' ? 'Voir le profil' : 'View Profile'}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </Link>
                              <Link href={`/coaches/${coach.slug}?book=trial`}>
                                <Button variant="outline" className="w-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 h-9 text-sm">
                                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                  {language === 'fr' ? 'Réserver un essai' : 'Book Trial'}
                                </Button>
                              </Link>
                              <div className="flex gap-2">
                                {(coach as any)?.linkedinUrl && (
                                  <a href={(coach as any)?.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button 
                                      variant="outline" 
                                      className="w-full border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 text-xs"
                                    >
                                      <Linkedin className="w-3.5 h-3.5" />
                                    </Button>
                                  </a>
                                )}
                                <Button 
                                  variant="outline" 
                                  className={`${(coach as any)?.linkedinUrl ? 'flex-1' : 'w-full'} border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 btn-message-teal h-8 text-xs`}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isAuthenticated) {
                                      sessionStorage.setItem('messageCoachAfterLogin', String(coach.userId));
                                      window.location.href = getLoginUrl();
                                      return;
                                    }
                                    try {
                                      const conv = await startConversationMutation.mutateAsync({ participantId: coach.userId });
                                      navigate(`/messages?conversation=${conv.conversationId}`);
                                    } catch (err: any) {
                                      toast.error(language === 'fr' ? 'Erreur lors de la création de la conversation' : 'Failed to start conversation');
                                    }
                                  }}
                                  disabled={startConversationMutation.isPending}
                                >
                                  {startConversationMutation.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                                  )}
                                  {language === 'fr' ? 'Message' : 'Message'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Coach Cards — COMPACT / GRID VIEW */}
              {!isLoading && viewMode === 'compact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                  {processedCoaches.slice(0, displayLimit).map((coach, index) => {
                    const availability = getAvailability(coach);
                    
                    return (
                      <Link key={coach.id} href={`/coaches/${coach.slug}`}>
                        <div
                          ref={(el) => { if (el) cardRefs.current.set(coach.id, el); }}
                          data-coach-id={coach.id}
                          className={`group relative bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-xl shadow-md hover:shadow-xl border border-slate-200/50 dark:border-white/15 overflow-hidden transition-all duration-400 cursor-pointer ${
                            visibleCards.has(coach.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ transitionDelay: `${index * 80}ms` }}
                          role="listitem"
                        >
                          {/* Compact Card Layout */}
                          <div className="flex items-center p-3 gap-3">
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                              {imgErrors.has(coach.id) ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                                  <Users className="w-6 h-6 text-teal-400" />
                                </div>
                              ) : (
                                <img
                                  loading="lazy"
                                  src={coach.photoUrl || coach.avatarUrl || 'https://rusingacademy-cdn.b-cdn.net/images/coaches/coach1.jpg'}
                                  alt={coach.name || 'Coach'}
                                  className="w-full h-full object-cover"
                                  onError={() => setImgErrors(prev => new Set(prev).add(coach.id))}
                                />
                              )}
                              {/* Availability dot */}
                              <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                availability.color === 'green' ? 'bg-green-500' : availability.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                              }`} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-semibold text-sm text-black dark:text-foreground truncate group-hover:text-teal-600 transition-colors">
                                  {coach.name}
                                </h3>
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-600">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {coach.averageRating ? parseFloat(String(coach.averageRating)).toFixed(1) : '5.0'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-foreground/70 line-clamp-1 mb-1">
                                {language === 'fr' && (coach as any).headlineFr ? (coach as any).headlineFr : coach.headline}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 px-1.5 py-0 text-[10px] h-4">
                                  {getLangLabel(coach.languages || "french")}
                                </Badge>
                                {coach.specializationsArray.slice(0, 2).map((spec) => (
                                  <Badge 
                                    key={spec} 
                                    variant="outline" 
                                    className="border-teal-200 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-800 px-1.5 py-0 text-[10px] h-4"
                                  >
                                    {getSpecLabel(spec)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-black dark:text-foreground">
                                ${((coach.hourlyRate || 5500) / 100).toFixed(0)}
                              </div>
                              <div className="text-[10px] text-slate-400">/{language === 'fr' ? 'hr' : 'hr'}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Load More Button */}
              {!isLoading && processedCoaches.length > displayLimit && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setDisplayLimit(prev => prev + 10)}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all duration-300"
                  >
                    {language === 'fr' 
                      ? `Voir plus de coachs (${processedCoaches.length - displayLimit} restants)` 
                      : `Load More Coaches (${processedCoaches.length - displayLimit} remaining)`}
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && processedCoaches.length === 0 && (
                <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/15 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-foreground mb-2">
                    {language === "fr" ? "Aucun coach trouvé" : "No coaches found"}
                  </h3>
                  <p className="text-black dark:text-foreground mb-6 max-w-md mx-auto">
                    {language === "fr" 
                      ? "Essayez d'ajuster vos filtres pour voir plus de résultats."
                      : "Try adjusting your filters to see more results."}
                  </p>
                  <Button 
                    onClick={clearFilters} 
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                  >
                    {language === 'fr' ? 'Effacer les filtres' : 'Clear Filters'}
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
