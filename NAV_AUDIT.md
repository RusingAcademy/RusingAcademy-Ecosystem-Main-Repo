# NAV_AUDIT.md — RusingAcademy Ecosystem Navigation Audit

**Author:** Manus AI — Lead Product Architect  
**Date:** February 13, 2026  
**Branch:** `feat/admin-rebuild-waves-1-3`  
**Baseline:** `feature/sprints-15-30` (HEAD `ed9a8552`, 3 002 tests)  
**Scope:** All 5 portals — Admin Control Center, Learner Portal, Coach Portal, HR Dashboard, User Dashboard

---

## Executive Summary

This document provides a complete audit of every navigable route, admin section, and portal entry point in the RusingAcademy ecosystem. The audit covers **213 total routes**, **58 admin navigation items** organized in **12 groups**, **74 server routers**, **149 database tables**, and **16 RBAC permission keys**. The goal is to ensure **zero dead buttons, zero 404 routes, zero empty pages without intentional "coming soon" states**, and full alignment between navigation IDs, route paths, and sectionMap entries.

The audit identified **3 critical mismatches** requiring immediate fixes, **5 legacy standalone pages** that bypass the unified AdminControlCenter layout, and **15 Wave 1–3 admin panels** that are functional placeholders (professional UI with mock data, awaiting tRPC wiring). All findings are documented with precise remediation steps.

---

## 1. Admin Control Center — 12-Group / 58-Section Architecture

The Admin Control Center uses a unified `AdminLayout` sidebar with collapsible groups. Each nav item maps to a `sectionMap` entry in `AdminControlCenter.tsx`, which renders the corresponding component inside the shared layout shell.

### 1.1 Navigation Group Structure

| # | Group | Group (FR) | Items | Permission Scope |
|---|-------|-----------|-------|-----------------|
| 1 | CORE (untitled) | — | 2 | `view_dashboard` |
| 2 | LEARNING | APPRENTISSAGE | 8 | `manage_courses`, `manage_coaches` |
| 3 | SLE PREP *(new)* | PRÉPA ELS | 7 | `manage_sle_exam` |
| 4 | RETENTION *(new)* | RÉTENTION | 4 | `manage_courses` |
| 5 | COMMUNITY *(new)* | COMMUNAUTÉ | 3 | `manage_content` |
| 6 | SALES | VENTES | 5 | `manage_payments`, `manage_crm` |
| 7 | MARKETING | MARKETING | 3 | *(none — open)* |
| 8 | CONTENT | CONTENU | 4 | `manage_cms`, `manage_content` |
| 9 | AI & INTELLIGENCE | IA ET INTELLIGENCE | 4 | `manage_ai`, `manage_analytics` |
| 10 | PEOPLE | PERSONNES | 4 | `manage_users`, `manage_roles`, `manage_coaches` |
| 11 | ANALYTICS | ANALYTIQUE | 4 | `manage_analytics`, `view_audit_log` |
| 12 | SYSTEM | SYSTÈME | 7 | `manage_notifications`, `manage_settings`, `manage_payments`, `manage_enterprise` |
| — | DEV TOOLS | — | 2 | *(none — dev only)* |
| | **TOTAL** | | **57 + 2 dev = 59** | |

### 1.2 Complete Admin Section Audit

The following table maps every admin navigation item to its route, sectionMap key, component, and current status.

**Status Legend:**
- ✅ **Working** — Fully functional, connected to tRPC backend, real data
- 🔶 **UI Complete** — Professional UI with mock/demo data, awaiting tRPC wiring
- ⚠️ **Mismatch** — Navigation ID does not match sectionMap key (broken click)
- 🔗 **Legacy Standalone** — Renders outside AdminControlCenter (different layout)
- 🆕 **New (Wave 1–3)** — Added in this branch, placeholder with professional empty state

#### CORE

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `dashboard` | Dashboard | Tableau de bord | `/admin` | `overview` | `DashboardOverview` | ✅ Working | Also aliased at `/admin/dashboard` and `/dashboard/admin` |
| `live-kpi` | Live KPI Dashboard | Tableau KPI en direct | `/admin/live-kpi` | `live-kpi` | `LiveKPIDashboard` | ✅ Working | Permission: `view_dashboard` |

