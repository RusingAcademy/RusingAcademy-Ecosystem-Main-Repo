/**
 * NotificationPreferences — Learner notification preferences panel
 * Sprint C3: Allows learners to control which notification types they receive
 */
import { useState } from "react";
import { Bell, BookOpen, Trophy, GraduationCap, MessageSquare, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationPref {
  key: string;
  icon: React.ElementType;
  labelEn: string;
  labelFr: string;
  descEn: string;
  descFr: string;
  enabled: boolean;
}

const defaultPrefs: NotificationPref[] = [
  {
    key: "enrollment",
    icon: BookOpen,
    labelEn: "Enrollment Confirmations",
    labelFr: "Confirmations d'inscription",
    descEn: "Receive notifications when you enroll in a course or path",
    descFr: "Recevoir des notifications lors de l'inscription à un cours ou parcours",
    enabled: true,
  },
  {
    key: "completion",
    icon: GraduationCap,
    labelEn: "Course Completion",
    labelFr: "Fin de cours",
    descEn: "Receive notifications when you complete a course",
    descFr: "Recevoir des notifications lorsque vous terminez un cours",
    enabled: true,
  },
  {
    key: "quiz_result",
    icon: MessageSquare,
    labelEn: "Quiz Results",
    labelFr: "Résultats de quiz",
    descEn: "Receive notifications with your quiz scores",
    descFr: "Recevoir des notifications avec vos résultats de quiz",
    enabled: true,
  },
  {
    key: "badges",
    icon: Trophy,
    labelEn: "Badges & Milestones",
    labelFr: "Badges et jalons",
    descEn: "Receive notifications when you earn badges or reach milestones",
    descFr: "Recevoir des notifications lorsque vous obtenez des badges ou atteignez des jalons",
    enabled: true,
  },
  {
    key: "broadcast",
    icon: Megaphone,
    labelEn: "Announcements",
    labelFr: "Annonces",
    descEn: "Receive important announcements from RusingAcademy",
    descFr: "Recevoir les annonces importantes de RusingAcademy",
    enabled: true,
  },
];

export function NotificationPreferences() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Load preferences from localStorage (simple client-side storage)
  const [prefs, setPrefs] = useState<NotificationPref[]>(() => {
    try {
      const saved = localStorage.getItem("ra_notification_prefs");
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return defaultPrefs.map(p => ({
          ...p,
          enabled: parsed[p.key] ?? p.enabled,
        }));
      }
    } catch { /* ignore */ }
    return defaultPrefs;
  });

  const handleToggle = (key: string) => {
    setPrefs(prev => {
      const updated = prev.map(p =>
        p.key === key ? { ...p, enabled: !p.enabled } : p
      );
      // Persist to localStorage
      const prefsMap: Record<string, boolean> = {};
      updated.forEach(p => { prefsMap[p.key] = p.enabled; });
      localStorage.setItem("ra_notification_prefs", JSON.stringify(prefsMap));
      return updated;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#C65A1E]" />
          {isFr ? "Préférences de notification" : "Notification Preferences"}
        </CardTitle>
        <CardDescription>
          {isFr
            ? "Choisissez les types de notifications que vous souhaitez recevoir"
            : "Choose which types of notifications you want to receive"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prefs.map((pref) => {
          const Icon = pref.icon;
          return (
            <div
              key={pref.key}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#C65A1E]/10">
                  <Icon className="h-4 w-4 text-[#C65A1E]" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {isFr ? pref.labelFr : pref.labelEn}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isFr ? pref.descFr : pref.descEn}
                  </p>
                </div>
              </div>
              <Switch
                checked={pref.enabled}
                onCheckedChange={() => handleToggle(pref.key)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
