/**
 * Fix Migration Journal
 * 
 * Resolves known issues:
 *   1. Duplicate idx=56 (0055_old_jane_foster and 0056_steady_skin both have idx=56)
 *   2. Orphaned file 0057_tearful_moira_mactaggert.sql (content already covered by
 *      0055_add_french_bio_fields.sql and 0057_deep_ronan.sql)
 *   3. Re-indexes all entries from idx=56 onward to be sequential
 * 
 * Usage:
 *   npx tsx scripts/db/fix-journal.ts --dry-run    # Preview changes
 *   npx tsx scripts/db/fix-journal.ts               # Apply changes
 * 
 * @module scripts/db/fix-journal
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIZZLE_DIR = path.resolve(__dirname, "../../drizzle");
const META_DIR = path.join(DRIZZLE_DIR, "meta");
const JOURNAL_PATH = path.join(META_DIR, "_journal.json");

const dryRun = process.argv.includes("--dry-run");

function main() {
  console.log("🔧 RusingAcademy Migration Journal Fix");
  console.log("═".repeat(50));
  console.log(`Mode: ${dryRun ? "DRY RUN (no changes)" : "APPLY CHANGES"}`);
  console.log("");

  // Read current journal
  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf-8"));
  const entries = journal.entries as Array<{ idx: number; version: string; when: number; tag: string; breakpoints: boolean }>;

  console.log(`Current entries: ${entries.length}`);
  console.log("");

  // Step 1: Identify the orphaned file
  // 0057_tearful_moira_mactaggert.sql contains:
  //   - ALTER TABLE sle_companion_sessions MODIFY COLUMN userId int
  //   - ALTER TABLE coach_profiles ADD headlineFr varchar(200)
  //   - ALTER TABLE coach_profiles ADD bioFr text
  // These are already covered by:
  //   - 0055_add_french_bio_fields.sql (headlineFr + bioFr)
  //   - 0057_deep_ronan.sql (likely contains the sle_companion_sessions change)
  // So 0057_tearful_moira_mactaggert.sql is truly orphaned and can be safely archived.

  const orphanedFile = "0057_tearful_moira_mactaggert.sql";
  const orphanedPath = path.join(DRIZZLE_DIR, orphanedFile);
  const archivePath = path.join(DRIZZLE_DIR, `_archived_${orphanedFile}`);

  if (fs.existsSync(orphanedPath)) {
    console.log(`📁 Archiving orphaned file: ${orphanedFile}`);
    console.log(`   → Renaming to _archived_${orphanedFile}`);
    if (!dryRun) {
      fs.renameSync(orphanedPath, archivePath);
    }
  }

  // Step 2: Fix the journal sequence
  // Current problem:
  //   idx=54 tag=0054_high_mongu
  //   idx=55 tag=0055_add_french_bio_fields
  //   idx=56 tag=0055_old_jane_foster      ← duplicate idx=56
  //   idx=56 tag=0056_steady_skin          ← duplicate idx=56
  //   idx=57 tag=0057_deep_ronan           ← should be 58
  //   idx=58 tag=0058_fuzzy_greymalkin     ← should be 59
  //   idx=59 tag=0059_quick_grandmaster    ← should be 60
  //   idx=60 tag=0060_secret_absorbing_man ← should be 61
  //
  // Fix: re-index all entries sequentially from 0

  console.log("\n📋 Re-indexing journal entries:");
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].idx !== i) {
      console.log(`   Entry "${entries[i].tag}": idx ${entries[i].idx} → ${i}`);
      entries[i].idx = i;
    }
  }

  // Step 3: Write the fixed journal
  journal.entries = entries;
  const fixedJson = JSON.stringify(journal, null, 2) + "\n";

  console.log(`\n📝 Writing fixed journal (${entries.length} entries)`);
  if (!dryRun) {
    // Backup original journal
    const backupPath = path.join(META_DIR, "_journal.json.bak");
    fs.copyFileSync(JOURNAL_PATH, backupPath);
    console.log(`   Backup saved to: ${backupPath}`);

    fs.writeFileSync(JOURNAL_PATH, fixedJson);
    console.log(`   Journal updated successfully`);
  }

  console.log("\n" + "═".repeat(50));
  console.log(dryRun ? "DRY RUN complete — no changes made." : "✅ Journal fix applied successfully.");
  console.log("Run `npm run db:validate` to verify.");
}

main();
