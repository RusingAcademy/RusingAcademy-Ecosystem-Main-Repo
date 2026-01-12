import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import LearnerDashboard from "@/pages/LearnerDashboard";
import CoachDashboard from "@/pages/CoachDashboard";
import HRDashboard from "@/pages/HRDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

/**
 * DashboardRouter - RBAC-based dashboard routing
 * 
 * Routes users to the appropriate dashboard based on their role:
 * - Owner/Admin → Admin Dashboard
 * - HR → HR Dashboard
 * - Coach → Coach Dashboard
 * - Learner → Learner Dashboard
 * 
 * If not authenticated, redirects to /login
 */
export default function DashboardRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setRedirecting(true);
      setLocation("/login?redirect=/dashboard");
      return;
    }

    // Role-based redirect
    if (user?.role) {
      const role = user.role.toLowerCase();
      
      // Don't redirect if already on a specific dashboard route
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/dashboard/")) {
        return;
      }
      
      if (role === "owner" || role === "admin") {
        setLocation("/dashboard/admin");
      } else if (role === "hr") {
        setLocation("/dashboard/hr");
      } else if (role === "coach") {
        setLocation("/dashboard/coach");
      } else {
        setLocation("/dashboard/learner");
      }
      setRedirecting(true);
    }
  }, [isAuthenticated, isLoading, user, setLocation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirecting state
  if (redirecting || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Fallback: render based on role directly (shouldn't normally reach here)
  const role = user?.role?.toLowerCase() || "learner";
  
  if (role === "owner" || role === "admin") {
    return <AdminDashboard />;
  } else if (role === "hr") {
    return <HRDashboard />;
  } else if (role === "coach") {
    return <CoachDashboard />;
  } else {
    return <LearnerDashboard />;
  }
}
