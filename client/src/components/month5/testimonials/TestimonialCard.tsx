/**
 * ============================================
 * TESTIMONIAL CARD — Glassmorphism Design
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Premium testimonial cards with glassmorphism,
 * floating effects, star ratings, and level badges.
 */
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { type Testimonial } from "@/lib/month5/testimonial-data";
import { Star, Quote, Award, ArrowUpRight } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: "default" | "featured" | "compact";
  className?: string;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function LevelBadge({ previous, achieved }: { previous?: string; achieved: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      {previous && (
        <>
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono font-semibold text-xs">
            {previous}
          </span>
          <ArrowUpRight className="w-4 h-4 text-emerald-500" aria-hidden="true" />
        </>
      )}
      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono font-semibold text-xs">
        {achieved}
      </span>
    </div>
  );
}

export function TestimonialCard({
  testimonial,
  variant = "default",
  className = "",
  index = 0,
}: TestimonialCardProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";

  if (variant === "compact") {
    return (
      <div className={`bg-white/40 backdrop-blur-md rounded-xl border border-white/30 p-4 ${className}`}>
        <StarRating rating={testimonial.rating} />
        <p className="text-sm text-[var(--brand-foundation)] mt-2 line-clamp-3 italic">
          "{testimonial.quote[lang]}"
        </p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm font-semibold text-[var(--brand-foundation)]">{testimonial.name}</p>
            <p className="text-xs text-[var(--sage-primary)]">{testimonial.role[lang]}</p>
          </div>
          <LevelBadge previous={testimonial.previousLevel} achieved={testimonial.achievedLevel} />
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15, duration: 0.6 }}
        className={`
          relative group bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40
          p-8 shadow-lg hover:shadow-2xl transition-all duration-500
          hover:-translate-y-1 ${className}
        `}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[var(--brand-foundation)] via-[var(--brand-cta)] to-[var(--brand-foundation)]" aria-hidden="true" />

        {/* Quote icon */}
        <div className="absolute top-6 right-6 opacity-10">
          <Quote className="w-12 h-12 text-[var(--brand-foundation)]" aria-hidden="true" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={testimonial.rating} />
            <LevelBadge previous={testimonial.previousLevel} achieved={testimonial.achievedLevel} />
          </div>

          <blockquote className="text-[var(--brand-foundation)] leading-relaxed mb-6 text-base">
            "{testimonial.quote[lang]}"
          </blockquote>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--sage-soft)]">
            {/* Avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] flex items-center justify-center text-white font-bold text-lg" aria-hidden="true">
              {testimonial.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--brand-foundation)]">{testimonial.name}</p>
              <p className="text-sm text-[var(--sage-primary)]">{testimonial.role[lang]}</p>
              <p className="text-xs text-[var(--sage-primary)]/70">{testimonial.department[lang]}</p>
            </div>
            {testimonial.source === "kudoboard" && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--mint-soft)] text-xs text-[var(--brand-foundation)]">
                <Award className="w-3 h-3" aria-hidden="true" />
                Kudoboard
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`
        relative bg-white/40 backdrop-blur-md rounded-2xl border border-white/30
        p-6 shadow-md hover:shadow-xl transition-all duration-500
        hover:-translate-y-0.5 ${className}
      `}
    >
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={testimonial.rating} />
        <LevelBadge previous={testimonial.previousLevel} achieved={testimonial.achievedLevel} />
      </div>

      <blockquote className="text-sm text-[var(--brand-foundation)] leading-relaxed mb-4 italic">
        "{testimonial.quote[lang]}"
      </blockquote>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--sage-soft)]/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] flex items-center justify-center text-white font-semibold text-sm" aria-hidden="true">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--brand-foundation)]">{testimonial.name}</p>
          <p className="text-xs text-[var(--sage-primary)]">{testimonial.department[lang]}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default TestimonialCard;
