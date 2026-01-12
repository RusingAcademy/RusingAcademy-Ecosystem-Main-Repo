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
    <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50">
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
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.icon}
                {language === "fr" ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* Brand Tagline - Desktop */}
          <div className="hidden md:block">
            <span className="text-xs text-slate-400 font-medium">
              {language === "fr" 
                ? "Votre parcours vers l'excellence bilingue" 
                : "Your Path to Bilingual Excellence"}
            </span>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between w-full">
            <span className="text-sm text-slate-300 font-medium">
              {language === "fr" ? "Hub Écosystème" : "Ecosystem Hub"}
            </span>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-slate-800 border-slate-700 h-auto">
                <nav className="flex flex-col gap-2 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        isActive(link.href)
                          ? "bg-white/10 text-white"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
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
