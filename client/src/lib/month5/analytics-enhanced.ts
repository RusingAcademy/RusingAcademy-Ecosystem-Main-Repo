/**
 * ============================================
 * ENHANCED ANALYTICS — GA4 + Conversion Tracking
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Comprehensive analytics layer:
 * - GA4 setup with custom events
 * - Conversion funnel tracking
 * - Heatmap integration hooks (Hotjar/Clarity ready)
 * - Form abandonment tracking
 * - Scroll depth tracking
 * - Video engagement tracking
 */

// ─── GA4 CONFIGURATION ──────────────────────────────────────────────────────

export interface GA4Config {
  measurementId: string;
  debug: boolean;
  sendPageViews: boolean;
  customDimensions: Record<string, string>;
}

const DEFAULT_GA4_CONFIG: GA4Config = {
  measurementId: "", // Set via environment variable
  debug: false,
  sendPageViews: true,
  customDimensions: {},
};

/** Initialize GA4 with custom configuration */
export function initGA4(config: Partial<GA4Config> = {}): void {
  const cfg = { ...DEFAULT_GA4_CONFIG, ...config };

  if (typeof window === "undefined" || !cfg.measurementId) return;

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag("js", new Date());
  gtag("config", cfg.measurementId, {
    send_page_view: cfg.sendPageViews,
    debug_mode: cfg.debug,
    custom_map: cfg.customDimensions,
  });
}

/** Send a custom event to GA4 */
export function sendGA4Event(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined" || !(window as any).gtag) return;
  (window as any).gtag("event", eventName, params);
}

// ─── CONVERSION FUNNEL TRACKING ──────────────────────────────────────────────

export type FunnelStage = "awareness" | "consideration" | "decision" | "action";

export interface FunnelEvent {
  stage: FunnelStage;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  pageUrl: string;
}

const FUNNEL_STORAGE_KEY = "ra_funnel_events";

function getSessionId(): string {
  const key = "ra_session_id";
  try {
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  } catch {
    return `s_${Date.now()}`;
  }
}

/** Track a conversion funnel event */
export function trackFunnelEvent(
  stage: FunnelStage,
  action: string,
  label?: string,
  value?: number
): void {
  const event: FunnelEvent = {
    stage,
    action,
    label,
    value,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
  };

  // Store locally
  try {
    const events = JSON.parse(localStorage.getItem(FUNNEL_STORAGE_KEY) || "[]");
    events.push(event);
    if (events.length > 500) events.splice(0, events.length - 500);
    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Storage unavailable
  }

  // Send to GA4
  sendGA4Event(`funnel_${stage}`, {
    funnel_action: action,
    funnel_label: label,
    funnel_value: value,
    session_id: event.sessionId,
  });
}

/** Pre-defined funnel tracking helpers */
export const FunnelTracker = {
  // Awareness stage
  pageView: (pageName: string) =>
    trackFunnelEvent("awareness", "page_view", pageName),
  blogRead: (articleTitle: string) =>
    trackFunnelEvent("awareness", "blog_read", articleTitle),
  socialClick: (platform: string) =>
    trackFunnelEvent("awareness", "social_click", platform),

  // Consideration stage
  courseView: (courseId: string) =>
    trackFunnelEvent("consideration", "course_view", courseId),
  coachView: (coachId: string) =>
    trackFunnelEvent("consideration", "coach_view", coachId),
  testimonialRead: (testimonialId: string) =>
    trackFunnelEvent("consideration", "testimonial_read", testimonialId),
  pricingView: () =>
    trackFunnelEvent("consideration", "pricing_view"),
  faqExpand: (questionId: string) =>
    trackFunnelEvent("consideration", "faq_expand", questionId),

  // Decision stage
  assessmentStart: () =>
    trackFunnelEvent("decision", "assessment_start"),
  placementTestStart: () =>
    trackFunnelEvent("decision", "placement_test_start"),
  contactFormOpen: () =>
    trackFunnelEvent("decision", "contact_form_open"),
  emailCapture: (source: string) =>
    trackFunnelEvent("decision", "email_capture", source),

  // Action stage
  assessmentComplete: () =>
    trackFunnelEvent("action", "assessment_complete"),
  courseEnroll: (courseId: string, value?: number) =>
    trackFunnelEvent("action", "course_enroll", courseId, value),
  bookingComplete: (coachId: string, value?: number) =>
    trackFunnelEvent("action", "booking_complete", coachId, value),
  paymentComplete: (amount: number) =>
    trackFunnelEvent("action", "payment_complete", undefined, amount),
};

// ─── HEATMAP INTEGRATION HOOKS ───────────────────────────────────────────────

export interface HeatmapConfig {
  provider: "hotjar" | "clarity" | "none";
  siteId: string;
  recordSessions: boolean;
  trackClicks: boolean;
  trackScrolls: boolean;
}

/** Initialize Hotjar tracking */
export function initHotjar(siteId: string): void {
  if (typeof window === "undefined" || !siteId) return;

  (window as any).hj =
    (window as any).hj ||
    function () {
      ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
    };
  (window as any)._hjSettings = { hjid: siteId, hjsv: 6 };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
  document.head.appendChild(script);
}

