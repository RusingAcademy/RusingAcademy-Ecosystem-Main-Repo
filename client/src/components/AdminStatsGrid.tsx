/**
 * AdminStatsGrid — Sprint 3: UI/UX Harmonization
 * 
 * Standardized KPI/stats grid component for admin sections.
 * Provides consistent stat card layout with trend indicators,
 * icons, and responsive grid behavior.
 */
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatItem {
  /** Stat label */
  label: string;
  /** French label for bilingual support */
  labelFr?: string;
  /** The stat value (formatted string) */
  value: string | number;
  /** Icon for the stat */
  icon?: LucideIcon;
  /** Icon color class */
  iconColor?: string;
  /** Trend direction */
  trend?: "up" | "down" | "neutral";
  /** Trend value (e.g., "+12%") */
  trendValue?: string;
  /** Optional description below the value */
  description?: string;
}

interface AdminStatsGridProps {
  /** Array of stat items to display */
  stats: StatItem[];
  /** Number of columns (auto-responsive if not set) */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Additional className */
  className?: string;
  /** Compact mode for smaller cards */
  compact?: boolean;
}

export function AdminStatsGrid({
  stats,
  columns,
  className,
  compact = false,
}: AdminStatsGridProps) {
  const gridCols = columns
    ? `grid-cols-2 sm:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`
    : `grid-cols-2 sm:grid-cols-${Math.min(stats.length, 3)} lg:grid-cols-${Math.min(stats.length, 5)}`;

  return (
    <div className={cn("grid gap-3", gridCols, className)}>
      {stats.map((stat, i) => (
        <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className={cn("flex items-center gap-3", compact ? "p-3" : "p-4")}>
            {stat.icon && (
              <div className={cn(
                "flex items-center justify-center rounded-lg shrink-0",
                compact ? "w-9 h-9" : "w-10 h-10",
                stat.iconColor || "bg-[var(--brand-foundation)]/10 text-[var(--brand-foundation)]",
              )}>
                <stat.icon className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className={cn(
                "font-bold text-foreground",
                compact ? "text-lg" : "text-xl",
              )}>
                {stat.value}
              </p>
              <p className={cn(
                "text-muted-foreground truncate",
                compact ? "text-[10px]" : "text-xs",
              )}>
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.description}</p>
              )}
            </div>
            {stat.trend && (
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium shrink-0",
                stat.trend === "up" && "text-emerald-600",
                stat.trend === "down" && "text-red-600",
                stat.trend === "neutral" && "text-muted-foreground",
              )}>
                {stat.trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                {stat.trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                {stat.trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
                {stat.trendValue && <span>{stat.trendValue}</span>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AdminStatsGrid;
