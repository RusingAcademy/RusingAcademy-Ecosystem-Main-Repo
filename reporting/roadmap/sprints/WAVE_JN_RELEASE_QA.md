# Wave J-N Release QA Plan

**PR:** #148
**Branch:** `sprint-j2`

This document outlines the Quality Assurance plan for the features and enhancements introduced in Waves J through N.

---

## 1. Touched Routes & API Endpoints

This table lists all new or modified tRPC routers and key endpoints. Verification will confirm they are active and return expected status codes.

| Router | Endpoint | Change | Status |
|---|---|---|:---:|
| `courses` | `createCheckoutSession` | **NEW** | PENDING |
| `courses` | `enrollFree` | MODIFIED | PENDING |
| `stripe/webhook` | `checkout.session.completed` | MODIFIED | PENDING |
| `adminPayouts` | `getStats` | **NEW** | PENDING |
| `adminPayouts` | `listPayouts` | **NEW** | PENDING |
| `adminPayouts` | `initiatePayoutRun` | **NEW** | PENDING |
| `adminPayouts` | `approvePayouts` | **NEW** | PENDING |
| `adminPayouts` | `getRunHistory` | **NEW** | PENDING |
| `_core/index.ts` | `/api/health` | **NEW** | PENDING |
| `courseAdmin` | `addLesson` | MODIFIED | PENDING |
| `courseAdmin` | `updateLesson` | MODIFIED | PENDING |
| `contentVersions` | `getHistory` | **NEW** | PENDING |
| `contentVersions` | `getSnapshot` | **NEW** | PENDING |
| `contentVersions` | `restoreSnapshot` | **NEW** | PENDING |
| `discussions` | `upvoteReply` | **NEW** | PENDING |
| `discussions` | `reportContent` | **NEW** | PENDING |
| `discussions` | `togglePin` | **NEW** | PENDING |
| `discussions` | `toggleLock` | **NEW** | PENDING |
| `discussions` | `markAcceptedAnswer` | **NEW** | PENDING |
| `discussions` | `getReports` | **NEW** | PENDING |
| `discussions` | `resolveReport` | **NEW** | PENDING |
| `privacy` | `requestDataExport` | **NEW** | PENDING |
| `privacy` | `requestAccountDeletion` | **NEW** | PENDING |
| `privacy` | `cancelDeletion` | **NEW** | PENDING |
| `privacy` | `getStatus` | **NEW** | PENDING |

---

## 2. Automated Tests

Verification will involve running the existing test suite to ensure no regressions were introduced.

**Command:**
```bash
cd /home/ubuntu/rusingacademy-ecosystem && npx vitest run
```

**Expected Result:**
- All test suites pass.
- No new failing tests.

**Actual Result:**

```
[SUMMARY OF TEST RUN WILL BE INSERTED HERE]
```

---

## 3. E2E Evidence Checklist (Post-Staging Deployment)

This checklist will be executed on the **staging environment** after PR #148 is merged and deployed. Evidence will be captured as screenshots or direct links.

| Scenario | Step | Expected Outcome | Evidence |
|---|---|---|---|
| **Paid Course Enrollment** | 1. Click "Enroll" on a paid course | Redirected to Stripe Checkout | [Link/Screenshot] |
| | 2. Complete test payment | Redirected to `/course-success` | [Link/Screenshot] |
| | 3. Check enrollment status | `courseEnrollments` table shows `status: 'active'` | [DB Query Result] |
| | 4. Access course | Course player is accessible | [Link/Screenshot] |
| **Webhook Processing** | 1. Stripe sends `checkout.session.completed` | Webhook handler receives event | [Webhook Log] |
| | 2. Check logs | Log shows successful processing with correlation ID | [Log Snippet] |
| **Coach Payouts** | 1. Initiate payout run (admin) | Payout run created with `pending` status | [Admin UI Screenshot] |
| | 2. Approve payout run (admin) | Status changes to `processing`, Stripe transfers initiated | [Admin UI Screenshot] |
| **Content Versioning** | 1. Edit a lesson | New snapshot created in `content_versions` | [DB Query Result] |
| | 2. Restore previous version | Lesson content reverts to the selected snapshot | [Admin UI Screenshot] |
| **Community Moderation** | 1. Upvote a reply | Upvote count increments | [UI Screenshot] |
| | 2. Report a thread | Report appears in admin moderation queue | [Admin UI Screenshot] |
| | 3. Pin a thread (admin) | Thread is pinned to the top of the forum | [UI Screenshot] |
| **Privacy Router** | 1. Request data export | JSON file is generated and downloadable | [File Snippet] |
| | 2. Request account deletion | Account status becomes `pending_deletion` | [DB Query Result] |
| **Zero Regression Sweep** | 1. Visit top 20 routes | All pages load without errors (200 OK) | [URL List + Status] |
| | 2. Check key components | Header, Footer, Widgets are visually correct | [Homepage Screenshot] |
| | 3. Test critical actions | Login, language switch, search are functional | [Action Checklist] |
