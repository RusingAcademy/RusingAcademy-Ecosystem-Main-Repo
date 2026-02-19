import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, Plus, Trash2, Users, Filter } from "lucide-react";

export default function Learner360() {
  const [showTagForm, setShowTagForm] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [tagColor, setTagColor] = useState("#6366f1");
  const [tagCategory, setTagCategory] = useState<"level" | "interest" | "status" | "custom">("custom");

  const { data: tags, refetch: refetchTags } = trpc.learner360.listTags.useQuery();
  const { data: segments, refetch: refetchSegments } = trpc.learner360.listSegments.useQuery();

  const createTagMutation = trpc.learner360.createTag.useMutation({
    onSuccess: () => { toast.success("Tag created"); refetchTags(); setShowTagForm(false); setTagName(""); setTagSlug(""); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteTagMutation = trpc.learner360.deleteTag.useMutation({
    onSuccess: () => { toast.success("Tag deleted"); refetchTags(); },
  });

  const categoryColors: Record<string, string> = {
    level: "bg-blue-500/20 text-blue-400",
    interest: "bg-green-500/20 text-green-400",
    status: "bg-orange-500/20 text-orange-400",
    custom: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="h-6 w-6 text-indigo-400" /> Learner 360 &amp; Tags
          </h2>
          <p className="text-slate-400 mt-1">Manage learner tags, segments, and 360-degree profiles</p>
        </div>
        <Button onClick={() => setShowTagForm(!showTagForm)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> New Tag
        </Button>
      </div>

      {showTagForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">Create Tag</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Input placeholder="Tag name" value={tagName} onChange={(e) => { setTagName(e.target.value); setTagSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} className="bg-slate-900 border-slate-600 text-white" />
              <Input placeholder="Slug" value={tagSlug} onChange={(e) => setTagSlug(e.target.value)} className="bg-slate-900 border-slate-600 text-white" />
              <Input type="color" value={tagColor} onChange={(e) => setTagColor(e.target.value)} className="bg-slate-900 border-slate-600 h-10" />
              <select value={tagCategory} onChange={(e) => setTagCategory(e.target.value as any)} className="h-10 rounded-md bg-slate-900 border border-slate-600 text-white px-3">
                <option value="level">Level</option>
                <option value="interest">Interest</option>
                <option value="status">Status</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <Button onClick={() => createTagMutation.mutate({ name: tagName, slug: tagSlug, color: tagColor, category: tagCategory })} disabled={!tagName || !tagSlug || createTagMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
              {createTagMutation.isPending ? "Creating..." : "Create Tag"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Tag className="h-5 w-5" /> Tags ({tags?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag: any) => (
                <div key={tag.id} className="flex items-center gap-1 px-3 py-1 rounded-full border border-slate-600 bg-slate-900">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="text-sm text-white">{tag.name}</span>
                  <Badge className={`text-xs ${categoryColors[tag.category] || categoryColors.custom}`}>{tag.category}</Badge>
                  <button onClick={() => deleteTagMutation.mutate({ id: tag.id })} className="ml-1 text-red-400 hover:text-red-300">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {(!tags || tags.length === 0) && <p className="text-slate-400 text-sm">No tags yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Filter className="h-5 w-5" /> Segments ({segments?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {segments?.map((seg: any) => (
              <div key={seg.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                  <span className="text-white font-medium">{seg.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{seg.memberCount} members</span>
                </div>
                <Badge className={seg.isActive ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                  {seg.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
            {(!segments || segments.length === 0) && <p className="text-slate-400 text-sm">No segments yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