/** Initialize Microsoft Clarity tracking */
export function initClarity(projectId: string): void {
  if (typeof window === "undefined" || !projectId) return;

  (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
}

/** Send a heatmap event (works with both Hotjar and Clarity) */
export function triggerHeatmapEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  // Hotjar
  if ((window as any).hj) {
    (window as any).hj("event", eventName);
    if (data) {
      (window as any).hj("stateChange", window.location.pathname);
    }
  }

  // Clarity
  if ((window as any).clarity) {
    (window as any).clarity("set", eventName, JSON.stringify(data || {}));
  }
}

/** Tag a heatmap session with user attributes */
export function tagHeatmapUser(attributes: Record<string, string>): void {
  if (typeof window === "undefined") return;

  // Hotjar
  if ((window as any).hj) {
    (window as any).hj("identify", null, attributes);
  }

  // Clarity
  if ((window as any).clarity) {
    Object.entries(attributes).forEach(([key, value]) => {
      (window as any).clarity("set", key, value);
    });
  }
}

// ─── FORM ABANDONMENT TRACKING ───────────────────────────────────────────────

export interface FormTrackingConfig {
  formId: string;
  formName: string;
  fields: string[];
}

/** Track form field interactions for abandonment analysis */
export function trackFormInteraction(
  formId: string,
  fieldName: string,
  action: "focus" | "blur" | "change" | "submit" | "abandon"
): void {
  sendGA4Event("form_interaction", {
    form_id: formId,
    field_name: fieldName,
    interaction_type: action,
    timestamp: Date.now(),
  });

  triggerHeatmapEvent(`form_${action}`, { formId, fieldName });
}

/** Set up form abandonment detection */
export function setupFormAbandonmentTracking(config: FormTrackingConfig): () => void {
  if (typeof window === "undefined") return () => {};

  const fieldStates: Record<string, boolean> = {};
  let formStarted = false;
  let formCompleted = false;

  const handleFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    const fieldName = target.getAttribute("name") || target.id;
    if (fieldName && config.fields.includes(fieldName)) {
      if (!formStarted) {
        formStarted = true;
        sendGA4Event("form_start", { form_id: config.formId, form_name: config.formName });
      }
      fieldStates[fieldName] = true;
      trackFormInteraction(config.formId, fieldName, "focus");
    }
  };

  const handleBeforeUnload = () => {
    if (formStarted && !formCompleted) {
      const filledFields = Object.keys(fieldStates).filter(k => fieldStates[k]);
      sendGA4Event("form_abandonment", {
        form_id: config.formId,
        form_name: config.formName,
        fields_filled: filledFields.length,
        total_fields: config.fields.length,
        last_field: filledFields[filledFields.length - 1] || "none",
      });
    }
  };

  document.addEventListener("focusin", handleFocus);
  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    document.removeEventListener("focusin", handleFocus);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}

// ─── SCROLL DEPTH TRACKING ───────────────────────────────────────────────────

/** Set up scroll depth tracking at 25%, 50%, 75%, 100% thresholds */
export function setupScrollDepthTracking(pagePath?: string): () => void {
  if (typeof window === "undefined") return () => {};

  const thresholds = [25, 50, 75, 90, 100];
  const reached = new Set<number>();
  const path = pagePath || window.location.pathname;

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    for (const threshold of thresholds) {
      if (scrollPercent >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        sendGA4Event("scroll_depth", {
          percent_scrolled: threshold,
          page_path: path,
        });
        triggerHeatmapEvent("scroll_depth", { threshold, path });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}

// ─── VIDEO ENGAGEMENT TRACKING ───────────────────────────────────────────────

export interface VideoTrackingConfig {
  videoId: string;
  videoTitle: string;
  videoDuration: number; // seconds
}

/** Track video engagement milestones */
export function trackVideoEngagement(
  config: VideoTrackingConfig,
  action: "play" | "pause" | "complete" | "milestone",
  currentTime: number
): void {
  const percentWatched = config.videoDuration > 0
    ? Math.round((currentTime / config.videoDuration) * 100)
    : 0;

  sendGA4Event(`video_${action}`, {
    video_id: config.videoId,
    video_title: config.videoTitle,
    video_duration: config.videoDuration,
    video_current_time: Math.round(currentTime),
    video_percent: percentWatched,
  });

  triggerHeatmapEvent(`video_${action}`, {
    videoId: config.videoId,
    percentWatched,
  });
}

/** Set up automatic video milestone tracking (25%, 50%, 75%, 100%) */
export function setupVideoMilestoneTracking(
  videoElement: HTMLVideoElement,
  config: VideoTrackingConfig
): () => void {
  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();

  const handleTimeUpdate = () => {
    const percent = Math.round((videoElement.currentTime / videoElement.duration) * 100);
    for (const milestone of milestones) {
      if (percent >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        trackVideoEngagement(config, "milestone", videoElement.currentTime);
      }
    }
  };

  const handlePlay = () => trackVideoEngagement(config, "play", videoElement.currentTime);
  const handlePause = () => trackVideoEngagement(config, "pause", videoElement.currentTime);
  const handleEnded = () => trackVideoEngagement(config, "complete", videoElement.duration);

  videoElement.addEventListener("timeupdate", handleTimeUpdate);
  videoElement.addEventListener("play", handlePlay);
  videoElement.addEventListener("pause", handlePause);
  videoElement.addEventListener("ended", handleEnded);

  return () => {
    videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    videoElement.removeEventListener("play", handlePlay);
    videoElement.removeEventListener("pause", handlePause);
    videoElement.removeEventListener("ended", handleEnded);
  };
}
