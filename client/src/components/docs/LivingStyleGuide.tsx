/**
 * ============================================
 * LIVING STYLE GUIDE COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Interactive documentation of design tokens,
 * components, and patterns used in the
 * RusingAcademy ecosystem.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";

/* ── Types ── */
interface ColorToken {
  name: string;
  variable: string;
  value: string;
  darkValue?: string;
  usage: string;
}

interface TypographyToken {
  name: string;
  variable: string;
  sampleText: string;
  specs: string;
}

interface SpacingToken {
  name: string;
  variable: string;
  value: string;
}

/* ── Color Tokens Data ── */
const COLOR_TOKENS: { category: string; categoryFr: string; tokens: ColorToken[] }[] = [
  {
    category: "Brand Foundation",
    categoryFr: "Fondation de la marque",
    tokens: [
      { name: "Foundation", variable: "--brand-foundation", value: "#0F3D3E", darkValue: "#1A7A7B", usage: "Primary brand color, headers, links" },
      { name: "Foundation 2", variable: "--brand-foundation-2", value: "#145A5B", darkValue: "#22A0A1", usage: "Hover states, active states" },
      { name: "Foundation Soft", variable: "--brand-foundation-soft", value: "#E7F2F2", darkValue: "rgba(26,122,123,0.15)", usage: "Light backgrounds, badges" },
    ],
  },
  {
    category: "CTA / Accent",
    categoryFr: "CTA / Accent",
    tokens: [
      { name: "CTA Copper", variable: "--brand-cta", value: "#C65A1E", darkValue: "#E07B3D", usage: "Call-to-action buttons, highlights" },
      { name: "CTA Copper 2", variable: "--brand-cta-2", value: "#E06B2D", darkValue: "#F09050", usage: "CTA hover states" },
      { name: "CTA Soft", variable: "--brand-cta-soft", value: "#FFF1E8", darkValue: "rgba(224,123,61,0.15)", usage: "CTA backgrounds" },
    ],
  },
  {
    category: "HAZY Palette",
    categoryFr: "Palette HAZY",
    tokens: [
      { name: "Sage Primary", variable: "--sage-primary", value: "#959D90", darkValue: "#3A4A3E", usage: "Section backgrounds, borders" },
      { name: "Mint Primary", variable: "--mint-primary", value: "#D1EBDB", darkValue: "#1A4A3D", usage: "Fresh accent, highlights" },
      { name: "Cream Primary", variable: "--cream-primary", value: "#EDE8E0", darkValue: "#2A2520", usage: "Warm backgrounds" },
      { name: "Teal Accent", variable: "--teal-accent", value: "#3C5759", darkValue: "#5A8587", usage: "Professional accent" },
      { name: "Slate Dark", variable: "--slate-dark", value: "#192524", darkValue: "#C8D5D0", usage: "Deep backgrounds, text" },
    ],
  },
  {
    category: "Semantic States",
    categoryFr: "États sémantiques",
    tokens: [
      { name: "Success", variable: "--success", value: "#059669", darkValue: "#34D399", usage: "Success messages, positive states" },
      { name: "Danger", variable: "--danger", value: "#DC2626", darkValue: "#F87171", usage: "Error messages, destructive actions" },
      { name: "Warning", variable: "--warning", value: "#D97706", darkValue: "#FBBF24", usage: "Warning messages, caution states" },
      { name: "Info", variable: "--info", value: "#2563EB", darkValue: "#60A5FA", usage: "Informational messages" },
    ],
  },
];

/* ── Typography Tokens ── */
const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  { name: "Display / H1", variable: "--font-display", sampleText: "RusingÂcademy — Excellence bilingue", specs: "Merriweather, 3rem (48px), Bold 700" },
  { name: "Heading / H2", variable: "--font-display", sampleText: "Coaching personnalisé pour la réussite", specs: "Merriweather, 2.25rem (36px), Bold 700" },
  { name: "Subheading / H3", variable: "--font-ui", sampleText: "Préparation aux examens SLE", specs: "Inter, 1.5rem (24px), Semibold 600" },
  { name: "Body", variable: "--font-ui", sampleText: "Notre approche combine pédagogie éprouvée et technologie innovante pour vous préparer efficacement.", specs: "Inter, 1rem (16px), Regular 400" },
  { name: "Small / Caption", variable: "--font-ui", sampleText: "Dernière mise à jour : 18 février 2026", specs: "Inter, 0.875rem (14px), Regular 400" },
  { name: "Overline", variable: "--font-ui", sampleText: "FORMATION BILINGUE", specs: "Inter, 0.75rem (12px), Semibold 600, Uppercase, Tracking wider" },
];

