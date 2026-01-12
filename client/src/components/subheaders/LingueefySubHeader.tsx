import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, UserPlus, DollarSign, HelpCircle, Bot } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  labelEn: string;
  labelFr: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/coaches", labelEn: "Find a Coach", labelFr: "Trouver un coach", icon: <Search className="h-4 w-4" /> },
  { href: "/become-a-coach", labelEn: "Become a Coach", labelFr: "Devenir coach", icon: <UserPlus className="h-4 w-4" /> },
  { href: "/pricing", labelEn: "Pricing", labelFr: "Tarifs", icon: <DollarSign className="h-4 w-4" /> },
  { href: "/faq", labelEn: "FAQ", labelFr: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
  { href: "/prof-steven-ai", labelEn: "Prof Steven AI", labelFr: "Prof Steven AI", icon: <Bot className="h-4 w-4" /> },
];

export default function LingueefySubHeader() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location === href;

  return (
    <div 
      style={{ 
        backgroundColor: "var(--mint)",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo/Brand - Left */}
          <Link href="/lingueefy" className="flex items-center gap-2">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png" 
              alt="Lingueefy" 
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label={language === "fr" ? "Navigation Lingueefy" : "Lingueefy Navigation"}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: isActive(link.href) ? "rgba(255,255,255,0.2)" : "transparent",
                  color: isActive(link.href) ? "white" : "rgba(255,255,255,0.85)",
                }}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.icon}
                {language === "fr" ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* CTA - Desktop (Mint local action) */}
          <div className="hidden lg:block">
            <Link href="/coaches">
              <Button 
                size="sm"
                className="rounded-full px-4 font-semibold"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
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
              <SheetContent 
                side="top" 
                className="h-auto"
                style={{ 
                  backgroundColor: "var(--mint)",
                  borderColor: "rgba(255,255,255,0.2)",
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
                        backgroundColor: isActive(link.href) ? "rgba(255,255,255,0.2)" : "transparent",
                        color: isActive(link.href) ? "white" : "rgba(255,255,255,0.85)",
                      }}
                    >
                      {link.icon}
                      {language === "fr" ? link.labelFr : link.labelEn}
                    </Link>
                  ))}
                  <div className="mt-4 px-4">
                    <Link href="/coaches" onClick={() => setMobileOpen(false)}>
                      <Button 
                        className="w-full rounded-full font-semibold"
                        style={{
                          backgroundColor: "var(--surface)",
                          color: "var(--primary)",
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
