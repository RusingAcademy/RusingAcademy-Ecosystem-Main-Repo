/**
 * QuizRenderer — Premium Interactive Quiz Experience
 * 
 * Parses quiz JSON from activity content and renders an interactive
 * one-question-at-a-time quiz with:
 * - Multiple choice with selectable option cards
 * - Fill-in-the-blank with text input
 * - Immediate feedback with correct/incorrect indicators
 * - Progress bar and score tracking
 * - Glassmorphism accents and micro-animations
 * - Bilingual EN/FR support
 */
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Trophy, RotateCcw, Sparkles, HelpCircle, Target,
  ArrowRight, Lightbulb, Star, Award,
} from "lucide-react";

// ─── Types ───
interface QuizQuestion {
  id: number;
  type: "multiple-choice" | "fill-in-the-blank";
  question: string;
  options?: string[];
  answer: string;
  feedback: string;
}

interface QuizData {
  questions: QuizQuestion[];
  introText?: string;
}

// ─── Parse quiz JSON from content ───
export function parseQuizFromContent(content: string): QuizData | null {
  try {
    // Try to find JSON block in the content
    const idx = content.indexOf('{');
    if (idx === -1) return null;

    // Find matching closing brace
    let depth = 0;
    let endIdx = -1;
    for (let i = idx; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') depth--;
      if (depth === 0) { endIdx = i; break; }
    }
    if (endIdx === -1) return null;

    const jsonStr = content.substring(idx, endIdx + 1);
    const parsed = JSON.parse(jsonStr);

    if (!parsed.questions || !Array.isArray(parsed.questions)) return null;

    // Extract intro text (everything before the JSON block)
    const introText = content.substring(0, idx).replace(/```json\s*$/, '').trim();

    return {
      questions: parsed.questions,
      introText: introText || undefined,
    };
  } catch {
    return null;
  }
}

// ─── Component Props ───
interface QuizRendererProps {
  content: string;
  language?: string;
  onComplete?: () => void;
}

// ─── Main Component ───
export default function QuizRenderer({ content, language = "en", onComplete }: QuizRendererProps) {
  const isEn = language === "en";
  const quizData = useMemo(() => parseQuizFromContent(content), [content]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [fillInput, setFillInput] = useState("");
  const [showResults, setShowResults] = useState(false);

  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">{isEn ? "Quiz data could not be loaded." : "Les données du quiz n'ont pas pu être chargées."}</p>
      </div>
    );
  }

  const questions = quizData.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isAnswered = revealed[currentQuestion.id];
  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer?.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.entries(answers).filter(([id, ans]) => {
    const q = questions.find(q => q.id === Number(id));
    return q && ans.toLowerCase().trim() === q.answer.toLowerCase().trim();
  }).length;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    setRevealed(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleFillSubmit = () => {
    if (!fillInput.trim() || isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: fillInput.trim() }));
    setRevealed(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setFillInput(answers[questions[currentIndex + 1]?.id] || "");
    } else {
      setShowResults(true);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setFillInput(answers[questions[currentIndex - 1]?.id] || "");
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFillInput("");
    setShowResults(false);
  };

  // ─── Results Screen ───
  if (showResults) {
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Score Card */}
        <div className={`
          relative overflow-hidden rounded-2xl p-8 text-center
          ${passed 
            ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/20' 
            : 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20'
          }
        `}>
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-xl" />

          <div className="relative z-10">
            <div className={`
              w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center
              ${passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'}
            `}>
              {passed ? (
                <Trophy className="h-10 w-10 text-emerald-500" />
              ) : (
                <Target className="h-10 w-10 text-amber-500" />
              )}
            </div>

            <h3 className="text-2xl font-bold mb-1">
              {passed 
                ? (isEn ? "Excellent Work!" : "Excellent travail !") 
                : (isEn ? "Keep Practicing!" : "Continuez à pratiquer !")}
            </h3>

            <div className="text-4xl font-black my-3" style={{ color: passed ? '#10b981' : '#f59e0b' }}>
              {score}%
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {isEn 
                ? `You answered ${correctCount} out of ${totalQuestions} questions correctly.`
                : `Vous avez répondu correctement à ${correctCount} questions sur ${totalQuestions}.`}
            </p>

            <div className="flex items-center justify-center gap-1.5 mb-6">
              {questions.map((q, i) => {
                const ans = answers[q.id];
                const correct = ans?.toLowerCase().trim() === q.answer.toLowerCase().trim();
                return (
                  <div
                    key={q.id}
                    className={`w-3 h-3 rounded-full transition-all ${
                      revealed[q.id]
                        ? correct ? 'bg-emerald-500' : 'bg-red-400'
                        : 'bg-muted'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={resetQuiz} className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                {isEn ? "Try Again" : "Réessayer"}
              </Button>
              {passed && onComplete && (
                <Button size="sm" onClick={onComplete} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {isEn ? "Complete & Continue" : "Terminer et continuer"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {isEn ? "Review Answers" : "Révision des réponses"}
          </h4>
          {questions.map((q, i) => {
            const ans = answers[q.id];
            const correct = ans?.toLowerCase().trim() === q.answer.toLowerCase().trim();
            return (
              <button
                key={q.id}
                onClick={() => { setShowResults(false); setCurrentIndex(i); }}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm
                  ${correct ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-400/30 bg-red-400/5'}
                `}
              >
                <div className="flex items-start gap-2">
                  {correct ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Q{i + 1}: {q.question}</p>
                    {!correct && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isEn ? "Correct answer" : "Bonne réponse"}: <span className="font-medium text-emerald-600">{q.answer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ─── Question Screen ───
  return (
    <div className="space-y-5">
      {/* Progress Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {isEn ? `Question ${currentIndex + 1} of ${totalQuestions}` : `Question ${currentIndex + 1} sur ${totalQuestions}`}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {answeredCount}/{totalQuestions} {isEn ? "answered" : "répondu"}
            </span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>
        <Badge variant="outline" className="text-xs px-2 py-0.5 shrink-0">
          <Star className="h-3 w-3 mr-1 text-amber-500" />
          {correctCount}/{answeredCount || 0}
        </Badge>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Question Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              variant="secondary" 
              className="text-[10px] uppercase tracking-wider"
            >
              {currentQuestion.type === "multiple-choice" 
                ? (isEn ? "Multiple Choice" : "Choix multiple")
                : (isEn ? "Fill in the Blank" : "Compléter la phrase")}
            </Badge>
          </div>

          {/* Question Text */}
          <h4 className="text-base font-semibold leading-relaxed mb-4">
            {currentQuestion.question}
          </h4>

          {/* Multiple Choice Options */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
                const showCorrect = isAnswered && isCorrectOption;
                const showWrong = isAnswered && isSelected && !isCorrectOption;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`
                      w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200
                      flex items-center gap-3 group
                      ${!isAnswered 
                        ? 'border-border hover:border-[#0F3D3E]/50 hover:bg-[#0F3D3E]/5 hover:shadow-sm cursor-pointer' 
                        : showCorrect
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : showWrong
                            ? 'border-red-400 bg-red-400/10'
                            : 'border-border/50 opacity-60'
                      }
                    `}
                  >
                    {/* Option Letter */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all
                      ${!isAnswered 
                        ? 'bg-muted text-muted-foreground group-hover:bg-[#0F3D3E] group-hover:text-white' 
                        : showCorrect
                          ? 'bg-emerald-500 text-white'
                          : showWrong
                            ? 'bg-red-400 text-white'
                            : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>

                    {/* Option Text */}
                    <span className="flex-1 text-sm font-medium">{option}</span>

                    {/* Result Icon */}
                    {isAnswered && (
                      <div className="shrink-0">
                        {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                        {showWrong && <XCircle className="h-5 w-5 text-red-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank */}
          {currentQuestion.type === "fill-in-the-blank" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={isAnswered ? (selectedAnswer || "") : fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFillSubmit()}
                  placeholder={isEn ? "Type your answer..." : "Tapez votre réponse..."}
                  disabled={isAnswered}
                  className={`
                    text-base font-medium
                    ${isAnswered 
                      ? isCorrect 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700' 
                        : 'border-red-400 bg-red-400/10 text-red-600'
                      : 'border-border'
                    }
                  `}
                />
                {!isAnswered && (
                  <Button 
                    onClick={handleFillSubmit} 
                    disabled={!fillInput.trim()}
                    className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white shrink-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isAnswered && !isCorrect && (
                <p className="text-sm">
                  <span className="text-muted-foreground">{isEn ? "Correct answer: " : "Bonne réponse : "}</span>
                  <span className="font-semibold text-emerald-600">{currentQuestion.answer}</span>
                </p>
              )}
            </div>
          )}

          {/* Feedback */}
          {isAnswered && currentQuestion.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                mt-4 p-4 rounded-xl flex items-start gap-3
                ${isCorrect 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-amber-500/10 border border-amber-500/20'
                }
              `}
            >
              <Lightbulb className={`h-5 w-5 shrink-0 mt-0.5 ${isCorrect ? 'text-emerald-500' : 'text-amber-500'}`} />
              <p className="text-sm leading-relaxed">{currentQuestion.feedback}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {isEn ? "Previous" : "Précédent"}
        </Button>

        {/* Question Dots */}
        <div className="flex items-center gap-1">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            const correct = revealed[q.id] && ans?.toLowerCase().trim() === q.answer.toLowerCase().trim();
            const wrong = revealed[q.id] && !correct;
            return (
              <button
                key={q.id}
                onClick={() => { setCurrentIndex(i); setFillInput(answers[q.id] || ""); }}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-200
                  ${i === currentIndex ? 'w-5 bg-[#0F3D3E]' : ''}
                  ${correct ? 'bg-emerald-500' : ''}
                  ${wrong ? 'bg-red-400' : ''}
                  ${!revealed[q.id] && i !== currentIndex ? 'bg-border hover:bg-muted-foreground' : ''}
                `}
                aria-label={`Question ${i + 1}`}
              />
            );
          })}
        </div>

        <Button
          size="sm"
          onClick={goNext}
          disabled={!isAnswered}
          className="gap-1 bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white"
        >
          {currentIndex === totalQuestions - 1 
            ? (isEn ? "See Results" : "Voir les résultats")
            : (isEn ? "Next" : "Suivant")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
