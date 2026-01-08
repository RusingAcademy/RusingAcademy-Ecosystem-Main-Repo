import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/coaches", label: t("nav.findCoach") },
    { href: "/ai-coach", label: t("nav.aiCoach") },
    { href: "/how-it-works", label: t("nav.howItWorks") },
    { href: "/for-departments", label: language === "fr" ? "Pour les ministères" : "For Departments" },
    { href: "/become-a-coach", label: t("nav.becomeCoach") },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only"
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>
      
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          aria-label="Lingueefy - Home"
        >
          <img 
            src="/logo-icon.png" 
            alt="" 
            className="h-10 w-10"
            aria-hidden="true"
          />
          <span className="text-xl font-bold text-primary hidden sm:inline">Lingueefy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav 
          className="hidden lg:flex items-center gap-6"
          role="navigation"
          aria-label={language === "fr" ? "Navigation principale" : "Main navigation"}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                aria-label={language === "fr" ? "Changer de langue" : "Change language"}
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="uppercase font-medium">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-accent" : ""}
              >
                <span className="mr-2">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage("fr")}
                className={language === "fr" ? "bg-accent" : ""}
              >
                <span className="mr-2">🇫🇷</span> Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>{t("nav.dashboard")}</Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost">{t("nav.signIn")}</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button>{t("nav.getStarted")}</Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav 
                className="flex flex-col gap-4 mt-8"
                role="navigation"
                aria-label={language === "fr" ? "Menu mobile" : "Mobile menu"}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium py-2 px-4 rounded-md transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">{t("nav.dashboard")}</Button>
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <a href={getLoginUrl()} className="block">
                        <Button variant="outline" className="w-full">
                          {t("nav.signIn")}
                        </Button>
                      </a>
                      <a href={getLoginUrl()} className="block">
                        <Button className="w-full">{t("nav.getStarted")}</Button>
                      </a>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
