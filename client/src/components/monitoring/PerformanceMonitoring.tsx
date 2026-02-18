/**
 * ============================================
 * PERFORMANCE MONITORING SETUP
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * - RUM (Real User Monitoring) integration hooks
 * - Synthetic monitoring utilities
 * - Error tracking integration (Sentry-ready hooks)
 * - Core Web Vitals monitoring dashboard
 * - Alert threshold configuration
 * - Weekly performance report template
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
export type VitalRating = "good" | "needs-improvement" | "poor";

export interface WebVital {
  name: "LCP" | "FID" | "CLS" | "TTFB" | "FCP" | "INP";
  value: number;
  rating: VitalRating;
  timestamp: number;
}

export interface AlertThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

export interface SyntheticCheck {
  id: string;
  name: string;
  url: string;
  interval: number;
  lastStatus: "up" | "down" | "degraded";
  lastResponseTime: number;
  lastChecked: number;
  uptime: number;
}

export interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  count: number;
  level: "error" | "warning" | "info";
  handled: boolean;
}

export interface PerformanceReport {
  period: string;
  vitals: Record<string, { p50: number; p75: number; p95: number }>;
  errorRate: number;
  uptime: number;
  pageViews: number;
  uniqueUsers: number;
}

/* ═══════════════════════════════════════════
   DEFAULT ALERT THRESHOLDS
   ═══════════════════════════════════════════ */
export const DEFAULT_ALERT_THRESHOLDS: AlertThreshold[] = [
  { metric: "LCP", warning: 2500, critical: 4000, unit: "ms" },
  { metric: "FID", warning: 100, critical: 300, unit: "ms" },
  { metric: "CLS", warning: 0.1, critical: 0.25, unit: "" },
  { metric: "TTFB", warning: 800, critical: 1800, unit: "ms" },
  { metric: "FCP", warning: 1800, critical: 3000, unit: "ms" },
  { metric: "INP", warning: 200, critical: 500, unit: "ms" },
  { metric: "Error Rate", warning: 1, critical: 5, unit: "%" },
  { metric: "Response Time", warning: 1000, critical: 3000, unit: "ms" },
];

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

/**
 * useRealUserMonitoring — RUM integration hook
 * Collects Core Web Vitals from real user sessions.
 */
export function useRealUserMonitoring(options: { enabled?: boolean; endpoint?: string } = {}) {
  const { enabled = true, endpoint } = options;
  const [vitals, setVitals] = useState<WebVital[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  const rateVital = useCallback((name: string, value: number): VitalRating => {
    const thresholds: Record<string, [number, number]> = {
      LCP: [2500, 4000],
      FID: [100, 300],
      CLS: [0.1, 0.25],
      TTFB: [800, 1800],
      FCP: [1800, 3000],
      INP: [200, 500],
    };
    const [good, poor] = thresholds[name] || [Infinity, Infinity];
    if (value <= good) return "good";
    if (value <= poor) return "needs-improvement";
    return "poor";
  }, []);

  const reportVital = useCallback(
    (name: WebVital["name"], value: number) => {
      const vital: WebVital = {
        name,
        value,
        rating: rateVital(name, value),
        timestamp: Date.now(),
      };
      setVitals((prev) => [...prev, vital]);

      if (endpoint) {
        navigator.sendBeacon?.(
          endpoint,
          JSON.stringify({ type: "web-vital", ...vital })
        );
      }
    },
    [endpoint, rateVital]
  );

  useEffect(() => {
    if (!enabled || typeof PerformanceObserver === "undefined") return;

    try {
      // Observe paint entries for FCP
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            reportVital("FCP", entry.startTime);
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });

      // Observe LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) reportVital("LCP", last.startTime);
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // Observe CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        reportVital("CLS", clsValue);
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      return () => {
        paintObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch {
      // PerformanceObserver not supported
    }
  }, [enabled, reportVital]);

  return { vitals, reportVital };
}

/**
 * useSentryIntegration — Sentry-ready error tracking hooks
 */
export function useSentryIntegration(options: { dsn?: string; enabled?: boolean } = {}) {
  const { dsn, enabled = true } = options;
  const [errors, setErrors] = useState<ErrorEvent[]>([]);

  const captureError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      const event: ErrorEvent = {
        id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        count: 1,
        level: "error",
        handled: true,
      };
      setErrors((prev) => [...prev, event]);

      // Sentry-compatible beacon
      if (dsn && enabled) {
        navigator.sendBeacon?.(
          dsn,
          JSON.stringify({
            exception: { values: [{ type: error.name, value: error.message, stacktrace: error.stack }] },
            contexts: context,
            timestamp: new Date().toISOString(),
          })
        );
      }
    },
    [dsn, enabled]
  );

  const captureMessage = useCallback(
    (message: string, level: ErrorEvent["level"] = "info") => {
      const event: ErrorEvent = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        message,
        timestamp: Date.now(),
        count: 1,
        level,
        handled: true,
      };
      setErrors((prev) => [...prev, event]);
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;

    const handleError = (event: ErrorEvent) => {
      captureError(new Error(String((event as any).message || "Unknown error")));
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      captureError(new Error(`Unhandled rejection: ${event.reason}`));
    };

    window.addEventListener("error", handleError as any);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError as any);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [enabled, captureError]);

  return { errors, captureError, captureMessage, errorCount: errors.length };
}

