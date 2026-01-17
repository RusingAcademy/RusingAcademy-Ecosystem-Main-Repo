import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

/**
 * EcosystemHeaderGold - Institutional Premium Header v6.1
 * 
 * POLISH INSTITUTIONNEL:
 * - Language selector: Canada.ca style (text link "Français" / "English")
 * - Login button: Executive style, wider, glassmorphism outline
 * - Left corner: Minimalist Home icon (replaces full logo)
 * - Center: "Rusinga International Consulting Ltd. Learning Ecosystem" - premium typography
 * 
 * Design inspiration: Canada.ca + Corporate Luxury standards
 * - Institutional elegance with subtle prestige
 * - WCAG 2.1 AA compliant
 * - Ultra-minimalist Bar 1 with centered signature title
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

// Mobile Menu Component
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
        
        {/* ========== BAR 1: Ultra-Minimalist Institutional Bar ========== */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left: Home Icon */}
          <Link href="/" className="flex items-center">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Home className="w-5 h-5 text-slate-600" />
            </div>
          </Link>

          {/* Center: Institutional Signature Title */}
          <div className="hidden lg:flex flex-1 justify-center">
            <span 
              className="text-center"
              style={{
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "#475569",
                textTransform: "uppercase",
              }}
            >
              Rusinga International Consulting Ltd. Learning Ecosystem
            </span>
          </div>

          {/* Right: Language Link + Login Button */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Language Selector - Canada.ca Style (Text Link) */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="hidden sm:block text-sm font-medium transition-colors duration-200 hover:underline underline-offset-4"
              style={{
                color: "#1e40af",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {language === "en" ? "Français" : "English"}
            </button>

            {/* Login Button - Executive Style */}
            <Link href="/login" className="hidden sm:block">
              <Button 
                variant="outline"
                className="px-10 h-11 font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(148, 163, 184, 0.4)",
                  color: "#334155",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  letterSpacing: "0.02em",
                }}
              >
                Login
              </Button>
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl h-10 w-10 hover:bg-slate-100/80"
                >
                  <Menu className="h-5 w-5 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-white">
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

        {/* ========== BAR 2: Brand Cards + Widget (Desktop) ========== */}
        <div className="pb-5 hidden lg:block">
          <div className="flex items-center gap-6">
            {/* Brand Cards - Take most of the width */}
            <div className="flex items-stretch gap-6 flex-1">
              {brandTiles.map((tile) => {
                const isActive = activeBrand === tile.id;
                
                return (
                  <Link key={tile.id} href={tile.path} className="flex-1">
                    <div
                      className={`
                        relative flex items-center gap-4 px-6 py-5 rounded-2xl cursor-pointer
                        transition-all duration-300 h-full
                        ${isActive ? "" : "hover:-translate-y-0.5 hover:shadow-lg"}
                      `}
                      style={{
                        background: isActive ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: isActive ? `2px solid ${tile.accentColor}` : "1px solid rgba(255, 255, 255, 0.9)",
                        boxShadow: isActive ? `0 8px 24px -4px rgba(0, 0, 0, 0.12)` : "0 4px 16px -4px rgba(0, 0, 0, 0.08)",
                        transform: isActive ? "scale(1.01)" : undefined,
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${tile.accentColor}15 0%, ${tile.accentColor}08 100%)`,
                          border: `1px solid ${tile.accentColor}20`,
                        }}
                      >
                        <img src={tile.iconSrc} alt={tile.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800 text-base truncate">{tile.name}</h3>
                        <p className="text-sm text-slate-500 truncate">
                          {language === "fr" ? tile.subtitle.fr : tile.subtitle.en}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Widget SLE AI Companion - Right of Cards */}
            <div className="flex-shrink-0">
              <SLEAICompanionWidget />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
