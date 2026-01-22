import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, UserPlus, BookOpen, Building, Bot, ArrowRight } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/coaches", labelEn: "Find a Coach", labelFr: "Trouver un coach", icon: <Search className="h-4 w-4" /> },
  { href: "/curriculum", labelEn: "Discover Our Courses", labelFr: "Découvrez nos cours", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/for-departments", labelEn: "For Departments", labelFr: "Pour les ministères", icon: <Building className="h-4 w-4" /> },
  { href: "/become-a-coach", labelEn: "Become a Coach", labelFr: "Devenir coach", icon: <UserPlus className="h-4 w-4" /> },
  { href: "/prof-steven-ai", labelEn: "SLE AI Companion", labelFr: "SLE AI Companion", icon: <Bot className="h-4 w-4" /> },
];

export default function LingueefySubHeader() {
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
          <Link href="/lingueefy" className="flex items-center gap-2">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png" 
              alt="Lingueefy" 
              className="h-6 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Lingueefy" : "Lingueefy Navigation"}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{
                    color: active ? "#14C9B0" : "var(--text)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {link.icon}
                  {language === "fr" ? link.labelFr : link.labelEn}
                  {/* Active underline - Menthe accent */}
                  {active && (
                    <span 
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: "var(--lingueefy-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA - Desktop (Menthe local action) */}
          <div className="hidden lg:block">
            <Link href="/coaches">
              <Button 
                size="sm"
                className="rounded-full px-4 font-semibold flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: "var(--lingueefy-accent)",
                  color: "var(--brand-obsidian)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {language === "fr" ? "Commencer" : "Get Started"}
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
                          backgroundColor: active ? "var(--lingueefy-accent-soft)" : "transparent",
                          borderColor: active ? "var(--lingueefy-accent)" : "transparent",
                          color: active ? "#14C9B0" : "var(--text)",
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
                    <Link href="/coaches" onClick={() => setMobileOpen(false)}>
                      <Button 
                        className="w-full rounded-full font-semibold"
                        style={{
                          backgroundColor: "var(--lingueefy-accent)",
                          color: "var(--brand-obsidian)",
                        }}
                      >
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
