import { getDb } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('No DB connection');
    return;
  }
  
  // Get lessons with quiz questions
  const result = await db.execute(sql`
    SELECT DISTINCT q.lessonId, l.title, l.contentType
    FROM quiz_questions q
    JOIN lessons l ON l.id = q.lessonId
    LIMIT 5
  `);
  console.log('Lessons with quiz questions:');
  console.log(JSON.stringify(result[0], null, 2));
  
  // Get sample quiz question
  const questions = await db.execute(sql`
    SELECT id, lessonId, questionText, questionType, options, correctAnswer
    FROM quiz_questions
    LIMIT 2
  `);
  console.log('\nSample quiz questions:');
  console.log(JSON.stringify(questions[0], null, 2));
}

main().catch(console.error);
