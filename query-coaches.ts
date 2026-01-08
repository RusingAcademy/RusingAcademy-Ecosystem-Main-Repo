import { db } from "./server/db";
import { coachProfiles } from "./drizzle/schema";

async function main() {
  const coaches = await db.select({
    id: coachProfiles.id,
    slug: coachProfiles.slug,
    hourlyRate: coachProfiles.hourlyRate,
    trialRate: coachProfiles.trialRate,
  }).from(coachProfiles);
  
  console.log("Current coach pricing:");
  coaches.forEach(c => {
    const hourly = c.hourlyRate ? (c.hourlyRate / 100).toFixed(2) : "N/A";
    const trial = c.trialRate ? (c.trialRate / 100).toFixed(2) : "N/A";
    console.log(`${c.slug}: hourly=$${hourly}, trial=$${trial}`);
  });
  
  process.exit(0);
}

main().catch(console.error);
