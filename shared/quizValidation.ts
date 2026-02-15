/**
 * Quiz JSON Validation Utility
 * 
 * Validates quiz content JSON structure for the 7-slot LMS architecture.
 * Used by both server-side (admin import/validation) and client-side (QuizRenderer).
 */

export interface QuizValidationResult {
  valid: boolean;
  questionCount: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validate quiz JSON content string.
 * Checks for:
 * - Valid JSON structure
 * - Required fields (question text, options, correct answer)
 * - Option count (minimum 2 for multiple choice)
 * - Correct answer references valid option
 * - No duplicate question IDs
 */
export function validateQuizJson(content: string): QuizValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let questionCount = 0;

  if (!content || !content.trim()) {
    return { valid: false, questionCount: 0, errors: ["Empty content"], warnings: [] };
  }

  // Extract JSON from markdown code block or raw content
  let jsonStr = "";
  const codeBlockMatch = content.match(/```json\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    const idx = content.indexOf("{");
    if (idx === -1) {
      return { valid: false, questionCount: 0, errors: ["No JSON object found in content"], warnings: [] };
    }
    let depth = 0;
    let endIdx = -1;
    for (let i = idx; i < content.length; i++) {
      if (content[i] === "{") depth++;
      if (content[i] === "}") depth--;
      if (depth === 0) { endIdx = i; break; }
    }
    if (endIdx === -1) {
      return { valid: false, questionCount: 0, errors: ["Malformed JSON: unmatched braces"], warnings: [] };
    }
    jsonStr = content.substring(idx, endIdx + 1);
  }

  // Parse JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e: any) {
    // Try sanitizing common issues
    try {
      const sanitized = jsonStr.replace(/\\'/g, "'").replace(/\\([^"\\\/bfnrtu])/g, "$1");
      parsed = JSON.parse(sanitized);
      warnings.push("JSON required sanitization (escape sequence fixes applied)");
    } catch {
      return { valid: false, questionCount: 0, errors: [`Invalid JSON: ${e.message}`], warnings: [] };
    }
  }

  // Extract questions array
  let rawQuestions: Record<string, unknown>[] = [];
  if (Array.isArray(parsed.questions)) {
    rawQuestions = parsed.questions;
  } else if (Array.isArray(parsed.quiz)) {
    rawQuestions = parsed.quiz;
  } else {
    const numericKeys = Object.keys(parsed).filter(k => /^\d+$/.test(k));
    if (numericKeys.length > 0) {
      rawQuestions = numericKeys.map(k => parsed[k] as Record<string, unknown>);
    }
  }

  if (rawQuestions.length === 0) {
    errors.push("No questions found in quiz JSON");
    return { valid: false, questionCount: 0, errors, warnings };
  }

  questionCount = rawQuestions.length;
  const seenIds = new Set<number>();

  rawQuestions.forEach((q, i) => {
    const qNum = i + 1;
    const questionText = String(q.question ?? q.question_text ?? q.text ?? "").trim();
    
    if (!questionText) {
      errors.push(`Question ${qNum}: Missing question text`);
    }

    // Check options for multiple choice
    const rawType = String(q.type ?? q.question_type ?? "multiple-choice").toLowerCase();
    const isMC = !rawType.includes("fill") && !rawType.includes("blank");
    
    if (isMC) {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Question ${qNum}: Multiple choice requires at least 2 options`);
      }
    }

    // Check correct answer exists
    const answer = q.answer ?? q.correct_answer;
    if (answer === undefined || answer === null || answer === "") {
      errors.push(`Question ${qNum}: Missing correct answer`);
    } else if (isMC && Array.isArray(q.options)) {
      // Verify answer references a valid option
      if (typeof answer === "number") {
        if (answer < 0 || answer >= q.options.length) {
          if (answer < 1 || answer > q.options.length) {
            warnings.push(`Question ${qNum}: Answer index ${answer} may be out of range`);
          }
        }
      } else {
        const ansStr = String(answer).trim().toLowerCase();
        const matchFound = q.options.some((o: any) => String(o).trim().toLowerCase() === ansStr);
        if (!matchFound) {
          warnings.push(`Question ${qNum}: Answer "${String(answer).substring(0, 50)}" doesn't exactly match any option`);
        }
      }
    }

    // Check for duplicate IDs
    const id = Number(q.id ?? q.question_number ?? qNum);
    if (seenIds.has(id)) {
      warnings.push(`Question ${qNum}: Duplicate ID ${id}`);
    }
    seenIds.add(id);
  });

  return {
    valid: errors.length === 0,
    questionCount,
    errors,
    warnings,
  };
}
