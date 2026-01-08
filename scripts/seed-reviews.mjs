import mysql from 'mysql2/promise';

// Demo reviews data for each coach
const reviewsData = {
  'steven-barholere': [
    {
      rating: 5,
      comment: "Steven helped me achieve my Oral C in just 3 months! His methodology for spontaneous conversation practice is incredible. He understands exactly what the PSC evaluators are looking for.",
      sleAchievement: "Oral C",
      reviewerName: "Marie T.",
      reviewerDept: "Treasury Board Secretariat"
    },
    {
      rating: 5,
      comment: "After failing my Oral C twice, I was ready to give up. Steven's structured approach and constant encouragement helped me finally pass. His feedback on my weak points was spot-on.",
      sleAchievement: "Oral C",
      reviewerName: "Jean-Pierre L.",
      reviewerDept: "Immigration, Refugees and Citizenship Canada"
    },
    {
      rating: 5,
      comment: "The best investment I've made in my career. Steven's mock exams are incredibly realistic and his tips for managing exam anxiety were game-changers.",
      sleAchievement: "CBC",
      reviewerName: "Sarah M.",
      reviewerDept: "Health Canada"
    },
    {
      rating: 4,
      comment: "Very knowledgeable coach with great insights into the SLE evaluation criteria. The only reason for 4 stars is scheduling can be challenging due to his popularity.",
      sleAchievement: "Oral B",
      reviewerName: "David K.",
      reviewerDept: "Public Services and Procurement Canada"
    },
    {
      rating: 5,
      comment: "Steven's patience and expertise made all the difference. He tailored each session to my specific needs and helped me overcome my fear of speaking French in professional settings.",
      sleAchievement: "Oral C",
      reviewerName: "Amanda R.",
      reviewerDept: "Employment and Social Development Canada"
    }
  ],
  'sue-anne-richer': [
    {
      rating: 5,
      comment: "Sue-Anne is fantastic for written French preparation. Her grammar explanations are clear and she provides excellent practice exercises. Passed my Written C on the first try!",
      sleAchievement: "Written C",
      reviewerName: "Michael B.",
      reviewerDept: "Finance Canada"
    },
    {
      rating: 5,
      comment: "I struggled with written French for years. Sue-Anne's systematic approach to grammar and her detailed feedback on my writing samples transformed my skills.",
      sleAchievement: "Written B",
      reviewerName: "Jennifer W.",
      reviewerDept: "Transport Canada"
    },
    {
      rating: 4,
      comment: "Great coach for anyone preparing for the written exam. She provides lots of practice materials and her corrections are very thorough. Highly recommend!",
      sleAchievement: "Written B",
      reviewerName: "Robert C.",
      reviewerDept: "Natural Resources Canada"
    },
    {
      rating: 5,
      comment: "Sue-Anne helped me understand the nuances of formal French writing. Her tips for the comprehension section were invaluable. Achieved my BBB profile!",
      sleAchievement: "BBB",
      reviewerName: "Lisa P.",
      reviewerDept: "Canadian Heritage"
    }
  ],
  'erika-seguin': [
    {
      rating: 5,
      comment: "Erika specializes in helping with exam anxiety, which was my biggest obstacle. Her calming approach and practical techniques helped me stay focused during my Oral B exam.",
      sleAchievement: "Oral B",
      reviewerName: "Thomas H.",
      reviewerDept: "Statistics Canada"
    },
    {
      rating: 5,
      comment: "Perfect for beginners! Erika made me feel comfortable speaking French from day one. She's patient, encouraging, and really understands the challenges anglophones face.",
      sleAchievement: "Oral A",
      reviewerName: "Catherine D.",
      reviewerDept: "Environment and Climate Change Canada"
    },
    {
      rating: 4,
      comment: "Erika is wonderful for building confidence. Her conversational approach made practice sessions feel natural rather than stressful. Great for oral preparation.",
      sleAchievement: "Oral B",
      reviewerName: "Patrick N.",
      reviewerDept: "Veterans Affairs Canada"
    },
    {
      rating: 5,
      comment: "I was terrified of speaking French in professional settings. Erika's gentle coaching style and positive reinforcement helped me overcome my fear. Now I'm confident in meetings!",
      sleAchievement: "Oral B",
      reviewerName: "Michelle G.",
      reviewerDept: "Agriculture and Agri-Food Canada"
    },
    {
      rating: 5,
      comment: "Erika's focus on practical workplace French was exactly what I needed. She helped me prepare for real scenarios I face daily. Excellent coach for public servants!",
      sleAchievement: "Oral B",
      reviewerName: "Kevin S.",
      reviewerDept: "Fisheries and Oceans Canada"
    }
  ]
};

