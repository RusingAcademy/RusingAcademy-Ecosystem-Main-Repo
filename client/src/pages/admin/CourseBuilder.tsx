import { useState, useMemo, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Search, BookOpen, MoreHorizontal, Edit, Copy, Trash2, Eye, EyeOff,
  GripVertical, ChevronDown, ChevronRight, ArrowLeft, Video, FileText, Headphones,
  FileDown, HelpCircle, ClipboardList, Radio, Layers, Settings2, Play, Puzzle,
  MessageSquare, Code2, Timer, Zap, Calendar, Lock, Unlock, Image as ImageIcon,
  Users, Star, Shield, ShieldCheck, ShieldAlert, ShieldX, Globe, Languages,
  CheckCircle2, XCircle, AlertTriangle, Sparkles, GraduationCap, Trophy,
  BarChart3, TrendingUp, CircleDot, PlusCircle, ChevronUp
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
import QuizBuilder from "@/components/QuizBuilder";
import CourseSettingsEditor from "@/components/CourseSettingsEditor";
import RichTextEditor from "@/components/RichTextEditor";
import { BunnyVideoManager } from "@/components/BunnyVideoManager";
import { motion, AnimatePresence } from "framer-motion";

// ─── SLOT TEMPLATE (mirrors backend) ───
const SLOT_TEMPLATE = [
  { index: 1, type: "introduction", labelEn: "Introduction / Hook", labelFr: "Introduction / Accroche", activityType: "text", icon: Sparkles, color: "from-violet-500 to-purple-600", bgLight: "bg-violet-50", textColor: "text-violet-700", borderColor: "border-violet-200" },
  { index: 2, type: "video_scenario", labelEn: "Video Scenario", labelFr: "Scénario Vidéo", activityType: "video", icon: Video, color: "from-blue-500 to-cyan-600", bgLight: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  { index: 3, type: "grammar_point", labelEn: "Grammar / Strategy", labelFr: "Grammaire / Stratégie", activityType: "text", icon: BookOpen, color: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50", textColor: "text-emerald-700", borderColor: "border-emerald-200" },
  { index: 4, type: "written_practice", labelEn: "Written Practice", labelFr: "Pratique Écrite", activityType: "assignment", icon: ClipboardList, color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-700", borderColor: "border-amber-200" },
  { index: 5, type: "oral_practice", labelEn: "Oral Practice", labelFr: "Pratique Orale", activityType: "audio", icon: Headphones, color: "from-rose-500 to-pink-600", bgLight: "bg-rose-50", textColor: "text-rose-700", borderColor: "border-rose-200" },
  { index: 6, type: "quiz_slot", labelEn: "Quiz", labelFr: "Quiz", activityType: "quiz", icon: HelpCircle, color: "from-indigo-500 to-blue-600", bgLight: "bg-indigo-50", textColor: "text-indigo-700", borderColor: "border-indigo-200" },
  { index: 7, type: "coaching_tip", labelEn: "Coaching Tip", labelFr: "Conseil du Coach", activityType: "text", icon: Trophy, color: "from-yellow-500 to-amber-600", bgLight: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
];

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

// ─── Slot Status Dot ───
function SlotDot({ filled, published, hasFr }: { filled: boolean; published: boolean; hasFr: boolean }) {
  if (!filled) return (
    <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300 bg-gray-50" title="Empty slot" />
  );
  if (published && hasFr) return (
    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-sm shadow-emerald-200" title="Published + Bilingual" />
  );
  if (published) return (
    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm shadow-blue-200" title="Published (EN only)" />
  );
  return (
    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-200" title="Draft" />
  );
}

// ─── Slot Grid (7-slot visual for a lesson) ───
function SlotGrid({ activities, onSlotClick }: { activities: any[]; onSlotClick: (slotIndex: number, activity?: any) => void }) {
  return (
    <div className="grid grid-cols-7 gap-1.5 px-2 py-2">
      {SLOT_TEMPLATE.map((slot) => {
        const activity = activities.find((a: any) => a.slotIndex === slot.index);
        const Icon = slot.icon;
        const isFilled = !!activity;
        const isPublished = activity?.status === "published";
        const hasFr = !!activity?.titleFr;

        return (
          <TooltipProvider key={slot.index} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSlotClick(slot.index, activity)}
                  className={`
                    relative group flex flex-col items-center justify-center p-1.5 rounded-lg
                    border transition-all duration-200 cursor-pointer min-h-[52px]
                    ${isFilled
                      ? isPublished
                        ? `${slot.bgLight} ${slot.borderColor} hover:shadow-md hover:-translate-y-0.5`
                        : "bg-amber-50/80 border-amber-200 hover:shadow-md hover:-translate-y-0.5"
                      : "bg-gray-50/50 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-100/50"
                    }
                  `}
                >
                  <Icon className={`h-3.5 w-3.5 mb-0.5 ${isFilled ? slot.textColor : "text-gray-300"}`} />
                  <span className={`text-[8px] font-medium leading-tight text-center ${isFilled ? slot.textColor : "text-gray-400"}`}>
                    {slot.index}
                  </span>
                  {isFilled && (
                    <div className="absolute -top-1 -right-1">
                      {isPublished ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <CircleDot className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                  )}
                  {!isFilled && (
                    <Plus className="h-2.5 w-2.5 text-gray-300 group-hover:text-gray-500 absolute bottom-0.5 right-0.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold text-xs">{slot.labelEn}</p>
                <p className="text-[10px] text-muted-foreground">{slot.labelFr}</p>
                {activity ? (
                  <div className="mt-1 pt-1 border-t">
                    <p className="text-[10px]">{activity.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {activity.status} · {activity.activityType}
                      {hasFr && " · 🇫🇷"}
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-1">Click to add</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

// ─── Quality Gate Status Badge ───
function QualityBadge({ status }: { status: string }) {
  if (status === "PASS") return (
    <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm gap-1">
      <ShieldCheck className="h-3 w-3" /> Pass
    </Badge>
  );
  if (status === "WARN") return (
    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm gap-1">
      <ShieldAlert className="h-3 w-3" /> Warning
    </Badge>
  );
  return (
    <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-sm gap-1">
      <ShieldX className="h-3 w-3" /> Fail
    </Badge>
  );
}

// ─── Progress Ring (SVG circle) ───
function ProgressRing({ value, size = 32, strokeWidth = 3, className = "" }: { value: number; size?: number; strokeWidth?: number; className?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const color = value === 100 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="text-[8px] font-bold fill-current">
        {value}%
      </text>
    </svg>
  );
}

// ─── Sortable Activity Item ───
function SortableActivity({ activity, onEdit, onDelete, onDuplicate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `activity-${activity.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = activityTypeIcon[activity.activityType] || FileText;
  const slotInfo = SLOT_TEMPLATE.find(s => s.index === activity.slotIndex);
  const isExtra = !slotInfo || activity.slotIndex > 7;

  return (
    <motion.div
      ref={setNodeRef} style={style}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-2 px-4 py-2 border-t transition-all duration-200
        ${isExtra
          ? "bg-gradient-to-r from-gray-50/80 to-slate-50/80 hover:from-gray-100/80 hover:to-slate-100/80"
          : "bg-background/50 hover:bg-muted/30"
        }
      `}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-3 w-3" />
      </button>

      {/* Slot indicator */}
      {slotInfo && !isExtra ? (
        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${slotInfo.color} flex items-center justify-center shrink-0`}>
          <span className="text-[9px] font-bold text-white">{activity.slotIndex}</span>
        </div>
      ) : (
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shrink-0">
          <Plus className="h-3 w-3 text-white" />
        </div>
      )}

      <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium truncate">{activity.title}</p>
          {activity.titleFr && (
            <span className="text-[9px] px-1 py-0 rounded bg-blue-50 text-blue-600 border border-blue-100 shrink-0">FR</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {isExtra ? "Extra" : slotInfo?.labelEn} · {activityTypeLabel[activity.activityType] || activity.activityType}
          {activity.estimatedMinutes ? ` · ${activity.estimatedMinutes} min` : ""}
          {activity.points ? ` · ${activity.points} pts` : ""}
        </p>
      </div>

      <div className="flex items-center gap-0.5">
        {activity.isPreview && <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">Preview</Badge>}
        <Badge
          variant={activity.status === "published" ? "default" : "secondary"}
          className={`text-[9px] px-1.5 py-0 h-4 ${activity.status === "published" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}`}
        >
          {activity.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(activity)}><Edit className="h-3 w-3 mr-2" /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(activity.id)}><Copy className="h-3 w-3 mr-2" /> Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(activity.id)}><Trash2 className="h-3 w-3 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
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

// ─── Sortable Lesson (with 7-slot grid) ───
function SortableLesson({ lesson, onEdit, onDelete, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson, onSlotClick }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `lesson-${lesson.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isExpanded = expandedLessons?.has(lesson.id);
  const activities = lesson.activities || [];
  const mandatorySlots = activities.filter((a: any) => a.slotIndex >= 1 && a.slotIndex <= 7);
  const extraSlots = activities.filter((a: any) => a.slotIndex > 7);
  const filledCount = mandatorySlots.length;
  const publishedCount = mandatorySlots.filter((a: any) => a.status === "published").length;
  const completeness = Math.round((filledCount / 7) * 100);

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-t bg-gradient-to-r from-muted/20 to-muted/40 hover:from-muted/40 hover:to-muted/60 transition-all duration-200">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onToggleLesson(lesson.id)} className="text-muted-foreground hover:text-foreground transition-transform duration-200">
          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {/* Progress ring */}
        <ProgressRing value={completeness} size={28} strokeWidth={2.5} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{lesson.title}</p>
            {lesson.titleFr && <span className="text-[9px] px-1 rounded bg-blue-50 text-blue-600 border border-blue-100">FR</span>}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{filledCount}/7 slots</span>
            <span>·</span>
            <span>{publishedCount} published</span>
            {extraSlots.length > 0 && (
              <>
                <span>·</span>
                <span className="text-purple-600">+{extraSlots.length} extra</span>
              </>
            )}
            {lesson.estimatedMinutes && (
              <>
                <span>·</span>
                <span>{lesson.estimatedMinutes} min</span>
              </>
            )}
          </div>
        </div>

        {/* Slot dots */}
        <div className="hidden md:flex items-center gap-0.5">
          {SLOT_TEMPLATE.map((slot) => {
            const act = mandatorySlots.find((a: any) => a.slotIndex === slot.index);
            return <SlotDot key={slot.index} filled={!!act} published={act?.status === "published"} hasFr={!!act?.titleFr} />;
          })}
        </div>

        <div className="flex items-center gap-0.5">
          {lesson.isPreview && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Preview</Badge>}
          {lesson.status === "draft" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Draft</Badge>}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAddActivity(lesson)} title="Add activity">
            <PlusCircle className="h-3.5 w-3.5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(lesson)}><Edit className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(lesson.id)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      </div>

      {/* Expanded: show slot grid + activity list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* 7-Slot Visual Grid */}
            <div className="px-6 py-2 bg-gradient-to-r from-slate-50/80 to-gray-50/80 border-t">
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">7-Slot Template</span>
              </div>
              <SlotGrid activities={activities} onSlotClick={(slotIndex, activity) => onSlotClick(lesson, slotIndex, activity)} />
            </div>

            {/* Activity list */}
            {activities.length > 0 && (
              <ActivityList
                activities={activities}
                lessonId={lesson.id}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
                onDuplicateActivity={onDuplicateActivity}
              />
            )}

            {/* Extra activities section */}
            {extraSlots.length > 0 && (
              <div className="px-6 py-2 bg-gradient-to-r from-purple-50/30 to-indigo-50/30 border-t">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">Extra Activities ({extraSlots.length})</span>
                </div>
              </div>
            )}

            {activities.length === 0 && (
              <div className="px-12 py-4 text-center border-t bg-muted/10">
                <Layers className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground/40" />
                <p className="text-[11px] text-muted-foreground">
                  No activities yet. Click a slot above or{" "}
                  <button className="text-primary underline font-medium" onClick={() => onAddActivity(lesson)}>add one</button>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lesson List with DnD ───
function LessonList({ lessons, moduleId, courseId, onEditLesson, onDeleteLesson, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson, onSlotClick }: any) {
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
            onSlotClick={onSlotClick}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// ─── Sortable Module ───
function SortableModule({ module, onExpand, expanded, onEditLesson, onAddLesson, onDeleteLesson, courseId, onDeleteModule, onEditModule, onAddActivity, onEditActivity, onDeleteActivity, onDuplicateActivity, expandedLessons, onToggleLesson, onSlotClick }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `module-${module.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const totalActivities = (module.lessons || []).reduce((sum: number, l: any) => sum + (l.activities?.length || 0), 0);
  const totalMandatory = (module.lessons || []).reduce((sum: number, l: any) => {
    return sum + (l.activities || []).filter((a: any) => a.slotIndex >= 1 && a.slotIndex <= 7).length;
  }, 0);
  const totalExpected = (module.lessons?.length || 0) * 7;
  const completeness = totalExpected > 0 ? Math.round((totalMandatory / totalExpected) * 100) : 0;

  return (
    <motion.div
      ref={setNodeRef} style={style}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl bg-card mb-3 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-card to-muted/10">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
        <button onClick={() => onExpand(module.id)} className="text-muted-foreground hover:text-foreground transition-transform duration-200">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Module badge */}
        {module.badgeImageUrl ? (
          <img src={module.badgeImageUrl} alt="" className="w-8 h-8 rounded-lg object-cover border shadow-sm" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-foundation to-foundation-2 flex items-center justify-center shadow-sm">
            <Layers className="h-4 w-4 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{module.title}</p>
            {module.titleFr && <span className="text-[9px] px-1 rounded bg-blue-50 text-blue-600 border border-blue-100">FR</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{module.lessons?.length || 0} lessons</span>
            <span>·</span>
            <span>{totalMandatory}/{totalExpected} slots</span>
            {totalActivities > totalMandatory && (
              <>
                <span>·</span>
                <span className="text-purple-600">+{totalActivities - totalMandatory} extra</span>
              </>
            )}
            {module.unlockMode && module.unlockMode !== "immediate" && (
              <span className="text-amber-600 flex items-center gap-0.5">
                <Lock className="h-3 w-3" /> {module.unlockMode}
              </span>
            )}
          </div>
        </div>

        {/* Completeness ring */}
        <ProgressRing value={completeness} size={36} strokeWidth={3} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditModule(module)}><Edit className="h-4 w-4 mr-2" /> Edit Module</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddLesson(module.id)}><Plus className="h-4 w-4 mr-2" /> Add Lesson</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteModule(module.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete Module</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {expanded && module.lessons && module.lessons.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
              onSlotClick={onSlotClick}
            />
          </motion.div>
        )}
        {expanded && (!module.lessons || module.lessons.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-10 pb-4 pt-2 text-center"
          >
            <FileText className="h-6 w-6 mx-auto mb-1 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              No lessons yet.{" "}
              <button className="text-primary underline font-medium" onClick={() => onAddLesson(module.id)}>Add one</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Activity Dialog (with bilingual tabs + slot-aware) ───
function ActivityDialog({
  open, onOpenChange, activity, lessonId, moduleId, courseId, onSuccess, presetSlotIndex,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: any | null;
  lessonId: number;
  moduleId: number;
  courseId: number;
  onSuccess: () => void;
  presetSlotIndex?: number;
}) {
  const isEditing = !!activity?.id;
  const slotInfo = presetSlotIndex ? SLOT_TEMPLATE.find(s => s.index === presetSlotIndex) : null;
  const isExtraSlot = presetSlotIndex ? presetSlotIndex > 7 : (activity?.slotIndex > 7);

  const [title, setTitle] = useState(activity?.title || (slotInfo?.labelEn || ""));
  const [titleFr, setTitleFr] = useState(activity?.titleFr || (slotInfo?.labelFr || ""));
  const [description, setDescription] = useState(activity?.description || "");
  const [descriptionFr, setDescriptionFr] = useState(activity?.descriptionFr || "");
  const [activityType, setActivityType] = useState(activity?.activityType || slotInfo?.activityType || "text");
  const [content, setContent] = useState(activity?.content || "");
  const [contentFr, setContentFr] = useState(activity?.contentFr || "");
  const [contentJson, setContentJson] = useState<any>(activity?.contentJson || null);
  const [contentJsonFr, setContentJsonFr] = useState<any>(activity?.contentJsonFr || null);
  const [videoUrl, setVideoUrl] = useState(activity?.videoUrl || "");
  const [videoProvider, setVideoProvider] = useState(activity?.videoProvider || "youtube");
  const [audioUrl, setAudioUrl] = useState(activity?.audioUrl || "");
  const [downloadUrl, setDownloadUrl] = useState(activity?.downloadUrl || "");
  const [downloadFileName, setDownloadFileName] = useState(activity?.downloadFileName || "");
  const [embedCode, setEmbedCode] = useState(activity?.embedCode || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(activity?.thumbnailUrl || "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(activity?.estimatedMinutes || slotInfo?.defaultMinutes || 5);
  const [points, setPoints] = useState(activity?.points || 0);
  const [passingScore, setPassingScore] = useState<number | undefined>(activity?.passingScore || undefined);
  const [status, setStatus] = useState(activity?.status || "draft");
  const [isPreview, setIsPreview] = useState(activity?.isPreview || false);
  const [isMandatory, setIsMandatory] = useState(activity?.isMandatory ?? true);
  const [unlockMode, setUnlockMode] = useState(activity?.unlockMode || "immediate");
  const [activeTab, setActiveTab] = useState("content-en");
  const [langTab, setLangTab] = useState<"en" | "fr">("en");

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
    const slotIndex = presetSlotIndex || activity?.slotIndex || 1;
    const slotType = slotIndex <= 7
      ? (SLOT_TEMPLATE.find(s => s.index === slotIndex)?.type || "introduction")
      : "extra";

    if (isEditing) {
      updateActivity.mutate({
        id: activity.id,
        title, titleFr: titleFr || null, description, descriptionFr: descriptionFr || null,
        activityType: activityType as any,
        content, contentFr: contentFr || null, contentJson, contentJsonFr: contentJsonFr || null,
        videoUrl: videoUrl || null, videoProvider: videoProvider as any || null,
        audioUrl: audioUrl || null, downloadUrl: downloadUrl || null,
        downloadFileName: downloadFileName || null, embedCode: embedCode || null,
        thumbnailUrl: thumbnailUrl || null, estimatedMinutes, points,
        passingScore: passingScore || null, status: status as any,
        isPreview, isMandatory, unlockMode: unlockMode as any,
      });
    } else {
      createActivity.mutate({
        lessonId, moduleId, courseId,
        slotIndex,
        slotType: slotType as any,
        title, titleFr, description, descriptionFr,
        activityType: activityType as any,
        content, contentFr, contentJson, contentJsonFr,
        videoUrl, videoProvider: videoProvider as any,
        audioUrl, downloadUrl, downloadFileName, embedCode,
        thumbnailUrl, estimatedMinutes, points,
        passingScore, status: status as any,
        isPreview, isMandatory, unlockMode: unlockMode as any,
      });
    }
  };

  const isPending = createActivity.isPending || updateActivity.isPending;

  // Content editor based on type
  const renderContentEditor = (lang: "en" | "fr") => {
    const isEn = lang === "en";
    const currentContent = isEn ? content : contentFr;
    const currentJson = isEn ? contentJson : contentJsonFr;
    const setCurrentContent = (html: string, json: any) => {
      if (isEn) { setContent(html); setContentJson(json); }
      else { setContentFr(html); setContentJsonFr(json); }
    };

    return (
      <div className="space-y-4">
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
                  onSelect={(video: any) => {
                    setVideoUrl(video.videoId);
                    if (!title.trim()) setTitle(video.title);
                    if (video.duration > 0) setEstimatedMinutes(Math.ceil(video.duration / 60));
                    setThumbnailUrl(video.thumbnailUrl);
                  }}
                  onClear={() => { setVideoUrl(""); setThumbnailUrl(""); }}
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

        {(activityType === "text" || activityType === "assignment" || activityType === "speaking_exercise" || activityType === "fill_blank" || activityType === "matching" || activityType === "discussion") && (
          <div>
            <Label className="mb-2 block">
              {lang === "en" ? "Content (English)" : "Contenu (Français)"}
            </Label>
            <RichTextEditor
              content={currentContent}
              contentJson={currentJson}
              onChange={(html: string, json: any) => setCurrentContent(html, json)}
              placeholder={lang === "en" ? "Write your content here..." : "Écrivez votre contenu ici..."}
              minHeight="200px"
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
            <div><Label>Download URL</Label><Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." /></div>
            <div><Label>File Name</Label><Input value={downloadFileName} onChange={(e) => setDownloadFileName(e.target.value)} placeholder="worksheet.pdf" /></div>
          </div>
        )}

        {activityType === "embed" && (
          <div>
            <Label>Embed Code</Label>
            <Textarea value={embedCode} onChange={(e) => setEmbedCode(e.target.value)} placeholder="<iframe ...></iframe>" rows={4} className="font-mono text-xs" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {slotInfo && !isExtraSlot && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slotInfo.color} flex items-center justify-center shadow-lg`}>
                <span className="text-sm font-bold text-white">{slotInfo.index}</span>
              </div>
            )}
            {isExtraSlot && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <DialogTitle className="text-lg">
                {isEditing ? "Edit Activity" : isExtraSlot ? "Add Extra Activity" : `Slot ${presetSlotIndex}: ${slotInfo?.labelEn || "Activity"}`}
              </DialogTitle>
              {slotInfo && !isExtraSlot && (
                <p className="text-xs text-muted-foreground mt-0.5">{slotInfo.labelFr} · Default type: {slotInfo.activityType}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content-en" className="gap-1.5">
              <span className="text-[10px] px-1 rounded bg-red-50 text-red-600 border border-red-100">EN</span> Content
            </TabsTrigger>
            <TabsTrigger value="content-fr" className="gap-1.5">
              <span className="text-[10px] px-1 rounded bg-blue-50 text-blue-600 border border-blue-100">FR</span> Contenu
            </TabsTrigger>
            {activityType === "quiz" && isEditing && (
              <TabsTrigger value="questions">Questions</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
          </TabsList>

          {/* English Content */}
          <TabsContent value="content-en" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Title (English)</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Watch Introduction Video" />
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} />
              </div>
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
            {renderContentEditor("en")}
            <div>
              <Label>Thumbnail URL (optional)</Label>
              <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
            </div>
          </TabsContent>

          {/* French Content */}
          <TabsContent value="content-fr" className="space-y-4 mt-4">
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 mb-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">French Translation</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Add the French version of this content for bilingual delivery.</p>
            </div>
            <div>
              <Label>Titre (Français)</Label>
              <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} placeholder="ex. Regarder la vidéo d'introduction" />
            </div>
            <div>
              <Label>Description (Français)</Label>
              <Textarea value={descriptionFr} onChange={(e) => setDescriptionFr(e.target.value)} placeholder="Description brève..." rows={2} />
            </div>
            {renderContentEditor("fr")}
          </TabsContent>

          {/* Quiz Questions */}
          {activityType === "quiz" && isEditing && (
            <TabsContent value="questions" className="mt-4">
              <QuizBuilder lessonId={lessonId} courseId={courseId} moduleId={moduleId} />
            </TabsContent>
          )}

          {/* Settings */}
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
            <div className="flex items-center gap-6">
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

          {/* Access */}
          <TabsContent value="access" className="space-y-4 mt-4">
            <div>
              <Label>Unlock Mode</Label>
              <Select value={unlockMode} onValueChange={setUnlockMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="drip">Drip (scheduled)</SelectItem>
                  <SelectItem value="prerequisite">Prerequisite</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending} className="gap-1.5 bg-gradient-to-r from-foundation to-foundation-2 hover:opacity-90">
            {isPending ? "Saving..." : isEditing ? "Update Activity" : "Create Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Quality Gate Panel ───
function QualityGatePanel({ courseId }: { courseId: number }) {
  const { data, isLoading, refetch } = trpc.activities.validateCourse.useQuery({ courseId });
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return (
    <Card className="overflow-hidden">
      <CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent>
    </Card>
  );

  if (!data) return null;

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className={`h-1.5 ${data.overallStatus === "PASS" ? "bg-gradient-to-r from-emerald-400 to-green-500" : data.overallStatus === "WARN" ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> Quality Gate
          </CardTitle>
          <div className="flex items-center gap-2">
            <QualityBadge status={data.overallStatus} />
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7 text-xs">Refresh</Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold">{data.totalModules}</p>
            <p className="text-[10px] text-muted-foreground">Modules</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold">{data.totalLessons}</p>
            <p className="text-[10px] text-muted-foreground">Lessons</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold">{data.totalActivities}/{data.expectedActivities}</p>
            <p className="text-[10px] text-muted-foreground">Activities</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-emerald-600">{data.passLessons}</p>
            <p className="text-[10px] text-muted-foreground">Passing</p>
          </div>
        </div>

        {/* Course-level issues */}
        {data.issues && data.issues.length > 0 && (
          <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-100">
            {data.issues.map((issue: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-red-700">
                <XCircle className="h-3 w-3 shrink-0" /> {issue}
              </div>
            ))}
          </div>
        )}

        {/* Module breakdown (expandable) */}
        <AnimatePresence>
          {expanded && data.modules && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <Separator className="my-2" />
              {data.modules.map((mod: any) => (
                <div key={mod.moduleId} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <QualityBadge status={mod.status} />
                      <span className="text-sm font-medium">{mod.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{mod.totalLessons} lessons</span>
                  </div>
                  {mod.issues && mod.issues.length > 0 && (
                    <div className="mb-2">
                      {mod.issues.map((issue: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-700">
                          <AlertTriangle className="h-3 w-3 shrink-0" /> {issue}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-1">
                    {mod.lessons?.map((lesson: any) => (
                      <div key={lesson.lessonId} className="flex items-center gap-2 text-xs py-1 px-2 rounded bg-muted/20">
                        {lesson.status === "PASS" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : lesson.status === "WARN" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <span className="text-muted-foreground">{lesson.filledSlots}/7</span>
                        {lesson.frenchSlots > 0 && <span className="text-blue-600">{lesson.frenchSlots} FR</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ─── Drip Settings Panel ───
function DripSettingsPanel({ course, onUpdate }: { course: any; onUpdate: () => void }) {
  const [dripEnabled, setDripEnabled] = useState(course.dripEnabled || false);
  const [dripInterval, setDripInterval] = useState(course.dripInterval || 7);
  const [dripUnit, setDripUnit] = useState(course.dripUnit || "days");

  const updateCourse = trpc.admin.publishCourse.useMutation({
    onSuccess: () => { toast.success("Drip settings saved"); onUpdate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSave = () => {
    updateCourse.mutate({ courseId: course.id, status: course.status });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
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
            <Button size="sm" variant="outline" onClick={handleSave}>Save Drip Settings</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COURSE BUILDER
// ═══════════════════════════════════════════════════════════════
export default function CourseBuilder() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<string>("sle_oral");

  // Course Editor state
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [showCourseSettings, setShowCourseSettings] = useState(false);
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
  const [presetSlotIndex, setPresetSlotIndex] = useState<number | undefined>(undefined);

  // Queries
  const { data: courses, isLoading, refetch } = trpc.admin.getAllCourses.useQuery();
  const { data: courseDetail, refetch: refetchDetail } = trpc.admin.getCourseForEdit.useQuery(
    { courseId: editingCourseId! },
    { enabled: !!editingCourseId }
  );

  // Use getCourseTree for a single efficient query that returns all activities
  const { data: courseTree, refetch: refetchTree } = trpc.activities.getCourseTree.useQuery(
    { courseId: editingCourseId! },
    { enabled: !!editingCourseId }
  );

  // Merge courseDetail (for full course info) with courseTree (for activities)
  const enrichedModules = useMemo(() => {
    const detailModules = (courseDetail as any)?.modules ?? [];
    const treeModules = (courseTree as any)?.modules ?? [];
    // Build a map of lessonId -> activities from the tree
    const actMap: Record<number, any[]> = {};
    treeModules.forEach((tm: any) => {
      (tm.lessons || []).forEach((tl: any) => {
        actMap[tl.id] = tl.activities || [];
      });
    });
    return detailModules.map((m: any) => ({
      ...m,
      lessons: (m.lessons || []).map((l: any) => ({
        ...l,
        activities: actMap[l.id] || [],
        slotCount: (actMap[l.id] || []).filter((a: any) => a.slotIndex >= 1 && a.slotIndex <= 7).length,
        publishedSlotCount: (actMap[l.id] || []).filter((a: any) => a.status === 'published' && a.slotIndex >= 1 && a.slotIndex <= 7).length,
      })),
    }));
  }, [courseDetail, courseTree]);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const refetchActivities = useCallback(() => {
    refetchTree();
  }, [refetchTree]);

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
    if (confirm("Delete this lesson?")) deleteLesson.mutate({ lessonId });
  };

  // Activity handlers
  const openAddActivity = (lesson: any) => {
    setEditingActivity(null);
    setActivityLessonId(lesson.id);
    setActivityModuleId(lesson.moduleId);
    setPresetSlotIndex(undefined);
    setActivityDialogOpen(true);
  };

  const openEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setActivityLessonId(activity.lessonId);
    setActivityModuleId(activity.moduleId);
    setPresetSlotIndex(activity.slotIndex);
    setActivityDialogOpen(true);
  };

  // Slot click handler (from the 7-slot grid)
  const handleSlotClick = (lesson: any, slotIndex: number, activity?: any) => {
    if (activity) {
      openEditActivity(activity);
    } else {
      setEditingActivity(null);
      setActivityLessonId(lesson.id);
      setActivityModuleId(lesson.moduleId);
      setPresetSlotIndex(slotIndex);
      setActivityDialogOpen(true);
    }
  };

  const handleDeleteActivity = (activityId: number) => {
    if (confirm("Delete this activity?")) deleteActivity.mutate({ activityId });
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

  // ─── COURSE SETTINGS VIEW ───
  if (editingCourseId && showCourseSettings) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <CourseSettingsEditor courseId={editingCourseId} onBack={() => setShowCourseSettings(false)} />
      </div>
    );
  }

  // ─── COURSE EDITOR VIEW ───
  if (editingCourseId && courseDetail) {
    const course = courseDetail as any;
    const totalActivities = enrichedModules.reduce((sum: number, m: any) =>
      sum + (m.lessons || []).reduce((ls: number, l: any) => ls + (l.activities?.length || 0), 0), 0
    );
    const totalLessons = enrichedModules.reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0);
    const totalMandatory = enrichedModules.reduce((sum: number, m: any) =>
      sum + (m.lessons || []).reduce((ls: number, l: any) =>
        ls + (l.activities || []).filter((a: any) => a.slotIndex >= 1 && a.slotIndex <= 7).length, 0), 0
    );
    const totalExpected = totalLessons * 7;
    const completeness = totalExpected > 0 ? Math.round((totalMandatory / totalExpected) * 100) : 0;
    const totalDuration = enrichedModules.reduce((sum: number, m: any) =>
      sum + (m.lessons || []).reduce((ls: number, l: any) =>
        ls + (l.activities || []).reduce((as: number, a: any) => as + (a.estimatedMinutes || 0), 0), 0), 0
    );

    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header with glassmorphism accent */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foundation/5 via-transparent to-cta/5 border p-6">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
          <div className="relative flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setEditingCourseId(null)} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {course.thumbnailUrl && (
              <img src={course.thumbnailUrl} alt="" className="w-16 h-16 rounded-xl object-cover border shadow-md shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold truncate">{course.title}</h1>
                <Badge variant={course.status === "published" ? "default" : "secondary"} className={course.status === "published" ? "bg-emerald-100 text-emerald-700" : ""}>
                  {course.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {course.category} · {enrichedModules.length} modules · {totalLessons} lessons · {totalActivities} activities
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {course.status === "published" && (
                <Button variant="outline" size="sm" onClick={() => window.open(`/courses/${course.slug}`, '_blank')} className="gap-1.5">
                  <Eye className="h-4 w-4" /> Preview
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Settings2 className="h-4 w-4" /> Actions</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {course.status !== "published" && (
                    <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "published" })}><Eye className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>
                  )}
                  {course.status === "published" && (
                    <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "draft" })}><EyeOff className="h-4 w-4 mr-2" /> Unpublish</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setShowCourseSettings(true)}><Settings2 className="h-4 w-4 mr-2" /> Course Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateCourse.mutate({ courseId: course.id })}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => publishCourse.mutate({ courseId: course.id, status: "archived" })} className="text-amber-600"><EyeOff className="h-4 w-4 mr-2" /> Archive</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm("Delete this course permanently?")) deleteCourse.mutate({ courseId: course.id }); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { icon: Layers, label: "Modules", value: enrichedModules.length, color: "text-foundation" },
            { icon: FileText, label: "Lessons", value: totalLessons, color: "text-blue-600" },
            { icon: Puzzle, label: "Activities", value: `${totalMandatory}/${totalExpected}`, color: "text-purple-600" },
            { icon: Timer, label: "Duration", value: totalDuration > 60 ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` : `${totalDuration}m`, color: "text-amber-600" },
            { icon: Users, label: "Enrolled", value: course.totalEnrollments || 0, color: "text-emerald-600" },
            { icon: TrendingUp, label: "Complete", value: `${completeness}%`, color: completeness === 100 ? "text-emerald-600" : "text-amber-600" },
          ].map((stat, i) => (
            <Card key={i} className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} /> {stat.label}
                </div>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quality Gate */}
        <QualityGatePanel courseId={editingCourseId!} />

        {/* Drip Settings */}
        <DripSettingsPanel course={course} onUpdate={() => refetchDetail()} />

        {/* Course Structure */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="pb-3 bg-gradient-to-r from-card to-muted/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-foundation" /> Course Structure
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm" variant="outline"
                  onClick={() => {
                    if (expandedModules.size === enrichedModules.length) {
                      setExpandedModules(new Set());
                      setExpandedLessons(new Set());
                    } else {
                      setExpandedModules(new Set(enrichedModules.map((m: any) => m.id)));
                    }
                  }}
                  className="text-xs h-7"
                >
                  {expandedModules.size === enrichedModules.length ? "Collapse All" : "Expand All"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openAddModule(course.id)} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Add Module
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Course → Module → Lesson → 7 Mandatory Slots + Extra Activities. Drag to reorder. Click slot squares to edit.
            </p>
          </CardHeader>
          <CardContent className="p-3">
            {enrichedModules.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-foundation/10 to-cta/10 flex items-center justify-center mx-auto mb-3">
                  <Layers className="h-8 w-8 text-foundation/40" />
                </div>
                <p className="text-sm font-medium mb-1">No modules yet</p>
                <p className="text-xs text-muted-foreground mb-4">Add your first module to start building the course structure.</p>
                <Button size="sm" onClick={() => openAddModule(course.id)} className="gap-1.5 bg-gradient-to-r from-foundation to-foundation-2">
                  <Plus className="h-4 w-4" /> Add Module
                </Button>
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
                      onSlotClick={handleSlotClick}
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
              <Button onClick={handleSaveModule} disabled={createModule.isPending || updateModule.isPending} className="bg-gradient-to-r from-foundation to-foundation-2">
                {(createModule.isPending || updateModule.isPending) ? "Saving..." : editingModuleId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson Dialog */}
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
                    onChange={(html: string, json: any) => { setLessonTextContent(html); setLessonContentJson(json); }}
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
              <Button onClick={handleSaveLesson} disabled={createLesson.isPending || updateLesson.isPending} className="bg-gradient-to-r from-foundation to-foundation-2">
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
            presetSlotIndex={presetSlotIndex}
          />
        )}
      </div>
    );
  }

  // ─── COURSE LIST VIEW ───
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foundation/5 via-transparent to-cta/5 border p-6">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-foundation" /> Course Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, edit, and manage courses with the 7-slot architecture. Each lesson contains 7 mandatory activity slots plus unlimited extras.
            </p>
          </div>
          <Button className="gap-1.5 bg-gradient-to-r from-foundation to-foundation-2 hover:opacity-90 shadow-lg" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground", bg: "bg-muted/30" },
          { label: "Published", value: stats.published, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Drafts", value: stats.draft, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Archived", value: stats.archived, color: "text-gray-400", bg: "bg-gray-50" },
        ].map((stat, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className={`p-4 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? [1,2,3,4,5,6].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-5"><Skeleton className="h-40 w-full rounded-lg" /></CardContent>
          </Card>
        )) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-foundation/10 to-cta/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-foundation/40" />
            </div>
            <p className="text-lg font-medium mb-1">No courses found</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first course to get started.</p>
            <Button className="bg-gradient-to-r from-foundation to-foundation-2" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create Course
            </Button>
          </div>
        ) : filtered.map((course: any) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md"
              onClick={() => setEditingCourseId(course.id)}
            >
              {course.thumbnailUrl ? (
                <div className="aspect-video w-full bg-muted overflow-hidden relative">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <Badge variant={course.status === "published" ? "default" : "secondary"} className={`text-[10px] ${course.status === "published" ? "bg-emerald-500/90 text-white" : ""}`}>
                      {course.status}
                    </Badge>
                    {course.price > 0 ? (
                      <Badge className="text-[10px] bg-white/90 text-emerald-700 border-0">${(course.price / 100).toFixed(0)} CAD</Badge>
                    ) : (
                      <Badge className="text-[10px] bg-white/90 text-blue-700 border-0">Free</Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-foundation/10 to-cta/10 flex items-center justify-center relative">
                  <GraduationCap className="h-12 w-12 text-foundation/20" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-foundation transition-colors">{course.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingCourseId(course.id); }}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingCourseId(course.id); setShowCourseSettings(true); }}><Settings2 className="h-4 w-4 mr-2" /> Settings</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateCourse.mutate({ courseId: course.id }); }}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this course?")) deleteCourse.mutate({ courseId: course.id }); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description || "No description"}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {course.moduleCount ?? 0}</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {course.lessonCount ?? 0}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrollmentCount ?? 0}</span>
                  {course.averageRating && <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {Number(course.averageRating).toFixed(1)}</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Course</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., SLE Preparation Intensive" /></div>
            <div><Label>Description</Label><Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Course description..." rows={3} /></div>
            <div><Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sle_oral">SLE Oral</SelectItem>
                  <SelectItem value="sle_written">SLE Written</SelectItem>
                  <SelectItem value="sle_reading">SLE Reading</SelectItem>
                  <SelectItem value="sle_complete">SLE Complete</SelectItem>
                  <SelectItem value="business_french">Business French</SelectItem>
                  <SelectItem value="business_english">Business English</SelectItem>
                  <SelectItem value="exam_prep">Exam Prep</SelectItem>
                  <SelectItem value="conversation">Conversation</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createCourse.isPending} className="bg-gradient-to-r from-foundation to-foundation-2">
              {createCourse.isPending ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
