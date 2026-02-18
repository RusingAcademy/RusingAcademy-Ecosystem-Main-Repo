import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";
import {
  X,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Link2,
  Loader2,
  ChevronDown,
  Sparkles,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateThread } from "@/hooks/useCommunityData";
import GifPicker from "@/components/GifPicker";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "article" | "podcast" | "exercise" | "question";
}

const contentTypes = [
  { id: "article" as const, label: "Article", emoji: "📝" },
  { id: "podcast" as const, label: "Podcast", emoji: "🎙️" },
  { id: "exercise" as const, label: "Exercise", emoji: "✏️" },
  { id: "question" as const, label: "Question", emoji: "❓" },
];

const categories = [
  { id: 1, name: "French Learning" },
  { id: 2, name: "English Learning" },
  { id: 3, name: "Exam Preparation" },
  { id: 4, name: "General Discussion" },
  { id: 5, name: "Tips & Resources" },
];

export default function CreatePostDialog({
  isOpen,
  onClose,
  defaultType = "article",
}: CreatePostDialogProps) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"article" | "podcast" | "exercise" | "question">(defaultType);
  const [categoryId, setCategoryId] = useState(1);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createThread = useCreateThread();

  const handleImageUpload = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      const base64 = await fileToBase64(file);
      const response = await fetch("/api/upload/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          data: base64,
          contentType: file.type,
          filename: file.name,
        }),
      });

      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      setThumbnailUrl(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
      setThumbnailPreview("");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) + prefix + selected + suffix + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleGifSelect = (url: string) => {
    setGifUrl(url);
    setThumbnailUrl("");
    setThumbnailPreview("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (content.trim().length < 10 && !gifUrl) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    try {
      const finalContent = gifUrl
        ? `${content.trim()}\n\n![GIF](${gifUrl})`
        : content.trim();

      await createThread.mutateAsync({
        title: title.trim(),
        content: finalContent,
        contentType,
        categoryId,
        thumbnailUrl: thumbnailUrl || gifUrl || undefined,
      });

      toast.success("Post published!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setContentType("article");
    setCategoryId(1);
    setThumbnailUrl("");
    setThumbnailPreview("");
    setGifUrl("");
    setShowGifPicker(false);
  };

  const handleClose = () => {
    if (title.trim() || content.trim() || gifUrl) {
      if (!confirm("Discard this post?")) return;
    }
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — Premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(25, 37, 36, 0.6)", backdropFilter: "blur(8px)" }}
            onClick={handleClose}
          />

          {/* Dialog — Premium glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-[640px] sm:max-h-[85vh] rounded-2xl z-50 flex flex-col overflow-hidden"
            style={{
              background: "var(--card, white)",
              border: "1px solid rgba(60, 87, 89, 0.12)",
              boxShadow: "0 24px 80px rgba(25, 37, 36, 0.2), 0 8px 24px rgba(25, 37, 36, 0.1)",
            }}
          >
            {/* Header — Premium */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(60, 87, 89, 0.08)" }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" style={{ color: "#17E2C6" }} aria-hidden="true" />
                <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Create Post</h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                className="p-2 rounded-full transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Post Type & Category Row */}
              <div className="flex gap-3">
                {/* Post Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ border: "1px solid rgba(60, 87, 89, 0.12)", color: "var(--foreground)" }}
                  >
                    <span>{contentTypes.find((t) => t.id === contentType)?.emoji}</span>
                    <span>{contentTypes.find((t) => t.id === contentType)?.label}</span>
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} aria-hidden="true" />
                  </button>
                  {showTypeDropdown && (
                    <div
                      className="absolute top-full left-0 mt-1 rounded-xl py-1 min-w-[160px] z-10"
                      style={{
                        background: "var(--card, white)",
                        border: "1px solid rgba(60, 87, 89, 0.12)",
                        boxShadow: "0 8px 32px rgba(25, 37, 36, 0.12)",
                      }}
                    >
                      {contentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setContentType(type.id);
                            setShowTypeDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{
                            color: contentType === type.id ? "#3C5759" : "var(--foreground)",
                            fontWeight: contentType === type.id ? 600 : 400,
                          }}
                        >
                          <span>{type.emoji}</span>
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Dropdown */}
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-transparent transition-all focus:outline-none"
                  style={{ border: "1px solid rgba(60, 87, 89, 0.12)", color: "var(--foreground)" }}
                  aria-label="Select category"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <input
                type="text"
                placeholder="Give your post a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-bold bg-transparent outline-none py-2 transition-colors"
                style={{
                  color: "var(--foreground)",
                  borderBottom: "1px solid transparent",
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(23, 226, 198, 0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; }}
                maxLength={255}
              />

              {/* Formatting Toolbar — Premium styled */}
              <div
                className="flex items-center gap-1 py-1"
                style={{ borderBottom: "1px solid rgba(60, 87, 89, 0.06)" }}
              >
                <button
                  onClick={() => insertFormatting("**", "**")}
                  className="p-2 rounded-lg transition-colors"
                  title="Bold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Bold className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => insertFormatting("*", "*")}
                  className="p-2 rounded-lg transition-colors"
                  title="Italic"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Italic className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => insertFormatting("\n- ")}
                  className="p-2 rounded-lg transition-colors"
                  title="List"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <List className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => insertFormatting("[", "](url)")}
                  className="p-2 rounded-lg transition-colors"
                  title="Link"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Link2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <div className="w-px h-5 mx-1" style={{ background: "rgba(60, 87, 89, 0.1)" }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg transition-colors"
                  title="Add image"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                </button>
                {/* GIF button */}
                <div className="relative">
                  <button
                    onClick={() => setShowGifPicker(!showGifPicker)}
                    className="p-2 rounded-lg transition-colors"
                    title="Add GIF"
                    style={{
                      background: showGifPicker ? "rgba(60, 87, 89, 0.08)" : "transparent",
                      color: showGifPicker ? "#3C5759" : "var(--muted-foreground)",
                    }}
                  >
                    <span className="text-sm font-bold leading-none" style={{ fontFamily: "monospace" }}>
                      GIF
                    </span>
                  </button>
                  <GifPicker
                    isOpen={showGifPicker}
                    onClose={() => setShowGifPicker(false)}
                    onSelect={handleGifSelect}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Content Textarea */}
              <textarea
                ref={textareaRef}
                placeholder="Share your thoughts, knowledge, or questions with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] text-sm bg-transparent outline-none resize-none leading-relaxed focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  color: "var(--foreground)",
                  "--tw-ring-color": "rgba(23, 226, 198, 0.3)",
                } as React.CSSProperties}
              />

              {/* GIF Preview */}
              {gifUrl && (
                <div className="relative">
                  <img
                    src={gifUrl}
                    alt="Selected GIF"
                    className="w-full max-h-[200px] object-contain rounded-xl"
                    style={{ border: "1px solid rgba(60, 87, 89, 0.1)", background: "rgba(60, 87, 89, 0.02)" }}
                  />
                  <button
                    onClick={() => setGifUrl("")}
                    className="absolute top-2 right-2 p-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(25, 37, 36, 0.6)" }}
                    aria-label="Remove GIF"
                  >
                    <X className="w-4 h-4 text-white" aria-hidden="true" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md" style={{ background: "rgba(25, 37, 36, 0.5)" }}>
                    <span className="text-[10px] text-white font-bold">GIF</span>
                  </div>
                </div>
              )}

              {/* Thumbnail Preview */}
              {thumbnailPreview && !gifUrl && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-[200px] object-cover rounded-xl"
                    style={{ border: "1px solid rgba(60, 87, 89, 0.1)" }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ background: "rgba(25, 37, 36, 0.4)" }}>
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setThumbnailPreview("");
                      setThumbnailUrl("");
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(25, 37, 36, 0.6)" }}
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-white" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Character count */}
              <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
                <span>
                  {content.length} characters
                  {gifUrl && " + GIF"}
                </span>
                <span>{title.length}/255 title</span>
              </div>
            </div>

            {/* Footer — Premium */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderTop: "1px solid rgba(60, 87, 89, 0.08)", background: "rgba(60, 87, 89, 0.02)" }}
            >
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmit}
                disabled={
                  createThread.isPending ||
                  !title.trim() ||
                  (content.trim().length < 10 && !gifUrl) ||
                  isUploading
                }
                className="rounded-full px-6 py-2.5 font-semibold text-sm text-white disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #3C5759, #4A6B6D)",
                  boxShadow: "0 4px 12px rgba(60, 87, 89, 0.25)",
                }}
              >
                {createThread.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
