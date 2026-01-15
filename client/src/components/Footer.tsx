import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Globe, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Official Lingueefy logo from S3 (glassmorphism bubble with maple leaf)
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663049070748/gvnmYNphKZgt9jM9K8Vi9K/logos/lingueefy-official-logo.png";

export default function Footer() {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");
    setName("");
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/rusingacademy", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/rusingacademy", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/rusingacademy", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/rusingacademy", label: "Instagram" },
  ];

  return (
    <footer 
      className="relative bg-slate-900 text-white overflow-visible"
      role="contentinfo"
      aria-label={language === "fr" ? "Pied de page" : "Footer"}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-slate-900" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl" aria-hidden="true" />
      
      {/* Contact Form Section */}
      <div className="border-b border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-8 md:p-10 shadow-2xl shadow-teal-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {language === "fr" ? "Prêt à commencer ?" : "Ready to Get Started?"}
                  </h3>
                  <p className="text-teal-100 text-base">
                    {language === "fr" 
                      ? "Inscrivez-vous pour recevoir des conseils gratuits sur les examens SLE et des offres exclusives."
                      : "Sign up to receive free SLE exam tips and exclusive offers."}
                  </p>
                </div>
                
                {isSubmitted ? (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-white mx-auto mb-3" />
                    <p className="text-white font-semibold text-lg">
                      {language === "fr" ? "Merci !" : "Thank you!"}
                    </p>
                    <p className="text-teal-100 text-sm mt-1">
                      {language === "fr" 
                        ? "Nous vous contacterons bientôt."
                        : "We'll be in touch soon."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder={language === "fr" ? "Votre nom" : "Your name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    />
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder={language === "fr" ? "Votre courriel" : "Your email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                      />
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 h-auto bg-white text-teal-600 hover:bg-teal-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-teal-100/80">
                      {language === "fr" 
                        ? "En vous inscrivant, vous acceptez notre politique de confidentialité."
                        : "By signing up, you agree to our privacy policy."}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-xl">
              <img 
                src={LOGO_URL}
                alt="Lingueefy" 
                className="h-14 w-auto brightness-110"
              />
            </Link>
            <p className="text-slate-300 max-w-sm leading-relaxed text-base">
              {t("footer.tagline")}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 pt-2">
              <a 
                href="mailto:admin@rusingacademy.ca" 
                className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors group"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:border-teal-500/50 group-hover:bg-teal-900/30 transition-all">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">admin@rusingacademy.ca</span>
              </a>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Ottawa, Ontario, Canada</span>
              </div>
              <a 
                href="https://www.rusingacademy.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-300 hover:text-teal-400 transition-colors group"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:border-teal-500/50 group-hover:bg-teal-900/30 transition-all">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">www.rusingacademy.com</span>
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-teal-600 hover:border-teal-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider border-b border-teal-500/30 pb-3">
              {t("footer.forLearners")}
            </h4>
            <nav aria-label={language === "fr" ? "Liens pour apprenants" : "Learner links"}>
              <ul className="space-y-3" role="list">
                {[
                  { href: "/coaches", label: t("footer.findCoach") },
                  { href: "/pricing", label: t("footer.pricing") },
                  { href: "/curriculum", label: language === "fr" ? "Notre Curriculum" : "Our Curriculum" },
                  { href: "/faq", label: t("footer.faq") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-teal-400 transition-colors text-sm font-medium hover:translate-x-1 inline-block"
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
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider border-b border-teal-500/30 pb-3">
              {t("footer.forCoaches")}
            </h4>
            <nav aria-label={language === "fr" ? "Liens pour coachs" : "Coach links"}>
              <ul className="space-y-3" role="list">
                {[
                  { href: "/become-a-coach", label: t("footer.becomeCoach") },
                  { href: "/for-departments", label: language === "fr" ? "Pour les ministères" : "For Departments" },
                  { href: "/blog", label: "Blog" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-teal-400 transition-colors text-sm font-medium hover:translate-x-1 inline-block"
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
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider border-b border-teal-500/30 pb-3">
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
                  { href: "/accessibility", label: language === "fr" ? "Accessibilité" : "Accessibility" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-slate-300 hover:text-teal-400 transition-colors text-sm font-medium hover:translate-x-1 inline-block"
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

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 bg-slate-950/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Parent Company Link */}
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="text-sm text-slate-400">
                {language === "fr" ? "Une entreprise de" : "A company of"}
              </span>
              <a 
                href="https://www.rusingacademy.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors"
              >
                RusingÂcademy
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-300">
                © 2026 <span className="font-semibold text-white">Rusinga International Consulting Ltd.</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
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
