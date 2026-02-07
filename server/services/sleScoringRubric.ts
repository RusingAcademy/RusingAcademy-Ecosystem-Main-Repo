/**
 * SLE Scoring Rubric v1
 * 
 * Formal scoring criteria aligned with the Public Service Commission (PSC)
 * Second Language Evaluation (SLE) standards for levels A, B, and C.
 * 
 * Each level has specific competency descriptors for:
 * - Grammatical Accuracy (0-25)
 * - Vocabulary & Register (0-25)
 * - Coherence & Organization (0-25)
 * - Task Completion & Communicative Effectiveness (0-25)
 * 
 * Total score: 0-100
 * Pass thresholds: A ≥ 40, B ≥ 55, C ≥ 70
 */

export interface ScoringCriterion {
  name: string;
  maxPoints: number;
  descriptors: {
    excellent: string;  // 21-25
    good: string;       // 16-20
    adequate: string;   // 11-15
    developing: string; // 6-10
    insufficient: string; // 0-5
  };
}

export interface LevelRubric {
  level: "A" | "B" | "C";
  passThreshold: number;
  description: string;
  criteria: ScoringCriterion[];
}

// ============================================================================
// LEVEL A — BASIC PROFICIENCY
// ============================================================================

const LEVEL_A_RUBRIC: LevelRubric = {
  level: "A",
  passThreshold: 40,
  description: "Basic proficiency: Can handle simple, routine tasks and communicate basic information in French.",
  criteria: [
    {
      name: "Grammatical Accuracy",
      maxPoints: 25,
      descriptors: {
        excellent: "Consistently correct basic grammar (subject-verb agreement, basic tenses — présent, passé composé, futur proche). Minor errors do not impede comprehension.",
        good: "Mostly correct basic grammar with occasional errors in tense usage or agreement. Message remains clear.",
        adequate: "Frequent errors in basic structures but meaning is generally recoverable. Can form simple sentences.",
        developing: "Significant grammatical errors that sometimes obscure meaning. Limited to very basic patterns.",
        insufficient: "Grammar errors make the message largely incomprehensible. Cannot form basic sentences correctly.",
      },
    },
    {
      name: "Vocabulary & Register",
      maxPoints: 25,
      descriptors: {
        excellent: "Uses common workplace vocabulary accurately. Appropriate informal/formal register for simple interactions.",
        good: "Adequate vocabulary for routine tasks. Occasional word choice errors but meaning is clear.",
        adequate: "Limited but functional vocabulary. Relies on basic words and may use English cognates.",
        developing: "Very limited vocabulary. Frequently unable to find the right word. Heavy reliance on English.",
        insufficient: "Vocabulary too limited to communicate even basic information.",
      },
    },
    {
      name: "Coherence & Organization",
      maxPoints: 25,
      descriptors: {
        excellent: "Ideas are logically ordered in simple sequences. Uses basic connectors (et, mais, parce que).",
        good: "Generally logical sequence with occasional gaps. Some use of connectors.",
        adequate: "Ideas are present but organization is weak. Limited use of connectors.",
        developing: "Disjointed ideas with no clear organization. No connectors used.",
        insufficient: "No discernible organization. Isolated words or fragments only.",
      },
    },
    {
      name: "Task Completion",
      maxPoints: 25,
      descriptors: {
        excellent: "Fully addresses the simple task. All required information is provided clearly.",
        good: "Addresses most aspects of the task. Minor omissions do not affect overall communication.",
        adequate: "Partially addresses the task. Some required information is missing but core message is present.",
        developing: "Minimally addresses the task. Significant information gaps.",
        insufficient: "Does not address the task or response is off-topic.",
      },
    },
  ],
};

// ============================================================================
// LEVEL B — INTERMEDIATE PROFICIENCY
// ============================================================================

const LEVEL_B_RUBRIC: LevelRubric = {
  level: "B",
  passThreshold: 55,
  description: "Intermediate proficiency: Can handle moderately complex tasks, explain and discuss work-related topics.",
  criteria: [
    {
      name: "Grammatical Accuracy",
      maxPoints: 25,
      descriptors: {
        excellent: "Consistent control of intermediate grammar (subjonctif, conditionnel, relative clauses, pronoms compléments). Errors are rare and minor.",
        good: "Good control of most intermediate structures. Occasional errors with complex tenses but self-corrects.",
        adequate: "Adequate control of basic grammar but struggles with intermediate structures. Errors do not block communication.",
        developing: "Limited control beyond basic structures. Frequent errors with intermediate grammar.",
        insufficient: "Cannot produce intermediate structures. Reverts to basic patterns with many errors.",
      },
    },
    {
      name: "Vocabulary & Register",
      maxPoints: 25,
      descriptors: {
        excellent: "Uses varied, precise vocabulary appropriate to workplace contexts. Correct register (formal for reports, semi-formal for meetings).",
        good: "Good range of vocabulary with occasional imprecision. Generally appropriate register.",
        adequate: "Adequate vocabulary for familiar topics but limited when discussing less routine subjects.",
        developing: "Limited vocabulary range. Frequent paraphrasing or code-switching to English.",
        insufficient: "Vocabulary insufficient for intermediate-level communication.",
      },
    },
    {
      name: "Coherence & Organization",
      maxPoints: 25,
      descriptors: {
        excellent: "Well-organized with clear introduction, development, and conclusion. Uses varied connectors (cependant, néanmoins, en revanche, par conséquent).",
        good: "Generally well-organized with some variety in connectors. Logical flow with minor gaps.",
        adequate: "Adequate organization but relies on simple connectors. Some logical gaps.",
        developing: "Weak organization. Ideas are present but poorly connected.",
        insufficient: "No clear organization. Disconnected ideas.",
      },
    },
    {
      name: "Task Completion",
      maxPoints: 25,
      descriptors: {
        excellent: "Fully addresses the moderately complex task. Provides explanations, examples, and appropriate detail.",
        good: "Addresses most aspects with adequate detail. Minor gaps in explanation.",
        adequate: "Addresses the task but with limited depth. Some aspects are superficial.",
        developing: "Partially addresses the task. Lacks necessary detail or explanation.",
        insufficient: "Does not adequately address the task requirements.",
      },
    },
  ],
};

