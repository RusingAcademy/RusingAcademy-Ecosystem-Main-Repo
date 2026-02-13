/**
 * AdminDataTable — Sprint 3: UI/UX Harmonization
 * 
 * Standardized data table component for admin sections.
 * Provides consistent table layout with sorting, pagination indicators,
 * and responsive behavior for LRDG-grade presentation.
 */
import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { AdminEmptyState } from "./AdminEmptyState";
import { type LucideIcon } from "lucide-react";

interface Column<T> {
  /** Column header label */
  header: string;
  /** Key to access the data or render function */
  accessor: keyof T | ((row: T, index: number) => ReactNode);
  /** Column width class */
  width?: string;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Whether this column is hidden on mobile */
  hideMobile?: boolean;
}

interface AdminDataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Data rows */
  data: T[];
  /** Unique key accessor */
  keyAccessor: (row: T, index: number) => string | number;
  /** Empty state config */
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
  };
  /** Pagination */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Loading state */
  loading?: boolean;
  /** Additional className */
  className?: string;
  /** Compact mode */
  compact?: boolean;
}

export function AdminDataTable<T>({
  columns,
  data,
  keyAccessor,
  emptyState,
  pagination,
  onRowClick,
  loading,
  className,
  compact = false,
}: AdminDataTableProps<T>) {
  if (!loading && data.length === 0 && emptyState) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <AdminEmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            size="md"
          />
        </CardContent>
      </Card>
    );
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="admin-table-header">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={cn(
                      "text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      compact ? "px-3 py-2" : "px-4 py-3",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.hideMobile && "hidden sm:table-cell",
                      col.width,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr
                  key={keyAccessor(row, rowIdx)}
                  className={cn(
                    "admin-table-row border-b border-border/30 last:border-0 transition-colors",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        "text-sm",
                        compact ? "px-3 py-2" : "px-4 py-3",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.hideMobile && "hidden sm:table-cell",
                      )}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row, rowIdx)
                        : (row[col.accessor] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(1)}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-medium px-2">
                {pagination.page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page >= totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={pagination.page >= totalPages}
                onClick={() => pagination.onPageChange(totalPages)}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminDataTable;
