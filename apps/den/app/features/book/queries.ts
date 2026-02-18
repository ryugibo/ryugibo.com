import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const getWorksByIsbns = async ({
  supabase,
  isbns,
}: {
  supabase: SupabaseClient<Database>;
  isbns: string[];
}) => {
  if (isbns.length === 0) return [];
  const { data, error } = await supabase
    .from("books")
    .select(`
      isbn,
      work_id,
      works (
        id,
        title,
        series (
          id,
          title
        )
      )
    `)
    .in("isbn", isbns)
    .not("work_id", "is", null);

  if (error) throw error;
  return data;
};