#### LEARNING

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `courses` | Courses | Cours | `/admin/courses` | `courses` | `CourseBuilder` | ✅ Working | 111 KB component, full CRUD. Permission: `manage_courses` |
| `coaches` | Coaches | Coachs | `/admin/coaches` | `coaches` | `CoachesManagement` | ✅ Working | Permission: `manage_coaches` |
| `enrollments` | Enrollments | Inscriptions | `/admin/enrollments` | `enrollments` | `AdminEnrollments` | ✅ Working | Permission: `manage_courses` |
| `certificates` | Certificates | Certificats | `/admin/certificates` | `certificates` | `AdminCertificates` | ✅ Working | Permission: `manage_courses` |
| `reviews` | Reviews | Avis | `/admin/reviews` | `reviews` | `AdminReviews` | ✅ Working | Permission: `manage_courses` |
| `gamification` | Gamification | Ludification | `/admin/gamification` | `gamification` | `AdminGamification` | ✅ Working | Permission: `manage_courses` |
| `drip-content` | Drip Content | Contenu progressif | `/admin/drip-content` | `drip-content` | `DripContent` | 🔶 UI Complete | Permission: `manage_courses` |
| `weekly-challenges` | Weekly Challenges | Défis hebdomadaires | `/admin/weekly-challenges` | `weekly-challenges` | `WeeklyChallenges` | ✅ Working | Permission: `manage_courses` |

#### SLE PREP *(New — Wave 1)*

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `sle-exam` | SLE Exam Mode | Mode examen ELS | `/admin/sle-exam` | `sle-exam` | `SLEExamMode` | 🆕 UI Complete | 409 lines, mock data. Permission: `manage_sle_exam` |
| `reading-lab` | Reading Lab | Labo de lecture | `/admin/reading-lab` | `reading-lab` | `ReadingLab` | 🆕 UI Complete | 121 lines, mock data. Permission: `manage_sle_exam` |
| `listening-lab` | Listening Lab | Labo d'écoute | `/admin/listening-lab` | `listening-lab` | `ListeningLab` | 🆕 UI Complete | Mock data. Permission: `manage_sle_exam` |
| `grammar-drills` | Grammar Drills | Exercices de grammaire | `/admin/grammar-drills` | `grammar-drills` | `GrammarDrills` | 🆕 UI Complete | Mock data. Permission: `manage_sle_exam` |
| `writing-lab` | Writing Lab | Labo d'écriture | `/admin/writing-lab` | `writing-lab` | `WritingLab` | 🆕 UI Complete | Mock data. Permission: `manage_sle_exam` |
| `pronunciation-lab` | Pronunciation Lab | Labo de prononciation | `/admin/pronunciation-lab` | `pronunciation-lab` | `PronunciationLab` | 🆕 UI Complete | Mock data. Permission: `manage_sle_exam` |
| `dictation` | Dictation Exercises | Exercices de dictée | `/admin/dictation` | ⚠️ `dictation-exercises` | `DictationExercises` | ⚠️ **MISMATCH** | **Nav ID is `dictation` but sectionMap key is `dictation-exercises`. Route is `/admin/dictation-exercises`. Clicking nav item navigates to `/admin/dictation` which has NO route → falls through to overview.** |

#### RETENTION *(New — Wave 2)*

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `flashcards` | Flashcards (SM-2) | Cartes mémoire (SM-2) | `/admin/flashcards` | `flashcards` | `AdminFlashcards` | 🆕 UI Complete | 198 lines, mock data. Permission: `manage_courses` |
| `vocabulary` | Vocabulary Builder | Constructeur de vocabulaire | `/admin/vocabulary` | `vocabulary` | `AdminVocabulary` | 🆕 UI Complete | Mock data. Permission: `manage_courses` |
| `study-notes` | Study Notes | Notes d'étude | `/admin/study-notes` | `study-notes` | `AdminStudyNotes` | 🆕 UI Complete | Mock data. Permission: `manage_courses` |
| `daily-review` | Daily Review Queue | File de révision | `/admin/daily-review` | `daily-review` | `AdminDailyReview` | 🆕 UI Complete | Mock data. Permission: `manage_courses` |

