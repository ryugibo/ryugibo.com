import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const createProfile = async ({
  supabase,
  id,
  username,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  username: string;
}) => {
  return await supabase.from("profiles").insert({
    id,
    username,
  });
};
