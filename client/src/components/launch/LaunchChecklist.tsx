/**
 * ============================================
 * LAUNCH CHECKLIST, ROLLOUT, FAQ, POST-LAUNCH
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * - Launch checklist with go/no-go criteria
 * - Phased rollout configuration
 * - FAQ updates component
 * - Post-launch review template
 */
import React, { useState, useMemo } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ═══════════════════════════════════════════
   LAUNCH CHECKLIST
   ═══════════════════════════════════════════ */
interface ChecklistItem {
  id: string;
  label: string;
  labelFr: string;
  category: string;
  categoryFr: string;
  goNoGo: boolean; // true = must pass for launch
  checked: boolean;
}

const LAUNCH_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Technical
  { id: "lc-1", label: "Build passes with zero errors", labelFr: "La compilation passe sans erreur", category: "Technical", categoryFr: "Technique", goNoGo: true, checked: false },
  { id: "lc-2", label: "All Core Web Vitals in 'good' range", labelFr: "Tous les Core Web Vitals dans la plage 'bon'", category: "Technical", categoryFr: "Technique", goNoGo: true, checked: false },
  { id: "lc-3", label: "SSL certificate valid and active", labelFr: "Certificat SSL valide et actif", category: "Technical", categoryFr: "Technique", goNoGo: true, checked: false },
  { id: "lc-4", label: "Database backups configured", labelFr: "Sauvegardes de base de données configurées", category: "Technical", categoryFr: "Technique", goNoGo: true, checked: false },
  { id: "lc-5", label: "Error monitoring (Sentry) configured", labelFr: "Surveillance des erreurs (Sentry) configurée", category: "Technical", categoryFr: "Technique", goNoGo: false, checked: false },
  { id: "lc-6", label: "CDN and caching configured", labelFr: "CDN et mise en cache configurés", category: "Technical", categoryFr: "Technique", goNoGo: false, checked: false },
  // Content
  { id: "lc-7", label: "All pages translated (EN/FR)", labelFr: "Toutes les pages traduites (EN/FR)", category: "Content", categoryFr: "Contenu", goNoGo: true, checked: false },
  { id: "lc-8", label: "Legal pages reviewed (Privacy, Terms, Accessibility)", labelFr: "Pages légales révisées (Confidentialité, Conditions, Accessibilité)", category: "Content", categoryFr: "Contenu", goNoGo: true, checked: false },
  { id: "lc-9", label: "FAQ section complete and reviewed", labelFr: "Section FAQ complète et révisée", category: "Content", categoryFr: "Contenu", goNoGo: true, checked: false },
  { id: "lc-10", label: "Press kit prepared", labelFr: "Dossier de presse préparé", category: "Content", categoryFr: "Contenu", goNoGo: false, checked: false },
  // Design
  { id: "lc-11", label: "WCAG AA compliance verified", labelFr: "Conformité WCAG AA vérifiée", category: "Design", categoryFr: "Design", goNoGo: true, checked: false },
  { id: "lc-12", label: "Dark mode tested on all pages", labelFr: "Mode sombre testé sur toutes les pages", category: "Design", categoryFr: "Design", goNoGo: true, checked: false },
  { id: "lc-13", label: "Mobile responsiveness verified", labelFr: "Réactivité mobile vérifiée", category: "Design", categoryFr: "Design", goNoGo: true, checked: false },
  { id: "lc-14", label: "Cross-browser testing complete", labelFr: "Tests multi-navigateurs terminés", category: "Design", categoryFr: "Design", goNoGo: true, checked: false },
  // Operations
  { id: "lc-15", label: "Rollback procedure documented", labelFr: "Procédure de restauration documentée", category: "Operations", categoryFr: "Opérations", goNoGo: true, checked: false },
  { id: "lc-16", label: "Support contact channels ready", labelFr: "Canaux de contact de support prêts", category: "Operations", categoryFr: "Opérations", goNoGo: true, checked: false },
  { id: "lc-17", label: "Analytics tracking configured", labelFr: "Suivi analytique configuré", category: "Operations", categoryFr: "Opérations", goNoGo: false, checked: false },
  { id: "lc-18", label: "Launch announcement prepared", labelFr: "Annonce de lancement préparée", category: "Operations", categoryFr: "Opérations", goNoGo: false, checked: false },
];