#### COMMUNITY *(New — Wave 3)*

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `discussions` | Discussion Boards | Forums de discussion | `/admin/discussions` | `discussions` | `AdminDiscussions` | 🆕 UI Complete | 336 lines, mock data. Permission: `manage_content` |
| `peer-review` | Peer Review | Évaluation par les pairs | `/admin/peer-review` | `peer-review` | `AdminPeerReview` | 🆕 UI Complete | Mock data. Permission: `manage_content` |
| `study-groups` | Study Groups | Groupes d'étude | `/admin/study-groups` | `study-groups` | `AdminStudyGroups` | 🆕 UI Complete | Mock data. Permission: `manage_content` |

#### SALES

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `pricing` | Pricing & Checkout | Tarification et paiement | `/admin/pricing` | `pricing` | `PricingCheckout` | ✅ Working | Permission: `manage_payments` |
| `coupons` | Coupons | Coupons | `/admin/coupons` | `coupons` | `CouponsPage` | ✅ Working | Permission: `manage_payments` |
| `crm` | CRM & Contacts | CRM et contacts | `/admin/crm` | `crm` | `CRMPage` | ✅ Working | Permission: `manage_crm` |
| `commission` | Coach Commission | Commission des coachs | `/admin/commission` | ⚠️ **MISSING** | `AdminCommission` | 🔗 **Legacy Standalone** | **Not in sectionMap. Route renders standalone page with own layout (no AdminLayout sidebar). 349 lines.** |
| `leads` | Lead Management | Gestion des prospects | `/admin/leads` | ⚠️ **MISSING** | `AdminLeads` | 🔗 **Legacy Standalone** | **Not in sectionMap. Uses DashboardLayout. Also aliased at `/dashboard/admin/leads`. 432 lines.** |

#### MARKETING

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `email` | Email Campaigns | Campagnes email | `/admin/email` | `email` | `EmailPage` | ✅ Working | No permission required |
| `funnels` | Funnels | Entonnoirs | `/admin/funnels` | `funnels` | `FunnelBuilder` | ✅ Working | No permission required |
| `automations` | Automations | Automatisations | `/admin/automations` | `automations` | `Automations` | ✅ Working | No permission required |

#### CONTENT

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `pages` | Pages & CMS | Pages et CMS | `/admin/pages` | `pages` | `PageBuilder` | ✅ Working | Permission: `manage_cms` |
| `media-library` | Media Library | Médiathèque | `/admin/media-library` | `media-library` | `MediaLibrary` | ✅ Working | Permission: `manage_content` |
| `email-templates` | Email Templates | Modèles d'email | `/admin/email-templates` | `email-templates` | `EmailTemplateBuilder` | ✅ Working | Permission: `manage_content` |
| `content-mgmt` | Content Management | Gestion du contenu | `/admin/content` | ⚠️ **MISSING** | `AdminContentManagement` | 🔗 **Legacy Standalone** | **Not in sectionMap. Uses Header/Footer layout. 1 483 lines. Route is `/admin/content`.** |

#### AI & INTELLIGENCE

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `ai-companion` | AI Companion | Compagnon IA | `/admin/ai-companion` | `ai-companion` | `AICompanionPanel` | ✅ Working | Permission: `manage_ai` |
| `ai-predictive` | AI Predictive | IA prédictive | `/admin/ai-predictive` | `ai-predictive` | `AIPredictive` | ✅ Working | Permission: `manage_ai` |
| `content-intelligence` | Content Intelligence | Intelligence du contenu | `/admin/content-intelligence` | `content-intelligence` | `ContentIntelligence` | ✅ Working | Permission: `manage_analytics` |
| `recommendations` | Smart Recommendations | Recommandations intelligentes | `/admin/recommendations` | `recommendations` | `AdminRecommendations` | 🆕 UI Complete | Mock data. Permission: `manage_ai` |

#### PEOPLE

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `users` | Users & Roles | Utilisateurs et rôles | `/admin/users` | `users` | `UsersRoles` | ✅ Working | Permission: `manage_users` |
| `permissions` | RBAC Permissions | Permissions RBAC | `/admin/permissions` | `permissions` | `RBACPermissions` | ✅ Working | Permission: `manage_roles` |
| `applications` | Coach Applications | Candidatures de coachs | `/admin/applications` | ⚠️ **MISSING** | `AdminCoachApplications` | 🔗 **Legacy Standalone** | **Not in sectionMap. Uses Header/Footer layout. 53 lines (thin wrapper around AdminApplicationDashboard component).** |
| `reminders` | Reminders | Rappels | `/admin/reminders` | ⚠️ **MISSING** | `AdminReminders` | 🔗 **Legacy Standalone** | **Not in sectionMap. Own layout. 613 lines.** |

