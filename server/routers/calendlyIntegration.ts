// server/routers/calendlyIntegration.ts — Phase 3: Calendly OAuth Integration
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { coachProfiles, coachCalendlyIntegrations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { phase3Config } from "../config/phase3";

async function getCoachProfileId(userId: number): Promise<number> {
  const db = await getDb();
  const profile = await db.select({ id: coachProfiles.id })
    .from(coachProfiles)
    .where(eq(coachProfiles.userId, userId))
    .then((r) => r[0]);
  if (!profile) throw new Error("Coach profile not found");
  return profile.id;
}

export const calendlyIntegrationRouter = router({
  // Get OAuth URL to start Calendly connection
  getOAuthUrl: protectedProcedure.query(() => {
    if (!phase3Config.calendly.enabled) {
      throw new Error("Calendly integration is not enabled. Configure CALENDLY_CLIENT_ID to enable.");
    }
    const state = Buffer.from(JSON.stringify({ ts: Date.now() })).toString("base64url");
    const params = new URLSearchParams({
      client_id: phase3Config.calendly.clientId,
      redirect_uri: phase3Config.calendly.redirectUri,
      response_type: "code",
      state,
    });
    return { url: `https://auth.calendly.com/oauth/authorize?${params.toString()}`, state };
  }),

  // Exchange OAuth code for tokens (called after redirect)
  handleOAuthCallback: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const coachProfileId = await getCoachProfileId(ctx.user!.id);

      // Exchange code for tokens
      const tokenResponse = await fetch("https://auth.calendly.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: phase3Config.calendly.clientId,
          client_secret: phase3Config.calendly.clientSecret,
          code: input.code,
          redirect_uri: phase3Config.calendly.redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange Calendly OAuth code");
      }

      const tokens = await tokenResponse.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        owner: string;
      };

      // Get user info from Calendly
      const userResponse = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const userData = await userResponse.json() as {
        resource: { uri: string; scheduling_url: string };
      };

      // Save integration
      await db.insert(coachCalendlyIntegrations).values({
        coachProfileId,
        calendlyUserUri: userData.resource.uri,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        schedulingUrl: userData.resource.scheduling_url,
        isActive: true,
      });

      // Update coach profile calendar type
      await db.update(coachProfiles).set({
        calendarType: "calendly",
        calendlyUrl: userData.resource.scheduling_url,
      }).where(eq(coachProfiles.id, coachProfileId));

      return { success: true, schedulingUrl: userData.resource.scheduling_url };
    }),

  // Get integration status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const coachProfileId = await getCoachProfileId(ctx.user!.id);
    const integration = await db.select()
      .from(coachCalendlyIntegrations)
      .where(eq(coachCalendlyIntegrations.coachProfileId, coachProfileId))
      .then((r) => r[0]);

    if (!integration) {
      return { connected: false, enabled: phase3Config.calendly.enabled };
    }

    return {
      connected: true,
      enabled: phase3Config.calendly.enabled,
      isActive: integration.isActive,
      schedulingUrl: integration.schedulingUrl,
      lastSyncAt: integration.lastSyncAt,
      syncError: integration.syncError,
    };
  }),

  // Disconnect Calendly
  disconnect: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    const coachProfileId = await getCoachProfileId(ctx.user!.id);

    await db.update(coachCalendlyIntegrations).set({
      isActive: false,
    }).where(eq(coachCalendlyIntegrations.coachProfileId, coachProfileId));

    await db.update(coachProfiles).set({
      calendarType: "internal",
    }).where(eq(coachProfiles.id, coachProfileId));

    return { success: true };
  }),
});
