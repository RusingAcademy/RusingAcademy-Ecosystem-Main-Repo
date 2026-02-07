import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye, Users, GraduationCap, Shield, Globe, ChevronRight,
  BookOpen, Star, Clock, BarChart3, User, ArrowLeft
} from "lucide-react";

type ViewMode = "select" | "public" | "student" | "coach" | "admin";

export default function PreviewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  const { data: students } = trpc.previewMode.getStudentsList.useQuery();
  const { data: coaches } = trpc.previewMode.getCoachesList.useQuery();
  const { data: previewData } = trpc.previewMode.getPreviewData.useQuery(
    { viewAs: viewMode === "select" ? "admin" : viewMode, targetUserId: selectedUserId },
    { enabled: viewMode !== "select" }
  );

  const viewModes = [
    {
      id: "public" as const,
      title: "Public Visitor",
      description: "See what an anonymous visitor sees — public courses, coaches, and landing pages",
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      id: "student" as const,
      title: "Student View",
      description: "Experience the platform as a specific student — enrollments, progress, practice logs",
      icon: GraduationCap,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      id: "coach" as const,
      title: "Coach View",
      description: "See the coach dashboard — sessions, earnings, students, and profile",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
    },
    {
      id: "admin" as const,
      title: "Admin Overview",
      description: "Full admin view with all stats, controls, and system metrics",
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
  ];

  if (viewMode === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preview Everything</h1>
          <p className="text-gray-500 mt-1">
            View the platform exactly as different users see it — student, coach, admin, or public visitor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className={`cursor-pointer hover:shadow-lg transition-all border-2 ${mode.border} hover:scale-[1.02]`}
                onClick={() => {
                  if (mode.id === "student" || mode.id === "coach") {
                    // Don't navigate yet, show user picker
                  } else {
                    setViewMode(mode.id);
                  }
                }}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${mode.bg}`}>
                      <Icon className={`w-6 h-6 ${mode.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{mode.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{mode.description}</p>
                      {(mode.id === "student" || mode.id === "coach") && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-medium text-gray-600">Select a user:</p>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {(mode.id === "student" ? students : coaches)?.map((u: any) => (
                              <button
                                key={u.id}
                                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUserId(u.id);
                                  setViewMode(mode.id);
                                }}
                              >
                                <User className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{u.name}</span>
                                <span className="text-gray-400 text-xs">{u.email}</span>
                                <ChevronRight className="w-3 h-3 text-gray-300 ml-auto" />
                              </button>
                            )) || (
                              <p className="text-xs text-gray-400 px-3 py-1">No users found</p>
                            )}
                          </div>
                        </div>
                      )}
                      {mode.id !== "student" && mode.id !== "coach" && (
                        <Button variant="outline" size="sm" className="mt-3" onClick={() => setViewMode(mode.id)}>
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Preview View
  const currentMode = viewModes.find((m) => m.id === viewMode);
  const Icon = currentMode?.icon || Eye;

  return (
    <div className="space-y-6">
      {/* Preview Header Bar */}
      <div className={`p-4 rounded-xl ${currentMode?.bg} border-2 ${currentMode?.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${currentMode?.color}`} />
            <div>
              <h2 className="font-bold text-gray-900">
                Previewing as: {currentMode?.title}
                {selectedUserId && previewData && (
                  <span className="font-normal text-gray-600">
                    {" "}— {(previewData as any).user?.name || (previewData as any).profile?.name || ""}
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500">This is a read-only preview of what this user type sees</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => { setViewMode("select"); setSelectedUserId(undefined); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Selection
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      {viewMode === "public" && previewData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Public Course Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {((previewData as any).courses || []).map((c: any) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <Badge variant="outline" className="mb-2">{c.category || "General"}</Badge>
                  <h4 className="font-semibold text-gray-900">{c.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-violet-600">
                      {c.price ? `$${(c.price / 100).toFixed(2)}` : "Free"}
                    </span>
                    <span className="text-xs text-gray-400">{c.enrollmentCount} enrolled</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {((previewData as any).courses || []).length === 0 && (
              <Card className="col-span-full"><CardContent className="py-8 text-center text-gray-400">No published courses yet</CardContent></Card>
            )}
          </div>

          <h3 className="text-lg font-semibold mt-6">Featured Coaches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {((previewData as any).coaches || []).map((c: any) => (
              <Card key={c.id}>
                <CardContent className="pt-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{c.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500" /> {c.averageRating || "N/A"}
                      <span>·</span>
                      <span>{c.totalSessions || 0} sessions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {viewMode === "student" && previewData && (
        <div className="space-y-6">
          {(previewData as any).user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Student Profile: {(previewData as any).user.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{(previewData as any).user.email}</p>
              </CardContent>
            </Card>
          )}
          <h3 className="text-lg font-semibold">Enrolled Courses</h3>
          <div className="space-y-3">
            {((previewData as any).enrollments || []).map((e: any) => (
              <Card key={e.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-violet-600" />
                    <div>
                      <h4 className="font-medium">{e.courseName || `Course #${e.courseId}`}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant={e.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {e.status}
                        </Badge>
                        <Clock className="w-3 h-3" /> Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-violet-600">{e.progress || 0}%</div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-violet-600 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {((previewData as any).enrollments || []).length === 0 && (
              <Card><CardContent className="py-8 text-center text-gray-400">No enrollments yet</CardContent></Card>
            )}
          </div>
        </div>
      )}

      {viewMode === "coach" && previewData && (
        <div className="space-y-6">
          {(previewData as any).profile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  Coach Profile: {(previewData as any).profile.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-violet-600">{(previewData as any).profile.averageRating || "N/A"}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{(previewData as any).profile.totalSessions || 0}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{(previewData as any).profile.totalStudents || 0}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {viewMode === "admin" && previewData && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-3xl font-bold mt-2">{(previewData as any).stats?.users || 0}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <BookOpen className="w-8 h-8 text-violet-600 mx-auto" />
                <div className="text-3xl font-bold mt-2">{(previewData as any).stats?.courses || 0}</div>
                <div className="text-sm text-gray-500">Total Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <BarChart3 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-3xl font-bold mt-2">{(previewData as any).stats?.enrollments || 0}</div>
                <div className="text-sm text-gray-500">Total Enrollments</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
