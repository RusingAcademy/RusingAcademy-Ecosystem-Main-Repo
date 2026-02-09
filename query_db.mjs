import 'dotenv/config';
import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) { console.error("No DATABASE_URL"); process.exit(1); }

const conn = await mysql.createConnection(url);
const [courses] = await conn.query("SELECT id, title, pathNumber, slug, status, totalModules, totalLessons, totalActivities FROM courses ORDER BY id");
console.log("=== COURSES ===");
console.table(courses);

const [modules] = await conn.query("SELECT id, courseId, title, moduleNumber, sortOrder FROM course_modules ORDER BY courseId, sortOrder LIMIT 30");
console.log("=== MODULES ===");
console.table(modules);

const [lessons] = await conn.query("SELECT id, courseId, moduleId, title, lessonNumber, sortOrder FROM lessons ORDER BY courseId, moduleId, sortOrder LIMIT 30");
console.log("=== LESSONS ===");
console.table(lessons);

const [activities] = await conn.query("SELECT COUNT(*) as total FROM activities");
console.log("=== ACTIVITIES COUNT ===");
console.table(activities);

await conn.end();
