/**
 * Community Forum — RusingÂcademy Learning Portal
 * Enhanced social features: forum categories, study groups, member stats, recent posts
 * Design: Clean white light theme, accessible
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const FORUM_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/LzjUWTpKyElhbGdI.png";

type Tab = "categories" | "groups" | "recent";

const forumCategories = [
  { name: "SLE Preparation", nameFr: "Préparation ELS", icon: "school", description: "Discuss SLE exam strategies, share tips, and support each other.", descFr: "Discutez des stratégies d'examen ELS, partagez des conseils.", topics: 24, posts: 156, color: "var(--brand-teal, var(--teal))" },
  { name: "Grammar & Vocabulary", nameFr: "Grammaire et vocabulaire", icon: "spellcheck", description: "Ask grammar questions, share vocabulary exercises, and learn together.", descFr: "Posez des questions de grammaire, partagez des exercices de vocabulaire.", topics: 18, posts: 89, color: "var(--color-violet-500, var(--accent-purple))" },
  { name: "Study Tips & Resources", nameFr: "Conseils et ressources", icon: "lightbulb", description: "Share useful resources, study tips, and learning materials.", descFr: "Partagez des ressources utiles et des conseils d'étude.", topics: 15, posts: 67, color: "var(--semantic-warning, var(--warning))" },
  { name: "Technical Support", nameFr: "Support technique", icon: "build", description: "Get help with portal features and technical issues.", descFr: "Obtenez de l'aide avec les fonctionnalités du portail.", topics: 8, posts: 31, color: "var(--semantic-danger, var(--danger))" },
  { name: "General Discussion", nameFr: "Discussion générale", icon: "forum", description: "Connect with other learners, share experiences, and ask questions.", descFr: "Connectez-vous avec d'autres apprenants, partagez vos expériences.", topics: 22, posts: 134, color: "var(--semantic-success, var(--success))" },
  { name: "Success Stories", nameFr: "Histoires de réussite", icon: "emoji_events", description: "Celebrate achievements and inspire others with your bilingual journey.", descFr: "Célébrez vos réussites et inspirez les autres.", topics: 6, posts: 28, color: "var(--semantic-warning, var(--warning))" },
];

const studyGroups = [
  { name: "Level B Prep Squad", members: 12, active: true, language: "FR/EN", nextSession: "Feb 15, 2026" },
  { name: "Written Expression Practice", members: 8, active: true, language: "FR", nextSession: "Feb 14, 2026" },
  { name: "Oral Interaction Club", members: 15, active: true, language: "EN/FR", nextSession: "Feb 17, 2026" },
  { name: "Grammar Fundamentals", members: 6, active: false, language: "FR", nextSession: "TBD" },
  { name: "Level C Advanced Group", members: 4, active: true, language: "FR/EN", nextSession: "Feb 16, 2026" },
];

const recentPosts = [
  { author: "Marie L.", avatar: "ML", category: "SLE Preparation", title: "Tips for the oral interaction — what worked for me", replies: 8, likes: 23, time: "2h ago" },
  { author: "James K.", avatar: "JK", category: "Grammar & Vocabulary", title: "Subjunctive vs Indicative — when to use which?", replies: 12, likes: 31, time: "4h ago" },
  { author: "Sophie R.", avatar: "SR", category: "Success Stories", title: "I passed my SLE Level C! Here's my journey", replies: 15, likes: 47, time: "6h ago" },
  { author: "David M.", avatar: "DM", category: "Study Tips & Resources", title: "Best podcasts for French immersion", replies: 6, likes: 19, time: "8h ago" },
  { author: "Aisha B.", avatar: "AB", category: "General Discussion", title: "Looking for a study partner — Level B prep", replies: 4, likes: 11, time: "12h ago" },
];

export default function CommunityForum() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("categories");

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] space-y-5">
        {/* Header */}
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl overflow-hidden shadow-sm">
          <div className="relative h-[140px]">
            <img src={FORUM_IMG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-700/85 to-teal-700/40 flex items-center">
              <div className="px-6 md:px-8">
                <h1 className="text-white text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("community.title")}
                </h1>
                <p className="text-white/80 text-sm mt-1">{t("community.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-white/15 bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
            <div className="flex items-center gap-6">
              {[
                { label: lang === "fr" ? "Sujets" : "Topics", value: "93", icon: "topic" },
                { label: lang === "fr" ? "Publications" : "Posts", value: "505", icon: "chat_bubble" },
                { label: lang === "fr" ? "Membres" : "Members", value: "142", icon: "people" },
                { label: lang === "fr" ? "En ligne" : "Online", value: "18", icon: "circle", color: "var(--semantic-success, var(--success))" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <span className="material-icons" style={{ fontSize: "14px", color: stat.color ?? "var(--color-gray-400, var(--muted-foreground))" }}>{stat.icon}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  <span className="text-[10px] text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => toast.info(lang === "fr" ? "Bientôt disponible" : "Coming soon")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:brightness-105 transition-all flex items-center gap-1.5">
              <span className="material-icons" >add</span>
              {t("community.newPost")}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-1 shadow-sm">
          {([
            { key: "categories" as Tab, label: lang === "fr" ? "Catégories" : "Categories", icon: "category" },
            { key: "groups" as Tab, label: t("community.studyGroups"), icon: "groups" },
            { key: "recent" as Tab, label: lang === "fr" ? "Publications récentes" : "Recent Posts", icon: "schedule" },
          ]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-teal-700 hover:bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm"
              }`}>
              <span className="material-icons" >{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forumCategories.map((cat, i) => (
              <div key={i} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-teal-700/20 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}10` }}>
                    <span className="material-icons" style={{ color: cat.color, fontSize: "22px" }}>{cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-foreground group-hover:text-teal-700 transition-colors">
                      {lang === "fr" ? cat.nameFr : cat.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                      {lang === "fr" ? cat.descFr : cat.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] text-gray-400">
                        <strong className="text-gray-600">{cat.topics}</strong> {lang === "fr" ? "sujets" : "topics"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        <strong className="text-gray-600">{cat.posts}</strong> {lang === "fr" ? "publications" : "posts"}
                      </span>
                    </div>
                  </div>
                  <span className="material-icons text-gray-300 group-hover:text-teal-700 transition-colors" >chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Study Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-3">
            {studyGroups.map((group, i) => (
              <div key={i} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${group.active ? "bg-emerald-500/10" : "bg-gray-100 dark:bg-white/[0.06] dark:backdrop-blur-sm"}`}>
                    <span className={`material-icons ${group.active ? "text-emerald-500" : "text-gray-400"}`} style={{ fontSize: "20px" }}>groups</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{group.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-gray-400">{group.members} {lang === "fr" ? "membres" : "members"}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-500 font-medium">{group.language}</span>
                      {group.active && (
                        <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {lang === "fr" ? "Actif" : "Active"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">{lang === "fr" ? "Prochaine séance" : "Next session"}</p>
                  <p className="text-xs font-medium text-gray-700">{group.nextSession}</p>
                  <button onClick={() => toast.info(lang === "fr" ? "Bientôt disponible" : "Coming soon")}
                    className="mt-1 px-3 py-1 rounded-lg text-[10px] font-semibold text-teal-700 border border-teal-700/20 hover:bg-teal-700/5 transition-all">
                    {t("community.joinGroup")}
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => toast.info(lang === "fr" ? "Bientôt disponible" : "Coming soon")}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/15 dark:border-white/15 text-sm font-medium text-gray-400 hover:text-teal-700 hover:border-teal-700/30 transition-all flex items-center justify-center gap-2">
              <span className="material-icons" >add</span>
              {t("community.createGroup")}
            </button>
          </div>
        )}

        {/* Recent Posts Tab */}
        {activeTab === "recent" && (
          <div className="space-y-3">
            {recentPosts.map((post, i) => (
              <div key={i} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md border border-gray-200 dark:border-white/15 dark:border-white/15 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-[#00a0b0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-foreground group-hover:text-teal-700 transition-colors">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-500">{post.author}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-700/8 text-teal-700 font-medium">{post.category}</span>
                      <span className="text-[10px] text-gray-400">{post.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="material-icons" >chat_bubble_outline</span>
                      <span className="text-xs">{post.replies}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="material-icons" >favorite_border</span>
                      <span className="text-xs">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
