/**
 * ============================================
 * CONTENT GUIDELINES COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Tone of voice, bilingual content creation,
 * accessibility guidelines, and brand guidelines.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
interface GuidelineSection {
  id: string;
  title: string;
  titleFr: string;
  icon: string;
  items: { title: string; titleFr: string; description: string; descriptionFr: string; do?: string; doFr?: string; dont?: string; dontFr?: string }[];
}

/* ── Content Guidelines Data ── */
const CONTENT_GUIDELINES: GuidelineSection[] = [
  {
    id: "tone",
    title: "Tone of Voice",
    titleFr: "Ton de la communication",
    icon: "🎯",
    items: [
      {
        title: "Professional & Authoritative",
        titleFr: "Professionnel et autoritaire",
        description: "Maintain a professional tone that reflects expertise in language training for the Canadian public service. Avoid startup hype or overly casual language.",
        descriptionFr: "Maintenir un ton professionnel qui reflète l'expertise en formation linguistique pour la fonction publique canadienne. Éviter le jargon startup ou un langage trop décontracté.",
        do: "Our evidence-based approach prepares you for SLE success.",
        doFr: "Notre approche fondée sur des données probantes vous prépare au succès des ELS.",
        dont: "Crush your SLE exam with our amazing hacks!",
        dontFr: "Écrasez votre examen ELS avec nos astuces incroyables !",
      },
      {
        title: "Inclusive & Accessible",
        titleFr: "Inclusif et accessible",
        description: "Use inclusive language that welcomes all public servants regardless of their current language proficiency level.",
        descriptionFr: "Utiliser un langage inclusif qui accueille tous les fonctionnaires, quel que soit leur niveau de compétence linguistique actuel.",
        do: "Whether you're beginning your bilingual journey or refining advanced skills...",
        doFr: "Que vous commenciez votre parcours bilingue ou que vous perfectionniez des compétences avancées...",
        dont: "If you're struggling with basic French...",
        dontFr: "Si vous avez du mal avec le français de base...",
      },
      {
        title: "Bilingual Parity",
        titleFr: "Parité bilingue",
        description: "Both English and French content must be equally polished, complete, and culturally appropriate. French content is not a translation — it is original content.",
        descriptionFr: "Le contenu anglais et français doit être également soigné, complet et culturellement approprié. Le contenu français n'est pas une traduction — c'est un contenu original.",
        do: "Write French content natively, not as a translation of English.",
        doFr: "Rédiger le contenu français nativement, pas comme une traduction de l'anglais.",
        dont: "Translate English content word-for-word into French.",
        dontFr: "Traduire le contenu anglais mot à mot en français.",
      },
      {
        title: "Government-Appropriate",
        titleFr: "Approprié pour le gouvernement",
        description: "Content must align with the expectations and standards of Canadian federal public service professionals.",
        descriptionFr: "Le contenu doit s'aligner sur les attentes et les normes des professionnels de la fonction publique fédérale canadienne.",
        do: "Aligned with Treasury Board language requirements.",
        doFr: "Aligné sur les exigences linguistiques du Conseil du Trésor.",
        dont: "We'll help you game the system!",
        dontFr: "Nous vous aiderons à contourner le système !",
      },
    ],
  },
  {
    id: "bilingual",
    title: "Bilingual Content Creation",
    titleFr: "Création de contenu bilingue",
    icon: "🌐",
    items: [
      {
        title: "Canadian French Standards",
        titleFr: "Normes du français canadien",
        description: "Use Canadian French (fr-CA) conventions, not European French. This includes vocabulary, spelling, and formatting differences.",
        descriptionFr: "Utiliser les conventions du français canadien (fr-CA), pas du français européen. Cela inclut les différences de vocabulaire, d'orthographe et de formatage.",
        do: "Use 'courriel' instead of 'e-mail', 'fin de semaine' instead of 'week-end'.",
        doFr: "Utiliser « courriel » au lieu de « e-mail », « fin de semaine » au lieu de « week-end ».",
      },
      {
        title: "Date & Number Formatting",
        titleFr: "Formatage des dates et nombres",
        description: "Follow Canadian standards: YYYY-MM-DD for dates, proper thousands separators.",
        descriptionFr: "Suivre les normes canadiennes : AAAA-MM-JJ pour les dates, séparateurs de milliers appropriés.",
        do: "EN: $1,234.56 — February 18, 2026 | FR: 1 234,56 $ — 18 février 2026",
        doFr: "EN : $1,234.56 — February 18, 2026 | FR : 1 234,56 $ — 18 février 2026",
      },
      {
        title: "Text Expansion Planning",
        titleFr: "Planification de l'expansion du texte",
        description: "French text is typically 20-30% longer than English. Design UI elements to accommodate this expansion without overflow.",
        descriptionFr: "Le texte français est généralement 20-30% plus long que l'anglais. Concevoir les éléments d'interface pour accommoder cette expansion sans débordement.",
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility (WCAG AA)",
    titleFr: "Accessibilité (WCAG AA)",
    icon: "♿",
    items: [
      {
        title: "Color Contrast",
        titleFr: "Contraste des couleurs",
        description: "Maintain minimum 4.5:1 contrast ratio for normal text and 3:1 for large text, in both light and dark modes.",
        descriptionFr: "Maintenir un ratio de contraste minimum de 4,5:1 pour le texte normal et 3:1 pour le grand texte, dans les modes clair et sombre.",
      },
      {
        title: "Keyboard Navigation",
        titleFr: "Navigation au clavier",
        description: "All interactive elements must be reachable and operable via keyboard. Provide visible focus indicators.",
        descriptionFr: "Tous les éléments interactifs doivent être atteignables et utilisables via le clavier. Fournir des indicateurs de focus visibles.",
      },
      {
        title: "Screen Reader Support",
        titleFr: "Support des lecteurs d'écran",
        description: "Use semantic HTML, ARIA labels, and proper heading hierarchy. Test with NVDA/VoiceOver.",
        descriptionFr: "Utiliser du HTML sémantique, des étiquettes ARIA et une hiérarchie d'en-têtes appropriée. Tester avec NVDA/VoiceOver.",
      },
      {
        title: "Motion Sensitivity",
        titleFr: "Sensibilité au mouvement",
        description: "Respect prefers-reduced-motion. Provide alternatives for animated content.",
        descriptionFr: "Respecter prefers-reduced-motion. Fournir des alternatives pour le contenu animé.",
      },
    ],
  },
  {
    id: "brand",
    title: "Brand Guidelines",
    titleFr: "Directives de la marque",
    icon: "🏛️",
    items: [
      {
        title: "Brand Hierarchy",
        titleFr: "Hiérarchie de la marque",
        description: "Commercial brand names (RusingAcademy, Lingueefy, Barholex Media) in page body. 'Rusinga International Consulting Ltd.' in footer as institutional entity.",
        descriptionFr: "Noms de marque commerciaux (RusingAcademy, Lingueefy, Barholex Media) dans le corps de la page. « Rusinga International Consulting Ltd. » dans le pied de page comme entité institutionnelle.",
      },
      {
        title: "Color Usage",
        titleFr: "Utilisation des couleurs",
        description: "Foundation Teal (#0F3D3E) for primary brand. CTA Copper (#B87333) for call-to-action. HAZY palette for backgrounds and accents.",
        descriptionFr: "Sarcelle fondation (#0F3D3E) pour la marque principale. Cuivre CTA (#B87333) pour les appels à l'action. Palette HAZY pour les arrière-plans et les accents.",
      },
      {
        title: "Typography",
        titleFr: "Typographie",
        description: "Merriweather for display/headings (serif, authoritative). Inter for UI/body text (sans-serif, clean). Both support full French diacritics.",
        descriptionFr: "Merriweather pour les titres/en-têtes (serif, autoritaire). Inter pour le texte UI/corps (sans-serif, épuré). Les deux supportent tous les diacritiques français.",
      },
      {
        title: "Logo Usage",
        titleFr: "Utilisation du logo",
        description: "Maintain clear space around logos. Use SVG format for quality. Respect minimum size requirements. Favicon must be consistent across ecosystem.",
        descriptionFr: "Maintenir un espace libre autour des logos. Utiliser le format SVG pour la qualité. Respecter les exigences de taille minimale. Le favicon doit être cohérent dans tout l'écosystème.",
      },
    ],
  },
];

/* ── ContentGuidelines Component ── */
interface ContentGuidelinesProps {
  className?: string;
}

export function ContentGuidelines({ className = "" }: ContentGuidelinesProps) {
  const { locale } = useLocale();
  const [activeSection, setActiveSection] = useState(CONTENT_GUIDELINES[0].id);

  const labels = {
    en: {
      title: "Content & Brand Guidelines",
      subtitle: "Tone of voice, bilingual standards, accessibility, and brand identity",
      do: "Do",
      dont: "Don't",
    },
    fr: {
      title: "Directives de contenu et de marque",
      subtitle: "Ton de la communication, normes bilingues, accessibilité et identité de marque",
      do: "À faire",
      dont: "À éviter",
    },
  };
  const t = labels[locale];

  const activeGuide = CONTENT_GUIDELINES.find((s) => s.id === activeSection);

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
        {CONTENT_GUIDELINES.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeSection === sec.id
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            aria-selected={activeSection === sec.id}
            role="tab"
          >
            <span>{sec.icon}</span>
            <span>{locale === "fr" ? sec.titleFr : sec.title}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeGuide && (
        <div className="space-y-4">
          {activeGuide.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-5 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {locale === "fr" ? item.titleFr : item.title}
              </h3>
              <p className="mb-3 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                {locale === "fr" ? item.descriptionFr : item.description}
              </p>
              {(item.do || item.dont) && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {item.do && (
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/10">
                      <div className="mb-1 text-xs font-bold uppercase text-green-700 dark:text-green-400">
                        {t.do}
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        {locale === "fr" && item.doFr ? item.doFr : item.do}
                      </p>
                    </div>
                  )}
                  {item.dont && (
                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                      <div className="mb-1 text-xs font-bold uppercase text-red-700 dark:text-red-400">
                        {t.dont}
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {locale === "fr" && item.dontFr ? item.dontFr : item.dont}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ContentGuidelines;
