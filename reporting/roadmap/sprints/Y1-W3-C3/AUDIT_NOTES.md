# Sprint C3 — Notification Infrastructure Audit

## What Already Exists

The notification infrastructure is surprisingly comprehensive. The system already has:

| Component | Status | Details |
|-----------|--------|---------|
| `notifications` table | EXISTS | Schema line 738, with userId, type, title, content, isRead, createdAt |
| `inAppNotifications` table | EXISTS | Schema line 1311, separate table for in-app notifications |
| `emailLogs` table | EXISTS | Schema line 3244, tracks all sent emails |
| `notification` router | EXISTS | 8+ endpoints: list, unreadCount, markAsRead, markAllAsRead, delete, getInAppNotifications, markNotificationRead, markAllNotificationsRead |
| `adminNotifications` router | EXISTS | Health checks, preferences, recent alerts |
| NotificationContext | EXISTS | React context with server sync, 4596 bytes |
| NotificationBell | EXISTS | 190 lines, dropdown with icons, relative time, bilingual |
| NotificationPermission | EXISTS | Push notification permission component |
| PushNotificationManager | EXISTS | Push notification service worker integration |
| Email service | EXISTS | SMTP-based with nodemailer, retry, logging |
| 6+ email template files | EXISTS | Auth, application, admin, coach terms, CRM, reminders |
| Admin NotificationsCenter | EXISTS | 264 lines, admin notification management page |

## What's Missing / Needs Enhancement

1. **Learner event notifications** — No automatic notifications for: enrollment confirmation, course completion, quiz results, streak milestones, badge earned, certificate ready
2. **Admin broadcast** — No ability to send bulk notifications to all learners or segments
3. **Notification preferences** — Learner-side preference panel (which notifications to receive)
4. **Email notification triggers** — Enrollment, completion, and milestone events don't trigger emails
5. **Notification templates** — No templating system for consistent notification formatting

## Sprint C3 Scope (Focused)

Given the extensive existing infrastructure, Sprint C3 should focus on:
1. Creating a `notifyLearner` utility that creates in-app + optional email notifications
2. Wiring enrollment, completion, and milestone events to trigger notifications
3. Adding a learner notification preferences panel
4. Adding admin broadcast capability
