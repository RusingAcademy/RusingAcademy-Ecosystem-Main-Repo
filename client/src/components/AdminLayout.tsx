import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, CreditCard, Tag,
  Target, Mail, BarChart3, Activity, Eye, Settings, ChevronLeft,
  ChevronRight, Plus, UserPlus, Globe, Workflow, Zap, FileText, Brain,
  TrendingUp, Image, Shield, Bell, Download, Sparkles, TestTube,
  Gauge, Rocket, Building2, ClipboardCheck, Lightbulb, Clock, FlaskConical,
  Receipt, Trophy, Award, Star, Headphones, Newspaper, FolderDown,
  MessageCircle, DollarSign, ShoppingCart, FileSpreadsheet, Handshake,
  Link2, Palette, Navigation, PenTool, Megaphone, Inbox, CalendarDays,
  Filter, UserCheck, BarChart2, PieChart, type LucideIcon, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import GlobalSearchBar from "@/pages/admin/GlobalSearch";
import { usePermissions } from "@/hooks/usePermissions";

interface NavItem { id: string; label: string; icon: LucideIcon; path: string; badge?: number; requiredPermission?: string; }
interface NavSection { title: string; items: NavItem[]; collapsible?: boolean; }

// ============================================================================
// KAJABI-STYLE SIDEBAR HIERARCHY
// Products → Sales → Website → Marketing → Contacts → Analytics → More
// ============================================================================
const navSections: NavSection[] = [
  { title: "", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  ]},

  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  { title: "PRODUCTS", collapsible: true, items: [
    { id: "all-products", label: "All Products", icon: BookOpen, path: "/admin/products", requiredPermission: "manage_courses" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/admin/courses", requiredPermission: "manage_courses" },
    { id: "coaching", label: "Coaching", icon: GraduationCap, path: "/admin/coaching", requiredPermission: "manage_coaches" },
    { id: "podcasts", label: "Podcasts", icon: Headphones, path: "/admin/podcasts", requiredPermission: "manage_content" },
    { id: "newsletters", label: "Newsletters", icon: Newspaper, path: "/admin/newsletters", requiredPermission: "manage_content" },
    { id: "downloads", label: "Downloads", icon: FolderDown, path: "/admin/downloads", requiredPermission: "manage_content" },
    { id: "community", label: "Community", icon: MessageCircle, path: "/admin/community", requiredPermission: "manage_content" },
    { id: "enrollments", label: "Enrollments", icon: Users, path: "/admin/enrollments", requiredPermission: "manage_courses" },
    { id: "certificates", label: "Certificates", icon: Award, path: "/admin/certificates", requiredPermission: "manage_courses" },
    { id: "reviews", label: "Reviews", icon: Star, path: "/admin/reviews", requiredPermission: "manage_courses" },
    { id: "gamification", label: "Gamification", icon: Trophy, path: "/admin/gamification", requiredPermission: "manage_courses" },
  ]},

  // ── SALES ─────────────────────────────────────────────────────────────────
  { title: "SALES", collapsible: true, items: [
    { id: "payments", label: "Payments", icon: DollarSign, path: "/admin/payments", requiredPermission: "manage_payments" },
    { id: "offers", label: "Offers", icon: Tag, path: "/admin/offers", requiredPermission: "manage_payments" },
    { id: "pricing", label: "Pricing & Checkout", icon: CreditCard, path: "/admin/pricing", requiredPermission: "manage_payments" },
    { id: "coupons", label: "Coupons", icon: Tag, path: "/admin/coupons", requiredPermission: "manage_payments" },
    { id: "cart", label: "Cart", icon: ShoppingCart, path: "/admin/cart", requiredPermission: "manage_payments" },
    { id: "invoices", label: "Invoices", icon: FileSpreadsheet, path: "/admin/invoices", requiredPermission: "manage_payments" },
    { id: "affiliates", label: "Affiliates", icon: Handshake, path: "/admin/affiliates", requiredPermission: "manage_payments" },
    { id: "stripe-testing", label: "Stripe Testing", icon: TestTube, path: "/admin/stripe-testing", requiredPermission: "manage_payments" },
  ]},

  // ── WEBSITE ───────────────────────────────────────────────────────────────
  { title: "WEBSITE", collapsible: true, items: [
    { id: "design", label: "Design", icon: Palette, path: "/admin/design", requiredPermission: "manage_cms" },
    { id: "pages", label: "Pages", icon: FileText, path: "/admin/pages", requiredPermission: "manage_cms" },
    { id: "navigation", label: "Navigation", icon: Navigation, path: "/admin/navigation", requiredPermission: "manage_cms" },
    { id: "blog", label: "Blog", icon: PenTool, path: "/admin/blog", requiredPermission: "manage_content" },
    { id: "media-library", label: "Media Library", icon: Image, path: "/admin/media-library", requiredPermission: "manage_content" },
    { id: "email-templates", label: "Email Templates", icon: Mail, path: "/admin/email-templates", requiredPermission: "manage_content" },
  ]},

  // ── MARKETING ─────────────────────────────────────────────────────────────
  { title: "MARKETING", collapsible: true, items: [
    { id: "marketing-overview", label: "Overview", icon: Megaphone, path: "/admin/marketing", requiredPermission: "manage_analytics" },
    { id: "inbox", label: "Inbox", icon: Inbox, path: "/admin/inbox", requiredPermission: "manage_crm" },
    { id: "email", label: "Email Campaigns", icon: Mail, path: "/admin/email" },
    { id: "forms", label: "Forms", icon: ClipboardCheck, path: "/admin/forms", requiredPermission: "manage_content" },
    { id: "events", label: "Events", icon: CalendarDays, path: "/admin/events", requiredPermission: "manage_content" },
    { id: "funnels", label: "Funnels", icon: Workflow, path: "/admin/funnels" },
    { id: "automations", label: "Automations", icon: Zap, path: "/admin/automations" },
  ]},

  // ── CONTACTS ──────────────────────────────────────────────────────────────
  { title: "CONTACTS", collapsible: true, items: [
    { id: "all-contacts", label: "All Contacts", icon: Users, path: "/admin/contacts", requiredPermission: "manage_crm" },
    { id: "crm", label: "CRM & Pipeline", icon: Target, path: "/admin/crm", requiredPermission: "manage_crm" },
    { id: "insights", label: "Insights", icon: Lightbulb, path: "/admin/contact-insights", requiredPermission: "manage_crm" },
    { id: "assessments", label: "Assessments", icon: ClipboardCheck, path: "/admin/assessments", requiredPermission: "manage_crm" },
    { id: "import-export", label: "Import / Export", icon: Download, path: "/admin/import-export", requiredPermission: "manage_settings" },
  ]},

  // ── ANALYTICS ─────────────────────────────────────────────────────────────
  { title: "ANALYTICS", collapsible: true, items: [
    { id: "analytics", label: "Overview", icon: BarChart3, path: "/admin/analytics", requiredPermission: "manage_analytics" },
    { id: "reports", label: "Reports", icon: PieChart, path: "/admin/reports", requiredPermission: "manage_analytics" },
    { id: "sales-analytics", label: "Sales Analytics", icon: TrendingUp, path: "/admin/sales-analytics", requiredPermission: "manage_analytics" },
    { id: "live-kpi", label: "Live KPI", icon: Gauge, path: "/admin/live-kpi", requiredPermission: "view_dashboard" },
    { id: "content-intelligence", label: "Content Intelligence", icon: Lightbulb, path: "/admin/content-intelligence", requiredPermission: "manage_analytics" },
    { id: "activity", label: "Activity Logs", icon: Activity, path: "/admin/activity", requiredPermission: "view_audit_log" },
  ]},

  // ── AI & SLE ──────────────────────────────────────────────────────────────
  { title: "AI & SLE", collapsible: true, items: [
    { id: "ai-companion", label: "AI Companion", icon: Brain, path: "/admin/ai-companion", requiredPermission: "manage_ai" },
    { id: "ai-predictive", label: "AI Predictive", icon: Sparkles, path: "/admin/ai-predictive", requiredPermission: "manage_ai" },
    { id: "sle-exam", label: "SLE Exam Mode", icon: ClipboardCheck, path: "/admin/sle-exam", requiredPermission: "manage_sle_exam" },
  ]},

  // ── PEOPLE ────────────────────────────────────────────────────────────────
  { title: "PEOPLE", collapsible: true, items: [
    { id: "users", label: "Users & Roles", icon: Users, path: "/admin/users", requiredPermission: "manage_users" },
    { id: "permissions", label: "Permissions", icon: Shield, path: "/admin/permissions", requiredPermission: "manage_roles" },
  ]},

  // ── SYSTEM ────────────────────────────────────────────────────────────────
  { title: "SYSTEM", collapsible: true, items: [
    { id: "notifications", label: "Notifications", icon: Bell, path: "/admin/notifications", requiredPermission: "manage_notifications" },
    { id: "onboarding", label: "Onboarding", icon: Rocket, path: "/admin/onboarding", requiredPermission: "manage_settings" },
    { id: "enterprise", label: "Enterprise", icon: Building2, path: "/admin/enterprise", requiredPermission: "manage_enterprise" },
    { id: "drip-content", label: "Drip Content", icon: Clock, path: "/admin/drip-content", requiredPermission: "manage_courses" },
    { id: "ab-testing", label: "A/B Testing", icon: FlaskConical, path: "/admin/ab-testing", requiredPermission: "manage_analytics" },
    { id: "org-billing", label: "Org Billing", icon: Receipt, path: "/admin/org-billing", requiredPermission: "manage_enterprise" },
    { id: "weekly-challenges", label: "Challenges", icon: Trophy, path: "/admin/weekly-challenges", requiredPermission: "manage_courses" },
  ]},
];

