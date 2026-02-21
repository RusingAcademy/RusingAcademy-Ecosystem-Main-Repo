/**
 * Invitation Enhancements Router — Phase 4 of Auth System Improvement
 *
 * Adds bulk invitations, invitation templates, analytics/tracking,
 * and department-based invitations on top of the existing invitations router.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, desc, sql, count, gte, inArray } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { sendEmail } from "../email";
import { generateEmailHeader, generateEmailFooter, EMAIL_BRANDING } from "../email-branding";
import { randomBytes } from "crypto";
import { createLogger } from "../logger";

const log = createLogger("routers-invitation-enhancements");

// ============================================================================
// Helpers
// ============================================================================

function generateInviteToken(): string {
  return randomBytes(32).toString("hex");
}

function assertAdminOrOwner(ctx: { user: { role: string; openId: string; isOwner?: boolean } }): void {
  const role = ctx.user.role;
  if (role !== "admin" && role !== "owner" && role !== "hr_admin" && !ctx.user.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin, Owner, or HR Admin access required" });
  }
}

function getBaseUrl(req?: any): string {
  if (process.env.VITE_APP_URL) return process.env.VITE_APP_URL;
  if (req) {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "app.rusingacademy.ca";
    return `${proto}://${host}`;
  }
  return "https://app.rusingacademy.ca";
}

// ============================================================================
// Email Templates
// ============================================================================

interface InvitationEmailParams {
  email: string;
  token: string;
  role: string;
  inviterName: string;
  baseUrl: string;
  template?: "default" | "welcome" | "team" | "vip";
  customMessage?: string;
  language?: "en" | "fr";
}

function buildInvitationEmail(params: InvitationEmailParams): { html: string; text: string; subject: string } {
  const { email, token, role, inviterName, baseUrl, template = "default", customMessage, language = "en" } = params;
  const inviteUrl = `${baseUrl}/invite/${token}`;
  const roleName = role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const subjects: Record<string, Record<string, string>> = {
    default: {
      en: `You're invited to join RusingAcademy as ${roleName}`,
      fr: `Vous êtes invité(e) à rejoindre RusingAcademy en tant que ${roleName}`,
    },
    welcome: {
      en: `Welcome to RusingAcademy — Your journey to bilingual excellence starts here`,
      fr: `Bienvenue à RusingAcademy — Votre parcours vers l'excellence bilingue commence ici`,
    },
    team: {
      en: `Your team at RusingAcademy is waiting for you`,
      fr: `Votre équipe à RusingAcademy vous attend`,
    },
    vip: {
      en: `Exclusive invitation to RusingAcademy — Premium Access`,
      fr: `Invitation exclusive à RusingAcademy — Accès Premium`,
    },
  };

  const bodies: Record<string, Record<string, string>> = {
    default: {
      en: `<strong>${inviterName}</strong> has invited you to join <strong>RusingAcademy</strong> as a <strong>${roleName}</strong>.`,
      fr: `<strong>${inviterName}</strong> vous a invité(e) à rejoindre <strong>RusingAcademy</strong> en tant que <strong>${roleName}</strong>.`,
    },
    welcome: {
      en: `Welcome! <strong>${inviterName}</strong> believes you'd be a great addition to the RusingAcademy community. You've been invited to join as a <strong>${roleName}</strong>.`,
      fr: `Bienvenue ! <strong>${inviterName}</strong> croit que vous seriez un excellent ajout à la communauté RusingAcademy. Vous avez été invité(e) à rejoindre en tant que <strong>${roleName}</strong>.`,
    },
    team: {
      en: `Your organization has partnered with RusingAcademy to provide bilingual training. <strong>${inviterName}</strong> has invited you to join as a <strong>${roleName}</strong>.`,
      fr: `Votre organisation s'est associée à RusingAcademy pour offrir une formation bilingue. <strong>${inviterName}</strong> vous a invité(e) à rejoindre en tant que <strong>${roleName}</strong>.`,
    },
    vip: {
      en: `You've been selected for exclusive access to RusingAcademy. <strong>${inviterName}</strong> has personally invited you to join as a <strong>${roleName}</strong> with premium benefits.`,
      fr: `Vous avez été sélectionné(e) pour un accès exclusif à RusingAcademy. <strong>${inviterName}</strong> vous a personnellement invité(e) à rejoindre en tant que <strong>${roleName}</strong> avec des avantages premium.`,
    },
  };

  const ctaLabels: Record<string, string> = {
    en: "Accept Invitation",
    fr: "Accepter l'invitation",
  };

  const expiryNotes: Record<string, string> = {
    en: "This invitation expires in <strong>7 days</strong>. If you did not expect this invitation, you can safely ignore this email.",
    fr: "Cette invitation expire dans <strong>7 jours</strong>. Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.",
  };

  const subject = subjects[template]?.[language] || subjects.default[language] || subjects.default.en;
  const bodyText = bodies[template]?.[language] || bodies.default[language] || bodies.default.en;

  const html = `
    ${generateEmailHeader(subject, language === "fr" ? `Rejoignez en tant que ${roleName}` : `Join as ${roleName}`)}
    <div style="padding: 32px; font-family: ${EMAIL_BRANDING.fontFamily}; color: #1a1a2e;">
      <p style="font-size: 16px; line-height: 1.6;">${language === "fr" ? "Bonjour," : "Hello,"}</p>
      <p style="font-size: 16px; line-height: 1.6;">${bodyText}</p>
      ${customMessage ? `<div style="margin: 20px 0; padding: 16px; background: #f8f9fa; border-left: 4px solid ${EMAIL_BRANDING.primaryColor}; border-radius: 4px;"><p style="font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">"${customMessage}"</p><p style="font-size: 12px; color: #6b7280; margin: 8px 0 0 0;">— ${inviterName}</p></div>` : ""}
      <p style="font-size: 16px; line-height: 1.6;">
        ${language === "fr"
          ? "RusingAcademy est une plateforme d'apprentissage bilingue premium dédiée à aider les fonctionnaires canadiens à atteindre leurs objectifs de compétence linguistique."
          : "RusingAcademy is a premium bilingual learning platform dedicated to helping Canadian public servants achieve their language proficiency goals."}
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${inviteUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${EMAIL_BRANDING.primaryColor}, ${EMAIL_BRANDING.accentColor || "#6366f1"}); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          ${ctaLabels[language] || ctaLabels.en}
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${expiryNotes[language] || expiryNotes.en}</p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; word-break: break-all;">
        ${language === "fr" ? "Ou copiez ce lien" : "Or copy this link"}: ${inviteUrl}
      </p>
    </div>
    ${generateEmailFooter(language)}
  `;

  const text = `${inviterName} ${language === "fr" ? "vous a invité(e) à rejoindre" : "has invited you to join"} RusingAcademy ${language === "fr" ? "en tant que" : "as"} ${roleName}. ${language === "fr" ? "Acceptez votre invitation ici" : "Accept your invitation here"}: ${inviteUrl}${customMessage ? ` — "${customMessage}"` : ""}`;

  return { html, text, subject };
}

// ============================================================================
// Router
// ============================================================================

export const invitationEnhancementsRouter = router({
  /**
   * 4.1 — Bulk Invite: Send invitations to multiple emails at once
   */
  bulkInvite: protectedProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()).min(1).max(50),
        role: z.enum(["admin", "hr_admin", "coach", "learner", "user"]),
        template: z.enum(["default", "welcome", "team", "vip"]).default("default"),
        customMessage: z.string().max(500).optional(),
        language: z.enum(["en", "fr"]).default("en"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertAdminOrOwner(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const baseUrl = getBaseUrl(ctx.req);
      const inviterName = ctx.user.name || ctx.user.email || "RusingAcademy Admin";
      const results: Array<{ email: string; status: "sent" | "exists" | "duplicate" | "error"; message?: string }> = [];

      for (const email of input.emails) {
        const normalizedEmail = email.toLowerCase().trim();

        try {
          // Check if user already exists
          const [existingUser] = await db
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.email, normalizedEmail))
            .limit(1);

          if (existingUser) {
            results.push({ email: normalizedEmail, status: "exists", message: "User already has an account" });
            continue;
          }

          // Check for existing pending invitation
          const [existingInvite] = await db
            .select({ id: schema.adminInvitations.id })
            .from(schema.adminInvitations)
            .where(
              and(
                eq(schema.adminInvitations.email, normalizedEmail),
                eq(schema.adminInvitations.status, "pending")
              )
            )
            .limit(1);

          if (existingInvite) {
            results.push({ email: normalizedEmail, status: "duplicate", message: "Pending invitation already exists" });
            continue;
          }

          // Create invitation
          const token = generateInviteToken();
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          await db.insert(schema.adminInvitations).values({
            email: normalizedEmail,
            role: input.role,
            token,
            invitedBy: ctx.user.id,
            status: "pending",
            expiresAt,
          });

          // Send email
          const emailContent = buildInvitationEmail({
            email: normalizedEmail,
            token,
            role: input.role,
            inviterName,
            baseUrl,
            template: input.template,
            customMessage: input.customMessage,
            language: input.language,
          });

          await sendEmail({
            to: normalizedEmail,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });

          results.push({ email: normalizedEmail, status: "sent" });
        } catch (error) {
          log.error(`[BulkInvite] Failed for ${normalizedEmail}:`, error);
          results.push({ email: normalizedEmail, status: "error", message: "Failed to send invitation" });
        }
      }

      const sent = results.filter((r) => r.status === "sent").length;
      const skipped = results.filter((r) => r.status !== "sent").length;
      log.info(`[BulkInvite] ${sent} sent, ${skipped} skipped by ${ctx.user.email}`);

      return { results, summary: { total: input.emails.length, sent, skipped } };
    }),

  /**
   * 4.2 — Invitation Analytics: stats for the invitation tracking dashboard
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    assertAdminOrOwner(ctx);
    const db = await getDb();
    if (!db) return { total: 0, pending: 0, accepted: 0, expired: 0, revoked: 0, conversionRate: 0, avgAcceptTime: 0 };

    try {
      // Count by status
      const statusCounts = await db
        .select({
          status: schema.adminInvitations.status,
          count: count(),
        })
        .from(schema.adminInvitations)
        .groupBy(schema.adminInvitations.status);

      const counts: Record<string, number> = {};
      for (const row of statusCounts) {
        counts[row.status] = row.count;
      }

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const pending = counts["pending"] || 0;
      const accepted = counts["accepted"] || 0;
      const expired = counts["expired"] || 0;
      const revoked = counts["revoked"] || 0;

      // Conversion rate
      const completedInvitations = accepted + expired + revoked;
      const conversionRate = completedInvitations > 0 ? Math.round((accepted / completedInvitations) * 100) : 0;

      // Average time to accept (in hours)
      const acceptedInvitations = await db
        .select({
          createdAt: schema.adminInvitations.createdAt,
          acceptedAt: schema.adminInvitations.acceptedAt,
        })
        .from(schema.adminInvitations)
        .where(eq(schema.adminInvitations.status, "accepted"));

      let totalAcceptTimeMs = 0;
      let acceptCount = 0;
      for (const inv of acceptedInvitations) {
        if (inv.acceptedAt && inv.createdAt) {
          totalAcceptTimeMs += new Date(inv.acceptedAt).getTime() - new Date(inv.createdAt).getTime();
          acceptCount++;
        }
      }
      const avgAcceptTime = acceptCount > 0 ? Math.round(totalAcceptTimeMs / acceptCount / 3600000) : 0; // hours

      // Recent invitations by day (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentByDay = await db
        .select({
          date: sql<string>`DATE(${schema.adminInvitations.createdAt})`,
          count: count(),
        })
        .from(schema.adminInvitations)
        .where(gte(schema.adminInvitations.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${schema.adminInvitations.createdAt})`)
        .orderBy(sql`DATE(${schema.adminInvitations.createdAt})`);

      // Invitations by role
      const byRole = await db
        .select({
          role: schema.adminInvitations.role,
          count: count(),
        })
        .from(schema.adminInvitations)
        .groupBy(schema.adminInvitations.role);

      return {
        total,
        pending,
        accepted,
        expired,
        revoked,
        conversionRate,
        avgAcceptTime,
        recentByDay: recentByDay.map((r) => ({ date: r.date, count: r.count })),
        byRole: byRole.map((r) => ({ role: r.role, count: r.count })),
      };
    } catch (error) {
      log.error("Failed to get invitation analytics:", error);
      return { total: 0, pending: 0, accepted: 0, expired: 0, revoked: 0, conversionRate: 0, avgAcceptTime: 0 };
    }
  }),

  /**
   * 4.3 — Bulk Revoke: Cancel multiple pending invitations
   */
  bulkRevoke: protectedProcedure
    .input(z.object({ invitationIds: z.array(z.number()).min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      assertAdminOrOwner(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let revoked = 0;
      for (const id of input.invitationIds) {
        try {
          const result = await db
            .update(schema.adminInvitations)
            .set({ status: "revoked" })
            .where(
              and(
                eq(schema.adminInvitations.id, id),
                eq(schema.adminInvitations.status, "pending")
              )
            );
          revoked++;
        } catch (error) {
          log.error(`[BulkRevoke] Failed for invitation ${id}:`, error);
        }
      }

      log.info(`[BulkRevoke] ${revoked}/${input.invitationIds.length} revoked by ${ctx.user.email}`);
      return { revoked, total: input.invitationIds.length };
    }),

  /**
   * 4.4 — Resend with Template: Resend invitation with a different template
   */
  resendWithTemplate: protectedProcedure
    .input(
      z.object({
        invitationId: z.number(),
        template: z.enum(["default", "welcome", "team", "vip"]).default("default"),
        customMessage: z.string().max(500).optional(),
        language: z.enum(["en", "fr"]).default("en"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertAdminOrOwner(ctx);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [invitation] = await db
        .select()
        .from(schema.adminInvitations)
        .where(eq(schema.adminInvitations.id, input.invitationId))
        .limit(1);

      if (!invitation) throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      if (invitation.status === "accepted") throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot resend an accepted invitation" });

      // Generate new token and extend expiry
      const newToken = generateInviteToken();
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db
        .update(schema.adminInvitations)
        .set({ token: newToken, expiresAt: newExpiresAt, status: "pending" })
        .where(eq(schema.adminInvitations.id, input.invitationId));

      const baseUrl = getBaseUrl(ctx.req);
      const inviterName = ctx.user.name || ctx.user.email || "RusingAcademy Admin";

      const emailContent = buildInvitationEmail({
        email: invitation.email,
        token: newToken,
        role: invitation.role,
        inviterName,
        baseUrl,
        template: input.template,
        customMessage: input.customMessage,
        language: input.language,
      });

      try {
        await sendEmail({
          to: invitation.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
        log.info(`[ResendTemplate] Resent to ${invitation.email} with template=${input.template}`);
      } catch (emailError) {
        log.error("[ResendTemplate] Failed to send email:", emailError);
      }

      return { success: true, email: invitation.email, expiresAt: newExpiresAt };
    }),

  /**
   * 4.5 — Get available email templates
   */
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    assertAdminOrOwner(ctx);
    return {
      templates: [
        {
          id: "default",
          nameEn: "Standard Invitation",
          nameFr: "Invitation standard",
          descriptionEn: "Clean, professional invitation with role details",
          descriptionFr: "Invitation professionnelle avec détails du rôle",
        },
        {
          id: "welcome",
          nameEn: "Warm Welcome",
          nameFr: "Accueil chaleureux",
          descriptionEn: "Friendly welcome message emphasizing community",
          descriptionFr: "Message d'accueil chaleureux mettant l'accent sur la communauté",
        },
        {
          id: "team",
          nameEn: "Team Onboarding",
          nameFr: "Intégration d'équipe",
          descriptionEn: "Organization-focused invitation for team members",
          descriptionFr: "Invitation axée sur l'organisation pour les membres de l'équipe",
        },
        {
          id: "vip",
          nameEn: "VIP / Premium",
          nameFr: "VIP / Premium",
          descriptionEn: "Exclusive invitation with premium positioning",
          descriptionFr: "Invitation exclusive avec positionnement premium",
        },
      ],
    };
  }),
});
