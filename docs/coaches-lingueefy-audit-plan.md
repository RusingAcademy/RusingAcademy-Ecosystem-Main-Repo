# Coaches & Lingueefy — Deep Audit Report and Sprint Plan

**Date:** February 13, 2026  
**Author:** Manus AI  
**Scope:** Full audit of the Coach system (profiles, dashboard, Bunny Stream video, onboarding, admin approval, public page) and the Lingueefy coaching marketplace platform.

---

## 1. Executive Summary

The Coaches and Lingueefy subsystems are architecturally mature — the database schema, tRPC routers, frontend pages, Bunny Stream service, Stripe Connect, Calendly integration, and Jitsi video conferencing are all present. However, several critical gaps prevent the system from functioning end-to-end as a polished production experience. The most significant issues are:

1. **Video uploads go to S3 as base64 blobs** instead of Bunny Stream (TUS resumable upload) — the `BunnyVideoManager` component exists but is not wired into the coach profile editor or application wizard.
2. **CoachProfile public page** only supports YouTube embeds and native `<video>` tags — it does not render Bunny Stream embeds, despite the `FeaturedCoaches` component already having full Bunny Stream iframe support.
3. **Coach.list** does not return `videoUrl` — approved coaches on the `/coaches` page have no video preview capability.
4. **CoachProfileEditor** uses a plain text input for video URL — no direct upload, no Bunny Stream integration.
5. **No `bunnyVideoId` field** in the `coachProfiles` schema — only `videoUrl` (text), which means there's no way to store a Bunny Stream GUID for proper embed rendering.

---

## 2. Detailed Audit Findings

### 2.1 Database Schema

| Table | Status | Key Fields | Gap |
|-------|--------|-----------|-----|
| `coachProfiles` | ✅ Exists (60+ fields) | videoUrl, photoUrl, slug, status, stripeAccountId, calendlyUrl | **Missing `bunnyVideoId`** field for Bunny Stream GUID |
| `coachApplications` | ✅ Exists | introVideoUrl, photoUrl, status, reviewedBy | Video stored as S3 URL (base64 upload), not Bunny Stream |
| `sessions` | ✅ Exists | coachId, learnerId, status, meetingUrl, startTime | Fully wired with Jitsi meeting URLs |
| `coachReviews` | ✅ Exists | coachId, learnerId, rating, comment | Wired to coach.submitReview and coach.reviews |
| `coachAvailability` | ✅ Exists | coachId, dayOfWeek, startTime, endTime | Used by booking.getAvailableSlots |
| `pushSubscriptions` | ✅ Exists | userId, endpoint, keys | Wired in Sprint 14 |

### 2.2 Server Routes (tRPC)

| Router | File | Lines | Procedures | Status |
|--------|------|-------|-----------|--------|
| `coach` | `server/routers/coach.ts` | ~500 | list, bySlug, reviews, canReview, myReview, submitReview, myProfile, submitApplication, updateProfile, uploadPhoto, uploadApplicationMedia, getGalleryPhotos | ✅ Comprehensive |
| `booking` | `server/routers/booking.ts` | 228 | getAvailableSlots, bookSessionWithPlan, getMySessions | ✅ Functional |
| `stripe` | `server/routers/stripe.ts` | ~120 | startOnboarding, accountStatus, dashboardLink | ✅ Stripe Connect wired |
| `bunnyStream` | `server/routers/bunnyStream.ts` | 140 | list, get, create, delete, update, getTusCredentials, getUrls | ✅ Full CRUD but **not connected to coach flow** |
| `adminCoachApps` | `server/routers/adminCoachApps.ts` | ~200 | approveCoachApplication, rejectCoachApplication, approveCoach | ✅ Approval creates profile from application |
| `notifications` | `server/routers/notifications.ts` | ~150 | subscribePush, unsubscribePush, updatePushPreferences | ✅ Wired in Sprint 14 |

### 2.3 Frontend Pages

