import { defineConfig } from "drizzle-kit";
import { env } from "~/env.ts";
import pkg from "./package.json";

// Polyfill for drizzle-kit execution context
Reflect.set(globalThis, "__APP_NAME__", pkg.name);

export default defineConfig({
  schema: "./app/features/**/schema.ts",
  out: "./app/sql/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  schemaFilter: [__APP_NAME__],
});
