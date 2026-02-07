/**
 * ActivityViewer — Renders activities within a lesson in the Learn Portal.
 * 
 * Displays the list of activities for a lesson and allows learners to
 * view content, track progress, and navigate between activities.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RichTextRenderer } from "@/components/RichTextEditor";
import {
  Video, FileText, Headphones, HelpCircle, ClipboardList, FileDown,
  Radio, Code2, Play, Puzzle, MessageSquare, CheckCircle2, Circle,
  ChevronRight, ChevronDown, Clock, Award, Lock, Download, ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Activity type icon mapping
const activityTypeIcon: Record<string, any> = {
  video: Video, text: FileText, audio: Headphones, quiz: HelpCircle,
  assignment: ClipboardList, download: FileDown, live_session: Radio,
  embed: Code2, speaking_exercise: Play, fill_blank: Puzzle,
  matching: Puzzle, discussion: MessageSquare,
};

const activityTypeLabel: Record<string, string> = {
  video: "Video", text: "Text / Article", audio: "Audio", quiz: "Quiz",
  assignment: "Assignment", download: "Download", live_session: "Live Session",
  embed: "Embed", speaking_exercise: "Speaking Exercise", fill_blank: "Fill in the Blank",
  matching: "Matching", discussion: "Discussion",
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
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null);

  // Fetch activities for this lesson
  const { data: activitiesList, isLoading } = trpc.activities.getByLesson.useQuery(
    { lessonId },
    { enabled: !!lessonId }
  );

  // Fetch full activity content when expanded
  const { data: activeActivity, isLoading: activityLoading } = trpc.activities.getById.useQuery(
    { activityId: expandedActivityId! },
    { enabled: !!expandedActivityId }
  );

  // Mutations
  const startActivity = trpc.activities.startActivity.useMutation({
    onError: (e: any) => console.error("Start activity error:", e.message),
  });
  const completeActivity = trpc.activities.completeActivity.useMutation({
    onSuccess: () => {
      toast.success(isEn ? "Activity completed!" : "Activité terminée !");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="p-4 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{isEn ? "Loading activities..." : "Chargement des activités..."}</span>
      </div>
    );
  }

  if (!activitiesList || activitiesList.length === 0) {
    return null; // No activities for this lesson
  }

  const handleExpandActivity = (activityId: number) => {
    if (expandedActivityId === activityId) {
      setExpandedActivityId(null);
    } else {
      setExpandedActivityId(activityId);
      if (isEnrolled) {
        startActivity.mutate({ activityId });
      }
    }
  };

  const handleCompleteActivity = (activityId: number) => {
    completeActivity.mutate({ activityId });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Award className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">
          {isEn ? "Activities" : "Activités"} ({activitiesList.length})
        </h3>
      </div>

      <div className="space-y-2">
        {activitiesList.map((activity: any, index: number) => {
          const Icon = activityTypeIcon[activity.activityType] || FileText;
          const isExpanded = expandedActivityId === activity.id;
          const isLocked = activity.unlockMode !== "immediate" && !activity.isPreview && !isEnrolled;

          return (
            <Card key={activity.id} className="overflow-hidden">
              {/* Activity Header */}
              <button
                onClick={() => !isLocked && handleExpandActivity(activity.id)}
                disabled={isLocked}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activityTypeLabel[activity.activityType] || activity.activityType}</span>
                    {activity.estimatedMinutes && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> {activity.estimatedMinutes} min
                        </span>
                      </>
                    )}
                    {activity.points > 0 && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Award className="h-3 w-3" /> {activity.points} pts
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {activity.isPreview && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {isEn ? "Preview" : "Aperçu"}
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Activity Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Separator />
                    <div className="p-4">
                      {activityLoading ? (
                        <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{isEn ? "Loading..." : "Chargement..."}</span>
                        </div>
                      ) : activeActivity ? (
                        <ActivityContent
                          activity={activeActivity}
                          language={language}
                          onComplete={() => handleCompleteActivity(activeActivity.id)}
                          isCompleting={completeActivity.isPending}
                        />
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
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
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      )}

      {/* Video Content */}
      {activity.activityType === "video" && activity.videoUrl && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {activity.videoProvider === "youtube" ? (
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
      )}

      {/* Text / Rich Text Content */}
      {(activity.activityType === "text" || activity.activityType === "quiz" || 
        activity.activityType === "assignment" || activity.activityType === "speaking_exercise" ||
        activity.activityType === "fill_blank" || activity.activityType === "matching" ||
        activity.activityType === "discussion") && (
        <div>
          {activity.contentJson ? (
            <RichTextRenderer contentJson={activity.contentJson} />
          ) : activity.content ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: activity.content }}
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {isEn ? "No content available yet." : "Aucun contenu disponible pour le moment."}
            </p>
          )}
        </div>
      )}

      {/* Audio Content */}
      {activity.activityType === "audio" && activity.audioUrl && (
        <div className="bg-muted/30 rounded-lg p-4">
          <audio controls className="w-full" src={activity.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Download Content */}
      {activity.activityType === "download" && activity.downloadUrl && (
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
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
          className="rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: activity.embedCode }}
        />
      )}

      {/* Live Session */}
      {activity.activityType === "live_session" && (
        <div className="text-center p-6 bg-muted/30 rounded-lg">
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
      <div className="flex justify-end pt-2">
        <Button
          size="sm"
          onClick={onComplete}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mr-1" />
          )}
          {isCompleting
            ? (isEn ? "Saving..." : "Enregistrement...")
            : (isEn ? "Mark Complete" : "Marquer comme terminé")}
        </Button>
      </div>
    </div>
  );
}
