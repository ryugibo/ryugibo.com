import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const claimIdea = async ({
  supabase,
  id,
  claimed_by,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
  claimed_by: string;
}) => {
  const { data, error } = await supabase
    .from("ideas")
    .update({ claimed_by, claimed_at: new Date().toISOString() })
    .eq("id", id)
    .is("claimed_at", null);

  if (error) {
    throw error;
  }

  return data;
};
