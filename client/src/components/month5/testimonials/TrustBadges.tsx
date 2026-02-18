/**
 * ============================================
 * TRUST BADGES — Social Proof Indicators
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Animated counter badges showing key statistics:
 * 95% success rate, years of experience, number trained.
 */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TRUST_BADGES } from "@/lib/month5/testimonial-data";
import { Award, Shield, Users, Building2, Star } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Award, Shield, Users, Building2, Star,
};

interface AnimatedCounterProps {
  target: string;
  duration?: number;
  inView: boolean;
}

function AnimatedCounter({ target, duration = 2000, inView }: AnimatedCounterProps) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    // Extract numeric part and suffix
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const numericTarget = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes(".");
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;

      if (isDecimal) {
        setDisplay(current.toFixed(1) + suffix);
      } else {
        setDisplay(Math.floor(current) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, inView]);

  return <span className="tabular-nums">{display}</span>;
}

interface TrustBadgesProps {
  variant?: "horizontal" | "grid" | "compact";
  className?: string;
}

export function TrustBadges({ variant = "horizontal", className = "" }: TrustBadgesProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (variant === "compact") {
    return (
      <div ref={ref} className={`flex flex-wrap items-center gap-4 ${className}`}>
        {TRUST_BADGES.slice(0, 3).map((badge) => (
          <div key={badge.id} className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: badge.color }}>
              <AnimatedCounter target={badge.value} inView={inView} />
            </span>
            <span className="text-sm text-[var(--sage-primary)]">{badge.label[lang]}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div ref={ref} className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
        {TRUST_BADGES.map((badge, i) => {
          const Icon = ICON_MAP[badge.icon] || Award;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/50 backdrop-blur-md rounded-xl border border-white/30 p-4 text-center"
            >
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: badge.color }} aria-hidden="true" />
              <p className="text-2xl font-bold text-[var(--brand-foundation)]">
                <AnimatedCounter target={badge.value} inView={inView} />
              </p>
              <p className="text-xs text-[var(--sage-primary)] mt-1">{badge.label[lang]}</p>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <section ref={ref} className={`py-12 ${className}`} aria-label={lang === "fr" ? "Indicateurs de confiance" : "Trust indicators"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {TRUST_BADGES.map((badge, i) => {
              const Icon = ICON_MAP[badge.icon] || Award;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${badge.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: badge.color }} aria-hidden="true" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)]">
                    <AnimatedCounter target={badge.value} inView={inView} />
                  </p>
                  <p className="text-sm text-[var(--sage-primary)] mt-1">{badge.label[lang]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
