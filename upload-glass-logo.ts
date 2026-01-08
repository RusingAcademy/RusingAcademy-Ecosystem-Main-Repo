import { storagePut } from "./server/storage";
import * as fs from "fs";

async function uploadGlassLogo() {
  const logoPath = "./public/logos/lingueefy-glass-v2.png";
  const logoData = fs.readFileSync(logoPath);
  
  const result = await storagePut("logos/lingueefy-glass.png", logoData, "image/png");
  console.log("Glass logo uploaded:", result.url);
}

uploadGlassLogo().catch(console.error);
