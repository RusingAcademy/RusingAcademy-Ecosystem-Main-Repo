/**
 * PermissionGuard — Declarative RBAC wrapper for React components.
 * 
 * Conditionally renders children based on the current user's permissions.
 * Supports single permission, any-of, all-of, module access, and role checks.
 * 
 * Usage:
 *   <PermissionGuard permission="products.courses.view">
 *     <CourseList />
 *   </PermissionGuard>
 * 
 *   <PermissionGuard anyOf={["marketing.email.view", "marketing.landing.view"]}>
 *     <MarketingDashboard />
 *   </PermissionGuard>
 * 
 *   <PermissionGuard role={["owner", "admin"]} fallback={<AccessDenied />}>
 *     <AdminPanel />
 *   </PermissionGuard>
 */
import React from "react";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionGuardProps {
  /** Single permission to check (e.g., "products.courses.view") */
  permission?: string;
  /** Render if user has ANY of these permissions */
  anyOf?: string[];
  /** Render if user has ALL of these permissions */
  allOf?: string[];
  /** Render if user can access this module (any action) */
  module?: string;
  /** Render if user has this role (or any of these roles) */
  role?: string | string[];
  /** Content to render when permission is denied */
  fallback?: React.ReactNode;
  /** Content to render while permissions are loading */
  loadingFallback?: React.ReactNode;
  /** Children to render when permission is granted */
  children: React.ReactNode;
  /** If true, hide the component entirely when denied (no fallback) */
  hide?: boolean;
}

export function PermissionGuard({
  permission,
  anyOf,
  allOf,
  module,
  role,
  fallback = null,
  loadingFallback = null,
  children,
  hide = false,
}: PermissionGuardProps) {
  const { can, canAny, canAll, canAccessModule, hasRole, loading } = usePermissions();

  if (loading) {
    return <>{loadingFallback}</>;
  }

  let allowed = false;

  if (permission) {
    allowed = can(permission);
  } else if (anyOf) {
    allowed = canAny(anyOf);
  } else if (allOf) {
    allowed = canAll(allOf);
  } else if (module) {
    allowed = canAccessModule(module);
  } else if (role) {
    allowed = hasRole(role);
  } else {
    // No check specified — allow by default
    allowed = true;
  }

  if (!allowed) {
    if (hide) return null;
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * AccessDenied — Default fallback component for permission-denied states.
 */
export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Access Denied
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        {message || "You don't have permission to access this resource. Contact your administrator if you believe this is an error."}
      </p>
    </div>
  );
}
