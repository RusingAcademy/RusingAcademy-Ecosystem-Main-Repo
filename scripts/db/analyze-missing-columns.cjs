const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get courses columns
  const [cols] = await conn.execute('SHOW COLUMNS FROM courses');
  const dbCols = cols.map(c => c.Field);
  
  // Schema columns (from the Drizzle schema)
  const schemaCols = ['id','title','titleFr','slug','description','descriptionFr','shortDescription','shortDescriptionFr','pathCompletionBadgeUrl','thumbnailUrl','previewVideoUrl','category','level','targetLanguage','price','originalPrice','currency','accessType','accessDurationDays','totalModules','totalLessons','totalDurationMinutes','totalEnrollments','averageRating','totalReviews','instructorId','instructorName','status','publishedAt','publishedBy','metaTitle','metaDescription','hasCertificate','hasQuizzes','hasDownloads','dripEnabled','dripInterval','dripUnit','totalActivities','heroImageUrl','pathNumber','estimatedHours','createdAt','updatedAt'];
  
  const missing = schemaCols.filter(c => dbCols.indexOf(c) === -1);
  const extra = dbCols.filter(c => schemaCols.indexOf(c) === -1);
  
  console.log('=== COURSES TABLE ===');
  console.log('Missing from DB (need ALTER TABLE ADD):');
  missing.forEach(c => console.log('  ' + c));
  console.log('Extra in DB (not in schema):');
  extra.forEach(c => console.log('  ' + c));
  
  // Check lessons for textContentFr
  const [lessonCols] = await conn.execute('SHOW COLUMNS FROM lessons');
  const lessonDbCols = lessonCols.map(c => c.Field);
  console.log('\n=== LESSONS TABLE ===');
  console.log('Has textContentFr:', lessonDbCols.indexOf('textContentFr') !== -1);
  console.log('Has contentJson:', lessonDbCols.indexOf('contentJson') !== -1);
  
  // Check for new tables that need to be created
  const [tables] = await conn.execute('SHOW TABLES');
  const tableNames = tables.map(r => Object.values(r)[0]);
  
  const newTables = ['content_versions','membership_tiers','user_subscriptions','referrals','funnels','automations','onboarding_config','onboarding_progress','landing_pages','ab_tests','webhook_events_log'];
  console.log('\n=== NEW TABLES ===');
  newTables.forEach(t => {
    const exists = tableNames.indexOf(t) !== -1;
    console.log('  ' + t + ': ' + (exists ? 'EXISTS' : 'MISSING'));
  });
  
  await conn.end();
}
run().catch(e => console.error(e.message));
