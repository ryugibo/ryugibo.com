import { createClient } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetNonNullable } from "type-fest";

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
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    db: {
      schema: __APP_NAME__,
    },
  },
);

export default supabase;
