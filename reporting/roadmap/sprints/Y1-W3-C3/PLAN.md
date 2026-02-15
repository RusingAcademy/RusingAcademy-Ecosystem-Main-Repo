# Sprint Y1-W3-C3 — Notifications & Communication Engine

## Goal
Create a unified learner notification utility and wire critical learning events (enrollment, completion, milestones) to trigger in-app notifications. Add admin broadcast capability and learner notification preferences.

## Scope

| Deliverable | Description |
|-------------|-------------|
| `notifyLearner` utility | Server-side function that creates in-app notifications for learners with type-safe event payloads |
| Event triggers | Wire enrollment, course completion, quiz results, badge earned, and streak milestones to send notifications |
| Admin broadcast | Endpoint to send notifications to all learners or filtered segments |
| Learner preferences | Simple notification preferences panel (which types to receive) |
| Bilingual templates | Notification content in EN/FR based on learner language preference |

## Files to Touch

| File | Change |
|------|--------|
| `server/services/learnerNotifications.ts` | NEW — notifyLearner utility with event templates |
| `server/routers.ts` | Wire enrollment and completion events to trigger notifications |
| `server/routers/adminDashboardData.ts` | Add broadcastNotification endpoint |
| `client/src/components/NotificationPreferences.tsx` | NEW — learner notification preferences panel |
| `client/src/pages/LearnerSettings.tsx` | Integrate notification preferences |

## Risks
- Low: Uses existing `createNotification` function and `notifications` table
- Low: No schema changes needed (notification type enum already has "system" for general use)

## Success Metrics
- Enrollment triggers in-app notification
- Course completion triggers notification
- Admin can broadcast to all learners
- Learner can toggle notification types
- Build passes with zero regressions
