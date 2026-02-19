import { postgres } from "@ryugibo/db";
import { pgSchema } from "@ryugibo/db/core";
import { drizzle } from "@ryugibo/db/driver";

export const pg = pgSchema("den");

export const getDb = (connectionString: string) => {
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema: { pg } });
};
