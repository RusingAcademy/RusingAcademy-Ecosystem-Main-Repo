import { useLocation } from "wouter";
import { useEffect } from "react";
import EcosystemHeader from "./EcosystemHeader";
import { HubSubHeader, LingueefySubHeader, RusingAcademySubHeader, BarholexSubHeader } from "./subheaders";

interface EcosystemLayoutProps {
  children: React.ReactNode;
}

// Brand types for the ecosystem
type Brand = "ecosystem" | "rusingacademy" | "lingueefy" | "barholex";

// Helper function to strip language prefix from path
function stripLanguagePrefix(path: string): string {
  // Remove /en/ or /fr/ prefix if present
  if (path.startsWith("/en/")) {
    return "/" + path.slice(4);
  }
  if (path.startsWith("/fr/")) {
    return "/" + path.slice(4);
  }
  // Handle /en and /fr without trailing slash (root pages)
  if (path === "/en" || path === "/fr") {
    return "/";
  }
  return path;
}

// Determine which brand is active based on current path
function getBrand(path: string): Brand {
  // Strip language prefix for consistent matching
  const normalizedPath = stripLanguagePrefix(path);
  
  // RusingAcademy pages
  if (normalizedPath.startsWith("/rusingacademy") || normalizedPath === "/courses" || normalizedPath.startsWith("/courses/")) {
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
  
  // Default: Hub/Ecosystem
  return "ecosystem";
}

// Determine which sub-header to show based on current path
function getSubHeader(path: string): React.ReactNode | null {
  // Strip language prefix for consistent matching
  const normalizedPath = stripLanguagePrefix(path);
  
  // Hub pages (root, /en/, /fr/, /ecosystem)
  if (normalizedPath === "/" || normalizedPath === "/ecosystem") {
    return <HubSubHeader />;
  }
  
  // RusingAcademy pages
  if (normalizedPath.startsWith("/rusingacademy") || normalizedPath === "/courses" || normalizedPath.startsWith("/courses/")) {
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
  
  // Default: no sub-header for other pages (dashboard, auth, etc.)
  return null;
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

function shouldShowEcosystemHeader(path: string): boolean {
  // Strip language prefix for consistent matching
  const normalizedPath = stripLanguagePrefix(path);
  return !EXCLUDED_PATHS.some(excluded => 
    normalizedPath === excluded || normalizedPath.startsWith(excluded + "/")
  );
}

export default function EcosystemLayout({ children }: EcosystemLayoutProps) {
  const [location] = useLocation();
  
  const showHeader = shouldShowEcosystemHeader(location);
  const subHeader = showHeader ? getSubHeader(location) : null;
  const brand = getBrand(location);

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
