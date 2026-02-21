/**
 * ============================================
 * LAUNCH ANNOUNCEMENT COMPONENTS
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Banner, modal, and toast components for
 * the RusingAcademy ecosystem launch.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ═══════════════════════════════════════════
   LAUNCH BANNER
   ═══════════════════════════════════════════ */
interface LaunchBannerProps {
  variant?: "top" | "inline" | "hero";
  dismissible?: boolean;
  className?: string;
}

export function LaunchBanner({ variant = "top", dismissible = true, className = "" }: LaunchBannerProps) {
  const { locale } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  const labels = {
    en: {
      title: "RusingAcademy is Now Live!",
      subtitle: "Canada's premier bilingual learning ecosystem for public service excellence.",
      cta: "Explore Now",
      dismiss: "Dismiss",
    },
    fr: {
      title: "RusingAcademy est maintenant en ligne !",
      subtitle: "L'écosystème d'apprentissage bilingue de premier plan au Canada pour l'excellence de la fonction publique.",
      cta: "Explorer maintenant",
      dismiss: "Fermer",
    },
  };
  const t = labels[locale];

  if (dismissed) return null;

  if (variant === "hero") {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-8 sm:p-12 ${className}`}
        style={{
          background: "linear-gradient(135deg, var(--brand-foundation) 0%, var(--brand-obsidian) 50%, var(--brand-foundation-2) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[var(--brand-cta)] opacity-10 blur-3xl" />
        <div className="relative text-center">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            {locale === "fr" ? "🚀 Lancement officiel" : "🚀 Official Launch"}
          </div>
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/80">{t.subtitle}</p>
          <button className="rounded-xl bg-[var(--brand-cta)] px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[var(--brand-cta-2)] hover:shadow-xl">
            {t.cta}
          </button>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center justify-between rounded-xl border border-[var(--brand-foundation)]/20 bg-[var(--brand-foundation-soft)] p-4 dark:border-[var(--dark-brand-foundation)]/30 dark:bg-[var(--dark-brand-foundation-soft)] ${className}`}
        role="alert"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="font-semibold text-[var(--brand-foundation)] dark:text-[var(--dark-brand-foundation-2)]">{t.title}</p>
            <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-[var(--brand-foundation)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-foundation-2)] dark:bg-[var(--dark-brand-foundation)] dark:hover:bg-[var(--dark-brand-foundation-2)]">
            {t.cta}
          </button>
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--section-bg-2)] dark:text-[var(--dark-text-muted)] dark:hover:bg-[var(--dark-section-bg-2)]"
              aria-label={t.dismiss}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Top banner
  return (
    <div
      className={`flex items-center justify-center gap-4 bg-gradient-to-r from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] px-4 py-2.5 text-white dark:from-[var(--dark-brand-foundation)] dark:to-[var(--dark-brand-foundation-2)] ${className}`}
      role="alert"
    >
      <span className="text-sm font-medium">
        🚀 {t.title} — {t.subtitle}
      </span>
      <button className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
        {t.cta}
      </button>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 rounded p-1 transition-colors hover:bg-white/20"
          aria-label={t.dismiss}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LAUNCH MODAL
   ═══════════════════════════════════════════ */
interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function LaunchModal({ isOpen, onClose, className = "" }: LaunchModalProps) {
  const { locale } = useLocale();

  const labels = {
    en: {
      title: "Welcome to RusingAcademy!",
      subtitle: "Your bilingual learning journey starts here.",
      features: [
        "Expert coaching for SLE preparation",
        "Personalized learning paths",
        "AI-powered practice tools",
        "Bilingual content (EN/FR)",
        "Progress tracking & analytics",
      ],
      cta: "Get Started",
      later: "Maybe Later",
    },
    fr: {
      title: "Bienvenue à RusingAcademy !",
      subtitle: "Votre parcours d'apprentissage bilingue commence ici.",
      features: [
        "Coaching expert pour la préparation aux ELS",
        "Parcours d'apprentissage personnalisés",
        "Outils de pratique alimentés par l'IA",
        "Contenu bilingue (EN/FR)",
        "Suivi de progression et analytiques",
      ],
      cta: "Commencer",
      later: "Plus tard",
    },
  };
  const t = labels[locale];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.title}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div
        className={`relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-6 shadow-2xl dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] sm:p-8 ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--section-bg-2)] dark:text-[var(--dark-text-muted)] dark:hover:bg-[var(--dark-section-bg-2)]"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] text-3xl text-white shadow-lg">
            🎓
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
            {t.title}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
            {t.subtitle}
          </p>
        </div>

        <ul className="mb-6 space-y-3">
          {t.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-3.5 w-3.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-[var(--brand-cta)] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[var(--brand-cta-2)] hover:shadow-lg dark:bg-[var(--dark-brand-cta)] dark:hover:bg-[var(--dark-brand-cta-2)]">
            {t.cta}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border-color-light)] px-6 py-3 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--section-bg-2)] dark:border-[rgba(255,255,255,0.1)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)]"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LAUNCH TOAST
   ═══════════════════════════════════════════ */
interface LaunchToastProps {
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  className?: string;
}

export function LaunchToast({ isVisible, onClose, autoHideDuration = 8000, className = "" }: LaunchToastProps) {
  const { locale } = useLocale();

  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  const labels = {
    en: {
      title: "RusingAcademy has launched!",
      message: "Explore our bilingual learning ecosystem for Canadian public servants.",
      action: "Learn More",
    },
    fr: {
      title: "RusingAcademy est lancé !",
      message: "Explorez notre écosystème d'apprentissage bilingue pour les fonctionnaires canadiens.",
      action: "En savoir plus",
    },
  };
  const t = labels[locale];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm animate-[slideInRight_0.4s_ease-out] rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 shadow-xl dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] text-lg text-white">
          🚀
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.title}</p>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{t.message}</p>
          <button className="mt-2 text-sm font-medium text-[var(--brand-foundation)] hover:underline dark:text-[var(--dark-brand-foundation-2)]">
            {t.action}
          </button>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--section-bg-2)] dark:text-[var(--dark-text-muted)] dark:hover:bg-[var(--dark-section-bg-2)]"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LaunchBanner;
