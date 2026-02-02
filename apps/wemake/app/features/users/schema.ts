import { authUsers } from "@ryugibo/db";
import { bigint, boolean, jsonb, primaryKey, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { posts } from "~/features/community/schema.ts";
import { products } from "~/features/products/schema.ts";
import { ROLE_TYPES } from "./constants.ts";

export const roles = pg.enum("role", ROLE_TYPES.map((type) => type.value) as [string, ...string[]]);

export const profiles = pg.table("profiles", {
  id: uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  avatar: text(),
  name: text().notNull(),
  username: text().notNull().unique(),
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

export const follows = pg.table("follows", {
  follower_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  following_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
});

export const notificationTypes = pg.enum("notification_type", [
  "follow",
  "review",
  "reply",
  "mention",
]);

export const notifications = pg.table("notifications", {
  id: uuid().primaryKey(),
  target_id: uuid()
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  source_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  product_id: bigint({ mode: "number" }).references(() => products.id, { onDelete: "cascade" }),
  post_id: bigint({ mode: "number" }).references(() => posts.id, { onDelete: "cascade" }),
  type: notificationTypes().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRooms = pg.table("message_rooms", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRoomMembers = pg.table(
  "message_room_members",
  {
    message_room_id: bigint({ mode: "number" }).references(() => messageRooms.id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.message_room_id, table.profile_id] })],
);

export const messages = pg.table("messages", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  message_room_id: bigint({ mode: "number" })
    .notNull()
    .references(() => messageRooms.id, {
      onDelete: "cascade",
    }),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text().notNull(),
  seen: boolean().notNull().default(false),
  created_at: timestamp().notNull().defaultNow(),
});
