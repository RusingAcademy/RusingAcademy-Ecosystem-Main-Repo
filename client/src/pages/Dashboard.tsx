import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Import role-specific dashboards
import LearnerDashboardContent from "@/components/dashboard/LearnerDashboard";
import CoachDashboardContent from "@/components/dashboard/CoachDashboard";
import AdminDashboardContent from "@/components/dashboard/AdminDashboard";

/**
 * Unified Dashboard with role-based routing
 * 
 * - Not authenticated → redirect to /login
 * - Learner → LearnerDashboard
 * - Coach → CoachDashboard  
 * - Admin/Owner → AdminDashboard
 */
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login?redirect=/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Role-based dashboard rendering
  const userRole = user.role || "learner";
  const isOwner = user.isOwner === true;

  // Owner or Admin → Admin Dashboard
  if (isOwner || userRole === "owner" || userRole === "admin" || userRole === "hr_admin") {
    return <AdminDashboardContent user={user} />;
  }

  // Coach → Coach Dashboard
  if (userRole === "coach") {
    return <CoachDashboardContent user={user} />;
  }

  // Default → Learner Dashboard
  return <LearnerDashboardContent user={user} />;
}
