import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
}

// Helper function to convert VAPID key from URL-safe base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Cache the VAPID key so we only fetch once per session
let cachedVapidKey: string | null = null;

async function getVapidPublicKey(): Promise<string> {
  if (cachedVapidKey) return cachedVapidKey;

  // First try the env variable exposed via Vite
  const envKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (envKey) {
    cachedVapidKey = envKey;
    return envKey;
  }

  // Fallback: fetch from server endpoint
  try {
    const resp = await fetch('/api/push/vapid-key');
    if (resp.ok) {
      const data = await resp.json();
      if (data.vapidPublicKey) {
        cachedVapidKey = data.vapidPublicKey;
        return data.vapidPublicKey;
      }
    }
  } catch (e) {
    console.warn('[Push] Failed to fetch VAPID key from server:', e);
  }

  throw new Error('VAPID public key not available');
}

export function usePushNotifications() {
  const { user, isAuthenticated } = useAuth();
  const subscribePush = trpc.notifications.subscribePush.useMutation();
  const unsubscribePush = trpc.notifications.unsubscribePush.useMutation();

  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default',
    isLoading: true,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

      if (!isSupported) {
        setState(prev => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          error: 'Push notifications are not supported in this browser',
        }));
        return;
      }

      // Get current permission status
      const permission = Notification.permission;

      // Check if already subscribed
      let isSubscribed = false;
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        isSubscribed = !!subscription;
      } catch (e) {
        console.error('Error checking subscription:', e);
      }

      setState({
        isSupported: true,
        isSubscribed,
        permission,
        isLoading: false,
        error: null,
      });
    };

    checkSupport();
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers not supported');
    }
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({
        ...prev,
        permission,
        isLoading: false,
      }));
      return permission === 'granted';
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request notification permission',
      }));
      return false;
    }
  }, [state.isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!state.isSupported || state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Register service worker if not already registered
      await registerServiceWorker();
      const registration = await navigator.serviceWorker.ready;

      // Fetch the real VAPID public key from server
      const vapidKey = await getVapidPublicKey();

      // Create push subscription with the real VAPID key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // Extract subscription keys
      const subJson = subscription.toJSON();
      const p256dh = subJson.keys?.p256dh || '';
      const auth = subJson.keys?.auth || '';

      // Save subscription to server via tRPC
      if (isAuthenticated) {
        await subscribePush.mutateAsync({
          endpoint: subscription.endpoint,
          p256dh,
          auth,
          userAgent: navigator.userAgent,
          enableBookings: true,
          enableMessages: true,
          enableReminders: true,
          enableMarketing: false,
        });
      }

      setState(prev => ({
        ...prev,
        isSubscribed: true,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to subscribe to push notifications',
      }));
      return false;
    }
  }, [state.isSupported, state.permission, requestPermission, registerServiceWorker, isAuthenticated, subscribePush]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove subscription from server via tRPC
      if (isAuthenticated) {
        await unsubscribePush.mutateAsync();
      }

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to unsubscribe from push notifications',
      }));
      return false;
    }
  }, [isAuthenticated, unsubscribePush]);

  // Show a local notification (for testing or immediate notifications)
  const showNotification = useCallback(async (
    title: string,
    options?: NotificationOptions
  ) => {
    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/logo.svg',
        badge: '/logo.svg',
        ...options,
      });
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }, [state.permission, requestPermission]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  };
}
