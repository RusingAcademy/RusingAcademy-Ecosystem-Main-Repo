import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Admin Reviews", description: "Manage and configure admin reviews" },
  fr: { title: "Admin Reviews", description: "Gérer et configurer admin reviews" },
};

  Star, Search, Eye, EyeOff, MessageSquare, Trash2,
  Shield, RefreshCw,
} from "lucide-react";

export default function AdminReviews() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");

  const { data: reviews, isLoading, refetch } = trpc.adminReviews.getAll.useQuery(undefined, { retry: 1 });
  const { data: stats } = trpc.adminReviews.getStats.useQuery();

  const toggleVisibility = trpc.adminReviews.toggleVisibility.useMutation({
    onSuccess: (data) => {
      toast.success(data.isVisible ? "Review made visible" : "Review hidden");
      refetch();
    },
    onError: () => toast.error("Failed to toggle visibility"),
  });

  const respondMut = trpc.adminReviews.respond.useMutation({
    onSuccess: () => {
      toast.success("Response saved");
      setRespondDialogOpen(false);
      setResponseText("");
      refetch();
    },
    onError: () => toast.error("Failed to save response"),
  });

  const deleteMut = trpc.adminReviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Review deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const filtered = useMemo(() => {
    if (!reviews) return [];
    return (reviews as any[]).filter((r: any) => {
      const matchesSearch = !searchQuery ||
        r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = ratingFilter === "all" || String(r.rating) === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>)}
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold">Reviews & Ratings</h1>
            <p className="text-muted-foreground">Moderate course reviews from learners</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground uppercase">Total</p><p className="text-2xl font-bold">{stats?.total ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground uppercase">Avg Rating</p><p className="text-2xl font-bold">{stats?.avgRating ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground uppercase">Visible</p><p className="text-2xl font-bold text-green-600">{stats?.visible ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground uppercase">Hidden</p><p className="text-2xl font-bold text-red-600">{stats?.hidden ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground uppercase">Responded</p><p className="text-2xl font-bold text-blue-600">{stats?.withResponse ?? 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by student, course, or comment..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Course Reviews ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-6 md:py-8 lg:py-12 text-center text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No reviews found</p>
              <p className="text-sm mt-1">Reviews will appear here when learners rate courses.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div><p className="font-medium text-sm">{r.userName || "Unknown"}</p><p className="text-xs text-muted-foreground">{r.userEmail}</p></div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-sm">{r.courseName || "N/A"}</TableCell>
                    <TableCell>{renderStars(r.rating)}</TableCell>
                    <TableCell className="max-w-[250px]">
                      <p className="text-sm truncate">{r.title && <span className="font-medium">{r.title}: </span>}{r.comment || "No comment"}</p>
                      {r.instructorResponse && <p className="text-xs text-blue-600 mt-0.5 truncate">↳ {r.instructorResponse}</p>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {r.isVisible ? <Badge variant="default" className="text-xs">Visible</Badge> : <Badge variant="destructive" className="text-xs">Hidden</Badge>}
                        {r.isVerifiedPurchase && <Badge variant="outline" className="text-xs"><Shield className="h-3 w-3 mr-0.5" /> Verified</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => toggleVisibility.mutate({ reviewId: r.id })} title={r.isVisible ? "Hide" : "Show"}>
                          {r.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedReviewId(r.id); setResponseText(r.instructorResponse || ""); setRespondDialogOpen(true); }} title="Respond">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if (confirm("Delete this review permanently?")) deleteMut.mutate({ reviewId: r.id }); }} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Respond to Review</DialogTitle></DialogHeader>
          <Textarea placeholder="Write your response..." value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={4} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={() => { if (selectedReviewId && responseText.trim()) respondMut.mutate({ reviewId: selectedReviewId, response: responseText.trim() }); }} disabled={!responseText.trim() || respondMut.isPending}>
              {respondMut.isPending ? "Saving..." : "Save Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