// ============================================================================
// LEVEL C — ADVANCED PROFICIENCY
// ============================================================================

const LEVEL_C_RUBRIC: LevelRubric = {
  level: "C",
  passThreshold: 70,
  description: "Advanced proficiency: Can handle complex, sensitive situations; present and defend positions with nuance.",
  criteria: [
    {
      name: "Grammatical Accuracy",
      maxPoints: 25,
      descriptors: {
        excellent: "Near-native grammatical control including complex structures (subjonctif passé, concordance des temps, voix passive, discours indirect). Rare, minor errors only.",
        good: "Strong control of advanced grammar. Occasional errors with the most complex structures.",
        adequate: "Good control of intermediate grammar but inconsistent with advanced structures.",
        developing: "Limited control of advanced structures. Frequent errors that occasionally impede nuanced expression.",
        insufficient: "Cannot produce advanced grammatical structures. Communication lacks precision.",
      },
    },
    {
      name: "Vocabulary & Register",
      maxPoints: 25,
      descriptors: {
        excellent: "Rich, precise, and nuanced vocabulary. Masterful register control — can shift between formal policy language, diplomatic phrasing, and technical terminology.",
        good: "Wide vocabulary range with occasional imprecision in specialized terms. Good register awareness.",
        adequate: "Adequate vocabulary for most topics but lacks precision for nuanced or specialized discussion.",
        developing: "Limited advanced vocabulary. Cannot consistently maintain appropriate register.",
        insufficient: "Vocabulary insufficient for advanced-level communication.",
      },
    },
    {
      name: "Coherence & Organization",
      maxPoints: 25,
      descriptors: {
        excellent: "Sophisticated organization with nuanced argumentation. Uses advanced discourse markers (en l'occurrence, force est de constater, il n'en demeure pas moins). Seamless transitions.",
        good: "Well-organized with clear argumentation. Good variety of discourse markers.",
        adequate: "Adequate organization but argumentation could be more sophisticated.",
        developing: "Organization is acceptable but lacks the sophistication expected at Level C.",
        insufficient: "Organization does not meet advanced-level expectations.",
      },
    },
    {
      name: "Task Completion",
      maxPoints: 25,
      descriptors: {
        excellent: "Fully addresses the complex task with nuance, diplomacy, and depth. Demonstrates ability to handle sensitive situations, present balanced arguments, and persuade.",
        good: "Addresses the complex task well with good depth. Minor gaps in nuance or diplomacy.",
        adequate: "Addresses the task but lacks the depth or nuance expected at Level C.",
        developing: "Partially addresses the complex task. Lacks sophistication in handling sensitive aspects.",
        insufficient: "Does not adequately address the complex task requirements.",
      },
    },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const SLE_RUBRICS: Record<string, LevelRubric> = {
  A: LEVEL_A_RUBRIC,
  B: LEVEL_B_RUBRIC,
  C: LEVEL_C_RUBRIC,
};

/**
 * Build the scoring prompt for the LLM evaluator.
 * Includes the formal rubric criteria for the target level.
 */
export function buildScoringPrompt(level: "A" | "B" | "C", skill: string): string {
  const rubric = SLE_RUBRICS[level];
  
  let prompt = `You are an SLE (Second Language Evaluation) exam evaluator for the Canadian Public Service Commission.
You are evaluating a response at Level ${level} (${rubric.description}).

SCORING RUBRIC — Level ${level}
Pass threshold: ${rubric.passThreshold}/100

`;

  for (const criterion of rubric.criteria) {
    prompt += `### ${criterion.name} (0-${criterion.maxPoints} points)
- Excellent (21-25): ${criterion.descriptors.excellent}
- Good (16-20): ${criterion.descriptors.good}
- Adequate (11-15): ${criterion.descriptors.adequate}
- Developing (6-10): ${criterion.descriptors.developing}
- Insufficient (0-5): ${criterion.descriptors.insufficient}

`;
  }

  prompt += `INSTRUCTIONS:
1. Score each criterion independently using the descriptors above.
2. Provide specific evidence from the response for each score.
3. Calculate the total score (sum of all 4 criteria).
4. Determine pass/fail based on the threshold (${rubric.passThreshold}/100).
5. Provide actionable feedback in French.
6. List specific corrections with the incorrect form and the correct form.
7. Suggest 2-3 concrete improvement strategies.

Respond in JSON format:
{
  "score": <total 0-100>,
  "passed": <true/false>,
  "criteriaScores": {
    "grammaticalAccuracy": <0-25>,
    "vocabularyRegister": <0-25>,
    "coherenceOrganization": <0-25>,
    "taskCompletion": <0-25>
  },
  "feedback": "<overall feedback in French>",
  "corrections": ["<specific correction 1>", "<specific correction 2>"],
  "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"],
  "levelAssessment": "<brief assessment of whether the response meets Level ${level} expectations>"
}`;

  return prompt;
}

/**
 * Get the pass threshold for a given level.
 */
export function getPassThreshold(level: "A" | "B" | "C"): number {
  return SLE_RUBRICS[level].passThreshold;
}

/**
 * Determine if a score passes for a given level.
 */
export function isPassing(level: "A" | "B" | "C", score: number): boolean {
  return score >= SLE_RUBRICS[level].passThreshold;
}
