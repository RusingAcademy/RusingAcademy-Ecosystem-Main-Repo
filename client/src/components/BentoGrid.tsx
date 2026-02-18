import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * Semantic color tokens for consistent dashboard theming.
 * Maps semantic intent to Tailwind color classes.
 */
export const SemanticColors = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    accent: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-500",
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    accent: "bg-red-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    accent: "bg-blue-500",
  },
  neutral: {
    bg: "bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md dark:bg-gray-950/30",
    text: "text-gray-700 dark:text-muted-foreground",
    border: "border-gray-200 dark:border-white/15 dark:border-gray-800",
    accent: "bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm0",
  },
} as const;

export type SemanticColorKey = keyof typeof SemanticColors;

// ─── BentoGrid ───────────────────────────────────────────────────────────────

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

/**
 * A responsive bento-style grid layout for dashboard widgets.
 * Supports 2, 3, or 4 column layouts with automatic responsive breakpoints.
 */
export function BentoGrid({ children, className, columns = 3 }: BentoGridProps) {
  const colClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {children}
    </div>
  );
}

// ─── BentoCard ───────────────────────────────────────────────────────────────

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  colorScheme?: SemanticColorKey;
  onClick?: () => void;
}

/**
 * A single card within a BentoGrid. Supports spanning multiple columns/rows
 * and semantic color schemes.
 */
export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  colorScheme,
  onClick,
}: BentoCardProps) {
  const spanClasses = cn(
    colSpan === 2 && "md:col-span-2",
    colSpan === 3 && "md:col-span-2 lg:col-span-3",
    rowSpan === 2 && "row-span-2"
  );

  const colors = colorScheme ? SemanticColors[colorScheme] : undefined;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        spanClasses,
        colors?.bg,
        colors?.border,
        onClick && "cursor-pointer hover:scale-[1.01]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

// ─── BentoHeader ─────────────────────────────────────────────────────────────

interface BentoHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * A standardized header for BentoCards with optional icon and action slot.
 */
export function BentoHeader({ title, subtitle, icon, action, className }: BentoHeaderProps) {
  return (
    <CardHeader className={cn("pb-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </CardHeader>
  );
}

// ─── BentoStat ───────────────────────────────────────────────────────────────

interface BentoStatProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  colorScheme?: SemanticColorKey;
  className?: string;
}

/**
 * A compact stat display for BentoCards showing a value with optional
 * change indicator and semantic coloring.
 */
export function BentoStat({
  label,
  value,
  change,
  changeLabel,
  icon,
  colorScheme = "neutral",
  className,
}: BentoStatProps) {
  const colors = SemanticColors[colorScheme];
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg", colors.bg, className)}>
      {icon && (
        <div className={cn("p-2 rounded-md", colors.accent, "text-white")}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={cn("text-2xl font-bold tracking-tight", colors.text)}>
          {value}
        </p>
        {change !== undefined && (
          <p
            className={cn(
              "text-xs mt-0.5",
              isPositive && "text-emerald-600",
              isNegative && "text-red-600",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%{changeLabel ? ` ${changeLabel}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── BentoProgress ───────────────────────────────────────────────────────────

interface BentoProgressProps {
  label: string;
  value: number;
  max?: number;
  showPercentage?: boolean;
  colorScheme?: SemanticColorKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A progress bar component for BentoCards with semantic coloring
 * and configurable size.
 */
export function BentoProgress({
  label,
  value,
  max = 100,
  showPercentage = true,
  colorScheme = "info",
  size = "md",
  className,
}: BentoProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const colors = SemanticColors[colorScheme];

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {showPercentage && (
          <span className={cn("text-sm font-medium", colors.text)}>
            {percentage}%
          </span>
        )}
      </div>
      <Progress value={percentage} className={cn(sizeClasses[size])} />
    </div>
  );
}
