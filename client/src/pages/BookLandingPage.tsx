/**
 * BookLandingPage — /library/books/:slug
 * Individual product landing page for each book in the RusingAcademy Library.
 * 
 * Enhanced with:
 * - Premium glassmorphism hero with 3D cover shadow
 * - Animated breadcrumb navigation
 * - "Why this product exists" callout with gradient accent
 * - Detailed description + benefits with staggered animations
 * - Sticky sidebar with product details and CTA
 * - Related products carousel with hover effects
 * - EcosystemFooter with Rusinga International Consulting Ltd. branding
 * - Full bilingual FR/EN support
 * - SEO meta tags with Open Graph
 * 
 * Zero regression: existing data model and routing unchanged.
 */

import { useMemo } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Download,
  ShoppingCart,
  Globe,
  ChevronRight,
  ArrowLeft,
  Star,
  Sparkles,
  Award,
  Users,
  Zap,
  FileText,
  Smartphone,
  ExternalLink,
  Home,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  Share2,
  BookMarked,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { EcosystemFooter } from "@/components/EcosystemFooter";
import {
  LIBRARY_ITEMS,
  type LibraryItem,
  getRelatedItems,
} from "@/data/library-items";

// ============================================================================
// ANIMATIONS
// ============================================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ============================================================================
// BREADCRUMB — Enhanced with subtle animation
// ============================================================================
function Breadcrumb({ title, language }: { title: string; language: string }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-white/60 mb-8 flex-wrap"
    >
      <Link href="/" className="hover:text-white/90 transition-colors flex items-center gap-1.5 group">
        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        {language === "fr" ? "Accueil" : "Home"}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-white/30" />
      <Link href="/library" className="hover:text-white/90 transition-colors">
        {language === "fr" ? "Bibliothèque" : "Library"}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-white/30" />
      <span className="text-white/90 font-medium truncate max-w-[250px]">{title}</span>
    </motion.nav>
  );
}

