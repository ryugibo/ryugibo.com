import { postgres } from "@ryugibo/db";
import { pgSchema } from "@ryugibo/db/core";
import { drizzle } from "@ryugibo/db/driver";
import { env } from "./env.ts";

export const pg = pgSchema(__APP_NAME__);

const client = postgres(env.DATABASE_URL, { prepare: false });
const db = drizzle(client);
export default db;
