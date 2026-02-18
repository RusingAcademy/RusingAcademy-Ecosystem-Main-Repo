/**
 * ============================================
 * PERSONA PATHWAY HERO — Dynamic Hero Section
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Adapts hero content based on the active persona.
 * Includes countdown timer for deadline-driven persona.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/month5/PersonaContext";
import { PERSONA_PROFILES } from "@/lib/month5/persona-types";
import { Link } from "wouter";
import {
  Clock,
  TrendingUp,
  Target,
  Briefcase,
  MapPin,
  Trophy,
  ArrowRight,
  Timer,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Clock, TrendingUp, Target, Briefcase, MapPin, Trophy,
};

interface CountdownProps {
  targetDate: Date;
  lang: "en" | "fr";
}

function ExamCountdown({ targetDate, lang }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) return;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const labels = lang === "fr"
    ? { days: "Jours", hours: "Heures", minutes: "Min", seconds: "Sec" }
    : { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" };

  return (
    <div className="flex items-center gap-1 sm:gap-3" role="timer" aria-label={lang === "fr" ? "Compte à rebours de l'examen" : "Exam countdown"}>
      <Timer className="w-5 h-5 text-[var(--brand-cta)] mr-1" aria-hidden="true" />
      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
        <div key={unit} className="text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5 min-w-[3rem] border border-white/30">
            <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {String(timeLeft[unit]).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/70 mt-1 block">{labels[unit]}</span>
        </div>
      ))}
    </div>
  );
}

interface PersonaPathwayHeroProps {
  className?: string;
}

export function PersonaPathwayHero({ className = "" }: PersonaPathwayHeroProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const { activePersona } = usePersona();
  const persona = PERSONA_PROFILES[activePersona];
  const Icon = ICON_MAP[persona.icon] || Clock;

  // Default exam date: 8 weeks from now
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 56);

  return (
    <section className={`relative overflow-hidden ${className}`} aria-labelledby="persona-hero-title">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-obsidian)] via-[var(--brand-foundation)] to-[var(--brand-foundation-2)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(209,235,219,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(198,90,30,0.08),transparent_60%)]" />

      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--brand-cta)]/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[var(--mint-primary)]/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Persona badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6">
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{persona.label[lang]}</span>
            </div>

            {/* Headline */}
            <h1
              id="persona-hero-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {persona.tagline[lang]}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
              {persona.description[lang]}
            </p>

            {/* Countdown timer for deadline-driven */}
            {persona.examCountdown && (
              <div className="mb-8">
                <p className="text-white/60 text-sm mb-3">
                  {lang === "fr" ? "Temps restant avant votre examen :" : "Time remaining until your exam:"}
                </p>
                <ExamCountdown targetDate={examDate} lang={lang} />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={persona.ctaUrl}>
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-cta)] hover:bg-[var(--brand-cta-2)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--brand-cta)]/25 transition-all duration-300 cursor-pointer"
                >
                  {persona.ctaPrimary[lang]}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              </Link>
              <Link href="/assessment">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300 cursor-pointer"
                >
                  {persona.ctaSecondary[lang]}
                </motion.span>
              </Link>
            </div>

            {/* Trust indicators */}
            {persona.successRate && (
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--brand-cta)]">{persona.successRate}</span>
                  <span className="text-sm text-white/60">{lang === "fr" ? "taux de réussite" : "success rate"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">500+</span>
                  <span className="text-sm text-white/60">{lang === "fr" ? "fonctionnaires formés" : "public servants trained"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">10+</span>
                  <span className="text-sm text-white/60">{lang === "fr" ? "années d'expérience" : "years of experience"}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default PersonaPathwayHero;
