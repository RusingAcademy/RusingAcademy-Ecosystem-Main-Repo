import { int, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

export const themePresets = mysqlTable("theme_presets", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  isDefault: boolean("isDefault").default(false),
  isActive: boolean("isActive").default(false),
  tokens: json("tokens").notNull(), // { primaryColor, secondaryColor, fontFamily, borderRadius, ... }
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemePreset = typeof themePresets.$inferSelect;
export type InsertThemePreset = typeof themePresets.$inferInsert;