interface LaunchChecklistProps {
  className?: string;
}

export function LaunchChecklist({ className = "" }: LaunchChecklistProps) {
  const { locale } = useLocale();
  const [items, setItems] = useState(LAUNCH_CHECKLIST_ITEMS);

  const labels = {
    en: {
      title: "Launch Checklist",
      subtitle: "Go/No-Go criteria for launch readiness",
      goNoGo: "GO/NO-GO",
      optional: "OPTIONAL",
      goStatus: "GO — All critical items complete",
      noGoStatus: "NO-GO — Critical items remaining",
      criticalRemaining: "critical items remaining",
    },
    fr: {
      title: "Liste de contrôle de lancement",
      subtitle: "Critères Go/No-Go pour la préparation au lancement",
      goNoGo: "GO/NO-GO",
      optional: "OPTIONNEL",
      goStatus: "GO — Tous les éléments critiques sont terminés",
      noGoStatus: "NO-GO — Éléments critiques restants",
      criticalRemaining: "éléments critiques restants",
    },
  };
  const t = labels[locale];

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const stats = useMemo(() => {
    const goNoGoItems = items.filter((i) => i.goNoGo);
    const goNoGoChecked = goNoGoItems.filter((i) => i.checked).length;
    const isGo = goNoGoChecked === goNoGoItems.length;
    const totalChecked = items.filter((i) => i.checked).length;
    return { isGo, goNoGoTotal: goNoGoItems.length, goNoGoChecked, totalChecked, total: items.length };
  }, [items]);

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.subtitle}</p>
      </div>

      {/* Go/No-Go Status */}
      <div className={`mb-6 rounded-xl p-4 text-center font-bold ${stats.isGo ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
        {stats.isGo ? t.goStatus : `${t.noGoStatus} (${stats.goNoGoTotal - stats.goNoGoChecked} ${t.criticalRemaining})`}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
          <span>{stats.totalChecked}/{stats.total}</span>
          <span>{Math.round((stats.totalChecked / stats.total) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--section-bg-5)] dark:bg-[var(--dark-section-bg-5)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] transition-all"
            style={{ width: `${(stats.totalChecked / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          return (
            <div key={cat}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                {locale === "fr" ? catItems[0].categoryFr : cat}
              </h3>
              <div className="space-y-1">
                {catItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--section-bg-1)] dark:hover:bg-[var(--dark-section-bg-1)]"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 shrink-0 rounded accent-[var(--brand-foundation)]"
                    />
                    <span className={`flex-1 text-sm ${item.checked ? "text-[var(--text-muted)] line-through dark:text-[var(--dark-text-muted)]" : "text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"}`}>
                      {locale === "fr" ? item.labelFr : item.label}
                    </span>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${item.goNoGo ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"}`}>
                      {item.goNoGo ? t.goNoGo : t.optional}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PHASED ROLLOUT CONFIGURATION
   ═══════════════════════════════════════════ */
interface RolloutPhase {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  audience: string;
  audienceFr: string;
  percentage: number;
  status: "pending" | "active" | "complete";
  criteria: string[];
  criteriaFr: string[];
}

const ROLLOUT_PHASES: RolloutPhase[] = [
  {
    id: "alpha",
    name: "Alpha — Internal Testing",
    nameFr: "Alpha — Tests internes",
    description: "Internal team testing with full feature access. Identify critical bugs and UX issues.",
    descriptionFr: "Tests internes de l'équipe avec accès complet aux fonctionnalités. Identifier les bogues critiques et les problèmes UX.",
    audience: "Core team (5-10 users)",
    audienceFr: "Équipe principale (5-10 utilisateurs)",
    percentage: 1,
    status: "complete",
    criteria: ["Zero critical bugs", "All pages load successfully", "Authentication works"],
    criteriaFr: ["Zéro bogue critique", "Toutes les pages se chargent", "L'authentification fonctionne"],
  },
  {
    id: "beta",
    name: "Beta — Soft Launch",
    nameFr: "Bêta — Lancement doux",
    description: "Invite-only access for selected public servants and language coaches. Gather feedback.",
    descriptionFr: "Accès sur invitation pour des fonctionnaires et coachs linguistiques sélectionnés. Recueillir des commentaires.",
    audience: "Selected beta testers (50-100 users)",
    audienceFr: "Testeurs bêta sélectionnés (50-100 utilisateurs)",
    percentage: 10,
    status: "active",
    criteria: ["Core Web Vitals pass", "Error rate < 1%", "Positive feedback > 80%"],
    criteriaFr: ["Core Web Vitals passent", "Taux d'erreur < 1%", "Commentaires positifs > 80%"],
  },
  {
    id: "soft",
    name: "Soft Launch — Limited Public",
    nameFr: "Lancement doux — Public limité",
    description: "Open registration with limited marketing. Monitor performance and user behavior.",
    descriptionFr: "Inscription ouverte avec marketing limité. Surveiller la performance et le comportement des utilisateurs.",
    audience: "Early adopters (500-1000 users)",
    audienceFr: "Adopteurs précoces (500-1000 utilisateurs)",
    percentage: 25,
    status: "pending",
    criteria: ["Uptime > 99.9%", "Support response < 4h", "No data loss incidents"],
    criteriaFr: ["Disponibilité > 99,9%", "Réponse support < 4h", "Aucun incident de perte de données"],
  },
  {
    id: "full",
    name: "Full Launch — Public",
    nameFr: "Lancement complet — Public",
    description: "Full public launch with marketing campaign. All features available.",
    descriptionFr: "Lancement public complet avec campagne marketing. Toutes les fonctionnalités disponibles.",
    audience: "General public",
    audienceFr: "Grand public",
    percentage: 100,
    status: "pending",
    criteria: ["All soft launch criteria met", "Press kit distributed", "Support team scaled"],
    criteriaFr: ["Tous les critères de lancement doux satisfaits", "Dossier de presse distribué", "Équipe de support dimensionnée"],
  },
];

interface RolloutConfigProps {
  className?: string;
}

export function RolloutConfig({ className = "" }: RolloutConfigProps) {
  const { locale } = useLocale();

  const labels = {
    en: {
      title: "Phased Rollout Configuration",
      subtitle: "Soft launch to full launch progression",
      audience: "Audience",
      criteria: "Advancement Criteria",
      pending: "Pending",
      active: "Active",
      complete: "Complete",
    },
    fr: {
      title: "Configuration de déploiement progressif",
      subtitle: "Progression du lancement doux au lancement complet",
      audience: "Public",
      criteria: "Critères d'avancement",
      pending: "En attente",
      active: "Actif",
      complete: "Terminé",
    },
  };
  const t = labels[locale];

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400",
    active: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    complete: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.subtitle}</p>
      </div>

      <div className="space-y-4">
        {ROLLOUT_PHASES.map((phase, i) => (
          <div
            key={phase.id}
            className={`rounded-xl border p-5 ${
              phase.status === "active"
                ? "border-blue-200 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10"
                : "border-[var(--border-color-light)] bg-[var(--bg-base)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${phase.status === "complete" ? "bg-green-500 text-white" : phase.status === "active" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                  {phase.status === "complete" ? "✓" : i + 1}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {locale === "fr" ? phase.nameFr : phase.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{phase.percentage}%</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[phase.status]}`}>
                  {t[phase.status as keyof typeof t]}
                </span>
              </div>
            </div>
            <p className="mb-2 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
              {locale === "fr" ? phase.descriptionFr : phase.description}
            </p>
            <div className="mb-2 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              <strong>{t.audience}:</strong> {locale === "fr" ? phase.audienceFr : phase.audience}
            </div>
            <div className="text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
              <strong>{t.criteria}:</strong>
              <ul className="ml-4 mt-1 list-disc">
                {(locale === "fr" ? phase.criteriaFr : phase.criteria).map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAQ UPDATES COMPONENT
   ═══════════════════════════════════════════ */
interface FAQItem {
  question: string;
  questionFr: string;
  answer: string;
  answerFr: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is RusingÂcademy?",
    questionFr: "Qu'est-ce que RusingÂcademy ?",
    answer: "RusingÂcademy is Canada's premier bilingual learning ecosystem, designed to prepare public servants for official-language examinations (SLE) through expert coaching, personalized learning paths, and AI-powered practice tools.",
    answerFr: "RusingÂcademy est l'écosystème d'apprentissage bilingue de premier plan au Canada, conçu pour préparer les fonctionnaires aux examens de langues officielles (ELS) grâce à un coaching expert, des parcours d'apprentissage personnalisés et des outils de pratique alimentés par l'IA.",
    category: "General",
  },
  {
    question: "Is the platform bilingual?",
    questionFr: "La plateforme est-elle bilingue ?",
    answer: "Yes, the entire platform is available in both English and French (Canadian). You can switch languages at any time using the language toggle in the header.",
    answerFr: "Oui, toute la plateforme est disponible en anglais et en français (canadien). Vous pouvez changer de langue à tout moment en utilisant le sélecteur de langue dans l'en-tête.",
    category: "General",
  },
  {
    question: "Is the platform accessible?",
    questionFr: "La plateforme est-elle accessible ?",
    answer: "Yes, we are committed to WCAG AA compliance. The platform supports keyboard navigation, screen readers, high contrast modes, and respects motion preferences.",
    answerFr: "Oui, nous nous engageons à respecter la conformité WCAG AA. La plateforme supporte la navigation au clavier, les lecteurs d'écran, les modes de contraste élevé et respecte les préférences de mouvement.",
    category: "Accessibility",
  },
  {
    question: "How is my data protected?",
    questionFr: "Comment mes données sont-elles protégées ?",
    answer: "We follow Canadian privacy standards and best practices. Your data is encrypted in transit and at rest, and we never share personal information with third parties without consent.",
    answerFr: "Nous suivons les normes canadiennes de confidentialité et les meilleures pratiques. Vos données sont chiffrées en transit et au repos, et nous ne partageons jamais les informations personnelles avec des tiers sans consentement.",
    category: "Privacy",
  },
  {
    question: "Can my department purchase group access?",
    questionFr: "Mon département peut-il acheter un accès de groupe ?",
    answer: "Yes, we offer B2B/B2G packages for government departments and organizations. Contact us for volume pricing and custom training programs.",
    answerFr: "Oui, nous offrons des forfaits B2B/B2G pour les départements gouvernementaux et les organisations. Contactez-nous pour les tarifs de volume et les programmes de formation personnalisés.",
    category: "Pricing",
  },
  {
    question: "Does the platform support dark mode?",
    questionFr: "La plateforme supporte-t-elle le mode sombre ?",
    answer: "Yes, the platform features a premium dark mode that respects your system preferences. You can also manually toggle between light, dark, and system modes.",
    answerFr: "Oui, la plateforme dispose d'un mode sombre premium qui respecte vos préférences système. Vous pouvez également basculer manuellement entre les modes clair, sombre et système.",
    category: "Features",
  },
];

interface FAQUpdatesProps {
  className?: string;
}

export function FAQUpdates({ className = "" }: FAQUpdatesProps) {
  const { locale } = useLocale();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const labels = {
    en: { title: "Frequently Asked Questions", subtitle: "Common questions about the RusingÂcademy platform" },
    fr: { title: "Foire aux questions", subtitle: "Questions courantes sur la plateforme RusingÂcademy" },
  };
  const t = labels[locale];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.subtitle}</p>
      </div>
      <div className="space-y-2">
        {FAQ_ITEMS.map((faq, i) => (
          <div key={i} className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]">
            <button
              onClick={() => setExpandedId(expandedId === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              aria-expanded={expandedId === i}
            >
              <span className="font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {locale === "fr" ? faq.questionFr : faq.question}
              </span>
              <svg className={`h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform dark:text-[var(--dark-text-muted)] ${expandedId === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedId === i && (
              <div className="border-t border-[var(--border-color-light)] px-4 py-3 dark:border-[rgba(255,255,255,0.05)]">
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  {locale === "fr" ? faq.answerFr : faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   POST-LAUNCH REVIEW TEMPLATE
   ═══════════════════════════════════════════ */
interface PostLaunchReviewProps {
  className?: string;
}

export function PostLaunchReview({ className = "" }: PostLaunchReviewProps) {
  const { locale } = useLocale();

  const labels = {
    en: {
      title: "Post-Launch Review Template",
      subtitle: "Structured template for post-launch retrospective",
      sections: [
        { title: "Launch Summary", items: ["Launch date and time", "Rollout phase achieved", "Total users onboarded", "Geographic distribution"] },
        { title: "Technical Performance", items: ["Uptime during launch period", "Average response time", "Error rate", "Core Web Vitals scores", "Infrastructure scaling events"] },
        { title: "User Feedback", items: ["Overall satisfaction score", "Top positive feedback themes", "Top negative feedback themes", "Feature requests collected", "Support tickets volume"] },
        { title: "Content & i18n", items: ["Translation issues reported", "Content gaps identified", "French-specific formatting issues", "Language preference distribution (EN vs FR)"] },
        { title: "Lessons Learned", items: ["What went well", "What could be improved", "Unexpected challenges", "Process improvements for next release"] },
        { title: "Action Items", items: ["Critical fixes needed", "Feature improvements planned", "Documentation updates required", "Next milestone targets"] },
      ],
    },
    fr: {
      title: "Modèle de revue post-lancement",
      subtitle: "Modèle structuré pour la rétrospective post-lancement",
      sections: [
        { title: "Résumé du lancement", items: ["Date et heure de lancement", "Phase de déploiement atteinte", "Total d'utilisateurs intégrés", "Distribution géographique"] },
        { title: "Performance technique", items: ["Disponibilité pendant la période de lancement", "Temps de réponse moyen", "Taux d'erreur", "Scores Core Web Vitals", "Événements de mise à l'échelle de l'infrastructure"] },
        { title: "Commentaires des utilisateurs", items: ["Score de satisfaction global", "Principaux thèmes de commentaires positifs", "Principaux thèmes de commentaires négatifs", "Demandes de fonctionnalités collectées", "Volume de tickets de support"] },
        { title: "Contenu et i18n", items: ["Problèmes de traduction signalés", "Lacunes de contenu identifiées", "Problèmes de formatage spécifiques au français", "Distribution des préférences linguistiques (EN vs FR)"] },
        { title: "Leçons apprises", items: ["Ce qui a bien fonctionné", "Ce qui pourrait être amélioré", "Défis inattendus", "Améliorations de processus pour la prochaine version"] },
        { title: "Actions à entreprendre", items: ["Corrections critiques nécessaires", "Améliorations de fonctionnalités planifiées", "Mises à jour de documentation requises", "Objectifs du prochain jalon"] },
      ],
    },
  };
  const t = labels[locale];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{t.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">{t.subtitle}</p>
      </div>
      <div className="space-y-4">
        {t.sections.map((section, i) => (
          <div key={i} className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]">
            <h3 className="mb-3 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
              {i + 1}. {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3 rounded-lg px-2 py-1.5">
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-[var(--border-color-medium)] dark:border-[rgba(255,255,255,0.15)]" />
                  <span className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LaunchChecklist;
