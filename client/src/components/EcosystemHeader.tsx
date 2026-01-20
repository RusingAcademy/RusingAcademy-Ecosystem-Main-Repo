import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { normalizePath, addLanguagePrefix } from "@/utils/pathNormalizer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidgetMultiCoach from "./SLEAICompanionWidgetMultiCoach";

// ============================================
// PAGE 13 GOLDEN STANDARD - HEADER COMPONENT
// ============================================
// EXACT MATCH to Page 13 screenshot:
// - Single header bar with white background
// - Home icon left, title center, English + Login right
// - 3 Hub Cards below with subtle borders (NO color bars)
// - Widget positioned at right with purple glow
// ============================================

// Brand tiles configuration - Page 13 Design (NO color bars, subtle borders)
interface BrandTile {
  id: string;
  name: string;
  subtitle: {
    en: string;
    fr: string;
  };
  path: string;
  logo: React.ReactNode;
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
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4A574] to-[#C4956A] flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-xl">R</span>
      </div>
    ),
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
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0EA5A4] to-[#14B8A6] flex items-center justify-center shadow-sm">
        <span className="text-white text-xl">💬</span>
      </div>
    ),
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
      <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-xl">B</span>
      </div>
    ),
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Page 13 Golden Standard: Institutional title (same in both languages)
  const content = {
    en: {
      title: "Rusinga International Consulting Ltd. Learning Ecosystem",
      login: "Login",
      language: "English",
    },
    fr: {
      title: "Rusinga International Consulting Ltd. Learning Ecosystem",
      login: "Login",
      language: "Français",
    }
  };

  const t = content[language];

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Single Header Bar - Page 13 Exact Layout */}
      <div 
        className="border-b border-gray-200"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}>
            {/* Left: Home Icon */}
            <Link href={langLink("/")} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <Home className={`transition-all duration-300 ${scrolled ? "w-5 h-5" : "w-6 h-6"}`} />
            </Link>
            
            {/* Center: Institutional Title - Page 13 exact text */}
            <div className="flex-1 flex justify-center">
              <span 
                className={`font-normal text-gray-600 tracking-wide transition-all duration-300 text-center ${scrolled ? "text-sm" : "text-base lg:text-lg"}`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {t.title}
              </span>
            </div>
            
            {/* Right: Language + Login - Page 13 exact layout */}
            <div className="flex items-center gap-4">
              {/* Language Selector - Simple text */}
              <button
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className={`font-normal text-blue-600 hover:text-blue-700 transition-colors ${scrolled ? "text-sm" : "text-base"}`}
              >
                {language === "en" ? "English" : "Français"}
              </button>
              
              {/* Login Button - Pill Style per Page 13 */}
              <Link href={langLink("/login")}>
                <Button 
                  variant="outline" 
                  className={`flex items-center gap-2 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 ${scrolled ? "px-4 py-1.5 text-sm" : "px-5 py-2 text-base"}`}
                >
                  <LogIn className={`transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
                  <span>{t.login}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hub Cards Row - Page 13 Design (subtle borders, no color bars) */}
      <div 
        className="border-b border-gray-100 relative"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-center gap-6 lg:gap-8 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
            {/* Brand Tiles - Page 13 Design with subtle borders */}
            {brandTiles.map((tile) => (
              <Link
                key={tile.id}
                href={langLink(tile.path)}
                className={`
                  relative flex items-center gap-4 rounded-2xl
                  bg-white border border-gray-200
                  hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5
                  transition-all duration-300
                  ${activeBrand === tile.id ? "shadow-md border-gray-300" : "shadow-sm"}
                  ${scrolled ? "px-5 py-3" : "px-6 py-4"}
                `}
              >
                {/* Logo */}
                <div className={`transition-all duration-300 ${scrolled ? "scale-90" : "scale-100"}`}>
                  {tile.logo}
                </div>
                
                {/* Text */}
                <div className="flex flex-col">
                  <span className={`font-semibold text-gray-900 transition-all duration-300 ${scrolled ? "text-sm" : "text-base"}`}>
                    {tile.name}
                  </span>
                  <span className={`text-gray-500 transition-all duration-300 ${scrolled ? "text-xs" : "text-sm"}`}>
                    {tile.subtitle[language]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* SLE AI Companion Widget - Page 13 Position (right side, overlapping) */}
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
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {tile.logo}
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
