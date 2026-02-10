/**
 * SLE Scoring Service
 * Implements the grading logic for the SLE AI Companion.
 * Uses the dataset's rubrics and grading rules to compute scores.
 */

import {
  computeCompositeScore,
  getRubrics,
  getFeedbackTemplates,
  getCommonErrors,
  type Rubric,
  type FeedbackTemplate,
  type CommonError,
} from "./sleDatasetService";

// ─── Types ───────────────────────────────────────────────────

export interface CriterionScore {
  criterion: string;
  score: number; // 0-100
  level: string; // A, B, C
  feedback: string;
}

export interface SessionScore {
  sessionId: number;
  overallScore: number;
  level: string;
  criterionScores: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  errorsDetected: DetectedError[];
}

export interface DetectedError {
  errorId: string;
  pattern: string;
  correction: string;
  feedback: string;
  category: string;
}

// ─── Score Computation ───────────────────────────────────────

/**
 * Determine the level for a single criterion score.
 */
function scoreToCriterionLevel(score: number): string {
  if (score >= 75) return "C";
  if (score >= 55) return "B";
  if (score >= 36) return "A";
  return "X";
}

/**
 * Compute the full session score from individual criterion scores.
 */
export function computeSessionScore(
  sessionId: number,
  language: "FR" | "EN",
  criterionScores: Record<string, number>,
  detectedErrors: DetectedError[] = []
): SessionScore {
  // Compute composite
  const { overallScore, level } = computeCompositeScore(criterionScores);

  // Build per-criterion detail
  const criterionDetails: CriterionScore[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  for (const [criterion, score] of Object.entries(criterionScores)) {
    const critLevel = scoreToCriterionLevel(score);
    const rubrics = getRubrics(language, critLevel as "A" | "B" | "C");
    const rubric = rubrics.find((r) => r.criterion === criterion);

    criterionDetails.push({
      criterion,
      score,
      level: critLevel,
      feedback: rubric?.descriptor ?? "",
    });

    if (score >= 75) {
      strengths.push(criterion);
    } else if (score < 55) {
      weaknesses.push(criterion);
    }
  }

  // Generate recommendations based on weaknesses
  for (const weakness of weaknesses) {
    const templates = getFeedbackTemplates(language, "drill_suggestion", weakness);
    if (templates.length > 0) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      recommendations.push(template.template_text);
    }
  }

  // If no specific recommendations, add a general one
  if (recommendations.length === 0 && level !== "C") {
    const generalTemplates = getFeedbackTemplates(language, "encouragement");
    if (generalTemplates.length > 0) {
      const template = generalTemplates[Math.floor(Math.random() * generalTemplates.length)];
      recommendations.push(template.template_text);
    }
  }

  return {
    sessionId,
    overallScore,
    level,
    criterionScores: criterionDetails,
    strengths,
    weaknesses,
    recommendations,
    errorsDetected: detectedErrors,
  };
}

/**
 * Check user text against common errors database.
 * Returns matching errors found in the text.
 */
export function detectCommonErrors(
  userText: string,
  language: "FR" | "EN",
  maxErrors: number = 5
): DetectedError[] {
  const allErrors = getCommonErrors(language);
  const detected: DetectedError[] = [];
  const lowerText = userText.toLowerCase();

  for (const error of allErrors) {
    if (detected.length >= maxErrors) break;

    // Simple pattern matching — check if the error pattern appears in user text
    const patternLower = error.pattern.toLowerCase();
    if (lowerText.includes(patternLower)) {
      detected.push({
        errorId: error.id,
        pattern: error.pattern,
        correction: error.correction,
        feedback: error.feedback_text,
        category: error.category,
      });
    }
  }

  return detected;
}

/**
 * Generate a feedback message for a specific criterion and score.
 */
export function generateCriterionFeedback(
  language: "FR" | "EN",
  criterion: string,
  score: number,
  type: "instant_correction" | "end_of_turn" | "session_summary" = "end_of_turn"
): string {
  const level = scoreToCriterionLevel(score);
  const templates = getFeedbackTemplates(language, type, criterion);

  if (templates.length === 0) {
    // Fallback to general templates
    const generalTemplates = getFeedbackTemplates(language, type, "general");
    if (generalTemplates.length > 0) {
      return generalTemplates[Math.floor(Math.random() * generalTemplates.length)].template_text;
    }
    return "";
  }

  // Pick a template matching the level context
  const levelMatched = templates.filter(
    (t) => t.level_context === level || t.level_context === "all"
  );
  const pool = levelMatched.length > 0 ? levelMatched : templates;
  return pool[Math.floor(Math.random() * pool.length)].template_text;
}

/**
 * Compute rolling average score across multiple sessions.
 * Used for sustained performance tracking.
 */
export function computeRollingAverage(
  sessionScores: number[],
  windowSize: number = 5
): number {
  if (sessionScores.length === 0) return 0;
  const window = sessionScores.slice(-windowSize);
  return Math.round(window.reduce((a, b) => a + b, 0) / window.length);
}

/**
 * Determine if a learner has sustained a level across recent sessions.
 * Returns true if 70%+ of the last N sessions are at or above the given level.
 */
export function hasSustainedLevel(
  recentScores: number[],
  targetLevel: "A" | "B" | "C",
  windowSize: number = 5,
  threshold: number = 0.7
): boolean {
  const thresholds: Record<string, number> = { A: 36, B: 55, C: 75 };
  const minScore = thresholds[targetLevel] ?? 0;

  const window = recentScores.slice(-windowSize);
  if (window.length === 0) return false;

  const atLevel = window.filter((s) => s >= minScore).length;
  return atLevel / window.length >= threshold;
}
