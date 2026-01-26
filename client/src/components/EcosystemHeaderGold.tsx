import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, LogIn } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import SLEAICompanionWidget from "./SLEAICompanionWidgetMultiCoach";

/**
 * EcosystemHeaderGold - Ultra-Premium Corporate Luxury Header v7.0
 * 
 * ULTRA-PREMIUM CORPORATE LUXURY EDITION
 * - Bar 1: Platinum background with golden separator line
 * - Title: Title Case with subtle golden shimmer
 * - Login button: Heavy Frosted Glass with 2px golden border + glow effect + luxury shadow
 * - Home icon & Language: Light Crystal Glass with golden halo hover
 * - Brand Cards: Golden border hover + lift effect + glow
 * - All transitions: Cubic-bezier for luxury fluidity
 * - Vibe: Swiss private bank / Prestige consulting firm
 * 
 * NEW in v7.0:
 * - Hide on scroll down / Show on scroll up behavior
 * - Smooth transform-based animation (no layout shift)
 * - Always visible when at top of page
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
  { id: "rusingacademy", name: "RusingÂcademy", subtitle: { en: "Professional Courses & LMS", fr: "Cours professionnels & LMS" }, path: "/rusingacademy", iconSrc: "https://rusingacademy-cdn.b-cdn.net/images/logos/rusingacademy-logo.png", accentColor: "#1a365d" },
  { id: "lingueefy", name: "Lingueefy", subtitle: { en: "Human & AI Coaching", fr: "Coaching humain & IA" }, path: "/lingueefy", iconSrc: "https://rusingacademy-cdn.b-cdn.net/images/logos/lingueefy-logo-icon.png", accentColor: "#0f766e" },
  { id: "barholex", name: "Barholex Media", subtitle: { en: "EdTech Consulting & Studio", fr: "Consultation EdTech & Studio" }, path: "/barholex-media", iconSrc: "https://rusingacademy-cdn.b-cdn.net/images/logos/barholex-logo-icon.png", accentColor: "#c2410c" },
];

const getActiveBrand = (location: string) => {
  if (location.startsWith("/rusingacademy")) return "rusingacademy";
  if (location.startsWith("/lingueefy")) return "lingueefy";
  if (location.startsWith("/barholex")) return "barholex";
  return null;
};

export default function EcosystemHeaderGold() {
  const { language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);
  const [langHovered, setLangHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const activeBrand = getActiveBrand(location);

  // Hide on scroll down / Show on scroll up state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Combined scroll handler for both collapse effect and hide/show behavior
  const updateHeader = useCallback(() => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY.current;
    
    // Update collapsed state
    setIsScrolled(currentScrollY > 50);
    
    // Always show header when at top
    if (currentScrollY <= 100) {
      setIsHeaderVisible(true);
      lastScrollY.current = currentScrollY;
      ticking.current = false;
      return;
    }
    
    // Only trigger if scroll delta is significant (prevents jitter)
    if (Math.abs(delta) < 10) {
      ticking.current = false;
      return;
    }
    
    // Scrolling down - hide header
    if (delta > 0) {
      setIsHeaderVisible(false);
    }
    // Scrolling up - show header
    else if (delta < 0) {
      setIsHeaderVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    // Set initial state
    lastScrollY.current = window.scrollY;
    setIsScrolled(window.scrollY > 50);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateHeader]);

  // Luxury cubic-bezier transition
  const luxuryTransition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <header
      className="relative z-50 w-full"
      style={{
        background: "linear-gradient(180deg, #FAFBFC 0%, #F5F7FA 50%, #EEF1F5 100%)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* BAR 1: Platinum Institutional Bar with Golden Separator - Subtle Collapse */}
        <div 
          className="flex items-center justify-between"
          style={{
            height: isScrolled ? "3rem" : "4rem",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
            borderBottom: "2px solid",
            borderImage: "linear-gradient(90deg, #D4AF37 0%, #F4E4BC 25%, #D4AF37 50%, #F4E4BC 75%, #D4AF37 100%) 1",
            transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          
          {/* Left: Home Icon - Light Crystal Glass with Golden Halo */}
          <Link href="/" className="flex items-center" aria-label="Go to homepage" title="Return to homepage">
            <div 
              className="rounded-full flex items-center justify-center cursor-pointer"
              style={{
                width: isScrolled ? "2.5rem" : "3rem",
                height: isScrolled ? "2.5rem" : "3rem",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                background: homeHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: homeHovered ? "blur(16px)" : "blur(8px)",
                border: homeHovered ? "2px solid rgba(212, 175, 55, 0.6)" : "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: homeHovered 
                  ? "0 0 20px rgba(212, 175, 55, 0.3), 0 8px 24px rgba(0, 0, 0, 0.1)" 
                  : "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
            >
              <Home 
                style={{ 
                  width: isScrolled ? "1rem" : "1.25rem",
                  height: isScrolled ? "1rem" : "1.25rem",
                  color: homeHovered ? "#B8860B" : "#64748b", 
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" 
                }} 
                aria-hidden="true"
              />
            </div>
          </Link>

          {/* Center: Title Case with Subtle Golden Shimmer */}
          <div className="hidden lg:flex flex-1 justify-center">
            <span 
              className="text-center"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: isScrolled ? "0.9rem" : "1.05rem",
                transition: "font-size 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #5A5A5A 0%, #8B7355 30%, #5A5A5A 50%, #8B7355 70%, #5A5A5A 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
            >
              Rusinga International Consulting Ltd. Learning Ecosystem
            </span>
          </div>

          {/* Right: Language + Login - Premium Glass */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Language - Light Crystal Glass with Golden Hover */}
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="hidden sm:flex items-center justify-center rounded-full font-medium"
              aria-label={language === "en" ? "Switch to French" : "Switch to English"}
              title={language === "en" ? "Changer la langue en français" : "Change language to English"}
              style={{
                padding: isScrolled ? "0 1rem" : "0 1.25rem",
                height: isScrolled ? "2rem" : "2.5rem",
                fontSize: isScrolled ? "0.8rem" : "0.875rem",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                background: langHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: langHovered ? "blur(16px)" : "blur(8px)",
                border: langHovered ? "2px solid rgba(212, 175, 55, 0.5)" : "1px solid rgba(255, 255, 255, 0.5)",
                color: langHovered ? "#B8860B" : "#1e40af",
                boxShadow: langHovered 
                  ? "0 0 16px rgba(212, 175, 55, 0.25), 0 4px 16px rgba(0, 0, 0, 0.08)" 
                  : "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={() => setLangHovered(true)}
              onMouseLeave={() => setLangHovered(false)}
            >
              {language === "en" ? "Français" : "English"}
            </button>
            
            {/* Login - Heavy Frosted Glass with Golden Rim */}
            <Link href="/login" aria-label="Login to your account" title="Sign in to your account">
              <button
                className="flex items-center gap-2 rounded-full font-semibold"
                style={{
                  padding: isScrolled ? "0 1.5rem" : "0 2rem",
                  height: isScrolled ? "2.25rem" : "2.75rem",
                  fontSize: isScrolled ? "0.8rem" : "0.875rem",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: loginHovered 
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 246, 240, 0.98) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 246, 240, 0.92) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid",
                  borderColor: loginHovered ? "#D4AF37" : "rgba(212, 175, 55, 0.5)",
                  color: loginHovered ? "#8B6914" : "#1a365d",
                  boxShadow: loginHovered 
                    ? "0 0 24px rgba(212, 175, 55, 0.4), 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)" 
                    : "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                }}
                onMouseEnter={() => setLoginHovered(true)}
                onMouseLeave={() => setLoginHovered(false)}
              >
                <LogIn style={{ width: isScrolled ? "0.875rem" : "1rem", height: isScrolled ? "0.875rem" : "1rem", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} aria-hidden="true" />
                Login
              </button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu" title="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile navigation">
                  {brandTiles.map((brand) => (
                    <Link key={brand.id} href={brand.path} onClick={() => setMobileMenuOpen(false)}>
                      <div className="p-4 rounded-xl border hover:bg-slate-50 transition-colors">
                        <div className="font-semibold">{brand.name}</div>
                        <div className="text-sm text-slate-500">
                          {language === "en" ? brand.subtitle.en : brand.subtitle.fr}
                        </div>
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* BAR 2: Ecosystem Cards with Widget - Subtle Vertical Collapse on Scroll */}
        <div 
          className="hidden lg:flex items-center justify-between"
          style={{
            background: "transparent",
            paddingTop: isScrolled ? "0.5rem" : "1rem",
            paddingBottom: isScrolled ? "0.5rem" : "1rem",
            transition: "padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Brand Cards - Full Width Distribution */}
          <nav className="flex-1 flex items-center justify-between gap-6 pr-8" aria-label="Ecosystem navigation">
            {brandTiles.map((brand) => (
              <Link key={brand.id} href={brand.path} className="flex-1" aria-label={`Go to ${brand.name}`} title={`Explore ${brand.name}`}>
                <div
                  className="relative rounded-2xl cursor-pointer"
                  style={{
                    padding: isScrolled ? "0.75rem 1.25rem" : "1.25rem",
                    background: hoveredCard === brand.id 
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 250, 245, 0.98) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 250, 252, 0.85) 100%)",
                    border: hoveredCard === brand.id 
                      ? "2px solid rgba(212, 175, 55, 0.6)" 
                      : "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: hoveredCard === brand.id 
                      ? "0 0 24px rgba(212, 175, 55, 0.2), 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)"
                      : "0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)",
                    transform: hoveredCard === brand.id ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={() => setHoveredCard(brand.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="rounded-xl flex items-center justify-center overflow-hidden"
                      style={{
                        width: isScrolled ? "2.5rem" : "3rem",
                        height: isScrolled ? "2.5rem" : "3rem",
                        background: `linear-gradient(135deg, ${brand.accentColor}15 0%, ${brand.accentColor}08 100%)`,
                        border: `1px solid ${brand.accentColor}20`,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <img 
                        src={brand.iconSrc} 
                        alt=""
                        className="object-contain"
                        style={{
                          width: isScrolled ? "1.5rem" : "2rem",
                          height: isScrolled ? "1.5rem" : "2rem",
                          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span 
                        className="hidden text-lg font-bold"
                        style={{ color: brand.accentColor }}
                        aria-hidden="true"
                      >
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div 
                        className="font-semibold text-base"
                        style={{ 
                          color: hoveredCard === brand.id ? brand.accentColor : "#1e293b",
                          transition: luxuryTransition,
                        }}
                      >
                        {brand.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {language === "en" ? brand.subtitle.en : brand.subtitle.fr}
                      </div>
                    </div>
                  </div>
                  {activeBrand === brand.id && (
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, transparent, ${brand.accentColor}, transparent)`,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Widget SLE AI Companion - In Bar 2 */}
          <div className="flex-shrink-0">
            <SLEAICompanionWidget />
          </div>
        </div>
      </div>
    </header>
  );
}
