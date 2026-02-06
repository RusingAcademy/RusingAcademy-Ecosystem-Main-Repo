import argon2 from 'argon2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function resetPassword() {
  const email = 'steven.barholere@rusingacademy.ca';
  const newPassword = 'Ottawa2626';
  
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Hash the new password
  console.log('Hashing password...');
  const passwordHash = await argon2.hash(newPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
  
  // Update the user's password and set role to admin
  console.log('Updating user password and role...');
  const [result] = await connection.execute(
    'UPDATE users SET passwordHash = ?, role = ?, loginMethod = ? WHERE email = ?',
    [passwordHash, 'admin', 'email', email]
  );
  
  console.log('Result:', result);
  
  // Verify the update
  const [rows] = await connection.execute(
    'SELECT id, email, name, role, loginMethod FROM users WHERE email = ?',
    [email]
  );
  
  console.log('Updated user:', rows[0]);
  
  await connection.end();
  console.log('Password reset complete!');
}

resetPassword().catch(console.error);
