import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT * FROM quiz_questions LIMIT 3');
console.log(JSON.stringify(rows, null, 2));
const [cols] = await conn.execute('SHOW COLUMNS FROM quiz_questions');
console.log('\nColumns:');
cols.forEach(c => console.log(`  ${c.Field}: ${c.Type}`));
await conn.end();
