import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin } from "lucide-react";

// Official Lingueefy logo from S3 (glassmorphism bubble with maple leaf)
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png";

export default function Footer() {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/rusingacademy", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/rusingacademy", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/rusingacademy", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/rusingacademy", label: "Instagram" },
  ];

  return (
    <footer 
      className="relative border-t border-gray-100/50"
      role="contentinfo"
      aria-label={language === "fr" ? "Pied de page" : "Footer"}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-footer" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl">
              <img 
                src={LOGO_URL}
                alt="Lingueefy" 
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-2">
              <a 
                href="mailto:admin@rusingacademy.ca" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-teal-600 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg glass-subtle flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                admin@rusingacademy.ca
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-8 w-8 rounded-lg glass-subtle flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                Ottawa, Ontario, Canada
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl glass-subtle flex items-center justify-center text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("footer.forLearners")}
            </h4>
            <nav aria-label={language === "fr" ? "Liens pour apprenants" : "Learner links"}>
              <ul className="space-y-3" role="list">
                {[
                  { href: "/coaches", label: t("footer.findCoach") },
                  { href: "/ai-coach", label: t("footer.aiCoach") },
                  { href: "/pricing", label: t("footer.pricing") },
                  { href: "/how-it-works", label: t("footer.howItWorks") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-teal-600 transition-colors text-sm focus-visible:outline-none focus-visible:text-teal-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* For Coaches */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("footer.forCoaches")}
            </h4>
            <nav aria-label={language === "fr" ? "Liens pour coachs" : "Coach links"}>
              <ul className="space-y-3" role="list">
                {[
                  { href: "/become-a-coach", label: t("footer.becomeCoach") },
                  { href: "/faq", label: t("footer.faq") },
                  { href: "/blog", label: "Blog" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-teal-600 transition-colors text-sm focus-visible:outline-none focus-visible:text-teal-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
              {t("footer.company")}
            </h4>
            <nav aria-label={language === "fr" ? "Liens de l'entreprise" : "Company links"}>
              <ul className="space-y-3" role="list">
                {[
                  { href: "/about", label: t("footer.about") },
                  { href: "/contact", label: t("footer.contact") },
                  { href: "/privacy", label: t("footer.privacy") },
                  { href: "/terms", label: t("footer.terms") },
                  { href: "/cookies", label: "Cookies" },
                  { href: "/accessibility", label: "Accessibility" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-teal-600 transition-colors text-sm focus-visible:outline-none focus-visible:text-teal-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Glassmorphism */}
      <div className="border-t border-gray-200/50 glass-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Parent Company Link */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {language === "fr" ? "Une entreprise de" : "A company of"}
              </span>
              <a 
                href="https://www.rusingacademy.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                RusingÂcademy
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {currentYear} <span className="font-medium">Rusinga International Consulting Ltd.</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "fr" 
                  ? "Commercialement connue sous le nom de RusingÂcademy. Tous droits réservés."
                  : "Commercially known as RusingÂcademy. All rights reserved."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
