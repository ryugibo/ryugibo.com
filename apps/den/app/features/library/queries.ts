import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

import type { ReadState } from "./constant.ts";

export const getLibrary = async (
  supabase: SupabaseClient<Database>,
  {
    keyword,
    read_state,
  }: {
    keyword?: string;
    read_state?: ReadState;
  },
) => {
  const query = supabase.from("profile_books_list_view").select("*");

  if (keyword) {
    query.ilike("title", `%${keyword}%`);
  }

  if (read_state) {
    query.eq("read_state", read_state);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data;
};
