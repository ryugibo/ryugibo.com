import { bigint, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "db";
import { books } from "~/features/book/schema";
import { BOOK_SOURCES, READ_STATE } from "~/features/library/constant";
import { profiles } from "~/features/profile/schema";

export const readState = schema.enum("read_state", READ_STATE);

export const bookSources = schema.enum(
  "book_sources",
  BOOK_SOURCES.map((source) => source.value) as [string, ...string[]],
);

export const profileBooks = schema.table("profile_books", {
  profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  book_id: bigint({ mode: "number" }).references(() => books.id, { onDelete: "cascade" }),
  source: bookSources().notNull(),
  source_etc: text(),
  read_state: readState().notNull().default("toread"),
  comment: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
