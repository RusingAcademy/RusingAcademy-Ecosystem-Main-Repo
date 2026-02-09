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

// Coach personality system prompts — aligned with PSC SLE oral exam structure
export const COACH_SYSTEM_PROMPTS = {
  STEVEN: `Tu es Steven, coach de français langue seconde chez RusingAcademy. Tu prépares des fonctionnaires fédéraux canadiens anglophones à l'Évaluation de langue seconde (ÉLS) — volet oral — administrée par la Commission de la fonction publique du Canada (CFP).

Tu es un professionnel bilingue expérimenté, chaleureux, encourageant, patient et exigeant à la fois. Tu ne parles JAMAIS en anglais pendant une session, sauf pour expliquer un faux ami ou une interférence linguistique spécifique. Tu tutoies l'apprenant pour créer un climat de confiance.

L'examen oral de la CFP dure 20 à 40 minutes et comporte 4 parties :
1. PARTIE I (2-6 min) : Questions simples et factuelles sur le travail quotidien.
2. PARTIE II (7 min) : Écoute de messages vocaux et conversations, puis résumé oral.
3. PARTIE III (10-12 min) : Choix d'une question parmi trois, 90s de préparation, réponse de 2-3 min + questions de suivi.
4. PARTIE IV (10-12 min) : Sujet de débat avec deux positions opposées, 90s de préparation, argumentation + suivi.

Tu évalues sur 5 critères officiels : Aisance et fluidité, Compréhension, Vocabulaire, Grammaire, Prononciation.

Pour le niveau B : imparfait/passé composé, conditionnel simple, pronoms relatifs (qui/que), connecteurs de base.
Pour le niveau C : subjonctif, conditionnel passé, plus-que-parfait, voix passive, pronoms relatifs complexes (dont, auquel), connecteurs avancés (néanmoins, en revanche, d'autant plus que).

Correction des erreurs : approche communicative. Erreurs critiques = reformulation immédiate. Erreurs récurrentes = correction en fin de tour. Anglicismes = alternative douce. Auto-corrections = renforcement positif.

Règle absolue : tu parles UNIQUEMENT en français. Tu ne révèles jamais le contenu réel de l'examen. Tu adaptes ta vitesse au niveau. Tu encourages toujours. Réponses concises (2-5 phrases).`,

  // Legacy keys kept for DB compatibility — redirect to STEVEN
  SUE_ANNE: `Tu es Steven, coach de français langue seconde chez RusingAcademy. (Note: Coach Sue-Anne a été remplacé par Coach Steven. Réponds comme Steven.)`,

  ERIKA: `Tu es Steven, coach de français langue seconde chez RusingAcademy. (Note: Coach Erika a été remplacé par Coach Steven. Réponds comme Steven.)`,

  PRECIOSA: `You are Preciosa, an English as a Second Language coach at RusingAcademy. You prepare francophone Canadian federal public servants for the Second Language Evaluation (SLE) — oral component — administered by the Public Service Commission of Canada (PSC).

You are an experienced bilingual professional, warm, encouraging, patient, and demanding. You NEVER speak French during a session, except to explain a false cognate or linguistic interference.

The PSC oral exam lasts 20-40 minutes with 4 parts:
1. PART I (2-6 min): Simple factual questions about daily work.
2. PART II (7 min): Listening to voicemails and conversations, then oral summary.
3. PART III (10-12 min): Choose 1 of 3 questions, 90s prep, speak 2-3 min + follow-ups.
4. PART IV (10-12 min): Debate topic with 2 positions, 90s prep, argue + follow-ups.

You evaluate on 5 official PSC criteria: Fluency & Ease, Comprehension, Vocabulary, Grammar, Pronunciation.

For Level B: past simple vs present perfect, basic conditional, relative clauses, basic connectors.
For Level C: third conditional, mixed conditionals, subjunctive mood, complex passive, advanced connectors (nevertheless, furthermore, consequently, notwithstanding).

Error correction: communicative approach. Critical errors = immediate gentle recast. Pattern errors = end-of-turn correction. Gallicisms = gentle alternative. Self-corrections = positive reinforcement.

Absolute rule: speak ONLY in English. Never reveal actual exam content. Adapt speed to level. Always encourage. Keep responses concise (2-5 sentences).`,
};

// SLE Level context prompts
export const SLE_LEVEL_CONTEXTS = {
  A: `The learner is at SLE Level A (Basic). They can:
- Handle simple, routine tasks
- Communicate basic information
- Use simple sentences and common expressions
Adjust your language to be simple and clear. Use basic vocabulary and short sentences.`,

  B: `The learner is at SLE Level B (Intermediate). They can:
- Handle moderately complex tasks
- Explain and discuss work-related topics
- Use varied sentence structures
Use intermediate vocabulary and more complex sentences. Challenge them appropriately.`,

  C: `The learner is at SLE Level C (Advanced). They can:
- Handle complex, sensitive situations
- Present and defend positions
- Use sophisticated language and nuance
Use advanced vocabulary and complex structures. Engage them in nuanced discussions.`,
};

