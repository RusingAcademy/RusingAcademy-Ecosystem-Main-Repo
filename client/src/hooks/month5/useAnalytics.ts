/**
 * ============================================
 * USE ANALYTICS HOOK — React Integration
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Provides easy-to-use analytics functions for React components.
 * Handles GA4, funnel tracking, scroll depth, and heatmap events.
 */
import { useEffect, useCallback, useRef } from "react";
import {
  sendGA4Event,
  FunnelTracker,
  setupScrollDepthTracking,
  trackFormInteraction,
  triggerHeatmapEvent,
  tagHeatmapUser,
  type FunnelStage,
} from "@/lib/month5/analytics-enhanced";

/** Main analytics hook — auto-tracks page view and scroll depth */
export function useAnalytics(pageName?: string) {
  const scrollCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (pageName) {
      FunnelTracker.pageView(pageName);
    }
    scrollCleanupRef.current = setupScrollDepthTracking();
    return () => {
      scrollCleanupRef.current?.();
    };
  }, [pageName]);

  const trackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    sendGA4Event(eventName, params);
  }, []);

  const trackFunnel = useCallback((stage: FunnelStage, action: string, label?: string, value?: number) => {
    const stageMap: Record<FunnelStage, (action: string, label?: string, value?: number) => void> = {
      awareness: (a, l) => FunnelTracker.pageView(l || a),
      consideration: (a, l) => {
        if (a === "course_view") FunnelTracker.courseView(l || "");
        else if (a === "pricing_view") FunnelTracker.pricingView();
        else FunnelTracker.testimonialRead(l || a);
      },
      decision: (a, l) => {
        if (a === "assessment_start") FunnelTracker.assessmentStart();
        else if (a === "email_capture") FunnelTracker.emailCapture(l || "unknown");
        else FunnelTracker.contactFormOpen();
      },
      action: (a, l, v) => {
        if (a === "course_enroll") FunnelTracker.courseEnroll(l || "", v);
        else if (a === "booking_complete") FunnelTracker.bookingComplete(l || "", v);
        else FunnelTracker.assessmentComplete();
      },
    };
    stageMap[stage]?.(action, label, value);
  }, []);

  const trackForm = useCallback((formId: string, fieldName: string, action: "focus" | "blur" | "change" | "submit" | "abandon") => {
    trackFormInteraction(formId, fieldName, action);
  }, []);

  const trackHeatmap = useCallback((eventName: string, data?: Record<string, unknown>) => {
    triggerHeatmapEvent(eventName, data);
  }, []);

  const identifyUser = useCallback((attributes: Record<string, string>) => {
    tagHeatmapUser(attributes);
  }, []);

  return {
    trackEvent,
    trackFunnel,
    trackForm,
    trackHeatmap,
    identifyUser,
    FunnelTracker,
  };
}

/** Hook for tracking element visibility (impression tracking) */
export function useImpressionTracking(
  elementRef: React.RefObject<HTMLElement | null>,
  eventName: string,
  params?: Record<string, unknown>,
  threshold: number = 0.5
) {
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          sendGA4Event(eventName, params);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, eventName, params, threshold]);
}

export default useAnalytics;
