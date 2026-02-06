import { useState, useMemo } from "react";
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
import {
  Plus, Search, BookOpen, MoreHorizontal, Edit, Copy, Trash2, Eye, EyeOff,
  GripVertical, ChevronDown, ChevronRight, ArrowLeft, Video, FileText, Headphones,
  FileDown, HelpCircle, ClipboardList, Radio, Layers, Settings2
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

// ─── Content type icon mapping ───
const contentTypeIcon: Record<string, any> = {
  video: Video, text: FileText, audio: Headphones, pdf: FileDown,
  quiz: HelpCircle, assignment: ClipboardList, download: FileDown, live_session: Radio,
};

// ─── Sortable Module Item ───
function SortableModule({ module, onExpand, expanded, onEditLesson, onAddLesson, onDeleteLesson, courseId, onDeleteModule, onEditModule }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `module-${module.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };

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
          <p className="text-xs text-muted-foreground">{module.lessons?.length || 0} lessons</p>
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
        <LessonList lessons={module.lessons} moduleId={module.id} courseId={courseId} onEditLesson={onEditLesson} onDeleteLesson={onDeleteLesson} />
      )}
      {expanded && (!module.lessons || module.lessons.length === 0) && (
        <div className="px-10 pb-3 text-xs text-muted-foreground italic">
          No lessons yet. <button className="text-primary underline" onClick={() => onAddLesson(module.id)}>Add one</button>
        </div>
      )}
    </div>
  );
}

// ─── Sortable Lesson Item ───
function SortableLesson({ lesson, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `lesson-${lesson.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = contentTypeIcon[lesson.contentType] || FileText;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 px-4 py-2 border-t bg-muted/30 hover:bg-muted/50 transition-colors">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{lesson.title}</p>
        <p className="text-xs text-muted-foreground">{lesson.contentType} · {lesson.estimatedMinutes || 10} min</p>
      </div>
      <div className="flex items-center gap-1">
        {lesson.isPreview && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Preview</Badge>}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(lesson)}><Edit className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(lesson.id)}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </div>
  );
}

// ─── Lesson List with DnD ───
function LessonList({ lessons, moduleId, courseId, onEditLesson, onDeleteLesson }: any) {
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
          <SortableLesson key={lesson.id} lesson={lesson} onEdit={onEditLesson} onDelete={onDeleteLesson} />
        ))}
      </SortableContext>
    </DndContext>
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
  const [lessonMinutes, setLessonMinutes] = useState(10);
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);

  // Queries
  const { data: courses, isLoading, refetch } = trpc.admin.getAllCourses.useQuery();
  const { data: courseDetail, refetch: refetchDetail } = trpc.admin.getCourseForEdit.useQuery(
    { courseId: editingCourseId! },
    { enabled: !!editingCourseId }
  );

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

  const modules = (courseDetail as any)?.modules ?? [];

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
    setLessonVideoUrl(""); setLessonTextContent(""); setLessonMinutes(10);
    setLessonIsPreview(false); setEditingLessonId(null); setLessonModuleId(null);
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

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = modules.findIndex((m: any) => `module-${m.id}` === active.id);
    const newIndex = modules.findIndex((m: any) => `module-${m.id}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(modules, oldIndex, newIndex);
    reorderModules.mutate({ courseId: editingCourseId!, moduleIds: reordered.map((m: any) => m.id) });
    // Optimistic: refetch after a short delay
    setTimeout(() => refetchDetail(), 500);
  };

  // ─── COURSE EDITOR VIEW ───
  if (editingCourseId && courseDetail) {
    const course = courseDetail as any;
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setEditingCourseId(null)}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{course.title}</h1>
            <p className="text-sm text-muted-foreground">{course.category} · {modules.length} modules · {modules.reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0)} lessons</p>
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

        {/* Modules & Lessons with Drag & Drop */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Modules & Lessons</CardTitle>
              <Button size="sm" variant="outline" onClick={() => openAddModule(course.id)}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
            </div>
            <p className="text-xs text-muted-foreground">Drag modules and lessons to reorder. Click the arrow to expand.</p>
          </CardHeader>
          <CardContent>
            {modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No modules yet. Add your first module to start building.</p>
                <Button size="sm" className="mt-3" onClick={() => openAddModule(course.id)}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
                <SortableContext items={modules.map((m: any) => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                  {modules.map((module: any) => (
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

        {/* Lesson Dialog */}
        <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingLessonId ? "Edit Lesson" : "Add Lesson"}</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
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
                <div><Label>Text Content</Label><Textarea value={lessonTextContent} onChange={(e) => setLessonTextContent(e.target.value)} placeholder="Lesson content..." rows={5} /></div>
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
      </div>
    );
  }

  // ─── COURSE LIST VIEW ───
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Course Builder</h1><p className="text-sm text-muted-foreground">Create, edit, and manage all courses with drag & drop.</p></div>
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
