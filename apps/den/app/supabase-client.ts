import { createClient } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetNonNullable } from "type-fest";
import { env } from "./env.ts";

type Database = MergeDeep<
  SupabaseDatabase,
  {
    den: {
      Views: {
        profile_books_list_view: {
          Row: SetNonNullable<SupabaseDatabase["den"]["Views"]["profile_books_list_view"]["Row"]>;
        };
      };
    };
  }
>;

const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    db: {
      schema: env.DATABASE_SCHEMA,
    },
  },
);

export default supabase;
