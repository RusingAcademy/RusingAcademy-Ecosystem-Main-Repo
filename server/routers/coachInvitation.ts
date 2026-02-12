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
          }).catch(err => console.error("[Email] Failed to send terms acceptance email:", err));
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
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await getCoachesWithInvitationStatus();
  }),
  
  // Admin: Get all invitations
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
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
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
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
      
      return {
        ...result,
        invitationUrl,
      };
    }),
  
  // Admin: Revoke an invitation
  revoke: protectedProcedure
    .input(z.object({ invitationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await revokeCoachInvitation(input.invitationId);
      return { success: true };
    }),
});
