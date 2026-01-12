import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Briefcase, FolderOpen, Cpu, Mic, Mail } from "lucide-react";
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
    <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo/Brand - Left */}
          <Link href="/barholex-media" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 font-bold text-lg">B</span>
            </div>
            <span className="text-white font-semibold text-sm hidden sm:inline">
              Barholex Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Barholex Media" : "Barholex Media Navigation"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.icon}
                {language === "fr" ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* CTA - Desktop */}
          <div className="hidden lg:block">
            <Link href="/barholex/contact">
              <Button 
                size="sm"
                className="bg-amber-500 text-black hover:bg-amber-400 rounded-full px-4 font-semibold shadow-md"
              >
                {language === "fr" ? "Nous contacter" : "Get in Touch"}
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
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-gray-900 border-gray-800 h-auto">
                <nav className="flex flex-col gap-2 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        isActive(link.href)
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.icon}
                      {language === "fr" ? link.labelFr : link.labelEn}
                    </Link>
                  ))}
                  <div className="mt-4 px-4">
                    <Link href="/barholex/contact" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-full font-semibold">
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
