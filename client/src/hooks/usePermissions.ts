/**
 * usePermissions Hook — RBAC v2
 * 
 * Provides granular RBAC on the frontend by fetching the current user's
 * permissions from the normalized RBAC system (roles → role_permissions → permissions).
 * 
 * Permissions use the format "module.submodule.action" (e.g., "products.courses.view").
 * Owner/admin users receive ["*"] which grants all permissions.
 * 
 * Usage:
 *   const { can, canAny, canAll, canAccessModule, hasRole, loading } = usePermissions();
 *   if (can("products.courses.view")) { ... }
 *   if (canAccessModule("marketing")) { ... }
 *   if (hasRole(["owner", "admin"])) { ... }
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect, useCallback, useMemo } from "react";

// Well-known permission modules
export type PermissionModule =
  | "products"
  | "people"
  | "marketing"
  | "website"
  | "insights"
  | "settings"
  | "platform"
  | "hr";

// Well-known roles
export type UserRole =
  | "owner"
  | "admin"
  | "hr_admin"
  | "colleague"
  | "coach"
  | "learner"
  | "user";

interface PermissionsState {
  permissions: string[];
  role: string;
  isOwner: boolean;
  loading: boolean;
  error: string | null;
}

export function usePermissions() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState<PermissionsState>({
    permissions: [],
    role: "",
    isOwner: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setState({ permissions: [], role: "", isOwner: false, loading: false, error: null });
      return;
    }

    let cancelled = false;

    async function fetchPermissions() {
      try {
        const res = await fetch("/api/auth-rbac/permissions", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch permissions: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          setState({
            permissions: data.permissions || [],
            role: data.role || user?.role || "",
            isOwner: data.isOwner || false,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          // Fallback: use user role from auth context for basic access
          setState({
            permissions: [],
            role: user?.role || "",
            isOwner: false,
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    }

    fetchPermissions();
    return () => { cancelled = true; };
  }, [isAuthenticated, user]);

  const loading = authLoading || state.loading;

  // Build a Set for O(1) lookups
  const permissionSet = useMemo(
    () => new Set(state.permissions),
    [state.permissions]
  );

  const isAdmin = state.role === "admin" || state.role === "owner" || state.isOwner;

  /**
   * Check if the user has a specific permission.
   * Supports exact match ("products.courses.view") and wildcard ("*").
   * Also supports legacy format ("manage_users") for backward compatibility.
   */
  const can = useCallback(
    (permission: string): boolean => {
      if (!isAuthenticated) return false;
      if (state.isOwner) return true;
      if (permissionSet.has("*")) return true;
      return permissionSet.has(permission);
    },
    [isAuthenticated, state.isOwner, permissionSet]
  );

  /**
   * Check if the user has ANY of the specified permissions.
   */
  const canAny = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((p) => can(p));
    },
    [can]
  );

  /**
   * Check if the user has ALL of the specified permissions.
   */
  const canAll = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((p) => can(p));
    },
    [can]
  );

  /**
   * Check if the user has access to a specific module (any action).
   */
  const canAccessModule = useCallback(
    (module: string): boolean => {
      if (state.isOwner || permissionSet.has("*")) return true;
      return state.permissions.some((p) => p.startsWith(`${module}.`));
    },
    [state.permissions, state.isOwner, permissionSet]
  );

  /**
   * Get all permissions for a specific module.
   */
  const getModulePermissions = useCallback(
    (module: string): string[] => {
      if (permissionSet.has("*")) return ["*"];
      return state.permissions.filter((p) => p.startsWith(`${module}.`));
    },
    [state.permissions, permissionSet]
  );

  /**
   * Check if user has a specific role.
   */
  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (Array.isArray(role)) return role.includes(state.role);
      return state.role === role;
    },
    [state.role]
  );

  return useMemo(
    () => ({
      can,
      canAny,
      canAll,
      canAccessModule,
      getModulePermissions,
      hasRole,
      isAdmin,
      isOwner: state.isOwner,
      role: state.role,
      permissions: state.permissions,
      loading,
      isAuthenticated,
      user,
    }),
    [can, canAny, canAll, canAccessModule, getModulePermissions, hasRole, isAdmin, state, loading, isAuthenticated, user]
  );
}
