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
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidget";

/**
 * EcosystemHeaderGold - Professional & Innovative Header v5.0
 * 
 * Design principles for Canadian Public Service context:
 * - Professional, trustworthy, and accessible
 * - WCAG 2.1 AA compliant contrast ratios
 * - Modern glassmorphism with institutional elegance
 * - Subtle animations that inspire confidence
 * - Navy/white/grey palette with tasteful accents
 * - Full-width card distribution with breathing room
 * - NO border-top colored lines on cards
 * - Subtle gradient background for depth
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
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeBrand = getActiveBrand(location);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient Background for depth - creates contrast for glassmorphism */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isScrolled 
            ? 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
            : 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.9) 50%, rgba(226,232,240,0.85) 100%)',
        }}
      />
      
      {/* Bar 1: Main Header with glassmorphism */}
      <div className="relative">
        <div 
          className={`
            mx-4 mt-3 rounded-2xl transition-all duration-500
            ${isScrolled ? 'shadow-lg' : 'shadow-md'}
          `}
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: isScrolled 
              ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              : '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
                    boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
                  }}
                >
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">RusingÂcademy</h1>
                  <p className="text-xs text-slate-500 font-medium">Learning Ecosystem</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100/80 transition-all duration-300"
                    >
                      <span className="text-lg">🍁</span>
                      <span className="font-medium text-slate-700">FR/EN</span>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-lg">
                    <DropdownMenuItem onClick={() => setLanguage("en")} className="rounded-lg cursor-pointer">
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("fr")} className="rounded-lg cursor-pointer">
                      Français
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Login Button */}
                <Link href="/auth">
                  <Button 
                    variant="outline"
                    className="px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: '#e2e8f0',
                      color: '#475569',
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="w-6 h-6 text-slate-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl">
                  <div className="flex flex-col gap-6 mt-8">
                    <Link href="/auth" className="text-lg font-semibold text-slate-800">Login</Link>
                    {brandTiles.map((tile) => (
                      <Link key={tile.id} href={tile.path} className="text-slate-600 hover:text-slate-900">
                        {tile.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* SLE AI Companion Widget - positioned to overlap bars */}
        <div className="absolute right-8 top-2 z-10">
          <SLEAICompanionWidget />
        </div>
      </div>

      {/* Bar 2: Brand Cards - Full Width Distribution */}
      <div className="relative px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {brandTiles.map((tile) => (
              <Link key={tile.id} href={tile.path}>
                <div 
                  className={`
                    group relative p-5 rounded-xl cursor-pointer
                    transition-all duration-300 ease-out
                    hover:scale-[1.02] hover:-translate-y-1
                    ${activeBrand === tile.id ? 'ring-2 ring-offset-2' : ''}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
                    ringColor: activeBrand === tile.id ? tile.accentColor : 'transparent',
                  }}
                >
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${tile.accentColor}15 0%, ${tile.accentColor}25 100%)`,
                    }}
                  >
                    <img 
                      src={tile.iconSrc} 
                      alt={tile.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Text */}
                  <h3 className="font-semibold text-slate-800 text-base mb-1">{tile.name}</h3>
                  <p className="text-sm text-slate-500">{tile.subtitle[language]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
