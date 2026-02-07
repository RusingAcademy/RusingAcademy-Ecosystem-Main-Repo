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
};

export default function AdminControlCenter({ section = "overview" }: Props) {
  const Content = sectionMap[section] || DashboardOverview;
  return (
    <AdminLayout>
      <Content />
    </AdminLayout>
  );
}
