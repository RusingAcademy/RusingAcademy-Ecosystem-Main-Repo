/**
 * ============================================
 * LANGUAGE SWITCHER COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Premium bilingual language switcher for all pages.
 * Supports multiple variants (toggle, dropdown, pills).
 * Persists preference via localStorage.
 * Updates html lang attribute.
 */
import React, { useCallback } from "react";
import { useLocale, type Locale } from "@/i18n/LocaleContext";

/* ── Types ── */
type SwitcherVariant = "toggle" | "dropdown" | "pills" | "minimal";
type SwitcherSize = "sm" | "md" | "lg";

interface LanguageSwitcherProps {
  variant?: SwitcherVariant;
  size?: SwitcherSize;
  showFlag?: boolean;
  showFullName?: boolean;
  className?: string;
}

/* ── Language Data ── */
const LANGUAGES: Record<Locale, { code: string; name: string; shortName: string; flag: string }> = {
  en: { code: "en", name: "English", shortName: "EN", flag: "🇬🇧" },
  fr: { code: "fr", name: "Français", shortName: "FR", flag: "🇫🇷" },
};

/* ── Size Mappings ── */
const sizeClasses: Record<SwitcherSize, { text: string; padding: string; gap: string }> = {
  sm: { text: "text-xs", padding: "px-2 py-1", gap: "gap-1" },
  md: { text: "text-sm", padding: "px-3 py-1.5", gap: "gap-1.5" },
  lg: { text: "text-base", padding: "px-4 py-2", gap: "gap-2" },
};

/* ── LanguageSwitcher Component ── */
export function LanguageSwitcher({
  variant = "toggle",
  size = "md",
  showFlag = false,
  showFullName = false,
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, toggleLocale } = useLocale();
  const sizes = sizeClasses[size];

  const getLabel = useCallback(
    (lang: Locale) => {
      const data = LANGUAGES[lang];
      const parts: string[] = [];
      if (showFlag) parts.push(data.flag);
      parts.push(showFullName ? data.name : data.shortName);
      return parts.join(" ");
    },
    [showFlag, showFullName]
  );

  // Minimal: just "EN | FR" text toggle
  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLocale}
        className={`${sizes.text} font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] dark:text-[var(--dark-text-secondary)] dark:hover:text-[var(--dark-text-primary)] ${className}`}
        aria-label={locale === "en" ? "Switch to French" : "Passer à l'anglais"}
      >
        <span className={locale === "en" ? "font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]" : ""}>EN</span>
        <span className="mx-1 text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">|</span>
        <span className={locale === "fr" ? "font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]" : ""}>FR</span>
      </button>
    );
  }

  // Toggle: animated sliding toggle
  if (variant === "toggle") {
    return (
      <div
        className={`relative inline-flex rounded-xl border border-[var(--border-color-light)] bg-[var(--section-bg-2)] p-0.5 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-section-bg-2)] ${className}`}
        role="radiogroup"
        aria-label="Language selection"
      >
        {(["en", "fr"] as Locale[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            className={`relative z-10 rounded-lg ${sizes.padding} ${sizes.text} ${sizes.gap} inline-flex items-center font-medium transition-all ${
              locale === lang
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-elevated)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            role="radio"
            aria-checked={locale === lang}
            aria-label={LANGUAGES[lang].name}
          >
            {getLabel(lang)}
          </button>
        ))}
      </div>
    );
  }

  // Pills: separate pill buttons
  if (variant === "pills") {
    return (
      <div className={`inline-flex ${sizes.gap} ${className}`} role="radiogroup" aria-label="Language selection">
        {(["en", "fr"] as Locale[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            className={`rounded-full ${sizes.padding} ${sizes.text} font-medium transition-all ${
              locale === lang
                ? "bg-[var(--brand-foundation)] text-white shadow-sm dark:bg-[var(--dark-brand-foundation)]"
                : "border border-[var(--border-color-light)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:bg-[var(--section-bg-2)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)]"
            }`}
            role="radio"
            aria-checked={locale === lang}
            aria-label={LANGUAGES[lang].name}
          >
            {getLabel(lang)}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown: select-style
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className={`rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] ${sizes.padding} ${sizes.text} font-medium text-[var(--text-primary)] transition-colors focus:border-[var(--brand-foundation)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-foundation)]/20 dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)] ${className}`}
      aria-label="Language selection"
    >
      {(["en", "fr"] as Locale[]).map((lang) => (
        <option key={lang} value={lang}>
          {getLabel(lang)}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
