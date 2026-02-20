/**
 * AdminAnalytics Page — Re-exports the AdminAnalytics component
 */
import { useLanguage } from "@/contexts/LanguageContext";
import AdminAnalyticsComponent from "@/components/AdminAnalytics";

const labels = {
  en: { title: "Analytics Dashboard", subtitle: "Platform metrics and insights" },
  fr: { title: "Tableau de bord analytique", subtitle: "Métriques et aperçus de la plateforme" },
};

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;
  return <AdminAnalyticsComponent />;
}
