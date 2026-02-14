# RBAC & Auth Map\n\nThis document maps all roles, permissions, and protected routes from all 6 repositories.\n
\n## Repo: rusingacademy-ecosystem\n

- **Authentication:** User authentication is primarily handled by **Clerk**, as indicated by the `@clerk/clerk-react` dependency and the `ClerkProviderWrapper`. This manages user sessions, sign-up, sign-in, and other authentication-related functionality.

- **Authorization:** Role-Based Access Control (RBAC) is implemented through a custom middleware (`server/rbacMiddleware.ts`).
  - **Roles:** The `users` table in the database defines the following roles: `owner`, `admin`, `hr_admin`, `coach`, `learner`, and `user`.
  - **Permissions:** The `hasPermission` function checks if a user's role has the necessary permissions for a specific action on a module. Permissions are stored in the `role_permissions` database table.
  - **Protected Routes:** The `protectedProcedure` from tRPC is used to protect routes that require authentication. The `requirePermission` middleware is used to enforce role-based access to specific procedures.
  - **Protected Client-Side Routes:** The `/dashboard`, `/app/*`, `/admin/*`, and other user-specific routes are protected and will redirect to the login page if the user is not authenticated. The `DashboardRouter` component likely handles role-based rendering of the appropriate dashboard.
\n## Repo: RusingAcademy-Learner-Portal Audit Report\n
\n## Repo: RusingAcademy-Library Audit Report\n
\n## Repo: RusingAcademy-Sales Repository Audit\n
\n## Repo: RusingAcademy-KAJABI-style-Admin-Control-System Audit Report\n
\n## Repo: RusingAcademy-Community Audit Report\n

The repository uses a role-based access control (RBAC) system built on top of tRPC procedures. Authentication is handled through session cookies, and authorization is enforced by different types of procedures.

### Roles

The following user roles are defined in the `drizzle/schema.ts` file within the `users` table:

- **user**: The default role for any authenticated user.
- **admin**: Has full access to all protected and admin procedures.
- **coach**: A role that is defined but does not seem to be used in any of the tRPC procedures to restrict access.
- **learner**: A role that is defined but does not seem to be used in any of the tRPC procedures to restrict access.

### Authorization

Authorization is implemented using tRPC middleware, which creates three types of procedures:

- **`publicProcedure`**: These procedures do not require any authentication and can be accessed by anyone.
- **`protectedProcedure`**: These procedures require the user to be authenticated. The middleware checks for the presence of a `user` object in the tRPC context (`ctx.user`). If the user is not authenticated, a `UNAUTHORIZED` error is thrown.
- **`adminProcedure`**: These procedures are the most restrictive and require the user to be both authenticated and have the `admin` role. The middleware checks if `ctx.user.role` is equal to `'admin'`. If the user is not an admin, a `FORBIDDEN` error is thrown.

### Protected Routes

Many of the server procedures are protected using either `protectedProcedure` or `adminProcedure`. Here are some examples:

- **Admin-Only Procedures**:
    - `advancedAnalytics.revenueDashboard`
    - `advancedAnalytics.engagementMetrics`
    - `analytics.overview`
    - `courseAdmin.createCourse`
    - `channel.create`

- **Authenticated User Procedures**:
    - `aiAssistant.correctWriting`
    - `certificate.myCertificates`
    - `challenges.join`
    - `classroom.enroll`
    - `forum.createThread`

