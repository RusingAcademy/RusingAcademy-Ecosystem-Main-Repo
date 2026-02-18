/**
 * ============================================
 * CASE STUDY CARD — Detailed Success Stories
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Expandable case study cards showing the full
 * journey: challenge → solution → result.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { type CaseStudy } from "@/lib/month5/testimonial-data";
import {
  AlertTriangle,
  Lightbulb,
  Trophy,
  Quote,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  defaultExpanded?: boolean;
  className?: string;
  index?: number;
}

export function CaseStudyCard({
  caseStudy,
  defaultExpanded = false,
  className = "",
  index = 0,
}: CaseStudyCardProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`
        relative bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40
        shadow-lg overflow-hidden transition-all duration-500
        hover:shadow-2xl ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] flex items-center justify-center text-white font-bold text-xl shrink-0" aria-hidden="true">
              {caseStudy.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--brand-foundation)]">{caseStudy.name}</h3>
              <p className="text-sm text-[var(--sage-primary)]">{caseStudy.role[lang]}</p>
              <p className="text-xs text-[var(--sage-primary)]/70">{caseStudy.department[lang]}</p>
            </div>
          </div>

          {/* Level progression badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-mono font-bold text-sm">
              {caseStudy.previousLevel}
            </span>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" aria-hidden="true" />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-sm">
              {caseStudy.achievedLevel}
            </span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {caseStudy.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="bg-[var(--sage-pale)] rounded-xl p-3 text-center"
            >
              <p className="text-lg font-bold text-[var(--brand-foundation)]">{metric.value}</p>
              <p className="text-xs text-[var(--sage-primary)]">{metric.label[lang]}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="relative bg-[var(--mint-soft)] rounded-xl p-5 mb-4">
          <Quote className="absolute top-3 left-3 w-6 h-6 text-[var(--brand-foundation)]/10" aria-hidden="true" />
          <blockquote className="text-[var(--brand-foundation)] italic pl-6 text-sm md:text-base leading-relaxed">
            "{caseStudy.quote[lang]}"
          </blockquote>
        </div>

        {/* Expand/collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-cta)] hover:text-[var(--brand-cta-2)] transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`case-study-details-${caseStudy.id}`}
        >
          {isExpanded
            ? (lang === "fr" ? "Voir moins" : "Show less")
            : (lang === "fr" ? "Lire l'histoire complète" : "Read the full story")
          }
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`case-study-details-${caseStudy.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 space-y-6">
              {/* Challenge */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--brand-foundation)] mb-2">
                    {lang === "fr" ? "Le défi" : "The Challenge"}
                  </h4>
                  <p className="text-sm text-[var(--sage-primary)] leading-relaxed">
                    {caseStudy.challenge[lang]}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--brand-foundation)] mb-2">
                    {lang === "fr" ? "Notre solution" : "Our Solution"}
                  </h4>
                  <p className="text-sm text-[var(--sage-primary)] leading-relaxed">
                    {caseStudy.solution[lang]}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--brand-foundation)] mb-2">
                    {lang === "fr" ? "Le résultat" : "The Result"}
                  </h4>
                  <p className="text-sm text-[var(--sage-primary)] leading-relaxed">
                    {caseStudy.result[lang]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default CaseStudyCard;
