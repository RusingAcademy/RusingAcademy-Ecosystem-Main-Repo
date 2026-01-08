import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer 
      className="border-t bg-muted/30 py-12"
      role="contentinfo"
    >
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo-icon.png" 
                alt="" 
                className="h-8 w-8"
                aria-hidden="true"
              />
              <span className="text-lg font-bold text-primary">Lingueefy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          {/* For Learners */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.forLearners")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link 
                  href="/coaches" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.findCoach")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/ai-coach" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.aiCoach")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.howItWorks")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Coaches */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.forCoaches")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link 
                  href="/become-a-coach" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.becomeCoach")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a 
              href="https://www.rusingacademy.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Rusing Academy
            </a>
          </div>
        </div>

        {/* Copyright - Rusinga International Consulting Ltd. */}
        <div className="border-t mt-6 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Rusinga International Consulting Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
