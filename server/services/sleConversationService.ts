/**
 * SLE Companion Conversation Service
 * 
 * Provides LLM-powered conversational practice with coach personalities.
 * Uses Whisper for transcription and MiniMax TTS for voice synthesis.
 */

import { invokeLLM, type Message } from "../_core/llm";
import { transcribeAudio, type TranscriptionResponse, type TranscriptionError } from "../_core/voiceTranscription";
import { buildScoringPrompt, isPassing } from "./sleScoringRubric";
import { trackPipelineStage } from "./aiPipelineMonitor";
import { structuredLog } from "../structuredLogger";
import {
  buildCoachContext,
  getCommonErrors,
  getRubrics,
  type ExamPhase,
} from "./sleDatasetService";

// ─── Coach System Prompts ───────────────────────────────────────────────────
// DESIGN: Optimized for VOICE conversation (TTS output).
// Must produce short, natural, spoken-style responses — NOT essays.
// Reduced token count for faster LLM inference.

export const COACH_SYSTEM_PROMPTS = {
  STEVEN: `Tu es Steven, évaluateur et coach expert de l'Évaluation de langue seconde (ÉLS) — volet oral — chez RusingAcademy. Tu as 15 ans d'expérience en évaluation linguistique pour la fonction publique fédérale du Canada.

Tu prépares des fonctionnaires anglophones à l'examen oral ÉLS de la CFP. Tu tutoies l'apprenant. Tu es chaleureux, encourageant, mais exigeant — comme un vrai évaluateur bienveillant.

EXAMEN ORAL ÉLS (2025-2026) :
Une entrevue structurée de 20-40 min via Teams. L'évaluateur augmente progressivement la difficulté. Pas de composante d'écoute/résumé.
- Phase 1 (5-10 min) : Questions factuelles sur le travail. Niveau A.
- Phase 2 (8-15 min) : Récits, projets, problèmes résolus. Méthode STAR. Niveau B.
- Phase 3 (10-15 min) : Opinions, hypothèses, débats. Méthode OPIC. Niveau C.

7 CRITÈRES CFP : fonctions langagières, richesse lexicale, complexité grammaticale, cohérence/cohésion, nuance/précision, interaction, connecteurs logiques.

Niveau B : imparfait/passé composé, conditionnel simple, pronoms relatifs (qui/que), connecteurs de base.
Niveau C : subjonctif, conditionnel passé, voix passive, connecteurs avancés (néanmoins, en revanche, bien que).

CORRECTION : reformulation immédiate pour erreurs critiques. Fin de tour pour erreurs récurrentes. Renforcement positif pour auto-corrections.

STYLE DE RÉPONSE :
- Tu parles comme dans une VRAIE conversation orale — pas un texte écrit.
- 2-4 phrases courtes maximum par réponse.
- Après chaque réponse de l'apprenant, tu fais UNE correction ciblée si nécessaire, puis tu poses la question suivante.
- Tu ne récites JAMAIS les critères ou la structure de l'examen.
- Si l'apprenant pose une question générale (hors ÉLS), réponds brièvement puis ramène la conversation vers la pratique.

RÈGLE ABSOLUE : UNIQUEMENT en français. Zéro mot anglais.`,

  // Legacy keys kept for DB compatibility — redirect to STEVEN
  SUE_ANNE: `Tu es Steven, évaluateur et coach expert ÉLS chez RusingAcademy. (Coach Sue-Anne redirigé vers Steven.) Réponds uniquement en français, 2-4 phrases max.`,

  ERIKA: `Tu es Steven, évaluateur et coach expert ÉLS chez RusingAcademy. (Coach Erika redirigé vers Steven.) Réponds uniquement en français, 2-4 phrases max.`,

  PRECIOSA: `You are Preciosa, an expert SLE evaluator and English coach at RusingAcademy. You have 15 years of experience in language assessment for the Canadian federal public service.

You prepare francophone public servants for the SLE oral exam administered by the PSC. You are warm, encouraging, but demanding — like a supportive real evaluator.

SLE ORAL EXAM (2025-2026):
One structured interview, 20-40 min via Teams. Assessor progressively increases difficulty. No listening/summarizing component.
- Phase 1 (5-10 min): Factual questions about work. Level A.
- Phase 2 (8-15 min): Narratives, projects, problems solved. STAR method. Level B.
- Phase 3 (10-15 min): Opinions, hypotheticals, debates. OPIC method. Level C.

7 PSC CRITERIA: language functions, lexical richness, grammatical complexity, coherence/cohesion, nuance/precision, interaction, logical connectors.

Level B: past simple vs present perfect, basic conditional, relative clauses, basic connectors.
Level C: third conditional, mixed conditionals, subjunctive mood, complex passive, advanced connectors (nevertheless, furthermore, albeit, whereas).

CORRECTION: immediate recast for critical errors. End-of-turn for pattern errors. Positive reinforcement for self-corrections.

RESPONSE STYLE:
- Speak like a REAL oral conversation — not written text.
- 2-4 short sentences maximum per response.
- After each learner response, make ONE targeted correction if needed, then ask the next question.
- NEVER recite criteria or exam structure.
- If the learner asks a general question (outside SLE), answer briefly then steer back to practice.

ABSOLUTE RULE: ONLY in English. Zero French words.`,
};

