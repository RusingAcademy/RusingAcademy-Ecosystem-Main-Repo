const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  // Invoice statuses
  paid: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  overdue: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  sent: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  viewed: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  partial: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  // Expense statuses
  cleared: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  // Bank transaction statuses
  categorized: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "for review": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  excluded: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  // Recurring statuses
  active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  paused: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  // Reconciliation
  "in progress": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  // Tax filing
  filed: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  unfiled: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  // Estimates
  accepted: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  expired: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  converted: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const colors = statusColors[normalized] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${className}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
