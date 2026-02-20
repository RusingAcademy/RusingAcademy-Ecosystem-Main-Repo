import { useEffect } from "react";
import { useLocation } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Home Redirect", description: "Manage and configure home redirect" },
  fr: { title: "Home Redirect", description: "Gérer et configurer home redirect" },
};

/**
 * Redirect component for /home → /lingueefy
 * This ensures old /home links continue to work
 */
export default function HomeRedirect() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, setLocation] = useLocation();

  useEffect(() => {
    // Perform client-side redirect to /lingueefy
    setLocation("/lingueefy", { replace: true });
  }, [setLocation]);

  return null;
}