/* ── Spacing Tokens ── */
const SPACING_TOKENS: SpacingToken[] = [
  { name: "space-1", variable: "--space-1", value: "0.25rem (4px)" },
  { name: "space-2", variable: "--space-2", value: "0.5rem (8px)" },
  { name: "space-3", variable: "--space-3", value: "0.75rem (12px)" },
  { name: "space-4", variable: "--space-4", value: "1rem (16px)" },
  { name: "space-6", variable: "--space-6", value: "1.5rem (24px)" },
  { name: "space-8", variable: "--space-8", value: "2rem (32px)" },
  { name: "space-12", variable: "--space-12", value: "3rem (48px)" },
  { name: "space-16", variable: "--space-16", value: "4rem (64px)" },
  { name: "space-24", variable: "--space-24", value: "6rem (96px)" },
];

/* ── LivingStyleGuide Component ── */
interface LivingStyleGuideProps {
  className?: string;
}

export function LivingStyleGuide({ className = "" }: LivingStyleGuideProps) {
  const { locale } = useLocale();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<"colors" | "typography" | "spacing" | "glass" | "radius" | "shadows">("colors");

  const labels = {
    en: {
      title: "Living Style Guide",
      subtitle: "Interactive documentation of the RusingÂcademy design system",
      colors: "Colors",
      typography: "Typography",
      spacing: "Spacing",
      glass: "Glassmorphism",
      radius: "Border Radius",
      shadows: "Shadows",
      token: "Token",
      value: "Value",
      darkValue: "Dark Value",
      usage: "Usage",
      preview: "Preview",
      lightMode: "Light",
      darkMode: "Dark",
    },
    fr: {
      title: "Guide de style interactif",
      subtitle: "Documentation interactive du système de design RusingÂcademy",
      colors: "Couleurs",
      typography: "Typographie",
      spacing: "Espacement",
      glass: "Glassmorphisme",
      radius: "Rayons de bordure",
      shadows: "Ombres",
      token: "Jeton",
      value: "Valeur",
      darkValue: "Valeur sombre",
      usage: "Utilisation",
      preview: "Aperçu",
      lightMode: "Clair",
      darkMode: "Sombre",
    },
  };
  const t = labels[locale];

  const sections = [
    { id: "colors" as const, label: t.colors },
    { id: "typography" as const, label: t.typography },
    { id: "spacing" as const, label: t.spacing },
    { id: "glass" as const, label: t.glass },
    { id: "radius" as const, label: t.radius },
    { id: "shadows" as const, label: t.shadows },
  ];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
          {t.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
          {t.subtitle}
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-[var(--section-bg-2)] p-1 dark:bg-[var(--dark-section-bg-2)]">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeSection === sec.id
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            aria-selected={activeSection === sec.id}
            role="tab"
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Colors Section */}
      {activeSection === "colors" && (
        <div className="space-y-8">
          {COLOR_TOKENS.map((group) => (
            <div key={group.category}>
              <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {locale === "fr" ? group.categoryFr : group.category}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.tokens.map((token) => (
                  <div
                    key={token.variable}
                    className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-3 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: isDark && token.darkValue ? token.darkValue : token.value }}
                      />
                      <div>
                        <div className="font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                          {token.name}
                        </div>
                        <code className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                          {token.variable}
                        </code>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="rounded bg-[var(--section-bg-2)] px-1.5 py-0.5 font-mono dark:bg-[var(--dark-section-bg-2)]">
                        {token.value}
                      </span>
                      {token.darkValue && (
                        <span className="rounded bg-[var(--section-bg-2)] px-1.5 py-0.5 font-mono dark:bg-[var(--dark-section-bg-2)]">
                          {token.darkValue}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                      {token.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Typography Section */}
      {activeSection === "typography" && (
        <div className="space-y-4">
          {TYPOGRAPHY_TOKENS.map((token) => (
            <div
              key={token.name}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                  {token.name}
                </span>
                <code className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                  {token.specs}
                </code>
              </div>
              <p
                className="text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                style={{
                  fontFamily: token.variable === "--font-display" ? "var(--font-display)" : "var(--font-ui)",
                  fontSize: token.name.includes("Display") ? "2rem" : token.name.includes("Heading") ? "1.5rem" : token.name.includes("Sub") ? "1.25rem" : token.name.includes("Small") ? "0.875rem" : token.name.includes("Overline") ? "0.75rem" : "1rem",
                  fontWeight: token.name.includes("Display") || token.name.includes("Heading") ? 700 : token.name.includes("Sub") || token.name.includes("Overline") ? 600 : 400,
                  textTransform: token.name.includes("Overline") ? "uppercase" : undefined,
                  letterSpacing: token.name.includes("Overline") ? "0.05em" : undefined,
                }}
              >
                {token.sampleText}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Spacing Section */}
      {activeSection === "spacing" && (
        <div className="space-y-2">
          {SPACING_TOKENS.map((token) => (
            <div
              key={token.name}
              className="flex items-center gap-4 rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] p-3 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <code className="w-24 shrink-0 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {token.variable}
              </code>
              <div
                className="h-4 rounded bg-[var(--brand-foundation)] dark:bg-[var(--dark-brand-foundation)]"
                style={{ width: token.value.split("(")[0].trim() }}
              />
              <span className="text-xs text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                {token.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Glassmorphism Section */}
      {activeSection === "glass" && (
        <div
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0F2E2A 0%, #162726 50%, #0D1B1A 100%)"
              : "linear-gradient(135deg, #D1EBDB 0%, #959D90 50%, #3C5759 100%)",
          }}
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--brand-foundation)] opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[var(--brand-cta)] opacity-15 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Glass Light", cls: "glass-light" },
              { name: "Glass Medium", cls: "glass-medium" },
              { name: "Glass Heavy", cls: "glass-heavy" },
              { name: "Glass Dark", cls: "glass-dark" },
            ].map((glass) => (
              <div key={glass.name} className={`${glass.cls} rounded-xl p-4`}>
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {glass.name}
                </h4>
                <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  .{glass.cls}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Border Radius Section */}
      {activeSection === "radius" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {[
            { name: "none", value: "0" },
            { name: "sm", value: "0.25rem" },
            { name: "md", value: "0.375rem" },
            { name: "lg", value: "0.5rem" },
            { name: "xl", value: "0.75rem" },
            { name: "2xl", value: "1rem" },
            { name: "3xl", value: "1.5rem" },
            { name: "full", value: "9999px" },
          ].map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="mx-auto mb-2 h-16 w-16 border-2 border-[var(--brand-foundation)] bg-[var(--brand-foundation-soft)] dark:border-[var(--dark-brand-foundation)] dark:bg-[var(--dark-brand-foundation-soft)]"
                style={{ borderRadius: r.value }}
              />
              <code className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {r.name}
              </code>
              <div className="text-[10px] text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {r.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shadows Section */}
      {activeSection === "shadows" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "shadow-xs", variable: "--shadow-xs" },
            { name: "shadow-sm", variable: "--shadow-sm" },
            { name: "shadow-md", variable: "--shadow-md" },
            { name: "shadow-lg", variable: "--shadow-lg" },
            { name: "shadow-xl", variable: "--shadow-xl" },
            { name: "shadow-2xl", variable: "--shadow-2xl" },
          ].map((shadow) => (
            <div
              key={shadow.name}
              className="rounded-xl bg-[var(--bg-base)] p-6 dark:bg-[var(--dark-bg-card)]"
              style={{ boxShadow: `var(${shadow.variable})` }}
            >
              <code className="text-sm font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {shadow.name}
              </code>
              <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {shadow.variable}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default LivingStyleGuide;
