import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url().min(1, "DATABASE_URL is required"),
  DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
  DATABASE_SCHEMA: z.string().default("wemake"),
  VITE_SUPABASE_URL: z.url().min(1, "VITE_SUPABASE_URL is required"),
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z
    .string()
    .min(1, "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY is required"),
});

export const env = envSchema.parse(process.env);
