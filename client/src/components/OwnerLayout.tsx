/**
 * OwnerLayout — Layout wrapper for Owner Portal pages
 * Uses the HAZY palette with a premium gold accent for the Owner experience.
 */
import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Crown, LayoutDashboard, Users, Settings, Shield,
  Activity, Flag, ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/owner" },
  { label: "Users & Roles", icon: Users, path: "/owner/users" },
  { label: "Feature Flags", icon: Flag, path: "/owner/flags" },
  { label: "Audit Log", icon: Activity, path: "/owner/audit" },
  { label: "Security", icon: Shield, path: "/owner/security" },
  { label: "Settings", icon: Settings, path: "/owner/settings" },
];

interface Props {
  children: React.ReactNode;
}

export default function OwnerLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user } = useAuthContext();

  return (
    <div className="flex min-h-screen bg-[#EFECE9] dark:bg-[#192524]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } bg-gradient-to-b from-[#192524] to-[#3C5759] text-white shadow-xl`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shrink-0">
            <Crown className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Owner Portal</p>
              <p className="text-xs text-white/60 truncate">{user?.name ?? "Owner"}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = location === item.path || (item.path !== "/owner" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    active
                      ? "bg-amber-500/20 text-amber-300"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Back to Dashboard */}
        <div className="absolute bottom-4 left-0 right-0 px-2 space-y-1">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-white/50 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm">Back to Dashboard</span>}
            </div>
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 bg-[#3C5759] border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-[260px]"
        } p-6 overflow-y-auto`}
      >
        {children}
      </main>
    </div>
  );
}
