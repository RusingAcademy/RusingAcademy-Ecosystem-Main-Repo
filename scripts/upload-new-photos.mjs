/**
 * Script to upload new coach photos to S3 storage
 * Run with: node scripts/upload-new-photos.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use environment variables directly
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing required environment variables');
  console.log('FORGE_API_URL:', FORGE_API_URL ? 'set' : 'missing');
  console.log('FORGE_API_KEY:', FORGE_API_KEY ? 'set' : 'missing');
  process.exit(1);
}

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

const coachPhotos = [
  { name: 'Steven', file: 'Steven-new.jpg', key: 'coaches/steven-rusinga-v3.jpg', type: 'image/jpeg' },
  { name: 'Sue-Anne', file: 'Sue-Anne.jpg', key: 'coaches/sue-anne-richer-v2.jpg', type: 'image/jpeg' },
  { name: 'Preciosa', file: 'Preciosa.JPG', key: 'coaches/preciosa-baganha-v2.jpg', type: 'image/jpeg' },
  { name: 'Victor', file: 'Victor.jpg', key: 'coaches/victor-amisi-v2.jpg', type: 'image/jpeg' },
  { name: 'Soukaina', file: 'Soukaina.jpeg', key: 'coaches/soukaina-haidar-v2.jpg', type: 'image/jpeg' },
];

async function main() {
  console.log('Uploading new coach photos to S3...\n');
  
  const photosDir = path.join(__dirname, '..', 'public', 'coaches');
  const results = {};
  
  for (const coach of coachPhotos) {
    const filePath = path.join(photosDir, coach.file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      continue;
    }
    
    console.log(`Uploading ${coach.name}...`);
    const fileData = fs.readFileSync(filePath);
    
    try {
      const photoUrl = await uploadToStorage(coach.key, fileData, coach.type);
      results[coach.name] = photoUrl;
      console.log(`  ✅ ${coach.name}: ${photoUrl}`);
    } catch (err) {
      console.error(`  ❌ ${coach.name}: ${err.message}`);
    }
  }
  
  console.log('\n--- S3 URLs for FeaturedCoaches.tsx ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
