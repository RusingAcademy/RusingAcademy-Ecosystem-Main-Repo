/**
 * AdminBroadcastPanel — Admin panel for sending broadcast notifications
 * Sprint C3: Allows admins to send notifications to all users or filtered segments
 */
import { useState } from "react";
import { Megaphone, Send, Users, UserCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type TargetRole = "all" | "learner" | "coach";

export function AdminBroadcastPanel() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole>("all");
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  const broadcastMutation = trpc.adminDashboard.broadcastNotification.useMutation({
    onSuccess: (data) => {
      setLastResult(data);
      toast.success(`Notification sent to ${data.sent} of ${data.total} users`);
      setTitle("");
      setMessage("");
      setLink("");
    },
    onError: (error) => {
      toast.error(`Broadcast failed: ${error.message}`);
    },
  });

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    broadcastMutation.mutate({
      title: title.trim(),
      message: message.trim(),
      link: link.trim() || undefined,
      targetRole,
    });
  };

  const roleOptions: { value: TargetRole; label: string; icon: React.ElementType }[] = [
    { value: "all", label: "All Users", icon: Users },
    { value: "learner", label: "Learners Only", icon: UserCheck },
    { value: "coach", label: "Coaches Only", icon: UserCheck },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-cta" />
          Broadcast Notification
        </CardTitle>
        <CardDescription>
          Send a notification to all users or a specific segment. Notifications appear in the learner's notification bell.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Role Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Target Audience</label>
          <div className="flex gap-2">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <Button
                  key={opt.value}
                  variant={targetRole === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTargetRole(opt.value)}
                  className={targetRole === opt.value ? "bg-cta hover:bg-cta" : ""}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-1 block">Title</label>
          <Input
            placeholder="e.g., New Course Available!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground mt-1">{title.length}/200 characters</p>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium mb-1 block">Message</label>
          <Textarea
            placeholder="Write your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">{message.length}/2000 characters</p>
        </div>

        {/* Link (optional) */}
        <div>
          <label className="text-sm font-medium mb-1 block">Link (optional)</label>
          <Input
            placeholder="e.g., /courses/new-course"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Users will be directed to this link when clicking the notification</p>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={broadcastMutation.isPending || !title.trim() || !message.trim()}
          className="w-full bg-cta hover:bg-cta"
        >
          {broadcastMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Broadcast
            </>
          )}
        </Button>

        {/* Last Result */}
        {lastResult && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Successfully sent to {lastResult.sent} of {lastResult.total} users
              {lastResult.failed > 0 && ` (${lastResult.failed} failed)`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
