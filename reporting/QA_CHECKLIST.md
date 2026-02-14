# QA Checklist: Railway Staging Validation

**Branch:** `integration/railway-prod-migration`
**Staging URL:** `https://rusingacademy-ecosystem-staging-production.up.railway.app`

This checklist is designed for a 5-minute smoke test to validate the core functionality of the ecosystem on the Railway Staging environment before merging to production.

## 1. Hub & Ecosystem Navigation

| Test Case | Expected Result | Status |
|---|---|---|
| **Load Homepage** | Page loads successfully (HTTP 200). | ☐ |
| **Header & Hero** | Header with logo, nav links, and Login button is visible. Hero section with Steven's photo and "CHOOSE YOUR PATH" is correct. | ☐ |
| **Ecosystem Pillars** | RusingAcademy, Lingueefy, and Barholex Media cards are visible and link to their respective pages. | ☐ |
| **Footer** | Footer with all links is visible and functional. | ☐ |
| **Navigate to /rusingacademy** | Page loads with RusingAcademy content. | ☐ |
| **Navigate to /lingueefy** | Page loads with Lingueefy content. | ☐ |
| **Navigate to /barholex** | Page loads with Barholex Media content. | ☐ |

## 2. Authentication & User Flow

| Test Case | Expected Result | Status |
|---|---|---|
| **Navigate to /login** | Login page with Google & Microsoft buttons loads. | ☐ |
| **Navigate to /signup** | Signup page loads. | ☐ |
| **(Post-Fix) Google OAuth** | After applying the `OAUTH_FIX.md` guide, Google login should redirect correctly. | ☐ |

## 3. Admin Dashboard

| Test Case | Expected Result | Status |
|---|---|---|
| **Navigate to /admin** | Redirects to login if not authenticated. | ☐ |
| **(Post-Login) Navigate to /admin** | Admin dashboard loads with the full 11-group sidebar. | ☐ |
| **Navigate to /admin/products** | The Products page loads correctly. | ☐ |
| **Navigate to /admin/coaching** | The Coaching section loads correctly. | ☐ |

## 4. Key Feature Pages

| Test Case | Expected Result | Status |
|---|---|---|
| **Navigate to /courses** | The main course catalog page loads. | ☐ |
| **Navigate to /community** | The community forum page loads. | ☐ |
| **Navigate to /community/threads** | The community threads list page loads. | ☐ |

## 5. Console Errors

| Test Case | Expected Result | Status |
|---|---|---|
| **Browse all pages** | No critical (red) console errors appear in the browser's developer tools. | ☐ |
