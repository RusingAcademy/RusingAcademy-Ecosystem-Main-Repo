/**
 * QuizPage — RusingAcademy Learning Portal
 * Summative quiz for module assessment with gamification
 * Design: Premium glassmorphism, teal/gold, step-by-step quiz
 * 
 * Sprint S11: Now fetches questions from database via courses.getQuiz
 * Falls back to generated questions when DB quiz not available
 */
import { useState, useCallback, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { getProgramById, type Program } from "@/data/courseData";
import { useGamification } from "@/contexts/GamificationContext";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Quiz Page", description: "Manage and configure quiz page" },
  fr: { title: "Quiz Page", description: "Gérer et configurer quiz page" },
};

// ─── Fallback Question Generator ─────────────────────────────────────
// Used when no database quiz exists for this lesson/module
function generateQuizQuestions(moduleId: number) {
  const baseQuestions = [
    { q: "Which of the following best demonstrates professional communication?", opts: ["Using slang freely", "Adapting register to context", "Speaking as fast as possible", "Avoiding eye contact"], correct: 1 },
    { q: "In the Canadian public service, bilingualism is important because:", opts: ["It's optional", "It serves citizens in both official languages", "Only for managers", "It's not valued"], correct: 1 },
    { q: "Active listening in a professional context involves:", opts: ["Multitasking during meetings", "Paraphrasing to confirm understanding", "Interrupting with your ideas", "Checking emails"], correct: 1 },
    { q: "When writing a professional email, you should:", opts: ["Use all caps for emphasis", "Include a clear subject line", "Skip the greeting", "Use emojis freely"], correct: 1 },
    { q: "The CEFR framework measures:", opts: ["Intelligence", "Language proficiency levels", "Work experience", "Age"], correct: 1 },
    { q: "A good strategy for vocabulary retention is:", opts: ["Memorizing word lists only", "Using new words in context", "Avoiding practice", "Reading without noting new words"], correct: 1 },
    { q: "In a team meeting, contributing effectively means:", opts: ["Staying silent", "Preparing talking points in advance", "Dominating the conversation", "Arriving late"], correct: 1 },
    { q: "Cultural competence in language learning includes:", opts: ["Ignoring cultural differences", "Understanding workplace norms", "Only focusing on grammar", "Avoiding interaction"], correct: 1 },
    { q: "Self-assessment in language learning helps you:", opts: ["Feel bad about mistakes", "Identify areas for improvement", "Compare yourself to others", "Avoid challenging tasks"], correct: 1 },
    { q: "The best approach to language learning is:", opts: ["Studying grammar only", "Consistent practice with varied activities", "Waiting for perfection before speaking", "Only reading textbooks"], correct: 1 },
  ];
  const shuffled = [...baseQuestions].sort((a, b) => {
    const ha = (moduleId * 7 + baseQuestions.indexOf(a)) % 10;
    const hb = (moduleId * 7 + baseQuestions.indexOf(b)) % 10;
    return ha - hb;
  });
  return shuffled;
}

// ─── Question Type Adapter ───────────────────────────────────────────
interface NormalizedQuestion {
  q: string;
  opts: string[];
  correct: number;
  dbQuestionId?: number;
}

function normalizeDbQuestions(dbQuiz: any): NormalizedQuestion[] {
  if (!dbQuiz?.questions?.length) return [];
  
  return dbQuiz.questions.map((q: any) => {
    // Parse options — could be JSON string or array
    let options: string[] = [];
    if (typeof q.options === "string") {
      try { options = JSON.parse(q.options); } catch { options = [q.options]; }
    } else if (Array.isArray(q.options)) {
      options = q.options;
    }
    
    // For DB questions, correct answer index is not sent to client
    // We'll handle scoring server-side via submitQuiz
    return {
      q: q.questionText || q.prompt || "",
      opts: options,
      correct: -1, // Unknown — scored server-side
      dbQuestionId: q.id,
    };
  });
}

