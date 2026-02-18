import { useLanguage } from "@/contexts/LanguageContext";

/**
 * SkipToContent — Accessibility component for keyboard navigation.
 * Provides a visually hidden link that becomes visible on focus,
 * allowing keyboard users to skip directly to the main content area.
 * 
 * WCAG 2.1 Level A requirement (Success Criterion 2.4.1).
 */
export function SkipToContent() {
  const { language } = useLanguage();
  const label = language === "fr" ? "Aller au contenu principal" : "Skip to main content";

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {label}
    </a>
  );
}
