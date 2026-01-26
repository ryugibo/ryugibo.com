import supabase from "~/supabase-client";

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
