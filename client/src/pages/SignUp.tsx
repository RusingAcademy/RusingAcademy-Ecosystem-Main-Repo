/**
 * SignUp — Legacy Clerk route redirect
 * Phase 1: Auth UI/UX Harmonization
 * Redirects /sign-up to /signup (new auth system)
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SignUp() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/signup");
  }, [setLocation]);

  return null;
}
