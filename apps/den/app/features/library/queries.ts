import supabase from "~/supabase-client";
import type { ReadState } from "./constant";

export const getLibrary = async ({
  keyword,
  read_state,
}: {
  keyword?: string;
  read_state?: ReadState;
}) => {
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
