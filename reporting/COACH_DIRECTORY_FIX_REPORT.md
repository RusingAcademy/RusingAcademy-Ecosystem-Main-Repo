# Coach Directory Fix Report

**Date:** February 16, 2026  
**Page:** `/coaches`  
**Symptom:** "No coaches found" — page shows 0 coach profiles  
**Root Cause:** Production database has zero records in `coach_profiles` table  
**Fix Status:** 🔴 BLOCKED — requires `DATABASE_URL` to run seed script

---

## 1. Diagnosis

### 1.1 API Endpoint Verification

```
GET /api/trpc/coach.list → 200 OK
Response: { "result": { "data": { "json": [] } } }
```

The endpoint works correctly — it returns an empty array because there are no records in the database.

### 1.2 Query Logic Analysis

The `getApprovedCoaches()` function in `server/db.ts` (lines 152–225) executes:

```sql
SELECT coach_profiles.*, users.id, users.name, users.email, users.avatarUrl
FROM coach_profiles
INNER JOIN users ON coach_profiles.userId = users.id
WHERE coach_profiles.status = 'approved'
ORDER BY coach_profiles.averageRating DESC
LIMIT 100
```

Then filters in JavaScript for `profileComplete === true` (handles both boolean `true` and integer `1`).

**The query logic is correct.** The problem is purely a data problem — zero rows exist.

### 1.3 Seed Script Analysis

The file `scripts/seed-coaches.mjs` contains 7 coach profiles ready to seed:

| # | Name | Slug | Languages | Hourly Rate | Specializations |
|---|------|------|-----------|-------------|-----------------|
| 1 | Victor Amisi | `victor-amisi` | Both | $60/hr | Oral B/C, Written B |
| 2 | Preciosa Baganha | `preciosa-baganha` | French | $58/hr | Written A/B/C, Reading |
| 3 | Steven Barholere | `steven-barholere` | Both | $75/hr | All specializations |
| 4 | Sue-Anne Richer | `sue-anne-richer` | French | $55/hr | Oral A/B/C, Anxiety |
| 5 | Mamadou Diallo | `mamadou-diallo` | Both | $65/hr | Oral B/C, Written B/C |
| 6 | Isabelle Chen | `isabelle-chen` | English | $52/hr | Reading, Written A/B |
| 7 | Jean-Pierre Ndayisaba | `jean-pierre-ndayisaba` | Both | $70/hr | Oral C, Written C, Anxiety |

The seed script:
1. Creates a `users` record for each coach (with role `'coach'`)
2. Creates a `coach_profiles` record with `status = 'approved'` and `profileComplete = true`
3. Sets all stats (sessions, students, ratings, reviews, success rate)

### 1.4 Why the Seed Script Was Never Run

The seed script requires `DATABASE_URL` as an environment variable. This variable is configured in Railway but has never been shared with the development environment. The script connects directly to MySQL/TiDB and cannot run without database credentials.

---

## 2. Fix Plan

### Phase 1: Immediate — Seed 7 Coaches (requires DATABASE_URL)

```bash
export DATABASE_URL="mysql://..."  # From Railway env vars
node scripts/seed-coaches.mjs
```

**Expected output:**
```
Creating user: Victor Amisi...
  ✓ User created with ID: 1
Creating coach profile: victor-amisi...
  ✓ Coach profile created: victor-amisi
... (×7)
✅ All coaches seeded successfully!
Total coaches added: 7
```

**Verification:**
```bash
curl -s "https://new-rusingacademy-project-production.up.railway.app/api/trpc/coach.list" | python3 -m json.tool
# Should return 7 coaches
```

### Phase 2: Photo Persistence

Current seed uses Unsplash stock photos (e.g., `https://images.unsplash.com/photo-...`). These are:
- ✅ Persistent (Unsplash doesn't delete photos)
- ⚠️ Not professional (stock photos undermine credibility)

**Recommended:** Replace with real coach headshots hosted on:
- Bunny CDN (if configured)
- Cloudflare R2 (via MCP)
- Railway static assets

### Phase 3: Apply → Admin Approve → Auto-Add Pipeline

The pipeline already exists in code:

1. **Apply:** `/become-a-coach` → `coach.submitApplication` mutation → creates record in `coach_applications` table with `status = 'pending'`
2. **Admin Review:** Admin panel → `AdminCoachApplications.tsx` → reviews application
3. **Admin Approve:** Admin clicks "Approve" → updates `coach_applications.status = 'approved'` → creates `coach_profiles` record with `status = 'approved'` and `profileComplete = true`
4. **Auto-Add:** The `coach.list` query automatically picks up any profile with `status = 'approved'` and `profileComplete = true`

**Current status of the pipeline:**
- Step 1 (Apply): ✅ Code exists and is functional
- Step 2 (Admin Review): ✅ Code exists, needs admin user to test
- Step 3 (Admin Approve): ✅ Code exists, approval logic in `server/routers.ts` lines 4503–4519
- Step 4 (Auto-Add): ✅ Code exists and verified (the `getApprovedCoaches` query is correct)

**The pipeline is architecturally complete.** It will work as soon as there is data in the database.

### Phase 4: Observability — Why a Coach Doesn't Appear

The `getApprovedCoaches` function has built-in logging:

```
[DB] getApprovedCoaches called with filters: {}
[DB] Database connection established
[DB] Executing query...
[DB] Query returned X approved coaches
[DB] After profileComplete filter: Y coaches
[DB] Final result count: Z
```

If a coach doesn't appear, check Railway logs for:
- `Query returned 0 approved coaches` → coach `status` is not `'approved'`
- `After profileComplete filter: 0 coaches` → `profileComplete` is not `true`/`1`
- `ERROR in getApprovedCoaches` → database connection issue

**To add explicit observability for a missing coach:**

```sql
-- Check if coach exists at all
SELECT id, userId, slug, status, profileComplete FROM coach_profiles WHERE slug = 'coach-slug';

-- If status != 'approved', the admin hasn't approved them
-- If profileComplete != 1, the profile setup isn't complete
```

---

## 3. Current Blocker

| Blocker | Owner | Action |
|---------|-------|--------|
| `DATABASE_URL` not available in dev environment | Steven | Provide the value from Railway env vars, or grant agent access |

**Once Steven provides the DATABASE_URL, the fix takes approximately 30 seconds to execute and verify.**

---

## 4. Post-Fix Verification Checklist

- [ ] `coach.list` returns 7 coaches
- [ ] `/coaches` page renders all 7 coach cards with photos
- [ ] Each coach profile page (`/coaches/:slug`) loads correctly
- [ ] Filters work (language, specialization, price range)
- [ ] Search works (by name)
- [ ] "Book a Session" button is visible on each profile
- [ ] Coach photos load without 404 errors
- [ ] Mobile responsive layout works for coach cards

---

*Report generated February 16, 2026. Will be updated with screenshots and test results once data seeding is complete.*
