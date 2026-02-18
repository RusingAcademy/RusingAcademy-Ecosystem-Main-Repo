import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PremiumFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "teal" | "orange" | "purple" | "gold" | "blue" | "rose" | "emerald" | "amber";
  variant?: "default" | "glass" | "bordered" | "elevated";
  badge?: string;
  children?: ReactNode;
}

/**
 * PremiumFeatureCard - Reusable premium feature card component
 * 
 * Features:
 * - Multiple color variants
 * - Glassmorphism option
 * - Hover animations
 * - Icon with gradient background
 * - WCAG AA accessible
 */
export default function PremiumFeatureCard({
  icon: Icon,
  title,
  description,
  color = "teal",
  variant = "default",
  badge,
  children,
}: PremiumFeatureCardProps) {
  const colorClasses = {
    teal: {
      iconBg: "from-teal-500 to-teal-600",
      iconShadow: "shadow-teal-500/25",
      border: "border-teal-500/20",
      badge: "bg-teal-100 text-teal-700",
    },
    orange: {
      iconBg: "from-cta to-cta",
      iconShadow: "shadow-orange-700/25",
      border: "border-orange-500/20",
      badge: "bg-orange-100 text-orange-700",
    },
    purple: {
      iconBg: "from-foundation to-teal-700",
      iconShadow: "shadow-purple-500/25",
      border: "border-foundation/20",
      badge: "bg-foundation-soft text-foundation",
    },
    gold: {
      iconBg: "from-cta to-yellow-600",
      iconShadow: "shadow-amber-500/25",
      border: "border-amber-500/20",
      badge: "bg-amber-100 text-amber-700",
    },
    blue: {
      iconBg: "from-blue-500 to-blue-600",
      iconShadow: "shadow-blue-500/25",
      border: "border-blue-500/20",
      badge: "bg-blue-100 text-blue-700",
    },
    copper: {
      iconBg: "from-cta to-orange-600",
      iconShadow: "shadow-rose-500/25",
      border: "border-cta/20",
      badge: "bg-cta-soft text-cta",
    },
    emerald: {
      iconBg: "from-emerald-500 to-emerald-600",
      iconShadow: "shadow-emerald-500/25",
      border: "border-emerald-500/20",
      badge: "bg-emerald-100 text-emerald-700",
    },
    amber: {
      iconBg: "from-cta to-cta",
      iconShadow: "shadow-amber-500/25",
      border: "border-amber-500/20",
      badge: "bg-amber-100 text-amber-700",
    },
  };

  const colors = colorClasses[color];

  const getVariantClasses = () => {
    switch (variant) {
      case "glass":
        return "glass-card";
      case "bordered":
        return `bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 border-2 ${colors.border} rounded-2xl`;
      case "elevated":
        return "bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-2xl shadow-xl hover:shadow-2xl";
      default:
        return "bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 rounded-2xl shadow-md hover:shadow-lg border border-slate-100";
    }
  };

  return (
    <div 
      className={`p-6 transition-all duration-300 hover:-translate-y-1 ${getVariantClasses()}`}
    >
      {/* Badge */}
      {badge && (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${colors.badge}`}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div 
        className={`h-14 w-14 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center mb-4 shadow-lg ${colors.iconShadow}`}
      >
        <Icon className="h-7 w-7 text-white" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed">
        {description}
      </p>

      {/* Additional content */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
