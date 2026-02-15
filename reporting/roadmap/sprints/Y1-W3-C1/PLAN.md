# Sprint Y1-W3-C1 — Admin Quiz Builder UI Integration

## Goal
Make the QuizBuilder fully operational as a standalone admin page, connected to the existing `admin.*` quiz endpoints, with proper navigation, analytics view, drag-and-drop reorder mutation, and a lesson selector — so the content team can create, manage, and import quiz questions without developer intervention.

## Scope
1. Create standalone `QuizManagement` admin page with lesson/course selector
2. Wire drag-and-drop reorder to actual `admin.reorderQuizQuestions` mutation (currently visual-only)
3. Add quiz analytics tab using `adminQuiz.getQuizAnalytics` endpoint
4. Add quiz-management route to admin sidebar and App.tsx
5. Register in AdminControlCenter section map
6. Professional empty states and bilingual labels

## Files to Touch
| File | Change |
|------|--------|
| `client/src/pages/admin/QuizManagement.tsx` | NEW — standalone quiz management page |
| `client/src/components/QuizBuilder.tsx` | Fix reorder mutation, minor polish |
| `client/src/components/AdminLayout.tsx` | Add sidebar nav item |
| `client/src/pages/AdminControlCenter.tsx` | Register section |
| `client/src/App.tsx` | Add route |
| `client/src/pages/admin/index.ts` | Export new page |

## Risks
- Low: QuizBuilder already works with `trpc.admin.*` endpoints (confirmed inline in routers.ts)
- Low: No schema changes needed

## Success Metrics
- Admin can navigate to /admin/quiz-management
- Admin can select a course → module → lesson and see/edit quiz questions
- Drag-and-drop reorder persists to database
- Export/Import works end-to-end
- Analytics tab shows question stats
- Build passes with zero regressions
