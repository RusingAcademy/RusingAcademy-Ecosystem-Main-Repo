import { drizzle } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = drizzle(process.env.DATABASE_URL);

async function main() {
  // First, get the userId for coach profiles 6 and 7
  const result = await db.execute(sql`
    SELECT cp.userId, cp.id as coach_id, u.name 
    FROM coach_profiles cp 
    INNER JOIN users u ON u.id = cp.userId 
    WHERE cp.id IN (6, 7)
  `);
  
  console.log("Current data:", JSON.stringify(result[0], null, 2));
  
  // Get the userIds
  const coaches = result[0];
  for (const coach of coaches) {
    console.log(`Coach ID ${coach.coach_id}: User ID ${coach.userId}, Name: ${coach.name}`);
  }
  
  process.exit(0);
}

main().catch(console.error);
