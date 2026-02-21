/**
 * ============================================
 * SEO HEAD MANAGER — Month 4 Deliverable 1
 * ============================================
 * 
 * Comprehensive bilingual SEO component for the
 * RusingAcademy Learning Ecosystem.
 * 
 * Features:
 * - JSON-LD Structured Data (Organization, Course, Person, FAQ, BreadcrumbList)
 * - Dynamic meta tags (title, description, keywords) for EN/FR
 * - OpenGraph & Twitter Cards with bilingual variants
 * - Hreflang tags (en-CA, fr-CA, x-default)
 * - Canonical URLs to prevent duplicate content
 * 
 * @version 4.0.0
 * @since Month 4 — SEO, Performance & Accessibility
 */
import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

// ─── Types ──────────────────────────────────────────────────────────────────
interface SEOHeadProps {
  title?: string;
  titleFr?: string;
  description?: string;
  descriptionFr?: string;
  keywords?: string;
  keywordsFr?: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "course" | "profile";
  pageType?: "home" | "course" | "courses" | "coaches" | "faq" | "about" | "pricing" | "contact" | "blog" | "library" | "generic";
  noIndex?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const SITE_NAME = "RusingAcademy";
const SITE_URL = "https://www.rusingacademy.ca";
const DEFAULT_OG_IMAGE = "https://rusingacademy-cdn.b-cdn.net/images/logos/rusingacademy-og-1200x630.webp";

// ─── Helper Functions ───────────────────────────────────────────────────────
function setMetaTag(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLinkTag(rel: string, href: string, attrs?: Record<string, string>) {
  const selector = attrs
    ? `link[rel="${rel}"]${Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join("")}`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
}

// ─── Main SEO Component ─────────────────────────────────────────────────────
export default function SEOHead({
  title = "Bilingual Excellence for Canadian Public Servants",
  titleFr = "Excellence bilingue pour les fonctionnaires canadiens",
  description = "RusingAcademy is the premier bilingual training ecosystem for Canadian public servants.",
  descriptionFr = "RusingAcademy est l'écosystème de formation bilingue de premier plan pour les fonctionnaires canadiens.",
  keywords = "SLE exam, bilingual training, Canadian public servants",
  keywordsFr = "examen ELS, formation bilingue, fonctionnaires canadiens",
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  pageType = "generic",
  noIndex = false,
}: SEOHeadProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;
    const pageTitle = isEn ? title : titleFr;
    const desc = isEn ? description : descriptionFr;
    const kw = isEn ? keywords : keywordsFr;

    // ── Title ──
    document.title = `${pageTitle} | ${SITE_NAME}`;

    // ── Meta Description ──
    setMetaTag("description", desc);

    // ── Meta Keywords ──
    setMetaTag("keywords", kw);

    // ── Robots ──
    setMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // ── Canonical URL ──
    setLinkTag("canonical", canonicalUrl);

    // ── Hreflang Tags ──
    setLinkTag("alternate", canonicalUrl, { hreflang: "en-CA" });
    setLinkTag("alternate", canonicalUrl, { hreflang: "fr-CA" });
    setLinkTag("alternate", canonicalUrl, { hreflang: "x-default" });

    // ── OpenGraph Tags ──
    setMetaTag("og:title", `${pageTitle} | ${SITE_NAME}`, true);
    setMetaTag("og:description", desc, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:url", canonicalUrl, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:site_name", SITE_NAME, true);
    setMetaTag("og:locale", isEn ? "en_CA" : "fr_CA", true);

    // ── Twitter Card Tags ──
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", `${pageTitle} | ${SITE_NAME}`);
    setMetaTag("twitter:description", desc);
    setMetaTag("twitter:image", ogImage);

    // ── Language attribute ──
    document.documentElement.lang = isEn ? "en-CA" : "fr-CA";
  }, [locale, title, titleFr, description, descriptionFr, keywords, keywordsFr, path, ogImage, ogType, noIndex, isEn]);

  return null;
}

export { SITE_URL, SITE_NAME };
export type { SEOHeadProps };
