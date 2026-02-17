import { useAuth } from "../_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminApplicationDashboard } from "@/components/AdminApplicationDashboard";

export default function AdminCoachApplications() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });

  // Auth Guard: show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-foundation)]"></div>
          <p className="text-sm text-muted-foreground font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Auth Guard: redirect in progress
  if (!user) {
    return null;
  }

  // Check if user is admin
  if (user.role !== "admin" && user.openId !== import.meta.env.VITE_OWNER_OPEN_ID) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black dark:text-foreground mb-2">Access Denied</h1>
            <p className="text-black dark:text-foreground dark:text-cyan-300">You do not have permission to access this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <AdminApplicationDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
