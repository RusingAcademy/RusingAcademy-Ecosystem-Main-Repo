import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationPermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

const DISMISS_KEY = "notification-banner-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SHOW_DELAY_MS = 60_000; // 60 seconds after page load

export function NotificationPermission({
  onPermissionGranted,
  onPermissionDenied,
}: NotificationPermissionProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [permission, setPermission] = useState<NotificationPermission | "default">("default");
  const [showBanner, setShowBanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Don't show if notifications aren't supported
    if (!("Notification" in window)) return;

    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    // Only show if permission hasn't been decided yet
    if (currentPermission !== "default") return;

    // Check if user dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < DISMISS_DURATION_MS) return;

    // Staged delay: show after 60 seconds
    const timer = setTimeout(() => setShowBanner(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    setIsRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowBanner(false);

      if (result === "granted") {
        onPermissionGranted?.();
        new Notification(
          isEn ? "Notifications Enabled!" : "Notifications Activées !",
          {
            body: isEn
              ? "You'll receive reminders for your sessions and badge achievements."
              : "Vous recevrez des rappels pour vos sessions et vos badges gagnés.",
            icon: "/favicon.ico",
            tag: "permission-granted",
          }
        );
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  // Don't render if not ready to show
  if (!showBanner || permission !== "default") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-sm">
      <Card className="border-primary/20 shadow-lg bg-card/95 backdrop-blur">
        <CardContent className="p-4">
          <button
            onClick={dismissBanner}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label={isEn ? "Dismiss" : "Fermer"}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm mb-1">
                {isEn ? "Stay Updated" : "Restez Informé"}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {isEn
                  ? "Get notified about session reminders and badge achievements."
                  : "Recevez des rappels de sessions et des notifications de badges."}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={requestPermission}
                  disabled={isRequesting}
                  className="text-xs"
                >
                  {isRequesting
                    ? isEn ? "Enabling..." : "Activation..."
                    : isEn ? "Enable" : "Activer"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={dismissBanner}
                  className="text-xs"
                >
                  {isEn ? "Not now" : "Plus tard"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to send notifications
export function useNotifications() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const sendNotification = (
    title: string,
    options?: NotificationOptions
  ): boolean => {
    if (!("Notification" in window)) return false;
    if (Notification.permission !== "granted") return false;

    try {
      new Notification(title, { icon: "/favicon.ico", ...options });
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  const notifySessionReminder = (
    sessionTitle: string,
    timeUntil: "24h" | "1h"
  ) => {
    const title = timeUntil === "24h"
      ? (isEn ? "Session Tomorrow" : "Session Demain")
      : (isEn ? "Session in 1 Hour" : "Session dans 1 Heure");

    const body = timeUntil === "24h"
      ? (isEn
          ? `Don't forget: "${sessionTitle}" is scheduled for tomorrow.`
          : `N'oubliez pas : "${sessionTitle}" est prévu pour demain.`)
      : (isEn
          ? `Your session "${sessionTitle}" starts in 1 hour.`
          : `Votre session "${sessionTitle}" commence dans 1 heure.`);

    return sendNotification(title, {
      body,
      tag: `session-reminder-${timeUntil}`,
      requireInteraction: timeUntil === "1h",
    });
  };

  const notifyBadgeEarned = (badgeName: string, xpEarned: number) => {
    return sendNotification(
      isEn ? "Badge Earned!" : "Badge Gagné !",
      {
        body: isEn
          ? `Congratulations! You earned the "${badgeName}" badge and ${xpEarned} XP!`
          : `Félicitations ! Vous avez gagné le badge "${badgeName}" et ${xpEarned} XP !`,
        tag: `badge-${badgeName}`,
      }
    );
  };

  const notifyNewMessage = (senderName: string) => {
    return sendNotification(
      isEn ? "New Message" : "Nouveau Message",
      {
        body: isEn
          ? `You have a new message from ${senderName}.`
          : `Vous avez un nouveau message de ${senderName}.`,
        tag: "new-message",
      }
    );
  };

  return {
    sendNotification,
    notifySessionReminder,
    notifyBadgeEarned,
    notifyNewMessage,
    isSupported: "Notification" in window,
    permission: "Notification" in window ? Notification.permission : "denied",
  };
}

export default NotificationPermission;
