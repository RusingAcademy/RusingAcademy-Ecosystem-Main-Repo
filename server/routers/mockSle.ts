/**
 * Mock SLE Exam Router
 * 
 * Provides endpoints for the MockSLEExam page:
 * - generateQuestions: AI-powered question generation for reading/writing/oral exams
 * - create: Create a new mock exam attempt record
 * - complete: Complete an exam and record the score
 * - getHistory: Get user's exam history
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { slePracticeAttempts, slePracticeQuestions, users } from "../../drizzle/schema";

// ─── Types ───────────────────────────────────────────────────────────
interface ReadingPassage {
  title: string;
  text: string;
  questions: {
    prompt: string;
    options: string[];
    correctAnswer: string;
    scenario?: string;
  }[];
}

interface WritingPrompt {
  type: string;
  scenario: string;
  instructions: string;
}

// ─── Fallback Question Banks ─────────────────────────────────────────
// Used when AI generation is unavailable or as seed data

const readingPassages: Record<string, ReadingPassage[]> = {
  B1: [
    {
      title: "Workplace Communication Policy",
      text: "The Government of Canada is committed to providing services in both official languages. All federal employees in bilingual positions are expected to communicate with colleagues and the public in the official language of their choice. Managers must ensure that team meetings accommodate both English and French speakers. Written communications, including emails and reports, should be available in both languages when they serve a broad audience. The Official Languages Act establishes the framework for these obligations and provides mechanisms for complaints and resolution.",
      questions: [
        { prompt: "What is the main purpose of this policy?", options: ["To promote English only", "To ensure bilingual service delivery", "To reduce communication", "To eliminate French"], correctAnswer: "To ensure bilingual service delivery" },
        { prompt: "Who must ensure bilingual meetings?", options: ["Employees", "Managers", "The public", "External consultants"], correctAnswer: "Managers" },
        { prompt: "What legislation establishes this framework?", options: ["The Charter of Rights", "The Official Languages Act", "The Employment Act", "The Privacy Act"], correctAnswer: "The Official Languages Act" },
      ],
    },
    {
      title: "Professional Development Memo",
      text: "Please be advised that the annual professional development budget has been approved for the upcoming fiscal year. Each employee is entitled to up to $2,000 for training activities directly related to their position. Requests must be submitted through the Learning Management System at least four weeks before the planned activity. Priority will be given to language training, digital skills, and leadership development. Employees who have not used their allocation from the previous year cannot carry it forward.",
      questions: [
        { prompt: "What is the maximum training budget per employee?", options: ["$1,000", "$1,500", "$2,000", "$2,500"], correctAnswer: "$2,000" },
        { prompt: "How far in advance must requests be submitted?", options: ["Two weeks", "Three weeks", "Four weeks", "Six weeks"], correctAnswer: "Four weeks" },
        { prompt: "Can unused funds be carried forward?", options: ["Yes, always", "No, they cannot", "Only with approval", "Only for language training"], correctAnswer: "No, they cannot" },
      ],
    },
  ],
  B2: [
    {
      title: "Interdepartmental Collaboration Framework",
      text: "The Treasury Board Secretariat has released updated guidelines for interdepartmental collaboration on horizontal policy initiatives. The framework emphasizes the importance of establishing clear governance structures, including steering committees with representation from all participating departments. Resource-sharing agreements must be formalized through Memoranda of Understanding (MOUs) that specify each department's contributions, timelines, and accountability measures. The framework also introduces a new digital collaboration platform to facilitate real-time document sharing and project tracking across departmental boundaries.",
      questions: [
        { prompt: "What type of agreements formalize resource sharing?", options: ["Verbal agreements", "Memoranda of Understanding", "Email confirmations", "Press releases"], correctAnswer: "Memoranda of Understanding" },
        { prompt: "What new tool does the framework introduce?", options: ["A new email system", "A digital collaboration platform", "A telephone hotline", "A paper filing system"], correctAnswer: "A digital collaboration platform" },
        { prompt: "Who released the updated guidelines?", options: ["The Prime Minister's Office", "The Treasury Board Secretariat", "The Senate", "The Supreme Court"], correctAnswer: "The Treasury Board Secretariat" },
      ],
    },
  ],
  C1: [
    {
      title: "Policy Analysis: Indigenous Reconciliation in Federal Institutions",
      text: "The implementation of the Truth and Reconciliation Commission's Calls to Action within federal institutions requires a nuanced understanding of both systemic barriers and transformative opportunities. Deputy Ministers have been directed to integrate reconciliation objectives into departmental strategic plans, ensuring that Indigenous perspectives inform policy development at every stage. This necessitates not merely consultative engagement but substantive co-development of policies that affect Indigenous communities. The challenge lies in reconciling the hierarchical nature of federal governance with the consensus-based decision-making traditions of many Indigenous nations, requiring institutional flexibility that has historically been difficult to achieve within the public service's established frameworks.",
      questions: [
        { prompt: "What is the primary challenge identified in the text?", options: ["Budget constraints", "Reconciling governance approaches", "Staff shortages", "Technology limitations"], correctAnswer: "Reconciling governance approaches" },
        { prompt: "What level of engagement does the text advocate for?", options: ["Consultative only", "Substantive co-development", "Minimal involvement", "External contracting"], correctAnswer: "Substantive co-development" },
        { prompt: "Who has been directed to integrate reconciliation objectives?", options: ["All employees", "Deputy Ministers", "External consultants", "Provincial governments"], correctAnswer: "Deputy Ministers" },
      ],
    },
  ],
};

const writingPrompts: Record<string, WritingPrompt[]> = {
  B1: [
    { type: "Email", scenario: "Your team is organizing a bilingual workshop on workplace wellness.", instructions: "Write a professional email inviting colleagues from another department to participate. Include the date, time, location, and a brief description of the workshop content." },
    { type: "Memo", scenario: "The office is implementing a new flexible work arrangement policy.", instructions: "Write a short memo to your team explaining the key changes and how they can request flexible work hours." },
  ],
  B2: [
    { type: "Report Summary", scenario: "You have completed a review of your department's client service satisfaction survey results.", instructions: "Write a summary of the findings, highlighting three key areas of improvement and recommending specific actions for each." },
    { type: "Briefing Note", scenario: "Your Director has asked for a briefing on the impact of remote work on team productivity.", instructions: "Prepare a concise briefing note with background, current situation analysis, and three recommendations." },
  ],
  C1: [
    { type: "Policy Brief", scenario: "The government is considering new regulations for AI use in public service decision-making.", instructions: "Write a policy brief analyzing the potential benefits and risks, considering ethical implications, privacy concerns, and operational efficiency. Include recommendations for a balanced regulatory framework." },
  ],
};

const oralQuestions: Record<string, { prompt: string; options: string[]; correctAnswer: string }[]> = {
  B1: [
    { prompt: "Your colleague asks about the new vacation policy. How would you explain it?", options: ["I don't know anything about it", "The new policy allows employees to carry over up to 5 unused days to the next fiscal year", "Vacation is cancelled", "Ask someone else"], correctAnswer: "The new policy allows employees to carry over up to 5 unused days to the next fiscal year" },
    { prompt: "During a meeting, your manager asks for your opinion on a proposed timeline. What is the most professional response?", options: ["I don't care", "The timeline seems ambitious but achievable if we allocate additional resources to the critical path", "Whatever you decide", "That's not my job"], correctAnswer: "The timeline seems ambitious but achievable if we allocate additional resources to the critical path" },
    { prompt: "A client calls and is upset about a delayed service. How do you respond?", options: ["It's not my fault", "I understand your frustration. Let me look into the status of your request and provide you with an update", "Call back later", "I can't help you"], correctAnswer: "I understand your frustration. Let me look into the status of your request and provide you with an update" },
  ],
  B2: [
    { prompt: "You need to present a complex policy change to stakeholders. How would you structure your presentation?", options: ["Just read the policy document", "Begin with context and rationale, present key changes with examples, address anticipated concerns, and conclude with implementation timeline", "Skip the presentation", "Send an email instead"], correctAnswer: "Begin with context and rationale, present key changes with examples, address anticipated concerns, and conclude with implementation timeline" },
    { prompt: "A colleague from another department disagrees with your analysis. How do you handle the situation?", options: ["Ignore them", "Acknowledge their perspective, present supporting evidence for your position, and suggest a collaborative approach to reconcile differences", "Argue loudly", "Complain to management"], correctAnswer: "Acknowledge their perspective, present supporting evidence for your position, and suggest a collaborative approach to reconcile differences" },
  ],
  C1: [
    { prompt: "You are asked to defend a controversial policy recommendation to senior management. How do you approach this?", options: ["Avoid the meeting", "Present a comprehensive analysis including evidence-based arguments, acknowledge counterpoints with reasoned rebuttals, and demonstrate how the recommendation aligns with strategic objectives while mitigating identified risks", "Just agree with whatever they say", "Delegate to someone else"], correctAnswer: "Present a comprehensive analysis including evidence-based arguments, acknowledge counterpoints with reasoned rebuttals, and demonstrate how the recommendation aligns with strategic objectives while mitigating identified risks" },
  ],
};

// ─── Router ──────────────────────────────────────────────────────────
export const mockSleRouter = router({
  /**
   * Generate questions for a mock SLE exam
   * Returns passages (reading), prompts (writing), or questions (oral)
   */
  generateQuestions: protectedProcedure
    .input(z.object({
      examType: z.enum(["reading", "writing", "oral"]),
      cefrLevel: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { examType, cefrLevel } = input;
      const level = cefrLevel as keyof typeof readingPassages;

      // Try AI generation first, fall back to question bank
      try {
        const { invokeLLM } = await import("../_core/llm");
        
        if (examType === "reading") {
          const prompt = `Generate 2 reading comprehension passages for a ${cefrLevel} level Second Language Evaluation (SLE) exam for Canadian federal public servants. 
          
Each passage should be 150-250 words about a workplace topic (policy, memo, report, etc.) and include 3 multiple-choice questions with 4 options each.

Return ONLY valid JSON in this exact format:
{
  "passages": [
    {
      "title": "Passage Title",
      "text": "Full passage text...",
      "questions": [
        {
          "prompt": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option B"
        }
      ]
    }
  ]
}`;
          
          const result = await invokeLLM(prompt);
          try {
            const parsed = JSON.parse(result);
            if (parsed.passages?.length > 0) return parsed;
          } catch {
            // Fall through to fallback
          }
        }
        
        if (examType === "writing") {
          const prompt = `Generate 2 writing prompts for a ${cefrLevel} level SLE exam for Canadian federal public servants.

Each prompt should be a realistic workplace writing task (email, memo, briefing note, report summary).

Return ONLY valid JSON:
{
  "prompts": [
    {
      "type": "Email",
      "scenario": "Context description...",
      "instructions": "What to write..."
    }
  ]
}`;
          
          const result = await invokeLLM(prompt);
          try {
            const parsed = JSON.parse(result);
            if (parsed.prompts?.length > 0) return parsed;
          } catch {
            // Fall through to fallback
          }
        }
        
        if (examType === "oral") {
          const prompt = `Generate 5 oral comprehension questions for a ${cefrLevel} level SLE exam for Canadian federal public servants.

Each question should present a workplace scenario with 4 response options.

Return ONLY valid JSON:
{
  "questions": [
    {
      "prompt": "Scenario/question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    }
  ]
}`;
          
          const result = await invokeLLM(prompt);
          try {
            const parsed = JSON.parse(result);
            if (parsed.questions?.length > 0) return parsed;
          } catch {
            // Fall through to fallback
          }
        }
      } catch (error) {
        console.error("[MockSLE] AI generation failed, using fallback:", error);
      }

      // Fallback to static question banks
      if (examType === "reading") {
        const passages = readingPassages[level] || readingPassages["B1"];
        return { passages };
      }
      
      if (examType === "writing") {
        const prompts = writingPrompts[level] || writingPrompts["B1"];
        return { prompts };
      }
      
      if (examType === "oral") {
        const questions = oralQuestions[level] || oralQuestions["B1"];
        return { questions };
      }

      return { passages: [], prompts: [], questions: [] };
    }),

  /**
   * Create a new mock exam record
   */
  create: protectedProcedure
    .input(z.object({
      examType: z.enum(["reading", "writing", "oral"]),
      cefrLevel: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        // Return a mock record if DB not available
        return {
          id: Date.now(),
          examType: input.examType,
          cefrLevel: input.cefrLevel,
          status: "in_progress",
          createdAt: new Date(),
        };
      }

      // Use slePracticeAttempts to store mock exam records
      // We create a placeholder question reference
      const [result] = await db.insert(slePracticeAttempts).values({
        userId: ctx.user!.id,
        questionId: 1, // Placeholder — mock exams don't map to individual questions
        sessionType: "simulation",
        userAnswer: JSON.stringify({ examType: input.examType, cefrLevel: input.cefrLevel }),
        isCorrect: null,
        score: null,
        timeSpent: null,
        aiFeedback: null,
      });

      return {
        id: result.insertId,
        examType: input.examType,
        cefrLevel: input.cefrLevel,
        status: "in_progress",
        createdAt: new Date(),
      };
    }),

  /**
   * Complete a mock exam and record the score
   */
  complete: protectedProcedure
    .input(z.object({
      examId: z.number().optional(),
      score: z.number().min(0).max(100),
      examType: z.enum(["reading", "writing", "oral"]),
      cefrLevel: z.string(),
      timeSpent: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        return { success: true, score: input.score };
      }

      if (input.examId) {
        await db.update(slePracticeAttempts)
          .set({
            score: input.score,
            isCorrect: input.score >= 70,
            timeSpent: input.timeSpent || null,
          })
          .where(and(
            eq(slePracticeAttempts.id, input.examId),
            eq(slePracticeAttempts.userId, ctx.user!.id),
          ));
      }

      return { success: true, score: input.score };
    }),

  /**
   * Get user's mock exam history
   */
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const attempts = await db.select()
      .from(slePracticeAttempts)
      .where(and(
        eq(slePracticeAttempts.userId, ctx.user!.id),
        eq(slePracticeAttempts.sessionType, "simulation"),
      ))
      .orderBy(desc(slePracticeAttempts.createdAt))
      .limit(50);

    return attempts.map((a) => {
      let examType = "reading";
      let cefrLevel = "B1";
      try {
        const parsed = JSON.parse(a.userAnswer || "{}");
        examType = parsed.examType || "reading";
        cefrLevel = parsed.cefrLevel || "B1";
      } catch {
        // Use defaults
      }

      return {
        id: a.id,
        examType,
        cefrLevel,
        score: a.score,
        status: a.score !== null ? "completed" : "in_progress",
        timeSpent: a.timeSpent,
        createdAt: a.createdAt,
      };
    });
  }),
});
