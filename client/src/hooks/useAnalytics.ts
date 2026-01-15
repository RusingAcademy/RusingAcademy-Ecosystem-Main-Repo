import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { usePostHog } from '../contexts/PostHogProvider';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Hook for automatic page view tracking on route changes
 */
export function usePageTracking() {
  const [location] = useLocation();
  const { capture } = usePostHog();

  useEffect(() => {
    // Track page view on route change
    capture('page_viewed', {
      page_path: location,
      timestamp: new Date().toISOString(),
    });
  }, [location, capture]);
}

/**
 * Hook for tracking events with consistent patterns
 */
export function useAnalytics() {
  const { capture, identify, reset } = usePostHog();
  const { language } = useLanguage();

  // Track user signup
  const trackSignup = useCallback((userId: string, method: 'email' | 'google' | 'microsoft' | 'apple') => {
    identify(userId, { signup_method: method, language });
    capture('user_signed_up', {
      method,
      language,
    });
  }, [capture, identify, language]);

  // Track user login
  const trackLogin = useCallback((userId: string, method: 'email' | 'google' | 'microsoft' | 'apple') => {
    identify(userId, { last_login_method: method, language });
    capture('user_logged_in', {
      method,
      language,
    });
  }, [capture, identify, language]);

  // Track checkout initiation
  const trackCheckoutInitiated = useCallback((offerId: string, offerName: string, price: number) => {
    capture('checkout_initiated', {
      offer_id: offerId,
      offer_name: offerName,
      price,
      currency: 'CAD',
      language,
    });
  }, [capture, language]);

  // Track checkout completion
  const trackCheckoutCompleted = useCallback((offerId: string, offerName: string, price: number, sessionId: string) => {
    capture('checkout_completed', {
      offer_id: offerId,
      offer_name: offerName,
      price,
      currency: 'CAD',
      stripe_session_id: sessionId,
      language,
    });
  }, [capture, language]);

  // Track AI Coach session start
  const trackAICoachSessionStarted = useCallback((sessionType: 'chat' | 'simulation') => {
    capture('ai_coach_session_started', {
      session_type: sessionType,
      language,
    });
  }, [capture, language]);

  // Track AI Coach credits exhausted
  const trackAICoachCreditsExhausted = useCallback((dailyMinutes: number, topupMinutes: number) => {
    capture('ai_coach_credits_exhausted', {
      daily_minutes_limit: dailyMinutes,
      topup_minutes_remaining: topupMinutes,
      language,
    });
  }, [capture, language]);

  // Track AI Coach message sent
  const trackAICoachMessageSent = useCallback((messageLength: number, responseTime?: number) => {
    capture('ai_coach_message_sent', {
      message_length: messageLength,
      response_time_ms: responseTime,
      language,
    });
  }, [capture, language]);

  // Track top-up purchase
  const trackTopupPurchased = useCallback((minutes: number, price: number) => {
    capture('topup_purchased', {
      minutes,
      price,
      currency: 'CAD',
      language,
    });
  }, [capture, language]);

  // Track CTA click
  const trackCTA = useCallback((ctaName: string, ctaLocation: string, destination?: string) => {
    capture('cta_clicked', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      destination,
      language,
    });
  }, [capture, language]);

  // Track language change
  const trackLangSwitch = useCallback((from: string, to: string) => {
    capture('language_changed', {
      from_language: from,
      to_language: to,
    });
  }, [capture]);

  // Track coach view
  const trackCoach = useCallback((coachId: string, coachName: string) => {
    capture('cta_clicked', {
      cta_name: 'view_coach',
      coach_id: coachId,
      coach_name: coachName,
      language,
    });
  }, [capture, language]);

  // Track course view
  const trackCourse = useCallback((courseId: string, courseName: string) => {
    capture('cta_clicked', {
      cta_name: 'view_course',
      course_id: courseId,
      course_name: courseName,
      language,
    });
  }, [capture, language]);

  // Track booking initiation
  const trackBooking = useCallback((coachId: string, coachName: string, sessionType?: string) => {
    capture('booking_initiated', {
      coach_id: coachId,
      coach_name: coachName,
      session_type: sessionType,
      language,
    });
  }, [capture, language]);

  // Track booking completion
  const trackBookingCompleted = useCallback((bookingId: string, coachId: string, date: string) => {
    capture('booking_completed', {
      booking_id: bookingId,
      coach_id: coachId,
      booking_date: date,
      language,
    });
  }, [capture, language]);

  // Track search query
  const trackSearchQuery = useCallback((query: string, category?: string) => {
    capture('cta_clicked', {
      cta_name: 'search',
      query,
      category,
      language,
    });
  }, [capture, language]);

  // Track custom event
  const trackCustomEvent = useCallback((name: string, params?: Record<string, unknown>) => {
    capture('cta_clicked', {
      cta_name: name,
      ...params,
      language,
    });
  }, [capture, language]);

  // Reset user (on logout)
  const resetUser = useCallback(() => {
    reset();
  }, [reset]);

  return {
    trackSignup,
    trackLogin,
    trackCheckoutInitiated,
    trackCheckoutCompleted,
    trackAICoachSessionStarted,
    trackAICoachCreditsExhausted,
    trackAICoachMessageSent,
    trackTopupPurchased,
    trackCTA,
    trackCoach,
    trackCourse,
    trackBooking,
    trackBookingCompleted,
    trackSearchQuery,
    trackLangSwitch,
    trackCustomEvent,
    resetUser,
  };
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const [location] = useLocation();
  const { capture } = usePostHog();

  useEffect(() => {
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          capture('cta_clicked', {
            cta_name: 'scroll_depth',
            depth: threshold,
            page_path: location,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location, thresholds, capture]);
}

/**
 * Hook for tracking time on page
 */
export function useTimeOnPage() {
  const [location] = useLocation();
  const { capture } = usePostHog();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Only track if more than 5 seconds
        capture('cta_clicked', {
          cta_name: 'time_on_page',
          seconds: timeSpent,
          page_path: location,
        });
      }
    };
  }, [location, capture]);
}

export default useAnalytics;
