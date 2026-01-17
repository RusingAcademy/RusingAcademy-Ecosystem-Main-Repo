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

// Steven Barholere avatar for Human+AI signature
const STEVEN_AVATAR = "/images/coaches/steven-barholere.jpg";

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
  const [stevenAIOpen, setStevenAIOpen] = useState(false);
  
  const activeBrand = getActiveBrand(location);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close Steven AI popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const popup = document.getElementById('steven-ai-popup');
      const trigger = document.getElementById('steven-ai-trigger');
      
      if (stevenAIOpen && popup && !popup.contains(e.target as Node) && 
          trigger && !trigger.contains(e.target as Node)) {
        setStevenAIOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [stevenAIOpen]);

  // Handle escape key for Steven AI popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stevenAIOpen) {
        setStevenAIOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [stevenAIOpen]);

  // Steven AI content
  const stevenAIContent = {
    en: {
      welcome: "Welcome to Lingueefy!",
      welcomeDesc: "I'm here to help you pass your GC Second Language Exams.",
      voicePractice: "Voice Practice Sessions",
      voicePracticeDesc: "Practice speaking with AI-powered conversation",
      placementTest: "SLE Placement Tests",
      placementTestDesc: "Assess your current level (A, B, or C)",
      examSimulation: "Oral Exam Simulations",
      examSimulationDesc: "Realistic mock exams with feedback",
      poweredBy: "Powered by Lingueefy",
    },
    fr: {
      welcome: "Bienvenue sur Lingueefy!",
      welcomeDesc: "Je suis là pour vous aider à réussir vos examens de langue seconde du GC.",
      voicePractice: "Sessions de pratique vocale",
      voicePracticeDesc: "Pratiquez l'oral avec une conversation IA",
      placementTest: "Tests de placement ELS",
      placementTestDesc: "Évaluez votre niveau actuel (A, B ou C)",
      examSimulation: "Simulations d'examen oral",
      examSimulationDesc: "Examens simulés réalistes avec rétroaction",
      poweredBy: "Propulsé par Lingueefy",
    }
  };

  const t = stevenAIContent[language];

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

            {/* RIGHT: FR/EN + Login + AI Companion - UNIFIED PILLS */}
            <div className="flex items-center gap-2">
              
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

              {/* SLE AI Companion - Premium Utility Style (Discret) */}
              <div className="relative hidden lg:block">
                <button
                  id="steven-ai-trigger"
                  onClick={() => setStevenAIOpen(!stevenAIOpen)}
                  className="flex items-center gap-2 px-2.5 hover:bg-slate-50/80"
                  style={{
                    ...PILL_STYLES.base,
                    border: stevenAIOpen 
                      ? "1px solid rgba(139, 92, 246, 0.3)" 
                      : "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                  aria-label={language === "fr" ? "Ouvrir SLE AI Coach" : "Open SLE AI Coach"}
                  aria-expanded={stevenAIOpen}
                  aria-haspopup="dialog"
                >
                  <div className="relative">
                    {/* Avatar with subtle violet accent */}
                    <div 
                      className="w-7 h-7 rounded-full overflow-hidden"
                      style={{ 
                        border: "1.5px solid #8B5CF6",
                        boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.1)",
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
                    {/* AI Badge - Smaller, more subtle */}
                    <div 
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ 
                        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                        boxShadow: "0 1px 3px rgba(139, 92, 246, 0.3)",
                      }}
                    >
                      AI
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 hidden xl:inline">
                    SLE AI Companion
                  </span>
                </button>

                {/* Steven AI Popup - Refined */}
                {stevenAIOpen && (
                  <div 
                    id="steven-ai-popup"
                    role="dialog"
                    aria-modal="true"
                    aria-label={language === "fr" ? "SLE AI Coach" : "SLE AI Coach"}
                    className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl overflow-hidden"
                    style={{ 
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="p-4 flex items-center gap-3 relative"
                      style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" }}
                    >
                      <img 
                        src={STEVEN_AVATAR} 
                        alt="Prof. Steven Barholere"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/90 shadow-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-base">Prof. Steven</h4>
                        <p className="text-white/80 text-xs leading-snug">{t.welcomeDesc}</p>
                      </div>
                      <button 
                        onClick={() => setStevenAIOpen(false)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                        aria-label="Close"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      {/* Voice Practice */}
                      <Link href="/ai-coach?mode=voice" onClick={() => setStevenAIOpen(false)}>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 rounded-xl transition-all duration-200 border border-transparent hover:border-teal-200 cursor-pointer group">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Mic className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-900">{t.voicePractice}</h5>
                            <p className="text-xs text-gray-500">{t.voicePracticeDesc}</p>
                          </div>
                        </div>
                      </Link>

                      {/* Placement Test */}
                      <Link href="/ai-coach?mode=placement" onClick={() => setStevenAIOpen(false)}>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 cursor-pointer group">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <ClipboardCheck className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-900">{t.placementTest}</h5>
                            <p className="text-xs text-gray-500">{t.placementTestDesc}</p>
                          </div>
                        </div>
                      </Link>

                      {/* Oral Exam Simulations */}
                      <Link href="/ai-coach?mode=simulation" onClick={() => setStevenAIOpen(false)}>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200 cursor-pointer group">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-900">{t.examSimulation}</h5>
                            <p className="text-xs text-gray-500">{t.examSimulationDesc}</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 bg-gray-50 text-center border-t border-gray-100">
                      <span className="text-xs text-gray-500">⚡ {t.poweredBy}</span>
                    </div>
                  </div>
                )}
              </div>

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
          <div className="flex items-center justify-center gap-5">
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
        <p className="text-xs font-medium uppercase tracking-wider mb-3 text-slate-400">
          {language === "fr" ? "Nos marques" : "Our Brands"}
        </p>
        
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
                  relative flex items-center gap-3 p-3.5 rounded-xl transition-all
                  ${isActive ? "bg-slate-50 ring-1 ring-slate-200" : "hover:bg-slate-50/50"}
                `}
              >
                {/* Left accent bar */}
                <div 
                  className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                  style={{ backgroundColor: tile.accentColor }}
                />
                
                {tile.icon}
                <div className="pl-1">
                  <span className="font-semibold block text-slate-800 text-sm">
                    {tile.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {tile.subtitle[language as "en" | "fr"]}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Steven AI in Mobile */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link href="/prof-steven-ai" onClick={onClose}>
            <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:bg-slate-50/50">
              <div 
                className="w-9 h-9 rounded-full overflow-hidden"
                style={{ border: "1.5px solid #8B5CF6" }}
              >
                <img 
                  src={STEVEN_AVATAR}
                  alt="Prof Steven AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="font-semibold block text-slate-800 text-sm">
                  SLE AI Coach
                </span>
                <span className="text-xs text-slate-500">
                  {language === "fr" ? "Coach IA ELS" : "SLE AI Coach"}
                </span>
              </div>
              <div 
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" }}
              >
                AI
              </div>
            </div>
          </Link>
        </div>

        {/* Login in Mobile */}
        <Link href="/login" onClick={onClose}>
          <div className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:bg-slate-50/50 border border-slate-100">
            <LogIn className="h-4 w-4 text-slate-500" />
            <span className="font-semibold text-slate-800 text-sm">Login</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Link href="/" onClick={onClose}>
          <div className="text-center py-2.5 rounded-xl transition-all hover:bg-slate-50 text-slate-500">
            <span className="text-sm">
              {language === "fr" ? "← Retour à l'écosystème" : "← Back to Ecosystem"}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
