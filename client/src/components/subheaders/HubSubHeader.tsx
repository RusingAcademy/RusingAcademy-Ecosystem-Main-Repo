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
      className="relative"
      style={{ 
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-between">
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-0.5"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Hub" : "Hub Navigation"}
          >
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <div key={link.href} className="flex items-center">
                  <Link
                    href={link.href}
                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg group"
                    style={{
                      color: active ? "#1a365d" : "#64748b",
                    }}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="transition-colors group-hover:text-slate-700">
                      {link.icon}
                    </span>
                    <span className="transition-colors group-hover:text-slate-700">
                      {language === "fr" ? link.labelFr : link.labelEn}
                    </span>
                    {/* Hover underline - only on hover, not active */}
                    <span 
                      className={`absolute bottom-1 left-4 right-4 h-[2px] rounded-full transition-all duration-200 ${
                        active 
                          ? "opacity-100" 
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{ 
                        backgroundColor: active ? "#1a365d" : "#94a3b8",
                      }}
                    />
                  </Link>
                  {/* Separator between items */}
                  {index < navLinks.length - 1 && (
                    <span className="text-slate-200 mx-1 select-none">|</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Brand Tagline - Desktop */}
          <div className="hidden md:block">
            <span 
              className="text-xs font-medium"
              style={{ color: "#94a3b8" }}
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
              style={{ color: "#64748b" }}
            >
              {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
            </span>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-full h-7 w-7"
                  style={{ color: "#94a3b8" }}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="top" 
                className="h-auto"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(0, 0, 0, 0.06)",
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all border-l-2"
                        style={{
                          backgroundColor: active ? "rgba(26, 54, 93, 0.05)" : "transparent",
                          borderColor: active ? "#1a365d" : "transparent",
                          color: active ? "#1a365d" : "#64748b",
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
