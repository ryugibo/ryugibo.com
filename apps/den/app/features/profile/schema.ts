import { authenticatedRole, authUid, authUsers, sql } from "@ryugibo/db";
import { boolean, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "db";

export const profiles = pg.table(
  "profiles",
  {
    id: uuid()
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text().default(sql`(auth.jwt() ->> 'email')`),
    username: text().notNull().unique(),
    public: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("profiles-select-policy", {
      for: "select",
      as: "permissive",
      to: authenticatedRole,
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
