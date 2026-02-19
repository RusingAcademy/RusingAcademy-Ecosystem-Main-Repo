/**
 * Phase 5: AI Companion Optimization Service
 * Provides cached, streaming AI responses with context-aware prompts
 * Uses OpenAI API with in-memory response cache
 */
import { getDb } from "../_core/db";
import * as schema from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// In-memory response cache (TTL-based)
interface CacheEntry {
  response: string;
  timestamp: number;
  hits: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = parseInt(process.env.AI_CACHE_TTL || "3600") * 1000; // default 1 hour
const MAX_CACHE_SIZE = 500;
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || "1000");

// System prompts by context
const SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are an AI learning companion for RusingAcademy, a bilingual (English/French) language training platform for Canadian public servants. You help learners prepare for official language examinations (SLE - Second Language Evaluation). Be encouraging, precise, and professional. Answer in the language the user writes in.`,
  
  grammar: `You are a bilingual grammar expert for RusingAcademy. Help learners understand French and English grammar rules, especially those tested in the SLE (Second Language Evaluation) for Canadian public servants. Provide clear explanations with examples. Use the language the learner writes in.`,
  
  vocabulary: `You are a vocabulary coach for RusingAcademy. Help learners expand their professional vocabulary in both English and French, focusing on terms commonly used in the Canadian federal public service. Provide context, usage examples, and mnemonics.`,
  
  exam_prep: `You are an SLE exam preparation specialist for RusingAcademy. Help learners prepare for Reading Comprehension, Written Expression, and Oral Proficiency tests. Provide practice questions, strategies, and feedback. Focus on achieving B and C levels.`,
  
  writing: `You are a writing coach for RusingAcademy. Help learners improve their written expression in French and English for professional contexts. Review text, suggest improvements, and explain grammar/style choices relevant to the SLE Written Expression test.`,
};

/**
 * Generate a cache key from the question and context
 */
function getCacheKey(question: string, context: string): string {
  const normalized = question.toLowerCase().trim().replace(/\s+/g, " ");
  return `${context}:${normalized}`;
}

/**
 * Clean expired entries from cache
 */
function cleanCache(): void {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
  // If still over limit, remove least-hit entries
  if (responseCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(responseCache.entries())
      .sort((a, b) => a[1].hits - b[1].hits);
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    for (const [key] of toRemove) {
      responseCache.delete(key);
    }
  }
}

/**
 * Get AI response with caching
 */
export async function getAIResponse(
  question: string,
  context: string = "general",
  userId?: number,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<{ response: string; cached: boolean; responseTime: number }> {
  const startTime = Date.now();
  
  // Check cache first (only for single questions without conversation history)
  if (!conversationHistory || conversationHistory.length === 0) {
    const cacheKey = getCacheKey(question, context);
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      cached.hits++;
      return {
        response: cached.response,
        cached: true,
        responseTime: Date.now() - startTime,
      };
    }
  }

  // Build messages array
  const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.general;
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history if provided
  if (conversationHistory) {
    for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: question });

  try {
    // Call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
    
    if (!apiKey) {
      return {
        response: "AI Companion is not configured. Please contact an administrator.",
        cached: false,
        responseTime: Date.now() - startTime,
      };
    }

    const res = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[AI Companion] API error:", res.status, errorText);
      return {
        response: "I'm having trouble connecting right now. Please try again in a moment.",
        cached: false,
        responseTime: Date.now() - startTime,
      };
    }

    const data = await res.json() as any;
    const responseText = data.choices?.[0]?.message?.content || "No response generated.";

    // Cache the response
    if (!conversationHistory || conversationHistory.length === 0) {
      const cacheKey = getCacheKey(question, context);
      responseCache.set(cacheKey, {
        response: responseText,
        timestamp: Date.now(),
        hits: 0,
      });
      cleanCache();
    }

    // Log interaction for analytics
    try {
      const db = await getDb();
      await db.insert(schema.aiInteractionLogs).values({
        userId: userId || 0,
        question: question.substring(0, 500),
        context,
        responseTime: Date.now() - startTime,
        cached: false,
        tokenCount: data.usage?.total_tokens || 0,
      });
    } catch (logErr) {
      // Non-critical, don't fail the response
      console.error("[AI Companion] Failed to log interaction:", logErr);
    }

    return {
      response: responseText,
      cached: false,
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error("[AI Companion] Error:", error);
    return {
      response: "I encountered an error processing your request. Please try again.",
      cached: false,
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  cleanCache();
  let totalHits = 0;
  for (const entry of responseCache.values()) {
    totalHits += entry.hits;
  }
  return {
    size: responseCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL,
    totalHits,
  };
}

/**
 * Clear the AI response cache
 */
export function clearCache(): void {
  responseCache.clear();
}
