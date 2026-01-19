import { type AnyPgColumn, bigint, primaryKey, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "~/db";
import { profiles } from "~/features/users/schema";

export const topics = schema.table("topics", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const posts = schema.table("posts", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
  topic_id: bigint({ mode: "number" })
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  profile_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const postUpvotes = schema.table(
  "post_upvotes",
  {
    post_id: bigint({ mode: "number" })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.post_id, table.profile_id] })],
);

export const postReplies = schema.table("post_replies", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  content: text().notNull(),
  post_id: bigint({ mode: "number" })
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  parent_id: bigint({ mode: "number" }).references((): AnyPgColumn => postReplies.id, {
    onDelete: "cascade",
  }),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
