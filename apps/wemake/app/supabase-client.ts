import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
  db: {
    schema: env.DATABASE_SCHEMA,
  },
});

export default supabase;
