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
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

/**
 * EcosystemHeaderGold - Professional & Innovative Header v6.0
 * 
 * MAJOR LAYOUT CHANGE:
 * - Widget SLE AI Companion moved ENTIRELY into Bar 2 (right of cards)
 * - Bar 1 is now ultra-minimalist (flag icon only + wider Login button)
 * 
 * Design principles for Canadian Public Service context:
 * - Professional, trustworthy, and accessible
 * - WCAG 2.1 AA compliant contrast ratios
 * - Modern glassmorphism with institutional elegance
 * - Ultra-minimalist Bar 1 (flag icon + login only)
 * - Widget in Bar 2, centered vertically, right of cards
 * - Full-width card distribution with breathing room
 * - NO border-top colored lines on cards
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

export default function EcosystemHeaderGold() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const activeBrand = getActiveBrand(location);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full" role="banner">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:bg-blue-700 focus:text-white"
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      <div 
        className="relative"
        style={{
          background: `linear-gradient(180deg, #f8fafc 0%, #f1f5f9 40%, #e2e8f0 100%)`,
          boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Subtle gradient line at top for brand signature */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, #1a365d 0%, #0f766e 50%, #c2410c 100%)", opacity: 0.8 }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* ========== BAR 1: Ultra-Minimalist Top Bar ========== */}
          <div className="py-4">
            <div 
              className="flex items-center justify-between px-6 py-3 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Logo + Brand Name */}
              <Link 
                href="/"
                className="flex items-center gap-3.5 transition-opacity duration-200 hover:opacity-85"
              >
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src="/images/logos/rusingacademy-logo.png" 
                    alt="RusingAcademy" 
                    className="w-11 h-11 object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold tracking-tight text-slate-800">
                    RusingÂcademy
                  </span>
                  <span className="text-xs font-medium tracking-wide text-slate-500">
                    Learning Ecosystem
                  </span>
                </div>
              </Link>

              {/* Right side: Flag Icon + Login Button (pushed to extreme right) */}
              <div className="flex items-center gap-4">
                {/* Language Selector - Flag Icon Only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-11 w-11 rounded-full hover:bg-slate-100/80 transition-all duration-200"
                      style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <span className="text-xl">🇨🇦</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-44 rounded-xl p-1.5 bg-white/98 backdrop-blur-xl border border-slate-100 shadow-lg"
                  >
                    <DropdownMenuItem 
                      onClick={() => setLanguage("en")}
                      className={`cursor-pointer rounded-lg px-3 py-2.5 ${language === "en" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                    >
                      <span className="mr-2.5 text-lg">🇨🇦</span> 
                      <span className="font-medium text-slate-700">English</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setLanguage("fr")}
                      className={`cursor-pointer rounded-lg px-3 py-2.5 ${language === "fr" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                    >
                      <span className="mr-2.5 text-lg">🇨🇦</span> 
                      <span className="font-medium text-slate-700">Français</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Login Button - Wider and More Elegant */}
                <Link href="/login" className="hidden sm:block">
                  <Button 
                    variant="outline"
                    className="px-8 h-11 font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    style={{
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
                            background: isActive 
                              ? `linear-gradient(135deg, ${tile.accentColor} 0%, ${tile.accentColor}dd 100%)`
                              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                            boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 6px rgba(0, 0, 0, 0.06)",
                          }}
                        >
                          <img 
                            src={tile.iconSrc} 
                            alt={tile.name} 
                            className="w-7 h-7 object-contain"
                            style={{ filter: isActive ? "brightness(0) invert(1)" : "none" }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 text-base truncate">
                            {tile.name}
                          </span>
                          <span className="text-xs text-slate-500 truncate">
                            {tile.subtitle[language]}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Widget SLE AI Companion - Positioned in Bar 2, right of cards */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <SLEAICompanionWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ 
  activeBrand, 
  onClose, 
  language,
  brandTiles 
}: { 
  activeBrand: string | null;
  onClose: () => void;
  language: string;
  brandTiles: BrandTile[];
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <span className="font-semibold text-slate-800">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {brandTiles.map((tile) => {
          const isActive = activeBrand === tile.id;
          return (
            <Link key={tile.id} href={tile.path} onClick={onClose}>
              <div
                className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                  isActive ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${tile.accentColor} 0%, ${tile.accentColor}dd 100%)`
                      : "#f1f5f9",
                  }}
                >
                  <img 
                    src={tile.iconSrc} 
                    alt={tile.name} 
                    className="w-5 h-5 object-contain"
                    style={{ filter: isActive ? "brightness(0) invert(1)" : "none" }}
                  />
                </div>
                <div>
                  <div className="font-medium text-slate-800">{tile.name}</div>
                  <div className="text-xs text-slate-500">{tile.subtitle[language]}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <Link href="/login" onClick={onClose}>
          <Button className="w-full h-12 font-semibold rounded-xl bg-slate-800 hover:bg-slate-700">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
