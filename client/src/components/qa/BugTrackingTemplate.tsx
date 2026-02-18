/**
 * ============================================
 * COMPREHENSIVE BUG TRACKING TEMPLATE
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Structured bug report form with severity levels,
 * reproduction steps, environment info, and
 * screenshot attachment support.
 */
import React, { useState, useCallback } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
export type BugSeverity = "critical" | "major" | "minor" | "cosmetic";
export type BugStatus = "open" | "in-progress" | "resolved" | "closed" | "wont-fix";
export type BugCategory = "visual" | "functional" | "performance" | "accessibility" | "i18n" | "security" | "other";

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  category: BugCategory;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: {
    browser: string;
    os: string;
    viewport: string;
    locale: string;
    theme: string;
  };
  screenshots: string[];
  assignee?: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

/* ── Auto-detect Environment ── */
export function detectEnvironment(): BugReport["environment"] {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return {
    browser: `${browser} (${ua.slice(0, 60)}...)`,
    os,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    locale: document.documentElement.lang || "en",
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
  };
}

/* ── Bug Tracking Form Component ── */
interface BugTrackingFormProps {
  onSubmit?: (report: BugReport) => void;
  className?: string;
}

export function BugTrackingForm({ onSubmit, className = "" }: BugTrackingFormProps) {
  const { locale } = useLocale();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "minor" as BugSeverity,
    category: "visual" as BugCategory,
    stepsToReproduce: [""],
    expectedBehavior: "",
    actualBehavior: "",
    tags: "",
  });

  const labels = {
    en: {
      title: "Bug Report",
      subtitle: "Submit a detailed bug report for the QA team",
      bugTitle: "Title",
      bugTitlePlaceholder: "Brief description of the issue",
      description: "Description",
      descriptionPlaceholder: "Detailed description of the bug...",
      severity: "Severity",
      category: "Category",
      stepsToReproduce: "Steps to Reproduce",
      addStep: "Add Step",
      removeStep: "Remove",
      stepPlaceholder: "Step",
      expectedBehavior: "Expected Behavior",
      expectedPlaceholder: "What should happen...",
      actualBehavior: "Actual Behavior",
      actualPlaceholder: "What actually happens...",
      environment: "Environment (auto-detected)",
      tags: "Tags",
      tagsPlaceholder: "Comma-separated tags",
      submit: "Submit Bug Report",
      reset: "Reset",
      severities: { critical: "Critical", major: "Major", minor: "Minor", cosmetic: "Cosmetic" },
      categories: {
        visual: "Visual/UI",
        functional: "Functional",
        performance: "Performance",
        accessibility: "Accessibility",
        i18n: "Internationalization",
        security: "Security",
        other: "Other",
      },
    },
    fr: {
      title: "Rapport de bogue",
      subtitle: "Soumettre un rapport de bogue détaillé pour l'équipe QA",
      bugTitle: "Titre",
      bugTitlePlaceholder: "Brève description du problème",
      description: "Description",
      descriptionPlaceholder: "Description détaillée du bogue...",
      severity: "Sévérité",
      category: "Catégorie",
      stepsToReproduce: "Étapes pour reproduire",
      addStep: "Ajouter une étape",
      removeStep: "Supprimer",
      stepPlaceholder: "Étape",
      expectedBehavior: "Comportement attendu",
      expectedPlaceholder: "Ce qui devrait se passer...",
      actualBehavior: "Comportement réel",
      actualPlaceholder: "Ce qui se passe réellement...",
      environment: "Environnement (auto-détecté)",
      tags: "Étiquettes",
      tagsPlaceholder: "Étiquettes séparées par des virgules",
      submit: "Soumettre le rapport",
      reset: "Réinitialiser",
      severities: { critical: "Critique", major: "Majeur", minor: "Mineur", cosmetic: "Cosmétique" },
      categories: {
        visual: "Visuel/UI",
        functional: "Fonctionnel",
        performance: "Performance",
        accessibility: "Accessibilité",
        i18n: "Internationalisation",
        security: "Sécurité",
        other: "Autre",
      },
    },
  };
  const t = labels[locale];

  const env = detectEnvironment();

  const severityColors: Record<BugSeverity, string> = {
    critical: "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    major: "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    minor: "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    cosmetic: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.stepsToReproduce];
    newSteps[index] = value;
    setFormData({ ...formData, stepsToReproduce: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, stepsToReproduce: [...formData.stepsToReproduce, ""] });
  };

  const removeStep = (index: number) => {
    if (formData.stepsToReproduce.length > 1) {
      const newSteps = formData.stepsToReproduce.filter((_, i) => i !== index);
      setFormData({ ...formData, stepsToReproduce: newSteps });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report: BugReport = {
      id: `BUG-${Date.now().toString(36).toUpperCase()}`,
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: "open",
      category: formData.category,
      stepsToReproduce: formData.stepsToReproduce.filter((s) => s.trim()),
      expectedBehavior: formData.expectedBehavior,
      actualBehavior: formData.actualBehavior,
      environment: env,
      screenshots: [],
      reporter: "QA Tester",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    onSubmit?.(report);
  };

  const inputClasses =
    "w-full rounded-lg border border-[var(--border-color-light)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus:border-[var(--brand-foundation)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-foundation)]/20 dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)] dark:placeholder-[var(--dark-text-muted)] dark:focus:border-[var(--dark-brand-foundation)]";

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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.bugTitle} *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={t.bugTitlePlaceholder}
            className={inputClasses}
          />
        </div>

        {/* Severity & Category */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
              {t.severity}
            </label>
            <div className="flex gap-2">
              {(Object.keys(t.severities) as BugSeverity[]).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: sev })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    formData.severity === sev ? severityColors[sev] + " border-2" : "border-[var(--border-color-light)] bg-[var(--bg-base)] text-[var(--text-muted)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-muted)]"
                  }`}
                  aria-pressed={formData.severity === sev}
                >
                  {t.severities[sev]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
              {t.category}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as BugCategory })}
              className={inputClasses}
            >
              {(Object.keys(t.categories) as BugCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {t.categories[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.description}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t.descriptionPlaceholder}
            rows={3}
            className={inputClasses}
          />
        </div>

        {/* Steps to Reproduce */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.stepsToReproduce}
          </label>
          <div className="space-y-2">
            {formData.stepsToReproduce.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--section-bg-2)] text-xs font-medium text-[var(--text-secondary)] dark:bg-[var(--dark-section-bg-2)] dark:text-[var(--dark-text-secondary)]">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(i, e.target.value)}
                  placeholder={`${t.stepPlaceholder} ${i + 1}`}
                  className={inputClasses}
                />
                {formData.stepsToReproduce.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="shrink-0 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label={t.removeStep}
                  >
                    {t.removeStep}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="text-sm font-medium text-[var(--brand-foundation)] hover:text-[var(--brand-foundation-2)] dark:text-[var(--dark-text-primary)]"
            >
              + {t.addStep}
            </button>
          </div>
        </div>

        {/* Expected vs Actual */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
              {t.expectedBehavior}
            </label>
            <textarea
              value={formData.expectedBehavior}
              onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
              placeholder={t.expectedPlaceholder}
              rows={3}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
              {t.actualBehavior}
            </label>
            <textarea
              value={formData.actualBehavior}
              onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
              placeholder={t.actualPlaceholder}
              rows={3}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Environment (auto-detected) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.environment}
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--border-color-light)] bg-[var(--section-bg-1)] p-3 text-xs dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-section-bg-1)] sm:grid-cols-5">
            {Object.entries(env).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                  {key}
                </span>
                <div className="mt-0.5 text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.tags}
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder={t.tagsPlaceholder}
            className={inputClasses}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[var(--brand-foundation)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand-foundation-2)] hover:shadow-md"
          >
            {t.submit}
          </button>
          <button
            type="reset"
            className="rounded-lg border border-[var(--border-color-light)] px-6 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--section-bg-2)] dark:border-[rgba(255,255,255,0.08)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)]"
          >
            {t.reset}
          </button>
        </div>
      </form>
    </section>
  );
}

export default BugTrackingForm;
