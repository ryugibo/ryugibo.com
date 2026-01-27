import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const isExistsUsername = async (
  supabase: SupabaseClient<Database>,
  { username }: { username: string },
) => {
  const { error } = await supabase.from("profiles").select("id").eq("username", username).single();

  if (error) {
    return false;
  }
  return true;
};
