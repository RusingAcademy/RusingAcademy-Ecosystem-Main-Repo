// server/config/phase3.ts — Phase 3: Coach Experience Configuration
export const phase3Config = {
  calendly: {
    enabled: process.env.CALENDLY_SYNC_ENABLED === "true",
    apiBase: "https://api.calendly.com",
    authBase: "https://auth.calendly.com",
    clientId: process.env.CALENDLY_CLIENT_ID || "",
    clientSecret: process.env.CALENDLY_CLIENT_SECRET || "",
    webhookSecret: process.env.CALENDLY_WEBHOOK_SECRET || "",
    organizationUri: process.env.CALENDLY_ORGANIZATION_URI || "",
    redirectUri: process.env.CALENDLY_REDIRECT_URI || "",
  },
  video: {
    enabled: process.env.VIDEO_NATIVE_ENABLED === "true",
    provider: "daily" as const,
    apiKey: process.env.DAILY_API_KEY || "",
    apiUrl: "https://api.daily.co/v1",
    roomPrefix: process.env.DAILY_ROOM_PREFIX || "ra-session-",
    maxParticipants: parseInt(process.env.DAILY_MAX_PARTICIPANTS || "10"),
    recordingEnabled: process.env.DAILY_RECORDING_ENABLED === "true",
    maxDurationMinutes: parseInt(process.env.VIDEO_ROOM_MAX_DURATION_MINUTES || "120"),
  },
  sessions: {
    reminderMinutesBefore: parseInt(process.env.SESSION_REMINDER_MINUTES_BEFORE || "15"),
  },
};
