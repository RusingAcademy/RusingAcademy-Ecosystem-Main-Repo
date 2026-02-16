# AUDIO_RESTORE_REPORT.md

## TTS Audio Asset Audit — RusingAcademy Ecosystem

**Date:** 2026-02-14  
**Auditor:** Lead Release Engineer  
**Status:** 🔴 ALL 31 PRONUNCIATION FILES MISSING — Generation Blocked (MiniMax credits exhausted)

---

## Executive Summary

The `shared/audioContent.ts` manifest defines **31 French pronunciation audio phrases** mapped to local file paths under `/audio/pronunciation/`. **Zero (0) of these files exist** in the repository or on disk. The `todo.md` references "38 missing TTS audio files" — the discrepancy (38 vs 31) likely accounts for additional lesson-specific oral practice audio (Slot 5) stored in the database `activities.audioUrl` column, not in the static manifest.

The root cause is **MiniMax API credit exhaustion** during a prior sprint, which blocked generation before any files were created.

---

## Inventory: 31 Static Pronunciation Audio Files

### By SLE Level

| Level | Count | Description |
|-------|-------|-------------|
| A (Basic) | 8 | Introductions, greetings, simple requests |
| B (Intermediate) | 9 | Meetings, opinions, recommendations |
| C (Advanced) | 14 | Strategy, policy, regulatory, analysis |
| **Total** | **31** | |

### By Category

| Category | Count |
|----------|-------|
| Presentation | 7 |
| Meeting | 7 |
| Negotiation | 5 |
| Technical | 5 |
| Introduction | 4 |
| General | 4 |

### By Voice Assignment

| MiniMax Voice ID | Label | Count |
|------------------|-------|-------|
| `French_Male_Speech_New` | Male Speech | 10 |
| `French_Female_News Anchor` | Female News Anchor | 8 |
| `French_FemaleAnchor` | Female Anchor | 7 |
| `French_Female_Speech_New` | Female Speech | 6 |

---

## Complete File Manifest

| # | ID | Level | Category | Voice | Expected Path | Status |
|---|---|---|---|---|---|---|
| 1 | intro_federal_employee | A | introduction | MALE_SPEECH | /audio/pronunciation/intro_federal_employee.mp3 | ❌ Missing |
| 2 | project_presentation | A | presentation | FEMALE_NEWS_ANCHOR | /audio/pronunciation/project_presentation.mp3 | ❌ Missing |
| 3 | asking_details | A | meeting | MALE_SPEECH | /audio/pronunciation/asking_details.mp3 | ❌ Missing |
| 4 | meeting_proposal | B | meeting | FEMALE_ANCHOR | /audio/pronunciation/meeting_proposal.mp3 | ❌ Missing |
| 5 | collaboration_thanks | B | general | MALE_SPEECH | /audio/pronunciation/collaboration_thanks.mp3 | ❌ Missing |
| 6 | budget_constraints | B | negotiation | FEMALE_NEWS_ANCHOR | /audio/pronunciation/budget_constraints.mp3 | ❌ Missing |
| 7 | recommendation_approach | B | presentation | MALE_SPEECH | /audio/pronunciation/recommendation_approach.mp3 | ❌ Missing |
| 8 | strategic_implications | C | technical | FEMALE_ANCHOR | /audio/pronunciation/strategic_implications.mp3 | ❌ Missing |
| 9 | policy_coordination | C | technical | FEMALE_SPEECH | /audio/pronunciation/policy_coordination.mp3 | ❌ Missing |
| 10 | study_results | C | presentation | MALE_SPEECH | /audio/pronunciation/study_results.mp3 | ❌ Missing |
| 11 | postpone_decision | C | negotiation | FEMALE_NEWS_ANCHOR | /audio/pronunciation/postpone_decision.mp3 | ❌ Missing |
| 12 | alternative_solutions | C | negotiation | FEMALE_ANCHOR | /audio/pronunciation/alternative_solutions.mp3 | ❌ Missing |
| 13 | performance_indicators | C | technical | MALE_SPEECH | /audio/pronunciation/performance_indicators.mp3 | ❌ Missing |
| 14 | regulatory_framework | C | technical | FEMALE_SPEECH | /audio/pronunciation/regulatory_framework.mp3 | ❌ Missing |
| 15 | transmit_info | C | general | FEMALE_NEWS_ANCHOR | /audio/pronunciation/transmit_info.mp3 | ❌ Missing |
| 16 | continuous_improvement | C | presentation | FEMALE_ANCHOR | /audio/pronunciation/continuous_improvement.mp3 | ❌ Missing |
| 17 | greeting_formal | A | introduction | MALE_SPEECH | /audio/pronunciation/greeting_formal.mp3 | ❌ Missing |
| 18 | request_help | A | introduction | FEMALE_NEWS_ANCHOR | /audio/pronunciation/request_help.mp3 | ❌ Missing |
| 19 | hr_intro | A | introduction | FEMALE_ANCHOR | /audio/pronunciation/hr_intro.mp3 | ❌ Missing |
| 20 | meeting_schedule | A | meeting | FEMALE_SPEECH | /audio/pronunciation/meeting_schedule.mp3 | ❌ Missing |
| 21 | phone_request | A | meeting | MALE_SPEECH | /audio/pronunciation/phone_request.mp3 | ❌ Missing |
| 22 | opinion_advantages | B | presentation | FEMALE_NEWS_ANCHOR | /audio/pronunciation/opinion_advantages.mp3 | ❌ Missing |
| 23 | examine_options | B | meeting | FEMALE_ANCHOR | /audio/pronunciation/examine_options.mp3 | ❌ Missing |
| 24 | report_deadline | B | presentation | MALE_SPEECH | /audio/pronunciation/report_deadline.mp3 | ❌ Missing |
| 25 | agree_modifications | B | negotiation | FEMALE_SPEECH | /audio/pronunciation/agree_modifications.mp3 | ❌ Missing |
| 26 | clarify_expectations | B | meeting | FEMALE_NEWS_ANCHOR | /audio/pronunciation/clarify_expectations.mp3 | ❌ Missing |
| 27 | digital_transformation | C | technical | MALE_SPEECH | /audio/pronunciation/digital_transformation.mp3 | ❌ Missing |
| 28 | risk_analysis | C | negotiation | FEMALE_ANCHOR | /audio/pronunciation/risk_analysis.mp3 | ❌ Missing |
| 29 | phased_approach | C | presentation | FEMALE_SPEECH | /audio/pronunciation/phased_approach.mp3 | ❌ Missing |
| 30 | stakeholder_consensus | C | general | FEMALE_NEWS_ANCHOR | /audio/pronunciation/stakeholder_consensus.mp3 | ❌ Missing |
| 31 | strategy_recommendation | C | presentation | MALE_SPEECH | /audio/pronunciation/strategy_recommendation.mp3 | ❌ Missing |

