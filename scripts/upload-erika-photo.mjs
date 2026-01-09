import fs from 'fs';
import path from 'path';

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing FORGE_API_URL or FORGE_API_KEY');
  process.exit(1);
}

const baseUrl = FORGE_API_URL.replace(/\/+$/, '') + '/';

async function uploadFile(filePath, relKey) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const fileName = path.basename(filePath);
  
  const uploadUrl = new URL('v1/storage/upload', baseUrl);
  uploadUrl.searchParams.set('path', relKey.replace(/^\/+/, ''));
  
  const blob = new Blob([fileBuffer], { type: contentType });
  const formData = new FormData();
  formData.append('file', blob, fileName);
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FORGE_API_KEY}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }
  
  const result = await response.json();
  return result.url;
}

async function main() {
  console.log('Uploading Erika photo to S3...');
  try {
    const url = await uploadFile('public/coaches/erika-seguin.jpg', 'coaches/erika-seguin-v2.jpg');
    console.log(`✓ Erika photo uploaded: ${url}`);
  } catch (error) {
    console.error(`✗ Upload failed: ${error.message}`);
  }
}

main();
