import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  claimCoachInvitation,
  createCoachInvitation,
  getAllCoachInvitations,
  getCoachesWithInvitationStatus,
  getInvitationByToken,
  revokeCoachInvitation,
} from "../db";
import { createLogger } from "../logger";
const log = createLogger("routers-coachInvitation");


export const coachInvitationRouter = router({
  // Get invitation details by token (public - for claim page)
  getByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const invitation = await getInvitationByToken(input.token);
      if (!invitation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }
      
      // Check if expired
      const isExpired = new Date() > invitation.invitation.expiresAt;
      const isClaimed = invitation.invitation.status === 'claimed';
      
      return {
        id: invitation.invitation.id,
        status: invitation.invitation.status,
        expiresAt: invitation.invitation.expiresAt,
        isExpired,
        isClaimed,
        coachName: invitation.user.name,
        coachHeadline: invitation.coach.headline,
        coachSlug: invitation.coach.slug,
      };
    }),
  
  // Claim an invitation (requires login)
  claim: protectedProcedure
    .input(z.object({ 
      token: z.string(),
      termsAccepted: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // Require terms acceptance
      if (!input.termsAccepted) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Vous devez accepter les termes et conditions pour réclamer votre profil" 
        });
      }
      
      try {
        const result = await claimCoachInvitation(input.token, ctx.user.id, input.termsAccepted);
        
        // Send confirmation email for terms acceptance
        if (input.termsAccepted && ctx.user.email) {
          const { sendCoachTermsAcceptanceEmail } = await import("../email-coach-terms");
          await sendCoachTermsAcceptanceEmail({
            coachName: ctx.user.name || "Coach",
            coachEmail: ctx.user.email,
            acceptedAt: new Date(),
            termsVersion: "v2026.01.29",
            language: "fr",
          }).catch(err => log.error("[Email] Failed to send terms acceptance email:", err));
        }
        
        return result;
      } catch (error) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: error instanceof Error ? error.message : "Failed to claim invitation" 
        });
      }
    }),
  
  // Admin: Get all coaches with invitation status
  getCoachesWithStatus: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await getCoachesWithInvitationStatus();
  }),
  
  // Admin: Get all invitations
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await getAllCoachInvitations();
  }),
  
  // Admin: Create invitation for a coach
  create: protectedProcedure
    .input(z.object({
      coachProfileId: z.number(),
      email: z.string().email(),
      expiresInDays: z.number().min(1).max(90).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      
      const result = await createCoachInvitation({
        coachProfileId: input.coachProfileId,
        email: input.email,
        createdBy: ctx.user.id,
        expiresInDays: input.expiresInDays,
      });
      
      // Generate the full invitation URL
      const baseUrl = ctx.req.headers.origin || 'https://www.rusingacademy.ca';
      const invitationUrl = `${baseUrl}/coach-invite/${result.token}`;
      
      // Send invitation email to the coach
      try {
        const { sendEmail } = await import("../email-service");
        const { EMAIL_BRANDING } = await import("../email-branding");
        
        const expiresInDays = input.expiresInDays || 30;
        const expiresDate = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
        
        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 30px 0;">
              <img src="${EMAIL_BRANDING.logos.banner}" alt="RusingAcademy" style="max-width: 200px; height: auto;" />
            </div>
            <div style="padding: 20px; background: #f9fafb; border-radius: 12px;">
              <h2 style="color: ${EMAIL_BRANDING.colors.primary}; margin-top: 0;">You're Invited to Join RusingAcademy as a Coach!</h2>
              <p style="color: ${EMAIL_BRANDING.colors.text}; line-height: 1.6;">
                You have been invited to join the RusingAcademy coaching team. As a coach, you'll help public servants 
                master their second language through personalized 1-on-1 sessions.
              </p>
              <p style="color: ${EMAIL_BRANDING.colors.text}; line-height: 1.6;">
                Click the button below to claim your coach profile and get started:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="display: inline-block; padding: 14px 32px; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Claim Your Coach Profile
                </a>
              </div>
              <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px;">
                This invitation expires on ${expiresDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}.
              </p>
              <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">
                If you did not expect this invitation, you can safely ignore this email.
              </p>
            </div>
          </div>
        `;
        
        await sendEmail({
          to: input.email,
          subject: "You're Invited to Coach at RusingAcademy",
          html: htmlContent,
        });
        log.info(`[CoachInvite] Invitation email sent to ${input.email}`);
      } catch (emailErr) {
        log.error("[CoachInvite] Failed to send invitation email:", emailErr);
        // Don't fail the invitation creation if email fails
      }
      
      return {
        ...result,
        invitationUrl,
      };
    }),
  
  // Admin: Revoke an invitation
  revoke: protectedProcedure
    .input(z.object({ invitationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner" && !ctx.user.isOwner && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await revokeCoachInvitation(input.invitationId);
      return { success: true };
    }),
});
