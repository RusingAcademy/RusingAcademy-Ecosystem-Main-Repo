import { runAutoDeduplication, getDeduplicationStats } from "../auto-deduplication";
import { createLogger } from "../logger";
const log = createLogger("cron-auto-deduplication");

interface CronResult {
  success: boolean;
  message: string;
  stats?: {
    groupsFound: number;
    leadsMerged: number;
    errors: string[];
  };
}

/**
 * Cron job handler for automatic lead deduplication
 * Runs weekly to find and merge duplicate leads
 */
export async function handleAutoDeduplicationCron(): Promise<CronResult> {
  try {
    log.info("[Auto-Deduplication] Starting automatic deduplication...");

    // Get stats before running
    const statsBefore = await getDeduplicationStats();
    log.info(`[Auto-Deduplication] Found ${statsBefore.duplicateGroups} duplicate groups`);

    if (statsBefore.duplicateGroups === 0) {
      return {
        success: true,
        message: "No duplicates found",
        stats: {
          groupsFound: 0,
          leadsMerged: 0,
          errors: [],
        },
      };
    }

    // Run deduplication with default config
    const result = await runAutoDeduplication({
      matchBy: "email",
      autoMerge: true,
      keepStrategy: "highest_score",
      dryRun: false,
    });

    log.info(`[Auto-Deduplication] Completed: ${result.leadsMerged} leads merged`);

    if (result.errors.length > 0) {
      log.warn(`[Auto-Deduplication] Errors: ${result.errors.join(", ")}`);
    }

    return {
      success: result.errors.length === 0,
      message: `Merged ${result.leadsMerged} duplicate leads from ${result.groupsFound} groups`,
      stats: result,
    };
  } catch (error) {
    log.error("[Auto-Deduplication] Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
