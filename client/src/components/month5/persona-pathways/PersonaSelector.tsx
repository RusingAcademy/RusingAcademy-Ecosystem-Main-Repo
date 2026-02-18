/**
 * ============================================
 * PERSONA SELECTOR — Interactive Pathway Chooser
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Allows users to self-identify with one of 6 personas.
 * Features glassmorphism cards, smooth transitions, and bilingual support.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/month5/PersonaContext";
import {
  PERSONA_PROFILES,
  PERSONA_ORDER,
  type PersonaId,
} from "@/lib/month5/persona-types";
import {
  Clock,
  TrendingUp,
  Target,
  Briefcase,
  MapPin,
  Trophy,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Clock,
  TrendingUp,
  Target,
  Briefcase,
  MapPin,
  Trophy,
};

interface PersonaSelectorProps {
  variant?: "grid" | "horizontal" | "compact";
  showDescription?: boolean;
  className?: string;
  onSelect?: (personaId: PersonaId) => void;
}

export function PersonaSelector({
  variant = "grid",
  showDescription = true,
  className = "",
  onSelect,
}: PersonaSelectorProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const { activePersona, setActivePersona } = usePersona();
  const [hoveredId, setHoveredId] = useState<PersonaId | null>(null);

  const handleSelect = (id: PersonaId) => {
    setActivePersona(id);
    onSelect?.(id);
  };

  const title = lang === "fr"
    ? "Quel est votre parcours ?"
    : "Which pathway fits you?";
  const subtitle = lang === "fr"
    ? "Sélectionnez votre profil pour une expérience personnalisée"
    : "Select your profile for a personalized experience";

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {PERSONA_ORDER.map((id) => {
          const persona = PERSONA_PROFILES[id];
          const Icon = ICON_MAP[persona.icon] || Clock;
          const isActive = activePersona === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300 border
                ${isActive
                  ? "bg-[var(--brand-foundation)] text-white border-[var(--brand-foundation)] shadow-lg"
                  : "bg-white/60 backdrop-blur-sm text-[var(--brand-foundation)] border-[var(--sage-primary)]/30 hover:bg-white/80 hover:border-[var(--brand-foundation)]/50"
                }
              `}
              aria-pressed={isActive}
              aria-label={persona.label[lang]}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{persona.label[lang]}</span>
              {isActive && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={className}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--brand-foundation)] mb-2">
            {title}
          </h2>
          <p className="text-[var(--sage-primary)] text-lg">{subtitle}</p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin">
          {PERSONA_ORDER.map((id) => {
            const persona = PERSONA_PROFILES[id];
            const Icon = ICON_MAP[persona.icon] || Clock;
            const isActive = activePersona === id;
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`
                  snap-center shrink-0 w-64 p-5 rounded-2xl text-left transition-all duration-300 border
                  ${isActive
                    ? "bg-[var(--brand-foundation)] text-white border-[var(--brand-foundation)] shadow-xl scale-[1.02]"
                    : "bg-white/40 backdrop-blur-md text-[var(--brand-foundation)] border-white/30 hover:bg-white/60 hover:shadow-lg"
                  }
                `}
                aria-pressed={isActive}
              >
                <Icon className={`w-8 h-8 mb-3 ${isActive ? "text-white" : ""}`} aria-hidden="true" />
                <h3 className="font-semibold text-base mb-1">{persona.label[lang]}</h3>
                <p className={`text-sm ${isActive ? "text-white/80" : "text-[var(--sage-primary)]"}`}>
                  {persona.tagline[lang]}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: grid variant
  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="persona-selector-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="persona-selector-title"
            className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)] mb-3"
          >
            {title}
          </h2>
          <p className="text-lg text-[var(--sage-primary)] max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONA_ORDER.map((id, index) => {
            const persona = PERSONA_PROFILES[id];
            const Icon = ICON_MAP[persona.icon] || Clock;
            const isActive = activePersona === id;
            const isHovered = hoveredId === id;

            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => handleSelect(id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative group text-left p-6 rounded-2xl transition-all duration-500 border overflow-hidden
                  ${isActive
                    ? "bg-[var(--brand-foundation)] text-white border-[var(--brand-foundation)] shadow-2xl shadow-[var(--brand-foundation)]/20 scale-[1.02]"
                    : "bg-white/50 backdrop-blur-md text-[var(--brand-foundation)] border-white/40 hover:bg-white/70 hover:shadow-xl hover:border-[var(--brand-foundation)]/30"
                  }
                `}
                aria-pressed={isActive}
                aria-label={`${persona.label[lang]}: ${persona.tagline[lang]}`}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-0 transition-opacity duration-500 ${isHovered && !isActive ? "opacity-100" : ""}`}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`
                        p-3 rounded-xl transition-all duration-300
                        ${isActive
                          ? "bg-white/20"
                          : "bg-[var(--mint-soft)]"
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-[var(--brand-foundation)]"}`} aria-hidden="true" />
                    </div>
                    {isActive && (
                      <CheckCircle2 className="w-6 h-6 text-white/80" aria-hidden="true" />
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2">{persona.label[lang]}</h3>
                  <p className={`text-sm mb-4 leading-relaxed ${isActive ? "text-white/85" : "text-[var(--sage-primary)]"}`}>
                    {persona.tagline[lang]}
                  </p>

                  {showDescription && (
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ul className="space-y-1.5 mb-4">
                            {persona.features[lang].slice(0, 3).map((feature, i) => (
                              <li key={i} className={`flex items-center gap-2 text-sm ${isActive ? "text-white/80" : "text-[var(--sage-primary)]"}`}>
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  <div className={`flex items-center gap-1 text-sm font-medium ${isActive ? "text-white" : "text-[var(--brand-cta)]"}`}>
                    <span>{lang === "fr" ? "En savoir plus" : "Learn more"}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>

                  {persona.successRate && (
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-white/20 text-white" : "bg-[var(--mint-primary)]/30 text-[var(--brand-foundation)]"}`}>
                      {persona.successRate} {lang === "fr" ? "taux de réussite" : "success rate"}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PersonaSelector;
