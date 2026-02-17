import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface StatsGridProps {
  /** Array of statistics to display */
  stats: Stat[];
  /** Color theme */
  theme?: "foundation" | "cta" | "dark" | "glass";
  /** Whether to animate the counter */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-serif font-black text-3xl sm:text-4xl md:text-5xl leading-none">
      {prefix}{count}{suffix}
    </div>
  );
}

/**
 * StatsGrid — 2x2 grid statistics display with animated counters.
 * Inspired by MgCréa's stats section with icons and uppercase labels.
 * Adapted for EdTech metrics.
 */
export default function StatsGrid({
  stats,
  theme = "foundation",
  animated = true,
  className,
}: StatsGridProps) {
  const themeClasses = {
    foundation: {
      bg: "bg-gradient-to-br from-[var(--brand-foundation,#0F3D3E)] to-[var(--brand-foundation-2,#145A5B)]",
      icon: "text-white/80 bg-white/10",
      value: "text-white",
      label: "text-white/60",
      desc: "text-white/50",
    },
    cta: {
      bg: "bg-gradient-to-br from-[var(--brand-cta,#C65A1E)] to-[var(--brand-cta-2,#E06B2D)]",
      icon: "text-white/80 bg-white/10",
      value: "text-white",
      label: "text-white/60",
      desc: "text-white/50",
    },
    dark: {
      bg: "bg-[var(--brand-obsidian,#062b2b)]",
      icon: "text-[var(--barholex-gold,#D4A853)] bg-[var(--barholex-gold,#D4A853)]/10",
      value: "text-white",
      label: "text-white/50",
      desc: "text-white/40",
    },
    glass: {
      bg: "glass-card",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta-soft,#FFF1E8)]",
      value: "text-foreground",
      label: "text-muted-foreground",
      desc: "text-muted-foreground/70",
    },
  };

  const t = themeClasses[theme];

  return (
    <div
      className={cn(
        "rounded-2xl p-6 sm:p-8 md:p-10",
        t.bg,
        className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div
              className={cn(
                "h-12 w-12 sm:h-14 sm:w-14 rounded-xl mx-auto mb-3 flex items-center justify-center",
                t.icon
              )}
            >
              <stat.icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
            </div>
            <div className={t.value}>
              {animated ? (
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              ) : (
                <div className="font-serif font-black text-3xl sm:text-4xl md:text-5xl leading-none">
                  {stat.prefix}{stat.value}{stat.suffix}
                </div>
              )}
            </div>
            <p
              className={cn(
                "text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] mt-2",
                t.label
              )}
            >
              {stat.label}
            </p>
            {stat.description && (
              <p className={cn("text-xs mt-1 hidden sm:block", t.desc)}>
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
