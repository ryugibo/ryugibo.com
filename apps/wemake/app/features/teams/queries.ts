import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const getTeams = async (
  supabase: SupabaseClient<Database>,
  { limit }: { limit: number },
) => {
  const { data, error } = await supabase
    .from("teams")
    .select(`
    id,
    roles,
    product_description,
    team_leader:profiles(
      username,
      avatar
    )
    `)
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};

export const getTeamById = async (supabase: SupabaseClient<Database>, { id }: { id: number }) => {
  const { data, error } = await supabase
    .from("teams")
    .select(`
      *,
      team_leader:profiles!inner(
        name,
        avatar,
        role
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
