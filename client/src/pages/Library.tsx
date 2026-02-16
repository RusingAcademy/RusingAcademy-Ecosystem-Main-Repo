/**
 * Library Page — /library
 * RusingAcademy Product Library
 * 
 * Premium, marketing-friendly product catalog page with:
 * - Hero section with glassmorphism value proposition
 * - Search + filters (Type, Free/Paid, Level, Language)
 * - Premium product cards with cover images, badges, and CTAs
 * - Category sections (Featured, New, By Collection)
 * - Product detail modal
 * - Bilingual FR/EN support
 * - EcosystemFooter with Rusinga International Consulting Ltd. branding
 * 
 * Enhanced: glassmorphism 3D cards, micro-animations, premium polish
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Filter,
  BookOpen,
  GraduationCap,
  Star,
  Sparkles,
  ChevronRight,
  X,
  ShoppingCart,
  Download,
  Globe,
  FileText,
  Mic,
  PenTool,
  BookText,
  UserCheck,
  Grid3X3,
  FileEdit,
  ArrowRight,
  Tag,
  Eye,
  Heart,
  ExternalLink,
  Library as LibraryIcon,
  Award,
  Users,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { EcosystemFooter } from "@/components/EcosystemFooter";
import {
  LIBRARY_ITEMS,
  LIBRARY_CATEGORIES,
  type LibraryItem,
  type ProductCollection,
  type ProductLanguage,
  type PriceType,
  type ProductLevel,
  type ProductAudience,
  getFeaturedItems,
  getNewItems,
  getRelatedItems,
  searchLibraryItems,
} from "@/data/library-items";

// ============================================================================
// ICON MAP
// ============================================================================
const iconMap: Record<string, any> = {
  Grid3X3,
  GraduationCap,
  UserCheck,
  BookText,
  PenTool,
  Mic,
  FileEdit,
  BookOpen,
};

// ============================================================================
// ANIMATIONS
// ============================================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ============================================================================
// HERO SECTION — Enhanced with floating book covers
// ============================================================================
function LibraryHero({ language }: { language: string }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foundation via-[#1a5c5e] to-[#0d2f30]" />

      {/* Animated decorative orbs */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white dark:bg-slate-800 dark:bg-slate-900/[0.02] rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white dark:bg-slate-800 dark:bg-slate-900/10 backdrop-blur-md text-white/90 border border-white/15 shadow-lg">
              <BookOpen className="w-4 h-4 text-orange-500" />
              {language === "fr" ? "Collection RusingAcademy" : "RusingAcademy Collection"}
            </span>
          </motion.div>

          {/* Title with glassmorphism */}
          <motion.div variants={fadeInUp}>
            <div className="inline-block px-8 py-6 md:px-12 md:py-8 rounded-3xl bg-white dark:bg-slate-800 dark:bg-slate-900/[0.07] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {language === "fr" ? (
                  <>
                    La Bibliothèque{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-[#fb923c] bg-clip-text text-transparent">RusingAcademy</span>
                  </>
                ) : (
                  <>
                    The{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-[#fb923c] bg-clip-text text-transparent">RusingAcademy</span>{" "}
                    Library
                  </>
                )}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                {language === "fr"
                  ? "Votre arsenal complet pour réussir les examens SLE et exceller dans la fonction publique canadienne bilingue."
                  : "Your complete arsenal to pass SLE exams and excel in Canada's bilingual public service."}
              </p>
            </div>
          </motion.div>

          {/* Stats with glassmorphism cards */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { value: "29", label: language === "fr" ? "Publications" : "Publications", icon: BookOpen },
              { value: "7", label: language === "fr" ? "Collections" : "Collections", icon: LibraryIcon },
              { value: "FR/EN", label: language === "fr" ? "Bilingue" : "Bilingual", icon: Globe },
              { value: "A1→C2", label: language === "fr" ? "Tous niveaux" : "All Levels", icon: GraduationCap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 dark:bg-slate-900/[0.08] backdrop-blur-md border border-white/10 min-w-[100px]"
              >
                <stat.icon className="w-5 h-5 text-orange-500" />
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-white/60">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeInUp}
            className="mt-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 text-white/40 text-sm"
            >
              <ChevronDown className="w-4 h-4" />
              {language === "fr" ? "Explorez la collection" : "Explore the collection"}
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FILTER BAR — Enhanced with better visual design
// ============================================================================
interface FilterState {
  search: string;
  collection: string;
  priceType: string;
  language: string;
  audience: string;
}

function FilterBar({
  filters,
  setFilters,
  language,
  resultCount,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  language: string;
  resultCount: number;
}) {
  const [showFilters, setShowFilters] = useState(false);

  const collectionOptions = [
    { value: "all", label: language === "fr" ? "Toutes les collections" : "All Collections" },
    ...LIBRARY_CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
      value: c.id,
      label: language === "fr" ? c.label_fr : c.label_en,
    })),
  ];

  const priceOptions = [
    { value: "all", label: language === "fr" ? "Tous les prix" : "All Prices" },
    { value: "free", label: language === "fr" ? "Gratuit" : "Free" },
    { value: "paid", label: language === "fr" ? "Payant" : "Paid" },
  ];

  const langOptions = [
    { value: "all", label: language === "fr" ? "Toutes les langues" : "All Languages" },
    { value: "FR", label: "Français" },
    { value: "EN", label: "English" },
    { value: "BILINGUAL", label: language === "fr" ? "Bilingue" : "Bilingual" },
  ];

  const audienceOptions = [
    { value: "all", label: language === "fr" ? "Tous les publics" : "All Audiences" },
    { value: "learner", label: language === "fr" ? "Apprenants" : "Learners" },
    { value: "coach", label: language === "fr" ? "Coachs" : "Coaches" },
    { value: "both", label: language === "fr" ? "Tous" : "Both" },
  ];

  const hasActiveFilters =
    filters.collection !== "all" ||
    filters.priceType !== "all" ||
    filters.language !== "all" ||
    filters.audience !== "all" ||
    filters.search !== "";

  return (
    <section className="sticky top-0 z-30 bg-white dark:bg-slate-800 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="container mx-auto px-6 md:px-8 py-4">
        {/* Search + Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder={language === "fr" ? "Rechercher un livre, un cours..." : "Search a book, a course..."}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-11 h-11 rounded-full border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 shadow-sm"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-full gap-2 transition-all duration-200 ${
              hasActiveFilters
                ? "border-orange-500 text-orange-500 bg-orange-500/5"
                : "border-slate-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            {language === "fr" ? "Filtres" : "Filters"}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </Button>

          <span className="text-sm text-slate-500 hidden md:inline font-medium">
            {resultCount} {language === "fr" ? "produit(s)" : "product(s)"}
          </span>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {[
                  { value: filters.collection, options: collectionOptions, key: "collection" },
                  { value: filters.priceType, options: priceOptions, key: "priceType" },
                  { value: filters.language, options: langOptions, key: "language" },
                  { value: filters.audience, options: audienceOptions, key: "audience" },
                ].map((filter) => (
                  <select
                    key={filter.key}
                    value={filter.value}
                    onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm bg-white dark:bg-slate-800 dark:bg-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all duration-200 hover:border-slate-300"
                  >
                    {filter.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ))}
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        search: "",
                        collection: "all",
                        priceType: "all",
                        language: "all",
                        audience: "all",
                      })
                    }
                    className="text-slate-500 hover:text-orange-500 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {language === "fr" ? "Réinitialiser" : "Reset"}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// PRODUCT CARD — Enhanced with 3D hover, glassmorphism, glow
// ============================================================================
function ProductCard({
  item,
  language,
  onSelect,
}: {
  item: LibraryItem;
  language: string;
  onSelect: (item: LibraryItem) => void;
}) {
  const title = language === "fr" ? item.title_fr : item.title_en;
  const desc = language === "fr" ? item.short_desc_fr : item.short_desc_en;
  const ctaLabel = language === "fr" ? item.cta_label_fr : item.cta_label_en;

  const levelLabel = item.level.join(", ");
  const langBadge =
    item.language === "BILINGUAL"
      ? language === "fr"
        ? "Bilingue"
        : "Bilingual"
      : item.language;

  return (
    <motion.div variants={cardVariant}>
      <Card
        className="group relative overflow-hidden border border-slate-200/80 hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] transition-all duration-500 cursor-pointer bg-white dark:bg-slate-800 dark:bg-slate-900 h-full flex flex-col rounded-2xl"
        onClick={() => onSelect(item)}
        tabIndex={0}
        role="button"
        aria-label={`${language === "fr" ? "Voir les détails de" : "View details for"} ${title}`}
        onKeyDown={(e) => e.key === "Enter" && onSelect(item)}
      >
        {/* Cover Image with enhanced hover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 rounded-t-2xl">
          <img
            src={item.cover_image_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.is_new && (
              <Badge className="bg-orange-500 text-white border-0 text-xs font-semibold shadow-md">
                <Sparkles className="w-3 h-3 mr-1" />
                {language === "fr" ? "Nouveau" : "New"}
              </Badge>
            )}
            {item.is_featured && (
              <Badge className="bg-foundation text-white border-0 text-xs font-semibold shadow-md">
                <Star className="w-3 h-3 mr-1" />
                {language === "fr" ? "Vedette" : "Featured"}
              </Badge>
            )}
            {item.price_type === "free" && (
              <Badge className="bg-emerald-500 text-white border-0 text-xs font-semibold shadow-md">
                <Download className="w-3 h-3 mr-1" />
                {language === "fr" ? "Gratuit" : "Free"}
              </Badge>
            )}
          </div>

          {/* Language badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white dark:bg-slate-800 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 text-xs shadow-sm">
              <Globe className="w-3 h-3 mr-1" />
              {langBadge}
            </Badge>
          </div>

          {/* Quick view on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <Button
              size="sm"
              className="w-full bg-white dark:bg-slate-800 dark:bg-slate-900/95 backdrop-blur-md text-foundation hover:bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-full font-medium text-xs shadow-lg"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              {language === "fr" ? "Aperçu rapide" : "Quick View"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 rounded-full">
              {item.format}
            </Badge>
            {levelLabel !== "ALL" && (
              <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 rounded-full">
                {levelLabel}
              </Badge>
            )}
            {item.audience === "coach" && (
              <Badge variant="outline" className="text-[10px] border-teal-500/30 text-teal-500 rounded-full">
                <UserCheck className="w-3 h-3 mr-0.5" />
                Coach
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-foundation transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {desc}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div>
              {item.price_type === "paid" && item.price_amount ? (
                <span className="text-lg font-bold text-foundation">
                  ${item.price_amount.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm font-semibold text-emerald-600">
                  {language === "fr" ? "Gratuit" : "Free"}
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="rounded-full bg-orange-500 hover:bg-cta-2 text-white text-xs px-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {item.price_type === "free" ? (
                <Download className="w-3.5 h-3.5 mr-1" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              )}
              {ctaLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// PRODUCT DETAIL MODAL — Enhanced with premium styling
// ============================================================================
function ProductDetailModal({
  item,
  open,
  onClose,
  language,
}: {
  item: LibraryItem | null;
  open: boolean;
  onClose: () => void;
  language: string;
}) {
  const [, navigate] = useLocation();

  if (!item) return null;

  const title = language === "fr" ? item.title_fr : item.title_en;
  const shortDesc = language === "fr" ? item.short_desc_fr : item.short_desc_en;
  const longDesc = language === "fr" ? item.long_desc_fr : item.long_desc_en;
  const whyExists = language === "fr" ? item.why_it_exists_fr : item.why_it_exists_en;
  const benefits = language === "fr" ? item.benefits_fr : item.benefits_en;
  const targetAudience = language === "fr" ? item.target_audience_fr : item.target_audience_en;
  const ctaLabel = language === "fr" ? item.cta_label_fr : item.cta_label_en;
  const relatedItems = getRelatedItems(item.slug);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        {/* Header with cover */}
        <div className="relative bg-gradient-to-br from-foundation via-[#1a5c5e] to-[#0d2f30] p-6 md:p-8 rounded-t-2xl">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            {/* Cover with 3D shadow */}
            <div className="w-32 md:w-40 flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <img
                  src={item.cover_image_url}
                  alt={title}
                  className="w-full rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10"
                />
                {/* Reflection effect */}
                <div className="absolute -bottom-1 left-2 right-2 h-4 bg-gradient-to-b from-white/5 to-transparent rounded-b-xl blur-sm" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  {item.is_new && (
                    <Badge className="bg-orange-500 text-white border-0 text-xs shadow-md">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {language === "fr" ? "Nouveau" : "New"}
                    </Badge>
                  )}
                  <Badge className="bg-white dark:bg-slate-800 dark:bg-slate-900/15 backdrop-blur-sm text-white border border-white/10 text-xs">
                    {item.format}
                  </Badge>
                  <Badge className="bg-white dark:bg-slate-800 dark:bg-slate-900/15 backdrop-blur-sm text-white border border-white/10 text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {item.language === "BILINGUAL" ? (language === "fr" ? "Bilingue" : "Bilingual") : item.language}
                  </Badge>
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/70 mt-2 text-sm leading-relaxed">
                  {shortDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                <span className="text-sm text-white/60">
                  {language === "fr" ? "Par" : "By"} {item.author}
                </span>
                {item.level[0] !== "ALL" && (
                  <span className="text-sm text-white/60">
                    {language === "fr" ? "Niveau" : "Level"}: {item.level.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Why it exists */}
          <div className="bg-gradient-to-br from-orange-500/5 to-[#fb923c]/5 border border-orange-500/15 rounded-2xl p-5">
            <h3 className="font-semibold text-foundation mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              {language === "fr" ? "Pourquoi ce produit existe" : "Why This Product Exists"}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{whyExists}</p>
          </div>

          {/* Long description */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              {language === "fr" ? "Description" : "Description"}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{longDesc}</p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              {language === "fr" ? "Ce que vous allez apprendre" : "What You'll Learn"}
            </h3>
            <ul className="space-y-2.5">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-3 h-3 text-orange-500" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Target audience */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" />
              {language === "fr" ? "Public cible" : "Target Audience"}
            </h3>
            <p className="text-slate-600 text-sm">{targetAudience}</p>
          </div>

          {/* Related items */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                {language === "fr" ? "Vous pourriez aussi aimer" : "You Might Also Like"}
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {relatedItems.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    className="flex-shrink-0 w-24 cursor-pointer group/related"
                    onClick={() => {
                      onClose();
                      navigate(`/library/books/${rel.slug}`);
                    }}
                  >
                    <img
                      src={rel.cover_image_url}
                      alt={language === "fr" ? rel.title_fr : rel.title_en}
                      className="w-full rounded-lg shadow-md group-hover/related:shadow-lg group-hover/related:scale-105 transition-all duration-300"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-tight">
                      {language === "fr" ? rel.title_fr : rel.title_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <Button
              size="lg"
              className="flex-1 rounded-full bg-orange-500 hover:bg-cta-2 text-white font-semibold gap-2 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                onClose();
                navigate(item.cta_url);
              }}
            >
              {item.price_type === "free" ? (
                <Download className="w-5 h-5" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
              {ctaLabel}
              {item.price_type === "paid" && item.price_amount && (
                <span className="ml-1">— ${item.price_amount.toFixed(2)}</span>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 border-slate-200 hover:border-foundation hover:text-foundation transition-all duration-200"
              onClick={() => {
                onClose();
                navigate(`/library/books/${item.slug}`);
              }}
            >
              <ExternalLink className="w-4 h-4" />
              {language === "fr" ? "Page détaillée" : "Full Page"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// CATEGORY PILLS — Enhanced with better styling
// ============================================================================
function CategoryPills({
  activeCategory,
  setActiveCategory,
  language,
}: {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  language: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {LIBRARY_CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-foundation text-white shadow-md shadow-teal-800/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
            }`}
          >
            <Icon className="w-4 h-4" />
            {language === "fr" ? cat.label_fr : cat.label_en}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// EMPTY STATE — Enhanced
// ============================================================================
function EmptyState({ language }: { language: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shadow-inner">
        <Search className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        {language === "fr" ? "Aucun résultat trouvé" : "No Results Found"}
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
        {language === "fr"
          ? "Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez."
          : "Try adjusting your filters or search query to find what you're looking for."}
      </p>
    </motion.div>
  );
}

// ============================================================================
// SECTION HEADER — Reusable premium section header
// ============================================================================
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  language,
  onViewAll,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  language: string;
  onViewAll?: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-[#fb923c]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-2 ml-[52px]">{subtitle}</p>
        )}
      </div>
      {onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-500 hover:text-[#ea6c10] hover:bg-orange-500/5 hidden md:flex rounded-full"
          onClick={onViewAll}
        >
          {language === "fr" ? "Voir tout" : "View All"}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN LIBRARY PAGE
// ============================================================================
export default function Library() {
  const { language } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    collection: "all",
    priceType: "all",
    language: "all",
    audience: "all",
  });

  // Filter items
  const filteredItems = useMemo(() => {
    let items = LIBRARY_ITEMS.filter((item) => item.status === "published");

    // Search
    if (filters.search) {
      items = searchLibraryItems(filters.search, language as "en" | "fr");
    }

    // Collection
    if (filters.collection !== "all") {
      items = items.filter((item) => item.collection === filters.collection);
    }

    // Price type
    if (filters.priceType !== "all") {
      items = items.filter((item) => item.price_type === filters.priceType);
    }

    // Language
    if (filters.language !== "all") {
      items = items.filter((item) => item.language === filters.language);
    }

    // Audience
    if (filters.audience !== "all") {
      items = items.filter((item) => item.audience === filters.audience || item.audience === "both");
    }

    return items.sort((a, b) => a.sort_order - b.sort_order);
  }, [filters, language]);

  const featuredItems = useMemo(() => getFeaturedItems(), []);
  const newItems = useMemo(() => getNewItems(), []);

  const hasActiveFilters =
    filters.collection !== "all" ||
    filters.priceType !== "all" ||
    filters.language !== "all" ||
    filters.audience !== "all" ||
    filters.search !== "";

  return (
    <>
      <Helmet>
        <title>
          {language === "fr"
            ? "Bibliothèque | RusingAcademy — Livres, Cours & Ressources SLE"
            : "Library | RusingAcademy — Books, Courses & SLE Resources"}
        </title>
        <meta
          name="description"
          content={
            language === "fr"
              ? "Explorez la bibliothèque complète RusingAcademy : livres, guides, cours et ressources pour réussir les examens SLE et exceller dans la fonction publique canadienne bilingue."
              : "Explore the complete RusingAcademy library: books, guides, courses, and resources to pass SLE exams and excel in Canada's bilingual public service."
          }
        />
        <meta property="og:title" content={language === "fr" ? "Bibliothèque RusingAcademy" : "RusingAcademy Library"} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <LibraryHero language={language} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          language={language}
          resultCount={filteredItems.length}
        />

        {/* Content */}
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-16">
          {/* If no active filters, show curated sections */}
          {!hasActiveFilters ? (
            <div className="space-y-20">
              {/* Featured Section */}
              {featuredItems.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Star}
                    title={language === "fr" ? "Nos Vedettes" : "Featured"}
                    language={language}
                  />
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
                  >
                    {featuredItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        language={language}
                        onSelect={setSelectedItem}
                      />
                    ))}
                  </motion.div>
                </section>
              )}

              {/* New Arrivals */}
              {newItems.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Sparkles}
                    title={language === "fr" ? "Nouveautés" : "New Arrivals"}
                    language={language}
                  />
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
                  >
                    {newItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        language={language}
                        onSelect={setSelectedItem}
                      />
                    ))}
                  </motion.div>
                </section>
              )}

              {/* All Products by Collection */}
              {LIBRARY_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                const catItems = LIBRARY_ITEMS.filter(
                  (item) => item.collection === cat.id && item.status === "published"
                );
                if (catItems.length === 0) return null;
                const Icon = iconMap[cat.icon] || BookOpen;
                return (
                  <section key={cat.id}>
                    <SectionHeader
                      icon={Icon}
                      title={language === "fr" ? cat.label_fr : cat.label_en}
                      subtitle={language === "fr" ? cat.description_fr : cat.description_en}
                      language={language}
                      onViewAll={() => setFilters({ ...filters, collection: cat.id })}
                    />
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={staggerContainer}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
                    >
                      {catItems.map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          language={language}
                          onSelect={setSelectedItem}
                        />
                      ))}
                    </motion.div>
                  </section>
                );
              })}

              {/* Coming Soon: Videos & Courses */}
              <section>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInScale}
                  className="bg-gradient-to-br from-foundation/5 via-[#14B8A6]/5 to-foundation/5 rounded-3xl p-8 md:p-12 text-center border border-foundation/10"
                >
                  <div className="max-w-2xl mx-auto">
                    <Badge className="bg-teal-500/10 text-teal-500 border-teal-500/20 mb-4">
                      {language === "fr" ? "Bientôt disponible" : "Coming Soon"}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                      {language === "fr"
                        ? "Cours vidéo & Formations en ligne"
                        : "Video Courses & Online Training"}
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      {language === "fr"
                        ? "Nous préparons une nouvelle génération de cours vidéo interactifs pour compléter notre bibliothèque. Restez à l'écoute !"
                        : "We're preparing a new generation of interactive video courses to complement our library. Stay tuned!"}
                    </p>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-foundation text-foundation hover:bg-foundation hover:text-white transition-all duration-300"
                    >
                      {language === "fr" ? "Me notifier" : "Notify Me"}
                    </Button>
                  </div>
                </motion.div>
              </section>
            </div>
          ) : (
            /* Filtered results */
            <div>
              {filteredItems.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
                >
                  {filteredItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      language={language}
                      onSelect={setSelectedItem}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState language={language} />
              )}
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        <ProductDetailModal
          item={selectedItem}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          language={language}
        />

        {/* Footer */}
        <EcosystemFooter
          lang={language === "fr" ? "fr" : "en"}
          theme="light"
          activeBrand="rusingacademy"
        />
      </div>
    </>
  );
}
