import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const getIdeas = async (
  supabase: SupabaseClient<Database>,
  { limit }: { limit: number },
) => {
  const { data, error } = await supabase.from("ideas_view").select("*").limit(limit);

  if (error) {
    throw error;
  }

  return data;
};

export const getIdea = async (supabase: SupabaseClient<Database>, { id }: { id: number }) => {
  const { data, error } = await supabase.from("ideas_view").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return data;
};
