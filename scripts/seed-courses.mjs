/**
 * Seed Course Content for Lingueefy
 * 
 * This script populates the database with real SLE (Second Language Evaluation) course content.
 * Run with: node scripts/seed-courses.mjs
 */

import mysql from 'mysql2/promise';

// Database connection
const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'lingueefy',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

console.log('Connected to database');

// ============================================================================
// COURSE DATA - Real SLE Content
// ============================================================================

const courses = [
  {
    slug: 'sle-oral-expression-fundamentals',
    title: 'SLE Oral Expression Fundamentals',
    titleFr: 'Fondamentaux de l\'expression orale ELS',
    subtitle: 'Master the basics of French oral expression for the Public Service',
    subtitleFr: 'Maîtrisez les bases de l\'expression orale en français pour la fonction publique',
    description: `This comprehensive course prepares you for the SLE Oral Expression test (Level B and C). You'll learn essential communication strategies, vocabulary for workplace scenarios, and techniques to express yourself clearly and professionally in French.

Key topics include:
- Understanding the SLE oral test format and evaluation criteria
- Building workplace vocabulary and expressions
- Developing fluency through structured practice
- Mastering opinion expression and argumentation
- Handling common workplace scenarios with confidence`,
    descriptionFr: `Ce cours complet vous prépare au test d'expression orale de l'ELS (niveaux B et C). Vous apprendrez des stratégies de communication essentielles, du vocabulaire pour les scénarios de travail et des techniques pour vous exprimer clairement et professionnellement en français.

Sujets clés:
- Comprendre le format du test oral ELS et les critères d'évaluation
- Développer le vocabulaire et les expressions du milieu de travail
- Améliorer la fluidité grâce à une pratique structurée
- Maîtriser l'expression d'opinions et l'argumentation
- Gérer les scénarios de travail courants avec confiance`,
    instructor: 'Prof. Steven Rusinga',
    targetLevel: 'B',
    category: 'oral_expression',
    difficulty: 'intermediate',
    language: 'fr',
    durationHours: 20,
    price: 29900, // $299.00
    originalPrice: 39900,
    thumbnailUrl: '/images/courses/oral-expression.jpg',
    previewVideoUrl: 'https://www.youtube.com/watch?v=example1',
    tags: JSON.stringify(['SLE', 'oral', 'expression', 'French', 'public service', 'level B']),
    learningOutcomes: JSON.stringify([
      'Understand the SLE oral test format and scoring criteria',
      'Express opinions clearly and support them with examples',
      'Use appropriate workplace vocabulary and expressions',
      'Handle hypothetical scenarios with proper grammar',
      'Demonstrate fluency and coherence in extended speech',
    ]),
    requirements: JSON.stringify([
      'Basic French comprehension (A2 level minimum)',
      'Microphone for speaking practice',
      'Commitment to daily practice sessions',
    ]),
    status: 'published',
  },
  {
    slug: 'sle-written-expression-mastery',
    title: 'SLE Written Expression Mastery',
    titleFr: 'Maîtrise de l\'expression écrite ELS',
    subtitle: 'Achieve Level B/C in French written expression',
    subtitleFr: 'Atteignez le niveau B/C en expression écrite française',
    description: `Master the art of professional French writing for the Public Service. This course covers all aspects of the SLE Written Expression test, from email composition to formal reports.

You will learn:
- Professional email and memo writing
- Report and briefing note structure
- Grammar and syntax for formal writing
- Common errors and how to avoid them
- Time management strategies for the test`,
    descriptionFr: `Maîtrisez l'art de la rédaction professionnelle en français pour la fonction publique. Ce cours couvre tous les aspects du test d'expression écrite de l'ELS, de la rédaction de courriels aux rapports formels.

Vous apprendrez:
- La rédaction de courriels et de notes de service professionnels
- La structure des rapports et des notes d'information
- La grammaire et la syntaxe pour la rédaction formelle
- Les erreurs courantes et comment les éviter
- Les stratégies de gestion du temps pour le test`,
    instructor: 'Prof. Steven Rusinga',
    targetLevel: 'B',
    category: 'written_expression',
    difficulty: 'intermediate',
    language: 'fr',
    durationHours: 25,
    price: 34900, // $349.00
    originalPrice: 44900,
    thumbnailUrl: '/images/courses/written-expression.jpg',
    previewVideoUrl: 'https://www.youtube.com/watch?v=example2',
    tags: JSON.stringify(['SLE', 'written', 'expression', 'French', 'public service', 'level B']),
    learningOutcomes: JSON.stringify([
      'Write professional emails and memos in French',
      'Structure formal reports and briefing notes',
      'Apply correct grammar and syntax consistently',
      'Use appropriate register for different audiences',
      'Complete written tasks within time constraints',
    ]),
    requirements: JSON.stringify([
      'Basic French writing ability (A2 level minimum)',
      'Computer with word processing software',
      'Dedication to regular writing practice',
    ]),
    status: 'published',
  },
  {
    slug: 'sle-reading-comprehension-excellence',
    title: 'SLE Reading Comprehension Excellence',
    titleFr: 'Excellence en compréhension de lecture ELS',
    subtitle: 'Develop advanced French reading skills for the SLE',
    subtitleFr: 'Développez des compétences avancées en lecture française pour l\'ELS',
    description: `Enhance your French reading comprehension skills to excel in the SLE Reading test. This course provides strategies for understanding complex texts, identifying key information, and answering questions efficiently.

Course highlights:
- Understanding different text types (memos, reports, policies)
- Vocabulary building for workplace contexts
- Speed reading techniques
- Question analysis strategies
- Practice with authentic SLE-style passages`,
    descriptionFr: `Améliorez vos compétences en compréhension de lecture en français pour exceller au test de lecture de l'ELS. Ce cours fournit des stratégies pour comprendre des textes complexes, identifier les informations clés et répondre efficacement aux questions.

Points forts du cours:
- Comprendre différents types de textes (notes, rapports, politiques)
- Enrichissement du vocabulaire pour les contextes professionnels
- Techniques de lecture rapide
- Stratégies d'analyse des questions
- Pratique avec des passages authentiques de style ELS`,
    instructor: 'Prof. Steven Rusinga',
    targetLevel: 'B',
    category: 'reading_comprehension',
    difficulty: 'intermediate',
    language: 'fr',
    durationHours: 15,
    price: 24900, // $249.00
    originalPrice: 34900,
    thumbnailUrl: '/images/courses/reading-comprehension.jpg',
    previewVideoUrl: 'https://www.youtube.com/watch?v=example3',
    tags: JSON.stringify(['SLE', 'reading', 'comprehension', 'French', 'public service', 'level B']),
    learningOutcomes: JSON.stringify([
      'Read and understand complex French workplace texts',
      'Identify main ideas and supporting details quickly',
      'Recognize text structure and organizational patterns',
      'Build vocabulary specific to government contexts',
      'Apply effective test-taking strategies',
    ]),
    requirements: JSON.stringify([
      'Basic French reading ability (A2 level minimum)',
      'Access to course materials',
      'Time for daily reading practice',
    ]),
    status: 'published',
  },
  {
    slug: 'sle-level-c-advanced-oral',
    title: 'SLE Level C: Advanced Oral Proficiency',
    titleFr: 'ELS Niveau C: Maîtrise orale avancée',
    subtitle: 'Achieve the highest level of French oral proficiency',
    subtitleFr: 'Atteignez le plus haut niveau de maîtrise orale en français',
    description: `This advanced course is designed for candidates targeting Level C in the SLE Oral Expression test. You'll develop sophisticated communication skills, nuanced expression, and the ability to handle complex workplace scenarios.

Advanced topics include:
- Nuanced opinion expression and debate
- Complex grammatical structures
- Idiomatic expressions and cultural references
- Handling unexpected questions with poise
- Advanced argumentation techniques`,
    descriptionFr: `Ce cours avancé est conçu pour les candidats visant le niveau C au test d'expression orale de l'ELS. Vous développerez des compétences de communication sophistiquées, une expression nuancée et la capacité de gérer des scénarios de travail complexes.

Sujets avancés:
- Expression d'opinions nuancées et débat
- Structures grammaticales complexes
- Expressions idiomatiques et références culturelles
- Gérer les questions inattendues avec assurance
- Techniques d'argumentation avancées`,
    instructor: 'Prof. Steven Rusinga',
    targetLevel: 'C',
    category: 'oral_expression',
    difficulty: 'advanced',
    language: 'fr',
    durationHours: 30,
    price: 44900, // $449.00
    originalPrice: 59900,
    thumbnailUrl: '/images/courses/level-c-oral.jpg',
    previewVideoUrl: 'https://www.youtube.com/watch?v=example4',
    tags: JSON.stringify(['SLE', 'oral', 'expression', 'French', 'public service', 'level C', 'advanced']),
    learningOutcomes: JSON.stringify([
      'Express complex ideas with precision and nuance',
      'Use advanced grammatical structures correctly',
      'Demonstrate cultural competence in communication',
      'Handle challenging scenarios with confidence',
      'Achieve Level C performance consistently',
    ]),
    requirements: JSON.stringify([
      'Current Level B or strong intermediate French',
      'Completion of Oral Expression Fundamentals recommended',
      'Commitment to intensive practice schedule',
    ]),
    status: 'published',
  },
  {
    slug: 'workplace-french-essentials',
    title: 'Workplace French Essentials',
    titleFr: 'Français essentiel au travail',
    subtitle: 'Build practical French skills for the Canadian workplace',
    subtitleFr: 'Développez des compétences pratiques en français pour le milieu de travail canadien',
    description: `A practical course focused on everyday French communication in the Canadian public service workplace. Perfect for those starting their bilingualism journey or needing to refresh their skills.

You will master:
- Common workplace greetings and expressions
- Meeting participation and presentation skills
- Email and phone communication
- Discussing projects and deadlines
- Networking and professional relationship building`,
    descriptionFr: `Un cours pratique axé sur la communication quotidienne en français dans le milieu de travail de la fonction publique canadienne. Parfait pour ceux qui commencent leur parcours de bilinguisme ou qui ont besoin de rafraîchir leurs compétences.

Vous maîtriserez:
- Les salutations et expressions courantes au travail
- La participation aux réunions et les compétences de présentation
- La communication par courriel et téléphone
- La discussion des projets et des échéances
- Le réseautage et l'établissement de relations professionnelles`,
    instructor: 'Prof. Steven Rusinga',
    targetLevel: 'A',
    category: 'general_french',
    difficulty: 'beginner',
    language: 'fr',
    durationHours: 12,
    price: 14900, // $149.00
    originalPrice: 19900,
    thumbnailUrl: '/images/courses/workplace-french.jpg',
    previewVideoUrl: 'https://www.youtube.com/watch?v=example5',
    tags: JSON.stringify(['French', 'workplace', 'beginner', 'public service', 'practical']),
    learningOutcomes: JSON.stringify([
      'Communicate confidently in common workplace situations',
      'Write basic professional emails in French',
      'Participate in meetings and discussions',
      'Use appropriate workplace vocabulary',
      'Build professional relationships in French',
    ]),
    requirements: JSON.stringify([
      'No prior French knowledge required',
      'Willingness to practice daily',
      'Access to course materials',
    ]),
    status: 'published',
  },
];