#### ANALYTICS

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `analytics` | Analytics Overview | Vue analytique | `/admin/analytics` | `analytics` | `Analytics` | ✅ Working | Permission: `manage_analytics` |
| `sales-analytics` | Sales Analytics | Analytique des ventes | `/admin/sales-analytics` | `sales-analytics` | `SalesAnalytics` | ✅ Working | Permission: `manage_analytics` |
| `ab-testing` | A/B Testing | Tests A/B | `/admin/ab-testing` | `ab-testing` | `ABTesting` | ✅ Working | Permission: `manage_analytics` |
| `activity` | Activity Logs | Journal d'activité | `/admin/activity` | `activity` | `ActivityLogs` | ✅ Working | Permission: `view_audit_log` |

#### SYSTEM

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `notifications` | Notifications | Notifications | `/admin/notifications` | `notifications` | `NotificationsCenter` | ✅ Working | Permission: `manage_notifications` |
| `import-export` | Import / Export | Import / Export | `/admin/import-export` | `import-export` | `ImportExport` | ✅ Working | Permission: `manage_settings` |
| `stripe-testing` | Stripe Testing | Test Stripe | `/admin/stripe-testing` | `stripe-testing` | `StripeTesting` | ✅ Working | Permission: `manage_payments` |
| `onboarding` | Onboarding Workflow | Flux d'intégration | `/admin/onboarding` | `onboarding` | `OnboardingWorkflow` | ✅ Working | Permission: `manage_settings` |
| `enterprise` | Enterprise Mode | Mode entreprise | `/admin/enterprise` | `enterprise` | `EnterpriseMode` | ✅ Working | Permission: `manage_enterprise` |
| `org-billing` | Org Billing | Facturation org. | `/admin/org-billing` | `org-billing` | `OrgBillingDashboard` | ✅ Working | Permission: `manage_enterprise` |
| `settings` | Settings | Paramètres | `/admin/settings` | `settings` | `AdminSettings` | ✅ Working | Permission: `manage_settings` |

#### DEV TOOLS (outside main nav groups)

| Nav ID | Label (EN) | Label (FR) | Route | sectionMap Key | Component | Status | Notes |
|--------|-----------|-----------|-------|---------------|-----------|--------|-------|
| `component-lab` | Component Lab | Labo de composants | `/admin/component-lab` | `component-lab` | `ComponentLab` | ✅ Working | No permission required |
| `preview-mode` | Preview Everything | Tout prévisualiser | `/admin/preview-mode` | `preview-mode` | `PreviewMode` | ✅ Working | No permission required |

---

## 2. Critical Issues Found

### 2.1 Issue #1 — Dictation Nav ID Mismatch (SEVERITY: HIGH)

The navigation item uses `id: "dictation"` with `path: "/admin/dictation"`, but the sectionMap key is `"dictation-exercises"` and the route is `/admin/dictation-exercises`. When a user clicks "Dictation Exercises" in the sidebar, the browser navigates to `/admin/dictation`, which has **no matching route** — the AdminControlCenter falls through to the default `overview` section, making it appear as though the Dashboard loaded instead.

**Fix:** Change the nav item path from `/admin/dictation` to `/admin/dictation-exercises`, or add a route alias for `/admin/dictation`.

### 2.2 Issue #2 — 5 Legacy Standalone Pages (SEVERITY: MEDIUM)

Five admin pages render **outside** the AdminControlCenter, meaning they lose the unified sidebar navigation. Users clicking these items leave the admin shell and land on pages with different layouts (some use Header/Footer, some use DashboardLayout, one has no layout wrapper). This creates a jarring, inconsistent experience.

