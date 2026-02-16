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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0F2140] to-[#0A1628] border-b border-white/10">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <Link href="/community">
            <Button variant="ghost" className="text-white/70 hover:text-white mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "en" ? "Back to Community" : "Retour à la communauté"}
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black mb-2">
            {category ? (language === "en" ? category.name : (category as any).nameFr || category.name) : "..."}
          </h1>
          <p className="text-white/60">
            {category ? (language === "en" ? category.description : (category as any).descriptionFr || category.description) : ""}
          </p>
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
            className="bg-teal-400 text-black dark:text-white dark:text-white hover:bg-teal-400/90 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === "en" ? "New Discussion" : "Nouvelle discussion"}
          </Button>
        </div>

        {/* New Thread Form */}
        <AnimatePresence>
          {showNewThread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 rounded-2xl bg-white dark:bg-slate-800 dark:bg-slate-900/5 border border-teal-400/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">{language === "en" ? "Start a New Discussion" : "Commencer une nouvelle discussion"}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNewThread(false)} className="text-white/60">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={language === "en" ? "Discussion title..." : "Titre de la discussion..."}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 dark:bg-slate-900/5 border border-white/20 focus:border-teal-400 focus:outline-none text-white placeholder-white/40 mb-3"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={language === "en" ? "Share more details..." : "Partagez plus de détails..."}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 dark:bg-slate-900/5 border border-white/20 focus:border-teal-400 focus:outline-none text-white placeholder-white/40 resize-none mb-3"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCreateThread}
                  disabled={!newTitle.trim() || !newContent.trim() || createThreadMutation.isPending}
                  className="bg-teal-400 text-black dark:text-white dark:text-white hover:bg-teal-400/90 font-bold"
                >
                  {createThreadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {language === "en" ? "Post Discussion" : "Publier la discussion"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thread List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
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
                  <div className="group p-5 rounded-xl bg-white dark:bg-slate-800 dark:bg-slate-900/5 border border-white/10 hover:border-teal-400/30 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* Author avatar */}
                      <div className="hidden sm:block">
                        {thread.authorAvatar ? (
                          <img src={thread.authorAvatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center text-sm font-bold text-teal-400">
                            {(thread.authorName || "?")[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          )}
                          {thread.isLocked && (
                            <Lock className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          )}
                          <h3 className="font-bold text-white/90 group-hover:text-teal-400 transition-colors truncate">
                            {thread.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span>{thread.authorName || "Anonymous"}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatRelativeTime(thread.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {thread.viewCount}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {thread.replyCount}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/50">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">{language === "en" ? "No discussions yet in this category." : "Aucune discussion encore dans cette catégorie."}</p>
            {user && (
              <Button
                onClick={() => setShowNewThread(true)}
                className="bg-teal-400 text-black dark:text-white dark:text-white hover:bg-teal-400/90 font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
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
