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
import { ChevronDown, Sun, Moon, Menu, X, Mic, ClipboardCheck, GraduationCap, Home, Calendar, LogIn } from "lucide-react";
import { BOOKING_URL, BOOKING_CTA, BOOKING_CTA_SHORT } from "@/constants/booking";
import { useState, useEffect } from "react";
import SLEAICompanionWidgetMultiCoach from "./SLEAICompanionWidgetMultiCoach";

// ============================================
// PAGE 13 GOLDEN STANDARD - HEADER COMPONENT
// ============================================
// Design Specifications:
// - Level 1: Top bar ivory (#FEFEF8), institutional title, language switch, Login pill
// - Level 2: Glassmorphism nav bar, 3 Hub Cards with color bars (Navy/Teal/Gold)
// - Widget: 96px, purple breathing glow, overlapping position
// - Shrink: ~30% on scroll (trigger at 10px)
// ============================================

// Brand tiles configuration - Page 13 Design with color bars
interface BrandTile {
  id: string;
  name: string;
  subtitle: {
    en: string;
    fr: string;
  };
  path: string;
  logo: React.ReactNode;
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
    logo: (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-lg">R</span>
      </div>
    ),
    accentColor: "#1E3A8A", // Navy Blue
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5A4] to-[#14B8A6] flex items-center justify-center shadow-sm">
        <span className="text-white text-lg">💬</span>
      </div>
    ),
    accentColor: "#0EA5A4", // Teal
  },
  {
    id: "barholex",
    name: "Barholex Media",
    subtitle: {
      en: "Consultation EdTech & Studio",
      fr: "Consultation EdTech & Studio",
    },
    path: "/barholex-media",
    logo: (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1F2937] to-[#374151] flex items-center justify-center shadow-sm">
        <span className="text-[#F7941D] font-bold text-lg">B</span>
      </div>
    ),
    accentColor: "#F7941D", // Gold/Orange
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
  
  const { path: normalizedPath, lang: currentLang } = normalizePath(location);
  const activeBrand = getActiveBrand(normalizedPath);
  
  const langLink = (path: string) => {
    if (location.startsWith('/en') || location.startsWith('/fr')) {
      return addLanguagePrefix(path, currentLang);
    }
    return path;
  };

  // Handle scroll effect - shrink header by 30% (Page 13: trigger at 10px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Page 13 Golden Standard: Institutional title
  const content = {
    en: {
      title: "Rusinga International Consulting Ltd. Learning Ecosystem",
      login: "Login",
      language: "English",
    },
    fr: {
      title: "Rusinga International Consulting Ltd. Learning Ecosystem",
      login: "Connexion",
      language: "Français",
    }
  };

  const t = content[language];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-1" 
          : "bg-white py-2"
      }`}
    >
      {/* Level 1: Top Bar - Ivory Background (#FEFEF8) per Page 13 */}
      <div 
        className="border-b border-gray-100"
        style={{ backgroundColor: "#FEFEF8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-10" : "h-14"}`}>
            {/* Left: Home Icon */}
            <Link href={langLink("/")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Home className={`transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
            </Link>
            
            {/* Center: Institutional Title - Page 13 exact text */}
            <div className="flex-1 flex justify-center">
              <span 
                className={`font-medium text-gray-700 tracking-wide transition-all duration-300 text-center ${scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {t.title}
              </span>
            </div>
            
            {/* Right: Language Selector + Login */}
            <div className="flex items-center gap-3">
              {/* Language Selector - Minimal per Page 13 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className={`font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 ${scrolled ? "text-xs" : "text-sm"}`}
              >
                {language === "en" ? "English" : "Français"}
              </Button>
              
              {/* Login Button - Pill Style with subtle glass per Page 13 */}
              <Link href={langLink("/login")}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex items-center gap-2 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50/80 backdrop-blur-sm transition-all duration-300 ${scrolled ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
                >
                  <LogIn className={`transition-all duration-300 ${scrolled ? "w-3 h-3" : "w-4 h-4"}`} />
                  <span>{t.login}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Level 2: Brand Navigation Tiles - Glassmorphism per Page 13 */}
      <div 
        className="relative border-b border-gray-100"
        style={{
          background: scrolled 
            ? "rgba(255, 255, 255, 0.72)" 
            : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(254,254,248,0.9) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-center gap-4 lg:gap-6 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
            {/* Brand Tiles - Page 13 Design with Color Bars */}
            {brandTiles.map((tile) => (
              <Link
                key={tile.id}
                href={langLink(tile.path)}
                className={`
                  relative flex items-center gap-3 rounded-xl
                  bg-white border border-gray-200
                  hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5
                  transition-all duration-300
                  ${activeBrand === tile.id ? "ring-2 ring-offset-2 shadow-lg" : "shadow-sm"}
                  ${scrolled ? "px-4 py-2" : "px-6 py-3"}
                `}
                style={{
                  ...(activeBrand === tile.id && { 
                    boxShadow: `0 8px 24px -4px ${tile.accentColor}30`,
                    borderColor: tile.accentColor,
                    ringColor: tile.accentColor,
                  })
                }}
              >

                
                {/* Logo */}
                <div className={`transition-all duration-300 ${scrolled ? "scale-75" : "scale-100"}`}>
                  {tile.logo}
                </div>
                
                {/* Text */}
                <div className="flex flex-col">
                  <span className={`font-semibold text-gray-900 transition-all duration-300 ${scrolled ? "text-sm" : "text-base"}`}>
                    {tile.name}
                  </span>
                  <span className={`text-gray-500 transition-all duration-300 ${scrolled ? "text-xs hidden sm:block" : "text-xs"}`}>
                    {tile.subtitle[language]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* SLE AI Companion Widget - Page 13 Overlapping Position */}
        {/* Desktop: Positioned to overlap between Top Bar and Main Nav */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-[60]">
          <SLEAICompanionWidgetMultiCoach />
        </div>
      </div>
      
      {/* Mobile Widget - Fixed Position */}
      <div className="lg:hidden fixed bottom-5 right-5 z-[60]">
        <SLEAICompanionWidgetMultiCoach />
      </div>
      
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="absolute right-4 top-3">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-8">
            {brandTiles.map((tile) => (
              <Link
                key={tile.id}
                href={langLink(tile.path)}
                onClick={() => setMobileMenuOpen(false)}
                className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors overflow-hidden"
              >
                {/* Color bar for mobile */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: tile.accentColor }}
                />
                <div className="ml-2">
                  {tile.logo}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{tile.name}</span>
                  <span className="text-sm text-gray-500">{tile.subtitle[language]}</span>
                </div>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
