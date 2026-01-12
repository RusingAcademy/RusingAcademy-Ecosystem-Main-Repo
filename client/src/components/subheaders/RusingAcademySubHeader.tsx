import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, Route, Building2, DollarSign, Rocket } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/courses", labelEn: "Courses", labelFr: "Cours", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/rusingacademy/programs", labelEn: "Path Series", labelFr: "Path Series", icon: <Route className="h-4 w-4" /> },
  { href: "/for-departments", labelEn: "For Departments", labelFr: "Pour les ministères", icon: <Building2 className="h-4 w-4" /> },
  { href: "/pricing", labelEn: "Pricing", labelFr: "Tarifs", icon: <DollarSign className="h-4 w-4" /> },
];

export default function RusingAcademySubHeader() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location === href || location.startsWith(href + "/");

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-400/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo/Brand - Left */}
          <Link href="/rusingacademy" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-semibold text-sm hidden sm:inline">
              RusingÂcademy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation RusingÂcademy" : "RusingÂcademy Navigation"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
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
            <Link href="/courses">
              <Button 
                size="sm"
                className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-4 font-semibold shadow-md flex items-center gap-2"
              >
                <Rocket className="h-4 w-4" />
                {language === "fr" ? "Commencer" : "Get Started"}
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
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-orange-500 border-orange-400 h-auto">
                <nav className="flex flex-col gap-2 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        isActive(link.href)
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.icon}
                      {language === "fr" ? link.labelFr : link.labelEn}
                    </Link>
                  ))}
                  <div className="mt-4 px-4">
                    <Link href="/courses" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 rounded-full font-semibold flex items-center justify-center gap-2">
                        <Rocket className="h-4 w-4" />
                        {language === "fr" ? "Commencer" : "Get Started"}
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
