import { PostHog } from 'posthog-node';

// Initialize PostHog client for server-side tracking
const POSTHOG_KEY = process.env.POSTHOG_API_KEY || '';
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com';

let posthogClient: PostHog | null = null;

if (POSTHOG_KEY) {
  posthogClient = new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    flushAt: 20, // Flush after 20 events
    flushInterval: 10000, // Or every 10 seconds
  });
}

// Server-side event types
export type ServerEvent = 
  | 'user_signed_up'
  | 'user_logged_in'
  | 'checkout_initiated'
  | 'checkout_completed'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'ai_coach_session_started'
  | 'ai_coach_credits_exhausted'
  | 'ai_coach_credits_consumed'
  | 'topup_purchased'
  | 'booking_created'
  | 'webhook_received';

interface CaptureOptions {
  distinctId: string;
  event: ServerEvent;
  properties?: Record<string, unknown>;
}

/**
 * Capture a server-side event
 */
export function captureEvent({ distinctId, event, properties }: CaptureOptions): void {
  if (!posthogClient) {
    console.log('[PostHog Server] Event (disabled):', event, properties);
    return;
  }

  posthogClient.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      $timestamp: new Date().toISOString(),
      source: 'server',
    },
  });
}

/**
 * Identify a user with properties
 */
export function identifyUser(
  distinctId: string,
  properties: Record<string, unknown>
): void {
  if (!posthogClient) {
    console.log('[PostHog Server] Identify (disabled):', distinctId, properties);
    return;
  }

  posthogClient.identify({
    distinctId,
    properties,
  });
}

/**
 * Alias a user (link anonymous to identified)
 */
export function aliasUser(distinctId: string, alias: string): void {
  if (!posthogClient) return;
  
  posthogClient.alias({
    distinctId,
    alias,
  });
}

/**
 * Check if a feature flag is enabled for a user
 */
export async function isFeatureEnabled(
  distinctId: string,
  flag: string
): Promise<boolean> {
  if (!posthogClient) return false;
  
  return await posthogClient.isFeatureEnabled(flag, distinctId) ?? false;
}

/**
 * Get feature flag value for a user
 */
export async function getFeatureFlag(
  distinctId: string,
  flag: string
): Promise<string | boolean | undefined> {
  if (!posthogClient) return undefined;
  
  return await posthogClient.getFeatureFlag(flag, distinctId);
}

/**
 * Shutdown PostHog client (call on server shutdown)
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}

// Export client for direct access if needed
export { posthogClient };
