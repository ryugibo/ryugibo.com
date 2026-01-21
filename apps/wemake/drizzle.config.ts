import { defineConfig } from "drizzle-kit";
import { env } from "~/env";

export default defineConfig({
  schema: "./app/features/**/schema.ts",
  out: "./app/sql/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  schemaFilter: [env.DATABASE_SCHEMA],
});
