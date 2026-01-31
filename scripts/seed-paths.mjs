/**
 * Seed Script for Path Series™ Learning Paths
 * 
 * This script populates the learning_paths table with the 6 official
 * RusingAcademy Path Series programs, aligned with CEFR levels and
 * Canadian government SLE requirements.
 * 
 * Run with: node scripts/seed-paths.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true },
};

// Path Series data based on RusingAcademy curriculum
// Matching actual database columns:
// id, title, slug, subtitle, description, level, cefrLevel, pflLevel, price, originalPrice, 
// discountPercentage, durationWeeks, structuredHours, practiceHoursMin, practiceHoursMax, 
// totalModules, totalLessons, objectives, outcomes, whoIsThisFor, whatYouWillLearn, modules, 
// thumbnailUrl, bannerUrl, status, isFeatured, displayOrder, enrollmentCount, completionRate, 
// averageRating, reviewCount, createdAt, updatedAt
const pathSeriesData = [
  {
    slug: 'path-series-a1',
    title: 'Path Series A1 – Foundation',
    subtitle: 'Build Your Bilingual Foundation',
    description: 'Build the fundamental communication skills required for basic professional interactions. Learn to introduce yourself, ask simple questions, understand basic messages, and complete essential forms in a workplace context. This path establishes the critical groundwork for your bilingual journey in the Canadian public service.',
    level: 'A1',
    cefrLevel: 'A1',
    pflLevel: 'OF 1-6',
    price: 49900, // $499 CAD
    originalPrice: 69900,
    discountPercentage: 29,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Build foundational vocabulary for workplace contexts',
      'Master basic grammar structures',
      'Develop listening comprehension for simple instructions',
      'Practice reading short professional texts',
      'Write simple professional messages',
    ]),
    outcomes: JSON.stringify([
      { en: 'Present yourself and others professionally', fr: 'Vous présenter et présenter les autres de manière professionnelle' },
      { en: 'Ask and answer simple questions about familiar topics', fr: 'Poser et répondre à des questions simples sur des sujets familiers' },
      { en: 'Understand and use everyday workplace expressions', fr: 'Comprendre et utiliser les expressions quotidiennes du lieu de travail' },
      { en: 'Describe your workspace and daily routine', fr: 'Décrire votre espace de travail et votre routine quotidienne' },
      { en: 'Complete administrative forms accurately', fr: 'Remplir les formulaires administratifs avec précision' },
      { en: 'Write simple professional messages', fr: 'Rédiger des messages professionnels simples' },
    ]),
    whoIsThisFor: JSON.stringify('Complete beginners starting their bilingual journey. Ideal for public servants who have had minimal exposure to French and need to build a solid foundation from the ground up.'),
    whatYouWillLearn: JSON.stringify([
      'Basic greetings and introductions',
      'Numbers, dates, and time expressions',
      'Present tense verbs and basic sentence structures',
      'Workplace vocabulary and common expressions',
      'Simple email and message writing',
      'Listening to basic instructions',
    ]),
    modules: JSON.stringify([
      { title: 'Getting Started', lessons: 4 },
      { title: 'Workplace Basics', lessons: 4 },
      { title: 'Daily Routines', lessons: 4 },
      { title: 'Simple Communication', lessons: 4 },
      { title: 'Reading & Writing Basics', lessons: 4 },
      { title: 'Review & Assessment', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 1,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
  {
    slug: 'path-series-a2',
    title: 'Path Series A2 – Survival',
    subtitle: 'Develop Practical Communication Skills',
    description: 'Develop confidence in daily professional interactions. Learn to discuss past events, future plans, and personal opinions. Engage in routine workplace conversations with increasing spontaneity and accuracy. This path bridges the gap between basic and intermediate proficiency.',
    level: 'A2',
    cefrLevel: 'A2',
    pflLevel: 'OF 7-12',
    price: 49900,
    originalPrice: 69900,
    discountPercentage: 29,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Expand vocabulary for professional contexts',
      'Master past and future tenses',
      'Improve listening comprehension',
      'Read and understand professional documents',
      'Write effective professional emails',
    ]),
    outcomes: JSON.stringify([
      { en: 'Narrate past events using appropriate tenses', fr: 'Raconter des événements passés en utilisant les temps appropriés' },
      { en: 'Discuss future projects and plans confidently', fr: 'Discuter des projets et plans futurs avec confiance' },
      { en: 'Express simple opinions and preferences', fr: 'Exprimer des opinions et préférences simples' },
      { en: 'Understand short texts on familiar topics', fr: 'Comprendre des textes courts sur des sujets familiers' },
      { en: 'Write basic professional emails and messages', fr: 'Rédiger des courriels et messages professionnels de base' },
      { en: 'Participate in routine workplace exchanges', fr: 'Participer aux échanges de routine au travail' },
    ]),
    whoIsThisFor: JSON.stringify('Learners with basic knowledge seeking practical skills. Perfect for those who can handle simple interactions but need to develop more confidence and range in their communication.'),
    whatYouWillLearn: JSON.stringify([
      'Past tense (passé composé) and future tense',
      'Expressing opinions and preferences',
      'Workplace conversation patterns',
      'Professional email writing',
      'Understanding announcements and notices',
      'Participating in meetings',
    ]),
    modules: JSON.stringify([
      { title: 'Talking About the Past', lessons: 4 },
      { title: 'Planning the Future', lessons: 4 },
      { title: 'Expressing Opinions', lessons: 4 },
      { title: 'Professional Writing', lessons: 4 },
      { title: 'Workplace Conversations', lessons: 4 },
      { title: 'Review & Assessment', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 2,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
  {
    slug: 'path-series-b1',
    title: 'Path Series B1 – Threshold',
    subtitle: 'Achieve Professional Autonomy',
    description: 'Achieve functional professional autonomy. Develop the ability to present arguments, participate in debates, write structured reports, and handle most workplace communication situations independently and effectively. This is the gateway to BBB certification.',
    level: 'B1',
    cefrLevel: 'B1',
    pflLevel: 'OF 13-22',
    price: 49900,
    originalPrice: 69900,
    discountPercentage: 29,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Master intermediate grammar structures',
      'Develop argumentation skills',
      'Improve spontaneous conversation ability',
      'Write structured professional documents',
      'Understand complex spoken French',
    ]),
    outcomes: JSON.stringify([
      { en: 'Present and defend viewpoints with structured arguments', fr: 'Présenter et défendre des points de vue avec des arguments structurés' },
      { en: 'Narrate complex events using multiple tenses', fr: 'Raconter des événements complexes en utilisant plusieurs temps' },
      { en: 'Understand main points of presentations and speeches', fr: 'Comprendre les points principaux des présentations et discours' },
      { en: 'Write structured reports and meeting minutes', fr: 'Rédiger des rapports structurés et des procès-verbaux de réunion' },
      { en: 'Participate in conversations with spontaneity', fr: 'Participer à des conversations avec spontanéité' },
      { en: 'Handle unpredictable workplace situations', fr: 'Gérer des situations de travail imprévisibles' },
    ]),
    whoIsThisFor: JSON.stringify('Intermediate learners aiming for BBB certification. Designed for public servants who need to achieve the minimum bilingual requirement for most designated bilingual positions.'),
    whatYouWillLearn: JSON.stringify([
      'Complex sentence structures',
      'Argumentation and debate techniques',
      'Report and memo writing',
      'Meeting participation skills',
      'Handling unexpected situations',
      'SLE BBB exam strategies',
    ]),
    modules: JSON.stringify([
      { title: 'Building Arguments', lessons: 4 },
      { title: 'Complex Narratives', lessons: 4 },
      { title: 'Professional Documents', lessons: 4 },
      { title: 'Meeting Skills', lessons: 4 },
      { title: 'Spontaneous Communication', lessons: 4 },
      { title: 'BBB Exam Preparation', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 3,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
  {
    slug: 'path-series-b2',
    title: 'Path Series B2 – Vantage',
    subtitle: 'Master Precision and Nuance',
    description: 'Master precision, nuance, and leadership communication. Develop advanced grammatical structures (subjunctive, conditional), persuasive argumentation skills, and the ability to communicate effectively in complex professional contexts. This path prepares you for CBC-level positions.',
    level: 'B2',
    cefrLevel: 'B2',
    pflLevel: 'OF 23-32',
    price: 49900,
    originalPrice: 69900,
    discountPercentage: 29,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Master subjunctive and conditional moods',
      'Develop persuasive communication skills',
      'Refine nuanced expression',
      'Write sophisticated professional documents',
      'Lead discussions and negotiations',
    ]),
    outcomes: JSON.stringify([
      { en: 'Express hypotheses, conditions, and nuanced opinions', fr: 'Exprimer des hypothèses, des conditions et des opinions nuancées' },
      { en: 'Analyze complex texts and extract key information', fr: 'Analyser des textes complexes et extraire les informations clés' },
      { en: 'Develop persuasive, well-structured arguments', fr: 'Développer des arguments persuasifs et bien structurés' },
      { en: 'Communicate with fluency and spontaneity', fr: 'Communiquer avec fluidité et spontanéité' },
      { en: 'Write detailed, coherent professional documents', fr: 'Rédiger des documents professionnels détaillés et cohérents' },
      { en: 'Engage confidently in debates and negotiations', fr: 'Participer avec confiance aux débats et négociations' },
    ]),
    whoIsThisFor: JSON.stringify('Upper intermediate learners targeting CBC positions. Ideal for managers and supervisors who need to demonstrate advanced bilingual competencies for leadership roles.'),
    whatYouWillLearn: JSON.stringify([
      'Subjunctive mood mastery',
      'Conditional structures',
      'Persuasive writing and speaking',
      'Negotiation techniques',
      'Advanced document drafting',
      'SLE CBC exam strategies',
    ]),
    modules: JSON.stringify([
      { title: 'Advanced Grammar', lessons: 4 },
      { title: 'Persuasive Communication', lessons: 4 },
      { title: 'Leadership Language', lessons: 4 },
      { title: 'Complex Documents', lessons: 4 },
      { title: 'Negotiation Skills', lessons: 4 },
      { title: 'CBC Exam Preparation', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 4,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
  {
    slug: 'path-series-c1',
    title: 'Path Series C1 – Effective Proficiency',
    subtitle: 'Achieve Expert-Level Communication',
    description: 'Achieve expert-level communication with idiomatic mastery and cultural sophistication. Develop the advanced competencies required for executive roles: facilitating meetings, negotiating complex issues, and producing high-quality professional documents. This path prepares you for CCC-level excellence.',
    level: 'C1',
    cefrLevel: 'C1',
    pflLevel: 'OF 33-42',
    price: 49900,
    originalPrice: 69900,
    discountPercentage: 29,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Master idiomatic expressions',
      'Develop cultural sophistication',
      'Lead high-stakes communications',
      'Produce executive-level documents',
      'Facilitate complex discussions',
    ]),
    outcomes: JSON.stringify([
      { en: 'Facilitate complex discussions and negotiations', fr: 'Animer des discussions et négociations complexes' },
      { en: 'Produce high-quality professional documents', fr: 'Produire des documents professionnels de haute qualité' },
      { en: 'Express nuanced viewpoints with cultural sophistication', fr: 'Exprimer des points de vue nuancés avec sophistication culturelle' },
      { en: 'Understand implicit meanings and cultural references', fr: 'Comprendre les significations implicites et références culturelles' },
      { en: 'Adapt communication style to any professional context', fr: 'Adapter le style de communication à tout contexte professionnel' },
      { en: 'Lead bilingual teams effectively', fr: 'Diriger efficacement des équipes bilingues' },
    ]),
    whoIsThisFor: JSON.stringify('Advanced learners pursuing executive positions. Designed for senior managers, directors, and executives who need to demonstrate the highest level of bilingual proficiency.'),
    whatYouWillLearn: JSON.stringify([
      'Idiomatic mastery',
      'Cultural nuances',
      'Executive communication',
      'High-stakes negotiations',
      'Policy document drafting',
      'SLE CCC exam strategies',
    ]),
    modules: JSON.stringify([
      { title: 'Idiomatic Excellence', lessons: 4 },
      { title: 'Cultural Sophistication', lessons: 4 },
      { title: 'Executive Communication', lessons: 4 },
      { title: 'High-Stakes Negotiations', lessons: 4 },
      { title: 'Policy & Strategy Documents', lessons: 4 },
      { title: 'CCC Exam Preparation', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 5,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
  {
    slug: 'path-series-sle-prep',
    title: 'Path Series SLE Prep – Exam Mastery',
    subtitle: 'Intensive SLE Exam Preparation',
    description: 'Intensive exam preparation designed specifically for the PSC Second Language Evaluation. Master exam strategies, practice with authentic test materials, and build the confidence needed to achieve your target SLE level (BBB, CBC, or CCC). This path focuses exclusively on exam success.',
    level: 'exam_prep',
    cefrLevel: 'exam_prep',
    pflLevel: 'Exam Prep',
    price: 59900, // $599 CAD - premium for exam prep
    originalPrice: 79900,
    discountPercentage: 25,
    durationWeeks: 4,
    structuredHours: 30,
    practiceHoursMin: 80,
    practiceHoursMax: 130,
    totalModules: 6,
    totalLessons: 24,
    objectives: JSON.stringify([
      'Master SLE exam format',
      'Develop time management strategies',
      'Practice with authentic materials',
      'Build exam confidence',
      'Address personal weak points',
    ]),
    outcomes: JSON.stringify([
      { en: 'Master SLE exam format and question types', fr: 'Maîtriser le format de l\'examen ELS et les types de questions' },
      { en: 'Develop effective time management strategies', fr: 'Développer des stratégies efficaces de gestion du temps' },
      { en: 'Practice with authentic exam simulations', fr: 'Pratiquer avec des simulations d\'examen authentiques' },
      { en: 'Build confidence through targeted feedback', fr: 'Développer la confiance grâce à des commentaires ciblés' },
      { en: 'Identify and address personal weak points', fr: 'Identifier et corriger les points faibles personnels' },
      { en: 'Achieve target SLE level on first attempt', fr: 'Atteindre le niveau ELS cible dès la première tentative' },
    ]),
    whoIsThisFor: JSON.stringify('Candidates preparing for SLE certification exams. Perfect for public servants who have an upcoming SLE test and need focused, strategic preparation to maximize their chances of success.'),
    whatYouWillLearn: JSON.stringify([
      'Oral comprehension strategies',
      'Written comprehension techniques',
      'Written expression best practices',
      'Time management for each section',
      'Common pitfalls and how to avoid them',
      'Mock exam practice',
    ]),
    modules: JSON.stringify([
      { title: 'Understanding the SLE', lessons: 4 },
      { title: 'Oral Comprehension', lessons: 4 },
      { title: 'Written Comprehension', lessons: 4 },
      { title: 'Written Expression', lessons: 4 },
      { title: 'Mock Exams', lessons: 4 },
      { title: 'Final Preparation', lessons: 4 },
    ]),
    thumbnailUrl: null,
    bannerUrl: null,
    status: 'published',
    isFeatured: true,
    displayOrder: 6,
    enrollmentCount: 0,
    completionRate: 0,
    averageRating: null,
    reviewCount: 0,
  },
];

async function seedPaths() {
  console.log('🌱 Starting Path Series seed...');
  
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Check if paths already exist
    const [existingPaths] = await connection.execute(
      'SELECT COUNT(*) as count FROM learning_paths'
    );
    
    if (existingPaths[0].count > 0) {
      console.log(`⚠️  Found ${existingPaths[0].count} existing paths. Clearing and re-seeding...`);
      await connection.execute('DELETE FROM learning_paths');
    }
    
    // Insert each path
    for (const path of pathSeriesData) {
      await connection.query(
        `INSERT INTO learning_paths (
          slug, title, subtitle, description, level, cefrLevel, pflLevel,
          price, originalPrice, discountPercentage, durationWeeks, structuredHours,
          practiceHoursMin, practiceHoursMax, totalModules, totalLessons,
          objectives, outcomes, whoIsThisFor, whatYouWillLearn, modules,
          thumbnailUrl, bannerUrl, status, isFeatured, displayOrder,
          enrollmentCount, completionRate, averageRating, reviewCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          path.slug,
          path.title,
          path.subtitle,
          path.description,
          path.level,
          path.cefrLevel,
          path.pflLevel,
          path.price,
          path.originalPrice,
          path.discountPercentage,
          path.durationWeeks,
          path.structuredHours,
          path.practiceHoursMin,
          path.practiceHoursMax,
          path.totalModules,
          path.totalLessons,
          path.objectives,
          path.outcomes,
          path.whoIsThisFor,
          path.whatYouWillLearn,
          path.modules,
          path.thumbnailUrl,
          path.bannerUrl,
          path.status,
          path.isFeatured,
          path.displayOrder,
          path.enrollmentCount,
          path.completionRate,
          path.averageRating,
          path.reviewCount,
        ]
      );
      
      console.log(`✅ Created: ${path.title}`);
    }
    
    console.log('\n🎉 Path Series seed completed successfully!');
    console.log(`📚 Total paths created: ${pathSeriesData.length}`);
    
    // Verify
    const [verifyResult] = await connection.execute(
      'SELECT slug, title, cefrLevel, price FROM learning_paths ORDER BY displayOrder'
    );
    
    console.log('\n📋 Created paths:');
    console.table(verifyResult);
    
  } catch (error) {
    console.error('❌ Error seeding paths:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seed
seedPaths().catch(console.error);
