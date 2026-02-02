import { bigint, text, timestamp } from "@ryugibo/db/core";
import { pg } from "db";

export const books = pg.table("books", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  isbn: text(),
  title: text().notNull(),
  author: text().notNull(),
  cover: text(),
  description: text(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
