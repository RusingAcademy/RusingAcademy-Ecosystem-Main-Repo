/**
 * PortalLayout Component
 * Main layout wrapper for the LMS Portal
 * Sprint 8: Premium Learning Hub
 * 
 * Adapted from GitHub orphan — Clerk auth replaced with Manus useAuth
 */

import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  FolderOpen,
  ChevronRight,
  BookOpen,
  Target,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  children: ReactNode;
}

const navigation = [
  { 
    name: "Vue d'ensemble", 
    href: "/portal/overview", 
    icon: LayoutDashboard,
    description: "Votre progression et activités"
  },
  { 
    name: "Mon Parcours", 
    href: "/portal/my-path", 
    icon: GraduationCap,
    description: "Path Series™ et curriculum"
  },
  { 
    name: "Coaching", 
    href: "/portal/coaching", 
    icon: Users,
    description: "Sessions Lingueefy"
  },
  { 
    name: "Ressources", 
    href: "/resources", 
    icon: FolderOpen,
    description: "Documents et enregistrements"
  },
];

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
  const userName = user?.name || "Apprenant";

  return (
    <div className="min-h-screen bg-white dark:bg-background flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-obsidian text-white flex flex-col z-20">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-teal-800">
          <Link href="/portal/overview" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-700 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg">RusingAcademy</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-teal-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-foundation/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-700 flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-cyan-300 truncate">
                Niveau B en cours
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-white/90 hover:bg-foundation hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-cyan-300")} />
                <div className="flex-1">
                  <span>{item.name}</span>
                  {!isActive && (
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Progress Summary */}
        <div className="px-4 py-4 border-t border-teal-800">
          <div className="p-3 rounded-lg bg-foundation/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-white/90">Progression Globale</span>
            </div>
            <div className="w-full h-2 bg-teal-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-teal-700 rounded-full transition-all duration-500"
                style={{ width: "45%" }}
              />
            </div>
            <p className="text-xs text-cyan-300 mt-2">45% vers le niveau B</p>
          </div>
        </div>

        {/* Lingueefy Branding */}
        <div className="px-4 py-3 border-t border-teal-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Propulsé par</span>
            <span className="font-semibold text-cyan-300">Lingueefy</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-background border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900">
              Portail d'Apprentissage
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Action" className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
