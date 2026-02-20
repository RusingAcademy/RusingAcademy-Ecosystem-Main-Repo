// client/src/pages/admin/FeatureFlags.tsx — Phase 0.1: Feature Flags Admin Page
import FeatureFlagsManager from "@/components/admin/FeatureFlagsManager";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Feature Flags", description: "Manage and configure feature flags" },
  fr: { title: "Indicateurs de fonctionnalités", description: "Gérer et configurer indicateurs de fonctionnalités" },
};

export default function FeatureFlags() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return <FeatureFlagsManager />;
}
