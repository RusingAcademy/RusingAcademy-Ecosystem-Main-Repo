/**
 * GovernmentReporting — Admin page for government compliance reporting
 * Sprint C4: Wraps the GovernmentComplianceReport component
 */
import { GovernmentComplianceReport } from "@/components/GovernmentComplianceReport";
import { trpc } from '@/lib/trpc';

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Government Reporting", description: "Manage and configure government reporting" },
  fr: { title: "Rapports gouvernementaux", description: "Gérer et configurer rapports gouvernementaux" },
};

export default function GovernmentReporting() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <GovernmentComplianceReport />
    </div>
  );
}