// ============================================================================
// HERO SECTION — Enhanced with 3D cover and premium glassmorphism
// ============================================================================
function BookHero({ item, language }: { item: LibraryItem; language: string }) {
  const title = language === "fr" ? item.title_fr : item.title_en;
  const shortDesc = language === "fr" ? item.short_desc_fr : item.short_desc_en;
  const ctaLabel = language === "fr" ? item.cta_label_fr : item.cta_label_en;
  const langBadge =
    item.language === "BILINGUAL"
      ? language === "fr"
        ? "Bilingue"
        : "Bilingual"
      : item.language;

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foundation via-[#1a5c5e] to-[#0d2f30]" />

      {/* Animated decorative orbs */}
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
      />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-white dark:bg-background/[0.02] rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <Breadcrumb title={title} language={language} />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Cover Image with 3D shadow effect */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
            className="w-48 md:w-64 lg:w-72 flex-shrink-0 mx-auto md:mx-0"
          >
            <motion.div
              whileHover={{ y: -8, rotateY: 3 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative group"
              style={{ perspective: "1000px" }}
            >
              <img
                src={item.cover_image_url}
                alt={title}
                className="w-full rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/10 group-hover:shadow-[0_30px_70px_rgba(249,115,22,0.2)] transition-shadow duration-500"
              />
              {/* Reflection/glow effect */}
              <div className="absolute -bottom-3 left-4 right-4 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-b-xl blur-md" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {item.is_new && (
                  <Badge className="bg-orange-500 text-white border-0 text-xs font-semibold shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Nouveau" : "New"}
                  </Badge>
                )}
                {item.is_featured && (
                  <Badge className="bg-white dark:bg-background/20 backdrop-blur-sm text-white border-0 text-xs font-semibold shadow-md">
                    <Star className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Vedette" : "Featured"}
                  </Badge>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Info Panel with glassmorphism */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
            className="flex-1"
          >
            <div className="bg-white dark:bg-background/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge className="bg-white dark:bg-background/15 backdrop-blur-sm text-white border border-white/10 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {item.format}
                </Badge>
                <Badge className="bg-white dark:bg-background/15 backdrop-blur-sm text-white border border-white/10 text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {langBadge}
                </Badge>
                {item.level[0] !== "ALL" && (
                  <Badge className="bg-white dark:bg-background/15 backdrop-blur-sm text-white border border-white/10 text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {item.level.join(", ")}
                  </Badge>
                )}
                {item.audience === "coach" && (
                  <Badge className="bg-teal-500/30 text-teal-500 border border-teal-500/20 text-xs">
                    <UserCheck className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Pour Coachs" : "For Coaches"}
                  </Badge>
                )}
                {item.price_type === "free" && (
                  <Badge className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/20 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Gratuit" : "Free"}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                {title}
              </h1>

              {/* Short description */}
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
                {shortDesc}
              </p>

              {/* Author + Collection */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4" />
                  {language === "fr" ? "Par" : "By"} {item.author}
                </span>
                <span className="w-1 h-1 rounded-full bg-white dark:bg-background/30" />
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {item.collection.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>

              {/* Price + CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-orange-500 hover:bg-cta-2 text-white font-semibold gap-2 text-base px-8 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
                  onClick={() => window.open(item.cta_url, "_blank")}
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

                {/* Share button */}
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white dark:bg-background/10 gap-2 transition-all duration-200"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: title,
                        text: shortDesc,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  {language === "fr" ? "Partager" : "Share"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// WHY IT EXISTS — Enhanced with gradient accent
// ============================================================================
function WhySection({ item, language }: { item: LibraryItem; language: string }) {
  const whyText = language === "fr" ? item.why_it_exists_fr : item.why_it_exists_en;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="relative bg-gradient-to-r from-orange-500/5 via-[#F97316]/10 to-orange-500/5 border-y border-orange-500/10 overflow-hidden"
    >
      {/* Subtle decorative element */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 via-[#fb923c] to-orange-500/30" />

      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-semibold mb-6 border border-orange-500/15">
            <Zap className="w-4 h-4" />
            {language === "fr" ? "Pourquoi ce produit existe" : "Why This Product Exists"}
          </div>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium italic">
            "{whyText}"
          </p>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// DESCRIPTION + BENEFITS + SIDEBAR
// ============================================================================
function DetailsSection({ item, language }: { item: LibraryItem; language: string }) {
  const longDesc = language === "fr" ? item.long_desc_fr : item.long_desc_en;
  const benefits = language === "fr" ? item.benefits_fr : item.benefits_en;
  const targetAudience = language === "fr" ? item.target_audience_fr : item.target_audience_en;

  return (
    <section className="container mx-auto px-6 md:px-8 py-12 md:py-16 lg:py-20">
      <div className="grid md:grid-cols-5 gap-12 lg:gap-16">
        {/* Left: Description */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="md:col-span-3"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foundation/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-foundation" />
            </div>
            {language === "fr" ? "Description complète" : "Full Description"}
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed text-base">{longDesc}</p>
          </div>

          {/* Benefits */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-orange-500" />
              </div>
              {language === "fr" ? "Ce que vous allez apprendre" : "What You'll Learn"}
            </h3>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-3"
            >
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  variants={cardVariant}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-background border border-slate-100 hover:border-teal-500/30 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-teal-500/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <span className="text-slate-700 text-sm leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        {/* Right: Sidebar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="md:col-span-2"
        >
          {/* Product Details Card */}
          <Card className="border border-slate-200 shadow-sm sticky top-24 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Card header */}
              <div className="bg-gradient-to-r from-foundation to-[#1a5c5e] p-5">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  {language === "fr" ? "Détails du produit" : "Product Details"}
                </h3>
              </div>

              <div className="p-6 space-y-0">
                {/* Details grid */}
                {[
                  {
                    label: language === "fr" ? "Format" : "Format",
                    value: item.format,
                    icon: FileText,
                  },
                  {
                    label: language === "fr" ? "Langue" : "Language",
                    value: item.language === "BILINGUAL" ? (language === "fr" ? "Bilingue" : "Bilingual") : item.language,
                    icon: Globe,
                  },
                  {
                    label: language === "fr" ? "Niveau" : "Level",
                    value: item.level.join(", "),
                    icon: GraduationCap,
                  },
                  {
                    label: language === "fr" ? "Public" : "Audience",
                    value: item.audience === "coach"
                      ? language === "fr" ? "Coachs" : "Coaches"
                      : item.audience === "learner"
                      ? language === "fr" ? "Apprenants" : "Learners"
                      : language === "fr" ? "Tous" : "Everyone",
                    icon: Users,
                  },
                  {
                    label: language === "fr" ? "Auteur" : "Author",
                    value: item.author,
                    icon: BookMarked,
                  },
                ].map((detail, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0">
                    <span className="text-sm text-slate-500">{detail.label}</span>
                    <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                      <detail.icon className="w-4 h-4 text-slate-400" />
                      {detail.value}
                    </span>
                  </div>
                ))}

                {/* Price */}
                <div className="flex items-center justify-between py-4 border-t border-slate-200 mt-2">
                  <span className="text-sm font-medium text-slate-700">{language === "fr" ? "Prix" : "Price"}</span>
                  <span className="text-2xl font-bold text-foundation">
                    {item.price_type === "paid" && item.price_amount
                      ? `$${item.price_amount.toFixed(2)}`
                      : language === "fr" ? "Gratuit" : "Free"}
                  </span>
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full rounded-full bg-orange-500 hover:bg-cta-2 text-white font-semibold gap-2 mt-4 shadow-md hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
                  onClick={() => window.open(item.cta_url, "_blank")}
                >
                  {item.price_type === "free" ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {language === "fr" ? item.cta_label_fr : item.cta_label_en}
                </Button>

                {/* Available formats */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2.5 font-medium uppercase tracking-wide">
                    {language === "fr" ? "Formats disponibles" : "Available Formats"}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs border-slate-200 rounded-full">
                      <FileText className="w-3 h-3 mr-1" />
                      PDF
                    </Badge>
                    <Badge variant="outline" className="text-xs border-slate-200 rounded-full">
                      <Smartphone className="w-3 h-3 mr-1" />
                      EPUB
                    </Badge>
                  </div>
                </div>

                {/* Target audience */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2.5 flex items-center gap-1.5 font-medium uppercase tracking-wide">
                    <Users className="w-3.5 h-3.5" />
                    {language === "fr" ? "Public cible" : "Target Audience"}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{targetAudience}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// RELATED PRODUCTS — Enhanced with better cards
// ============================================================================
function RelatedProducts({
  item,
  language,
}: {
  item: LibraryItem;
  language: string;
}) {
  const related = getRelatedItems(item.slug);
  const [, navigate] = useLocation();

  if (related.length === 0) return null;

  return (
    <section className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-orange-500" />
          </div>
          {language === "fr" ? "Vous pourriez aussi aimer" : "You Might Also Like"}
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
        >
          {related.map((rel) => {
            const relTitle = language === "fr" ? rel.title_fr : rel.title_en;
            return (
              <motion.div
                key={rel.id}
                variants={cardVariant}
                className="group cursor-pointer"
                onClick={() => navigate(`/library/books/${rel.slug}`)}
              >
                <Card className="overflow-hidden border border-slate-200 hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all duration-500 h-full rounded-2xl">
                  <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                    <img
                      src={rel.cover_image_url}
                      alt={relTitle}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                    />
                  </div>
                  <CardContent className="p-3.5">
                    <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-foundation transition-colors duration-300 leading-snug">
                      {relTitle}
                    </h3>
                    <div className="flex items-center justify-between mt-2.5">
                      <Badge variant="outline" className="text-[9px] border-slate-200 rounded-full">
                        {rel.language === "BILINGUAL" ? "FR/EN" : rel.language}
                      </Badge>
                      {rel.price_type === "paid" && rel.price_amount ? (
                        <span className="text-xs font-bold text-foundation">${rel.price_amount.toFixed(2)}</span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">
                          {language === "fr" ? "Gratuit" : "Free"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Back to library */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-slate-300 hover:border-foundation hover:text-foundation gap-2 transition-all duration-200"
            onClick={() => navigate("/library")}
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "fr" ? "Retour à la bibliothèque" : "Back to Library"}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 404 STATE — Enhanced
// ============================================================================
function BookNotFound({ language }: { language: string }) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shadow-inner">
          <BookOpen className="w-10 h-10 text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {language === "fr" ? "Livre introuvable" : "Book Not Found"}
        </h1>
        <p className="text-slate-500 mb-6 max-w-md leading-relaxed">
          {language === "fr"
            ? "Le livre que vous recherchez n'existe pas ou a été déplacé."
            : "The book you're looking for doesn't exist or has been moved."}
        </p>
        <Button
          size="lg"
          className="rounded-full bg-orange-500 hover:bg-cta-2 text-white gap-2 shadow-md"
          onClick={() => navigate("/library")}
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "fr" ? "Retour à la bibliothèque" : "Back to Library"}
        </Button>
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function BookLandingPage() {
  const { language } = useLanguage();
  const [match, params] = useRoute("/library/books/:slug");

  const item = useMemo(() => {
    if (!match || !params) return null;
    const slug = (params as Record<string, string>).slug;
    if (!slug) return null;
    return LIBRARY_ITEMS.find((i) => i.slug === slug) || null;
  }, [match, params]);

  if (!match || !item) {
    return <BookNotFound language={language} />;
  }

  const title = language === "fr" ? item.title_fr : item.title_en;
  const shortDesc = language === "fr" ? item.short_desc_fr : item.short_desc_en;

  return (
    <>
      <Helmet>
        <title>{title} | RusingAcademy</title>
        <meta name="description" content={shortDesc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={shortDesc} />
        <meta property="og:image" content={item.cover_image_url} />
        <meta property="og:type" content="product" />
      </Helmet>

      <main id="main-content" className="min-h-screen bg-white dark:bg-background">
        {/* Hero */}
        <BookHero item={item} language={language} />

        {/* Why it exists */}
        <WhySection item={item} language={language} />

        {/* Details + Sidebar */}
        <DetailsSection item={item} language={language} />

        {/* Related Products */}
        <RelatedProducts item={item} language={language} />

        {/* Footer */}
        <EcosystemFooter
          lang={language === "fr" ? "fr" : "en"}
          theme="light"
          activeBrand="rusingacademy"
        />
      </main>
    </>
  );
}
