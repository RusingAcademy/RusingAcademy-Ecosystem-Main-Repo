# Environment Variables Audit & Configuration Guide

**Date:** 2026-02-14

This document provides a complete audit of all environment variables required for the RusingAcademy ecosystem to function correctly on Railway. It includes existing variables found on the staging service and a list of missing variables that need to be added.

## I. Existing Variables (Found on Staging)

The following 23 variables are already configured on the `rusingacademy-ecosystem-staging` service and should be mirrored to production if they are not already present.

| Variable | Category | Description |
|---|---|---|
| `CLERK_SECRET_KEY` | Auth (Clerk) | Secret key for Clerk authentication backend. |
| `CLERK_WEBHOOK_SECRET` | Auth (Clerk) | Secret for verifying Clerk webhooks. |
| `CRON_SECRET` | Security | Secret for securing internal cron job endpoints. |
| `DATABASE_URL` | Database (TiDB) | Connection string for the TiDB database. |
| `JWT_SECRET` | Security | Secret for signing and verifying JSON Web Tokens. |
| `MINIMAX_API_KEY` | TTS Audio | API key for MiniMax text-to-speech service. |
| `OPENAI_API_KEY` | AI Features | API key for OpenAI services (GPT-4, etc.). |
| `PORT` | Server | The port the application server listens on (managed by Railway). |
| `SMTP_FROM` | Email | The "From" address for outgoing emails. |
| `SMTP_HOST` | Email | Hostname of the SMTP server. |
| `SMTP_PASS` | Email | Password for the SMTP server. |
| `SMTP_PORT` | Email | Port for the SMTP server. |
| `SMTP_USER` | Email | Username for the SMTP server. |
| `STEVEN_VOICE_ID` | TTS Audio | The specific voice ID for Steven's voice in MiniMax. |
| `STRIPE_PUBLISHABLE_KEY` | Payments | Public key for Stripe.js on the client-side. |
| `STRIPE_SECRET_KEY` | Payments | Secret key for Stripe API on the server-side. |
| `STRIPE_WEBHOOK_SECRET` | Payments | Secret for verifying Stripe webhooks. |
| `VITE_APP_ID` | Client Config | A unique identifier for the Vite application. |
| `VITE_CLERK_PUBLISHABLE_KEY` | Auth (Client) | Public key for Clerk.js on the client-side. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Media Storage | Cloud name for Cloudinary media services. |
| `VITE_FRONTEND_FORGE_API_URL` | API Config | The base URL for the tRPC API. |
| `VITE_OAUTH_ENABLED` | OAuth Config | A flag to enable/disable OAuth features. |
| `VITE_OAUTH_PORTAL_URL` | OAuth Config | The URL for the OAuth portal. |

## II. Missing Variables (To Be Added)

The following variables were identified as required by the codebase but were not found on the Railway staging service. These **must be added** to both staging and production for all features to work correctly.

| Variable | Category | Action Required |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth | **Owner Action:** Get from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | **Owner Action:** Get from Google Cloud Console. |
| `GOOGLE_REDIRECT_URI` | Google OAuth | **Owner Action:** Set to `https://<your-domain>/api/google/callback`. |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth | **Owner Action:** Get from Azure Portal. |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth | **Owner Action:** Get from Azure Portal. |
| `BUNNY_API_KEY` | Video CDN | **Owner Action:** Get from Bunny.net account. |
| `BUNNY_LIBRARY_ID` | Video CDN | **Owner Action:** Get from Bunny.net account. |
| `BUNNY_CDN_HOSTNAME` | Video CDN | **Owner Action:** Get from Bunny.net account. |
| `AWS_ACCESS_KEY_ID` | S3 Storage | **Owner Action:** Get from AWS IAM. |
| `AWS_SECRET_ACCESS_KEY` | S3 Storage | **Owner Action:** Get from AWS IAM. |
| `AWS_S3_BUCKET` | S3 Storage | **Owner Action:** The name of your S3 bucket. |
| `KAJABI_API_KEY` | Kajabi Integration | **Owner Action:** Get from Kajabi settings. |

### Action Plan for Missing Variables

1.  **Owner:** Steven to retrieve the values for all missing variables from the respective service providers (Google, Microsoft, Bunny.net, AWS, Kajabi).
2.  **Admin:** Add these new variables to both the `rusingacademy-ecosystem-staging` and `rusingacademy-ecosystem` services in Railway under the **Variables** tab in Railway.
3.  **Redeploy:** After adding the variables, trigger a new deployment for each service to apply the changes.
