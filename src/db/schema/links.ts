import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const links = sqliteTable(
  "links",
  {
    id: text("id").notNull().primaryKey(),
    created_at: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    slug: text("slug").notNull(),
    redirectUrl: text("redirect_url").notNull(),
    visits: integer("visits").default(0).notNull(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_idx").on(table.slug),
    };
  }
);
