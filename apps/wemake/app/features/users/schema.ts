import { anonRole, authenticatedRole, authUid, authUsers, sql } from "@ryugibo/db";
import {
  bigint,
  boolean,
  jsonb,
  pgPolicy,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { posts } from "~/features/community/schema.ts";
import { products } from "~/features/products/schema.ts";
import { ROLE_TYPES } from "./constants.ts";

export const roles = pg.enum("role", ROLE_TYPES.map((type) => type.value) as [string, ...string[]]);

export const profiles = pg.table(
  "profiles",
  {
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
  },
  (table) => [
    pgPolicy("profiles-update-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const follows = pg.table(
  "follows",
  {
    follower_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    following_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("follows-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.follower_id} OR ${authUid} = ${table.following_id}`,
    }),
    pgPolicy("follows-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.follower_id} OR ${authUid} = ${table.following_id}`,
    }),
    pgPolicy("follows-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const notificationTypes = pg.enum("notification_type", ["follow", "review", "reply"]);

export const notifications = pg.table(
  "notifications",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    target_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    source_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    product_id: bigint({ mode: "number" }).references(() => products.id, { onDelete: "cascade" }),
    post_id: bigint({ mode: "number" }).references(() => posts.id, { onDelete: "cascade" }),
    type: notificationTypes().notNull(),
    seen: boolean().default(false).notNull(),
    created_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("notifications-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("notifications-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const messageRooms = pg.table(
  "message_rooms",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    created_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("message_rooms-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("message_rooms-select-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const messageRoomMembers = pg.table(
  "message_room_members",
  {
    message_room_id: bigint({ mode: "number" }).references(() => messageRooms.id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.message_room_id, table.profile_id] }),
    pgPolicy("message_room_members-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("message_room_members-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("message_room_members-select-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const messages = pg.table(
  "messages",
  {
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
  },
  () => [
    pgPolicy("messages-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("messages-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
