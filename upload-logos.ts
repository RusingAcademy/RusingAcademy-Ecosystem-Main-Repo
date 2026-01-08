import { storagePut } from './server/storage';
import fs from 'fs';

async function uploadLogos() {
  const logos = [
    { file: 'public/logos/rusing_academy_banner.png', key: 'logos/rusing_academy_banner.png', type: 'image/png' },
    { file: 'public/logos/rusing_academy_icon.png', key: 'logos/rusing_academy_icon.png', type: 'image/png' },
    { file: 'public/logos/rusing_academy_square.png', key: 'logos/rusing_academy_square.png', type: 'image/png' },
  ];
  
  for (const logo of logos) {
    try {
      const data = fs.readFileSync(logo.file);
      const result = await storagePut(logo.key, data, logo.type);
      console.log(`Uploaded ${logo.file}:`, result.url);
    } catch (error: any) {
      console.error(`Error uploading ${logo.file}:`, error.message);
    }
  }
}

uploadLogos();
