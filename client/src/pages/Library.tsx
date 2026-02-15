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
 * 
 * Zero regression: this is a new page, no existing pages modified.
 */

import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============================================================================
// HERO SECTION
// ============================================================================
function LibraryHero({ language }: { language: string }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D3E] via-[#1a5c5e] to-[#0d2f30]" />
      {/* Decorative orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/10">
              <BookOpen className="w-4 h-4 text-[#F97316]" />
              {language === "fr" ? "Collection RusingAcademy" : "RusingAcademy Collection"}
            </span>
          </motion.div>

          {/* Title with glassmorphism */}
          <motion.div variants={fadeInUp}>
            <div className="inline-block px-8 py-6 md:px-12 md:py-8 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {language === "fr" ? (
                  <>
                    La Bibliothèque{" "}
                    <span className="text-[#F97316]">RusingAcademy</span>
                  </>
                ) : (
                  <>
                    The{" "}
                    <span className="text-[#F97316]">RusingAcademy</span>{" "}
                    Library
                  </>
                )}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                {language === "fr"
                  ? "Votre arsenal complet pour réussir les examens SLE et exceller dans la fonction publique canadienne bilingue."
                  : "Your complete arsenal to pass SLE exams and excel in Canada's bilingual public service."}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { value: "29", label: language === "fr" ? "Publications" : "Publications", icon: BookOpen },
              { value: "7", label: language === "fr" ? "Collections" : "Collections", icon: LibraryIcon },
              { value: "FR/EN", label: language === "fr" ? "Bilingue" : "Bilingual", icon: Globe },
              { value: "A1→C2", label: language === "fr" ? "Tous niveaux" : "All Levels", icon: GraduationCap },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-[#F97316] mb-1" />
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/60">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// FILTER BAR
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
    <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 md:px-8 py-4">
        {/* Search + Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder={language === "fr" ? "Rechercher un livre, un cours..." : "Search a book, a course..."}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 h-11 rounded-full border-slate-200 focus:border-[#F97316] focus:ring-[#F97316]/20"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-full gap-2 ${hasActiveFilters ? "border-[#F97316] text-[#F97316]" : ""}`}
          >
            <Filter className="w-4 h-4" />
            {language === "fr" ? "Filtres" : "Filters"}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            )}
          </Button>

          <span className="text-sm text-slate-500 hidden md:inline">
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
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {/* Collection */}
                <select
                  value={filters.collection}
                  onChange={(e) => setFilters({ ...filters, collection: e.target.value })}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 outline-none"
                >
                  {collectionOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Price */}
                <select
                  value={filters.priceType}
                  onChange={(e) => setFilters({ ...filters, priceType: e.target.value })}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 outline-none"
                >
                  {priceOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Language */}
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 outline-none"
                >
                  {langOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Audience */}
                <select
                  value={filters.audience}
                  onChange={(e) => setFilters({ ...filters, audience: e.target.value })}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 outline-none"
                >
                  {audienceOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
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
                    className="text-slate-500 hover:text-[#F97316]"
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
// PRODUCT CARD
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
        className="group relative overflow-hidden border border-slate-200 hover:border-[#F97316]/40 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white h-full flex flex-col"
        onClick={() => onSelect(item)}
        tabIndex={0}
        role="button"
        aria-label={`${language === "fr" ? "Voir les détails de" : "View details for"} ${title}`}
        onKeyDown={(e) => e.key === "Enter" && onSelect(item)}
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
          <img
            src={item.cover_image_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.is_new && (
              <Badge className="bg-[#F97316] text-white border-0 text-xs font-semibold">
                <Sparkles className="w-3 h-3 mr-1" />
                {language === "fr" ? "Nouveau" : "New"}
              </Badge>
            )}
            {item.is_featured && (
              <Badge className="bg-[#0F3D3E] text-white border-0 text-xs font-semibold">
                <Star className="w-3 h-3 mr-1" />
                {language === "fr" ? "Vedette" : "Featured"}
              </Badge>
            )}
            {item.price_type === "free" && (
              <Badge className="bg-emerald-500 text-white border-0 text-xs font-semibold">
                <Download className="w-3 h-3 mr-1" />
                {language === "fr" ? "Gratuit" : "Free"}
              </Badge>
            )}
          </div>

          {/* Language badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              {langBadge}
            </Badge>
          </div>

          {/* Quick view on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="w-full bg-white/90 backdrop-blur-sm text-[#0F3D3E] hover:bg-white rounded-full font-medium text-xs"
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
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
              {item.format}
            </Badge>
            {levelLabel !== "ALL" && (
              <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
                {levelLabel}
              </Badge>
            )}
            {item.audience === "coach" && (
              <Badge variant="outline" className="text-[10px] border-[#14B8A6]/30 text-[#14B8A6]">
                <UserCheck className="w-3 h-3 mr-0.5" />
                Coach
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#0F3D3E] transition-colors">
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
                <span className="text-lg font-bold text-[#0F3D3E]">
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
              className="rounded-full bg-[#F97316] hover:bg-[#ea6c10] text-white text-xs px-4"
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
// PRODUCT DETAIL MODAL
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with cover */}
        <div className="relative bg-gradient-to-br from-[#0F3D3E] to-[#1a5c5e] p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover */}
            <div className="w-32 md:w-40 flex-shrink-0 mx-auto md:mx-0">
              <img
                src={item.cover_image_url}
                alt={title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  {item.is_new && (
                    <Badge className="bg-[#F97316] text-white border-0 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {language === "fr" ? "Nouveau" : "New"}
                    </Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {item.format}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {item.language === "BILINGUAL" ? (language === "fr" ? "Bilingue" : "Bilingual") : item.language}
                  </Badge>
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/70 mt-2 text-sm">
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
          <div className="bg-[#F97316]/5 border border-[#F97316]/20 rounded-xl p-5">
            <h3 className="font-semibold text-[#0F3D3E] mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F97316]" />
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
              <Award className="w-5 h-5 text-[#F97316]" />
              {language === "fr" ? "Ce que vous allez apprendre" : "What You'll Learn"}
            </h3>
            <ul className="space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <ChevronRight className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Target audience */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#14B8A6]" />
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
                {relatedItems.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    className="flex-shrink-0 w-24 cursor-pointer group"
                    onClick={() => {
                      onClose();
                      navigate(`/library/books/${rel.slug}`);
                    }}
                  >
                    <img
                      src={rel.cover_image_url}
                      alt={language === "fr" ? rel.title_fr : rel.title_en}
                      className="w-full rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
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
              className="flex-1 rounded-full bg-[#F97316] hover:bg-[#ea6c10] text-white font-semibold gap-2"
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
              className="rounded-full gap-2 border-slate-200"
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
// CATEGORY SECTION
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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {LIBRARY_CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] || BookOpen;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-[#0F3D3E] text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
// EMPTY STATE
// ============================================================================
function EmptyState({ language }: { language: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {language === "fr" ? "Aucun résultat trouvé" : "No Results Found"}
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        {language === "fr"
          ? "Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez."
          : "Try adjusting your filters or search query to find what you're looking for."}
      </p>
    </motion.div>
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

      <main id="main-content" className="min-h-screen bg-slate-50">
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
        <div className="container mx-auto px-6 md:px-8 py-12">
          {/* If no active filters, show curated sections */}
          {!hasActiveFilters ? (
            <div className="space-y-16">
              {/* Featured Section */}
              {featuredItems.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <Star className="w-6 h-6 text-[#F97316]" />
                      {language === "fr" ? "Nos Vedettes" : "Featured"}
                    </h2>
                  </div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-[#F97316]" />
                      {language === "fr" ? "Nouveautés" : "New Arrivals"}
                    </h2>
                  </div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                          <Icon className="w-6 h-6 text-[#0F3D3E]" />
                          {language === "fr" ? cat.label_fr : cat.label_en}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          {language === "fr" ? cat.description_fr : cat.description_en}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#F97316] hover:text-[#ea6c10] hidden md:flex"
                        onClick={() =>
                          setFilters({ ...filters, collection: cat.id })
                        }
                      >
                        {language === "fr" ? "Voir tout" : "View All"}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={staggerContainer}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
              <section className="bg-gradient-to-br from-[#0F3D3E]/5 to-[#14B8A6]/5 rounded-2xl p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <Badge className="bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20 mb-4">
                    {language === "fr" ? "Bientôt disponible" : "Coming Soon"}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    {language === "fr"
                      ? "Cours vidéo & Formations en ligne"
                      : "Video Courses & Online Training"}
                  </h2>
                  <p className="text-slate-600 mb-6">
                    {language === "fr"
                      ? "Nous préparons une nouvelle génération de cours vidéo interactifs pour compléter notre bibliothèque. Restez à l'écoute !"
                      : "We're preparing a new generation of interactive video courses to complement our library. Stay tuned!"}
                  </p>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white"
                  >
                    {language === "fr" ? "Me notifier" : "Notify Me"}
                  </Button>
                </div>
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
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
      </main>
    </>
  );
}
