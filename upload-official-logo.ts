import { storagePut } from './server/storage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadOfficialLogo() {
  const logoPath = path.join(__dirname, 'public/logos/lingueefy-official-logo.png');
  const logoBuffer = fs.readFileSync(logoPath);
  
  console.log('Uploading official Lingueefy logo to S3...');
  
  const result = await storagePut('logos/lingueefy-official-logo.png', logoBuffer, 'image/png');
  
  console.log('Upload complete!');
  console.log('Logo URL:', result.url);
  
  return result.url;
}

uploadOfficialLogo()
  .then(url => {
    console.log('\n=== OFFICIAL LOGO URL ===');
    console.log(url);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
