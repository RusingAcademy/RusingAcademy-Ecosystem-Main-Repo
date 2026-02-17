import { Shield, Award, Users, Clock, CheckCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrustBadgesProps {
  /** Display variant */
  variant?: "grid" | "inline" | "compact";
  /** Color theme */
  theme?: "light" | "dark" | "glass";
  /** Additional CSS classes */
  className?: string;
}

/**
 * TrustBadges — EdTech credibility section adapted from MgCréa's trust section.
 * Shows Government-approved, SLE-certified, secure payment, etc.
 * 2x2 grid on mobile, 4-column on desktop.
 */
export default function TrustBadges({
  variant = "grid",
  theme = "light",
  className,
}: TrustBadgesProps) {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: language === "fr" ? "Paiement sécurisé" : "Secure Payment",
      description: "SSL 256-bit / Stripe",
    },
    {
      icon: Award,
      title: language === "fr" ? "Certifié ELS" : "SLE Certified",
      description: language === "fr" ? "Coachs certifiés" : "Certified Coaches",
    },
    {
      icon: Clock,
      title: language === "fr" ? "Horaires flexibles" : "Flexible Scheduling",
      description: language === "fr" ? "7j/7, soir & fin de semaine" : "7 days, evenings & weekends",
    },
    {
      icon: Globe,
      title: language === "fr" ? "100% en ligne" : "100% Online",
      description: language === "fr" ? "Partout au Canada" : "Anywhere in Canada",
    },
  ];

  const themeClasses = {
    light: {
      container: "bg-white dark:bg-card",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta-soft,#FFF1E8)]",
      title: "text-foreground",
      desc: "text-muted-foreground",
    },
    dark: {
      container: "bg-[var(--brand-obsidian,#062b2b)]",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-[var(--brand-cta,#C65A1E)]/10",
      title: "text-white",
      desc: "text-white/70",
    },
    glass: {
      container: "glass-card",
      icon: "text-[var(--brand-cta,#C65A1E)] bg-white/10",
      title: "text-foreground",
      desc: "text-muted-foreground",
    },
  };

  const t = themeClasses[theme];

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap justify-center gap-6 py-4", className)}>
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center gap-2">
            <badge.icon className="h-5 w-5 text-[var(--brand-cta,#C65A1E)]" aria-hidden="true" />
            <span className="text-sm font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center justify-center gap-2 text-sm", className)}>
        <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
        <span className="text-muted-foreground">
          {language === "fr"
            ? "Approuvé par le gouvernement • Coachs certifiés ELS • Paiement sécurisé"
            : "Government-approved • SLE-certified coaches • Secure payment"}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6", className)}>
      {badges.map((badge, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center text-center p-4 sm:p-6 rounded-xl",
            "transition-all duration-200",
            t.container
          )}
        >
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center mb-3",
              t.icon
            )}
          >
            <badge.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h4 className={cn("font-semibold text-sm sm:text-base mb-1", t.title)}>
            {badge.title}
          </h4>
          <p className={cn("text-xs sm:text-sm", t.desc)}>{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
