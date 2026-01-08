/**
 * Script to add demo reviews for new coaches
 * Run with: node scripts/add-demo-reviews.mjs
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable');
  process.exit(1);
}

// Demo reviews data for each new coach
const coachReviews = {
  'soukaina-mhammedi-alaoui': [
    {
      rating: 5,
      comment: "Soukaina est exceptionnelle! Elle a su adapter son approche à mes besoins spécifiques et m'a aidé à obtenir mon niveau C à l'oral. Sa patience et son expertise sont remarquables.",
      sleAchievement: "Oral C"
    },
    {
      rating: 5,
      comment: "Excellent coaching! Soukaina combines cultural insights with practical language skills. Her sessions are always engaging and productive.",
      sleAchievement: "CBC"
    },
    {
      rating: 4,
      comment: "Très bonne coach, elle comprend bien les défis des fonctionnaires fédéraux. Ses exercices de simulation d'examen sont très utiles.",
      sleAchievement: "Oral B"
    }
  ],
  'preciosa-baganha': [
    {
      rating: 5,
      comment: "Preciosa helped me improve my professional English significantly. Her focus on workplace communication was exactly what I needed for my executive role.",
      sleAchievement: null
    },
    {
      rating: 5,
      comment: "Outstanding coach! Preciosa's immersive conversation approach helped me gain confidence in high-level discussions. Highly recommend!",
      sleAchievement: null
    },
    {
      rating: 4,
      comment: "Great sessions focused on professional English. Preciosa is very patient and provides excellent feedback on pronunciation and vocabulary.",
      sleAchievement: null
    }
  ],
  'victor-amisi': [
    {
      rating: 5,
      comment: "Victor est un coach exceptionnel! Son expérience personnelle avec les examens SLE lui permet de donner des conseils très pertinents. J'ai obtenu mon CBC grâce à lui!",
      sleAchievement: "CBC"
    },
    {
      rating: 5,
      comment: "Best exam prep coach I've worked with. Victor's simulation exercises are incredibly realistic and helped me feel confident on exam day.",
      sleAchievement: "Oral C"
    },
    {
      rating: 5,
      comment: "Victor m'a aidé à passer de BBB à CBC en seulement 3 mois. Ses techniques de préparation sont vraiment efficaces.",
      sleAchievement: "CBC"
    },
    {
      rating: 4,
      comment: "Excellent coach with deep knowledge of SLE requirements. Victor's insider tips made a real difference in my preparation.",
      sleAchievement: "Oral B"
    }
  ],
  'francine-nkurunziza': [
    {
      rating: 5,
      comment: "Francine is perfect for executive-level French coaching. Her calm and professional approach helped me excel in strategic meetings and briefings.",
      sleAchievement: "Oral C"
    },
    {
      rating: 5,
      comment: "Excellent coaching pour les cadres! Francine comprend les enjeux de la communication stratégique et m'a aidé à améliorer mon français professionnel.",
      sleAchievement: null
    },
    {
      rating: 4,
      comment: "Very professional coach. Francine's focus on executive communication helped me prepare for high-stakes presentations in French.",
      sleAchievement: "Oral B"
    }
  ]
};

async function main() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Get coach IDs
    const [coaches] = await connection.execute(
      `SELECT id, slug FROM coach_profiles WHERE slug IN ('soukaina-mhammedi-alaoui', 'preciosa-baganha', 'victor-amisi', 'francine-nkurunziza')`
    );
    
    // Get learner IDs (we'll create demo learners if needed)
    let [learners] = await connection.execute('SELECT id FROM learner_profiles LIMIT 10');
    
    if (learners.length === 0) {
      console.log('No learners found, creating demo learners...');
      // Create demo users first
      for (let i = 1; i <= 5; i++) {
        await connection.execute(
          `INSERT INTO users (openId, name, email, role) VALUES (?, ?, ?, 'learner')`,
          [`demo-learner-${i}`, `Demo Learner ${i}`, `demo${i}@example.com`]
        );
      }
      const [newUsers] = await connection.execute(
        `SELECT id FROM users WHERE openId LIKE 'demo-learner-%'`
      );
      for (const user of newUsers) {
        await connection.execute(
          `INSERT INTO learner_profiles (userId) VALUES (?)`,
          [user.id]
        );
      }
      [learners] = await connection.execute('SELECT id FROM learner_profiles LIMIT 10');
    }
    
    console.log(`Found ${coaches.length} coaches and ${learners.length} learners`);
    
    let reviewCount = 0;
    
    for (const coach of coaches) {
      const reviews = coachReviews[coach.slug];
      if (!reviews) continue;
      
      console.log(`\\nAdding reviews for ${coach.slug}...`);
      
      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const learner = learners[i % learners.length];
        
        // Create a completed session for this review
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - (30 + i * 7)); // Past sessions
        
        const [sessionResult] = await connection.execute(
          `INSERT INTO sessions (coachId, learnerId, scheduledAt, duration, status, sessionType, price)
           VALUES (?, ?, ?, 60, 'completed', 'single', 6000)`,
          [coach.id, learner.id, sessionDate]
        );
        
        const sessionId = sessionResult.insertId;
        
        // Create the review
        await connection.execute(
          `INSERT INTO reviews (sessionId, learnerId, coachId, rating, comment, sleAchievement, isVisible, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, true, ?)`,
          [sessionId, learner.id, coach.id, review.rating, review.comment, review.sleAchievement, sessionDate]
        );
        
        reviewCount++;
        console.log(`  ✅ Added review ${i + 1}/${reviews.length} (${review.rating} stars)`);
      }
      
      // Update coach average rating
      const [ratingResult] = await connection.execute(
        `SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE coachId = ?`,
        [coach.id]
      );
      
      if (ratingResult[0].avgRating) {
        await connection.execute(
          `UPDATE coach_profiles SET averageRating = ? WHERE id = ?`,
          [ratingResult[0].avgRating, coach.id]
        );
        console.log(`  ✅ Updated average rating to ${parseFloat(ratingResult[0].avgRating).toFixed(2)}`);
      }
    }
    
    console.log(`\\n✅ Added ${reviewCount} demo reviews successfully!`);
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