// ============================================================================
// MODULE DATA
// ============================================================================

const getModulesForCourse = (courseSlug) => {
  const modulesByCourse = {
    'sle-oral-expression-fundamentals': [
      { title: 'Understanding the SLE Oral Test', titleFr: 'Comprendre le test oral ELS', description: 'Learn about the test format, evaluation criteria, and what examiners look for.', sortOrder: 1 },
      { title: 'Building Your Vocabulary Foundation', titleFr: 'Construire votre base de vocabulaire', description: 'Essential workplace vocabulary and expressions for professional communication.', sortOrder: 2 },
      { title: 'Expressing Opinions Effectively', titleFr: 'Exprimer des opinions efficacement', description: 'Techniques for sharing your views clearly and supporting them with examples.', sortOrder: 3 },
      { title: 'Handling Workplace Scenarios', titleFr: 'Gérer les scénarios de travail', description: 'Practice responding to common workplace situations and hypothetical questions.', sortOrder: 4 },
      { title: 'Fluency and Coherence', titleFr: 'Fluidité et cohérence', description: 'Develop natural flow in your speech and organize your ideas logically.', sortOrder: 5 },
      { title: 'Mock Tests and Final Preparation', titleFr: 'Tests simulés et préparation finale', description: 'Full practice tests with feedback to prepare you for the real exam.', sortOrder: 6 },
    ],
    'sle-written-expression-mastery': [
      { title: 'SLE Written Test Overview', titleFr: 'Aperçu du test écrit ELS', description: 'Understanding the test format, timing, and scoring criteria.', sortOrder: 1 },
      { title: 'Professional Email Writing', titleFr: 'Rédaction de courriels professionnels', description: 'Master the art of writing clear, professional emails in French.', sortOrder: 2 },
      { title: 'Memo and Note Writing', titleFr: 'Rédaction de notes et mémos', description: 'Learn to write effective internal communications.', sortOrder: 3 },
      { title: 'Report and Briefing Notes', titleFr: 'Rapports et notes d\'information', description: 'Structure and write formal reports for senior management.', sortOrder: 4 },
      { title: 'Grammar and Syntax Mastery', titleFr: 'Maîtrise de la grammaire et de la syntaxe', description: 'Common errors and how to avoid them in formal writing.', sortOrder: 5 },
      { title: 'Timed Writing Practice', titleFr: 'Pratique d\'écriture chronométrée', description: 'Build speed and accuracy under test conditions.', sortOrder: 6 },
    ],
    'sle-reading-comprehension-excellence': [
      { title: 'Understanding Text Types', titleFr: 'Comprendre les types de textes', description: 'Recognize and analyze different workplace document formats.', sortOrder: 1 },
      { title: 'Vocabulary Building Strategies', titleFr: 'Stratégies d\'enrichissement du vocabulaire', description: 'Expand your workplace vocabulary systematically.', sortOrder: 2 },
      { title: 'Speed Reading Techniques', titleFr: 'Techniques de lecture rapide', description: 'Read faster while maintaining comprehension.', sortOrder: 3 },
      { title: 'Question Analysis', titleFr: 'Analyse des questions', description: 'Understand what questions are really asking.', sortOrder: 4 },
      { title: 'Practice with Authentic Texts', titleFr: 'Pratique avec des textes authentiques', description: 'Work through real SLE-style passages and questions.', sortOrder: 5 },
    ],
    'sle-level-c-advanced-oral': [
      { title: 'Level C Requirements', titleFr: 'Exigences du niveau C', description: 'What distinguishes Level C from Level B performance.', sortOrder: 1 },
      { title: 'Advanced Grammar Structures', titleFr: 'Structures grammaticales avancées', description: 'Master complex tenses, moods, and sentence structures.', sortOrder: 2 },
      { title: 'Nuanced Expression', titleFr: 'Expression nuancée', description: 'Express subtle differences in meaning and opinion.', sortOrder: 3 },
      { title: 'Cultural Competence', titleFr: 'Compétence culturelle', description: 'Understand and use cultural references appropriately.', sortOrder: 4 },
      { title: 'Debate and Argumentation', titleFr: 'Débat et argumentation', description: 'Build and defend complex arguments.', sortOrder: 5 },
      { title: 'Handling Difficult Questions', titleFr: 'Gérer les questions difficiles', description: 'Respond confidently to unexpected or challenging topics.', sortOrder: 6 },
      { title: 'Level C Mock Examinations', titleFr: 'Examens simulés niveau C', description: 'Full practice tests at Level C standard.', sortOrder: 7 },
    ],
    'workplace-french-essentials': [
      { title: 'Getting Started with French', titleFr: 'Débuter en français', description: 'Basic greetings, introductions, and essential phrases.', sortOrder: 1 },
      { title: 'Office Communication', titleFr: 'Communication au bureau', description: 'Everyday phrases for the workplace.', sortOrder: 2 },
      { title: 'Meetings and Presentations', titleFr: 'Réunions et présentations', description: 'Participate actively in French meetings.', sortOrder: 3 },
      { title: 'Written Communication Basics', titleFr: 'Bases de la communication écrite', description: 'Write simple emails and messages.', sortOrder: 4 },
    ],
  };
  
  return modulesByCourse[courseSlug] || [];
};

