import { defineConfig } from "drizzle-kit";
import { env } from "~/env.ts";

export default defineConfig({
  schema: "./app/features/**/schema.ts",
  out: "./app/sql/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  schemaFilter: [__APP_NAME__],
});
