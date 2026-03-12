/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type Profile = typeof import("./db/schema").profiles.$inferSelect;

interface Database {
  snipt: Record<string, unknown>;
}

declare namespace App {
  interface Locals extends Runtime {
    user: import("@supabase/supabase-js").User | null;
    supabase: import("@supabase/supabase-js").SupabaseClient<Database, "snipt">;
    profile: Profile | null;
  }
}

interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}
