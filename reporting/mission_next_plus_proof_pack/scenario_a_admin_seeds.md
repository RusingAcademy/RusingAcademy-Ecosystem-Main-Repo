# Scenario A — Admin Dashboard Seeds Verification

## Method
SQL-level verification via direct database queries (admin dashboard requires authenticated session).

## Results

| ID | Name | Status | Resubmission | Key Data |
|---|---|---|---|---|
| 420251 | Marie-Claire Dubois | submitted | No | 12 yrs exp, $65/hr, Oral B/C specialist |
| 420252 | David Okafor | rejected | No | 5-paragraph rejection with 4 recommendations |
| 420253 | Fatima Al-Hassan | under_review | No | Ph.D. SLA, anxiety coaching specialist |
| 420254 | James Whitfield | approved | No | 15 yrs CSPS, 500+ candidates, 95% success |
| 420255 | Amara Diallo | submitted | Yes (count: 1) | Previous rejection reason documented |

## David Okafor Rejection Feedback (ID 420252)
The `reviewNotes` field contains a structured 5-paragraph rejection with:
1. SLE Experience Insufficient (3 yrs vs. 5 yr minimum)
2. Language Proficiency Levels below threshold (Written A vs. B minimum)
3. Certification Gap (needs Lingueefy SLE Coach Certification)
4. Candidate Success Documentation lacking (needs 50+ documented hours)
5. Four specific Recommendations for Resubmission

## Amara Diallo Resubmission (ID 420255)
- `isResubmission`: true
- `resubmissionCount`: 1
- `previousRejectionReason`: Documents original rejection for insufficient tutoring hours (20 vs. 50 required) and lack of certification. Notes improvement: now 60+ hours and enrolled in certification.

## Verdict: PASS
All 5 applications seeded with correct statuses, realistic bilingual data, and proper rejection/resubmission metadata.
