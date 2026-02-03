import { anonRole, authenticatedRole, authUid, sql } from "@ryugibo/db";
import {
  type AnyPgColumn,
  bigint,
  pgPolicy,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { profiles } from "~/features/users/schema.ts";

export const topics = pg.table(
  "topics",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    slug: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
  },
  () => [
    pgPolicy("topics-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("topics-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const posts = pg.table(
  "posts",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    content: text().notNull(),
    upvotes: bigint({ mode: "number" }).notNull().default(0),
    topic_id: bigint({ mode: "number" })
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("posts-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("posts-update-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("posts-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("posts-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const postUpvotes = pg.table(
  "post_upvotes",
  {
    post_id: bigint({ mode: "number" })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.post_id, table.profile_id] }),
    pgPolicy("post_upvotes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("post_upvotes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("post_upvotes-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);

export const postReplies = pg.table(
  "post_replies",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    content: text().notNull(),
    post_id: bigint({ mode: "number" }).references(() => posts.id, { onDelete: "cascade" }),
    parent_id: bigint({ mode: "number" }).references((): AnyPgColumn => postReplies.id, {
      onDelete: "cascade",
    }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("post_replies-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("post_replies-update-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("post_replies-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("post_replies-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
