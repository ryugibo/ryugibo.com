import supabase from "~/supabase-client.ts";

export const getTeams = async ({ limit }: { limit: number }) => {
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

export const getTeamById = async ({ id }: { id: number }) => {
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
