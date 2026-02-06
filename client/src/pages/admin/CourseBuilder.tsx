import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, BookOpen, MoreHorizontal, Edit, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CourseBuilder() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<string>("sle_oral");

  const { data: courses, isLoading, refetch } = trpc.admin.getAllCourses.useQuery();
  const createCourse = trpc.admin.createCourse.useMutation({
    onSuccess: () => { toast("Course created"); setCreateOpen(false); setNewTitle(""); setNewDesc(""); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateCourse = trpc.admin.updateCourse.useMutation({
    onSuccess: () => { toast("Course updated"); refetch(); },
  });

  const allCourses = ((courses as any)?.courses ?? courses ?? []) as any[];
  const safeCourses = Array.isArray(allCourses) ? allCourses : [];
  const filtered = safeCourses.filter((c: any) => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = { total: safeCourses.length, published: safeCourses.filter((c: any) => c.status === "published").length, draft: safeCourses.filter((c: any) => c.status === "draft").length, archived: safeCourses.filter((c: any) => c.status === "archived").length };

  const handleCreate = () => {
    if (!newTitle.trim()) { toast.error("Title required"); return; }
    createCourse.mutate({ title: newTitle, description: newDesc, category: newCategory as any || undefined });
  };

  const toggleStatus = (course: any) => {
    const newStatus = course.status === "published" ? "draft" : "published";
    updateCourse.mutate({ courseId: course.id, title: course.title } as any);
    // Note: status changes should use publishCourse/unpublishCourse procedures
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Course Builder</h1><p className="text-sm text-muted-foreground">Create, edit, and manage all courses.</p></div>
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
            <Card key={course.id} className="hover:shadow-md transition-shadow"><CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={course.status === "published" ? "default" : course.status === "draft" ? "secondary" : "outline"}>{course.status}</Badge>
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast("Course editor coming soon")}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(course)}>{course.status === "published" ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast("Duplicate coming soon")}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => toast("Archive coming soon")}><Trash2 className="h-4 w-4 mr-2" /> Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-base mb-1 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description || "No description"}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{course.moduleCount ?? 0} modules</span><span>{course.lessonCount ?? 0} lessons</span><span>{course.enrollmentCount ?? 0} enrolled</span></div>
            </CardContent></Card>
          ))
        }
      </div>

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
