import { useLocation } from "wouter";
import { useEffect } from "react";
import EcosystemHeader from "./EcosystemHeader";
import { HubSubHeader, LingueefySubHeader, RusingAcademySubHeader, BarholexSubHeader } from "./subheaders";
import { normalizePath } from "@/utils/pathNormalizer";


interface EcosystemLayoutProps {
  children: React.ReactNode;
}


// Brand types for the ecosystem
type Brand = "ecosystem" | "rusingacademy" | "lingueefy" | "barholex";


/**
 * Determine which brand is active based on normalized path.
 * ALWAYS returns a valid Brand - never null/undefined.
 * 
 * @param normalizedPath - The path WITHOUT language prefix (e.g., "/lingueefy" not "/en/lingueefy")
 * @returns Brand - always returns a valid value, defaults to "ecosystem"
 */
function getBrandSafe(normalizedPath: string): Brand {
  // RusingAcademy pages
  if (
    normalizedPath.startsWith("/rusingacademy") || 
    normalizedPath === "/courses" || 
    normalizedPath.startsWith("/courses/")
  ) {
    return "rusingacademy";
  }
  
  // Lingueefy pages
  if (
    normalizedPath.startsWith("/lingueefy") || 
    normalizedPath === "/coaches" || 
    normalizedPath.startsWith("/coaches/") ||
    normalizedPath === "/coach" ||
    normalizedPath.startsWith("/coach/") ||
    normalizedPath === "/prof-steven-ai" ||
    normalizedPath === "/become-a-coach" ||
    normalizedPath === "/pricing" ||
    normalizedPath === "/faq"
  ) {
    return "lingueefy";
  }
  
  // Barholex Media pages
  if (normalizedPath.startsWith("/barholex")) {
    return "barholex";
  }
  
  // Default: Hub/Ecosystem - ALWAYS return a valid value
  return "ecosystem";
}


/**
 * Determine which sub-header to show based on normalized path.
 * ALWAYS returns a valid React node - never null for public pages.
 * 
 * @param normalizedPath - The path WITHOUT language prefix
 * @returns React.ReactNode - always returns a component, defaults to HubSubHeader
 */
function getSubHeaderSafe(normalizedPath: string): React.ReactNode {
  // Hub pages (root, ecosystem) - Page 13 design: NO sub-header on homepage
  if (normalizedPath === "/" || normalizedPath === "/ecosystem") {
    return null;
  }
  
  // RusingAcademy pages
  if (
    normalizedPath.startsWith("/rusingacademy") || 
    normalizedPath === "/courses" || 
    normalizedPath.startsWith("/courses/")
  ) {
    return <RusingAcademySubHeader />;
  }
  
  // Lingueefy pages
  if (
    normalizedPath.startsWith("/lingueefy") || 
    normalizedPath === "/coaches" || 
    normalizedPath.startsWith("/coaches/") ||
    normalizedPath === "/coach" ||
    normalizedPath.startsWith("/coach/") ||
    normalizedPath === "/prof-steven-ai" ||
    normalizedPath === "/become-a-coach" ||
    normalizedPath === "/pricing" ||
    normalizedPath === "/faq"
  ) {
    return <LingueefySubHeader />;
  }
  
  // Barholex Media pages
  if (normalizedPath.startsWith("/barholex")) {
    return <BarholexSubHeader />;
  }
  
  // Default: HubSubHeader for any unknown public page
  // This ensures we ALWAYS render something, never null
  return <HubSubHeader />;
}


// Pages that should NOT show the ecosystem header
const EXCLUDED_PATHS = [
  "/login",
  "/signup",
  "/set-password",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/dashboard",
  "/admin",
  "/coach/dashboard",
  "/hr",
  "/learner",
  "/my-learning",
  "/my-sessions",
  "/settings",
  "/progress",
  "/payments",
  "/favorites",
  "/rewards",
  "/referrals",
  "/messages",
  "/session",
];


/**
 * Check if the ecosystem header should be shown for this path.
 * Uses normalized path (without language prefix).
 */
function shouldShowEcosystemHeader(normalizedPath: string): boolean {
  return !EXCLUDED_PATHS.some(excluded => 
    normalizedPath === excluded || normalizedPath.startsWith(excluded + "/")
  );
}


export default function EcosystemLayout({ children }: EcosystemLayoutProps) {
  const [location] = useLocation();
  
  // CRITICAL: Normalize the path to strip language prefix
  // This ensures /en/lingueefy and /lingueefy both match correctly
  const { path: normalizedPath } = normalizePath(location);
  
  const showHeader = shouldShowEcosystemHeader(normalizedPath);
  const subHeader = showHeader ? getSubHeaderSafe(normalizedPath) : null;
  const brand = getBrandSafe(normalizedPath);


  // Set data-brand attribute on body for CSS token overrides
  useEffect(() => {
    document.body.setAttribute("data-brand", brand);
    return () => {
      document.body.removeAttribute("data-brand");
    };
  }, [brand]);


  if (!showHeader) {
    return <>{children}</>;
  }


  return (
    <div className="min-h-screen flex flex-col" data-brand={brand}>
      <EcosystemHeader />
      {subHeader}
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
