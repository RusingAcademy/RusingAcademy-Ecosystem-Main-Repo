/**
 * Database Backup Script
 * 
 * Creates a timestamped MySQL dump of the production database.
 * Supports both full backups and schema-only backups.
 * 
 * Usage:
 *   npx tsx scripts/db/backup.ts                  # Full backup
 *   npx tsx scripts/db/backup.ts --schema-only     # Schema only
 *   npx tsx scripts/db/backup.ts --tables users,courses  # Specific tables
 * 
 * Environment:
 *   DATABASE_URL - MySQL connection string (required)
 * 
 * @module scripts/db/backup
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.resolve(__dirname, "../../backups");

interface BackupOptions {
  schemaOnly: boolean;
  tables: string[];
  compress: boolean;
}

function parseArgs(): BackupOptions {
  const args = process.argv.slice(2);
  return {
    schemaOnly: args.includes("--schema-only"),
    tables: args
      .find((a) => a.startsWith("--tables="))
      ?.replace("--tables=", "")
      .split(",") ?? [],
    compress: !args.includes("--no-compress"),
  };
}

function parseDatabaseUrl(url: string): {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
} {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port || "3306",
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace("/", ""),
    ssl: parsed.searchParams.get("ssl") === "true" || 
         parsed.searchParams.has("sslaccept") ||
         parsed.hostname.includes("tidb") ||
         parsed.hostname.includes("aiven"),
  };
}

function generateBackupFilename(options: BackupOptions): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const suffix = options.schemaOnly ? "_schema" : "_full";
  const ext = options.compress ? ".sql.gz" : ".sql";
  return `backup_${timestamp}${suffix}${ext}`;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const options = parseArgs();
  const db = parseDatabaseUrl(databaseUrl);

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const filename = generateBackupFilename(options);
  const filepath = path.join(BACKUP_DIR, filename);

  console.log("🗄️  RusingAcademy Database Backup");
  console.log("─".repeat(50));
  console.log(`📍 Host:     ${db.host}:${db.port}`);
  console.log(`📦 Database: ${db.database}`);
  console.log(`📄 Type:     ${options.schemaOnly ? "Schema only" : "Full (schema + data)"}`);
  console.log(`🗜️  Compress: ${options.compress ? "Yes (gzip)" : "No"}`);
  console.log(`📁 Output:   ${filepath}`);
  console.log("─".repeat(50));

  // Build mysqldump command
  const dumpArgs: string[] = [
    `--host=${db.host}`,
    `--port=${db.port}`,
    `--user=${db.user}`,
    `--password=${db.password}`,
    "--single-transaction",
    "--routines",
    "--triggers",
    "--set-gtid-purged=OFF",
    "--column-statistics=0",
  ];

  if (db.ssl) {
    dumpArgs.push("--ssl-mode=REQUIRED");
  }

  if (options.schemaOnly) {
    dumpArgs.push("--no-data");
  }

  dumpArgs.push(db.database);

  if (options.tables.length > 0) {
    dumpArgs.push(...options.tables);
    console.log(`📋 Tables:   ${options.tables.join(", ")}`);
  }

  const pipeCmd = options.compress ? " | gzip" : "";
  const cmd = `mysqldump ${dumpArgs.join(" ")}${pipeCmd} > "${filepath}"`;

  try {
    console.log("\n⏳ Starting backup...");
    const startTime = Date.now();

    execSync(cmd, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
      timeout: 300_000, // 5 minute timeout
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const fileSize = fs.statSync(filepath).size;
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    console.log(`\n✅ Backup completed successfully!`);
    console.log(`   Duration: ${elapsed}s`);
    console.log(`   Size:     ${fileSizeMB} MB`);
    console.log(`   File:     ${filepath}`);

    // Write manifest for restore script
    const manifest = {
      timestamp: new Date().toISOString(),
      filename,
      filepath,
      database: db.database,
      host: db.host,
      type: options.schemaOnly ? "schema" : "full",
      compressed: options.compress,
      sizeBytes: fileSize,
      tables: options.tables.length > 0 ? options.tables : "all",
    };

    const manifestPath = path.join(BACKUP_DIR, `${filename}.manifest.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`   Manifest: ${manifestPath}`);

    // Cleanup old backups (keep last 10)
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.startsWith("backup_") && (f.endsWith(".sql") || f.endsWith(".sql.gz")))
      .sort()
      .reverse();

    if (backups.length > 10) {
      const toDelete = backups.slice(10);
      for (const old of toDelete) {
        fs.unlinkSync(path.join(BACKUP_DIR, old));
        const oldManifest = path.join(BACKUP_DIR, `${old}.manifest.json`);
        if (fs.existsSync(oldManifest)) fs.unlinkSync(oldManifest);
        console.log(`   🗑️  Cleaned up old backup: ${old}`);
      }
    }
  } catch (error: any) {
    console.error(`\n❌ Backup failed!`);
    console.error(`   Error: ${error.message}`);
    // Clean up partial file
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
