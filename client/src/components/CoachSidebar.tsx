/**
 * CoachSidebar — RusingAcademy Coach Portal
 * Design: White sidebar with violet (var(--color-violet-600, var(--color-violet-600, var(--accent-purple)))) accents, matching Learner Portal pattern
 */
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { ECOSYSTEM_URLS } from "@/lib/ecosystem-urls";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/mrXRaWLUDJGHdcjc.png";

interface NavItem {
  icon: string;
  label: string;
  labelFr: string;
  path: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", labelFr: "Tableau de bord", path: "/coach/portal" },
  { icon: "people", label: "My Students", labelFr: "Mes étudiants", path: "/coach/students" },
  { icon: "event", label: "Sessions", labelFr: "Sessions", path: "/coach/sessions" },
  { icon: "attach_money", label: "Revenue", labelFr: "Revenus", path: "/coach/revenue" },
  { icon: "trending_up", label: "Performance", labelFr: "Performance", path: "/coach/performance" },
];

const toolsNav: NavItem[] = [
  { icon: "menu_book", label: "Resources", labelFr: "Ressources", path: "/coach/guide" },
  { icon: "rate_review", label: "Feedback", labelFr: "Commentaires", path: "/coach/earnings" },
  { icon: "chat", label: "Messages", labelFr: "Messages", path: "/dashboard" },
  { icon: "calendar_today", label: "Calendar", labelFr: "Calendrier", path: "/coach/sessions" },
];

const settingsNav: NavItem[] = [
  { icon: "person", label: "My Profile", labelFr: "Mon profil", path: "/app/coach-profile" },
  { icon: "settings", label: "Settings", labelFr: "Paramètres", path: "/coach/terms" },
  { icon: "help_outline", label: "Help", labelFr: "Aide", path: "/coach/guide" },
];

interface CoachSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function CoachSidebar({ collapsed, onToggle }: CoachSidebarProps) {
  const [location, setLocation] = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const { user } = useAuth();

  const isActive = (path: string) => location === path;

  const handleLogout = () => setLocation("/");