async function seedReviews() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Starting to seed demo reviews...');
    
    // Get coach IDs by slug
    const [coaches] = await connection.execute(
      'SELECT id, slug FROM coach_profiles WHERE slug IN (?, ?, ?)',
      ['steven-barholere', 'sue-anne-richer', 'erika-seguin']
    );
    
    if (coaches.length === 0) {
      console.log('No coaches found. Please run seed-coaches.mjs first.');
      return;
    }
    
    console.log(`Found ${coaches.length} coaches`);
    
    // Create a demo learner profile for reviews if not exists
    const [existingLearner] = await connection.execute(
      'SELECT id FROM learner_profiles WHERE department = ?',
      ['Demo Reviews']
    );
    
    let learnerProfileId;
    if (existingLearner.length === 0) {
      // First create a demo user
      const [userResult] = await connection.execute(
        `INSERT INTO users (openId, name, email, role) VALUES (?, ?, ?, ?)`,
        ['demo-reviewer-user', 'Demo Reviewer', 'demo@lingueefy.com', 'learner']
      );
      
      // Then create learner profile
      const [learnerResult] = await connection.execute(
        `INSERT INTO learner_profiles (userId, department, position, currentLevel, targetLevel) VALUES (?, ?, ?, ?, ?)`,
        [userResult.insertId, 'Demo Reviews', 'Demo Position', JSON.stringify({oral: 'B', written: 'B', reading: 'B'}), JSON.stringify({oral: 'C', written: 'C', reading: 'C'})]
      );
      learnerProfileId = learnerResult.insertId;
      console.log('Created demo learner profile');
    } else {
      learnerProfileId = existingLearner[0].id;
      console.log('Using existing demo learner profile');
    }
    
    // Create demo sessions and reviews for each coach
    for (const coach of coaches) {
      const coachReviews = reviewsData[coach.slug];
      if (!coachReviews) continue;
      
      console.log(`\nSeeding reviews for ${coach.slug}...`);
      
      for (let i = 0; i < coachReviews.length; i++) {
        const review = coachReviews[i];
        
        // Create a demo session for this review
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - (30 + i * 15)); // Spread sessions over past months
        
        const [sessionResult] = await connection.execute(
          `INSERT INTO sessions (coachId, learnerId, scheduledAt, duration, sessionType, status, price, completedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [coach.id, learnerProfileId, sessionDate, 60, 'single', 'completed', 7500, sessionDate]
        );
        
        // Create the review
        const reviewDate = new Date(sessionDate);
        reviewDate.setDate(reviewDate.getDate() + 1); // Review posted day after session
        
        await connection.execute(
          `INSERT INTO reviews (sessionId, learnerId, coachId, rating, comment, sleAchievement, isVisible, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [sessionResult.insertId, learnerProfileId, coach.id, review.rating, 
           `${review.comment}\n\n— ${review.reviewerName}, ${review.reviewerDept}`,
           review.sleAchievement, true, reviewDate]
        );
        
        console.log(`  Added review ${i + 1}: ${review.rating} stars from ${review.reviewerName}`);
      }
      
      // Update coach's average rating
      const [ratingResult] = await connection.execute(
        `SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE coachId = ?`,
        [coach.id]
      );
      
      await connection.execute(
        `UPDATE coach_profiles SET averageRating = ? WHERE id = ?`,
        [ratingResult[0].avgRating, coach.id]
      );
      
      console.log(`  Updated average rating to ${parseFloat(ratingResult[0].avgRating).toFixed(2)}`);
    }
    
    console.log('\n✅ Demo reviews seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedReviews();
