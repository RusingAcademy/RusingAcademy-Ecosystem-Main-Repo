import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MapPin, Phone } from "lucide-react";

// Full Lingueefy logo URL from S3
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy_horizontal.png";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer 
      className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200"
      role="contentinfo"
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column - Larger */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img 
                src={LOGO_URL}
                alt="Lingueefy" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-sm">
              {t("footer.tagline")}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:info@lingueefy.com" 
                className="flex items-center gap-3 text-gray-600 hover:text-teal-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Mail className="h-4 w-4 text-teal-600" />
                </div>
                <span className="text-sm">info@lingueefy.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-teal-600" />
                </div>
                <span className="text-sm">Ottawa, Ontario, Canada</span>
              </div>
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">
              {t("footer.forLearners")}
            </h4>
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
                    className="text-gray-600 hover:text-teal-700 transition-colors text-sm inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Coaches */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">
              {t("footer.forCoaches")}
            </h4>
            <ul className="space-y-3" role="list">
              {[
                { href: "/become-a-coach", label: t("footer.becomeCoach") },
                { href: "/faq", label: t("footer.faq") },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-teal-700 transition-colors text-sm inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3" role="list">
              {[
                { href: "/about", label: t("footer.about") },
                { href: "/contact", label: t("footer.contact") },
                { href: "/privacy", label: t("footer.privacy") },
                { href: "/terms", label: t("footer.terms") },
                { href: "/cookies", label: "Cookies" },
                { href: "/accessibility", label: "Accessibility" },
                { href: "/careers", label: "Careers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-teal-700 transition-colors text-sm inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Parent Company Link */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {language === "fr" ? "Une entreprise de" : "A company of"}
              </span>
              <a 
                href="https://www.rusingacademy.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                RusingÂcademy
              </a>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} Rusinga International Consulting Ltd., {language === "fr" ? "commercialement connue sous le nom de" : "commercially known as"} RusingÂcademy. {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
