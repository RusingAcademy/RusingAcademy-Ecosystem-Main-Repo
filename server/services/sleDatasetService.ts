/**
 * SLE Dataset Service
 * Loads and provides access to the SLE training dataset (data/sle/seed/*.jsonl)
 * Singleton pattern — loads once, serves from memory.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ─── Types ───────────────────────────────────────────────────

export interface ExamComponent {
  id: string;
  part: string;
  language: string;
  name: string;
  duration_min: number;
  duration_max: number;
  objectives: string[];
  description: string;
}

export interface Rubric {
  id: string;
  criterion: string;
  level: string;
  language: string;
  descriptor: string;
  weight: number;
  indicators: string[];
}

export interface GradingLogic {
  id: string;
  rolling_window_sessions: number;
  sustained_threshold: number;
  level_thresholds: Record<string, { min_score: number; max_score: number }>;
  criteria_weights: Record<string, number>;
  composite_rules: string[];
}

export interface Scenario {
  id: string;
  language: string;
  part: string;
  mode: string;
  level_target: string;
  topic_domain: string;
  context: string;
  instructions: string;
  prompt_text: string;
  followups: string[];
  expected_elements: string[];
  rubric_ids: string[];
  common_error_ids: string[];
  feedback_template_ids: string[];
}

export interface Question {
  id: string;
  language: string;
  part: string;
  level_target: string;
  topic_domain: string;
  question_text: string;
  followups: string[];
  timing_seconds: number;
  variants: string[];
}

export interface CommonError {
  id: string;
  language: string;
  category: string;
  pattern: string;
  correction: string;
  feedback_text: string;
  level_impact: string;
  criterion_affected: string;
}

export interface FeedbackTemplate {
  id: string;
  language: string;
  type: string;
  criterion: string;
  level_context: string;
  template_text: string;
  variables: string[];
}

export interface ListeningAsset {
  id: string;
  language: string;
  type: string;
  transcript: string;
  speaker_count: number;
  duration_estimate_seconds: number;
  summary_points: string[];
  key_details: string[];
  topic_domain: string;
}

export interface AnswerGuide {
  id: string;
  scenario_id: string;
  language: string;
  expected_elements: string[];
  recommended_structures: string[];
  common_pitfalls: string[];
  model_answer_outline: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  accessed_date: string;
  notes: string;
}

// ─── Dataset Store ───────────────────────────────────────────

interface DatasetStore {
  examComponents: ExamComponent[];
  rubrics: Rubric[];
  gradingLogic: GradingLogic[];
  scenarios: Scenario[];
  questionBank: Question[];
  commonErrors: CommonError[];
  feedbackTemplates: FeedbackTemplate[];
  listeningAssets: ListeningAsset[];
  answerGuides: AnswerGuide[];
  citations: Citation[];
}

let _store: DatasetStore | null = null;

function loadJsonl<T>(filename: string): T[] {
  const seedDir = join(process.cwd(), "data", "sle", "seed");
  const filepath = join(seedDir, filename);

  if (!existsSync(filepath)) {
    console.warn(`[SLE Dataset] File not found: ${filepath}`);
    return [];
  }

  const content = readFileSync(filepath, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  return lines.map((line) => JSON.parse(line) as T);
}

function loadDataset(): DatasetStore {
  if (_store) return _store;

  console.log("[SLE Dataset] Loading seed data...");
  const start = Date.now();

  _store = {
    examComponents: loadJsonl<ExamComponent>("exam_components.jsonl"),
    rubrics: loadJsonl<Rubric>("rubrics.jsonl"),
    gradingLogic: loadJsonl<GradingLogic>("grading_logic.jsonl"),
    scenarios: loadJsonl<Scenario>("scenarios.jsonl"),
    questionBank: loadJsonl<Question>("question_bank.jsonl"),
    commonErrors: loadJsonl<CommonError>("common_errors.jsonl"),
    feedbackTemplates: loadJsonl<FeedbackTemplate>("feedback_templates.jsonl"),
    listeningAssets: loadJsonl<ListeningAsset>("listening_assets.jsonl"),
    answerGuides: loadJsonl<AnswerGuide>("answer_guides.jsonl"),
    citations: loadJsonl<Citation>("citations.jsonl"),
  };

  const total = Object.values(_store).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`[SLE Dataset] Loaded ${total} records in ${Date.now() - start}ms`);

  return _store;
}

// ─── Public API ──────────────────────────────────────────────

export function getDataset(): DatasetStore {
  return loadDataset();
}

/**
 * Select a random scenario for the given language and OLA part.
 * Optionally exclude previously used scenario IDs.
 */
