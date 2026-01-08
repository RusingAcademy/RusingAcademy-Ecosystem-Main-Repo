import { storagePut } from "./server/storage";
import * as fs from "fs";
import * as path from "path";

async function uploadLogos() {
  const logosDir = path.join(process.cwd(), "public/logos");
  
  const logos = [
    { file: "lingueefy_variant_horizontal.png", key: "logos/lingueefy_horizontal.png" },
    { file: "lingueefy_social_banner_3_corrected.webp", key: "logos/lingueefy_banner.webp" },
  ];

  for (const logo of logos) {
    const filePath = path.join(logosDir, logo.file);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const contentType = logo.file.endsWith(".png") ? "image/png" : "image/webp";
      
      try {
        const result = await storagePut(logo.key, data, contentType);
        console.log(`✅ Uploaded ${logo.file}:`);
        console.log(`   Key: ${result.key}`);
        console.log(`   URL: ${result.url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${logo.file}:`, error);
      }
    } else {
      console.error(`❌ File not found: ${filePath}`);
    }
  }
}

uploadLogos().then(() => {
  console.log("\\nDone!");
  process.exit(0);
}).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
