import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

// Steven Barholere avatar for Human+AI signature
const STEVEN_AVATAR = "/images/team/steven-barholere.jpg";

// Brand tiles configuration with design token colors
interface BrandTile {
  id: string;
  name: string;
  path: string;
  logo: React.ReactNode;
}

const brandTiles: BrandTile[] = [
  {
    id: "rusingacademy",
    name: "RusingÂcademy",
    path: "/rusingacademy",
    logo: <span className="font-bold text-xl mr-2">R</span>,
  },
  {
    id: "lingueefy",
    name: "Lingueefy",
    path: "/lingueefy",
    logo: (
      <img 
        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png" 
        alt="Lingueefy" 
        className="h-7 w-auto mr-2"
      />
    ),
  },
  {
    id: "barholex",
    name: "Barholex Media",
    path: "/barholex-media",
    logo: <span className="font-bold text-xl mr-2" style={{ color: "var(--gold)" }}>B</span>,
  },
];

// Determine active brand based on current path
function getActiveBrand(path: string): string | null {
  if (path === "/" || path === "/ecosystem") return "hub";
  if (path.startsWith("/rusingacademy") || path === "/courses") return "rusingacademy";
  if (path.startsWith("/lingueefy") || path === "/coaches" || path === "/prof-steven-ai") return "lingueefy";
  if (path.startsWith("/barholex")) return "barholex";
  return null;
}

