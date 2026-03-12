import { env } from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL || "" },
  schemaFilter: ["snipt"],
  migrations: {
    table: "__snipt_migrations",
  },
});
