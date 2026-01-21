import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url().min(1, "DATABASE_URL is required"),
  DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
  DATABASE_SCHEMA: z.string().default("wemake"),
});

export const env = envSchema.parse(process.env);