// SLE Level context prompts — kept concise for voice mode
export const SLE_LEVEL_CONTEXTS = {
  A: `Learner level: A (Basic). Use simple vocabulary, short sentences. Be patient and encouraging.`,
  B: `Learner level: B (Intermediate). Use varied vocabulary, challenge with follow-up questions. Expect STAR-method narratives.`,
  C: `Learner level: C (Advanced). Use sophisticated vocabulary, push for nuance and hypotheticals. Expect OPIC-style argumentation.`,
};

// Skill-specific prompts — concise
export const SKILL_PROMPTS = {
  oral_expression: `Focus: oral expression. Evaluate clarity, vocabulary, grammar, fluency. Correct errors in-line.`,
  oral_comprehension: `Focus: oral comprehension. Ask questions to check understanding. Rephrase if needed.`,
  written_expression: `Focus: written expression. Evaluate organization, vocabulary, grammar, register.`,
  written_comprehension: `Focus: written comprehension. Discuss text, check understanding, ask analytical questions.`,
};

export type CoachKey = "STEVEN" | "SUE_ANNE" | "ERIKA" | "PRECIOSA";
export type SLELevel = "A" | "B" | "C";
export type SLESkill = "oral_expression" | "oral_comprehension" | "written_expression" | "written_comprehension";