---

## Additional Missing Audio (Database-Stored)

Beyond the 31 static pronunciation files, the audit report references **~7 additional oral practice audio files** (Slot 5 activities) that should have `audioUrl` values in the `activities` table. These are lesson-specific TTS files for Path I courses, bringing the total to approximately **38 missing TTS files** as noted in `todo.md`.

These database-stored audio files:
- Are generated via `audio.generateForLesson` or `audio.generatePronunciation` tRPC procedures
- Are stored as remote MiniMax URLs in the `activities.audioUrl` column
- Cannot be audited without a live database connection

---

## Restoration Plan

### Prerequisites
1. **Recharge MiniMax API credits** — Generation is currently blocked
2. **Verify MiniMax API key** is set in Railway environment (`MINIMAX_API_KEY`)

### Step 1: Generate 31 Static Pronunciation Files
```bash
# Create output directory
mkdir -p client/public/audio/pronunciation/

# For each entry in shared/audioContent.ts, call MiniMax T2A v2 API
# using the French text (textFr) and assigned voice
# Save output as MP3 to client/public/audio/pronunciation/{id}.mp3
```

The generation can be automated using the existing `generateAudio()` function in `server/services/minimaxAudioService.ts`:

```typescript
import { generateAudio, FRENCH_VOICES } from "./server/services/minimaxAudioService";
import { PRONUNCIATION_AUDIO } from "./shared/audioContent";

const VOICE_MAP = {
  MALE_SPEECH: "French_Male_Speech_New",
  FEMALE_NEWS_ANCHOR: "French_Female_News Anchor",
  FEMALE_ANCHOR: "French_FemaleAnchor",
  FEMALE_SPEECH: "French_Female_Speech_New",
};

for (const phrase of PRONUNCIATION_AUDIO) {
  await generateAudio({
    text: phrase.textFr,
    voiceId: phrase.voice,
    speed: 1.0,
    languageBoost: "French",
    outputDirectory: "client/public/audio/pronunciation/",
    filename: `${phrase.id}.mp3`,
  });
}
```

### Step 2: Generate ~7 Lesson Oral Practice Audio Files
- Query `activities` table for Slot 5 (oral_practice) entries where `audioUrl IS NULL`
- Generate TTS using the lesson's French content text
- Update `activities.audioUrl` with the generated URL

### Step 3: Verify
- Run quality gate validation on all Path I lessons
- Confirm all 31 static files serve correctly from `/audio/pronunciation/`
- Confirm all Slot 5 activities have valid `audioUrl` values

---

## Estimated Cost

| Item | Count | Est. Characters | MiniMax Credits |
|------|-------|-----------------|-----------------|
| Static pronunciation (31 files) | 31 | ~4,500 chars | ~5 credits |
| Lesson oral practice (~7 files) | 7 | ~1,500 chars | ~2 credits |
| **Total** | **38** | **~6,000 chars** | **~7 credits** |

---

## Blockers

| Blocker | Owner Action Required |
|---------|----------------------|
| MiniMax credits exhausted | Steven must recharge MiniMax account |
| MINIMAX_API_KEY not in sandbox | Available only in Railway environment |
| Database access needed for Slot 5 audit | Requires live TiDB connection |
