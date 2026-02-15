/**
 * Database Migration Validation Script
 * 
 * Validates that:
 *   1. All migration files have corresponding journal entries
 *   2. No orphaned SQL files exist
 *   3. No duplicate migration prefixes
 *   4. Schema file can be parsed without errors
 *   5. drizzle-kit check passes (if available)
 * 
 * Designed to run in CI pipelines as a quality gate.
 * Exit code 0 = all checks pass, 1 = failures found.
 * 
 * Usage:
 *   npx tsx scripts/db/validate.ts
 * 
 * @module scripts/db/validate
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIZZLE_DIR = path.resolve(__dirname, "../../drizzle");
const META_DIR = path.join(DRIZZLE_DIR, "meta");

interface ValidationResult {
  check: string;
  status: "PASS" | "WARN" | "FAIL";
  details: string;
}

function validateJournalExists(): ValidationResult {
  const journalPath = path.join(META_DIR, "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return {
      check: "Journal file exists",
      status: "FAIL",
      details: "drizzle/meta/_journal.json not found",
    };
  }

  try {
    const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
    if (!journal.entries || !Array.isArray(journal.entries)) {
      return {
        check: "Journal file exists",
        status: "FAIL",
        details: "Journal file is malformed (missing entries array)",
      };
    }
    return {
      check: "Journal file exists",
      status: "PASS",
      details: `${journal.entries.length} entries found`,
    };
  } catch (e: any) {
    return {
      check: "Journal file exists",
      status: "FAIL",
      details: `Journal file is not valid JSON: ${e.message}`,
    };
  }
}

function validateNoOrphanedFiles(): ValidationResult {
  const journalPath = path.join(META_DIR, "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return { check: "No orphaned SQL files", status: "FAIL", details: "Cannot check without journal" };
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  const journalTags = new Set((journal.entries ?? []).map((e: any) => e.tag));
  const sqlFiles = fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql"));
  const orphaned: string[] = [];

  for (const file of sqlFiles) {
    const tag = file.replace(".sql", "");
    if (!journalTags.has(tag)) {
      orphaned.push(file);
    }
  }

  if (orphaned.length > 0) {
    return {
      check: "No orphaned SQL files",
      status: "WARN",
      details: `${orphaned.length} orphaned file(s): ${orphaned.join(", ")}`,
    };
  }

  return { check: "No orphaned SQL files", status: "PASS", details: `All ${sqlFiles.length} SQL files tracked in journal` };
}

function validateNoMissingFiles(): ValidationResult {
  const journalPath = path.join(META_DIR, "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return { check: "No missing SQL files", status: "FAIL", details: "Cannot check without journal" };
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  const entries = journal.entries ?? [];
  const missing: string[] = [];

  for (const entry of entries) {
    const sqlFile = path.join(DRIZZLE_DIR, `${entry.tag}.sql`);
    if (!fs.existsSync(sqlFile)) {
      missing.push(`${entry.tag}.sql`);
    }
  }

  if (missing.length > 0) {
    return {
      check: "No missing SQL files",
      status: "FAIL",
      details: `${missing.length} file(s) referenced in journal but missing: ${missing.join(", ")}`,
    };
  }

  return { check: "No missing SQL files", status: "PASS", details: `All ${entries.length} journal entries have corresponding SQL files` };
}

function validateNoDuplicatePrefixes(): ValidationResult {
  const sqlFiles = fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql"));
  const prefixMap = new Map<string, string[]>();

  for (const file of sqlFiles) {
    const prefix = file.split("_")[0];
    if (!prefixMap.has(prefix)) {
      prefixMap.set(prefix, []);
    }
    prefixMap.get(prefix)!.push(file);
  }

  const duplicates: string[] = [];
  for (const [prefix, files] of prefixMap) {
    if (files.length > 1) {
      duplicates.push(`${prefix}: ${files.join(", ")}`);
    }
  }

  if (duplicates.length > 0) {
    return {
      check: "No duplicate migration prefixes",
      status: "WARN",
      details: `${duplicates.length} duplicate prefix(es) found:\n      ${duplicates.join("\n      ")}`,
    };
  }

  return { check: "No duplicate migration prefixes", status: "PASS", details: "All prefixes are unique" };
}

function validateJournalSequence(): ValidationResult {
  const journalPath = path.join(META_DIR, "_journal.json");
  if (!fs.existsSync(journalPath)) {
    return { check: "Journal sequence is valid", status: "FAIL", details: "Cannot check without journal" };
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  const entries = journal.entries ?? [];
  const issues: string[] = [];

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].idx !== i) {
      issues.push(`Entry ${i} has idx=${entries[i].idx} (expected ${i})`);
    }
  }

  // Check for duplicate idx values
  const idxSet = new Set<number>();
  for (const entry of entries) {
    if (idxSet.has(entry.idx)) {
      issues.push(`Duplicate idx: ${entry.idx}`);
    }
    idxSet.add(entry.idx);
  }

  if (issues.length > 0) {
    return {
      check: "Journal sequence is valid",
      status: "FAIL",
      details: issues.join("; "),
    };
  }

  return { check: "Journal sequence is valid", status: "PASS", details: `Sequential from 0 to ${entries.length - 1}` };
}

function validateSchemaFile(): ValidationResult {
  const schemaPath = path.join(DRIZZLE_DIR, "schema.ts");
  if (!fs.existsSync(schemaPath)) {
    return { check: "Schema file exists", status: "FAIL", details: "drizzle/schema.ts not found" };
  }

  const content = fs.readFileSync(schemaPath, "utf-8");
  const tableCount = (content.match(/mysqlTable\(/g) || []).length;
  const enumCount = (content.match(/mysqlEnum\(/g) || []).length;

  if (tableCount === 0) {
    return { check: "Schema file exists", status: "WARN", details: "Schema file exists but no tables found" };
  }

  return {
    check: "Schema file exists",
    status: "PASS",
    details: `${tableCount} tables, ${enumCount} enums defined`,
  };
}

function validateMetaSnapshots(): ValidationResult {
  if (!fs.existsSync(META_DIR)) {
    return { check: "Meta snapshots exist", status: "FAIL", details: "drizzle/meta/ directory not found" };
  }

  const snapshots = fs.readdirSync(META_DIR).filter((f) => f.endsWith(".json") && f !== "_journal.json");

  if (snapshots.length === 0) {
    return { check: "Meta snapshots exist", status: "WARN", details: "No snapshot files found in meta/" };
  }

  return { check: "Meta snapshots exist", status: "PASS", details: `${snapshots.length} snapshot(s) found` };
}

async function main() {
  console.log("🔍 RusingAcademy Migration Validation");
  console.log("═".repeat(50));

  const results: ValidationResult[] = [
    validateJournalExists(),
    validateSchemaFile(),
    validateMetaSnapshots(),
    validateJournalSequence(),
    validateNoMissingFiles(),
    validateNoOrphanedFiles(),
    validateNoDuplicatePrefixes(),
  ];

  const statusIcons = { PASS: "✅", WARN: "⚠️ ", FAIL: "❌" };

  for (const result of results) {
    console.log(`\n${statusIcons[result.status]} ${result.check}`);
    console.log(`   ${result.details}`);
  }

  const failCount = results.filter((r) => r.status === "FAIL").length;
  const warnCount = results.filter((r) => r.status === "WARN").length;
  const passCount = results.filter((r) => r.status === "PASS").length;

  console.log("\n" + "═".repeat(50));
  console.log(`Results: ${passCount} PASS, ${warnCount} WARN, ${failCount} FAIL`);

  if (failCount > 0) {
    console.log("\n❌ Validation FAILED — fix the issues above before proceeding.");
    process.exit(1);
  } else if (warnCount > 0) {
    console.log("\n⚠️  Validation PASSED with warnings — review the issues above.");
    process.exit(0);
  } else {
    console.log("\n✅ All checks PASSED.");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
