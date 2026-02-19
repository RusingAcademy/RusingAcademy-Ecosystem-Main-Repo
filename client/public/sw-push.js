/**
 * Service Worker — Push Notifications (Phase 2)
 * Handles push notification display and click actions
 */

// Listen for push events from the server
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: "RusingAcademy",
      body: event.data.text(),
    };
  }

  const options = {
    body: payload.body || "",
    icon: payload.icon || "/icons/icon-192x192.png",
    badge: payload.badge || "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: payload.data || {},
    actions: [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
    tag: payload.data?.type || "default",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "RusingAcademy", options)
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          if (url !== "/") {
            client.navigate(url);
          }
          return;
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});

// Handle push subscription change (browser-initiated)
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        // Re-register with the server
        return fetch("/api/trpc/notification.registerPush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(
                String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))
              ),
              auth: btoa(
                String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))
              ),
            },
          }),
        });
      })
  );
});
