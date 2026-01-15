import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

// Initialize PostHog
if (POSTHOG_KEY && typeof window !== 'undefined') {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true, // Automatic pageview tracking
    capture_pageleave: true,
    autocapture: true, // Automatic event capture
    persistence: 'localStorage',
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        // Disable in development
        posthog.opt_out_capturing();
      }
    },
  });
}

// Event types for type safety
export type PostHogEvent = 
  | 'user_signed_up'
  | 'user_logged_in'
  | 'checkout_initiated'
  | 'checkout_completed'
  | 'ai_coach_session_started'
  | 'ai_coach_credits_exhausted'
  | 'ai_coach_message_sent'
  | 'topup_purchased'
  | 'page_viewed'
  | 'cta_clicked'
  | 'language_changed'
  | 'booking_initiated'
  | 'booking_completed';

interface PostHogContextType {
  capture: (event: PostHogEvent, properties?: Record<string, unknown>) => void;
  identify: (userId: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
  isFeatureEnabled: (flag: string) => boolean;
  getFeatureFlag: (flag: string) => string | boolean | undefined;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

interface PostHogProviderProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  // Track page views on route changes
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    
    // Initial page view
    posthog.capture('$pageview');
    
    // Listen for route changes (for SPAs)
    const handleRouteChange = () => {
      posthog.capture('$pageview');
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const capture = (event: PostHogEvent, properties?: Record<string, unknown>) => {
    if (!POSTHOG_KEY) {
      console.log('[PostHog] Event (disabled):', event, properties);
      return;
    }
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  };

  const identify = (userId: string, properties?: Record<string, unknown>) => {
    if (!POSTHOG_KEY) {
      console.log('[PostHog] Identify (disabled):', userId, properties);
      return;
    }
    posthog.identify(userId, properties);
  };

  const reset = () => {
    if (!POSTHOG_KEY) return;
    posthog.reset();
  };

  const isFeatureEnabled = (flag: string): boolean => {
    if (!POSTHOG_KEY) return false;
    return posthog.isFeatureEnabled(flag) ?? false;
  };

  const getFeatureFlag = (flag: string): string | boolean | undefined => {
    if (!POSTHOG_KEY) return undefined;
    return posthog.getFeatureFlag(flag);
  };

  return (
    <PostHogContext.Provider value={{ capture, identify, reset, isFeatureEnabled, getFeatureFlag }}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog() {
  const context = useContext(PostHogContext);
  if (!context) {
    // Return no-op functions if not wrapped in provider
    return {
      capture: () => {},
      identify: () => {},
      reset: () => {},
      isFeatureEnabled: () => false,
      getFeatureFlag: () => undefined,
    };
  }
  return context;
}

// Export posthog instance for direct access if needed
export { posthog };