// ============================================================================
// LESSON DATA
// ============================================================================

const getLessonsForModule = (moduleTitle, courseSlug) => {
  // Sample lessons for the first module of each course
  const sampleLessons = {
    'Understanding the SLE Oral Test': [
      { title: 'What is the SLE Oral Test?', titleFr: 'Qu\'est-ce que le test oral ELS?', type: 'video', duration: 15, content: 'Introduction to the SLE oral proficiency test and its importance in the Canadian public service.', sortOrder: 1 },
      { title: 'Test Format and Structure', titleFr: 'Format et structure du test', type: 'video', duration: 20, content: 'Detailed breakdown of the test sections and timing.', sortOrder: 2 },
      { title: 'Evaluation Criteria Explained', titleFr: 'Critères d\'évaluation expliqués', type: 'video', duration: 25, content: 'Understanding how examiners score your performance.', sortOrder: 3 },
      { title: 'Level B vs Level C Requirements', titleFr: 'Exigences niveau B vs niveau C', type: 'article', duration: 10, content: 'Key differences between the two proficiency levels.', sortOrder: 4 },
      { title: 'Module Quiz: Test Format', titleFr: 'Quiz du module: Format du test', type: 'quiz', duration: 15, content: 'Test your understanding of the SLE oral test format.', sortOrder: 5 },
    ],
    'SLE Written Test Overview': [
      { title: 'Introduction to Written Expression', titleFr: 'Introduction à l\'expression écrite', type: 'video', duration: 15, content: 'Overview of the SLE written expression test.', sortOrder: 1 },
      { title: 'Test Components and Timing', titleFr: 'Composantes et durée du test', type: 'video', duration: 20, content: 'Understanding what you\'ll be asked to write.', sortOrder: 2 },
      { title: 'Scoring Rubric Deep Dive', titleFr: 'Analyse approfondie de la grille d\'évaluation', type: 'article', duration: 15, content: 'How your writing is evaluated.', sortOrder: 3 },
      { title: 'Common Mistakes to Avoid', titleFr: 'Erreurs courantes à éviter', type: 'video', duration: 18, content: 'Learn from others\' mistakes.', sortOrder: 4 },
    ],
    'Understanding Text Types': [
      { title: 'Government Document Types', titleFr: 'Types de documents gouvernementaux', type: 'video', duration: 20, content: 'Overview of common document formats in the public service.', sortOrder: 1 },
      { title: 'Memos and Internal Communications', titleFr: 'Notes et communications internes', type: 'article', duration: 15, content: 'Understanding memo structure and purpose.', sortOrder: 2 },
      { title: 'Policy Documents', titleFr: 'Documents de politique', type: 'video', duration: 25, content: 'Reading and understanding policy language.', sortOrder: 3 },
    ],
    'Level C Requirements': [
      { title: 'What Makes Level C Different', titleFr: 'Ce qui distingue le niveau C', type: 'video', duration: 20, content: 'Key characteristics of Level C performance.', sortOrder: 1 },
      { title: 'Examiner Expectations', titleFr: 'Attentes des examinateurs', type: 'video', duration: 25, content: 'What examiners look for at the highest level.', sortOrder: 2 },
      { title: 'Self-Assessment: Are You Ready?', titleFr: 'Auto-évaluation: Êtes-vous prêt?', type: 'interactive', duration: 30, content: 'Evaluate your current level and identify gaps.', sortOrder: 3 },
    ],
    'Getting Started with French': [
      { title: 'French Pronunciation Basics', titleFr: 'Bases de la prononciation française', type: 'video', duration: 20, content: 'Essential sounds and pronunciation rules.', sortOrder: 1 },
      { title: 'Greetings and Introductions', titleFr: 'Salutations et présentations', type: 'video', duration: 15, content: 'How to greet colleagues and introduce yourself.', sortOrder: 2 },
      { title: 'Numbers and Dates', titleFr: 'Nombres et dates', type: 'interactive', duration: 20, content: 'Practice numbers, dates, and times.', sortOrder: 3 },
      { title: 'Practice: First Day at Work', titleFr: 'Pratique: Premier jour au travail', type: 'interactive', duration: 25, content: 'Role-play your first day in a French workplace.', sortOrder: 4 },
    ],
  };
  
  return sampleLessons[moduleTitle] || [];
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedCourses() {
  console.log('Seeding courses...');
  
  for (const course of courses) {
    try {
      // Check if course already exists
      const [existing] = await connection.execute(
        'SELECT id FROM courses WHERE slug = ?',
        [course.slug]
      );
      
      if (existing.length > 0) {
        console.log(`Course "${course.title}" already exists, skipping...`);
        continue;
      }
      
      // Insert course
      const [result] = await connection.execute(
        `INSERT INTO courses (
          slug, title, titleFr, subtitle, subtitleFr, description, descriptionFr,
          instructor, targetLevel, category, difficulty, language, durationHours,
          price, originalPrice, thumbnailUrl, previewVideoUrl, tags,
          learningOutcomes, requirements, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          course.slug, course.title, course.titleFr, course.subtitle, course.subtitleFr,
          course.description, course.descriptionFr, course.instructor, course.targetLevel,
          course.category, course.difficulty, course.language, course.durationHours,
          course.price, course.originalPrice, course.thumbnailUrl, course.previewVideoUrl,
          course.tags, course.learningOutcomes, course.requirements, course.status
        ]
      );
      
      const courseId = result.insertId;
      console.log(`Created course: ${course.title} (ID: ${courseId})`);
      
      // Seed modules for this course
      const modules = getModulesForCourse(course.slug);
      for (const module of modules) {
        const [moduleResult] = await connection.execute(
          `INSERT INTO course_modules (
            courseId, title, titleFr, description, sortOrder, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, 'published', NOW(), NOW())`,
          [courseId, module.title, module.titleFr, module.description, module.sortOrder]
        );
        
        const moduleId = moduleResult.insertId;
        console.log(`  Created module: ${module.title} (ID: ${moduleId})`);
        
        // Seed lessons for this module
        const lessons = getLessonsForModule(module.title, course.slug);
        for (const lesson of lessons) {
          await connection.execute(
            `INSERT INTO lessons (
              moduleId, courseId, title, titleFr, type, duration, content, sortOrder, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(), NOW())`,
            [moduleId, courseId, lesson.title, lesson.titleFr, lesson.type, lesson.duration, lesson.content, lesson.sortOrder]
          );
          console.log(`    Created lesson: ${lesson.title}`);
        }
      }
    } catch (error) {
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
    await connection.end();
    console.log('Database connection closed');
  }
}

main();
