import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Compass, Users, Mail } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/#ecosystem", labelEn: "Explore", labelFr: "Explorer", icon: <Compass className="h-4 w-4" /> },
  { href: "/community", labelEn: "Community", labelFr: "Communauté", icon: <Users className="h-4 w-4" /> },
  { href: "/contact", labelEn: "Contact", labelFr: "Contact", icon: <Mail className="h-4 w-4" /> },
];

export default function HubSubHeader() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return location === href;
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
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Hub" : "Hub Navigation"}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{
                    color: active ? "var(--brand-foundation)" : "var(--muted)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {language === "fr" ? link.labelFr : link.labelEn}
                  {/* Active underline accent */}
                  {active && (
                    <span 
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: "var(--brand-foundation)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Brand Tagline - Desktop */}
          <div className="hidden md:block">
            <span 
              className="text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              {language === "fr" 
                ? "Votre parcours vers l'excellence bilingue" 
                : "Your Path to Bilingual Excellence"}
            </span>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between w-full">
            <span 
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
            </span>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-8 w-8"
                  style={{ color: "var(--muted)" }}
                >
                  <Menu className="h-4 w-4" />
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
                          backgroundColor: active ? "var(--brand-foundation-soft)" : "transparent",
                          borderColor: active ? "var(--brand-foundation)" : "transparent",
                          color: active ? "var(--brand-foundation)" : "var(--muted)",
                        }}
                      >
                        {link.icon}
                        {language === "fr" ? link.labelFr : link.labelEn}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
