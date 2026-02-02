import { anonRole, authenticatedRole, authUid, sql } from "@ryugibo/db";
import {
  bigint,
  check,
  integer,
  jsonb,
  pgPolicy,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { profiles } from "~/features/users/schema.ts";

export const products = pg.table(
  "products",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    tagline: text().notNull(),
    description: text().notNull(),
    how_it_works: text().notNull(),
    icon: text().notNull(),
    url: text().notNull(),
    stats: jsonb().notNull().default({ views: 0, reviews: 0, upvotes: 0 }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    category_id: bigint({ mode: "number" }).references(() => categories.id, {
      onDelete: "set null",
    }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("products-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("products-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const categories = pg.table(
  "categories",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("categories-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

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
  (table) => [
    primaryKey({ columns: [table.product_id, table.profile_id] }),
    pgPolicy("product_upvotes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("product_upvotes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("product_upvotes-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
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
  (table) => [
    check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`),
    pgPolicy("reviews-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("reviews-update-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("reviews-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("reviews-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
