/**
 * SignIn — Legacy Clerk route redirect
 * Phase 1: Auth UI/UX Harmonization
 * Redirects /sign-in to /login (new auth system)
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Sign In", description: "Manage and configure sign in" },
  fr: { title: "Sign In", description: "Gérer et configurer sign in" },
};

export default function SignIn() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/login");
  }, [setLocation]);

  return null;
}
