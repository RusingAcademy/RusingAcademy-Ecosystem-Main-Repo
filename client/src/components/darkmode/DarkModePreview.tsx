/**
 * ============================================
 * DARK MODE PREVIEW & TESTING COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Interactive preview component for testing all
 * UI elements in both light and dark modes
 * side-by-side. Ensures premium aesthetic parity.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";

/* ── Types ── */
interface ColorSwatch {
  name: string;
  lightVar: string;
  darkVar: string;
  lightValue: string;
  darkValue: string;
}

/* ── Dark Mode Color Palette ── */
const DARK_MODE_PALETTE: ColorSwatch[] = [
  { name: "Background Base", lightVar: "--bg-base", darkVar: "--dark-bg-base", lightValue: "#FFFFFF", darkValue: "#0D1B1A" },
  { name: "Background Surface", lightVar: "--bg-surface", darkVar: "--dark-bg-surface", lightValue: "#F7F8F7", darkValue: "#111F1E" },
  { name: "Background Elevated", lightVar: "--bg-elevated", darkVar: "--dark-bg-elevated", lightValue: "#FFFFFF", darkValue: "#162726" },
  { name: "Text Primary", lightVar: "--text-primary", darkVar: "--dark-text-primary", lightValue: "#0B1220", darkValue: "#E8EDE9" },
  { name: "Text Secondary", lightVar: "--text-secondary", darkVar: "--dark-text-secondary", lightValue: "#374151", darkValue: "#B0BDB5" },
  { name: "Text Muted", lightVar: "--text-muted", darkVar: "--dark-text-muted", lightValue: "#6B7280", darkValue: "#7A8D82" },
  { name: "Brand Foundation", lightVar: "--brand-foundation", darkVar: "--dark-brand-foundation", lightValue: "#0F3D3E", darkValue: "#1A7A7B" },
  { name: "Brand CTA", lightVar: "--brand-cta", darkVar: "--dark-brand-cta", lightValue: "#C65A1E", darkValue: "#E07B3D" },
  { name: "Section BG 1", lightVar: "--section-bg-1", darkVar: "--dark-section-bg-1", lightValue: "#FBF9F7", darkValue: "#0D1B1A" },
  { name: "Section BG 2", lightVar: "--section-bg-2", darkVar: "--dark-section-bg-2", lightValue: "#E8EBE7", darkValue: "#111F1E" },
  { name: "Section BG 3", lightVar: "--section-bg-3", darkVar: "--dark-section-bg-3", lightValue: "#EFF9F4", darkValue: "#0F2E2A" },
  { name: "Glass BG Light", lightVar: "--glass-bg-light", darkVar: "--dark-glass-bg-light", lightValue: "rgba(255,255,255,0.75)", darkValue: "rgba(13,27,26,0.65)" },
];

/* ── Component Preview Items ── */
interface PreviewItem {
  name: string;
  nameFr: string;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  { name: "Buttons", nameFr: "Boutons" },
  { name: "Cards", nameFr: "Cartes" },
  { name: "Forms", nameFr: "Formulaires" },
  { name: "Typography", nameFr: "Typographie" },
  { name: "Glassmorphism", nameFr: "Glassmorphisme" },
  { name: "Navigation", nameFr: "Navigation" },
  { name: "Badges & Tags", nameFr: "Badges et étiquettes" },
  { name: "Alerts", nameFr: "Alertes" },
];

/* ── DarkModePreview Component ── */
interface DarkModePreviewProps {
  className?: string;
}

