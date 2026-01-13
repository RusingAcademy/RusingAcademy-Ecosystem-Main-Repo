import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Redirect component for /home → /lingueefy (language-aware)
 * This ensures old /home links continue to work
 * 
 * Handles:
 * - /home → /lingueefy
 * - /en/home → /en/lingueefy
 * - /fr/home → /fr/lingueefy
 */
export default function HomeRedirect() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Preserve language prefix in redirect
    let target = "/lingueefy";
    if (location.startsWith("/en/") || location === "/en") {
      target = "/en/lingueefy";
    } else if (location.startsWith("/fr/") || location === "/fr") {
      target = "/fr/lingueefy";
    }
    
    // Perform client-side redirect
    setLocation(target, { replace: true });
  }, [location, setLocation]);

  return null;
}
