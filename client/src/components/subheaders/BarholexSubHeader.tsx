import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Briefcase, FolderOpen, Cpu, Mic, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/barholex/services", labelEn: "Services", labelFr: "Services", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/barholex/portfolio", labelEn: "Portfolio", labelFr: "Portfolio", icon: <FolderOpen className="h-4 w-4" /> },
  { href: "/barholex-media#edtech", labelEn: "EdTech & AI", labelFr: "EdTech & IA", icon: <Cpu className="h-4 w-4" /> },
  { href: "/barholex-media#podcast", labelEn: "Podcast Studio", labelFr: "Studio Balado", icon: <Mic className="h-4 w-4" /> },
  { href: "/barholex/contact", labelEn: "Contact", labelFr: "Contact", icon: <Mail className="h-4 w-4" /> },
];

export default function BarholexSubHeader() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger animation after scrolling past the ecosystem header (~220px)
      setIsScrolled(window.scrollY > 220);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return location === href || location.startsWith(href + "/");
  };

  return (
    <div 
      className="sticky top-0 z-40 transition-all duration-300 ease-in-out"
      style={{ 
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "var(--surface)",
        borderBottom: "1px solid var(--sand)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
        boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center justify-between transition-all duration-300 ease-in-out"
          style={{ height: isScrolled ? "44px" : "44px" }}
        >
          {/* Logo/Brand - Left */}
          <Link href="/barholex-media" className="flex items-center gap-2 transition-all duration-300">
            <div 
              className="flex items-center justify-center rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: "var(--brand-obsidian)",
                width: isScrolled ? "26px" : "28px",
                height: isScrolled ? "26px" : "28px",
              }}
            >
              <span 
                className="font-bold transition-all duration-300"
                style={{ fontSize: isScrolled ? "12px" : "14px", color: "var(--barholex-gold)" }}
              >
                B
              </span>
            </div>
            <span 
              className="font-semibold hidden sm:inline transition-all duration-300"
              style={{ 
                color: "var(--text)",
                fontSize: isScrolled ? "13px" : "14px",
              }}
            >
              Barholex Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Barholex Media" : "Barholex Media Navigation"}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-3 py-2 font-medium transition-all duration-300 rounded-lg"
                  style={{
                    color: active ? "var(--barholex-gold)" : "var(--text)",
                    fontSize: isScrolled ? "13px" : "14px",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {language === "fr" ? link.labelFr : link.labelEn}
                  {/* Active underline - Gold accent */}
                  {active && (
                    <span 
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: "var(--barholex-gold)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA - Desktop (Gold local action) */}
          <div className="hidden lg:block">
            <Link href="/barholex/contact">
              <Button 
                size="sm"
                className="rounded-full font-semibold flex items-center gap-2 transition-all duration-300"
                style={{
                  backgroundColor: "var(--barholex-gold)",
                  color: "var(--brand-obsidian)",
                  boxShadow: isScrolled ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "var(--shadow-md)",
                  padding: isScrolled ? "6px 14px" : "8px 16px",
                  fontSize: isScrolled ? "13px" : "14px",
                }}
              >
                {language === "fr" ? "Nous contacter" : "Get in Touch"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-8 w-8"
                  style={{ color: "var(--muted)" }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="top" 
                className="h-auto"
                style={{ 
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--sand)",
                }}
              >
                <nav className="flex flex-col gap-1 py-4">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all border-l-2"
                        style={{
                          backgroundColor: active ? "var(--barholex-gold-soft)" : "transparent",
                          borderColor: active ? "var(--barholex-gold)" : "transparent",
                          color: active ? "var(--barholex-gold)" : "var(--text)",
                        }}
                      >
                        {link.icon}
                        {language === "fr" ? link.labelFr : link.labelEn}
                      </Link>
                    );
                  })}
                  <div 
                    className="mt-4 px-4"
                    style={{ borderTop: "1px solid var(--sand)", paddingTop: "1rem" }}
                  >
                    <Link href="/barholex/contact" onClick={() => setMobileOpen(false)}>
                      <Button 
                        className="w-full rounded-full font-semibold"
                        style={{
                          backgroundColor: "var(--barholex-gold)",
                          color: "var(--brand-obsidian)",
                        }}
                      >
                        {language === "fr" ? "Nous contacter" : "Get in Touch"}
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
