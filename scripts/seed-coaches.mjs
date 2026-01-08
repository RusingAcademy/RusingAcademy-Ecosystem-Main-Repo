/**
 * Seed script for demo coach profiles
 * Run with: node scripts/seed-coaches.mjs
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const demoCoaches = [
  {
    userId: 100,
    displayName: 'Steven Barholere',
    slug: 'steven-barholere',
    bio: 'Founder of Lingueefy and RusingAcademy. I have helped hundreds of federal public servants achieve their SLE goals. My approach combines structured practice with real-world scenarios you\'ll encounter in your workplace.',
    bioFr: 'Fondateur de Lingueefy et RusingAcademy. J\'ai aidé des centaines de fonctionnaires fédéraux à atteindre leurs objectifs ELS. Mon approche combine une pratique structurée avec des scénarios réels que vous rencontrerez dans votre milieu de travail.',
    languages: JSON.stringify(['French', 'English']),
    teachingLanguage: 'French',
    specializations: JSON.stringify(['Oral C', 'Written C', 'SLE Exam Prep', 'Executive Briefings']),
    sleExpertise: JSON.stringify({
      oral: ['A', 'B', 'C'],
      written: ['A', 'B', 'C'],
      reading: ['A', 'B', 'C']
    }),
    hourlyRate: 8500, // $85.00 in cents
    trialRate: 0, // Free trial
    currency: 'CAD',
    yearsExperience: 15,
    totalStudents: 500,
    totalSessions: 2500,
    successRate: 94,
    averageRating: 49, // 4.9 out of 5
    totalReviews: 156,
    profileImageUrl: '/images/coaches/steven.jpg',
    videoIntroUrl: 'https://www.youtube.com/watch?v=coach-steven-intro',
    availability: JSON.stringify({
      timezone: 'America/Toronto',
      slots: [
        { day: 'monday', start: '09:00', end: '17:00' },
        { day: 'tuesday', start: '09:00', end: '17:00' },
        { day: 'wednesday', start: '09:00', end: '17:00' },
        { day: 'thursday', start: '09:00', end: '17:00' },
        { day: 'friday', start: '09:00', end: '15:00' },
      ]
    }),
    isVerified: true,
    isFeatured: true,
    status: 'approved',
  },
  {
    userId: 101,
    displayName: 'Sue-Anne Richer',
    slug: 'sue-anne-richer',
    bio: 'Bilingual language coach specializing in oral communication for federal public servants. I focus on building confidence and fluency through conversation-based learning.',
    bioFr: 'Coach linguistique bilingue spécialisée dans la communication orale pour les fonctionnaires fédéraux. Je me concentre sur le développement de la confiance et de la fluidité grâce à l\'apprentissage basé sur la conversation.',
    languages: JSON.stringify(['French', 'English']),
    teachingLanguage: 'French',
    specializations: JSON.stringify(['Oral B', 'Oral C', 'Conversation Practice', 'Meeting Skills']),
    sleExpertise: JSON.stringify({
      oral: ['B', 'C'],
      written: ['B'],
      reading: ['B', 'C']
    }),
    hourlyRate: 7500, // $75.00
    trialRate: 0,
    currency: 'CAD',
    yearsExperience: 10,
    totalStudents: 200,
    totalSessions: 1200,
    successRate: 91,
    averageRating: 48, // 4.8
    totalReviews: 89,
    profileImageUrl: '/images/coaches/sue-anne.jpg',
    videoIntroUrl: 'https://www.youtube.com/watch?v=coach-sue-anne-intro',
    availability: JSON.stringify({
      timezone: 'America/Toronto',
      slots: [
        { day: 'monday', start: '10:00', end: '18:00' },
        { day: 'tuesday', start: '10:00', end: '18:00' },
        { day: 'wednesday', start: '10:00', end: '18:00' },
        { day: 'thursday', start: '10:00', end: '18:00' },
      ]
    }),
    isVerified: true,
    isFeatured: true,
    status: 'approved',
  },
  {
    userId: 102,
    displayName: 'Erika Séguin',
    slug: 'erika-seguin',
    bio: 'Former federal government language assessor with deep knowledge of SLE evaluation criteria. I help learners understand exactly what evaluators are looking for.',
    bioFr: 'Ancienne évaluatrice linguistique du gouvernement fédéral avec une connaissance approfondie des critères d\'évaluation ELS. J\'aide les apprenants à comprendre exactement ce que les évaluateurs recherchent.',
    languages: JSON.stringify(['French', 'English']),
    teachingLanguage: 'French',
    specializations: JSON.stringify(['SLE Exam Strategy', 'Oral C', 'Written B', 'Grammar']),
    sleExpertise: JSON.stringify({
      oral: ['A', 'B', 'C'],
      written: ['A', 'B'],
      reading: ['A', 'B', 'C']
    }),
    hourlyRate: 8000, // $80.00
    trialRate: 0,
    currency: 'CAD',
    yearsExperience: 12,
    totalStudents: 300,
    totalSessions: 1800,
    successRate: 93,
    averageRating: 49, // 4.9
    totalReviews: 112,
    profileImageUrl: '/images/coaches/erika.jpg',
    videoIntroUrl: 'https://www.youtube.com/watch?v=coach-erika-intro',
    availability: JSON.stringify({
      timezone: 'America/Toronto',
      slots: [
        { day: 'tuesday', start: '08:00', end: '16:00' },
        { day: 'wednesday', start: '08:00', end: '16:00' },
        { day: 'thursday', start: '08:00', end: '16:00' },
        { day: 'friday', start: '08:00', end: '14:00' },
        { day: 'saturday', start: '09:00', end: '13:00' },
      ]
    }),
    isVerified: true,
    isFeatured: true,
    status: 'approved',
  },
  {
    userId: 103,
    displayName: 'Marc-André Leblanc',
    slug: 'marc-andre-leblanc',
    bio: 'English language specialist helping francophone public servants improve their English skills for bilingual positions. Patient, methodical approach.',
    bioFr: 'Spécialiste de la langue anglaise aidant les fonctionnaires francophones à améliorer leurs compétences en anglais pour les postes bilingues. Approche patiente et méthodique.',
    languages: JSON.stringify(['English', 'French']),
    teachingLanguage: 'English',
    specializations: JSON.stringify(['English Oral', 'English Written', 'Business English', 'Presentations']),
    sleExpertise: JSON.stringify({
      oral: ['B', 'C'],
      written: ['B', 'C'],
      reading: ['B', 'C']
    }),
    hourlyRate: 7000, // $70.00
    trialRate: 0,
    currency: 'CAD',
    yearsExperience: 8,
    totalStudents: 150,
    totalSessions: 900,
    successRate: 89,
    averageRating: 47, // 4.7
    totalReviews: 67,
    profileImageUrl: '/images/coaches/marc-andre.jpg',
    videoIntroUrl: null,
    availability: JSON.stringify({
      timezone: 'America/Toronto',
      slots: [
        { day: 'monday', start: '17:00', end: '21:00' },
        { day: 'tuesday', start: '17:00', end: '21:00' },
        { day: 'wednesday', start: '17:00', end: '21:00' },
        { day: 'saturday', start: '10:00', end: '16:00' },
      ]
    }),
    isVerified: false,
    isFeatured: false,
    status: 'approved',
  },
  {
    userId: 104,
    displayName: 'Catherine Tremblay',
    slug: 'catherine-tremblay',
    bio: 'Specialized in helping learners go from B to C level. I focus on the nuances and advanced structures that make the difference at the C level.',
    bioFr: 'Spécialisée pour aider les apprenants à passer du niveau B au niveau C. Je me concentre sur les nuances et les structures avancées qui font la différence au niveau C.',
    languages: JSON.stringify(['French', 'English']),
    teachingLanguage: 'French',
    specializations: JSON.stringify(['B to C Transition', 'Advanced Grammar', 'Oral C', 'Written C']),
    sleExpertise: JSON.stringify({
      oral: ['C'],
      written: ['C'],
      reading: ['C']
    }),
    hourlyRate: 9000, // $90.00
    trialRate: 2500, // $25 trial
    currency: 'CAD',
    yearsExperience: 14,
    totalStudents: 180,
    totalSessions: 1100,
    successRate: 96,
    averageRating: 50, // 5.0
    totalReviews: 78,
    profileImageUrl: '/images/coaches/catherine.jpg',
    videoIntroUrl: 'https://www.youtube.com/watch?v=coach-catherine-intro',
    availability: JSON.stringify({
      timezone: 'America/Toronto',
      slots: [
        { day: 'monday', start: '08:00', end: '12:00' },
        { day: 'wednesday', start: '08:00', end: '12:00' },
        { day: 'friday', start: '08:00', end: '12:00' },
      ]
    }),
    isVerified: true,
    isFeatured: true,
    status: 'approved',
  },
];

async function seedCoaches() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Seeding demo coach profiles...');
  
  for (const coach of demoCoaches) {
    try {
      // First create a user record
      await connection.execute(
        `INSERT INTO users (id, openId, name, email, role, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, ?, 'user', NOW(), NOW(), NOW())
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [coach.userId, `demo-coach-${coach.userId}`, coach.displayName, `${coach.slug}@demo.lingueefy.com`]
      );
      
      // Then create the coach profile
      await connection.execute(
        `INSERT INTO coaches (
          userId, displayName, slug, bio, bioFr, languages, teachingLanguage,
          specializations, sleExpertise, hourlyRate, trialRate, currency,
          yearsExperience, totalStudents, totalSessions, successRate,
          averageRating, totalReviews, profileImageUrl, videoIntroUrl,
          availability, isVerified, isFeatured, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          displayName = VALUES(displayName),
          bio = VALUES(bio),
          bioFr = VALUES(bioFr),
          specializations = VALUES(specializations),
          sleExpertise = VALUES(sleExpertise),
          hourlyRate = VALUES(hourlyRate),
          totalStudents = VALUES(totalStudents),
          totalSessions = VALUES(totalSessions),
          successRate = VALUES(successRate),
          averageRating = VALUES(averageRating),
          totalReviews = VALUES(totalReviews),
          isFeatured = VALUES(isFeatured),
          updatedAt = NOW()`,
        [
          coach.userId, coach.displayName, coach.slug, coach.bio, coach.bioFr,
          coach.languages, coach.teachingLanguage, coach.specializations,
          coach.sleExpertise, coach.hourlyRate, coach.trialRate, coach.currency,
          coach.yearsExperience, coach.totalStudents, coach.totalSessions,
          coach.successRate, coach.averageRating, coach.totalReviews,
          coach.profileImageUrl, coach.videoIntroUrl, coach.availability,
          coach.isVerified, coach.isFeatured, coach.status
        ]
      );
      
      console.log(`✓ Seeded coach: ${coach.displayName}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${coach.displayName}:`, error.message);
    }
  }
  
  await connection.end();
  console.log('\\nSeeding complete!');
}

seedCoaches().catch(console.error);
