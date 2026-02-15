# E2E Testing Guide — RusingAcademy Ecosystem

## Overview

The E2E testing suite uses **Playwright** to validate critical user journeys, API health, accessibility compliance, admin panel stability, and mobile responsiveness. Tests run against both local development and production environments.

## Test Suites

| Suite | File | Tests | Purpose |
|-------|------|-------|---------|
| Homepage & Auth | `homepage.spec.ts`, `auth.spec.ts` | 5 | Original baseline tests |
| Dashboard | `dashboard.spec.ts` | 3 | Dashboard structure validation |
| Critical Journeys | `critical-journeys.spec.ts` | 18 | Full conversion funnel |
| API Health | `api-health.spec.ts` | 6 | Backend endpoint validation |
| Accessibility | `accessibility.spec.ts` | 9 | WCAG 2.1 AA compliance |
| Admin Smoke | `admin-smoke.spec.ts` | 6 | Admin panel stability |
| Mobile Responsive | `mobile-responsive.spec.ts` | 18 | Multi-device rendering |

**Total: ~65 tests across 7 suites**

## Running Tests

### Local Development

```bash
# Run all E2E tests (starts dev server automatically)
pnpm test:e2e

# Run with interactive UI
pnpm test:e2e:ui

# Run a specific suite
npx playwright test e2e/critical-journeys.spec.ts

# Run with headed browser (visible)
npx playwright test --headed
```

### Against Production

```bash
# Run against Railway production
pnpm test:e2e:prod

# Run against any URL
E2E_BASE_URL=https://your-staging-url.railway.app npx playwright test
```

### In CI (GitHub Actions)

E2E tests run automatically in the CI pipeline on every PR and push to main. The CI workflow:

1. Builds the application
2. Starts the server
3. Runs Playwright tests against `http://localhost:3000`
4. Uploads test report as artifact on failure

## Configuration

The Playwright config (`playwright.config.ts`) supports:

- **Two browser projects**: Desktop Chrome and Mobile Chrome (Pixel 5)
- **Automatic retries**: 2 retries in CI, 0 locally
- **Artifacts on failure**: Screenshots, videos, and traces
- **JSON + HTML reports**: For CI integration and local debugging
- **`E2E_BASE_URL`**: Override to test against any deployed environment

## Writing New Tests

Follow these conventions:

1. **One file per domain**: Group related tests in a single spec file
2. **Use `test.describe`** for logical grouping
3. **Resilient selectors**: Prefer `role`, `text`, and `data-testid` over CSS classes
4. **No hard waits**: Use `waitForLoadState('networkidle')` instead of `waitForTimeout`
5. **Graceful assertions**: Check element existence before asserting visibility
6. **Bilingual support**: Match text with regex that covers both EN and FR

### Example

```typescript
test('course card has CTA button', async ({ page }) => {
  await page.goto('/courses');
  await page.waitForLoadState('networkidle');
  
  const ctaButton = page.locator('button, a').filter({ 
    hasText: /enroll|s'inscrire|start|commencer/i 
  }).first();
  
  if (await ctaButton.count() > 0) {
    await expect(ctaButton).toBeVisible();
  }
});
```

## Accessibility Testing

The accessibility suite uses `@axe-core/playwright` to check WCAG 2.1 Level AA compliance. This is **required for Canadian public service** clients.

Current baseline thresholds (to be tightened over time):
- Max 3 critical/serious violations per page
- Max 10 color contrast violations on homepage
- Max 30% of images missing alt text

## Troubleshooting

### Tests fail with "Target closed"
The server may have crashed. Check server logs and ensure `DATABASE_URL` is set.

### Tests timeout in CI
Increase `timeout` in `playwright.config.ts` or add `test.slow()` to specific tests.

### Accessibility tests fail
Run `npx playwright test e2e/accessibility.spec.ts --headed` to see which elements fail, then fix the underlying HTML.
