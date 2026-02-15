/**
 * Reusable loading skeleton for table-based pages
 * Provides a shimmer animation while data loads
 */
export function TableSkeleton({ columns = 5, rows = 8 }: { columns?: number; rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex gap-4 mb-4">
        <div className="h-8 bg-gray-200 rounded-lg w-48" />
        <div className="h-8 bg-gray-200 rounded-lg w-32" />
        <div className="ml-auto h-8 bg-gray-200 rounded-lg w-36" />
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="flex gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded flex-1" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 px-4 py-3 border-b border-gray-100">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-4 bg-gray-100 rounded flex-1"
                style={{ maxWidth: colIdx === 0 ? '180px' : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Dashboard card skeleton for the home page
 */
export function DashboardCardSkeleton() {
  return (
    <div className="qb-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-48 mb-4" />
      <div className="space-y-2">
        <div className="flex gap-3 items-center">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded flex-1" />
        </div>
        <div className="flex gap-3 items-center">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-40" />
      </div>
    </div>
  );
}

/**
 * Detail page skeleton for entity detail views
 */
export function DetailSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-200 rounded w-48" />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-5 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Report skeleton for financial report pages
 */
export function ReportSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 bg-gray-200 rounded w-56 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-40" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded w-24" />
          <div className="h-9 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-gray-100">
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