export default function QuizPage() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  const params = useParams<{ programId: string; pathId: string; quizId: string }>();
  const [, navigate] = useLocation();
  const programId = params.programId as Program;
  const pathId = params.pathId || "";
  const quizId = params.quizId || "";
  const program = getProgramById(programId);
  const path = program?.paths.find((p) => p.id === pathId);

  // Extract module ID from quizId (format: "mod-1")
  const moduleId = parseInt(quizId.replace("mod-", ""), 10);
  const currentModule = path?.modules.find((m) => m.id === moduleId);

  const { addXP, passQuiz } = useGamification();
  const quizKey = `${programId}-mod-${moduleId}`;
  const [alreadyPassed] = useState(false);

  // ─── Try to fetch database quiz ────────────────────────────────────
  const dbQuiz = trpc.courses.getQuiz.useQuery(
    { lessonId: moduleId },
    { retry: false, enabled: !!moduleId }
  );
  const submitQuizMut = trpc.courses.submitQuiz.useMutation();

  // Determine question source: DB or fallback
  const isDbQuiz = !!dbQuiz.data?.questions?.length;
  const questions = useMemo(() => {
    if (isDbQuiz) {
      return normalizeDbQuestions(dbQuiz.data);
    }
    return generateQuizQuestions(moduleId);
  }, [isDbQuiz, dbQuiz.data, moduleId]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);
  const [serverScore, setServerScore] = useState<number | null>(null);

  const handleAnswer = useCallback((idx: number) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);

    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setShowFeedback(false);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
        
        if (isDbQuiz && dbQuiz.data) {
          // Submit to server for scoring
          const answerPayload = questions.map((q, i) => ({
            questionId: q.dbQuestionId!,
            answer: q.opts[newAnswers[i]] || "",
          }));
          
          submitQuizMut.mutate(
            { quizId: dbQuiz.data.id, answers: answerPayload },
            {
              onSuccess: (result: any) => {
                const pct = result?.score ?? 0;
                setServerScore(pct);
                if (pct >= (currentModule?.quizPassing || 80)) {
                  passQuiz(quizKey, pct, questions.length, Math.round(pct * questions.length / 100), programId, pathId, undefined, "summative");
                  addXP(200);
                  toast.success("Quiz passed! +200 XP earned!");
                }
              },
              onError: () => {
                // Fallback to client-side scoring
                const score = newAnswers.reduce((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0);
                const pct = Math.round((score / questions.length) * 100);
                setServerScore(pct);
                if (pct >= (currentModule?.quizPassing || 80)) {
                  passQuiz(quizKey, pct, questions.length, score, programId, pathId, undefined, "summative");
                  addXP(200);
                  toast.success("Quiz passed! +200 XP earned!");
                }
              },
            }
          );
        } else {
          // Client-side scoring for fallback questions
          const score = newAnswers.reduce((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0);
          const pct = Math.round((score / questions.length) * 100);
          setServerScore(pct);
          if (pct >= (currentModule?.quizPassing || 80)) {
            passQuiz(quizKey, pct, questions.length, score, programId, pathId, undefined, "summative");
            addXP(200);
            toast.success("Quiz passed! +200 XP earned!");
          }
        }
      }
    }, 1200);
  }, [answers, currentQ, questions, currentModule, quizKey, passQuiz, addXP, isDbQuiz, dbQuiz.data, submitQuizMut, programId, pathId]);

  if (!program || !path || !currentModule) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 md:py-16 lg:py-20">
          <span className="material-icons text-3xl md:text-5xl lg:text-6xl text-gray-300">error_outline</span>
          <p className="text-gray-500 mt-4">Quiz not found.</p>
          <Link href="/programs" className="text-teal-700 text-sm mt-2 inline-block hover:underline">&larr; Back</Link>
        </div>
      </DashboardLayout>
    );
  }

  const passingScore = currentModule.quizPassing || 80;

  // Loading state for DB quiz
  if (dbQuiz.isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-10 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 mt-4">Loading quiz...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Pre-quiz screen
  if (!started) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-10 space-y-6">
          <Link href={`/programs/${programId}/${pathId}`}
            className="text-sm text-gray-500 hover:text-teal-700 flex items-center gap-1">
            <span className="material-icons" >arrow_back</span>
            Back to Path {path.number}
          </Link>

          <div className="rounded-2xl p-8 text-center" style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,128,144,0.1)",
          }}>
            <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{
              background: "linear-gradient(135deg, rgba(0,128,144,0.1), rgba(245,166,35,0.1))",
            }}>
              <span className="material-icons text-xl md:text-3xl lg:text-4xl" style={{ color: "var(--brand-teal, var(--teal))" }}>quiz</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Summative Quiz
            </h1>
            <p className="text-lg text-gray-600 mt-1">Module {currentModule.id}: {currentModule.title}</p>
            <p className="text-sm text-gray-400 mt-1">{currentModule.titleFr}</p>

            {isDbQuiz && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{
                background: "rgba(0,128,144,0.08)", color: "var(--brand-teal, var(--teal))",
              }}>
                <span className="material-icons" >verified</span>
                Official Assessment
              </div>
            )}

            {alreadyPassed && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{
                background: "rgba(245,166,35,0.1)", color: "var(--semantic-warning, var(--warning))",
              }}>
                <span className="material-icons" >check_circle</span>
                <span className="text-sm font-semibold">Already Passed</span>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-700">{questions.length}</div>
                <div className="text-[10px] text-gray-400 uppercase">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">{passingScore}%</div>
                <div className="text-[10px] text-gray-400 uppercase">To Pass</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-500">200</div>
                <div className="text-[10px] text-gray-400 uppercase">XP Reward</div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl text-left" style={{
              background: "rgba(0,128,144,0.04)", border: "1px solid rgba(0,128,144,0.08)",
            }}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-foreground mb-2">Instructions:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• This quiz covers all lessons in Module {currentModule.id}</li>
                <li>• You need {passingScore}% ({Math.ceil(questions.length * passingScore / 100)}/{questions.length}) to pass</li>
                <li>• Each question has one correct answer</li>
                <li>• You can retake the quiz if you don't pass</li>
                <li>• Passing earns you 200 XP and a module badge</li>
              </ul>
            </div>

            <button onClick={() => setStarted(true)}
              className="mt-6 px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--brand-teal, var(--teal)), #00a0b0)" }}>
              <span className="material-icons align-middle mr-1" >play_arrow</span>
              {alreadyPassed ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Results screen
  if (showResult) {
    const clientScore = answers.reduce((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0);
    const pct = serverScore !== null ? serverScore : Math.round((clientScore / questions.length) * 100);
    const passed = pct >= passingScore;

    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-10">
          <div className="rounded-2xl p-8 text-center" style={{
            background: passed
              ? "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(0,128,144,0.04))"
              : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            border: passed ? "1px solid rgba(245,166,35,0.3)" : "1px solid rgba(231,76,60,0.2)",
          }}>
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4" style={{
              background: passed ? "linear-gradient(135deg, var(--semantic-warning, var(--warning)), var(--barholex-gold))" : "rgba(231,76,60,0.1)",
              boxShadow: passed ? "0 8px 32px rgba(245,166,35,0.3)" : "none",
            }}>
              <span className="material-icons text-xl md:text-3xl lg:text-4xl" style={{ color: passed ? "white" : "var(--semantic-danger, var(--danger))" }}>
                {passed ? "emoji_events" : "replay"}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {passed ? "Congratulations!" : "Keep Going!"}
            </h2>
            <p className="text-2xl md:text-4xl lg:text-5xl font-bold mt-3" style={{ color: passed ? "var(--semantic-warning, var(--warning))" : "var(--semantic-danger, var(--danger))" }}>{pct}%</p>
            
            {!isDbQuiz && (
              <p className="text-sm text-gray-500 mt-2">{clientScore}/{questions.length} correct answers</p>
            )}
            {isDbQuiz && submitQuizMut.isPending && (
              <p className="text-sm text-gray-500 mt-2 animate-pulse">Scoring your answers...</p>
            )}

            {passed && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-teal-700">+200 XP earned!</p>
                <p className="text-sm text-amber-500 font-medium flex items-center justify-center gap-1">
                  <span className="material-icons" >workspace_premium</span>
                  Module {currentModule.id} Badge Unlocked!
                </p>
              </div>
            )}

            {!passed && (
              <p className="text-sm text-gray-500 mt-3">
                You need {passingScore}% to pass. Review the module lessons and try again!
              </p>
            )}

            {/* Answer Review — only for fallback questions where we know correct answers */}
            {!isDbQuiz && (
              <div className="mt-6 text-left space-y-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Answer Review:</h4>
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{
                    background: answers[i] === q.correct ? "rgba(0,128,144,0.04)" : "rgba(231,76,60,0.04)",
                  }}>
                    <span className="material-icons flex-shrink-0 mt-0.5" style={{
                      fontSize: "14px",
                      color: answers[i] === q.correct ? "var(--brand-teal, var(--teal))" : "var(--semantic-danger, var(--danger))",
                    }}>
                      {answers[i] === q.correct ? "check_circle" : "cancel"}
                    </span>
                    <div>
                      <p className="font-medium text-gray-700">{q.q}</p>
                      <p className="text-gray-500 mt-0.5">
                        Your answer: {q.opts[answers[i]]}
                        {answers[i] !== q.correct && <span className="text-teal-700 ml-2">Correct: {q.opts[q.correct]}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* For DB quizzes, show a summary without revealing answers */}
            {isDbQuiz && (
              <div className="mt-6 text-left space-y-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Questions Reviewed:</h4>
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/30">
                    <span className="material-icons flex-shrink-0 mt-0.5 text-gray-400" >
                      help_outline
                    </span>
                    <div>
                      <p className="font-medium text-gray-700">{q.q}</p>
                      <p className="text-gray-500 mt-0.5">Your answer: {q.opts[answers[i]] || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href={`/programs/${programId}/${pathId}`}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{
                  borderColor: "rgba(0,128,144,0.2)", color: "var(--brand-teal, var(--teal))",
                }}>
                Back to Path
              </Link>
              {!passed && (
                <button onClick={() => { setCurrentQ(0); setAnswers([]); setShowResult(false); setStarted(true); setServerScore(null); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" >
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Quiz in progress
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Module {currentModule.id}: {currentModule.title}</span>
          <span className="text-sm font-bold text-teal-700">
            {currentQ + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full transition-all duration-500" style={{
              background: i < currentQ
                ? (isDbQuiz ? "var(--brand-teal, var(--teal))" : (answers[i] === questions[i].correct ? "var(--brand-teal, var(--teal))" : "var(--semantic-danger, var(--danger))"))
                : i === currentQ ? "rgba(0,128,144,0.3)" : "rgba(0,128,144,0.06)",
            }} />
          ))}
        </div>

        {/* Question Card */}
        <div className="rounded-2xl p-6" style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,128,144,0.1)",
        }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
              background: "rgba(0,128,144,0.1)", color: "var(--brand-teal, var(--teal))",
            }}>
              Question {currentQ + 1}
            </span>
            {isDbQuiz && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: "rgba(139,92,246,0.1)", color: "var(--color-violet-500, var(--accent-purple))",
              }}>
                Official
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-6">{questions[currentQ].q}</h3>

          <div className="space-y-3">
            {questions[currentQ].opts.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = !isDbQuiz ? idx === questions[currentQ].correct : false;
              const showCorrectness = showFeedback && isSelected && !isDbQuiz;

              return (
                <button key={idx} onClick={() => !showFeedback && handleAnswer(idx)}
                  disabled={showFeedback}
                  className="w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-3"
                  style={{
                    background: showCorrectness
                      ? isCorrect ? "rgba(0,128,144,0.1)" : "rgba(231,76,60,0.08)"
                      : (showFeedback && isSelected && isDbQuiz) ? "rgba(0,128,144,0.08)"
                      : showFeedback && isCorrect ? "rgba(0,128,144,0.06)" : "rgba(255,255,255,0.9)",
                    border: showCorrectness
                      ? isCorrect ? "1px solid var(--brand-teal, var(--teal))" : "1px solid var(--semantic-danger, var(--danger))"
                      : (showFeedback && isSelected && isDbQuiz) ? "1px solid var(--brand-teal, var(--teal))"
                      : showFeedback && isCorrect ? "1px solid rgba(0,128,144,0.3)" : "1px solid rgba(0,128,144,0.08)",
                    transform: isSelected ? "scale(0.99)" : "scale(1)",
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{
                    background: showCorrectness
                      ? isCorrect ? "var(--brand-teal, var(--teal))" : "var(--semantic-danger, var(--danger))"
                      : (showFeedback && isSelected && isDbQuiz) ? "var(--brand-teal, var(--teal))"
                      : "rgba(0,128,144,0.08)",
                    color: (showCorrectness || (showFeedback && isSelected && isDbQuiz)) ? "white" : "var(--brand-teal, var(--teal))",
                  }}>
                    {showCorrectness ? (
                      <span className="material-icons" >{isCorrect ? "check" : "close"}</span>
                    ) : (showFeedback && isSelected && isDbQuiz) ? (
                      <span className="material-icons" >check</span>
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className="text-sm text-gray-900">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
