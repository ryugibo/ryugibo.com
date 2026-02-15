import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetNonNullable } from "type-fest";

export type Database = MergeDeep<
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
