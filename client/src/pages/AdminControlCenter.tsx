import AdminLayout from "@/components/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { lazy, Suspense } from "react";

const labels = {
  en: { title: "Admin Control Center", description: "Manage and configure admin control center" },
  fr: { title: "Admin Control Center", description: "Gérer et configurer admin control center" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Lazy-loaded admin sections — each loads on demand instead of all at once
// This reduces the initial AdminControlCenter bundle from ~1.6MB to ~50KB
// ═══════════════════════════════════════════════════════════════════════════════

const sectionMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // ── Dashboard ──
  overview: lazy(() => import("./admin/DashboardOverview")),
  // ── Products ──
  "all-products": lazy(() => import("./admin/AllProducts")),
  courses: lazy(() => import("./admin/CourseBuilder")),
  coaches: lazy(() => import("./admin/CoachesManagement")),
  podcasts: lazy(() => import("./admin/PodcastsAdmin")),
  newsletters: lazy(() => import("./admin/NewslettersAdmin")),
  downloads: lazy(() => import("./admin/DownloadsAdmin")),
  community: lazy(() => import("./admin/CommunityAdmin")),
  // ── Sales ──
  payments: lazy(() => import("./admin/PaymentsAdmin")),
  offers: lazy(() => import("./admin/OffersAdmin")),
  pricing: lazy(() => import("./admin/PricingCheckout")),
  coupons: lazy(() => import("./admin/CouponsPage")),
  cart: lazy(() => import("./admin/CartAdmin")),
  invoices: lazy(() => import("./admin/InvoicesAdmin")),
  affiliates: lazy(() => import("./admin/AffiliatesAdmin")),
  // ── Website ──
  design: lazy(() => import("./admin/DesignAdmin")),
  pages: lazy(() => import("./admin/PageBuilder")),
  navigation: lazy(() => import("./admin/NavigationAdmin")),
  blog: lazy(() => import("./admin/BlogAdmin")),
  "preview-mode": lazy(() => import("./admin/PreviewMode")),
  // ── Marketing ──
  marketing: lazy(() => import("./admin/MarketingOverview")),
  inbox: lazy(() => import("./admin/InboxAdmin")),
  email: lazy(() => import("./admin/EmailPage")),
  "email-templates": lazy(() => import("./admin/EmailTemplateBuilder")),
  forms: lazy(() => import("./admin/FormsAdmin")),
  events: lazy(() => import("./admin/EventsAdmin")),
  funnels: lazy(() => import("./admin/FunnelBuilder")),
  automations: lazy(() => import("./admin/Automations")),
  // ── Contacts ──
  contacts: lazy(() => import("./admin/AllContacts")),
  users: lazy(() => import("./admin/UsersRoles")),
  crm: lazy(() => import("./admin/CRMPage")),
  "contact-insights": lazy(() => import("./admin/ContactInsights")),
  assessments: lazy(() => import("./admin/AssessmentsAdmin")),
  // ── Analytics ──
  analytics: lazy(() => import("./admin/Analytics")),
  "sales-analytics": lazy(() => import("./admin/SalesAnalytics")),
  "live-kpi": lazy(() => import("./admin/LiveKPIDashboard")),
  reports: lazy(() => import("./admin/ReportsAdmin")),
  "gov-reporting": lazy(() => import("./admin/GovernmentReporting")),
  "webhook-health": lazy(() => import("./admin/WebhookHealthDashboard")),
  // ── More / Settings ──
  settings: lazy(() => import("./admin/AdminSettings")),
  activity: lazy(() => import("./admin/ActivityLogs")),
  preview: lazy(() => import("./admin/PreviewStudent")),
  "ai-companion": lazy(() => import("./admin/AICompanionPanel")),
  "media-library": lazy(() => import("./admin/MediaLibrary")),
  permissions: lazy(() => import("./admin/RBACPermissions")),
  notifications: lazy(() => import("./admin/NotificationsCenter")),
  "import-export": lazy(() => import("./admin/ImportExport")),
  "ai-predictive": lazy(() => import("./admin/AIPredictive")),
  "stripe-testing": lazy(() => import("./admin/StripeTesting")),
  onboarding: lazy(() => import("./admin/OnboardingWorkflow")),
  enterprise: lazy(() => import("./admin/EnterpriseMode")),
  "sle-exam": lazy(() => import("./admin/SLEExamMode")),
  "content-intelligence": lazy(() => import("./admin/ContentIntelligence")),
  "drip-content": lazy(() => import("./admin/DripContent")),
  "ab-testing": lazy(() => import("./admin/ABTesting")),
  "org-billing": lazy(() => import("./admin/OrgBillingDashboard")),
  "weekly-challenges": lazy(() => import("./admin/WeeklyChallenges")),
  enrollments: lazy(() => import("./admin/AdminEnrollments")),
  reviews: lazy(() => import("./admin/AdminReviews")),
  certificates: lazy(() => import("./admin/AdminCertificates")),
  gamification: lazy(() => import("./admin/AdminGamification")),
  "content-pipeline": lazy(() => import("./admin/ContentPipelineDashboard")),
  "quiz-management": lazy(() => import("./admin/QuizManagement")),
  "learning-paths": lazy(() => import("./admin/LearningPathBuilder")),
  "content-workflow": lazy(() => import("./admin/ContentWorkflowBoard")),
  // Phase 0.1: Feature Flags
  "feature-flags": lazy(() => import("./admin/FeatureFlags")),
  "membership-tiers": lazy(() => import("./admin/MembershipTiers")),
  "landing-pages": lazy(() => import("./admin/LandingPages")),
  "email-sequences": lazy(() => import("./admin/EmailSequences")),
  "theme-customizer": lazy(() => import("./admin/ThemeCustomizer")),
  "group-sessions": lazy(() => import("./admin/GroupSessions")),
  "automation-engine": lazy(() => import("./admin/AutomationEngine")),
  "learner-360": lazy(() => import("./admin/Learner360")),
  "analytics-dashboard": lazy(() => import("./admin/AnalyticsDashboard")),
  "public-api": lazy(() => import("./admin/PublicApi")),
};

const DefaultOverview = lazy(() => import("./admin/DashboardOverview"));

function AdminSectionFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#1a3d3d] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading section...</p>
      </div>
    </div>
  );
}

interface Props {
  section?: string;
}

export default function AdminControlCenter({ section = "overview" }: Props) {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;
  const Content = sectionMap[section] || DefaultOverview;

  return (
    <AdminLayout>
      <Suspense fallback={<AdminSectionFallback />}>
        <Content />
      </Suspense>
    </AdminLayout>
  );
}