/**
 * useSyntheticMonitoring — Synthetic monitoring utilities
 */
export function useSyntheticMonitoring(checks: Omit<SyntheticCheck, "lastStatus" | "lastResponseTime" | "lastChecked" | "uptime">[] = []) {
  const [results, setResults] = useState<SyntheticCheck[]>(
    checks.map((c) => ({
      ...c,
      lastStatus: "up" as const,
      lastResponseTime: 0,
      lastChecked: 0,
      uptime: 100,
    }))
  );

  const runCheck = useCallback(async (checkId: string) => {
    const check = results.find((c) => c.id === checkId);
    if (!check) return;

    const start = performance.now();
    try {
      const response = await fetch(check.url, { method: "HEAD", mode: "no-cors" });
      const responseTime = performance.now() - start;
      setResults((prev) =>
        prev.map((c) =>
          c.id === checkId
            ? { ...c, lastStatus: responseTime < 3000 ? "up" : "degraded", lastResponseTime: Math.round(responseTime), lastChecked: Date.now() }
            : c
        )
      );
    } catch {
      setResults((prev) =>
        prev.map((c) =>
          c.id === checkId
            ? { ...c, lastStatus: "down", lastResponseTime: 0, lastChecked: Date.now() }
            : c
        )
      );
    }
  }, [results]);

  return { checks: results, runCheck };
}

/* ═══════════════════════════════════════════
   CORE WEB VITALS DASHBOARD COMPONENT
   ═══════════════════════════════════════════ */
interface CoreWebVitalsDashboardProps {
  className?: string;
}

