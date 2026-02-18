import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft,
  MessageSquare,
  Pin,
  Lock,
  Eye,
  Clock,
  Plus,
  X,
  Loader2,
  ChevronRight,
  Users,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date as any);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function CategoryThreads() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, params] = useRoute("/community/category/:id");
  const categoryId = params?.id ? parseInt(params.id, 10) : 0;

  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const utils = trpc.useUtils();

  const { data: categories } = trpc.forum.categories.useQuery();
  const category = categories?.find((c: any) => c.id === categoryId);

  const { data: threads, isLoading } = trpc.forum.threads.useQuery(
    { categoryId, limit: 50 },
    { enabled: categoryId > 0 }
  );

  const createThreadMutation = trpc.forum.createThread.useMutation({
    onSuccess: () => {
      setShowNewThread(false);
      setNewTitle("");
      setNewContent("");
      utils.forum.threads.invalidate({ categoryId });
      utils.forum.categories.invalidate();
    },
  });

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    await createThreadMutation.mutateAsync({
      categoryId,
      title: newTitle,
      content: newContent,
    });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #0d1a19 0%, #0f2028 40%, #0a1628 100%)" }}>
      {/* Header — Premium glassmorphism */}
      <div style={{ borderBottom: "1px solid rgba(60, 87, 89, 0.15)" }}>
        <div className="max-w-[900px] mx-auto px-6 pt-8 pb-8">
          <Link href="/community">
            <Button
              variant="ghost"
              className="mb-5 -ml-2 text-sm font-medium transition-all"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              {language === "en" ? "Back to Community" : "Retour à la communauté"}
            </Button>
          </Link>

          {/* Category info with premium badge */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: "#17E2C6" }} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(23, 226, 198, 0.7)" }}>
              {language === "en" ? "Forum Category" : "Catégorie du forum"}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
            {category ? (language === "en" ? category.name : (category as any).nameFr || category.name) : "..."}
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.55)" }}>
            {category ? (language === "en" ? category.description : (category as any).descriptionFr || category.description) : ""}
          </p>

          {/* Thread stats */}
          {category && (
            <div className="flex items-center gap-5 mt-4 text-sm" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                {(category as any).threadCount || 0} {language === "en" ? "threads" : "fils"}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                {(category as any).postCount || 0} {language === "en" ? "posts" : "messages"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* New Thread Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              if (!user) { window.location.href = getLoginUrl(); return; }
              setShowNewThread(true);
            }}
            className="community-btn-primary text-sm font-bold"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {language === "en" ? "New Discussion" : "Nouvelle discussion"}
          </Button>
        </div>

        {/* New Thread Form — Premium glassmorphism */}
        <AnimatePresence>
          {showNewThread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(23, 226, 198, 0.2)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                  {language === "en" ? "Start a New Discussion" : "Commencer une nouvelle discussion"}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNewThread(false)} style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  <X className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={language === "en" ? "Discussion title..." : "Titre de la discussion..."}
                className="community-input mb-3"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={language === "en" ? "Share more details..." : "Partagez plus de détails..."}
                className="community-input resize-none mb-3"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCreateThread}
                  disabled={!newTitle.trim() || !newContent.trim() || createThreadMutation.isPending}
                  className="community-btn-primary text-sm font-bold disabled:opacity-50"
                >
                  {createThreadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />}
                  {language === "en" ? "Post Discussion" : "Publier la discussion"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thread List — Premium glassmorphism cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#17E2C6" }} />
          </div>
        ) : threads && threads.length > 0 ? (
          <div className="space-y-3">
            {threads.map((thread: any, index: number) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/community/thread/${thread.id}`}>
                  <div
                    className="group p-5 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(60, 87, 89, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(23, 226, 198, 0.2)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(60, 87, 89, 0.12)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Author avatar */}
                      <div className="hidden sm:block">
                        {thread.authorAvatar ? (
                          <img src={thread.authorAvatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: "rgba(23, 226, 198, 0.1)", color: "#17E2C6" }}
                          >
                            {(thread.authorName || "?")[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && (
                            <Pin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D4AF37" }} aria-hidden="true" />
                          )}
                          {thread.isLocked && (
                            <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FF6B6B" }} aria-hidden="true" />
                          )}
                          <h3 className="font-bold truncate transition-colors duration-200" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            {thread.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                          <span>{thread.authorName || "Anonymous"}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> {formatRelativeTime(thread.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" aria-hidden="true" /> {thread.viewCount}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" aria-hidden="true" /> {thread.replyCount}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ color: "rgba(255, 255, 255, 0.25)" }} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
              <MessageSquare className="w-8 h-8" style={{ color: "rgba(255, 255, 255, 0.25)" }} aria-hidden="true" />
            </div>
            <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
              {language === "en" ? "No discussions yet in this category." : "Aucune discussion encore dans cette catégorie."}
            </p>
            {user && (
              <Button
                onClick={() => setShowNewThread(true)}
                className="community-btn-primary text-sm font-bold"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                {language === "en" ? "Start the First Discussion" : "Commencer la première discussion"}
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
