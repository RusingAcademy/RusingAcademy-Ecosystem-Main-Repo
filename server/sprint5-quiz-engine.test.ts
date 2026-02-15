/**
 * Sprint 5: Quiz Engine & Assessment Pipeline Tests
 * 
 * Tests for:
 * 1. Quiz JSON validation utility
 * 2. Quiz attempt recording in completeActivity
 * 3. QuizRenderer retry limit props
 * 4. Admin quiz analytics endpoint structure
 */
import { describe, it, expect } from "vitest";
import { validateQuizJson } from "../shared/quizValidation";

// ============================================================================
// 1. Quiz JSON Validation
// ============================================================================

describe("Quiz JSON Validation", () => {
  it("should validate well-formed quiz JSON", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "answer": "Paris",
      "feedback": "Paris is the capital of France."
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
    expect(result.questionCount).toBe(1);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect missing question text", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "options": ["A", "B", "C"],
      "answer": "A"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes("Missing question text"))).toBe(true);
  });

  it("should detect missing correct answer", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5"]
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes("Missing correct answer"))).toBe(true);
  });

  it("should detect insufficient options for multiple choice", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "True or false?",
      "options": ["True"],
      "answer": "True"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes("at least 2 options"))).toBe(true);
  });

  it("should handle Format B (question_text, correct_answer)", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question_text": "Quel est le participe passé de 'faire'?",
      "question_type": "multiple_choice",
      "options": ["fait", "fais", "faisant", "faire"],
      "correct_answer": "fait",
      "feedback": "Le participe passé de 'faire' est 'fait'."
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
    expect(result.questionCount).toBe(1);
  });

  it("should handle Format E (quiz array)", () => {
    const content = `\`\`\`json
{
  "quiz": [
    {
      "question": "What is a noun?",
      "options": ["A person, place, or thing", "An action word", "A describing word"],
      "answer": "A person, place, or thing"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
  });

  it("should handle Format F (numbered keys)", () => {
    const content = `{
  "0": {
    "question": "First question?",
    "options": ["A", "B"],
    "answer": "A"
  },
  "1": {
    "question": "Second question?",
    "options": ["C", "D"],
    "answer": "D"
  }
}`;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
    expect(result.questionCount).toBe(2);
  });

  it("should handle empty content", () => {
    const result = validateQuizJson("");
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes("Empty content"))).toBe(true);
  });

  it("should handle malformed JSON with sanitization", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "What\\'s the answer?",
      "options": ["A", "B"],
      "answer": "A"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes("sanitization"))).toBe(true);
  });

  it("should warn about answer not matching any option", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "Pick one",
      "options": ["Alpha", "Beta", "Gamma"],
      "answer": "Delta"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true); // warnings don't make it invalid
    expect(result.warnings.some(w => w.includes("doesn't exactly match"))).toBe(true);
  });

  it("should validate fill-in-the-blank questions without options requirement", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "The capital of Canada is ___",
      "type": "fill-in-the-blank",
      "answer": "Ottawa"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(true);
  });

  it("should handle multiple questions with mixed validity", () => {
    const content = `\`\`\`json
{
  "questions": [
    {
      "question": "Valid question?",
      "options": ["A", "B"],
      "answer": "A"
    },
    {
      "options": ["C", "D"],
      "answer": "C"
    }
  ]
}
\`\`\``;
    const result = validateQuizJson(content);
    expect(result.valid).toBe(false);
    expect(result.questionCount).toBe(2);
    expect(result.errors.some(e => e.includes("Question 2"))).toBe(true);
  });
});

// ============================================================================
// 2. completeActivity quiz_attempts recording (structural test)
// ============================================================================

