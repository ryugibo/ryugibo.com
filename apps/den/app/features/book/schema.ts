import { anonRole, authenticatedRole, serviceRole, sql } from "@ryugibo/db";
import { bigint, integer, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "db";

export const series = pg.table(
  "series",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("series-select-policy", {
      for: "select",
      as: "permissive",
      to: [anonRole, authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("series-insert-policy", {
      for: "insert",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      withCheck: sql`true`,
    }),
    pgPolicy("series-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("series-delete-policy", {
      for: "delete",
      as: "permissive",
      to: serviceRole,
      using: sql`true`,
    }),
  ],
);

export const works = pg.table(
  "works",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    author: text(),
    series_id: uuid().references(() => series.id, { onDelete: "set null" }),
    series_order: integer(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("works-select-policy", {
      for: "select",
      as: "permissive",
      to: [anonRole, authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("works-insert-policy", {
      for: "insert",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      withCheck: sql`true`,
    }),
    pgPolicy("works-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("works-delete-policy", {
      for: "delete",
      as: "permissive",
      to: serviceRole,
      using: sql`true`,
    }),
  ],
);

export const books = pg.table(
  "books",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    isbn: text().notNull().unique(),
    title: text().notNull(),
    work_id: uuid().references(() => works.id, { onDelete: "set null" }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("books-select-policy", {
      for: "select",
      as: "permissive",
      to: [anonRole, authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("profile_books-insert-policy", {
      for: "insert",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      withCheck: sql`true`,
    }),
    pgPolicy("profile_books-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("profile_books-delete-policy", {
      for: "delete",
      as: "permissive",
      to: serviceRole,
      using: sql`true`,
    }),
  ],
);
