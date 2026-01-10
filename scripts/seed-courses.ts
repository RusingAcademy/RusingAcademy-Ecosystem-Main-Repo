/**
 * Seed Course Content for Lingueefy
 * 
 * This script populates the database with real SLE (Second Language Evaluation) course content.
 * Run with: npx tsx scripts/seed-courses.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { courses, courseModules, lessons } from "../drizzle/schema";

// Database connection using DATABASE_URL
const db = drizzle(process.env.DATABASE_URL!);

console.log('Connected to database');

// ============================================================================
// COURSE DATA - Real SLE Content (matching actual schema)
// ============================================================================

const coursesData = [
  {
    slug: 'sle-oral-expression-fundamentals',
    title: 'SLE Oral Expression Fundamentals',
    shortDescription: 'Master the basics of French oral expression for the Public Service. Prepare for Level B and C oral tests.',
    description: `This comprehensive course prepares you for the SLE Oral Expression test (Level B and C). You'll learn essential communication strategies, vocabulary for workplace scenarios, and techniques to express yourself clearly and professionally in French.

Key topics include:
- Understanding the SLE oral test format and evaluation criteria
- Building workplace vocabulary and expressions
- Developing fluency through structured practice
- Mastering opinion expression and argumentation
- Handling common workplace scenarios with confidence`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'sle_oral' as const,
    level: 'intermediate' as const,
    targetLanguage: 'french' as const,
    price: 29900, // $299.00
    originalPrice: 39900,
    accessType: 'one_time' as const,
    totalModules: 6,
    totalLessons: 24,
    totalDurationMinutes: 1200, // 20 hours
    thumbnailUrl: '/images/courses/sle-oral-expression.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=LEc84vX0xe0',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
  {
    slug: 'sle-written-expression-mastery',
    title: 'SLE Written Expression Mastery',
    shortDescription: 'Achieve Level B/C in French written expression. Master professional email and report writing.',
    description: `Master the art of professional French writing for the Public Service. This course covers all aspects of the SLE Written Expression test, from email composition to formal reports.

You will learn:
- Professional email and memo writing
- Report and briefing note structure
- Grammar and syntax for formal writing
- Common errors and how to avoid them
- Time management strategies for the test`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'sle_written' as const,
    level: 'intermediate' as const,
    targetLanguage: 'french' as const,
    price: 34900, // $349.00
    originalPrice: 44900,
    accessType: 'one_time' as const,
    totalModules: 6,
    totalLessons: 30,
    totalDurationMinutes: 1500, // 25 hours
    thumbnailUrl: '/images/courses/sle-written-expression.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=SuuhMpF5KoA',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
  {
    slug: 'sle-reading-comprehension-excellence',
    title: 'SLE Reading Comprehension Excellence',
    shortDescription: 'Develop advanced French reading skills for the SLE. Master text analysis and question strategies.',
    description: `Enhance your French reading comprehension skills to excel in the SLE Reading test. This course provides strategies for understanding complex texts, identifying key information, and answering questions efficiently.

Course highlights:
- Understanding different text types (memos, reports, policies)
- Vocabulary building for workplace contexts
- Speed reading techniques
- Question analysis strategies
- Practice with authentic SLE-style passages`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'sle_reading' as const,
    level: 'intermediate' as const,
    targetLanguage: 'french' as const,
    price: 24900, // $249.00
    originalPrice: 34900,
    accessType: 'one_time' as const,
    totalModules: 5,
    totalLessons: 20,
    totalDurationMinutes: 900, // 15 hours
    thumbnailUrl: '/images/courses/sle-reading-comprehension.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=rAdJZ4o_N2Y',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
  {
    slug: 'sle-level-c-advanced-oral',
    title: 'SLE Level C: Advanced Oral Proficiency',
    shortDescription: 'Achieve the highest level of French oral proficiency. Advanced techniques for Level C success.',
    description: `This advanced course is designed for candidates targeting Level C in the SLE Oral Expression test. You'll develop sophisticated communication skills, nuanced expression, and the ability to handle complex workplace scenarios.

Advanced topics include:
- Nuanced opinion expression and debate
- Complex grammatical structures
- Idiomatic expressions and cultural references
- Handling unexpected questions with poise
- Advanced argumentation techniques`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'sle_oral' as const,
    level: 'advanced' as const,
    targetLanguage: 'french' as const,
    price: 44900, // $449.00
    originalPrice: 59900,
    accessType: 'one_time' as const,
    totalModules: 7,
    totalLessons: 35,
    totalDurationMinutes: 1800, // 30 hours
    thumbnailUrl: '/images/courses/sle-level-c-mastery.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=LEc84vX0xe0',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
  {
    slug: 'workplace-french-essentials',
    title: 'Workplace French Essentials',
    shortDescription: 'Build practical French skills for the Canadian workplace. Perfect for beginners.',
    description: `A practical course focused on everyday French communication in the Canadian public service workplace. Perfect for those starting their bilingualism journey or needing to refresh their skills.

You will master:
- Common workplace greetings and expressions
- Meeting participation and presentation skills
- Email and phone communication
- Discussing projects and deadlines
- Networking and professional relationship building`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'business_french' as const,
    level: 'beginner' as const,
    targetLanguage: 'french' as const,
    price: 14900, // $149.00
    originalPrice: 19900,
    accessType: 'one_time' as const,
    totalModules: 4,
    totalLessons: 16,
    totalDurationMinutes: 720, // 12 hours
    thumbnailUrl: '/images/courses/workplace-french.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=SuuhMpF5KoA',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
  {
    slug: 'sle-complete-preparation-bundle',
    title: 'SLE Complete Preparation Bundle',
    shortDescription: 'Complete preparation for all three SLE tests: Oral, Written, and Reading comprehension.',
    description: `The ultimate SLE preparation package covering all three language skills tested in the Second Language Evaluation. This comprehensive bundle combines our best courses to give you everything you need to achieve your bilingualism goals.

Bundle includes:
- SLE Oral Expression Fundamentals
- SLE Written Expression Mastery
- SLE Reading Comprehension Excellence
- Bonus: Practice exam simulations
- Bonus: One-on-one coaching session`,
    instructorName: 'Prof. Steven Rusinga',
    category: 'sle_complete' as const,
    level: 'all_levels' as const,
    targetLanguage: 'french' as const,
    price: 69900, // $699.00
    originalPrice: 89700, // Sum of individual courses
    accessType: 'one_time' as const,
    totalModules: 17,
    totalLessons: 74,
    totalDurationMinutes: 3600, // 60 hours
    thumbnailUrl: '/images/courses/complete-bundle.png',
    previewVideoUrl: 'https://www.youtube.com/watch?v=LEc84vX0xe0',
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
    status: 'published' as const,
  },
];

// ============================================================================
// MODULE DATA
// ============================================================================

type ModuleData = { title: string; description: string; sortOrder: number };

const getModulesForCourse = (courseSlug: string): ModuleData[] => {
  const modulesByCourse: Record<string, ModuleData[]> = {
    'sle-oral-expression-fundamentals': [
      { title: 'Understanding the SLE Oral Test', description: 'Learn about the test format, evaluation criteria, and what examiners look for.', sortOrder: 1 },
      { title: 'Building Your Vocabulary Foundation', description: 'Essential workplace vocabulary and expressions for professional communication.', sortOrder: 2 },
      { title: 'Expressing Opinions Effectively', description: 'Techniques for sharing your views clearly and supporting them with examples.', sortOrder: 3 },
      { title: 'Handling Workplace Scenarios', description: 'Practice responding to common workplace situations and hypothetical questions.', sortOrder: 4 },
      { title: 'Fluency and Coherence', description: 'Develop natural flow in your speech and organize your ideas logically.', sortOrder: 5 },
      { title: 'Mock Tests and Final Preparation', description: 'Full practice tests with feedback to prepare you for the real exam.', sortOrder: 6 },
    ],
    'sle-written-expression-mastery': [
      { title: 'SLE Written Test Overview', description: 'Understanding the test format, timing, and scoring criteria.', sortOrder: 1 },
      { title: 'Professional Email Writing', description: 'Master the art of writing clear, professional emails in French.', sortOrder: 2 },
      { title: 'Memo and Note Writing', description: 'Learn to write effective internal communications.', sortOrder: 3 },
      { title: 'Report and Briefing Notes', description: 'Structure and write formal reports for senior management.', sortOrder: 4 },
      { title: 'Grammar and Syntax Mastery', description: 'Common errors and how to avoid them in formal writing.', sortOrder: 5 },
      { title: 'Timed Writing Practice', description: 'Build speed and accuracy under test conditions.', sortOrder: 6 },
    ],
    'sle-reading-comprehension-excellence': [
      { title: 'Understanding Text Types', description: 'Recognize and analyze different workplace document formats.', sortOrder: 1 },
      { title: 'Vocabulary Building Strategies', description: 'Expand your workplace vocabulary systematically.', sortOrder: 2 },
      { title: 'Speed Reading Techniques', description: 'Read faster while maintaining comprehension.', sortOrder: 3 },
      { title: 'Question Analysis', description: 'Understand what questions are really asking.', sortOrder: 4 },
      { title: 'Practice with Authentic Texts', description: 'Work through real SLE-style passages and questions.', sortOrder: 5 },
    ],
    'sle-level-c-advanced-oral': [
      { title: 'Level C Requirements', description: 'What distinguishes Level C from Level B performance.', sortOrder: 1 },
      { title: 'Advanced Grammar Structures', description: 'Master complex tenses, moods, and sentence structures.', sortOrder: 2 },
      { title: 'Nuanced Expression', description: 'Express subtle differences in meaning and opinion.', sortOrder: 3 },
      { title: 'Cultural Competence', description: 'Understand and use cultural references appropriately.', sortOrder: 4 },
      { title: 'Debate and Argumentation', description: 'Build and defend complex arguments.', sortOrder: 5 },
      { title: 'Handling Difficult Questions', description: 'Respond confidently to unexpected or challenging topics.', sortOrder: 6 },
      { title: 'Level C Mock Examinations', description: 'Full practice tests at Level C standard.', sortOrder: 7 },
    ],
    'workplace-french-essentials': [
      { title: 'Getting Started with French', description: 'Basic greetings, introductions, and essential phrases.', sortOrder: 1 },
      { title: 'Office Communication', description: 'Everyday phrases for the workplace.', sortOrder: 2 },
      { title: 'Meetings and Presentations', description: 'Participate actively in French meetings.', sortOrder: 3 },
      { title: 'Written Communication Basics', description: 'Write simple emails and messages.', sortOrder: 4 },
    ],
    'sle-complete-preparation-bundle': [
      { title: 'Oral Expression Fundamentals', description: 'Complete oral expression training.', sortOrder: 1 },
      { title: 'Written Expression Mastery', description: 'Complete written expression training.', sortOrder: 2 },
      { title: 'Reading Comprehension Excellence', description: 'Complete reading comprehension training.', sortOrder: 3 },
      { title: 'Practice Exam Simulations', description: 'Full mock exams for all three skills.', sortOrder: 4 },
    ],
  };
  
  return modulesByCourse[courseSlug] || [];
};

// ============================================================================
// LESSON DATA
// ============================================================================

type LessonData = { title: string; type: string; durationMinutes: number; content: string; sortOrder: number; isPreview: boolean };

const getLessonsForModule = (moduleTitle: string): LessonData[] => {
  const sampleLessons: Record<string, LessonData[]> = {
    'Understanding the SLE Oral Test': [
      { title: 'What is the SLE Oral Test?', type: 'video', durationMinutes: 15, content: 'Introduction to the SLE oral proficiency test and its importance in the Canadian public service.', sortOrder: 1, isPreview: true },
      { title: 'Test Format and Structure', type: 'video', durationMinutes: 20, content: 'Detailed breakdown of the test sections and timing.', sortOrder: 2, isPreview: false },
      { title: 'Evaluation Criteria Explained', type: 'video', durationMinutes: 25, content: 'Understanding how examiners score your performance.', sortOrder: 3, isPreview: false },
      { title: 'Level B vs Level C Requirements', type: 'article', durationMinutes: 10, content: 'Key differences between the two proficiency levels.', sortOrder: 4, isPreview: false },
    ],
    'Building Your Vocabulary Foundation': [
      { title: 'Essential Workplace Vocabulary', type: 'video', durationMinutes: 30, content: 'Core vocabulary for professional settings.', sortOrder: 1, isPreview: false },
      { title: 'Common Expressions and Idioms', type: 'video', durationMinutes: 25, content: 'Frequently used expressions in the workplace.', sortOrder: 2, isPreview: false },
      { title: 'Vocabulary Practice Exercises', type: 'interactive', durationMinutes: 20, content: 'Interactive exercises to reinforce learning.', sortOrder: 3, isPreview: false },
      { title: 'Module Quiz: Vocabulary', type: 'quiz', durationMinutes: 15, content: 'Test your vocabulary knowledge.', sortOrder: 4, isPreview: false },
    ],
    'SLE Written Test Overview': [
      { title: 'Introduction to Written Expression', type: 'video', durationMinutes: 15, content: 'Overview of the SLE written expression test.', sortOrder: 1, isPreview: true },
      { title: 'Test Components and Timing', type: 'video', durationMinutes: 20, content: 'Understanding what you will be asked to write.', sortOrder: 2, isPreview: false },
      { title: 'Scoring Rubric Deep Dive', type: 'article', durationMinutes: 15, content: 'How your writing is evaluated.', sortOrder: 3, isPreview: false },
      { title: 'Common Mistakes to Avoid', type: 'video', durationMinutes: 18, content: 'Learn from others mistakes.', sortOrder: 4, isPreview: false },
    ],
    'Understanding Text Types': [
      { title: 'Government Document Types', type: 'video', durationMinutes: 20, content: 'Overview of common document formats in the public service.', sortOrder: 1, isPreview: true },
      { title: 'Memos and Internal Communications', type: 'article', durationMinutes: 15, content: 'Understanding memo structure and purpose.', sortOrder: 2, isPreview: false },
      { title: 'Policy Documents', type: 'video', durationMinutes: 25, content: 'Reading and understanding policy language.', sortOrder: 3, isPreview: false },
    ],
    'Level C Requirements': [
      { title: 'What Makes Level C Different', type: 'video', durationMinutes: 20, content: 'Key characteristics of Level C performance.', sortOrder: 1, isPreview: true },
      { title: 'Examiner Expectations', type: 'video', durationMinutes: 25, content: 'What examiners look for at the highest level.', sortOrder: 2, isPreview: false },
      { title: 'Self-Assessment: Are You Ready?', type: 'interactive', durationMinutes: 30, content: 'Evaluate your current level and identify gaps.', sortOrder: 3, isPreview: false },
    ],
    'Getting Started with French': [
      { title: 'French Pronunciation Basics', type: 'video', durationMinutes: 20, content: 'Essential sounds and pronunciation rules.', sortOrder: 1, isPreview: true },
      { title: 'Greetings and Introductions', type: 'video', durationMinutes: 15, content: 'How to greet colleagues and introduce yourself.', sortOrder: 2, isPreview: false },
      { title: 'Numbers and Dates', type: 'interactive', durationMinutes: 20, content: 'Practice numbers, dates, and times.', sortOrder: 3, isPreview: false },
      { title: 'Practice: First Day at Work', type: 'interactive', durationMinutes: 25, content: 'Role-play your first day in a French workplace.', sortOrder: 4, isPreview: false },
    ],
  };
  
  return sampleLessons[moduleTitle] || [];
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedCourses() {
  console.log('Seeding courses...');
  
  for (const course of coursesData) {
    try {
      // Check if course already exists
      const existing = await db.select().from(courses).where(eq(courses.slug, course.slug)).limit(1);
      
      if (existing.length > 0) {
        console.log(`Course "${course.title}" already exists, skipping...`);
        continue;
      }
      
      // Insert course
      const result = await db.insert(courses).values({
        ...course,
        publishedAt: new Date(),
      }).$returningId();
      
      const courseId = result[0].id;
      console.log(`Created course: ${course.title} (ID: ${courseId})`);
      
      // Seed modules for this course
      const modules = getModulesForCourse(course.slug);
      for (const module of modules) {
        const moduleResult = await db.insert(courseModules).values({
          courseId,
          title: module.title,
          description: module.description,
          sortOrder: module.sortOrder,
          status: 'published',
        }).$returningId();
        
        const moduleId = moduleResult[0].id;
        console.log(`  Created module: ${module.title} (ID: ${moduleId})`);
        
        // Seed lessons for this module
        const moduleLessons = getLessonsForModule(module.title);
        for (const lesson of moduleLessons) {
          await db.insert(lessons).values({
            moduleId,
            courseId,
            title: lesson.title,
            type: lesson.type as any,
            durationMinutes: lesson.durationMinutes,
            content: lesson.content,
            sortOrder: lesson.sortOrder,
            isPreview: lesson.isPreview,
            status: 'published',
          });
          console.log(`    Created lesson: ${lesson.title}`);
        }
      }
    } catch (error: any) {
      console.error(`Error seeding course "${course.title}":`, error.message);
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    await seedCourses();
    console.log('\n✅ Course seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

main();
