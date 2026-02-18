/**
 * ============================================
 * EMAIL CAPTURE FORM — Premium Glassmorphism
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Premium email capture forms with glassmorphism styling,
 * bilingual support, validation, and analytics integration.
 */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendGA4Event, FunnelTracker } from "@/lib/month5/analytics-enhanced";
import { Mail, ArrowRight, CheckCircle2, Loader2, Shield } from "lucide-react";

export type EmailCaptureVariant = "inline" | "card" | "hero" | "minimal";
export type LeadMagnet = "sle-checklist" | "level-c-roadmap" | "free-assessment" | "newsletter";

interface EmailCaptureFormProps {
  variant?: EmailCaptureVariant;
  leadMagnet?: LeadMagnet;
  source?: string;
  onSuccess?: (email: string) => void;
  className?: string;
}

const LEAD_MAGNET_CONTENT: Record<LeadMagnet, {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  buttonText: { en: string; fr: string };
  icon: string;
}> = {
  "sle-checklist": {
    title: {
      en: "Free SLE Preparation Checklist",
      fr: "Liste de vérification gratuite pour la préparation à l'ELS",
    },
    description: {
      en: "Get our comprehensive 30-point checklist used by 500+ public servants to prepare for their SLE exams. Covers reading, writing, and oral components.",
      fr: "Obtenez notre liste de vérification complète en 30 points utilisée par plus de 500 fonctionnaires pour préparer leurs examens de l'ELS. Couvre les composantes de lecture, d'écriture et d'expression orale.",
    },
    buttonText: {
      en: "Download Free Checklist",
      fr: "Télécharger la liste gratuite",
    },
    icon: "📋",
  },
  "level-c-roadmap": {
    title: {
      en: "Level C Achievement Roadmap",
      fr: "Feuille de route pour atteindre le niveau C",
    },
    description: {
      en: "Our step-by-step guide to achieving Level C proficiency. Includes timeline, study strategies, and insider tips from former SLE evaluators.",
      fr: "Notre guide étape par étape pour atteindre la compétence de niveau C. Comprend un calendrier, des stratégies d'étude et des conseils d'initiés d'anciens évaluateurs de l'ELS.",
    },
    buttonText: {
      en: "Get the Roadmap",
      fr: "Obtenir la feuille de route",
    },
    icon: "🗺️",
  },
  "free-assessment": {
    title: {
      en: "Free Language Assessment",
      fr: "Évaluation linguistique gratuite",
    },
    description: {
      en: "Discover your current proficiency level and get a personalized study plan. Our expert coaches will identify your strengths and areas for improvement.",
      fr: "Découvrez votre niveau de compétence actuel et obtenez un plan d'étude personnalisé. Nos coachs experts identifieront vos forces et vos domaines d'amélioration.",
    },
    buttonText: {
      en: "Book Free Assessment",
      fr: "Réserver une évaluation gratuite",
    },
    icon: "🎯",
  },
  newsletter: {
    title: {
      en: "Stay Informed",
      fr: "Restez informé",
    },
    description: {
      en: "Get weekly tips, SLE preparation strategies, and success stories delivered to your inbox. Join 2,000+ public servants on their bilingual journey.",
      fr: "Recevez des conseils hebdomadaires, des stratégies de préparation à l'ELS et des histoires de réussite dans votre boîte de réception. Rejoignez plus de 2 000 fonctionnaires dans leur parcours bilingue.",
    },
    buttonText: {
      en: "Subscribe",
      fr: "S'abonner",
    },
    icon: "📬",
  },
};

