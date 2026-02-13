export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

/**
 * FREE_ACCESS_MODE - Temporary flag to bypass payment gates.
 * When true:
 *   - All paths/courses are free to enroll (no Stripe checkout)
 *   - All lessons are unlocked (no enrollment check on frontend)
 *   - A Preview Mode banner is shown to remind this is temporary
 *
 * To restore paid access, simply set this to false.
 * Added: 2026-02-12 - For Steven content review session.
 */
export const FREE_ACCESS_MODE = true;