| Page | File | Lines | Status | Key Gaps |
|------|------|-------|--------|----------|
| **Coaches** (public list) | `Coaches.tsx` | 656 | ✅ Real data via `trpc.coach.list` | **No video preview** — list doesn't return videoUrl |
| **CoachProfile** (public detail) | `CoachProfile.tsx` | ~500 | ✅ Real data via `trpc.coach.bySlug` | **Video only supports YouTube/native** — no Bunny Stream embed |
| **BecomeCoach** (application) | `BecomeCoachNew.tsx` → `CoachApplicationWizard.tsx` | 800+ | ✅ 8-step wizard with photo+video upload | **Video uploads as base64 to S3** — should use Bunny Stream TUS |
| **CoachDashboard** | `CoachDashboard.tsx` | 938 | ✅ Tabs: overview, sessions, earnings, settings | ✅ Has onboarding checklist, Stripe Connect |
| **CoachProfileEditor** | `CoachProfileEditor.tsx` | ~500 | ✅ Editable profile fields | **Video is plain URL input** — no upload, no Bunny Stream picker |
| **CoachOnboardingChecklist** | Component | 370 | ✅ 8 items tracked | ✅ Checks bio, headline, photo, video, pricing, specializations, availability, stripe |
| **CoachEarnings** | `CoachEarnings.tsx` | 593 | ✅ Earnings dashboard | ✅ Functional |
| **CoachPayments** | `CoachPayments.tsx` | 372 | ✅ Payment history | ✅ Functional |
| **CoachGuide** | `CoachGuide.tsx` | 787 | ✅ Comprehensive guide | ✅ Bilingual |
| **CoachTerms** | `CoachTerms.tsx` | 455 | ✅ Terms & conditions | ✅ Bilingual |
| **BookSession** | `BookSession.tsx` | 717 | ✅ Booking flow | ✅ Calendly + internal calendar |
| **MySessions** | `MySessions.tsx` | 535 | ✅ Session list | ✅ With Jitsi join button |
| **VideoSession** | `VideoSession.tsx` | 272 | ✅ Jitsi video room | ✅ Waiting room + live session |
| **LingueefyLanding** | `LingueefyLanding.tsx` | 1609 | ✅ Full landing page | ✅ Hero, plans, FAQ, coaches section |
| **FeaturedCoaches** | Component | 901 | ✅ Hardcoded 6 coaches | ✅ **Already has Bunny Stream iframe embeds** |
| **HowItWorks** | `HowItWorks.tsx` | 281 | ✅ Static content | ✅ Bilingual |
| **AdminCoachApplications** | `CoachesManagement.tsx` | 537 | ✅ Application review | ✅ Approve/reject with email notifications |

### 2.4 Bunny Stream Integration

| Component | Status | Detail |
|-----------|--------|--------|
| `server/bunnyStream.ts` | ✅ 362 lines | Full API: create, upload, delete, TUS credentials, embed/HLS/thumbnail URLs |
| `server/routers/bunnyStream.ts` | ✅ 140 lines | Full tRPC router with all CRUD operations |
| `BunnyVideoManager.tsx` | ✅ 400+ lines | TUS upload UI with progress, browse library, select video |
| `FeaturedCoaches.tsx` | ✅ Uses Bunny Stream | `iframe.mediadelivery.net/embed/585866/{videoId}` — hover preview + inline play |
| **CoachProfileEditor** | ❌ Not connected | Plain text URL input, no BunnyVideoManager integration |
| **CoachApplicationWizard** | ❌ Not connected | Base64 upload to S3, not Bunny Stream |
| **CoachProfile (public)** | ❌ Not connected | Only YouTube + native `<video>`, no Bunny Stream iframe |
| **Schema** | ❌ Missing field | No `bunnyVideoId` in `coachProfiles` table |

### 2.5 Existing Integrations (Working)

| Integration | Status | Detail |
|-------------|--------|--------|
| **Stripe Connect** | ✅ Full | Express accounts, onboarding, dashboard link, webhook handling |
| **Calendly** | ✅ Full | Webhook handler (362 lines), booking sync, email notifications |
| **Jitsi Meet** | ✅ Full | Video meeting generation (174 lines), waiting room, live session |
| **Push Notifications** | ✅ Full | VAPID, service worker, enrollment triggers (Sprint 14) |
| **Email Notifications** | ✅ Full | Application status emails, session confirmations, coach notifications |

---

## 3. Sprint Plan

Based on the audit, I propose **3 focused sprints** to bring the Coaches and Lingueefy system to production readiness.

### Sprint 16: Bunny Stream Video Pipeline for Coaches (Critical)

This is the highest-priority sprint — it connects the existing Bunny Stream infrastructure to the coach workflow.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1 | Add `bunnyVideoId` field to `coachProfiles` schema + migration | Critical | 15 min |
| 2 | Add `bunnyVideoId` to `coachApplications` schema + migration | Critical | 15 min |
| 3 | Replace CoachProfileEditor video URL input with `BunnyVideoManager` component (TUS upload + library browse) | Critical | 1 hour |
| 4 | Wire CoachApplicationWizard video step to use Bunny Stream TUS upload instead of base64-to-S3 | Critical | 1.5 hours |
| 5 | Update `coach.updateProfile` to accept and store `bunnyVideoId` | Critical | 30 min |
| 6 | Update `coach.submitApplication` to store `bunnyVideoId` alongside `introVideoUrl` | Critical | 30 min |
| 7 | Update `approveCoachApplication` to copy `bunnyVideoId` from application to coach profile | Critical | 15 min |
| 8 | Update CoachProfile public page to render Bunny Stream iframe embed (like FeaturedCoaches) with YouTube/native fallback | Critical | 1 hour |
| 9 | Add `videoUrl` and `bunnyVideoId` to `coach.list` response so Coaches page can show video preview | High | 30 min |
| 10 | Add video thumbnail from Bunny Stream to coach cards on `/coaches` page | High | 45 min |
| 11 | Write vitest tests for Bunny Stream coach integration | Required | 45 min |
| 12 | Verify all existing tests pass | Required | 15 min |

