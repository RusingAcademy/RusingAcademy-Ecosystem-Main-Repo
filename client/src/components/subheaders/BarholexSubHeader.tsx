import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Briefcase, FolderOpen, Cpu, Mic, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

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

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return location === href || location.startsWith(href + "/");
  };

  return (
    <div 
      style={{ 
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--sand)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-11 items-center justify-between">
          {/* Logo/Brand - Left */}
          <Link href="/barholex-media" className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--brand-obsidian)" }}
            >
              <span style={{ color: "var(--barholex-gold)" }} className="font-bold text-sm">B</span>
            </div>
            <span 
              className="font-semibold text-sm hidden sm:inline"
              style={{ color: "var(--text)" }}
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
                  className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{
                    color: active ? "var(--barholex-gold)" : "var(--text)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {language === "fr" ? link.labelFr : link.labelEn}
                  {/* Active underline - Gold accent */}
                  {active && (
                    <span 
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
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
                className="rounded-full px-4 font-semibold flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: "var(--barholex-gold)",
                  color: "var(--brand-obsidian)",
                  boxShadow: "var(--shadow-md)",
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