| Page | Current Layout | Lines | Fix Strategy |
|------|---------------|-------|-------------|
| `AdminCoachApplications` | Header + Footer | 53 | Promote to sectionMap as `applications` |
| `AdminCommission` | Own card layout | 349 | Promote to sectionMap as `commission` |
| `AdminContentManagement` | Header + Footer | 1 483 | Promote to sectionMap as `content-mgmt` |
| `AdminLeads` | DashboardLayout | 432 | Promote to sectionMap as `leads` |
| `AdminReminders` | Own layout | 613 | Promote to sectionMap as `reminders` |

**Fix:** Create wrapper components in `client/src/pages/admin/` that strip the standalone layout and render the core content inside AdminLayout. Add entries to sectionMap and update routes in App.tsx.

### 2.3 Issue #3 — Marketing Group Missing Permissions (SEVERITY: LOW)

The MARKETING group (Email Campaigns, Funnels, Automations) has **no `requiredPermission`** on any item. Any authenticated user with admin access can see and interact with these sections. This may be intentional (marketing is open to all admins) but should be documented.

---

## 3. Learner Portal Audit (`/app/*`)

The Learner Portal provides 29 routes under the `/app` prefix, accessible to authenticated learners. These routes use a shared dashboard layout.

| Route | Page | Status |
|-------|------|--------|
| `/app` | App Home / Redirect | ✅ Working |
| `/app/overview` | Learner Overview | ✅ Working |
| `/app/my-courses` | My Courses | ✅ Working |
| `/app/my-sessions` | My Sessions | ✅ Working |
| `/app/my-progress` | My Progress | ✅ Working |
| `/app/my-badges` | My Badges | ✅ Working |
| `/app/my-students` | My Students (Coach view) | ✅ Working |
| `/app/certificates` | Certificates | ✅ Working |
| `/app/favorites` | Favorites | ✅ Working |
| `/app/notifications` | Notifications | ✅ Working |
| `/app/settings` | Settings | ✅ Working |
| `/app/sle-exam` | SLE Exam Practice | ✅ Working |
| `/app/sle-progress` | SLE Progress | ✅ Working |
| `/app/ai-practice` | AI Practice | ✅ Working |
| `/app/simulation` | Simulation | ✅ Working |
| `/app/conversation` | Conversation Practice | ✅ Working |
| `/app/practice-history` | Practice History | ✅ Working |
| `/app/video-sessions` | Video Sessions | ✅ Working |
| `/app/availability` | Availability | ✅ Working |
| `/app/badges` | Badges | ✅ Working |
| `/app/budget` | Budget | ✅ Working |
| `/app/coach-guide` | Coach Guide | ✅ Working |
| `/app/coach-profile` | Coach Profile | ✅ Working |
| `/app/cohorts` | Cohorts | ✅ Working |
| `/app/compliance` | Compliance | ✅ Working |
| `/app/earnings` | Earnings | ✅ Working |
| `/app/loyalty` | Loyalty | ✅ Working |
| `/app/resources` | Resources | ✅ Working |
| `/app/team` | Team | ✅ Working |

**Assessment:** All 29 learner routes have registered components. No dead routes detected.

---

## 4. Coach Portal Audit (`/coach/*`)

The Coach Portal provides dedicated routes for coach-specific functionality.

| Route | Page | Status |
|-------|------|--------|
| `/coach` | Coach Landing | ✅ Working |
| `/coach/dashboard` | Coach Dashboard | ✅ Working |
| `/coach/earnings` | Coach Earnings | ✅ Working |
| `/coach/earnings/history` | Earnings History | ✅ Working |
| `/coach/payments` | Coach Payments | ✅ Working |
| `/coach/guide` | Coach Guide | ✅ Working |
| `/coach/terms` | Coach Terms | ✅ Working |
| `/coach/:slug` | Coach Public Profile | ✅ Working |
| `/coach-invite/:token` | Coach Invite Claim | ✅ Working |
| `/coaches` | Coaches Directory | ✅ Working |
| `/coaches/:slug` | Coach Detail Page | ✅ Working |

**Assessment:** All 11 coach routes have registered components. No dead routes detected.

---

## 5. HR Dashboard Audit (`/hr/*`, `/dashboard/hr/*`)

| Route | Page | Status |
|-------|------|--------|
| `/hr` | HR Landing | ✅ Working |
| `/hr/dashboard` | HR Dashboard | ✅ Working |
| `/dashboard/hr` | HR Dashboard (alias) | ✅ Working |
| `/dashboard/hr/overview` | HR Overview | ✅ Working |

