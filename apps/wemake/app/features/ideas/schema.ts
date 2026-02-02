import { anonRole, authenticatedRole, authUid, sql } from "@ryugibo/db";
import { bigint, integer, pgPolicy, primaryKey, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { profiles } from "~/features/users/schema.ts";

export const ideas = pg.table(
  "ideas",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    idea: text().notNull(),
    views: integer().notNull().default(0),
    claimed_at: timestamp(),
    claimed_by: uuid().references(() => profiles.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("ideas-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`true`,
    }),
    pgPolicy("ideas-select-anon-policy", {
      for: "select",
      to: anonRole,
      as: "permissive",
      using: sql`${table.claimed_by} IS NULL`,
    }),
    pgPolicy("ideas-select-auth-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${table.claimed_by} IS NULL OR ${table.claimed_by} = ${authUid}`,
    }),
  ],
);

export const ideaLikes = pg.table(
  "idea_likes",
  {
    idea_id: bigint({ mode: "number" })
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.idea_id, table.profile_id] }),
    pgPolicy("idea_likes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("idea_likes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("idea_likes-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
      using: sql`true`,
    }),
  ],
);
