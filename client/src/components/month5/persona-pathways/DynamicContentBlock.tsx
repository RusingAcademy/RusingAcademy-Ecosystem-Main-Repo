/**
 * ============================================
 * DYNAMIC CONTENT BLOCK — Persona-Adaptive Content
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Renders different content based on the active persona.
 * Includes pain points, motivations, and feature highlights.
 */
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/month5/PersonaContext";
import { PERSONA_PROFILES, type PersonaId } from "@/lib/month5/persona-types";
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

interface DynamicContentBlockProps {
  /** Which persona to show content for. If omitted, uses active persona from context. */
  personaId?: PersonaId;
  /** Which sections to display */
  sections?: ("painPoints" | "motivations" | "features")[];
  /** Visual variant */
  variant?: "card" | "inline" | "full";
  className?: string;
}

export function DynamicContentBlock({
  personaId,
  sections = ["painPoints", "motivations", "features"],
  variant = "full",
  className = "",
}: DynamicContentBlockProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const { activePersona } = usePersona();
  const id = personaId || activePersona;
  const persona = PERSONA_PROFILES[id];

  if (variant === "card") {
    return (
      <div className={`bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 p-6 ${className}`}>
        <h3 className="font-bold text-lg text-[var(--brand-foundation)] mb-4">
          {persona.label[lang]}
        </h3>
        <p className="text-[var(--sage-primary)] text-sm mb-4">{persona.tagline[lang]}</p>
        <ul className="space-y-2 mb-4">
          {persona.features[lang].slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[var(--brand-foundation)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <Link href={persona.ctaUrl}>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-cta)] hover:underline cursor-pointer">
            {persona.ctaPrimary[lang]}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {persona.features[lang].map((f, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--mint-soft)] text-[var(--brand-foundation)] text-sm border border-[var(--mint-primary)]/30"
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            {f}
          </span>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="dynamic-content-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            id="dynamic-content-title"
            className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)] mb-3"
          >
            {lang === "fr" ? "Conçu pour votre situation" : "Designed for Your Situation"}
          </h2>
          <p className="text-lg text-[var(--sage-primary)] max-w-2xl mx-auto">
            {persona.description[lang]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pain Points */}
          {sections.includes("painPoints") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-red-50">
                  <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[var(--brand-foundation)]">
                  {lang === "fr" ? "Vos défis" : "Your Challenges"}
                </h3>
              </div>
              <ul className="space-y-3">
                {persona.painPoints[lang].map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--sage-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Motivations */}
          {sections.includes("motivations") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-amber-50">
                  <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[var(--brand-foundation)]">
                  {lang === "fr" ? "Vos objectifs" : "Your Goals"}
                </h3>
              </div>
              <ul className="space-y-3">
                {persona.motivations[lang].map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--sage-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Features / Our Solution */}
          {sections.includes("features") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-[var(--brand-foundation)]">
                  {lang === "fr" ? "Notre solution" : "Our Solution"}
                </h3>
              </div>
              <ul className="space-y-3">
                {persona.features[lang].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--sage-primary)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href={persona.ctaUrl}>
            <span className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-cta)] hover:bg-[var(--brand-cta-2)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--brand-cta)]/25 transition-all duration-300 cursor-pointer">
              {persona.ctaPrimary[lang]}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default DynamicContentBlock;
