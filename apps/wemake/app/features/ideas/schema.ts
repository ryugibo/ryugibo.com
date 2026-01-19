import { bigint, integer, primaryKey, text, timestamp, uuid } from "@ryugibo/db/core";
import { schema } from "~/db";
import { profiles } from "~/features/users/schema";

export const ideas = schema.table("ideas", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  idea: text().notNull(),
  views: integer().notNull().default(0),
  claimed_at: timestamp(),
  claimed_by: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
});

export const ideaLikes = schema.table(
  "idea_likes",
  {
    idea_id: bigint({ mode: "number" })
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.idea_id, table.profile_id] })],
);
