import { int, mysqlTable, varchar, text, timestamp, boolean, json, mysqlEnum, index } from "drizzle-orm/mysql-core";
import { users } from "./schema";

// ============================================================================
// LANDING PAGES (Phase 8.1)
// ============================================================================
export const landingPages = mysqlTable("landing_pages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  titleFr: varchar("title_fr", { length: 200 }),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  sections: json("sections").$type<LandingPageSection[]>().notNull(),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaTitleFr: varchar("meta_title_fr", { length: 200 }),
  metaDescription: text("meta_description"),
  metaDescriptionFr: text("meta_description_fr"),
  ogImage: text("og_image"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdBy: int("created_by").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  index("idx_lp_slug").on(table.slug),
  index("idx_lp_status").on(table.status),
]));

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

// Section types for the landing page builder
export interface LandingPageSection {
  id: string;
  type: "hero" | "features" | "pricing" | "testimonials" | "cta" | "faq" | "text";
  order: number;
  content: Record<string, any>;
}
