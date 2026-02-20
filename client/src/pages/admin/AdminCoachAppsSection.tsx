/**
 * AdminCoachAppsSection — Wrapper for Coach Applications inside AdminControlCenter
 * 
 * This component wraps the existing AdminApplicationDashboard component
 * so it renders inside the unified AdminLayout sidebar shell.
 * The standalone AdminCoachApplications page is preserved as a legacy route.
 */
import { AdminApplicationDashboard } from "@/components/AdminApplicationDashboard";
import { trpc } from '@/lib/trpc';

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Coach Applications", description: "Manage and configure coach applications" },
  fr: { title: "Candidatures de coachs", description: "Gérer et configurer candidatures de coachs" },
};

export default function AdminCoachAppsSection() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Coach Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review, approve, and manage coach applications
        </p>
      </div>
      <AdminApplicationDashboard />
    </div>
  );
}
