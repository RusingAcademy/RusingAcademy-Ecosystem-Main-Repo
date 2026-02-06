import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, CreditCard, Tag,
  Target, Mail, BarChart3, Activity, Eye, Settings, ChevronLeft,
  ChevronRight, Plus, UserPlus, Globe, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem { id: string; label: string; icon: LucideIcon; path: string; badge?: number; }
interface NavSection { title: string; items: NavItem[]; }

const navSections: NavSection[] = [
  { title: "", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  ]},
  { title: "PRODUCTS", items: [
    { id: "courses", label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { id: "coaching", label: "Coaching", icon: GraduationCap, path: "/admin/coaching" },
  ]},
  { title: "SALES", items: [
    { id: "pricing", label: "Pricing & Checkout", icon: CreditCard, path: "/admin/pricing" },
    { id: "coupons", label: "Coupons", icon: Tag, path: "/admin/coupons" },
    { id: "crm", label: "CRM & Contacts", icon: Target, path: "/admin/crm" },
  ]},
  { title: "MARKETING", items: [
    { id: "email", label: "Email", icon: Mail, path: "/admin/email" },
  ]},
  { title: "PEOPLE", items: [
    { id: "users", label: "Users & Roles", icon: Users, path: "/admin/users" },
  ]},
  { title: "ANALYTICS", items: [
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { id: "activity", label: "Activity Logs", icon: Activity, path: "/admin/activity" },
  ]},
];

const bottomItems: NavItem[] = [
  { id: "preview", label: "Preview as Student", icon: Eye, path: "/admin/preview" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") return location === "/admin" || location === "/admin/";
    return location.startsWith(path);
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ease-in-out shrink-0",
          collapsed ? "w-16" : "w-64"
        )}>
          {/* Brand */}
          <div className="flex items-center gap-2 px-3 py-3 border-b border-sidebar-border">
            {!collapsed ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-foundation)] flex items-center justify-center text-white font-bold text-sm shrink-0">RA</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">RusingÂcademy</p>
                  <p className="text-[10px] text-muted-foreground truncate">Admin Control Center</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-foundation)] flex items-center justify-center text-white font-bold text-sm mx-auto">RA</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={cn("px-3 py-2 flex gap-1.5", collapsed && "flex-col items-center")}>
            {[
              { label: "New Course", icon: Plus, path: "/admin/courses?action=create" },
              { label: "Invite", icon: UserPlus, path: "/admin/users?action=invite" },
            ].map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm"
                    className={cn("gap-1.5 text-xs font-medium", collapsed ? "w-10 h-10 p-0" : "flex-1")}
                    onClick={() => navigate(action.path)}>
                    <action.icon className="h-3.5 w-3.5" />
                    {!collapsed && action.label}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{action.label}</TooltipContent>}
              </Tooltip>
            ))}
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-2">
            {navSections.map((section, idx) => (
              <div key={idx} className="mb-1">
                {section.title && !collapsed && (
                  <p className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{section.title}</p>
                )}
                {section.title && collapsed && <Separator className="my-1" />}
                {section.items.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Link href={item.path}>
                        <button className={cn(
                          "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                          isActive(item.path)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          collapsed && "justify-center px-0"
                        )}>
                          <item.icon className={cn("h-4 w-4 shrink-0", collapsed && "h-5 w-5")} />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && item.badge !== undefined && item.badge > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{item.badge}</span>
                          )}
                        </button>
                      </Link>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            ))}
          </nav>

          {/* Bottom */}
          <div className="border-t border-sidebar-border px-2 py-2">
            {bottomItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link href={item.path}>
                    <button className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                      isActive(item.path)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}>
                      <item.icon className={cn("h-4 w-4 shrink-0", collapsed && "h-5 w-5")} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}

            <Separator className="my-2" />

            {/* User + Controls */}
            <div className={cn("flex items-center gap-2 px-2 py-1.5", collapsed && "justify-center")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-[var(--brand-foundation)] text-white text-xs font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email || ""}</p>
                </div>
              )}
            </div>

            <div className={cn("flex items-center gap-1 mt-1", collapsed ? "flex-col" : "")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground flex-1"
                    onClick={() => navigate("/")}>
                    <Globe className="h-3.5 w-3.5" />
                    {!collapsed && "View Site"}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">View Site</TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
                    onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </TooltipProvider>
  );
}
