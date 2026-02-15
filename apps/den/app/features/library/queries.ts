import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";
import type { BookSource } from "./constant.ts";

export const getBookCount = async ({
  supabase,
  profile_id,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
}) => {
  console.log("getBookCount profile_id:", profile_id);
  const { count, error } = await supabase
    .from("profile_books")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profile_id);

  if (error) {
    console.error("getBookCount error details:", JSON.stringify(error, null, 2));
    throw error;
  }
  return { count };
};
export const getLibrary = async (
  supabase: SupabaseClient<Database>,
  {
    keyword,
    source,
  }: {
    keyword?: string;
    source?: BookSource;
  },
) => {
  const query = supabase.from("profile_books").select(`
    source,
    created_at,
    books!inner (
      isbn,
      title
    )
  `);

  if (keyword) {
    query.ilike("books.title", `%${keyword}%`);
  }

  if (source) {
    query.eq("source", source);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data;
};
