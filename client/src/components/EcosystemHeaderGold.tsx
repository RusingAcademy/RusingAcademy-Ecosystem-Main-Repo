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
import { ChevronDown, Menu, X, Mic, ClipboardCheck, GraduationCap, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

// Brand colors for top accent bars
const BRAND_COLORS = {
  rusingacademy: "#1a365d", // Navy
  lingueefy: "#0f3d3e", // Teal
  barholex: "#c65a1e", // Orange
};

// Unified pill styles for consistency
const PILL_STYLES = {
  base: {
    height: "38px",
    borderRadius: "9999px",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
    transition: "all 0.2s ease",
  },
  hover: {
    backgroundColor: "rgba(248, 248, 246, 1)",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
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
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
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
      <div className="w-9 h-9 rounded-xl bg-teal-50/80 flex items-center justify-center shadow-sm">
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
      <div className="w-9 h-9 rounded-xl bg-orange-50/80 flex items-center justify-center shadow-sm">
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
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

      {/* ===== WRAPPER FOR HEADER + BRAND CARDS (for AI Widget positioning) ===== */}
      <div className="relative">
        
        {/* ===== SLE AI COMPANION WIDGET - POSITIONED ACROSS ALL BARS ===== */}
        <div 
          className="absolute right-4 sm:right-6 lg:right-8 top-2 z-[60] hidden lg:block"
          style={{
            // This positions the widget to span from top bar through brand cards
          }}
        >
          <SLEAICompanionWidget />
        </div>

        {/* ===== HEADER PRINCIPAL - GLASS IVOIRE ===== */}
        <div 
          className="relative"
          style={{ 
            background: "rgba(255, 255, 253, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: scrolled 
              ? "0 4px 24px rgba(0, 0, 0, 0.06)" 
              : "0 1px 8px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* LEFT: Logo + Identity */}
              <Link 
                href="/"
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <img 
                  src="/images/logos/rusingacademy-logo.png" 
                  alt="RusingAcademy" 
                  className="w-10 h-10 rounded-xl object-cover"
                  style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
                />
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-wide text-slate-800">
                    RusingÂcademy
                  </span>
                  <span className="hidden sm:inline text-xs font-medium text-slate-500">
                    Learning Ecosystem
                  </span>
                </div>
              </Link>

              {/* CENTER: Primary CTA */}
              <div className="hidden md:flex items-center">
                <a 
                  href="https://calendly.com/steven-barholere/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    className="rounded-full px-7 h-11 font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      background: "linear-gradient(135deg, #E67E22 0%, #F39C12 100%)",
                      color: "white",
                      boxShadow: "0 4px 16px rgba(230, 126, 34, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Book a Diagnostic (30 min)
                  </Button>
                </a>
              </div>

              {/* RIGHT: FR/EN + Login (AI Widget is now positioned absolutely) */}
              <div className="flex items-center gap-2 lg:mr-32">
                
                {/* Language Toggle - FR/EN with Canadian Flag */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="gap-1.5 px-3 font-medium hover:bg-slate-50/80"
                      style={PILL_STYLES.base}
                      aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                    >
                      <span className="text-sm" aria-hidden="true">🍁</span>
                      <span className="font-semibold text-sm text-slate-700">
                        {language === "en" ? "FR" : "EN"}/{language === "en" ? "EN" : "FR"}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-40 rounded-xl p-1 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-lg"
                  >
                    <DropdownMenuItem 
                      onClick={() => setLanguage("en")}
                      className={`cursor-pointer rounded-lg px-3 py-2 transition-all ${
                        language === "en" ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="mr-2 text-base" aria-hidden="true">🇨🇦</span> 
                      <span className="font-medium text-slate-700 text-sm">English</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage("fr")}
                      className={`cursor-pointer rounded-lg px-3 py-2 transition-all ${
                        language === "fr" ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="mr-2 text-base" aria-hidden="true">🇨🇦</span> 
                      <span className="font-medium text-slate-700 text-sm">Français</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Login Button - Unified Pill Style */}
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    className="px-4 font-semibold hidden sm:flex items-center gap-1.5 hover:bg-slate-50/80"
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
                      className="rounded-full h-9 w-9 transition-all hover:bg-slate-100"
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

        {/* ===== BRAND HUB CARDS - POLISHED FLOATING CARDS ===== */}
        <div 
          className="relative py-4 hidden lg:block"
          style={{
            background: "linear-gradient(180deg, #FAFAF8 0%, #F7F7F5 100%)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Offset the cards to leave space for AI widget on the right */}
            <div className="flex items-center justify-center gap-5 pr-28">
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
                        relative flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer
                        transition-all duration-200 min-w-[250px] bg-white
                        ${isActive ? "" : "hover:-translate-y-0.5"}
                      `}
                      style={{
                        border: isActive ? `2px solid ${tile.accentColor}` : "1px solid rgba(0, 0, 0, 0.06)",
                        boxShadow: isActive 
                          ? `0 8px 24px -8px ${tile.accentColor}30, 0 2px 8px rgba(0, 0, 0, 0.04)` 
                          : "0 2px 12px -4px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.02)",
                        transform: isActive ? "scale(1.01)" : undefined,
                      }}
                    >
                      {/* Top Accent Bar - Sharper */}
                      <div 
                        className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full"
                        style={{ backgroundColor: tile.accentColor }}
                      />
                      
                      {/* Icon */}
                      {tile.icon}
                      
                      {/* Text - Aligned baseline */}
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-[15px] text-slate-800 leading-tight">
                          {tile.name}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
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

        {/* ===== SUB-HEADER - WHITE BAR WITH NAVIGATION ===== */}
        <div 
          className="relative py-2.5 hidden lg:block"
          style={{
            background: "white",
            borderTop: "1px solid rgba(0, 0, 0, 0.04)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pr-28">
              {/* Left: Navigation Links */}
              <nav className="flex items-center gap-1" aria-label="Secondary navigation">
                <Link href="/explore">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                    <span className="text-base">⊕</span>
                    Explore
                  </span>
                </Link>
                <span className="text-slate-300 mx-1">|</span>
                <Link href="/community">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                    <span className="text-base">👥</span>
                    Community
                  </span>
                </Link>
                <span className="text-slate-300 mx-1">|</span>
                <Link href="/contact">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                    <span className="text-base">✉</span>
                    Contact
                  </span>
                </Link>
              </nav>
              
              {/* Right: Tagline */}
              <span className="text-sm font-medium text-slate-500 italic">
                Your Path to Bilingual Excellence
              </span>
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
          {language === "fr" ? "Menu" : "Menu"}
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

      {/* Primary CTA - Mobile */}
      <div className="p-4 border-b border-slate-100">
        <a 
          href="https://calendly.com/steven-barholere/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button 
            className="w-full rounded-full h-11 font-semibold text-base"
            style={{ 
              background: "linear-gradient(135deg, #E67E22 0%, #F39C12 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(230, 126, 34, 0.25)",
            }}
          >
            Book a Diagnostic (30 min)
          </Button>
        </a>
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
                  relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}
                `}
                style={{
                  borderLeft: isActive ? `3px solid ${tile.accentColor}` : "3px solid transparent",
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
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden"
              style={{ 
                border: "2px solid #8B5CF6",
                boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)",
              }}
            >
              <img 
                src="/images/coaches/steven-barholere.jpg"
                alt="Prof. Steven"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
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
