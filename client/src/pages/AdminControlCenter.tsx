import AdminLayout from "@/components/AdminLayout";
import {
  DashboardOverview,
  UsersRoles,
  CoachesManagement,
  CourseBuilder,
  PricingCheckout,
  CouponsPage,
  CRMPage,
  EmailPage,
  Analytics,
  ActivityLogs,
  PreviewStudent,
  AdminSettings,
  FunnelBuilder,
  Automations,
  PageBuilder,
  AICompanionPanel,
  SalesAnalytics,
  MediaLibrary,
  RBACPermissions,
  EmailTemplateBuilder,
  NotificationsCenter,
  ImportExport,
  PreviewMode,
  AIPredictive,
  StripeTesting,
  LiveKPIDashboard,
  OnboardingWorkflow,
  EnterpriseMode,
  SLEExamMode,
  ContentIntelligence,
  DripContent,
  ABTesting,
  OrgBillingDashboard,
  WeeklyChallenges,
  AdminEnrollments,
  AdminReviews,
  AdminCertificates,
  AdminGamification,
  // ═══ Kajabi Integration — New Pages ═══
  AllProducts,
  PodcastsAdmin,
  NewslettersAdmin,
  DownloadsAdmin,
  CommunityAdmin,
  PaymentsAdmin,
  OffersAdmin,
  CartAdmin,
  InvoicesAdmin,
  AffiliatesAdmin,
  DesignAdmin,
  NavigationAdmin,
  BlogAdmin,
  MarketingOverview,
  InboxAdmin,
  FormsAdmin,
  EventsAdmin,
  AllContacts,
  ContactInsights,
  AssessmentsAdmin,
  ReportsAdmin,
} from "./admin";

interface Props {
  section?: string;
}

const sectionMap: Record<string, React.ComponentType> = {
  // ── Dashboard ──
  overview: DashboardOverview,

  // ── Products ──
  "all-products": AllProducts,
  courses: CourseBuilder,
  coaches: CoachesManagement,
  podcasts: PodcastsAdmin,
  newsletters: NewslettersAdmin,
  downloads: DownloadsAdmin,
  community: CommunityAdmin,

  // ── Sales ──
  payments: PaymentsAdmin,
  offers: OffersAdmin,
  pricing: PricingCheckout,
  coupons: CouponsPage,
  cart: CartAdmin,
  invoices: InvoicesAdmin,
  affiliates: AffiliatesAdmin,

  // ── Website ──
  design: DesignAdmin,
  pages: PageBuilder,
  navigation: NavigationAdmin,
  blog: BlogAdmin,
  "preview-mode": PreviewMode,

  // ── Marketing ──
  marketing: MarketingOverview,
  inbox: InboxAdmin,
  email: EmailPage,
  "email-templates": EmailTemplateBuilder,
  forms: FormsAdmin,
  events: EventsAdmin,
  funnels: FunnelBuilder,
  automations: Automations,

  // ── Contacts ──
  contacts: AllContacts,
  users: UsersRoles,
  crm: CRMPage,
  "contact-insights": ContactInsights,
  assessments: AssessmentsAdmin,

  // ── Analytics ──
  analytics: Analytics,
  "sales-analytics": SalesAnalytics,
  "live-kpi": LiveKPIDashboard,
  reports: ReportsAdmin,

  // ── More / Settings ──
  settings: AdminSettings,
  activity: ActivityLogs,
  preview: PreviewStudent,
  "ai-companion": AICompanionPanel,
  "media-library": MediaLibrary,
  permissions: RBACPermissions,
  notifications: NotificationsCenter,
  "import-export": ImportExport,
  "ai-predictive": AIPredictive,
  "stripe-testing": StripeTesting,
  onboarding: OnboardingWorkflow,
  enterprise: EnterpriseMode,
  "sle-exam": SLEExamMode,
  "content-intelligence": ContentIntelligence,
  "drip-content": DripContent,
  "ab-testing": ABTesting,
  "org-billing": OrgBillingDashboard,
  "weekly-challenges": WeeklyChallenges,
  enrollments: AdminEnrollments,
  reviews: AdminReviews,
  certificates: AdminCertificates,
  gamification: AdminGamification,
};

export default function AdminControlCenter({ section = "overview" }: Props) {
  const Content = sectionMap[section] || DashboardOverview;
  return (
    <AdminLayout>
      <Content />
    </AdminLayout>
  );
}
