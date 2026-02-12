import { useEffect, useState } from "react";
import { Bell, BellOff, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PushNotificationManagerProps {
  className?: string;
  language?: "en" | "fr";
  compact?: boolean;
}

/**
 * PushNotificationManager provides a UI for managing browser push notification
 * preferences. It checks for Notification API support, requests permission,
 * and allows users to toggle notifications on/off.
 */
export default function PushNotificationManager({
  className,
  language = "en",
  compact = false,
}: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const labels = {
    en: {
      title: "Push Notifications",
      description: "Get notified about upcoming sessions, new messages, and important updates.",
      enable: "Enable Notifications",
      disable: "Disable Notifications",
      enabled: "Notifications enabled",
      denied: "Notifications blocked",
      deniedHelp: "Please enable notifications in your browser settings.",
      unsupported: "Push notifications are not supported in this browser.",
    },
    fr: {
      title: "Notifications push",
      description: "Recevez des notifications pour vos sessions, messages et mises à jour importantes.",
      enable: "Activer les notifications",
      disable: "Désactiver les notifications",
      enabled: "Notifications activées",
      denied: "Notifications bloquées",
      deniedHelp: "Veuillez activer les notifications dans les paramètres de votre navigateur.",
      unsupported: "Les notifications push ne sont pas prises en charge dans ce navigateur.",
    },
  };

  const l = labels[language];

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch {
      // Permission request failed
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    if (compact) return null;
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">{l.unsupported}</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {permission === "granted" ? (
          <Bell className="h-4 w-4 text-emerald-500" />
        ) : (
          <BellOff className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm">
          {permission === "granted" ? l.enabled : l.title}
        </span>
        {permission === "default" && (
          <Button size="sm" variant="outline" onClick={requestPermission} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : l.enable}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4" />
          {l.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{l.description}</p>

        {permission === "granted" && (
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">{l.enabled}</span>
          </div>
        )}

        {permission === "denied" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">{l.denied}</span>
            </div>
            <p className="text-xs text-muted-foreground">{l.deniedHelp}</p>
          </div>
        )}

        {permission === "default" && (
          <Button onClick={requestPermission} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bell className="h-4 w-4 mr-2" />
            )}
            {l.enable}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
