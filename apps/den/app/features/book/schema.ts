import { anonRole, authenticatedRole, authUid, authUsers, serviceRole, sql } from "@ryugibo/db";
import { bigint, integer, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "db";
import { profiles } from "../profile/schema.ts";

// Helper to check for admin role
const isAdmin = sql`exists (select 1 from ${profiles} where ${profiles.id} = ${authUid} and ${profiles.role} = 'admin')`;

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
      withCheck: isAdmin,
    }),
    pgPolicy("series-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: isAdmin,
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
      withCheck: isAdmin,
    }),
    pgPolicy("works-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: isAdmin,
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
    edition_info: text(), // e.g. "20th Anniversary Edition"
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
    pgPolicy("books-insert-policy", {
      for: "insert",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      withCheck: sql`true`, // Books are usually inserted via sync, allow auth for now or keep true
    }),
    pgPolicy("books-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: isAdmin, // Only admins should update book metadata like edition_info
    }),
    pgPolicy("books-delete-policy", {
      for: "delete",
      as: "permissive",
      to: serviceRole,
      using: sql`true`,
    }),
  ],
);

export const bookGroupingRequests = pg.table(
  "book_grouping_requests",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().references(() => authUsers.id, { onDelete: "set null" }),
    book_isbn: text().notNull(),
    request_type: text({ enum: ["series", "edition", "other"] }).notNull(),
    message: text(),
    status: text({ enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("book_grouping_requests-select-policy", {
      for: "select",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: sql`true`,
    }),
    pgPolicy("book_grouping_requests-insert-policy", {
      for: "insert",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      withCheck: sql`true`, // Allow users to create requests
    }),
    pgPolicy("book_grouping_requests-update-policy", {
      for: "update",
      as: "permissive",
      to: [authenticatedRole, serviceRole],
      using: isAdmin, // Only admins can update status
    }),
  ],
);
