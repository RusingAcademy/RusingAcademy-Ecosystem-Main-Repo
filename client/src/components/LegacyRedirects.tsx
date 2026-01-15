import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Legacy URL Redirects
 * 
 * Handles 301-style redirects for legacy URLs to their canonical equivalents.
 * Language-aware: preserves /en/ or /fr/ prefix when redirecting.
 * 
 * SAFETY RULES:
 * - NO language-based redirects (/ → /en is FORBIDDEN)
 * - Only legacy path → canonical path redirects
 * - Maximum 1 hop (no redirect chains)
 * - If no clear equivalent, let 404 handle it
 */

interface LegacyRedirect {
  from: string;
  to: string;
  description: string;
}

/**
 * Legacy redirect mappings
 * Format: { from: legacy path (without lang prefix), to: canonical path (without lang prefix) }
 */
const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // /home was the old Lingueefy homepage
  { from: "/home", to: "/lingueefy", description: "Old homepage → Lingueefy" },
  
  // /platform was used in early documentation
  { from: "/platform", to: "/rusingacademy", description: "Old platform → RusingÂcademy" },
  
  // /academy shorthand
  { from: "/academy", to: "/rusingacademy", description: "Academy shorthand → RusingÂcademy" },
  
  // /media shorthand for Barholex
  { from: "/media", to: "/barholex", description: "Media shorthand → Barholex" },
  
  // /coach singular → /coaches plural
  { from: "/coach", to: "/coaches", description: "Singular → Plural coaches" },
];

/**
 * Extract language prefix from path
 */
function extractLangPrefix(path: string): { lang: string; basePath: string } {
  if (path.startsWith("/en/") || path === "/en") {
    return { lang: "/en", basePath: path.replace(/^\/en/, "") || "/" };
  }
  if (path.startsWith("/fr/") || path === "/fr") {
    return { lang: "/fr", basePath: path.replace(/^\/fr/, "") || "/" };
  }
  return { lang: "", basePath: path };
}

/**
 * Check if current path matches a legacy redirect and return target
 */
function findRedirectTarget(currentPath: string): string | null {
  const { lang, basePath } = extractLangPrefix(currentPath);
  
  for (const redirect of LEGACY_REDIRECTS) {
    // Check exact match (without trailing slash variations)
    const normalizedFrom = redirect.from.replace(/\/$/, "");
    const normalizedBasePath = basePath.replace(/\/$/, "") || "/";
    
    if (normalizedBasePath === normalizedFrom) {
      // Preserve language prefix in redirect target
      return lang + redirect.to;
    }
  }
  
  return null;
}

/**
 * LegacyRedirectHandler component
 * 
 * Place this at the top level of your app to handle legacy URL redirects.
 * It checks the current URL and redirects if it matches a legacy pattern.
 */
export function LegacyRedirectHandler() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    const target = findRedirectTarget(location);
    if (target && target !== location) {
      // Perform client-side redirect (replace to avoid back button issues)
      setLocation(target, { replace: true });
    }
  }, [location, setLocation]);
  
  return null;
}

/**
 * Export the redirect mappings for documentation/testing
 */
export { LEGACY_REDIRECTS, findRedirectTarget };
