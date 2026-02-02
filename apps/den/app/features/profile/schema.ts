import { authUsers } from "@ryugibo/db";
import { text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "db";

export const profiles = pg.table("profiles", {
  id: uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  name: text().notNull(),
  username: text().notNull(),
  avatar: text(),
  bio: text(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
