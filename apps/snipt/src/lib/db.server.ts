import { postgres } from "@ryugibo/db";
import { pgSchema } from "@ryugibo/db/core";
import { drizzle } from "@ryugibo/db/driver";

export const pg = pgSchema("snipt");

export const getDb = (env: Record<string, string>) => {
  const sql = postgres(env.DATABASE_URL, { prepare: false });
  return drizzle(sql, { schema: { pg } });
};
