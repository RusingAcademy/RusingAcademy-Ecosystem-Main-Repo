import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

// Full Lingueefy logo URL from S3
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy_horizontal.png";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
        scrolled 
          ? "shadow-md border-b border-gray-100" 
          : "border-b border-transparent"
      }`}
      role="banner"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Large and Prominent */}
          <Link 
            href="/" 
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Lingueefy - Home"
          >
            <img 
              src={LOGO_URL}
              alt="Lingueefy" 
              className="h-14 sm:h-16 lg:h-[72px] w-auto object-contain"
              style={{ maxWidth: "240px" }}
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav 
            className="hidden lg:flex items-center justify-center flex-1 px-8"
            role="navigation"
            aria-label={language === "fr" ? "Navigation principale" : "Main navigation"}
          >
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    isActive(link.href)
                      ? "text-teal-700 bg-teal-50"
                      : "text-gray-600 hover:text-teal-700 hover:bg-gray-50"
                  }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher - Elegant Design */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-full px-3 h-9 font-medium"
                  aria-label={language === "fr" ? "Changer de langue" : "Change language"}
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span className="uppercase text-xs tracking-wide">{language}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-gray-100">
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className={`cursor-pointer rounded-lg mx-1 ${language === "en" ? "bg-teal-50 text-teal-700" : ""}`}
                >
                  <span className="mr-2">🇬🇧</span> English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("fr")}
                  className={`cursor-pointer rounded-lg mx-1 ${language === "fr" ? "bg-teal-50 text-teal-700" : ""}`}
                >
                  <span className="mr-2">🇫🇷</span> Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 h-10 font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    {t("nav.dashboard")}
                  </Button>
                </Link>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-teal-700 hover:bg-gray-50 rounded-full px-5 h-10 font-medium"
                    >
                      {t("nav.signIn")}
                    </Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 h-10 font-medium shadow-sm hover:shadow-md transition-all duration-200">
                      {t("nav.getStarted")}
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full h-10 w-10 text-gray-600 hover:text-teal-700 hover:bg-gray-50"
                  aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b border-gray-100">
                    <img 
                      src={LOGO_URL}
                      alt="Lingueefy" 
                      className="h-10 w-auto"
                    />
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav 
                    className="flex-1 overflow-y-auto py-4"
                    role="navigation"
                    aria-label={language === "fr" ? "Menu mobile" : "Mobile menu"}
                  >
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center text-base font-medium py-3 px-6 transition-colors ${
                          isActive(link.href)
                            ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600"
                            : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  {/* Mobile Auth Buttons */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    {isAuthenticated ? (
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full h-12 font-medium">
                          {t("nav.dashboard")}
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <a href={getLoginUrl()} className="block">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-full h-12 font-medium border-gray-200 text-gray-700 hover:bg-white"
                          >
                            {t("nav.signIn")}
                          </Button>
                        </a>
                        <a href={getLoginUrl()} className="block">
                          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full h-12 font-medium">
                            {t("nav.getStarted")}
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
