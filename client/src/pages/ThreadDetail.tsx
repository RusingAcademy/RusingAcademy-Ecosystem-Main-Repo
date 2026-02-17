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
  Heart,
  Pin,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  Send,
  Eye,
  Clock,
  MoreVertical,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
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

export default function ThreadDetail() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, params] = useRoute("/community/thread/:id");
  const threadId = params?.id ? parseInt(params.id, 10) : 0;

  const [replyContent, setReplyContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showActions, setShowActions] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.forum.thread.useQuery(
    { id: threadId },
    { enabled: threadId > 0 }
  );

  const createPostMutation = trpc.forum.createPost.useMutation({
    onSuccess: () => {
      setReplyContent("");
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const editPostMutation = trpc.forum.editPost.useMutation({
    onSuccess: () => {
      setEditingPostId(null);
      setEditContent("");
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const deletePostMutation = trpc.forum.deletePost.useMutation({
    onSuccess: () => {
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const toggleLikeMutation = trpc.forum.toggleLike.useMutation({
    onSuccess: () => {
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const togglePinMutation = trpc.forum.togglePinThread.useMutation({
    onSuccess: () => {
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const toggleLockMutation = trpc.forum.toggleLockThread.useMutation({
    onSuccess: () => {
      utils.forum.thread.invalidate({ id: threadId });
    },
  });

  const handleReply = async () => {
    if (!replyContent.trim() || !user) return;
    await createPostMutation.mutateAsync({
      threadId,
      content: replyContent,
    });
  };

  const handleEditPost = async (postId: number) => {
    if (!editContent.trim()) return;
    await editPostMutation.mutateAsync({ postId, content: editContent });
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm(language === "en" ? "Delete this post?" : "Supprimer ce message?")) return;
    await deletePostMutation.mutateAsync({ postId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p>{language === "en" ? "Thread not found" : "Discussion introuvable"}</p>
        <Link href="/community">
          <Button variant="outline" className="border-teal-400 text-teal-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Back to Community" : "Retour à la communauté"}
          </Button>
        </Link>
      </div>
    );
  }

  const { thread, posts } = data;
  const isAdmin = user?.role === "admin";
  const isAuthor = user?.id === thread.authorId;

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

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    <Pin className="w-3 h-3" /> {language === "en" ? "Pinned" : "Épinglé"}
                  </span>
                )}
                {thread.isLocked && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                    <Lock className="w-3 h-3" /> {language === "en" ? "Locked" : "Verrouillé"}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-3">{thread.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  {thread.authorAvatar ? (
                    <img src={thread.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-teal-400/20 flex items-center justify-center text-xs font-bold text-teal-400">
                      {(thread.authorName || "?")[0]}
                    </div>
                  )}
                  <span className="font-medium text-white/80">{thread.authorName || "Anonymous"}</span>
                </div>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatRelativeTime(thread.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {thread.viewCount}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {thread.replyCount}</span>
              </div>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePinMutation.mutate({ threadId })}
                  className="text-white/60 hover:text-amber-400"
                  title={thread.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLockMutation.mutate({ threadId })}
                  className="text-white/60 hover:text-red-400"
                  title={thread.isLocked ? "Unlock" : "Lock"}
                >
                  {thread.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thread content */}
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Original post content */}
        {thread.content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white dark:bg-background/5 border border-white/10 mb-8"
          >
            <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{thread.content}</p>
          </motion.div>
        )}

        {/* Replies */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            {posts.length} {language === "en" ? (posts.length === 1 ? "Reply" : "Replies") : (posts.length === 1 ? "Réponse" : "Réponses")}
          </h2>

          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-xl bg-white dark:bg-background/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center text-sm font-bold text-teal-400">
                          {(post.authorName || "?")[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-white/90">{post.authorName || "Anonymous"}</span>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{formatRelativeTime(post.createdAt)}</span>
                          {post.isEdited && <span className="italic">{language === "en" ? "(edited)" : "(modifié)"}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Post actions */}
                    {user && (post.authorId === user.id || isAdmin) && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowActions(showActions === post.id ? null : post.id)}
                          className="text-white/40 hover:text-white/80 h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {showActions === post.id && (
                          <div className="absolute right-0 top-8 z-10 bg-[#1A2A44] border border-white/10 rounded-lg shadow-xl py-1 min-w-[140px]">
                            {post.authorId === user.id && (
                              <button
                                onClick={() => {
                                  setEditingPostId(post.id);
                                  setEditContent(post.content || "");
                                  setShowActions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white dark:bg-background/5 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> {language === "en" ? "Edit" : "Modifier"}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDeletePost(post.id);
                                setShowActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white dark:bg-background/5 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> {language === "en" ? "Delete" : "Supprimer"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post content or edit form */}
                  {editingPostId === post.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-background/5 border border-white/20 focus:border-teal-400 focus:outline-none text-white resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingPostId(null); setEditContent(""); }}
                          className="text-white/60"
                        >
                          <X className="w-4 h-4 mr-1" /> {language === "en" ? "Cancel" : "Annuler"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditPost(post.id)}
                          disabled={editPostMutation.isPending}
                          className="bg-teal-400 text-black dark:text-foreground hover:bg-teal-400/90"
                        >
                          {editPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                          {language === "en" ? "Save" : "Enregistrer"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  )}

                  {/* Like button */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => user && toggleLikeMutation.mutate({ postId: post.id })}
                      className="flex items-center gap-1.5 text-sm text-white/50 hover:text-teal-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likeCount || 0}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>{language === "en" ? "No replies yet. Be the first to respond!" : "Aucune réponse encore. Soyez le premier à répondre!"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reply form */}
        {!thread.isLocked ? (
          user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white dark:bg-background/5 border border-white/10"
            >
              <h3 className="font-bold mb-3">
                {language === "en" ? "Write a Reply" : "Écrire une réponse"}
              </h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={language === "en" ? "Share your thoughts..." : "Partagez vos pensées..."}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-background/5 border border-white/20 focus:border-teal-400 focus:outline-none text-white placeholder-white/40 resize-none mb-3"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || createPostMutation.isPending}
                  className="bg-teal-400 text-black dark:text-foreground hover:bg-teal-400/90 font-bold"
                >
                  {createPostMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {language === "en" ? "Post Reply" : "Publier la réponse"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-background/5 border border-white/10 text-center">
              <p className="text-white/60 mb-3">
                {language === "en" ? "Sign in to join the discussion" : "Connectez-vous pour participer à la discussion"}
              </p>
              <a href={getLoginUrl()}>
                <Button className="bg-teal-400 text-black dark:text-foreground hover:bg-teal-400/90 font-bold">
                  {language === "en" ? "Sign In" : "Se connecter"}
                </Button>
              </a>
            </div>
          )
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-background/5 border border-red-400/20 text-center">
            <Lock className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-white/60">
              {language === "en" ? "This thread is locked. No new replies can be posted." : "Cette discussion est verrouillée. Aucune nouvelle réponse ne peut être publiée."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
