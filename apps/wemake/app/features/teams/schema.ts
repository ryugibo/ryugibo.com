import { anonRole, authenticatedRole, authUid, sql } from "@ryugibo/db";
import { bigint, check, integer, pgPolicy, text, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "~/db.ts";
import { PRODUCT_STAGE } from "~/features/teams/constants.ts";
import { profiles } from "~/features/users/schema.ts";

export const productStages = pg.enum(
  "product_stage",
  PRODUCT_STAGE.map((stage) => stage.value) as [string, ...string[]],
);

export const teams = pg.table(
  "teams",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    team_size: integer().notNull(),
    equity_split: integer().notNull(),
    roles: text().notNull(),
    product_name: text().notNull(),
    product_stage: productStages().notNull(),
    product_description: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    team_leader_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (table) => [
    check("team_size_check", sql`${table.team_size} BETWEEN 1 AND 100`),
    check("equilty_split_check", sql`${table.equity_split} BETWEEN 1 AND 100`),
    check("product_description_check", sql`LENGTH(${table.product_description}) <= 200`),
    pgPolicy("teams-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.team_leader_id}`,
    }),
    pgPolicy("teams-select-policy", {
      for: "select",
      to: [anonRole, authenticatedRole],
      as: "permissive",
    }),
  ],
);
