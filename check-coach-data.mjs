import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Count coach applications
const [apps] = await conn.query('SELECT id, userId, firstName, lastName, status, headline, createdAt FROM coachApplications ORDER BY createdAt DESC');
console.log('=== COACH APPLICATIONS ===');
console.log('Total:', apps.length);
apps.forEach(a => console.log(`  ID:${a.id} User:${a.userId} Name:${a.firstName} ${a.lastName} Status:${a.status} Headline:"${(a.headline||'').substring(0,40)}" Created:${a.createdAt}`));

// 2. Count coach profiles
const [profiles] = await conn.query('SELECT id, userId, headline, status, profileComplete, slug, createdAt FROM coachProfiles ORDER BY createdAt DESC');
console.log('\n=== COACH PROFILES ===');
console.log('Total:', profiles.length);
profiles.forEach(p => console.log(`  ID:${p.id} User:${p.userId} Status:${p.status} Complete:${p.profileComplete} Slug:${p.slug} Headline:"${(p.headline||'').substring(0,40)}"`));

// 3. Count users with coach role
const [coaches] = await conn.query("SELECT id, name, email, role FROM users WHERE role = 'coach'");
console.log('\n=== USERS WITH COACH ROLE ===');
console.log('Total:', coaches.length);
coaches.forEach(c => console.log(`  ID:${c.id} Name:${c.name} Email:${c.email} Role:${c.role}`));

// 4. Count all users
const [allUsers] = await conn.query("SELECT id, name, email, role FROM users ORDER BY id");
console.log('\n=== ALL USERS ===');
console.log('Total:', allUsers.length);
allUsers.forEach(u => console.log(`  ID:${u.id} Name:${u.name} Email:${u.email} Role:${u.role}`));

// 5. Stripe connect accounts
const [stripe] = await conn.query('SELECT * FROM stripeConnectAccounts');
console.log('\n=== STRIPE CONNECT ACCOUNTS ===');
console.log('Total:', stripe.length);
stripe.forEach(s => console.log(`  ID:${s.id} CoachProfile:${s.coachProfileId} StripeAccount:${s.stripeAccountId} Status:${s.onboardingStatus}`));

await conn.end();
