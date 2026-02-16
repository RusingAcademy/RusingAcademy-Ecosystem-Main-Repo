/**
 * HRSidebar — RusingAcademy Client Portal (for Government Departments / Organizations)
 * This is NOT an internal HR tool — it's a client-facing portal for departments
 * that have contracted RusingAcademy for language training services.
 * Design: White sidebar with blue (var(--color-blue-600, #2563eb)) accents
 */
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import SocialLinks from "@/components/SocialLinks";
import { trpc } from "@/lib/trpc";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/mrXRaWLUDJGHdcjc.png";

interface NavItem {
  icon: string;
  label: string;
  labelFr: string;
  path: string;
}

const mainNav: NavItem[] = [
  { icon: "dashboard", label: "Overview", labelFr: "Vue d'ensemble", path: "/hr/portal/dashboard" },
  { icon: "groups", label: "Participants", labelFr: "Participants", path: "/hr/portal/team" },
  { icon: "school", label: "Training Cohorts", labelFr: "Cohortes de formation", path: "/hr/portal/cohorts" },
  { icon: "account_balance", label: "Billing & Budget", labelFr: "Facturation et budget", path: "/hr/portal/budget" },
  { icon: "verified", label: "SLE Compliance", labelFr: "Conformité ELS", path: "/hr/portal/compliance" },
];

const toolsNav: NavItem[] = [
  { icon: "assessment", label: "Reports & Analytics", labelFr: "Rapports et analyses", path: "/hr/portal/reports" },
  { icon: "event_note", label: "Training Calendar", labelFr: "Calendrier de formation", path: "/hr/portal/calendar" },
  { icon: "notifications", label: "Notifications", labelFr: "Notifications", path: "/hr/portal/notifications" },
];

const settingsNav: NavItem[] = [
  { icon: "business", label: "Organization Profile", labelFr: "Profil de l'organisation", path: "/hr/portal/organization" },
  { icon: "settings", label: "Settings", labelFr: "Paramètres", path: "/hr/portal/settings" },
  { icon: "support_agent", label: "Support", labelFr: "Soutien", path: "/hr/portal/help" },
];

interface HRSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function HRSidebar({ collapsed, onToggle }: HRSidebarProps) {
  const [location, setLocation] = useLocation();
  const { lang, toggleLang, t } = useLanguage();
  const { user } = useAuth();

  const isActive = (path: string) => location === path;

  const renderNavItem = (item: NavItem) => (
    <Link key={item.path} href={item.path} onClick={onToggle}>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
        isActive(item.path)
          ? "bg-blue-600/8 text-blue-600 font-semibold border-l-[3px] border-blue-600"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:bg-slate-900 border-l-[3px] border-transparent"
      }`}>
        <span className={`material-icons text-lg ${isActive(item.path) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
          {item.icon}
        </span>
        <span className="font-medium">{lang === "fr" ? item.labelFr : item.label}</span>
      </div>
    </Link>
  );

  return (
    <>
      {!collapsed && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onToggle} />}

      <aside className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-200 w-[240px] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}`}
        role="navigation" aria-label={lang === "fr" ? "Navigation du portail client" : "Client portal navigation"}>

        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <Link href="/hr/portal/dashboard" className="flex items-center gap-3">
            <img src={LOGO_ICON} alt="RusingAcademy" className="w-8 h-8 rounded-lg" />
            <div>
              <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                RusingAcademy
              </span>
              <span className="block text-[10px] text-blue-600 tracking-wider uppercase font-medium">
                {lang === "fr" ? "Portail Client" : "Client Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Organization Card — Client's department info (dynamic) */}
        <OrgCard lang={lang} />

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">{lang === "fr" ? "Principal" : "Main"}</div>
          {mainNav.map(renderNavItem)}
          <div className="mx-3 my-2 border-t border-gray-100" />
          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">{lang === "fr" ? "Outils" : "Tools"}</div>
          {toolsNav.map(renderNavItem)}
          <div className="mx-3 my-2 border-t border-gray-100" />
          <div className="text-[10px] text-gray-400 uppercase tracking-wider px-3 mb-1 font-semibold">{lang === "fr" ? "Configuration" : "Configuration"}</div>
          {settingsNav.map(renderNavItem)}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-[var(--color-blue-700, #1d4ed8)] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.charAt(0) || "C"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate">{user?.name || (lang === "fr" ? "Gestionnaire de formation" : "Training Manager")}</p>
              <p className="text-gray-400 text-[10px] truncate">{lang === "fr" ? "Gestionnaire de formation" : "Training Manager"}</p>
            </div>
          </div>

          <button onClick={toggleLang}
            className="w-full mt-2 py-2 rounded-lg text-[11px] font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-600/5 transition-all flex items-center justify-center gap-2 border border-gray-100">
            <span className="material-icons text-sm">translate</span>
            {lang === "en" ? "Français" : "English"}
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 font-bold uppercase">{lang}</span>
          </button>

          <button onClick={() => setLocation("/dashboard")}
            className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-medium text-teal-700 hover:bg-teal-700/5 transition-all flex items-center justify-center gap-1.5 border border-teal-700/20">
            <span className="material-icons text-sm">swap_horiz</span>
            {lang === "fr" ? "Portail Apprenant" : "Learner Portal"}
          </button>

          <button onClick={() => setLocation("/")} className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900 transition-all flex items-center justify-center gap-1.5">
            <span className="material-icons text-sm">logout</span>
            {t("common.signOut")}
          </button>

          <div className="flex justify-center mt-3">
            <SocialLinks size={14} />
          </div>

          <div className="text-center mt-2">
            <span className="text-[9px] text-gray-400">v2.0.0 — RusingAcademy</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/** Dynamic organization card that fetches real data */
function OrgCard({ lang }: { lang: string }) {
  const { data: org } = trpc.hr.getMyOrganization.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const orgName = org?.name || (lang === "fr" ? "Mon département" : "My Department");
  const participantCount = org?.participantCount ?? "—";

  return (
    <div className="mx-4 my-3 p-3 rounded-xl bg-gradient-to-br from-blue-600/5 to-blue-600/10 border border-blue-600/15">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-icons text-blue-600 text-sm">account_balance</span>
        <span className="text-xs font-bold text-gray-800">{lang === "fr" ? "Mon département" : "My Department"}</span>
      </div>
      <p className="text-[10px] text-gray-500 truncate" title={orgName}>{orgName}</p>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-gray-500">{lang === "fr" ? "Participants inscrits" : "Enrolled Participants"}</span>
        <span className="text-[10px] text-blue-600 font-bold">{participantCount}</span>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-500">{lang === "fr" ? "Contrat actif" : "Active Contract"}</span>
        <span className="text-[10px] text-green-600 font-bold">✓</span>
      </div>
    </div>
  );
}
