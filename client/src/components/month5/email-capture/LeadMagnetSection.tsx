/**
 * ============================================
 * LEAD MAGNET SECTION — Landing Page Component
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Full-width section showcasing lead magnets with
 * glassmorphism cards and email capture forms.
 */
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmailCaptureForm, type LeadMagnet } from "./EmailCaptureForm";
import { FileText, Map, Target, BookOpen, ArrowRight } from "lucide-react";

interface LeadMagnetItem {
  id: LeadMagnet;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const LEAD_MAGNETS: LeadMagnetItem[] = [
  { id: "sle-checklist", icon: FileText, color: "#2563EB", bgColor: "#EFF6FF" },
  { id: "level-c-roadmap", icon: Map, color: "#7C3AED", bgColor: "#F5F3FF" },
  { id: "free-assessment", icon: Target, color: "#059669", bgColor: "#ECFDF5" },
  { id: "newsletter", icon: BookOpen, color: "#D97706", bgColor: "#FFFBEB" },
];

const LEAD_MAGNET_TITLES: Record<LeadMagnet, { en: string; fr: string }> = {
  "sle-checklist": {
    en: "SLE Preparation Checklist",
    fr: "Liste de vérification ELS",
  },
  "level-c-roadmap": {
    en: "Level C Roadmap",
    fr: "Feuille de route niveau C",
  },
  "free-assessment": {
    en: "Free Assessment",
    fr: "Évaluation gratuite",
  },
  newsletter: {
    en: "Weekly Newsletter",
    fr: "Infolettre hebdomadaire",
  },
};

const LEAD_MAGNET_DESCRIPTIONS: Record<LeadMagnet, { en: string; fr: string }> = {
  "sle-checklist": {
    en: "30-point checklist covering all SLE components",
    fr: "Liste en 30 points couvrant toutes les composantes de l'ELS",
  },
  "level-c-roadmap": {
    en: "Step-by-step guide to achieving Level C proficiency",
    fr: "Guide étape par étape pour atteindre le niveau C",
  },
  "free-assessment": {
    en: "Discover your current level with our expert coaches",
    fr: "Découvrez votre niveau actuel avec nos coachs experts",
  },
  newsletter: {
    en: "Weekly tips and success stories from public servants",
    fr: "Conseils hebdomadaires et histoires de réussite de fonctionnaires",
  },
};

interface LeadMagnetSectionProps {
  /** Show all lead magnets or just one */
  featured?: LeadMagnet;
  /** Layout variant */
  variant?: "grid" | "single" | "highlight";
  className?: string;
}

export function LeadMagnetSection({
  featured,
  variant = "grid",
  className = "",
}: LeadMagnetSectionProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";

  const title = lang === "fr"
    ? "Ressources gratuites pour votre réussite"
    : "Free Resources for Your Success";
  const subtitle = lang === "fr"
    ? "Téléchargez nos guides et outils conçus par des experts pour les fonctionnaires fédéraux"
    : "Download our expert-crafted guides and tools designed for federal public servants";

  if (variant === "single" && featured) {
    return (
      <section className={`py-16 md:py-24 ${className}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailCaptureForm
            variant="card"
            leadMagnet={featured}
            source="lead-magnet-section"
          />
        </div>
      </section>
    );
  }

  if (variant === "highlight" && featured) {
    return (
      <section className={`py-16 md:py-24 ${className}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailCaptureForm
            variant="hero"
            leadMagnet={featured}
            source="lead-magnet-highlight"
          />
        </div>
      </section>
    );
  }

  // Grid variant
  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="lead-magnets-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            id="lead-magnets-title"
            className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)] mb-3"
          >
            {title}
          </h2>
          <p className="text-lg text-[var(--sage-primary)] max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEAD_MAGNETS.map((magnet, i) => {
            const Icon = magnet.icon;
            return (
              <motion.div
                key={magnet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: magnet.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: magnet.color }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--brand-foundation)]">
                      {LEAD_MAGNET_TITLES[magnet.id][lang]}
                    </h3>
                    <p className="text-sm text-[var(--sage-primary)] mt-1">
                      {LEAD_MAGNET_DESCRIPTIONS[magnet.id][lang]}
                    </p>
                  </div>
                </div>
                <EmailCaptureForm
                  variant="minimal"
                  leadMagnet={magnet.id}
                  source={`lead-magnet-grid-${magnet.id}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LeadMagnetSection;
