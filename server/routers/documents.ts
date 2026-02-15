import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { createLogger } from "../logger";

const log = createLogger("routers-documents");

export const documentsRouter = router({
  list: protectedProcedure
    .input(z.object({ coachId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const { coachDocuments } = await import("../../drizzle/schema");
      const docs = await db
        .select()
        .from(coachDocuments)
        .where(eq(coachDocuments.coachId, input.coachId))
        .orderBy(desc(coachDocuments.createdAt));
      return docs;
    }),

  upload: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        applicationId: z.number().optional(),
        documentType: z.enum([
          "id_proof",
          "degree",
          "teaching_cert",
          "sle_results",
          "language_cert",
          "background_check",
          "other",
        ]),
        title: z.string(),
        description: z.string().optional(),
        issuingAuthority: z.string().optional(),
        issueDate: z.date().optional(),
        expiryDate: z.date().optional(),
        fileData: z.string(), // base64 encoded
        fileName: z.string(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachDocuments } = await import("../../drizzle/schema");
      const { storagePut } = await import("../storage");

      // Upload file to S3 storage
      let fileUrl: string;
      try {
        // Extract base64 data (handle both with and without data URI prefix)
        const base64Data = input.fileData.includes(",")
          ? input.fileData.split(",")[1]
          : input.fileData;
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedFileName = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `coach-documents/${input.coachId}/${timestamp}-${sanitizedFileName}`;

        const { url } = await storagePut(filePath, buffer, input.mimeType);
        fileUrl = url;
      } catch (storageError) {
        log.error("S3 upload failed, falling back to base64:", storageError);
        // Fallback to base64 if S3 fails
        fileUrl = `data:${input.mimeType};base64,${input.fileData.split(",")[1] || input.fileData}`;
      }

      const [result] = await db
        .insert(coachDocuments)
        .values({
          coachId: input.coachId,
          applicationId: input.applicationId,
          documentType: input.documentType,
          title: input.title,
          description: input.description,
          issuingAuthority: input.issuingAuthority,
          issueDate: input.issueDate,
          expiryDate: input.expiryDate,
          fileUrl,
          fileName: input.fileName,
          status: "pending",
        })
        .$returningId();

      return { id: result.id, success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachDocuments } = await import("../../drizzle/schema");

      // Verify ownership
      const [doc] = await db
        .select()
        .from(coachDocuments)
        .where(eq(coachDocuments.id, input.documentId));
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });

      // Only allow deletion of pending or rejected documents
      if (doc.status === "verified") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete verified documents" });
      }

      await db.delete(coachDocuments).where(eq(coachDocuments.id, input.documentId));
      return { success: true };
    }),

  // Admin: verify a document
  verify: protectedProcedure
    .input(z.object({ documentId: z.number(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachDocuments } = await import("../../drizzle/schema");

      await db
        .update(coachDocuments)
        .set({
          status: "verified",
          verifiedBy: ctx.user.id,
          verifiedAt: new Date(),
          rejectionReason: input.notes,
        })
        .where(eq(coachDocuments.id, input.documentId));

      return { success: true };
    }),

  // Admin: reject a document
  reject: protectedProcedure
    .input(z.object({ documentId: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.openId !== process.env.OWNER_OPEN_ID) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      const { coachDocuments } = await import("../../drizzle/schema");

      await db
        .update(coachDocuments)
        .set({
          status: "rejected",
          verifiedBy: ctx.user.id,
          verifiedAt: new Date(),
          rejectionReason: input.reason,
        })
        .where(eq(coachDocuments.id, input.documentId));

      return { success: true };
    }),
});
