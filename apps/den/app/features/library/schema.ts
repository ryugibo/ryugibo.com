import { bigint, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "db";
import { BOOK_SOURCES } from "~/features/library/constant";
import { profiles } from "~/features/profile/schema";

export const books = schema.table("books", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  isbn: text(),
  title: text().notNull(),
  author: text().notNull(),
  cover: text(),
  description: text(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const bookSources = schema.enum(
  "book_sources",
  BOOK_SOURCES.map((source) => source.value) as [string, ...string[]],
);

export const profileBooks = schema.table("profile_books", {
  profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  book_id: bigint({ mode: "number" }).references(() => books.id, { onDelete: "cascade" }),
  source: bookSources().notNull(),
  source_etc: text(),
  comment: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
