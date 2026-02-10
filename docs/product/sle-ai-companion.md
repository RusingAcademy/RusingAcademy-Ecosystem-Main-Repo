# Product Spec: SLE AI Companion v2

**Author**: Manus AI
**Date**: 2026-02-09
**Status**: In Development

## 1. Overview

The **SLE AI Companion v2** is a significant upgrade to the existing AI coaching widget. It transforms the tool from a simple chatbot into a structured, pedagogically-grounded training system designed to prepare Canadian federal public servants for the Public Service Commission's Oral Language Assessment (OLA).

This upgrade is driven by a 700+ record training dataset, a new session orchestration layer, and a sophisticated scoring engine.

## 2. Key Changes

### 2.1. Coach Roster

-   **Removed**: Sue-Anne and Erika have been removed as AI coaches.
-   **Retained**: Steven (French) and Preciosa (English) are the two exclusive AI coaches.
-   **Backward Compatibility**: Sessions initiated with legacy coach IDs (`SUE_ANNE`, `ERIKA`) are transparently redirected to Steven's persona and voice to avoid breaking existing user sessions.

### 2.2. Pedagogical Framework

The Companion now operates on a structured pedagogical framework derived from official PSC and Treasury Board standards. [1][2][3]

-   **Four-Part Structure**: Practice sessions mirror the four parts of the official OLA: (I) Warm-up, (II) Listening & Summarizing, (III) In-depth Discussion, and (IV) Role-play.
-   **Targeted Levels**: All content (scenarios, questions, rubrics) is explicitly tagged for levels A, B, or C.
-   **Comprehensive Rubrics**: The AI evaluates users against 5 criteria: Fluency, Comprehension, Vocabulary, Grammar, and Pronunciation, using detailed, level-specific rubrics.

### 2.3. The Training Dataset (`/data/sle`)

A new, comprehensive dataset now powers the entire experience. This dataset is version-controlled and includes:

-   **60 Scenarios**: Realistic workplace situations for each of the four OLA parts.
-   **240 Questions**: A bank of questions for the AI to draw from.
-   **20 Listening Assets**: Voicemails and conversations for Part II practice.
-   **200 Common Errors**: A database of typical mistakes made by learners, which the AI can now detect and correct.
-   **80 Feedback Templates**: For generating consistent and helpful feedback.
-   **60 Answer Guides**: Internal guides for the AI to understand the expectations for each scenario.

### 2.4. New Runtime Engine

Three new services orchestrate the user experience:

1.  **Dataset Service**: Loads the 700+ records from the `/data/sle` directory into memory for fast access.
2.  **Session Orchestrator**: Manages the flow of a practice session, progressing the user through the four OLA parts and selecting appropriate scenarios and questions from the dataset.
3.  **Scoring Service**: Implements the official grading logic. It calculates a composite score based on the 5 criteria, identifies strengths and weaknesses, and generates a detailed end-of-session report.

## 3. User Experience Flow

1.  **Initiation**: The user selects a coach (Steven or Preciosa) and a target level (A, B, or C).
2.  **Session Start**: The `sleSessionOrchestrator` initializes a new session.
    -   It selects a random scenario and a set of questions for Part I from the dataset.
    -   It builds a dynamic context string containing the rubrics, common errors, and scenario details for the AI coach.
3.  **Practice Loop**: The user interacts with the AI coach.
    -   The orchestrator guides the conversation through the four parts of the OLA.
    -   For Part II, it provides a listening asset (voicemail/conversation) for the user to summarize.
    -   The `sleScoringService` detects common errors in the user's input in real-time.
4.  **Feedback**: The user receives feedback.
    -   **Practice Mode**: Gentle, immediate corrections are provided after each turn.
    -   **Exam Simulation Mode**: No feedback is given until the end of the session to mimic real exam conditions.
5.  **Session End**: A detailed report is generated, including:
    -   An overall score (0-100) and corresponding level (A, B, C).
    -   A breakdown of scores for each of the 5 criteria.
    -   A list of identified strengths and weaknesses.
    -   Specific, actionable recommendations for improvement.

## 4. Technical Implementation

-   **Data Storage**: All training data is stored in version-controlled JSONL files in the `/data/sle/seed` directory.
-   **Validation**: A validation script (`pnpm sle:data:validate`) ensures all data conforms to the JSON schemas defined in `/data/sle/schema`.
-   **Modularity**: The separation of data (JSONL files), loading (Dataset Service), and logic (Orchestrator/Scoring) makes the system highly extensible.

## 5. Future Work

-   **Database Seeding**: Implement the `pnpm sle:data:seed` script to import the JSONL data into the production TiDB database.
-   **Frontend Integration**: Update the `SLEAICompanionWidgetMultiCoach.tsx` component to call the new session orchestration endpoints and display the structured session flow and final report.
-   **Admin Interface**: Create an admin panel to view session history, user progress, and dataset contents.

---

### References

[1]: Public Service Commission of Canada. "About the Oral Language Assessment (OLA)". [https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/oral-language-assessment-sle/about-the-test.html](https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/oral-language-assessment-sle/about-the-test.html)

[2]: Public Service Commission of Canada. "Second Language Evaluation - Written Expression". [https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/second-language-evaluation-writing/the-test.html](https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/second-language-evaluation-writing/the-test.html)

[3]: Treasury Board of Canada Secretariat. "Qualification Standards in Relation to Official Languages". [https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/relation-official-languages.html](https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/relation-official-languages.html)
