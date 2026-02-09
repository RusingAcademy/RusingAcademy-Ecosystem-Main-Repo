/**
 * SLE Session Orchestrator
 * Manages the conversation flow for SLE AI Companion sessions.
 * Selects scenarios, injects context into the AI coach, and handles scoring.
 */

import {
  selectScenario,
  selectQuestions,
  selectListeningAsset,
  getAnswerGuide,
  buildCoachContext,
  getExamComponent,
  type Scenario,
  type Question,
  type ListeningAsset,
} from "./sleDatasetService";
import {
  computeSessionScore,
  detectCommonErrors,
  generateCriterionFeedback,
  type SessionScore,
  type DetectedError,
} from "./sleScoringService";

// ─── Types ───────────────────────────────────────────────────

export type SessionMode = "practice" | "exam_simulation";
export type OLAPart = "I" | "II" | "III" | "IV";

export interface SessionConfig {
  language: "FR" | "EN";
  targetLevel: "A" | "B" | "C";
  mode: SessionMode;
  parts: OLAPart[]; // Which parts to practice (e.g., ["I", "III"] or all 4)
}

export interface SessionState {
  config: SessionConfig;
  currentPartIndex: number;
  currentScenario: Scenario | null;
  currentQuestions: Question[];
  currentListeningAsset: ListeningAsset | null;
  questionIndex: number;
  usedScenarioIds: string[];
  usedQuestionIds: string[];
  turnCount: number;
  errors: DetectedError[];
  startedAt: number;
}

export interface TurnResult {
  coachResponse: string;
  nextQuestion: string | null;
  errorsDetected: DetectedError[];
  partComplete: boolean;
  sessionComplete: boolean;
  feedback?: string;
}

// ─── Session Management ──────────────────────────────────────

/**
 * Initialize a new practice session with the given configuration.
 * Returns the initial state and the system prompt context to inject.
 */
export function initializeSession(config: SessionConfig): {
  state: SessionState;
  systemPromptContext: string;
  openingScenario: Scenario | null;
  openingQuestions: Question[];
  listeningAsset: ListeningAsset | null;
} {
  const state: SessionState = {
    config,
    currentPartIndex: 0,
    currentScenario: null,
    currentQuestions: [],
    currentListeningAsset: null,
    questionIndex: 0,
    usedScenarioIds: [],
    usedQuestionIds: [],
    turnCount: 0,
    errors: [],
    startedAt: Date.now(),
  };

  // Load first part
  const firstPart = config.parts[0];
  const result = loadPartContent(state, firstPart);

  // Build the system prompt context
  const systemPromptContext = buildCoachContext(
    config.language,
    config.targetLevel,
    firstPart
  );

  return {
    state: result.state,
    systemPromptContext,
    openingScenario: result.state.currentScenario,
    openingQuestions: result.state.currentQuestions,
    listeningAsset: result.state.currentListeningAsset,
  };
}

/**
 * Load content for a specific OLA part.
 */
function loadPartContent(
  state: SessionState,
  part: OLAPart
): { state: SessionState } {
  const { language } = state.config;

  // Select a scenario for this part
  const scenario = selectScenario(language, part, state.usedScenarioIds);
  if (scenario) {
    state.usedScenarioIds.push(scenario.id);
  }

  // Select questions for this part
  const questions = selectQuestions(language, part, 5, state.usedQuestionIds);
  state.usedQuestionIds.push(...questions.map((q) => q.id));

  // For Part II, also load a listening asset
  let listeningAsset: ListeningAsset | null = null;
  if (part === "II") {
    listeningAsset = selectListeningAsset(language);
  }

  state.currentScenario = scenario;
  state.currentQuestions = questions;
  state.currentListeningAsset = listeningAsset;
  state.questionIndex = 0;

  return { state };
}

/**
 * Process a learner's turn and return the next action.
 */
