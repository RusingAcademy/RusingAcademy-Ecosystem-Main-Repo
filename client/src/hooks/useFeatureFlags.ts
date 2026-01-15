import { useState, useEffect, useCallback } from 'react';
import { usePostHog } from '../contexts/PostHogProvider';

/**
 * Feature flag names used in the application
 */
export type FeatureFlag = 
  | 'ai_coach_enabled'
  | 'ai_coach_simulation_mode'
  | 'new_pricing_page'
  | 'social_login_enabled'
  | 'apple_login_enabled'
  | 'booking_system_enabled'
  | 'barholex_portal_enabled'
  | 'lingueefy_marketplace_enabled'
  | 'topup_enabled'
  | 'beta_features'
  | 'maintenance_mode';

/**
 * Hook for checking feature flags
 */
export function useFeatureFlags() {
  const { isFeatureEnabled, getFeatureFlag } = usePostHog();

  // Check if a feature is enabled
  const isEnabled = useCallback((flag: FeatureFlag): boolean => {
    return isFeatureEnabled(flag);
  }, [isFeatureEnabled]);

  // Get feature flag value (for multivariate flags)
  const getValue = useCallback((flag: FeatureFlag): string | boolean | undefined => {
    return getFeatureFlag(flag);
  }, [getFeatureFlag]);

  return {
    isEnabled,
    getValue,
  };
}

/**
 * Hook for a specific feature flag with loading state
 */
export function useFeatureFlag(flag: FeatureFlag, defaultValue: boolean = false) {
  const { isFeatureEnabled } = usePostHog();
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow PostHog to load
    const timer = setTimeout(() => {
      const enabled = isFeatureEnabled(flag);
      setIsEnabled(enabled);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [flag, isFeatureEnabled]);

  return { isEnabled, isLoading };
}

/**
 * Default feature flag values (used when PostHog is not configured)
 */
export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  ai_coach_enabled: true,
  ai_coach_simulation_mode: true,
  new_pricing_page: true,
  social_login_enabled: true,
  apple_login_enabled: false, // Disabled by default until configured
  booking_system_enabled: true,
  barholex_portal_enabled: true,
  lingueefy_marketplace_enabled: true,
  topup_enabled: true,
  beta_features: false,
  maintenance_mode: false,
};
