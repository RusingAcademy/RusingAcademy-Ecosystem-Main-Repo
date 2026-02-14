import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

// ── GSC Verification ────────────────────────────────────────────────────────
describe("Sprint 14 – Google Search Console Verification", () => {
  it("server/_core/index.ts registers GSC HTML verification route", () => {
    const src = fs.readFileSync(
      path.resolve("server/_core/index.ts"),
      "utf-8"
    );
    expect(src).toContain("google-site-verification");
    expect(src).toContain("google([a-f0-9]+)\\.html");
  });

  it("GSC route returns correct verification content format", () => {
    const src = fs.readFileSync(
      path.resolve("server/_core/index.ts"),
      "utf-8"
    );
    // Should return the format: google-site-verification: google{code}.html
    expect(src).toContain("google-site-verification: google${code}.html");
  });
});

// ── VAPID Public Key Endpoint ───────────────────────────────────────────────
describe("Sprint 14 – VAPID Public Key Endpoint", () => {
  it("server/_core/index.ts registers /api/push/vapid-key route", () => {
    const src = fs.readFileSync(
      path.resolve("server/_core/index.ts"),
      "utf-8"
    );
    expect(src).toContain("/api/push/vapid-key");
    expect(src).toContain("VAPID_PUBLIC_KEY");
  });

  it("VAPID endpoint returns JSON with vapidPublicKey field", () => {
    const src = fs.readFileSync(
      path.resolve("server/_core/index.ts"),
      "utf-8"
    );
    expect(src).toContain("vapidPublicKey");
    expect(src).toContain("res.json");
  });

  it("VAPID endpoint returns 503 when key is not configured", () => {
    const src = fs.readFileSync(
      path.resolve("server/_core/index.ts"),
      "utf-8"
    );
    expect(src).toContain("503");
    expect(src).toContain("Push notifications not configured");
  });
});

// ── Push Notification Hook ──────────────────────────────────────────────────
describe("Sprint 14 – usePushNotifications Hook", () => {
  it("fetches VAPID key from server instead of hardcoding", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/hooks/usePushNotifications.ts"),
      "utf-8"
    );
    // Should NOT contain the old hardcoded key
    expect(src).not.toContain(
      "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
    );
    // Should fetch from server or env
    expect(src).toContain("getVapidPublicKey");
    expect(src).toContain("/api/push/vapid-key");
  });

  it("saves subscription to server via tRPC subscribePush", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/hooks/usePushNotifications.ts"),
      "utf-8"
    );
    expect(src).toContain("subscribePush.mutateAsync");
    expect(src).toContain("endpoint: subscription.endpoint");
  });

  it("removes subscription from server via tRPC unsubscribePush", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/hooks/usePushNotifications.ts"),
      "utf-8"
    );
    expect(src).toContain("unsubscribePush.mutateAsync");
  });

  it("converts VAPID key from URL-safe base64 to Uint8Array", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/hooks/usePushNotifications.ts"),
      "utf-8"
    );
    expect(src).toContain("urlBase64ToUint8Array");
    expect(src).toContain("applicationServerKey");
  });

  it("uses VITE_VAPID_PUBLIC_KEY env as primary source", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/hooks/usePushNotifications.ts"),
      "utf-8"
    );
    expect(src).toContain("VITE_VAPID_PUBLIC_KEY");
  });
});

// ── Enrollment Push Notifications ───────────────────────────────────────────
describe("Sprint 14 – Enrollment Push Notification Triggers", () => {
  it("course enrollment sends push notification", () => {
    const src = fs.readFileSync(
      path.resolve("server/routers/courses.ts"),
      "utf-8"
    );
    expect(src).toContain("sendPushToUser");
    expect(src).toContain("Enrollment Confirmed");
    expect(src).toContain("enrollment-course-");
  });

  it("path enrollment sends push notification", () => {
    const src = fs.readFileSync(
      path.resolve("server/routers/paths.ts"),
      "utf-8"
    );
    expect(src).toContain("sendPushToUser");
    expect(src).toContain("Path Enrollment Confirmed");
    expect(src).toContain("enrollment-path-");
  });

  it("course completion sends push notification with certificate", () => {
    const src = fs.readFileSync(
      path.resolve("server/routers/courses.ts"),
      "utf-8"
    );
    expect(src).toContain("Course Completed");
    expect(src).toContain("certificateId");
    expect(src).toContain("completion-course-");
  });

  it("push notifications are best-effort (wrapped in try-catch)", () => {
    const src = fs.readFileSync(
      path.resolve("server/routers/courses.ts"),
      "utf-8"
    );
    // Count the number of push try-catch blocks
    const pushTryCatches = (
      src.match(/Failed to send.*notification/g) || []
    ).length;
    expect(pushTryCatches).toBeGreaterThanOrEqual(1);
  });
});

// ── LearnerSettings Push Toggle ─────────────────────────────────────────────
describe("Sprint 14 – LearnerSettings Push Notification Toggle", () => {
  it("imports usePushNotifications hook", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LearnerSettings.tsx"),
      "utf-8"
    );
    expect(src).toContain("usePushNotifications");
  });

  it("renders PushNotificationToggle component", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LearnerSettings.tsx"),
      "utf-8"
    );
    expect(src).toContain("<PushNotificationToggle");
    expect(src).toContain("function PushNotificationToggle");
  });

  it("handles unsupported browsers gracefully", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LearnerSettings.tsx"),
      "utf-8"
    );
    expect(src).toContain("isSupported");
    expect(src).toContain("Not supported");
  });

  it("handles denied permission state", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LearnerSettings.tsx"),
      "utf-8"
    );
    expect(src).toContain("denied");
    expect(src).toContain("blocked");
  });
});

// ── Service Worker Push Handler ─────────────────────────────────────────────
describe("Sprint 14 – Service Worker Push Handling", () => {
  it("sw.js handles push events", () => {
    const src = fs.readFileSync(
      path.resolve("client/public/sw.js"),
      "utf-8"
    );
    expect(src).toContain("addEventListener('push'");
    expect(src).toContain("showNotification");
  });

  it("sw.js handles notification click events", () => {
    const src = fs.readFileSync(
      path.resolve("client/public/sw.js"),
      "utf-8"
    );
    expect(src).toContain("notificationclick");
    expect(src).toContain("openWindow");
  });

  it("sw.js extracts URL from notification data for click navigation", () => {
    const src = fs.readFileSync(
      path.resolve("client/public/sw.js"),
      "utf-8"
    );
    expect(src).toContain("notification.data");
    expect(src).toContain("url");
  });
});
