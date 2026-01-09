import fs from 'fs';
import path from 'path';

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error('Missing FORGE_API_URL or FORGE_API_KEY');
  process.exit(1);
}

async function uploadFile(filePath, key) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString('base64');
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  
  const response = await fetch(`${FORGE_API_URL}/storage/put`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`
    },
    body: JSON.stringify({
      key: key,
      data: base64Data,
      contentType: contentType
    })
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
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
