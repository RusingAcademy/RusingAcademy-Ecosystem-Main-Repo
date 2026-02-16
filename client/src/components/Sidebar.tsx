/**
 * Sidebar — RusingÂcademy Learning Portal
 * Design: Clean white sidebar with teal accents, "Institutional Elegance" theme
 * Uses design system tokens for colors and typography
 * Portal design merge — feat/portal-design-merge
 */
import { Link, useLocation } from "wouter";
import { useGamification } from "@/contexts/GamificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";

const LOGO_ICON = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/mrXRaWLUDJGHdcjc.png";

interface NavItem {
  icon: string;
  label: string;
  labelFr?: string;
  path: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", labelFr: "Tableau de bord", path: "/dashboard" },
  { icon: "school", label: "My Programs", labelFr: "Mes programmes", path: "/programs" },
  { icon: "menu_book", label: "Learning Materials", labelFr: "Matériel d'apprentissage", path: "/learning-materials" },
  { icon: "event", label: "Tutoring Sessions", labelFr: "Séances de tutorat", path: "/tutoring-sessions" },
  { icon: "verified", label: "Authorizations", labelFr: "Autorisations", path: "/authorizations" },
  { icon: "trending_up", label: "Progress", labelFr: "Progrès", path: "/progress" },
  { icon: "leaderboard", label: "Leaderboard", labelFr: "Classement", path: "/leaderboard" },
  { icon: "flag", label: "Challenges", labelFr: "Défis", path: "/challenges" },
  { icon: "quiz", label: "SLE Practice", labelFr: "Pratique ELS", path: "/sle-practice" },
  { icon: "smart_toy", label: "AI Assistant", labelFr: "Assistant IA", path: "/ai-assistant" },
  { icon: "bar_chart", label: "Results", labelFr: "Résultats", path: "/results" },
  { icon: "description", label: "Reports", labelFr: "Rapports", path: "/reports" },
  { icon: "calendar_today", label: "Calendar", labelFr: "Calendrier", path: "/calendar" },
];

const studyToolsNav: NavItem[] = [
  { icon: "note_alt", label: "Study Notes", labelFr: "Notes d'étude", path: "/notes" },
  { icon: "style", label: "Flashcards", labelFr: "Cartes mémoire", path: "/flashcards" },
  { icon: "replay", label: "Daily Review", labelFr: "Révision quotidienne", path: "/daily-review" },
  { icon: "event_note", label: "Study Planner", labelFr: "Planificateur", path: "/study-planner" },
  { icon: "translate", label: "Vocabulary", labelFr: "Vocabulaire", path: "/vocabulary" },
  { icon: "edit_note", label: "Writing Portfolio", labelFr: "Portfolio d'écriture", path: "/writing-portfolio" },
  { icon: "record_voice_over", label: "Pronunciation Lab", labelFr: "Labo de prononciation", path: "/pronunciation-lab" },
  { icon: "auto_stories", label: "Reading Lab", labelFr: "Labo de lecture", path: "/reading-lab" },
  { icon: "headphones", label: "Listening Lab", labelFr: "Labo d'écoute", path: "/listening-lab" },
  { icon: "spellcheck", label: "Grammar Drills", labelFr: "Exercices de grammaire", path: "/grammar-drills" },
  { icon: "hearing", label: "Dictation", labelFr: "Dictée", path: "/dictation" },
];

const secondaryNav: NavItem[] = [
  { icon: "assignment", label: "Mock SLE Exam", labelFr: "Examen ELS simulé", path: "/mock-sle" },
  { icon: "insights", label: "Analytics", labelFr: "Analytique", path: "/analytics" },
  { icon: "rate_review", label: "Peer Review", labelFr: "Évaluation par les pairs", path: "/peer-review" },
  { icon: "groups", label: "Study Groups", labelFr: "Groupes d'étude", path: "/study-groups" },
  { icon: "public", label: "Cultural Immersion", labelFr: "Immersion culturelle", path: "/cultural-immersion" },
  { icon: "notifications", label: "Notifications", labelFr: "Notifications", path: "/notifications", badge: 3 },
  { icon: "forum", label: "Discussions", labelFr: "Discussions", path: "/discussions" },
  { icon: "bookmark", label: "Bookmarks", labelFr: "Signets", path: "/bookmarks" },
  { icon: "search", label: "Search", labelFr: "Recherche", path: "/search" },
  { icon: "emoji_events", label: "Achievements", labelFr: "Réalisations", path: "/achievements" },
  { icon: "help_outline", label: "Help Center", labelFr: "Centre d'aide", path: "/help" },
];

