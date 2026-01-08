/**
 * Migration script to update coach profiles with complete data from Rusing Academy
 * Run with: node scripts/update-coach-profiles.mjs
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const coaches = [
  {
    name: "Steven Barholere",
    slug: "steven-barholere",
    headline: "Oral Exam Prep (Levels B & C) | Human-Centred Coaching | Performance Confidence",
    bio: "Steven helps public servants succeed by creating a relaxed, supportive space focused on confidence and clarity. His human-centred coaching reduces anxiety and builds real exam readiness through targeted speaking strategies. With years of experience preparing federal employees for SLE oral exams, Steven specializes in Levels B and C preparation with a focus on performance confidence and natural conversation flow.",
    languages: "both",
    location: "Ottawa",
    rating: 4.9,
    reviewCount: 324,
    hourlyRate: 85,
    trialRate: 45,
    specializations: JSON.stringify({
      oral_b: true,
      oral_c: true,
      confidence: true,
      exam_prep: true
    })
  },
  {
    name: "Sue-Anne Richer",
    slug: "sue-anne-richer",
    headline: "Structured Exam Prep | Oral & Written Precision | Strategic Practice",
    bio: "Sue-Anne offers clear, structured coaching that breaks down complex skills into simple steps. Her methodical approach helps learners gain accuracy, confidence, and results on public service language exams. Based in Montreal, Sue-Anne brings a bilingual perspective to her teaching, helping learners master both oral and written French and English for government positions.",
    languages: "both",
    location: "Montreal",
    rating: 4.8,
    reviewCount: 324,
    hourlyRate: 80,
    trialRate: 40,
    specializations: JSON.stringify({
      oral_b: true,
      oral_c: true,
      written: true,
      exam_prep: true
    })
  },
  {
    name: "Erika Séguin",
    slug: "erika-seguin",
    headline: "Exam Mindset | Performance Psychology | Self-Awareness",
    bio: "Erika helps learners prepare mentally for success by building emotional control, focus, and self-understanding. Her coaching blends mindset training and performance strategies to reduce stress and improve exam confidence. Specializing in English language coaching, Erika works with public servants who need to overcome exam anxiety and perform at their best under pressure.",
    languages: "english",
    location: "Ottawa",
    rating: 4.8,
    reviewCount: 278,
    hourlyRate: 75,
    trialRate: 40,
    specializations: JSON.stringify({
      mindset: true,
      confidence: true,
      exam_prep: true
    })
  },
  {
    name: "Preciosa Baganha",
    slug: "preciosa-baganha",
    headline: "Professional English | Immersive Conversations | Advanced Second Language Coaching",
    bio: "Helping public servants refine their professional English through high-level discussions, immersive communication strategies, and real-world scenarios. Preciosa specializes in elevating workplace English fluency for presentations, meetings, and cross-cultural contexts. Her coaching is ideal for executives and senior public servants who need polished, professional English communication skills.",
    languages: "english",
    location: "Ottawa",
    rating: 4.8,
    reviewCount: 324,
    hourlyRate: 85,
    trialRate: 45,
    specializations: JSON.stringify({
      professional_english: true,
      presentations: true,
      workplace: true,
      executive: true
    })
  },
  {
    name: "Victor Amisi",
    slug: "victor-amisi",
    headline: "BBB/CBC Preparation | Oral Exam Simulation",
    bio: "With years of hands-on experience mastering SLE levels from BBB to CCC, Victor offers unmatched insider insights to help federal employees succeed. His coaching style blends strategic simulations with exam-tested techniques for confident, consistent results. Victor's exam simulations are highly realistic, preparing learners for exactly what to expect on test day.",
    languages: "both",
    location: "Ottawa",
    rating: 4.8,
    reviewCount: 310,
    hourlyRate: 80,
    trialRate: 40,
    specializations: JSON.stringify({
      oral_b: true,
      oral_c: true,
      simulation: true,
      exam_prep: true
    })
  },
  {
    name: "Soukaina Mhammedi Alaoui",
    slug: "soukaina-mhammedi-alaoui",
    headline: "BBB Preparation | CBC Coaching | Cultural Integration",
    bio: "Integrating linguistic skills with cultural context, ensuring fluency in real federal workplace scenarios. Soukaina specializes in helping public servants achieve their BBB and CBC goals through culturally-aware coaching. Based in Montreal, she brings a unique multicultural perspective to language learning, helping learners navigate both linguistic and cultural aspects of bilingual workplaces.",
    languages: "both",
    location: "Montreal",
    rating: 4.9,
    reviewCount: 487,
    hourlyRate: 85,
    trialRate: 45,
    specializations: JSON.stringify({
      oral_b: true,
      oral_c: true,
      cultural: true,
      exam_prep: true
    })
  },
  {
    name: "Francine Nkurunziza",
    slug: "francine-nkurunziza",
    headline: "Executive French | Strategic Communication | Oral Exam Coaching",
    bio: "Francine helps executives shine in briefings, strategic meetings, and oral exams with a calm, clear, and highly professional approach. She specializes in executive-level French communication for senior public servants, helping them communicate with confidence and authority in high-stakes situations. Her coaching is tailored for leaders who need to present, negotiate, and lead in French.",
    languages: "both",
    location: "Ottawa",
    rating: 4.8,
    reviewCount: 324,
    hourlyRate: 90,
    trialRate: 50,
    specializations: JSON.stringify({
      executive: true,
      oral_c: true,
      strategic: true,
      exam_prep: true
    })
  }
];

async function main() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // First, check existing coaches
    const [existingCoaches] = await connection.execute(
      'SELECT id, slug FROM coach_profiles'
    );
    console.log(`Found ${existingCoaches.length} existing coach profiles`);
    
    const existingSlugs = new Set(existingCoaches.map(c => c.slug));
    
    for (const coach of coaches) {
      if (existingSlugs.has(coach.slug)) {
        // Update existing coach
        console.log(`Updating existing coach: ${coach.name}`);
        await connection.execute(
          `UPDATE coach_profiles SET 
            headline = ?,
            bio = ?,
            languages = ?,
            averageRating = ?,
            totalSessions = ?,
            hourlyRate = ?,
            trialRate = ?,
            specializations = ?,
            profileComplete = true,
            status = 'approved'
          WHERE slug = ?`,
          [
            coach.headline,
            coach.bio,
            coach.languages,
            coach.rating,
            coach.reviewCount,
            coach.hourlyRate,
            coach.trialRate,
            coach.specializations,
            coach.slug
          ]
        );
      } else {
        // Need to create user first, then coach profile
        console.log(`Creating new coach: ${coach.name}`);
        
        // Create a placeholder user for the coach
        const email = `${coach.slug.replace(/-/g, '.')}@lingueefy.ca`;
        const openId = `coach-${coach.slug}`;
        
        // Check if user exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE openId = ?',
          [openId]
        );
        
        let userId;
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          // Create user
          const [userResult] = await connection.execute(
            `INSERT INTO users (openId, name, email, preferredLanguage) VALUES (?, ?, ?, 'en')`,
            [openId, coach.name, email]
          );
          userId = userResult.insertId;
        }
        
        // Create coach profile
        await connection.execute(
          `INSERT INTO coach_profiles (
            userId, slug, headline, bio, languages, 
            averageRating, totalSessions, hourlyRate, trialRate,
            specializations, profileComplete, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, 'approved')`,
          [
            userId,
            coach.slug,
            coach.headline,
            coach.bio,
            coach.languages,
            coach.rating,
            coach.reviewCount,
            coach.hourlyRate,
            coach.trialRate,
            coach.specializations
          ]
        );
      }
    }
    
    // Verify all coaches are now complete
    const [finalCoaches] = await connection.execute(
      'SELECT id, slug, profileComplete, status FROM coach_profiles WHERE profileComplete = true'
    );
    console.log(`\\n✅ ${finalCoaches.length} coaches now have complete profiles`);
    
    for (const c of finalCoaches) {
      console.log(`  - ${c.slug}: complete=${c.profile_complete}, status=${c.status}`);
    }
    
  } finally {
    await connection.end();
  }
  
  console.log('\\n✅ Coach profile migration complete!');
}

main().catch(console.error);
