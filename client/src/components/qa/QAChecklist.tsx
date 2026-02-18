/**
 * ============================================
 * QA CHECKLIST COMPONENTS
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Comprehensive QA checklist for cross-browser,
 * cross-device, accessibility, performance, and
 * bilingual testing workflows.
 */
import React, { useState, useCallback, useMemo } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
export interface ChecklistItem {
  id: string;
  label: string;
  labelFr: string;
  category: string;
  checked: boolean;
  notes?: string;
  priority: "required" | "recommended" | "optional";
}

export interface ChecklistCategory {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  items: ChecklistItem[];
}

/* ── Default QA Checklist Data ── */
export const DEFAULT_QA_CHECKLIST: ChecklistCategory[] = [
  {
    id: "cross-browser",
    name: "Cross-Browser Testing",
    nameFr: "Tests multi-navigateurs",
    icon: "🌐",
    items: [
      { id: "cb-1", label: "Chrome (latest) — all pages render correctly", labelFr: "Chrome (dernière version) — toutes les pages s'affichent correctement", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-2", label: "Firefox (latest) — all pages render correctly", labelFr: "Firefox (dernière version) — toutes les pages s'affichent correctement", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-3", label: "Safari (latest) — all pages render correctly", labelFr: "Safari (dernière version) — toutes les pages s'affichent correctement", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-4", label: "Edge (latest) — all pages render correctly", labelFr: "Edge (dernière version) — toutes les pages s'affichent correctement", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-5", label: "Glassmorphism effects render in all browsers", labelFr: "Les effets de glassmorphisme s'affichent dans tous les navigateurs", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-6", label: "CSS animations work in all browsers", labelFr: "Les animations CSS fonctionnent dans tous les navigateurs", category: "cross-browser", checked: false, priority: "required" },
      { id: "cb-7", label: "Web fonts load correctly in all browsers", labelFr: "Les polices web se chargent correctement dans tous les navigateurs", category: "cross-browser", checked: false, priority: "recommended" },
    ],
  },
  {
    id: "responsive",
    name: "Responsive Design",
    nameFr: "Design réactif",
    icon: "📱",
    items: [
      { id: "rd-1", label: "Mobile 375px — no horizontal overflow", labelFr: "Mobile 375px — pas de débordement horizontal", category: "responsive", checked: false, priority: "required" },
      { id: "rd-2", label: "Tablet 768px — layout adapts correctly", labelFr: "Tablette 768px — la mise en page s'adapte correctement", category: "responsive", checked: false, priority: "required" },
      { id: "rd-3", label: "Desktop 1024px — full layout visible", labelFr: "Bureau 1024px — mise en page complète visible", category: "responsive", checked: false, priority: "required" },
      { id: "rd-4", label: "Wide 1440px — content properly centered", labelFr: "Large 1440px — contenu correctement centré", category: "responsive", checked: false, priority: "required" },
      { id: "rd-5", label: "Touch targets minimum 44×44px on mobile", labelFr: "Cibles tactiles minimum 44×44px sur mobile", category: "responsive", checked: false, priority: "required" },
      { id: "rd-6", label: "Navigation works on all screen sizes", labelFr: "La navigation fonctionne sur toutes les tailles d'écran", category: "responsive", checked: false, priority: "required" },
      { id: "rd-7", label: "Images scale properly at all breakpoints", labelFr: "Les images s'adaptent correctement à tous les points de rupture", category: "responsive", checked: false, priority: "required" },
      { id: "rd-8", label: "French text (20-30% longer) does not overflow", labelFr: "Le texte français (20-30% plus long) ne déborde pas", category: "responsive", checked: false, priority: "required" },
    ],
  },
  {
    id: "accessibility",
    name: "Accessibility (WCAG AA)",
    nameFr: "Accessibilité (WCAG AA)",
    icon: "♿",
    items: [
      { id: "a11y-1", label: "Color contrast ratio ≥ 4.5:1 for normal text", labelFr: "Ratio de contraste des couleurs ≥ 4,5:1 pour le texte normal", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-2", label: "Color contrast ratio ≥ 3:1 for large text", labelFr: "Ratio de contraste des couleurs ≥ 3:1 pour le grand texte", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-3", label: "All images have alt text", labelFr: "Toutes les images ont un texte alternatif", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-4", label: "Keyboard navigation works on all interactive elements", labelFr: "La navigation au clavier fonctionne sur tous les éléments interactifs", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-5", label: "Focus indicators visible on all focusable elements", labelFr: "Les indicateurs de focus sont visibles sur tous les éléments focalisables", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-6", label: "ARIA labels on interactive components", labelFr: "Étiquettes ARIA sur les composants interactifs", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-7", label: "Skip navigation link present", labelFr: "Lien de navigation rapide présent", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-8", label: "Semantic HTML headings (h1-h6) in correct order", labelFr: "En-têtes HTML sémantiques (h1-h6) dans le bon ordre", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-9", label: "prefers-reduced-motion respected for animations", labelFr: "prefers-reduced-motion respecté pour les animations", category: "accessibility", checked: false, priority: "required" },
      { id: "a11y-10", label: "Dark mode maintains WCAG AA contrast", labelFr: "Le mode sombre maintient le contraste WCAG AA", category: "accessibility", checked: false, priority: "required" },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    nameFr: "Performance",
    icon: "⚡",
    items: [
      { id: "perf-1", label: "Lighthouse Performance score ≥ 90", labelFr: "Score de performance Lighthouse ≥ 90", category: "performance", checked: false, priority: "required" },
      { id: "perf-2", label: "LCP (Largest Contentful Paint) < 2.5s", labelFr: "LCP (Plus grand affichage de contenu) < 2,5s", category: "performance", checked: false, priority: "required" },
      { id: "perf-3", label: "FID (First Input Delay) < 100ms", labelFr: "FID (Délai de première interaction) < 100ms", category: "performance", checked: false, priority: "required" },
      { id: "perf-4", label: "CLS (Cumulative Layout Shift) < 0.1", labelFr: "CLS (Décalage cumulatif de la mise en page) < 0,1", category: "performance", checked: false, priority: "required" },
      { id: "perf-5", label: "Total bundle size < 500KB gzipped", labelFr: "Taille totale du bundle < 500Ko gzippé", category: "performance", checked: false, priority: "recommended" },
      { id: "perf-6", label: "Images optimized (WebP with fallback)", labelFr: "Images optimisées (WebP avec repli)", category: "performance", checked: false, priority: "recommended" },
      { id: "perf-7", label: "No render-blocking resources", labelFr: "Pas de ressources bloquant le rendu", category: "performance", checked: false, priority: "recommended" },
    ],
  },
  {
    id: "i18n",
    name: "Internationalization (EN/FR)",
    nameFr: "Internationalisation (EN/FR)",
    icon: "🌍",
    items: [
      { id: "i18n-1", label: "All UI text translated to French", labelFr: "Tout le texte de l'interface traduit en français", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-2", label: "Language switcher works on all pages", labelFr: "Le sélecteur de langue fonctionne sur toutes les pages", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-3", label: "Language preference persists across sessions", labelFr: "La préférence linguistique persiste entre les sessions", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-4", label: "Date format: YYYY-MM-DD (Canadian standard)", labelFr: "Format de date : AAAA-MM-JJ (norme canadienne)", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-5", label: "Currency format: $1,234.56 (EN) / 1 234,56 $ (FR)", labelFr: "Format monétaire : $1,234.56 (EN) / 1 234,56 $ (FR)", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-6", label: "French diacritics render correctly (é, è, ê, ë, ç, à, ù)", labelFr: "Les diacritiques français s'affichent correctement (é, è, ê, ë, ç, à, ù)", category: "i18n", checked: false, priority: "required" },
      { id: "i18n-7", label: "html lang attribute updates on language switch", labelFr: "L'attribut html lang se met à jour lors du changement de langue", category: "i18n", checked: false, priority: "required" },
    ],
  },
  {
    id: "darkmode",
    name: "Dark Mode",
    nameFr: "Mode sombre",
    icon: "🌙",
    items: [
      { id: "dm-1", label: "All components render correctly in dark mode", labelFr: "Tous les composants s'affichent correctement en mode sombre", category: "darkmode", checked: false, priority: "required" },
      { id: "dm-2", label: "Glassmorphism effects look premium in dark mode", labelFr: "Les effets de glassmorphisme sont premium en mode sombre", category: "darkmode", checked: false, priority: "required" },
      { id: "dm-3", label: "Smooth transition between light and dark modes", labelFr: "Transition fluide entre les modes clair et sombre", category: "darkmode", checked: false, priority: "required" },
      { id: "dm-4", label: "System preference (prefers-color-scheme) respected", labelFr: "Préférence système (prefers-color-scheme) respectée", category: "darkmode", checked: false, priority: "required" },
      { id: "dm-5", label: "No white flashes during theme transitions", labelFr: "Pas de flash blanc pendant les transitions de thème", category: "darkmode", checked: false, priority: "required" },
      { id: "dm-6", label: "Brand colors maintain identity in dark mode", labelFr: "Les couleurs de la marque conservent leur identité en mode sombre", category: "darkmode", checked: false, priority: "required" },
    ],
  },
];

/* ── QA Checklist Component ── */
interface QAChecklistProps {
  categories?: ChecklistCategory[];
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export function QAChecklist({
  categories = DEFAULT_QA_CHECKLIST,
  onProgressChange,
  className = "",
}: QAChecklistProps) {
  const { locale } = useLocale();
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(categories);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map((c) => c.id)));
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const labels = {
    en: {
      title: "QA Checklist",
      subtitle: "Comprehensive quality assurance checklist for launch readiness",
      progress: "Progress",
      required: "Required",
      recommended: "Recommended",
      optional: "Optional",
      all: "All",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      complete: "Complete",
      of: "of",
      items: "items",
    },
    fr: {
      title: "Liste de contrôle QA",
      subtitle: "Liste de contrôle complète d'assurance qualité pour la préparation au lancement",
      progress: "Progression",
      required: "Requis",
      recommended: "Recommandé",
      optional: "Optionnel",
      all: "Tous",
      expandAll: "Tout déplier",
      collapseAll: "Tout replier",
      complete: "Terminé",
      of: "de",
      items: "éléments",
    },
  };
  const t = labels[locale];

  const stats = useMemo(() => {
    let total = 0;
    let checked = 0;
    let requiredTotal = 0;
    let requiredChecked = 0;
    checklist.forEach((cat) => {
      cat.items.forEach((item) => {
        total++;
        if (item.checked) checked++;
        if (item.priority === "required") {
          requiredTotal++;
          if (item.checked) requiredChecked++;
        }
      });
    });
    const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
    onProgressChange?.(progress);
    return { total, checked, requiredTotal, requiredChecked, progress };
  }, [checklist, onProgressChange]);

  const toggleItem = useCallback((categoryId: string, itemId: string) => {
    setChecklist((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cat
      )
    );
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const priorityColors: Record<string, string> = {
    required: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    recommended: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    optional: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
          {t.subtitle}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.progress}: {stats.checked} {t.of} {stats.total} {t.items}
          </span>
          <span className="font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
            {stats.progress}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[var(--section-bg-5)] dark:bg-[var(--dark-section-bg-5)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] transition-all duration-700 ease-out"
            style={{ width: `${stats.progress}%` }}
            role="progressbar"
            aria-valuenow={stats.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="mt-1 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
          {t.required}: {stats.requiredChecked}/{stats.requiredTotal} {t.complete}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", "required", "recommended", "optional"].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filterPriority === p
                ? "bg-[var(--brand-foundation)] text-white"
                : "bg-[var(--section-bg-2)] text-[var(--text-secondary)] hover:bg-[var(--section-bg-3)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-3)]"
            }`}
            aria-pressed={filterPriority === p}
          >
            {t[p as keyof typeof t] || p}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setExpandedCategories(new Set(checklist.map((c) => c.id)))}
            className="text-xs font-medium text-[var(--brand-foundation)] hover:underline dark:text-[var(--dark-text-primary)]"
          >
            {t.expandAll}
          </button>
          <button
            onClick={() => setExpandedCategories(new Set())}
            className="text-xs font-medium text-[var(--brand-foundation)] hover:underline dark:text-[var(--dark-text-primary)]"
          >
            {t.collapseAll}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {checklist.map((cat) => {
          const filteredItems =
            filterPriority === "all" ? cat.items : cat.items.filter((i) => i.priority === filterPriority);
          if (filteredItems.length === 0) return null;
          const catChecked = filteredItems.filter((i) => i.checked).length;
          const isExpanded = expandedCategories.has(cat.id);

          return (
            <div
              key={cat.id}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <button
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                    {locale === "fr" ? cat.nameFr : cat.name}
                  </span>
                  <span className="rounded-full bg-[var(--section-bg-2)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-muted)]">
                    {catChecked}/{filteredItems.length}
                  </span>
                </div>
                <svg
                  className={`h-5 w-5 text-[var(--text-muted)] transition-transform dark:text-[var(--dark-text-muted)] ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="border-t border-[var(--border-color-light)] px-4 py-2 dark:border-[rgba(255,255,255,0.05)]">
                  {filteredItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--section-bg-1)] dark:hover:bg-[var(--dark-section-bg-1)]"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(cat.id, item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-color-medium)] text-[var(--brand-foundation)] accent-[var(--brand-foundation)]"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.checked
                            ? "text-[var(--text-muted)] line-through dark:text-[var(--dark-text-muted)]"
                            : "text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                        }`}
                      >
                        {locale === "fr" ? item.labelFr : item.label}
                      </span>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${priorityColors[item.priority]}`}>
                        {t[item.priority as keyof typeof t]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default QAChecklist;
