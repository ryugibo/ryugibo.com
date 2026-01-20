import { postgres } from "@ryugibo/db";
import { pgSchema } from "@ryugibo/db/core";
import { drizzle } from "@ryugibo/db/driver";

export const schema = pgSchema("den");

const client = postgres(process.env.DATABASE_URL || "", { prepare: false });
const db = drizzle(client);
export default db;
