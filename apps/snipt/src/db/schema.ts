import { anonRole, authenticatedRole, authUid, authUsers, sql } from "@ryugibo/db";
import { boolean, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "../lib/db.server.ts";

export const users = pg.table("users", {
  id: uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  theme: text({ enum: ["light", "dark", "system"] })
    .notNull()
    .default("system"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const profiles = pg.table(
  "profiles",
  {
    id: uuid()
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    username: text().notNull().unique(),
    public: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("profiles-select-policy", {
      for: "select",
      as: "permissive",
      to: [anonRole, authenticatedRole],
      using: sql`${table.public} OR ${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles-insert-policy", {
      for: "insert",
      as: "permissive",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles-update-policy", {
      for: "update",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles-delete-policy", {
      for: "delete",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
    }),
  ],
);

export const snippets = pg.table(
  "snippets",
  {
    id: uuid().primaryKey().defaultRandom(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    content: text().notNull(), // Limits enforce at UI mainly, but maybe varchar(500) makes more DB sense if strict? Going with text for flexibility, 500 checked structurally.
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("snippets-select-policy", {
      for: "select",
      as: "permissive",
      to: [anonRole, authenticatedRole],
      // For now, only owner can select their own until we add a mechanism to find public profiles. Or join with profiles.
      // Wait, let's just make it public if the profile is public. We need a way, but Drizzle policy here requires a subquery or joined view.
      // Easiest is to allow select for all authenticated if public profile, but let's do a subquery:
      using: sql`${authUid} = ${table.profile_id} OR EXISTS (SELECT 1 FROM snipt.profiles WHERE id = ${table.profile_id} AND public = true)`,
    }),
    pgPolicy("snippets-insert-policy", {
      for: "insert",
      as: "permissive",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("snippets-update-policy", {
      for: "update",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("snippets-delete-policy", {
      for: "delete",
      as: "permissive",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
