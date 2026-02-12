/**
 * Main App Router — Assembly File
 *
 * This file merges all domain-specific routers into a single tRPC appRouter.
 * Each domain router lives in its own file under server/routers/.
 *
 * Keep this file thin: only imports, the auth inline router, the cron inline
 * router, and the final appRouter assembly.
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

// ============================================================================
// SYSTEM & CORE ROUTERS
// ============================================================================
import { systemRouter } from "./_core/systemRouter";
import { contactRouter } from "./routers/contact";

// ============================================================================
// STANDALONE DOMAIN ROUTERS (extracted from this file)
// ============================================================================
import { coachRouter } from "./routers/coach";
import { learnerRouter } from "./routers/learner";
import { aiRouter } from "./routers/ai";
import { commissionRouter } from "./routers/commission";
import { stripeRouter } from "./routers/stripe";

// ============================================================================
// INLINE ROUTERS (extracted from this file)
// ============================================================================
import { bookingRouter } from "./routers/booking";
import { coachInvitationRouter } from "./routers/coachInvitation";
import { notificationRouter } from "./routers/notification";
import { notificationsRouter as notificationListRouter } from "./routers/notifications";
import { messageRouter } from "./routers/message";
import { adminRouter } from "./routers/admin";
import { documentsRouter } from "./routers/documents";
import { crmRouter } from "./routers/crm";
import { forumRouter } from "./routers/forum";
import { eventsRouter } from "./routers/events";
import { newsletterRouter } from "./routers/newsletter";
import { searchRouter } from "./routers/search";
import { remindersRouter } from "./routers/reminders";

// ============================================================================
// PRE-EXISTING DOMAIN ROUTERS (already in server/routers/)
// ============================================================================
import { coursesRouter } from "./routers/courses";
import { authRouter } from "./routers/auth";
import { subscriptionsRouter } from "./routers/subscriptions";
import { emailSettingsRouter } from "./routers/email-settings";
import { gamificationRouter } from "./routers/gamification";
import { certificatesRouter } from "./routers/certificates";
import { hrRouter } from "./routers/hr";
import { pathsRouter } from "./routers/paths";
import { lessonsRouter } from "./routers/lessons";
import { activitiesRouter } from "./routers/activities";
import { audioRouter } from "./routers/audio";
import { sleCompanionRouter } from "./routers/sleCompanion";
import { sleServicesRouter } from "./routers/sleServices";
import { sleProgressRouter } from "./routers/sleProgress";
import { adminStabilityRouter } from "./routers/adminStability";
import { stripeKPIRouter } from "./routers/stripeKPIData";
import { adminNotificationsRouter } from "./routers/adminNotifications";
import { learnerProgressionRouter } from "./routers/learnerProgression";
import { coachLearnerMetricsRouter } from "./routers/coachLearnerMetrics";
import { progressReportRouter } from "./routers/progressReport";
import { bunnyStreamRouter } from "./routers/bunnyStream";
import { crossPageRouter, stylePresetsRouter, revisionHistoryRouter } from "./routers/visualEditorAdvanced";
import { seoEditorRouter } from "./routers/seoEditor";
import { templateMarketplaceRouter } from "./routers/templateMarketplace";
import { qualityGateRouter } from "./routers/qualityGate";
import { adminCourseTreeRouter } from "./routers/adminCourseTree";
import { progressCascadeRouter } from "./routers/progressCascade";
import { badgeShowcaseRouter } from "./routers/badgeShowcase";

// ============================================================================
// ADMIN CONTROL CENTER SUB-ROUTERS
// ============================================================================
import {
  settingsRouter,
  cmsRouter,
  aiAnalyticsRouter,
  salesAnalyticsRouter,
  activityLogRouter,
  aiRulesRouter,
  mediaLibraryRouter,
  rbacRouter,
  emailTemplateRouter,
  notificationsRouter,
  importExportRouter,
  previewModeRouter,
  globalSearchRouter,
  aiPredictiveRouter,
} from "./routers/adminControlCenter";

// ============================================================================
// PREMIUM FEATURES SUB-ROUTERS
// ============================================================================
import {
  stripeTestingRouter,
  liveKPIRouter,
  onboardingRouter,
  enterpriseRouter,
  sleExamRouter,
  contentIntelligenceRouter,
  funnelsRouter,
  automationsRouter,
  orgBillingRouter,
  dripContentRouter,
  abTestingRouter,
  affiliateRouter,
} from "./routers/premiumFeatures";

// ============================================================================
// MAIN APP ROUTER
// ============================================================================
export const appRouter = router({
  system: systemRouter,
  contact: contactRouter,

  // Auth (inline - too small to extract)
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Domain routers
  coach: coachRouter,
  learner: learnerRouter,
  booking: bookingRouter,
  coachInvitation: coachInvitationRouter,
  ai: aiRouter,
  commission: commissionRouter,
  stripe: stripeRouter,
  courses: coursesRouter,
  customAuth: authRouter,
  subscriptions: subscriptionsRouter,
  emailSettings: emailSettingsRouter,
  gamification: gamificationRouter,
  certificates: certificatesRouter,
  hr: hrRouter,
  paths: pathsRouter,
  lessons: lessonsRouter,
  activities: activitiesRouter,
  audio: audioRouter,
  sleCompanion: sleCompanionRouter,
  sleServices: sleServicesRouter,
  sleProgress: sleProgressRouter,

  // Notification & messaging
  notification: notificationRouter,
  notifications: notificationListRouter,
  message: messageRouter,

  // Admin & documents
  admin: adminRouter,
  documents: documentsRouter,

  // CRM, forum, events
  crm: crmRouter,
  forum: forumRouter,
  events: eventsRouter,
  newsletter: newsletterRouter,
  search: searchRouter,
  reminders: remindersRouter,

  // Admin Control Center sub-routers
  settings: settingsRouter,
  cms: cmsRouter,
  crossPage: crossPageRouter,
  stylePresets: stylePresetsRouter,
  revisionHistory: revisionHistoryRouter,
  seo: seoEditorRouter,
  templateMarketplace: templateMarketplaceRouter,
  aiAnalytics: aiAnalyticsRouter,
  salesAnalytics: salesAnalyticsRouter,
  activityLog: activityLogRouter,
  aiRules: aiRulesRouter,
  mediaLibrary: mediaLibraryRouter,
  rbac: rbacRouter,
  emailTemplates: emailTemplateRouter,
  adminNotifications: notificationsRouter,
  importExport: importExportRouter,
  previewMode: previewModeRouter,
  globalSearch: globalSearchRouter,
  aiPredictive: aiPredictiveRouter,

  // Premium Features sub-routers
  stripeTesting: stripeTestingRouter,
  liveKPI: liveKPIRouter,
  onboarding: onboardingRouter,
  enterprise: enterpriseRouter,
  sleExam: sleExamRouter,
  contentIntelligence: contentIntelligenceRouter,
  contentIntel: contentIntelligenceRouter,
  funnels: funnelsRouter,
  automations: automationsRouter,
  orgBilling: orgBillingRouter,
  dripContent: dripContentRouter,
  abTesting: abTestingRouter,
  affiliate: affiliateRouter,

  // Production Stability sub-routers
  adminStability: adminStabilityRouter,
  stripeKPI: stripeKPIRouter,
  adminAlerts: adminNotificationsRouter,
  learnerProgression: learnerProgressionRouter,
  coachMetrics: coachLearnerMetricsRouter,
  progressReport: progressReportRouter,
  bunnyStream: bunnyStreamRouter,

  // Quality Gate & Admin Tree
  qualityGate: qualityGateRouter,
  adminCourseTree: adminCourseTreeRouter,
  progressCascade: progressCascadeRouter,
  badgeShowcase: badgeShowcaseRouter,

  // Cron jobs (inline - too small to extract)
  cron: router({
    sendEventReminders: publicProcedure
      .input(z.object({ secret: z.string() }))
      .mutation(async ({ input }) => {
        if (input.secret !== process.env.CRON_SECRET) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid cron secret" });
        }
        const { sendEventReminders } = await import("./cron/event-reminders");
        return sendEventReminders();
      }),
  }),
});

export type AppRouter = typeof appRouter;
