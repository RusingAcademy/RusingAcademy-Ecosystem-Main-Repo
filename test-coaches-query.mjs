// Test script to debug the coaches query
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, or, desc, gte, lte, sql } from "drizzle-orm";
import { mysqlTable, int, varchar, text, boolean, mysqlEnum, decimal, timestamp, json } from "drizzle-orm/mysql-core";

// Define the schema inline for testing
const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatarUrl: text("avatarUrl"),
});

const coachProfiles = mysqlTable("coach_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  headline: varchar("headline", { length: 200 }),
  bio: text("bio"),
  videoUrl: text("videoUrl"),
  photoUrl: text("photoUrl"),
  languages: mysqlEnum("languages", ["french", "english", "both"]).default("both"),
  specializations: json("specializations"),
  yearsExperience: int("yearsExperience"),
  credentials: text("credentials"),
  hourlyRate: int("hourlyRate"),
  trialRate: int("trialRate"),
  totalSessions: int("totalSessions").default(0),
  totalStudents: int("totalStudents").default(0),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }),
  totalReviews: int("totalReviews").default(0),
  successRate: int("successRate"),
  responseTimeHours: int("responseTimeHours").default(24),
  status: mysqlEnum("status", ["pending", "approved", "suspended", "rejected"]).default("pending"),
  profileComplete: boolean("profileComplete").default(false),
});

const DATABASE_URL = "mysql://cYPAHDVF1MZtM6S.root:15gsxES4a8gKCi3QLQI3@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/gvnmYNphKZgt9jM9K8Vi9K?ssl={\"rejectUnauthorized\":true}";

async function testQueries() {
  console.log("Connecting to database...");
  const db = drizzle(DATABASE_URL);
  
  // Test 1: Simple query without profileComplete filter
  console.log("\n=== TEST 1: Query without profileComplete filter ===");
  const test1 = await db
    .select({
      id: coachProfiles.id,
      slug: coachProfiles.slug,
      status: coachProfiles.status,
      profileComplete: coachProfiles.profileComplete,
    })
    .from(coachProfiles)
    .where(eq(coachProfiles.status, "approved"))
    .limit(10);
  console.log("Results:", test1.length);
  console.log("Data:", JSON.stringify(test1, null, 2));
  
  // Test 2: Query with sql template for profileComplete
  console.log("\n=== TEST 2: Query with sql`profileComplete = 1` ===");
  const test2 = await db
    .select({
      id: coachProfiles.id,
      slug: coachProfiles.slug,
      status: coachProfiles.status,
      profileComplete: coachProfiles.profileComplete,
    })
    .from(coachProfiles)
    .where(and(
      eq(coachProfiles.status, "approved"),
      sql`${coachProfiles.profileComplete} = 1`
    ))
    .limit(10);
  console.log("Results:", test2.length);
  console.log("Data:", JSON.stringify(test2, null, 2));
  
  // Test 3: Query with eq(profileComplete, true)
  console.log("\n=== TEST 3: Query with eq(profileComplete, true) ===");
  const test3 = await db
    .select({
      id: coachProfiles.id,
      slug: coachProfiles.slug,
      status: coachProfiles.status,
      profileComplete: coachProfiles.profileComplete,
    })
    .from(coachProfiles)
    .where(and(
      eq(coachProfiles.status, "approved"),
      eq(coachProfiles.profileComplete, true)
    ))
    .limit(10);
  console.log("Results:", test3.length);
  console.log("Data:", JSON.stringify(test3, null, 2));
  
  // Test 4: Full query like getApprovedCoaches
  console.log("\n=== TEST 4: Full query with JOIN ===");
  const test4 = await db
    .select({
      coach: coachProfiles,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(coachProfiles)
    .innerJoin(users, eq(coachProfiles.userId, users.id))
    .where(and(
      eq(coachProfiles.status, "approved"),
      sql`${coachProfiles.profileComplete} = 1`
    ))
    .orderBy(desc(coachProfiles.averageRating))
    .limit(20);
  console.log("Results:", test4.length);
  if (test4.length > 0) {
    console.log("First coach:", test4[0].coach.slug, test4[0].user.name);
  }
  
  console.log("\n=== DONE ===");
  process.exit(0);
}

testQueries().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
