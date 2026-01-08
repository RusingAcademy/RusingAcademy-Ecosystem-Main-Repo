import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { coachProfiles } from "./drizzle/schema";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  // Get all coaches
  const coaches = await db.select({
    id: coachProfiles.id,
    slug: coachProfiles.slug,
    hourlyRate: coachProfiles.hourlyRate,
    trialRate: coachProfiles.trialRate,
  }).from(coachProfiles);
  
  console.log("Current coach pricing:");
  for (const c of coaches) {
    const hourly = c.hourlyRate ? (c.hourlyRate / 100).toFixed(2) : "N/A";
    const trial = c.trialRate ? (c.trialRate / 100).toFixed(2) : "N/A";
    console.log(`${c.slug}: hourly=$${hourly}, trial=$${trial}`);
    
    // Calculate trial rate as 50% of hourly rate (for 30-min session)
    if (c.hourlyRate && !c.trialRate) {
      const newTrialRate = Math.round(c.hourlyRate * 0.5);
      console.log(`  -> Setting trial rate to $${(newTrialRate / 100).toFixed(2)}`);
      await db.update(coachProfiles)
        .set({ trialRate: newTrialRate })
        .where(eq(coachProfiles.id, c.id));
    }
  }
  
  console.log("\nUpdated trial rates:");
  const updated = await db.select({
    id: coachProfiles.id,
    slug: coachProfiles.slug,
    hourlyRate: coachProfiles.hourlyRate,
    trialRate: coachProfiles.trialRate,
  }).from(coachProfiles);
  
  for (const c of updated) {
    const hourly = c.hourlyRate ? (c.hourlyRate / 100).toFixed(2) : "N/A";
    const trial = c.trialRate ? (c.trialRate / 100).toFixed(2) : "N/A";
    console.log(`${c.slug}: hourly=$${hourly}, trial=$${trial}`);
  }
  
  process.exit(0);
}

main().catch(console.error);
