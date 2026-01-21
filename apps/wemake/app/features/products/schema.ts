import { sql } from "@ryugibo/db";
import { bigint, check, integer, jsonb, primaryKey, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "~/db";
import { profiles } from "~/features/users/schema";

export const products = pg.table("products", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  tagline: text().notNull(),
  description: text().notNull(),
  how_it_works: text().notNull(),
  icon: text().notNull(),
  url: text().notNull(),
  stats: jsonb().notNull().default({ views: 0, reviews: 0 }),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  category_id: bigint({ mode: "number" }).references(() => categories.id, { onDelete: "set null" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const categories = pg.table("categories", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const product_upvotes = pg.table(
  "product_upvotes",
  {
    product_id: bigint({ mode: "number" })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.product_id, table.profile_id] })],
);

export const reviews = pg.table(
  "reviews",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    product_id: bigint({ mode: "number" })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    comment: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)],
);
