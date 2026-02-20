/**
 * Community Forum — RusingÂcademy Learning Portal
 * Premium Redesign: HAZY glassmorphism, elevated typography, refined cards
 * Enhanced social features: forum categories, study groups, member stats, recent posts
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  Users,
  BookOpen,
  Clock,
  ChevronRight,
  Plus,
  Heart,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Wrench,
  MessageCircle,
  Trophy,
} from "lucide-react";

const FORUM_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/LzjUWTpKyElhbGdI.png";

type Tab = "categories" | "groups" | "recent";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  school: GraduationCap,
  spellcheck: BookOpen,
  lightbulb: Lightbulb,
  build: Wrench,
  forum: MessageCircle,
  emoji_events: Trophy,
};

const forumCategories = [
  { name: "SLE Preparation", nameFr: "Préparation ELS", icon: "school", description: "Discuss SLE exam strategies, share tips, and support each other.", descFr: "Discutez des stratégies d'examen ELS, partagez des conseils.", topics: 24, posts: 156, color: "#17E2C6" },
  { name: "Grammar & Vocabulary", nameFr: "Grammaire et vocabulaire", icon: "spellcheck", description: "Ask grammar questions, share vocabulary exercises, and learn together.", descFr: "Posez des questions de grammaire, partagez des exercices de vocabulaire.", topics: 18, posts: 89, color: "#8B5CFF" },
  { name: "Study Tips & Resources", nameFr: "Conseils et ressources", icon: "lightbulb", description: "Share useful resources, study tips, and learning materials.", descFr: "Partagez des ressources utiles et des conseils d'étude.", topics: 15, posts: 67, color: "#D4AF37" },
  { name: "Technical Support", nameFr: "Support technique", icon: "build", description: "Get help with portal features and technical issues.", descFr: "Obtenez de l'aide avec les fonctionnalités du portail.", topics: 8, posts: 31, color: "#FF6B6B" },
  { name: "General Discussion", nameFr: "Discussion générale", icon: "forum", description: "Connect with other learners, share experiences, and ask questions.", descFr: "Connectez-vous avec d'autres apprenants, partagez vos expériences.", topics: 22, posts: 134, color: "#10B981" },
  { name: "Success Stories", nameFr: "Histoires de réussite", icon: "emoji_events", description: "Celebrate achievements and inspire others with your bilingual journey.", descFr: "Célébrez vos réussites et inspirez les autres.", topics: 6, posts: 28, color: "#F59E0B" },
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
      <div className="max-w-[1100px] space-y-6">
        {/* Header — Premium glassmorphism banner */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(60, 87, 89, 0.15)" }}>
          <div className="relative h-[160px]">
            <img src={FORUM_IMG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center" style={{ background: "linear-gradient(135deg, rgba(25, 37, 36, 0.9), rgba(60, 87, 89, 0.7))" }}>
              <div className="px-6 md:px-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: "#17E2C6" }} aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(23, 226, 198, 0.8)" }}>
                    {lang === "fr" ? "Espace communautaire" : "Community Space"}
                  </span>
                </div>
                <h1 className="text-white text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("community.title")}
                </h1>
                <p className="text-sm mt-1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{t("community.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Stats Bar — Premium glassmorphism */}
          <div className="flex items-center justify-between px-6 py-3.5" style={{ background: "rgba(25, 37, 36, 0.04)", borderTop: "1px solid rgba(60, 87, 89, 0.1)" }}>
            <div className="flex items-center gap-6">
              {[
                { label: lang === "fr" ? "Sujets" : "Topics", value: "93", icon: MessageSquare },
                { label: lang === "fr" ? "Publications" : "Posts", value: "505", icon: MessageCircle },
                { label: lang === "fr" ? "Membres" : "Members", value: "142", icon: Users },
                { label: lang === "fr" ? "En ligne" : "Online", value: "18", icon: Users, isOnline: true },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <StatIcon className="w-3.5 h-3.5" style={{ color: stat.isOnline ? "#10B981" : "var(--muted-foreground)" }} aria-hidden="true" />
                    <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{stat.value}</span>
                    <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{stat.label}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => toast.success(lang === "fr" ? "Fonctionnalité en cours de développement. Merci de votre patience!" : "Feature under active development. Thank you for your patience!")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3C5759, #4A6B6D)", boxShadow: "0 2px 8px rgba(60, 87, 89, 0.3)" }}
              aria-label={lang === "fr" ? "Nouvelle publication" : "New post"}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              {t("community.newPost")}
            </button>
          </div>
        </div>

        {/* Tab Navigation — Premium pills */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(60, 87, 89, 0.04)", border: "1px solid rgba(60, 87, 89, 0.1)" }}>
          {([
            { key: "categories" as Tab, label: lang === "fr" ? "Catégories" : "Categories", icon: BookOpen },
            { key: "groups" as Tab, label: t("community.studyGroups"), icon: Users },
            { key: "recent" as Tab, label: lang === "fr" ? "Publications récentes" : "Recent Posts", icon: Clock },
          ]).map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeTab === tab.key ? "linear-gradient(135deg, #3C5759, #4A6B6D)" : "transparent",
                  color: activeTab === tab.key ? "white" : "var(--muted-foreground)",
                  boxShadow: activeTab === tab.key ? "0 2px 8px rgba(60, 87, 89, 0.2)" : "none",
                }}
              >
                <TabIcon className="w-3.5 h-3.5" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Categories Tab — Premium glassmorphism cards */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumCategories.map((cat, i) => {
              const CatIcon = categoryIconMap[cat.icon] || MessageSquare;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl p-5 cursor-pointer group transition-all"
                  style={{
                    background: "var(--card, white)",
                    border: "1px solid rgba(60, 87, 89, 0.1)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${cat.color}12` }}
                    >
                      <CatIcon className="w-5 h-5" style={{ color: cat.color }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold transition-colors group-hover:text-[#3C5759]" style={{ color: "var(--foreground)" }}>
                        {lang === "fr" ? cat.nameFr : cat.name}
                      </h3>
                      <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                        {lang === "fr" ? cat.descFr : cat.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2.5">
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                          <MessageSquare className="w-3 h-3" aria-hidden="true" />
                          <strong style={{ color: "var(--foreground)" }}>{cat.topics}</strong> {lang === "fr" ? "sujets" : "topics"}
                        </span>
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                          <Users className="w-3 h-3" aria-hidden="true" />
                          <strong style={{ color: "var(--foreground)" }}>{cat.posts}</strong> {lang === "fr" ? "publications" : "posts"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ color: "var(--muted-foreground)" }} aria-hidden="true" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Study Groups Tab — Premium cards */}
        {activeTab === "groups" && (
          <div className="space-y-3">
            {studyGroups.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-5 flex items-center justify-between transition-all"
                style={{
                  background: "var(--card, white)",
                  border: "1px solid rgba(60, 87, 89, 0.1)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: group.active ? "rgba(16, 185, 129, 0.08)" : "rgba(60, 87, 89, 0.06)" }}
                  >
                    <Users className="w-5 h-5" style={{ color: group.active ? "#10B981" : "var(--muted-foreground)" }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{group.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{group.members} {lang === "fr" ? "membres" : "members"}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(60, 87, 89, 0.06)", color: "var(--muted-foreground)" }}>{group.language}</span>
                      {group.active && (
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "#10B981" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }} aria-hidden="true" />
                          {lang === "fr" ? "Actif" : "Active"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{lang === "fr" ? "Prochaine séance" : "Next session"}</p>
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{group.nextSession}</p>
                  <button
                    onClick={() => toast.success(lang === "fr" ? "Fonctionnalité en cours de développement. Merci de votre patience!" : "Feature under active development. Thank you for your patience!")}
                    className="mt-1 px-3 py-1 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80"
                    style={{ color: "#3C5759", border: "1px solid rgba(60, 87, 89, 0.2)" }}
                  >
                    {t("community.joinGroup")}
                  </button>
                </div>
              </motion.div>
            ))}
            <button
              onClick={() => toast.success(lang === "fr" ? "Fonctionnalité en cours de développement. Merci de votre patience!" : "Feature under active development. Thank you for your patience!")}
              className="w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
              style={{ border: "2px dashed rgba(60, 87, 89, 0.15)", color: "var(--muted-foreground)" }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t("community.createGroup")}
            </button>
          </div>
        )}

        {/* Recent Posts Tab — Premium cards */}
        {activeTab === "recent" && (
          <div className="space-y-3">
            {recentPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-5 cursor-pointer group transition-all"
                style={{
                  background: "var(--card, white)",
                  border: "1px solid rgba(60, 87, 89, 0.1)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #3C5759, #4A6B6D)" }}
                  >
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold transition-colors group-hover:text-[#3C5759]" style={{ color: "var(--foreground)" }}>{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{post.author}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(60, 87, 89, 0.06)", color: "#3C5759" }}>{post.category}</span>
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{post.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="text-xs">{post.replies}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                      <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="text-xs">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
