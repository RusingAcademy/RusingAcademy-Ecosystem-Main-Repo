/**
 * SignIn — Legacy Clerk route redirect
 * Phase 1: Auth UI/UX Harmonization
 * Redirects /sign-in to /login (new auth system)
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SignIn() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/login");
  }, [setLocation]);

  return null;
}
