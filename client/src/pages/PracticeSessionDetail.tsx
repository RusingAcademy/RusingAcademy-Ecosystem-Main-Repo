import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  TrendingUp,
  User,
  Bot,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Practice Session Detail", description: "Manage and configure practice session detail" },
  fr: { title: "Practice Session Detail", description: "Gérer et configurer practice session detail" },
};

// Coach images mapping
const coachImages: Record<string, string> = {
  steven: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Steven(2).webp",
  sue_anne: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Steven(2).webp",
  erika: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Steven(2).webp",
  preciosa: "https://rusingacademy-cdn.b-cdn.net/images/coaches/Preciosa2.webp",
};

const coachNames: Record<string, string> = {
  steven: "Coach Steven",
  sue_anne: "Coach Steven",
  erika: "Coach Steven",
  preciosa: "Coach Preciosa",
};

const levelColors: Record<string, string> = {
  A: "bg-green-500/20 text-green-400 border-green-500/30",
  B: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  C: "bg-red-500/20 text-red-400 border-red-500/30",
};

const skillLabels: Record<string, string> = {
  oral_expression: "Expression orale",
  written_expression: "Expression écrite",
  oral_comprehension: "Compréhension orale",
  written_comprehension: "Compréhension écrite",
};

export default function PracticeSessionDetail() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const params = useParams<{ sessionId: string }>();
  const sessionId = Number(params.sessionId);
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, error } = trpc.sleCompanion.getSessionMessages.useQuery(
    { sessionId },
    { enabled: !!user && !isNaN(sessionId) }
  );

  const session = data?.session;
  const messages = data?.messages || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (!messages.length) return { userMsgs: 0, coachMsgs: 0, avgScore: 0, duration: 0 };
    const userMsgs = messages.filter((m) => m.role === "user").length;
    const coachMsgs = messages.filter((m) => m.role === "assistant").length;
    const scores = messages.filter((m) => m.score != null).map((m) => m.score!);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const firstMsg = messages[0]?.createdAt ? new Date(messages[0].createdAt).getTime() : 0;
    const lastMsg = messages[messages.length - 1]?.createdAt
      ? new Date(messages[messages.length - 1].createdAt).getTime()
      : 0;
    const duration = firstMsg && lastMsg ? Math.round((lastMsg - firstMsg) / 1000) : 0;
    return { userMsgs, coachMsgs, avgScore, duration };
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const handleDownloadTranscript = () => {
    if (!session || !messages.length) return;
    const coachName = coachNames[session.coach?.id || ""] || "Coach";
    const lines = messages.map((m) => {
      const time = m.createdAt ? format(new Date(m.createdAt), "HH:mm:ss") : "";
      const speaker = m.role === "user" ? "Vous" : coachName;
      const scoreStr = m.score != null ? ` [Score: ${m.score}/100]` : "";
      return `[${time}] ${speaker}${scoreStr}:\n${m.content}\n`;
    });
    const header = `TRANSCRIPTION DE SESSION SLE — RusingÂcademy
================================================
Coach: ${coachName}
Niveau: ${session.level || "B"}
Compétence: ${skillLabels[session.skill] || session.skill}
Date: ${session.createdAt ? format(new Date(session.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr }) : ""}
Durée: ${formatDuration(stats.duration)}
Messages: ${messages.length}
Score moyen: ${stats.avgScore}/100
================================================\n\n`;
    const blob = new Blob([header + lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-sle-${sessionId}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcription téléchargée!");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian via-teal-900 to-obsidian p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian via-teal-900 to-obsidian flex items-center justify-center p-6">
        <Card className="max-w-md bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/5 border-white/60">
          <CardHeader>
            <CardTitle className="text-white">Connexion requise</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500" onClick={() => toast.info("Se connecter")}>
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-obsidian via-teal-900 to-obsidian flex items-center justify-center p-6">
        <Card className="max-w-md bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/5 border-white/60">
          <CardHeader>
            <CardTitle className="text-white">Session introuvable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-300 mb-4">
              Cette session n'existe pas ou vous n'y avez pas accès.
            </p>
            <Link href="/practice-history">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500" onClick={() => toast.info("Retour à l'historique")}>
                Retour à l'historique
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coachId = session.coach?.id || "";
  const coachName = coachNames[coachId] || "Coach";
  const coachImage = coachImages[coachId] || coachImages.steven;

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian via-teal-900 to-obsidian p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/practice-history">
              <Button variant="ghost" className="text-white hover:bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Détail de la session</h1>
              <p className="text-cyan-300 text-sm">
                {session.createdAt
                  ? format(new Date(session.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })
                  : ""}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-white/60 text-white hover:bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/10"
            onClick={handleDownloadTranscript}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>

        {/* Session Info Card */}
        <Card className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/5 border-white/60 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <img
                loading="lazy"
                src={coachImage}
                alt={coachName}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/30"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">{coachName}</h2>
                <div className="flex items-center gap-3">
                  <Badge className={levelColors[session.level || "B"]}>
                    Niveau {session.level || "B"}
                  </Badge>
                  <Badge variant="outline" className="border-white/60 text-white/90">
                    {skillLabels[session.skill] || session.skill}
                  </Badge>
                  <Badge
                    className={
                      session.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }
                  >
                    {session.status === "completed" ? "Terminé" : "En cours"}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <p className="text-lg font-semibold text-white">{formatDuration(stats.duration)}</p>
                  <p className="text-xs text-cyan-300">Durée</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <p className="text-lg font-semibold text-white">{messages.length}</p>
                  <p className="text-xs text-cyan-300">Messages</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <p className="text-lg font-semibold text-white">{stats.avgScore}/100</p>
                  <p className="text-xs text-cyan-300">Score</p>
                </div>
              </div>
            </div>

            {/* Score Progress */}
            {stats.avgScore > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cyan-300">Performance globale</span>
                  <span
                    className={
                      stats.avgScore >= 80
                        ? "text-green-400"
                        : stats.avgScore >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                    }
                  >
                    {stats.avgScore}%
                  </span>
                </div>
                <Progress value={stats.avgScore} className="h-2 bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/10" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md/5 border-white/60">
          <CardHeader>
            <CardTitle className="text-white text-lg">Conversation complète</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-cyan-300 text-center py-8">Aucun message dans cette session.</p>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {isUser ? (
                        <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-cyan-400" />
                        </div>
                      ) : (
                        <img
                          loading="lazy"
                          src={coachImage}
                          alt={coachName}
                          className="w-9 h-9 rounded-full object-cover border border-purple-400/30"
                        />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? "bg-cyan-500/15 border border-cyan-400/20"
                          : "bg-purple-500/15 border border-purple-400/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            isUser ? "text-cyan-400" : "text-purple-400"
                          }`}
                        >
                          {isUser ? "Vous" : coachName}
                        </span>
                        {msg.createdAt && (
                          <span className="text-xs text-white/40">
                            {format(new Date(msg.createdAt), "HH:mm")}
                          </span>
                        )}
                        {msg.score != null && (
                          <Badge
                            className={`text-[10px] px-1.5 py-0 ${
                              msg.score >= 80
                                ? "bg-green-500/20 text-green-400"
                                : msg.score >= 60
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {msg.score}/100
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {/* Feedback */}
                      {msg.feedback && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-xs text-amber-300/80 italic">{msg.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