export function CoreWebVitalsDashboard({ className = "" }: CoreWebVitalsDashboardProps) {
  const { locale } = useLocale();
  const { vitals } = useRealUserMonitoring({ enabled: true });
  const [activeTab, setActiveTab] = useState<"vitals" | "thresholds" | "report">("vitals");

  const labels = {
    en: {
      title: "Core Web Vitals Dashboard",
      subtitle: "Real-time performance monitoring for the RusingÂcademy ecosystem",
      vitals: "Web Vitals",
      thresholds: "Alert Thresholds",
      report: "Weekly Report",
      metric: "Metric",
      value: "Value",
      rating: "Rating",
      good: "Good",
      needsImprovement: "Needs Improvement",
      poor: "Poor",
      warning: "Warning",
      critical: "Critical",
      unit: "Unit",
      noData: "No performance data collected yet. Navigate the site to generate metrics.",
      lcpDesc: "Largest Contentful Paint — loading performance",
      fidDesc: "First Input Delay — interactivity",
      clsDesc: "Cumulative Layout Shift — visual stability",
      ttfbDesc: "Time to First Byte — server response",
      fcpDesc: "First Contentful Paint — initial render",
      inpDesc: "Interaction to Next Paint — responsiveness",
      reportTitle: "Weekly Performance Report Template",
      period: "Reporting Period",
      summary: "Executive Summary",
      recommendations: "Recommendations",
    },
    fr: {
      title: "Tableau de bord Core Web Vitals",
      subtitle: "Surveillance de performance en temps réel pour l'écosystème RusingÂcademy",
      vitals: "Web Vitals",
      thresholds: "Seuils d'alerte",
      report: "Rapport hebdomadaire",
      metric: "Métrique",
      value: "Valeur",
      rating: "Évaluation",
      good: "Bon",
      needsImprovement: "À améliorer",
      poor: "Mauvais",
      warning: "Avertissement",
      critical: "Critique",
      unit: "Unité",
      noData: "Aucune donnée de performance collectée. Naviguez sur le site pour générer des métriques.",
      lcpDesc: "Plus grand affichage de contenu — performance de chargement",
      fidDesc: "Délai de première interaction — interactivité",
      clsDesc: "Décalage cumulatif de la mise en page — stabilité visuelle",
      ttfbDesc: "Temps jusqu'au premier octet — réponse du serveur",
      fcpDesc: "Premier affichage de contenu — rendu initial",
      inpDesc: "Interaction au prochain affichage — réactivité",
      reportTitle: "Modèle de rapport de performance hebdomadaire",
      period: "Période de rapport",
      summary: "Résumé exécutif",
      recommendations: "Recommandations",
    },
  };
  const t = labels[locale];

  const vitalDescriptions: Record<string, string> = {
    LCP: t.lcpDesc,
    FID: t.fidDesc,
    CLS: t.clsDesc,
    TTFB: t.ttfbDesc,
    FCP: t.fcpDesc,
    INP: t.inpDesc,
  };

  const ratingColors: Record<VitalRating, string> = {
    good: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "needs-improvement": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    poor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const ratingLabels: Record<VitalRating, string> = {
    good: t.good,
    "needs-improvement": t.needsImprovement,
    poor: t.poor,
  };

  // Get latest value for each vital
  const latestVitals = useMemo(() => {
    const map = new Map<string, WebVital>();
    vitals.forEach((v) => map.set(v.name, v));
    return Array.from(map.values());
  }, [vitals]);

  // Simulated vitals for demo
  const demoVitals: WebVital[] = [
    { name: "LCP", value: 1850, rating: "good", timestamp: Date.now() },
    { name: "FID", value: 45, rating: "good", timestamp: Date.now() },
    { name: "CLS", value: 0.05, rating: "good", timestamp: Date.now() },
    { name: "TTFB", value: 620, rating: "good", timestamp: Date.now() },
    { name: "FCP", value: 1200, rating: "good", timestamp: Date.now() },
    { name: "INP", value: 120, rating: "good", timestamp: Date.now() },
  ];

  const displayVitals = latestVitals.length > 0 ? latestVitals : demoVitals;

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

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[var(--section-bg-2)] p-1 dark:bg-[var(--dark-section-bg-2)]">
        {(["vitals", "thresholds", "report"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {t[tab]}
          </button>
        ))}
      </div>

      {/* Vitals Tab */}
      {activeTab === "vitals" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayVitals.map((vital) => (
            <div
              key={vital.name}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {vital.name}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ratingColors[vital.rating]}`}>
                  {ratingLabels[vital.rating]}
                </span>
              </div>
              <div className="mb-2 text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {vital.name === "CLS" ? vital.value.toFixed(3) : `${Math.round(vital.value)}ms`}
              </div>
              <p className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {vitalDescriptions[vital.name]}
              </p>
              {/* Progress bar */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--section-bg-5)] dark:bg-[var(--dark-section-bg-5)]">
                <div
                  className={`h-full rounded-full transition-all ${
                    vital.rating === "good"
                      ? "bg-green-500"
                      : vital.rating === "needs-improvement"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(100, vital.name === "CLS" ? (vital.value / 0.25) * 100 : (vital.value / 4000) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thresholds Tab */}
      {activeTab === "thresholds" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.08)]">
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.metric}</th>
                <th className="px-3 py-2 text-center font-semibold text-yellow-600 dark:text-yellow-400">{t.warning}</th>
                <th className="px-3 py-2 text-center font-semibold text-red-600 dark:text-red-400">{t.critical}</th>
                <th className="px-3 py-2 text-center font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.unit}</th>
              </tr>
            </thead>
            <tbody>
              {DEFAULT_ALERT_THRESHOLDS.map((threshold) => (
                <tr key={threshold.metric} className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.05)]">
                  <td className="px-3 py-2 font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                    {threshold.metric}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="rounded bg-yellow-100 px-2 py-0.5 font-mono text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {threshold.warning}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="rounded bg-red-100 px-2 py-0.5 font-mono text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {threshold.critical}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                    {threshold.unit || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report Tab */}
      {activeTab === "report" && (
        <div className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-6 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]">
          <h3 className="mb-4 text-lg font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
            {t.reportTitle}
          </h3>
          <div className="space-y-4 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            <div>
              <h4 className="mb-1 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.period}</h4>
              <p>{locale === "fr" ? "Semaine du 2026-02-12 au 2026-02-18" : "Week of 2026-02-12 to 2026-02-18"}</p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.summary}</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: locale === "fr" ? "Pages vues" : "Page Views", value: "12,450" },
                  { label: locale === "fr" ? "Utilisateurs uniques" : "Unique Users", value: "3,280" },
                  { label: locale === "fr" ? "Disponibilité" : "Uptime", value: "99.97%" },
                  { label: locale === "fr" ? "Taux d'erreur" : "Error Rate", value: "0.12%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-[var(--section-bg-2)] p-3 text-center dark:bg-[var(--dark-section-bg-2)]">
                    <div className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{stat.label}</div>
                    <div className="mt-1 text-lg font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">Core Web Vitals (p75)</h4>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[
                  { name: "LCP", value: "1.85s", status: "good" },
                  { name: "FID", value: "45ms", status: "good" },
                  { name: "CLS", value: "0.05", status: "good" },
                  { name: "TTFB", value: "620ms", status: "good" },
                  { name: "FCP", value: "1.2s", status: "good" },
                  { name: "INP", value: "120ms", status: "good" },
                ].map((v) => (
                  <div key={v.name} className="rounded-lg bg-green-50 p-2 text-center dark:bg-green-900/10">
                    <div className="text-xs font-bold text-green-700 dark:text-green-400">{v.name}</div>
                    <div className="text-sm font-semibold text-green-800 dark:text-green-300">{v.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.recommendations}</h4>
              <ul className="ml-4 list-disc space-y-1">
                <li>{locale === "fr" ? "Continuer à surveiller le LCP sur les pages de cours" : "Continue monitoring LCP on course pages"}</li>
                <li>{locale === "fr" ? "Optimiser les images de la bibliothèque de produits" : "Optimize product library images"}</li>
                <li>{locale === "fr" ? "Envisager le préchargement des polices pour le contenu français" : "Consider preloading fonts for French content"}</li>
                <li>{locale === "fr" ? "Examiner les erreurs JavaScript non gérées (3 cette semaine)" : "Review unhandled JavaScript errors (3 this week)"}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CoreWebVitalsDashboard;
