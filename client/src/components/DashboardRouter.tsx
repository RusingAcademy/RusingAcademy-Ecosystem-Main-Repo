import { useEffect, useState, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { useAuthContext, ProtectedRoute } from "@/contexts/AuthContext";

// Lazy-load role-based dashboards for code splitting
const LearnerDashboard = lazy(() => import("@/pages/LearnerDashboard"));
const CoachDashboard = lazy(() => import("@/pages/CoachDashboard"));
const HRDashboard = lazy(() => import("@/pages/HRDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

// Debug mode
const AUTH_DEBUG = import.meta.env.VITE_AUTH_DEBUG === "true" || import.meta.env.DEV;

/** Loading skeleton for dashboard code-split chunks */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
}

/**
 * DashboardContent - The actual dashboard content based on user role
 * 
 * This component is only rendered AFTER authentication is confirmed
 * by the ProtectedRoute wrapper.
 * 
 * Phase 5 Enhancement: Owner users are now routed to /owner (Owner Portal)
 * instead of /dashboard/admin, giving them their dedicated super-admin view.
 */
function DashboardContent() {
  const { user, isLoading } = useAuthContext();
  const [, setLocation] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;
    
    // Don't redirect if we already did
    if (hasRedirected) return;
    
    // Don't redirect if no user (ProtectedRoute handles this)
    if (!user) return;

    // Role-based redirect
    const role = user.role?.toLowerCase() || "learner";
    const isOwner = (user as any).isOwner || role === "owner";
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on a specific dashboard route
    if (currentPath.startsWith("/dashboard/")) {
      return;
    }

    let targetPath = "/dashboard/learner";
    
    // Phase 5: Owner users go to Owner Portal
    if (isOwner) {
      targetPath = "/owner";
    } else if (role === "admin") {
      targetPath = "/dashboard/admin";
    } else if (role === "hr_admin" || role === "hr") {
      targetPath = "/dashboard/hr";
    } else if (role === "coach") {
      targetPath = "/dashboard/coach";
    }

    setHasRedirected(true);
    setLocation(targetPath);
  }, [user, isLoading, hasRedirected, setLocation]);

  // Show loading while determining role
  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  // Show redirecting state
  if (hasRedirected) {
    return <DashboardSkeleton />;
  }

  // Fallback: render based on role directly (shouldn't normally reach here)
  const role = user.role?.toLowerCase() || "learner";
  const isOwner = (user as any).isOwner || role === "owner";

  if (isOwner) {
    // Owner Portal is at /owner, redirect there
    return <DashboardSkeleton />;
  } else if (role === "admin") {
    return <Suspense fallback={<DashboardSkeleton />}><AdminDashboard /></Suspense>;
  } else if (role === "hr_admin" || role === "hr") {
    return <Suspense fallback={<DashboardSkeleton />}><HRDashboard /></Suspense>;
  } else if (role === "coach") {
    return <Suspense fallback={<DashboardSkeleton />}><CoachDashboard /></Suspense>;
  } else {
    return <Suspense fallback={<DashboardSkeleton />}><LearnerDashboard /></Suspense>;
  }
}

/**
 * DashboardRouter - RBAC-based dashboard routing
 * 
 * Routes users to the appropriate dashboard based on their role:
 * - Owner → Owner Portal (/owner) [Phase 5]
 * - Admin → Admin Dashboard
 * - HR Admin → HR Dashboard
 * - Coach → Coach Dashboard
 * - Learner → Learner Dashboard
 * 
 * If not authenticated, redirects to /login via ProtectedRoute
 * 
 * IMPORTANT: This component uses ProtectedRoute which:
 * 1. Shows loading skeleton while auth is being checked
 * 2. Only redirects AFTER auth state is resolved
 * 3. Prevents the "flicker" / redirect loop issue
 */
export default function DashboardRouter() {
  return (
    <ProtectedRoute redirectTo="/login">
      <DashboardContent />
    </ProtectedRoute>
  );
}
