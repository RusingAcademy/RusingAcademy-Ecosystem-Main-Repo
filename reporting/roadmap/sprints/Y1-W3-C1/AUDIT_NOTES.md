# Sprint C1 — QuizBuilder Audit Notes

## Critical Finding: Router Namespace Mismatch

The QuizBuilder component calls endpoints under `trpc.admin.*`:
- `trpc.admin.getQuizQuestions` (line 413)
- `trpc.admin.createQuizQuestion` (line 416)
- `trpc.admin.updateQuizQuestion` (line 420)
- `trpc.admin.deleteQuizQuestion` (line 424)
- `trpc.admin.exportQuizQuestions` (line 428)
- `trpc.admin.importQuizQuestions` (line 441)

But in Sprint S11, the router was registered as `adminQuiz` (not `admin`):
- `trpc.adminQuiz.getQuizQuestions`
- `trpc.adminQuiz.createQuizQuestion`
- etc.

**Fix needed:** Either:
1. Change QuizBuilder to call `trpc.adminQuiz.*` (preferred — matches router registration)
2. Or re-register the router under `admin` namespace

## QuizBuilder Already Has
- Full CRUD UI (create, update, delete questions)
- Drag-and-drop reordering
- Import/Export (JSON/CSV)
- Bilingual support (EN/FR toggle)
- Difficulty badges
- Points per question
- 6 question types: multiple_choice, true_false, fill_blank, short_answer, matching, audio_response
- Empty state with quick-add buttons
- Stats bar (question count, total points, difficulty breakdown)

## What's Missing
1. Router namespace fix (admin → adminQuiz)
2. Standalone admin page to access QuizBuilder (currently only embedded in CourseBuilder)
3. Analytics view (getQuizAnalytics endpoint exists but no UI)
4. Reorder mutation (handleDragEnd is visual-only, needs to call reorderQuizQuestions)
5. Lesson selector to pick which lesson's quiz to edit
6. Bulk operations (select multiple questions, bulk delete/move)

## Where QuizBuilder Is Used
- Embedded in CourseBuilder (admin course editing flow)
- NOT accessible as standalone admin page
- NOT linked from admin sidebar