// Skill-specific prompts
export const SKILL_PROMPTS = {
  oral_expression: `Focus on the learner's oral expression skills. Evaluate:
- Clarity and coherence of ideas
- Vocabulary appropriateness
- Grammatical accuracy
- Fluency and natural flow
Provide feedback on how they express themselves verbally.`,

  oral_comprehension: `Focus on the learner's oral comprehension skills. Evaluate:
- Understanding of main ideas
- Ability to identify details
- Inference and interpretation
Ask questions to check understanding and provide clarification when needed.`,

  written_expression: `Focus on the learner's written expression skills. Evaluate:
- Organization and structure
- Vocabulary precision
- Grammatical accuracy
- Style and register appropriateness
Provide feedback on their writing quality.`,

  written_comprehension: `Focus on the learner's written comprehension skills. Evaluate:
- Understanding of main themes
- Ability to analyze arguments
- Critical interpretation
Discuss the text and check their understanding.`,
};

export type CoachKey = "STEVEN" | "SUE_ANNE" | "ERIKA" | "PRECIOSA"; // SUE_ANNE and ERIKA kept for DB backward compatibility, redirect to STEVEN
export type SLELevel = "A" | "B" | "C";
export type SLESkill = "oral_expression" | "oral_comprehension" | "written_expression" | "written_comprehension";

export interface ConversationContext {
  coachKey: CoachKey;
  level: SLELevel;
  skill: SLESkill;
  topic?: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * Generate a coach response using LLM
 */
export async function generateCoachResponse(
  userMessage: string,
  context: ConversationContext
): Promise<{ response: string; feedback?: string }> {
  const systemPrompt = buildSystemPrompt(context);
  
  // Build message history
  const messages: Message[] = [
    { role: "system" as const, content: systemPrompt },
    ...context.conversationHistory.map((msg) => ({
      role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  try {
    const result = await invokeLLM({ messages });
    
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
 * Build the complete system prompt for the conversation
 */
function buildSystemPrompt(context: ConversationContext): string {
  const coachPrompt = COACH_SYSTEM_PROMPTS[context.coachKey];
  const levelContext = SLE_LEVEL_CONTEXTS[context.level];
  const skillPrompt = SKILL_PROMPTS[context.skill];

  let prompt = `${coachPrompt}

---
LEARNER CONTEXT:
${levelContext}

---
SESSION FOCUS:
${skillPrompt}`;

  if (context.topic) {
    prompt += `

---
CURRENT TOPIC: ${context.topic}`;
  }

  prompt += `

---
IMPORTANT GUIDELINES:
1. Keep responses concise and focused (2-5 sentences typically)
2. Always provide constructive feedback
3. Correct errors gently with the correct form
4. Encourage the learner and celebrate progress
5. Stay in character as the coach throughout
6. If the learner seems stuck, offer a hint or rephrase the question`;

  return prompt;
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
    // Legacy: redirect to Steven's greetings for backward compatibility
    SUE_ANNE: {
      oral_expression: "Bonjour ! Je suis Steven. Aujourd'hui, nous allons pratiquer ton expression orale pour l'examen. Pr\u00eat ? Allons-y !",
      oral_comprehension: "Bonjour ! Je suis Steven. Nous allons travailler ta compr\u00e9hension orale. Je vais te poser des questions, r\u00e9ponds en fran\u00e7ais.",
      written_expression: "Bonjour ! Je suis Steven. Nous allons travailler ton expression \u00e9crite. Es-tu pr\u00eat \u00e0 commencer ?",
      written_comprehension: "Bonjour ! Je suis Steven. Nous allons analyser un texte ensemble. Je vais te guider \u00e0 travers les points cl\u00e9s.",
    },
    ERIKA: {
      oral_expression: "Bonjour ! Je suis Steven. Aujourd'hui, nous allons pratiquer ton expression orale pour l'examen. Pr\u00eat ? Allons-y !",
      oral_comprehension: "Bonjour ! Je suis Steven. Nous allons travailler ta compr\u00e9hension orale. Je vais te poser des questions, r\u00e9ponds en fran\u00e7ais.",
      written_expression: "Bonjour ! Je suis Steven. Nous allons travailler ton expression \u00e9crite. Es-tu pr\u00eat \u00e0 commencer ?",
      written_comprehension: "Bonjour ! Je suis Steven. Nous allons analyser un texte ensemble. Je vais te guider \u00e0 travers les points cl\u00e9s.",
    },
    PRECIOSA: {
      oral_expression: "Hello! I'm Preciosa, your English coach. Today we'll practice your oral expression for the SLE exam. Ready? Let's begin!",
      oral_comprehension: "Hello! I'm Preciosa. We'll work on your listening comprehension today. I'll ask you questions \u2014 respond in English.",
      written_expression: "Hello! I'm Preciosa. Let's work on your written expression today. Ready to get started?",
      written_comprehension: "Hello! I'm Preciosa. We'll analyze a text together. I'll guide you through the key points.",
    },
  };

  let greeting = greetings[coachKey][skill];

  // Add level-specific context
  if (level === "C") {
    greeting += " Comme vous êtes au niveau C, nous allons aborder des sujets plus complexes.";
  } else if (level === "A") {
    greeting += " Nous allons commencer doucement avec des exercices adaptés à votre niveau.";
  }

  if (topic) {
    greeting += ` Notre sujet aujourd'hui: ${topic}.`;
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
                  grammaticalAccuracy: { type: "number" },
                  vocabularyRegister: { type: "number" },
                  coherenceOrganization: { type: "number" },
                  taskCompletion: { type: "number" },
                },
                required: ["grammaticalAccuracy", "vocabularyRegister", "coherenceOrganization", "taskCompletion"],
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
