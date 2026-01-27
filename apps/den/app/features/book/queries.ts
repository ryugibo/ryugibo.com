import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const getBook = async (supabase: SupabaseClient<Database>, { id }: { id: number }) => {
  const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return data;
};
