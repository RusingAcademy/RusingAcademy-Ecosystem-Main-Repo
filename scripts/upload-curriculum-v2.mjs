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
  
  // Build upload URL with path parameter
  const uploadUrl = new URL('v1/storage/upload', baseUrl);
  uploadUrl.searchParams.set('path', relKey.replace(/^\/+/, ''));
  
  // Create FormData with blob
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

const images = [
  { file: 'client/public/curriculum/path_a1_foundations.jpg', key: 'curriculum/path_a1_foundations.jpg' },
  { file: 'client/public/curriculum/path_a2_everyday.jpg', key: 'curriculum/path_a2_everyday.jpg' },
  { file: 'client/public/curriculum/path_b1_operational.jpg', key: 'curriculum/path_b1_operational.jpg' },
  { file: 'client/public/curriculum/path_b2_strategic.jpg', key: 'curriculum/path_b2_strategic.jpg' },
  { file: 'client/public/curriculum/path_c1_mastery.jpg', key: 'curriculum/path_c1_mastery.jpg' },
  { file: 'client/public/curriculum/path_exam_accelerator.jpg', key: 'curriculum/path_exam_accelerator.jpg' },
];

async function main() {
  console.log('Uploading curriculum images to S3...');
  console.log('Base URL:', baseUrl);
  const urls = {};
  
  for (const img of images) {
    try {
      const url = await uploadFile(img.file, img.key);
      urls[img.key] = url;
      console.log(`✓ ${img.key}: ${url}`);
    } catch (error) {
      console.error(`✗ ${img.key}: ${error.message}`);
    }
  }
  
  console.log('\nAll URLs:');
  console.log(JSON.stringify(urls, null, 2));
}

main();
