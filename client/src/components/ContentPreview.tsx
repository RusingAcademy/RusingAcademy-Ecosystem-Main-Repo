/**
 * ContentPreview — Preview course content as a learner would see it
 * 
 * Renders a read-only view of a course with its modules and lessons,
 * simulating the learner experience. Used from the admin Course Builder.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentQualityBadge from "./ContentQualityBadge";
import {
  Eye, BookOpen, Layers, FileText, Video, Headphones,
  Clock, Users, Star, CheckCircle2, Lock, Play,
  ChevronRight, GraduationCap, Globe, X
} from "lucide-react";

interface ContentPreviewProps {
  courseId: number;
  open: boolean;
  onClose: () => void;
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4 text-blue-500" />,
  text: <FileText className="h-4 w-4 text-emerald-500" />,
  audio: <Headphones className="h-4 w-4 text-purple-500" />,
  pdf: <FileText className="h-4 w-4 text-red-500" />,
  quiz: <CheckCircle2 className="h-4 w-4 text-amber-500" />,
  assignment: <GraduationCap className="h-4 w-4 text-indigo-500" />,
  download: <FileText className="h-4 w-4 text-gray-500" />,
  live_session: <Play className="h-4 w-4 text-rose-500" />,
};

export default function ContentPreview({ courseId, open, onClose }: ContentPreviewProps) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const { data: course, isLoading } = trpc.adminCourses.getCourseForEdit.useQuery(
    { courseId },
    { enabled: open && courseId > 0 }
  );

  const { data: quality } = trpc.adminCourses.getContentQuality.useQuery(
    { courseId },
    { enabled: open && courseId > 0 }
  );

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Learner Preview
            </DialogTitle>
            {quality && (
              <ContentQualityBadge
                score={quality.score}
                grade={quality.grade}
                checks={quality.checks}
                passedChecks={quality.passedChecks}
                totalChecks={quality.totalChecks}
              />
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : course ? (
            <div className="p-6 space-y-6">
              {/* Course Hero */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-muted">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground ml-2">No thumbnail</span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    {course.titleFr && (
                      <p className="text-lg text-muted-foreground mt-1 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {course.titleFr}
                      </p>
                    )}
                  </div>
                  <Badge variant={course.status === "published" ? "default" : "secondary"}>
                    {course.status}
                  </Badge>
                </div>

                {course.description && (
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {course.description}
                  </p>
                )}

                {/* Stats bar */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    {course.modules?.length || 0} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {course.totalLessons || 0} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.totalDurationMinutes ? `${Math.round(course.totalDurationMinutes / 60)}h` : `${course.estimatedHours || 0}h`}
                  </span>
                  {course.totalEnrollments > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.totalEnrollments} enrolled
                    </span>
                  )}
                  {course.averageRating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      {course.averageRating}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-4">
                  {course.accessType === "free" || (course.price || 0) === 0 ? (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                      Free
                    </Badge>
                  ) : (
                    <span className="text-xl font-bold">
                      ${((course.price || 0) / 100).toFixed(2)} CAD
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Course Curriculum */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Course Curriculum</h3>
                {course.modules && course.modules.length > 0 ? (
                  <div className="space-y-3">
                    {course.modules.map((module: any, mi: number) => (
                      <Card key={module.id} className="overflow-hidden">
                        <button
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                          onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {mi + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{module.title}</p>
                              {module.titleFr && (
                                <p className="text-xs text-muted-foreground">{module.titleFr}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {module.lessons?.length || 0} lessons
                            </span>
                            <ChevronRight className={`h-4 w-4 transition-transform ${expandedModule === mi ? "rotate-90" : ""}`} />
                          </div>
                        </button>
                        {expandedModule === mi && module.lessons && (
                          <div className="border-t divide-y">
                            {module.lessons.map((lesson: any, li: number) => (
                              <div key={lesson.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30">
                                <div className="flex items-center gap-3">
                                  {contentTypeIcons[lesson.contentType] || <FileText className="h-4 w-4" />}
                                  <div>
                                    <p className="text-sm">{lesson.title}</p>
                                    {lesson.titleFr && (
                                      <p className="text-xs text-muted-foreground">{lesson.titleFr}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {lesson.isPreview ? (
                                    <Badge variant="outline" className="text-[10px]">Preview</Badge>
                                  ) : (
                                    <Lock className="h-3 w-3" />
                                  )}
                                  <span>{lesson.estimatedMinutes || 10} min</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No modules yet</p>
                    <p className="text-xs">Add modules and lessons in the Course Builder</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>Course not found</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
