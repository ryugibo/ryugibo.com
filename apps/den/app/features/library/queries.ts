import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";
import type { BookSource } from "./constant.ts";

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
  const query = supabase.from("profile_books_list_view").select("*");

  if (keyword) {
    query.ilike("title", `%${keyword}%`);
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