**Estimated total:** ~7 hours

### Sprint 17: Coach Onboarding & Dashboard Polish

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1 | Enhance CoachOnboardingChecklist to link "Upload Video" action directly to BunnyVideoManager dialog | High | 30 min |
| 2 | Add video preview in CoachDashboard overview tab (show current intro video with Bunny Stream embed) | High | 45 min |
| 3 | Add "Profile Preview" button in CoachDashboard that opens the public CoachProfile page | Medium | 30 min |
| 4 | Enhance admin CoachesManagement to show video preview (Bunny Stream embed) in application review | High | 45 min |
| 5 | Add coach profile completeness percentage to admin coaches list | Medium | 30 min |
| 6 | Wire the "Profile Hidden" warning to actually check if all required onboarding items are complete | Medium | 30 min |
| 7 | Add coach availability editor in CoachProfileEditor (day/time slot picker) | High | 1.5 hours |
| 8 | Add Calendly URL field with validation and "Connect Calendly" flow in CoachProfileEditor | Medium | 45 min |
| 9 | Ensure FeaturedCoaches component can pull from DB instead of hardcoded data (or add admin toggle) | Medium | 1 hour |
| 10 | Write vitest tests for onboarding and dashboard enhancements | Required | 45 min |

**Estimated total:** ~7.5 hours

### Sprint 18: Lingueefy Marketplace & Booking Polish

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1 | Wire LingueefyLanding "Find a Coach" CTA to `/coaches` with proper filter params | High | 30 min |
| 2 | Add coach search/filter on Coaches page (by language, specialization, price range, availability) | High | 1.5 hours |
| 3 | Add "Book Trial Session" button on coach cards and CoachProfile page | High | 45 min |
| 4 | Enhance BookSession page with coach availability calendar (Calendly embed or internal) | High | 1 hour |
| 5 | Add session reminder emails (24h before, 1h before) via cron job | Medium | 1 hour |
| 6 | Add post-session review prompt (email + in-app notification after session ends) | Medium | 45 min |
| 7 | Add coaching plan purchase flow on LingueefyLanding (already has `purchaseCoachingPlan` mutation) — verify end-to-end | High | 1 hour |
| 8 | Add "My Coaching Plan" section in learner dashboard showing remaining sessions, plan status | Medium | 1 hour |
| 9 | Ensure the `/lingueefy` route renders the LingueefyLanding (currently renders Home) | Medium | 15 min |
| 10 | Add SEO to Coaches and CoachProfile pages (dynamic meta tags, JSON-LD for Person schema) | Medium | 45 min |
| 11 | Write vitest tests for marketplace and booking enhancements | Required | 45 min |

**Estimated total:** ~9 hours

---

## 4. Dependency Map

```
Sprint 16 (Bunny Stream Video)
  └── Sprint 17 (Onboarding & Dashboard) ← depends on bunnyVideoId field
  └── Sprint 18 (Marketplace & Booking) ← independent, can run in parallel with 17
```

Sprint 16 is the critical path — Sprints 17 and 18 can proceed in parallel once Sprint 16 is complete.

---

## 5. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Bunny Stream TUS upload fails in production | High | BunnyVideoManager already tested in CourseBuilder; same component reused |
| Base64 video upload (current) hits size limits | High | Sprint 16 replaces with TUS resumable upload (no size limit) |
| Coach approval creates profile without bunnyVideoId | Medium | Sprint 16 Task 7 copies bunnyVideoId from application |
| FeaturedCoaches hardcoded data diverges from DB | Low | Sprint 17 Task 9 adds DB-driven option |
| Calendly webhook secret not configured | Low | Already has fallback handling; documented in env vars |

---

## 6. Summary

The Coaches and Lingueefy system has a strong architectural foundation with ~15,000 lines of code across 20+ files. The primary gap is the **disconnection between the Bunny Stream video infrastructure** (which is fully built) **and the coach workflow** (which still uses base64-to-S3 uploads and plain URL inputs). Sprint 16 bridges this gap. Sprints 17 and 18 polish the experience for coaches, admins, and learners respectively.

**Total estimated effort across all 3 sprints: ~23.5 hours**