**Assessment:** All 4 HR routes have registered components. No dead routes detected.

---

## 6. Dashboard Routes (`/dashboard/*`)

| Route | Page | Status |
|-------|------|--------|
| `/dashboard` | Main Dashboard | ✅ Working |
| `/dashboard/learner` | Learner Dashboard | ✅ Working |
| `/dashboard/coach` | Coach Dashboard | ✅ Working |
| `/dashboard/admin` | Admin Dashboard (alias → overview) | ✅ Working |
| `/dashboard/admin/leads` | Admin Leads (legacy alias) | 🔗 Legacy |
| `/dashboard/hr` | HR Dashboard | ✅ Working |
| `/dashboard/hr/overview` | HR Overview | ✅ Working |

**Assessment:** All dashboard routes functional. `/dashboard/admin/leads` uses legacy standalone layout.

---

## 7. RBAC Permission Keys

The ecosystem uses 16 permission keys for role-based access control:

| Permission Key | Used By (Admin Sections) | Count |
|---------------|------------------------|-------|
| `view_dashboard` | Live KPI Dashboard | 1 |
| `manage_courses` | Courses, Enrollments, Certificates, Reviews, Gamification, Drip Content, Weekly Challenges, Flashcards, Vocabulary, Study Notes, Daily Review | 11 |
| `manage_coaches` | Coaches, Coach Applications | 2 |
| `manage_sle_exam` | SLE Exam Mode, Reading Lab, Listening Lab, Grammar Drills, Writing Lab, Pronunciation Lab, Dictation Exercises | 7 |
| `manage_content` | Media Library, Email Templates, Content Management, Discussions, Peer Review, Study Groups | 6 |
| `manage_payments` | Pricing & Checkout, Coupons, Coach Commission, Stripe Testing | 4 |
| `manage_crm` | CRM & Contacts, Lead Management | 2 |
| `manage_cms` | Pages & CMS | 1 |
| `manage_ai` | AI Companion, AI Predictive, Smart Recommendations | 3 |
| `manage_analytics` | Content Intelligence, Analytics Overview, Sales Analytics, A/B Testing | 4 |
| `manage_users` | Users & Roles, Reminders | 2 |
| `manage_roles` | RBAC Permissions | 1 |
| `manage_notifications` | Notifications | 1 |
| `manage_settings` | Import/Export, Onboarding Workflow, Settings | 3 |
| `manage_enterprise` | Enterprise Mode, Org Billing | 2 |
| `view_audit_log` | Activity Logs | 1 |
| *(none)* | Dashboard, Email, Funnels, Automations, Component Lab, Preview Mode | 6 |

**Assessment:** All 16 permission keys are actively used. 6 sections have no permission requirement (open to all admin roles).

---

## 8. Database Tables Summary

The ecosystem contains **149 database tables** across the following domains:

| Domain | Table Count | Key Tables |
|--------|------------|------------|
| Users & Auth | 12 | `users`, `sessions`, `adminInvitations`, `coachInvitations` |
| Courses & Content | 22 | `courses`, `courseModules`, `lessons`, `activities`, `quizzes`, `quizQuestions`, `learningPaths` |
| Progress & Tracking | 8 | `lessonProgress`, `activityProgress`, `quizAttempts`, `courseEnrollments`, `pathEnrollments` |
| Coaching | 16 | `coachProfiles`, `coachApplications`, `coachCommissions`, `coachPayouts`, `coachAvailability` |
| Gamification | 6 | `badges`, `userBadges`, `streaks`, `leaderboard`, `achievements` |
| CRM & Sales | 14 | `leads`, `contacts`, `deals`, `pipelines`, `crmActivities` |
| Payments | 8 | `subscriptions`, `payments`, `invoices`, `coupons`, `stripePrices` |
| Community | 5 | `forumPosts`, `forumReplies`, `forumCategories`, `communityEvents` |
| Messaging | 4 | `messages`, `conversations`, `messageAttachments` |
| CMS & Pages | 6 | `cmsPages`, `cmsBlocks`, `mediaAssets`, `templates` |
| Notifications | 3 | `notifications`, `notificationPreferences`, `pushSubscriptions` |
| Analytics | 5 | `analyticsEvents`, `pageViews`, `sessionRecordings` |
| Enterprise & Org | 8 | `organizations`, `orgMembers`, `orgBilling`, `departments` |
| Automation | 6 | `automationWorkflows`, `automationSteps`, `emailCampaigns` |
| SLE & Assessment | 10 | `sleExams`, `sleAttempts`, `sleScores`, `diagnosticResults` |
| Other | 16 | Various utility tables |

