import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle/schema.js';

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

const coaches = await db.query.coachProfiles.findMany({
  columns: {
    id: true,
    userId: true,
    photoUrl: true,
    displayName: true,
  },
  limit: 10
});

console.log('Coach profiles with photos:');
coaches.forEach(c => {
  console.log(`- ${c.displayName || 'No name'}: ${c.photoUrl || 'NO PHOTO'}`);
});

await client.end();