export interface ConversationContext {
  coachKey: CoachKey;
  level: SLELevel;
  skill: SLESkill;
  topic?: string;
  /** Current exam phase for dataset context injection ("1", "2", "3") */
  currentPhase?: ExamPhase;
  /** Additional context from the session orchestrator (turn-specific) */
  turnContext?: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * Generate a coach response using LLM.
 * Optimized for low latency: concise system prompt, limited history, capped tokens.
 */
export async function generateCoachResponse(
  userMessage: string,
  context: ConversationContext
): Promise<{ response: string; feedback?: string }> {
  const systemPrompt = buildSystemPrompt(context);
  
  // Limit conversation history to last 10 messages for speed
  const recentHistory = context.conversationHistory.slice(-10);
  
  // Build message history
  const messages: Message[] = [
    { role: "system" as const, content: systemPrompt },
    ...recentHistory.map((msg) => ({
      role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  try {
    // maxTokens 200 = ~2-4 spoken sentences, enough for voice but not verbose
    const result = await invokeLLM({ messages, maxTokens: 200 });
    
    const responseContent = result.choices[0]?.message?.content;
    const response = typeof responseContent === "string" 
      ? responseContent 
      : Array.isArray(responseContent) 
        ? responseContent.map(c => c.type === "text" ? c.text : "").join("")
        : "";

    return { response };
  } catch (error) {
    console.error("[SLE Conversation] LLM error:", error);
    throw new Error("Failed to generate coach response");
  }
}

/**
 * Build the complete system prompt for the conversation.
 * Injects SLE dataset context (rubrics, common errors, exam structure)
 * but keeps total prompt concise for fast inference.
 */
function buildSystemPrompt(context: ConversationContext): string {
  const coachPrompt = COACH_SYSTEM_PROMPTS[context.coachKey];
  const levelContext = SLE_LEVEL_CONTEXTS[context.level];
  const skillPrompt = SKILL_PROMPTS[context.skill];

  // Determine language from coach key
  const language: "FR" | "EN" = context.coachKey === "PRECIOSA" ? "EN" : "FR";

  // Determine current exam phase from context or infer from level
  const phase: ExamPhase = context.currentPhase ?? inferPhaseFromLevel(context.level);

  // Build dataset-driven context injection (rubrics, errors, exam structure)
  const datasetContext = buildCoachContext(language, context.level, phase);

  let prompt = `${coachPrompt}

---
${levelContext}
${skillPrompt}`;

  // Inject the SLE dataset context — but truncate if too long to keep latency low
  if (datasetContext) {
    // Cap dataset context to ~800 chars to avoid bloating the prompt
    const trimmedContext = datasetContext.length > 800 
      ? datasetContext.slice(0, 800) + "\n[...truncated for brevity]"
      : datasetContext;
    prompt += `\n\n---\nSLE REFERENCE DATA:\n${trimmedContext}`;
  }

  // Inject turn-specific context from the orchestrator
  if (context.turnContext) {
    const trimmedTurn = context.turnContext.length > 400
      ? context.turnContext.slice(0, 400) + "\n[...truncated]"
      : context.turnContext;
    prompt += `\n\n---\nCURRENT TURN:\n${trimmedTurn}`;
  }

  if (context.topic) {
    prompt += `\nTopic: ${context.topic}`;
  }

  // Strict language enforcement — final instruction for maximum weight
  const langRule = language === "FR"
    ? `\nCRITICAL: Respond ONLY in French. ZERO English words. If the learner speaks English, respond in French and redirect.`
    : `\nCRITICAL: Respond ONLY in English. ZERO French words. If the learner speaks French, respond in English and redirect.`;

  prompt += `\n\n---\nFINAL RULES:\n1. MAX 2-4 short sentences. This is LIVE VOICE — be concise and natural.\n2. Correct ONE error per turn, then ask the next question.\n3. Never list criteria. Never give lectures. Be conversational.${langRule}`;

  return prompt;
}

/**
 * Infer the exam phase from the learner's target level.
 */
function inferPhaseFromLevel(level: SLELevel): ExamPhase {
  switch (level) {
    case "A": return "1";
    case "B": return "2";
    case "C": return "3";
    default: return "1";
  }
}

/**
 * Transcribe user audio and return text
 */
export async function transcribeUserAudio(
  audioUrl: string,
  language: string = "fr",
  userId?: number,
  sessionId?: string
): Promise<{ text: string; duration: number } | { error: string }> {
  const tracker = trackPipelineStage("transcription", userId, sessionId);

  try {
    const result = await transcribeAudio({
      audioUrl,
      language,
      prompt: "Transcription d'un exercice de pratique orale en français pour l'examen SLE.",
    });

    if ("error" in result) {
      tracker.failure(new Error((result as TranscriptionError).error));
      return { error: (result as TranscriptionError).error };
    }

    const transcription = result as TranscriptionResponse;
    tracker.success({ textLength: transcription.text.length, audioDuration: transcription.duration });
    return {
      text: transcription.text,
      duration: transcription.duration,
    };
  } catch (error) {
    tracker.failure(error);
    structuredLog("error", "ai-pipeline", "Transcription failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { error: "Transcription service unavailable" };
  }
}

/**
 * Generate initial greeting based on coach and topic
 */
export function generateInitialGreeting(
  coachKey: CoachKey,
  level: SLELevel,
  skill: SLESkill,
  topic?: string
): string {
  const greetings: Record<CoachKey, Record<SLESkill, string>> = {
    STEVEN: {
      oral_expression: "Bonjour! Je suis Coach Steven. Aujourd'hui, nous allons travailler sur votre expression orale. Commençons par un exercice simple. Présentez-vous brièvement.",
      oral_comprehension: "Bonjour! Je suis Coach Steven. Nous allons pratiquer votre compréhension orale. Je vais vous poser des questions et vous répondrez en français.",
      written_expression: "Bonjour! Je suis Coach Steven. Nous allons travailler sur votre expression écrite. Êtes-vous prêt à commencer?",
      written_comprehension: "Bonjour! Je suis Coach Steven. Nous allons analyser un texte ensemble. Je vais vous guider à travers les points clés.",
    },
    SUE_ANNE: {
      oral_expression: "Bonjour ! Je suis Steven. Aujourd'hui, nous allons pratiquer ton expression orale pour l'examen. Prêt ? Allons-y !",
      oral_comprehension: "Bonjour ! Je suis Steven. Nous allons travailler ta compréhension orale. Je vais te poser des questions, réponds en français.",
      written_expression: "Bonjour ! Je suis Steven. Nous allons travailler ton expression écrite. Es-tu prêt à commencer ?",
      written_comprehension: "Bonjour ! Je suis Steven. Nous allons analyser un texte ensemble. Je vais te guider à travers les points clés.",
    },
    ERIKA: {
      oral_expression: "Bonjour ! Je suis Steven. Aujourd'hui, nous allons pratiquer ton expression orale pour l'examen. Prêt ? Allons-y !",
      oral_comprehension: "Bonjour ! Je suis Steven. Nous allons travailler ta compréhension orale. Je vais te poser des questions, réponds en français.",
      written_expression: "Bonjour ! Je suis Steven. Nous allons travailler ton expression écrite. Es-tu prêt à commencer ?",
      written_comprehension: "Bonjour ! Je suis Steven. Nous allons analyser un texte ensemble. Je vais te guider à travers les points clés.",
    },
    PRECIOSA: {
      oral_expression: "Hello! I'm Preciosa, your English coach. Today we'll practice your oral expression for the SLE exam. Ready? Let's begin!",
      oral_comprehension: "Hello! I'm Preciosa. We'll work on your listening comprehension today. I'll ask you questions — respond in English.",
      written_expression: "Hello! I'm Preciosa. Let's work on your written expression today. Ready to get started?",
      written_comprehension: "Hello! I'm Preciosa. We'll analyze a text together. I'll guide you through the key points.",
    },
  };

  let greeting = greetings[coachKey][skill];

  // Add level-specific context
  if (level === "C") {
    const isEN = coachKey === "PRECIOSA";
    greeting += isEN
      ? " Since you're at Level C, we'll tackle more complex and abstract topics."
      : " Comme vous êtes au niveau C, nous allons aborder des sujets plus complexes.";
  } else if (level === "A") {
    const isEN = coachKey === "PRECIOSA";
    greeting += isEN
      ? " We'll start gently with exercises suited to your level."
      : " Nous allons commencer doucement avec des exercices adaptés à votre niveau.";
  }

  if (topic) {
    const isEN = coachKey === "PRECIOSA";
    greeting += isEN
      ? ` Our topic today: ${topic}.`
      : ` Notre sujet aujourd'hui: ${topic}.`;
  }

  return greeting;
}

/**
 * Evaluate user response and provide structured feedback.
 * Uses the formal SLE scoring rubric v1 with PSC-aligned criteria.
 */
export async function evaluateResponse(
  userMessage: string,
  context: ConversationContext,
  userId?: number,
  sessionId?: string
): Promise<{
  score: number;
  passed?: boolean;
  criteriaScores?: Record<string, number>;
  feedback: string;
  corrections: string[];
  suggestions: string[];
  levelAssessment?: string;
}> {
  const tracker = trackPipelineStage("evaluation", userId, sessionId);

  // Use the formal SLE rubric for the scoring prompt
  const systemPrompt = buildScoringPrompt(context.level, context.skill);

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Evaluate this response: "${userMessage}"` },
  ];

  try {
    const result = await invokeLLM({
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sle_evaluation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: { type: "number" },
              passed: { type: "boolean" },
              criteriaScores: {
                type: "object",
                properties: {
                  languageFunctions: { type: "number" },
                  lexicalRichness: { type: "number" },
                  grammaticalComplexity: { type: "number" },
                  coherenceCohesion: { type: "number" },
                  nuancePrecision: { type: "number" },
                  interaction: { type: "number" },
                  logicalConnectors: { type: "number" },
                },
                required: ["languageFunctions", "lexicalRichness", "grammaticalComplexity", "coherenceCohesion", "nuancePrecision", "interaction", "logicalConnectors"],
                additionalProperties: false,
              },
              feedback: { type: "string" },
              corrections: { type: "array", items: { type: "string" } },
              suggestions: { type: "array", items: { type: "string" } },
              levelAssessment: { type: "string" },
            },
            required: ["score", "passed", "criteriaScores", "feedback", "corrections", "suggestions", "levelAssessment"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = result.choices[0]?.message?.content;
    const jsonStr = typeof content === "string" ? content : "";
    const parsed = JSON.parse(jsonStr);

    // Double-check pass/fail against rubric threshold
    parsed.passed = isPassing(context.level, parsed.score);

    tracker.success({
      score: parsed.score,
      passed: parsed.passed,
      level: context.level,
      skill: context.skill,
    });

    return parsed;
  } catch (error) {
    tracker.failure(error);
    structuredLog("error", "ai-pipeline", "SLE Evaluation failed", {
      error: error instanceof Error ? error.message : String(error),
      level: context.level,
      skill: context.skill,
    });
    return {
      score: 0,
      passed: false,
      feedback: "Impossible d'évaluer la réponse pour le moment.",
      corrections: [],
      suggestions: [],
    };
  }
}
