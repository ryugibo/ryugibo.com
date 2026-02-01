import type { SupabaseClient } from "@supabase/supabase-js";
import type z from "zod";
import type { Database } from "~/supabase-client.ts";
import type { formSchema } from "./pages/team-submit-page.tsx";

export const createTeam = async ({
  supabase,
  data,
  team_leader_id,
}: {
  supabase: SupabaseClient<Database>;
  data: z.infer<typeof formSchema>;
  team_leader_id: string;
}) => {
  const { data: team, error } = await supabase
    .from("teams")
    .insert({ ...data, team_leader_id })
    .select(`id`)
    .single();

  if (error) {
    throw error;
  }

  return team;
};
