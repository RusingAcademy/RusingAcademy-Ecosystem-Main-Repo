import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, Building2, Landmark, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/courses", labelEn: "Courses", labelFr: "Formations", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/rusingacademy#b2b", labelEn: "For Business", labelFr: "Entreprises", icon: <Building2 className="h-4 w-4" /> },
  { href: "/rusingacademy#b2g", labelEn: "For Government", labelFr: "Gouvernement", icon: <Landmark className="h-4 w-4" /> },
  { href: "/rusingacademy#team", labelEn: "Our Team", labelFr: "Notre équipe", icon: <Users className="h-4 w-4" /> },
];

export default function RusingAcademySubHeader() {
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
          <Link href="/rusingacademy" className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--brand-cta)" }}
            >
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span 
              className="font-semibold text-sm hidden sm:inline"
              style={{ color: "var(--text)" }}
            >
              RusingÂcademy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation RusingÂcademy" : "RusingÂcademy Navigation"}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{
                    color: active ? "var(--brand-cta)" : "var(--text)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {language === "fr" ? link.labelFr : link.labelEn}
                  {/* Active underline - Copper accent */}
                  {active && (
                    <span 
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: "var(--brand-cta)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA - Desktop (Copper local action) */}
          <div className="hidden lg:block">
            <Link href="/courses">
              <Button 
                size="sm"
                className="btn-cta rounded-full px-4 font-semibold flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: "var(--brand-cta)",
                  color: "white",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {language === "fr" ? "S'inscrire" : "Enroll Now"}
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
                          backgroundColor: active ? "var(--brand-cta-soft)" : "transparent",
                          borderColor: active ? "var(--brand-cta)" : "transparent",
                          color: active ? "var(--brand-cta)" : "var(--text)",
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
                    <Link href="/courses" onClick={() => setMobileOpen(false)}>
                      <Button 
                        className="w-full rounded-full font-semibold btn-cta"
                        style={{
                          backgroundColor: "var(--brand-cta)",
                          color: "white",
                        }}
                      >
                        {language === "fr" ? "S'inscrire" : "Enroll Now"}
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