  const renderNavItem = (item: NavItem) => (
    <Link key={item.path} href={item.path} onClick={onToggle}>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
        isActive(item.path)
          ? "bg-[var(--brand-foundation,#1a3d3d)]/8 text-[var(--brand-foundation,#1a3d3d)] font-semibold border-l-[3px] border-[var(--brand-foundation,#1a3d3d)]"
          : "text-gray-600 hover:text-gray-900  hover:bg-gray-50  border-l-[3px] border-transparent"
      }`}>
        <span className={`material-icons text-lg ${isActive(item.path) ? "text-[var(--brand-foundation,#1a3d3d)]" : "text-gray-400 group-hover:text-gray-600"}`}>
          {item.icon}
        </span>
        <span className="font-medium">{lang === "fr" ? item.labelFr : item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className="ml-auto bg-[var(--brand-foundation,#1a3d3d)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-200 w-[240px] bg-white  border-r border-gray-200  ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}`}
        role="navigation" aria-label="Coach portal navigation">

        {/* Logo Section */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <Link href="/coach/portal" className="flex items-center gap-3 group">
            <img loading="lazy" src={LOGO_ICON} alt="RusingAcademy" className="w-8 h-8 rounded-lg" />
            <div>
              <span className="text-gray-900  font-semibold text-sm tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                RusingAcademy
              </span>
              <span className="block text-[10px] text-[var(--brand-foundation,#1a3d3d)] tracking-wider uppercase font-medium">
                {lang === "fr" ? "Portail Coach" : "Coach Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Coach Status Card */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-gradient-to-br from-[var(--brand-foundation,#1a3d3d)]/5 to-[var(--brand-foundation,#1a3d3d)]/10 border border-[var(--brand-foundation,#1a3d3d)]/15">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[var(--brand-foundation,#1a3d3d)] text-xs font-bold">{lang === "fr" ? "En ligne" : "Online"}</span>
            </div>
            <span className="text-gray-500 text-[10px] font-medium">⭐ 4.8</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500">{lang === "fr" ? "Sessions ce mois" : "Sessions this month"}</span>
            <span className="text-[10px] text-[var(--brand-foundation,#1a3d3d)] font-bold">12</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5" aria-label="Coach navigation">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Principal" : "Main"}
          </div>
          {mainNav.map(renderNavItem)}

          <div className="mx-3 my-2 border-t border-gray-100" />

          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Outils" : "Tools"}
          </div>
          {toolsNav.map(renderNavItem)}

          <div className="mx-3 my-2 border-t border-gray-100" />

          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Paramètres" : "Settings"}
          </div>
          {settingsNav.map(renderNavItem)}

          <div className="mx-3 my-2 border-t border-gray-100" />

          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Écosystème" : "Ecosystem"}
          </div>
          <a href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-[3px] border-transparent transition-all duration-200">
            <span className="material-icons text-lg text-gray-400">admin_panel_settings</span>
            <span className="font-medium">{lang === "fr" ? "Admin Control" : "Admin Control"}</span>
          </a>
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-[3px] border-transparent transition-all duration-200">
            <span className="material-icons text-lg text-gray-400">school</span>
            <span className="font-medium">{lang === "fr" ? "Portail Apprenant" : "Learner Portal"}</span>
          </a>
          <a href={ECOSYSTEM_URLS.community} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-[3px] border-transparent transition-all duration-200">
            <span className="material-icons text-lg text-gray-400">forum</span>
            <span className="font-medium">{lang === "fr" ? "Communauté" : "Community Hub"}</span>
          </a>
          <a href={ECOSYSTEM_URLS.sales} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-[3px] border-transparent transition-all duration-200">
            <span className="material-icons text-lg text-gray-400">receipt_long</span>
            <span className="font-medium">{lang === "fr" ? "Tableau des ventes" : "Sales Dashboard"}</span>
          </a>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50  transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-foundation,#1a3d3d)] to-[var(--color-purple-600, var(--color-purple-600, #9333ea))] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.charAt(0) || "C"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900  text-sm font-medium truncate">{user?.name || "Coach"}</p>
              <p className="text-gray-400 text-[10px] truncate">{lang === "fr" ? "Coach certifié" : "Certified Coach"}</p>
            </div>
          </div>

          {/* Language Toggle */}
          <button aria-label="Action" onClick={toggleLang}
            className="w-full mt-2 py-2 rounded-lg text-[11px] font-medium text-gray-500 hover:text-[var(--brand-foundation,#1a3d3d)] hover:bg-[var(--brand-foundation,#1a3d3d)]/5 transition-all flex items-center justify-center gap-2 border border-gray-100">
            <span className="material-icons text-sm">translate</span>
            {lang === "en" ? "Français" : "English"}
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--brand-foundation,#1a3d3d)]/10 text-[var(--brand-foundation,#1a3d3d)] font-bold uppercase">{lang}</span>
          </button>

          {/* Switch to Learner Portal */}
          <button onClick={() => setLocation("/dashboard")}
            className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-medium text-teal-700 hover:bg-teal-700/5 transition-all flex items-center justify-center gap-1.5 border border-teal-700/20">
            <span className="material-icons text-sm">swap_horiz</span>
            {lang === "fr" ? "Portail Apprenant" : "Learner Portal"}
          </button>

          <button aria-label="Action" onClick={handleLogout} className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-700  hover:bg-gray-50  transition-all flex items-center justify-center gap-1.5">
            <span className="material-icons text-sm">logout</span>
            {t("common.signOut")}
          </button>

          <div className="text-center mt-2">
            <span className="text-[9px] text-gray-400">v2.0.0 — RusingAcademy</span>
          </div>
        </div>
      </aside>
    </>
  );
}
