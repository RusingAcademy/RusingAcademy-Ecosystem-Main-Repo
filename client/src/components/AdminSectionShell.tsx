/**
 * AdminSectionShell — Sprint 3: UI/UX Harmonization
 * 
 * Standardized wrapper for all admin sections inside AdminControlCenter.
 * Provides consistent layout: title, description, breadcrumb, action buttons,
 * and proper spacing for LRDG-grade presentation.
 */
import { type ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSectionShellProps {
  /** Section title (e.g., "Course Builder") */
  title: string;
  /** French title for bilingual support */
  titleFr?: string;
  /** Brief description of the section */
  description?: string;
  /** Icon displayed next to the title */
  icon?: LucideIcon;
  /** Breadcrumb trail (e.g., ["Learning", "Courses"]) */
  breadcrumb?: string[];
  /** Action buttons rendered in the top-right */
  actions?: ReactNode;
  /** Optional badge/count next to the title */
  badge?: ReactNode;
  /** Section content */
  children: ReactNode;
  /** Additional className for the outer wrapper */
  className?: string;
  /** Whether to show a subtle top border accent */
  accentBorder?: boolean;
}

export function AdminSectionShell({
  title,
  titleFr,
  description,
  icon: Icon,
  breadcrumb,
  actions,
  badge,
  children,
  className,
  accentBorder = false,
}: AdminSectionShellProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className={cn(
        "pb-4 border-b border-border/50",
        accentBorder && "border-t-2 border-t-[var(--brand-foundation)] pt-4 -mt-2"
      )}>
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-2" aria-label="Breadcrumb">
            <span className="font-medium">Admin</span>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                <span className={cn(
                  i === breadcrumb.length - 1 ? "text-foreground font-medium" : ""
                )}>{crumb}</span>
              </span>
            ))}
          </nav>
        )}

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--brand-foundation)]/10 text-[var(--brand-foundation)] shrink-0">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground tracking-tight truncate">
                  {title}
                </h1>
                {badge}
              </div>
              {titleFr && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">{titleFr}</p>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}

export default AdminSectionShell;
