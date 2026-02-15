# Repo Feature Map\n\nThis document maps the key features, modules, and assets to their repository of origin.\n
\n## Repo: rusingacademy-ecosystem\n

Based on the repository's dependencies and file structure, the following features have been identified:

- **Authentication:** User authentication and authorization are managed using Clerk. Key files include `client/src/providers/ClerkProviderWrapper.tsx` and server-side authentication middleware.
- **tRPC API:** The application uses tRPC for typesafe API routes between the client and server. The main router is likely defined in `server/src/routers/_app.ts`.
- **Database:** The application uses Drizzle ORM with a MySQL database. Schema definitions are likely located in the `shared/schema.ts` file.
- **File Storage:** The application appears to use AWS S3 for file storage, with `tus-js-client` for resumable uploads. Key files include `server/src/bunnyStorage.ts` and `server/src/bunnyStream.ts`.
- **Payments:** Stripe is integrated for payment processing. Stripe-related logic is likely located in the `server/src/stripe` directory.
- **Email Notifications:** The application sends emails using SendGrid and Nodemailer. Email templates and services are likely in `server/src/email` and `server/src/email-service.ts`.
- **Real-time Features:** Web push notifications are implemented, likely using the `web-push` library.
- **Admin Dashboard:** A comprehensive admin dashboard seems to be a core feature, with numerous test files indicating its functionality.
- **Course Management:** The platform includes features for creating, managing, and taking courses.
- **CRM:** A Customer Relationship Management system is integrated into the application.
- **Quizzes:** The application includes a quiz feature for learners.
- **Gamification and Rewards:** The platform incorporates gamification elements like badges, achievements, and leaderboards.
- **Analytics:** The application tracks user behavior and generates analytics reports.

\n## Repo: RusingAcademy-Learner-Portal Audit Report\n
\n## Repo: RusingAcademy-Library Audit Report\n
\n## Repo: RusingAcademy-Sales Repository Audit\n
\n## Repo: RusingAcademy-KAJABI-style-Admin-Control-System Audit Report\n
\n## Repo: RusingAcademy-Community Audit Report\n

- **AI Assistant**: `client/src/pages/AIAssistant.tsx`, `server/routers/aiAssistant.ts`
- **Analytics**: `client/src/pages/Analytics.tsx`, `server/routers/analytics.ts`, `server/routers/advancedAnalytics.ts`
- **Certificates**: `client/src/pages/Certificates.tsx`, `server/routers/certificate.ts`
- **Challenges**: `client/src/components/Challenges.tsx`, `server/routers/challenges.ts`
- **Channels**: `client/src/pages/Channels.tsx`, `server/routers/channel.ts`
- **Classroom**: `client/src/components/Classroom.tsx`, `server/routers/classroom.ts`
- **Course Admin**: `server/routers/courseAdmin.ts`
- **Course Builder**: `client/src/pages/CourseBuilder.tsx`
- **Course Catalog**: `client/src/pages/CourseCatalog.tsx`
- **Course Player**: `client/src/pages/CoursePlayer.tsx`, `server/routers/coursePlayer.ts`
- **Direct Messaging (DM)**: `server/routers/dm.ts`
- **Email Broadcasts**: `client/src/pages/EmailBroadcasts.tsx`, `server/routers/emailBroadcast.ts`
- **Events Calendar**: `client/src/components/EventsCalendar.tsx`, `server/routers/events.ts`
- **Forum**: `server/routers/forum.ts`
- **Gamification**: `server/routers/gamification.ts`
- **Leaderboard**: `client/src/components/Leaderboard.tsx`
- **Membership**: `client/src/pages/Membership.tsx`, `server/routers/membership.ts`
- **Moderation**: `client/src/pages/Moderation.tsx`, `server/routers/moderation.ts`
- **Notebook**: `client/src/components/Notebook.tsx`, `server/routers/notebook.ts`
- **Notifications**: `client/src/components/NotificationsPanel.tsx`, `server/routers/notifications.ts`
- **Polls**: `server/routers/polls.ts`
- **Podcast Player**: `client/src/components/PodcastPlayer.tsx`
- **Referrals**: `client/src/pages/Referrals.tsx`, `server/routers/referral.ts`
- **Revenue Dashboard**: `client/src/pages/RevenueDashboard.tsx`
- **Search**: `client/src/pages/SearchResults.tsx`, `server/routers/search.ts`
- **Stripe Payments**: `server/stripe/`
- **User Profile**: `client/src/pages/UserProfile.tsx`
- **Real-time features (WebSocket)**: `server/websocket.ts`, `client/src/components/WebSocketStatus.tsx`

