import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Search, BookOpen, MoreHorizontal, Edit, Copy, Trash2, Eye, EyeOff,
  GripVertical, ChevronDown, ChevronRight, ArrowLeft, Video, FileText, Headphones,
  FileDown, HelpCircle, ClipboardList, Radio, Layers, Settings2, Play, Puzzle,
  MessageSquare, Code2, Timer, Zap, Calendar, Lock, Unlock, Image as ImageIcon
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RichTextEditor from "@/components/RichTextEditor";
import { BunnyVideoManager } from "@/components/BunnyVideoManager";

// ─── Activity type icon mapping ───
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

// ─── Content type icon mapping (for lessons) ───
const contentTypeIcon: Record<string, any> = {
  video: Video, text: FileText, audio: Headphones, pdf: FileDown,
  quiz: HelpCircle, assignment: ClipboardList, download: FileDown, live_session: Radio,
};

// ─── Sortable Activity Item ───
function SortableActivity({ activity, onEdit, onDelete, onDuplicate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `activity-${activity.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = activityTypeIcon[activity.activityType] || FileText;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 px-6 py-1.5 border-t bg-background/50 hover:bg-muted/30 transition-colors">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-3 w-3" />
      </button>
      <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs truncate">{activity.title}</p>
        <p className="text-[10px] text-muted-foreground">
          {activityTypeLabel[activity.activityType] || activity.activityType}
          {activity.estimatedMinutes ? ` · ${activity.estimatedMinutes} min` : ""}
          {activity.points ? ` · ${activity.points} pts` : ""}
        </p>
      </div>
      <div className="flex items-center gap-0.5">
        {activity.isPreview && <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">Preview</Badge>}
        {activity.status === "draft" && <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">Draft</Badge>}
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onEdit(activity)}><Edit className="h-2.5 w-2.5" /></Button>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onDuplicate(activity.id)}><Copy className="h-2.5 w-2.5" /></Button>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => onDelete(activity.id)}><Trash2 className="h-2.5 w-2.5" /></Button>
      </div>
    </div>
  );
}

// ─── Activity List with DnD ───
function ActivityList({ activities, lessonId, onEditActivity, onDeleteActivity, onDuplicateActivity }: any) {
  const reorderActivities = trpc.activities.reorder.useMutation({
    onError: (e: any) => toast.error("Reorder failed: " + e.message),
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = activities.findIndex((a: any) => `activity-${a.id}` === active.id);
    const newIndex = activities.findIndex((a: any) => `activity-${a.id}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(activities, oldIndex, newIndex);
    reorderActivities.mutate({ lessonId, activityIds: reordered.map((a: any) => a.id) });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={activities.map((a: any) => `activity-${a.id}`)} strategy={verticalListSortingStrategy}>
        {activities.map((activity: any) => (
          <SortableActivity
            key={activity.id}
            activity={activity}
            onEdit={onEditActivity}
            onDelete={onDeleteActivity}
            onDuplicate={onDuplicateActivity}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// ─── Sortable Lesson Item (enhanced with activities) ───
function SortableLesson({ lesson, onEdit, onDelete, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `lesson-${lesson.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = contentTypeIcon[lesson.contentType] || FileText;
  const isExpanded = expandedLessons?.has(lesson.id);
  const activities = lesson.activities || [];

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30 hover:bg-muted/50 transition-colors">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onToggleLesson(lesson.id)} className="text-muted-foreground hover:text-foreground">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            {lesson.contentType} · {lesson.estimatedMinutes || 10} min
            {activities.length > 0 && ` · ${activities.length} activities`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {lesson.isPreview && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Preview</Badge>}
          {lesson.status === "draft" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Draft</Badge>}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAddActivity(lesson)}><Plus className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(lesson)}><Edit className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(lesson.id)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      </div>
      {isExpanded && activities.length > 0 && (
        <ActivityList
          activities={activities}
          lessonId={lesson.id}
          onEditActivity={onEditActivity}
          onDeleteActivity={onDeleteActivity}
          onDuplicateActivity={onDuplicateActivity}
        />
      )}
      {isExpanded && activities.length === 0 && (
        <div className="px-12 py-2 text-[11px] text-muted-foreground italic border-t bg-background/50">
          No activities yet. <button className="text-primary underline" onClick={() => onAddActivity(lesson)}>Add one</button>
        </div>
      )}
    </div>
  );
}

// ─── Lesson List with DnD (enhanced) ───
function LessonList({ lessons, moduleId, courseId, onEditLesson, onDeleteLesson, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson }: any) {
  const reorderLessons = trpc.admin.reorderLessons.useMutation({
    onError: (e: any) => toast.error("Reorder failed: " + e.message),
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lessons.findIndex((l: any) => `lesson-${l.id}` === active.id);
    const newIndex = lessons.findIndex((l: any) => `lesson-${l.id}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(lessons, oldIndex, newIndex);
    reorderLessons.mutate({ moduleId, lessonIds: reordered.map((l: any) => l.id) });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={lessons.map((l: any) => `lesson-${l.id}`)} strategy={verticalListSortingStrategy}>
        {lessons.map((lesson: any) => (
          <SortableLesson
            key={lesson.id}
            lesson={lesson}
            onEdit={onEditLesson}
            onDelete={onDeleteLesson}
            onAddActivity={onAddActivity}
            onEditActivity={onEditActivity}
            onDeleteActivity={onDeleteActivity}
            onDuplicateActivity={onDuplicateActivity}
            expandedLessons={expandedLessons}
            onToggleLesson={onToggleLesson}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// ─── Sortable Module Item (enhanced) ───
function SortableModule({ module, onExpand, expanded, onEditLesson, onAddLesson, onDeleteLesson, courseId, onDeleteModule, onEditModule, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `module-${module.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const totalActivities = (module.lessons || []).reduce((sum: number, l: any) => sum + (l.activities?.length || 0), 0);

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg bg-card mb-2">
      <div className="flex items-center gap-2 p-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={() => onExpand(module.id)} className="text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{module.title}</p>
          <p className="text-xs text-muted-foreground">
            {module.lessons?.length || 0} lessons
            {totalActivities > 0 && ` · ${totalActivities} activities`}
            {module.unlockMode && module.unlockMode !== "immediate" && (
              <span className="ml-1 text-amber-600">
                <Lock className="h-3 w-3 inline" /> {module.unlockMode}
              </span>
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditModule(module)}><Edit className="h-4 w-4 mr-2" /> Edit Module</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddLesson(module.id)}><Plus className="h-4 w-4 mr-2" /> Add Lesson</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteModule(module.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete Module</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {expanded && module.lessons && module.lessons.length > 0 && (
        <LessonList
          lessons={module.lessons}
          moduleId={module.id}
          courseId={courseId}
          onEditLesson={onEditLesson}
          onDeleteLesson={onDeleteLesson}
          onAddActivity={onAddActivity}
          onEditActivity={onEditActivity}
          onDeleteActivity={onDeleteActivity}
          onDuplicateActivity={onDuplicateActivity}
          expandedLessons={expandedLessons}
          onToggleLesson={onToggleLesson}
        />
      )}
      {expanded && (!module.lessons || module.lessons.length === 0) && (
        <div className="px-10 pb-3 text-xs text-muted-foreground italic">
          No lessons yet. <button className="text-primary underline" onClick={() => onAddLesson(module.id)}>Add one</button>
        </div>
      )}
    </div>
  );
}

// ─── Activity Dialog ───
function ActivityDialog({
  open, onOpenChange, activity, lessonId, moduleId, courseId, onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: any | null;
  lessonId: number;
  moduleId: number;
  courseId: number;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(activity?.title || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [activityType, setActivityType] = useState(activity?.activityType || "text");
  const [content, setContent] = useState(activity?.content || "");
  const [contentJson, setContentJson] = useState<any>(activity?.contentJson || null);
  const [videoUrl, setVideoUrl] = useState(activity?.videoUrl || "");
  const [videoProvider, setVideoProvider] = useState(activity?.videoProvider || "youtube");
  const [audioUrl, setAudioUrl] = useState(activity?.audioUrl || "");
  const [downloadUrl, setDownloadUrl] = useState(activity?.downloadUrl || "");
  const [downloadFileName, setDownloadFileName] = useState(activity?.downloadFileName || "");
  const [embedCode, setEmbedCode] = useState(activity?.embedCode || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(activity?.thumbnailUrl || "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(activity?.estimatedMinutes || 5);
  const [points, setPoints] = useState(activity?.points || 0);
  const [passingScore, setPassingScore] = useState<number | undefined>(activity?.passingScore || undefined);
  const [status, setStatus] = useState(activity?.status || "draft");
  const [isPreview, setIsPreview] = useState(activity?.isPreview || false);
  const [isMandatory, setIsMandatory] = useState(activity?.isMandatory ?? true);
  const [unlockMode, setUnlockMode] = useState(activity?.unlockMode || "immediate");
  const [activeTab, setActiveTab] = useState("content");

  const createActivity = trpc.activities.create.useMutation({
    onSuccess: () => { toast.success("Activity created"); onOpenChange(false); onSuccess(); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateActivity = trpc.activities.update.useMutation({
    onSuccess: () => { toast.success("Activity updated"); onOpenChange(false); onSuccess(); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSave = () => {
    if (!title.trim()) { toast.error("Activity title required"); return; }
    if (activity?.id) {
      updateActivity.mutate({
        id: activity.id,
        title, description, activityType: activityType as any,
        content, contentJson, videoUrl: videoUrl || null, videoProvider: videoProvider as any || null,
        audioUrl: audioUrl || null, downloadUrl: downloadUrl || null,
        downloadFileName: downloadFileName || null, embedCode: embedCode || null,
        thumbnailUrl: thumbnailUrl || null, estimatedMinutes, points,
        passingScore: passingScore || null, status: status as any,
        isPreview, isMandatory, unlockMode: unlockMode as any,
      });
    } else {
      createActivity.mutate({
        lessonId, moduleId, courseId,
        title, description, activityType: activityType as any,
        content, contentJson, videoUrl, videoProvider: videoProvider as any,
        audioUrl, downloadUrl, downloadFileName, embedCode,
        thumbnailUrl, estimatedMinutes, points,
        passingScore, status: status as any,
        isPreview, isMandatory, unlockMode: unlockMode as any,
      });
    }
  };

  const isPending = createActivity.isPending || updateActivity.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity?.id ? "Edit Activity" : "Add Activity"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="access">Access & Drip</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Watch Introduction Video" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} />
            </div>
            <div>
              <Label>Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypeLabel).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type-specific content fields */}
            {activityType === "video" && (
              <div className="space-y-3">
                <div>
                  <Label>Video Provider</Label>
                  <Select value={videoProvider} onValueChange={setVideoProvider}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bunny">Bunny Stream</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="self_hosted">Self-Hosted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {videoProvider === "bunny" ? (
                  <div>
                    <Label className="mb-2 block">Bunny Stream Video</Label>
                    <BunnyVideoManager
                      compact
                      selectedVideoId={videoUrl || null}
                      onSelect={(video) => {
                        setVideoUrl(video.videoId);
                        if (!title.trim()) setTitle(video.title);
                        if (video.duration > 0) setEstimatedMinutes(Math.ceil(video.duration / 60));
                        setThumbnailUrl(video.thumbnailUrl);
                      }}
                      onClear={() => {
                        setVideoUrl("");
                        setThumbnailUrl("");
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Video URL</Label>
                    <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
                  </div>
                )}
              </div>
            )}

            {activityType === "text" && (
              <div>
                <Label className="mb-2 block">Rich Text Content</Label>
                <RichTextEditor
                  content={content}
                  contentJson={contentJson}
                  onChange={(html, json) => { setContent(html); setContentJson(json); }}
                  placeholder="Write your activity content here..."
                  minHeight="250px"
                />
              </div>
            )}

            {activityType === "audio" && (
              <div>
                <Label>Audio URL</Label>
                <Input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://..." />
              </div>
            )}

            {activityType === "download" && (
              <div className="space-y-3">
                <div>
                  <Label>Download URL</Label>
                  <Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <Label>File Name</Label>
                  <Input value={downloadFileName} onChange={(e) => setDownloadFileName(e.target.value)} placeholder="worksheet.pdf" />
                </div>
              </div>
            )}

            {activityType === "embed" && (
              <div>
                <Label>Embed Code</Label>
                <Textarea value={embedCode} onChange={(e) => setEmbedCode(e.target.value)} placeholder="<iframe ...></iframe>" rows={4} className="font-mono text-xs" />
              </div>
            )}

            {(activityType === "quiz" || activityType === "assignment" || activityType === "speaking_exercise" || activityType === "fill_blank" || activityType === "matching" || activityType === "discussion") && (
              <div>
                <Label className="mb-2 block">Instructions / Content</Label>
                <RichTextEditor
                  content={content}
                  contentJson={contentJson}
                  onChange={(html, json) => { setContent(html); setContentJson(json); }}
                  placeholder="Write instructions or content for this activity..."
                  minHeight="200px"
                />
              </div>
            )}

            <div>
              <Label>Thumbnail URL (optional)</Label>
              <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estimated Duration (min)</Label>
                <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.target.value))} min={1} />
              </div>
              <div>
                <Label>Points</Label>
                <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={0} />
              </div>
            </div>
            {(activityType === "quiz" || activityType === "assignment") && (
              <div>
                <Label>Passing Score (%)</Label>
                <Input type="number" value={passingScore || ""} onChange={(e) => setPassingScore(e.target.value ? Number(e.target.value) : undefined)} min={0} max={100} placeholder="e.g., 70" />
              </div>
            )}
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={isPreview} onCheckedChange={setIsPreview} />
                <Label className="text-sm">Free Preview</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isMandatory} onCheckedChange={setIsMandatory} />
                <Label className="text-sm">Mandatory</Label>
              </div>
            </div>
          </TabsContent>

          {/* Access & Drip Tab */}
          <TabsContent value="access" className="space-y-4 mt-4">
            <div>
              <Label>Unlock Mode</Label>
              <Select value={unlockMode} onValueChange={setUnlockMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (always available)</SelectItem>
                  <SelectItem value="drip">Drip (scheduled release)</SelectItem>
                  <SelectItem value="prerequisite">Prerequisite (complete previous first)</SelectItem>
                  <SelectItem value="manual">Manual (admin unlocks)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {unlockMode === "immediate" && "This activity is available as soon as the learner enrolls."}
                {unlockMode === "drip" && "This activity will become available based on the course drip schedule."}
                {unlockMode === "prerequisite" && "Learner must complete the previous activity first."}
                {unlockMode === "manual" && "An admin must manually unlock this activity for each learner."}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : activity?.id ? "Update Activity" : "Create Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Drip Settings Panel ───
function DripSettingsPanel({ course, onUpdate }: { course: any; onUpdate: () => void }) {
  const [dripEnabled, setDripEnabled] = useState(course?.dripEnabled || false);
  const [dripInterval, setDripInterval] = useState(course?.dripInterval || 7);
  const [dripUnit, setDripUnit] = useState(course?.dripUnit || "days");

  const updateCourse = trpc.admin.updateCourse?.useMutation?.({
    onSuccess: () => { toast.success("Drip settings updated"); onUpdate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSave = () => {
    if (updateCourse) {
      updateCourse.mutate({
        courseId: course.id,
        dripEnabled,
        dripInterval,
        dripUnit: dripUnit as any,
      });
    } else {
      toast.info("Drip settings saved locally. Backend update coming soon.");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Drip Content Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Switch checked={dripEnabled} onCheckedChange={setDripEnabled} />
          <div>
            <Label className="text-sm font-medium">Enable Drip Content</Label>
            <p className="text-xs text-muted-foreground">Release modules/lessons on a schedule after enrollment</p>
          </div>
        </div>

        {dripEnabled && (
          <div className="pl-8 space-y-3 border-l-2 border-primary/20 ml-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Release Every</Label>
                <Input type="number" value={dripInterval} onChange={(e) => setDripInterval(Number(e.target.value))} min={1} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Unit</Label>
                <Select value={dripUnit} onValueChange={setDripUnit}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Modules will unlock every {dripInterval} {dripUnit} after the learner enrolls.
            </p>
            <Button size="sm" variant="outline" onClick={handleSave}>
              Save Drip Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Course Builder ───
export default function CourseBuilder() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<string>("sle_oral");

  // Course Editor state
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  // Module dialog
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [moduleForCourseId, setModuleForCourseId] = useState<number | null>(null);

  // Lesson dialog
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonType, setLessonType] = useState("video");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonTextContent, setLessonTextContent] = useState("");
  const [lessonContentJson, setLessonContentJson] = useState<any>(null);
  const [lessonMinutes, setLessonMinutes] = useState(10);
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);

  // Activity dialog
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [activityLessonId, setActivityLessonId] = useState<number>(0);
  const [activityModuleId, setActivityModuleId] = useState<number>(0);

  // Queries
  const { data: courses, isLoading, refetch } = trpc.admin.getAllCourses.useQuery();
  const { data: courseDetail, refetch: refetchDetail } = trpc.admin.getCourseForEdit.useQuery(
    { courseId: editingCourseId! },
    { enabled: !!editingCourseId }
  );

  // Activity queries - fetch activities for all lessons in the course
  const modules = (courseDetail as any)?.modules ?? [];
  const allLessonIds = useMemo(() => {
    const ids: number[] = [];
    modules.forEach((m: any) => {
      (m.lessons || []).forEach((l: any) => ids.push(l.id));
    });
    return ids;
  }, [modules]);

  // Fetch activities for each expanded lesson
  const activitiesQueries = expandedLessons.size > 0
    ? Array.from(expandedLessons).map(lessonId => {
        return trpc.activities.adminGetByLesson.useQuery(
          { lessonId },
          { enabled: expandedLessons.has(lessonId) }
        );
      })
    : [];

  // Build a map of lessonId -> activities
  const activitiesByLesson = useMemo(() => {
    const map: Record<number, any[]> = {};
    const lessonIds = Array.from(expandedLessons);
    lessonIds.forEach((lessonId, idx) => {
      if (activitiesQueries[idx]?.data) {
        map[lessonId] = activitiesQueries[idx].data as any[];
      }
    });
    return map;
  }, [expandedLessons, activitiesQueries.map(q => q.data)]);

  // Enrich modules with activities data
  const enrichedModules = useMemo(() => {
    return modules.map((m: any) => ({
      ...m,
      lessons: (m.lessons || []).map((l: any) => ({
        ...l,
        activities: activitiesByLesson[l.id] || [],
      })),
    }));
  }, [modules, activitiesByLesson]);

  // Mutations
  const utils = trpc.useUtils();
  const createCourse = trpc.admin.createCourse.useMutation({
    onSuccess: () => { toast.success("Course created"); setCreateOpen(false); setNewTitle(""); setNewDesc(""); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const publishCourse = trpc.admin.publishCourse.useMutation({
    onSuccess: () => { toast.success("Status updated"); refetch(); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteCourse = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => { toast.success("Course deleted"); setEditingCourseId(null); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const duplicateCourse = trpc.admin.duplicateCourse.useMutation({
    onSuccess: () => { toast.success("Course duplicated"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const createModule = trpc.admin.createModule.useMutation({
    onSuccess: () => { toast.success("Module created"); setModuleDialogOpen(false); setModuleTitle(""); setModuleDesc(""); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateModule = trpc.admin.updateModule.useMutation({
    onSuccess: () => { toast.success("Module updated"); setModuleDialogOpen(false); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteModule = trpc.admin.deleteModule.useMutation({
    onSuccess: () => { toast.success("Module deleted"); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const createLesson = trpc.admin.createLesson.useMutation({
    onSuccess: () => { toast.success("Lesson created"); setLessonDialogOpen(false); resetLessonForm(); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateLesson = trpc.admin.updateLesson.useMutation({
    onSuccess: () => { toast.success("Lesson updated"); setLessonDialogOpen(false); resetLessonForm(); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteLesson = trpc.admin.deleteLesson.useMutation({
    onSuccess: () => { toast.success("Lesson deleted"); refetchDetail(); },
    onError: (e: any) => toast.error(e.message),
  });
  const reorderModules = trpc.admin.reorderModules.useMutation({
    onError: (e: any) => toast.error("Reorder failed: " + e.message),
  });
  const deleteActivity = trpc.activities.delete.useMutation({
    onSuccess: () => { toast.success("Activity deleted"); refetchActivities(); },
    onError: (e: any) => toast.error(e.message),
  });
  const duplicateActivity = trpc.activities.duplicate.useMutation({
    onSuccess: () => { toast.success("Activity duplicated"); refetchActivities(); },
    onError: (e: any) => toast.error(e.message),
  });

  // DnD sensors for modules
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Data processing
  const allCourses = ((courses as any)?.courses ?? courses ?? []) as any[];
  const safeCourses = Array.isArray(allCourses) ? allCourses : [];
  const filtered = useMemo(() => safeCourses.filter((c: any) => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [safeCourses, search, statusFilter]);

  const stats = useMemo(() => ({
    total: safeCourses.length,
    published: safeCourses.filter((c: any) => c.status === "published").length,
    draft: safeCourses.filter((c: any) => c.status === "draft").length,
    archived: safeCourses.filter((c: any) => c.status === "archived").length,
  }), [safeCourses]);

  // Refetch activities for expanded lessons
  const refetchActivities = useCallback(() => {
    expandedLessons.forEach(lessonId => {
      utils.activities.adminGetByLesson.invalidate({ lessonId });
    });
  }, [expandedLessons, utils]);

  // Handlers
  const handleCreate = () => {
    if (!newTitle.trim()) { toast.error("Title required"); return; }
    createCourse.mutate({ title: newTitle, description: newDesc, category: newCategory as any || undefined });
  };

  const toggleExpand = (moduleId: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });
  };

  const openAddModule = (courseId: number) => {
    setModuleForCourseId(courseId);
    setEditingModuleId(null);
    setModuleTitle("");
    setModuleDesc("");
    setModuleDialogOpen(true);
  };

  const openEditModule = (module: any) => {
    setModuleForCourseId(editingCourseId);
    setEditingModuleId(module.id);
    setModuleTitle(module.title);
    setModuleDesc(module.description || "");
    setModuleDialogOpen(true);
  };

  const handleSaveModule = () => {
    if (!moduleTitle.trim()) { toast.error("Module title required"); return; }
    if (editingModuleId) {
      updateModule.mutate({ moduleId: editingModuleId, title: moduleTitle, description: moduleDesc });
    } else {
      createModule.mutate({ courseId: moduleForCourseId!, title: moduleTitle, description: moduleDesc });
    }
  };

  const handleDeleteModule = (moduleId: number) => {
    if (confirm("Delete this module and all its lessons?")) {
      deleteModule.mutate({ moduleId });
    }
  };

  const resetLessonForm = () => {
    setLessonTitle(""); setLessonDesc(""); setLessonType("video");
    setLessonVideoUrl(""); setLessonTextContent(""); setLessonContentJson(null);
    setLessonMinutes(10); setLessonIsPreview(false); setEditingLessonId(null); setLessonModuleId(null);
  };

  const openAddLesson = (moduleId: number) => {
    resetLessonForm();
    setLessonModuleId(moduleId);
    setLessonDialogOpen(true);
  };

  const openEditLesson = (lesson: any) => {
    setEditingLessonId(lesson.id);
    setLessonModuleId(lesson.moduleId);
    setLessonTitle(lesson.title);
    setLessonDesc(lesson.description || "");
    setLessonType(lesson.contentType || "video");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonTextContent(lesson.textContent || "");
    setLessonContentJson(lesson.contentJson || null);
    setLessonMinutes(lesson.estimatedMinutes || 10);
    setLessonIsPreview(lesson.isPreview || false);
    setLessonDialogOpen(true);
  };

  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) { toast.error("Lesson title required"); return; }
    if (editingLessonId) {
      updateLesson.mutate({
        lessonId: editingLessonId, title: lessonTitle, description: lessonDesc,
        contentType: lessonType as any, videoUrl: lessonVideoUrl || undefined,
        textContent: lessonTextContent || undefined, estimatedMinutes: lessonMinutes,
        isPreview: lessonIsPreview,
      });
    } else {
      createLesson.mutate({
        moduleId: lessonModuleId!, courseId: editingCourseId!, title: lessonTitle,
        description: lessonDesc, contentType: lessonType as any,
        videoUrl: lessonVideoUrl || undefined, textContent: lessonTextContent || undefined,
        estimatedMinutes: lessonMinutes, isPreview: lessonIsPreview,
      });
    }
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (confirm("Delete this lesson?")) {
      deleteLesson.mutate({ lessonId });
    }
  };

  // Activity handlers
  const openAddActivity = (lesson: any) => {
    setEditingActivity(null);
    setActivityLessonId(lesson.id);
    setActivityModuleId(lesson.moduleId);
    setActivityDialogOpen(true);
  };

  const openEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setActivityLessonId(activity.lessonId);
    setActivityModuleId(activity.moduleId);
    setActivityDialogOpen(true);
  };

  const handleDeleteActivity = (activityId: number) => {
    if (confirm("Delete this activity?")) {
      deleteActivity.mutate({ activityId });
    }
  };

  const handleDuplicateActivity = (activityId: number) => {
    duplicateActivity.mutate({ activityId });
  };

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = enrichedModules.findIndex((m: any) => `module-${m.id}` === active.id);
    const newIndex = enrichedModules.findIndex((m: any) => `module-${m.id}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(enrichedModules, oldIndex, newIndex);
    reorderModules.mutate({ courseId: editingCourseId!, moduleIds: reordered.map((m: any) => m.id) });
    setTimeout(() => refetchDetail(), 500);
  };

  // ─── COURSE EDITOR VIEW ───
  if (editingCourseId && courseDetail) {
    const course = courseDetail as any;
    const totalActivities = enrichedModules.reduce((sum: number, m: any) =>
      sum + (m.lessons || []).reduce((ls: number, l: any) => ls + (l.activities?.length || 0), 0), 0
    );

    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setEditingCourseId(null)}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{course.title}</h1>
            <p className="text-sm text-muted-foreground">
              {course.category} · {enrichedModules.length} modules · {enrichedModules.reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0)} lessons
              {totalActivities > 0 && ` · ${totalActivities} activities`}
            </p>
          </div>
          <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Settings2 className="h-4 w-4 mr-1" /> Actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {course.status !== "published" && (
                <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "published" })}><Eye className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>
              )}
              {course.status === "published" && (
                <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "draft" })}><EyeOff className="h-4 w-4 mr-2" /> Unpublish</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => duplicateCourse.mutate({ courseId: course.id })}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "archived" })} className="text-amber-600"><EyeOff className="h-4 w-4 mr-2" /> Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm("Delete this course permanently?")) deleteCourse.mutate({ courseId: course.id }); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Drip Content Settings */}
        <DripSettingsPanel course={course} onUpdate={() => refetchDetail()} />

        {/* Modules, Lessons & Activities with Drag & Drop */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Course Structure</CardTitle>
              <Button size="sm" variant="outline" onClick={() => openAddModule(course.id)}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              4-level hierarchy: Course → Module → Lesson → Activity. Drag to reorder. Click arrows to expand.
            </p>
          </CardHeader>
          <CardContent>
            {enrichedModules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No modules yet. Add your first module to start building.</p>
                <Button size="sm" className="mt-3" onClick={() => openAddModule(course.id)}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
                <SortableContext items={enrichedModules.map((m: any) => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                  {enrichedModules.map((module: any) => (
                    <SortableModule
                      key={module.id}
                      module={module}
                      courseId={course.id}
                      expanded={expandedModules.has(module.id)}
                      onExpand={toggleExpand}
                      onEditLesson={openEditLesson}
                      onAddLesson={openAddLesson}
                      onDeleteLesson={handleDeleteLesson}
                      onDeleteModule={handleDeleteModule}
                      onEditModule={openEditModule}
                      onAddActivity={openAddActivity}
                      onEditActivity={openEditActivity}
                      onDeleteActivity={handleDeleteActivity}
                      onDuplicateActivity={handleDuplicateActivity}
                      expandedLessons={expandedLessons}
                      onToggleLesson={toggleLesson}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Module Dialog */}
        <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingModuleId ? "Edit Module" : "Add Module"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="e.g., Module 1: Introduction" /></div>
              <div><Label>Description</Label><Textarea value={moduleDesc} onChange={(e) => setModuleDesc(e.target.value)} placeholder="Module description..." rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveModule} disabled={createModule.isPending || updateModule.isPending}>
                {(createModule.isPending || updateModule.isPending) ? "Saving..." : editingModuleId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson Dialog (enhanced with rich text) */}
        <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingLessonId ? "Edit Lesson" : "Add Lesson"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="e.g., Introduction to SLE Oral" /></div>
              <div><Label>Description</Label><Textarea value={lessonDesc} onChange={(e) => setLessonDesc(e.target.value)} placeholder="Lesson description..." rows={2} /></div>
              <div><Label>Content Type</Label>
                <Select value={lessonType} onValueChange={setLessonType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text / Article</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="download">Downloadable</SelectItem>
                    <SelectItem value="live_session">Live Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {lessonType === "video" && (
                <div><Label>Video URL</Label><Input value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." /></div>
              )}
              {lessonType === "text" && (
                <div>
                  <Label className="mb-2 block">Rich Text Content</Label>
                  <RichTextEditor
                    content={lessonTextContent}
                    contentJson={lessonContentJson}
                    onChange={(html, json) => { setLessonTextContent(html); setLessonContentJson(json); }}
                    placeholder="Write your lesson content here..."
                    minHeight="200px"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Duration (min)</Label><Input type="number" value={lessonMinutes} onChange={(e) => setLessonMinutes(Number(e.target.value))} min={1} /></div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={lessonIsPreview} onCheckedChange={setLessonIsPreview} /><Label className="text-sm">Free Preview</Label></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveLesson} disabled={createLesson.isPending || updateLesson.isPending}>
                {(createLesson.isPending || updateLesson.isPending) ? "Saving..." : editingLessonId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activity Dialog */}
        {activityDialogOpen && (
          <ActivityDialog
            open={activityDialogOpen}
            onOpenChange={setActivityDialogOpen}
            activity={editingActivity}
            lessonId={activityLessonId}
            moduleId={activityModuleId}
            courseId={editingCourseId!}
            onSuccess={() => { refetchActivities(); refetchDetail(); }}
          />
        )}
      </div>
    );
  }

  // ─── COURSE LIST VIEW ───
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Course Builder</h1><p className="text-sm text-muted-foreground">Create, edit, and manage courses with 4-level hierarchy & drag-and-drop.</p></div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Course</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xl font-bold text-green-600">{stats.published}</p><p className="text-xs text-muted-foreground">Published</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xl font-bold text-amber-600">{stats.draft}</p><p className="text-xs text-muted-foreground">Drafts</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xl font-bold text-gray-400">{stats.archived}</p><p className="text-xs text-muted-foreground">Archived</p></CardContent></Card>
      </div>

      <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
      </div></CardContent></Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? [1,2,3,4,5,6].map(i => <Card key={i}><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>) :
          filtered.length === 0 ? (
            <div className="col-span-full text-center py-12"><BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-lg font-medium">No courses found</p><Button className="mt-4" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create Course</Button></div>
          ) : filtered.map((course: any) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setEditingCourseId(course.id)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={course.status === "published" ? "default" : course.status === "draft" ? "secondary" : "outline"}>{course.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingCourseId(course.id); }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); publishCourse.mutate({ courseId: course.id, status: course.status === "published" ? "draft" : "published" }); }}>
                        {course.status === "published" ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateCourse.mutate({ courseId: course.id }); }}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this course?")) deleteCourse.mutate({ courseId: course.id }); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description || "No description"}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{course.moduleCount ?? 0} modules</span><span>{course.lessonCount ?? 0} lessons</span><span>{course.enrollmentCount ?? 0} enrolled</span></div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Create Course Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent>
        <DialogHeader><DialogTitle>Create New Course</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., SLE Preparation Intensive" /></div>
          <div><Label>Description</Label><Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Course description..." rows={3} /></div>
          <div><Label>Category</Label><Select value={newCategory} onValueChange={setNewCategory}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="sle_oral">SLE Oral</SelectItem><SelectItem value="sle_written">SLE Written</SelectItem><SelectItem value="sle_reading">SLE Reading</SelectItem><SelectItem value="sle_complete">SLE Complete</SelectItem><SelectItem value="business_french">Business French</SelectItem><SelectItem value="business_english">Business English</SelectItem><SelectItem value="exam_prep">Exam Prep</SelectItem><SelectItem value="conversation">Conversation</SelectItem><SelectItem value="grammar">Grammar</SelectItem><SelectItem value="vocabulary">Vocabulary</SelectItem></SelectContent></Select></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={createCourse.isPending}>{createCourse.isPending ? "Creating..." : "Create Course"}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
