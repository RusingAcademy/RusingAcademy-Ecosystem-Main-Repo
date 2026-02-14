/**
 * AdminEmptyState — Sprint 3: UI/UX Harmonization
 * 
 * Standardized empty state component for admin sections.
 * Provides consistent messaging when no data is available,
 * with optional action button and illustration.
 */
import { type ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  /** Icon to display (defaults to Inbox) */
  icon?: LucideIcon;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** French description for bilingual support */
  descriptionFr?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Custom content below the description */
  children?: ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  descriptionFr,
  action,
  secondaryAction,
  children,
  size = "md",
  className,
}: AdminEmptyStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-16",
    lg: "py-24",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      sizeClasses[size],
      className,
    )}>
      <div className={cn(
        "rounded-full bg-muted/50 p-4 mb-4",
        size === "sm" && "p-3 mb-3",
        size === "lg" && "p-6 mb-6",
      )}>
        <Icon className={cn(
          "text-muted-foreground/60",
          iconSizes[size],
        )} />
      </div>

      <h3 className={cn(
        "font-semibold text-foreground",
        size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base",
      )}>
        {title}
      </h3>

      {description && (
        <p className={cn(
          "text-muted-foreground mt-1.5 max-w-sm",
          size === "sm" ? "text-xs" : "text-sm",
        )}>
          {description}
        </p>
      )}

      {descriptionFr && (
        <p className={cn(
          "text-muted-foreground/70 mt-1 max-w-sm italic",
          size === "sm" ? "text-[10px]" : "text-xs",
        )}>
          {descriptionFr}
        </p>
      )}

      {children}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-5">
          {action && (
            <Button
              size={size === "sm" ? "sm" : "default"}
              onClick={action.onClick}
              className="bg-[var(--brand-foundation)] hover:bg-[var(--brand-foundation-2)] text-white"
            >
              {action.icon && <action.icon className="h-4 w-4 mr-1.5" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size={size === "sm" ? "sm" : "default"}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminEmptyState;
