/**
 * ActivityViewer — Premium 7-Slot Navigation + Activity Renderer
 * 
 * Displays activities within a lesson using the canonical 7-slot structure:
 * 1. Introduction  2. Video  3. Grammar  4. Written Practice
 * 5. Oral Practice  6. Quiz  7. Coaching Tip  + Extra activities
 * 
 * Features:
 * - Horizontal slot navigation bar with color-coded icons
 * - One-activity-at-a-time rendering (Kajabi-style)
 * - Progress tracking per slot with checkmarks
 * - Premium glassmorphism and micro-animations
 * - Bilingual EN/FR support
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RichTextRenderer } from "@/components/RichTextEditor";
import {
  Video, FileText, Headphones, HelpCircle, ClipboardList, FileDown,
  Radio, Code2, Play, Puzzle, MessageSquare, CheckCircle2, Circle,
  ChevronRight, ChevronLeft, Clock, Award, Lock, Download, ExternalLink,
  Loader2, Lightbulb, PenTool, Mic, BookOpen, Sparkles, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { BunnyStreamPlayer } from "@/components/BunnyStreamPlayer";
import { marked } from "marked";
import QuizRenderer, { parseQuizFromContent } from "@/components/QuizRenderer";

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Helper to render markdown content to HTML
function renderMarkdown(content: string): string {
  try {
    // If content already looks like HTML (has tags), return as-is
    if (/<[a-z][\s\S]*>/i.test(content) && !content.startsWith('#') && !content.startsWith('**')) {
      return content;
    }
    
    // Pre-process: if content is a single line, re-insert newlines
    // before markdown headings, numbered lists, and structural markers
    let processed = content;
    if (!content.includes('\n') || content.split('\n').length < 3) {
      // Insert double newlines before headings (##, ###, etc.)
      processed = processed.replace(/\s(#{1,6})\s/g, '\n\n$1 ');
      // Insert newlines before numbered list items (1. 2. 3. etc.)
      processed = processed.replace(/\s(\d+\.)\s/g, '\n$1 ');
      // Insert newlines before bold markers that start a new concept
      processed = processed.replace(/\s(\*\*[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ])/g, '\n\n$1');
      // Insert newlines before blockquote markers
      processed = processed.replace(/\s(>\s)/g, '\n\n$1');
      // Insert newlines before horizontal rules
      processed = processed.replace(/\s(---)\s/g, '\n\n$1\n\n');
      // Insert newlines before table rows
      processed = processed.replace(/\s(\|\s)/g, '\n$1');
      // Insert newlines before "Corrigé" or "Exercice" sections
      processed = processed.replace(/\s(\*\*Corrigé)/g, '\n\n$1');
      processed = processed.replace(/\s(\*\*Exercice)/g, '\n\n$1');
    }
    
    return marked.parse(processed) as string;
  } catch {
    return content;
  }
}

// ─── Slot Configuration ───
const SLOT_CONFIG = [
  { index: 1, type: "introduction", label: "Introduction", labelFr: "Introduction", icon: BookOpen, color: "#0F3D3E", bg: "rgba(15,61,62,0.12)" },
  { index: 2, type: "video", label: "Video", labelFr: "Vidéo", icon: Video, color: "#C65A1E", bg: "rgba(198,90,30,0.12)" },
  { index: 3, type: "grammar", label: "Grammar", labelFr: "Grammaire", icon: PenTool, color: "#1E6B4F", bg: "rgba(30,107,79,0.12)" },
  { index: 4, type: "written_practice", label: "Written", labelFr: "Écrit", icon: FileText, color: "#2563EB", bg: "rgba(37,99,235,0.12)" },
  { index: 5, type: "oral_practice", label: "Oral", labelFr: "Oral", icon: Mic, color: "#DC2626", bg: "rgba(220,38,38,0.12)" },
  { index: 6, type: "quiz", label: "Quiz", labelFr: "Quiz", icon: HelpCircle, color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  { index: 7, type: "coaching_tip", label: "Coach Tip", labelFr: "Conseil", icon: Sparkles, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
];

// Activity type icon mapping (for content rendering)
const activityTypeIcon: Record<string, any> = {
  video: Video, text: FileText, audio: Headphones, quiz: HelpCircle,
  assignment: ClipboardList, download: FileDown, live_session: Radio,
  embed: Code2, speaking_exercise: Play, fill_blank: Puzzle,
  matching: Puzzle, discussion: MessageSquare,
};

// Helper to extract YouTube ID
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || url;
}

// Helper to extract Vimeo ID
function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] || url;
}

interface ActivityViewerProps {
  lessonId: number;
  isEnrolled: boolean;
  language?: string;
}

export default function ActivityViewer({ lessonId, isEnrolled, language = "en" }: ActivityViewerProps) {
  const isEn = language === "en";
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(1);

  // Fetch activities for this lesson
  const { data: activitiesList, isLoading, refetch } = trpc.activities.getByLesson.useQuery(
    { lessonId },
    { enabled: !!lessonId }
  );

  // Fetch full activity content for the active slot
  const activeActivity = useMemo(() => {
    if (!activitiesList) return null;
    return activitiesList.find((a: any) => a.slotIndex === activeSlotIndex) || null;
  }, [activitiesList, activeSlotIndex]);

  // Fetch full content for active activity
  const { data: fullActivity, isLoading: activityLoading } = trpc.activities.getById.useQuery(
    { activityId: activeActivity?.id || 0 },
    { enabled: !!activeActivity?.id }
  );

  // Build slot map: which slots are filled
  const slotMap = useMemo(() => {
    const map: Record<number, any> = {};
    if (activitiesList) {
      activitiesList.forEach((a: any) => {
        if (a.slotIndex) map[a.slotIndex] = a;
      });
    }
    return map;
  }, [activitiesList]);

  // Extra activities (slotIndex > 7)
  const extraActivities = useMemo(() => {
    if (!activitiesList) return [];
    return activitiesList.filter((a: any) => a.slotIndex && a.slotIndex > 7)
      .sort((a: any, b: any) => a.slotIndex - b.slotIndex);
  }, [activitiesList]);

  // Progress calculation
  const filledSlots = useMemo(() => {
    return SLOT_CONFIG.filter(s => slotMap[s.index]).length;
  }, [slotMap]);

  const progressPercent = Math.round((filledSlots / 7) * 100);

  // Mutations
  const startActivity = trpc.activities.startActivity.useMutation({
    onError: (e: any) => console.error("Start activity error:", e.message),
  });
  const completeActivity = trpc.activities.completeActivity.useMutation({
    onSuccess: () => {
      toast.success(isEn ? "Activity completed!" : "Activité terminée !");
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Auto-start activity when navigating to a slot
  useEffect(() => {
    if (activeActivity?.id && isEnrolled) {
      startActivity.mutate({ activityId: activeActivity.id });
    }
  }, [activeActivity?.id]);

  // Navigation handlers
  const goToSlot = useCallback((index: number) => {
    setActiveSlotIndex(index);
  }, []);

  const goNext = useCallback(() => {
    // Find next filled slot
    const allSlotIndices = Object.keys(slotMap).map(Number).sort((a, b) => a - b);
    const currentPos = allSlotIndices.indexOf(activeSlotIndex);
    if (currentPos < allSlotIndices.length - 1) {
      setActiveSlotIndex(allSlotIndices[currentPos + 1]);
    }
  }, [slotMap, activeSlotIndex]);

  const goPrev = useCallback(() => {
    const allSlotIndices = Object.keys(slotMap).map(Number).sort((a, b) => a - b);
    const currentPos = allSlotIndices.indexOf(activeSlotIndex);
    if (currentPos > 0) {
      setActiveSlotIndex(allSlotIndices[currentPos - 1]);
    }
  }, [slotMap, activeSlotIndex]);

  const handleComplete = useCallback(() => {
    if (activeActivity?.id) {
      completeActivity.mutate({ activityId: activeActivity.id });
    }
  }, [activeActivity?.id]);

  // Find prev/next for navigation buttons
  const allSlotIndices = useMemo(() => {
    return Object.keys(slotMap).map(Number).sort((a, b) => a - b);
  }, [slotMap]);
  const currentPos = allSlotIndices.indexOf(activeSlotIndex);
  const hasPrev = currentPos > 0;
  const hasNext = currentPos < allSlotIndices.length - 1;

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">{isEn ? "Loading lesson activities..." : "Chargement des activités..."}</span>
      </div>
    );
  }

  if (!activitiesList || activitiesList.length === 0) {
    return null;
  }

  // Get current slot config
  const currentSlotConfig = SLOT_CONFIG.find(s => s.index === activeSlotIndex);

  return (
    <div className="mt-2">
      {/* ─── 7-Slot Navigation Bar ─── */}
      <div className="relative mb-6">
        {/* Progress bar behind slots */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-[#0F3D3E] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${progressPercent}%`, maxWidth: 'calc(100% - 2rem)' }}
        />

        {/* Slot Pills */}
        <div className="relative z-10 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {SLOT_CONFIG.map((slot) => {
            const isFilled = !!slotMap[slot.index];
            const isActive = activeSlotIndex === slot.index;
            const Icon = slot.icon;

            return (
              <button
                key={slot.index}
                onClick={() => isFilled && goToSlot(slot.index)}
                disabled={!isFilled}
                className={`
                  group relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'scale-105' 
                    : isFilled 
                      ? 'hover:scale-102 cursor-pointer' 
                      : 'opacity-40 cursor-not-allowed'
                  }
                `}
                title={isEn ? slot.label : slot.labelFr}
              >
                {/* Slot Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                    ${isActive
                      ? 'shadow-lg shadow-[var(--slot-color)]/20'
                      : ''
                    }
                  `}
                  style={{
                    '--slot-color': slot.color,
                    backgroundColor: isActive ? slot.color : isFilled ? slot.bg : 'transparent',
                    borderColor: isActive ? slot.color : isFilled ? slot.color : 'var(--border)',
                    color: isActive ? 'white' : isFilled ? slot.color : 'var(--muted-foreground)',
                  } as React.CSSProperties}
                >
                  {isFilled ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{slot.index}</span>
                  )}
                </div>

                {/* Slot Label */}
                <span className={`
                  text-[10px] font-medium leading-tight text-center max-w-[60px] truncate
                  ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {isEn ? slot.label : slot.labelFr}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeSlotIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: slot.color }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          {/* Extra Activities Indicator */}
          {extraActivities.length > 0 && (
            <button
              onClick={() => goToSlot(extraActivities[0].slotIndex)}
              className={`
                group relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300
                ${activeSlotIndex > 7 ? 'scale-105' : 'hover:scale-102 cursor-pointer'}
              `}
              title={isEn ? `${extraActivities.length} Extra` : `${extraActivities.length} Supplémentaires`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                ${activeSlotIndex > 7 
                  ? 'bg-[#0F3D3E] border-[#0F3D3E] text-white shadow-lg' 
                  : 'bg-[#0F3D3E]/10 border-[#0F3D3E] text-[#0F3D3E]'
                }
              `}>
                <Plus className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-medium ${activeSlotIndex > 7 ? 'text-foreground' : 'text-muted-foreground'}`}>
                +{extraActivities.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Active Activity Content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlotIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeActivity ? (
            <Card className="overflow-hidden border-0 shadow-md">
              {/* Activity Header with Slot Color */}
              <div 
                className="px-5 py-4 flex items-center gap-3"
                style={{ 
                  background: currentSlotConfig 
                    ? `linear-gradient(135deg, ${currentSlotConfig.bg}, transparent)` 
                    : undefined 
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: currentSlotConfig?.color || '#0F3D3E',
                    color: 'white'
                  }}
                >
                  {currentSlotConfig ? (
                    <currentSlotConfig.icon className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1.5 py-0 border-current"
                      style={{ color: currentSlotConfig?.color || '#0F3D3E' }}
                    >
                      {currentSlotConfig 
                        ? `Slot ${currentSlotConfig.index}` 
                        : `Extra ${activeSlotIndex - 7}`
                      }
                    </Badge>
                    {activeActivity.estimatedMinutes && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {activeActivity.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base truncate">
                    {isEn ? activeActivity.title : (activeActivity.titleFr || activeActivity.title)}
                  </h3>
                </div>
              </div>

              <Separator />

              {/* Activity Content */}
              <CardContent className="p-0">
                {activityLoading ? (
                  <div className="flex items-center gap-2 py-12 justify-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">{isEn ? "Loading content..." : "Chargement du contenu..."}</span>
                  </div>
                ) : fullActivity ? (
                  <div className="p-5">
                    <ActivityContent
                      activity={fullActivity}
                      language={language}
                      onComplete={handleComplete}
                      isCompleting={completeActivity.isPending}
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{isEn ? "Content not available yet." : "Contenu pas encore disponible."}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <div className="text-muted-foreground">
                {currentSlotConfig ? (
                  <>
                    <currentSlotConfig.icon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium mb-1">
                      {isEn ? `${currentSlotConfig.label} — Coming Soon` : `${currentSlotConfig.labelFr} — Bientôt disponible`}
                    </p>
                    <p className="text-sm opacity-70">
                      {isEn ? "This activity is being prepared." : "Cette activité est en préparation."}
                    </p>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{isEn ? "No activity found for this slot." : "Aucune activité trouvée pour ce créneau."}</p>
                  </>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Bottom Navigation ─── */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={!hasPrev}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {isEn ? "Previous" : "Précédent"}
        </Button>

        <div className="flex items-center gap-1.5">
          {allSlotIndices.map((idx) => (
            <button
              key={idx}
              onClick={() => goToSlot(idx)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${idx === activeSlotIndex 
                  ? 'w-6 bg-[#0F3D3E]' 
                  : 'bg-border hover:bg-muted-foreground'
                }
              `}
              aria-label={`Go to slot ${idx}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={!hasNext}
          className="gap-1"
        >
          {isEn ? "Next" : "Suivant"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Activity Content Renderer ───
function ActivityContent({
  activity,
  language,
  onComplete,
  isCompleting,
}: {
  activity: any;
  language: string;
  onComplete: () => void;
  isCompleting: boolean;
}) {
  const isEn = language === "en";

  return (
    <div className="space-y-4">
      {/* Description */}
      {activity.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isEn ? activity.description : (activity.descriptionFr || activity.description)}
        </p>
      )}

      {/* Video Content */}
      {activity.activityType === "video" && (
        <div>
          {activity.videoUrl ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
              {activity.videoProvider === "bunny" ? (
                <BunnyStreamPlayer
                  videoId={activity.videoUrl}
                  title={activity.title}
                />
              ) : activity.videoProvider === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(activity.videoUrl)}?rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activity.title}
                />
              ) : activity.videoProvider === "vimeo" ? (
                <iframe
                  src={`https://player.vimeo.com/video/${extractVimeoId(activity.videoUrl)}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={activity.title}
                />
              ) : (
                <video
                  src={activity.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={activity.thumbnailUrl || undefined}
                >
                  <track kind="captions" />
                </video>
              )}
            </div>
          ) : (
            /* Video Storyboard/Script placeholder when no actual video URL */
            <div className="rounded-xl overflow-hidden border border-[#C65A1E]/20">
              <div className="bg-gradient-to-r from-[#C65A1E]/10 to-[#C65A1E]/5 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C65A1E]/15 flex items-center justify-center">
                  <Video className="h-5 w-5 text-[#C65A1E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#C65A1E]">
                    {isEn ? "Video Scenario — Script" : "Scénario Vidéo — Script"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isEn ? "Read the scenario below. Video production coming soon." : "Lisez le scénario ci-dessous. Production vidéo à venir."}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Always show text content for video activities (storyboard/script) */}
          {activity.content && (
            <div className="mt-4">
              {activity.contentJson ? (
                <RichTextRenderer contentJson={isEn ? activity.contentJson : (activity.contentJsonFr || activity.contentJson)} />
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-table:text-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(isEn ? activity.content : (activity.contentFr || activity.content)) }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Interactive Quiz Renderer */}
      {activity.activityType === "quiz" && activity.content && parseQuizFromContent(activity.content) ? (
        <QuizRenderer
          content={isEn ? activity.content : (activity.contentFr || activity.content)}
          language={language}
          onComplete={onComplete}
        />
      ) : null}

      {/* Text / Rich Text Content (non-quiz, non-video, non-audio) */}
      {(activity.activityType === "text" || 
        (activity.activityType === "quiz" && !(activity.content && parseQuizFromContent(activity.content))) ||
        activity.activityType === "assignment" || activity.activityType === "speaking_exercise" ||
        activity.activityType === "fill_blank" || activity.activityType === "matching" ||
        activity.activityType === "discussion") && (
        <div>
          {activity.contentJson ? (
            <RichTextRenderer contentJson={isEn ? activity.contentJson : (activity.contentJsonFr || activity.contentJson)} />
          ) : activity.content ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-table:text-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(isEn ? activity.content : (activity.contentFr || activity.content)) }}
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {isEn ? "No content available yet." : "Aucun contenu disponible pour le moment."}
            </p>
          )}
        </div>
      )}

      {/* Audio Content — Oral Practice with pronunciation guide */}
      {activity.activityType === "audio" && (
        <div className="space-y-4">
          {/* Audio Player (when audioUrl exists) */}
          {activity.audioUrl && (
            <div className="bg-gradient-to-r from-[#DC2626]/5 to-transparent rounded-xl p-5 border border-[#DC2626]/15">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#DC2626]/10 flex items-center justify-center shadow-sm">
                  <Headphones className="h-6 w-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{isEn ? "Pronunciation Audio" : "Audio de prononciation"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isEn ? "Listen carefully, then practice along" : "Écoutez attentivement, puis pratiquez"}
                  </p>
                </div>
              </div>
              <audio controls className="w-full rounded-lg" src={activity.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Pronunciation Guide / Text Content (always shown for oral practice) */}
          {activity.content && (
            <div>
              {!activity.audioUrl && (
                <div className="bg-gradient-to-r from-[#DC2626]/5 to-transparent rounded-xl px-5 py-3 mb-4 border border-[#DC2626]/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center">
                      <Mic className="h-5 w-5 text-[#DC2626]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#DC2626]">
                        {isEn ? "Oral Practice" : "Pratique Orale"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Follow the pronunciation guide below" : "Suivez le guide de prononciation ci-dessous"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activity.contentJson ? (
                <RichTextRenderer contentJson={isEn ? activity.contentJson : (activity.contentJsonFr || activity.contentJson)} />
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-table:text-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(isEn ? activity.content : (activity.contentFr || activity.content)) }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Download Content */}
      {activity.activityType === "download" && activity.downloadUrl && (
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
          <FileDown className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.downloadFileName || "Download File"}</p>
            <p className="text-xs text-muted-foreground">
              {isEn ? "Click to download" : "Cliquez pour télécharger"}
            </p>
          </div>
          <Button size="sm" asChild>
            <a href={activity.downloadUrl} download={activity.downloadFileName} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              {isEn ? "Download" : "Télécharger"}
            </a>
          </Button>
        </div>
      )}

      {/* Embed Content */}
      {activity.activityType === "embed" && activity.embedCode && (
        <div
          className="rounded-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: activity.embedCode }}
        />
      )}

      {/* Live Session */}
      {activity.activityType === "live_session" && (
        <div className="text-center p-6 bg-muted/30 rounded-xl">
          <Radio className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">
            {isEn ? "Live Session" : "Session en direct"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {isEn ? "Join the live session when it starts" : "Rejoignez la session en direct lorsqu'elle commence"}
          </p>
          {activity.videoUrl && (
            <Button size="sm" asChild>
              <a href={activity.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                {isEn ? "Join Session" : "Rejoindre la session"}
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Complete Button */}
      <div className="flex justify-end pt-3">
        <Button
          size="sm"
          onClick={onComplete}
          disabled={isCompleting}
          className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white gap-1.5"
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isCompleting
            ? (isEn ? "Saving..." : "Enregistrement...")
            : (isEn ? "Mark Complete" : "Marquer comme terminé")}
        </Button>
      </div>
    </div>
  );
}
