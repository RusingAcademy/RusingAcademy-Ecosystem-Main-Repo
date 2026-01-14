/**
 * Upload Heavy Images to Cloudinary
 * 
 * This script uploads all heavy images (>500KB) to Cloudinary
 * and generates a mapping file for the CloudinaryImage component.
 * 
 * Usage: CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=xxx npx tsx scripts/upload-to-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djxhk76m9',
  api_key: process.env.CLOUDINARY_API_KEY || '784172583135459',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'v0fHsF4ROOct8p-xzS6HFHTemgI',
  secure: true,
});

const PUBLIC_DIR = path.join(__dirname, '../client/public');
const MIN_SIZE_KB = 500; // Only upload images larger than 500KB

interface ImageMapping {
  localPath: string;
  cloudinaryId: string;
  cloudinaryUrl: string;
  originalSize: number;
  optimizedUrl: string;
}

async function findHeavyImages(dir: string, images: string[] = []): Promise<string[]> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await findHeavyImages(fullPath, images);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        const stats = fs.statSync(fullPath);
        const sizeKB = stats.size / 1024;
        
        if (sizeKB >= MIN_SIZE_KB) {
          images.push(fullPath);
        }
      }
    }
  }
  
  return images;
}

function getPublicId(localPath: string): string {
  // Convert local path to Cloudinary public ID
  const relativePath = path.relative(PUBLIC_DIR, localPath);
  const publicId = relativePath
    .replace(/\\/g, '/') // Windows paths
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/^images\//, 'rusingacademy/') // Prefix with folder
    .replace(/generated\//, '') // Flatten generated folder
    .replace(/ecosystem\//, ''); // Flatten ecosystem folder
  
  return publicId;
}

async function uploadImage(localPath: string): Promise<ImageMapping | null> {
  const publicId = getPublicId(localPath);
  const stats = fs.statSync(localPath);
  const relativePath = '/' + path.relative(PUBLIC_DIR, localPath).replace(/\\/g, '/');
  
  console.log(`Uploading: ${relativePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      folder: '', // Public ID already includes folder
      resource_type: 'image',
      overwrite: true,
      transformation: [
        {
          quality: 'auto:good',
          format: 'webp',
        },
      ],
    });
    
    // Generate optimized URL
    const optimizedUrl = cloudinary.url(result.public_id, {
      transformation: [
        {
          width: 1920,
          height: 1080,
          crop: 'limit',
          quality: 'auto:good',
          format: 'webp',
        },
      ],
    });
    
    console.log(`  ✓ Uploaded: ${result.public_id}`);
    console.log(`    Original: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`    Cloudinary: ${result.secure_url}`);
    
    return {
      localPath: relativePath,
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      originalSize: stats.size,
      optimizedUrl,
    };
  } catch (error) {
    console.error(`  ✗ Failed to upload ${relativePath}:`, error);
    return null;
  }
}

async function main() {
  console.log('=== Cloudinary Image Upload Script ===\n');
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || 'djxhk76m9'}`);
  console.log(`Public Dir: ${PUBLIC_DIR}`);
  console.log(`Min Size: ${MIN_SIZE_KB} KB\n`);
  
  // Find all heavy images
  const heavyImages = await findHeavyImages(path.join(PUBLIC_DIR, 'images'));
  console.log(`Found ${heavyImages.length} images larger than ${MIN_SIZE_KB} KB\n`);
  
  // Upload each image
  const mappings: ImageMapping[] = [];
  let totalOriginalSize = 0;
  
  for (const imagePath of heavyImages) {
    const mapping = await uploadImage(imagePath);
    if (mapping) {
      mappings.push(mapping);
      totalOriginalSize += mapping.originalSize;
    }
  }
  
  // Save mapping file
  const mappingPath = path.join(__dirname, '../client/src/lib/cloudinary-mappings.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mappings, null, 2));
  
  console.log('\n=== Upload Complete ===');
  console.log(`Total images uploaded: ${mappings.length}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Mapping file saved to: ${mappingPath}`);
}

main().catch(console.error);