export function selectScenario(
  language: "FR" | "EN",
  part: "I" | "II" | "III" | "IV",
  excludeIds: string[] = []
): Scenario | null {
  const ds = loadDataset();
  const candidates = ds.scenarios.filter(
    (s) =>
      s.language === language &&
      s.part === part &&
      !excludeIds.includes(s.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Select random questions for the given language and OLA part.
 * Returns `count` questions, avoiding duplicates.
 */
export function selectQuestions(
  language: "FR" | "EN",
  part: "I" | "II" | "III" | "IV",
  count: number = 5,
  excludeIds: string[] = []
): Question[] {
  const ds = loadDataset();
  const candidates = ds.questionBank.filter(
    (q) =>
      q.language === language &&
      q.part === part &&
      !excludeIds.includes(q.id)
  );
  // Shuffle and take first `count`
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get the answer guide for a specific scenario.
 */
export function getAnswerGuide(scenarioId: string): AnswerGuide | null {
  const ds = loadDataset();
  return ds.answerGuides.find((ag) => ag.scenario_id === scenarioId) ?? null;
}

/**
 * Get rubrics for a specific language and level.
 */
export function getRubrics(
  language: "FR" | "EN",
  level: "A" | "B" | "C"
): Rubric[] {
  const ds = loadDataset();
  return ds.rubrics.filter(
    (r) => r.language === language && r.level === level
  );
}

/**
 * Get common errors matching the given criteria.
 */
export function getCommonErrors(
  language: "FR" | "EN",
  category?: string,
  levelImpact?: string
): CommonError[] {
  const ds = loadDataset();
  return ds.commonErrors.filter(
    (e) =>
      e.language === language &&
      (!category || e.category === category) &&
      (!levelImpact || e.level_impact === levelImpact)
  );
}

/**
 * Get feedback templates matching the given criteria.
 */
export function getFeedbackTemplates(
  language: "FR" | "EN",
  type?: string,
  criterion?: string
): FeedbackTemplate[] {
  const ds = loadDataset();
  return ds.feedbackTemplates.filter(
    (t) =>
      t.language === language &&
      (!type || t.type === type) &&
      (!criterion || t.criterion === criterion || t.criterion === "general")
  );
}

/**
 * Get a listening asset for Part II practice.
 */
export function selectListeningAsset(
  language: "FR" | "EN",
  type?: "voicemail" | "conversation",
  excludeIds: string[] = []
): ListeningAsset | null {
  const ds = loadDataset();
  const candidates = ds.listeningAssets.filter(
    (la) =>
      la.language === language &&
      (!type || la.type === type) &&
      !excludeIds.includes(la.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Compute a composite score from individual criterion scores.
 */
export function computeCompositeScore(
  criterionScores: Record<string, number>
): { overallScore: number; level: string } {
  const ds = loadDataset();
  const logic = ds.gradingLogic[0];
  if (!logic) return { overallScore: 0, level: "X" };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [criterion, weight] of Object.entries(logic.criteria_weights)) {
    const score = criterionScores[criterion] ?? 0;
    weightedSum += score * weight;
    totalWeight += weight;
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  let level = "X";
  for (const [lvl, thresholds] of Object.entries(logic.level_thresholds)) {
    if (overallScore >= thresholds.min_score && overallScore <= thresholds.max_score) {
      level = lvl;
      break;
    }
  }

  // If score exceeds C max, it's still C (or E for exemption)
  if (overallScore > (logic.level_thresholds["C"]?.max_score ?? 100)) {
    level = "C";
  }

  return { overallScore, level };
}

/**
 * Get exam component info for a specific part and language.
 */
export function getExamComponent(
  language: "FR" | "EN",
  part: "I" | "II" | "III" | "IV"
): ExamComponent | null {
  const ds = loadDataset();
  return ds.examComponents.find(
    (ec) => ec.language === language && ec.part === part
  ) ?? null;
}

/**
 * Build a context injection string for the AI coach system prompt.
 * This provides the AI with relevant rubrics, common errors, and exam structure
 * for the current session context.
 */
export function buildCoachContext(
  language: "FR" | "EN",
  targetLevel: "A" | "B" | "C",
  part: "I" | "II" | "III" | "IV"
): string {
  const rubrics = getRubrics(language, targetLevel);
  const errors = getCommonErrors(language, undefined, targetLevel).slice(0, 10);
  const examComp = getExamComponent(language, part);

  const sections: string[] = [];

  if (examComp) {
    sections.push(
      `## Current Exam Part: ${examComp.name} (Part ${part})`,
      `Duration: ${examComp.duration_min}-${examComp.duration_max} minutes`,
      `Description: ${examComp.description}`,
      `Objectives: ${examComp.objectives.join("; ")}`,
      ""
    );
  }

  if (rubrics.length > 0) {
    sections.push(`## Evaluation Rubrics for Level ${targetLevel}:`);
    for (const r of rubrics) {
      sections.push(
        `### ${r.criterion} (weight: ${r.weight})`,
        `${r.descriptor}`,
        `Indicators: ${r.indicators.join("; ")}`,
        ""
      );
    }
  }

  if (errors.length > 0) {
    sections.push(`## Common Errors to Watch For (Level ${targetLevel}):`);
    for (const e of errors) {
      sections.push(`- ${e.pattern} → ${e.correction} (${e.category})`);
    }
    sections.push("");
  }

  return sections.join("\n");
}
