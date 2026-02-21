> # RusingAcademy Ecosystem — Beautification QA Checklist

**Version:** 1.0.0
**Date:** February 17, 2026
**Master Plan:** `BEAUTIFICATION_MASTER_PLAN.md`

---

## Instructions

This checklist is to be used to validate the successful implementation of each wave of the Beautification Master Plan. Each PR must pass all **General Checks** and the specific checks for its corresponding wave before it can be merged into `main`.

-   **[ ]** - To Do
-   **[x]** - Passed
-   **[!]** - Failed

---

## General Checks (Apply to ALL Waves)

These checks must be performed for every beautification PR.

| ID | Status | Check | Details |
|---|---|---|---|
| GEN-01 | [ ] | **Build Success:** | The command `pnpm build` completes without any errors or warnings. |
| GEN-02 | [ ] | **No Console Errors:** | The browser developer console shows no errors (4xx, 5xx, React errors) on the 5 key test pages. |
| GEN-03 | [ ] | **Zero Auth Regression:** | All three authentication flows (Email/Password, Google, Microsoft) are fully functional. |
| GEN-04 | [ ] | **No Visual Regressions:** | A visual spot-check of the 5 key pages shows no unintended changes, layout breaks, or style issues. |
| GEN-05 | [ ] | **Staging Deployment:** | The branch is successfully deployed to a Railway staging environment for review. |

**Key Test Pages:**
1.  `/login` (Login Page)
2.  `/` (Public Landing Page)
3.  `/ecosystem-hub` (Learner Dashboard)
4.  `/admin` (Admin Dashboard)
5.  A content-heavy page (e.g., a blog post or course page)

---

## Wave 1: Dark Mode Cleanup & Token Enforcement

| ID | Status | Check | Details |
|---|---|---|---|
| W1-01 | [ ] | **Redundant Classes Removed:** | `grep "dark:text-white dark:text-white"` returns 0 results. |
| W1-02 | [ ] | **Semantic Tokens Used:** | `grep "text-black dark:text-white"` returns 0 results. All instances replaced with `text-foreground`. |
| W1-03 | [ ] | **Duplicate File Deleted:** | The file `EcosystemHub.tsx.tsx` does not exist in the repository. |
| W1-04 | [ ] | **Dark Mode Visuals:** | Dark mode is visually identical to the `main` branch on the 5 key pages (minus any intended fixes). |

---

## Wave 2: Responsive Typography & Spacing

| ID | Status | Check | Details |
|---|---|---|---|
| W2-01 | [ ] | **Responsive Headings:** | Large headings (`text-3xl`+) scale down gracefully on mobile (375px width). No horizontal overflow. |
| W2-02 | [ ] | **Responsive Padding:** | Large vertical padding (`py-16`+) is reduced on mobile. Sections do not feel excessively spaced out. |
| W2-03 | [ ] | **No Layout Shift:** | Resizing the browser window from 1920px to 375px does not cause significant content layout shifts. |

---

## Wave 3: Color Token Migration

| ID | Status | Check | Details |
|---|---|---|---|
| W3-01 | [ ] | **No Hardcoded Brand Colors:** | `grep -i "#0F3D3E\|#C65A1E\|#111827"` returns 0 results outside of `design-system.css`. |
| W3-02 | [ ] | **Color Consistency:** | All buttons, links, and brand elements use the correct `--brand-cta` and `--brand-foundation` tokens. |
| W3-03 | [ ] | **Grays are Semantic:** | `grep "text-gray-"` count is significantly reduced, replaced by semantic tokens like `text-muted-foreground`. |

---

## Wave 4: Accessibility Hardening

| ID | Status | Check | Details |
|---|---|---|---|
| W4-01 | [ ] | **Image Alt Text:** | `grep "<img" | grep -v "alt="` returns 0 results. All images have descriptive `alt` attributes. |
| W4-02 | [ ] | **ARIA Labels:** | All icon-only buttons and interactive elements have an `aria-label`. |
| W4-03 | [ ] | **Skip-to-Content:** | Tabbing on page load reveals a functional "Skip to main content" link. |
| W4-04 | [ ] | **Touch Targets:** | On a mobile view, all buttons and critical links have a minimum size of 44x44px. |
| W4-05 | [ ] | **Lighthouse Score:** | Lighthouse accessibility score is ≥ 90 on the 5 key pages. |

---

## Wave 5: Animation & Micro-interaction Layer

| ID | Status | Check | Details |
|---|---|---|---|
| W5-01 | [ ] | **Reduced Motion:** | With `prefers-reduced-motion: reduce` enabled in OS settings, all non-essential animations are disabled. |
| W5-02 | [ ] | **Performance:** | Animations are smooth (target 60fps) and do not cause jank or high CPU usage. |
| W5-03 | [ ] | **Scroll Animations:** | Scroll-triggered animations on landing pages activate correctly as they enter the viewport. |

---

## Wave 6: Branding Assets & SEO Polish

| ID | Status | Check | Details |
|---|---|---|---|
| W6-01 | [ ] | **Favicon Set:** | The correct RusingAcademy favicon is visible in the browser tab and bookmarks bar. |
| W6-02 | [ ] | **Social Share Preview:** | Pasting a key page URL (e.g., `www.rusing.academy`) into Twitter or LinkedIn shows a properly formatted preview card with title, description, and image. |
| W6-03 | [ ] | **Structured Data:** | Google's Rich Results Test successfully validates the structured data (Organization, Course, etc.) on the relevant pages. |
