import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Calendar, Clock, Globe, Settings, AlertCircle,
  Loader2, CheckCircle, Video, ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { AvailabilityManager } from "@/components/AvailabilityManager";
import { CalendarSettingsCard } from "@/components/CalendarSettingsCard";
import { CoachCalendar } from "@/components/CoachCalendar";
import { useAppLayout } from "@/contexts/AppLayoutContext";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Ban, CalendarX } from "lucide-react";

function BlockedDatesCard({ coachId, isEn }: { coachId: number; isEn: boolean }) {
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [showForm, setShowForm] = useState(false);

  const utils = trpc.useUtils();
  const { data: blockedDates = [], isLoading } = trpc.coach.getBlockedDates.useQuery();

  const blockMutation = trpc.coach.blockDate.useMutation({
    onSuccess: () => {
      utils.coach.getBlockedDates.invalidate();
      setNewDate("");
      setNewReason("");
      setShowForm(false);
      toast.success(isEn ? "Date blocked successfully" : "Date bloquée avec succès");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unblockMutation = trpc.coach.unblockDate.useMutation({
    onSuccess: () => {
      utils.coach.getBlockedDates.invalidate();
      toast.success(isEn ? "Date unblocked" : "Date débloquée");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleBlock = () => {
    if (!newDate) {
      toast.error(isEn ? "Please select a date" : "Veuillez sélectionner une date");
      return;
    }
    blockMutation.mutate({ date: newDate, reason: newReason || undefined });
  };

  const handleUnblock = (id: number) => {
    unblockMutation.mutate({ id });
  };

  // Get today's date string for min attribute
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  // Separate into upcoming and past
  const upcoming = blockedDates.filter((d: any) => d.date >= todayStr);
  const past = blockedDates.filter((d: any) => d.date < todayStr);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarX className="h-5 w-5 text-amber-500" />
              {isEn ? "Blocked Dates & Vacations" : "Dates bloquées et vacances"}
            </CardTitle>
            <CardDescription className="mt-1">
              {isEn
                ? "Block specific dates when you're unavailable for sessions."
                : "Bloquez des dates spécifiques lorsque vous n'êtes pas disponible pour des sessions."}
            </CardDescription>
          </div>
          {!showForm && (
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {isEn ? "Block a Date" : "Bloquer une date"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new blocked date form */}
        {showForm && (
          <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {isEn ? "Date" : "Date"}
                </label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={todayStr}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {isEn ? "Reason (optional)" : "Raison (optionnel)"}
                </label>
                <Input
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder={isEn ? "e.g., Vacation, Personal day" : "ex. Vacances, Journée personnelle"}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setNewDate("");
                  setNewReason("");
                }}
              >
                {isEn ? "Cancel" : "Annuler"}
              </Button>
              <Button
                size="sm"
                onClick={handleBlock}
                disabled={blockMutation.isPending || !newDate}
                className="gap-1"
              >
                {blockMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {isEn ? "Block Date" : "Bloquer la date"}
              </Button>
            </div>
          </div>
        )}

        {/* Blocked dates list */}
        {isLoading ? (
          <div className="text-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : upcoming.length === 0 && !showForm ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {isEn
                ? "No blocked dates. Click \"Block a Date\" to mark days you're unavailable."
                : "Aucune date bloquée. Cliquez \"Bloquer une date\" pour marquer les jours où vous n'êtes pas disponible."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((bd: any) => {
              const d = new Date(bd.date + "T12:00:00");
              const formatted = d.toLocaleDateString(isEn ? "en-CA" : "fr-CA", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <div
                  key={bd.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Ban className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{formatted}</p>
                      {bd.reason && (
                        <p className="text-xs text-muted-foreground">{bd.reason}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnblock(bd.id)}
                    disabled={unblockMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Past blocked dates (collapsed) */}
        {past.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {isEn ? `${past.length} past blocked date(s)` : `${past.length} date(s) bloquée(s) passée(s)`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CoachAvailabilityPage() {
  const { isInsideAppLayout } = useAppLayout();
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const { data: coachProfile, isLoading: profileLoading } = trpc.coach.myProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Auth guard
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {!isInsideAppLayout && <Header />}
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        {!isInsideAppLayout && <Footer />}
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!coachProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {!isInsideAppLayout && <Header />}
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="pt-8 pb-8">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">
                {isEn ? "No Coach Profile Found" : "Aucun profil coach trouvé"}
              </h2>
              <Link href="/become-a-coach">
                <Button>{isEn ? "Become a Coach" : "Devenir coach"}</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        {!isInsideAppLayout && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-obsidian">
      {!isInsideAppLayout && <Header />}
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1200px] mx-auto">
          {/* Back Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/coach/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {isEn ? "Back to Dashboard" : "Retour au tableau de bord"}
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              {isEn ? "Availability & Calendar" : "Disponibilités et calendrier"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEn 
                ? "Manage your weekly availability, calendar integration, and session preferences." 
                : "Gérez vos disponibilités hebdomadaires, l'intégration de calendrier et vos préférences de session."}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Availability */}
              <AvailabilityManager />

              {/* Session Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {isEn ? "Session Preferences" : "Préférences de session"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{isEn ? "Session Duration" : "Durée de session"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">30 min</Badge>
                        <Badge variant="default">60 min</Badge>
                        <Badge variant="secondary">90 min</Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{isEn ? "Buffer Time" : "Temps tampon"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isEn ? "15 minutes between sessions" : "15 minutes entre les sessions"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{isEn ? "Advance Booking" : "Réservation à l'avance"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isEn ? "Up to 4 weeks ahead" : "Jusqu'à 4 semaines à l'avance"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{isEn ? "Session Type" : "Type de session"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">{isEn ? "Video Call" : "Appel vidéo"}</Badge>
                        <Badge variant="secondary">{isEn ? "Audio Only" : "Audio seul"}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blocked Dates */}
              <BlockedDatesCard coachId={coachProfile.id} isEn={isEn} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendar Integration */}
              <CalendarSettingsCard
                coachId={coachProfile.id}
                currentCalendarType={(coachProfile as any).calendarType || "internal"}
                currentCalendlyUrl={(coachProfile as any).calendlyUrl}
              />

              {/* Session Calendar View */}
              <CoachCalendar language={language} />

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    {isEn ? "Availability Tips" : "Conseils de disponibilité"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {isEn 
                        ? "Coaches with more availability slots get 3x more bookings on average." 
                        : "Les coachs avec plus de créneaux obtiennent en moyenne 3x plus de réservations."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {isEn 
                        ? "Evening slots (6-9 PM) are the most popular among federal public servants." 
                        : "Les créneaux du soir (18h-21h) sont les plus populaires auprès des fonctionnaires fédéraux."}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {isEn 
                        ? "Connect Calendly for automatic sync with your personal calendar." 
                        : "Connectez Calendly pour une synchronisation automatique avec votre calendrier personnel."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{isEn ? "Quick Links" : "Liens rapides"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/coach/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      {isEn ? "Dashboard" : "Tableau de bord"}
                    </Button>
                  </Link>
                  <Link href="/app/availability">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      {isEn ? "All Sessions" : "Toutes les sessions"}
                    </Button>
                  </Link>
                  <Link href="/app/coach-profile">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      {isEn ? "Edit Profile" : "Modifier le profil"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {!isInsideAppLayout && <Footer />}
    </div>
  );
}
