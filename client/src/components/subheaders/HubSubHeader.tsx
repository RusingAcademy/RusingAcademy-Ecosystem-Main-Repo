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
        backgroundColor: "var(--primary)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Hub" : "Hub Navigation"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: isActive(link.href) ? "rgba(255,255,255,0.15)" : "transparent",
                  color: isActive(link.href) ? "white" : "rgba(255,255,255,0.85)",
                }}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.icon}
                {language === "fr" ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* Brand Tagline - Desktop */}
          <div className="hidden md:block">
            <span 
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.7)" }}
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
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
            </span>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                  className="hover:bg-white/10"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="top" 
                className="h-auto"
                style={{ 
                  backgroundColor: "var(--primary)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <nav className="flex flex-col gap-2 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
                      style={{
                        backgroundColor: isActive(link.href) ? "rgba(255,255,255,0.15)" : "transparent",
                        color: isActive(link.href) ? "white" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      {link.icon}
                      {language === "fr" ? link.labelFr : link.labelEn}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
