/**
 * Phase 5: Cache Invalidation Automatique
 * Maps tRPC mutations to related query keys for auto-invalidation
 */

// Mutation → Query invalidation mapping
const INVALIDATION_MAP: Record<string, string[]> = {
  // Coach mutations
  "coach.submitApplication": ["coach.list", "coach.myProfile"],
  "coach.updateProfile": ["coach.list", "coach.bySlug", "coach.myProfile"],
  "coach.submitReview": ["coach.reviews", "coach.canReview", "coach.myReview"],
  "coach.updateReview": ["coach.reviews", "coach.myReview"],
  
  // Session mutations
  "session.book": ["session.upcoming", "session.list", "coach.bySlug"],
  "session.cancel": ["session.upcoming", "session.list"],
  "session.complete": ["session.list", "coachAnalytics.dashboard"],
  
  // Learner mutations
  "learner.updateProfile": ["learner.myProfile", "learner.progress"],
  
  // Chat mutations
  "chatRooms.sendMessage": ["chatRooms.messages", "chatRooms.rooms"],
  "chatRooms.createRoom": ["chatRooms.rooms"],
  
  // Progress mutations
  "progressSync.syncProgress": ["progressSync.status", "learner.progress"],
  
  // Admin mutations
  "featureFlags.toggle": ["featureFlags.list", "featureFlags.evaluate"],
  "featureFlags.create": ["featureFlags.list"],
  "featureFlags.update": ["featureFlags.list"],
  
  // Notification mutations
  "notification.markAsRead": ["notification.list", "notification.unreadCount"],
  "notification.markAllAsRead": ["notification.list", "notification.unreadCount"],
  
  // Course mutations
  "courses.enroll": ["courses.list", "courses.enrolled", "learner.progress"],
  "courses.updateProgress": ["courses.progress", "learner.progress", "progressSync.status"],
  
  // HR mutations
  "hrReports.generate": ["hrReports.history"],
  
  // Gamification
  "gamification.claimReward": ["gamification.points", "gamification.badges"],
};

/**
 * Get query keys that should be invalidated after a mutation
 */
export function getInvalidationKeys(mutationKey: string): string[] {
  return INVALIDATION_MAP[mutationKey] || [];
}

/**
 * Create a tRPC mutation wrapper that auto-invalidates related queries
 * Usage: const mutation = useAutoInvalidatingMutation('coach.updateProfile', trpc.coach.updateProfile);
 */
export function createInvalidationConfig(mutationKey: string) {
  const keys = getInvalidationKeys(mutationKey);
  if (keys.length === 0) return {};
  
  return {
    onSuccess: () => {
      // Return the keys to invalidate - the caller should use queryClient.invalidateQueries
      return keys;
    },
  };
}

/**
 * Stale time configurations for different data types
 */
export const STALE_TIMES = {
  /** Real-time data: always fresh (0ms) */
  realtime: 0,
  /** Frequently changing: 30 seconds */
  frequent: 30 * 1000,
  /** Standard data: 2 minutes */
  standard: 2 * 60 * 1000,
  /** Slowly changing: 5 minutes */
  slow: 5 * 60 * 1000,
  /** Static data: 30 minutes */
  static: 30 * 60 * 1000,
  /** Immutable data: 1 hour */
  immutable: 60 * 60 * 1000,
} as const;

/**
 * Cache time configurations
 */
export const CACHE_TIMES = {
  /** Short-lived: 5 minutes */
  short: 5 * 60 * 1000,
  /** Standard: 15 minutes */
  standard: 15 * 60 * 1000,
  /** Long-lived: 1 hour */
  long: 60 * 60 * 1000,
  /** Persistent: 24 hours */
  persistent: 24 * 60 * 60 * 1000,
} as const;
