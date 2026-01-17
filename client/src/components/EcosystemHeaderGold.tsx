import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

/**
 * EcosystemHeaderGold - Premium Institutional Header v6.2
 * 
 * SIGNATURE GLASSMORPHISM EDITION
 * - Bar 1: Platinum background (#F8F9FA) - luxury letterhead paper feel
 * - Title: Title Case "Rusinga International Consulting Ltd. Learning Ecosystem"
 * - Login button: Heavy Frosted Glass (80-90% opacity) + metallic gold rim + soft shadow
 * - Home icon & Language: Light Crystal Glass (10-20% opacity) + hover effect
 * - All buttons: Elegant rounded-pills
 * - Futuristic control surface: glass, metal, luxury paper
 * 
 * Design inspiration: Canada.ca + Corporate Luxury standards
 * - WCAG 2.1 AA compliant
 */

interface BrandTile {
  id: string;
  name: string;
  subtitle: { en: string; fr: string; };
  path: string;
  iconSrc: string;
  accentColor: string;
}

const brandTiles: BrandTile[] = [
  { id: "rusingacademy", name: "RusingÂcademy", subtitle: { en: "Professional Courses & LMS", fr: "Cours professionnels & LMS" }, path: "/rusingacademy", iconSrc: "/images/logos/rusingacademy-logo.png", accentColor: "#1a365d" },
  { id: "lingueefy", name: "Lingueefy", subtitle: { en: "Human & AI Coaching", fr: "Coaching humain & IA" }, path: "/lingueefy", iconSrc: "/images/logos/lingueefy-logo-icon.png", accentColor: "#0f766e" },
  { id: "barholex", name: "Barholex Media", subtitle: { en: "EdTech Consulting & Studio", fr: "Consultation EdTech & Studio" }, path: "/barholex-media", iconSrc: "/images/logos/barholex-logo-icon.png", accentColor: "#c2410c" },
];

function getActiveBrand(path: string): string | null {
  if (path === "/" || path === "/ecosystem") return "hub";
  if (path.startsWith("/rusingacademy") || path === "/courses") return "rusingacademy";
  if (path.startsWith("/lingueefy") || path === "/coaches" || path === "/prof-steven-ai") return "lingueefy";
  if (path.startsWith("/barholex")) return "barholex";
  return null;
}

function MobileMenu({ activeBrand, onClose, language, brandTiles }: { activeBrand: string | null; onClose: () => void; language: string; brandTiles: BrandTile[] }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100">
        <span className="text-lg font-semibold text-slate-800">Menu</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {brandTiles.map((tile) => (
          <Link key={tile.id} href={tile.path} onClick={onClose}>
            <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${activeBrand === tile.id ? "bg-slate-100" : "hover:bg-slate-50"}`}>
              <img src={tile.iconSrc} alt={tile.name} className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <div className="font-medium text-slate-800">{tile.name}</div>
                <div className="text-sm text-slate-500">{language === "fr" ? tile.subtitle.fr : tile.subtitle.en}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function EcosystemHeaderGold() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);
  const [langHovered, setLangHovered] = useState(false);
  const activeBrand = getActiveBrand(location);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        boxShadow: isScrolled ? "0 4px 20px -4px rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* BAR 1: Platinum Institutional Bar */}
        <div 
          className="flex items-center justify-between h-16 lg:h-20"
          style={{
            background: "#F8F9FA",
            borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          }}
        >
          
          {/* Left: Home Icon - Light Crystal Glass */}
          <Link href="/" className="flex items-center">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                background: homeHovered ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.15)",
                backdropFilter: homeHovered ? "blur(12px)" : "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: homeHovered ? "0 4px 16px rgba(0, 0, 0, 0.08)" : "none",
              }}
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
            >
              <Home className="w-5 h-5 text-slate-600" />
            </div>
          </Link>

          {/* Center: Title Case */}
          <div className="hidden lg:flex flex-1 justify-center">
            <span 
              className="text-center"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "1rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: "#475569",
              }}
            >
              Rusinga International Consulting Ltd. Learning Ecosystem
            </span>
          </div>

          {/* Right: Language + Login */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Language - Light Crystal Glass */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="hidden sm:flex items-center justify-center w-auto px-4 h-10 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                background: langHovered ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.15)",
                backdropFilter: langHovered ? "blur(12px)" : "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#1e40af",
                boxShadow: langHovered ? "0 4px 16px rgba(0, 0, 0, 0.08)" : "none",
              }}
              onMouseEnter={() => setLangHovered(true)}
              onMouseLeave={() => setLangHovered(false)}
            >
              {language === "en" ? "Français" : "English"}
            </button>

            {/* Login - Heavy Frosted Glass + Gold Rim */}
            <Link href="/login" className="hidden sm:block">
              <Button 
                variant="outline"
                className="px-8 h-11 font-semibold rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  color: "#334155",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                  letterSpacing: "0.03em",
                }}
              >
                Login
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <Menu className="w-6 h-6 text-slate-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <MobileMenu activeBrand={activeBrand} onClose={() => setMobileMenuOpen(false)} language={language} brandTiles={brandTiles} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* BAR 2: Brand Cards + Widget */}
        <div className="py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Cards */}
            <div className="flex-1 flex items-center justify-between gap-4 lg:gap-6">
              {brandTiles.map((tile) => (
                <Link key={tile.id} href={tile.path} className="flex-1">
                  <div
                    className={`group relative flex items-center gap-3 p-3 lg:p-4 rounded-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${activeBrand === tile.id ? "ring-2 ring-offset-2" : ""}`}
                    style={{
                      background: "rgba(255, 255, 255, 0.75)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
                      ringColor: activeBrand === tile.id ? tile.accentColor : "transparent",
                    }}
                  >
                    <img src={tile.iconSrc} alt={tile.name} className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-contain" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm lg:text-base truncate">{tile.name}</div>
                      <div className="text-xs lg:text-sm text-slate-500 truncate">{language === "fr" ? tile.subtitle.fr : tile.subtitle.en}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* SLE AI Widget */}
            <div className="hidden lg:block flex-shrink-0">
              <SLEAICompanionWidget />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
