# DNS Cutover Plan: Migrating www.rusingacademy.com to Railway

**Objective:** To seamlessly migrate the primary domain `www.rusingacademy.com` from its current hosting (Manus S3) to the new, stable Railway production environment with zero downtime.

**Current State:**
- `www.rusingacademy.com` points to Manus S3.
- `www.rusing.academy` points to the Railway production service.

**Target State:**
- `www.rusingacademy.com` points to the Railway production service.
- `www.rusing.academy` redirects to `www.rusingacademy.com`.

## Pre-Cutover Checklist

- [ ] **Full Staging Validation:** The `integration/railway-prod-migration` branch has been deployed to staging and has passed all tests in `QA_CHECKLIST.md`.
- [ ] **Production Merge:** The PR for `integration/railway-prod-migration` has been merged into the `main` branch.
- [ ] **Production Deployment:** The `main` branch has successfully deployed to the Railway production service (`rusingacademy-ecosystem`).
- [ ] **Final Production Smoke Test:** A final smoke test has been performed on `www.rusing.academy` to confirm the new code is live and stable.

## Cutover Procedure (Execution by Steven)

This procedure should be executed within your domain registrar's DNS management panel (e.g., GoDaddy, Namecheap, Cloudflare).

### Step 1: Add `www.rusingacademy.com` to Railway

1.  Navigate to the **happy-enjoyment** project in Railway.
2.  Select the **rusingacademy-ecosystem** (production) service.
3.  Go to the **Settings** tab.
4.  Under **Public Networking**, click **Custom Domain**.
5.  Enter `www.rusingacademy.com` and click **Add Domain**.
6.  Railway will provide you with a CNAME record value (e.g., `friendly-random-name.up.railway.app`). **Copy this value.**

### Step 2: Update DNS Records

1.  Log in to your domain registrar.
2.  Navigate to the DNS settings for `rusingacademy.com`.
3.  Find the CNAME record for `www`.
4.  **Edit** the existing CNAME record:
    - **Host/Name:** `www`
    - **Value/Points to:** Paste the CNAME value you copied from Railway.
    - **TTL:** Set to the lowest possible value (e.g., 60 seconds or 1 minute) to speed up propagation.
5.  **Save** the changes.

### Step 3: Set Up Redirect for `rusing.academy`

1.  In your domain registrar, find the DNS settings for `rusing.academy`.
2.  Set up a **301 Permanent Redirect**:
    - **Source:** `rusing.academy` and `www.rusing.academy`
    - **Destination:** `https://www.rusingacademy.com`

## Post-Cutover Validation

- **Clear Browser Cache:** Clear your browser cache and cookies.
- **Verify `www.rusingacademy.com`:** Access `https://www.rusingacademy.com`. It should now load the site from Railway.
- **Verify Redirect:** Access `http://www.rusing.academy`. It should automatically redirect to `https://www.rusingacademy.com`.
- **Monitor:** Keep an eye on the site for any unexpected issues.

## Rollback Plan

In the unlikely event of a critical issue, the rollback procedure is to simply revert the CNAME record for `www.rusingacademy.com` back to its original Manus S3 value.
