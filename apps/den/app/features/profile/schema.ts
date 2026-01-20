import { pgSchema, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "db";

const users = pgSchema("auth").table("users", { id: uuid().primaryKey() });

export const profiles = schema.table("profile", {
  id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  username: text().notNull(),
  avatar: text(),
  bio: text(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
