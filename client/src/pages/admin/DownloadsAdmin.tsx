import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  FolderDown,
  Plus,
  Download,
  FileText,
  Edit,
  BarChart3,
  MoreVertical,
  Trash2,
  ExternalLink,
  FileSpreadsheet,
  FileArchive,
  File,
  Search,
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface ResourceForm {
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  requiresEnrollment: boolean;
}

const emptyForm: ResourceForm = {
  title: "",
  titleFr: "",
  description: "",
  descriptionFr: "",
  fileUrl: "",
  fileName: "",
  fileType: "pdf",
  requiresEnrollment: true,
};

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-600" />;
    case "docx":
      return <FileText className="h-5 w-5 text-blue-600" />;
    case "xlsx":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "zip":
      return <FileArchive className="h-5 w-5 text-amber-600" />;
    default:
      return <File className="h-5 w-5 text-gray-600" />;
  }
}

function getFileTypeBadgeColor(fileType: string) {
  switch (fileType) {
    case "pdf":
      return "bg-red-50 text-red-700 border-red-200";
    case "docx":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "xlsx":
      return "bg-green-50 text-green-700 border-green-200";
    case "zip":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 dark:bg-background text-gray-700 dark:text-muted-foreground border-gray-200";
  }
}

export default function DownloadsAdmin() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingResource, setDeletingResource] = useState<any>(null);
  const [form, setForm] = useState<ResourceForm>({ ...emptyForm });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: downloads,
    isLoading,
    refetch,
  } = trpc.kajabiDownloadsAdmin.list.useQuery();
  const { data: stats } = trpc.kajabiDownloadsAdmin.getStats.useQuery();

  const createMutation = trpc.kajabiDownloadsAdmin.create.useMutation({
    onSuccess: () => {
      toast.success("Resource created successfully");
      setCreateOpen(false);
      setForm({ ...emptyForm });
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to create resource"),
  });

  const updateMutation = trpc.kajabiDownloadsAdmin.update.useMutation({
    onSuccess: () => {
      toast.success("Resource updated successfully");
      setEditOpen(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to update resource"),
  });

  const deleteMutation = trpc.kajabiDownloadsAdmin.delete.useMutation({
    onSuccess: () => {
      toast.success("Resource deleted");
      setDeleteOpen(false);
      setDeletingResource(null);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Failed to delete resource"),
  });

  const resourceList = Array.isArray(downloads) ? downloads : [];
  const filteredList = searchQuery
    ? resourceList.filter(
        (r: any) =>
          r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.titleFr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resourceList;

  const handleCreate = () => {
    if (!form.title || !form.fileUrl || !form.fileName) {
      toast.error("Title, file URL, and file name are required");
      return;
    }
    createMutation.mutate({
      title: form.title,
      titleFr: form.titleFr || undefined,
      description: form.description || undefined,
      descriptionFr: form.descriptionFr || undefined,
      fileUrl: form.fileUrl,
      fileName: form.fileName,
      fileType: form.fileType,
      requiresEnrollment: form.requiresEnrollment,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updateMutation.mutate({
      id: editingId,
      title: form.title || undefined,
      titleFr: form.titleFr || undefined,
      description: form.description || undefined,
      descriptionFr: form.descriptionFr || undefined,
      fileUrl: form.fileUrl || undefined,
      fileName: form.fileName || undefined,
      fileType: form.fileType || undefined,
      requiresEnrollment: form.requiresEnrollment,
    });
  };

  const openEdit = (resource: any) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title || "",
      titleFr: resource.titleFr || "",
      description: resource.description || "",
      descriptionFr: resource.descriptionFr || "",
      fileUrl: resource.fileUrl || "",
      fileName: resource.fileName || "",
      fileType: resource.fileType || "pdf",
      requiresEnrollment: resource.requiresEnrollment ?? true,
    });
    setEditOpen(true);
  };

  const openDelete = (resource: any) => {
    setDeletingResource(resource);
    setDeleteOpen(true);
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resource Library</h1>
          <p className="text-sm text-muted-foreground">
            Manage downloadable resources — PDFs, worksheets, templates, and
            more.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setForm({ ...emptyForm });
            setCreateOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> New Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <FolderDown className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {stats?.totalResources ?? resourceList.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Resources</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {stats?.totalDownloads ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Total Downloads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {resourceList.length > 0
                  ? Math.round(
                      (stats?.totalDownloads ?? 0) / resourceList.length
                    )
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg Downloads</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      {resourceList.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Resource List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : resourceList.length === 0 ? (
        <EmptyState
          icon={FolderDown}
          title="No downloadable resources yet"
          description="Upload PDFs, worksheets, templates, and other resources for your students. Resources can be linked to specific courses, modules, or lessons."
          actionLabel="Upload Resource"
          onAction={() => {
            setForm({ ...emptyForm });
            setCreateOpen(true);
          }}
        />
      ) : filteredList.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">No resources match your search</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredList.map((dl: any) => (
            <Card
              key={dl.id}
              className="hover:shadow-sm transition-shadow group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                    {getFileIcon(dl.fileType || "pdf")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{dl.title}</p>
                      {dl.titleFr && (
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          FR
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getFileTypeBadgeColor(dl.fileType || "pdf")}`}
                      >
                        {(dl.fileType || "pdf").toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {dl.downloadCount || 0} downloads
                      </span>
                      {dl.fileSizeBytes && (
                        <span className="text-xs text-muted-foreground">
                          • {formatBytes(dl.fileSizeBytes)}
                        </span>
                      )}
                      {dl.requiresEnrollment === false && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(dl)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    {dl.fileUrl && (
                      <DropdownMenuItem
                        onClick={() => window.open(dl.fileUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Open File
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => openDelete(dl)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Downloadable Resource</DialogTitle>
            <DialogDescription>
              Add a new downloadable resource to the library. Fill in both
              English and French fields for bilingual support.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>
                  Title (EN) <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Resource title"
                />
              </div>
              <div>
                <Label>Title (FR)</Label>
                <Input
                  value={form.titleFr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleFr: e.target.value }))
                  }
                  placeholder="Titre de la ressource"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="What is this resource about?"
                  rows={3}
                />
              </div>
              <div>
                <Label>Description (FR)</Label>
                <Textarea
                  value={form.descriptionFr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descriptionFr: e.target.value }))
                  }
                  placeholder="De quoi traite cette ressource?"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label>
                File URL <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
                placeholder="https://cdn.example.com/resource.pdf"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Direct link to the file hosted on your CDN or storage
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>
                  File Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.fileName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileName: e.target.value }))
                  }
                  placeholder="resource.pdf"
                />
              </div>
              <div>
                <Label>File Type</Label>
                <Select
                  value={form.fileType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, fileType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                    <SelectItem value="xlsx">Spreadsheet</SelectItem>
                    <SelectItem value="pptx">Presentation</SelectItem>
                    <SelectItem value="zip">ZIP Archive</SelectItem>
                    <SelectItem value="mp3">Audio (MP3)</SelectItem>
                    <SelectItem value="mp4">Video (MP4)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">
                  Requires Enrollment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Only enrolled students can download this resource
                </p>
              </div>
              <Switch
                checked={form.requiresEnrollment}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, requiresEnrollment: v }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !form.title ||
                !form.fileUrl ||
                !form.fileName ||
                createMutation.isPending
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the resource details. Changes are saved immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Title (EN)</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Title (FR)</Label>
                <Input
                  value={form.titleFr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleFr: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Description (FR)</Label>
                <Textarea
                  value={form.descriptionFr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descriptionFr: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label>File URL</Label>
              <Input
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>File Name</Label>
                <Input
                  value={form.fileName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fileName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>File Type</Label>
                <Select
                  value={form.fileType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, fileType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                    <SelectItem value="xlsx">Spreadsheet</SelectItem>
                    <SelectItem value="pptx">Presentation</SelectItem>
                    <SelectItem value="zip">ZIP Archive</SelectItem>
                    <SelectItem value="mp3">Audio (MP3)</SelectItem>
                    <SelectItem value="mp4">Video (MP4)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">
                  Requires Enrollment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Only enrolled students can download this resource
                </p>
              </div>
              <Switch
                checked={form.requiresEnrollment}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, requiresEnrollment: v }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingResource?.title}
              &quot;? This will also remove all download tracking records. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingResource &&
                deleteMutation.mutate({ id: deletingResource.id })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
