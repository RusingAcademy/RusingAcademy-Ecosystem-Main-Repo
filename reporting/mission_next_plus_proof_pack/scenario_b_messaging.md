# Scenario B — Messaging Infrastructure Verification

## Method
API-level endpoint testing (all protected endpoints return 401 for unauthenticated requests, confirming auth middleware is active) + DB schema verification + frontend procedure call audit.

## API Endpoint Results

| Procedure | Method | HTTP Status | Expected | Verdict |
|---|---|---|---|---|
| message.conversations | GET | 401 | 401 (protected) | PASS |
| message.list | GET | 401 | 401 (protected) | PASS |
| message.send | POST | 401 | 401 (protected) | PASS |
| message.startConversation | POST | 401 | 401 (protected) | PASS |
| message.markAsRead | POST | 401 | 401 (protected) | PASS |
| message.unreadCount | GET | 401 | 401 (protected) | PASS |

All 6 procedures correctly reject unauthenticated requests.

## Database Tables

### conversations
| Column | Type |
|---|---|
| id | int(11) |
| participant1Id | int(11) |
| participant2Id | int(11) |
| lastMessageAt | timestamp |
| lastMessagePreview | varchar(200) |
| createdAt | timestamp |
| updatedAt | timestamp |

### messages
| Column | Type |
|---|---|
| id | int(11) |
| conversationId | int(11) |
| senderId | int(11) |
| recipientId | int(11) |
| content | text |
| read | tinyint(1) |
| readAt | timestamp |
| createdAt | timestamp |

## Frontend Wiring Audit

| Component | Procedure Called | Purpose |
|---|---|---|
| Messages.tsx | message.conversations | List conversations |
| Messages.tsx | message.list | Get messages in conversation |
| Messages.tsx | message.send | Send a message |
| Messages.tsx | message.markAsRead | Mark messages as read |
| Messages.tsx | message.startConversation | Auto-start from URL param |
| Coaches.tsx | message.startConversation | "Message" button on coach cards |
| CoachProfile.tsx | message.startConversation | "Send Message" button on profile |
| CoachDashboard.tsx | message.unreadCount | Unread badge in sidebar |

## Coach List userId Availability

All 7 coaches return `userId` field in coach.list response, enabling the `startConversation(participantId)` call:

| Coach | userId | Slug |
|---|---|---|
| Steven Barholere | 4 | steven-barholere |
| Sue-Anne Richer | 5 | sue-anne-richer |
| Victor Amisi | 2 | victor-amisi |
| Soukaïna Mhammedi Alaoui | 8 | soukaina-mhammedi-alaoui |
| Preciosa Baganha | 3 | preciosa-baganha |
| Francine Nkurunziza | 7 | francine-nkurunziza |
| Erika Seguin | 6 | erika-seguin |

## Verdict: PASS
All 6 messaging endpoints are live and protected. Both DB tables exist with correct schema. All 4 frontend components correctly reference the router procedures. Coach userId is available for conversation initiation.