export function DarkModePreview({ className = "" }: DarkModePreviewProps) {
  const { locale } = useLocale();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"palette" | "components" | "glass">("palette");

  const labels = {
    en: {
      title: "Dark Mode Preview",
      subtitle: "Test and compare light and dark mode aesthetics",
      palette: "Color Palette",
      components: "Components",
      glass: "Glassmorphism",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      currentMode: "Current Mode",
      contrastRatio: "Contrast Ratio",
      wcagAA: "WCAG AA",
      pass: "Pass",
      fail: "Fail",
      tokenName: "Token Name",
      lightValue: "Light Value",
      darkValue: "Dark Value",
      sampleText: "The quick brown fox jumps over the lazy dog. Le renard brun rapide saute par-dessus le chien paresseux.",
      primaryBtn: "Primary Button",
      secondaryBtn: "Secondary Button",
      ctaBtn: "Call to Action",
      sampleCard: "Sample Card",
      sampleCardDesc: "This card demonstrates the premium aesthetic in both light and dark modes with glassmorphism effects.",
      sampleCardDescFr: "Cette carte démontre l'esthétique premium dans les modes clair et sombre avec des effets de glassmorphisme.",
    },
    fr: {
      title: "Aperçu du mode sombre",
      subtitle: "Tester et comparer l'esthétique des modes clair et sombre",
      palette: "Palette de couleurs",
      components: "Composants",
      glass: "Glassmorphisme",
      lightMode: "Mode clair",
      darkMode: "Mode sombre",
      currentMode: "Mode actuel",
      contrastRatio: "Ratio de contraste",
      wcagAA: "WCAG AA",
      pass: "Réussi",
      fail: "Échoué",
      tokenName: "Nom du jeton",
      lightValue: "Valeur claire",
      darkValue: "Valeur sombre",
      sampleText: "Le renard brun rapide saute par-dessus le chien paresseux. The quick brown fox jumps over the lazy dog.",
      primaryBtn: "Bouton principal",
      secondaryBtn: "Bouton secondaire",
      ctaBtn: "Appel à l'action",
      sampleCard: "Carte exemple",
      sampleCardDesc: "This card demonstrates the premium aesthetic in both light and dark modes with glassmorphism effects.",
      sampleCardDescFr: "Cette carte démontre l'esthétique premium dans les modes clair et sombre avec des effets de glassmorphisme.",
    },
  };
  const t = labels[locale];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              {t.subtitle}
            </p>
          </div>
          <div className={`rounded-full px-4 py-1.5 text-sm font-medium ${isDark ? "bg-[var(--dark-brand-foundation-soft)] text-[var(--dark-brand-foundation-2)]" : "bg-[var(--brand-foundation-soft)] text-[var(--brand-foundation)]"}`}>
            {t.currentMode}: {isDark ? t.darkMode : t.lightMode}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[var(--section-bg-2)] p-1 dark:bg-[var(--dark-section-bg-2)]">
        {(["palette", "components", "glass"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {t[tab]}
          </button>
        ))}
      </div>

      {/* Palette Tab */}
      {activeTab === "palette" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.08)]">
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.tokenName}</th>
                <th className="px-3 py-2 text-center font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.lightValue}</th>
                <th className="px-3 py-2 text-center font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.darkValue}</th>
              </tr>
            </thead>
            <tbody>
              {DARK_MODE_PALETTE.map((swatch) => (
                <tr key={swatch.name} className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.05)]">
                  <td className="px-3 py-2 font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                    {swatch.name}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="h-6 w-6 rounded border border-gray-200"
                        style={{ backgroundColor: swatch.lightValue }}
                        aria-label={`Light: ${swatch.lightValue}`}
                      />
                      <code className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                        {swatch.lightValue}
                      </code>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="h-6 w-6 rounded border border-gray-600"
                        style={{ backgroundColor: swatch.darkValue }}
                        aria-label={`Dark: ${swatch.darkValue}`}
                      />
                      <code className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                        {swatch.darkValue}
                      </code>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Components Tab */}
      {activeTab === "components" && (
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              {locale === "fr" ? "Boutons" : "Buttons"}
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-[var(--brand-foundation)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-foundation-2)] dark:bg-[var(--dark-brand-foundation)] dark:hover:bg-[var(--dark-brand-foundation-2)]">
                {t.primaryBtn}
              </button>
              <button className="rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--section-bg-2)] dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)] dark:hover:bg-[var(--dark-section-bg-2)]">
                {t.secondaryBtn}
              </button>
              <button className="rounded-lg bg-[var(--brand-cta)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-cta-2)] dark:bg-[var(--dark-brand-cta)] dark:hover:bg-[var(--dark-brand-cta-2)]">
                {t.ctaBtn}
              </button>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              {locale === "fr" ? "Typographie" : "Typography"}
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                Heading Text / Texte d'en-tête
              </p>
              <p className="text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                {t.sampleText}
              </p>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                Muted text / Texte atténué — éàùçêë
              </p>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              {locale === "fr" ? "Cartes" : "Cards"}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 shadow-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-card)]">
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {t.sampleCard}
                </h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  {locale === "fr" ? t.sampleCardDescFr : t.sampleCardDesc}
                </p>
              </div>
              <div className="glass-card-premium rounded-xl p-4">
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  Glass Card
                </h4>
                <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  Premium glassmorphism effect / Effet glassmorphisme premium
                </p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              {locale === "fr" ? "Alertes" : "Alerts"}
            </h3>
            <div className="space-y-2">
              {[
                { type: "success", bg: "bg-[var(--success-soft)] dark:bg-[var(--dark-success-soft)]", text: "text-[var(--success)] dark:text-[var(--dark-success)]", msg: "Success message / Message de succès" },
                { type: "warning", bg: "bg-[var(--warning-soft)] dark:bg-[var(--dark-warning-soft)]", text: "text-[var(--warning)] dark:text-[var(--dark-warning)]", msg: "Warning message / Message d'avertissement" },
                { type: "danger", bg: "bg-[var(--danger-soft)] dark:bg-[var(--dark-danger-soft)]", text: "text-[var(--danger)] dark:text-[var(--dark-danger)]", msg: "Error message / Message d'erreur" },
                { type: "info", bg: "bg-[var(--info-soft)] dark:bg-[var(--dark-info-soft)]", text: "text-[var(--info)] dark:text-[var(--dark-info)]", msg: "Info message / Message d'information" },
              ].map((alert) => (
                <div key={alert.type} className={`rounded-lg ${alert.bg} px-4 py-2.5`}>
                  <span className={`text-sm font-medium ${alert.text}`}>{alert.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphism Tab */}
      {activeTab === "glass" && (
        <div className="space-y-6">
          <div
            className="relative overflow-hidden rounded-2xl p-8"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #0F2E2A 0%, #162726 50%, #0D1B1A 100%)"
                : "linear-gradient(135deg, #D1EBDB 0%, #959D90 50%, #3C5759 100%)",
            }}
          >
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--brand-foundation)] opacity-20 blur-3xl dark:bg-[var(--dark-brand-foundation)] dark:opacity-15" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[var(--brand-cta)] opacity-15 blur-3xl dark:bg-[var(--dark-brand-cta)] dark:opacity-10" />

            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Glass Light */}
              <div className="glass-light rounded-xl p-4">
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  Glass Light
                </h4>
                <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  Subtle frosted effect
                </p>
              </div>
              {/* Glass Medium */}
              <div className="glass-medium rounded-xl p-4">
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  Glass Medium
                </h4>
                <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  Standard frosted effect
                </p>
              </div>
              {/* Glass Heavy */}
              <div className="glass-heavy rounded-xl p-4">
                <h4 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  Glass Heavy
                </h4>
                <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  Dense frosted effect
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DarkModePreview;
