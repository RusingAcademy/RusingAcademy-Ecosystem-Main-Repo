# Sprint Y1-W1-S01 — Deep Research: CI/CD Pipeline Implementation

## Doctoral-Level Research Summary

### Benchmark: Modern CI/CD for Node.js LMS/EdTech Monorepos

Based on research across GitHub's official best practices, Railway documentation, and industry standards for EdTech platforms targeting government clients:

### 10-20 Actionable Bullets: What We Apply Here, Now

1. **Three-workflow architecture:** `ci.yml` (lint + test on every PR), `deploy-staging.yml` (auto-deploy to Railway staging on merge to main), `deploy-production.yml` (manual approval gate for production).
2. **pnpm caching:** Use `actions/setup-node@v4` with `cache: 'pnpm'` — reduces install time from ~90s to ~10s.
3. **Concurrency control:** Set `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }` to prevent duplicate runs on rapid pushes.
4. **Vitest with mocked env:** Run `vitest run` with mock DATABASE_URL and service stubs — the 87 env-dependent failures must pass in CI via mocks.
5. **TypeScript check as gate:** Run `tsc --noEmit` as a separate job — currently 247 errors exist; we start with `--skipLibCheck` and progressively tighten.
6. **Build verification:** Run `vite build` in CI to catch import errors before deployment.
7. **Railway auto-deploy on main:** Railway already auto-deploys on push to `main`. CI must pass BEFORE merge (branch protection rule).
8. **Branch protection rules:** Require CI status checks to pass before PR merge. Require at least 1 review (optional for solo dev, but recommended).
9. **Secret management:** Use GitHub repository secrets for RAILWAY_TOKEN. Never expose in logs. Use environment-level secrets for staging vs production.
10. **Artifact upload:** Upload build artifacts for traceability. Upload test results as artifacts for debugging failed runs.
11. **Matrix strategy not needed:** Single Node.js version (22.x), single OS (ubuntu-latest). Keep it simple.
12. **GITHUB_TOKEN permissions:** Set `permissions: contents: read` at workflow level. Only escalate for specific jobs.
13. **Action pinning:** Pin all actions to major version tags (`@v4`) minimum. Prefer SHA pinning for security-critical actions.
14. **Fail-fast on lint:** Run ESLint/Prettier check before tests to catch formatting issues early and save CI minutes.
15. **Health check post-deploy:** After Railway deployment, run a curl health check against the deployed URL to verify the app is responding.
16. **PR comment with status:** Use a GitHub Action to post CI results as a PR comment for visibility.
17. **No Dockerfile needed:** Railway uses Nixpacks for Node.js — no Dockerfile required. Keep the current setup.
18. **Environment protection:** Create `staging` and `production` environments in GitHub with appropriate protection rules.
19. **Gov-ready audit trail:** Every deployment is traceable via PR → CI → Railway deployment ID. This satisfies B2G audit requirements.
20. **Progressive strictness:** Start with lenient TypeScript (current `strict: false`), add a `tsc` warning count baseline, and ratchet down over sprints.

### Railway-Specific Integration Notes

- Railway auto-deploys on push to the connected branch (`main`). No Railway CLI or API call needed in CI.
- For staging previews on PRs, use `ayungavis/railway-preview-deploy` action or Railway's built-in PR preview feature.
- Post-deploy health checks can use the Railway deployment webhook or a simple `curl` in a GitHub Action.
- Railway provides deployment logs via API — can be queried post-deploy for verification.

### Security Considerations for Gov-Ready CI/CD

- All secrets stored in GitHub Secrets (encrypted at rest).
- GITHUB_TOKEN scoped to minimum permissions per job.
- No secrets printed in logs (GitHub auto-masks, but we add explicit guards).
- Dependency scanning via `npm audit` in CI pipeline.
- SAST scanning deferred to Sprint Y1-W1-S05 (separate sprint for test infrastructure).
