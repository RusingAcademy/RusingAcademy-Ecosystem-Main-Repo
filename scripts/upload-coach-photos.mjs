/**
 * Script to upload coach photos to S3 storage and update database
 * Run with: node scripts/upload-coach-photos.mjs
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DATABASE_URL || !FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const coachPhotos = [
  { slug: 'steven-barholere', file: 'steven-barholere.jpg' },
  { slug: 'sue-anne-richer', file: 'sue-anne-richer.jpg' },
  { slug: 'erika-seguin', file: 'erika-seguin.jpg' },
  { slug: 'preciosa-baganha', file: 'preciosa-baganha.jpg' },
  { slug: 'victor-amisi', file: 'victor-amisi.jpg' },
  { slug: 'soukaina-mhammedi-alaoui', file: 'soukaina-mhammedi-alaoui.jpg' },
  { slug: 'francine-nkurunziza', file: 'francine-nkurunziza.jpg' },
];

async function uploadToStorage(relKey, data, contentType) {
  const baseUrl = FORGE_API_URL.replace(/\/+$/, '') + '/';
  const uploadUrl = new URL('v1/storage/upload', baseUrl);
  uploadUrl.searchParams.set('path', relKey);
  
  const blob = new Blob([data], { type: contentType });
  const form = new FormData();
  form.append('file', blob, relKey.split('/').pop());
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    body: form,
  });
  
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Upload failed: ${message}`);
  }
  
  return (await response.json()).url;
}

async function main() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const photosDir = path.join(process.cwd(), 'public', 'coaches');
  
  try {
    for (const coach of coachPhotos) {
      const filePath = path.join(photosDir, coach.file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Photo not found for ${coach.slug}: ${filePath}`);
        continue;
      }
      
      console.log(`Uploading photo for ${coach.slug}...`);
      const fileData = fs.readFileSync(filePath);
      const storageKey = `coaches/${coach.file}`;
      
      try {
        const photoUrl = await uploadToStorage(storageKey, fileData, 'image/jpeg');
        console.log(`  ✅ Uploaded: ${photoUrl}`);
        
        // Update database
        await connection.execute(
          'UPDATE coach_profiles SET photoUrl = ? WHERE slug = ?',
          [photoUrl, coach.slug]
        );
        console.log(`  ✅ Updated database for ${coach.slug}`);
      } catch (err) {
        console.error(`  ❌ Failed to upload ${coach.slug}:`, err.message);
      }
    }
    
    // Verify updates
    const [coaches] = await connection.execute(
      'SELECT slug, photoUrl FROM coach_profiles WHERE photoUrl IS NOT NULL'
    );
    console.log(`\\n✅ ${coaches.length} coaches now have photos`);
    for (const c of coaches) {
      console.log(`  - ${c.slug}: ${c.photoUrl ? 'Has photo' : 'No photo'}`);
    }
    
  } finally {
    await connection.end();
  }
  
  console.log('\\n✅ Photo upload complete!');
}

main().catch(console.error);
