# Sprint H1: Learner Profile & Onboarding Enhancement

## Objective
Transform the MyProfile page from a hardcoded UI shell into a fully functional, database-driven profile management page, and wire the onboarding flow to the learner router.

## Scope
- **Backend**: Add `saveOnboarding`, `getOnboardingStatus`, and `updateProfile` endpoints to the inline `learnerRouter` in `routers.ts`
- **Frontend**: Rewrite `MyProfile.tsx` with real tRPC queries/mutations, bilingual support (EN/FR), edit/view toggle, SLE level selectors, and WCAG 2.1 AA accessibility
- **Integration**: Wire the OnboardingWizard's `saveOnboarding` call to the newly registered endpoint

## Key Decisions
- Added endpoints directly to the inline `learnerRouter` (not the separate `learnerProfile.ts` file) because the frontend calls `trpc.learner.*`
- The `updateProfile` mutation updates both the `users` table (name, preferredLanguage) and the `learnerProfiles` table (all SLE/learning fields)
- SLE levels are stored as JSON objects `{ reading, writing, oral }` matching the existing schema pattern

## Done Criteria
- [ ] MyProfile loads real user data from the database
- [ ] Edit mode allows updating all profile fields
- [ ] Save persists changes to both `users` and `learnerProfiles` tables
- [ ] OnboardingWizard's `saveOnboarding` call has a matching backend endpoint
- [ ] Full bilingual support (EN/FR)
- [ ] WCAG 2.1 AA accessibility (ARIA labels, keyboard navigation)
