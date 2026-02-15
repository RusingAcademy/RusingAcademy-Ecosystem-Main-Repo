# Sprint Y1-W2-S08 — Learner Dashboard Enhancement

## Goal
Wire the learner dashboard to real API data, add "Resume Last Lesson" CTA, study time tracking, and exam countdown — transforming the dashboard from a static mockup into a live, data-driven learning portal.

## Scope

### Backend (New Endpoints)
1. `learner.getDashboardStats` — Aggregated dashboard stats (XP, hours, badges, progress) from real data
2. `learner.getResumePoint` — Last accessed lesson/course for "Resume" CTA
3. `learner.trackStudyTime` — Log study time entries (called on lesson view/exit)
4. `learner.getStudyTimeStats` — Monthly/weekly study time aggregation

### Frontend (Dashboard Fixes)
1. Replace all hardcoded stats with real API data
2. Wire SLE levels from learner profile
3. Wire streak count from gamification API
4. Add "Resume Last Lesson" CTA in hero section
5. Add exam countdown from profile data
6. Add notification/announcement banner component
7. Improve loading states and empty states

## Risks
- Study time tracking requires new DB table — minimal migration
- Resume point requires tracking last accessed lesson — may need new column

## Success Metrics
- Zero hardcoded values in dashboard
- Resume CTA links to actual last lesson
- Study time displays real accumulated hours
- Exam countdown pulls from learner profile
- All existing functionality preserved (zero regression)
