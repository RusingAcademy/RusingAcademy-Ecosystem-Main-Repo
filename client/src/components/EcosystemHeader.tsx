import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { normalizePath, addLanguagePrefix } from "@/utils/pathNormalizer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, X, Mic, ClipboardCheck, GraduationCap, Calendar, LogIn } from "lucide-react";
import { BOOKING_URL, BOOKING_CTA, BOOKING_CTA_SHORT } from "@/constants/booking";
import { useState, useEffect } from "react";

// Steven Barholere avatar for Human+AI signature
const STEVEN_AVATAR = "/images/coaches/steven-barholere.jpg";

// Brand tiles configuration - Gold Standard design
interface BrandTile {
  id: string;
  name: string;
  subtitle: {
    en: string;
    fr: string;
  };
  path: string;
  logo: React.ReactNode;
  accentColor: string; // Color bar at top of card
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
    logo: (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1e3a5f" }}>
        <span className="text-white font-bold text-lg">📚</span>
      </div>
    ),
    accentColor: "#1e3a5f", // Navy
  },
  {
    id: "lingueefy",
    name: "Lingueefy",
    subtitle: {
      en: "Human & AI Coaching",
      fr: "Coaching humain & IA",
    },
    path: "/lingueefy",
    logo: (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#14b8a6" }}>
        <span className="text-white font-bold text-lg">💬</span>
      </div>
    ),
    accentColor: "#14b8a6", // Teal
  },
  {
    id: "barholex",
    name: "Barholex Media",
    subtitle: {
      en: "EdTech Consulting & Studio",
      fr: "Consultation EdTech & Studio",
    },
    path: "/barholex-media",
    logo: (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F27F0C" }}>
        <span className="text-white font-bold text-lg">▶</span>
      </div>
    ),
    accentColor: "#F27F0C", // Orange
  },
];

// Determine active brand based on normalized path
function getActiveBrand(normalizedPath: string): string | null {
  if (normalizedPath === "/" || normalizedPath === "/ecosystem") return "hub";
  if (normalizedPath.startsWith("/rusingacademy") || normalizedPath === "/courses") return "rusingacademy";
  if (normalizedPath.startsWith("/lingueefy") || normalizedPath === "/coaches" || normalizedPath === "/prof-steven-ai" || normalizedPath.startsWith("/ai-coach")) return "lingueefy";
  if (normalizedPath.startsWith("/barholex")) return "barholex";
  return "hub";
}

