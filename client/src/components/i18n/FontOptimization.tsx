/**
 * ============================================
 * FONT LOADING OPTIMIZATION
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Optimized font loading for French diacritics
 * (é, è, ê, ë, ç, à, ù, î, ô, û, ÿ, æ, œ).
 * Ensures proper rendering across all browsers.
 * Uses font-display: swap for performance.
 */
import React, { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Font Preload Configuration ── */
export interface FontConfig {
  family: string;
  weights: number[];
  subsets: string[];
  display: "swap" | "block" | "fallback" | "optional" | "auto";
}

export const FONT_CONFIGS: FontConfig[] = [
  {
    family: "Inter",
    weights: [400, 500, 600, 700],
    subsets: ["latin", "latin-ext"],
    display: "swap",
  },
  {
    family: "Merriweather",
    weights: [400, 700, 900],
    subsets: ["latin", "latin-ext"],
    display: "swap",
  },
];

/* ── French Diacritics Test String ── */
export const FRENCH_DIACRITICS_TEST =
  "àâäéèêëïîôùûüÿçœæ ÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ — L'éducation bilingue d'excellence";

/* ── Font Preloader Component ── */
interface FontPreloaderProps {
  fonts?: FontConfig[];
}

export function FontPreloader({ fonts = FONT_CONFIGS }: FontPreloaderProps) {
  const { locale } = useLocale();

  useEffect(() => {
    // Preload latin-ext subset for French diacritics
    if (locale === "fr" && document.fonts) {
      fonts.forEach((font) => {
        font.weights.forEach((weight) => {
          // Trigger font load for French characters
          document.fonts.load(`${weight} 1rem "${font.family}"`, FRENCH_DIACRITICS_TEST).catch(() => {
            // Silently handle font load failures
          });
        });
      });
    }
  }, [locale, fonts]);

  return (
    <>
      {/* Preload hints for critical fonts */}
      {fonts.map((font) =>
        font.weights.slice(0, 2).map((weight) => (
          <link
            key={`${font.family}-${weight}`}
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href={`https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v${
              font.family === "Inter" ? "18" : "30"
            }/${font.family.toLowerCase()}-latin-ext-${weight}-normal.woff2`}
          />
        ))
      )}
    </>
  );
}

/* ── Text Directionality Component ── */
interface BilingualTextProps {
  en: string;
  fr: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function BilingualText({ en, fr, as: Tag = "span", className = "" }: BilingualTextProps) {
  const { locale } = useLocale();
  const text = locale === "fr" ? fr : en;

  return (
    <Tag className={className} lang={locale} dir="ltr">
      {text}
    </Tag>
  );
}

/* ── Line Breaking Optimization ── */
export function getWordBreakStyle(locale: string): React.CSSProperties {
  return {
    wordBreak: "normal",
    overflowWrap: "break-word",
    hyphens: locale === "fr" ? "auto" : "manual",
    WebkitHyphens: locale === "fr" ? "auto" : "manual",
  };
}

/* ── useFontOptimization Hook ── */
export function useFontOptimization() {
  const { locale } = useLocale();

  useEffect(() => {
    // Set lang attribute for proper hyphenation
    document.documentElement.lang = locale === "fr" ? "fr-CA" : "en-CA";

    // Add CSS custom property for text expansion factor
    // French text is typically 20-30% longer than English
    document.documentElement.style.setProperty(
      "--text-expansion-factor",
      locale === "fr" ? "1.25" : "1"
    );
  }, [locale]);

  return {
    locale,
    wordBreakStyle: getWordBreakStyle(locale),
    textExpansionFactor: locale === "fr" ? 1.25 : 1,
    isRTL: false, // Both EN and FR are LTR
  };
}

export default FontPreloader;
