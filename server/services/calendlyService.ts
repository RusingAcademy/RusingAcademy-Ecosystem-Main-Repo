import { createLogger } from "../logger";
import { db } from "../db";
import { coachProfiles, sessions, coachCalendlyIntegrations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { broadcastService } from "../websocket";
import { phase3Config } from "../config/phase3";

const log = createLogger("services-calendlyService");

const CALENDLY_API_BASE = "https://api.calendly.com";

// =============================================
// Types for Calendly API responses
// =============================================

export interface CalendlyAvailableTime {
  status: "available" | "unavailable";
  invitees_remaining: number;
  start_time: string;
  scheduling_url: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: string;
  pooling_type: string | null;
  type: string;
  color: string;
  created_at: string;
  updated_at: string;
  internal_note: string | null;
  description_plain: string | null;
  description_html: string | null;
  profile: { type: string; name: string; owner: string };
  secret: boolean;
  booking_method: string;
  custom_questions: any[];
}

export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  scheduling_url: string;
  timezone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  current_organization: string;
}

export interface CalendlyEvent {
  uri: string;
  name: string;
  status: "active" | "canceled";
  start_time: string;
  end_time: string;
  event_type: string;
  location: { type: string; location?: string; join_url?: string };
  invitees_counter: { total: number; active: number; limit: number };
  created_at: string;
  updated_at: string;
  event_memberships: Array<{ user: string }>;
  event_guests: any[];
  meeting_notes_plain: string | null;
  meeting_notes_html: string | null;
}

interface CalendlyTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  created_at: number;
  owner: string;
  organization: string;
}

export interface CalendlyWebhookPayload {
  event: "invitee.created" | "invitee.canceled" | "invitee_no_show.created";
  created_at: string;
  created_by: string;
  payload: {
    event: { uri: string; name: string; start_time: string; end_time: string; status: string };
    invitee: { uri: string; email: string; name: string; status: string };
    questions_and_answers?: Array<{ question: string; answer: string }>;
    no_show?: { uri: string; created_at: string };
  };
}

// =============================================
// Legacy CalendlyService class (preserved)
// =============================================

export class CalendlyService {
  private apiKey: string;
  private userUri: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(CALENDLY_API_BASE + endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      log.error(`[Calendly] API error on ${endpoint}:`, error);
      throw new Error(`Calendly API error: ${response.status}`);
    }
    return response.json();
  }

  async initialize(): Promise<CalendlyUser> {
    const response = await this.request<{ resource: CalendlyUser }>("/users/me");
    this.userUri = response.resource.uri;
    return response.resource;
  }

  async getAvailableTimes(eventTypeUri: string, startTime: string, endTime: string): Promise<CalendlyAvailableTime[]> {
    const params = new URLSearchParams({ event_type: eventTypeUri, start_time: startTime, end_time: endTime });
    const response = await this.request<{ collection: CalendlyAvailableTime[] }>(`/event_type_available_times?${params}`);
    return response.collection || [];
  }

  async getEventTypes(): Promise<CalendlyEventType[]> {
    if (!this.userUri) await this.initialize();
    const params = new URLSearchParams({ user: this.userUri || "", active: "true" });
    const response = await this.request<{ collection: CalendlyEventType[] }>(`/event_types?${params}`);
    return response.collection || [];
  }

  async getScheduledEvents(minStartTime?: string, maxStartTime?: string): Promise<CalendlyEvent[]> {
    if (!this.userUri) await this.initialize();
    const params = new URLSearchParams({ user: this.userUri || "", status: "active" });
    if (minStartTime) params.set("min_start_time", minStartTime);
    if (maxStartTime) params.set("max_start_time", maxStartTime);
    const response = await this.request<{ collection: CalendlyEvent[] }>(`/scheduled_events?${params}`);
    return response.collection || [];
  }

  async getSchedulingUrl(): Promise<string> {
    const user = await this.initialize();
    return user.scheduling_url;
  }

  getUserUri(): string | null {
    return this.userUri;
  }
}

// =============================================
// Phase 3: OAuth + Webhook + Connect/Disconnect
// =============================================

const { authBase, clientId, clientSecret } = phase3Config.calendly;

