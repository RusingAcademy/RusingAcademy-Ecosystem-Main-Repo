import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// S3 configuration from environment
const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.S3_BUCKET || "";

async function uploadLogo() {
  const logoPath = path.join(process.cwd(), "public", "logo-email.png");
  const logoBuffer = fs.readFileSync(logoPath);
  
  const key = "branding/logo-email.png";
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: logoBuffer,
      ContentType: "image/png",
      ACL: "public-read",
    })
  );
  
  // Construct the public URL
  const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${BUCKET}/${key}`;
  console.log("Logo uploaded successfully!");
  console.log("URL:", publicUrl);
  
  return publicUrl;
}

uploadLogo().catch(console.error);
