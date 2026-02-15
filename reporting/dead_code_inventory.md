# Dead Code Inventory — GitHub (main) vs Manus Workspace

**Repository:** RusingAcademy/rusingacademy-ecosystem  
**GitHub HEAD:** `94dd725` (main, PR #97 merged)  
**Manus Checkpoint:** `e6b9c9e0`  
**Date:** February 12, 2026  
**Total GitHub-only files:** 256

---

## Summary

| Category | Plug-and-play | Adapt | Archive | Total |
|---|---|---|---|---|
| TSX Components | 23 | 6 | 17 | 46 |
| TSX Feature Components | 9 | 0 | 2 | 11 |
| TSX Pages | 6 | 1 | 3 | 10 |
| Media Assets | 0 | 103 | 86 | 189 |
| **TOTAL** | **38** | **110** | **108** | **256** |

---

## Part 1: TSX Files (67 files)

### ✅ Plug-and-Play (38 files)

These files have zero broken imports, zero tRPC/DB dependencies, and can be wired into the app by simply adding a route or import statement.

| # | Path | Type | Lines | Feature | Imports | tRPC/DB Deps | Action |
|---|---|---|---|---|---|---|---|
| 1 | `./client/src/components/PerformanceMonitoringDashboard.tsx` | component | 205 | analytics | 6 OK | none | KEEP & WIRE |
| 2 | `./client/src/components/PermissionGate.tsx` | component | 95 | auth/rbac | 3 OK | none | KEEP & WIRE |
| 3 | `./client/src/components/RoleBasedRoute.tsx` | component | 108 | auth/rbac | 3 OK | none | KEEP & WIRE |
| 4 | `./client/src/components/CoachOnboardingWizard.tsx` | component | 220 | coaching | 10 OK | none | KEEP & WIRE |
| 5 | `./client/src/pages/portal/CoachingHub.tsx` | page | 324 | coaching | 6 OK | none | KEEP & WIRE |
| 6 | `./client/src/components/paths/StevenAIPathAssistant.tsx` | feature-component | 330 | courses/paths | 8 OK | none | KEEP & WIRE |
| 7 | `./client/src/pages/portal/MyPath.tsx` | page | 269 | courses/paths | 7 OK | none | KEEP & WIRE |
| 8 | `./client/src/components/LeadPipelineKanban.tsx` | component | 497 | crm/sales | 3 OK | none | KEEP & WIRE |
| 9 | `./client/src/components/CRMExportButton.tsx` | component | 390 | documents | 3 OK | none | KEEP & WIRE |
| 10 | `./client/src/components/EcosystemSwitcher.tsx` | component | 282 | ecosystem-nav | 6 OK | none | KEEP & WIRE |
| 11 | `./client/src/components/MotivationalNudge.tsx` | component | 221 | engagement | 1 OK | none | KEEP & WIRE |
| 12 | `./client/src/components/engagement/AntiDropOffSystem.tsx` | feature-component | 124 | engagement | 2 OK | none | KEEP & WIRE |
| 13 | `./client/src/components/gamification/BadgeSystem.tsx` | feature-component | 75 | gamification | 2 OK | none | KEEP & WIRE |
| 14 | `./client/src/components/gamification/XPSystem.tsx` | feature-component | 79 | gamification | 2 OK | none | KEEP & WIRE |
| 15 | `./client/src/pages/BadgesPage.tsx` | page | 45 | gamification | 6 OK | none | KEEP & WIRE |
| 16 | `./client/src/pages/CoachDashboardNew.tsx` | page | 215 | learner-portal | 4 OK | none | KEEP & WIRE |
| 17 | `./client/src/pages/portal/PortalOverview.tsx` | page | 271 | learner-portal | 6 OK | none | KEEP & WIRE |
| 18 | `./client/src/components/CoachVideoGallery.tsx` | component | 358 | media/content | 3 OK | none | KEEP & WIRE |
| 19 | `./client/src/components/ListeningExercise.tsx` | component | 324 | media/content | 8 OK | none | KEEP & WIRE |
| 20 | `./client/src/components/VideoUploadWithEncouragement.tsx` | component | 79 | media/content | 2 OK | none | KEEP & WIRE |
| 21 | `./client/src/components/NotificationSettings.tsx` | component | 287 | notifications | 9 OK | none | KEEP & WIRE |
| 22 | `./client/src/components/RepetitionExercise.tsx` | component | 400 | practice/exercises | 6 OK | none | KEEP & WIRE |
| 23 | `./client/src/components/gamification/VoicePracticeLoop.tsx` | feature-component | 187 | practice/exercises | 2 OK | none | KEEP & WIRE |
| 24 | `./client/src/components/NativeCalendar.tsx` | component | 183 | scheduling | 9 OK | none | KEEP & WIRE |
| 25 | `./client/src/components/SEOPillarPages.tsx` | component | 300 | seo | 2 OK | none | KEEP & WIRE |
| 26 | `./client/src/components/SessionSummaryCard.tsx` | component | 308 | session-tracking | 6 OK | none | KEEP & WIRE |
| 27 | `./client/src/components/SLEWrittenExamScreen.tsx` | component | 874 | sle-exam | 4 OK | none | KEEP & WIRE |
| 28 | `./client/src/components/exam/ExamReadinessMode.tsx` | feature-component | 148 | sle-exam | 2 OK | none | KEEP & WIRE |
| 29 | `./client/src/components/CTAButton.tsx` | component | 157 | ui/design | 5 OK | none | KEEP & WIRE |
| 30 | `./client/src/components/PremiumFeatureCard.tsx` | component | 136 | ui/design | 2 OK | none | KEEP & WIRE |
| 31 | `./client/src/components/OptimizedImage.tsx` | component | 167 | ui/utility | 2 OK | none | KEEP & WIRE |
| 32 | `./client/src/components/PageShell.tsx` | component | 55 | ui/utility | 3 OK | none | KEEP & WIRE |
| 33 | `./client/src/components/TypewriterText.tsx` | component | 215 | ui/utility | 1 OK | none | KEEP & WIRE |
| 34 | `./client/src/components/ManusDialog.tsx` | component | 90 | unknown | 2 OK | none | KEEP & WIRE |
| 35 | `./client/src/components/engagement/EmptyStates.tsx` | feature-component | 218 | unknown | 2 OK | none | KEEP & WIRE |
| 36 | `./client/src/components/engagement/NextStepEngine.tsx` | feature-component | 174 | unknown | 3 OK | none | KEEP & WIRE |
| 37 | `./client/src/components/engagement/PersonalizationProfiles.tsx` | feature-component | 319 | unknown | 5 OK | none | KEEP & WIRE |
| 38 | `./client/src/pages/portal/ResourceLibrary.tsx` | page | 276 | unknown | 7 OK | none | KEEP & WIRE |

### ⚠️ Adaptation Required (7 files)

These files compile but require backend procedures (tRPC endpoints) or minor import updates before they can function.

| # | Path | Type | Lines | Feature | Missing Dependencies | Effort | Action |
|---|---|---|---|---|---|---|---|
| 1 | `./client/src/components/TeamGoalsLeaderboard.tsx` | component | 590 | crm/sales | trpc.crm.getSalesGoals, trpc.admin.getAnalytics, trpc.crm.createSalesGoal, trpc.crm.assignTeamGoalMember | High | ADAPT |
| 2 | `./client/src/components/DocumentVerification.tsx` | component | 475 | documents | trpc.documents.list, trpc.documents.upload, trpc.documents.delete | Medium | ADAPT |
| 3 | `./client/src/components/HRExportButton.tsx` | component | 190 | documents | trpc.hr.exportReport | Low | ADAPT |
| 4 | `./client/src/components/NewsletterSubscription.tsx` | component | 311 | notifications | trpc.newsletter.subscribe | Medium | ADAPT |
| 5 | `./client/src/components/AvailabilityCalendar.tsx` | component | 330 | scheduling | trpc.coach.availableSlots | Medium | ADAPT |
| 6 | `./client/src/components/BrandContactForms.tsx` | component | 626 | unknown | trpc.crm.importLeads, trpc.crm.importLeads, trpc.crm.importLeads | High | ADAPT |
| 7 | `./client/src/pages/ComponentShowcase.tsx` | page | 1438 | unknown | trpc.ai.chat | High | ADAPT |

### ❌ Archive (22 files)

These files are either already reimplemented in Manus, have broken dependencies that reference non-existent modules, or are superseded by better implementations.

| # | Path | Type | Lines | Feature | Reason | Manus Equivalent |
|---|---|---|---|---|---|---|
| 1 | `./client/src/components/AdminPerformanceDashboard.tsx` | component | 299 | analytics | 1 broken local imports, 0 missing packages | — |
| 2 | `./client/src/components/ApplicationAnalyticsDashboard.tsx` | component | 274 | analytics | 1 broken local imports, 0 missing packages | — |
| 3 | `./client/src/components/TeamAnalyticsDashboard.tsx` | component | 228 | analytics | 1 broken local imports, 0 missing packages | — |
| 4 | `./client/src/pages/portal/PerformanceReport.tsx` | page | 72 | analytics | 1 broken local imports, 0 missing packages | — |
| 5 | `./client/src/components/AdminCoachApproval.tsx` | component | 193 | coaching | Already reimplemented as client/src/pages/admin/CoachesManagement.tsx | client/src/pages/admin/CoachesManagement.tsx |
| 6 | `./client/src/pages/BecomeCoachPage.tsx` | page | 119 | coaching | Already reimplemented as client/src/pages/BecomeCoach.tsx | client/src/pages/BecomeCoach.tsx |
| 7 | `./client/src/components/paths/LMSCourseViewer.tsx` | feature-component | 363 | courses/paths | 1 broken local imports, 0 missing packages | — |
| 8 | `./client/src/components/paths/PathOverview.tsx` | feature-component | 248 | courses/paths | 1 broken local imports, 0 missing packages | — |
| 9 | `./client/src/components/ApplicationExportButton.tsx` | component | 136 | documents | 2 broken local imports, 0 missing packages | — |
| 10 | `./client/src/pages/EcosystemHub.tsx.tsx` | page | 1679 | ecosystem-nav | Already reimplemented as client/src/pages/EcosystemHub.tsx | client/src/pages/EcosystemHub.tsx |
| 11 | `./client/src/components/AdminBadgesDisplay.tsx` | component | 246 | gamification | 1 broken local imports, 0 missing packages | — |
| 12 | `./client/src/components/BadgeConfigurationPanel.tsx` | component | 290 | gamification | 1 broken local imports, 0 missing packages | — |
| 13 | `./client/src/components/InAppMessaging.tsx` | component | 404 | messaging | Already reimplemented as client/src/pages/Messages.tsx | client/src/pages/Messages.tsx |
| 14 | `./client/src/components/NotificationSystem.tsx` | component | 67 | notifications | Already reimplemented as client/src/components/NotificationBell.tsx | client/src/components/NotificationBell.tsx |
| 15 | `./client/src/components/MeetingScheduler.tsx` | component | 373 | scheduling | 1 broken local imports, 0 missing packages | — |
| 16 | `./client/src/components/PremiumHeroSection.tsx` | component | 134 | ui/design | Already reimplemented as client/src/components/HeroGoldStandard.tsx | client/src/components/HeroGoldStandard.tsx |
| 17 | `./client/src/components/PremiumSection.tsx` | component | 149 | ui/design | Already reimplemented as client/src/components/CrossEcosystemSection.tsx | client/src/components/CrossEcosystemSection.tsx |
| 18 | `./client/src/components/PremiumTestimonialCard.tsx` | component | 110 | ui/design | Already reimplemented as client/src/components/ui/TestimonialCard.tsx | client/src/components/ui/TestimonialCard.tsx |
| 19 | `./client/src/components/ApplicationComments.tsx` | component | 326 | unknown | 1 broken local imports, 0 missing packages | — |
| 20 | `./client/src/components/ApplicationResubmissionPrompt.tsx` | component | 149 | unknown | 1 broken local imports, 0 missing packages | — |
| 21 | `./client/src/components/HomePageDiagnostic.tsx` | component | 275 | unknown | 1 broken local imports, 0 missing packages | — |
| 22 | `./client/src/components/StevenAIWidget.tsx` | component | 189 | unknown | Already reimplemented as client/src/components/SLEAICompanionWidget.tsx | client/src/components/SLEAICompanionWidget.tsx |

---

## Part 2: Media Assets (189 files)

### By Category

| Category | Count | Size (MB) | Referenced in Manus | Bucket | Notes |
|---|---|---|---|---|---|
| logos | 22 | 9.8 | 5/22 | ARCHIVE | Logos already on CDN; keep originals in brand archive |
| general | 39 | 8.3 | 17/39 | ARCHIVE | Mixed images — some referenced, most superseded by CDN |
| hero-images | 19 | 3.5 | 3/19 | ARCHIVE | Hero images already replaced with CDN versions |
| course-thumbnails | 16 | 3.4 | 7/16 | ADAPT | Course thumbnails — upload to CDN when course catalog expands |
| audio-files | 32 | 2.9 | 0/32 | ADAPT | SLE pronunciation exercises — upload to CDN when exercises are wired |
| coach-photos | 23 | 2.8 | 9/23 | ARCHIVE | Coach photos already served from CDN in Manus |
| hub-images | 14 | 2.3 | 0/14 | ARCHIVE | Hub section images — some referenced via CDN, others superseded |
| team-photos | 4 | 1.0 | 1/4 | ARCHIVE | Team photos — already on CDN |
| testimonials | 6 | 0.6 | 6/6 | ADAPT | Testimonial photos — already on CDN |
| partner-logos | 8 | 0.6 | 8/8 | ADAPT | Government partner logos — referenced in TheyTrustedUs section |
| coach-thumbnails | 6 | 0.5 | 6/6 | ADAPT | Coach thumbnails — already on CDN |

### Full Media File List

| # | Path | Type | Category | Size (KB) | Referenced | Bucket | Action |
|---|---|---|---|---|---|---|---|
| 1 | `./client/public/audio/pronunciation/agree_modifications.mp3` | audio | audio-files | 89 | No | ADAPT | ADAPT |
| 2 | `./client/public/audio/pronunciation/alternative_solutions.mp3` | audio | audio-files | 88 | No | ADAPT | ADAPT |
| 3 | `./client/public/audio/pronunciation/asking_details.mp3` | audio | audio-files | 80 | No | ADAPT | ADAPT |
| 4 | `./client/public/audio/pronunciation/budget_constraints.mp3` | audio | audio-files | 110 | No | ADAPT | ADAPT |
| 5 | `./client/public/audio/pronunciation/clarify_expectations.mp3` | audio | audio-files | 82 | No | ADAPT | ADAPT |
| 6 | `./client/public/audio/pronunciation/collaboration_thanks.mp3` | audio | audio-files | 119 | No | ADAPT | ADAPT |
| 7 | `./client/public/audio/pronunciation/continuous_improvement.mp3` | audio | audio-files | 106 | No | ADAPT | ADAPT |
| 8 | `./client/public/audio/pronunciation/digital_transformation.mp3` | audio | audio-files | 113 | No | ADAPT | ADAPT |
| 9 | `./client/public/audio/pronunciation/examine_options.mp3` | audio | audio-files | 80 | No | ADAPT | ADAPT |
| 10 | `./client/public/audio/pronunciation/greeting_formal.mp3` | audio | audio-files | 56 | No | ADAPT | ADAPT |
| 11 | `./client/public/audio/pronunciation/hr_intro.mp3` | audio | audio-files | 55 | No | ADAPT | ADAPT |
| 12 | `./client/public/audio/pronunciation/intro_federal_employee.mp3` | audio | audio-files | 141 | No | ADAPT | ADAPT |
| 13 | `./client/public/audio/pronunciation/meeting_proposal.mp3` | audio | audio-files | 103 | No | ADAPT | ADAPT |
| 14 | `./client/public/audio/pronunciation/meeting_schedule.mp3` | audio | audio-files | 49 | No | ADAPT | ADAPT |
| 15 | `./client/public/audio/pronunciation/opinion_advantages.mp3` | audio | audio-files | 76 | No | ADAPT | ADAPT |
| 16 | `./client/public/audio/pronunciation/performance_indicators.mp3` | audio | audio-files | 91 | No | ADAPT | ADAPT |
| 17 | `./client/public/audio/pronunciation/phased_approach.mp3` | audio | audio-files | 93 | No | ADAPT | ADAPT |
| 18 | `./client/public/audio/pronunciation/phone_request.mp3` | audio | audio-files | 45 | No | ADAPT | ADAPT |
| 19 | `./client/public/audio/pronunciation/policy_coordination.mp3` | audio | audio-files | 76 | No | ADAPT | ADAPT |
| 20 | `./client/public/audio/pronunciation/postpone_decision.mp3` | audio | audio-files | 97 | No | ADAPT | ADAPT |
| 21 | `./client/public/audio/pronunciation/project_presentation.mp3` | audio | audio-files | 94 | No | ADAPT | ADAPT |
| 22 | `./client/public/audio/pronunciation/recommendation_approach.mp3` | audio | audio-files | 124 | No | ADAPT | ADAPT |
| 23 | `./client/public/audio/pronunciation/regulatory_framework.mp3` | audio | audio-files | 112 | No | ADAPT | ADAPT |
| 24 | `./client/public/audio/pronunciation/report_deadline.mp3` | audio | audio-files | 81 | No | ADAPT | ADAPT |
| 25 | `./client/public/audio/pronunciation/request_help.mp3` | audio | audio-files | 42 | No | ADAPT | ADAPT |
| 26 | `./client/public/audio/pronunciation/risk_analysis.mp3` | audio | audio-files | 79 | No | ADAPT | ADAPT |
| 27 | `./client/public/audio/pronunciation/stakeholder_consensus.mp3` | audio | audio-files | 96 | No | ADAPT | ADAPT |
| 28 | `./client/public/audio/pronunciation/strategic_implications.mp3` | audio | audio-files | 92 | No | ADAPT | ADAPT |
| 29 | `./client/public/audio/pronunciation/strategy_recommendation.mp3` | audio | audio-files | 137 | No | ADAPT | ADAPT |
| 30 | `./client/public/audio/pronunciation/study_results.mp3` | audio | audio-files | 97 | No | ADAPT | ADAPT |
| 31 | `./client/public/audio/pronunciation/transmit_info.mp3` | audio | audio-files | 112 | No | ADAPT | ADAPT |
| 32 | `./client/public/audio/test/french_welcome.mp3` | audio | audio-files | 139 | No | ADAPT | ADAPT |
| 33 | `./client/public/images/coaches/coach1.jpg` | image | coach-photos | 30 | Yes | ADAPT | ADAPT |
| 34 | `./client/public/images/coaches/coach2.png` | image | coach-photos | 60 | No | ARCHIVE | ARCHIVE |
| 35 | `./client/public/images/coaches/coach3.jpg` | image | coach-photos | 19 | No | ARCHIVE | ARCHIVE |
| 36 | `./client/public/images/coaches/coach4.jpg` | image | coach-photos | 34 | No | ARCHIVE | ARCHIVE |
| 37 | `./client/public/images/coaches/coach5.jpg` | image | coach-photos | 37 | No | ARCHIVE | ARCHIVE |
| 38 | `./client/public/images/coaches/coach6.jpg` | image | coach-photos | 424 | No | ARCHIVE | ARCHIVE |
| 39 | `./client/public/images/coaches/coach7.jpg` | image | coach-photos | 30 | No | ARCHIVE | ARCHIVE |
| 40 | `./client/public/images/coaches/coach8.jpg` | image | coach-photos | 372 | No | ARCHIVE | ARCHIVE |
| 41 | `./client/public/images/coaches/coach9.jpg` | image | coach-photos | 376 | No | ARCHIVE | ARCHIVE |
| 42 | `./client/public/images/coaches/erika-seguin-new.jpg` | image | coach-photos | 120 | No | ARCHIVE | ARCHIVE |
| 43 | `./client/public/images/coaches/erika-seguin.jpg` | image | coach-photos | 21 | Yes | ADAPT | ADAPT |
| 44 | `./client/public/images/coaches/ErikaFrank.webp` | image | coach-photos | 115 | Yes | ADAPT | ADAPT |
| 45 | `./client/public/images/coaches/francine.jpg` | image | coach-photos | 70 | No | ARCHIVE | ARCHIVE |
| 46 | `./client/public/images/coaches/preciosa-baganha.jpg` | image | coach-photos | 120 | No | ARCHIVE | ARCHIVE |
| 47 | `./client/public/images/coaches/Preciosa2.webp` | image | coach-photos | 23 | Yes | ADAPT | ADAPT |
| 48 | `./client/public/images/coaches/soukaina-haidar-new.jpg` | image | coach-photos | 201 | No | ARCHIVE | ARCHIVE |
| 49 | `./client/public/images/coaches/soukaina-haidar.jpg` | image | coach-photos | 74 | Yes | ADAPT | ADAPT |
| 50 | `./client/public/images/coaches/steven-barholere.jpg` | image | coach-photos | 12 | Yes | ADAPT | ADAPT |
| 51 | `./client/public/images/coaches/Steven(2).webp` | image | coach-photos | 191 | Yes | ADAPT | ADAPT |
| 52 | `./client/public/images/coaches/sue-anne-richer-new.jpg` | image | coach-photos | 79 | No | ARCHIVE | ARCHIVE |
| 53 | `./client/public/images/coaches/sue-anne-richer.jpg` | image | coach-photos | 22 | Yes | ADAPT | ADAPT |
| 54 | `./client/public/images/coaches/Sue-Anne.webp` | image | coach-photos | 77 | Yes | ADAPT | ADAPT |
| 55 | `./client/public/images/coaches/victor-amisi.jpg` | image | coach-photos | 322 | No | ARCHIVE | ARCHIVE |
| 56 | `./client/public/images/thumbnails/erika-seguin-thumb.jpg` | image | coach-thumbnails | 156 | Yes | ADAPT | ADAPT |
| 57 | `./client/public/images/thumbnails/preciosa-baganha-thumb.jpg` | image | coach-thumbnails | 112 | Yes | ADAPT | ADAPT |
| 58 | `./client/public/images/thumbnails/soukaina-haidar-thumb.jpg` | image | coach-thumbnails | 44 | Yes | ADAPT | ADAPT |
| 59 | `./client/public/images/thumbnails/steven-barholere-thumb.jpg` | image | coach-thumbnails | 146 | Yes | ADAPT | ADAPT |
| 60 | `./client/public/images/thumbnails/sue-anne-richer-thumb.jpg` | image | coach-thumbnails | 55 | Yes | ADAPT | ADAPT |
| 61 | `./client/public/images/thumbnails/victor-amisi-thumb.jpg` | image | coach-thumbnails | 46 | Yes | ADAPT | ADAPT |
| 62 | `./client/public/images/capsules/capsule_01.jpg` | image | course-thumbnails | 191 | Yes | ADAPT | ADAPT |
| 63 | `./client/public/images/capsules/capsule_02.jpg` | image | course-thumbnails | 183 | Yes | ADAPT | ADAPT |
| 64 | `./client/public/images/capsules/capsule_03.jpg` | image | course-thumbnails | 171 | Yes | ADAPT | ADAPT |
| 65 | `./client/public/images/capsules/capsule_04.jpg` | image | course-thumbnails | 173 | Yes | ADAPT | ADAPT |
| 66 | `./client/public/images/capsules/capsule_05.jpg` | image | course-thumbnails | 165 | Yes | ADAPT | ADAPT |
| 67 | `./client/public/images/capsules/capsule_06.jpg` | image | course-thumbnails | 152 | Yes | ADAPT | ADAPT |
| 68 | `./client/public/images/capsules/capsule_07.jpg` | image | course-thumbnails | 191 | Yes | ADAPT | ADAPT |
| 69 | `./client/public/images/courses/coaching-mastery.jpg` | image | course-thumbnails | 388 | No | ADAPT | ADAPT |
| 70 | `./client/public/images/courses/hero-bilingual-excellence.jpg` | image | course-thumbnails | 243 | No | ADAPT | ADAPT |
| 71 | `./client/public/images/courses/path-a1-foundations.jpg` | image | course-thumbnails | 234 | No | ADAPT | ADAPT |
| 72 | `./client/public/images/courses/path-a2-everyday.jpg` | image | course-thumbnails | 191 | No | ADAPT | ADAPT |
| 73 | `./client/public/images/courses/path-b1-operational.jpg` | image | course-thumbnails | 217 | No | ADAPT | ADAPT |
| 74 | `./client/public/images/courses/path-b2-strategic.jpg` | image | course-thumbnails | 202 | No | ADAPT | ADAPT |
| 75 | `./client/public/images/courses/path-c1-mastery.jpg` | image | course-thumbnails | 208 | No | ADAPT | ADAPT |
| 76 | `./client/public/images/courses/path-c2-exam.jpg` | image | course-thumbnails | 209 | No | ADAPT | ADAPT |
| 77 | `./client/public/images/courses/success-transformation.jpg` | image | course-thumbnails | 348 | No | ADAPT | ADAPT |
| 78 | `./client/public/hero-all-coaches.webp` | image | general | 111 | No | ARCHIVE | ARCHIVE |
| 79 | `./client/public/images/coach-hero.jpg` | image | general | 348 | No | ARCHIVE | ARCHIVE |
| 80 | `./client/public/images/coaches-team-background.jpg` | image | general | 63 | No | ARCHIVE | ARCHIVE |
| 81 | `./client/public/images/ecosystem-barholex.jpg` | image | general | 179 | Yes | ADAPT | ADAPT |
| 82 | `./client/public/images/ecosystem-lingueefy.jpg` | image | general | 639 | Yes | ADAPT | ADAPT |
| 83 | `./client/public/images/ecosystem-rusingacademy.jpg` | image | general | 419 | Yes | ADAPT | ADAPT |
| 84 | `./client/public/images/ecosystem/hero-team.jpg` | image | general | 996 | No | ARCHIVE | ARCHIVE |
| 85 | `./client/public/images/ecosystem/hero-training-1.jpg` | image | general | 278 | No | ARCHIVE | ARCHIVE |
| 86 | `./client/public/images/ecosystem/hero-training-2.jpg` | image | general | 216 | No | ARCHIVE | ARCHIVE |
| 87 | `./client/public/images/ecosystem/hero-training-3.jpg` | image | general | 239 | No | ARCHIVE | ARCHIVE |
| 88 | `./client/public/images/ecosystem/hero-training-4.jpg` | image | general | 235 | No | ARCHIVE | ARCHIVE |
| 89 | `./client/public/images/ecosystem/hero-training-5.jpg` | image | general | 229 | No | ARCHIVE | ARCHIVE |
| 90 | `./client/public/images/ecosystem/hero-training-6.jpg` | image | general | 296 | No | ARCHIVE | ARCHIVE |
| 91 | `./client/public/images/ecosystem/rusingacademy-training.jpg` | image | general | 197 | No | ARCHIVE | ARCHIVE |
| 92 | `./client/public/images/headerecosystem.png` | image | general | 23 | No | ARCHIVE | ARCHIVE |
| 93 | `./client/public/images/hero-final-v19.png` | image | general | 136 | No | ARCHIVE | ARCHIVE |
| 94 | `./client/public/images/kudoboard_Steven.webp` | image | general | 239 | No | ARCHIVE | ARCHIVE |
| 95 | `./client/public/images/kudoboard_Steven2.webp` | image | general | 328 | No | ARCHIVE | ARCHIVE |
| 96 | `./client/public/images/leadership-steven.jpg` | image | general | 59 | Yes | ADAPT | ADAPT |
| 97 | `./client/public/images/offers-class.jpg` | image | general | 144 | Yes | ADAPT | ADAPT |
| 98 | `./client/public/images/offers-coaching.jpg` | image | general | 66 | Yes | ADAPT | ADAPT |
| 99 | `./client/public/images/offers-innovation.jpg` | image | general | 45 | Yes | ADAPT | ADAPT |
| 100 | `./client/public/images/podcast-leadership.jpg` | image | general | 512 | No | ARCHIVE | ARCHIVE |
| 101 | `./client/public/images/podcast-studio.jpg` | image | general | 345 | Yes | ADAPT | ADAPT |
| 102 | `./client/public/images/rusingacademy-hero-team.jpg` | image | general | 177 | No | ARCHIVE | ARCHIVE |
| 103 | `./client/public/images/steven-barholere-studio.jpg` | image | general | 193 | No | ARCHIVE | ARCHIVE |
| 104 | `./client/public/images/steven-barholere.jpg` | image | general | 59 | Yes | ADAPT | ADAPT |
| 105 | `./client/public/images/studio-steven-10.png` | image | general | 107 | Yes | ADAPT | ADAPT |
| 106 | `./client/public/images/team-erika.jpg` | image | general | 102 | Yes | ADAPT | ADAPT |
| 107 | `./client/public/images/team-preciosa.jpg` | image | general | 107 | Yes | ADAPT | ADAPT |
| 108 | `./client/public/images/team-steven.jpg` | image | general | 198 | Yes | ADAPT | ADAPT |
| 109 | `./client/public/images/team-sueanne.jpg` | image | general | 79 | Yes | ADAPT | ADAPT |
| 110 | `./client/public/images/testimonial-edith.jpg` | image | general | 67 | Yes | ADAPT | ADAPT |
| 111 | `./client/public/images/testimonial-jena.jpg` | image | general | 76 | Yes | ADAPT | ADAPT |
| 112 | `./client/public/images/testimonial-mithula.jpg` | image | general | 103 | Yes | ADAPT | ADAPT |
| 113 | `./client/public/steven-parliament.jpg` | image | general | 309 | No | ARCHIVE | ARCHIVE |
| 114 | `./client/public/studio-steven-2.jpg` | image | general | 196 | No | ARCHIVE | ARCHIVE |
| 115 | `./client/public/studio-steven-3.jpg` | image | general | 181 | No | ARCHIVE | ARCHIVE |
| 116 | `./client/public/studio-steven-4.jpg` | image | general | 236 | No | ARCHIVE | ARCHIVE |
| 117 | `./client/public/images/hero/corporate-training.jpg` | image | hero-images | 81 | No | ARCHIVE | ARCHIVE |
| 118 | `./client/public/images/hero/executive-coaching.jpg` | image | hero-images | 175 | No | ARCHIVE | ARCHIVE |
| 119 | `./client/public/images/hero/hero-1.jpg` | image | hero-images | 420 | No | ARCHIVE | ARCHIVE |
| 120 | `./client/public/images/hero/hero-2.jpg` | image | hero-images | 212 | No | ARCHIVE | ARCHIVE |
| 121 | `./client/public/images/hero/hero-3.jpg` | image | hero-images | 131 | No | ARCHIVE | ARCHIVE |
| 122 | `./client/public/images/hero/hero-4.jpg` | image | hero-images | 91 | No | ARCHIVE | ARCHIVE |
| 123 | `./client/public/images/hero/hero-5.jpg` | image | hero-images | 300 | No | ARCHIVE | ARCHIVE |
| 124 | `./client/public/images/hero/hero-6.jpg` | image | hero-images | 106 | No | ARCHIVE | ARCHIVE |
| 125 | `./client/public/images/hero/hero-background-premium.png` | image | hero-images | 51 | No | ARCHIVE | ARCHIVE |
| 126 | `./client/public/images/hero/hero-background-v4.png` | image | hero-images | 67 | Yes | ADAPT | ADAPT |
| 127 | `./client/public/images/hero/hero-reference.jpg` | image | hero-images | 111 | No | ARCHIVE | ARCHIVE |
| 128 | `./client/public/images/hero/podcast-studio.jpg` | image | hero-images | 639 | Yes | ADAPT | ADAPT |
| 129 | `./client/public/images/hero/rusingacademy-group.jpg` | image | hero-images | 124 | No | ARCHIVE | ARCHIVE |
| 130 | `./client/public/images/hero/steven-class.jpeg` | image | hero-images | 144 | Yes | ADAPT | ADAPT |
| 131 | `./client/public/images/hero/steven-hero-full.webp` | image | hero-images | 51 | No | ARCHIVE | ARCHIVE |
| 132 | `./client/public/images/hero/steven-hero.png` | image | hero-images | 301 | No | ARCHIVE | ARCHIVE |
| 133 | `./client/public/images/hero/steven-portrait.png` | image | hero-images | 301 | No | ARCHIVE | ARCHIVE |
| 134 | `./client/public/images/hero/steven-sue-anne.jpg` | image | hero-images | 66 | No | ARCHIVE | ARCHIVE |
| 135 | `./client/public/images/hero/training-diversity.jpg` | image | hero-images | 192 | No | ARCHIVE | ARCHIVE |
| 136 | `./client/public/images/hub/Academy.jpg` | image | hub-images | 419 | No | ARCHIVE | ARCHIVE |
| 137 | `./client/public/images/hub/BarholexMedia.jpg` | image | hub-images | 179 | No | ARCHIVE | ARCHIVE |
| 138 | `./client/public/images/hub/EdithBramwell.webp` | image | hub-images | 67 | No | ARCHIVE | ARCHIVE |
| 139 | `./client/public/images/hub/ErikaSeguin-WebHeadshot.jpeg` | image | hub-images | 102 | No | ARCHIVE | ARCHIVE |
| 140 | `./client/public/images/hub/JenaCameron.webp` | image | hub-images | 76 | No | ARCHIVE | ARCHIVE |
| 141 | `./client/public/images/hub/Lingueefy2.jpg` | image | hub-images | 639 | No | ARCHIVE | ARCHIVE |
| 142 | `./client/public/images/hub/MithulaNaik.webp` | image | hub-images | 103 | No | ARCHIVE | ARCHIVE |
| 143 | `./client/public/images/hub/Preciosa.JPG` | image | hub-images | 120 | No | ARCHIVE | ARCHIVE |
| 144 | `./client/public/images/hub/Steven&Sue-Anne.jpg` | image | hub-images | 66 | No | ARCHIVE | ARCHIVE |
| 145 | `./client/public/images/hub/Steven2.jpg` | image | hub-images | 159 | No | ARCHIVE | ARCHIVE |
| 146 | `./client/public/images/hub/Steven3.jpg` | image | hub-images | 198 | No | ARCHIVE | ARCHIVE |
| 147 | `./client/public/images/hub/StevenClass.jpeg` | image | hub-images | 144 | No | ARCHIVE | ARCHIVE |
| 148 | `./client/public/images/hub/Sue-Anne.jpg` | image | hub-images | 79 | No | ARCHIVE | ARCHIVE |
| 149 | `./client/public/images/hub/video-equipment.jpg` | image | hub-images | 45 | No | ARCHIVE | ARCHIVE |
| 150 | `./client/public/images/logos/02_PNG/GC_CSC_SCC_EN_logo_20260112.png` | image | logos | 216 | No | ARCHIVE | ARCHIVE |
| 151 | `./client/public/images/logos/02_PNG/GC_CSPS_EFPC_EN_logo_20260112.jpg` | image | logos | 7 | No | ARCHIVE | ARCHIVE |
| 152 | `./client/public/images/logos/02_PNG/GC_DND_MDN_FR-EN_logo_20260112.png` | image | logos | 9 | No | ARCHIVE | ARCHIVE |
| 153 | `./client/public/images/logos/02_PNG/GC_ESDC_EDSC_EN_logo_20260112.png` | image | logos | 6 | No | ARCHIVE | ARCHIVE |
| 154 | `./client/public/images/logos/02_PNG/GC_ISED_ISDE_EN_logo_20260112.jpg` | image | logos | 38 | No | ARCHIVE | ARCHIVE |
| 155 | `./client/public/images/logos/02_PNG/GC_TBS_SCT_EN_logo_20260112.png` | image | logos | 11 | No | ARCHIVE | ARCHIVE |
| 156 | `./client/public/images/logos/barholex_logo_variant_white_background.webp` | image | logos | 832 | Yes | ADAPT | ADAPT |
| 157 | `./client/public/images/logos/barholex-icon.png` | image | logos | 632 | No | ARCHIVE | ARCHIVE |
| 158 | `./client/public/images/logos/barholex-landscape.png` | image | logos | 362 | No | ARCHIVE | ARCHIVE |
| 159 | `./client/public/images/logos/barholex-square.png` | image | logos | 519 | No | ARCHIVE | ARCHIVE |
| 160 | `./client/public/images/logos/barholex-transparent.png` | image | logos | 505 | No | ARCHIVE | ARCHIVE |
| 161 | `./client/public/images/logos/lingueefy-glass-v2.png` | image | logos | 32 | Yes | ADAPT | ADAPT |
| 162 | `./client/public/images/logos/rusing_academy_logo_variant_1_refined.png` | image | logos | 998 | No | ARCHIVE | ARCHIVE |
| 163 | `./client/public/images/logos/rusing_academy_logo_variant_3_refined.png` | image | logos | 851 | No | ARCHIVE | ARCHIVE |
| 164 | `./client/public/images/logos/rusing_academy_variant_favicon.png` | image | logos | 985 | No | ARCHIVE | ARCHIVE |
| 165 | `./client/public/images/logos/rusingacademy-banner.png` | image | logos | 327 | No | ARCHIVE | ARCHIVE |
| 166 | `./client/public/images/logos/rusingacademy-favicon.png` | image | logos | 473 | No | ARCHIVE | ARCHIVE |
| 167 | `./client/public/images/logos/rusingacademy-icon.png` | image | logos | 459 | No | ARCHIVE | ARCHIVE |
| 168 | `./client/public/images/logos/rusingacademy-logo-r-only.png` | image | logos | 851 | Yes | ADAPT | ADAPT |
| 169 | `./client/public/images/logos/rusingacademy-logo.png` | image | logos | 984 | Yes | ADAPT | ADAPT |
| 170 | `./client/public/images/logos/rusingacademy-official.png` | image | logos | 459 | Yes | ADAPT | ADAPT |
| 171 | `./client/public/images/logos/rusingacademy-square.png` | image | logos | 530 | No | ARCHIVE | ARCHIVE |
| 172 | `./client/public/images/partners/cds-snc.png` | image | partner-logos | 7 | Yes | ADAPT | ADAPT |
| 173 | `./client/public/images/partners/defense-nationale.jpg` | image | partner-logos | 55 | Yes | ADAPT | ADAPT |
| 174 | `./client/public/images/partners/forces-armees-canada.jpg` | image | partner-logos | 23 | Yes | ADAPT | ADAPT |
| 175 | `./client/public/images/partners/forces-canadiennes.png` | image | partner-logos | 233 | Yes | ADAPT | ADAPT |
| 176 | `./client/public/images/partners/gouvernement-canada.jpg` | image | partner-logos | 27 | Yes | ADAPT | ADAPT |
| 177 | `./client/public/images/partners/ircc.jpg` | image | partner-logos | 102 | Yes | ADAPT | ADAPT |
| 178 | `./client/public/images/partners/ontario.jpg` | image | partner-logos | 49 | Yes | ADAPT | ADAPT |
| 179 | `./client/public/images/partners/service-correctionnel.jpg` | image | partner-logos | 87 | Yes | ADAPT | ADAPT |
| 180 | `./client/public/images/team/preciosa-baganha.jpg` | image | team-photos | 107 | No | ARCHIVE | ARCHIVE |
| 181 | `./client/public/images/team/steven-ai-avatar.png` | image | team-photos | 675 | No | ARCHIVE | ARCHIVE |
| 182 | `./client/public/images/team/steven-ai-header.png` | image | team-photos | 150 | No | ARCHIVE | ARCHIVE |
| 183 | `./client/public/images/team/steven-barholere.jpg` | image | team-photos | 59 | Yes | ADAPT | ADAPT |
| 184 | `./client/public/images/testimonials/testimonial-1.jpg` | image | testimonials | 91 | Yes | ADAPT | ADAPT |
| 185 | `./client/public/images/testimonials/testimonial-2.jpg` | image | testimonials | 132 | Yes | ADAPT | ADAPT |
| 186 | `./client/public/images/testimonials/testimonial-3.jpg` | image | testimonials | 96 | Yes | ADAPT | ADAPT |
| 187 | `./client/public/images/testimonials/testimonial-4.jpg` | image | testimonials | 126 | Yes | ADAPT | ADAPT |
| 188 | `./client/public/images/testimonials/testimonial-5.jpg` | image | testimonials | 87 | Yes | ADAPT | ADAPT |
| 189 | `./client/public/images/testimonials/testimonial-6.jpg` | image | testimonials | 101 | Yes | ADAPT | ADAPT |

---

## Part 3: Files Only in Manus (58 files)

These are files created in the Manus workspace that do not exist in GitHub main. They represent new features built during the Manus development phase.

| # | Path | Notes |
|---|---|---|
| 1 | `./.minimax-configured
./.voice-configured
./add-indexes-2.mjs
./add-indexes.mjs
./audit-report.md
./check-coach-data.mjs
./client/src/contexts/SLECompanionContext.tsx
./docs/cron-setup.md
./drizzle/0057_deep_ronan.sql
./drizzle/0057_tearful_moira_mactaggert.sql
./drizzle/0058_fuzzy_greymalkin.sql
./drizzle/0059_quick_grandmaster.sql
./drizzle/meta/0057_snapshot.json
./drizzle/meta/0058_snapshot.json
./drizzle/meta/0059_snapshot.json
./e2e_screenshots.mjs
./llm-audit-report.md
./llm-audit-results.json
./llm-audit-retry-results.json
./llm-audit-retry.mjs
./llm-audit.mjs
./scripts/audit-coach-db.ts
./server/coach-finale-features.test.ts
./server/coach-mission-fixes.test.ts
./server/coach-onboarding-audit.test.ts
./server/cross-ecosystem-playback.test.ts
./server/logger.ts
./server/messaging-wiring.test.ts
./server/middleware/requestId.ts
./server/resilience.test.ts
./server/resilience.ts
./server/routers/admin.ts
./server/routers/adminApplicationDashboard.ts
./server/routers/adminCoachApps.ts
./server/routers/adminCourses.ts
./server/routers/adminQuiz.ts
./server/routers/adminUsers.ts
./server/routers/ai.ts
./server/routers/booking.ts
./server/routers/coach.ts
./server/routers/coachInvitation.ts
./server/routers/commission.ts
./server/routers/crm.ts
./server/routers/documents.ts
./server/routers/events.ts
./server/routers/forum.ts
./server/routers/learner.ts
./server/routers/learnerCourses.ts
./server/routers/learnerGamification.ts
./server/routers/learnerProfile.ts
./server/routers/learnerSessions.ts
./server/routers/message.ts
./server/routers/newsletter.ts
./server/routers/notification.ts
./server/routers/notifications.ts
./server/routers/reminders.ts
./server/routers/search.ts
./server/routers/stripe.ts` | Test file |
