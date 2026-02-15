# Sprint Y1-W2-S08 — Learner Dashboard Audit Notes

## Current State (1014 lines)
- Already has: GlassCard, GlassStatCard, SLE Progress, Velocity Widget, Skill Gap Heatmap
- Already has: Continue Learning, Upcoming Sessions, Coaching Plans, Recommended Next Steps, Activity Feed
- Right column: Quick Actions, Recent Practice Sessions, Streak Recovery, Badges, XP Multiplier, Milestones, Certifications, Weekly Challenges, Mini Leaderboard
- Uses hardcoded stats (XP: 1,250, Hours: 12.5h, Badges: 8, Progress: 65%)
- Has bilingual labels (en/fr)
- Uses trpc for: learner.getMyCourses, learner.getUpcomingSessions, learner.getMyCoachingPlans, learner.getProfile, learner.getVelocityData, learner.getCertificationStatus, sleCompanion.getSessionHistory, gamification.getMyStats, gamification.getLeaderboard, gamification.getUserRank, gamification.getStreakDetails

## Key Issues to Fix
1. HARDCODED STATS: XP (1,250), Hours (12.5h), Badges (8), Progress (65%) are all hardcoded — need to pull from gamification/learner APIs
2. HARDCODED STREAK: Badge shows "7 days" hardcoded in hero section
3. HARDCODED SLE LEVELS: "BBB → CBC" and "45 days" are hardcoded in multiple places
4. SKILL GAP DATA: Completely hardcoded mock data for SkillGapHeatmap
5. NO STUDY TIME TRACKING: No actual time tracking endpoint exists
6. MISSING: No "Resume Last Lesson" CTA — the most important learner action
7. MISSING: No notification/announcement area
8. MISSING: No exam countdown that pulls from real profile data

## Enhancement Plan (S08)
1. Wire hardcoded stats to real API data (gamification, learner profile)
2. Add "Resume Last Lesson" hero CTA — highest-impact learner feature
3. Add study time tracking endpoint and display
4. Wire SLE levels from learner profile
5. Add notification/announcement banner for admin broadcasts
6. Add exam countdown from real profile data
7. Improve mobile responsiveness of stats grid
