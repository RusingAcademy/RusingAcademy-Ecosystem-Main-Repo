import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

/**
 * EcosystemHeaderGold - Premium High-End Header
 * 
 * Design inspired by "Banana" reference images:
 * - Clean 2-bar structure (main header + brand cards)
 * - Removed 3rd sub-header bar (page-specific sub-headers exist)
 * - Removed "Book a Diagnostic" button (exists in Hero)
 * - Premium glassmorphism with subtle shadows
 * - Widget AI spans across both bars elegantly
 */

// Brand colors for accent bars
const BRAND_COLORS = {
  rusingacademy: "#1a365d", // Navy
  lingueefy: "#0f766e", // Teal
  barholex: "#ea580c", // Orange
};

// Unified pill styles
const PILL_STYLES = {
  base: {
    height: "40px",
    borderRadius: "9999px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Brand tiles configuration
interface BrandTile {
  id: string;
  name: string;
  subtitle: {
    en: string;
    fr: string;
  };
  path: string;
  icon: React.ReactNode;
  accentColor: string;
}

const brandTiles: BrandTile[] = [
  {
    id: "rusingacademy",
    name: "RusingÂcademy",
    subtitle: {
      en: "Professional Courses & LMS",
      fr: "Cours professionnels & LMS",
    },
    path: "/rusingacademy",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
        <img 
          src="/images/logos/rusingacademy-logo.png" 
          alt="RusingAcademy" 
          className="w-6 h-6 object-contain"
        />
      </div>
    ),
    accentColor: BRAND_COLORS.rusingacademy,
  },
  {
    id: "lingueefy",
    name: "Lingueefy",
    subtitle: {
      en: "Human & AI Coaching",
      fr: "Coaching humain & IA",
    },
    path: "/lingueefy",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-teal-50/80 flex items-center justify-center shadow-sm">
        <img 
          src="/images/logos/lingueefy-logo-icon.png" 
          alt="Lingueefy" 
          className="w-6 h-6 object-contain"
        />
      </div>
    ),
    accentColor: BRAND_COLORS.lingueefy,
  },
  {
    id: "barholex",
    name: "Barholex Media",
    subtitle: {
      en: "EdTech Consulting & Studio",
      fr: "Consultation EdTech & Studio",
    },
    path: "/barholex-media",
    icon: (
      <div className="w-10 h-10 rounded-xl bg-orange-50/80 flex items-center justify-center shadow-sm">
        <img 
          src="/images/logos/barholex-logo-icon.png" 
          alt="Barholex Media" 
          className="w-6 h-6 object-contain"
        />
      </div>
    ),
    accentColor: BRAND_COLORS.barholex,
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

export default function EcosystemHeaderGold() {
  const { language, setLanguage } = useLanguage();
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
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "shadow-lg" : ""
      }`}
      role="banner"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:bg-orange-500 focus:text-white"
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      {/* ===== WRAPPER FOR HEADER + BRAND CARDS ===== */}
      <div className="relative">
        
        {/* ===== SLE AI COMPANION WIDGET - SPANNING BOTH BARS ===== */}
        <div 
          className="absolute right-6 lg:right-10 top-3 z-[60] hidden lg:block"
        >
          <SLEAICompanionWidget />
        </div>

        {/* ===== BAR 1: MAIN HEADER - PREMIUM GLASSMORPHISM ===== */}
        <div 
          className="relative"
          style={{ 
            background: scrolled 
              ? "rgba(255, 255, 253, 0.97)"
              : "rgba(255, 255, 253, 0.92)",
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
            boxShadow: scrolled 
              ? "0 4px 30px rgba(0, 0, 0, 0.06)" 
              : "0 1px 10px rgba(0, 0, 0, 0.02)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-[72px] items-center justify-between">
              
              {/* LEFT: Logo + Identity */}
              <Link 
                href="/"
                className="flex items-center gap-3.5 transition-all duration-300 hover:opacity-90"
              >
                <div 
                  className="relative"
                  style={{
                    padding: "2px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(26, 54, 93, 0.1) 0%, rgba(26, 54, 93, 0.05) 100%)",
                  }}
                >
                  <img 
                    src="/images/logos/rusingacademy-logo.png" 
                    alt="RusingAcademy" 
                    className="w-11 h-11 rounded-xl object-cover"
                    style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)" }}
                  />
                </div>
                <div className="flex flex-col">
                  <span 
                    className="font-serif text-xl font-bold tracking-wide"
                    style={{ color: "#1a365d" }}
                  >
                    RusingÂcademy
                  </span>
                  <span className="hidden sm:inline text-xs font-medium text-slate-500 tracking-wide">
                    Learning Ecosystem
                  </span>
                </div>
              </Link>

              {/* RIGHT: FR/EN + Login (Widget is positioned absolutely) */}
              <div className="flex items-center gap-3 lg:mr-40">
                
                {/* Language Toggle - FR/EN with Canadian Flag */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="gap-2 px-4 font-medium hover:bg-slate-50/80"
                      style={PILL_STYLES.base}
                      aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                    >
                      <span className="text-base" aria-hidden="true">🍁</span>
                      <span className="font-semibold text-sm text-slate-700">
                        FR/EN
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-44 rounded-2xl p-1.5 bg-white/98 backdrop-blur-xl border border-slate-100 shadow-xl"
                  >
                    <DropdownMenuItem 
                      onClick={() => setLanguage("en")}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 transition-all ${
                        language === "en" ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="mr-2.5 text-lg" aria-hidden="true">🇨🇦</span> 
                      <span className="font-medium text-slate-700">English</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage("fr")}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 transition-all ${
                        language === "fr" ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="mr-2.5 text-lg" aria-hidden="true">🇨🇦</span> 
                      <span className="font-medium text-slate-700">Français</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Login Button - Premium Pill */}
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    className="px-5 font-semibold hidden sm:flex items-center gap-2 hover:bg-slate-50/80"
                    style={PILL_STYLES.base}
                  >
                    <LogIn className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Login</span>
                  </Button>
                </Link>

                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full h-10 w-10 transition-all hover:bg-slate-100"
                      aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
                    >
                      <Menu className="h-5 w-5 text-slate-600" aria-hidden="true" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="right" 
                    className="w-80 p-0 bg-white"
                  >
                    <MobileMenu 
                      activeBrand={activeBrand} 
                      onClose={() => setMobileMenuOpen(false)} 
                      language={language}
                      brandTiles={brandTiles}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BAR 2: BRAND HUB CARDS - PREMIUM FLOATING DESIGN ===== */}
        <div 
          className="relative py-5 hidden lg:block"
          style={{
            background: "linear-gradient(180deg, #FAFAF9 0%, #F5F5F3 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cards container - offset for AI widget */}
            <div className="flex items-center justify-center gap-6 pr-36">
              {brandTiles.map((tile) => {
                const isActive = activeBrand === tile.id;
                
                return (
                  <Link
                    key={tile.id}
                    href={tile.path}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={`
                        relative flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer
                        transition-all duration-300 min-w-[270px] bg-white
                        ${isActive ? "" : "hover:-translate-y-1 hover:shadow-lg"}
                      `}
                      style={{
                        border: isActive 
                          ? `2px solid ${tile.accentColor}` 
                          : "1px solid rgba(0, 0, 0, 0.05)",
                        boxShadow: isActive 
                          ? `0 12px 28px -8px ${tile.accentColor}25, 0 4px 12px rgba(0, 0, 0, 0.04)` 
                          : "0 4px 16px -6px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)",
                        transform: isActive ? "scale(1.02)" : undefined,
                      }}
                    >
                      {/* Top Accent Bar - Premium */}
                      <div 
                        className="absolute top-0 left-5 right-5 h-[4px] rounded-b-full"
                        style={{ 
                          backgroundColor: tile.accentColor,
                          boxShadow: `0 2px 8px ${tile.accentColor}40`,
                        }}
                      />
                      
                      {/* Icon */}
                      {tile.icon}
                      
                      {/* Text */}
                      <div className="flex flex-col justify-center">
                        <span 
                          className="font-semibold text-base leading-tight"
                          style={{ color: "#1e293b" }}
                        >
                          {tile.name}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 tracking-wide">
                          {tile.subtitle[language]}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== 3RD BAR REMOVED - Sub-headers are now page-specific ===== */}
        
      </div>
    </header>
  );
}

// Mobile Menu Component
function MobileMenu({ 
  activeBrand, 
  onClose, 
  language,
  brandTiles,
}: { 
  activeBrand: string | null; 
  onClose: () => void;
  language: string;
  brandTiles: BrandTile[];
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <span className="font-semibold text-slate-800">
          Menu
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full h-8 w-8"
        >
          <X className="h-4 w-4 text-slate-500" />
        </Button>
      </div>

      {/* Brand Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {brandTiles.map((tile) => {
          const isActive = activeBrand === tile.id;
          
          return (
            <Link
              key={tile.id}
              href={tile.path}
              onClick={onClose}
            >
              <div
                className={`
                  relative flex items-center gap-3 p-3.5 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}
                `}
                style={{
                  borderLeft: isActive ? `4px solid ${tile.accentColor}` : "4px solid transparent",
                }}
              >
                {tile.icon}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-slate-800">
                    {tile.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {tile.subtitle[language]}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile AI Companion Section */}
      <div className="p-4 border-t border-slate-100">
        <Link href="/ai-coach" onClick={onClose}>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
            <div 
              className="w-11 h-11 rounded-full overflow-hidden"
              style={{ 
                border: "3px solid #8B5CF6",
                boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15)",
              }}
            >
              <img 
                src="/images/coaches/steven-barholere.jpg"
                alt="Prof. Steven"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                SLE AI Companion
                <span 
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" }}
                >
                  AI
                </span>
              </span>
              <span className="text-xs text-slate-500">
                {language === "fr" ? "Votre coach personnel" : "Your personal coach"}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 text-center">
        <span className="text-xs text-slate-400">
          © 2026 RusingÂcademy Learning Ecosystem
        </span>
      </div>
    </div>
  );
}
