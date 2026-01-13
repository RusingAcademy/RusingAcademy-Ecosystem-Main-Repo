/**
 * Unified Authentication Hook
 * 
 * This hook provides a unified interface for authentication that works with:
 * 1. Clerk (primary auth provider)
 * 2. Legacy OAuth (fallback for existing users)
 * 
 * It abstracts the auth provider so components don't need to know which system is in use.
 */
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useCallback, useMemo } from 'react';
import { useAuth as useLegacyAuth } from '@/_core/hooks/useAuth';

// Check if Clerk is configured
const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export interface UnifiedUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  authProvider: 'clerk' | 'legacy' | null;
}

export interface UnifiedAuthState {
  user: UnifiedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export interface UnifiedAuthActions {
  signIn: () => void;
  signOut: () => Promise<void>;
  openUserProfile: () => void;
}

export type UseUnifiedAuthReturn = UnifiedAuthState & UnifiedAuthActions;

export function useUnifiedAuth(): UseUnifiedAuthReturn {
  // Clerk hooks (only used if Clerk is enabled)
  const clerkUser = CLERK_ENABLED ? useUser() : { user: null, isLoaded: true };
  const clerk = CLERK_ENABLED ? useClerk() : null;
  const clerkAuth = CLERK_ENABLED ? useClerkAuth() : { isLoaded: true, isSignedIn: false };
  
  // Legacy auth hook (always available as fallback)
  const legacyAuth = useLegacyAuth();

  // Determine which auth system to use
  const useClerkSystem = CLERK_ENABLED && clerkAuth.isLoaded;

  // Build unified user object
  const user = useMemo((): UnifiedUser | null => {
    if (useClerkSystem && clerkUser.user) {
      return {
        id: clerkUser.user.id,
        email: clerkUser.user.primaryEmailAddress?.emailAddress || null,
        name: clerkUser.user.fullName || clerkUser.user.firstName || null,
        avatarUrl: clerkUser.user.imageUrl || null,
        isAuthenticated: true,
        authProvider: 'clerk',
      };
    }
    
    if (legacyAuth.user) {
      return {
        id: legacyAuth.user.openId || String(legacyAuth.user.id),
        email: legacyAuth.user.email || null,
        name: legacyAuth.user.name || null,
        avatarUrl: legacyAuth.user.avatarUrl || null,
        isAuthenticated: true,
        authProvider: 'legacy',
      };
    }
    
    return null;
  }, [useClerkSystem, clerkUser.user, legacyAuth.user]);

  // Loading state
  const isLoading = useMemo(() => {
    if (useClerkSystem) {
      return !clerkAuth.isLoaded || !clerkUser.isLoaded;
    }
    return legacyAuth.loading;
  }, [useClerkSystem, clerkAuth.isLoaded, clerkUser.isLoaded, legacyAuth.loading]);

  // Auth state
  const isAuthenticated = useMemo(() => {
    if (useClerkSystem) {
      return clerkAuth.isSignedIn === true;
    }
    return legacyAuth.isAuthenticated;
  }, [useClerkSystem, clerkAuth.isSignedIn, legacyAuth.isAuthenticated]);

  // Sign in action
  const signIn = useCallback(() => {
    if (useClerkSystem && clerk) {
      clerk.openSignIn();
    } else {
      // Redirect to legacy OAuth login
      window.location.href = '/api/auth/login';
    }
  }, [useClerkSystem, clerk]);

  // Sign out action
  const signOut = useCallback(async () => {
    if (useClerkSystem && clerk) {
      await clerk.signOut();
    } else {
      await legacyAuth.logout();
    }
  }, [useClerkSystem, clerk, legacyAuth]);

  // Open user profile
  const openUserProfile = useCallback(() => {
    if (useClerkSystem && clerk) {
      clerk.openUserProfile();
    } else {
      // Redirect to legacy profile page
      window.location.href = '/dashboard/profile';
    }
  }, [useClerkSystem, clerk]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error: legacyAuth.error,
    signIn,
    signOut,
    openUserProfile,
  };
}

export default useUnifiedAuth;
