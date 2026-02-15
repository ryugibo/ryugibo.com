import { anonRole, authenticatedRole, serviceRole, sql } from "@ryugibo/db";
import { bigint, pgPolicy, text, timestamp } from "@ryugibo/db/core";
import { pg } from "db";

export const books = pg.table(
  "books",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    isbn: text().notNull().unique(),
    title: text().notNull(),
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
