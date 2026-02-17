import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionLabelProps {
  /** The label text — will be rendered in uppercase */
  text: string;
  /** Optional icon component from lucide-react */
  icon?: LucideIcon;
  /** Color variant */
  variant?: "cta" | "foundation" | "gold" | "lingueefy" | "white";
  /** Center or left-align */
  align?: "center" | "left";
  /** Additional CSS classes */
  className?: string;
}

const variantColors: Record<string, string> = {
  cta: "text-[var(--brand-cta,#C65A1E)]",
  foundation: "text-[var(--brand-foundation,#0F3D3E)]",
  gold: "text-[var(--barholex-gold,#D4A853)]",
  lingueefy: "text-[var(--lingueefy-accent,#17E2C6)]",
  white: "text-white/80",
};

/**
 * SectionLabel — Uppercase tracking-wide section label.
 * Inspired by MgCréa's "CRAFTSMANSHIP", "SELECTION", "OUR STORY" labels.
 * Adapted for EdTech context.
 */
export default function SectionLabel({
  text,
  icon: Icon,
  variant = "cta",
  align = "center",
  className,
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        "text-xs sm:text-sm font-semibold",
        "uppercase tracking-[0.2em]",
        "mb-3 sm:mb-4",
        variantColors[variant],
        align === "center" && "justify-center w-full",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      <span>{text}</span>
    </div>
  );
}
