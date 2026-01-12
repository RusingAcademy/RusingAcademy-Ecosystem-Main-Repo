import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Sun, Moon, Menu, X, Cog } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Steven Barholere avatar for Human+AI signature
const STEVEN_AVATAR = "/images/team/steven-barholere.jpg";

// Brand tiles configuration
interface BrandTile {
  id: string;
  name: string;
  path: string;
  bgColor: string;
  textColor: string;
  logo: React.ReactNode;
  activeGlow: string;
}

const brandTiles: BrandTile[] = [
  {
    id: "rusingacademy",
    name: "RusingÂcademy",
    path: "/rusingacademy",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    textColor: "text-white",
    logo: (
      <span className="font-bold text-2xl mr-2">R</span>
    ),
    activeGlow: "ring-orange-400 shadow-orange-400/50",
  },
  {
    id: "lingueefy",
    name: "Lingueefy",
    path: "/lingueefy",
    bgColor: "bg-white",
    textColor: "text-gray-800",
    logo: (
      <img 
        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png" 
        alt="Lingueefy" 
        className="h-8 w-auto mr-2"
      />
    ),
    activeGlow: "ring-teal-400 shadow-teal-400/50",
  },
  {
    id: "barholex",
    name: "Barholex Media",
    path: "/barholex-media",
    bgColor: "bg-gradient-to-br from-gray-900 to-black",
    textColor: "text-white",
    logo: (
      <span className="font-bold text-2xl mr-2 text-amber-400">B</span>
    ),
    activeGlow: "ring-amber-400 shadow-amber-400/50",
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

export default function EcosystemHeader() {
  const { language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
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
        scrolled ? "shadow-lg" : ""
      }`}
      role="banner"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-xl"
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      {/* ===== TOP BAR - Institutional ===== */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            {/* Company Identity - Left */}
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="text-sm font-serif tracking-wide">
                Rusinga International Consulting Ltd.
              </span>
              <span className="hidden sm:inline text-slate-400 font-light">|</span>
              <span className="hidden sm:inline text-sm text-slate-500 font-medium">
                Learning Ecosystem
              </span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1.5 text-slate-600 hover:text-slate-900 rounded-full px-2 sm:px-3 h-9 font-medium hover:bg-slate-100 transition-all"
                    aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {language === "en" ? "🇺🇸" : "🇫🇷"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-slate-200 bg-white p-1">
                  <DropdownMenuItem 
                    onClick={() => setLanguage("en")}
                    className={`cursor-pointer rounded-lg px-3 py-2.5 transition-all ${
                      language === "en" ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2 text-lg">🇺🇸</span> 
                    <span className="font-medium">English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage("fr")}
                    className={`cursor-pointer rounded-lg px-3 py-2.5 transition-all ${
                      language === "fr" ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2 text-lg">🇫🇷</span> 
                    <span className="font-medium">Français</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle - Desktop only */}
              {toggleTheme && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="hidden sm:flex w-9 h-9 rounded-full hover:bg-slate-100 transition-all"
                  aria-label={isDark ? (language === "fr" ? "Mode clair" : "Light mode") : (language === "fr" ? "Mode sombre" : "Dark mode")}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-600" />
                  )}
                </Button>
              )}

              {/* CTA - Join Our Community */}
              <Link href="/community">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 sm:px-6 h-9 font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  aria-label={language === "fr" ? "Rejoindre notre communauté" : "Join Our Community"}
                >
                  <span className="hidden sm:inline">
                    {language === "fr" ? "Rejoindre la communauté" : "Join Our Community"}
                  </span>
                  <span className="sm:hidden">
                    {language === "fr" ? "Rejoindre" : "Join"}
                  </span>
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 bg-white">
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

      {/* ===== MAIN HEADER - Brand Navigation ===== */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6b7b6e 0%, #8a9a7d 25%, #a3b396 50%, #8a9a7d 75%, #6b7b6e 100%)",
        }}
      >
        {/* Fog/mist overlay effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex h-20 sm:h-24 items-center justify-between">
            {/* Brand Tiles - Center */}
            <nav 
              className="hidden lg:flex items-center justify-center flex-1 gap-4"
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
                    <motion.div
                      className={`
                        flex items-center px-6 py-3 rounded-xl cursor-pointer
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        ${tile.bgColor} ${tile.textColor}
                        ${isActive ? `ring-2 ${tile.activeGlow} shadow-xl scale-105` : "hover:scale-[1.02]"}
                      `}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tile.logo}
                      <span className="font-semibold text-base whitespace-nowrap">
                        {tile.name}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Human + AI Signature - Right */}
            <Link 
              href="/prof-steven-ai"
              className="hidden lg:flex items-center gap-1 group"
              aria-label={language === "fr" ? "Prof Steven AI - Votre coach IA" : "Prof Steven AI - Your AI Coach"}
            >
              <div className="relative">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg group-hover:border-amber-400 transition-all">
                  <img 
                    src={STEVEN_AVATAR}
                    alt="Steven Barholere"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";
                    }}
                  />
                </div>
                {/* AI Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
            </Link>

            {/* Mobile Brand Indicator */}
            <div className="lg:hidden flex items-center gap-3">
              {activeBrand && activeBrand !== "hub" && (
                <div className="flex items-center px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
                  <span className="text-white text-sm font-medium">
                    {brandTiles.find(t => t.id === activeBrand)?.name || "Ecosystem"}
                  </span>
                </div>
              )}
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
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <span className="text-lg font-serif text-slate-800">
          Learning Ecosystem
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Brand Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === "fr" ? "Nos marques" : "Our Brands"}
          </span>
        </div>
        
        {/* Hub Link */}
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center px-6 py-4 transition-all ${
            activeBrand === "hub" 
              ? "bg-slate-100 border-l-4 border-slate-600" 
              : "hover:bg-slate-50 border-l-4 border-transparent"
          }`}
        >
          <span className="font-medium text-slate-700">
            {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
          </span>
        </Link>

        {brandTiles.map((tile) => {
          const isActive = activeBrand === tile.id;
          return (
            <Link
              key={tile.id}
              href={tile.path}
              onClick={onClose}
              className={`flex items-center px-6 py-4 transition-all ${
                isActive 
                  ? "bg-slate-100 border-l-4 border-slate-600" 
                  : "hover:bg-slate-50 border-l-4 border-transparent"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${tile.bgColor}`}>
                {tile.id === "rusingacademy" && <span className="text-white font-bold">R</span>}
                {tile.id === "lingueefy" && <span className="text-teal-600 font-bold text-xs">L</span>}
                {tile.id === "barholex" && <span className="text-amber-400 font-bold">B</span>}
              </div>
              <span className="font-medium text-slate-700">{tile.name}</span>
            </Link>
          );
        })}

        <div className="my-4 border-t border-slate-100" />

        {/* Quick Links */}
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === "fr" ? "Liens rapides" : "Quick Links"}
          </span>
        </div>
        
        <Link
          href="/prof-steven-ai"
          onClick={onClose}
          className="flex items-center px-6 py-4 hover:bg-slate-50 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mr-3">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="font-medium text-slate-700">Prof Steven AI</span>
        </Link>

        <Link
          href="/community"
          onClick={onClose}
          className="flex items-center px-6 py-4 hover:bg-slate-50 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
            <span className="text-white text-xs">👥</span>
          </div>
          <span className="font-medium text-slate-700">
            {language === "fr" ? "Communauté" : "Community"}
          </span>
        </Link>
      </nav>
    </div>
  );
}
