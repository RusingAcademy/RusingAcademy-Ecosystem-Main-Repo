/**
 * AdminContentMgmtSection — Content Management inside AdminControlCenter
 * 
 * This is a lightweight wrapper that imports the core content management
 * functionality. The full AdminContentManagement page (1483 lines) contains
 * its own auth guards and Header/Footer — this wrapper strips those and
 * renders just the content management UI inside AdminLayout.
 * 
 * TODO: Refactor AdminContentManagement.tsx to export a pure content component
 * that can be used here without layout duplication. For now, we provide a
 * professional placeholder that links to the full page.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FolderOpen,
  BookOpen,
  Layers,
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function AdminContentMgmtSection() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Try to fetch real course data
  const { data: courses, isLoading } = trpc.adminCourses.list.useQuery(undefined, {
    retry: false,
  });

  const courseList = courses || [];
  const publishedCount = courseList.filter((c: any) => c.status === "published").length;
  const draftCount = courseList.filter((c: any) => c.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses, modules, lessons, and quiz questions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/content">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Full Editor
            </Button>
          </Link>
          <Button onClick={() => toast.info("Quick create coming soon")}>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : courseList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : publishedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : draftCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="quality">Quality Check</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Course Builder (Full Editor)
                  </Button>
                </Link>
                <Link href="/admin/content">
                  <Button variant="outline" className="w-full justify-start">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Content Management (Legacy)
                  </Button>
                </Link>
                <Link href="/admin/media-library">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Media Library
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Health</CardTitle>
                <CardDescription>Quick overview of content completeness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Courses with descriptions</span>
                    <Badge variant="outline">—</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lessons with content</span>
                    <Badge variant="outline">—</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quizzes with questions</span>
                    <Badge variant="outline">—</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Activities with FR translation</span>
                    <Badge variant="outline">—</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Courses</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : courseList.length === 0 ? (
                <div className="text-center py-6 md:py-8 lg:py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first course to get started</p>
                  <Link href="/admin/courses">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Lessons</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseList
                      .filter((c: any) => !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((course: any) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {course.category?.replace("_", " ") || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={course.status === "published" ? "default" : "secondary"}>
                              {course.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.totalModules || 0}</TableCell>
                          <TableCell>{course.totalLessons || 0}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Content Quality Gate
              </CardTitle>
              <CardDescription>
                Automated checks for content completeness and consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quality Gate Coming Soon</h3>
                <p className="text-muted-foreground">
                  Automated content quality checks will be available in the next sprint.
                  This will verify bilingual completeness, media placeholders, quiz coverage, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
