import { createClient } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetFieldType, SetNonNullable } from "type-fest";
import { env } from "./env.ts";

type Database = MergeDeep<
  SupabaseDatabase,
  {
    wemake: {
      Views: {
        community_post_list_view: {
          Row: SetFieldType<
            SetNonNullable<SupabaseDatabase["wemake"]["Views"]["community_post_list_view"]["Row"]>,
            "author_avatar",
            string | null
          >;
        };
        ideas_view: {
          Row: SetNonNullable<SupabaseDatabase["wemake"]["Views"]["ideas_view"]["Row"]>;
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
      schema: __APP_NAME__,
    },
  },
);

export default supabase;
