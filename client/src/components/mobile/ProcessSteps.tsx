import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description?: string;
}

interface ProcessStepsProps {
  /** Array of steps to display */
  steps: Step[];
  /** Layout variant */
  variant?: "grid" | "horizontal" | "vertical";
  /** Color theme */
  theme?: "light" | "dark" | "glass";
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProcessSteps — 2x2 grid process visualization.
 * Inspired by MgCréa's numbered steps with glassmorphism cards.
 * Adapted for EdTech learning journey.
 */
export default function ProcessSteps({
  steps,
  variant = "grid",
  theme = "light",
  className,
}: ProcessStepsProps) {
  const themeClasses = {
    light: {
      card: "bg-white dark:bg-card border border-gray-100 dark:border-border shadow-sm hover:shadow-md",
      number: "text-gray-100 dark:text-gray-800",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta-soft,#FFF1E8)]",
      title: "text-foreground",
      desc: "text-muted-foreground",
    },
    dark: {
      card: "bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8",
      number: "text-white/5",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta,#C65A1E)]/15",
      title: "text-white",
      desc: "text-white/70",
    },
    glass: {
      card: "glass-card hover:shadow-lg",
      number: "text-gray-100 dark:text-gray-800",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta-soft,#FFF1E8)]",
      title: "text-foreground",
      desc: "text-muted-foreground",
    },
  };

  const t = themeClasses[theme];

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-4 p-4 sm:p-5 rounded-xl transition-all duration-200",
              t.card
            )}
          >
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", t.icon)}>
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-8 bg-[var(--brand-cta,#C65A1E)]/20 mt-2" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={cn("text-xs font-bold uppercase tracking-wider", t.desc)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className={cn("font-semibold text-sm sm:text-base", t.title)}>
                  {step.title}
                </h4>
              </div>
              {step.description && (
                <p className={cn("text-xs sm:text-sm mt-1 leading-relaxed", t.desc)}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "horizontal"
          ? "flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:overflow-visible"
          : "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4",
        className
      )}
    >
      {steps.map((step, i) => (
        <div
          key={i}
          className={cn(
            "relative p-4 sm:p-6 rounded-xl transition-all duration-200",
            "min-w-[160px] snap-center",
            t.card
          )}
        >
          {/* Large faded step number */}
          <span
            className={cn(
              "absolute top-3 right-3 text-3xl sm:text-4xl font-black select-none pointer-events-none",
              t.number
            )}
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Icon */}
          <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-3", t.icon)}>
            <step.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>

          {/* Title */}
          <h4 className={cn("font-semibold text-sm sm:text-base", t.title)}>
            {step.title}
          </h4>

          {/* Description */}
          {step.description && (
            <p className={cn("text-xs sm:text-sm mt-1 leading-relaxed", t.desc)}>
              {step.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
