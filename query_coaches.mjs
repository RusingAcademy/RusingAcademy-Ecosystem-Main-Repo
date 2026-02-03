import { db } from './server/db.ts';
import { coachProfiles, users } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function queryCoaches() {
  const coaches = await db
    .select({
      id: coachProfiles.id,
      name: users.name,
      email: users.email,
      photoUrl: coachProfiles.photoUrl,
      slug: coachProfiles.slug,
      hourlyRate: coachProfiles.hourlyRate,
      status: coachProfiles.status,
    })
    .from(coachProfiles)
    .innerJoin(users, eq(coachProfiles.userId, users.id))
    .orderBy(users.name);
  
  console.log(JSON.stringify(coaches, null, 2));
  process.exit(0);
}

queryCoaches().catch(console.error);
