/**
 * Database Migration Wrapper Script
 * 
 * Wraps `drizzle-kit migrate` with safety checks:
 *   1. Pre-migration backup (optional, enabled by default)
 *   2. Schema validation (checks for pending changes)
 *   3. Migration execution via drizzle-kit
 *   4. Post-migration health check
 * 
 * Usage:
 *   npx tsx scripts/db/migrate.ts                    # Generate + migrate with backup
 *   npx tsx scripts/db/migrate.ts --no-backup         # Skip pre-migration backup
 *   npx tsx scripts/db/migrate.ts --dry-run           # Show what would be done
 *   npx tsx scripts/db/migrate.ts --generate-only     # Only generate, don't apply
 * 
 * Environment:
 *   DATABASE_URL - MySQL connection string (required)
 * 
 * @module scripts/db/migrate
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIZZLE_DIR = path.resolve(__dirname, "../../drizzle");
const META_DIR = path.join(DRIZZLE_DIR, "meta");

interface MigrateOptions {
  backup: boolean;
  dryRun: boolean;
  generateOnly: boolean;
}

function parseArgs(): MigrateOptions {
  const args = process.argv.slice(2);
  return {
    backup: !args.includes("--no-backup"),
    dryRun: args.includes("--dry-run"),
    generateOnly: args.includes("--generate-only"),
  };
}

function countMigrationFiles(): number {
  if (!fs.existsSync(DRIZZLE_DIR)) return 0;
  return fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql")).length;
}

function getJournalEntryCount(): number {
  const journalPath = path.join(META_DIR, "_journal.json");
  if (!fs.existsSync(journalPath)) return 0;
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  return journal.entries?.length ?? 0;
}

function validateMigrationConsistency(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const journalPath = path.join(META_DIR, "_journal.json");

  if (!fs.existsSync(journalPath)) {
    issues.push("Migration journal (_journal.json) not found");
    return { valid: false, issues };
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  const entries = journal.entries ?? [];

  // Check for duplicate indices
  const indices = entries.map((e: any) => e.idx);
  const uniqueIndices = new Set(indices);
  if (indices.length !== uniqueIndices.size) {
    issues.push("Duplicate indices found in migration journal");
  }

  // Check that each journal entry has a corresponding SQL file
  for (const entry of entries) {
    const sqlFile = path.join(DRIZZLE_DIR, `${entry.tag}.sql`);
    if (!fs.existsSync(sqlFile)) {
      issues.push(`Missing SQL file for journal entry: ${entry.tag}`);
    }
  }

  // Check for SQL files not in journal (orphaned migrations)
  const sqlFiles = fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql"));
  const journalTags = new Set(entries.map((e: any) => e.tag));
  for (const file of sqlFiles) {
    const tag = file.replace(".sql", "");
    if (!journalTags.has(tag)) {
      issues.push(`Orphaned SQL file (not in journal): ${file}`);
    }
  }

  // Check for duplicate prefixes (e.g., two files starting with 0055_)
  const prefixes = sqlFiles.map((f) => f.split("_")[0]);
  const prefixCounts = new Map<string, number>();
  for (const p of prefixes) {
    prefixCounts.set(p, (prefixCounts.get(p) ?? 0) + 1);
  }
  for (const [prefix, count] of prefixCounts) {
    if (count > 1) {
      issues.push(`Duplicate migration prefix: ${prefix} (${count} files)`);
    }
  }

  return { valid: issues.length === 0, issues };
}

function runCommand(cmd: string, label: string, dryRun: boolean): boolean {
  console.log(`\n📌 ${label}`);
  if (dryRun) {
    console.log(`   [DRY RUN] Would execute: ${cmd}`);
    return true;
  }

  try {
    const output = execSync(cmd, {
      cwd: path.resolve(__dirname, "../.."),
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
      timeout: 120_000,
    });
    const stdout = output.toString().trim();
    if (stdout) console.log(`   ${stdout.split("\n").join("\n   ")}`);
    console.log(`   ✅ ${label} completed`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ ${label} failed`);
    if (error.stderr) {
      console.error(`   ${error.stderr.toString().trim().split("\n").join("\n   ")}`);
    }
    return false;
  }
}

async function main() {
  const options = parseArgs();

  console.log("🔄 RusingAcademy Database Migration");
  console.log("─".repeat(50));
  console.log(`📋 Mode:     ${options.dryRun ? "DRY RUN" : options.generateOnly ? "Generate Only" : "Full Migration"}`);
  console.log(`🗄️  Backup:   ${options.backup ? "Yes (pre-migration)" : "Skipped"}`);
  console.log(`📁 Drizzle:  ${DRIZZLE_DIR}`);

  // Step 1: Validate existing migration consistency
  console.log("\n" + "═".repeat(50));
  console.log("STEP 1: Migration Consistency Check");
  console.log("═".repeat(50));

  const validation = validateMigrationConsistency();
  const migrationCount = countMigrationFiles();
  const journalCount = getJournalEntryCount();

  console.log(`   SQL files: ${migrationCount}`);
  console.log(`   Journal entries: ${journalCount}`);

  if (!validation.valid) {
    console.warn("\n⚠️  Migration consistency issues found:");
    for (const issue of validation.issues) {
      console.warn(`   - ${issue}`);
    }
    if (!options.dryRun) {
      console.warn("\n   These issues should be resolved before running migrations.");
      console.warn("   Use --dry-run to see what would happen without making changes.");
    }
  } else {
    console.log("   ✅ All migrations are consistent");
  }

  // Step 2: Pre-migration backup
  if (options.backup && !options.generateOnly) {
    console.log("\n" + "═".repeat(50));
    console.log("STEP 2: Pre-Migration Backup");
    console.log("═".repeat(50));

    const backupSuccess = runCommand(
      "npx tsx scripts/db/backup.ts --schema-only",
      "Schema backup",
      options.dryRun
    );

    if (!backupSuccess && !options.dryRun) {
      console.error("\n❌ Backup failed. Aborting migration for safety.");
      console.error("   Use --no-backup to skip backup (not recommended for production).");
      process.exit(1);
    }
  }

  // Step 3: Generate migrations
  console.log("\n" + "═".repeat(50));
  console.log("STEP 3: Generate Migrations");
  console.log("═".repeat(50));

  const beforeCount = countMigrationFiles();
  const generateSuccess = runCommand(
    "npx drizzle-kit generate",
    "drizzle-kit generate",
    options.dryRun
  );

  if (!generateSuccess) {
    console.error("\n❌ Migration generation failed. Check schema for errors.");
    process.exit(1);
  }

  const afterCount = countMigrationFiles();
  const newMigrations = afterCount - beforeCount;

  if (newMigrations > 0) {
    console.log(`\n   📝 ${newMigrations} new migration(s) generated`);
  } else {
    console.log(`\n   ℹ️  No new migrations needed (schema is up to date)`);
  }

  if (options.generateOnly) {
    console.log("\n✅ Generate-only mode complete. Review generated files before applying.");
    return;
  }

  // Step 4: Apply migrations
  if (!options.dryRun) {
    console.log("\n" + "═".repeat(50));
    console.log("STEP 4: Apply Migrations");
    console.log("═".repeat(50));

    const migrateSuccess = runCommand(
      "npx drizzle-kit migrate",
      "drizzle-kit migrate",
      false
    );

    if (!migrateSuccess) {
      console.error("\n❌ Migration application failed!");
      if (options.backup) {
        console.error("   A backup was created before migration. Use restore.ts to rollback if needed.");
      }
      process.exit(1);
    }
  }

  // Step 5: Post-migration health check
  console.log("\n" + "═".repeat(50));
  console.log("STEP 5: Post-Migration Health Check");
  console.log("═".repeat(50));

  const finalValidation = validateMigrationConsistency();
  const finalMigrationCount = countMigrationFiles();
  const finalJournalCount = getJournalEntryCount();

  console.log(`   SQL files: ${finalMigrationCount}`);
  console.log(`   Journal entries: ${finalJournalCount}`);
  console.log(`   Consistency: ${finalValidation.valid ? "✅ PASS" : "⚠️  Issues found"}`);

  if (!finalValidation.valid) {
    for (const issue of finalValidation.issues) {
      console.warn(`   - ${issue}`);
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`✅ Migration process complete`);
  console.log("═".repeat(50));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