const bottomItems: NavItem[] = [
  { id: "preview-mode", label: "Preview Everything", icon: Eye, path: "/admin/preview-mode" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [location, navigate] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { can } = usePermissions();

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-foundation)]"></div>
          <p className="text-sm text-muted-foreground font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!item.requiredPermission) return true;
      return can(item.requiredPermission);
    }),
  })).filter(section => section.items.length > 0);

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
            {filteredSections.map((section, idx) => {
              const isSectionCollapsed = section.collapsible && collapsedSections[section.title];
              return (
                <div key={idx} className="mb-1">
                  {section.title && !collapsed && (
                    <button
                      onClick={() => section.collapsible && toggleSection(section.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase",
                        section.collapsible && "hover:text-sidebar-foreground cursor-pointer"
                      )}
                    >
                      <span>{section.title}</span>
                      {section.collapsible && (
                        <ChevronDown className={cn("h-3 w-3 transition-transform", isSectionCollapsed && "-rotate-90")} />
                      )}
                    </button>
                  )}
                  {section.title && collapsed && <Separator className="my-1" />}
                  {!isSectionCollapsed && section.items.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link href={item.path}>
                          <button className={cn(
                            "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
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
              );
            })}
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
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Top Bar with Global Search */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
            <GlobalSearchBar />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative" onClick={() => navigate("/admin/notifications")}>
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  );
}
