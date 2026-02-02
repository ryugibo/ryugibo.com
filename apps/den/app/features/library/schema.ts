import { authenticatedRole, authUid, sql } from "@ryugibo/db";
import { bigint, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "db";
import { books } from "~/features/book/schema.ts";
import { BOOK_SOURCES, READ_STATE } from "~/features/library/constant.ts";
import { profiles } from "~/features/profile/schema.ts";

export const readState = pg.enum("read_state", READ_STATE);

export const bookSources = pg.enum(
  "book_sources",
  BOOK_SOURCES.map((source) => source.value) as [string, ...string[]],
);

export const profileBooks = pg.table(
  "profile_books",
  {
    profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    book_id: bigint({ mode: "number" }).references(() => books.id, { onDelete: "cascade" }),
    source: bookSources().notNull(),
    source_etc: text(),
    read_state: readState().notNull().default("toread"),
    comment: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("profile_books-select-policy", {
      for: "select",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile_books-insert-policy", {
      for: "insert",
      as: "permissive",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile_books-update-policy", {
      for: "update",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile_books-delete-policy", {
      for: "delete",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
