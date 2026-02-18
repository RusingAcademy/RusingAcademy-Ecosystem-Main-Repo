/**
 * ============================================
 * TRANSLATION AUDIT COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Audits all content for translation completeness
 * between EN and FR locales. Identifies missing
 * translations, untranslated keys, and coverage.
 */
import React, { useState, useMemo, useCallback } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import en from "@/i18n/en";
import fr from "@/i18n/fr";

/* ── Types ── */
interface TranslationEntry {
  key: string;
  enValue: string;
  frValue: string;
  status: "complete" | "missing-fr" | "missing-en" | "identical" | "placeholder";
  category: string;
}

/* ── Deep Key Extraction ── */
function extractKeys(obj: any, prefix: string = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, extractKeys(obj[key], fullKey));
    } else {
      result[fullKey] = String(obj[key]);
    }
  }
  return result;
}

/* ── Audit Logic ── */
function auditTranslations(): TranslationEntry[] {
  const enKeys = extractKeys(en);
  const frKeys = extractKeys(fr);
  const allKeys = new Set([...Object.keys(enKeys), ...Object.keys(frKeys)]);
  const entries: TranslationEntry[] = [];

  for (const key of allKeys) {
    const enVal = enKeys[key] || "";
    const frVal = frKeys[key] || "";
    const category = key.split(".")[0];

    let status: TranslationEntry["status"] = "complete";
    if (!frVal) status = "missing-fr";
    else if (!enVal) status = "missing-en";
    else if (enVal === frVal) status = "identical";
    else if (frVal.includes("TODO") || frVal.includes("FIXME")) status = "placeholder";

    entries.push({ key, enValue: enVal, frValue: frVal, status, category });
  }

  return entries.sort((a, b) => {
    const statusOrder = { "missing-fr": 0, "missing-en": 1, placeholder: 2, identical: 3, complete: 4 };
    return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
  });
}

/* ── TranslationAudit Component ── */
interface TranslationAuditProps {
  className?: string;
}

export function TranslationAudit({ className = "" }: TranslationAuditProps) {
  const { locale } = useLocale();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const entries = useMemo(() => auditTranslations(), []);

  const categories = useMemo(
    () => [...new Set(entries.map((e) => e.category))].sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterStatus !== "all" && e.status !== filterStatus) return false;
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.key.toLowerCase().includes(q) ||
          e.enValue.toLowerCase().includes(q) ||
          e.frValue.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, filterStatus, filterCategory, searchQuery]);

  const stats = useMemo(() => {
    const total = entries.length;
    const complete = entries.filter((e) => e.status === "complete").length;
    const missingFr = entries.filter((e) => e.status === "missing-fr").length;
    const missingEn = entries.filter((e) => e.status === "missing-en").length;
    const identical = entries.filter((e) => e.status === "identical").length;
    const placeholder = entries.filter((e) => e.status === "placeholder").length;
    const coverage = total > 0 ? Math.round((complete / total) * 100) : 0;
    return { total, complete, missingFr, missingEn, identical, placeholder, coverage };
  }, [entries]);

  const labels = {
    en: {
      title: "Translation Audit",
      subtitle: "Audit all content for EN/FR translation completeness",
      totalKeys: "Total Keys",
      complete: "Complete",
      missingFr: "Missing FR",
      missingEn: "Missing EN",
      identical: "Identical",
      placeholder: "Placeholder",
      coverage: "Coverage",
      all: "All",
      search: "Search translations...",
      category: "Category",
      key: "Key",
      english: "English",
      french: "French",
      status: "Status",
      noResults: "No translations match the current filters.",
    },
    fr: {
      title: "Audit des traductions",
      subtitle: "Vérifier la complétude des traductions EN/FR pour tout le contenu",
      totalKeys: "Clés totales",
      complete: "Complètes",
      missingFr: "FR manquant",
      missingEn: "EN manquant",
      identical: "Identiques",
      placeholder: "Provisoires",
      coverage: "Couverture",
      all: "Tous",
      search: "Rechercher les traductions...",
      category: "Catégorie",
      key: "Clé",
      english: "Anglais",
      french: "Français",
      status: "Statut",
      noResults: "Aucune traduction ne correspond aux filtres actuels.",
    },
  };
  const t = labels[locale];

  const statusColors: Record<string, string> = {
    complete: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "missing-fr": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "missing-en": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    identical: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    placeholder: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  const statusLabels: Record<string, string> = {
    complete: t.complete,
    "missing-fr": t.missingFr,
    "missing-en": t.missingEn,
    identical: t.identical,
    placeholder: t.placeholder,
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

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { label: t.totalKeys, value: stats.total, color: "text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]" },
          { label: t.complete, value: stats.complete, color: "text-green-600 dark:text-green-400" },
          { label: t.missingFr, value: stats.missingFr, color: "text-red-600 dark:text-red-400" },
          { label: t.missingEn, value: stats.missingEn, color: "text-red-600 dark:text-red-400" },
          { label: t.identical, value: stats.identical, color: "text-yellow-600 dark:text-yellow-400" },
          { label: t.placeholder, value: stats.placeholder, color: "text-orange-600 dark:text-orange-400" },
          { label: t.coverage, value: `${stats.coverage}%`, color: stats.coverage >= 90 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-3 text-center dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
          >
            <div className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{stat.label}</div>
            <div className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
          aria-label={t.status}
        >
          <option value="all">{t.all}</option>
          <option value="complete">{t.complete}</option>
          <option value="missing-fr">{t.missingFr}</option>
          <option value="missing-en">{t.missingEn}</option>
          <option value="identical">{t.identical}</option>
          <option value="placeholder">{t.placeholder}</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
          aria-label={t.category}
        >
          <option value="all">{t.all}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[var(--border-color-light)] p-8 text-center dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.noResults}</p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-auto rounded-xl border border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.08)]">
          <table className="w-full text-sm" role="table">
            <thead className="sticky top-0 bg-[var(--section-bg-2)] dark:bg-[var(--dark-section-bg-2)]">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.key}</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.english}</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.french}</th>
                <th className="px-3 py-2 text-center font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((entry) => (
                <tr
                  key={entry.key}
                  className="border-t border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.05)]"
                >
                  <td className="px-3 py-2 font-mono text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                    {entry.key}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2 text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                    {entry.enValue || "—"}
                  </td>
                  <td className="max-w-[200px] truncate px-3 py-2 text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                    {entry.frValue || "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[entry.status]}`}>
                      {statusLabels[entry.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 200 && (
            <div className="border-t border-[var(--border-color-light)] px-3 py-2 text-center text-xs text-[var(--text-muted)] dark:border-[rgba(255,255,255,0.05)] dark:text-[var(--dark-text-muted)]">
              {locale === "fr" ? `Affichage de 200 sur ${filtered.length} résultats` : `Showing 200 of ${filtered.length} results`}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default TranslationAudit;