export default function EcosystemHeader() {
  const { language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stevenAIOpen, setStevenAIOpen] = useState(false);
  
  const { path: normalizedPath, lang: currentLang } = normalizePath(location);
  const activeBrand = getActiveBrand(normalizedPath);
  
  const langLink = (path: string) => {
    if (location.startsWith('/en') || location.startsWith('/fr')) {
      return addLanguagePrefix(path, currentLang);
    }
    return path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stevenAIOpen) {
        setStevenAIOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [stevenAIOpen]);

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
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
      role="banner"
      style={{
        backgroundColor: "rgba(255, 253, 250, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        style={{ 
          backgroundColor: "#F27F0C",
          color: "white",
        }}
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      {/* ===== MAIN HEADER BAR - Gold Standard: White/Glass Clear ===== */}
      <div 
        className="relative"
        style={{ 
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 253, 250, 0.95) 100%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Company Identity - Left */}
            <Link 
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              {/* RusingÂcademy Logo */}
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                style={{ 
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <img 
                  src="/images/logos/rusingacademy-logo.png" 
                  alt="RusingÂcademy" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span 
                  className="font-serif text-xl font-bold tracking-wide"
                  style={{ color: "#1a1a1a" }}
                >
                  RusingÂcademy
                </span>
                <span 
                  className="hidden sm:inline text-xs font-medium"
                  style={{ color: "#6b7280" }}
                >
                  Learning Ecosystem
                </span>
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* CTA - Book a Diagnostic (Calendly) - CENTRAL */}
              <a 
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  className="rounded-full px-6 sm:px-8 h-11 font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2"
                  style={{ 
                    background: "linear-gradient(135deg, #F27F0C 0%, #E86A00 100%)",
                    color: "white",
                    boxShadow: "0 4px 15px rgba(242, 127, 12, 0.35)",
                  }}
                  aria-label={BOOKING_CTA[language]}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {BOOKING_CTA[language]}
                  </span>
                  <span className="sm:hidden">
                    {BOOKING_CTA_SHORT[language]}
                  </span>
                </Button>
              </a>

              {/* Language Switcher - Canadian Flag */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1.5 rounded-full px-4 h-11 font-medium transition-all"
                    style={{ 
                      backgroundColor: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "#374151",
                    }}
                    aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                  >
                    <span className="text-lg" aria-hidden="true">🍁</span>
                    <span className="hidden sm:inline font-semibold">FR/EN</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-44 rounded-xl p-1"
                  style={{ 
                    backgroundColor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  }}
                >
                  <DropdownMenuItem 
                    onClick={() => setLanguage("en")}
                    className="cursor-pointer rounded-lg px-3 py-2.5 transition-all"
                    style={{ 
                      backgroundColor: language === "en" ? "rgba(242, 127, 12, 0.1)" : "transparent",
                      color: "#1a1a1a",
                    }}
                  >
                    <span className="mr-2 text-lg" aria-hidden="true">🇨🇦</span> 
                    <span className="font-medium">English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage("fr")}
                    className="cursor-pointer rounded-lg px-3 py-2.5 transition-all"
                    style={{ 
                      backgroundColor: language === "fr" ? "rgba(242, 127, 12, 0.1)" : "transparent",
                      color: "#1a1a1a",
                    }}
                  >
                    <span className="mr-2 text-lg" aria-hidden="true">⚜️</span> 
                    <span className="font-medium">Français</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login Button */}
              <Link href="/login">
                <Button 
                  variant="ghost"
                  className="rounded-full h-11 px-5 font-semibold text-sm transition-all hidden md:flex items-center gap-2"
                  style={{ 
                    backgroundColor: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    color: "#374151",
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              </Link>

              {/* SLE AI Companion - Avatar */}
              <div className="hidden lg:block relative">
                <button
                  id="steven-ai-trigger"
                  onClick={() => setStevenAIOpen(!stevenAIOpen)}
                  className="flex flex-col items-center gap-0.5 group cursor-pointer transition-transform hover:scale-105"
                  aria-label={language === "fr" ? "Ouvrir SLE AI Coach" : "Open SLE AI Coach"}
                  aria-expanded={stevenAIOpen}
                  aria-haspopup="dialog"
                >
                  <div className="relative">
                    {/* Outer ring with pulse animation */}
                    <div 
                      className="absolute -inset-1.5 rounded-full animate-pulse"
                      style={{ 
                        border: "2px solid rgba(139, 92, 246, 0.5)",
                        opacity: 0.7,
                      }}
                    />
                    {/* Avatar */}
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden border-3 transition-all"
                      style={{ 
                        borderColor: "#8b5cf6",
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
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
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#8b5cf6",
                        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.5)",
                      }}
                    >
                      <span className="text-white text-[10px] font-bold">AI</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-[10px] font-medium mt-0.5">
                    SLE AI Companion
                  </span>
                </button>

                {/* Steven AI Popup */}
                {stevenAIOpen && (
                  <div 
                    id="steven-ai-popup"
                    role="dialog"
                    aria-modal="true"
                    aria-label={language === "fr" ? "SLE AI Coach" : "SLE AI Coach"}
                    className="absolute top-full right-0 mt-4 w-[380px] bg-white rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
                  >
                    {/* Header */}
                    <div 
                      className="p-5 flex items-center gap-3 relative"
                      style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}
                    >
                      <img 
                        src={STEVEN_AVATAR} 
                        alt="Prof. Steven Barholere"
                        className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                      <div>
                        <h3 className="text-white text-lg font-extrabold flex items-center gap-2">
                          SLE AI Coach
                          <span className="bg-white/25 text-[11px] px-2 py-0.5 rounded-md font-extrabold">
                            Powered by Lingueefy
                          </span>
                        </h3>
                        <p className="text-white/90 text-sm">Your Personal SLE Language Coach</p>
                      </div>
                      <button 
                        onClick={() => setStevenAIOpen(false)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:rotate-90"
                        aria-label={language === "fr" ? "Fermer" : "Close"}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <div className="text-center mb-4">
                        <h4 className="text-base font-extrabold text-gray-900 mb-2">👋 {t.welcome}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{t.welcomeDesc}</p>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <Link href="/ai-coach?mode=voice" onClick={() => setStevenAIOpen(false)}>
                          <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-teal-500 hover:translate-x-1 cursor-pointer">
                            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                              <Mic className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="text-sm font-extrabold text-gray-900">{t.voicePractice}</h5>
                              <p className="text-xs text-gray-500">{t.voicePracticeDesc}</p>
                            </div>
                          </div>
                        </Link>

                        <Link href="/ai-coach?mode=placement" onClick={() => setStevenAIOpen(false)}>
                          <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 hover:translate-x-1 cursor-pointer">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <ClipboardCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="text-sm font-extrabold text-gray-900">{t.placementTest}</h5>
                              <p className="text-xs text-gray-500">{t.placementTestDesc}</p>
                            </div>
                          </div>
                        </Link>

                        <Link href="/ai-coach?mode=simulation" onClick={() => setStevenAIOpen(false)}>
                          <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 hover:translate-x-1 cursor-pointer">
                            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                              <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="text-sm font-extrabold text-gray-900">{t.examSimulation}</h5>
                              <p className="text-xs text-gray-500">{t.examSimulationDesc}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-gray-50 text-center border-t border-gray-100">
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
                    className="rounded-full h-11 w-11 transition-all"
                    style={{ 
                      backgroundColor: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                    aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
                  >
                    <Menu className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-80 p-0"
                  style={{ backgroundColor: "white" }}
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

      {/* ===== HUB CARDS - Gold Standard: White cards with colored bar on top ===== */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255, 253, 250, 0.98) 0%, rgba(250, 248, 245, 0.95) 100%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex py-4 items-center justify-center">
            {/* Brand Tiles - Center */}
            <nav 
              className="hidden lg:flex items-center justify-center gap-5"
              role="navigation"
              aria-label={language === "fr" ? "Navigation des marques" : "Brand navigation"}
            >
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
                        relative flex items-center gap-3 px-6 py-4 rounded-xl cursor-pointer
                        transition-all duration-300 min-w-[240px]
                        ${isActive ? "scale-[1.02]" : "hover:scale-[1.01] hover:shadow-lg"}
                      `}
                      style={{
                        backgroundColor: "white",
                        boxShadow: isActive 
                          ? "0 8px 30px rgba(0,0,0,0.12)"
                          : "0 2px 12px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Color bar at top */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
                        style={{ backgroundColor: tile.accentColor }}
                      />
                      
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {tile.logo}
                      </div>
                      
                      {/* Text */}
                      <div className="flex flex-col">
                        <span 
                          className="font-semibold text-base"
                          style={{ color: "#1a1a1a" }}
                        >
                          {tile.name}
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: "#6b7280" }}
                        >
                          {tile.subtitle[language]}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Brand Indicator */}
            <div className="lg:hidden flex items-center gap-3 overflow-x-auto pb-2 w-full justify-start px-2">
              {brandTiles.map((tile) => {
                const isActive = activeBrand === tile.id;
                
                return (
                  <Link key={tile.id} href={tile.path}>
                    <div
                      className={`
                        relative flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer
                        transition-all duration-300 min-w-[160px] flex-shrink-0
                        ${isActive ? "scale-[1.02]" : ""}
                      `}
                      style={{
                        backgroundColor: "white",
                        boxShadow: isActive 
                          ? "0 4px 15px rgba(0,0,0,0.1)"
                          : "0 1px 6px rgba(0,0,0,0.05)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Color bar at top */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                        style={{ backgroundColor: tile.accentColor }}
                      />
                      
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tile.accentColor }}>
                        <span className="text-white text-sm">
                          {tile.id === "rusingacademy" ? "📚" : tile.id === "lingueefy" ? "💬" : "▶"}
                        </span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>
                          {tile.name}
                        </span>
                        <span className="text-[10px]" style={{ color: "#6b7280" }}>
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <span className="font-semibold text-gray-900">
          {language === "fr" ? "Menu" : "Menu"}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Brand Navigation */}
      <div className="flex-1 p-4 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider mb-3 text-gray-500">
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
                  relative flex items-center gap-3 p-4 rounded-xl transition-all
                  ${isActive ? "bg-orange-50" : "hover:bg-gray-50"}
                `}
                style={{
                  border: isActive ? "1px solid rgba(242, 127, 12, 0.3)" : "1px solid transparent",
                }}
              >
                {/* Color indicator */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                  style={{ backgroundColor: tile.accentColor }}
                />
                
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tile.accentColor }}>
                  <span className="text-white text-lg">
                    {tile.id === "rusingacademy" ? "📚" : tile.id === "lingueefy" ? "💬" : "▶"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold block text-gray-900">
                    {tile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tile.subtitle[language as "en" | "fr"]}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Steven AI in Mobile */}
        <Link href="/ai-coach" onClick={onClose}>
          <div className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-gray-50 mt-4 border-t pt-6" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <div 
              className="w-10 h-10 rounded-full overflow-hidden border-2"
              style={{ borderColor: "#8b5cf6" }}
            >
              <img 
                src={STEVEN_AVATAR}
                alt="Prof Steven AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-semibold block text-gray-900">
                SLE AI Coach
              </span>
              <span className="text-xs text-gray-500">
                {language === "fr" ? "Coach IA ELS" : "SLE AI Coach"}
              </span>
            </div>
            <div 
              className="ml-auto px-2 py-1 rounded-md text-xs font-bold"
              style={{ 
                backgroundColor: "#8b5cf6",
                color: "white",
              }}
            >
              AI
            </div>
          </div>
        </Link>

        {/* Login Button in Mobile */}
        <Link href="/login" onClick={onClose}>
          <div className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-gray-50">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
              <LogIn className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <span className="font-semibold block text-gray-900">
                {language === "fr" ? "Connexion" : "Login"}
              </span>
              <span className="text-xs text-gray-500">
                {language === "fr" ? "Accéder à votre compte" : "Access your account"}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div 
        className="p-4 border-t"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <Link href="/" onClick={onClose}>
          <div className="text-center py-3 rounded-xl transition-all hover:bg-gray-50 text-gray-500">
            <span className="text-sm">
              {language === "fr" ? "← Retour à l'écosystème" : "← Back to Ecosystem"}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
