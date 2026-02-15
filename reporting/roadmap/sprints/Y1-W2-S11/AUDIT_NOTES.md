# Sprint S11 — SLE Exam Simulation & Assessment Engine — Audit Notes

## Existing Infrastructure (Extensive)

### Backend Routers
| Router | Namespace | Endpoints | Status |
|--------|-----------|-----------|--------|
| sleCompanion | `sleCompanion.*` | getCoaches, startSession, sendMessage, uploadAndTranscribeAudio, endSession, getSessionHistory | Registered |
| sleServices | `sleServices.*` | datasetStats, getRubrics, computeScore, detectErrors, initOralSession, processOralTurn, getOralReport, initAdaptiveSession, getNextAdaptiveScenario, endAdaptiveSession, startWrittenExam, submitWrittenExam, getWrittenQuestions | Registered |
| sleProgress | `sleProgress.*` | getSummary, getScoreTrend, getDetailedHistory | Registered |
| sleExam (premium) | `sleExam.*` | startExam, submitExam | Registered |
| adminQuiz | NOT REGISTERED | getQuizQuestions, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion, exportQuizQuestions, importQuizQuestions, getQuizQuestionStats, reorderQuizQuestions, duplicateQuiz, getQuizLessons, getQuizAnalytics | NOT IN appRouter |
| courses.getQuiz | `courses.getQuiz` | Get quiz for a lesson | Registered |
| courses.submitQuiz | `courses.submitQuiz` | Submit quiz answers | Registered |

### Frontend Pages
| Page | Lines | Route | Status |
|------|-------|-------|--------|
| SLEExamSimulation | 1223 | /sle-exam-simulation | Full OLA mock exam (4-part oral) |
| MockSLEExam | 345 | /mock-sle | Reading/Writing/Oral mock with AI generation |
| QuizPage | 347 | /programs/:programId/:pathId/quiz/:quizId | Module quiz (hardcoded questions!) |
| SLEExamMode (admin) | 409 | /admin/sle-exam | Admin SLE exam management |
| AssessmentsAdmin | 107 | /admin/assessments | Admin assessments overview |

### Frontend Components
| Component | Lines | Purpose |
|-----------|-------|---------|
| ExamReadinessMode | 147 | Exam readiness check |
| Quiz | 397 | Generic quiz component |
| DiagnosticQuiz | 268 | Diagnostic placement quiz |
| QuizRenderer | 828 | Full quiz rendering engine |
| QuizBuilder | 682 | Admin quiz builder |
| SLEWrittenExamScreen | 873 | Written exam simulation |

### Database Tables
- `quizzes` — Quiz metadata (lessonId, title, passingScore, timeLimit, etc.)
- `quiz_questions` — Questions (type, prompt, options, correctAnswer, explanation, difficulty)
- `quiz_attempts` — Attempt tracking (score, passed, answers, timeSpent)

## Critical Gaps Identified

### GAP-1: adminQuiz Router NOT Registered
The `adminQuiz` router exists with 11 endpoints but is NOT registered in the appRouter. This means the QuizBuilder component cannot function.

### GAP-2: QuizPage Uses Hardcoded Questions
The QuizPage generates questions from a static array of 10 generic questions, not from the database. This makes quizzes meaningless.

### GAP-3: No mockSle Router
The MockSLEExam page calls `trpc.mockSle.*` but there's no `mockSle` router registered in the appRouter. The page would crash.

### GAP-4: Written Exam Questions Not Seeded
The sleServices.getWrittenQuestions endpoint exists but likely returns empty data without seeded questions.

### GAP-5: No Exam History Dashboard for Learners
The sleProgress router has getSummary, getScoreTrend, getDetailedHistory but there's no dedicated learner-facing exam history page.

## Sprint S11 Focus
1. Register adminQuiz router in appRouter (critical fix)
2. Create mockSle router for MockSLEExam page (critical fix)
3. Wire QuizPage to use database questions via courses.getQuiz
4. Create SLE Exam History dashboard for learners
5. Seed written exam question bank
