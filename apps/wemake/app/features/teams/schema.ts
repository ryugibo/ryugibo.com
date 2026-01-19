import { sql } from "@ryugibo/db";
import { bigint, check, integer, text, timestamp } from "@ryugibo/db/core";
import { schema } from "~/db";
import { PRODUCT_STAGE } from "./constant";

export const productStages = schema.enum(
  "product_stage",
  PRODUCT_STAGE.map((stage) => stage.value) as [string, ...string[]],
);

export const teams = schema.table(
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
  },
  (table) => [
    check("team_size_check", sql`${table.team_size} BETWEEN 1 AND 100`),
    check("equilty_split_check", sql`${table.equity_split} BETWEEN 1 AND 100`),
    check("product_description_check", sql`LENGTH(${table.product_description}) <= 200`),
  ],
);
