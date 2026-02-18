/**
 * ============================================
 * COMPONENT SHOWCASE PAGE
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Interactive showcase of all ecosystem components
 * with live previews, code snippets, and props docs.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
interface ShowcaseComponent {
  id: string;
  name: string;
  nameFr: string;
  category: string;
  categoryFr: string;
  description: string;
  descriptionFr: string;
  status: "stable" | "beta" | "experimental";
  props: { name: string; type: string; required: boolean; description: string }[];
}

/* ── Component Registry ── */
const COMPONENT_REGISTRY: ShowcaseComponent[] = [
  {
    id: "dark-mode-toggle",
    name: "DarkModeToggle",
    nameFr: "Bascule mode sombre",
    category: "Theme",
    categoryFr: "Thème",
    description: "Premium animated toggle for switching between light, dark, and system theme modes.",
    descriptionFr: "Bascule animée premium pour alterner entre les modes clair, sombre et système.",
    status: "stable",
    props: [
      { name: "variant", type: "'icon' | 'switch' | 'dropdown'", required: false, description: "Visual variant of the toggle" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, description: "Size of the toggle" },
      { name: "showLabel", type: "boolean", required: false, description: "Show text label alongside icon" },
    ],
  },
  {
    id: "language-switcher",
    name: "LanguageSwitcher",
    nameFr: "Sélecteur de langue",
    category: "i18n",
    categoryFr: "Internationalisation",
    description: "Bilingual language switcher supporting toggle, dropdown, pills, and minimal variants.",
    descriptionFr: "Sélecteur de langue bilingue supportant les variantes bascule, menu déroulant, pilules et minimal.",
    status: "stable",
    props: [
      { name: "variant", type: "'toggle' | 'dropdown' | 'pills' | 'minimal'", required: false, description: "Visual variant" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, description: "Size" },
      { name: "showFlag", type: "boolean", required: false, description: "Show flag emoji" },
      { name: "showFullName", type: "boolean", required: false, description: "Show full language name" },
    ],
  },
  {
    id: "qa-checklist",
    name: "QAChecklist",
    nameFr: "Liste de contrôle QA",
    category: "QA",
    categoryFr: "Assurance qualité",
    description: "Comprehensive QA checklist with categories, priorities, and progress tracking.",
    descriptionFr: "Liste de contrôle QA complète avec catégories, priorités et suivi de progression.",
    status: "stable",
    props: [
      { name: "categories", type: "ChecklistCategory[]", required: false, description: "Custom checklist categories" },
      { name: "onProgressChange", type: "(progress: number) => void", required: false, description: "Progress callback" },
    ],
  },
  {
    id: "visual-regression",
    name: "VisualRegressionDashboard",
    nameFr: "Tableau de bord de régression visuelle",
    category: "QA",
    categoryFr: "Assurance qualité",
    description: "Visual regression testing dashboard with screenshot comparison and diff visualization.",
    descriptionFr: "Tableau de bord de tests de régression visuelle avec comparaison de captures d'écran.",
    status: "stable",
    props: [
      { name: "suites", type: "VisualTestSuite[]", required: false, description: "Test suite configurations" },
    ],
  },
  {
    id: "performance-dashboard",
    name: "PerformanceTestingDashboard",
    nameFr: "Tableau de bord de performance",
    category: "Performance",
    categoryFr: "Performance",
    description: "Performance testing dashboard with Core Web Vitals and load testing metrics.",
    descriptionFr: "Tableau de bord de tests de performance avec Core Web Vitals et métriques de charge.",
    status: "stable",
    props: [],
  },
  {
    id: "bug-tracking",
    name: "BugTrackingForm",
    nameFr: "Formulaire de suivi de bogues",
    category: "QA",
    categoryFr: "Assurance qualité",
    description: "Comprehensive bug reporting form with auto-detected environment info.",
    descriptionFr: "Formulaire complet de signalement de bogues avec détection automatique de l'environnement.",
    status: "stable",
    props: [
      { name: "onSubmit", type: "(report: BugReport) => void", required: false, description: "Submit callback" },
    ],
  },
  {
    id: "translation-audit",
    name: "TranslationAudit",
    nameFr: "Audit des traductions",
    category: "i18n",
    categoryFr: "Internationalisation",
    description: "Translation completeness audit comparing EN and FR locale files.",
    descriptionFr: "Audit de complétude des traductions comparant les fichiers de locale EN et FR.",
    status: "stable",
    props: [],
  },
  {
    id: "formatted-date",
    name: "FormattedDate",
    nameFr: "Date formatée",
    category: "i18n",
    categoryFr: "Internationalisation",
    description: "Canadian-standard date formatting component (YYYY-MM-DD, long, medium).",
    descriptionFr: "Composant de formatage de date selon la norme canadienne (AAAA-MM-JJ, long, moyen).",
    status: "stable",
    props: [
      { name: "value", type: "Date | string | number", required: true, description: "Date value to format" },
      { name: "format", type: "'short' | 'medium' | 'long' | 'iso'", required: false, description: "Date format" },
      { name: "includeTime", type: "boolean", required: false, description: "Include time" },
    ],
  },
];