export function EmailCaptureForm({
  variant = "card",
  leadMagnet = "sle-checklist",
  source = "unknown",
  onSuccess,
  className = "",
}: EmailCaptureFormProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const content = LEAD_MAGNET_CONTENT[leadMagnet];

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg(lang === "fr" ? "Veuillez entrer une adresse courriel valide." : "Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // Track conversion
    FunnelTracker.emailCapture(source);
    sendGA4Event("email_capture", {
      lead_magnet: leadMagnet,
      source,
      variant,
    });

    // Simulate API call (replace with actual email platform integration)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStatus("success");
      onSuccess?.(email);
    } catch {
      setErrorMsg(lang === "fr" ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again.");
      setStatus("error");
    }
  }, [email, lang, leadMagnet, source, variant, onSuccess]);

  // Success state
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[var(--brand-foundation)] mb-2">
          {lang === "fr" ? "Merci !" : "Thank You!"}
        </h3>
        <p className="text-[var(--sage-primary)]">
          {lang === "fr"
            ? "Vérifiez votre boîte de réception pour votre ressource gratuite."
            : "Check your inbox for your free resource."}
        </p>
      </motion.div>
    );
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sage-primary)]" aria-hidden="true" />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder={lang === "fr" ? "Votre courriel" : "Your email"}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-[var(--brand-foundation)] placeholder:text-[var(--sage-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cta)]/30 transition-all"
            required
            aria-label={lang === "fr" ? "Adresse courriel" : "Email address"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-[var(--brand-cta)] hover:bg-[var(--brand-cta-2)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--brand-cta)]/25 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </form>
    );
  }

  // Hero variant
  if (variant === "hero") {
    return (
      <div className={`bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] rounded-2xl p-8 md:p-12 text-white ${className}`}>
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block" role="img" aria-label={content.title[lang]}>
            {content.icon}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.title[lang]}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">{content.description[lang]}</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder={lang === "fr" ? "Votre courriel" : "Your email"}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              required
              aria-label={lang === "fr" ? "Adresse courriel" : "Email address"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3.5 bg-white text-[var(--brand-foundation)] font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {content.buttonText[lang]}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
          {status === "error" && (
            <p className="text-red-200 text-sm mt-3" role="alert">{errorMsg}</p>
          )}
          <p className="text-white/50 text-xs mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" aria-hidden="true" />
            {lang === "fr"
              ? "Nous respectons votre vie privée. Désabonnez-vous à tout moment."
              : "We respect your privacy. Unsubscribe at any time."}
          </p>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className={`bg-white/40 backdrop-blur-md rounded-xl border border-white/30 p-5 ${className}`}>
        <h3 className="font-semibold text-[var(--brand-foundation)] mb-2">{content.title[lang]}</h3>
        <p className="text-sm text-[var(--sage-primary)] mb-4">{content.description[lang]}</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder={lang === "fr" ? "Votre courriel" : "Your email"}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/60 border border-white/40 text-sm text-[var(--brand-foundation)] placeholder:text-[var(--sage-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cta)]/30"
            required
            aria-label={lang === "fr" ? "Adresse courriel" : "Email address"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-[var(--brand-cta)] hover:bg-[var(--brand-cta-2)] text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              content.buttonText[lang]
            )}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-500 text-xs mt-2" role="alert">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-8 ${className}`}
    >
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block" role="img" aria-label={content.title[lang]}>
          {content.icon}
        </span>
        <h3 className="text-xl font-bold text-[var(--brand-foundation)] mb-2">{content.title[lang]}</h3>
        <p className="text-sm text-[var(--sage-primary)] max-w-md mx-auto">{content.description[lang]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <div>
          <label htmlFor={`name-${source}`} className="block text-sm font-medium text-[var(--brand-foundation)] mb-1">
            {lang === "fr" ? "Nom" : "Name"}
          </label>
          <input
            id={`name-${source}`}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={lang === "fr" ? "Votre nom" : "Your name"}
            className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-[var(--brand-foundation)] placeholder:text-[var(--sage-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cta)]/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor={`email-${source}`} className="block text-sm font-medium text-[var(--brand-foundation)] mb-1">
            {lang === "fr" ? "Courriel" : "Email"} *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sage-primary)]" aria-hidden="true" />
            <input
              id={`email-${source}`}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder={lang === "fr" ? "votre.courriel@gc.ca" : "your.email@gc.ca"}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 text-[var(--brand-foundation)] placeholder:text-[var(--sage-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cta)]/30 transition-all"
              required
            />
          </div>
        </div>

        {status === "error" && (
          <p className="text-red-500 text-sm" role="alert">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3.5 bg-[var(--brand-cta)] hover:bg-[var(--brand-cta-2)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--brand-cta)]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {content.buttonText[lang]}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-[var(--sage-primary)]/60 text-xs text-center flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" aria-hidden="true" />
          {lang === "fr"
            ? "Nous respectons votre vie privée. Désabonnez-vous à tout moment."
            : "We respect your privacy. Unsubscribe at any time."}
        </p>
      </form>
    </motion.div>
  );
}

export default EmailCaptureForm;
