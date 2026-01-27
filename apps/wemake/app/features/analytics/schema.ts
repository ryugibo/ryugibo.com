import { jsonb, timestamp, uuid } from "@ryugibo/db/core";
import { pg } from "~/db.ts";

export const eventType = pg.enum("event_type", ["product_view", "product_visit", "profile_view"]);

export const events = pg.table("events", {
  id: uuid().primaryKey().defaultRandom(),
  event_type: eventType().notNull(),
  event_data: jsonb(),
  created_at: timestamp().notNull().defaultNow(),
});
