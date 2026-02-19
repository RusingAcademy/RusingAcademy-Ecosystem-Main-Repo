/**
 * UniversalBreadcrumb — Phase 1: Portal Orchestration
 *
 * Auto-generates breadcrumbs from the current route path.
 * Supports bilingual labels, portal-aware prefixes, and manual overrides.
 * Integrates with JSON-LD structured data for SEO.
 *
 * Usage:
 *   <UniversalBreadcrumb />                    — auto from route
 *   <UniversalBreadcrumb items={[...]} />      — manual override
 *   <UniversalBreadcrumb portal="admin" />     — force portal context
 */
import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbSegment {
  label: string;
  labelFr?: string;
  href?: string;
}

interface UniversalBreadcrumbProps {
  /** Manual override — if provided, auto-generation is skipped */
  items?: BreadcrumbSegment[];
  /** Force a portal context prefix (admin, coach, learner, hr) */
  portal?: "admin" | "coach" | "learner" | "hr" | "public";
  /** Additional CSS classes */
  className?: string;
  /** Compact mode for tight layouts (smaller text, no home icon) */
  compact?: boolean;
  /** Show JSON-LD structured data for SEO */
  seo?: boolean;
}

// ── Route-to-Label Mapping ───────────────────────────────────────────────────

const SEGMENT_LABELS: Record<string, { en: string; fr: string }> = {
  // Portals
  admin: { en: "Admin", fr: "Administration" },
  coach: { en: "Coach", fr: "Coach" },
  learn: { en: "Learn", fr: "Apprendre" },
  hr: { en: "HR Portal", fr: "Portail RH" },
  dashboard: { en: "Dashboard", fr: "Tableau de bord" },

  // Admin sections
  products: { en: "Products", fr: "Produits" },
  courses: { en: "Courses", fr: "Cours" },
  "course-builder": { en: "Course Builder", fr: "Constructeur de cours" },
  curriculum: { en: "Curriculum", fr: "Programme" },
  lessons: { en: "Lessons", fr: "Leçons" },
  quizzes: { en: "Quizzes", fr: "Quiz" },
  users: { en: "Users", fr: "Utilisateurs" },
  coaches: { en: "Coaches", fr: "Coachs" },
  learners: { en: "Learners", fr: "Apprenants" },
  analytics: { en: "Analytics", fr: "Analytique" },
  settings: { en: "Settings", fr: "Paramètres" },
  sales: { en: "Sales", fr: "Ventes" },
  marketing: { en: "Marketing", fr: "Marketing" },
  contacts: { en: "Contacts", fr: "Contacts" },
  website: { en: "Website", fr: "Site web" },
  payments: { en: "Payments", fr: "Paiements" },
  coupons: { en: "Coupons", fr: "Coupons" },
  reports: { en: "Reports", fr: "Rapports" },
  "email-campaigns": { en: "Email Campaigns", fr: "Campagnes email" },
  newsletter: { en: "Newsletter", fr: "Infolettre" },
  cms: { en: "CMS", fr: "CMS" },
  pages: { en: "Pages", fr: "Pages" },
  blog: { en: "Blog", fr: "Blog" },
  seo: { en: "SEO", fr: "SEO" },
  security: { en: "Security", fr: "Sécurité" },
  integrations: { en: "Integrations", fr: "Intégrations" },
  notifications: { en: "Notifications", fr: "Notifications" },
  gamification: { en: "Gamification", fr: "Gamification" },
  badges: { en: "Badges", fr: "Badges" },
  leaderboard: { en: "Leaderboard", fr: "Classement" },
  pipeline: { en: "Pipeline", fr: "Pipeline" },
  crm: { en: "CRM", fr: "CRM" },
  automation: { en: "Automation", fr: "Automatisation" },
  "ai-companion": { en: "AI Companion", fr: "Compagnon IA" },
  "sle-companion": { en: "SLE Companion", fr: "Compagnon ELS" },
  community: { en: "Community", fr: "Communauté" },
  messages: { en: "Messages", fr: "Messages" },
  calendar: { en: "Calendar", fr: "Calendrier" },
  sessions: { en: "Sessions", fr: "Sessions" },
  profile: { en: "Profile", fr: "Profil" },
  earnings: { en: "Earnings", fr: "Revenus" },
  reviews: { en: "Reviews", fr: "Avis" },
  availability: { en: "Availability", fr: "Disponibilité" },
  progress: { en: "Progress", fr: "Progrès" },
  achievements: { en: "Achievements", fr: "Réalisations" },
  departments: { en: "Departments", fr: "Départements" },
  employees: { en: "Employees", fr: "Employés" },
  training: { en: "Training", fr: "Formation" },
  compliance: { en: "Compliance", fr: "Conformité" },
  "health-monitor": { en: "Health Monitor", fr: "Moniteur de santé" },
  "system-health": { en: "System Health", fr: "Santé du système" },
  "ab-testing": { en: "A/B Testing", fr: "Tests A/B" },
  "feature-flags": { en: "Feature Flags", fr: "Drapeaux de fonctionnalités" },
  onboarding: { en: "Onboarding", fr: "Intégration" },
  "stripe-connect": { en: "Stripe Connect", fr: "Stripe Connect" },
  pricing: { en: "Pricing", fr: "Tarification" },
  about: { en: "About", fr: "À propos" },
  faq: { en: "FAQ", fr: "FAQ" },
  lingueefy: { en: "Lingueefy", fr: "Lingueefy" },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isNumericOrUUID(segment: string): boolean {
  return /^\d+$/.test(segment) || /^[0-9a-f-]{36}$/i.test(segment);
}

function humanize(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Component ────────────────────────────────────────────────────────────────

export function UniversalBreadcrumb({
  items: manualItems,
  portal,
  className,
  compact = false,
  seo = true,
}: UniversalBreadcrumbProps) {
  const [location] = useLocation();
  const { language } = useLanguage();
  const isEn = language === "en";

  const breadcrumbs = useMemo(() => {
    if (manualItems) return manualItems;

    const segments = location.split("/").filter(Boolean);
    const crumbs: BreadcrumbSegment[] = [];
    let pathAccumulator = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      pathAccumulator += `/${seg}`;

      // Skip numeric IDs and UUIDs — they are detail pages, not navigable levels
      if (isNumericOrUUID(seg)) continue;

      const mapping = SEGMENT_LABELS[seg];
      const isLast = i === segments.length - 1;

      crumbs.push({
        label: mapping?.en || humanize(seg),
        labelFr: mapping?.fr || humanize(seg),
        href: isLast ? undefined : pathAccumulator,
      });
    }

    return crumbs;
  }, [location, manualItems]);

  // JSON-LD for SEO
  const jsonLd = useMemo(() => {
    if (!seo) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEn ? "Home" : "Accueil",
          item: typeof window !== "undefined" ? window.location.origin : "",
        },
        ...breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 2,
          name: isEn ? crumb.label : crumb.labelFr || crumb.label,
          item: crumb.href
            ? typeof window !== "undefined"
              ? `${window.location.origin}${crumb.href}`
              : crumb.href
            : undefined,
        })),
      ],
    };
  }, [breadcrumbs, isEn, seo]);

  if (breadcrumbs.length === 0) return null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <nav
        className={cn(
          "flex items-center gap-1.5 flex-wrap",
          compact ? "text-xs" : "text-sm",
          "text-muted-foreground",
          className
        )}
        aria-label="Breadcrumb"
      >
        {/* Home */}
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-teal-600 transition-colors"
        >
          {!compact && <Home className="h-3.5 w-3.5" />}
          <span>{isEn ? "Home" : "Accueil"}</span>
        </Link>

        {/* Dynamic segments */}
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const displayLabel = isEn
            ? crumb.label
            : crumb.labelFr || crumb.label;

          return (
            <span key={index} className="flex items-center gap-1.5">
              <ChevronRight
                className={cn("flex-shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")}
                aria-hidden="true"
              />
              {isLast || !crumb.href ? (
                <span
                  className={cn(
                    "font-medium",
                    isLast ? "text-foreground" : ""
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {displayLabel}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-teal-600 transition-colors"
                >
                  {displayLabel}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default UniversalBreadcrumb;
