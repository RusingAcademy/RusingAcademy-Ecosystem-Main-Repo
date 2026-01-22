import { useAuth } from "../_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminApplicationDashboard } from "@/components/AdminApplicationDashboard";

export default function AdminCoachApplications() {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || (user.role !== "admin" && user.openId !== process.env.VITE_OWNER_OPEN_ID)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-slate-600 dark:text-slate-400">You do not have permission to access this page.</p>
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
