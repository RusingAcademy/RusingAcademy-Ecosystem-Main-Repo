/**
 * StatusBadge — Sprint 3: UI/UX Harmonization
 * 
 * Unified status badge component used across all admin sections.
 * Ensures consistent color coding and styling for every status type
 * in the ecosystem (courses, coaches, payouts, content, etc.)
 */
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle, Clock, Eye, XCircle, ShieldOff, Archive,
  Send, AlertTriangle, Loader2, type LucideIcon,
} from "lucide-react";

type StatusVariant =
  | "draft"
  | "review"
  | "published"
  | "active"
  | "approved"
  | "pending"
  | "processing"
  | "suspended"
  | "rejected"
  | "archived"
  | "paid"
  | "failed"
  | "cancelled"
  | "submitted"
  | "under_review"
  | "resubmission";

interface StatusConfig {
  label: string;
  labelFr: string;
  className: string;
  icon: LucideIcon;
}

const STATUS_MAP: Record<StatusVariant, StatusConfig> = {
  draft: {
    label: "Draft",
    labelFr: "Brouillon",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: Clock,
  },
  review: {
    label: "In Review",
    labelFr: "En révision",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Eye,
  },
  published: {
    label: "Published",
    labelFr: "Publié",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  active: {
    label: "Active",
    labelFr: "Actif",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  approved: {
    label: "Approved",
    labelFr: "Approuvé",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    labelFr: "En attente",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    labelFr: "En traitement",
    className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    icon: Loader2,
  },
  suspended: {
    label: "Suspended",
    labelFr: "Suspendu",
    className: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    icon: ShieldOff,
  },
  rejected: {
    label: "Rejected",
    labelFr: "Rejeté",
    className: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    icon: XCircle,
  },
  archived: {
    label: "Archived",
    labelFr: "Archivé",
    className: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-slate-700 dark:border-gray-700",
    icon: Archive,
  },
  paid: {
    label: "Paid",
    labelFr: "Payé",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    labelFr: "Échoué",
    className: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    labelFr: "Annulé",
    className: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-slate-700 dark:border-gray-700",
    icon: XCircle,
  },
  submitted: {
    label: "Submitted",
    labelFr: "Soumis",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Send,
  },
  under_review: {
    label: "Under Review",
    labelFr: "En examen",
    className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    icon: Eye,
  },
  resubmission: {
    label: "Resubmission",
    labelFr: "Resoumission",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
};

interface StatusBadgeProps {
  /** The status to display */
  status: StatusVariant | string;
  /** Show the icon alongside the label */
  showIcon?: boolean;
  /** Use French label */
  french?: boolean;
  /** Custom label override */
  label?: string;
  /** Size variant */
  size?: "sm" | "md";
  /** Additional className */
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  french = false,
  label: customLabel,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const config = STATUS_MAP[status as StatusVariant];

  if (!config) {
    // Fallback for unknown statuses
    return (
      <Badge variant="outline" className={cn("capitalize", className)}>
        {customLabel || status.replace(/_/g, " ")}
      </Badge>
    );
  }

  const Icon = config.icon;
  const displayLabel = customLabel || (french ? config.labelFr : config.label);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border gap-1 inline-flex items-center",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        config.className,
        className,
      )}
    >
      {showIcon && <Icon className={cn(
        "shrink-0",
        size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
        status === "processing" && "animate-spin",
      )} />}
      {displayLabel}
    </Badge>
  );
}

export { STATUS_MAP, type StatusVariant };
export default StatusBadge;