export const calendlyOAuthService = {
  getAuthorizationUrl(coachProfileId: number, redirectUri: string): string {
    if (!phase3Config.calendly.enabled) {
      throw new Error("Calendly sync is disabled");
    }
    const state = Buffer.from(JSON.stringify({ coachProfileId, timestamp: Date.now() })).toString("base64");
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
    });
    return `${authBase}/oauth/authorize?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<CalendlyTokenResponse> {
    const response = await fetch(`${authBase}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      log.error("[Calendly] OAuth token exchange failed:", error);
      throw new Error(`Calendly auth failed: ${error}`);
    }
    return response.json();
  },

  async refreshAccessToken(integrationId: number): Promise<string> {
    const integration = await db.select().from(coachCalendlyIntegrations).where(eq(coachCalendlyIntegrations.id, integrationId)).then((r) => r[0]);
    if (!integration?.refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${authBase}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: integration.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!response.ok) {
      await db.update(coachCalendlyIntegrations).set({ isActive: false, syncError: "Token refresh failed" }).where(eq(coachCalendlyIntegrations.id, integrationId));
      throw new Error("Token refresh failed");
    }
    const tokens = (await response.json()) as CalendlyTokenResponse;
    await db.update(coachCalendlyIntegrations).set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      updatedAt: new Date(),
    }).where(eq(coachCalendlyIntegrations.id, integrationId));
    return tokens.access_token;
  },

  async connectCoach(coachProfileId: number, code: string, redirectUri: string): Promise<{ schedulingUrl: string }> {
    const tokens = await this.exchangeCodeForToken(code, redirectUri);
    const userInfo = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }).then((r) => r.json()) as { resource: { uri: string; scheduling_url: string } };

    const existing = await db.select().from(coachCalendlyIntegrations).where(eq(coachCalendlyIntegrations.coachProfileId, coachProfileId)).then((r) => r[0]);

    if (existing) {
      await db.update(coachCalendlyIntegrations).set({
        calendlyUserUri: userInfo.resource.uri,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        schedulingUrl: userInfo.resource.scheduling_url,
        isActive: true,
        syncError: null,
        updatedAt: new Date(),
      }).where(eq(coachCalendlyIntegrations.id, existing.id));
    } else {
      await db.insert(coachCalendlyIntegrations).values({
        coachProfileId,
        calendlyUserUri: userInfo.resource.uri,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        schedulingUrl: userInfo.resource.scheduling_url,
        isActive: true,
      });
    }

    await db.update(coachProfiles).set({
      calendarType: "calendly",
      calendlyUrl: userInfo.resource.scheduling_url,
    }).where(eq(coachProfiles.id, coachProfileId));

    return { schedulingUrl: userInfo.resource.scheduling_url };
  },

  async disconnectCoach(coachProfileId: number): Promise<void> {
    await db.update(coachCalendlyIntegrations).set({ isActive: false, updatedAt: new Date() }).where(eq(coachCalendlyIntegrations.coachProfileId, coachProfileId));
    await db.update(coachProfiles).set({ calendarType: "internal", calendlyUrl: null }).where(eq(coachProfiles.id, coachProfileId));
  },

  async getConnectionStatus(coachProfileId: number) {
    const integration = await db.select().from(coachCalendlyIntegrations).where(eq(coachCalendlyIntegrations.coachProfileId, coachProfileId)).then((r) => r[0]);
    if (!integration) return { connected: false };
    return {
      connected: integration.isActive ?? false,
      schedulingUrl: integration.schedulingUrl || undefined,
      lastSyncAt: integration.lastSyncAt || undefined,
      error: integration.syncError || undefined,
    };
  },
};

// =============================================
// Webhook Handler
// =============================================

export const calendlyWebhookHandler = {
  async handleWebhook(payload: CalendlyWebhookPayload): Promise<void> {
    log.info(`[Calendly] Webhook received: ${payload.event}`);
    switch (payload.event) {
      case "invitee.created":
        await this.handleInviteeCreated(payload);
        break;
      case "invitee.canceled":
        await this.handleInviteeCanceled(payload);
        break;
      case "invitee_no_show.created":
        await this.handleInviteeNoShow(payload);
        break;
    }
  },

  async handleInviteeCreated(payload: CalendlyWebhookPayload): Promise<void> {
    const { event, invitee } = payload.payload;
    const existingSession = await db.select().from(sessions).where(eq(sessions.calendlyEventId, event.uri)).then((r) => r[0]);
    if (existingSession) {
      await db.update(sessions).set({ status: "confirmed", scheduledAt: new Date(event.start_time) }).where(eq(sessions.id, existingSession.id));
      broadcastService.toUsers([existingSession.coachId], "session:booked", {
        sessionId: existingSession.id,
        learnerEmail: invitee.email,
        learnerName: invitee.name,
        scheduledAt: event.start_time,
      });
    }
  },

  async handleInviteeCanceled(payload: CalendlyWebhookPayload): Promise<void> {
    const { event } = payload.payload;
    const session = await db.select().from(sessions).where(eq(sessions.calendlyEventId, event.uri)).then((r) => r[0]);
    if (!session) return;
    await db.update(sessions).set({ status: "cancelled", cancelledAt: new Date(), cancellationReason: "Canceled via Calendly" }).where(eq(sessions.id, session.id));
    broadcastService.toUsers([session.coachId], "session:canceled", { sessionId: session.id });
    broadcastService.toUsers([session.learnerId], "session:canceled", { sessionId: session.id });
  },

  async handleInviteeNoShow(payload: CalendlyWebhookPayload): Promise<void> {
    const session = await db.select().from(sessions).where(eq(sessions.calendlyEventId, payload.payload.event.uri)).then((r) => r[0]);
    if (!session) return;
    await db.update(sessions).set({ status: "no_show" }).where(eq(sessions.id, session.id));
  },
};

// =============================================
// Utility functions (preserved)
// =============================================

export function getCalendlyService(): CalendlyService {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) throw new Error("CALENDLY_API_KEY environment variable is not set");
  return new CalendlyService(apiKey);
}

export function formatAvailableTimesForDisplay(times: CalendlyAvailableTime[]): Map<string, CalendlyAvailableTime[]> {
  const grouped = new Map<string, CalendlyAvailableTime[]>();
  for (const time of times) {
    const date = new Date(time.start_time).toISOString().split("T")[0];
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(time);
  }
  return grouped;
}

export function parseWebhookPayload(payload: any) {
  return {
    event: payload.event,
    createdAt: payload.created_at,
    scheduledEvent: payload.payload?.scheduled_event,
    invitee: payload.payload?.invitee,
  };
}

export function hasCalendlyIntegration(coach: { calendlyEventTypeUri?: string | null }): boolean {
  return !!coach.calendlyEventTypeUri;
}

export default CalendlyService;
