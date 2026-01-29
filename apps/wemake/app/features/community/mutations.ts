import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const createPost = async (
  supabase: SupabaseClient<Database>,
  {
    profile_id,
    title,
    topic_id,
    content,
  }: { profile_id: string; title: string; topic_id: number; content: string },
) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      profile_id,
      title,
      topic_id,
      content,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
