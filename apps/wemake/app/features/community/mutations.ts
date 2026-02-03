import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const createPost = async ({
  supabase,
  profile_id,
  title,
  topic_id,
  content,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  title: string;
  topic_id: number;
  content: string;
}) => {
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

export const createReply = async ({
  supabase,
  profile_id,
  post_id,
  parent_id,
  content,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  post_id: number | undefined;
  parent_id: number | undefined;
  content: string;
}) => {
  const { error } = await supabase.from("post_replies").insert({
    profile_id,
    post_id,
    parent_id,
    content,
  });

  if (error) {
    throw error;
  }
};

export const toggleUpvote = async ({
  supabase,
  profile_id,
  post_id,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  post_id: number;
}) => {
  const { error } = await supabase.rpc("toggle_post_upvote", {
    post_id,
    profile_id,
  });

  if (error) {
    throw error;
  }
};
