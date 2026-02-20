/**
 * SignUp — Legacy Clerk route redirect
 * Phase 1: Auth UI/UX Harmonization
 * Redirects /sign-up to /signup (new auth system)
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Sign Up", description: "Manage and configure sign up" },
  fr: { title: "Sign Up", description: "Gérer et configurer sign up" },
};

export default function SignUp() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/signup");
  }, [setLocation]);

  return null;
}