const adminNav: NavItem[] = [
  { icon: "admin_panel_settings", label: "Admin Panel", labelFr: "Panneau admin", path: "/admin" },
  { icon: "people", label: "Coach Hub", labelFr: "Hub des coachs", path: "/admin/coaches" },
  { icon: "bar_chart", label: "Executive Summary", labelFr: "Sommaire exécutif", path: "/admin/analytics" },
  { icon: "edit_note", label: "Content Pipeline", labelFr: "Pipeline de contenu", path: "/admin/content-pipeline" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { totalXP, level, levelTitle, streak } = useGamification();
  const { lang, toggleLang, t } = useLanguage();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/programs") return location.startsWith("/programs");
    if (path === "/dashboard") return location === "/dashboard";
    return location === path;
  };

  const getLabel = (item: NavItem) => lang === "fr" && item.labelFr ? item.labelFr : item.label;

  const handleLogout = () => setLocation("/");

  /* ─── Active / Inactive nav item classes ─── */
  const activeClass = "bg-[var(--brand-foundation)]/8 text-[var(--brand-foundation)] font-semibold border-l-[3px] border-[var(--brand-foundation)]";
  const inactiveClass = "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800 border-l-[3px] border-transparent";
  const activeIconClass = "text-[var(--brand-foundation)]";
  const inactiveIconClass = "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300";

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-200 w-[240px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 ${
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 dark:border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img src={LOGO_ICON} alt="RusingÂcademy" className="w-8 h-8 rounded-lg" loading="lazy" />
            <div>
              <span
                className="text-gray-900 dark:text-gray-100 font-semibold text-sm tracking-wide"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RusingÂcademy
              </span>
              <span className="block text-[10px] text-[var(--brand-foundation)] tracking-wider uppercase font-medium">
                {lang === "fr" ? "Portail d'apprentissage" : "Learning Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Book a Session CTA */}
        <div className="px-4 py-3">
          <Link href="/tutoring-sessions">
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:brightness-105"
              style={{ background: "var(--brand-foundation)" }}
            >
              <span className="material-icons text-base">event</span>
              {lang === "fr" ? "Réserver une séance" : "Book a Session"}
            </button>
          </Link>
        </div>

        {/* Gamification Mini-Bar */}
        <div className="mx-4 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--brand-foundation)] text-xs font-bold">Lv.{level}</span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px]">{levelTitle}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-orange-500 text-xs streak-fire" role="img" aria-label="streak">🔥</span>
              <span className="text-gray-600 dark:text-gray-400 text-[10px] font-medium">{streak}d</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (totalXP % 500) / 5)}%`,
                background: "linear-gradient(90deg, var(--brand-foundation), var(--brand-foundation-2))",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{totalXP.toLocaleString()} XP</span>
            <span className="text-[10px] text-[var(--brand-foundation)] font-medium">
              {500 - (totalXP % 500)} {lang === "fr" ? "au prochain" : "to next"}
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin" aria-label="Primary navigation">
          <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Principal" : "Main"}
          </div>
          {mainNav.map((item) => (
            <Link key={item.path} href={item.path} onClick={onToggle}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
                  isActive(item.path) ? activeClass : inactiveClass
                }`}
              >
                <span className={`material-icons text-lg ${isActive(item.path) ? activeIconClass : inactiveIconClass}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{getLabel(item)}</span>
                {item.badge && (
                  <span className="ml-auto bg-[var(--brand-foundation)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          <div className="mx-3 my-2 border-t border-gray-100 dark:border-slate-700" />

          <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Outils d'étude" : "Study Tools"}
          </div>
          {studyToolsNav.map((item) => (
            <Link key={item.path} href={item.path} onClick={onToggle}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
                  isActive(item.path) ? activeClass : inactiveClass
                }`}
              >
                <span className={`material-icons text-lg ${isActive(item.path) ? activeIconClass : inactiveIconClass}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{getLabel(item)}</span>
              </div>
            </Link>
          ))}

          <div className="mx-3 my-2 border-t border-gray-100 dark:border-slate-700" />

          <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1 font-semibold">
            {lang === "fr" ? "Communauté" : "Community"}
          </div>
          {secondaryNav.map((item) => (
            <Link key={item.path} href={item.path} onClick={onToggle}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
                  isActive(item.path) ? activeClass : inactiveClass
                }`}
              >
                <span className={`material-icons text-lg ${isActive(item.path) ? activeIconClass : inactiveIconClass}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{getLabel(item)}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-[var(--semantic-danger,#e74c3c)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* Admin Section - only visible for admins */}
          {user?.role === "admin" && (
            <>
              <div className="mx-3 my-2 border-t border-gray-100 dark:border-slate-700" />
              <div className="text-[10px] text-purple-500 uppercase tracking-wider px-3 mb-1 font-semibold">Admin</div>
              {adminNav.map((item) => (
                <Link key={item.path} href={item.path} onClick={onToggle}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold border-l-[3px] border-purple-500"
                        : `${inactiveClass}`
                    }`}
                  >
                    <span className={`material-icons text-lg ${isActive(item.path) ? "text-purple-500" : inactiveIconClass}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{getLabel(item)}</span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <Link href="/profile">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ background: "linear-gradient(135deg, var(--brand-foundation), var(--brand-foundation-2))" }}
              >
                {user?.firstName?.[0] || "S"}{user?.lastName?.[0] || "B"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate">
                  {user?.firstName || "Steven"} {user?.lastName?.[0] || "B"}.
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] truncate">
                  {user?.role === "admin" ? "Administrator" : lang === "fr" ? "Fonctionnaire" : "Public Servant"}
                </p>
              </div>
              <span className="material-icons text-gray-300 dark:text-gray-600 text-sm group-hover:text-[var(--brand-foundation)]">settings</span>
            </div>
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="w-full mt-2 py-2 rounded-lg text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-[var(--brand-foundation)] hover:bg-[var(--brand-foundation)]/5 transition-all flex items-center justify-center gap-2 border border-gray-100 dark:border-slate-700"
          >
            <span className="material-icons text-sm">translate</span>
            {lang === "en" ? "Français" : "English"}
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--brand-foundation)]/10 text-[var(--brand-foundation)] font-bold uppercase">
              {lang}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-icons text-sm">logout</span>
            {t("common.signOut")}
          </button>

          <div className="text-center mt-2">
            <span className="text-[9px] text-gray-400 dark:text-gray-600">v2.0.0 — RusingÂcademy</span>
          </div>
        </div>
      </aside>
    </>
  );
}
