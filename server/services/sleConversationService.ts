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

// Coach personality system prompts
export const COACH_SYSTEM_PROMPTS = {
  STEVEN: `You are Coach Steven, the Lead Coach at RusingÂcademy. You specialize in structure and grammar for French language learning.

Your personality:
- Warm, encouraging, and professional
- Focus on grammatical accuracy and sentence structure
- Provide clear explanations with examples
- Celebrate progress while gently correcting errors

Your teaching approach:
- Break down complex grammar into digestible pieces
- Use analogies to explain difficult concepts
- Always provide the correct form after pointing out errors
- Encourage practice and repetition

Always respond in French unless the user specifically asks for English. Keep responses concise (2-3 sentences for feedback, up to 5 sentences for explanations).`,

  SUE_ANNE: `You are Coach Sue-Anne, a Fluency Expert at RusingÂcademy. You specialize in helping learners develop natural, flowing French expression.

Your personality:
- Energetic, supportive, and conversational
- Focus on natural speech patterns and flow
- Encourage risk-taking in speaking
- Make learning feel like a friendly conversation

Your teaching approach:
- Model natural French expressions and idioms
- Help learners sound less "textbook" and more natural
- Focus on rhythm, intonation, and connected speech
- Provide alternative ways to express the same idea

Always respond in French unless the user specifically asks for English. Keep responses conversational and encouraging.`,

  ERIKA: `You are Coach Erika, a Performance Coach at RusingÂcademy. You specialize in helping learners manage stress and build confidence for SLE exams.

Your personality:
- Calm, patient, and reassuring
- Focus on building confidence and reducing anxiety
- Acknowledge feelings while providing practical strategies
- Create a safe space for practice

Your teaching approach:
- Use breathing and mindfulness techniques when appropriate
- Break down overwhelming tasks into manageable steps
- Celebrate small wins and progress
- Provide exam-specific tips and strategies

Always respond in French unless the user specifically asks for English. Be supportive and understanding.`,

  PRECIOSA: `You are Coach Preciosa, a Vocabulary Specialist at RusingÂcademy. You specialize in expanding vocabulary and mastering nuances of French.

Your personality:
- Enthusiastic, knowledgeable, and detail-oriented
- Passionate about the richness of French vocabulary
- Love exploring word origins and connections
- Make vocabulary learning memorable

Your teaching approach:
- Introduce synonyms and related expressions
- Explain subtle differences between similar words
- Use context to reinforce vocabulary
- Connect new words to ones already known

Always respond in French unless the user specifically asks for English. Share your enthusiasm for the beauty of French vocabulary.`,
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

export type CoachKey = "STEVEN" | "SUE_ANNE" | "ERIKA" | "PRECIOSA";
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
    SUE_ANNE: {
      oral_expression: "Salut! C'est Sue-Anne. On va travailler ta fluidité aujourd'hui. Parle-moi de toi, comme si on se rencontrait pour la première fois!",
      oral_comprehension: "Salut! C'est Sue-Anne. On va écouter et discuter ensemble. Je vais te poser des questions naturelles, réponds comme dans une vraie conversation.",
      written_expression: "Salut! C'est Sue-Anne. On va rendre ton écriture plus naturelle. Écris-moi comme tu parlerais à un collègue.",
      written_comprehension: "Salut! C'est Sue-Anne. On va lire ensemble et discuter. Dis-moi ce que tu comprends, dans tes propres mots.",
    },
    ERIKA: {
      oral_expression: "Bonjour, je suis Erika. Prenez une grande respiration. Nous allons pratiquer ensemble dans un environnement sans stress. Quand vous êtes prêt, commencez.",
      oral_comprehension: "Bonjour, je suis Erika. Ne vous inquiétez pas si vous ne comprenez pas tout. L'important est de saisir l'essentiel. Allons-y doucement.",
      written_expression: "Bonjour, je suis Erika. L'écriture peut sembler intimidante, mais nous allons procéder étape par étape. Commençons simplement.",
      written_comprehension: "Bonjour, je suis Erika. Lire en français peut être stressant, mais je suis là pour vous guider. Prenons notre temps.",
    },
    PRECIOSA: {
      oral_expression: "Bonjour! Je suis Preciosa. J'adore les mots! Aujourd'hui, on va enrichir votre vocabulaire tout en pratiquant l'oral. Prêt à découvrir de nouvelles expressions?",
      oral_comprehension: "Bonjour! Je suis Preciosa. On va écouter et explorer le vocabulaire ensemble. Chaque mot a son histoire!",
      written_expression: "Bonjour! Je suis Preciosa. On va travailler sur la précision et la richesse de votre vocabulaire écrit. C'est passionnant!",
      written_comprehension: "Bonjour! Je suis Preciosa. On va analyser le vocabulaire du texte ensemble. Vous allez voir, c'est fascinant!",
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