export default function EcosystemHeader() {
  const { language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const activeBrand = getActiveBrand(location);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{ boxShadow: scrolled ? "var(--shadow-lg)" : "none" }}
      role="banner"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ 
          backgroundColor: "var(--accent)",
          color: "white",
        }}
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      {/* ===== TOP BAR - Institutional ===== */}
      <div 
        style={{ 
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            {/* Company Identity - Left */}
            <Link 
              href="/"
              className="flex items-center gap-2 transition-colors"
              style={{ color: "var(--text)" }}
            >
              <span className="text-sm font-serif tracking-wide">
                Rusinga International Consulting Ltd.
              </span>
              <span 
                className="hidden sm:inline font-light"
                style={{ color: "var(--muted)" }}
              >
                |
              </span>
              <span 
                className="hidden sm:inline text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                Learning Ecosystem
              </span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1.5 rounded-full px-2 sm:px-3 h-9 font-medium transition-all"
                    style={{ color: "var(--muted)" }}
                    aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {language === "en" ? "🇺🇸" : "🇫🇷"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-40 rounded-xl p-1"
                  style={{ 
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <DropdownMenuItem 
                    onClick={() => setLanguage("en")}
                    className="cursor-pointer rounded-lg px-3 py-2.5 transition-all"
                    style={{ 
                      backgroundColor: language === "en" ? "var(--primary-soft)" : "transparent",
                      color: "var(--text)",
                    }}
                  >
                    <span className="mr-2 text-lg">🇺🇸</span> 
                    <span className="font-medium">English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage("fr")}
                    className="cursor-pointer rounded-lg px-3 py-2.5 transition-all"
                    style={{ 
                      backgroundColor: language === "fr" ? "var(--primary-soft)" : "transparent",
                      color: "var(--text)",
                    }}
                  >
                    <span className="mr-2 text-lg">🇫🇷</span> 
                    <span className="font-medium">Français</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle - Desktop only */}
              {toggleTheme && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="hidden sm:flex w-9 h-9 rounded-full transition-all"
                  aria-label={isDark ? (language === "fr" ? "Mode clair" : "Light mode") : (language === "fr" ? "Mode sombre" : "Dark mode")}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" style={{ color: "var(--gold)" }} />
                  ) : (
                    <Moon className="h-4 w-4" style={{ color: "var(--muted)" }} />
                  )}
                </Button>
              )}

              {/* CTA - Join Our Community (Accent Cuivre) */}
              <Link href="/community">
                <Button 
                  className="rounded-full px-4 sm:px-6 h-9 font-semibold text-sm transition-all"
                  style={{ 
                    backgroundColor: "var(--accent)",
                    color: "white",
                    boxShadow: "var(--shadow-md)",
                  }}
                  aria-label={language === "fr" ? "Rejoindre notre communauté" : "Join Our Community"}
                >
                  <span className="hidden sm:inline">
                    {language === "fr" ? "Rejoindre la communauté" : "Join Our Community"}
                  </span>
                  <span className="sm:hidden">
                    {language === "fr" ? "Rejoindre" : "Join"}
                  </span>
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-9 w-9 transition-all"
                    style={{ color: "var(--muted)" }}
                    aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-80 p-0"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <MobileMenu 
                    activeBrand={activeBrand} 
                    onClose={() => setMobileMenuOpen(false)} 
                    language={language}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER - Brand Navigation ===== */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6b7b6e 0%, #8a9a7d 25%, #a3b396 50%, #8a9a7d 75%, #6b7b6e 100%)",
        }}
      >
        {/* Subtle fog overlay - very light, no heavy effects */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 60%)",
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex h-20 sm:h-24 items-center justify-between">
            {/* Brand Tiles - Center */}
            <nav 
              className="hidden lg:flex items-center justify-center flex-1 gap-4"
              role="navigation"
              aria-label={language === "fr" ? "Navigation des marques" : "Brand navigation"}
            >
              {brandTiles.map((tile) => {
                const isActive = activeBrand === tile.id;
                
                // Brand-specific styles
                let tileStyle: React.CSSProperties = {};
                let textColor = "var(--text)";
                
                if (tile.id === "rusingacademy") {
                  tileStyle = {
                    backgroundColor: "var(--accent)",
                    color: "white",
                  };
                  textColor = "white";
                } else if (tile.id === "lingueefy") {
                  tileStyle = {
                    backgroundColor: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  };
                } else if (tile.id === "barholex") {
                  tileStyle = {
                    backgroundColor: "var(--obsidian)",
                    color: "white",
                  };
                  textColor = "white";
                }
                
                return (
                  <Link
                    key={tile.id}
                    href={tile.path}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={`
                        flex items-center px-6 py-3 rounded-xl cursor-pointer
                        transition-all duration-200
                        ${isActive ? "scale-105" : "hover:scale-[1.02]"}
                      `}
                      style={{
                        ...tileStyle,
                        boxShadow: isActive 
                          ? "0 0 0 3px var(--ring), var(--shadow-lg)" 
                          : "var(--shadow-md)",
                      }}
                    >
                      {tile.logo}
                      <span 
                        className="font-semibold text-base whitespace-nowrap"
                        style={{ color: textColor }}
                      >
                        {tile.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Human + AI Signature - Right */}
            <Link 
              href="/prof-steven-ai"
              className="hidden lg:flex items-center gap-1 group"
              aria-label={language === "fr" ? "Prof Steven AI - Votre coach IA" : "Prof Steven AI - Your AI Coach"}
            >
              <div className="relative">
                {/* Avatar */}
                <div 
                  className="w-14 h-14 rounded-full overflow-hidden border-2 transition-all group-hover:border-opacity-100"
                  style={{ 
                    borderColor: "var(--gold)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <img 
                    src={STEVEN_AVATAR}
                    alt="Steven Barholere"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";
                    }}
                  />
                </div>
                {/* AI Badge */}
                <div 
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: "var(--mint)",
                    borderColor: "white",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
            </Link>

            {/* Mobile Brand Indicator */}
            <div className="lg:hidden flex items-center gap-3">
              {activeBrand && activeBrand !== "hub" && (
                <div 
                  className="flex items-center px-3 py-1.5 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <span className="text-white text-sm font-medium">
                    {brandTiles.find(t => t.id === activeBrand)?.name || "Ecosystem"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile Menu Component
function MobileMenu({ 
  activeBrand, 
  onClose, 
  language 
}: { 
  activeBrand: string | null; 
  onClose: () => void;
  language: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div 
        className="p-6 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span 
          className="text-lg font-serif"
          style={{ color: "var(--text)" }}
        >
          Learning Ecosystem
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-5 w-5" style={{ color: "var(--muted)" }} />
        </Button>
      </div>
      
      {/* Brand Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            {language === "fr" ? "Nos marques" : "Our Brands"}
          </span>
        </div>
        
        {/* Hub Link */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center px-6 py-4 transition-all border-l-4"
          style={{ 
            backgroundColor: activeBrand === "hub" ? "var(--primary-soft)" : "transparent",
            borderColor: activeBrand === "hub" ? "var(--primary)" : "transparent",
          }}
        >
          <span 
            className="font-medium"
            style={{ color: "var(--text)" }}
          >
            {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
          </span>
        </Link>

        {brandTiles.map((tile) => {
          const isActive = activeBrand === tile.id;
          
          // Brand-specific mini logo colors
          let logoStyle: React.CSSProperties = {};
          if (tile.id === "rusingacademy") {
            logoStyle = { backgroundColor: "var(--accent)", color: "white" };
          } else if (tile.id === "lingueefy") {
            logoStyle = { backgroundColor: "var(--mint-soft)", color: "var(--mint)" };
          } else if (tile.id === "barholex") {
            logoStyle = { backgroundColor: "var(--obsidian)", color: "var(--gold)" };
          }
          
          return (
            <Link
              key={tile.id}
              href={tile.path}
              onClick={onClose}
              className="flex items-center px-6 py-4 transition-all border-l-4"
              style={{ 
                backgroundColor: isActive ? "var(--primary-soft)" : "transparent",
                borderColor: isActive ? "var(--primary)" : "transparent",
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm font-bold"
                style={logoStyle}
              >
                {tile.id === "rusingacademy" && "R"}
                {tile.id === "lingueefy" && "L"}
                {tile.id === "barholex" && "B"}
              </div>
              <span 
                className="font-medium"
                style={{ color: "var(--text)" }}
              >
                {tile.name}
              </span>
            </Link>
          );
        })}

        <div 
          className="my-4"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        {/* Quick Links */}
        <div className="px-4 mb-2">
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            {language === "fr" ? "Liens rapides" : "Quick Links"}
          </span>
        </div>
        
        <Link
          href="/prof-steven-ai"
          onClick={onClose}
          className="flex items-center px-6 py-4 transition-all"
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: "var(--mint)" }}
          >
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span 
            className="font-medium"
            style={{ color: "var(--text)" }}
          >
            Prof Steven AI
          </span>
        </Link>

        <Link
          href="/community"
          onClick={onClose}
          className="flex items-center px-6 py-4 transition-all"
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <span className="text-white text-xs">👥</span>
          </div>
          <span 
            className="font-medium"
            style={{ color: "var(--text)" }}
          >
            {language === "fr" ? "Communauté" : "Community"}
          </span>
        </Link>
      </nav>
    </div>
  );
}
