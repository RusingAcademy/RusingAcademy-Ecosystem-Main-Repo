/**
 * BookLandingPage — /library/books/:slug
 * Individual product landing page for each book in the RusingAcademy Library.
 * 
 * Features:
 * - Full-width hero with cover image and glassmorphism info panel
 * - Detailed description, benefits, target audience
 * - "Why this product exists" section
 * - Available formats with download/purchase CTAs
 * - Related products carousel
 * - Breadcrumb navigation
 * - Full bilingual FR/EN support
 * - SEO meta tags
 * 
 * Zero regression: new page, no existing pages modified.
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ============================================================================
// BREADCRUMB
// ============================================================================
function Breadcrumb({ title, language }: { title: string; language: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
      <Link href="/" className="hover:text-white/80 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        {language === "fr" ? "Accueil" : "Home"}
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <Link href="/library" className="hover:text-white/80 transition-colors">
        {language === "fr" ? "Bibliothèque" : "Library"}
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-white/90 font-medium truncate max-w-[200px]">{title}</span>
    </nav>
  );
}

// ============================================================================
// HERO SECTION
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
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D3E] via-[#1a5c5e] to-[#0d2f30]" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <Breadcrumb title={title} language={language} />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-48 md:w-64 lg:w-72 flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="relative group">
              <img
                src={item.cover_image_url}
                alt={title}
                className="w-full rounded-xl shadow-2xl group-hover:shadow-[0_20px_60px_rgba(249,115,22,0.15)] transition-shadow duration-500"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {item.is_new && (
                  <Badge className="bg-[#F97316] text-white border-0 text-xs font-semibold shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Nouveau" : "New"}
                  </Badge>
                )}
                {item.is_featured && (
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Vedette" : "Featured"}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Panel with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {item.format}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {langBadge}
                </Badge>
                {item.level[0] !== "ALL" && (
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    {item.level.join(", ")}
                  </Badge>
                )}
                {item.audience === "coach" && (
                  <Badge className="bg-[#14B8A6]/30 text-[#14B8A6] border-0 text-xs">
                    <UserCheck className="w-3 h-3 mr-1" />
                    {language === "fr" ? "Pour Coachs" : "For Coaches"}
                  </Badge>
                )}
                {item.price_type === "free" && (
                  <Badge className="bg-emerald-500/30 text-emerald-300 border-0 text-xs">
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
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4" />
                  {language === "fr" ? "Par" : "By"} {item.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {item.collection.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>

              {/* Price + CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-[#F97316] hover:bg-[#ea6c10] text-white font-semibold gap-2 text-base px-8"
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
                  className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
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
// WHY IT EXISTS
// ============================================================================
function WhySection({ item, language }: { item: LibraryItem; language: string }) {
  const whyText = language === "fr" ? item.why_it_exists_fr : item.why_it_exists_en;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="bg-gradient-to-r from-[#F97316]/5 via-[#F97316]/10 to-[#F97316]/5 border-y border-[#F97316]/10"
    >
      <div className="container mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 text-[#F97316] text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {language === "fr" ? "Pourquoi ce produit existe" : "Why This Product Exists"}
          </div>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
            "{whyText}"
          </p>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// DESCRIPTION + BENEFITS
// ============================================================================
function DetailsSection({ item, language }: { item: LibraryItem; language: string }) {
  const longDesc = language === "fr" ? item.long_desc_fr : item.long_desc_en;
  const benefits = language === "fr" ? item.benefits_fr : item.benefits_en;
  const targetAudience = language === "fr" ? item.target_audience_fr : item.target_audience_en;

  return (
    <section className="container mx-auto px-6 md:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-5 gap-12">
        {/* Left: Description */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="md:col-span-3"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {language === "fr" ? "Description complète" : "Full Description"}
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed text-base">{longDesc}</p>
          </div>

          {/* Benefits */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
              <Award className="w-6 h-6 text-[#F97316]" />
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
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100 hover:border-[#F97316]/20 hover:shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#14B8A6] mt-0.5 flex-shrink-0" />
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
          <Card className="border border-slate-200 shadow-sm sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-slate-900 text-lg">
                {language === "fr" ? "Détails du produit" : "Product Details"}
              </h3>

              {/* Details grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Format" : "Format"}</span>
                  <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {item.format}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Langue" : "Language"}</span>
                  <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {item.language === "BILINGUAL" ? (language === "fr" ? "Bilingue" : "Bilingual") : item.language}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Niveau" : "Level"}</span>
                  <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    {item.level.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Public" : "Audience"}</span>
                  <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    {item.audience === "coach"
                      ? language === "fr" ? "Coachs" : "Coaches"
                      : item.audience === "learner"
                      ? language === "fr" ? "Apprenants" : "Learners"
                      : language === "fr" ? "Tous" : "Everyone"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Auteur" : "Author"}</span>
                  <span className="text-sm font-medium text-slate-900">{item.author}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">{language === "fr" ? "Prix" : "Price"}</span>
                  <span className="text-lg font-bold text-[#0F3D3E]">
                    {item.price_type === "paid" && item.price_amount
                      ? `$${item.price_amount.toFixed(2)}`
                      : language === "fr" ? "Gratuit" : "Free"}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full rounded-full bg-[#F97316] hover:bg-[#ea6c10] text-white font-semibold gap-2"
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
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2">
                  {language === "fr" ? "Formats disponibles" : "Available Formats"}
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs border-slate-200">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-200">
                    <Smartphone className="w-3 h-3 mr-1" />
                    EPUB
                  </Badge>
                </div>
              </div>

              {/* Target audience */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {language === "fr" ? "Public cible" : "Target Audience"}
                </p>
                <p className="text-sm text-slate-600">{targetAudience}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// RELATED PRODUCTS
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
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          {language === "fr" ? "Vous pourriez aussi aimer" : "You Might Also Like"}
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
                <Card className="overflow-hidden border border-slate-200 hover:border-[#F97316]/40 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={rel.cover_image_url}
                      alt={relTitle}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-[#0F3D3E] transition-colors">
                      {relTitle}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-[9px] border-slate-200">
                        {rel.language === "BILINGUAL" ? "FR/EN" : rel.language}
                      </Badge>
                      {rel.price_type === "paid" && rel.price_amount ? (
                        <span className="text-xs font-bold text-[#0F3D3E]">${rel.price_amount.toFixed(2)}</span>
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
            className="rounded-full border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white gap-2"
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
// 404 STATE
// ============================================================================
function BookNotFound({ language }: { language: string }) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {language === "fr" ? "Livre introuvable" : "Book Not Found"}
        </h1>
        <p className="text-slate-500 mb-6 max-w-md">
          {language === "fr"
            ? "Le livre que vous recherchez n'existe pas ou a été déplacé."
            : "The book you're looking for doesn't exist or has been moved."}
        </p>
        <Button
          size="lg"
          className="rounded-full bg-[#F97316] hover:bg-[#ea6c10] text-white gap-2"
          onClick={() => navigate("/library")}
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "fr" ? "Retour à la bibliothèque" : "Back to Library"}
        </Button>
      </div>
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

      <main id="main-content" className="min-h-screen bg-white">
        {/* Hero */}
        <BookHero item={item} language={language} />

        {/* Why it exists */}
        <WhySection item={item} language={language} />

        {/* Details + Sidebar */}
        <DetailsSection item={item} language={language} />

        {/* Related Products */}
        <RelatedProducts item={item} language={language} />
      </main>
    </>
  );
}