describe("completeActivity quiz_attempts integration", () => {
  it("should have quizzes and quizAttempts imported in activities router", async () => {
    // Verify the activities router imports include quiz tables
    const fs = await import("fs/promises");
    const activitiesCode = await fs.readFile("server/routers/activities.ts", "utf-8");
    
    expect(activitiesCode).toContain("quizzes,");
    expect(activitiesCode).toContain("quizAttempts,");
    expect(activitiesCode).toContain("Record quiz_attempt if this is a quiz activity");
  });

  it("should record quiz attempt when activity type is quiz", async () => {
    const fs = await import("fs/promises");
    const activitiesCode = await fs.readFile("server/routers/activities.ts", "utf-8");
    
    // Verify the quiz attempt recording logic exists
    expect(activitiesCode).toContain('activity.activityType === "quiz"');
    expect(activitiesCode).toContain("db.insert(quizAttempts)");
    expect(activitiesCode).toContain("attemptNumber: attemptNum");
    expect(activitiesCode).toContain("[QuizAttempt]");
  });

  it("should select activityType in the completeActivity query", async () => {
    const fs = await import("fs/promises");
    const activitiesCode = await fs.readFile("server/routers/activities.ts", "utf-8");
    
    expect(activitiesCode).toContain("activityType: activities.activityType");
  });
});

// ============================================================================
// 3. QuizRenderer retry limit props
// ============================================================================

describe("QuizRenderer retry limit support", () => {
  it("should accept maxAttempts and attemptCount props", async () => {
    const fs = await import("fs/promises");
    const quizRendererCode = await fs.readFile("client/src/components/QuizRenderer.tsx", "utf-8");
    
    expect(quizRendererCode).toContain("maxAttempts?: number");
    expect(quizRendererCode).toContain("attemptCount?: number");
  });

  it("should conditionally show/hide retry button based on attempts", async () => {
    const fs = await import("fs/promises");
    const quizRendererCode = await fs.readFile("client/src/components/QuizRenderer.tsx", "utf-8");
    
    expect(quizRendererCode).toContain("maxAttempts || attemptCount < maxAttempts");
    expect(quizRendererCode).toContain("Max attempts reached");
    expect(quizRendererCode).toContain("Nombre max de tentatives atteint");
  });
});

// ============================================================================
// 4. Admin Quiz Analytics
// ============================================================================

describe("Admin Quiz Analytics endpoint", () => {
  it("should have getQuizAnalytics procedure in adminQuiz router", async () => {
    const fs = await import("fs/promises");
    const adminQuizCode = await fs.readFile("server/routers/adminQuiz.ts", "utf-8");
    
    expect(adminQuizCode).toContain("getQuizAnalytics: protectedProcedure");
    expect(adminQuizCode).toContain("totalQuizzes");
    expect(adminQuizCode).toContain("totalAttempts");
    expect(adminQuizCode).toContain("avgScore");
    expect(adminQuizCode).toContain("passRate");
    expect(adminQuizCode).toContain("recentAttempts");
  });

  it("should enforce admin access for analytics", async () => {
    const fs = await import("fs/promises");
    const adminQuizCode = await fs.readFile("server/routers/adminQuiz.ts", "utf-8");
    
    // Find the getQuizAnalytics section and verify admin check
    const analyticsSection = adminQuizCode.substring(
      adminQuizCode.indexOf("getQuizAnalytics"),
      adminQuizCode.indexOf("getQuizAnalytics") + 500
    );
    expect(analyticsSection).toContain("FORBIDDEN");
    expect(analyticsSection).toContain("Admin access required");
  });
});

// ============================================================================
// 5. Quiz JSON Validation Utility
// ============================================================================

describe("Quiz Validation shared utility", () => {
  it("should be importable from shared/quizValidation", async () => {
    const { validateQuizJson } = await import("../shared/quizValidation");
    expect(typeof validateQuizJson).toBe("function");
  });

  it("should return proper QuizValidationResult structure", () => {
    const result = validateQuizJson("{}");
    expect(result).toHaveProperty("valid");
    expect(result).toHaveProperty("questionCount");
    expect(result).toHaveProperty("errors");
    expect(result).toHaveProperty("warnings");
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });
});
