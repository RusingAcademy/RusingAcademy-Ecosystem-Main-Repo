/**
 * Database Restore Script
 * 
 * Restores a MySQL database from a backup file created by backup.ts.
 * Includes safety checks and confirmation prompts.
 * 
 * Usage:
 *   npx tsx scripts/db/restore.ts backups/backup_2026-02-15T12-00-00_full.sql.gz
 *   npx tsx scripts/db/restore.ts backups/backup_2026-02-15T12-00-00_full.sql.gz --force
 * 
 * Environment:
 *   DATABASE_URL - MySQL connection string (required)
 * 
 * @module scripts/db/restore
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

function parseDatabaseUrl(url: string) {
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

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes");
    });
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error("❌ Usage: npx tsx scripts/db/restore.ts <backup-file> [--force]");
    console.error("   Example: npx tsx scripts/db/restore.ts backups/backup_2026-02-15_full.sql.gz");
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  const resolvedPath = path.resolve(backupFile);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Backup file not found: ${resolvedPath}`);
    process.exit(1);
  }

  const db = parseDatabaseUrl(databaseUrl);
  const isCompressed = resolvedPath.endsWith(".gz");
  const fileSize = fs.statSync(resolvedPath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

  // Check for manifest
  const manifestPath = `${resolvedPath}.manifest.json`;
  let manifest: any = null;
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  }

  console.log("🔄 RusingAcademy Database Restore");
  console.log("─".repeat(50));
  console.log(`📍 Target:   ${db.host}:${db.port}/${db.database}`);
  console.log(`📄 Backup:   ${resolvedPath}`);
  console.log(`📦 Size:     ${fileSizeMB} MB`);
  console.log(`🗜️  Compressed: ${isCompressed ? "Yes" : "No"}`);
  if (manifest) {
    console.log(`📅 Created:  ${manifest.timestamp}`);
    console.log(`📋 Type:     ${manifest.type}`);
    console.log(`🗄️  Source DB: ${manifest.database}`);
  }
  console.log("─".repeat(50));

  // Safety check: warn if restoring to a different database
  if (manifest && manifest.database !== db.database) {
    console.warn(`\n⚠️  WARNING: Backup was from database "${manifest.database}" but restoring to "${db.database}"`);
  }

  // Confirmation
  if (!force) {
    console.log(`\n⚠️  This will OVERWRITE data in ${db.database} on ${db.host}`);
    const confirmed = await confirm("Are you sure you want to proceed?");
    if (!confirmed) {
      console.log("❌ Restore cancelled.");
      process.exit(0);
    }
  }

  // Build mysql command
  const mysqlArgs: string[] = [
    `--host=${db.host}`,
    `--port=${db.port}`,
    `--user=${db.user}`,
    `--password=${db.password}`,
  ];

  if (db.ssl) {
    mysqlArgs.push("--ssl-mode=REQUIRED");
  }

  mysqlArgs.push(db.database);

  const inputCmd = isCompressed ? `gunzip -c "${resolvedPath}" | ` : `cat "${resolvedPath}" | `;
  const cmd = `${inputCmd}mysql ${mysqlArgs.join(" ")}`;

  try {
    console.log("\n⏳ Starting restore...");
    const startTime = Date.now();

    execSync(cmd, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
      timeout: 600_000, // 10 minute timeout
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n✅ Restore completed successfully!`);
    console.log(`   Duration: ${elapsed}s`);
    console.log(`   Database: ${db.database}`);
  } catch (error: any) {
    console.error(`\n❌ Restore failed!`);
    console.error(`   Error: ${error.message}`);
    if (error.stderr) {
      console.error(`   Details: ${error.stderr.toString().slice(0, 500)}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
