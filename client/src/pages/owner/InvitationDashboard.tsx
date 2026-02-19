/**
 * InvitationDashboard — Enhanced invitation management with analytics,
 * bulk invites, templates, and tracking. Part of Auth Phase 4.
 */
import { useState } from "react";
import OwnerLayout from "@/components/OwnerLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail, Users, CheckCircle, Clock, XCircle, AlertTriangle,
  Send, Plus, Trash2, RotateCcw, TrendingUp, BarChart3,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// ─── Analytics Cards ─────────────────────────────────────────────────────────
function InvitationAnalytics() {
  const { data, isLoading } = trpc.invitationEnhancements.getAnalytics.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm">
            <CardContent className="pt-6"><div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Invitations", value: data?.total ?? 0, icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending", value: data?.pending ?? 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Accepted", value: data?.accepted ?? 0, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Conversion Rate", value: `${data?.conversionRate ?? 0}%`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Bulk Invite Form ────────────────────────────────────────────────────────
function BulkInviteForm() {
  const { language } = useLanguage();
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<"learner" | "coach" | "hr_admin" | "admin">("learner");
  const [template, setTemplate] = useState<"default" | "welcome" | "team" | "vip">("default");
  const [customMessage, setCustomMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const utils = trpc.useUtils();
  const bulkInvite = trpc.invitationEnhancements.bulkInvite.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.summary.sent} invitation(s) sent, ${data.summary.skipped} skipped`);
      setEmails("");
      setCustomMessage("");
      setIsOpen(false);
      utils.invitations.list.invalidate();
      utils.invitationEnhancements.getAnalytics.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: templates } = trpc.invitationEnhancements.getTemplates.useQuery();

  const handleSubmit = () => {
    const emailList = emails
      .split(/[,;\n]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailList.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }

    if (emailList.length > 50) {
      toast.error("Maximum 50 emails per batch");
      return;
    }

    bulkInvite.mutate({
      emails: emailList,
      role,
      template,
      customMessage: customMessage || undefined,
      language: language as "en" | "fr",
    });
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        {language === "fr" ? "Inviter des utilisateurs" : "Invite Users"}
      </Button>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-500" />
          {language === "fr" ? "Invitations en lot" : "Bulk Invitations"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            {language === "fr" ? "Adresses courriel (une par ligne ou séparées par des virgules)" : "Email addresses (one per line or comma-separated)"}
          </label>
          <textarea
            className="w-full min-h-[100px] p-3 border rounded-lg text-sm bg-background resize-y focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {emails.split(/[,;\n]+/).filter((e) => e.trim()).length} email(s) — max 50 per batch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{language === "fr" ? "Rôle" : "Role"}</label>
            <select
              className="w-full p-2 border rounded-lg text-sm bg-background"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="learner">{language === "fr" ? "Apprenant" : "Learner"}</option>
              <option value="coach">Coach</option>
              <option value="hr_admin">{language === "fr" ? "Admin RH" : "HR Admin"}</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{language === "fr" ? "Modèle de courriel" : "Email Template"}</label>
            <select
              className="w-full p-2 border rounded-lg text-sm bg-background"
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
            >
              {(templates?.templates || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {language === "fr" ? t.nameFr : t.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            {language === "fr" ? "Message personnalisé (optionnel)" : "Custom Message (optional)"}
          </label>
          <Input
            placeholder={language === "fr" ? "Ajoutez un message personnel..." : "Add a personal message..."}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {language === "fr" ? "Annuler" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={bulkInvite.isPending} className="gap-2">
            <Send className="h-4 w-4" />
            {bulkInvite.isPending
              ? (language === "fr" ? "Envoi en cours..." : "Sending...")
              : (language === "fr" ? "Envoyer les invitations" : "Send Invitations")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Invitation List ─────────────────────────────────────────────────────────
function InvitationList() {
  const { language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: invitations, isLoading } = trpc.invitations.list.useQuery({ status: statusFilter as any });

  const utils = trpc.useUtils();
  const revoke = trpc.invitations.revoke.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Invitation révoquée" : "Invitation revoked");
      utils.invitations.list.invalidate();
      utils.invitationEnhancements.getAnalytics.invalidate();
    },
  });
  const resend = trpc.invitations.resend.useMutation({
    onSuccess: () => {
      toast.success(language === "fr" ? "Invitation renvoyée" : "Invitation resent");
      utils.invitations.list.invalidate();
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    accepted: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    revoked: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    expired: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
  };

  const statusFilters = [
    { value: "all", label: language === "fr" ? "Toutes" : "All" },
    { value: "pending", label: language === "fr" ? "En attente" : "Pending" },
    { value: "accepted", label: language === "fr" ? "Acceptées" : "Accepted" },
    { value: "expired", label: language === "fr" ? "Expirées" : "Expired" },
    { value: "revoked", label: language === "fr" ? "Révoquées" : "Revoked" },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          {language === "fr" ? "Invitations" : "Invitations"}
        </CardTitle>
        <div className="flex gap-1">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        ) : !invitations || invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {language === "fr" ? "Aucune invitation trouvée" : "No invitations found"}
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {(invitations as any[]).map((inv: any) => (
              <div
                key={inv.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{inv.email}</span>
                    <Badge variant="outline" className="text-xs capitalize">{inv.role}</Badge>
                    <Badge className={`text-xs ${statusColors[inv.status] || ""}`}>{inv.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === "fr" ? "Invité par" : "Invited by"} {inv.inviterName} — {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {inv.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => resend.mutate({ invitationId: inv.id })}
                        title={language === "fr" ? "Renvoyer" : "Resend"}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => revoke.mutate({ invitationId: inv.id })}
                        title={language === "fr" ? "Révoquer" : "Revoke"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function InvitationDashboard() {
  const { language } = useLanguage();

  return (
    <OwnerLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#192524] dark:text-white">
              {language === "fr" ? "Gestion des invitations" : "Invitation Management"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "fr"
                ? "Envoyez, suivez et gérez les invitations d'utilisateurs"
                : "Send, track, and manage user invitations"}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="mb-6">
        <InvitationAnalytics />
      </div>

      {/* Bulk Invite */}
      <div className="mb-6">
        <BulkInviteForm />
      </div>

      {/* Invitation List */}
      <InvitationList />
    </OwnerLayout>
  );
}