/* ── ComponentShowcase Component ── */
interface ComponentShowcaseProps {
  className?: string;
}

export function ComponentShowcase({ className = "" }: ComponentShowcaseProps) {
  const { locale } = useLocale();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const labels = {
    en: {
      title: "Component Showcase",
      subtitle: "Interactive documentation of all ecosystem components",
      search: "Search components...",
      all: "All",
      props: "Props",
      name: "Name",
      type: "Type",
      required: "Required",
      description: "Description",
      stable: "Stable",
      beta: "Beta",
      experimental: "Experimental",
      noResults: "No components match the current filters.",
      components: "components",
    },
    fr: {
      title: "Vitrine des composants",
      subtitle: "Documentation interactive de tous les composants de l'écosystème",
      search: "Rechercher des composants...",
      all: "Tous",
      props: "Propriétés",
      name: "Nom",
      type: "Type",
      required: "Requis",
      description: "Description",
      stable: "Stable",
      beta: "Bêta",
      experimental: "Expérimental",
      noResults: "Aucun composant ne correspond aux filtres actuels.",
      components: "composants",
    },
  };
  const t = labels[locale];

  const categories = [...new Set(COMPONENT_REGISTRY.map((c) => c.category))];

  const filtered = COMPONENT_REGISTRY.filter((comp) => {
    if (filterCategory !== "all" && comp.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return comp.name.toLowerCase().includes(q) || comp.description.toLowerCase().includes(q);
    }
    return true;
  });

  const statusColors: Record<string, string> = {
    stable: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    beta: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    experimental: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

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
          {t.subtitle} — {COMPONENT_REGISTRY.length} {t.components}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="flex-1 rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--brand-foundation)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-foundation)]/20 dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)] dark:placeholder-[var(--dark-text-muted)]"
          aria-label={t.search}
        />
        <div className="flex gap-1">
          <button
            onClick={() => setFilterCategory("all")}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              filterCategory === "all"
                ? "bg-[var(--brand-foundation)] text-white"
                : "bg-[var(--section-bg-2)] text-[var(--text-secondary)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-secondary)]"
            }`}
          >
            {t.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filterCategory === cat
                  ? "bg-[var(--brand-foundation)] text-white"
                  : "bg-[var(--section-bg-2)] text-[var(--text-secondary)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-secondary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Component Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[var(--border-color-light)] p-8 text-center dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.noResults}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <button
                onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                aria-expanded={expandedId === comp.id}
              >
                <div className="flex items-center gap-3">
                  <code className="text-sm font-semibold text-[var(--brand-foundation)] dark:text-[var(--dark-brand-foundation-2)]">
                    {"<"}{comp.name}{" />"}
                  </code>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[comp.status]}`}>
                    {t[comp.status as keyof typeof t]}
                  </span>
                  <span className="rounded bg-[var(--section-bg-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-muted)]">
                    {locale === "fr" ? comp.categoryFr : comp.category}
                  </span>
                </div>
                <svg
                  className={`h-5 w-5 text-[var(--text-muted)] transition-transform dark:text-[var(--dark-text-muted)] ${expandedId === comp.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="border-t border-[var(--border-color-light)] px-4 py-3 dark:border-[rgba(255,255,255,0.05)]">
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  {locale === "fr" ? comp.descriptionFr : comp.description}
                </p>
              </div>
              {expandedId === comp.id && comp.props.length > 0 && (
                <div className="border-t border-[var(--border-color-light)] px-4 py-3 dark:border-[rgba(255,255,255,0.05)]">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                    {t.props}
                  </h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.05)]">
                        <th className="px-2 py-1 text-left font-semibold">{t.name}</th>
                        <th className="px-2 py-1 text-left font-semibold">{t.type}</th>
                        <th className="px-2 py-1 text-center font-semibold">{t.required}</th>
                        <th className="px-2 py-1 text-left font-semibold">{t.description}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.props.map((prop) => (
                        <tr key={prop.name} className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.03)]">
                          <td className="px-2 py-1 font-mono font-medium text-[var(--brand-foundation)] dark:text-[var(--dark-brand-foundation-2)]">{prop.name}</td>
                          <td className="px-2 py-1 font-mono text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{prop.type}</td>
                          <td className="px-2 py-1 text-center">{prop.required ? "✓" : "—"}</td>
                          <td className="px-2 py-1 text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{prop.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ComponentShowcase;