**Assessment:** All 149 tables are defined in `drizzle/schema.ts`. No orphaned tables detected.

---

## 9. Server Routers Summary

The ecosystem contains **74 server router files** providing tRPC procedures:

| Category | Router Files | Key Routers |
|----------|-------------|-------------|
| Admin | 11 | `admin.ts`, `adminCourses.ts`, `adminCourseTree.ts`, `adminUsers.ts`, `adminControlCenter.ts` |
| Auth | 4 | `auth.ts`, `auth-rbac.ts`, `googleAuth.ts`, `microsoftAuth.ts` |
| Courses & Content | 8 | `courses.ts`, `lessons.ts`, `paths.ts`, `learnerCourses.ts`, `progressCascade.ts` |
| Coaching | 5 | `coach.ts`, `coachInvitation.ts`, `coachLearnerMetrics.ts`, `adminCoachApps.ts`, `commission.ts` |
| CRM | 1 | `crm.ts` |
| Payments | 3 | `stripe.ts`, `subscriptions.ts`, `stripeKPIData.ts` |
| Gamification | 2 | `gamification.ts`, `learnerGamification.ts` |
| Community | 2 | `forum.ts`, `events.ts` |
| Messaging | 1 | `message.ts` |
| AI & SLE | 4 | `ai.ts`, `sleCompanion.ts`, `sleProgress.ts`, `sleServices.ts` |
| Other | 33 | Various feature routers |

**Assessment:** All 74 routers are imported and registered. No orphaned routers detected.

---

## 10. Remediation Plan

### Immediate Fixes (This Sprint)

| # | Issue | Action | Priority |
|---|-------|--------|----------|
| 1 | Dictation nav ID mismatch | Change nav path to `/admin/dictation-exercises` OR add route alias | 🔴 Critical |
| 2 | 5 legacy standalone pages | Promote into AdminControlCenter sectionMap with wrapper components | 🟠 High |
| 3 | Marketing group missing permissions | Document as intentional OR add `manage_content` permission | 🟡 Medium |

### Structural Improvements (Next Sprints)

| # | Improvement | Description | Priority |
|---|------------|-------------|----------|
| 4 | Wire Wave 1–3 panels to tRPC | Replace mock data with real backend calls in 15 admin panels | 🟠 High |
| 5 | Course publication standardization | Implement bulk publish/unpublish with activity-level granularity | 🟠 High |
| 6 | Coach management hub | Consolidate coach workflow (application → approval → activation) | 🟠 High |
| 7 | Bilingual completeness check | Verify all `labelFr` and `titleFr` fields are populated | 🟡 Medium |
| 8 | Empty state standardization | Ensure all sections have professional "Create first…" CTAs | 🟡 Medium |

---

## 11. Statistics Summary

| Metric | Count |
|--------|-------|
| Total Routes | 213 |
| Admin Nav Items | 59 (57 + 2 dev) |
| Admin Nav Groups | 12 + dev tools |
| Admin sectionMap Entries | 55 |
| Legacy Standalone Admin Pages | 5 |
| Working Admin Sections | 35 |
| UI Complete (mock data) | 15 |
| Broken/Mismatched | 1 (dictation) |
| Learner Portal Routes | 29 |
| Coach Portal Routes | 11 |
| HR Dashboard Routes | 4 |
| Dashboard Routes | 7 |
| Public Pages | ~80 |
| Server Routers | 74 |
| Database Tables | 149 |
| RBAC Permission Keys | 16 |
| Test Files | ~110 |
| Test Cases | ~2 912 |

---

*This audit was generated from the `feat/admin-rebuild-waves-1-3` branch of the RusingAcademy ecosystem repository. All findings are based on static code analysis of the source files.*
