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
      <div className="min-h-screen flex items-center justify-center dark-page" style={{ background: "linear-gradient(135deg, #0d1a19 0%, #0f2028 40%, #0a1628 100%)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#17E2C6" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white dark-page" style={{ background: "linear-gradient(135deg, #0d1a19 0%, #0f2028 40%, #0a1628 100%)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255, 107, 107, 0.08)" }}>
          <AlertCircle className="w-8 h-8" style={{ color: "#FF6B6B" }} aria-hidden="true" />
        </div>
        <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>{language === "en" ? "Thread not found" : "Discussion introuvable"}</p>
        <Link href="/community">
          <Button variant="outline" className="community-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
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
    <div className="min-h-screen text-white dark-page" style={{ background: "linear-gradient(135deg, #0d1a19 0%, #0f2028 40%, #0a1628 100%)" }}>
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

          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* Status badges */}
              <div className="flex items-center gap-2 mb-3">
                {thread.isPinned && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(212, 175, 55, 0.1)", color: "#D4AF37", border: "1px solid rgba(212, 175, 55, 0.2)" }}
                  >
                    <Pin className="w-3 h-3" aria-hidden="true" /> {language === "en" ? "Pinned" : "Épinglé"}
                  </span>
                )}
                {thread.isLocked && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255, 107, 107, 0.1)", color: "#FF6B6B", border: "1px solid rgba(255, 107, 107, 0.2)" }}
                  >
                    <Lock className="w-3 h-3" aria-hidden="true" /> {language === "en" ? "Locked" : "Verrouillé"}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                {thread.title}
              </h1>

              <div className="flex items-center gap-4 text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                <div className="flex items-center gap-2">
                  {thread.authorAvatar ? (
                    <img src={thread.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(23, 226, 198, 0.12)", color: "#17E2C6" }}
                    >
                      {(thread.authorName || "?")[0]}
                    </div>
                  )}
                  <span className="font-medium" style={{ color: "rgba(255, 255, 255, 0.75)" }}>{thread.authorName || "Anonymous"}</span>
                </div>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {formatRelativeTime(thread.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" aria-hidden="true" /> {thread.viewCount}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> {thread.replyCount}</span>
              </div>
            </div>

            {/* Admin actions — Premium styled */}
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePinMutation.mutate({ threadId })}
                  title={thread.isPinned ? "Unpin" : "Pin"}
                  className="transition-all"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  <Pin className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLockMutation.mutate({ threadId })}
                  title={thread.isLocked ? "Unlock" : "Lock"}
                  className="transition-all"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  {thread.isLocked ? <Unlock className="w-4 h-4" aria-hidden="true" /> : <Lock className="w-4 h-4" aria-hidden="true" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thread content */}
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Original post content — Premium glassmorphism */}
        {thread.content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl mb-8"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(60, 87, 89, 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.85)" }}>{thread.content}</p>
          </motion.div>
        )}

        {/* Replies */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            <MessageSquare className="w-5 h-5" style={{ color: "#17E2C6" }} aria-hidden="true" />
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
                  className="p-5 rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(60, 87, 89, 0.12)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt="" className="w-9 h-9 rounded-full" />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: "rgba(23, 226, 198, 0.1)", color: "#17E2C6" }}
                        >
                          {(post.authorName || "?")[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium" style={{ color: "rgba(255, 255, 255, 0.85)" }}>{post.authorName || "Anonymous"}</span>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
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
                          className="h-8 w-8 p-0 transition-all"
                          style={{ color: "rgba(255, 255, 255, 0.35)" }}
                          aria-label={language === "en" ? "Post actions" : "Actions du message"}
                        >
                          <MoreVertical className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        {showActions === post.id && (
                          <div
                            className="absolute right-0 top-full mt-1 rounded-xl py-1 z-10 min-w-[140px]"
                            style={{
                              background: "rgba(25, 37, 36, 0.95)",
                              border: "1px solid rgba(60, 87, 89, 0.2)",
                              backdropFilter: "blur(20px)",
                              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            {post.authorId === user.id && (
                              <button
                                onClick={() => {
                                  setEditingPostId(post.id);
                                  setEditContent(post.content || "");
                                  setShowActions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                                style={{ color: "rgba(255, 255, 255, 0.75)" }}
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" /> {language === "en" ? "Edit" : "Modifier"}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDeletePost(post.id);
                                setShowActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors"
                              style={{ color: "#FF6B6B" }}
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> {language === "en" ? "Delete" : "Supprimer"}
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
                        className="community-input resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingPostId(null); setEditContent(""); }}
                          style={{ color: "rgba(255, 255, 255, 0.5)" }}
                        >
                          <X className="w-4 h-4 mr-1" aria-hidden="true" /> {language === "en" ? "Cancel" : "Annuler"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditPost(post.id)}
                          disabled={editPostMutation.isPending}
                          className="community-btn-primary text-sm disabled:opacity-50"
                        >
                          {editPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />}
                          {language === "en" ? "Save" : "Enregistrer"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.75)" }}>{post.content}</p>
                  )}

                  {/* Like button — Premium styled */}
                  <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(60, 87, 89, 0.08)" }}>
                    <button
                      onClick={() => user && toggleLikeMutation.mutate({ postId: post.id })}
                      className="flex items-center gap-1.5 text-sm transition-colors"
                      style={{ color: "rgba(255, 255, 255, 0.4)" }}
                      aria-label={language === "en" ? `Like (${post.likeCount || 0})` : `Aimer (${post.likeCount || 0})`}
                    >
                      <Heart className="w-4 h-4" aria-hidden="true" />
                      <span>{post.likeCount || 0}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
                  <MessageSquare className="w-7 h-7" style={{ color: "rgba(255, 255, 255, 0.25)" }} aria-hidden="true" />
                </div>
                <p style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                  {language === "en" ? "No replies yet. Be the first to respond!" : "Aucune réponse encore. Soyez le premier à répondre!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reply form — Premium glassmorphism */}
        {!thread.isLocked ? (
          user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(60, 87, 89, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h3 className="font-bold mb-3" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                {language === "en" ? "Write a Reply" : "Écrire une réponse"}
              </h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={language === "en" ? "Share your thoughts..." : "Partagez vos pensées..."}
                className="community-input resize-none mb-3"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || createPostMutation.isPending}
                  className="community-btn-primary text-sm font-bold disabled:opacity-50"
                >
                  {createPostMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  {language === "en" ? "Post Reply" : "Publier la réponse"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(60, 87, 89, 0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="mb-3" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                {language === "en" ? "Sign in to join the discussion" : "Connectez-vous pour participer à la discussion"}
              </p>
              <a href={getLoginUrl()}>
                <Button className="community-btn-primary text-sm font-bold">
                  {language === "en" ? "Sign In" : "Se connecter"}
                </Button>
              </a>
            </div>
          )
        ) : (
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "rgba(255, 107, 107, 0.04)",
              border: "1px solid rgba(255, 107, 107, 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: "#FF6B6B" }} aria-hidden="true" />
            <p style={{ color: "rgba(255, 255, 255, 0.55)" }}>
              {language === "en" ? "This thread is locked. No new replies can be posted." : "Cette discussion est verrouillée. Aucune nouvelle réponse ne peut être publiée."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
