/**
 * usePortalAccess — Hook for checking portal access permissions
 * Auth Phase 5: Cross-Portal Access
 *
 * Provides a unified way to check which portals the current user
 * can access based on their role and permissions.
 */
import { useMemo } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export type PortalId = "owner" | "admin" | "hr" | "coach" | "learner";

export interface PortalAccessInfo {
  id: PortalId;
  hasAccess: boolean;
  href: string;
}

/**
 * Role-to-portal access matrix
 * Defines which roles can access which portals
 */
const PORTAL_ACCESS_MATRIX: Record<string, PortalId[]> = {
  owner: ["owner", "admin", "hr", "coach", "learner"],
  admin: ["admin", "hr", "coach", "learner"],
  hr_admin: ["hr", "learner"],
  colleague: ["learner"],
  coach: ["coach", "learner"],
  learner: ["learner"],
};

const PORTAL_HREFS: Record<PortalId, string> = {
  owner: "/owner",
  admin: "/admin",
  hr: "/dashboard/hr",
  coach: "/dashboard/coach",
  learner: "/dashboard/learner",
};

export function usePortalAccess() {
  const { user } = useAuthContext();

  const accessInfo = useMemo(() => {
    const role = user?.role?.toLowerCase() || "learner";
    const isOwner = (user as any)?.isOwner || role === "owner";

    // Get accessible portal IDs
    let accessiblePortals: PortalId[];
    if (isOwner) {
      accessiblePortals = PORTAL_ACCESS_MATRIX["owner"];
    } else {
      accessiblePortals = PORTAL_ACCESS_MATRIX[role] || PORTAL_ACCESS_MATRIX["learner"];
    }

    // Build access info for each portal
    const portals: PortalAccessInfo[] = (["owner", "admin", "hr", "coach", "learner"] as PortalId[]).map((id) => ({
      id,
      hasAccess: accessiblePortals.includes(id),
      href: PORTAL_HREFS[id],
    }));

    return {
      portals,
      accessiblePortals,
      canAccessOwner: accessiblePortals.includes("owner"),
      canAccessAdmin: accessiblePortals.includes("admin"),
      canAccessHR: accessiblePortals.includes("hr"),
      canAccessCoach: accessiblePortals.includes("coach"),
      canAccessLearner: accessiblePortals.includes("learner"),
      currentRole: role,
      isOwner,
      portalCount: accessiblePortals.length,
    };
  }, [user]);

  return accessInfo;
}

export default usePortalAccess;
