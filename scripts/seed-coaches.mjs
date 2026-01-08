/**
 * Seed script for demo coach profiles
 * Run with: node scripts/seed-coaches.mjs
 * 
 * This script seeds the three featured coaches from Rusing Academy
 * into the database with their real YouTube video URLs and photos.
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const coaches = [
  {
    openId: 'coach-steven-barholere-seed',
    name: 'Steven Barholere',
    email: 'steven@rusingacademy.ca',
    avatarUrl: '/images/coach-steven.jpg',
    profile: {
      slug: 'steven-barholere',
      headline: 'GC Exam Coach | Oral C Specialist | Founder of Rusing Academy',
      bio: `Steven Barholere is the founder of Rusing Academy and a leading expert in Canadian federal government language testing preparation. With years of experience coaching public servants, Steven has developed proven methodologies to help learners achieve their SLE goals.

His approach combines deep understanding of the PSC evaluation criteria with personalized coaching strategies. Steven specializes in helping learners overcome the challenges of the Oral C level, which is often considered the most difficult to achieve.

As the creator of the Lingueefy platform, Steven is committed to making high-quality SLE preparation accessible to all federal public servants across Canada.`,
      languages: 'french',
      specializations: {
        oralC: true,
        oralB: true,
        examPrep: true,
        businessFrench: true,
      },
      yearsExperience: 10,
      credentials: 'Founder of Rusing Academy, GC Language Testing Expert, Former Federal Public Servant',
      hourlyRate: 7500,
      trialRate: 3500,
      totalSessions: 500,
      totalStudents: 150,
      averageRating: 4.9,
      successRate: 95,
      responseTimeHours: 4,
      videoUrl: 'https://www.youtube.com/watch?v=LEc84vX0xe0',
    },
  },
  {
    openId: 'coach-sue-anne-richer-seed',
    name: 'Sue-Anne Richer',
    email: 'sue-anne@rusingacademy.ca',
    avatarUrl: '/images/coach-sue-anne.jpg',
    profile: {
      slug: 'sue-anne-richer',
      headline: 'Bilingual Communication Expert | Written & Oral Specialist',
      bio: `Sue-Anne Richer brings a wealth of experience in bilingual communication and language coaching. Her expertise spans both written and oral components of the SLE, making her an ideal coach for learners seeking comprehensive preparation.

Sue-Anne's teaching style is patient and methodical. She excels at breaking down complex language concepts into manageable steps, helping learners build confidence progressively. Her background in professional communication gives her unique insights into the practical applications of language skills in the federal workplace.

Whether you're preparing for your first SLE or aiming to upgrade your levels, Sue-Anne provides the structured guidance and encouragement you need to succeed.`,
      languages: 'both',
      specializations: {
        oralB: true,
        oralC: true,
        writtenB: true,
        writtenC: true,
        readingComprehension: true,
      },
      yearsExperience: 8,
      credentials: 'Certified Language Instructor, Bilingual Communication Specialist',
      hourlyRate: 6500,
      trialRate: 3000,
      totalSessions: 320,
      totalStudents: 95,
      averageRating: 4.8,
      successRate: 92,
      responseTimeHours: 6,
      videoUrl: 'https://www.youtube.com/watch?v=SuuhMpF5KoA',
    },
  },
  {
    openId: 'coach-erika-seguin-seed',
    name: 'Erika Séguin',
    email: 'erika@rusingacademy.ca',
    avatarUrl: '/images/coach-erika.jpg',
    profile: {
      slug: 'erika-seguin',
      headline: 'French Language Coach | Anxiety Management & Confidence Building',
      bio: `Erika Séguin specializes in helping learners overcome test anxiety and build lasting confidence in their French language abilities. Her empathetic approach creates a supportive learning environment where students feel comfortable making mistakes and learning from them.

Erika understands that language learning is not just about grammar and vocabulary—it's about developing the confidence to communicate effectively under pressure. Her coaching incorporates techniques for managing exam stress while building solid language foundations.

With Erika's guidance, many learners have transformed their relationship with French, going from anxious test-takers to confident communicators who excel in their SLE evaluations.`,
      languages: 'french',
      specializations: {
        oralB: true,
        oralC: true,
        anxietyCoaching: true,
        examPrep: true,
      },
      yearsExperience: 6,
      credentials: 'French Language Educator, Certified Coach, Anxiety Management Specialist',
      hourlyRate: 5500,
      trialRate: 2500,
      totalSessions: 280,
      totalStudents: 85,
      averageRating: 4.9,
      successRate: 93,
      responseTimeHours: 3,
      videoUrl: 'https://www.youtube.com/watch?v=rAdJZ4o_N2Y',
    },
  },
];

async function seedCoaches() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Seeding coach profiles...\n');
  
  for (const coach of coaches) {
    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE openId = ?',
        [coach.openId]
      );
      
      let userId;
      
      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
        console.log(`User ${coach.name} already exists with ID ${userId}, updating...`);
        
        // Update user
        await connection.execute(
          'UPDATE users SET name = ?, email = ?, role = ?, avatarUrl = ?, updatedAt = NOW() WHERE id = ?',
          [coach.name, coach.email, 'coach', coach.avatarUrl, userId]
        );
      } else {
        // Insert new user
        const [userResult] = await connection.execute(
          `INSERT INTO users (openId, name, email, role, avatarUrl, createdAt, updatedAt, lastSignedIn) 
           VALUES (?, ?, ?, 'coach', ?, NOW(), NOW(), NOW())`,
          [coach.openId, coach.name, coach.email, coach.avatarUrl]
        );
        userId = userResult.insertId;
        console.log(`Created user ${coach.name} with ID ${userId}`);
      }
      
      // Check if coach profile already exists
      const [existingProfiles] = await connection.execute(
        'SELECT id FROM coach_profiles WHERE slug = ?',
        [coach.profile.slug]
      );
      
      const p = coach.profile;
      const specsJson = JSON.stringify(p.specializations);
      
      if (existingProfiles.length > 0) {
        console.log(`Coach profile for ${coach.name} already exists, updating...`);
        await connection.execute(
          `UPDATE coach_profiles SET 
            userId = ?,
            headline = ?, 
            bio = ?, 
            languages = ?, 
            specializations = ?, 
            yearsExperience = ?, 
            credentials = ?, 
            hourlyRate = ?, 
            trialRate = ?,
            totalSessions = ?, 
            totalStudents = ?, 
            averageRating = ?, 
            successRate = ?,
            responseTimeHours = ?, 
            videoUrl = ?, 
            status = 'approved', 
            approvedAt = NOW(),
            updatedAt = NOW()
           WHERE slug = ?`,
          [
            userId,
            p.headline, p.bio, p.languages, specsJson,
            p.yearsExperience, p.credentials, p.hourlyRate, p.trialRate,
            p.totalSessions, p.totalStudents, p.averageRating, p.successRate,
            p.responseTimeHours, p.videoUrl, p.slug
          ]
        );
      } else {
        // Insert coach profile
        await connection.execute(
          `INSERT INTO coach_profiles (
            userId, slug, headline, bio, languages, specializations, 
            yearsExperience, credentials, hourlyRate, trialRate,
            totalSessions, totalStudents, averageRating, successRate,
            responseTimeHours, videoUrl, status, approvedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW(), NOW(), NOW())`,
          [
            userId, p.slug, p.headline, p.bio, p.languages, specsJson,
            p.yearsExperience, p.credentials, p.hourlyRate, p.trialRate,
            p.totalSessions, p.totalStudents, p.averageRating, p.successRate,
            p.responseTimeHours, p.videoUrl
          ]
        );
        console.log(`Created coach profile for ${coach.name}`);
      }
      
      console.log(`✓ Seeded coach: ${coach.name}\n`);
    } catch (error) {
      console.error(`✗ Failed to seed ${coach.name}:`, error.message);
    }
  }
  
  // Verify the data
  console.log('\n--- Verification ---');
  const [verifyCoaches] = await connection.execute(
    `SELECT cp.slug, cp.headline, cp.status, cp.hourlyRate, u.name, u.avatarUrl
     FROM coach_profiles cp 
     JOIN users u ON cp.userId = u.id 
     WHERE cp.status = 'approved'`
  );
  
  console.log(`\nApproved coaches in database: ${verifyCoaches.length}`);
  verifyCoaches.forEach(c => {
    console.log(`  - ${c.name} (${c.slug})`);
    console.log(`    Rate: $${c.hourlyRate / 100}/hr`);
    console.log(`    Avatar: ${c.avatarUrl}`);
  });
  
  await connection.end();
  console.log('\nSeeding complete!');
}

seedCoaches().catch(console.error);
