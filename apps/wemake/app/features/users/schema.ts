import { jsonb, pgSchema, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "~/db";

const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

export const roles = schema.enum("role", [
  "developer",
  "designer",
  "marketer",
  "founder",
  "product-manager",
]);

export const profiles = schema.table("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  avatar: text(),
  name: text().notNull(),
  username: text().notNull(),
  headline: text(),
  bio: text(),
  role: roles().default("developer").notNull(),
  stats: jsonb()
    .$type<{ followers: number; followings: number }>()
    .default({ followers: 0, followings: 0 }),
  views: jsonb(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const follows = schema.table("follows", {
  follower_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  following_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
});
