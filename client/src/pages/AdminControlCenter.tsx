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
} from "./admin";

interface Props {
  section?: string;
}

const sectionMap: Record<string, React.ComponentType> = {
  overview: DashboardOverview,
  users: UsersRoles,
  coaches: CoachesManagement,
  courses: CourseBuilder,
  pricing: PricingCheckout,
  coupons: CouponsPage,
  crm: CRMPage,
  email: EmailPage,
  analytics: Analytics,
  activity: ActivityLogs,
  preview: PreviewStudent,
  settings: AdminSettings,
  funnels: FunnelBuilder,
  automations: Automations,
  pages: PageBuilder,
  "ai-companion": AICompanionPanel,
  "sales-analytics": SalesAnalytics,
  "media-library": MediaLibrary,
  permissions: RBACPermissions,
  "email-templates": EmailTemplateBuilder,
  notifications: NotificationsCenter,
  "import-export": ImportExport,
  "preview-mode": PreviewMode,
  "ai-predictive": AIPredictive,
  "stripe-testing": StripeTesting,
  "live-kpi": LiveKPIDashboard,
  onboarding: OnboardingWorkflow,
  enterprise: EnterpriseMode,
  "sle-exam": SLEExamMode,
  "content-intelligence": ContentIntelligence,
};

export default function AdminControlCenter({ section = "overview" }: Props) {
  const Content = sectionMap[section] || DashboardOverview;
  return (
    <AdminLayout>
      <Content />
    </AdminLayout>
  );
}
