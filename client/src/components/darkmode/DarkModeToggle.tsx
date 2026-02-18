/**
 * ============================================
 * DARK MODE TOGGLE COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Premium animated toggle for switching between
 * light, dark, and system theme modes.
 * Respects prefers-color-scheme system preference.
 */
import React, { useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
type ToggleVariant = "icon" | "switch" | "dropdown";
type ToggleSize = "sm" | "md" | "lg";

interface DarkModeToggleProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
  showLabel?: boolean;
  className?: string;
}

/* ── Sun Icon ── */
function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/* ── Moon Icon ── */
function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Monitor Icon (System) ── */
function MonitorIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

/* ── Size Mappings ── */
const sizeMap: Record<ToggleSize, { icon: string; button: string; text: string }> = {
  sm: { icon: "h-4 w-4", button: "h-8 w-8", text: "text-xs" },
  md: { icon: "h-5 w-5", button: "h-10 w-10", text: "text-sm" },
  lg: { icon: "h-6 w-6", button: "h-12 w-12", text: "text-base" },
};

/* ── DarkModeToggle Component ── */
export function DarkModeToggle({
  variant = "icon",
  size = "md",
  showLabel = false,
  className = "",
}: DarkModeToggleProps) {
  const { theme, setTheme, isDark } = useTheme();
  const { locale } = useLocale();

  const labels = {
    en: {
      light: "Light",
      dark: "Dark",
      system: "System",
      toggleTheme: "Toggle theme",
      currentTheme: "Current theme",
    },
    fr: {
      light: "Clair",
      dark: "Sombre",
      system: "Système",
      toggleTheme: "Changer le thème",
      currentTheme: "Thème actuel",
    },
  };
  const t = labels[locale];

  const sizes = sizeMap[size];

  const cycleTheme = useCallback(() => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }, [theme, setTheme]);

  const themeLabel = theme === "light" ? t.light : theme === "dark" ? t.dark : t.system;

  if (variant === "dropdown") {
    return (
      <div className={`relative inline-flex items-center gap-1 ${className}`}>
        {(["light", "dark", "system"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${sizes.text} font-medium transition-all ${
              theme === mode
                ? "bg-[var(--brand-foundation)] text-white shadow-sm dark:bg-[var(--dark-brand-foundation)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--section-bg-2)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)]"
            }`}
            aria-pressed={theme === mode}
            aria-label={`${t.currentTheme}: ${mode === "light" ? t.light : mode === "dark" ? t.dark : t.system}`}
          >
            {mode === "light" && <SunIcon className={sizes.icon} />}
            {mode === "dark" && <MoonIcon className={sizes.icon} />}
            {mode === "system" && <MonitorIcon className={sizes.icon} />}
            <span>{mode === "light" ? t.light : mode === "dark" ? t.dark : t.system}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "switch") {
    return (
      <button
        onClick={cycleTheme}
        className={`group relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
          isDark
            ? "bg-[var(--dark-brand-foundation)]"
            : "bg-[var(--section-bg-5)]"
        } ${className}`}
        role="switch"
        aria-checked={isDark}
        aria-label={t.toggleTheme}
      >
        <span
          className={`inline-flex ${sizes.button} items-center justify-center rounded-full bg-white shadow-md transition-transform ${
            isDark ? "translate-x-8" : "translate-x-0.5"
          }`}
        >
          {isDark ? (
            <MoonIcon className="h-4 w-4 text-[var(--dark-brand-foundation)]" />
          ) : (
            <SunIcon className="h-4 w-4 text-amber-500" />
          )}
        </span>
        {showLabel && (
          <span className={`ml-3 ${sizes.text} font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]`}>
            {themeLabel}
          </span>
        )}
      </button>
    );
  }

  // Default: icon variant
  return (
    <button
      onClick={cycleTheme}
      className={`inline-flex ${sizes.button} items-center justify-center rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-all hover:bg-[var(--section-bg-2)] hover:text-[var(--text-primary)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-elevated)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)] dark:hover:text-[var(--dark-text-primary)] ${className}`}
      aria-label={`${t.toggleTheme} (${themeLabel})`}
      title={`${t.toggleTheme}: ${themeLabel}`}
    >
      <span className="relative">
        {theme === "light" && <SunIcon className={`${sizes.icon} transition-transform duration-300`} />}
        {theme === "dark" && <MoonIcon className={`${sizes.icon} transition-transform duration-300`} />}
        {theme === "system" && <MonitorIcon className={`${sizes.icon} transition-transform duration-300`} />}
      </span>
      {showLabel && (
        <span className={`ml-2 ${sizes.text} font-medium`}>{themeLabel}</span>
      )}
    </button>
  );
}

export default DarkModeToggle;