export function processTurn(
  state: SessionState,
  userMessage: string
): { state: SessionState; result: TurnResult } {
  state.turnCount++;

  // Detect errors in user message
  const errors = detectCommonErrors(
    userMessage,
    state.config.language,
    3 // max 3 errors per turn to avoid overwhelming
  );
  state.errors.push(...errors);

  // Determine if current part is complete
  const questionsRemaining =
    state.questionIndex < state.currentQuestions.length - 1;
  const hasFollowups =
    state.currentScenario?.followups &&
    state.turnCount <= (state.currentScenario.followups.length + 1);

  let partComplete = false;
  let sessionComplete = false;
  let nextQuestion: string | null = null;
  let feedback: string | undefined;

  if (questionsRemaining) {
    // Move to next question
    state.questionIndex++;
    nextQuestion = state.currentQuestions[state.questionIndex].question_text;
  } else if (hasFollowups && state.currentScenario) {
    // Use scenario followups
    const followupIndex = state.turnCount - state.currentQuestions.length - 1;
    if (followupIndex < state.currentScenario.followups.length) {
      nextQuestion = state.currentScenario.followups[followupIndex];
    } else {
      partComplete = true;
    }
  } else {
    partComplete = true;
  }

  // If part is complete, try to advance to next part
  if (partComplete) {
    if (state.currentPartIndex < state.config.parts.length - 1) {
      state.currentPartIndex++;
      const nextPart = state.config.parts[state.currentPartIndex];
      loadPartContent(state, nextPart);
      nextQuestion = state.currentQuestions[0]?.question_text ?? null;
      partComplete = false; // Reset — we're starting a new part
      state.turnCount = 0;
    } else {
      sessionComplete = true;
    }
  }

  // Generate feedback based on mode
  if (state.config.mode === "practice" && errors.length > 0) {
    // In practice mode, give instant feedback on errors
    feedback = errors
      .map((e) => `⚠ ${e.pattern} → ${e.correction}\n${e.feedback}`)
      .join("\n\n");
  }
  // In exam_simulation mode, no feedback until end

  const result: TurnResult = {
    coachResponse: "", // Will be filled by the AI coach
    nextQuestion,
    errorsDetected: errors,
    partComplete,
    sessionComplete,
    feedback,
  };

  return { state, result };
}

/**
 * Generate the end-of-session report.
 * In practice mode, this is shown after each part.
 * In exam_simulation mode, this is shown only at the end.
 */
export function generateSessionReport(
  state: SessionState,
  criterionScores: Record<string, number>
): SessionScore {
  return computeSessionScore(
    0, // sessionId will be set by the caller
    state.config.language,
    criterionScores,
    state.errors
  );
}

/**
 * Get the current scenario's answer guide for coach reference.
 */
export function getCurrentAnswerGuide(state: SessionState) {
  if (!state.currentScenario) return null;
  return getAnswerGuide(state.currentScenario.id);
}

/**
 * Get the current exam component info.
 */
export function getCurrentExamComponent(state: SessionState) {
  const currentPart = state.config.parts[state.currentPartIndex];
  return getExamComponent(state.config.language, currentPart);
}

/**
 * Build the context injection for the current turn.
 * This is appended to the AI coach's system prompt to provide
 * scenario-specific guidance.
 */
export function buildTurnContext(state: SessionState): string {
  const sections: string[] = [];
  const currentPart = state.config.parts[state.currentPartIndex];

  // Exam component context
  const examComp = getCurrentExamComponent(state);
  if (examComp) {
    sections.push(`[Current Part: ${examComp.name} (Part ${currentPart})]`);
  }

  // Scenario context
  if (state.currentScenario) {
    sections.push(`[Scenario: ${state.currentScenario.context}]`);
    sections.push(`[Instructions: ${state.currentScenario.instructions}]`);
  }

  // Listening asset for Part II
  if (state.currentListeningAsset && currentPart === "II") {
    sections.push(
      `[Listening Asset - Read this to the learner:]`,
      state.currentListeningAsset.transcript,
      `[After reading, ask the learner to summarize the key points]`
    );
  }

  // Answer guide for coach reference
  const guide = getCurrentAnswerGuide(state);
  if (guide) {
    sections.push(
      `[Answer Guide - For your reference only, do NOT read to learner:]`,
      `Expected elements: ${guide.expected_elements.join("; ")}`,
      `Recommended structures: ${guide.recommended_structures.join("; ")}`,
      `Common pitfalls: ${guide.common_pitfalls.join("; ")}`
    );
  }

  // Current question
  if (state.currentQuestions[state.questionIndex]) {
    sections.push(
      `[Current Question: ${state.currentQuestions[state.questionIndex].question_text}]`
    );
  }

  // Mode-specific instructions
  if (state.config.mode === "exam_simulation") {
    sections.push(
      `[MODE: EXAM SIMULATION - Do NOT provide feedback or corrections during the session. Only evaluate at the end.]`
    );
  } else {
    sections.push(
      `[MODE: PRACTICE - Provide gentle corrections and encouragement after each response.]`
    );
  }

  return sections.join("\n");
}
