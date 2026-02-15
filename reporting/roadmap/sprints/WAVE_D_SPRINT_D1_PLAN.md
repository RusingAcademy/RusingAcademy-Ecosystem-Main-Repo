# Wave D Sprint D1: Learner Onboarding Wizard Enhancement

## Objective
Transform the existing OnboardingWizard (264 lines, English-only, no diagnostic) into a fully bilingual, government-ready guided setup with SLE diagnostic mini-quiz, department selection, and personalized path recommendation.

## Scope
1. Full bilingual support (EN/FR) for all wizard steps, labels, descriptions
2. Add SLE diagnostic mini-quiz step (5 quick questions → estimated level)
3. Add department/position selection step (federal context)
4. Add target language selection (French/English)
5. Add a learner-facing `onboarding.save` endpoint that upserts learner_profiles
6. Personalized completion screen with recommended learning path
7. Progress persistence (save partial progress)

## Risks
- The `onboarding.save` mutation doesn't exist yet (the onboarding router is admin-only)
- Need to add a learner-facing save endpoint without breaking admin onboarding config

## Success Criteria
- Build passes with zero errors
- All wizard text bilingual (EN/FR)
- Diagnostic quiz provides estimated SLE level
- Profile data persists to learner_profiles table
- Completion screen shows personalized recommendation
