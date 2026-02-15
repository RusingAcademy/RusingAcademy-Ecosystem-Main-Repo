# Sprint D1 — Learner Onboarding Wizard Enhancement

## Goal
Transform the existing OnboardingWizard from a basic 4-step form into a comprehensive 8-step bilingual onboarding experience with diagnostic assessment, workplace context collection, and personalized learning path recommendations.

## Scope
1. **Backend**: Add `saveOnboarding` and `getOnboardingStatus` endpoints to learnerProfile router
2. **Frontend**: Complete rewrite of OnboardingWizard with 8 steps:
   - Welcome → Context → Current Level → Diagnostic Quiz → Target Level → Goal → Schedule → Complete
3. **Diagnostic Quiz**: 5-question self-assessment that estimates SLE level (X/A/B/C)
4. **Bilingual**: Full EN/FR content for all 8 steps, all options, all diagnostic questions
5. **Personalized Recommendations**: Based on goal + level, recommend specific learning paths

## Success Metrics
- [ ] Build passes with zero errors
- [ ] All 8 steps render correctly in both EN and FR
- [ ] Diagnostic quiz correctly maps scores to SLE levels
- [ ] Profile data persists to learnerProfiles table
- [ ] Personalized recommendation shows on completion step

## Risks
- Schema may not have all fields (mitigated: using existing columns + JSON for levels)
- Diagnostic quiz is self-assessment, not a real SLE test (mitigated: clearly labeled as "estimate")
