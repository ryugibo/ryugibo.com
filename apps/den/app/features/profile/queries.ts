import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const getProfileById = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
}) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (error) return null;
  return data;
};

export const getProfileByUsername = async ({
  supabase,
  username,
}: {
  supabase: SupabaseClient<Database>;
  username: string;
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return null;
  }
  return data;
};
