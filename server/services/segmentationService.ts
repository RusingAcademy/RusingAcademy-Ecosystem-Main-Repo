// server/services/segmentationService.ts — Phase 12.1: Advanced Segmentation & Export
import { getDb } from "../db";
import { learnerTags, learnerTagAssignments, learnerSegments } from "../../drizzle/learner360-tags-schema";
import { eq, and, or, sql, inArray, gte, lte, like, desc } from "drizzle-orm";
import { featureFlagService } from "./featureFlagService";
import { createLogger } from "../logger";

const log = createLogger("services-segmentation");

// ═══ Types ═══

export type FilterOperator = "equals" | "not_equals" | "contains" | "starts_with" | "greater_than" | "less_than" | "has_tag" | "not_has_tag" | "is_empty" | "is_not_empty" | "between" | "in";

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value: any;
  logic?: "AND" | "OR"; // How to combine with next filter
}

export interface SegmentQuery {
  filters: FilterRule[];
  logic?: "AND" | "OR"; // Global logic for combining all filters
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LearnerRecord {
  id: number;
  name: string;
  email: string;
  role?: string;
  tags?: string[];
  createdAt?: string;
  [key: string]: any;
}

export interface SegmentResult {
  learners: LearnerRecord[];
  totalCount: number;
  appliedFilters: FilterRule[];
}

export class SegmentationService {
  /**
   * Execute a segmentation query and return matching learners.
   */
  async segment(query: SegmentQuery): Promise<SegmentResult> {
    const enabled = await featureFlagService.isEnabled("TAGS_SEGMENTATION_ENABLED");
    if (!enabled) {
      return { learners: [], totalCount: 0, appliedFilters: query.filters };
    }

    const db = await getDb();
    const limit = query.limit || 100;
    const offset = query.offset || 0;

    // Build dynamic WHERE conditions
    const conditions = this.buildConditions(query.filters);
    const globalLogic = query.logic || "AND";

    // Base query: select users with their tags
    let baseQuery: string;
    const params: any[] = [];

    if (conditions.tagFilters.length > 0) {
      // Join with tag assignments for tag-based filtering
      baseQuery = `
        SELECT DISTINCT u.id, u.name, u.email, u.role, u.createdAt,
          GROUP_CONCAT(DISTINCT lt.name) as tags
        FROM users u
        LEFT JOIN learner_tag_assignments lta ON u.id = lta.learnerId
        LEFT JOIN learner_tags lt ON lta.tagId = lt.id
      `;
    } else {
      baseQuery = `
        SELECT u.id, u.name, u.email, u.role, u.createdAt,
          (SELECT GROUP_CONCAT(DISTINCT lt2.name) FROM learner_tag_assignments lta2 
           JOIN learner_tags lt2 ON lta2.tagId = lt2.id WHERE lta2.learnerId = u.id) as tags
        FROM users u
      `;
    }

    // Build WHERE clause
    const whereClauses: string[] = [];

    for (const filter of query.filters) {
      const clause = this.buildSQLCondition(filter, params);
      if (clause) whereClauses.push(clause);
    }

    if (whereClauses.length > 0) {
      const joiner = globalLogic === "OR" ? " OR " : " AND ";
      baseQuery += ` WHERE ${whereClauses.join(joiner)}`;
    }

    if (conditions.tagFilters.length > 0) {
      baseQuery += ` GROUP BY u.id, u.name, u.email, u.role, u.createdAt`;
    }

    // Sort
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    baseQuery += ` ORDER BY u.${sortBy} ${sortOrder}`;

    // Count query
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as subq`;

    // Paginated query
    baseQuery += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    try {
      const [countResult] = await db.execute(sql.raw(countQuery));
      const totalCount = (countResult as any[])?.[0]?.total || 0;

      const [rows] = await db.execute(sql.raw(baseQuery));
      const learners = (rows as any[]).map((row) => ({
        ...row,
        tags: row.tags ? row.tags.split(",") : [],
      }));

      return {
        learners,
        totalCount,
        appliedFilters: query.filters,
      };
    } catch (error: any) {
      log.error(`Segmentation query failed: ${error.message}`);
      // Fallback to simple query
      return this.simpleFallbackQuery(limit, offset);
    }
  }

  /**
   * Export learners to CSV format.
   */
  async exportCSV(learners: LearnerRecord[], fields?: string[]): Promise<string> {
    const exportFields = fields || ["id", "name", "email", "role", "tags", "createdAt"];

    // Header row
    const header = exportFields.join(",");

    // Data rows
    const rows = learners.map((learner) => {
      return exportFields
        .map((field) => {
          const value = learner[field];
          if (value === null || value === undefined) return "";
          if (Array.isArray(value)) return `"${value.join("; ")}"`;
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        })
        .join(",");
    });

    return [header, ...rows].join("\n");
  }

  /**
   * Export learners to Excel-compatible format (TSV with BOM for Excel auto-detection).
   */
  async exportExcel(learners: LearnerRecord[], fields?: string[]): Promise<Buffer> {
    const exportFields = fields || ["id", "name", "email", "role", "tags", "createdAt"];

    // BOM for UTF-8 Excel compatibility
    const BOM = "\uFEFF";

    // Header
    const header = exportFields.join("\t");

    // Data rows
    const rows = learners.map((learner) => {
      return exportFields
        .map((field) => {
          const value = learner[field];
          if (value === null || value === undefined) return "";
          if (Array.isArray(value)) return value.join("; ");
          return String(value).replace(/\t/g, " ").replace(/\n/g, " ");
        })
        .join("\t");
    });

    const content = BOM + [header, ...rows].join("\n");
    return Buffer.from(content, "utf-8");
  }

  /**
   * Export learners to JSON format.
   */
  async exportJSON(learners: LearnerRecord[], fields?: string[]): Promise<string> {
    if (fields) {
      const filtered = learners.map((l) => {
        const obj: any = {};
        for (const f of fields) {
          obj[f] = l[f];
        }
        return obj;
      });
      return JSON.stringify(filtered, null, 2);
    }
    return JSON.stringify(learners, null, 2);
  }

  /**
   * Save a segment definition for reuse.
   */
  async saveSegment(name: string, description: string, filterRules: FilterRule[]): Promise<{ id: number }> {
    const db = await getDb();

    // Count members
    const result = await this.segment({ filters: filterRules, limit: 1 });

    const insertResult = await db.insert(learnerSegments).values({
      name,
      description,
      filterRules: JSON.stringify(filterRules),
      memberCount: result.totalCount,
      isActive: true,
    });

    return { id: Number(insertResult[0].insertId) };
  }

  /**
   * Refresh a saved segment's member count.
   */
  async refreshSegment(segmentId: number): Promise<{ memberCount: number }> {
    const db = await getDb();
    const [segment] = await db.select().from(learnerSegments).where(eq(learnerSegments.id, segmentId)).limit(1);
    if (!segment) throw new Error("Segment not found");

    const filterRules: FilterRule[] = segment.filterRules ? JSON.parse(segment.filterRules) : [];
    const result = await this.segment({ filters: filterRules, limit: 1 });

    await db
      .update(learnerSegments)
      .set({ memberCount: result.totalCount })
      .where(eq(learnerSegments.id, segmentId));

    return { memberCount: result.totalCount };
  }

  // ═══ Private Helpers ═══

  private buildConditions(filters: FilterRule[]): { tagFilters: FilterRule[]; fieldFilters: FilterRule[] } {
    const tagFilters = filters.filter((f) => f.operator === "has_tag" || f.operator === "not_has_tag");
    const fieldFilters = filters.filter((f) => f.operator !== "has_tag" && f.operator !== "not_has_tag");
    return { tagFilters, fieldFilters };
  }

  private buildSQLCondition(filter: FilterRule, params: any[]): string | null {
    const { field, operator, value } = filter;

    switch (operator) {
      case "equals":
        params.push(value);
        return `u.${field} = ?`;
      case "not_equals":
        params.push(value);
        return `u.${field} != ?`;
      case "contains":
        params.push(`%${value}%`);
        return `u.${field} LIKE ?`;
      case "starts_with":
        params.push(`${value}%`);
        return `u.${field} LIKE ?`;
      case "greater_than":
        params.push(value);
        return `u.${field} > ?`;
      case "less_than":
        params.push(value);
        return `u.${field} < ?`;
      case "has_tag":
        params.push(value);
        return `lt.name = ?`;
      case "not_has_tag":
        params.push(value);
        return `u.id NOT IN (SELECT lta3.learnerId FROM learner_tag_assignments lta3 JOIN learner_tags lt3 ON lta3.tagId = lt3.id WHERE lt3.name = ?)`;
      case "is_empty":
        return `(u.${field} IS NULL OR u.${field} = '')`;
      case "is_not_empty":
        return `(u.${field} IS NOT NULL AND u.${field} != '')`;
      case "between":
        if (Array.isArray(value) && value.length === 2) {
          params.push(value[0], value[1]);
          return `u.${field} BETWEEN ? AND ?`;
        }
        return null;
      case "in":
        if (Array.isArray(value)) {
          const placeholders = value.map(() => "?").join(",");
          params.push(...value);
          return `u.${field} IN (${placeholders})`;
        }
        return null;
      default:
        return null;
    }
  }

  private async simpleFallbackQuery(limit: number, offset: number): Promise<SegmentResult> {
    const db = await getDb();
    try {
      const [rows] = await db.execute(
        sql`SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`
      );
      return {
        learners: (rows as any[]).map((r) => ({ ...r, tags: [] })),
        totalCount: 0,
        appliedFilters: [],
      };
    } catch {
      return { learners: [], totalCount: 0, appliedFilters: [] };
    }
  }
}

// Singleton
export const segmentationService = new SegmentationService();
