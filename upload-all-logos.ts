import { storagePut } from './server/storage';
import fs from 'fs';

async function uploadLogos() {
  const logos = [
    { file: 'public/logos/rusing_academy_banner.png', key: 'logos/rusing_academy_banner.png', type: 'image/png' },
    { file: 'public/logos/rusing_academy_icon.png', key: 'logos/rusing_academy_icon.png', type: 'image/png' },
    { file: 'public/logos/rusing_academy_square.png', key: 'logos/rusing_academy_square.png', type: 'image/png' },
  ];
  
  const results: Record<string, string> = {};
  
  for (const logo of logos) {
    try {
      console.log(`Uploading ${logo.file}...`);
      const data = fs.readFileSync(logo.file);
      const result = await storagePut(logo.key, data, logo.type);
      console.log(`✓ Uploaded: ${result.url}`);
      results[logo.key] = result.url;
    } catch (error: any) {
      console.error(`✗ Error uploading ${logo.file}:`, error.message);
    }
  }
  
  console.log('\n=== Upload Results ===');
  console.log(JSON.stringify(results, null, 2));
}

uploadLogos().catch(console.error);
