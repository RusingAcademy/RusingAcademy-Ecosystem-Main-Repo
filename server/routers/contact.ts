import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { TRPCError } from "@trpc/server";
import { ecosystemLeads } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";

export const contactRouter = router({
  // Submit a contact form message
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      phone: z.string().optional(),
      subject: z.string().min(1, "Please select a subject"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      brand: z.enum(["ecosystem", "rusingacademy", "lingueefy", "barholex"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Database not available" 
        });
      }

      // Map subject to lead type
      const subjectToLeadType: Record<string, "individual" | "organization" | "government" | "enterprise"> = {
        general: "individual",
        learner: "individual",
        coach: "individual",
        technical: "individual",
        billing: "individual",
        partnership: "organization",
        enterprise: "enterprise",
      };

      // Map brand to source platform
      const brandToSource: Record<string, "rusingacademy" | "lingueefy" | "barholex" | "external"> = {
        ecosystem: "rusingacademy",
        rusingacademy: "rusingacademy",
        lingueefy: "lingueefy",
        barholex: "barholex",
      };

      try {
        // Insert the contact message as a lead
        const result = await db.insert(ecosystemLeads).values({
          firstName: input.name.split(' ')[0],
          lastName: input.name.split(' ').slice(1).join(' ') || null,
          email: input.email,
          phone: input.phone || null,
          sourcePlatform: brandToSource[input.brand] || "rusingacademy",
          formType: "contact",
          leadType: subjectToLeadType[input.subject] || "individual",
          status: "new",
          message: `[${input.subject.toUpperCase()}] ${input.message}`,
          interests: JSON.stringify([input.brand, input.subject]),
          preferredLanguage: "en", // Could be detected from browser or form
        });

        // Send notification to owner
        const subjectLabels: Record<string, string> = {
          general: "General Inquiry",
          learner: "Learner Support",
          coach: "Become a Coach",
          technical: "Technical Support",
          billing: "Billing & Payments",
          partnership: "Partnership Opportunity",
          enterprise: "Enterprise Solutions",
        };

        const brandLabels: Record<string, string> = {
          ecosystem: "Ecosystem Hub",
          rusingacademy: "RusingÂcademy",
          lingueefy: "Lingueefy",
          barholex: "Barholex Media",
        };

        await notifyOwner({
          title: `📬 New Contact: ${subjectLabels[input.subject] || input.subject}`,
          content: `
**New contact form submission received**

**From:** ${input.name}
**Email:** ${input.email}
${input.phone ? `**Phone:** ${input.phone}` : ''}
**Brand:** ${brandLabels[input.brand] || input.brand}
**Subject:** ${subjectLabels[input.subject] || input.subject}

**Message:**
${input.message}

---
*Respond within 24 hours as per our guarantee.*
          `.trim(),
        });

        return { 
          success: true, 
          message: "Your message has been sent successfully. We'll get back to you within 24 hours.",
        };
      } catch (error) {
        console.error("[Contact] Error saving contact message:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message. Please try again.",
        });
      }
    }),
});
