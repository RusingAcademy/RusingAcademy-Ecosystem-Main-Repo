/**
 * Sprint 48 — File Attachments & Receipt Upload
 * Reusable component for uploading and managing file attachments on any entity
 */
import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Upload, Paperclip, Trash2, Loader2, File, Image, FileText } from "lucide-react";
import { toast } from "sonner";

interface FileAttachmentsProps {
  entityType: string;
  entityId: number;
}

const fileIcons: Record<string, any> = {
  image: Image,
  pdf: FileText,
  default: File,
};

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return File;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf")) return FileText;
  return File;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileAttachments({ entityType, entityId }: FileAttachmentsProps) {
  const { data: attachments, isLoading, refetch } = trpc.attachments.list.useQuery(
    { entityType, entityId },
    { enabled: entityId > 0 }
  );
  const deleteMutation = trpc.attachments.delete.useMutation({
    onSuccess: () => { toast.success("Attachment removed"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", entityType);
      formData.append("entityId", String(entityId));

      const res = await fetch("/api/upload-attachment", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success("File uploaded");
        refetch();
      } else {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        toast.error(err.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const items = (attachments as any[]) || [];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip size={12} /> Attachments ({items.length})
        </h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          />
          <button aria-label="Action"
            className="qb-btn-outline flex items-center gap-1.5 text-xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {uploading ? "Uploading..." : "Attach File"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-300" size={16} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-border dark:border-border rounded-lg">
          <Paperclip size={24} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No attachments yet</p>
          <button
            className="text-xs text-sky-600 hover:underline mt-1"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload a file
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((att: any) => {
            const Icon = getFileIcon(att.mimeType);
            return (
              <div key={att.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-background rounded-lg hover:bg-gray-100 dark:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-gray-400" />
                  <div>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-sky-600 hover:underline"
                    >
                      {att.fileName}
                    </a>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(att.fileSize)} · {att.createdAt ? new Date(att.createdAt).toLocaleDateString("en-CA") : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { if (confirm("Remove this attachment?")) deleteMutation.mutate({ id: att.id }); }}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
