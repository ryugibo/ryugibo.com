import { pgSchema } from "@ryugibo/db/core";
import { drizzle } from "@ryugibo/db/driver";
import postgres from "@ryugibo/db/postgres";

export const authSchema = pgSchema("auth");
export const schema = pgSchema("wemake");

const client = postgres(process.env.DATABASE_URL || "", { prepare: false });
const db = drizzle(client);
export default db;
