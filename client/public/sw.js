// Lingueefy Service Worker for Push Notifications
const CACHE_NAME = 'lingueefy-v1';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let data = {
    title: 'Lingueefy',
    body: 'You have a new notification',
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: 'lingueefy-notification',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || data.tag,
        data: payload.data || data.data,
        actions: payload.actions || [],
        requireInteraction: payload.requireInteraction || false,
        vibrate: payload.vibrate || [200, 100, 200],
      };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    actions: data.actions,
    requireInteraction: data.requireInteraction,
    vibrate: data.vibrate,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  // Handle action buttons
  if (event.action === 'view') {
    // Open the specific URL from notification data
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default click - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there's already a window open
          for (const client of windowClients) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              client.navigate(urlToOpen);
              return;
            }
          }
          // If no window is open, open a new one
          return clients.openWindow(urlToOpen);
        })
    );
  }
});

// Background sync for offline message sending
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'send-message') {
    event.waitUntil(
      // Handle offline message queue
      sendQueuedMessages()
    );
  }
});

async function sendQueuedMessages() {
  // This would be implemented to send queued messages when back online
  console.log('[SW] Processing queued messages...');
}

// Periodic background sync for session reminders
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkUpcomingSessions());
  }
});

async function checkUpcomingSessions() {
  // This would check for upcoming sessions and show reminders
  console.log('[SW] Checking for upcoming sessions...');
}
