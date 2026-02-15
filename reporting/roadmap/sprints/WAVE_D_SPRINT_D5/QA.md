# Sprint D5 — QA Checklist

## Build Verification

| Check | Status | Notes |
|-------|--------|-------|
| `npx vite build` passes | PASS | 55.07s, zero errors |
| No TypeScript errors | PASS | All lazy imports resolve |
| Main index chunk < 1MB | PASS | 856 KB (was 8,400 KB) |
| Vendor chunks created | PASS | 5 vendor chunks |
| Total chunk count | PASS | 742 JS files |

## Route Regression Testing

All routes preserved from the original App.tsx. The following critical routes should be smoke-tested after deployment:

| Route | Expected Behavior |
|-------|-------------------|
| `/` | Hub page loads with loading skeleton |
| `/lingueefy` | Home page loads |
| `/courses` | CoursesPage loads |
| `/login` | Login page loads |
| `/dashboard` | DashboardRouter redirects by role |
| `/admin` | AdminControlCenter loads |
| `/hr/portal` | HR Dashboard loads |
| `/coach/portal` | Coach Dashboard loads |
| `/sle-practice` | SLE Practice loads |
| `/accounting` | Accounting invoices loads |

## Performance Testing

After deployment, verify using Chrome DevTools:
1. Open Network tab, clear cache, reload `/`
2. Initial JS transfer should be < 600 KB (gzip)
3. Subsequent page navigations should trigger lazy chunk downloads
4. Vendor chunks should show `(from disk cache)` on repeat visits

## Blockers

None. This is a pure frontend optimization with zero backend dependencies.
